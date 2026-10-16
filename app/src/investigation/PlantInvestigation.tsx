import {useEffect,useState,type ReactNode} from 'react';
import {impactLine,journeyAction,journeyBrief,lifecycleState,overviewCopy,presentedStatus,presentDocuments,presentEvents} from './plantPresentation';

const tabs=['Overview','Evidence','Action','Verification','History'] as const;
type Tab=typeof tabs[number];
type Hyp={id:string;description?:string;status?:string};
type Doc={id:string;version?:string|number;kind?:string;text?:string;status?:string;eligible?:boolean;controlled?:boolean};
type Ev={id:string;start?:number|null;end?:number|null;reason?:string|null;startAt?:string|null};
type ViewLike={title?:string;caseId?:string;asOf?:string;cycle?:number;owner?:{accepted?:string|null;requested?:string|null};goal?:{gap?:number|null;unit?:string|null}|null;plan?:{endpoint?:string;direction?:string;target?:number;unit?:string;requiredShifts?:number;qualityMaxPct?:number;energyMaxKwhPerGood?:number;qualityMaxWorseningPp?:number;energyMaxWorseningPct?:number}|null;action?:{status?:string;description?:string;performedId?:string|null;performedAt?:string|null;performer?:string|null;confirmation?:string|null};verification?:{status?:string;before?:number|null;after?:number|null;outputGain?:number|null;oeeGain?:number|null;beforeMetrics?:{oee?:{value?:number|boolean|null}};afterMetrics?:{oee?:{value?:number|boolean|null}};guardrails?:{quality?:{status?:string};energy?:{status?:string}};safetyPass?:boolean};sustain?:{status?:string;observations?:{id:string}[]};context?:{asset?:string};documents?:Doc[];events?:Ev[];hypotheses?:Hyp[];availableHypotheses?:Hyp[];availableWork?:{id?:string}|null}|null|undefined;

function actionPlain(status?:string){
 if(!status||status==='draft')return 'No action is recommended yet.';
 if(status==='recommended')return 'The action is recommended. It is not authorized, and it is not performed work.';
 if(status==='requested')return 'Authorization is requested. The work is not performed.';
 if(status==='authorized')return 'The action is authorized. Performed work is not recorded yet.';
 if(status==='performed')return 'The work is recorded as performed.';
 if(status==='rejected')return 'The action was not accepted.';
 if(status==='failed')return 'The action did not succeed.';
 return 'No action is open.';
}
function verificationPlain(status?:string,recorded?:boolean){
 if(status==='safety_review_required'&&!recorded)return 'The measurement is recorded. The safety review is not complete.';
 if(status==='safety_review_required')return 'Safety review is pending.';
 if(status==='awaiting_acceptance')return 'Verification is ready for acceptance.';
 if(status==='accepted')return 'The measured result is accepted.';
 if(status==='measuring'||status==='awaiting_work')return 'The result is not measured yet.';
 if(status==='guardrail_failed')return 'A guardrail failed.';
 if(status==='no_improvement')return 'The measurement did not show the required improvement.';
 if(status==='ineligible')return 'The measurement is not eligible.';
 return 'Verification has not started.';
}
function sustainPlain(status?:string){
 if(status==='sustained')return 'The result held through the required observations.';
 if(status==='recurrence')return 'The result did not hold. A new cycle can be opened.';
 if(status==='interrupted')return 'Sustainment monitoring was interrupted.';
 if(status==='regressed')return 'The result missed the sustain target.';
 return 'Sustainment has not started.';
}
function useNarrowViewport(){
 const query='(max-width: 767px)';
 const [narrow,setNarrow]=useState(()=>{try{return typeof window.matchMedia==='function'&&window.matchMedia(query).matches}catch{return false}});
 useEffect(()=>{if(typeof window.matchMedia!=='function')return;const mq=window.matchMedia(query);const apply=()=>setNarrow(mq.matches);apply();mq.addEventListener?.('change',apply);return()=>mq.removeEventListener?.('change',apply)},[]);
 return narrow;
}

