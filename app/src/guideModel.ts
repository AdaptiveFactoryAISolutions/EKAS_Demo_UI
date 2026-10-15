export type GuideState={schema:1,status:'unseen'|'active'|'paused'|'skipped'|'completed',step:number,corrected?:boolean,done:string[]};
export const guideSteps=[{id:'open',title:'Open the feeder-stop investigation',text:'Type “Why feeder jams?” or choose Investigate feeder stops. Both use the same fixture evidence. Nothing is acted on.'},{id:'correct',title:'Check and change the selected line',text:'Use Change line to choose Line 02, then return to Line 03. Earlier answers keep their scope. Incompatible controlled evidence/actions are withheld.'},{id:'source',title:'Inspect the feeder result and source',text:'Line 03 has 72 feeder-jam minutes. Open Show source records and choose a supplied PFMEA, control plan or standard work record. Inspection supports a hypothesis; it does not prove root cause.'},{id:'action',title:'Open the proposed action review',text:'Open Review proposed action. Check affected equipment, owner and prerequisites. Approval is separate from performed work. Applying an action is never needed for this introduction.'},{id:'verification',title:'Locate the verification requirements',text:'Expand 04 / Verification. Ten eligible matched shifts and separate safety review are required. Initial time excludes future outcomes. You may finish orientation here without approving anything.'}];
export function readGuide(raw:string|null):GuideState{try{const x=JSON.parse(raw||'null');if(x?.schema===1&&['unseen','active','paused','skipped','completed'].includes(x.status)&&Number.isInteger(x.step)&&x.step>=0&&x.step<guideSteps.length&&Array.isArray(x.done))return x}catch{}return {schema:1,status:'unseen',step:0,done:[]}}
export function guideEvent(s:GuideState,event:string):GuideState{if(s.status!=='active')return s;if(event==='line-other')return {...s,corrected:true};const expected=guideSteps[s.step].id;if(event!==expected||(event==='correct'&&!s.corrected))return s;const done=[...new Set([...s.done,expected])];return {...s,done,step:Math.min(s.step+1,guideSteps.length-1),status:done.length===guideSteps.length?'completed':'active'};}

