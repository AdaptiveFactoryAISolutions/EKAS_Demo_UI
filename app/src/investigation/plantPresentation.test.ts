import {expect,it} from 'vitest';
import {fixtureCase} from './cases';
import {demoClockSentence,documentLine,eventLine,groupThousands,humanScopeWhen,journeyAction,journeyBrief,journeyCommands,lifecycleState,nextLifecycleCommand,overviewCopy,plantDayLabel,plantInstantLabel,plausibleLine,presentDocuments,presentPlantTimestamps,presentedStatus,snapshotLabel,visiblePeriod} from './plantPresentation';
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
 expect(plantDayLabel('2026-10-06 day shift')).toBe('Oct 6');
 expect(plantDayLabel('2026-10-06T14:45:00Z')).toBe('Oct 6');
});

it('describes a stop from its own minutes, asset, and UTC day',()=>{
 expect(eventLine({id:'stop-01',start:18,end:30,reason:'feeder_jams',startAt:'2026-10-06T06:18:00Z'},'FEED-03')).toBe('Stop event 01 — Feeder jams / 12 minutes · FEED-03 · Oct 6');
});

it('prints the plant snapshot without a raw clock label',()=>{
 expect(snapshotLabel('2026-10-06T14:45:00Z')).toBe('Snapshot: Oct 6, 2026 · 2:45 PM · Synthetic');
 expect(plantInstantLabel('2026-10-06T14:45:00Z')).toBe('Oct 6, 2026 · 2:45 PM');
 expect(presentPlantTimestamps('Review cutoff 2026-10-06T14:45:00Z. Window 2026-10-06T06:00:00Z to 2026-10-06T14:00:00Z.')).toBe('Review cutoff Oct 6, 2026 · 2:45 PM. Window Oct 6, 2026 · 6:00 AM to Oct 6, 2026 · 2:00 PM.');
 expect(snapshotLabel('2026-10-20T15:15:00Z')).not.toMatch(/UTC|T15:15:00Z/);
 expect(visiblePeriod('2026-10-06T14:45:00Z')).toBe('Oct 6');
 expect(visiblePeriod('2026-10-20T15:15:00Z')).toBe('Follow-up measurement period · Oct 20');
 expect(visiblePeriod('2026-10-27T14:00:00Z')).toBe('Sustainment check · Oct 27');
 expect(visiblePeriod('2026-11-03T14:00:00Z')).toBe('Later-shift check · Nov 3');
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
   const brief=[...journeyBrief(view,facts).known,...journeyBrief(view,facts).records].join('\n');
   if(!view.owner.accepted){
    expect(presentedStatus(view,facts),`${caseId} ${step.label}`).not.toMatch(/Owner accepted|Maintenance accepted/);
    const ownerLine=lifecycleState(view).owner;
    expect(ownerLine,`${caseId} ${step.label}`).not.toMatch(/Maintenance accepted/);
    expect(brief,`${caseId} ${step.label}`).not.toMatch(/Owner accepted|Maintenance accepted|Work performed|Observed result|Action authorized/);
   }
   if(['add-hypothesis','request-assignment','accept-assignment','recommend-action','request-authorization','authorize-action'].includes(step.command?.kind||''))expect(brief,`${caseId} ${step.label}`).not.toMatch(/Work performed|Observed result/);
   if(step.label==='Record this hypothesis'&&caseId==='quality'){
    expect(brief).toContain('a final disposition was recorded for the part');
    expect(brief).toContain('final good output and first-pass yield are different measures');
    expect(brief).not.toMatch(/unique terminal disposition|not FPY/);
   }
   if(step.label==='Recommend this action'&&caseId==='downtime'){
    expect(brief).toContain('Engineering change 003');
    expect(brief).not.toContain('EC-003');
   }
   if(step.label==='Review safety'){
    expect(brief).toContain('Main measure:');
    expect(brief).toContain('Guardrails');
    expect(brief).toContain('Quality:');
    expect(brief).toContain('Energy:');
    expect(brief).toContain('Safety: Pending review');
    expect(brief).toContain('Guardrail results');
    expect(brief).toMatch(/Baseline was \S/);
    expect(brief).not.toMatch(/\d\s+%/);
    expect(brief).not.toMatch(/Primary endpoint|\bPASS\b|\bPENDING\b|\bFAIL\b/);
    expect(brief.indexOf('Guardrail results')).toBeGreaterThan(brief.indexOf('Good units'));
   }
   if(step.label==='Reopen the investigation'&&caseId==='quality'){
    expect(brief).toContain('Reopen if first-pass yield falls below 92% for two consecutive eligible shifts.');
    expect(brief).toContain('Latest eligible shifts: 89% and 88%.');
    expect(brief).not.toMatch(/\d\s+%/);
    expect(brief).not.toContain('% first-pass accepted');
   }
   if(step.label==='Reopen the investigation'&&caseId!=='quality')expect(brief).toMatch(/Reopen if .+ minutes per eligible shift/);
   labels.push(step.label);
   try{commands.forEach((command,index)=>{w=executeWorkflow(w,command,step.actor,'journey-'+caseId+'-'+i+'-'+index);});}catch(error){throw Error(caseId+' after ['+labels.join(' | ')+'] asOf '+view.asOf+' verification '+view.verification.status+' command '+JSON.stringify(commands)+' '+(error instanceof Error?error.message:error));}
  }
  expect(w.cycle,caseId).toBe(2);
  expect(w.priorCycles[0].accepted,caseId).toBe(true);
  expect(labels,caseId).toEqual(expect.arrayContaining(['Request an owner','Accept ownership','Record this hypothesis','Recommend this action','Request authorization','Authorize the action','Check the completed repair','Record performed work','Check results after two weeks','Review safety','Review verification result','Check whether the result held','Record sustainment','Check the later shifts','Reopen the investigation']));
  expect(labels[0],caseId).toBe('Record this hypothesis');
  expect(labels.indexOf('Record this hypothesis'),caseId).toBeLessThan(labels.indexOf('Request an owner'));
  expect(labels.indexOf('Request an owner'),caseId).toBeLessThan(labels.indexOf('Accept ownership'));
  expect(labels.indexOf('Accept ownership'),caseId).toBeLessThan(labels.indexOf('Recommend this action'));
  expect(labels.some(label=>/snapshot|(?:^|\s)Open the /i.test(label)),caseId).toBe(false);
  expect(labels.join(' '),caseId).not.toContain('Safety review required');
 }
 const fresh=workflowView(createWorkflow('downtime'));
 expect(journeyAction(fresh).label).toBe('Record this hypothesis');
 expect(journeyAction(fresh).actor).toBe('manager');
 expect(presentedStatus(fresh)).toBe('No owner requested');
});

