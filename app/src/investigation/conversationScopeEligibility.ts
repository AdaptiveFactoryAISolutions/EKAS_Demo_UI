import {resolveAssetScope} from './assetScopeInterpretation';
import type {Conversation} from './service';
type Turn=Conversation['turns'][number];
/** Sidecar eligibility: never rewrites a captured historical answer or its clock. */
export function historicalAssetScopeIssue(t:Turn){
 if((t.scopeInterpretationVersion||1)>=4||t.answer.evidence==='none'||t.contextualGuideCapture||t.training||t.metricDemonstrationCapture||t.commands.length)return null;
 const resolution=resolveAssetScope(t.question,t.requestContext,4);
 if(resolution.kind==='clarify'&&resolution.requested.length)return 'Earlier captured request '+t.question+' is unavailable under the authored asset map. '+resolution.reason+' The original answer is retained as history, not eligible current evidence.';
 if(resolution.kind==='resolved'&&resolution.resolutions.length===1&&resolution.resolutions[0].canonical!==t.context.machine)return 'Earlier captured request '+t.question+' resolves to '+resolution.resolutions[0].canonical+' under canonical formatting, which differs from its captured '+t.context.machine+' scope. Restate an exact supported investigation; the original capture remains unchanged.';
 return null;
}
/** Retrospective eligibility only: original answer/context/time are never rewritten. */
export function historicalPlantReviewScopeIssue(t:Turn){if(!t.reviewSnapshot||t.context.lastIntent!=='audit')return null;const c=t.context,at=t.reviewAsOf||t.asOf;if(c.metric==='oee'&&c.plant==='Northworks'&&c.machine==='Northworks Plant Review'&&c.period==='Frozen report '+at.slice(0,10)&&c.caseFocus===null&&c.comparisonPeriod===null&&c.comparisonEntity===null&&c.job===null&&c.part===null&&c.revision===null&&c.operation===null&&c.line===null&&c.shift===null)return null;return 'Earlier captured Plant Review answer has a different declared plant, entity or period scope. The original answer, context and timestamp remain saved as history, not eligible current evidence. Run my plant review again to capture a coherent current review.'}
export function historicalCapturedScopeIssue(t:Turn){return historicalPlantReviewScopeIssue(t)||historicalAssetScopeIssue(t)}
export function currentConversationScopeIssue(c:Pick<Conversation,'dataset'|'context'|'turns'>){
 if(c.dataset!=='manufacturing')return null;
 if(c.context.lastIntent==='asset-scope-clarify'&&c.context.clarification)return c.context.clarification;
 for(const t of [...c.turns].reverse()){
  const issue=historicalCapturedScopeIssue(t);if(issue)return issue;
  if(t.presentationCapture||t.contextualGuideCapture||t.commands.length||t.correctionReviewCapture||t.claimReviewCapture||t.evidenceReviewCapture)continue;
  return null;
 }
 return null;
}

export function historicalScopeAntecedent(c:Pick<Conversation,'turns'>){for(const t of [...c.turns].reverse()){if(historicalAssetScopeIssue(t))return t;if(t.presentationCapture||t.contextualGuideCapture||t.assetScopeClarificationCapture||t.commands.length||t.correctionReviewCapture||t.claimReviewCapture||t.evidenceReviewCapture)continue;return null;}return null;}
