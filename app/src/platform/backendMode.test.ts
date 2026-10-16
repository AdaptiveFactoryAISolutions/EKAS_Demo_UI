import {describe,expect,it,vi} from 'vitest';
import {MockRepository} from './mockRepository';
import {PilotResponseError,validatePilotMessage,validatePilotTurn,type PilotWireRequest} from './pilotAdapter';
import {ManufacturingService} from '../investigation/service';
import {createManufacturingClient} from '../investigation/clientPort';
import {LiveBackendUnavailable,UnsupportedBackendOperation,assertDocumentedPilotPath,openLivePilot,refuseLiveInvestigationCommand} from './backendMode';
import type {Transport} from './contract';

const sha='sha256:'+'ab'.repeat(32);
const completed={
 status:'COMPLETED',turn_id:'turn-1',evidence_ref:'/v1/evidence/'+sha,
 certification:{verdict:'CERTIFIED',certification_id:sha,certified_at:'2026-10-06T15:00:00Z',scope_text:'recorded scope'},
 result:{machine_id:'SYN-M-01',metric:'oee',unit:'fraction',outcome:'observed',exact:'2154/2880',components:{availability:{outcome:'observed',exact:'1/1'},performance:{outcome:'observed',exact:'1/1'},quality:{outcome:'observed',exact:'1/1'},oee:{outcome:'observed',exact:'2154/2880'}}},
 retained_context:{machine_ids:['SYN-M-01'],window_start:'2026-10-06T06:00:00Z',window_end:'2026-10-06T14:00:00Z',ontology_version:'recorded-ontology'},
};
const access={baseUrl:'https://backend.invalid/ekas',bearer:'caller-supplied-token'};

function json(status:number,body:unknown){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});}

