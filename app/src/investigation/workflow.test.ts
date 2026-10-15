import {it,expect} from 'vitest';
import {createWorkflow,executeWorkflow,workflowView,validateWorkflow} from './workflow';
import {caseFixtures,shiftMetrics,checkShift} from './cases';
it('each declared case has complete separately source-linked compatible cohorts and exact loss identities',()=>{
 for(const fixture of Object.values(caseFixtures)){
  expect(fixture.shifts).toHaveLength(20);
  for(const s of fixture.shifts)expect(checkShift(s,fixture),s.id).toBeNull();
  const m=shiftMetrics([fixture.current]);expect(m.planned).toBeCloseTo(m.down+(m.speedLoss.value as number)+(m.qualityLossMin.value as number)+m.idealGood);
 }
 expect(shiftMetrics(caseFixtures.downtime.shifts.filter(s=>s.period==='post')).good).toBe(7365);
 expect(shiftMetrics(caseFixtures.quality.shifts.filter(s=>s.period==='post')).fpy.value).toBeCloseTo(100*844/880);
});
it('source-bound workflow records hypothesis tests, assignment and roles without model-created facts',()=>{
 let w=createWorkflow('speed');const run=(kind:string,payload:Record<string,unknown>={},actor:import('./workflow').Actor='supervisor')=>w=executeWorkflow(w,{kind,...payload},actor,kind+JSON.stringify(payload));
 run('add-hypothesis',{hypothesisId:'speed-H1'});run('plan-test',{hypothesisId:'speed-H1'});
 expect(()=>run('record-test',{testId:'speed-investigation-v1-inspection'})).toThrow(/future/i);
 run('request-assignment',{owner:'maintenance'});
 expect(()=>run('accept-assignment',{},'supervisor')).toThrow(/owner/i);
 run('accept-assignment',{},'maintenance');run('recommend-action');run('request-authorization');
 expect(()=>run('authorize-action',{},'maintenance')).toThrow(/manager/i);
 run('authorize-action',{},'manager');expect(w.action.status).toBe('authorized');expect(workflowView(w).verification.status).toBe('awaiting_work');
 run('advance-time',{asOf:'2026-10-06T15:15:00Z'});run('record-test',{testId:'speed-investigation-v1-inspection'});expect(w.hypotheses[0].status).toBe('supported');
 run('record-performed-work',{workId:'speed-investigation-v1-work'},'maintenance');
 expect(validateWorkflow(w)).toBe(true);expect(w.action.status).toBe('performed');expect(w.synthetic).toBe(true);expect(w.notDispatched).toBe(true);
});
it('all three cases progress through eligible verification, guardrails, sustain and a clean unmeasured next cycle',()=>{
 for(const caseId of ['downtime','speed','quality'] as const){
  let w=createWorkflow(caseId);let i=0;const run=(kind:string,payload:Record<string,unknown>={},actor:import('./workflow').Actor='supervisor')=>w=executeWorkflow(w,{kind,...payload},actor,'k'+(++i));
  run('add-hypothesis',{hypothesisId:caseId+'-H1'});run('plan-test',{hypothesisId:caseId+'-H1'});run('request-assignment',{owner:'maintenance'});run('accept-assignment',{},'maintenance');run('recommend-action');run('request-authorization');run('authorize-action',{},'manager');run('advance-time',{asOf:'2026-10-06T15:15:00Z'});run('record-performed-work',{workId:caseFixtures[caseId].work.id},'maintenance');run('advance-time',{asOf:'2026-10-20T15:15:00Z'});
  expect(workflowView(w).verification.postCount).toBe(10);expect(workflowView(w,true).action.lifecycleState).toBe('PERFORMED');expect(workflowView(w,true).action.verified).toBe(false);run('record-verification');run('review-safety',{evidenceId:caseId+'-SAFETY-01'},'safety');run('accept-result',{},'manager');expect(workflowView(w,true).action.lifecycleState).toBe('VERIFIED');expect(w.action.status).toBe('performed');run('advance-time',{asOf:'2026-10-27T14:00:00Z'});run('record-sustain');expect(workflowView(w).sustain.status).toBe('sustained');run('advance-time',{asOf:'2026-11-03T14:00:00Z'});run('record-sustain');expect(workflowView(w).sustain.status).toBe('recurrence');const old=structuredClone(w);run('reopen');expect(w.cycle).toBe(2);expect(w.priorCycles[0].action).toEqual(old.action);expect(workflowView(w).verification.postCount).toBe(0);expect(w.action.status).toBe('draft');expect(workflowView(w,true).action.lifecycleState).toBe('DRAFT');expect(workflowView(w,true).action.verified).toBe(false);expect(w.hypotheses).toEqual([]);expect(validateWorkflow(w)).toBe(true);
 }
});
it('missing source and stale exposure block consequential commands without reclassifying immutable captures',()=>{
 for(const condition of ['missing_target','stale','wrong_revision','missing_events','missing_document','failed_quality_guardrail','failed_safety'] as const){const w=createWorkflow('downtime',condition);expect(validateWorkflow(w)).toBe(true);if(['failed_quality_guardrail','failed_safety'].includes(condition))continue;expect(()=>executeWorkflow(w,{kind:'recommend-action'},'supervisor','r')).toThrow();}
 let w=createWorkflow('downtime','wrong_revision');w=executeWorkflow(w,{kind:'capture-result'},'supervisor','old');const old=structuredClone(w.captures[0]);w=executeWorkflow(w,{kind:'correct-revision',revision:'P2'},'supervisor','fix');expect(w.captures[0]).toEqual(old);expect(workflowView(w).eligibility.status).toBe('ready');expect(validateWorkflow(w)).toBe(true);
});

it('custom hypotheses remain speculation and reassignment invalidates prior authorization until exact new acceptance',()=>{
 let w=createWorkflow('speed');let i=0;const run=(command:any)=>{w=executeWorkflow(w,command,'manager','custom-'+(++i));};
 run({kind:'add-hypothesis',description:'Temperature variation might contribute.',test:'Compare measured temperature against the effective specification.'});run({kind:'plan-latest-test'});expect(w.hypotheses[0]).toMatchObject({status:'test_planned',causalStatus:'unconfirmed',supportingEvidenceIds:[]});
 run({kind:'request-assignment',owner:'maintenance'});run({kind:'record-assignment-acceptance'});run({kind:'recommend-action'});run({kind:'request-authorization'});run({kind:'authorize-action'});run({kind:'request-assignment',owner:'maintenance-backup'});expect(w.owner.accepted).toBeNull();expect(w.action.authorizationId).toBeNull();expect(w.action.authorizedAt).toBeNull();expect(()=>executeWorkflow(w,{kind:'authorize-action'},'manager','premature')).toThrow();run({kind:'record-assignment-acceptance'});expect(w.owner.accepted).toBe('maintenance-backup');expect(validateWorkflow(w)).toBe(true);
});
