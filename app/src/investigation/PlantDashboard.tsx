import {impactLine,journeyAction,presentedStatus} from './plantPresentation';

type Metric={value?:number|boolean|null;unit?:string};
type View={title?:string;caseId?:string;cycle?:number;context?:{plant?:string;line?:string;asset?:string;job?:string;part?:string;revision?:string};goal?:{actual?:number|null;target?:number|null;gap?:number|null;unit?:string|null}|null;metrics?:{good?:number;down?:number;oee?:Metric;qualityLoss?:Metric;speedLoss?:Metric};bridge?:(number|null)[]|null;contributors?:{line?:string;asset?:string;job?:string;gap?:number|null}[]|null;verification?:{status?:string}|null;owner?:{accepted?:string|null;requested?:string|null}|null;action?:{status?:string}|null;sustain?:{status?:string}|null;hypotheses?:unknown[]|null}|null|undefined;

function amount(value:number|boolean|null|undefined,digits=1){
 if(typeof value!=='number'||!Number.isFinite(value))return 'Unavailable';
 return Number(value).toLocaleString('en-US',{maximumFractionDigits:digits,minimumFractionDigits:Number.isInteger(Number(value))?0:digits});
}

/** Operational view of the accepted case. It does not keep a separate dashboard state. */
export function PlantDashboard({view,verificationRecorded,onAsk,onInvestigate,onEvidence}:{view:View;verificationRecorded?:boolean;onAsk?:()=>void;onInvestigate?:()=>void;onEvidence?:()=>void}){
 if(!view?.title||!view.context)return <section aria-label="Plant dashboard"><p>Ask a question in Chat to open a supplied case. This dashboard follows that case.</p></section>;
 const ctx=view.context;
 const goal=view.goal;
 const metrics=view.metrics;
 const bridge=view.bridge||[];
 const names=['Theoretical capacity','Downtime','Speed residual','Final non-good','Good output'];
 const contributors=(view.contributors||[]).filter(item=>item.gap!=null).slice(0,4);
 const status=presentedStatus(view,{verificationRecorded});
 const step=journeyAction(view,'manager',{verificationRecorded});
 const next=step.next||step.label;
 return <section aria-label="Plant dashboard">
  <p>{[ctx.plant,ctx.line,ctx.asset,ctx.job].filter(Boolean).join(' · ')}{ctx.part?` · ${ctx.part} ${ctx.revision||''}`:''}</p>
  <h2>What is happening</h2>
  <p>{view.title}. {impactLine(view)}.</p>
  <h2>Where is the loss</h2>
  <ul className="ekas-scorecard-cards">
   <li><p>Production versus plan</p><p>{goal?.actual==null?'Unavailable':`${amount(goal.actual,0)} against ${amount(goal.target,0)} ${goal.unit||'units'}`}</p></li>
   <li><p>OEE</p><p>{metrics?.oee?.value==null?'Unavailable':`${amount(metrics.oee.value)}%`}</p></li>
   <li><p>Downtime</p><p>{metrics?.down==null?'Unavailable':`${amount(metrics.down,0)} minutes`}</p></li>
   <li><p>Quality loss</p><p>{metrics?.qualityLoss?.value==null?'Unavailable':`${amount(metrics.qualityLoss.value)}%`}</p></li>
  </ul>
  {bridge.some(value=>value!=null)&&<table className="ekas-scorecard-table"><caption>Plan, actual, and loss bridge</caption><thead><tr><th>Bridge</th><th>Good-equivalent units</th></tr></thead><tbody>{names.map((name,index)=><tr key={name}><th>{name}</th><td>{amount(bridge[index],0)}</td></tr>)}</tbody></table>}
  {contributors.length>0&&<><h2>Loss contributors</h2><ul>{contributors.map(item=><li key={(item.asset||'')+(item.job||'')+(item.line||'')}>{[item.line,item.asset,item.job].filter(Boolean).join(' · ')} · {amount(item.gap,0)} units</li>)}</ul></>}
  <h2>What to investigate</h2>
  <p>{view.title}. Status: {status}. Next: {next}.</p>
  <div className="ekas-answer-actions">{onAsk&&<button type="button" onClick={onAsk}>Ask about this</button>}{onInvestigate&&<button type="button" onClick={onInvestigate}>Investigate</button>}{onEvidence&&<button type="button" onClick={onEvidence}>Show evidence</button>}</div>
 </section>;
}
