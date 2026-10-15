import type {Actor} from '../investigation/workflow';
/** Browser navigation/recovery metadata only; no answer, metric, case truth or key. */
export type OperationCursor={schemaVersion:1;conversationId:string;operationId:string;expectedVersion:number;actor:Actor;text:string;state:'submitted'|'interrupted'};
export function validOperationCursors(value:unknown):value is Record<string,OperationCursor>{
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>200)return false;
 const ids=new Set<string>();return Object.entries(value).every(([key,raw])=>{const c=raw as OperationCursor;if(!c||typeof c!=='object'||Array.isArray(c)||Object.keys(c).sort().join(',')!=='actor,conversationId,expectedVersion,operationId,schemaVersion,state,text'||c.schemaVersion!==1||c.conversationId!==key||!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(key)||typeof c.operationId!=='string'||!/^[A-Za-z0-9-]{1,100}$/.test(c.operationId)||ids.has(c.operationId)||!Number.isSafeInteger(c.expectedVersion)||c.expectedVersion<1||!['manager','supervisor','maintenance','safety','viewer'].includes(c.actor)||typeof c.text!=='string'||!c.text.trim()||c.text.length>4000||!['submitted','interrupted'].includes(c.state))return false;ids.add(c.operationId);return true;});
}
