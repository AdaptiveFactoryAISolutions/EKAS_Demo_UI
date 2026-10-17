import {pilotTimestamp,comparePilotInstants} from './pilotTime';
/** Pilot wire checked against the read-only current-main snapshot.
 * Identity: AdaptiveFactoryAISolutions/EKAS_Platform_v2 main 473bdc0d2458fcffdbe516d220d4f88bcb2f1916.
 * No default network transport. This adapter does not certify calculations or mint tokens.
 * fe2635cef64cf99eccad6c84df82bff466cb46df is not a source for a field this snapshot does not state.
 */
const ERROR_CLASSES=new Set(['EXECUTION_FAILURE','INVALID_REQUEST','UNAUTHORIZED','FORBIDDEN','CERTIFICATION_REJECTED','CERTIFICATION_UNAVAILABLE','MODEL_UNAVAILABLE','CONFLICT','LIMIT_EXCEEDED']);
const ERROR_KEYS=new Set(['error_class','error_code','message','correlation_id','retryable','retry_after_ms','occurred_at','details']);
const PRESENTATION_LABELS=new Set(['operator','supervisor','plant_manager','continuous_improvement_engineer']);
const COMPONENT_OUTCOMES=new Set(['VALUE','NOT_APPLICABLE','EVIDENCE_INSUFFICIENT','NOT_SERVED']);
const VERDICTS=new Set(['CERTIFIED','CERTIFIED_INCOMPLETE']);
const fraction=(value:unknown):value is string=>nonempty(value)&&/^\d+(?:\/[1-9]\d*)?$/.test(value);
type PresentationLabel='operator'|'supervisor'|'plant_manager'|'continuous_improvement_engineer';
export type PilotMessage =
 | {text:string;client_context?:{presentation_label?:PresentationLabel;clarification_id?:string};attachment_refs?:string[]}
 | {structured_request:{metric:string;machine:string;window:string};client_context?:{presentation_label?:PresentationLabel};attachment_refs?:string[]}
 | {clarification_answer:{clarification_id:string;value:string};client_context?:{presentation_label?:PresentationLabel};attachment_refs?:string[]};
export interface PilotWireRequest {method:'GET'|'POST';path:string;headers:Record<string,string>;body?:unknown}
export interface PilotWireResponse {status:number;body:unknown}
export interface PilotWire {send(request:PilotWireRequest):Promise<PilotWireResponse>}
export interface PilotError {error_class:string;error_code:string;message:string;correlation_id:string;retryable:boolean;occurred_at:string;retry_after_ms?:number;details?:Record<string,unknown>}
export class PilotResponseError extends Error {constructor(readonly status:number,readonly detail:PilotError){super(detail.message)}}
const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const nonempty=(x:unknown):x is string=>typeof x==='string'&&x.trim().length>0;
function exclusive(message:Record<string,unknown>,allowed:string[]){
 if(Object.keys(message).some(k=>!allowed.includes(k)))throw new Error('Pilot message fields are exclusive.');
}
function clientContext(message:Record<string,unknown>,allowQuestion:boolean){
 if(message.client_context===undefined)return;
 const context=message.client_context;
 if(!object(context)||Object.keys(context).some(key=>!(allowQuestion?['presentation_label','clarification_id']:['presentation_label']).includes(key)))throw new Error('Invalid client context.');
 if(context.presentation_label!==undefined&&!PRESENTATION_LABELS.has(String(context.presentation_label)))throw new Error('Invalid client context.');
 if(context.clarification_id!==undefined&&(!nonempty(context.clarification_id)||context.clarification_id.length>128))throw new Error('Invalid client context.');
}
function attachments(message:Record<string,unknown>){
 if(message.attachment_refs===undefined)return;
 if(!Array.isArray(message.attachment_refs)||message.attachment_refs.some(item=>!nonempty(item)))throw new Error('Invalid attachment refs.');
}
export function validatePilotMessage(message:unknown):asserts message is PilotMessage{
 if(!object(message))throw new Error('Pilot message must be an object.');
 const kinds=['text','structured_request','clarification_answer'].filter(k=>message[k]!==undefined&&message[k]!==null);
 if(kinds.length!==1)throw new Error('Exactly one pilot message input is required.');
 attachments(message);
 if(kinds[0]==='text'){exclusive(message,['text','client_context','attachment_refs']);clientContext(message,true);if(!nonempty(message.text)||message.text.length>4000)throw new Error('Invalid text.');}
 if(kinds[0]==='structured_request'){exclusive(message,['structured_request','client_context','attachment_refs']);clientContext(message,false);const r=message.structured_request;if(!object(r)||Object.keys(r).some(k=>!['metric','machine','window'].includes(k))||!['metric','machine','window'].every(k=>nonempty(r[k])))throw new Error('Invalid structured request.');}
 if(kinds[0]==='clarification_answer'){exclusive(message,['clarification_answer','client_context','attachment_refs']);clientContext(message,false);const r=message.clarification_answer;if(!object(r)||Object.keys(r).some(k=>!['clarification_id','value'].includes(k))||!nonempty(r.clarification_id)||r.clarification_id.length>128||!nonempty(r.value)||r.value.length>256)throw new Error('Invalid clarification answer.');}
}
export function validatePilotError(error:unknown):asserts error is PilotError{
 if(!object(error)||Object.keys(error).some(key=>!ERROR_KEYS.has(key))||!ERROR_CLASSES.has(String(error.error_class))||!nonempty(error.error_code)||!nonempty(error.message)||!nonempty(error.correlation_id)||typeof error.retryable!=='boolean'||!pilotTimestamp(error.occurred_at))throw new Error('Invalid pilot error envelope.');
 if(error.retry_after_ms!==undefined&&(!Number.isSafeInteger(error.retry_after_ms)||Number(error.retry_after_ms)<0))throw new Error('Invalid pilot error envelope.');
 if(error.details!==undefined&&!object(error.details))throw new Error('Invalid pilot error envelope.');
}
/** Only the required, source-confirmed conversation response fields are checked here.
 * Additive optional pilot blocks are retained verbatim; narrative is never accepted.
 */
