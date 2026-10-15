import {qaNamespace} from './platform/isolatedQa';
import {fixtureNamespace} from './platform/fixtureSelection';
import {answer,type MetricKey} from './model';
import {resultEligibility} from './runtime';
export type Variant='A'|'B'|'C'|'D'|'E'|'Main';
export type TaskId='feeder'|'shift';
export const tasks:[{id:TaskId,title:string,prompt:string,scope:string,metric:MetricKey,description:string},{id:TaskId,title:string,prompt:string,scope:string,metric:MetricKey,description:string}]=[
 {id:'feeder',title:'Investigate feeder stops',prompt:'Why feeder jams?',scope:'Line 03',metric:'oee',description:'Read the stop evidence and decide the next step for CASE-003.'},
 {id:'shift',title:'Review the shift exception',prompt:'Which line is losing the most output?',scope:'Plant',metric:'production',description:'Find the plan miss and inspect the exact job exposure.'}
];
export function taskFromPrompt(text:string):TaskId|null{const q=text.trim().toLowerCase();return /feeder|jams|feeder stops/.test(q)?'feeder':/which line|most output|shift exception|output gap/.test(q)?'shift':null;}
export function taskOperation(id:TaskId,asOf:string,condition:string,correctedScope?:string){const task=tasks.find(t=>t.id===id)!;const eligibility=resultEligibility(condition,asOf);const scope=correctedScope||task.scope;return {...task,scope,eligibility,answer:eligibility.display?(eligibility.status==='stale'?eligibility.label+'. ':'')+answer(task.prompt,scope,asOf,task.metric):null};}
export function namespaceFor(variant:Variant){return 'northworks.guided-v1-'+variant.toLowerCase()+'.';}
export const variant:Variant='Main';
export function reviewStoragePrefix(path:string){return path.startsWith('/ekas-review/')?'template-review.':'';}
function reviewPrefix(){return reviewStoragePrefix(typeof window==='undefined'?'':window.location.pathname||'');}
function storageRoot(v:Variant=variant){const path=typeof window==='undefined'?'':window.location.pathname||'';return qaNamespace(path)?qaNamespace(path)+namespaceFor(v):namespaceFor(v)+reviewPrefix();}
export const namespaceKey=(name:string)=>storageRoot()+storageMode()+fixtureNamespace(typeof window==='undefined'?'':window.location.search)+name;
export function ownsStorageKey(key:string,v:Variant=variant){const prefix=storageRoot(v)+storageMode(),context=fixtureNamespace(typeof window==='undefined'?'':window.location.search);return context?key.startsWith(prefix+context):key.startsWith(prefix)&&!key.slice(prefix.length).startsWith('fixture.');}
export type Route={task:TaskId|null,page:string,scope:string};
const panes:Record<string,string>={summary:'Explore',evidence:'Knowledge',decision:'Improvements',metrics:'Metrics',readiness:'Decision support'};
export function routeFromUrl(search:string):Route{const p=new URLSearchParams(search);const task=p.get('task');if(!tasks.some(t=>t.id===task))return {task:null,page:panes[p.get('pane')||'']||'Home',scope:['Plant','Line 01','Line 02','Line 03'].includes(p.get('scope')||'')?p.get('scope')!:'Plant'};const selected=tasks.find(t=>t.id===task)!;const scope=p.get('scope');return {task:task as TaskId,page:panes[p.get('pane')||'summary']||'Explore',scope:['Plant','Line 01','Line 02','Line 03'].includes(scope||'')?scope!:selected.scope};}
export function routeUrl(route:Route){if(!route.task&&route.page==='Home')return '';const p=new URLSearchParams({...(route.task?{task:route.task}:{}),pane:Object.entries(panes).find(([,value])=>value===route.page)?.[0]||'summary',scope:route.scope});return '?'+p.toString();}
export function appendTurn<T extends {q:string,scope:string,asOf:string,status?:string}>(turns:T[],turn:T){const last=turns.at(-1);return last&&last.q===turn.q&&last.scope===turn.scope&&last.asOf===turn.asOf&&last.status===turn.status?turns:[...turns,turn];}

export function caseScopeEligibility(scope:string){return {allowed:scope==='Line 03',reason:'CASE-003, FEED-03 and its controlled sources apply only to Line 03. No compatible controlled evidence or improvement action is supplied for '+scope+'. Return deliberately to Line 03 to inspect that separate case.'};}
export function comparisonSemantics(metric:MetricKey){const definitions:Record<string,{title:string,unit:string,max?:number,plan?:number}>={production:{title:'Production vs plan',unit:'%',plan:100},oee:{title:'OEE by line',unit:'%',max:100},downtime:{title:'Downtime by line',unit:'min'},qualityLoss:{title:'Quality loss by line',unit:'%',max:100}};const d=definitions[metric]||{title:metric,unit:'units'};return {...d,column:d.title+' ('+d.unit+')'};}

function storageMode(){if(typeof window==='undefined')return '';const p=new URLSearchParams(window.location.search),run=demoRunId(window.location.search);return run?'showme-v2.'+run+'.':p.has('practice')?'practice.':'';}

export function demoRunId(search:string){const run=new URLSearchParams(search).get('demonstration');return run&&/^[a-z0-9-]{1,64}$/i.test(run)?run:null;}

export function ownsGuidedResetKey(key:string){return ownsStorageKey(key)&&!['retained.','training-service.','canonical-gap-layout.','manufacturing-service.','manufacturing-layout.','investigation.'].some(prefix=>key.startsWith(namespaceKey(prefix)))}
