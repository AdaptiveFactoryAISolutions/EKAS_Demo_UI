import {describe,it,expect} from 'vitest';
import {compilePhrase,emptyQuery,activeMeasures} from './workspaceQuery';
import {boundedFollowup} from './boundedFollowup';
const provider={fixtureVersion:'training-ui-acceptance-v1',version:'1.0.0',contextId:'oee-zero-unavailable'} as const;
const previous={...emptyQuery(),provider,columns:['goodUnits','asset']};
describe('exact source entities do not contribute metric intent',()=>{
 for(const quote of ['',"'",'"'])for(const [metric,id,expected] of [['OEE','UIA-ZERO-DOWNTIME','oee'],['Downtime','UIA-HIGH-OEE','downtime']])it(metric+' for '+quote+id+quote,()=>{const q=compilePhrase(`${metric} by job for ${quote}${id}${quote}`,previous);expect(activeMeasures(q)).toEqual([expected]);expect(q.filters).toContainEqual({col:'job',op:'in',values:[id]})});
 it('selects both explicitly requested metrics outside IDs',()=>expect(activeMeasures(compilePhrase('OEE and Downtime by job for UIA-HIGH-OEE',previous))).toEqual(['downtime','oee']));
 it('bare recognized ID has no metric intent or fabricated fallback',()=>{expect(activeMeasures(compilePhrase('UIA-HIGH-OEE',previous))).toEqual([]);const f=boundedFollowup('UIA-HIGH-OEE',previous);expect(f.kind).toBe('clarification');expect(f.query).toEqual(previous)});
 it('explicit for followup retains current metric without identifier pollution',()=>expect(activeMeasures(compilePhrase('for UIA-HIGH-OEE',previous))).toEqual(['goodUnits']));
 it('does not guess a neighboring ID or ambiguous loss measure',()=>{const q=compilePhrase('loss for UIA-HIGH-OEE-UNKNOWN',previous);expect(activeMeasures(q)).toEqual([]);expect(q.filters.some(f=>f.values.includes('UIA-HIGH-OEE'))).toBe(false);expect(boundedFollowup('show me the loss',previous).kind).toBe('clarification')});
 it('multiple exact jobs remain explicit scope',()=>expect(compilePhrase('OEE by job for UIA-HIGH-OEE and UIA-ZERO-DOWNTIME',previous).filters).toContainEqual({col:'job',op:'in',values:['UIA-HIGH-OEE','UIA-ZERO-DOWNTIME']}));
});
