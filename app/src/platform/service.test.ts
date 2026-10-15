import {describe,it,expect} from 'vitest';
import {EkasClient} from './client';
import {MockRepository} from './mockRepository';
import {MockService,type QueryPort} from './mockService';
import type {Query,Session} from './contract';
const session:Session={id:'reviewer',role:'engineer',allowedAssetIds:['A'],presentationOnly:true};
const q:Query={fixtureVersion:'ekas-platform-synthetic-v2',metricIds:['oee'],definitionVersions:{oee:1},scope:{assetIds:['A']},from:'2026-10-06T00:00:00Z',to:'2026-10-06T23:59:59Z',asOf:'2026-10-06T23:59:59Z',groupBy:[],filters:[],page:{offset:0,limit:100}};
const port:QueryPort=async query=>({query,fixtureVersion:query.fixtureVersion,definitionVersions:query.definitionVersions,rows:[],total:0,returned:0,offset:query.page.offset,limit:query.page.limit,truncated:false,synthetic:true,financiallyValidated:false});
const setup=(repository=new MockRepository())=>new EkasClient(new MockService(repository,port,()=>q.asOf),session);
describe('executable versioned client/mock boundary',()=>{
 it('persists idempotent create, exact object identity and optimistic version conflicts',async()=>{
  let stored:string|null=null;const repository=new MockRepository({read:()=>stored,write:x=>{stored=x}}),client=setup(repository);
  const first=await client.request<any>('POST','/api/v1/resources/board',{content:{name:'Line A board',tabs:['Loss']}},'create-1');
  const replay=await client.request<any>('POST','/api/v1/resources/board',{content:{name:'Line A board',tabs:['Loss']}},'create-1');expect(first.status).toBe(201);expect(replay.data.id).toBe(first.data.id);expect(repository.state.resources).toHaveLength(1);
  expect((await client.request('POST','/api/v1/resources/board',{content:{name:'Different'}},'create-1')).error?.code).toBe('IDEMPOTENCY_CONFLICT');
  const update=await client.request<any>('PATCH','/api/v1/resources/board/'+first.data.id,{expectedVersion:1,content:{name:'Line A board',description:'Version-bound note'}});expect(update.data.version).toBe(2);
  expect((await client.request('PATCH','/api/v1/resources/board/'+first.data.id,{expectedVersion:1,content:{}})).error?.code).toBe('CONFLICT');
  expect((await client.request('GET','/api/v1/resources/board/nonexistent')).status).toBe(404);
  expect(new MockRepository({read:()=>stored,write:()=>{}}).state.resources[0].content.description).toBe('Version-bound note');
  expect(first.data.notDispatched).toBe(true);expect(first.data.notGranted).toBe(true);expect(client.traces).toHaveLength(6);
 });
 it('intersects simulated scope before calculation and records exact query/result client evidence',async()=>{
  const client=setup();expect((await client.request('POST','/api/v1/query',{...q,scope:{assetIds:['B']}})).error?.code).toBe('FORBIDDEN');
  expect((await client.request('POST','/api/v1/query',{...q,scope:{assetIds:[]}})).error?.code).toBe('INVALID_REQUEST');
  const response=await client.request<any>('POST','/api/v1/query',q);expect(response.data.query).toEqual(q);expect(response.data.total).toBe(0);expect(response.data.truncated).toBe(false);
  const saved=await client.request<any>('GET','/api/v1/results/'+response.data.id);expect(saved.data).toEqual(response.data);expect(client.traces[2].request.body).toEqual(q);
  expect((await client.request('POST','/api/v1/query',{...q,page:{offset:0,limit:1000}})).error?.code).toBe('INVALID_REQUEST');
 });
 it('keeps state atomic on failed persistence and exposes recovery/error instead of silent success',async()=>{
  const repository=new MockRepository({read:()=>'{invalid',write:()=>{throw new Error('storage unavailable')}}),client=setup(repository);expect(repository.recovery).toBe('corrupt');
  const response=await client.request('POST','/api/v1/resources/board',{content:{name:'Unsaved'}},'one');expect(response.status).toBe(503);expect(repository.state.resources).toEqual([]);
  const bad=new MockRepository({read:()=>JSON.stringify({schemaVersion:99}),write:()=>{}});expect(bad.recovery).toBe('corrupt');
 });
 it('reports timeout and read-only refusal without fake dispatch',async()=>{
  const client=new EkasClient(new MockService(new MockRepository(),async()=>{throw new Error('TIMEOUT')}),session);expect((await client.request('POST','/api/v1/query',q)).error?.code).toBe('TIMEOUT');
  const viewer=new EkasClient(new MockService(new MockRepository(),port),{...session,role:'viewer'});expect((await viewer.request('POST','/api/v1/resources/authorization',{content:{performed:true}},'unsafe')).error?.code).toBe('FORBIDDEN');
 });
});
