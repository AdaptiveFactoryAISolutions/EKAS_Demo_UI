import {describe,it,expect} from 'vitest';
import {boundedAnswer} from './conversationModel';
const respond=(q:string)=>boundedAnswer(q,'Plant','2026-10-06T14:45:00Z','oee');
describe('natural bounded investigation questions',()=>{
 it('answers job burden with exact exposure and source',()=>{expect(respond('Which job for NW-A revision P2 has the largest downtime burden?')).toContain('JOB-8303');expect(respond('Which production job lost most time?')).toContain('120 / 480');});
 it('attributes technician reports and preserves uncertain cause',()=>{const a=respond('What did the technician actually observe about FEED-03, and what is still only suspected?');expect(a).toContain('NOTE-2402');expect(a).toContain('Demo maintenance technician');expect(a).toContain('hypothesis');});
 it('identifies exact current approved references and anchors',()=>{const a=respond('Which approved reference applies to this part and operation?');expect(a).toContain('SW-030@FIC-D');expect(a).toContain('record-check');});
 it('drafts a bounded case and verification without performing work',()=>{const a=respond('Draft an improvement case for these feeder stops. How would we verify it?');expect(a).toContain('Maya Chen');expect(a).toContain('≤30');expect(a).toContain('does not approve');});
 it('answers supplied loss decomposition without conflating the plan gap',()=>{const a=respond('Where did the supplied shift lose good output, and what is the biggest loss?');expect(a).toContain('2,154');expect(a).toContain('2,304');expect(a).toContain('downtime');});
});
