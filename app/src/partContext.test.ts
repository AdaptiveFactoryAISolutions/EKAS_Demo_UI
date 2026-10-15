import {describe,it,expect} from 'vitest';
import {parseContextCorrection,contextEligibility,suppliedContext} from './partContext';
describe('part/revision context contract',()=>{
 it('recognizes explicit unsupported revision without substituting P2',()=>{expect(parseContextCorrection('Use NW-A revision P3 instead',suppliedContext())).toEqual({part:'NW-A',revision:'P3',status:'unsupported'});});
 it('asks for missing part and revision rather than guessing',()=>{expect(parseContextCorrection('Use a different part revision',suppliedContext())).toEqual({part:null,revision:null,status:'pending'});});
 it('resolves pending clarification only to the exact provided values',()=>{expect(parseContextCorrection('NW-A P3',{part:null,revision:null,status:'pending'})).toEqual({part:'NW-A',revision:'P3',status:'unsupported'});});
 it('returns deliberately to supplied P2',()=>{expect(parseContextCorrection('Use NW-A revision P2',{part:'NW-A',revision:'P3',status:'unsupported'})).toEqual({part:'NW-A',revision:'P2',status:'valid'});});
 it('suppresses numeric results and decisions in unsupported and pending contexts',()=>{for(const status of ['pending','unsupported'] as const){const result=contextEligibility({part:'NW-A',revision:status==='unsupported'?'P3':null,status},'Normal','2026-10-06T14:45:00Z');expect(result.display).toBe(false);expect(result.decision).toBe(false);expect(result.status).toBe('missing');}});
});
