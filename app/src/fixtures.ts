import scenarioData from '../inputs/scenario-fixture.json';
import knowledgeData from '../inputs/knowledge-fixtures.json';
import maintenanceData from '../inputs/maintenance-fixture.json';
import changeData from '../inputs/sme-change-fixture.json';
import jobsData from '../inputs/production-jobs-fixture.json';
import temporalData from '../inputs/scenario-temporal-policy.json';
export const scenario=scenarioData;
export const knowledge:any=knowledgeData,maintenance:any=maintenanceData,engineering:any=changeData.change,jobs=jobsData,temporal=temporalData;
export const snapshotChoices=[{id:'initial',label:'Initial review · before restoration',at:scenario.scenario_policy.initial_as_of,caseKey:'approved'},{id:'intervention',label:'Simulated restoration recorded',at:scenario.scenario_policy.intervention_snapshot_as_of,caseKey:'performed'},{id:'pending',label:'Measurement complete · review pending',at:scenario.scenario_policy.verification_pending_review_as_of,caseKey:'measuring'},{id:'accepted',label:'Observed operational result accepted',at:scenario.scenario_policy.operational_accepted_as_of,caseKey:'accepted'},{id:'sustained',label:'Five-shift sustain window accepted',at:scenario.scenario_policy.sustained_as_of,caseKey:'sustained'},{id:'reopened',label:'Recurrence · case reopened',at:scenario.scenario_policy.reopened_as_of,caseKey:'reopened'}];
export function known(record:any,asOf:string){const at=record.known_at||record.available_from||record.recorded_at;if(!at||at>asOf)return false;const refs=record.depends_on||[];return refs.every((id:string)=>{const r=temporal.record_availability.find(x=>x.id===id);return r&&known(r,asOf)})}
export const visibleIds=(asOf:string)=>temporal.record_availability.filter(r=>known(r,asOf)).map(r=>r.id);
export function documentStatus(doc:any,asOf:string,revision='P2'){if(!known(doc,asOf))return 'Unavailable at this snapshot';if(doc.lifecycle==='superseded')return 'Historical · superseded';if(doc.lifecycle==='uncontrolled')return 'Conflicting · uncontrolled';if(doc.lifecycle==='retained_record')return 'Open retained investigation record';if(doc.scope.product_revision!==revision)return 'Applicability mismatch';if(!doc.effectivity.from||doc.effectivity.from>asOf||(doc.effectivity.to_exclusive&&asOf>=doc.effectivity.to_exclusive))return 'Effectivity unresolved';return 'Current applicable · simulated approval'}
export const stopMinutes=(event:{start:string,end:string})=>(Date.parse(event.end)-Date.parse(event.start))/60000;
export const jobBurden=(job:typeof jobs.jobs[number])=>job.down_min/job.planned_min*100;
export function exportObject(name:string,value:unknown){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

/** An arbitrary observer clock is distinct from a prebuilt dated scenario. */
export function scenarioSelection(asOf:string,rehearsal:boolean){if(rehearsal)return {value:'rehearsal',label:'Local cycle rehearsal · explicit clock '+asOf,custom:true};const exact=snapshotChoices.find(x=>x.at===asOf);return exact?{value:exact.id,label:exact.label,custom:false}:{value:'current-clock',label:'Current simulated clock · '+asOf.replace('T',' ').replace('Z',' UTC'),custom:true};}
