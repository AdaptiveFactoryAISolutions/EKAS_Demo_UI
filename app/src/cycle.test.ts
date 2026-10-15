import {describe,it,expect} from 'vitest';
import {prebuiltSnapshots,command,monitor,currentCycleEvidence,hydrateCase} from './model';
describe('A/B intervention cycle evidence isolation',()=>{
 for(const variant of ['A','B'])it(variant+' retains accepted sustain/recurrence history but starts an unmeasured cycle; retries and reload are stable',()=>{
  let c=prebuiltSnapshots().accepted;
  for(const n of [28,26,30,25,27,55,58])c=monitor(c,n);
  expect(c.stage).toBe('reopened');const oldHistory=[...c.history];
  c=command(c,'investigate','cycle-2-investigate',c.version);expect(c.cycle).toBe(2);expect(c.priorCycles[0].operationalAccepted).toBe(true);expect(c.priorCycles[0].monitor).toEqual([28,26,30,25,27,55,58]);expect(c.history.slice(0,oldHistory.length)).toEqual(oldHistory);
  const retry=command(c,'investigate','cycle-2-investigate',c.version-1);expect(retry).toBe(c);
  for(const [action,fields] of [['recommend',{}],['approve',{reason:'new reason'}],['perform',{record:'NEW-WO',confirmation:'new confirmation',performedAt:'2026-11-03T14:20:00Z'}],['verify',{}]] as const){const key='cycle-2-'+action;c=command(c,action,key,c.version,fields);expect(command(c,action,key,c.version-1,fields)).toBe(c)}
  c=hydrateCase(JSON.parse(JSON.stringify(c)));expect(c.stage).toBe('verification');expect(c.cycle).toBe(2);expect(c.operationalAccepted).toBe(false);expect(c.acceptedEligibleShifts).toBe(0);expect(c.safetyEvidence).toBe('');expect(c.monitor).toEqual([]);expect(currentCycleEvidence(c,'2026-11-03T14:20:00Z')).toBe(false);expect(()=>monitor(c,28)).toThrow();expect(c.priorCycles[0].financialValidation).toBe('Unavailable');
 });
 it('does not validate a later intervention using earlier fixture dates; migrates affected saved legacy state',()=>{const c={...prebuiltSnapshots().accepted,performedAt:'2026-11-03T14:20:00Z'};expect(currentCycleEvidence(c,'2026-11-03T14:20:00Z')).toBe(false);const {cycle,...legacy}=c;expect(hydrateCase(legacy).operationalAccepted).toBe(false);expect(hydrateCase(legacy).cycle).toBe(2)});
});
import {measurementRehearsal,recordSafety,acceptOperational} from './model';
it('rehearsal separately records safety, acceptance and due sustain evidence then reopens without certifying a new cycle',()=>{let c=measurementRehearsal();expect(c.operationalAccepted).toBe(false);expect(c.safetyEvidence).toBe('');c=recordSafety(c,'2026-10-20T15:15:00Z');expect(recordSafety(c,'2026-10-20T15:15:00Z')).toBe(c);c=acceptOperational(c,'2026-10-20T15:15:00Z');expect(acceptOperational(c,'2026-10-20T15:15:00Z')).toBe(c);for(const n of [28,26,30,25,27,25,30,29,55,58])c=monitor(c,n);expect(c.stage).toBe('reopened');c=command(c,'investigate','next',c.version);expect(()=>recordSafety(c,'2026-11-03T15:15:00Z')).toThrow();expect(()=>acceptOperational(c,'2026-11-03T15:15:00Z')).toThrow();});
