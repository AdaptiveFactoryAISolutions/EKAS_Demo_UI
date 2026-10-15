import {expect,it} from 'vitest';
import {operatingReview,projectCaseReadiness} from './operatingReview';
import {caseFixtures} from './cases';
import {emptyConversationContext,routeConversation,presentTurn} from './conversation';
it('withholds all derived gaps, ranks and opening links immediately before cutoff',()=>{
 const r=operatingReview('2026-10-06T13:59:59.999Z');expect(r.gaps).toEqual([]);expect(r.metricGaps).toEqual([]);expect(r.investigationLinks).toEqual([]);expect(r.caseReadiness.every(g=>g.actual===null&&g.gap===null)).toBe(true);
 const routed=routeConversation('Investigate the top issue',emptyConversationContext(),'2026-10-06T13:59:59.999Z');expect(routed.createCase).toBeNull();
 const p=presentTurn(routeConversation('Plant Review',emptyConversationContext()),null,undefined,'2026-10-06T13:59:59.999Z');expect(p.text).not.toMatch(/2,?154|706|792|largest absolute shortfall|150 good/);expect(p.text).toMatch(/unavailable/);
});
it.each(['2026-10-06T14:00:00.000Z','2026-10-06T14:00:00.001Z'])('releases exact eligible own-case gaps at and after %s',asOf=>{
 const r=operatingReview(asOf);expect(r.gaps.map(g=>g.gap)).toEqual([150,114,58]);expect(r.investigationLinks.filter(l=>l.kind==='case').map(l=>l.id)).toEqual(['downtime','speed','quality']);expect(r.caseReadiness.every(g=>g.observationReadiness==='observed')).toBe(true);
});
it('does not infer a later-known case from ready siblings',()=>{
 const fixtures=structuredClone(caseFixtures);fixtures.speed.current.knownAt='2026-10-06T14:10:00Z';
 for(const [at,ready] of [['2026-10-06T14:09:59.999Z',false],['2026-10-06T14:10:00Z',true],['2026-10-06T14:10:00.001Z',true]] as const){const rows=projectCaseReadiness(at,fixtures);expect(rows.find(r=>r.caseId==='speed')?.actual).toBe(ready?706:null);expect(rows.find(r=>r.caseId==='downtime')?.actual).toBe(2154);}
});
it('known target without observations cannot offer discovery, and observed cases do not imply effective metric targets',()=>{
 const early=operatingReview('2026-09-10T00:00:00Z');expect(early.bundle.every(m=>m.targetReadiness==='ready'&&m.actionReadiness.startsWith('blocked'))).toBe(true);expect(early.investigationLinks).toEqual([]);
 const expired=operatingReview('2026-10-07T00:00:00Z');expect(expired.metricGaps).toEqual([]);expect(expired.investigationLinks.every(l=>l.kind==='case')).toBe(true);expect(expired.gaps).toHaveLength(3);const p=presentTurn(routeConversation('Plant Review',emptyConversationContext()),null,undefined,'2026-10-07T00:00:00Z');expect(p.text).toContain('No eligible governed metric gap');expect(p.text).not.toContain('Ask me to investigate');
});
