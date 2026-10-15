import {describe,it,expect} from 'vitest';
import {resolveComparisonNotice,unavailableComparisonNotice} from './comparisonNotice';
describe('resolved comparison warnings',()=>{
 it('removes the old unavailable notice after choosing a supplied alternative',()=>{expect(resolveComparisonNotice(unavailableComparisonNotice)).toBe('');});
 it('does not dismiss unrelated action or storage notices',()=>{expect(resolveComparisonNotice('Local save unavailable')).toBe('Local save unavailable');});
});
