import {canonicalAssetSyntaxQuestion} from './assetScopeInterpretation';
import {requestedScopeText as requestedScopeTextV81} from './requestOperandsV81';
import {requestedScopeText,publicationOperands} from './requestOperands';
import {isFinancialRequest} from './metricPublication';
import {caseFixtures,type CaseId} from './cases';
import {isDowntimeMetricRequest,type ConversationContext,type PresentedTurn} from './conversation';
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
export type ScopePublicationCapture={schemaVersion:1|2|3|4|5|6|7|8|9|10|11;question:string;before:ConversationContext;asOf:string;sourceDataset?:'training'};
/** Read-only request/source admission, before allocating a case or publishing.
 * Explicit unsupported axes never become a nearby dataset or current shift. */
function publicationScopeIssueV1(question:string,before:ConversationContext){
 const month=months.find(m=>new RegExp('\\b'+m+'\\b','i').test(question));
 const explicitPlant=/\bnorthworks\b/i.test(question)?'Northworks':/\bsynthetic works\b/i.test(question)?'Synthetic Works':question.match(/(?:change|switch|set) (?:the )?plant (?:to )?([A-Za-z][A-Za-z0-9-]*)/i)?.[1]||question.match(/(?:for|at) plant ([A-Za-z][A-Za-z0-9-]*)/i)?.[1];
 const opening=/investigate (?:quality|speed|downtime)|missed.*(?:goal|target)/i.test(question),monthlyMachine=/\bmachine\s*[12]\b/i.test(question),knownWrite=/^(?:simulate|advance|move (?:the )?clock|record|approve|authorize|accept|request|reopen|adopt|create|revise)\b/i.test(question);
 if(knownWrite)return null;
 const metric=/\bfpy\b|first.pass/i.test(question)?'fpy':/quality/i.test(question)?'quality':/\boee\b/i.test(question)?'oee':before.metric;
 const plant=explicitPlant||before.plant;
 if(month&&(explicitPlant==='Northworks'||opening||before.caseFocus&&!monthlyMachine))return {month,plant:explicitPlant||before.plant,metric,reason:`No matching ${explicitPlant||before.plant||'selected manufacturing'} ${metric.toUpperCase()} source is supplied for ${month}. The supplied manufacturing cases are exact dated shifts, not a whole-month cohort. Choose an explicit supplied shift or a separately named supported dataset; no October case or neighboring metric was substituted.`};
 const monthly=monthlyMachine||!opening&&!before.caseFocus&&['January','February','March'].includes(before.period);
 if(monthly&&plant&&plant!=='Monthly synthetic plant'&&!opening)return {month:month||before.period,plant,metric,reason:`No matching source is supplied for plant ${plant}, ${month||before.period}, ${metric.toUpperCase()}. Monthly machine observations belong only to Monthly synthetic plant. That dataset was not substituted for the selected plant.`};
 if(month&&!['January','February','March'].includes(month)&&monthly)return {month,plant,metric,reason:`${month} is not supplied in the monthly machine dataset. Available observation months are January, February and March; no prior or current month was substituted.`};
 return null;
}
type ScopeIssue={month?:string;plant?:string|null;metric:ConversationContext['metric'];reason:string;scope?:Partial<ConversationContext>};
/** Version2 admits explicit opening operands before openCase can apply defaults. */
function publicationScopeIssueV2(question:string,before:ConversationContext):ScopeIssue|null{
 const prior=publicationScopeIssueV1(question,before);if(prior)return prior;
 if(!/\binvestigate\b|missed.*(?:goal|target)/i.test(question))return null;
 const caseId:CaseId|null=/FORM-Q1|investigate quality|quality case/i.test(question)?'quality':/PRESS-S1|investigate speed|speed case/i.test(question)?'speed':/FEED-|production goal|investigate downtime/i.test(question)?'downtime':before.caseFocus;
 if(!caseId)return null;const source=caseFixtures[caseId].context;
 const explicit:Partial<ConversationContext>={};
 const revision=question.match(/\brevision(?: to)?\s+([A-Z]\d+)\b/i)?.[1],part=question.match(/\b(?:part|product)\s+([A-Z][A-Z0-9-]*)\b/i)?.[1],job=question.match(/\b(?:JOB-\d+|QUALITY-JOB-\d+|SPEED-JOB-\d+)\b/i)?.[0],operation=question.match(/\boperation\s+(OP-[A-Z0-9-]+)\b/i)?.[1],machine=question.match(/\b(?:FEED-\d+|FORM-[A-Z]\d+|PRESS-[A-Z]\d+)\b/i)?.[0];
 if(revision)explicit.revision=revision.toUpperCase();if(part)explicit.part=part.toUpperCase();if(job)explicit.job=job.toUpperCase();if(operation)explicit.operation=operation.toUpperCase();if(machine)explicit.machine=machine.toUpperCase();
 const mismatches=([['revision','revision'],['part','part'],['job','job'],['operation','operation'],['machine','asset']] as const).filter(([requested,provided])=>explicit[requested]!==undefined&&explicit[requested]!==source[provided]);
 if(!mismatches.length)return null;
 const scope={plant:source.plant,line:source.line,machine:source.asset,part:source.part,revision:source.revision,job:source.job,operation:source.operation,shift:'day',period:source.from.slice(0,10)+' day shift',...explicit};
 const requested=mismatches.map(([key])=>key+' '+explicit[key]).join(', ');
 return {metric:/\bfpy\b|first.pass/i.test(question)?'fpy':/quality/i.test(question)?'quality':/performance|speed/i.test(question)?'performance':before.metric,scope,reason:`Requested ${requested} is unavailable for the supplied ${source.asset} case. No exact source cohort is supplied. Opening the case cannot replace explicit operands with its default ${source.part} revision ${source.revision}, job ${source.job}, operation ${source.operation}. No neighboring result or lifecycle record was created.`};
}
/** Version3 covers every explicit case-axis label, including unregistered jobs
 * and shift/site/line synonyms. It never chooses defaults over a requested axis. */
