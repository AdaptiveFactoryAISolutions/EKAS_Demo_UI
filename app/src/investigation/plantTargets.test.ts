import {it,expect} from 'vitest';import {operatingReview} from './operatingReview';
it('seven metrics have explicit versioned synthetic approvals matched to unit/scope/horizon and stable nonadditive gaps',()=>{
 const r=operatingReview() as any;expect(r.bundle).toHaveLength(7);for(const m of r.bundle){expect(m.target).not.toBeNull();expect(m.targetApproval).toMatchObject({synthetic:true,status:'approved',version:1,unit:m.unit,context:m.context});expect(m.targetApproval.approvedAt<=r.asOf).toBe(true);expect(m.targetApproval.effectiveFrom<=r.asOf).toBe(true);expect(m.targetSource).toContain('plant-target-approvals-v57');expect(m.targetReadiness).toBe('ready');expect(m.deviation.unit).toBe(m.unit==='%'?'percentage points':m.unit)}expect(r.metricGaps.length).toBeGreaterThan(1);expect(r.metricGaps.map((g:any)=>g.priorityScore)).toEqual([...r.metricGaps].map((g:any)=>g.priorityScore).sort((a:number,b:number)=>b-a));expect(r.rankingPolicy).toMatch(/not additive|nonadditive/i);expect(r.bundle.find((m:any)=>m.id==='inventory').targetApproval.context.basis).toMatch(/not monetary DIO/);
});
it('future, expired or wrong-scope target approval is unavailable rather than defaulted',()=>{
 const before=operatingReview('2026-09-01T00:00:00Z') as any;expect(before.bundle.every((m:any)=>m.target===null&&m.targetReadiness==='unavailable')).toBe(true);expect(before.metricGaps).toEqual([]);
});
it('approved targets do not reveal source measurements before their declared cutoff',()=>{
 const r=operatingReview('2026-09-10T00:00:00Z') as any;expect(r.bundle.every((m:any)=>m.value===null&&m.observationReadiness==='future_record')).toBe(true);expect(r.metricGaps).toEqual([]);
});
