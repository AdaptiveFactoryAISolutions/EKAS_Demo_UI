import {it,expect} from 'vitest';
import * as workflow from './workflow';
import {createWorkflow,workflowView,executeWorkflow} from './workflow';
import {fixtureCase,checkShift,shiftMetrics} from './cases';
it('plant parent goal/bridge and selected Line03 child metrics have separate exact scopes and complete operand sources',()=>{
 const v=workflowView(createWorkflow('downtime')) as any;expect(v.parent.context.kind).toBe('plant');expect(v.parent.context.jobIds).toEqual(['JOB-8401','JOB-8402','JOB-8303']);expect(v.parent.metrics.planned).toBe(1440);expect(v.parent.metrics.good).toBe(2154);expect(v.parent.goal).toMatchObject({target:2304,actual:2154,gap:150});expect(v.parent.bridge).toEqual([2880,-480,-198,-48,2154]);expect(v.parent.rawDowntimeMin).toBe(240);expect(v.parent.eventReconciliation.map((x:any)=>x.unionMin)).toEqual([48,72,120]);expect(v.selected.context.job).toBe('JOB-8303');expect(v.selected.metrics.planned).toBe(480);expect(v.selected.metrics.good).toBe(630);expect(v.selected.metrics.oee.value).toBe(65.625);for(const id of ['JOB-8401','JOB-8402','JOB-8303'])expect(v.parent.sourceIds.some((s:string)=>s.includes(id))).toBe(true);
});
it('Northworks evaluates the exact absolute guardrails named by its preregistered source',()=>{
 const plan=fixtureCase('downtime').verification as any;expect(plan.qualityMaxPct).toBe(2.5);expect(plan.energyMaxKwhPerGood).toBe(1.2);expect(plan.qualityMaxWorseningPp).toBeUndefined();expect(plan.energyMaxWorseningPct).toBeUndefined();
 const evaluate=(workflow as any).evaluateVerificationGuardrails;expect(typeof evaluate).toBe('function');const probe=evaluate(plan,{qualityLossPct:2.3,energyPerGood:1.195},{qualityLossPct:2,energyPerGood:8000/6860});expect(probe.quality.status).toBe('pass');expect(probe.energy.status).toBe('pass');expect(evaluate(plan,{qualityLossPct:2.6,energyPerGood:1.201},{qualityLossPct:2,energyPerGood:8000/6860}).quality.status).toBe('fail');
});
it('negative post sources reconcile their own counts, cycle timing, unit identities and worse primary endpoint',()=>{
 for(const caseId of ['downtime','speed','quality'] as const)for(const condition of ['no_improvement','worse_outcome'] as const){const f=(fixtureCase as any)(caseId,condition),post=f.shifts.filter((s:any)=>s.period==='post'),base=f.shifts.filter((s:any)=>s.period==='baseline');expect(post).toHaveLength(10);for(const s of post){expect(checkShift(s,f),s.id).toBeNull();expect(s.source).toContain('negative-outcomes-v56');expect(s.id).toContain(condition);expect(f.verification.postIds).toContain(s.id)}const b=shiftMetrics(base),p=shiftMetrics(post);const before=caseId==='speed'?Number(b.speedLoss.value)/10:caseId==='quality'?b.fpy.value:b.jamMean,after=caseId==='speed'?Number(p.speedLoss.value)/10:caseId==='quality'?p.fpy.value:p.jamMean;if(condition==='no_improvement')expect(after).toBe(before);else if(caseId==='quality')expect(Number(after)).toBeLessThan(Number(before));else expect(Number(after)).toBeGreaterThan(Number(before));}
});
it('unsourced current Line03 energy remains unavailable while source-backed comparison energy stays valid',()=>{
 const f=fixtureCase('downtime');expect(f.current.energyKwh).toBeNull();expect(shiftMetrics([f.current]).energyPerGood).toBeNull();expect(shiftMetrics(f.shifts.filter(s=>s.period==='baseline')).energyPerGood).toBeCloseTo(8000/6860);
});
it('comparison eligibility enforces exact planned ID membership and job identity before measurement',()=>{
 const f=fixtureCase('speed'),wrong={...f.shifts[0],jobId:'UNRELATED-JOB'};expect(checkShift(wrong,f)).not.toBeNull();const v=workflowView(createWorkflow('speed')) as any;expect(v.plan.baselineIds).toEqual(f.verification.baselineIds);expect(v.plan.postIds).toEqual(f.verification.postIds);
});
