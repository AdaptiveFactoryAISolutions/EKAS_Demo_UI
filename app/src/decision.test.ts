import {describe,it,expect} from 'vitest';
import {readiness,scenarioRecovery,validateComparison,restatement,groupAttention,reconcileCommand,sourceMapping} from './decision';
describe('Decision and recovery boundaries',()=>{
 it('missing good count blocks quality/OEE while keeping measured availability',()=>{const r=readiness('Missing good count');expect(r.oee.available).toBe(false);expect(r.quality.available).toBe(false);expect(r.availability.available).toBe(true)});
 it('an incomplete query is not an eligible whole-scope denominator',()=>{expect(readiness('Partial query').oee.available).toBe(false)});
 it('same display name never merges two source asset identities',()=>{expect(sourceMapping('Feeder').eligible).toBe(false);expect(sourceMapping('FEED-03').eligible).toBe(true)});
 it('different revision and nonconforming run cannot become comparable best-known baseline',()=>{expect(validateComparison('P1',true).eligible).toBe(false);expect(validateComparison('P2',false).eligible).toBe(false)});
 it('recovered local time with zero demand retains physical capacity and produces no saleable gain',()=>{const x=scenarioRecovery(30,.8,0,1000);expect(x.physical).toBeGreaterThan(400);expect(x.saleable).toBe(0);expect(x.validatedFinancial).toBeNull()});
 it('restatement leaves pinned original value unchanged',()=>{const original=Object.freeze({down:120,planned:480});const x=restatement(original,5);expect(original.down).toBe(120);expect(x.original.down).toBe(120);expect(x.restated.down).toBe(125);expect(x.reviewRequired).toBe(true)});
 it('ten duplicate notifications remain one unresolved attention group',()=>{const x=groupAttention(Array.from({length:10},()=>({event:'recurrence-003',caseId:'CASE-003'})));expect(x).toHaveLength(1);expect(x[0].duplicates).toBe(10);expect(x[0].resolved).toBe(false)});
 it('unknown delivery and conflict require read before retry; cancellation never claims rollback',()=>{expect(reconcileCommand('Unknown delivery',false).canRetry).toBe(false);expect(reconcileCommand('Unknown delivery',true).reuseIdentity).toBe(true);expect(reconcileCommand('Concurrent edit',true).canRetry).toBe(false);expect(reconcileCommand('Cancelled',true).committedMayRemain).toBe(true)});
});
