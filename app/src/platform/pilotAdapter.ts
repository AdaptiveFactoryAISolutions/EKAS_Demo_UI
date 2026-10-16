import {pilotTimestamp,comparePilotInstants} from './pilotTime';
/** Read-only source-derived v2 pilot wire boundary; no default network transport.
 * Baseline: fe2635cef64cf99eccad6c84df82bff466cb46df.
 * This adapter does not certify synthetic calculations or implement authentication.
 */
export type PilotMessage =
 | {text:string;client_context?:{presentation_label:string}}
 | {structured_request:{metric:string;machine:string;window:string}}
 | {clarification_answer:{clarification_id:string;value:string};client_context?:{presentation_label:string}};
export interface PilotWireRequest {method:'GET'|'POST';path:string;headers:Record<string,string>;body?:unknown}
export interface PilotWireResponse {status:number;body:unknown}
export interface PilotWire {send(request:PilotWireRequest):Promise<PilotWireResponse>}
export interface PilotError {error_class:string;error_code:string;message:string;correlation_id?:string;retryable?:boolean;occurred_at?:string;details?:unknown}
export class PilotResponseError extends Error {constructor(readonly status:number,readonly detail:PilotError){super(detail.message)}}
const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const nonempty=(x:unknown):x is string=>typeof x==='string'&&x.trim().length>0;
function exclusive(message:Record<string,unknown>,allowed:string[]){
 if(Object.keys(message).some(k=>!allowed.includes(k)))throw new Error('Pilot message fields are exclusive.');
 if(message.client_context!==undefined){const c=message.client_context;if(!object(c)||Object.keys(c).some(k=>k!=='presentation_label')||!nonempty(c.presentation_label))throw new Error('Invalid client context.');}
}
export function validatePilotMessage(message:unknown):asserts message is PilotMessage{
 if(!object(message))throw new Error('Pilot message must be an object.');
 const kinds=['text','structured_request','clarification_answer'].filter(k=>message[k]!==undefined&&message[k]!==null);
 if(kinds.length!==1)throw new Error('Exactly one pilot message input is required.');
 if(kinds[0]==='text'){exclusive(message,['text','client_context']);if(!nonempty(message.text)||message.text.length>4000)throw new Error('Invalid text.');}
 if(kinds[0]==='structured_request'){exclusive(message,['structured_request']);const r=message.structured_request;if(!object(r)||Object.keys(r).some(k=>!['metric','machine','window'].includes(k))||!['metric','machine','window'].every(k=>nonempty(r[k])))throw new Error('Invalid structured request.');}
 if(kinds[0]==='clarification_answer'){exclusive(message,['clarification_answer','client_context']);const r=message.clarification_answer;if(!object(r)||Object.keys(r).some(k=>!['clarification_id','value'].includes(k))||!nonempty(r.clarification_id)||r.clarification_id.length>128||!nonempty(r.value)||r.value.length>256)throw new Error('Invalid clarification answer.');}
}
/** Only the required, source-confirmed conversation response fields are checked here.
 * Additive optional pilot blocks are retained verbatim; narrative is never accepted.
 */