export function validatePilotTurn(payload:unknown):void{
 if(!object(payload)||payload.narrative!==undefined)throw new Error('Invalid pilot turn: narrative is forbidden.');
 if(payload.status==='CLARIFICATION_REQUIRED'){
  const c=payload.clarification;
  if(!nonempty(payload.conversation_id)||!nonempty(payload.turn_id)||!nonempty(payload.correlation_id)||!object(c)||!['clarification_id','slot','question'].every(k=>nonempty(c[k]))||!Array.isArray(c.choices)||!c.choices.length||c.choices.some(x=>!object(x)||!nonempty(x.value)||!nonempty(x.label))||new Set(c.choices.map(x=>(x as Record<string,unknown>).value)).size!==c.choices.length||payload.result!==undefined||payload.certification!==undefined)throw new Error('Invalid pilot clarification turn.');
  return;
 }
 const cert=payload.certification,r=payload.result,context=payload.retained_context;
 if(payload.status!=='COMPLETED'||!nonempty(payload.turn_id)||!nonempty(payload.correlation_id)||!nonempty(payload.evidence_ref)||!object(cert)||!VERDICTS.has(String(cert.verdict))||!['certification_id','certified_at','scope_text'].every(k=>nonempty(cert[k]))||!object(r)||!['machine_id','metric','unit'].every(k=>nonempty(r[k]))||!['COMPLETE','INCOMPLETE'].includes(String(r.outcome))||!object(r.components)||!object(context)||!Array.isArray(context.machine_ids)||!context.machine_ids.length||context.machine_ids.some(x=>!nonempty(x))||!['window_start','window_end','ontology_version'].every(k=>nonempty(context[k])))throw new Error('Invalid pilot completed turn.');
 if(!/^sha256:[0-9a-f]{64}$/.test(String(cert.certification_id))||!pilotTimestamp(cert.certified_at)||payload.evidence_ref!=='/v1/evidence/'+cert.certification_id||!pilotTimestamp(context.window_start)||!pilotTimestamp(context.window_end)||comparePilotInstants(context.window_start,context.window_end)>=0||comparePilotInstants(context.window_end,cert.certified_at)>0||!context.machine_ids.includes(r.machine_id))throw new Error('Invalid pilot identity, evidence or retained-context binding.');
 const components=r.components as Record<string,unknown>;
 for(const key of ['availability','performance','quality','oee']){const component=components[key];if(!object(component)||!COMPONENT_OUTCOMES.has(String(component.outcome))||Object.keys(component).some(field=>!['outcome','exact'].includes(field))||(component.outcome==='VALUE'? !fraction(component.exact):component.exact!==undefined))throw new Error('Invalid pilot result component.');}
 const oee=(components.oee as Record<string,unknown>).outcome;
 if(oee==='VALUE'? !fraction(r.exact):r.exact!==undefined)throw new Error('Invalid pilot result exact binding.');
}
/** Explicitly injected wire; callers must provide their own verified bearer session.
 * Offline mocks may inject an in-memory wire. No synthetic session is translated to a bearer token.
 */