/** Presentation only. Existing panels stay in History. */
export function PlantInvestigation({view,children,onAdvance,advancing,verificationRecorded}:{view:ViewLike;children:ReactNode;onAdvance?:()=>void;advancing?:boolean;verificationRecorded?:boolean}){
 const narrow=useNarrowViewport();
 const [tab,setTab]=useState<Tab>('Overview');
 const life=lifecycleState(view);
 const step=journeyAction(view,'manager',{verificationRecorded});
 const status=presentedStatus(view,{verificationRecorded});
 const brief=journeyBrief(view,{verificationRecorded});
 const documents=presentDocuments(view?.documents||[]);
 const events=presentEvents(view?.events||[],view?.context?.asset);
 const hypotheses=view?.hypotheses?.length?view.hypotheses:view?.availableHypotheses||[];
 const record=[...brief.known,...brief.records,...(brief.note?[brief.note]:[])];
 return <section aria-label="Investigation summary">
  <h1>Investigations</h1>
  {view?.title?<div className="ekas-invest-head"><p className="ekas-case-title">{view.title}</p><p>{impactLine(view)}</p><p>Status: {status}</p><p>Owner: {life.owner}</p>{record.length>0&&<div className="ekas-journey-record" aria-label="What this step records">{record.map((line,index)=>line==='Guardrails'||line==='Guardrail results'?<p key={index} className="ekas-guardrail-label"><strong>{line}</strong></p>:/^(Quality|Energy|Safety):/.test(line)?<p key={index} className={'ekas-guardrail'+( /\bPassed\b/.test(line)?' ekas-status-passed':/\bFailed\b/.test(line)?' ekas-status-failed':/\bPending\b|pending/.test(line)?' ekas-status-pending':'')}>{line}</p>:<p key={index}>{line}</p>)}</div>}<p data-next-action><strong>Next:</strong> {step.next||step.label}</p>{step.command&&onAdvance&&<button type="button" className="ekas-next-cta" data-next-cta disabled={!!advancing} onClick={onAdvance}>{step.label}</button>}</div>:<p>No investigation is open. Ask a question in Chat.</p>}
  {narrow?<label className="ekas-tabs-mobile">Section<select aria-label="Investigation section" value={tab} onChange={e=>setTab(e.target.value as Tab)}>{tabs.map(name=><option key={name}>{name}</option>)}</select></label>:<div className="ekas-tabs" role="tablist" aria-label="Investigation sections">{tabs.map(name=><button key={name} type="button" role="tab" aria-selected={tab===name} onClick={()=>setTab(name)}>{name}</button>)}</div>}
  {tab==='Overview'&&<div role="tabpanel" className="ekas-overview">{(()=>{const sections=overviewCopy(view,{verificationRecorded});return <><h2>Known</h2><ul>{sections.known.map(item=><li key={item}>{item}</li>)}</ul>{sections.unknown.length>0&&<><h2>Not yet known</h2><ul>{sections.unknown.map(item=><li key={item}>{item}</li>)}</ul></>}<h2>Next decision</h2><ul><li>{sections.next}</li></ul></>})()}</div>}
  {tab==='Evidence'&&<div role="tabpanel"><h2>Documents</h2>{documents.length?documents.map(item=><p key={item.key}>{item.line}</p>):<p>No documents on this investigation.</p>}<h2>Events</h2>{events.length?events.map(line=><p key={line}>{line}</p>):<p>No events on this investigation.</p>}<h2>Hypotheses</h2>{hypotheses.length?hypotheses.map(h=><p key={h.id}>{h.description||h.id}{h.status?' · '+h.status:''}</p>):<p>No hypotheses on this investigation.</p>}</div>}
  {tab==='Action'&&<div role="tabpanel"><p>{actionPlain(view?.action?.status)}</p><p><strong>Next:</strong> {step.label}</p></div>}
  {tab==='Verification'&&<div role="tabpanel"><p>{verificationPlain(view?.verification?.status,verificationRecorded)}</p><p>{sustainPlain(view?.sustain?.status)}</p></div>}
  <div role="tabpanel" hidden={tab!=='History'}>{children}</div>
 </section>;
}