function publicationScopeIssueV3(question:string,before:ConversationContext):ScopeIssue|null{
 const prior=publicationScopeIssueV2(question,before);if(prior)return prior;
 if(/^(?:simulate|advance|move (?:the )?clock|record|approve|authorize|accept|request|reopen|adopt|create|revise)\b/i.test(question))return null;
 const caseId:CaseId|null=/FORM-Q1|investigate quality|quality case/i.test(question)?'quality':/PRESS-S1|investigate speed|speed case/i.test(question)?'speed':/FEED-|production goal|investigate downtime/i.test(question)?'downtime':before.caseFocus;if(!caseId)return null;
 const source=caseFixtures[caseId].context,explicit:Partial<ConversationContext>={};
 const job=question.match(/\b(?:job|work order)(?: to)?\s+([A-Z][A-Z0-9-]*)\b/i)?.[1],shift=question.match(/\b(day|night)[ -]*shift\b/i)?.[1]||question.match(/\bshift(?: to)?\s+([A-Z][A-Z0-9-]*)\b/i)?.[1],plant=question.match(/\b(?:at |for |change |switch |set )?(?:the )?plant(?: to)?\s+([A-Z][A-Z0-9-]*)\b/i)?.[1],line=question.match(/\bline(?: to)?\s+0?(\d+)\b/i)?.[1];
 if(job&&!/^(was|is|were|running|context|notes|history)$/i.test(job))explicit.job=job.toUpperCase();if(shift)explicit.shift=shift.toLowerCase();if(plant&&!/^(operating|review|audit|capacity|performance|metrics|summary)$/i.test(plant))explicit.plant=/^synthetic$/i.test(plant)&&/synthetic works/i.test(question)?'Synthetic Works':plant;if(line)explicit.line='Line '+line.padStart(2,'0');
 const mismatches=(['job','shift','plant','line'] as const).filter(k=>explicit[k]!==undefined&&explicit[k]!== (k==='shift'?'day':source[k]));if(!mismatches.length)return null;
 const scope={plant:source.plant,line:source.line,machine:source.asset,part:source.part,revision:source.revision,job:source.job,operation:source.operation,shift:'day',period:source.from.slice(0,10)+' day shift',...explicit};
 return {metric:/\bfpy\b|first.pass/i.test(question)?'fpy':/quality/i.test(question)?'quality':before.metric,scope,reason:'Requested '+mismatches.map(k=>k+' '+explicit[k]).join(', ')+' is unavailable for this exact supplied case. No matching source cohort is supplied; default job, day shift, site or line was not substituted.'};
}
/** Version4 admits explicit for/at OtherPlant/OtherSite entity wording while
 * schema1-3 historical captures keep their original label and status. */
