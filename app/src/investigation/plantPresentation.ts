import {fixtureCase} from './cases';

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function plantDayLabel(iso?:string|null){
 if(!iso)return '';
 const t=Date.parse(iso);
 if(!Number.isFinite(t))return '';
 const d=new Date(t);
 return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** The disclosed synthetic home scope. It is not an open investigation. */
export function demoPlantScope(){
 const c=fixtureCase('downtime').context;
 return {plant:c.plant,line:c.line,machine:c.asset,job:c.job,when:plantDayLabel(c.from),shift:'Day Shift'};
}

export function shiftLabel(shift?:string|null){
 if(!shift||shift.toLowerCase()==='day')return 'Day Shift';
 return shift.charAt(0).toUpperCase()+shift.slice(1)+' shift';
}

export function scopeCrumbs(parts:(string|null|undefined)[]){return parts.filter((part):part is string=>!!part).join(' › ')}

type CaseLike={title?:string;caseId?:string;owner?:{accepted?:string|null;requested?:string|null};goal?:{gap?:number|null}|null}|null|undefined;

export function plainCaseLine(v:CaseLike){
 if(!v?.title)return '';
 const state=v.owner?.accepted?'Owner accepted':'Awaiting owner acceptance';
 return `${v.title} · ${state}`;
}

export function impactLine(v:CaseLike){
 const gap=v?.goal?.gap;
 if(gap==null||!Number.isFinite(Number(gap)))return 'Plan gap is not available at this cutoff.';
 const n=Math.round(Number(gap));
 if(n>0)return `${n} good units below plan`;
 if(n<0)return `${Math.abs(n)} good units above plan`;
 return 'On the approved plan';
}

export function nextStep(v:CaseLike){
 if(v?.owner?.requested&&!v.owner.accepted)return 'Ask the requested owner to accept this assignment.';
 if(v?.caseId==='downtime')return 'Start with the feeder-jam evidence on Line 03.';
 return 'Review the evidence before choosing a change.';
}
