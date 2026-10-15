import {describe,it,expect} from 'vitest';
import {API_VERSION,type Query,type Request,type Resource} from './contract';
import {MockRepository,emptyRepository,validateRepository} from './mockRepository';
import {MockService} from './mockService';
import {validatePilotTurn} from './pilotAdapter';
const q:Query={fixtureVersion:'ekas-platform-synthetic-v2',metricIds:['oee'],definitionVersions:{oee:1},scope:{assetIds:['A']},from:'2026-10-06T09:00:00Z',to:'2026-10-06T11:00:00Z',asOf:'2026-10-06T14:45:00Z',groupBy:[],filters:[],page:{offset:0,limit:100}};
const request=(body:unknown):Request=>({apiVersion:API_VERSION,requestId:'r',method:'POST',path:'/api/v1/query',body,session:{id:'s',role:'engineer',allowedAssetIds:['A'],presentationOnly:true}});
const resource:Resource={id:'board-1',kind:'board',version:1,content:{},createdAt:q.asOf,updatedAt:q.asOf,synthetic:true,notDispatched:true,notGranted:true,ownerSessionId:'s',assetIds:['A']} as Resource;
describe('independent frozen-checkpoint repros',()=>{
 it('rejects reversed actual instants and malformed DTOs before invoking calculation',async()=>{
  let called=0;const service=new MockService(new MockRepository(),async query=>{called++;return {query,fixtureVersion:query.fixtureVersion,definitionVersions:query.definitionVersions,rows:[],total:0,returned:0,offset:0,limit:100,truncated:false,synthetic:true,financiallyValidated:false}});
  for(const body of [{...q,from:'2026-10-06T10:00:00+00:00',to:'2026-10-06T11:00:00+02:00'},{...q,metricIds:[42]},{...q,definitionVersions:{}},{...q,groupBy:[7]},{...q,filters:[{field:'assetId',operator:'unknown',values:42}]}])expect((await service.send(request(body))).error?.code).toBe('INVALID_REQUEST');
  expect(called).toBe(0);
 });
 it('rejects malformed saved results and allocation collisions; preserves raw corrupt recovery data',()=>{
  expect(validateRepository({...emptyRepository(),results:[{id:'result-1'}]})).toBe(false);
  expect(validateRepository({...emptyRepository(),resources:[resource]})).toBe(false);
  const raw=JSON.stringify({...emptyRepository(),sequence:1,results:[{id:'result-1'}]});const repository=new MockRepository({read:()=>raw,write:()=>{}});expect(repository.recovery).toBe('corrupt');expect(repository.recoveryExport).toBe(raw);
 });
 it('rejects malformed/unbound pilot completion and admits a baseline-shaped positive completion',()=>{
  const sha='sha256:'+ 'a'.repeat(64),payload={status:'COMPLETED',turn_id:'turn-1',certification:{certification_id:sha,verdict:'CERTIFIED',certified_at:q.asOf,scope_text:'Synthetic contract fixture A'},evidence_ref:'/v1/evidence/'+sha,result:{machine_id:'A',metric:'MET-004',exact:'21/32',unit:'ratio',outcome:'OK',components:Object.fromEntries(['availability','performance','quality','oee'].map(k=>[k,{outcome:'OK',exact:'1'}]))},retained_context:{machine_ids:['A'],window_start:q.from,window_end:q.to,ontology_version:'fixture-only'}};
  expect(()=>validatePilotTurn(payload)).not.toThrow();
  for(const bad of [{...payload,certification:{...payload.certification,certification_id:'garbage'}},{...payload,certification:{...payload.certification,certified_at:'yesterday'}},{...payload,evidence_ref:'/v1/evidence/elsewhere'},{...payload,retained_context:{...payload.retained_context,machine_ids:['B']}},{...payload,retained_context:{...payload.retained_context,window_start:q.to,window_end:q.from}}])expect(()=>validatePilotTurn(bad)).toThrow();
 });
 it('withholds scoped resources in lists and exact details for a narrower simulated session',async()=>{
  const repository=new MockRepository();repository.commit({...emptyRepository(),sequence:1,resources:[resource]});const service=new MockService(repository,async()=>{throw new Error('unused')});
  const r={...request(undefined),method:'GET' as const,session:{...request(undefined).session,allowedAssetIds:['B']},path:'/api/v1/resources/board'};
  const list=await service.send<any>(r);expect(list.data.items).toEqual([]);expect((await service.send({...r,path:r.path+'/board-1'})).error?.code).toBe('FORBIDDEN');
 });
});