function publicationScopeIssueV4(question:string,before:ConversationContext):ScopeIssue|null{
 const normalized=question.replace(/\b(for|at)\s+([A-Z][A-Z0-9-]*(?:Plant|Site))\b/gi,(_,preposition,entity)=>preposition+' plant '+entity);
 return publicationScopeIssueV3(normalized,before);
}
/** Version5 retains complete location operands before any case defaults. */
function publicationScopeIssueV5(question:string,before:ConversationContext,training=false):ScopeIssue|null{
 const sourceId:CaseId|null=/FORM-Q1|investigate quality|quality case/i.test(question)?'quality':/PRESS-S1|investigate speed|speed case/i.test(question)?'speed':/FEED-|production goal|investigate downtime/i.test(question)?'downtime':before.caseFocus;
 const expected=sourceId?caseFixtures[sourceId].context.plant:before.plant;
 const aliases=new Map<string,string>();for(const plant of [...Object.values(caseFixtures).map(c=>c.context.plant),'Monthly synthetic plant']){aliases.set(plant.toLowerCase(),plant);aliases.set(plant.replace(/\s/g,'').toLowerCase(),plant);}
 const spans=[...question.matchAll(/\b(at|in|for|from|within|across|on)\s+(?:the\s+)?(plant\s+|site\s+|facility\s+)?([^.!?,;()]+?)(?=\s+\b(?:at|in|for|from|within|across|on)\s|[.!?,;()]|$)/gi)].map(m=>({prep:m[1].toLowerCase(),label:!!m[2],name:m[3].trim().replace(/^['"]|['"]$/g,'')}));
 const names=spans.filter(({name:n,label,prep})=>! /^(?:[A-Z]+-[A-Z0-9-]+|\d|day shift|night shift|(?:the |a )?(?:table|chart)|January|February|March|April|May|June|July|August|September|October|November|December|(?:the )?cutoff|those |these |that |this |our |your |the observations|claim |accepted_rework|accepted_first|scrap|work order|job|part|revision|operation|percent|minutes|seconds|eligible shifts)/i.test(n)).filter(({name:n,label,prep})=>label||/plant|site|facility/i.test(n)||aliases.has(n.toLowerCase())||!!sourceId&&['at','in','within','from'].includes(prep)).map(x=>x.name);
 const bad=names.find(n=>!aliases.has(n.toLowerCase())||aliases.get(n.toLowerCase())!==expected);
 if(bad)return {plant:bad,metric:before.metric,reason:`Requested plant ${bad} is unavailable: no exact source cohort is supplied for this context. No neighboring plant, numeric result or lifecycle record was substituted.`};
 if(names.length){let normalized=question;for(const name of names){const canonical=aliases.get(name.toLowerCase())!;normalized=normalized.replace(name,canonical);}normalized=normalized.replace(/\bplant\s+(Synthetic Works|Northworks)\b/gi,'$1');return training?null:publicationScopeIssueV4(normalized,before);}
 return training?null:publicationScopeIssueV4(question,before);
}
/** Version6 binds an unavailable response to the explicitly requested metric;
 * schema5 retains its original tag and timestamp rather than rewriting history. */
function publicationScopeIssueV6(question:string,before:ConversationContext,training=false):ScopeIssue|null{
 const issue=publicationScopeIssueV5(question,before,training);if(!issue)return null;
 const metric:ConversationContext['metric']=/\bfpy\b|first.pass/i.test(question)?'fpy':/\bavailability\b/i.test(question)?'availability':/\bperformance\b/i.test(question)?'performance':/\bquality\b/i.test(question)?'quality':/\boee\b/i.test(question)?'oee':issue.metric;
 return {...issue,metric};
}
/** Version7 separates authored payloads and requested calendar operands. */
function publicationScopeIssueV7(question:string,before:ConversationContext,training=false):ScopeIssue|null{const scope=requestedScopeTextV81(question);return scope.trim()?publicationScopeIssueV6(scope,before,training):null}
/** Version8 preserves calendar conjunction/comparison operands for new captures. */
export function publicationScopeIssue(question:string,before:ConversationContext,training=false):ScopeIssue|null{const operands=publicationOperands(question),issue=operands.question.trim()?publicationScopeIssueV6(operands.question,before,training):null;if(!issue)return null;return {...issue,...(issue.plant?{plant:operands.restore(issue.plant)}:{}),...(issue.scope?{scope:Object.fromEntries(Object.entries(issue.scope).map(([key,value])=>[key,typeof value==='string'?operands.restore(value):value]))}:{}),reason:operands.restore(issue.reason)}}
function captureIssue(c:ScopePublicationCapture,historicalPolicy?:'v82'){if(![1,2,3,4,5,6,7,8,9,10,11].includes(c.schemaVersion))throw Error('Unknown scope capture schema.');return c.schemaVersion===11?publicationScopeIssueV11(c.question,c.before,c.sourceDataset==='training'):c.schemaVersion===10?publicationScopeIssueV10(c.question,c.before,c.sourceDataset==='training'):c.schemaVersion===9?publicationScopeIssueV9(c.question,c.before,c.sourceDataset==='training'):c.schemaVersion===1?publicationScopeIssueV1(c.question,c.before):c.schemaVersion===2?publicationScopeIssueV2(c.question,c.before):c.schemaVersion===3?publicationScopeIssueV3(c.question,c.before):c.schemaVersion===4?publicationScopeIssueV4(c.question,c.before):c.schemaVersion===5?publicationScopeIssueV5(c.question,c.before,c.sourceDataset==='training'):c.schemaVersion===6?publicationScopeIssueV6(c.question,c.before,c.sourceDataset==='training'):c.schemaVersion===7&&historicalPolicy!=='v82'?publicationScopeIssueV7(c.question,c.before,c.sourceDataset==='training'):publicationScopeIssue(c.question,c.before,c.sourceDataset==='training');}
export function scopePublicationContext(c:ScopePublicationCapture,historicalPolicy?:'v82'){const issue=captureIssue(c,historicalPolicy);if(!issue)throw Error('Invalid scope publication capture.');return {...c.before,...('scope' in issue?issue.scope:{}),plant:issue.plant||('scope' in issue?issue.scope?.plant:undefined)||c.before.plant,period:issue.month||('scope' in issue?issue.scope?.period:undefined)||c.before.period,metric:issue.metric,lastIntent:'publication-scope-unavailable',clarification:issue.reason};}
export function scopePublicationPresentation(c:ScopePublicationCapture,historicalPolicy?:'v82'):PresentedTurn{if(![1,2,3,4,5,6,7,8,9,10,11].includes(c.schemaVersion)||!Number.isFinite(Date.parse(c.asOf)))throw Error('Invalid scope publication capture.');const issue=captureIssue(c,historicalPolicy);if(!issue)throw Error('Missing scope admission issue.');return {text:issue.reason,evidence:'none',chart:false,metric:c.schemaVersion>=6&&isFinancialRequest(c.question)?'financial_savings':issue.metric,sourceIds:[],qualification:'Requested source combination unavailable; no result or lifecycle command committed.'};}

/** Version9 adds explicit duration operands; earlier scope captures replay unchanged. */
export function publicationScopeIssueV9(question:string,before:ConversationContext,training=false):ScopeIssue|null{const duration=isDowntimeMetricRequest(requestedScopeText(question));const issue=publicationScopeIssue(question,duration?{...before,metric:'downtime'}:before,training);return issue&&duration?{...issue,metric:'downtime'}:issue;}

/** New comparison refusals retain the supplied primary period; old captures replay unchanged. */
export function publicationScopeIssueV10(question:string,before:ConversationContext,training=false):ScopeIssue|null{
 const issue=publicationScopeIssueV9(question,before,training),scope=requestedScopeText(question);
 if(issue?.month&&issue.metric==='downtime'&&!before.caseFocus&&before.plant==='Monthly synthetic plant'&&/^(?:compare|change (?:the )?comparison period)/i.test(scope))return {...issue,month:undefined,scope:{...issue.scope,period:before.period,comparisonPeriod:issue.month},reason:'The requested downtime comparison '+(before.comparisonEntity||before.machine)+' / '+issue.month+' is unavailable. Supplied primary '+before.machine+' / '+before.period+' is retained; no neighboring observation is substituted.'};
 return issue;
}

export function publicationScopeIssueV11(question:string,before:ConversationContext,training=false){return publicationScopeIssueV10(canonicalAssetSyntaxQuestion(question),before,training);}
