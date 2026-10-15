import {describe,it,expect} from 'vitest';
import {proposeScope,resolveExact,version,missingComparison} from './revisionModel';
describe('immutable investigation corrections',()=>{
 it('withholds unsupported previous-shift declines',()=>{expect(missingComparison('Why did OEE fall last shift?')).toBe(true);expect(missingComparison('Why feeder jams?')).toBe(false);});
 it('proposes scope without committing',()=>{expect(proposeScope('Plant','Line 03')).toEqual({current:'Plant',proposed:'Line 03'});});
 it('never substitutes a neighboring saved investigation',()=>{expect(resolveExact([{id:'a'}],'missing')).toBeNull();});
 it('keeps original answer and timestamp when corrected',()=>{const original={answer:'a',at:'2026-10-06'};const next={answer:'b',at:'2026-10-20'};expect(version(original,next)).toEqual([original,next]);expect(original.at).toBe('2026-10-06');});
});