export function validatePilotTurn(payload:unknown):void{
 if(!object(payload)||payload.narrative!==undefined)throw new Error('Invalid pilot turn: narrative is forbidden.');
 if(payload.status==='CLARIFICATION_REQUIRED'){
  const c=payload.clarification;
  if(!nonempty(payload.conversation_id)||!nonempty(payload.turn_id)||!object(c)||!['clarification_id','slot','question'].every(k=>nonempty(c[k]))||!Array.isArray(c.choices)||!c.choices.length||c.choices.some(x=>!object(x)||!nonempty(x.value)||!nonempty(x.label))||new Set(c.choices.map(x=>(x as Record<string,unknown>).value)).size!==c.choices.length||payload.result!==undefined||payload.certification!==undefined)throw new Error('Invalid pilot clarification turn.');
  return;
 }
 const cert=payload.certification,r=payload.result,context=payload.retained_context;
 if(payload.status!=='COMPLETED'||!nonempty(payload.turn_id)||!nonempty(payload.evidence_ref)||!object(cert)||cert.verdict!=='CERTIFIED'||!['certification_id','certified_at','scope_text'].every(k=>nonempty(cert[k]))||!object(r)||!['machine_id','metric','unit','outcome'].every(k=>nonempty(r[k]))||!nonempty(r.exact)||!/^\d+(?:\/[1-9]\d*)?$/.test(r.exact)||!object(r.components)||!object(context)||!Array.isArray(context.machine_ids)||!context.machine_ids.length||context.machine_ids.some(x=>!nonempty(x))||!['window_start','window_end','ontology_version'].every(k=>nonempty(context[k])))throw new Error('Invalid pilot completed turn.');
 if(!/^sha256:[0-9a-f]{64}$/.test(String(cert.certification_id))||!pilotTimestamp(cert.certified_at)||payload.evidence_ref!=='/v1/evidence/'+cert.certification_id||!pilotTimestamp(context.window_start)||!pilotTimestamp(context.window_end)||comparePilotInstants(context.window_start,context.window_end)>=0||comparePilotInstants(context.window_end,cert.certified_at)>0||!context.machine_ids.includes(r.machine_id))throw new Error('Invalid pilot identity, evidence or retained-context binding.');
 const components=r.components;
 for(const key of ['availability','performance','quality','oee']){const c=components[key];if(!object(c)||!nonempty(c.outcome)||(c.exact!==undefined&&(!nonempty(c.exact)||!/^\d+(?:\/[1-9]\d*)?$/.test(c.exact))))throw new Error('Invalid pilot result component.');}
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
  if(response.status>=400){const envelope=response.body,error=object(envelope)?envelope.error:undefined;if(!object(error)||!['error_class','error_code','message'].every(k=>nonempty(error[k]))||(error.retryable!==undefined&&typeof error.retryable!=='boolean'))throw new Error('Invalid pilot error envelope.');throw new PilotResponseError(response.status,error as unknown as PilotError)}
  return response.body;
 }
 async createConversation(){const p=await this.call('POST','/v1/conversations');if(!object(p)||!nonempty(p.conversation_id)||!pilotTimestamp(p.created_at))throw new Error('Invalid pilot conversation-created response.');return p}
 async listConversations(){const p=await this.call('GET','/v1/conversations');if(!object(p)||!Array.isArray(p.conversations)||p.conversations.some(c=>!object(c)||!nonempty(c.conversation_id)||!pilotTimestamp(c.created_at)))throw new Error('Invalid pilot conversation-list response.');return p}
 async listTurns(id:string){if(!nonempty(id))throw new Error('Conversation ID required.');const p=await this.call('GET',`/v1/conversations/${encodeURIComponent(id)}/turns`);if(!object(p)||!Array.isArray(p.turns)||p.turns.some(t=>!object(t)||!nonempty(t.turn_id)||!pilotTimestamp(t.created_at)||!nonempty(t.status)))throw new Error('Invalid pilot stored-turn response.');for(const t of p.turns){if(object(t)&&t.payload!==null&&t.payload!==undefined)validatePilotTurn(t.payload)}return p}
 async sendMessage(id:string,message:PilotMessage,key:string){if(!nonempty(id)||!nonempty(key))throw new Error('Conversation ID and idempotency key required.');validatePilotMessage(message);const payload=await this.call('POST',`/v1/conversations/${encodeURIComponent(id)}/messages`,message,{'Idempotency-Key':key});validatePilotTurn(payload);return payload}
 async fetchEvidence(id:string){if(!/^sha256:[0-9a-f]{64}$/.test(id))throw new Error('Exact certification SHA identity required.');const p=await this.call('GET',`/v1/evidence/${id}`);if(!object(p)||p.certification_id!==id||p.verdict!=='CERTIFIED'||!pilotTimestamp(p.certified_at)||!['scope_certificate_ref','certified_result_hash','kernel_input_ref'].every(k=>nonempty(p[k]))||!['source_ledger_hashes','snapshot_refs','source_lineage_refs'].every(k=>Array.isArray(p[k])&&(p[k] as unknown[]).every(nonempty)))throw new Error('Invalid pilot evidence identity/schema.');return p}
}
