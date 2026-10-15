import{currentTrainingContext,trainingScopeLabel,trainingPeriodLabel}from'../platform/trainingContext';
import {currentConversationScopeIssue} from './conversationScopeEligibility';
import {collectorScopeMatches} from './collectorScope';
import type {createManufacturingClient} from './clientPort';
import type {ConversationRecord,InvestigationAggregateRecord} from './service';
import type {workflowView} from './workflow';
import type {ComparisonRecord} from './comparison';
export type CanonicalSelection={conversation:ConversationRecord;aggregate:InvestigationAggregateRecord|null;view:ReturnType<typeof workflowView>|null;comparison:ComparisonRecord|null;scopeQualification:string|null};
/** A read projection only. No fixture seeding, legacy imports or client write authority. */
export async function loadCanonicalSelection(client:ReturnType<typeof createManufacturingClient>,id:string):Promise<CanonicalSelection>{
 for(let attempt=0;attempt<3;attempt++){
  const conversation=await client.readConversation(id),c=conversation.content.conversation;
  let aggregate:InvestigationAggregateRecord|null=null,view:ReturnType<typeof workflowView>|null=null,comparison:ComparisonRecord|null=null;
  if(c.dataset==='manufacturing'&&c.comparisonId)comparison=(await client.readComparisons()).find(r=>r.id===c.comparisonId)||null;
  else if(c.dataset==='manufacturing'&&c.investigationId){aggregate=await client.readAggregate(c.investigationId);if(aggregate.content.domain==='manufacturing-investigation-v2')view=await client.view(aggregate.id);const checked=await client.readAggregate(aggregate.id);if(checked.version!==aggregate.version)continue;}
  if(c.dataset==='manufacturing'&&c.comparisonId&&!comparison)throw Error('Selected comparison is unavailable. No original investigation was substituted.');
  const checked=await client.readConversation(id);if(checked.version!==conversation.version)continue;
  const scopeQualification=currentConversationScopeIssue(c)||(aggregate?.content.domain==='manufacturing-investigation-v2'&&!collectorScopeMatches(c.context,aggregate.content.workflow)?'Requested scope mismatch: '+[c.context.machine,c.context.part,c.context.revision,c.context.period].filter(Boolean).join(' / ')+' differs from the saved investigation. Current results and action readiness are withheld; original records remain saved.':null);return {conversation,aggregate,view:scopeQualification?null:view,comparison,scopeQualification};
 }
 throw Error('The investigation changed while being read. Refresh before acting; no mixed-version result published.');
}
export function canonicalContext(selection:CanonicalSelection){
 const {conversation,aggregate,view,comparison}=selection,c=conversation.content.conversation,last=c.turns.at(-1);
 if(c.dataset==='metric-demonstration'&&c.metricDemonstrationContext)return {dataset:'Explicit synthetic metric demonstration',identity:c.metricDemonstrationContext.resultId,version:1,scope:c.metricDemonstrationContext.contextId,entity:'training-positive-v2',metric:c.metricDemonstrationContext.metricId,asOf:c.metricDemonstrationContext.asOf,caseId:null};
 if(c.dataset==='training'){const sourceContext=currentTrainingContext(c);return {dataset:'Sample dataset · Original training',identity:conversation.id,version:conversation.version,scope:trainingScopeLabel(sourceContext),entity:(sourceContext.grain.join(' + ')||'aggregate')+' grain · '+trainingPeriodLabel(sourceContext),metric:sourceContext.metricIds.join(', ')||'Choose a metric',asOf:sourceContext.asOf,caseId:null,sourceContext};}
 if(comparison)return {dataset:'Separate synthetic comparison',identity:comparison.id,version:comparison.version,scope:comparison.view.context.plant,entity:comparison.view.context.asset+' / '+comparison.view.context.part+' '+comparison.view.context.revision,metric:'FPY',asOf:comparison.state.asOf,caseId:comparison.id};
 if(c.context.sourceFocus==='plant'&&(c.context.lastIntent==='audit'||(last?.topicContextPolicyVersion??0)>=3&&!c.context.auditMetricId)&&c.context.machine==='Northworks Plant Review')return {dataset:'Synthetic manufacturing',identity:conversation.id,version:conversation.version,scope:c.context.plant||'Northworks',entity:c.context.machine+' / '+c.context.period,metric:'Plant Review · multiple governed metrics',asOf:last?.asOf||c.context.sourceCutoff||'No observation selected',caseId:null};
 return {dataset:'Synthetic manufacturing',identity:aggregate?.id||conversation.id,version:aggregate?.version||conversation.version,scope:view?.context.plant||c.context.plant||'Select a site',entity:view?view.context.asset+' / '+view.context.part+' '+view.context.revision:[c.context.machine,c.context.part,c.context.revision,c.context.period].filter(Boolean).join(' / ')||'Select a case or exact metric',metric:view?'Primary endpoint: '+view.plan.endpoint+' ('+view.plan.unit+') · latest reply: '+(last?.answer.metric||c.context.metric):last?.answer.metric||c.context.metric,asOf:view?.asOf||last?.asOf||c.context.sourceCutoff||'No observation selected',caseId:aggregate?.id||null};
}