export class PilotAdapter{
 readonly traces:{request:PilotWireRequest;response:PilotWireResponse;durationMs:number}[]=[];
 constructor(readonly wire:PilotWire,readonly clock:()=>number=()=>performance.now()){}
 private async call(method:PilotWireRequest['method'],path:string,body?:unknown,headers:Record<string,string>={}){
  const request={method,path,headers,...(body===undefined?{}:{body:structuredClone(body)})},start=this.clock(),response=await this.wire.send(request);
  this.traces.push({request:structuredClone(request),response:structuredClone(response),durationMs:this.clock()-start});
  if(response.status>=400){const envelope=response.body,error=object(envelope)?envelope.error:undefined;validatePilotError(error);throw new PilotResponseError(response.status,error)}
  return response.body;
 }
 async createConversation(){const p=await this.call('POST','/v1/conversations');if(!object(p)||!nonempty(p.conversation_id)||!pilotTimestamp(p.created_at))throw new Error('Invalid pilot conversation-created response.');return p}
 async listConversations(){const p=await this.call('GET','/v1/conversations');if(!object(p)||!Array.isArray(p.conversations)||p.conversations.some(c=>!object(c)||!nonempty(c.conversation_id)||!pilotTimestamp(c.created_at)))throw new Error('Invalid pilot conversation-list response.');return p}
 async listTurns(id:string){if(!nonempty(id))throw new Error('Conversation ID required.');const p=await this.call('GET',`/v1/conversations/${encodeURIComponent(id)}/turns`);if(!object(p)||!Array.isArray(p.turns)||p.turns.some(t=>!object(t)||!nonempty(t.turn_id)||!pilotTimestamp(t.created_at)||!nonempty(t.status)))throw new Error('Invalid pilot stored-turn response.');for(const t of p.turns){if(object(t)&&t.payload!==null&&t.payload!==undefined)validatePilotTurn(t.payload)}return p}
 async sendMessage(id:string,message:PilotMessage,key:string){if(!nonempty(id)||!nonempty(key))throw new Error('Conversation ID and idempotency key required.');validatePilotMessage(message);const payload=await this.call('POST',`/v1/conversations/${encodeURIComponent(id)}/messages`,message,{'Idempotency-Key':key});validatePilotTurn(payload);return payload}
 async fetchEvidence(id:string){if(!/^sha256:[0-9a-f]{64}$/.test(id))throw new Error('Exact certification SHA identity required.');const p=await this.call('GET',`/v1/evidence/${id}`);if(!object(p)||p.certification_id!==id||!VERDICTS.has(String(p.verdict))||!pilotTimestamp(p.certified_at)||!object(p.completeness)||!['scope_certificate_ref','certified_result_hash','kernel_input_ref'].every(k=>nonempty(p[k]))||!['source_ledger_hashes','snapshot_refs','source_lineage_refs'].every(k=>Array.isArray(p[k])&&(p[k] as unknown[]).every(nonempty)))throw new Error('Invalid pilot evidence identity/schema.');if(p.publication!==undefined){const publication=p.publication;if(!object(publication)||!['publication_id','snapshot_id','content_sha256','approved_publication_ref'].every(k=>nonempty(publication[k])))throw new Error('Invalid pilot evidence identity/schema.');}return p}
}
