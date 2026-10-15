import {useState,type ReactNode} from 'react';
import {impactLine,lifecycleState,presentDocuments,presentEvents} from './plantPresentation';

const tabs=['Overview','Evidence','Action','Verification','History'] as const;
type Tab=typeof tabs[number];
type Hyp={id:string;description?:string;status?:string};
type Doc={id:string;version?:string|number;kind?:string;text?:string;status?:string;eligible?:boolean;controlled?:boolean};
type Ev={id:string;start?:number|null;end?:number|null;reason?:string|null;startAt?:string|null};
type ViewLike={title?:string;caseId?:string;owner?:{accepted?:string|null;requested?:string|null};goal?:{gap?:number|null;unit?:string|null}|null;action?:{status?:string};verification?:{status?:string};sustain?:{status?:string};context?:{asset?:string};documents?:Doc[];events?:Ev[];hypotheses?:Hyp[];availableHypotheses?:Hyp[]}|null|undefined;

/** Presentation only. Existing panels stay in History. */
export function PlantInvestigation({view,children}:{view:ViewLike;children:ReactNode}){
 const [tab,setTab]=useState<Tab>('Overview');
 const life=lifecycleState(view);
 const documents=presentDocuments(view?.documents||[]);
 const events=presentEvents(view?.events||[],view?.context?.asset);
 const hypotheses=view?.hypotheses?.length?view.hypotheses:view?.availableHypotheses||[];
 return <section aria-label="Investigation summary">
  <h1>Investigations</h1>
  {view?.title?<div className="ekas-invest-head"><p className="ekas-case-title">{view.title}</p><p>{impactLine(view)}</p><p>Status: {life.status}</p><p>Owner: {life.owner}</p><p data-next-action><strong>Next:</strong> {life.next}</p></div>:<p>No investigation is open. Ask a question in Chat.</p>}
  <div className="ekas-tabs" role="tablist" aria-label="Investigation sections">{tabs.map(name=><button key={name} type="button" role="tab" aria-selected={tab===name} onClick={()=>setTab(name)}>{name}</button>)}</div>
  <label className="ekas-tabs-mobile">Section<select aria-label="Investigation section" value={tab} onChange={e=>setTab(e.target.value as Tab)}>{tabs.map(name=><option key={name}>{name}</option>)}</select></label>
  {tab==='Overview'&&<div role="tabpanel"><p>{view?.title?'This is the open investigation. Use the sections for evidence, the action, verification, and the saved record.':'Open a supplied case from Chat. Nothing here is substituted from another investigation.'}</p></div>}
  {tab==='Evidence'&&<div role="tabpanel"><h2>Documents</h2>{documents.length?documents.map(line=><p key={line}>{line}</p>):<p>No documents on this investigation.</p>}<h2>Events</h2>{events.length?events.map(line=><p key={line}>{line}</p>):<p>No events on this investigation.</p>}<h2>Hypotheses</h2>{hypotheses.length?hypotheses.map(h=><p key={h.id}>{h.description||h.id}{h.status?' · '+h.status:''}</p>):<p>No hypotheses on this investigation.</p>}</div>}
  {tab==='Action'&&<div role="tabpanel"><p>{view?.action?.status?`The action is ${view.action.status}.`:'No action is open.'}</p><p><strong>Next:</strong> {life.next}</p><p>Assignment controls stay on Improvements.</p></div>}
  {tab==='Verification'&&<div role="tabpanel"><p>{view?.verification?.status?`Verification is ${view.verification.status.replaceAll('_',' ')}.`:'Verification has not started.'}</p><p>{view?.sustain?.status?`Sustainment is ${view.sustain.status}.`:'Sustainment has not started.'}</p></div>}
  <div role="tabpanel" hidden={tab!=='History'}>{children}</div>
 </section>;
}
