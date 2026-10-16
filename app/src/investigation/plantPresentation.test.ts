import {expect,it} from 'vitest';
import {fixtureCase} from './cases';
import {documentLine,eventLine,groupThousands,humanScopeWhen,journeyAction,journeyCommands,lifecycleState,nextLifecycleCommand,overviewCopy,presentDocuments,snapshotLabel} from './plantPresentation';
import {createWorkflow,executeWorkflow,workflowView} from './workflow';

it('reads the next step from the saved owner and does not invent one',()=>{
 expect(lifecycleState({title:'Northworks feeder-jam plan miss',owner:{requested:null,accepted:null},action:{status:'draft'}})).toEqual({status:'No owner requested',owner:'Not assigned',next:'Request an owner'});
 expect(lifecycleState({owner:{requested:'maintenance',accepted:null},action:{status:'draft'}})).toEqual({status:'Awaiting maintenance acceptance',owner:'Maintenance — not yet accepted',next:'Accept ownership'});
 expect(lifecycleState({owner:{requested:'maintenance',accepted:'maintenance'},action:{status:'authorized'},hypotheses:[{id:'h'}]})).toMatchObject({status:'Action authorized',next:'Record performed work'});
});

it('keeps the current and superseded standard work and drops only an identical copy',()=>{
 const docs=fixtureCase('downtime').documents.filter(d=>d.id==='SW-030');
 expect(docs.map(d=>d.version).sort()).toEqual(['FIC-C','FIC-D']);
 const lines=presentDocuments([...docs,docs[0]]).map(item=>item.line);
 expect(lines).toHaveLength(2);
 expect(lines.some(line=>line.startsWith('Standard Work 030 — Current / Feeder setup reference and evidence record'))).toBe(true);
 expect(lines.some(line=>line.startsWith('Standard Work 030 — Superseded /'))).toBe(true);
 const note=fixtureCase('downtime').documents.find(d=>d.id==='NOTE-030')!;
 expect(documentLine(note)).toBe('Technician note — Uncontrolled / The old two-field setup record is sufficient for all product revisions. It is uncontrolled and contradicts the current standard.');
});

it('collapses a duplicate-equivalent note and does not lead with a raw record id',()=>{
 const docs=fixtureCase('downtime').documents;
 const presented=presentDocuments(docs);
 const text=presented.map(item=>item.line).join('\n');
 expect(text).not.toMatch(/NOTE-2401:s1|NOTE-2402-COPY|Fictional note claims/);
 expect(text).toContain('Technician note — Uncontrolled / Feeder stopped with housings backed up at the guide during JOB-8301.');
 const kept=presented.find(item=>item.sources.some(source=>source.startsWith('NOTE-2402 ·')));
 expect(kept?.sources.some(source=>source.startsWith('NOTE-2402-COPY ·'))).toBe(true);
 expect(presented.filter(item=>item.line.includes('Feeder jam recurred'))).toHaveLength(1);
 expect(presentDocuments(docs).filter(item=>item.line.startsWith('Standard Work 030'))).toHaveLength(2);
});

it('requests the case acceptance owner and prints counts and scope dates for people',()=>{
 expect(nextLifecycleCommand({caseId:'downtime',title:'Northworks feeder-jam plan miss',owner:{requested:null,accepted:null},action:{status:'draft'}})).toEqual({kind:'request-assignment',owner:'maintenance'});
 expect(nextLifecycleCommand({owner:{requested:'maintenance',accepted:null},action:{status:'draft'}})).toEqual({kind:'accept-assignment'});
 expect(groupThousands('Production finished 150 good units below the approved plan: 2154 against 2304. The 726-unit loss. The separate 2026 monthly cohort. 2026-10-06 day shift.')).toBe('Production finished 150 good units below the approved plan: 2,154 against 2,304. The 726-unit loss. The separate 2026 monthly cohort. 2026-10-06 day shift.');
 expect(humanScopeWhen('2026-10-06 day shift','day')).toBe('Oct 6, 2026, day shift');
});

