import {useEffect,useState,type ReactNode} from 'react';
import {impactLine,journeyAction,lifecycleState,overviewCopy,presentDocuments,presentEvents} from './plantPresentation';

const tabs=['Overview','Evidence','Action','Verification','History'] as const;
type Tab=typeof tabs[number];
type Hyp={id:string;description?:string;status?:string};
type Doc={id:string;version?:string|number;kind?:string;text?:string;status?:string;eligible?:boolean;controlled?:boolean};
type Ev={id:string;start?:number|null;end?:number|null;reason?:string|null;startAt?:string|null};
type ViewLike={title?:string;caseId?:string;asOf?:string;owner?:{accepted?:string|null;requested?:string|null};goal?:{gap?:number|null;unit?:string|null}|null;action?:{status?:string;performedId?:string|null};verification?:{status?:string};sustain?:{status?:string;observations?:{id:string}[]};context?:{asset?:string};documents?:Doc[];events?:Ev[];hypotheses?:Hyp[];availableHypotheses?:Hyp[];availableWork?:{id?:string}|null}|null|undefined;

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
 const documents=presentDocuments(view?.documents||[]);
 const events=presentEvents(view?.events||[],view?.context?.asset);
 const hypotheses=view?.hypotheses?.length?view.hypotheses:view?.availableHypotheses||[];
 return <section aria-label="Investigation summary">
  <h1>Investigations</h1>
  {view?.title?<div className="ekas-invest-head"><p className="ekas-case-title">{view.title}</p><p>{impactLine(view)}</p><p>Status: {life.status}</p><p>Owner: {life.owner}</p><p data-next-action><strong>Next:</strong> {step.label}</p>{step.command&&onAdvance&&<button type="button" className="ekas-next-cta" data-next-cta disabled={!!advancing} onClick={onAdvance}>{step.label}</button>}</div>:<p>No investigation is open. Ask a question in Chat.</p>}
  {narrow?<label className="ekas-tabs-mobile">Section<select aria-label="Investigation section" value={tab} onChange={e=>setTab(e.target.value as Tab)}>{tabs.map(name=><option key={name}>{name}</option>)}</select></label>:<div className="ekas-tabs" role="tablist" aria-label="Investigation sections">{tabs.map(name=><button key={name} type="button" role="tab" aria-selected={tab===name} onClick={()=>setTab(name)}>{name}</button>)}</div>}
  {tab==='Overview'&&<div role="tabpanel"><p>{overviewCopy(view)}</p></div>}
  {tab==='Evidence'&&<div role="tabpanel"><h2>Documents</h2>{documents.length?documents.map(item=><p key={item.key}>{item.line}</p>):<p>No documents on this investigation.</p>}<h2>Events</h2>{events.length?events.map(line=><p key={line}>{line}</p>):<p>No events on this investigation.</p>}<h2>Hypotheses</h2>{hypotheses.length?hypotheses.map(h=><p key={h.id}>{h.description||h.id}{h.status?' · '+h.status:''}</p>):<p>No hypotheses on this investigation.</p>}</div>}
  {tab==='Action'&&<div role="tabpanel"><p>{view?.action?.status?`The action is ${view.action.status}.`:'No action is open.'}</p><p><strong>Next:</strong> {step.label}</p></div>}
  {tab==='Verification'&&<div role="tabpanel"><p>{view?.verification?.status?`Verification is ${view.verification.status.replaceAll('_',' ')}.`:'Verification has not started.'}</p><p>{view?.sustain?.status?`Sustainment is ${view.sustain.status}.`:'Sustainment has not started.'}</p></div>}
  <div role="tabpanel" hidden={tab!=='History'}>{children}</div>
 </section>;
}
