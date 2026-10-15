import scenario from '../../inputs/scenario-fixture.json';
import knowledge from '../../inputs/knowledge-fixtures.json';
import maintenance from '../../inputs/maintenance-fixture.json';
import jobs from '../../inputs/production-jobs-fixture.json';
import authored from '../../inputs/northworks-investigation-v1.json';
export const investigationFixture=authored;
export const FIXTURE='northworks-investigation-v1';
export const conditions=['complete','missing_target','missing_good','missing_events','missing_quality','missing_document','stale','overlapping_events','unknown_speed','zero_exposure','zero_loss','wrong_revision','empty_scope','late_correction','no_improvement','worse_outcome','insufficient_sustain'] as const;
export type Condition=typeof conditions[number];
export const startingRecords=['draft','rejected','failed','performed','missing_proof','conflicting_proof','review_ready'] as const;
export type StartingRecord=typeof startingRecords[number];
export const clocks=['2026-10-06T14:45:00Z','2026-10-06T15:15:00Z','2026-10-06T15:30:00Z','2026-10-20T15:15:00Z','2026-10-27T14:00:00Z','2026-11-03T14:00:00Z'] as const;
export type Interval={id:string;start:number;end:number;reason?:string};
export type Command={kind:string;[key:string]:unknown};
export type Investigation={schemaVersion:1;fixtureVersion:typeof FIXTURE;condition:Condition;startingRecord:StartingRecord;scope:{version:number;plant:'Northworks';line:'Line 03';asset:'FEED-03';job:'JOB-8303';part:'NW-A';revision:'P2'|'P1';operation:'OP-030';from:'2026-10-06T06:00:00Z';to:'2026-10-06T14:00:00Z'};asOf:string;goal:typeof authored.goal;hypotheses:{id:string;text:string;evidenceIds:string[];status:'proposed'|'supported_by_inspection'|'refuted';causalStatus:'unverified'}[];action:{id:'NW-ACT-003';owner:string;ownerAccepted:boolean;dueAt:'2026-10-06T16:00:00Z';status:'draft'|'requested'|'authorized'|'rejected'|'failed'|'performed';reason:string;record:string;confirmation:string;performedAt:string;expectedMinutes:30;expectedShifts:10;effectiveness:0.8;costUsd:900;authorizationId:string};safetyReviewed:boolean;operationalAccepted:boolean;sustain:{id:string;at:string;jamMinutes:number;eligible:boolean}[];history:{key:string;fingerprint:string;asOf:string;kind:string;statement:string}[];captures:{id:string;condition:Condition;asOf:string;analysis:Analysis}[];synthetic:true;notDispatched:true;notGranted:true;financiallyValidated:false};
export type Contributor={job:string;asset:string;line:string;part:string;revision:string;operation:string;plannedMin:number;downMin:number;good:number;target:number;gap:number;downPct:number;speedUnits:number;qualityUnits:number;sourceId:string};
export type Analysis={status:'observed'|'missing_input'|'stale'|'invalid'|'no_data';reasons:string[];goal:{actual:number;target:number;gap:number;attainment:number}|null;bridge:(number|null)[];timeBridge:(number|null)[];contributors:Contributor[];stopReasons:Record<string,number>;events:(Interval&{sourceId:string;job:string;knownAt:string;observedStart:string;observedEnd:string})[];cutoff:string;sourceIds:string[];intervalNotice:string};
const INITIAL=clocks[0],qualityData=knowledge as any,maintenanceData=maintenance as any;
export function createInvestigation(condition:Condition='complete',startingRecord:StartingRecord='draft'):Investigation{
 if(!conditions.includes(condition)||!startingRecords.includes(startingRecord))throw Error('Unsupported declared synthetic fixture');
 const c:Investigation={schemaVersion:1,fixtureVersion:FIXTURE,condition,startingRecord,scope:{version:1,plant:'Northworks',line:'Line 03',asset:'FEED-03',job:'JOB-8303',part:'NW-A',revision:condition==='wrong_revision'?'P1':'P2',operation:'OP-030',from:'2026-10-06T06:00:00Z',to:'2026-10-06T14:00:00Z'},asOf:INITIAL,goal:structuredClone(authored.goal),hypotheses:[],action:{id:'NW-ACT-003',owner:'Maya Chen',ownerAccepted:false,dueAt:'2026-10-06T16:00:00Z',status:'draft',reason:'',record:'',confirmation:'',performedAt:'',expectedMinutes:30,expectedShifts:10,effectiveness:0.8,costUsd:900,authorizationId:''},safetyReviewed:false,operationalAccepted:false,sustain:[],history:[],captures:[],synthetic:true,notDispatched:true,notGranted:true,financiallyValidated:false};
 if(startingRecord!=='draft'){
  c.action.ownerAccepted=true;c.hypotheses=[{id:'H-1',text:'Guide wear or setup may contribute; inspect against applicable standard.',evidenceIds:['NOTE-2401:s2'],status:'proposed',causalStatus:'unverified'}];
  c.action.status=startingRecord==='rejected'?'rejected':startingRecord==='failed'?'failed':startingRecord==='missing_proof'?'authorized':'performed';
  c.action.authorizationId='DEMO-AUTH-003';c.action.reason='Preseeded synthetic record; bounded like-for-like restoration only; EC-003 unreleased.';
  if(['performed','conflicting_proof','review_ready'].includes(startingRecord)){c.action.record=startingRecord==='conflicting_proof'?'WRONG-ASSET-WO':'DEMO-WO-003';c.action.confirmation='Fixture operator confirmation · fictional performer';c.action.performedAt='2026-10-06T15:10:00Z';c.asOf=startingRecord==='review_ready'?clocks[3]:clocks[1];}
  c.history=[{key:'fixture-seed',fingerprint:JSON.stringify({condition,startingRecord}),kind:'fixture-seed',asOf:c.asOf,statement:'Explicit preseeded synthetic '+startingRecord+' record. No action dispatched or permission granted.'}];
 }
 return c;
}
/** Half-open production-window union. Exact duplicate IDs deduplicate; contradictory reuse is invalid. */
export function reconcileIntervals(intervals:Interval[],window:[number,number]=[0,480]):number{
 const ids=new Map<string,Interval>(),spans:Interval[]=[];
 if(!window.every(Number.isFinite)||window[1]<=window[0])throw Error('Invalid production window');
 for(const x of intervals){if(!x.id||![x.start,x.end].every(Number.isFinite)||x.end<x.start)throw Error('Invalid interval');const old=ids.get(x.id);if(old){if(JSON.stringify(old)!==JSON.stringify(x))throw Error('Conflicting event identity');continue;}ids.set(x.id,x);const start=Math.max(window[0],x.start),end=Math.min(window[1],x.end);if(end>start)spans.push({...x,start,end});}
 spans.sort((a,b)=>a.start-b.start||a.end-b.end);let total=0,start=0,end=0,active=false;
 for(const x of spans){if(!active){start=x.start;end=x.end;active=true;}else if(x.start<=end)end=Math.max(end,x.end);else{total+=end-start;start=x.start;end=x.end;}}return total+(active?end-start:0);
}
export function sourceEvents(c:Investigation){
 const base=Date.parse(c.scope.from),toMin=(s:string)=>(Date.parse(s)-base)/60000;
 const e=scenario.line_03_stop_events.map(x=>({id:x.id,start:toMin(x.start),end:toMin(x.end),reason:x.reason,sourceId:x.source,job:x.production_job_id,knownAt:'2026-10-06T14:00:00Z',observedStart:x.start,observedEnd:x.end}));
 if(c.condition==='overlapping_events'){e.push({...e[0]});e.push({...e[0],id:'DEMO-NESTED-STOP',start:e[0].start+2,end:e[0].end-2,observedStart:'2026-10-06T06:20:00Z',observedEnd:'2026-10-06T06:28:00Z'});e.push({...e[0],id:'DEMO-CLIPPED-STOP',start:-5,end:0,observedStart:'2026-10-06T05:55:00Z',observedEnd:c.scope.from});}
 if(c.condition==='late_correction'&&c.asOf>='2026-10-06T15:20:00Z')e.push({id:'DEMO-LATE-STOP-1',start:0,end:6,reason:'other_stops',sourceId:'northworks-investigation-v1:late-event-v2',job:'JOB-8303',knownAt:'2026-10-06T15:20:00Z',observedStart:c.scope.from,observedEnd:'2026-10-06T06:06:00Z'});
 return c.condition==='zero_loss'||c.condition==='missing_events'?[]:e;
}
export function applicableDocuments(c:Investigation){return qualityData.documents.map((d:any)=>{let status=d.lifecycle==='superseded'?'Historical superseded':d.lifecycle==='uncontrolled'?'Uncontrolled conflicting':d.lifecycle==='retained_record'?'Open retained record':'Applicable synthetic approved';if((d.known_at||d.available_from||'')>c.asOf)status='Unavailable at selected cutoff';if(d.scope?.product_revision!==c.scope.revision)status='Wrong revision';if(d.lifecycle==='approved'&&(!d.effectivity?.from||d.effectivity.from>c.asOf||d.effectivity.to_exclusive&&c.asOf>=d.effectivity.to_exclusive))status='Effectivity unavailable';if(c.condition==='missing_document'&&d.document_id==='SW-030')status='Missing applicable standard work';return {...d,applicability:status,eligible:status==='Applicable synthetic approved'};});}
export function analyzeInvestigation(c:Investigation):Analysis{
 const events=sourceEvents(c),reasons:string[]=[];let status:Analysis['status']='observed';const rows=jobs.jobs.map(j=>({...j}));
 if(c.condition==='zero_loss')for(const r of rows){r.down_min=0;r.run_min=r.planned_min;r.total_units=r.planned_min/.5;r.good_units=r.total_units;}
 if(c.condition==='late_correction'&&c.asOf>='2026-10-06T15:20:00Z'){rows[2].down_min+=6;rows[2].run_min-=6;}
 const contributors:Contributor[]=rows.map(j=>({job:j.job_id,asset:j.asset_id,line:j.line_id.replace('line-','Line '),part:j.product_id,revision:j.product_revision,operation:j.operation_id,plannedMin:j.planned_min,downMin:j.down_min,good:j.good_units,target:j.plan_good_units,gap:j.plan_good_units-j.good_units,downPct:100*j.down_min/j.planned_min,speedUnits:j.run_min/.5-j.total_units,qualityUnits:j.total_units-j.good_units,sourceId:j.exposure_source})).sort((a,b)=>b.gap-a.gap||a.job.localeCompare(b.job));
 const sum=(key:keyof typeof rows[number])=>rows.reduce((n,r)=>n+Number(r[key]),0),planned=sum('planned_min'),down=sum('down_min'),run=sum('run_min'),total=sum('total_units'),good=sum('good_units');
 const bridge:(number|null)[]=[planned/.5,-down/.5,-(run/.5-total),-(total-good),good].map(v=>Object.is(v,-0)?0:v);let goal:Analysis['goal']={actual:good,target:c.goal.value,gap:c.goal.value-good,attainment:100*good/c.goal.value};
 if(c.condition==='missing_target'){goal=null;status='missing_input';reasons.push('Declared goal value/source missing; illustrative80% threshold is not substituted.');}
 if(['missing_good','missing_quality'].includes(c.condition)){goal=null;bridge[3]=null;bridge[4]=null;status='missing_input';reasons.push('Accepted good-count / quality-disposition input missing; no zero fill.');}
 if(c.condition==='missing_events'){bridge[1]=null;status='missing_input';reasons.push('Complete event feed missing; downtime is not assumed zero. Other supplied production totals remain readable.');}
 if(c.condition==='unknown_speed'){bridge[2]=null;status='missing_input';reasons.push('Produced-count/ideal-cycle evidence for speed residual missing; no neighboring measure substituted.');}
 if(c.condition==='stale'){status='stale';reasons.push('Event stream last known10:00UTC; selected cutoff14:00UTC. Frozen values are provisional historical inputs, not eligible for action or accepted result.');}
 if(c.condition==='zero_exposure'){status='invalid';goal=null;bridge.fill(null);reasons.push('Zero planned exposure; rate and capacity unavailable, no division by zero.');}
 if(c.scope.revision!=='P2'){status='invalid';goal=null;bridge.fill(null);reasons.push('No compatible NW-A P1 cohort or controlled documents. Correct explicitly to P2.');}
 if(c.condition==='empty_scope'){status='no_data';goal=null;bridge.fill(null);reasons.push('No eligible production records in this declared empty cohort.');}
 if(c.condition==='missing_document')reasons.push('Applicable SW-030 unavailable; numeric observations can be inspected but action request is blocked.');
 const priority=['feeder_jams','changeover','other_stops'];const stopReasons:Record<string,number>={feeder_jams:0,changeover:0,other_stops:0};
 for(let t=0;t<480;t++){const matching=events.filter(e=>e.start<=t&&e.end>=t+1);const reason=priority.find(r=>matching.some(e=>e.reason===r||(r==='other_stops'&&e.reason==='other')));if(reason)stopReasons[reason]++;}
 const union=reconcileIntervals(events);if(events.length&&union!==rows[2].down_min){status='invalid';reasons.push('Event union does not reconcile to selected job downtime; no accepted loss bridge.');bridge[1]=null;}
 return {status,reasons,goal,bridge,timeBridge:bridge.map(v=>v===null?null:v*.5),contributors:status==='no_data'||c.scope.revision!=='P2'?[]:contributors,stopReasons,events,cutoff:c.scope.to,sourceIds:[...rows.map(r=>r.exposure_source),...new Set(events.map(e=>e.id))],intervalNotice:'Half-open intervals clipped to06:00–14:00; exact duplicate IDs count once; overlaps/nesting form a union. Reason allocation uses declared priority feeder jams→changeover→other stops. Other lines have supplied aggregate downtime, not interval-union proof.'};
}
const eligibleShift=(s:any,asOf:string)=>s.eligible&&s.coverage>=.95&&s.known_at<=asOf&&s.product_id==='NW-A'&&s.product_revision==='P2'&&s.asset_id==='FEED-03'&&s.operation_id==='OP-030'&&s.planned_min===480&&s.ideal_cycle_min===.5&&s.definition_version==='OEE-demo-v1';
export function measureInvestigation(c:Investigation){
 const before=scenario.case.baseline.shifts.filter(s=>eligibleShift(s,c.asOf));let after=scenario.case.post.shifts.filter(s=>eligibleShift(s,c.asOf)).map(s=>({...s}));
 if(c.condition==='no_improvement'||c.condition==='worse_outcome')after=after.map((s,i)=>({...s,feeder_jam_min:scenario.case.baseline.shifts[i].feeder_jam_min+(c.condition==='worse_outcome'?10:0),good_units:scenario.case.baseline.shifts[i].good_units-(c.condition==='worse_outcome'?10:0)}));
 const proof=c.action.status==='performed'&&c.action.record==='DEMO-WO-003'&&!!c.action.confirmation&&c.action.performedAt==='2026-10-06T15:10:00Z'&&c.asOf>=clocks[1];
 if(!proof)after=[];
 const sum=(a:any[],k:string)=>a.reduce((n,s)=>n+Number(s[k]),0),b=before.length===10?sum(before,'feeder_jam_min')/10:null,p=after.length===10?sum(after,'feeder_jam_min')/10:null;
 const beforeOee=before.length===10?100*.5*sum(before,'good_units')/sum(before,'planned_min'):null,afterOee=after.length===10?100*.5*sum(after,'good_units')/sum(after,'planned_min'):null;
 const valid=analyzeInvestigation(c).status==='observed',improved=b!==null&&p!==null&&p<b&&p<=30;
 const status=!proof?'awaiting_work':!valid?'ineligible':after.length<10?'measuring':!improved?'no_improvement':!c.safetyReviewed||!c.operationalAccepted?'needs_review':'accepted';
 return {status,baselineCount:before.length,postCount:after.length,beforeJam:b,afterJam:p,absoluteChange:b===null||p===null?null:p-b,relativeChange:b===null||p===null||b===0?null:(p-b)/b*100,beforeOee,afterOee,oeeGain:beforeOee===null||afterOee===null?null:afterOee-beforeOee,outputGain:after.length===10&&before.length===10?sum(after,'good_units')-sum(before,'good_units'):null,before,after,proof,causalStatus:'unverified',financiallyValidated:false};
}
export function actionBenefit(){const recoverable=30*10*6860/3900;return {recoverableUnits:recoverable,expectedUnits:recoverable*.8,grossOpportunityUsd:recoverable*.8*12,costUsd:900,horizon:'10 eligible shifts',financiallyValidated:false};}
export function sustainStatus(c:Investigation){const eligible=c.sustain.filter(s=>s.eligible);if(eligible.length>=2&&eligible.at(-1)!.jamMinutes>45&&eligible.at(-2)!.jamMinutes>45)return 'reopened';return c.operationalAccepted&&eligible.length>=5&&eligible.slice(0,5).every(s=>s.jamMinutes<=45)?'sustained':'insufficient';}
export function applyCommand(previous:Investigation,command:Command,key:string):Investigation{
 const fingerprint=JSON.stringify(command),old=previous.history.find(x=>x.key===key);if(old){if(old.fingerprint!==fingerprint)throw Error('Idempotency conflict');return structuredClone(previous);}
 if(!key||key.length>100||previous.history.length>=100)throw Error('Command identity/history limit');
 const c=structuredClone(previous),text=(x:unknown)=>typeof x==='string'&&x.trim().length>0&&x.length<=1000,analysis=analyzeInvestigation(c);
 const requireReady=()=>{if(analysis.status!=='observed'||!analysis.goal||c.scope.revision!=='P2')throw Error('Current result is not eligible: '+(analysis.reasons.join(' ')||analysis.status));};
 switch(command.kind){
  case 'capture-analysis':c.captures.push({id:'capture-'+(c.captures.length+1),condition:c.condition,asOf:c.asOf,analysis:structuredClone(analysis)});break;
  case 'correct-scope':if(c.condition!=='wrong_revision'||c.action.status!=='draft')throw Error('No declared correction for this scope');c.scope.revision='P2';c.scope.version++;break;
  case 'advance-clock':if(!clocks.includes(command.asOf as any)||String(command.asOf)<c.asOf)throw Error('Select explicit allowed later synthetic snapshot');c.asOf=String(command.asOf);break;
  case 'record-hypothesis':{if(!text(command.text)||!Array.isArray(command.evidenceIds)||!command.evidenceIds.length||!command.evidenceIds.every(x=>maintenanceData.source_notes.some((n:any)=>(n.known_at||n.available_from)<=c.asOf&&n.sentences.some((s:any)=>s.id===x))))throw Error('Exact known maintenance sentence references required');c.hypotheses.push({id:'H-'+(c.hypotheses.length+1),text:String(command.text),evidenceIds:command.evidenceIds as string[],status:'proposed',causalStatus:'unverified'});break;}
  case 'disposition-hypothesis':{const h=c.hypotheses.find(x=>x.id===command.hypothesisId);if(!h||!['supported_by_inspection','refuted'].includes(String(command.status))||!text(command.reason))throw Error('Hypothesis disposition needs an exact hypothesis and reason');if(command.status==='supported_by_inspection'&&c.asOf<clocks[1])throw Error('Inspection evidence unavailable before explicit later snapshot');h.status=command.status as any;break;}
  case 'accept-owner':if(!['Maya Chen','Demo CI engineer'].includes(String(command.owner))||c.action.status!=='draft')throw Error('Select an exact available fictional owner before requesting');c.action.owner=String(command.owner);c.action.ownerAccepted=true;break;
  case 'request-action':requireReady();if(!c.action.ownerAccepted||!c.hypotheses.length||c.action.status!=='draft'||!applicableDocuments(c).some((d:any)=>d.document_id==='SW-030'&&d.eligible))throw Error('Accepted owner, traceable hypothesis and applicable standard work required');c.action.status='requested';break;
  case 'approve':requireReady();if(c.action.status!=='requested'||!text(command.reason))throw Error('Requested action and recorded bounded reason required');c.action.status='authorized';c.action.authorizationId='DEMO-AUTH-003';c.action.reason=String(command.reason)+' · Local fixture approval only; no real permission or dispatch.';break;
  case 'reject':if(!['requested','authorized'].includes(c.action.status)||!text(command.reason))throw Error('Pending local action and rejection reason required');c.action.status='rejected';c.action.reason=String(command.reason);break;
  case 'record-failure':if(c.action.status!=='authorized'||!text(command.reason))throw Error('Authorized planned record and failure reason required');c.action.status='failed';c.action.reason=String(command.reason);break;
  case 'perform':requireReady();if(c.action.status!=='authorized'||c.asOf<clocks[1]||command.record!=='DEMO-WO-003'||!text(command.confirmation))throw Error('Separate approval, exact known work artifact and operator confirmation required');c.action.status='performed';c.action.record='DEMO-WO-003';c.action.confirmation=String(command.confirmation);c.action.performedAt='2026-10-06T15:10:00Z';break;
  case 'review-safety':if(!measureInvestigation(c).proof||measureInvestigation(c).postCount<10||c.asOf<clocks[3])throw Error('Eligible performed work and complete10shift exposure required');c.safetyReviewed=true;break;
  case 'accept-result':{requireReady();const m=measureInvestigation(c);if(!m.proof||m.postCount<10||!c.safetyReviewed||m.status==='no_improvement')throw Error('Improved eligible endpoint and separate safety evidence required');c.operationalAccepted=true;break;}
  case 'observe-sustain':{requireReady();if(!c.operationalAccepted)throw Error('Accepted operational result required');const dates=['2026-10-21','2026-10-22','2026-10-23','2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-11-02','2026-11-03'];const values=[28,26,30,25,27,25,30,29,55,58];dates.forEach((d,i)=>{const at=d+'T14:00:00Z',id='NW-SUSTAIN-'+d;if(at<=c.asOf&&!c.sustain.some(s=>s.id===id)&&(c.condition!=='insufficient_sustain'||i<2))c.sustain.push({id,at,jamMinutes:values[i],eligible:true});});break;}
  default:throw Error('Unsupported command; causal confirmation and real dispatch are unavailable');
 }
 c.history.push({key,fingerprint,asOf:c.asOf,kind:command.kind,statement:'Synthetic '+command.kind+'; original observations and controlled sources unchanged.'});return c;
}
export function validateInvestigation(value:unknown):value is Investigation{
 try{const c=value as Investigation,b=createInvestigation(c.condition,c.startingRecord);if(c.schemaVersion!==1||c.fixtureVersion!==FIXTURE||c.synthetic!==true||c.notDispatched!==true||c.notGranted!==true||c.financiallyValidated!==false||!clocks.includes(c.asOf as any)||!Number.isSafeInteger(c.scope.version)||c.scope.version<1||!['P2','P1'].includes(c.scope.revision))return false;
  if(JSON.stringify({...c.scope,version:1,revision:b.scope.revision})!==JSON.stringify(b.scope)||JSON.stringify(c.goal)!==JSON.stringify(b.goal))return false;
  if(!['draft','requested','authorized','rejected','failed','performed'].includes(c.action.status)||!['Maya Chen','Demo CI engineer'].includes(c.action.owner)||typeof c.action.ownerAccepted!=='boolean'||typeof c.safetyReviewed!=='boolean'||typeof c.operationalAccepted!=='boolean'||c.action.expectedMinutes!==30||c.action.expectedShifts!==10||c.action.effectiveness!==.8||c.action.costUsd!==900||c.action.id!=='NW-ACT-003'||c.action.dueAt!==b.action.dueAt)return false;
  for(const k of ['reason','record','confirmation','performedAt','authorizationId'] as const)if(typeof c.action[k]!=='string'||c.action[k].length>2000)return false;
  if(!Array.isArray(c.hypotheses)||c.hypotheses.length>30||!c.hypotheses.every(h=>typeof h.id==='string'&&typeof h.text==='string'&&h.text.length>0&&h.text.length<=1000&&h.causalStatus==='unverified'&&['proposed','supported_by_inspection','refuted'].includes(h.status)&&Array.isArray(h.evidenceIds)&&h.evidenceIds.length>0&&h.evidenceIds.every(id=>maintenanceData.source_notes.some((n:any)=>n.sentences.some((s:any)=>s.id===id)))))return false;
  if(!Array.isArray(c.history)||c.history.length>100||new Set(c.history.map(x=>x.key)).size!==c.history.length||!c.history.every(x=>typeof x.key==='string'&&typeof x.fingerprint==='string'&&typeof x.kind==='string'&&typeof x.statement==='string'&&clocks.includes(x.asOf as any)))return false;
  if(!Array.isArray(c.captures)||c.captures.length>50||!c.captures.every(x=>typeof x.id==='string'&&conditions.includes(x.condition)&&clocks.includes(x.asOf as any)&&x.analysis&&typeof x.analysis.status==='string'))return false;
  if(!Array.isArray(c.sustain)||c.sustain.length>10||!c.sustain.every(x=>typeof x.id==='string'&&Number.isFinite(x.jamMinutes)&&x.jamMinutes>=0&&typeof x.eligible==='boolean'&&/^2026-/.test(x.at)))return false;
  let replay=createInvestigation(c.condition,c.startingRecord);
  for(const entry of c.history){if(entry.key==='fixture-seed')continue;const command=JSON.parse(entry.fingerprint);if(command.kind!==entry.kind)return false;replay=applyCommand(replay,command,entry.key);}
  return JSON.stringify(replay)===JSON.stringify(c);
 }catch{return false;}
}
export const evidenceNotes=maintenanceData.source_notes;
