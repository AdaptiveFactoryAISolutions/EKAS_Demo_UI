import {describe,it,expect} from 'vitest';
import {PilotAdapter,PilotResponseError,validatePilotMessage,validatePilotTurn,type PilotWireRequest} from './pilotAdapter';
describe('source-bound pilot wire adapter',()=>{
 it('preserves structured slots, clarification IDs and HTTP idempotency separately from proposed query DTOs',async()=>{
  const requests:PilotWireRequest[]=[];const adapter=new PilotAdapter({send:async request=>{requests.push(request);return {status:200,body:{status:'CLARIFICATION_REQUIRED',conversation_id:'conversation/one',turn_id:'turn-1',correlation_id:'corr-1',clarification:{clarification_id:'choice-7',slot:'machine',question:'Which machine?',choices:[{value:'SYN-M-01',label:'Machine 1'}]}}}}});
  await adapter.sendMessage('conversation/one',{structured_request:{metric:'MET-004',machine:'SYN-M-01',window:'2026-01'}},'same-request');
  await adapter.sendMessage('conversation/one',{clarification_answer:{clarification_id:'choice-7',value:'SYN-M-01'}},'answer-7');
  expect(requests[0]).toEqual({method:'POST',path:'/v1/conversations/conversation%2Fone/messages',headers:{'Idempotency-Key':'same-request'},body:{structured_request:{metric:'MET-004',machine:'SYN-M-01',window:'2026-01'}}});
  expect(requests[1].body).toEqual({clarification_answer:{clarification_id:'choice-7',value:'SYN-M-01'}});
  expect(adapter.traces).toHaveLength(2);
 });
 it('rejects ambiguous inputs and preserves exact certification identity without fallback',async()=>{
  expect(()=>validatePilotMessage({text:'OEE',structured_request:{}})).toThrow('Exactly one');
  expect(()=>validatePilotMessage({clarification_answer:{clarification_id:'a',value:'b',extra:1}})).toThrow();
  const requests:PilotWireRequest[]=[];const adapter=new PilotAdapter({send:async r=>{requests.push(r);return {status:200,body:{certification_id:'sha256:'+'a'.repeat(64),verdict:'CERTIFIED',certified_at:'2026-10-06T14:45:00Z',scope_certificate_ref:'synthetic-scope',certified_result_hash:'hash',kernel_input_ref:'input',source_ledger_hashes:[],snapshot_refs:[],source_lineage_refs:[],completeness:{outcome:'COMPLETE',disclosure:[]}}}}}),id='sha256:'+ 'a'.repeat(64);
  await adapter.fetchEvidence(id);expect(requests[0].path).toBe('/v1/evidence/'+id);await expect(adapter.fetchEvidence('result-1')).rejects.toThrow('Exact certification');
 });
 it('blocks invented numeric completion, duplicate clarification choices and forbidden narrative',()=>{
  expect(()=>validatePilotTurn({status:'COMPLETED',result:{exact:'0'}})).toThrow();
  expect(()=>validatePilotTurn({status:'CLARIFICATION_REQUIRED',conversation_id:'c',turn_id:'t',clarification:{clarification_id:'x',slot:'machine',question:'Choose',choices:[{value:'a',label:'A'},{value:'a',label:'Alias'}]}})).toThrow();
  expect(()=>validatePilotTurn({status:'COMPLETED',narrative:'Made up proof'})).toThrow('narrative');
 });
 it('preserves source-shaped forbidden/retryability/correlation error instead of a successful empty result',async()=>{
  const detail={error_class:'FORBIDDEN',error_code:'EVIDENCE_FORBIDDEN',message:'Evidence is not available to this principal.',correlation_id:'corr-1',retryable:false,occurred_at:'2026-10-06T14:45:00Z',details:{}};
  const adapter=new PilotAdapter({send:async()=>({status:403,body:{error:detail}})});
  await expect(adapter.listTurns('foreign')).rejects.toMatchObject({status:403,detail});
  await expect(adapter.listTurns('foreign')).rejects.toBeInstanceOf(PilotResponseError);
 });
});
