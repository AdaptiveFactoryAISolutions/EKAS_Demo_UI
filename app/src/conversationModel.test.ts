import {describe,it,expect} from 'vitest';
import {boundedAnswer,resolveComparisonReply} from './conversationModel';
describe('bounded multi-turn and financial answers',()=>{
 it('consumes Line 01 as a scoped comparison reply',()=>{expect(resolveComparisonReply('Line 01')).toBe('Line 01');expect(resolveComparisonReply('use line 02')).toBe('Line 02');});
 it('does not guess unknown comparison scope',()=>{expect(resolveComparisonReply('Line 99')).toBeNull();});
 it('directly states finance evidence is unavailable',()=>{const a=boundedAnswer('What are the verified financial savings?','Line 03','2026-10-06T14:45:00Z','oee');expect(a).toContain('Financial validation unavailable');expect(a).toContain('finance-approved');expect(a).not.toContain('505');});
 it('keeps later operational observations distinct from realized savings',()=>{const a=boundedAnswer('What are the verified financial savings?','Line 03','2026-10-20T15:15:00Z','oee');expect(a).toContain('505 good units');expect(a).toContain('300 downtime minutes');expect(a).toContain('not realized financial savings');});
});

it('leads technician uncertainty with a concise conclusion without duplicating source records',()=>{const text=boundedAnswer('Was guide wear confirmed by the technician, or just suspected?','Line 03','2026-10-06T14:45:00Z','oee');expect(text).toMatch(/^Guide wear was suspected, not confirmed\./);expect(text).toContain('NOTE-2401:s2');expect(text).toContain('NOTE-2402:s3');expect(text.length).toBeLessThan(850);expect(text).not.toContain('NOTE-2402-COPY:s1');});
