import {expect,it} from 'vitest';
import {fixtureCase} from './cases';
import {documentLine,eventLine,lifecycleState,presentDocuments,snapshotLabel} from './plantPresentation';

it('reads the next step from the saved owner and does not invent one',()=>{
 expect(lifecycleState({title:'Northworks feeder-jam plan miss',owner:{requested:null,accepted:null},action:{status:'draft'}})).toEqual({status:'No owner requested',owner:'Not assigned',next:'Request an owner'});
 expect(lifecycleState({owner:{requested:'maintenance',accepted:null},action:{status:'draft'}})).toEqual({status:'Awaiting maintenance acceptance',owner:'Maintenance — not yet accepted',next:'Accept ownership'});
 expect(lifecycleState({owner:{requested:'maintenance',accepted:'maintenance'},action:{status:'authorized'},hypotheses:[{id:'h'}]})).toMatchObject({status:'Action authorized',next:'Record performed work'});
});

it('keeps the current and superseded standard work and drops only an identical copy',()=>{
 const docs=fixtureCase('downtime').documents.filter(d=>d.id==='SW-030');
 expect(docs.map(d=>d.version).sort()).toEqual(['FIC-C','FIC-D']);
 const lines=presentDocuments([...docs,docs[0]]);
 expect(lines).toHaveLength(2);
 expect(lines.some(line=>line.startsWith('Standard Work 030 — Current / Feeder setup reference and evidence record'))).toBe(true);
 expect(lines.some(line=>line.startsWith('Standard Work 030 — Superseded /'))).toBe(true);
 const note=fixtureCase('downtime').documents.find(d=>d.id==='NOTE-030')!;
 expect(documentLine(note)).toMatch(/^Technician note — Uncontrolled \/ Fictional note claims/);
});

it('describes a stop from its own minutes, asset, and UTC day',()=>{
 expect(eventLine({id:'stop-01',start:18,end:30,reason:'feeder_jams',startAt:'2026-10-06T06:18:00Z'},'FEED-03')).toBe('Stop event 01 — Feeder jams / 12 minutes · FEED-03 · Oct 6');
});

it('prints the synthetic snapshot in UTC',()=>{
 expect(snapshotLabel('2026-10-06T14:45:00Z')).toBe('Snapshot: Oct 6, 2026 · 2:45 PM UTC · Synthetic');
});
