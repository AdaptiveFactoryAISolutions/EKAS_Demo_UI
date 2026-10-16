import knowledge from '../../inputs/knowledge-fixtures.json';
import {fixtureCase,type CaseId} from './cases';
import {clocks} from './model';

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function plantDayLabel(iso?:string|null){
 if(!iso)return '';
 const parsed=Date.parse(iso);
 const t=Number.isFinite(parsed)?parsed:Date.parse(iso.slice(0,10)+'T00:00:00Z');
 if(!Number.isFinite(t))return '';
 const d=new Date(t);
 return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Human snapshot for the plant view. The exact timestamp stays in technical details. */
export function snapshotLabel(iso?:string|null){
 if(!iso)return 'Snapshot: Synthetic';
 const t=Date.parse(iso);
 if(!Number.isFinite(t))return 'Snapshot: Synthetic';
 const d=new Date(t);
 let hour=d.getUTCHours();
 const suffix=hour>=12?'PM':'AM';
 hour=hour%12||12;
 const minute=String(d.getUTCMinutes()).padStart(2,'0');
 return `Snapshot: ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${hour}:${minute} ${suffix} · Synthetic`;
}

/** The period a plant leader should see for the current case clock. */
export function visiblePeriod(iso?:string|null){
 const day=plantDayLabel(iso);
 const stamp=iso||'';
 if(stamp.startsWith('2026-10-20'))return `Follow-up measurement period · ${day}`;
 if(stamp.startsWith('2026-10-27'))return `Sustainment check · ${day}`;
 if(stamp.startsWith('2026-11-03'))return `Later-shift check · ${day}`;
 if(/^2026-10-06T1[5-9]/.test(stamp))return `Completed-repair check · ${day}`;
 return day;
}

/** Plant wording for authored phrases that would otherwise read as analyst notes. */
export function plantPhrase(text:string){
 return text
  .replace(/unique terminal disposition recorded/gi,'a final disposition was recorded for the part')
  .replace(/a passing final count is not FPY/gi,'final good output and first-pass yield are different measures')
  .replace(/\bPrimary endpoint\b/g,'Main measure')
  .replace(/\bEC-003\b/g,'Engineering change 003');
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

type Owner={accepted?:string|null;requested?:string|null};
type CaseLike={title?:string;caseId?:string;owner?:Owner|null;goal?:{gap?:number|null;unit?:string|null}|null;action?:{status?:string}|null;verification?:{status?:string}|null;sustain?:{status?:string}|null;hypotheses?:unknown[]|null}|null|undefined;

export function roleName(role?:string|null){
 if(!role)return '';
 return role.split(/[-_]/).filter(Boolean).map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(' ');
}

/** Status, owner, and the next step follow the saved owner, action, verification, and sustainment. */
export function lifecycleState(v:CaseLike){
 const requested=v?.owner?.requested||null;
 const accepted=v?.owner?.accepted||null;
 const action=v?.action?.status||'';
 const verification=v?.verification?.status||'';
 const sustain=v?.sustain?.status||'';
 const hypotheses=v?.hypotheses?.length||0;
 if(accepted){
  const owner=`${roleName(accepted)} accepted`;
  if(sustain==='recurrence')return {status:'Recurrence recorded',owner,next:'Open a new cycle'};
  if(sustain==='sustained')return {status:'Result sustained',owner,next:'Watch for recurrence'};
  if(action==='performed'){
   if(verification==='accepted')return {status:'Result accepted',owner,next:'Record sustainment'};
   if(verification==='awaiting_acceptance')return {status:'Awaiting result acceptance',owner,next:'Accept the measured result'};
   if(verification==='safety_review_required')return {status:'Safety review required',owner,next:'Review safety'};
   if(verification==='guardrail_failed')return {status:'Guardrail failed',owner,next:'Review the failed guardrail'};
   if(verification==='no_improvement')return {status:'No measured improvement',owner,next:'Review the measurement'};
   if(verification==='measuring')return {status:'Measuring the result',owner,next:'Wait for the eligible shifts'};
   if(verification==='ineligible')return {status:'Measurement ineligible',owner,next:'Resolve the measurement block'};
   return {status:'Work recorded',owner,next:'Record verification'};
  }
  if(action==='authorized')return {status:'Action authorized',owner,next:'Record performed work'};
  if(action==='requested')return {status:'Awaiting authorization',owner,next:'Authorize the action'};
  if(action==='recommended')return {status:'Action recommended',owner,next:'Request authorization'};
  if(action==='rejected')return {status:'Action rejected',owner,next:'Revise the recommendation'};
  if(action==='failed')return {status:'Action failed',owner,next:'Record the failure'};
  return {status:'Owner accepted',owner,next:hypotheses?'Recommend the action':'Record a hypothesis'};
 }
 if(requested){
  const name=roleName(requested);
  return {status:`Awaiting ${name.toLowerCase()} acceptance`,owner:`${name} — not yet accepted`,next:'Accept ownership'};
 }
 return {status:'No owner requested',owner:'Not assigned',next:'Request an owner'};
}

export function plainCaseLine(v:CaseLike,facts?:{verificationRecorded?:boolean}){
 if(!v?.title)return '';
 return `${v.title} · ${presentedStatus(v,facts)}`;
}

export function impactLine(v:CaseLike){
 const gap=v?.goal?.gap;
 if(gap==null||!Number.isFinite(Number(gap)))return 'Plan gap is not available at this cutoff.';
 const n=Math.round(Number(gap));
 const unit=v?.goal?.unit||'units';
 if(n>0)return `${n.toLocaleString('en-US')} ${unit} below plan`;
 if(n<0)return `${Math.abs(n).toLocaleString('en-US')} ${unit} above plan`;
 return 'On the approved plan';
}

export function nextStep(v:CaseLike){const step=journeyAction(v);return step.next||step.label}

/** The role this case can actually assign, taken from its acceptance records. */
function assignableOwner(caseId?:string|null){
 if(caseId!=='downtime'&&caseId!=='speed'&&caseId!=='quality')return null;
 const list=fixtureCase(caseId as CaseId).assignmentAcceptances;
 if(!list?.length)return null;
 return list.find(item=>item.owner&&!String(item.owner).includes('backup'))?.owner||list[0].owner||null;
}

type CommandView=CaseLike&{caseId?:string|null;availableHypotheses?:{id:string}[]|null;availableWork?:{id?:string}|null};

/** The command that performs the current next step. The visible label stays lifecycleState().next. */
export function nextLifecycleCommand(v:CommandView|null|undefined):{kind:string;owner?:string;hypothesisId?:string;workId?:string;evidenceId?:string}|null{
 const requested=v?.owner?.requested||null;
 const accepted=v?.owner?.accepted||null;
 const action=v?.action?.status||'';
 const verification=v?.verification?.status||'';
 const sustain=v?.sustain?.status||'';
 const hypotheses=v?.hypotheses?.length||0;
 const hypothesisId=v?.availableHypotheses?.[0]?.id;
 if(!hypotheses&&hypothesisId)return {kind:'add-hypothesis',hypothesisId};
 if(!accepted&&!requested){
  const owner=assignableOwner(v?.caseId);
  return owner?{kind:'request-assignment',owner}:null;
 }
 if(!accepted&&requested)return {kind:'accept-assignment'};
 if(sustain==='recurrence')return {kind:'reopen'};
 if(sustain==='sustained')return null;
 if(action==='performed'){
  if(verification==='accepted')return {kind:'record-sustain'};
  if(verification==='awaiting_acceptance')return {kind:'accept-result'};
  if(verification==='safety_review_required'&&v?.caseId)return {kind:'review-safety',evidenceId:v.caseId+'-SAFETY-01'};
  if(verification==='awaiting_work'||!verification)return {kind:'record-verification'};
  return null;
 }
 if(action==='authorized')return v?.availableWork?.id?{kind:'record-performed-work',workId:v.availableWork.id}:null;
 if(action==='requested')return {kind:'authorize-action'};
 if(action==='recommended')return {kind:'request-authorization'};
 if(action==='rejected'||action==='failed')return null;
 if(hypotheses)return {kind:'recommend-action'};
 return null;
}

type JourneyActor='supervisor'|'maintenance'|'manager'|'safety'|'viewer';
type JourneyCommand={kind:string;owner?:string;hypothesisId?:string;workId?:string;evidenceId?:string;asOf?:string};
type JourneyView=CommandView&{asOf?:string|null;verification?:{status?:string}|null;sustain?:{status?:string;observations?:{id:string}[]}|null;action?:{status?:string;performedId?:string|null}|null};

function suppliedCase(caseId?:string|null){
 if(caseId!=='downtime'&&caseId!=='speed'&&caseId!=='quality')return null;
 return fixtureCase(caseId);
}
function unrecordedSustain(v:JourneyView){
 const fixture=suppliedCase(v.caseId);
 if(!fixture||!v.asOf)return [];
 const recorded=new Set((v.sustain?.observations||[]).map(item=>item.id));
 return fixture.sustain.observations.filter(item=>item.eligible&&item.at<=v.asOf!&&!recorded.has(item.id));
}
function safetyRecordId(v:JourneyView){
 const fixture=suppliedCase(v.caseId);
 if(!fixture||!v.asOf)return null;
 const performed=v.action?.performedId;
 const review=fixture.safetyReviews.find(item=>item.status==='pass'&&item.knownAt<=v.asOf!&&(!performed||item.workId===performed));
 return review?.id||null;
}

function clockAtOrAfter(iso?:string|null){
 if(!iso)return null;
 return clocks.find(clock=>clock>=iso)||null;
}

/** The next authored period a plant leader is waiting on. Intermediate clocks stay internal. */
export function followUpStep(v:JourneyView|null|undefined):{label:string;asOf:string;note:string}|null{
 if(!v?.asOf)return null;
 const fixture=suppliedCase(v.caseId);
 if(!fixture)return null;
 const asOf=v.asOf;
 const action=v.action?.status||'';
 const verification=v.verification?.status||'';
 const sustain=v.sustain?.status||'';
 const later=(iso:string|undefined,label:string)=>{
  const at=clockAtOrAfter(iso);
  return at&&at>asOf?{label,asOf:at,note:followNote(at,label)}:null;
 };
 if(action==='authorized'&&!v.availableWork)return later(fixture.work.knownAt,'Check the completed repair');
 if(action==='performed'&&(verification==='measuring'||verification==='awaiting_work'))return later((fixture.verification as {plannedMeasurementAt?:string}).plannedMeasurementAt||'2026-10-20T15:15:00Z','Check results after two weeks');
 if(verification==='accepted'&&sustain==='insufficient'){
  const next=fixture.sustain.observations.find(item=>item.eligible&&item.at>asOf);
  return later(next?.at,'Check whether the result held');
 }
 if(sustain==='sustained'&&!unrecordedSustain(v).length){
  const next=fixture.sustain.observations.find(item=>item.eligible&&item.at>asOf);
  return later(next?.at,'Check the later shifts');
 }
 return null;
}

/** Status a plant leader can reconcile with the next step. */
export function presentedStatus(v:CaseLike|null|undefined,facts?:{verificationRecorded?:boolean}){
 const life=lifecycleState(v);
 const verification=v?.verification?.status||'';
 if(verification==='safety_review_required'&&!facts?.verificationRecorded)return 'Measurement recorded';
 if(verification==='safety_review_required')return 'Safety review pending';
 if(verification==='awaiting_acceptance')return 'Verification ready for acceptance';
 return life.status;
}

/** The next visible step and the command that performs it. Waiting steps use plant language. */
export function journeyAction(v:JourneyView|null|undefined,session:JourneyActor='manager',facts?:{verificationRecorded?:boolean}):{label:string;next?:string;command:JourneyCommand|null;actor:JourneyActor}{
 const life=lifecycleState(v);
 const follow=followUpStep(v);
 const followCommand=follow?{label:follow.label,command:{kind:'advance-time',asOf:follow.asOf},actor:session}:null;
 const action=v?.action?.status||'';
 const verification=v?.verification?.status||'';
 const sustain=v?.sustain?.status||'';
 if(action==='authorized'&&!v?.availableWork&&followCommand)return followCommand;
 if(action==='performed'&&(verification==='measuring'||verification==='awaiting_work')&&followCommand)return followCommand;
 if(verification==='safety_review_required'&&v){
  const evidenceId=safetyRecordId(v);
  if(evidenceId)return {label:'Review safety',next:'Complete safety review',command:{kind:'review-safety',evidenceId},actor:session==='safety'?'safety':'manager'};
  if(followCommand)return followCommand;
 }
 if(sustain==='sustained'&&v){
  if(unrecordedSustain(v).length)return {label:'Record sustainment',command:{kind:'record-sustain'},actor:session};
  if(followCommand)return followCommand;
 }
 if(verification==='accepted'&&sustain==='insufficient'&&v&&!unrecordedSustain(v).length&&followCommand)return followCommand;
 const command=nextLifecycleCommand(v);
 if(!command)return {label:life.next,command:null,actor:session};
 if(command.kind==='accept-assignment')return {label:life.next,command,actor:'maintenance'};
 if(command.kind==='accept-result')return {label:'Review verification result',next:'Review result',command,actor:session};
 if(command.kind==='reopen')return {label:'Reopen the investigation',command,actor:session};
 if(command.kind==='add-hypothesis')return {label:'Record this hypothesis',command,actor:session};
 if(command.kind==='recommend-action')return {label:'Recommend this action',command,actor:session};
 if(command.kind==='review-safety'&&v){
  const evidenceId=safetyRecordId(v);
  if(!evidenceId)return followCommand||{label:life.next,command:null,actor:session};
  return {label:'Review safety',next:'Complete safety review',command:{...command,evidenceId},actor:session==='safety'?session:'manager'};
 }
 return {label:life.next,command,actor:session};
}

/** Commands for the visible step. A safety review first records the measurement already on screen. */
export function journeyCommands(v:JourneyView|null|undefined,session:JourneyActor='manager',facts?:{verificationRecorded?:boolean}):JourneyCommand[]{
 const step=journeyAction(v,session,facts);
 if(!step.command)return [];
 if(step.command.kind==='review-safety'&&!facts?.verificationRecorded)return [{kind:'record-verification'},step.command];
 return [step.command];
}

export function plantMoment(iso?:string|null){
 if(!iso)return '';
 const t=Date.parse(iso);
 if(!Number.isFinite(t))return iso;
 const d=new Date(t);
 let hour=d.getUTCHours();
 const suffix=hour>=12?'PM':'AM';
 hour=hour%12||12;
 const minute=String(d.getUTCMinutes()).padStart(2,'0');
 return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}, ${hour}:${minute} ${suffix}`;
}

function endpointName(endpoint?:string){
 if(endpoint==='jamMin')return 'Feeder-jam minutes';
 if(endpoint==='speedLossMin')return 'Speed-loss minutes';
 if(endpoint==='fpy')return 'First-pass yield';
 return endpoint||'Main measure';
}

function amount(value:number|boolean|null|undefined,digits=2){
 if(typeof value!=='number'||!Number.isFinite(value))return 'unavailable';
 return Number(value).toLocaleString('en-US',{maximumFractionDigits:digits,minimumFractionDigits:Number.isInteger(Number(value))?0:Math.min(digits,2)});
}

/** Plant sentence after a demo follow-up. No raw clock and no simulation mechanics. */
export function demoClockSentence(iso?:string|null){
 const day=plantDayLabel(iso);
 const stamp=iso||'';
 const period=stamp.startsWith('2026-10-06')?'the completed-repair check':stamp.startsWith('2026-10-20')?'the follow-up measurement period':stamp.startsWith('2026-10-27')?'the sustainment check':stamp.startsWith('2026-11-03')?'the later-shift check':'the next measurement period';
 return `The demo is now at ${period}${day?` on ${day}`:''}. Only evidence known by then is available. Existing investigation history and performed-work records stay as recorded.`;
}

function followNote(iso:string,label:string){
 const day=plantDayLabel(iso);
 const when=day?` on ${day}`:'';
 const period=/completed repair/.test(label)?'the completed-repair record':/two weeks|eligible shifts/.test(label)?'the follow-up measurement period':/result held/.test(label)?'the sustainment window':/later shifts/.test(label)?'the later shifts':'the next measurement period';
 return `This check uses ${period}${when}. Existing investigation history and performed-work records stay as recorded.`;
}

function evidenceSentence(documents:{id?:string;text?:string}[]|null|undefined,id:string){
 for(const doc of documents||[]){
  const text=doc.text||'';
  const line=text.split('\n').find(part=>part.includes(id))||(doc.id===id?text.split('\n')[0]:'');
  if(!line)continue;
  const sentence=line.replace(id+':','').replace(id,'').trim();
  return sentence.length>180?sentence.slice(0,177)+'…':sentence;
 }
 return '';
}

/** Why a hypothesis is plausible, using only authored support and the current controlled record. */
export function plausibleLine(caseId?:string|null,supportingIds?:string[]){
 const fixture=suppliedCase(caseId);
 if(!fixture)return 'The current evidence does not yet establish why this is plausible.';
 const reasons=new Map<string,string>();
 for(const shift of [fixture.current,...fixture.shifts]){
  const evidence=shift.reasonEvidence;
  if(evidence?.id&&evidence.text)reasons.set(evidence.id,evidence.text.trim());
 }
 const parts:string[]=[];
 let usedReason=false;
 for(const id of supportingIds||[]){
  const reason=reasons.get(id);
  if(reason){usedReason=true;if(!parts.includes(reason))parts.push(reason);continue;}
  const sentence=evidenceSentence(fixture.documents,id);
  if(sentence&&!parts.includes(sentence))parts.push(sentence);
 }
 if(usedReason){
  const controlled=fixture.documents.find(doc=>doc.controlled&&doc.status==='approved'&&doc.kind==='SW');
  const sentence=(controlled?.text||'').split('\n').map(line=>line.trim()).filter(Boolean)[0]||'';
  const clipped=sentence.length>180?sentence.slice(0,177)+'…':sentence;
  if(clipped&&!parts.some(part=>part.includes(clipped.slice(0,40))))parts.push(`Current controlled record: ${clipped.replace(/\.+$/,'')}.`);
 }
 return plantPhrase(parts.length?parts.join(' '):'The current evidence does not yet establish why this is plausible.');
}

function limitAmount(value:number){
 return Number(value).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:0});
}
function energyAmount(value:number){
 return Number(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function resultWord(status?:string|null){
 if(status==='pass')return 'Passed';
 if(status==='fail')return 'Failed';
 return 'Pending';
}
function spokenUnit(unit?:string){
 return (unit||'').replace(/^min\b/,'minutes').trim();
}
/** A governed number with its unit. Percents stay attached to the number. */
export function measureAmount(value:number,unit?:string,digits=2){
 const shown=amount(value,digits);
 if(unit?.startsWith('%'))return `${shown}%`;
 return spokenUnit(unit)?`${shown} ${spokenUnit(unit)}`:shown;
}
export function seriesWithUnit(values:number[],unit?:string){
 const parts=values.map(value=>unit?.startsWith('%')?`${amount(value)}%`:amount(value));
 const list=parts.length<2?parts.join(''):parts.length===2?`${parts[0]} and ${parts[1]}`:`${parts.slice(0,-1).join(', ')} and ${parts[parts.length-1]}`;
 return !unit?.startsWith('%')&&spokenUnit(unit)?`${list} ${spokenUnit(unit)}`:list;
}
export function reopenSentence(endpoint:string|undefined,direction:string|undefined,value:number,unit:string|undefined,count:number){
 const name=endpointName(endpoint).replace(/^Main measure$/,'the main measure').toLowerCase();
 const verb=direction==='higher'?'falls below':'goes above';
 const times=count===2?'two':count.toLocaleString('en-US');
 return `Reopen if ${name} ${verb} ${measureAmount(value,unit)} for ${times} consecutive eligible shifts.`;
}

function recurrenceReason(v:{asOf?:string|null;plan?:{endpoint?:string;direction?:string;unit?:string}|null},fixture:NonNullable<ReturnType<typeof suppliedCase>>){
 const plan=v.plan;
 if(!plan)return '';
 const watch=reopenSentence(plan.endpoint,plan.direction,fixture.sustain.threshold,plan.unit,fixture.sustain.consecutiveRecurrence);
 const recent=fixture.sustain.observations.filter(item=>item.eligible&&v.asOf&&item.at<=v.asOf).slice(-fixture.sustain.consecutiveRecurrence).map(item=>item.value);
 const latest=recent.length?` Latest eligible shifts: ${seriesWithUnit(recent,plan.unit)}.`:'';
 return `Reason: ${watch}${latest}`;
}

type BriefView=JourneyView&{title?:string;cycle?:number;documents?:{id?:string;text?:string}[]|null;plan?:{endpoint?:string;direction?:string;target?:number;unit?:string;requiredShifts?:number;qualityMaxPct?:number;energyMaxKwhPerGood?:number;qualityMaxWorseningPp?:number;energyMaxWorseningPct?:number}|null;hypotheses?:{id?:string;description?:string;test?:string;supportingEvidenceIds?:string[]}[]|null;action?:{status?:string;description?:string;performedId?:string|null;performedAt?:string|null;performer?:string|null;confirmation?:string|null}|null;verification?:{status?:string;before?:number|null;after?:number|null;outputGain?:number|null;oeeGain?:number|null;beforeMetrics?:{oee?:{value?:number|boolean|null}};afterMetrics?:{oee?:{value?:number|boolean|null}};guardrails?:{quality?:{status?:string};energy?:{status?:string}};safetyPass?:boolean;causalStatus?:string}|null};

/** The manufacturing record the current step will show or save. Content comes from the case. */
export function journeyBrief(v:BriefView|null|undefined,facts?:{verificationRecorded?:boolean}):{known:string[];records:string[];note:string}{
 const known:string[]=[];
 const records:string[]=[];
 if(!v?.caseId)return {known,records,note:''};
 const fixture=suppliedCase(v.caseId);
 const step=journeyAction(v,'manager',facts);
 const kind=step.command?.kind||'';
 const follow=followUpStep(v);
 if((v.cycle&&v.cycle>1||kind==='reopen')&&fixture){
  const cycle=v.cycle&&v.cycle>1?v.cycle:2;
  known.push(`Cycle 1: Completed / historical. Cycle ${cycle}: Open after recurrence.`);
  const reason=recurrenceReason(v,fixture);
  if(reason)known.push(reason);
 }
 if(kind==='add-hypothesis'&&fixture){
  const recorded=new Set(((v.hypotheses||[]) as {id?:string}[]).map(item=>item.id));
  const hypothesis=fixture.hypotheses.find(item=>!recorded.has(item.id));
  if(hypothesis){
   known.push(`Hypothesis: ${hypothesis.description}`);
   known.push(`Why this is plausible: ${plausibleLine(v.caseId,hypothesis.supportingEvidenceIds)}`);
   records.push(`What would test it: ${hypothesis.test}`);
  }
 }
 if(['recommend-action','request-authorization','authorize-action'].includes(kind)&&fixture){
  known.push(`Recommended action: ${plantPhrase(fixture.work.description)}`);
  known.push('This is not an engineering change. The current controlled instruction remains authoritative. No unreleased engineering change is treated as approved work.');
  if(kind==='authorize-action')records.push('Approval stays separate from performed work.');
 }
 if(kind==='record-performed-work'&&fixture){
  const work=fixture.work;
  records.push(/^[A-Z]+(?:-[A-Z]+)*-WO-\d+$/.test(work.id)?`Maintenance record: ${work.id}.`:'Maintenance record for this case.');
  records.push(`Work performed: ${plantPhrase(work.description)}`);
  records.push(`Operator confirmation: ${work.confirmation}`);
  records.push(`Performed: ${plantMoment(work.performedAt)}.`);
  known.push('Approval stays separate from performed work.');
 }
 if(['record-verification','review-safety','accept-result'].includes(kind)&&v.plan){
  const plan=v.plan;
  const name=endpointName(plan.endpoint);
  const sense=plan.direction==='higher'?'at least':'at most';
  const targetText=typeof plan.target==='number'?measureAmount(plan.target,plan.unit):'unavailable';
  known.push(`Main measure: ${name}. Baseline and target use ${spokenUnit(plan.unit)||'the governed unit'}. Target: ${sense} ${targetText}. Required observations: ${plan.requiredShifts} eligible shifts.`);
  const measured=v.verification;
  known.push('Guardrails');
  if(plan.qualityMaxPct!=null)known.push(`Quality: ≤${limitAmount(plan.qualityMaxPct)}%`);
  else if(plan.qualityMaxWorseningPp!=null)known.push(`Quality: worsening ≤${limitAmount(plan.qualityMaxWorseningPp)} percentage points`);
  if(plan.energyMaxKwhPerGood!=null)known.push(`Energy: ≤${energyAmount(plan.energyMaxKwhPerGood)} kWh per good unit`);
  else if(plan.energyMaxWorseningPct!=null)known.push(`Energy: worsening ≤${limitAmount(plan.energyMaxWorseningPct)}%`);
  known.push(`Safety: ${measured?.safetyPass?'Recorded':'Pending review'}`);
  if(measured&&measured.before!=null&&measured.after!=null){
   known.push(`Observed result: ${measureAmount(measured.after,plan.unit)}. Baseline was ${measureAmount(measured.before,plan.unit)}.`);
   const beforeOee=measured.beforeMetrics?.oee?.value;
   const afterOee=measured.afterMetrics?.oee?.value;
   if(beforeOee!=null&&afterOee!=null)known.push(`Supporting OEE: ${amount(beforeOee)}% → ${amount(afterOee)}%.`);
   if(measured.outputGain!=null)known.push(`Good units: ${Number(measured.outputGain)>0?'+':''}${amount(measured.outputGain,0)} across the eligible post cohort.`);
   known.push('Guardrail results');
   known.push(`Quality: ${resultWord(measured.guardrails?.quality?.status)}`);
   known.push(`Energy: ${resultWord(measured.guardrails?.energy?.status)}`);
   known.push(`Safety: ${measured.safetyPass?'Passed':'Pending'}`);
   if(!measured.safetyPass)known.push('Safety review pending. Observed improvement is supported by the eligible comparison. Causality is not isolated. Verification cannot be accepted until the safety review is complete.');
   else if(kind==='accept-result')known.push('The safety review is recorded. Accepting the result does not isolate the cause or claim savings.');
  }
 }
 if((kind==='record-sustain'||v.sustain?.status==='sustained'||v.sustain?.status==='recurrence')&&fixture&&v.plan){
  const watch=reopenSentence(v.plan.endpoint,v.plan.direction,fixture.sustain.threshold,v.plan.unit,fixture.sustain.consecutiveRecurrence);
  const targetText=typeof v.plan.target==='number'?measureAmount(v.plan.target,v.plan.unit):'unavailable';
  known.push(`Sustain check. Target: ${endpointName(v.plan.endpoint)} ${v.plan.direction==='higher'?'at least':'at most'} ${targetText}. ${watch}`);
  const values=fixture.sustain.observations.filter(item=>item.eligible&&v.asOf&&item.at<=v.asOf).map(item=>item.value);
  if(values.length)known.push(`Recent eligible shifts: ${seriesWithUnit(values,v.plan.unit)}.`);
  if(v.sustain?.status==='sustained')known.push('Status: Sustained.');
  if(v.sustain?.status==='recurrence'&&kind!=='reopen'&&!(v.cycle&&v.cycle>1))known.push('Status: Recurrence. Cycle 1 stays completed and historical.');
 }
 if(kind==='reopen')records.push('Reopening keeps Cycle 1 completed and historical, and opens this cycle. The earlier verification is not used as proof here.');
 return {known,records,note:follow&&step.label===follow.label?follow.note:''};
}

export type OverviewSections={known:string[];unknown:string[];next:string};
/** Each fact appears once: known records, open questions, then the next decision. */
export function overviewCopy(v:(CaseLike&{events?:{id:string}[]|null;documents?:{id?:string}[]|null;hypotheses?:unknown[]|null;verification?:{status?:string}|null})|null|undefined,facts?:{verificationRecorded?:boolean}):OverviewSections{
 if(!v?.title)return {known:['Open a supplied case from Chat. Nothing here is substituted from another investigation.'],unknown:[],next:''};
 const stops=(v.events||[]).filter(event=>/^stop-/i.test(event.id)).length;
 const documents=(v.documents||[]).length;
 const hypotheses=v.hypotheses?.length||0;
 const known:string[]=[];
 if(stops)known.push(countSentence(stops,'stop','stops'));
 if(documents)known.push(`${documents.toLocaleString('en-US')} ${documents===1?'document is':'documents are'} available.`);
 if(hypotheses)known.push(countSentence(hypotheses,'hypothesis','hypotheses'));
 if(!known.length)known.push('The case is open.');
 const unknown:string[]=[];
 if(!hypotheses)unknown.push('No hypothesis has been recorded.');
 if(!v.owner?.accepted&&!v.owner?.requested)unknown.push('No owner has been assigned.');
 else if(!v.owner?.accepted)unknown.push('Owner acceptance has not been recorded.');
 const verification=v.verification?.status||'';
 if(verification==='safety_review_required')unknown.push(facts?.verificationRecorded?'The safety review is still pending.':'The safety review has not been recorded.');
 else if(verification==='awaiting_acceptance')unknown.push('The measured result has not been accepted.');
 else if(verification!=='accepted')unknown.push('The result has not been measured.');
 const step=journeyAction(v,'manager',facts);
 return {known,unknown,next:step.next||step.label};
}

function countSentence(n:number,singular:string,plural:string){
 if(n===1)return `1 ${singular} is recorded.`;
 return `${n.toLocaleString('en-US')} ${plural} are recorded.`;
}

/** Group a count. Leave years, dates, and identifiers alone. */
export function groupThousands(text:string){
 return text.replace(/(?<![\d.,-])(\d{4,})(?![\d-])(?=\s*(?:against|good|units?|below|above)\b|[.,;:])/g,n=>Number(n).toLocaleString('en-US'));
}

/** Turn a stored period such as 2026-10-06 day shift into Oct 6, 2026, day shift. */
export function humanScopeWhen(period?:string|null,shift?:string|null){
 const raw=period||'';
 const iso=raw.match(/\d{4}-\d{2}-\d{2}/);
 let day='';
 if(iso){
  const [,year,month,date]=iso[0].match(/(\d{4})-(\d{2})-(\d{2})/)||[];
  const index=Number(month)-1;
  if(MONTHS[index]&&date&&year)day=`${MONTHS[index]} ${Number(date)}, ${year}`;
 }
 const named=/night/i.test(raw)||(shift||'').toLowerCase()==='night'?'night shift':/day shift/i.test(raw)||(shift||'').toLowerCase()==='day'?'day shift':'';
 if(day&&named)return `${day}, ${named}`;
 return day||raw;
}

type DocLike={id:string;version?:string|number;kind?:string;text?:string;status?:string;eligible?:boolean;controlled?:boolean};
type EventLike={id:string;start?:number|null;end?:number|null;reason?:string|null;startAt?:string|null};

function uniqueBy<T>(items:T[],key:(item:T)=>string){
 const seen=new Set<string>();
 const out:T[]=[];
 for(const item of items){
  const id=key(item);
  if(seen.has(id))continue;
  seen.add(id);
  out.push(item);
 }
 return out;
}

function plainSentence(text?:string){
 if(!text)return '';
 const line=text.split('\n').map(part=>part.trim()).find(Boolean)||'';
 const sentence=line.split(/(?<=\.)\s/)[0]||line;
 return sentence.length>180?sentence.slice(0,177)+'…':sentence;
}

function sourceTitle(id:string,version?:string|number){
 const docs=(knowledge as {documents?:{document_id:string;revision_id:string;title?:string}[]}).documents||[];
 return docs.find(doc=>doc.document_id===id&&doc.revision_id===String(version))?.title||'';
}

function typeAndName(d:DocLike){
 const kind=d.kind||'';
 if(kind==='SW')return `Standard Work ${d.id.replace(/^SW-/,'')}`;
 if(kind==='CP')return `Control plan ${d.id.replace(/^CP-/,'')}`;
 if(kind==='PFMEA')return `Process risk ${d.id.replace(/^PFMEA-/,'')}`;
 if(kind==='NCR_8D')return 'Investigation record';
 if(kind==='uncontrolled_note'||kind==='note')return 'Technician note';
 return kind?kind.replaceAll('_',' '):'Record';
}

function statusLabel(d:DocLike){
 const status=(d.status||'').toLowerCase();
 if(status==='superseded')return 'Superseded';
 if(status==='uncontrolled'||d.controlled===false)return 'Uncontrolled';
 if(status==='retained_record')return 'Retained';
 if(d.eligible||status==='approved')return 'Current';
 if(!status)return 'Recorded';
 return status.charAt(0).toUpperCase()+status.slice(1).replaceAll('_',' ');
}

function isNote(d:DocLike){return d.kind==='note'||d.kind==='uncontrolled_note'}

function stripRecordPrefixes(text:string){
 return text.split('\n').map(line=>line.replace(/^[A-Z][A-Z0-9-]*(?::s\d+)?:\s+/,'').trim()).filter(Boolean).join(' ');
}

/** Presentation only. The stored note text is unchanged. */
function plainNote(text?:string){
 let body=stripRecordPrefixes(text||'');
 body=body.replace(/^Fictional note claims\s+/i,'');
 body=body.replace(/\s*It conflicts with SW-\d+\s+\S+\s+and has no approval or effective scope\.?/i,' It is uncontrolled and contradicts the current standard.');
 body=body.replace(/\s+/g,' ').trim();
 if(body)body=body.charAt(0).toUpperCase()+body.slice(1);
 return body;
}

function noteBody(d:DocLike){return stripRecordPrefixes(d.text||'')}

function duplicateNote(shorter:string,longer:string){
 if(!shorter||!longer)return false;
 if(shorter===longer)return true;
 if(!longer.startsWith(shorter))return false;
 const next=longer.charAt(shorter.length);
 return next===''||/[\s.]/.test(next);
}

function describe(d:DocLike){
 const title=sourceTitle(d.id,d.version);
 if(isNote(d)){
  const body=plainNote(d.text);
  if(/contradicts the current standard/.test(body))return body;
  return plainSentence(body)||title;
 }
 return title||plainSentence(d.text);
}

export function documentLine(d:DocLike){
 const description=describe(d);
 return `${typeAndName(d)} — ${statusLabel(d)}${description?' / '+description:''}`;
}

export type PresentedDocument={key:string;line:string;sources:string[]};

/** Same id, version, and text is one item. A shorter note whose text is the start of a longer note is one item. Current and superseded revisions stay. */
export function presentDocuments(docs:DocLike[]):PresentedDocument[]{
 const unique=uniqueBy(docs,d=>`${d.id}\u0000${d.version??''}\u0000${d.text||''}`);
 const notes=unique.filter(isNote);
 const ranked=[...notes].sort((a,b)=>noteBody(b).length-noteBody(a).length);
 const dropped=new Set<DocLike>();
 const extras=new Map<DocLike,DocLike[]>();
 for(const candidate of ranked){
  if(dropped.has(candidate))continue;
  const body=noteBody(candidate);
  for(const keeper of ranked){
   if(keeper===candidate||dropped.has(keeper)||noteBody(keeper).length<body.length)continue;
   if(!duplicateNote(body,noteBody(keeper)))continue;
   dropped.add(candidate);
   const list=extras.get(keeper)||[];
   list.push(candidate);
   extras.set(keeper,list);
   break;
  }
 }
 return unique.filter(d=>!dropped.has(d)).map(d=>{
  const sources=[d,...(extras.get(d)||[])].map(item=>`${item.id} · ${item.version??''}`);
  return {key:sources.join('|'),line:documentLine(d),sources};
 });
}

function reasonText(reason?:string|null){
 const words=(reason||'').split(/[_\s]+/).filter(Boolean);
 if(!words.length)return 'Recorded';
 return words.map((word,index)=>index===0?word.charAt(0).toUpperCase()+word.slice(1):word).join(' ');
}

export function eventLine(e:EventLike,asset?:string|null){
 const number=e.id.replace(/^stop-/i,'');
 const title=/^stop-/i.test(e.id)?`Stop event ${number}`:e.id;
 const duration=e.start!=null&&e.end!=null&&Number.isFinite(Number(e.end)-Number(e.start))?`${Math.round(Number(e.end)-Number(e.start))} minutes`:'';
 const when=e.startAt?plantDayLabel(e.startAt):'';
 const detail=[duration,asset||'',when].filter(Boolean).join(' · ');
 return `${title} — ${reasonText(e.reason)}${detail?' / '+detail:''}`;
}

export function presentEvents(events:EventLike[],asset?:string|null){
 return uniqueBy(events,e=>`${e.id}\u0000${e.start??''}\u0000${e.end??''}\u0000${e.reason||''}`).map(e=>eventLine(e,asset));
}
