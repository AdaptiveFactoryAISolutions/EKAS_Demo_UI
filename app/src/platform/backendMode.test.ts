import {describe,expect,it,vi} from 'vitest';
import {MockRepository} from './mockRepository';
import {PilotResponseError,validatePilotMessage,validatePilotTurn,type PilotWireRequest} from './pilotAdapter';
import {ManufacturingService} from '../investigation/service';
import {createManufacturingClient} from '../investigation/clientPort';
import {LIVE_CAPABILITY_REFUSALS,LiveBackendUnavailable,UnsupportedBackendOperation,assertDocumentedPilotPath,openLivePilot,refuseLiveInvestigationCommand,refuseUnsupportedLiveCapability,validateRuntimeProbe} from './backendMode';
import type {Transport} from './contract';

const sha='sha256:'+'ab'.repeat(32);
const stamp='2026-10-06T15:00:00Z';
const envelope=(error_class:string,error_code:string,message:string,retryable=false)=>({error:{error_class,error_code,message,correlation_id:'corr-1',retryable,occurred_at:stamp,details:{}}});
const completed={
 status:'COMPLETED',turn_id:'turn-1',correlation_id:'corr-1',evidence_ref:'/v1/evidence/'+sha,
 certification:{verdict:'CERTIFIED',certification_id:sha,certified_at:stamp,scope_text:'recorded scope'},
 result:{machine_id:'SYN-M-01',metric:'oee',unit:'fraction',outcome:'COMPLETE',exact:'2154/2880',components:{availability:{outcome:'VALUE',exact:'1/1'},performance:{outcome:'VALUE',exact:'1/1'},quality:{outcome:'VALUE',exact:'1/1'},oee:{outcome:'VALUE',exact:'2154/2880'}}},
 retained_context:{machine_ids:['SYN-M-01'],window_start:'2026-10-06T06:00:00Z',window_end:'2026-10-06T14:00:00Z',ontology_version:'recorded-ontology'},
};
const evidenceBundle={certification_id:sha,verdict:'CERTIFIED',certified_at:stamp,completeness:{outcome:'COMPLETE',disclosure:[]},scope_certificate_ref:'scope',certified_result_hash:'hash',kernel_input_ref:'input',source_ledger_hashes:['ledger'],snapshot_refs:['snap'],source_lineage_refs:['line']};
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
  const fetchImpl=vi.fn(async(_url:unknown,init?:RequestInit)=>{seen.push(init??{});return json(401,envelope('UNAUTHORIZED','AUTHENTICATION_FAILED','Authentication is required or invalid.'));});
  const adapter=openLivePilot(access,fetchImpl as typeof fetch);
  await expect(adapter.listConversations()).rejects.toMatchObject({status:401,detail:{error_code:'AUTHENTICATION_FAILED'}});
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
  const fetchEvidence=vi.fn(async()=>json(200,evidenceBundle));
  await expect(openLivePilot(access,fetchEvidence as typeof fetch).fetchEvidence(sha)).resolves.toMatchObject({certification_id:sha});
  const mismatch=vi.fn(async()=>json(200,{...evidenceBundle,certification_id:'sha256:'+'cd'.repeat(32)}));
  await expect(openLivePilot(access,mismatch as typeof fetch).fetchEvidence(sha)).rejects.toThrow(/evidence identity/);
 });
 it('does not invent an investigation command or an expectedVersion field',()=>{
  const fetchImpl=vi.fn();
  openLivePilot(access,fetchImpl as typeof fetch);
  expect(()=>refuseLiveInvestigationCommand()).toThrow(UnsupportedBackendOperation);
  expect(()=>refuseLiveInvestigationCommand()).toThrow(LIVE_CAPABILITY_REFUSALS.investigation);
  expect(()=>assertDocumentedPilotPath('/api/v1/manufacturing/investigations/case/commands')).toThrow(LIVE_CAPABILITY_REFUSALS.investigation);
  expect(()=>assertDocumentedPilotPath('/v1/actions')).toThrow(UnsupportedBackendOperation);
  expect(()=>validatePilotMessage({text:'Authorize the feeder repair.',expectedVersion:4})).toThrow(/exclusive/);
  expect(fetchImpl).not.toHaveBeenCalled();
 });
 it('surfaces an idempotency conflict for a different body and does not replay the first body',async()=>{
  const bodies:unknown[]=[];
  const fetchImpl=vi.fn(async(_url:unknown,init?:RequestInit)=>{
   const body=JSON.parse(String(init?.body));bodies.push(body);
   if(bodies.length===1)return json(200,{status:'CLARIFICATION_REQUIRED',conversation_id:'c',turn_id:'t',correlation_id:'corr-1',clarification:{clarification_id:'choice-7',slot:'machine',question:'Which machine?',choices:[{value:'SYN-M-01',label:'Machine 1'}]}});
   return json(409,envelope('CONFLICT','IDEMPOTENCY_KEY_REUSED','The Idempotency-Key was already used for a different request in this conversation.'));
  });
  const adapter=openLivePilot(access,fetchImpl as typeof fetch);
  await adapter.sendMessage('c',{text:'Show certified OEE.'},'same-key');
  await expect(adapter.sendMessage('c',{text:'A different question.'},'same-key')).rejects.toMatchObject({status:409,detail:{error_code:'IDEMPOTENCY_KEY_REUSED'}});
  expect(bodies[1]).toEqual({text:'A different question.'});
  expect(fetchImpl).toHaveBeenCalledTimes(2);
 });
 it('rejects a non-envelope live failure instead of an empty success',async()=>{
  const adapter=openLivePilot(access,vi.fn(async()=>new Response('<html>down</html>',{status:502})) as typeof fetch);
  await expect(adapter.listTurns('c')).rejects.toBeInstanceOf(LiveBackendUnavailable);
  const malformed=openLivePilot(access,vi.fn(async()=>json(500,{error:{message:'missing class'}})) as typeof fetch);
  await expect(malformed.listTurns('c')).rejects.toThrow(/Invalid pilot error envelope/);
 });
 it('accepts a certified-incomplete result only when the unserved component carries no exact value',()=>{
  const incomplete=structuredClone(completed);
  incomplete.certification.verdict='CERTIFIED_INCOMPLETE';
  incomplete.result.outcome='INCOMPLETE';
  delete (incomplete.result as {exact?:string}).exact;
  (incomplete.result.components as {oee:{outcome:string;exact?:string};quality:{outcome:string;exact?:string}}).oee={outcome:'NOT_SERVED'};
  (incomplete.result.components as {oee:{outcome:string;exact?:string};quality:{outcome:string;exact?:string}}).quality={outcome:'EVIDENCE_INSUFFICIENT'};
  expect(()=>validatePilotTurn(incomplete)).not.toThrow();
  incomplete.result.components.oee={outcome:'NOT_SERVED',exact:'1/2'};
  expect(()=>validatePilotTurn(incomplete)).toThrow(/component/);
  const stale=structuredClone(completed);stale.result.outcome='OK';
  expect(()=>validatePilotTurn(stale)).toThrow(/completed turn/);
 });
 it('admits a natural clarification reply and refuses a fictional presentation label',()=>{
  expect(()=>validatePilotMessage({text:'Machine 1',client_context:{presentation_label:'supervisor',clarification_id:'choice-7'}})).not.toThrow();
  expect(()=>validatePilotMessage({text:'Machine 1',client_context:{presentation_label:'manager'}})).toThrow(/client context/);
  expect(()=>validatePilotMessage({structured_request:{metric:'oee',machine:'SYN-M-01',window:'2026-01'},client_context:{clarification_id:'choice-7'}})).toThrow(/client context/);
 });
 it('does not send an opportunity or kernel route, and a timeout or denied tenant does not call demo',async()=>{
  let demoSends=0;
  const fetchImpl=vi.fn(async()=>{demoSends+=1;throw Object.assign(new Error('aborted'),{name:'AbortError'});});
  await expect(openLivePilot(access,fetchImpl as typeof fetch).createConversation()).rejects.toThrow(/timed out/);
  expect(()=>assertDocumentedPilotPath('/v1/opportunities/qualify')).toThrow(/opportunity workflow is not the investigation lifecycle/);
  expect(()=>assertDocumentedPilotPath('/v1/recommendations/rec/dispositions')).toThrow(/No investigation state was recorded/);
  expect(()=>assertDocumentedPilotPath('/v1/tools/kernel.compute_metric')).toThrow(LIVE_CAPABILITY_REFUSALS.metricRead);
  expect(()=>assertDocumentedPilotPath('/api/v1/metrics/oee-tiles-v2')).toThrow(/No metric was fetched/);
  const denied=openLivePilot(access,vi.fn(async()=>json(403,envelope('FORBIDDEN','EVIDENCE_FORBIDDEN','Evidence is not available to this principal.'))) as typeof fetch);
  await expect(denied.listTurns('foreign')).rejects.toMatchObject({status:403,detail:{error_code:'EVIDENCE_FORBIDDEN'}});
  const down=openLivePilot(access,vi.fn(async()=>json(503,envelope('EXECUTION_FAILURE','DEPENDENCY_UNAVAILABLE','The action-loop service is unavailable.',true))) as typeof fetch);
  await expect(down.listConversations()).rejects.toMatchObject({status:503,detail:{error_code:'DEPENDENCY_UNAVAILABLE',retryable:true}});
  const stale=openLivePilot(access,vi.fn(async()=>json(401,envelope('UNAUTHORIZED','AUTHORIZATION_STALE','Current authorization is no longer valid.'))) as typeof fetch);
  await expect(stale.listConversations()).rejects.toMatchObject({status:401,detail:{error_code:'AUTHORIZATION_STALE'}});
  expect(demoSends).toBe(1);
 });
 it('checks the unauthenticated health probes and an optional evidence publication',async()=>{
  expect(()=>validateRuntimeProbe('/healthz',{status:'ok',component:'ui-shell-api',wp:'WP-P3-15'})).not.toThrow();
  expect(()=>validateRuntimeProbe('/livez',{status:'ok',component:'api-runtime',wp:'WP-P4-23'})).not.toThrow();
  expect(()=>validateRuntimeProbe('/healthz',{status:'ready'})).toThrow(/runtime probe/);
  const blocked=vi.fn();
  for(const capability of Object.keys(LIVE_CAPABILITY_REFUSALS) as (keyof typeof LIVE_CAPABILITY_REFUSALS)[]){
   expect(()=>refuseUnsupportedLiveCapability(capability)).toThrow(LIVE_CAPABILITY_REFUSALS[capability]);
  }
  expect(()=>refuseUnsupportedLiveCapability('investigationOwnership')).toThrow('This connected EKAS backend does not currently support investigation ownership. No assignment was recorded.');
  expect(blocked).not.toHaveBeenCalled();
  const published={...evidenceBundle,publication:{publication_id:'pub',snapshot_id:'snap',content_sha256:'abc',approved_publication_ref:'ref'}};
  await expect(openLivePilot(access,vi.fn(async()=>json(200,published)) as typeof fetch).fetchEvidence(sha)).resolves.toMatchObject({publication:{snapshot_id:'snap'}});
  const broken={...evidenceBundle,publication:{snapshot_id:'snap'}};
  await expect(openLivePilot(access,vi.fn(async()=>json(200,broken)) as typeof fetch).fetchEvidence(sha)).rejects.toThrow(/evidence identity/);
 });
});
