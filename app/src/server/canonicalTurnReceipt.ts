import{capturedTrainingContext}from'../platform/trainingContext';
import type {Conversation} from '../investigation/service';import type {Capture,Receipt} from './conversationBoundary';
type Turn=Conversation['turns'][number];
export function canonicalTurnReceipt(t:Turn):Receipt{
 const quantities=(t.semanticEnvelope?.claims||[]).filter(c=>c.quantity&&Number.isFinite(c.quantity.value));
 return {id:'canonical:turn',sourceIds:[...t.answer.sourceIds],asOf:t.asOf,status:t.answer.sourceIds.length?'observed':'unavailable',facts:[{key:'canonical_turn',value:JSON.stringify({question:t.question,answer:t.answer,context:t.training?.sourceContext?capturedTrainingContext(t.training):t.trainingModelContext||t.context,asOf:t.asOf,blocked:t.blocked,commands:t.commands,semantics:t.semanticEnvelope}),unit:''},...quantities.map((c,i)=>({key:'quantity:'+i,value:c.quantity!.value,unit:c.quantity!.unit}))]};
}
/** The authoritative turn and its existing validators remain unchanged. The
 * provider supplement cannot replace its answer, scope, chart or semantic proof. */
export function validCanonicalSupplement(c:Capture,t:Turn,containerId?:string){
 if(!c||c.schemaVersion!==1||!c.operationId||!c.policyRevision||!c.sourceRevision||!c.provider||!Number.isSafeInteger(c.expectedVersion)||c.expectedVersion<1||c.question!==t.question||containerId&&c.conversationId!==containerId||typeof c.response?.interpretation!=='string'||c.response.interpretation.length>16000||!Array.isArray(c.response.claims)||!Array.isArray(c.receipts)||c.receipts.length!==1)return false;
 const r=canonicalTurnReceipt(t);if(JSON.stringify(c.receipts[0])!==JSON.stringify(r))return false;
 return c.response.claims.every(claim=>claim.receiptId===r.id&&r.status==='observed'&&r.sourceIds.length>0&&r.facts.some(f=>f.key===claim.key&&f.value===claim.value&&f.unit===claim.unit));
}
