import knowledge from '../../inputs/knowledge-fixtures.json';
import {fixtureCase,type CaseId} from './cases';

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function plantDayLabel(iso?:string|null){
 if(!iso)return '';
 const t=Date.parse(iso);
 if(!Number.isFinite(t))return '';
 const d=new Date(t);
 return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Human snapshot. Synthetic clocks are UTC; the label says so. */
export function snapshotLabel(iso?:string|null){
 if(!iso)return 'Snapshot: Synthetic';
 const t=Date.parse(iso);
 if(!Number.isFinite(t))return `Snapshot: ${iso} · Synthetic`;
 const d=new Date(t);
 let hour=d.getUTCHours();
 const suffix=hour>=12?'PM':'AM';
 hour=hour%12||12;
 const minute=String(d.getUTCMinutes()).padStart(2,'0');
 return `Snapshot: ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${hour}:${minute} ${suffix} UTC · Synthetic`;
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

export function plainCaseLine(v:CaseLike){
 if(!v?.title)return '';
 return `${v.title} · ${lifecycleState(v).status}`;
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

export function nextStep(v:CaseLike){return lifecycleState(v).next}

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
 if(action==='authorized'&&v?.availableWork?.id)return {kind:'record-performed-work',workId:v.availableWork.id};
 if(action==='requested')return {kind:'authorize-action'};
 if(action==='recommended')return {kind:'request-authorization'};
 if(action==='rejected'||action==='failed')return null;
 if(hypotheses)return {kind:'recommend-action'};
 const hypothesisId=v?.availableHypotheses?.[0]?.id;
 return hypothesisId?{kind:'add-hypothesis',hypothesisId}:null;
}

export function overviewCopy(v:(CaseLike&{events?:{id:string}[]|null;hypotheses?:unknown[]|null})|null|undefined){
 if(!v?.title)return 'Open a supplied case from Chat. Nothing here is substituted from another investigation.';
 const life=lifecycleState(v);
 const stops=(v.events||[]).filter(event=>/^stop-/i.test(event.id)).length;
 const hypotheses=v.hypotheses?.length||0;
 return [impactLine(v),`Status is ${life.status}.`,`Owner is ${life.owner}.`,stops?`${stops.toLocaleString('en-US')} stops are recorded.`:'',hypotheses?`${hypotheses.toLocaleString('en-US')} hypotheses are recorded.`:'No hypothesis is recorded.'].filter(Boolean).join(' ');
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
