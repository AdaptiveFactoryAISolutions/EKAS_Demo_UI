import {isFinancialRequest} from './metricPublication';
import {presentTurn,routeConversation,monthMetric,downtimePresentation,type ConversationContext,type PresentedTurn} from './conversation';
import type {workflowView} from './workflow';
import {collectorScopeMatches} from './collectorScope';
export type PresentationCapture={schemaVersion:1|2|3|4|5|6;question:string;previousTurnId:string;context:ConversationContext;beforeContext:ConversationContext;previousAnswer:PresentedTurn;previousView:ReturnType<typeof workflowView>|null;investigationVersion:number|null;asOf:string;currentUnavailable:string|null};
/** Presentation changes format, never resolves a new cohort or falls back. */
export function isPresentationRequest(text:string,context?:ConversationContext,durationPolicy:boolean|4|5=true,scopePolicy:2|3|4=4){
 if(isFinancialRequest(text))return false;
 if(/^(?:please\s+)?(?:(?:show|display)(?:\s+(?:me|this|that|it|those results|the results))?(?:\s+(?:as|in)\s+(?:a\s+)?(?:chart|graph|table))?|(?:chart|graph|plot|visuali[sz]e)(?:\s+(?:it|this|that|those results|the results))?)[.!?]?$/i.test(text.trim()))return true;
 if(!context)return false;
 const routed=routeConversation(text,context,undefined,undefined,undefined,undefined,undefined,scopePolicy,undefined,typeof durationPolicy==='number'?durationPolicy:durationPolicy?5:3),dimensions=['plant','line','machine','part','revision','job','operation','shift','period','comparisonPeriod','comparisonEntity','caseFocus','sourceCutoff','reviewCutoff'] as const;
 const durationShow=durationPolicy&&/^(?:please\s+)?(?:show|display)\s+(?:me\s+)?downtime\b/i.test(text.trim());const explicitMetricShow=/^(?:please\s+)?(?:show|display)\s+(?:me\s+)?(?:fpy|first[ -]pass(?: yield)?|oee|availability|performance|quality)\b/i.test(text.trim());
 return (routed.intent==='show'||explicitMetricShow||durationShow)&&!routed.intent.endsWith('clarify')&&(!routed.createCase||routed.createCase===context.caseFocus)&&!routed.commands.length&&dimensions.every(key=>routed.context[key]===context[key]);
}
export function presentationContract(c:PresentationCapture):PresentedTurn{
 if(![1,2,3,4,5,6].includes(c.schemaVersion)||!isPresentationRequest(c.question,c.context,c.schemaVersion>=4?(c.schemaVersion>=5?5:4):false,c.schemaVersion===6?4:3)||!c.previousTurnId||!Number.isFinite(Date.parse(c.asOf)))throw Error('INVALID_PRESENTATION_CAPTURE');
 const prior=c.previousAnswer,v=c.previousView,explicitMetric=(c.schemaVersion>=4&&/\bdowntime\b/i.test(c.question))||/\bfpy\b|first.pass|\bquality\b|\boee\b|\bavailability\b|\bperformance\b/i.test(c.question),metric=explicitMetric?c.context.metric:prior.metric;
 if(c.schemaVersion>=3&&!c.currentUnavailable&&!explicitMetric&&prior.visual&&v&&collectorScopeMatches(c.context,v)&&v.eligibility.status==='ready')return {...structuredClone(prior),chart:!/table/i.test(c.question)};
 if(c.schemaVersion>=2&&!c.currentUnavailable&&!explicitMetric&&prior.metric!=='financial_savings'&&v?.caseId==='quality'&&['goal','guide-return'].includes(c.context.lastIntent)&&collectorScopeMatches(c.context,v)&&v.eligibility.status==='ready'&&typeof v.selected.metrics.fpy.value==='number'){
  const value=v.selected.metrics.fpy.value,sourceIds=[...v.selected.sourceIds];return {text:`The selected Quality case's primary endpoint is FPY: ${value.toFixed(2)}% for ${v.context.asset} / ${v.context.part} ${v.context.revision}, ${v.context.from} to ${v.context.to}, as of ${v.asOf}. This descriptive synthetic observation does not establish a decline or cause.`,metric:'fpy',evidence:'metrics',chart:! /table/i.test(c.question),sourceIds,qualification:null,visual:{title:v.context.asset+' FPY · '+v.asOf,unit:'%',categories:['First-pass yield'],values:[value],kind:'column',sourceIds}};
 }
 if(c.schemaVersion>=5&&metric==='downtime'&&!explicitMetric&&!prior.sourceIds.length)return {...structuredClone(prior),metric,chart:false,visual:undefined,sourceIds:[],qualification:prior.qualification||c.currentUnavailable||'Requested duration unavailable; no comparison or source substituted.'};
 if(c.currentUnavailable||!explicitMetric&&(!prior.sourceIds.length||prior.evidence==='none'))return {...structuredClone(prior),...(c.schemaVersion===6?{evidence:'none' as const}:{}),metric,chart:false,visual:undefined,sourceIds:[],qualification:prior.qualification||c.currentUnavailable||'Requested result unavailable; presentation does not select an alternative.',...(c.currentUnavailable?{text:'The selected result is unavailable for '+[c.context.plant,c.context.line,c.context.machine,c.context.part,c.context.revision,c.context.job,c.context.operation,c.context.period,c.context.shift].filter(Boolean).join(' / ')+'. '+c.currentUnavailable+' No neighboring cohort, metric or capacity chart was substituted.'}:{})};
 if(v&&collectorScopeMatches(c.context,v)&&v.eligibility.status==='ready'&&!explicitMetric&&(prior.evidence==='verification'||['goal','loss','rank','machine','job'].includes(c.context.lastIntent))){
  const resolved=presentTurn(routeConversation('Show me.',c.context),v);
  if(resolved.visual){const sourceIds=[...resolved.visual.sourceIds];return {...resolved,text:prior.text,metric:prior.evidence==='verification'?v.plan.endpoint:'capacity',sourceIds,chart:! /table/i.test(c.question)&&resolved.chart};}
 }
 if(c.schemaVersion>=5&&metric==='downtime'&&!explicitMetric&&prior.visual?.unit==='min'&&prior.visual.values.length===2)return {...structuredClone(prior),chart:!/table/i.test(c.question)};
  if(c.schemaVersion>=4&&metric==='downtime'){const result=downtimePresentation(c.context,v,c.asOf);return {...result,chart:! /table/i.test(c.question)&&result.chart};}
 if(['oee','availability','performance','quality','fpy'].includes(metric)){
  if(!v&&!c.context.caseFocus&&c.context.plant==='Monthly synthetic plant'&&c.context.metric===metric){const m=monthMetric(c.context);if(m&&typeof m.result.value==='number'&&Number.isFinite(m.result.value)&&prior.sourceIds.includes(m.row.id)&&prior.sourceIds.includes(m.row.source)){const sourceIds=[...prior.sourceIds];if(prior.evidence==='events'&&['oee','availability'].includes(metric)){sourceIds.push(m.row.event.id,m.row.event.source);return {...structuredClone(prior),sourceIds,chart:! /table/i.test(c.question),visual:{title:c.context.machine+' · '+c.context.period+' documented availability contributor',unit:'min',categories:[m.row.event.reason],values:[m.row.event.minutes],kind:'column',sourceIds}};}return {...structuredClone(prior),chart:! /table/i.test(c.question),visual:{title:c.context.machine+' · '+c.context.period+' '+metric.toUpperCase(),unit:'%',categories:[c.context.period],values:[m.result.value],kind:'column',sourceIds},sourceIds};}}
  if(!v&&prior.visual?.unit==='%'&&prior.visual.sourceIds.every(id=>prior.sourceIds.includes(id)))return {...structuredClone(prior),chart:! /table/i.test(c.question)};
  if(!v||!collectorScopeMatches(c.context,v)||v.eligibility.status!=='ready')return {text:'This exact metric/source combination is unavailable. Presentation cannot revive a prior or neighboring cohort.',metric,evidence:'none',chart:false,sourceIds:[],qualification:'Exact selected source eligibility unavailable.'};
  const m=v.selected.metrics[metric as keyof typeof v.selected.metrics] as {value:number|null};
  if(m?.value===null||typeof m?.value!=='number'||!Number.isFinite(m.value)||!explicitMetric&&!prior.sourceIds.every(id=>v.selected.sourceIds.includes(id)))return {text:'Exact metric operands are unavailable; no alternate metric or capacity bridge was substituted.',metric,evidence:'none',chart:false,sourceIds:[],qualification:'Exact metric operands unavailable.'};
  const sourceIds=[...(explicitMetric?v.selected.sourceIds:prior.sourceIds)],label=metric==='fpy'?'FPY (first-pass yield)':metric==='quality'?'Quality (terminal good yield)':metric.toUpperCase();
  return {...structuredClone(prior),...(explicitMetric?{text:`${label} is ${m.value.toFixed(2)}% for ${v.context.plant} / ${v.context.asset} / ${v.context.part} ${v.context.revision}, ${v.context.from} to ${v.context.to}, as of ${c.asOf}. Descriptive synthetic observation; cause remains unconfirmed.`,qualification:null}:{}),metric,evidence:'metrics',chart:! /table/i.test(c.question),visual:{title:v.context.asset+' '+label+' · '+c.asOf,unit:'%',categories:[label],values:[m.value],kind:'column',sourceIds},sourceIds};
 }
 return structuredClone(prior);
}

/** Public presentation/export uses one resolved payload; sealed prior views stay
 * in immutable internal history and are not neighboring current operands. */
export function presentationPublicExport(turn:{id:string;question:string;context:ConversationContext;answer:PresentedTurn;asOf:string;presentationCapture:PresentationCapture}){
 return {schemaVersion:1,kind:'ekas-resolved-presentation',id:turn.id,question:turn.question,context:structuredClone(turn.context),asOf:turn.asOf,answer:structuredClone(turn.answer),sourceIds:[...turn.answer.sourceIds],capturedFrom:{turnId:turn.presentationCapture.previousTurnId,asOf:turn.presentationCapture.asOf},synthetic:true,notDispatched:true,notGranted:true,causalStatus:'unconfirmed',financiallyValidated:false};
}
