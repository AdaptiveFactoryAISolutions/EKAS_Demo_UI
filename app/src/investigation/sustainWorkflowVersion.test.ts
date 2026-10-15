import {it,expect} from 'vitest';
import {createWorkflow,executeWorkflow,validateWorkflow,workflowView} from './workflow';
import {fixtureCase} from './cases';
it('historical workflows replay without a new policy flag or changed captures',()=>{
 let old=createWorkflow('downtime','complete',1);old=executeWorkflow(old,{kind:'capture-result'},'manager','legacy-capture');
 expect(old.sustainPolicyVersion).toBeUndefined();expect(validateWorkflow(JSON.parse(JSON.stringify(old)))).toBe(true);
 expect(old.captures[0].result.sustain).not.toHaveProperty('policyVersion');
});
it('new workflows retain policy on replay and assess latest monitoring in each case',()=>{
 for(const caseId of ['downtime','speed','quality'] as const){let current=createWorkflow(caseId);current=executeWorkflow(current,{kind:'capture-result'},'manager','new-capture');expect(validateWorkflow(current)).toBe(true);
 const f=fixtureCase(caseId);current.accepted=true;current.asOf='2026-10-27T14:00:00Z';current.sustainIds=f.sustain.observations.slice(0,5).map(r=>r.id);expect(workflowView(current).sustain.status).toBe('sustained');
 current.asOf='2026-11-03T14:00:00Z';current.sustainIds=f.sustain.observations.map(r=>r.id);expect(workflowView(current).sustain.status).toBe('recurrence');
 current.sustainIds=f.sustain.observations.slice(0,5).map(r=>r.id);expect(workflowView(current).sustain.status).toBe('interrupted');}
});