describe('WP5B backend mode',()=>{
 it('keeps demo conversation creation on the synthetic service when live credentials are refused',async()=>{
  let sends=0;const demo:Transport={send:async request=>{sends++;return new ManufacturingService(new MockRepository()).send(request);}};
  const created=await createManufacturingClient(demo).createConversation('wp5b-demo');
  expect(created.id).toBeTruthy();
  expect(sends).toBe(1);
  expect(()=>openLivePilot({baseUrl:'https://backend.invalid/ekas',bearer:'manager'})).toThrow(LiveBackendUnavailable);
  expect(()=>openLivePilot({baseUrl:'https://backend.invalid/ekas',bearer:'presentationOnly-session'})).toThrow(/not a live bearer/);
  expect(()=>openLivePilot({bearer:'caller-supplied-token'} as never)).toThrow(/base URL and bearer/);
  expect(sends).toBe(1);
 });
 it('fails a live outage without calling the demo service',async()=>{
  const fetchImpl=vi.fn(async()=>{throw new TypeError('network down');});
  const adapter=openLivePilot(access,fetchImpl as typeof fetch);
  await expect(adapter.createConversation()).rejects.toBeInstanceOf(LiveBackendUnavailable);
  expect(fetchImpl).toHaveBeenCalledOnce();
  await expect(adapter.createConversation()).rejects.toThrow(/Demo mode was not used/);
 });
 it('forwards the caller bearer and refuses a fictional role on the documented conversation route',async()=>{
  const seen:RequestInit[]=[];
  const fetchImpl=vi.fn(async(_url:unknown,init?:RequestInit)=>{seen.push(init??{});return json(401,{error:{error_class:'AUTHENTICATION',error_code:'UNAUTHENTICATED',message:'Bearer rejected',retryable:false}});});
  const adapter=openLivePilot(access,fetchImpl as typeof fetch);
  await expect(adapter.listConversations()).rejects.toMatchObject({status:401,detail:{error_code:'UNAUTHENTICATED'}});
  await expect(adapter.listConversations()).rejects.toBeInstanceOf(PilotResponseError);
  expect(new Headers(seen[0].headers).get('Authorization')).toBe('Bearer caller-supplied-token');
  expect(String(seen[0].headers)).not.toContain('manager');
 });
 it('preserves metric, retained context and evidence identity, and rejects a substituted machine',async()=>{
  const requests:PilotWireRequest[]=[];
  const adapter=openLivePilot(access,vi.fn(async(_url:unknown,init?:RequestInit)=>{
   requests.push({method:'POST',path:'/v1/conversations/c/messages',headers:Object.fromEntries(new Headers(init?.headers)),body:JSON.parse(String(init?.body))});
   return json(200,completed);
  }) as typeof fetch);
  const turn=await adapter.sendMessage('c',{structured_request:{metric:'oee',machine:'SYN-M-01',window:'2026-10-06'}},'metric-1');
  expect(turn).toMatchObject({result:{exact:'2154/2880',machine_id:'SYN-M-01'},retained_context:{ontology_version:'recorded-ontology'}});
  expect(new Headers(requests[0].headers).get('Idempotency-Key')).toBe('metric-1');
  expect(requests[0].body).toEqual({structured_request:{metric:'oee',machine:'SYN-M-01',window:'2026-10-06'}});
  const drifted=structuredClone(completed);drifted.result.machine_id='OTHER-MACHINE';
  expect(()=>validatePilotTurn(drifted)).toThrow(/retained-context/);
  const fetchEvidence=vi.fn(async()=>json(200,{...completed.certification,scope_certificate_ref:'scope',certified_result_hash:'hash',kernel_input_ref:'input',source_ledger_hashes:['ledger'],snapshot_refs:['snap'],source_lineage_refs:['line']}));
  await expect(openLivePilot(access,fetchEvidence as typeof fetch).fetchEvidence(sha)).resolves.toMatchObject({certification_id:sha});
  const mismatch=vi.fn(async()=>json(200,{certification_id:'sha256:'+'cd'.repeat(32),verdict:'CERTIFIED',certified_at:'2026-10-06T15:00:00Z',scope_certificate_ref:'scope',certified_result_hash:'hash',kernel_input_ref:'input',source_ledger_hashes:[],snapshot_refs:[],source_lineage_refs:[]}));
  await expect(openLivePilot(access,mismatch as typeof fetch).fetchEvidence(sha)).rejects.toThrow(/evidence identity/);
 });
 it('does not invent an investigation command or an expectedVersion field',()=>{
  const fetchImpl=vi.fn();
  openLivePilot(access,fetchImpl as typeof fetch);
  expect(()=>refuseLiveInvestigationCommand()).toThrow(UnsupportedBackendOperation);
  expect(()=>assertDocumentedPilotPath('/api/v1/manufacturing/investigations/case/commands')).toThrow(/not on the documented pilot surface/);
  expect(()=>assertDocumentedPilotPath('/v1/actions')).toThrow(UnsupportedBackendOperation);
  expect(()=>validatePilotMessage({text:'Authorize the feeder repair.',expectedVersion:4})).toThrow(/exclusive/);
  expect(fetchImpl).not.toHaveBeenCalled();
 });
 it('surfaces an idempotency conflict for a different body and does not replay the first body',async()=>{
  const bodies:unknown[]=[];
  const fetchImpl=vi.fn(async(_url:unknown,init?:RequestInit)=>{
   const body=JSON.parse(String(init?.body));bodies.push(body);
   if(bodies.length===1)return json(200,{status:'CLARIFICATION_REQUIRED',conversation_id:'c',turn_id:'t',clarification:{clarification_id:'choice-7',slot:'machine',question:'Which machine?',choices:[{value:'SYN-M-01',label:'Machine 1'}]}});
   return json(409,{error:{error_class:'CONFLICT',error_code:'IDEMPOTENCY_CONFLICT',message:'Key already used',retryable:false}});
  });
  const adapter=openLivePilot(access,fetchImpl as typeof fetch);
  await adapter.sendMessage('c',{text:'Show certified OEE.'},'same-key');
  await expect(adapter.sendMessage('c',{text:'A different question.'},'same-key')).rejects.toMatchObject({status:409,detail:{error_code:'IDEMPOTENCY_CONFLICT'}});
  expect(bodies[1]).toEqual({text:'A different question.'});
  expect(fetchImpl).toHaveBeenCalledTimes(2);
 });
 it('rejects a non-envelope live failure instead of an empty success',async()=>{
  const adapter=openLivePilot(access,vi.fn(async()=>new Response('<html>down</html>',{status:502})) as typeof fetch);
  await expect(adapter.listTurns('c')).rejects.toBeInstanceOf(LiveBackendUnavailable);
  const malformed=openLivePilot(access,vi.fn(async()=>json(500,{error:{message:'missing class'}})) as typeof fetch);
  await expect(malformed.listTurns('c')).rejects.toThrow(/Invalid pilot error envelope/);
 });
});