it('describes a stop from its own minutes, asset, and UTC day',()=>{
 expect(eventLine({id:'stop-01',start:18,end:30,reason:'feeder_jams',startAt:'2026-10-06T06:18:00Z'},'FEED-03')).toBe('Stop event 01 — Feeder jams / 12 minutes · FEED-03 · Oct 6');
});

it('prints the synthetic snapshot in UTC',()=>{
 expect(snapshotLabel('2026-10-06T14:45:00Z')).toBe('Snapshot: Oct 6, 2026 · 2:45 PM UTC · Synthetic');
});

it('follows the saved case through owner, work, verification, sustainment, and a new cycle',()=>{
 for(const caseId of ['downtime','speed','quality'] as const){
  let w=createWorkflow(caseId);
  const labels:string[]=[];
  for(let i=0;i<40&&w.cycle===1;i++){
   const view=workflowView(w);
   const facts={verificationRecorded:w.verificationRecorded};
   const step=journeyAction(view,'manager',facts);
   const commands=journeyCommands(view,'manager',facts);
   expect(step.command,`${caseId} ${view.action.status} ${view.verification.status} ${view.sustain.status}`).toBeTruthy();
   expect(commands.length,caseId).toBeGreaterThan(0);
   expect(step.label).not.toMatch(/H1|SAFETY-01|investigation-v1|fixture|snapshot|(?:^|\s)Open the /i);
   labels.push(step.label);
   try{commands.forEach((command,index)=>{w=executeWorkflow(w,command,step.actor,'journey-'+caseId+'-'+i+'-'+index);});}catch(error){throw Error(caseId+' after ['+labels.join(' | ')+'] asOf '+view.asOf+' verification '+view.verification.status+' command '+JSON.stringify(commands)+' '+(error instanceof Error?error.message:error));}
  }
  expect(w.cycle,caseId).toBe(2);
  expect(w.priorCycles[0].accepted,caseId).toBe(true);
  expect(labels,caseId).toEqual(expect.arrayContaining(['Request an owner','Accept ownership','Record this hypothesis','Recommend this action','Request authorization','Authorize the action','Check the completed repair','Record performed work','Check results after two weeks','Review safety','Review verification result','Check whether the result held','Record sustainment','Check the later shifts','Reopen the investigation']));
  expect(labels.some(label=>/snapshot|(?:^|\s)Open the /i.test(label)),caseId).toBe(false);
  expect(labels.join(' '),caseId).not.toContain('Safety review required');
 }
 const fresh=workflowView(createWorkflow('downtime'));
 expect(journeyAction(fresh).label).toBe('Request an owner');
 expect(journeyAction(fresh).actor).toBe('manager');
});

it('separates overview facts into sentences taken from the case',()=>{
 const fresh={title:'Northworks feeder-jam plan miss',owner:{requested:null,accepted:null},action:{status:'draft'},goal:{gap:150},events:Array.from({length:12},(_,index)=>({id:'stop-'+String(index+1).padStart(2,'0')})),hypotheses:[]};
 expect(overviewCopy(fresh)).toBe('150 units below plan. Status: No owner requested. Owner: Not assigned. 12 stops are recorded. No hypothesis is recorded.');
 const requested={...fresh,owner:{requested:'maintenance',accepted:null}};
 expect(overviewCopy(requested)).toBe('150 units below plan. Status: Awaiting maintenance acceptance. Owner: Maintenance — not yet accepted. 12 stops are recorded. No hypothesis is recorded.');
 expect(overviewCopy({title:'Open case',goal:{gap:null}})).toBe('Plan gap is not available at this cutoff. Status: No owner requested. Owner: Not assigned. No hypothesis is recorded.');
 expect(overviewCopy({title:'Open case',goal:{gap:10},hypotheses:[{id:'h'}],verification:{status:'safety_review_required'}})).toBe('10 units below plan. Status: Measurement recorded. Owner: Not assigned. 1 hypothesis is recorded.');
 expect(overviewCopy({title:'Open case',goal:{gap:10},hypotheses:[{id:'h'}],verification:{status:'safety_review_required'}},{verificationRecorded:true})).toContain('Status: Safety review pending.');
});