it('separates overview facts into sentences taken from the case',()=>{
 const fresh={title:'Northworks feeder-jam plan miss',owner:{requested:null,accepted:null},action:{status:'draft'},goal:{gap:150},events:Array.from({length:12},(_,index)=>({id:'stop-'+String(index+1).padStart(2,'0')})),hypotheses:[]};
 expect(overviewCopy(fresh)).toEqual({known:['12 stops are recorded.'],unknown:['No hypothesis has been recorded.','No owner has been assigned.','The result has not been measured.'],next:'Request an owner'});
 const freshText=[...overviewCopy(fresh).known,...overviewCopy(fresh).unknown,overviewCopy(fresh).next].join(' ');
 expect(freshText).not.toContain('150 units below plan');
 expect(freshText).not.toContain('Status:');
 expect(freshText.match(/hypothesis/gi)).toHaveLength(1);
 const requested={...fresh,owner:{requested:'maintenance',accepted:null}};
 expect(overviewCopy(requested).unknown).toContain('Owner acceptance has not been recorded.');
 expect(overviewCopy(requested).next).toBe('Accept ownership');
 const recorded={...fresh,hypotheses:[{id:'h'}]};
 const recordedText=[...overviewCopy(recorded).known,...overviewCopy(recorded).unknown].join(' ');
 expect(recordedText.match(/1 hypothesis is recorded/g)).toHaveLength(1);
 expect(recordedText).not.toContain('No hypothesis has been recorded');
 expect(overviewCopy({title:'Open case',goal:{gap:null}}).known).toContain('The case is open.');
 expect([...overviewCopy({title:'Open case',goal:{gap:null}}).known,...overviewCopy({title:'Open case',goal:{gap:null}}).unknown].join(' ')).not.toContain('Plan gap');
 expect(overviewCopy({title:'Open case',goal:{gap:10},hypotheses:[{id:'h'}],verification:{status:'safety_review_required'}}).unknown).toContain('The safety review has not been recorded.');
 expect(overviewCopy({title:'Open case',goal:{gap:10},hypotheses:[{id:'h'}],verification:{status:'safety_review_required'}},{verificationRecorded:true}).unknown).toContain('The safety review is still pending.');
});

it('keeps a fresh case on the current owner state and cites only supported plausibility',()=>{
 const fresh=workflowView(createWorkflow('downtime'));
 const text=[...journeyBrief(fresh).known,...journeyBrief(fresh).records].join(' ');
 expect(text).not.toMatch(/authored acceptance|Fictional maintenance|performed by|Owner accepted|Work performed/i);
 expect(text).toContain('Hypothesis: Guide wear or feeder setup may contribute to jams.');
 expect(presentedStatus(fresh)).toBe('No owner requested');
 const quality=plausibleLine('quality',['quality-investigation-v1-baseline-1-reason']);
 expect(quality).toContain('controlled acceptance limit');
 expect(quality).toContain('0.10 mm');
 expect(quality).toContain('a final disposition was recorded for the part');
 expect(quality).toContain('final good output and first-pass yield are different measures');
 expect(quality).not.toMatch(/QUALITY-NOTE-01|superseded|NOT released|unique terminal disposition|not FPY/);
 const speed=plausibleLine('speed',['speed-investigation-v1-baseline-1-reason']);
 expect(speed).toContain('pressure recovery');
 expect(speed).toContain('Current controlled record');
 expect(demoClockSentence('2026-10-20T15:15:00Z')).toBe('The demo is now at the follow-up measurement period on Oct 20. Only evidence known by then is available. Existing investigation history and performed-work records stay as recorded.');
 expect(demoClockSentence('2026-10-20T15:15:00Z')).not.toContain('T15:15:00Z');
});
