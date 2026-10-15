import {describe,it,expect} from 'vitest';
import {buildLineage} from './lineageModel';
import {prebuiltSnapshots} from './model';
const input={scope:'Line 03',asOf:'2026-10-06T14:45:00Z',metric:'oee' as const,view:'Decomposition',turn:{id:'q1',q:'Why feeder jams?',a:'Captured response',scope:'Line 03',asOf:'2026-10-06T14:45:00Z',metric:'oee',revision:2},caseState:prebuiltSnapshots().approved};
describe('typed investigation lineage',()=>{
 it('uses exact question and interpretation context',()=>{const nodes=buildLineage(input);expect(nodes.find(n=>n.type==='Question')?.context.scope).toBe('Line 03');expect(nodes.find(n=>n.type==='Interpretation')?.details).toContain('NW-A / P2');});
 it('provides denominator-bearing result rows and governed chart units',()=>{const nodes=buildLineage(input);expect(nodes.find(n=>n.type==='Result table')?.rows?.[0]).toMatchObject({asset:'Line 03',planned:480,good:630});expect(nodes.find(n=>n.type==='Chart')?.details).toContain('%');});
 it('preserves source revision, author/time and exact anchors',()=>{const detail=buildLineage(input).find(n=>n.type==='Sources')!.details;expect(detail).toContain('PFMEA-030@FIC-C');expect(detail).toContain('NOTE-2402');expect(detail).toContain('s1');});
 it('does not invent an action or verification result for another line',()=>{const nodes=buildLineage({...input,scope:'Line 02'});expect(nodes.find(n=>n.type==='Action')?.available).toBe(false);expect(nodes.find(n=>n.type==='Verification')?.available).toBe(false);});
 it('does not expose future post observations in the initial verification plan',()=>{const n=buildLineage(input).find(n=>n.type==='Verification')!;expect(n.details).toContain('Post observations unavailable');expect(n.details).not.toContain('505');expect(n.details).not.toContain('verified savings');});
});

it('keeps separate attributed source cards and unchanged note sentences, including labelled duplicate',()=>{const source=buildLineage(input).find(n=>n.type==='Sources')!;const cards=(source as any).sourceCards;expect(cards).toBeDefined();const note=cards.find((c:any)=>c.id==='NOTE-2401');expect(note.attribution).toContain('Demo maintenance technician');expect(note.attribution).toContain('2026-09-21T10:10:00Z');expect(note.details).toContain('NOTE-2401:s2: Guide wear may be contributing; no dimensional inspection was completed.');expect(cards.find((c:any)=>c.id==='NOTE-2402-COPY').title).toContain('Duplicate handover copy');});
