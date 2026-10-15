import {describe,it,expect} from 'vitest';
import {buildPlatformFixture,visibleFacts} from './fixture';
describe('versioned broader relational fixture',()=>{
 const fixture=buildPlatformFixture();
 it('has deterministic relational identities and conserved count/time inputs',()=>{
  expect(buildPlatformFixture()).toEqual(fixture);
  const jobs=new Set(fixture.tables.jobs.map(r=>r.id)),shifts=new Set(fixture.tables.shifts.map(r=>r.id)),assets=new Set(fixture.assets.map(r=>r.id));
  for(const rows of Object.values(fixture.tables))for(const row of rows){expect(jobs.has(row.jobId)).toBe(true);expect(shifts.has(row.shiftId)).toBe(true);expect(assets.has(row.assetId)).toBe(true)}
  for(const count of fixture.tables.counts){expect(Number(count.good)+Number(count.scrap)).toBe(count.total);expect(Number(count.firstPassGood)+Number(count.rework)).toBe(count.good)}
  for(const journey of fixture.tables.unitJourneys){expect(Number(journey.queueMinutes)+Number(journey.setupMinutes)+Number(journey.runMinutes)+Number(journey.moveMinutes)+Number(journey.waitMinutes)).toBe((Date.parse(String(journey.completion))-Date.parse(String(journey.release)))/60000)}
  for(const shift of fixture.tables.shifts){const run=fixture.tables.runIntervals.find(r=>r.shiftId===shift.id)!,stop=fixture.tables.downtimeEvents.find(r=>r.shiftId===shift.id)!;expect(Number(run.minutes)+Number(stop.minutes)).toBe(shift.plannedMinutes)}
 });
 it('separates broader P3 evidence and respects event/recorded cutoff without substitutions',()=>{
  expect(visibleFacts(fixture,'counts','2026-10-06T14:00:00Z')).toEqual([]);
  expect(visibleFacts(fixture,'counts','2026-10-06T14:05:00Z')).toHaveLength(6);
  expect(visibleFacts(fixture,'counts','2026-11-03T14:30:00Z',{revision:'P3'}).length).toBeGreaterThan(0);
  expect(visibleFacts(fixture,'counts','2026-10-06T14:45:00Z',{revision:'P3'})).toEqual([]);
  expect(fixture.version).toBe('ekas-platform-synthetic-v2');
 });
});