// Optional presentation progress. These events never execute a domain command.
export type WalkthroughContext={space:'template'|'northworks';entityId:string;page:string;scope:string;role:string;cutoff:string;version:number|null};
export type GuideTarget={labels:string[];selector?:string;scopeSelector?:string;fallbackSelector?:string;orientation?:boolean;field?:boolean;openReadOnly?:boolean};
export type GuideStep={id:string;title:string;instruction:string;target:GuideTarget;page?:string;resultPages?:string[];inspection?:boolean;receiptKinds?:string[]};
export type GuideProcedure={id:string;title:string;page:string;steps:GuideStep[];actionBinding?:{status:string;label:string;sourceLine:number;completionVerified:boolean;reason?:string;qualification?:string}};
export type GuideReceipt={id:string;kind:string;transition?:{fromEntityId?:string;fromCutoff?:string;fromScope:string;toScope:string;role:string;cutoff:string;entityId:string}};
export type WalkthroughState={schema:2;procedureId:string;status:'active'|'paused';pauseCause?:'context'|'manual';step:number;context:WalkthroughContext;baseline:string[];observed:{stepId:string;receiptId:string;kind:string}[];unavailableObserved?:{stepId:string;receiptId:string;kind:string}[];requestedPage?:string};
export type WalkthroughEvent={kind:'back'|'skip'|'pause'|'resume'}|{kind:'navigate';page:string}|{kind:'inspect';stepId:string}|{kind:'receipts';receipts:GuideReceipt[]};
const sameIdentity=(a:WalkthroughContext,b:WalkthroughContext)=>['space','entityId','scope','role','cutoff'].every(k=>a[k as keyof WalkthroughContext]===b[k as keyof WalkthroughContext]);
export function beginWalkthrough(p:GuideProcedure,context:WalkthroughContext,receiptIds:string[]):WalkthroughState{return {schema:2,procedureId:p.id,status:'active',step:0,context:{...context},baseline:[...new Set(receiptIds)],observed:[]};}
export function walkthroughEvent(s:WalkthroughState,e:WalkthroughEvent,p:GuideProcedure,c:WalkthroughContext):WalkthroughState{
 if(s.procedureId!==p.id)return {...s,status:'paused',pauseCause:'context'};
 if(!sameIdentity(s.context,c)){const admitted=e.kind==='receipts'&&s.context.space===c.space&&s.context.role===c.role&&e.receipts.some(r=>!s.baseline.includes(r.id)&&p.steps.some(step=>step.receiptKinds?.includes(r.kind))&&r.transition?.fromScope===s.context.scope&&(r.transition.fromEntityId||r.transition.entityId)===s.context.entityId&&(r.transition.fromCutoff||r.transition.cutoff)===s.context.cutoff&&r.transition.toScope===c.scope&&r.transition.entityId===c.entityId&&r.transition.role===c.role&&r.transition.cutoff===c.cutoff);if(!admitted)return {...s,status:'paused',pauseCause:'context'};s={...s,context:{...c},...(s.pauseCause==='context'?{status:'active' as const,pauseCause:undefined}:{})};}

 if(e.kind==='receipts')s=reconcileWalkthroughEvidence(s,e.receipts);
 if(e.kind==='resume'&&s.unavailableObserved?.length)return {...s,status:'paused'};
 if(e.kind==='resume')return {...s,status:'active',context:{...c},requestedPage:undefined};
 if(e.kind==='pause')return {...s,status:'paused',pauseCause:'manual'};
 if(e.kind==='navigate')return {...s,requestedPage:e.page};
 if(s.context.page!==c.page&&s.requestedPage!==c.page&&!p.steps[s.step].resultPages?.includes(c.page))return {...s,status:'paused'};
 if(s.status==='paused')return s;
 let next={...s,context:{...c},requestedPage:undefined};
 if(e.kind==='skip')return {...next,step:Math.min(p.steps.length-1,s.step+1)};
 if(e.kind==='back')return {...next,step:Math.max(0,s.step-1)};
 const step=p.steps[s.step];
 if(e.kind==='inspect'&&e.stepId===step.id&&step.inspection&&!s.observed.some(x=>x.stepId===step.id))return {...next,observed:[...s.observed,{stepId:step.id,receiptId:'visible-inspection:'+step.id,kind:'control-inspected'}]};
 if(e.kind==='receipts'){
  const fresh=e.receipts.filter(r=>!s.baseline.includes(r.id)&&(!r.transition||(r.transition.role===c.role&&r.transition.entityId===c.entityId&&r.transition.cutoff===c.cutoff&&r.transition.toScope===c.scope)));
  const match=fresh.find(r=>step.receiptKinds?.includes(r.kind));
  // Unmatched fresh evidence remains inspectable at its later step; never require a duplicate action.
  next.baseline=[...new Set([...s.baseline,...fresh.filter(r=>step.receiptKinds?.includes(r.kind)).map(r=>r.id)])];
  if(match&&!s.observed.some(x=>x.stepId===step.id))next.observed=[...s.observed,{stepId:step.id,receiptId:match.id,kind:match.kind}];
 }
 return next;
}
function reconcileWalkthroughEvidence(s:WalkthroughState,receipts:GuideReceipt[]):WalkthroughState{
 const known=(o:WalkthroughState['observed'][number])=>o.kind==='control-inspected'||receipts.some(r=>r.id===o.receiptId&&r.kind===o.kind);
 const all=[...s.observed,...(s.unavailableObserved||[])],observed=all.filter(known),unavailableObserved=all.filter(o=>!known(o));
 return {...s,observed,unavailableObserved,...(unavailableObserved.length?{status:'paused' as const}:{})};
}
export function readWalkthrough(raw:string|null,p:GuideProcedure,c:WalkthroughContext,receipts:GuideReceipt[]):WalkthroughState|null{
 try{const s=JSON.parse(raw||'null') as WalkthroughState;
 const validObservation=(x:WalkthroughState['observed'][number])=>!!x&&typeof x.receiptId==='string'&&typeof x.kind==='string'&&p.steps.some(step=>step.id===x.stepId&&(x.kind==='control-inspected'?step.inspection:step.receiptKinds?.includes(x.kind)));
 if(!s||s.schema!==2||s.procedureId!==p.id||!['active','paused'].includes(s.status)||!Number.isInteger(s.step)||s.step<0||s.step>=p.steps.length||!s.context||!sameIdentity(s.context,c)||!Array.isArray(s.baseline)||!s.baseline.every(x=>typeof x==='string')||!Array.isArray(s.observed)||!s.observed.every(validObservation)||s.unavailableObserved!==undefined&&(!Array.isArray(s.unavailableObserved)||!s.unavailableObserved.every(validObservation)))return null;
 return {...reconcileWalkthroughEvidence(s,receipts),status:'paused'};
 }catch{return null}
}
