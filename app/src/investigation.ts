import type {TaskId} from './experience';
export type InvestigationStep={id:string,parentId?:string,question?:string,result?:string,task:TaskId,scope:string,page:string,metric:string,view:string,asOf:string,label:string};
export function appendStep(steps:InvestigationStep[],step:InvestigationStep){const last=steps.at(-1);return last&&['parentId','task','scope','page','metric','view','asOf'].every(k=>last[k as keyof InvestigationStep]===step[k as keyof InvestigationStep])?steps:[...steps,step]}
export function stepLabel(page:string,scope:string){return (page==='Knowledge'?'Inspect evidence':page==='Improvements'?'Review next action':'Explore result')+' · '+scope}

export function safeWorkspaceRead(raw:string|null){try{const x=JSON.parse(raw||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
