import {useState,type ReactNode} from 'react';
import {impactLine,nextStep,plainCaseLine} from './plantPresentation';

const tabs=['Overview','Evidence','Action','Verification','History'] as const;
type Tab=typeof tabs[number];
type Hyp={id:string;description?:string;status?:string};
type ViewLike={title?:string;caseId?:string;owner?:{accepted?:string|null;requested?:string|null};goal?:{gap?:number|null}|null;action?:{status?:string};verification?:{status?:string};sustain?:{status?:string};documents?:{id:string;kind?:string;text?:string;eligible?:boolean}[];events?:{id:string;reason?:string}[];hypotheses?:Hyp[];availableHypotheses?:Hyp[]}|null;

/** Presentation only. Existing panels stay in History. */
export function PlantInvestigation({view,children}:{view:ViewLike;children:ReactNode}){
 const [tab,setTab]=useState<Tab>('Overview');
 const documents=view?.documents||[],events=view?.events||[],hypotheses=view?.hypotheses?.length?view.hypotheses:view?.availableHypotheses||[];
 return <section aria-label="Investigation summary">
  <h1>Investigations</h1>
  {view?.title?<><p className="ekas-case-line">{view.title}</p><p>{impactLine(view)}</p><p data-case-state>{plainCaseLine(view)}</p><p>Owner: {view.owner?.accepted?`${view.owner.accepted} accepted`:'Awaiting owner acceptance'}.</p><p><strong>Next:</strong> {nextStep(view)}</p></>:<p>No investigation is open. Ask a question in Chat.</p>}
  <div className="ekas-tabs" role="tablist" aria-label="Investigation sections">{tabs.map(name=><button key={name} type="button" role="tab" aria-selected={tab===name} onClick={()=>setTab(name)}>{name}</button>)}</div>
  {tab==='Overview'&&<div role="tabpanel"><p>{view?.title?'This is the open investigation. Use the sections below for evidence, the action, verification, and the saved record.':'Open a supplied case from Chat. Nothing here is substituted from another investigation.'}</p></div>}
  {tab==='Evidence'&&<div role="tabpanel"><h2>Documents</h2>{documents.length?documents.map((d,i)=><p key={d.id+'-'+i}>{d.id}{d.kind?' · '+d.kind:''}{d.eligible===false?' · not current':''}</p>):<p>No documents on this investigation.</p>}<h2>Events</h2>{events.length?events.map(e=><p key={e.id}>{e.id}{e.reason?' · '+e.reason:''}</p>):<p>No events on this investigation.</p>}<h2>Hypotheses</h2>{hypotheses.length?hypotheses.map(h=><p key={h.id}>{h.description||h.id}{h.status?' · '+h.status:''}</p>):<p>No hypotheses on this investigation.</p>}</div>}
  {tab==='Action'&&<div role="tabpanel"><p>{view?.action?.status?`The action is ${view.action.status}.`:'No action is open.'}</p><p>{nextStep(view)}</p><p>Assignment controls stay on Improvements.</p></div>}
  {tab==='Verification'&&<div role="tabpanel"><p>{view?.verification?.status?`Verification is ${view.verification.status.replaceAll('_',' ')}.`:'Verification has not started.'}</p><p>{view?.sustain?.status?`Sustainment is ${view.sustain.status}.`:'Sustainment has not started.'}</p></div>}
  <div role="tabpanel" hidden={tab!=='History'}>{children}</div>
 </section>;
}
