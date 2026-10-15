import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {ManufacturingService,createManufacturingClient} from './service';
it('investigation creation binds the exact result version, goal, scope and cutoff',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository())),result=await client.readSourceResult('speed');const {view,synthetic,...ref}=result;
 const created=await client.createFromResult('speed',ref,'source-bound');expect(created.content.workflow.origin).toEqual(ref);
 let invalidKey=0;for(const bad of [{...ref,resultVersion:2},{...ref,goalId:'wrong-goal'},{...ref,asOf:'2026-10-20T15:15:00Z'},{...ref,context:{...ref.context,revision:'S2'}}])await expect(client.createFromResult('speed',bad,'wrong-'+(++invalidKey))).rejects.toThrow('INVALID_REQUEST');
});
it('declared negative variants open through chat and cannot replace a saved case history',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));let c=await client.createConversation('variant-create');c=await client.turn(c.id,c.version,'Investigate downtime case variant stale.','variant-stale');expect(c.content.conversation.turns.at(-1)?.view?.eligibility.status).toBe('stale');expect(c.content.conversation.turns.at(-1)?.view?.challenge.source).toContain('/stale');
 await expect(client.turn(c.id,c.version,'Investigate downtime case variant missing_source.','variant-change')).rejects.toThrow('INVALID_REQUEST');expect((await client.readConversation(c.id)).version).toBe(c.version);
});
it('one durable conversation switches datasets without mixing monthly, training and investigation contexts',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));let c=await client.createConversation('unified-create');const id=c.id;let i=0;
 for(const text of ['What was OEE in January?','Training OEE for July 2026 by asset.','And downtime?','Return to the monthly cohort.','And March?','We missed our goal.','What job was running?'])c=await client.turn(c.id,c.version,text,'unified-'+(++i));
 expect(c.id).toBe(id);expect(c.content.conversation.turns).toHaveLength(7);expect(c.content.conversation.turns[1].training).toBeTruthy();expect(c.content.conversation.turns[2].training).toBeTruthy();expect(c.content.conversation.turns[4].context.period).toBe('March');expect(c.content.conversation.turns.at(-1)?.view?.context.job).toBe('JOB-8303');
 const historical=c.content.conversation.turns[1];expect(historical.asOf).not.toBe(c.content.conversation.turns.at(-1)?.asOf);
});
it('persistent conversational turns atomically retain context, evidence, investigation identity and exact retry results',async()=>{
 let bytes:string|null=null;const port={read:()=>bytes,write:(s:string)=>{bytes=s}};let client=createManufacturingClient(new ManufacturingService(new MockRepository(port)));
 let c=await client.createConversation('create');
 for(const text of ['What was OEE in January?','And March?','What about Machine 2?','No, I meant Machine 1.','Compare that to last month.','Go back to the first machine.','What was FPY?'])c=await client.turn(c.id,c.version,text,text);
 expect(c.content.conversation.context).toMatchObject({machine:'Machine 1',period:'March',comparisonPeriod:'February',metric:'fpy'});
 const result=await client.turn(c.id,c.version,'We missed our production goal.','goal');expect(result.content.conversation.investigationId).toBeTruthy();expect(result.content.conversation.turns.at(-1)?.answer.text).toContain('150');
 expect(await client.turn(c.id,c.version,'We missed our production goal.','goal')).toEqual(result);
 await expect(client.turn(c.id,c.version,'Why?','stale')).rejects.toThrow('CONFLICT');
 client=createManufacturingClient(new ManufacturingService(new MockRepository(port)));const reopened=await client.readConversation(c.id);expect(reopened).toEqual(result);
 const next=await client.turn(reopened.id,reopened.version,'What happened with the feeder-jam issue?','return');expect(next.content.conversation.investigationId).toBe(result.content.conversation.investigationId);
});
it('a failed atomic conversation save neither creates an investigation nor acknowledges a turn',async()=>{
 let fail=false,bytes:string|null=null;const repo=new MockRepository({read:()=>bytes,write:s=>{if(fail)throw Error('write failed');bytes=s}}),client=createManufacturingClient(new ManufacturingService(repo));let c=await client.createConversation('create');fail=true;await expect(client.turn(c.id,c.version,'We missed our goal.','goal')).rejects.toThrow('STORAGE_UNAVAILABLE');expect(repo.state.resources).toHaveLength(1);expect((await client.readConversation(c.id)).version).toBe(1);fail=false;c=await client.turn(c.id,1,'We missed our goal.','goal');expect(c.content.conversation.turns).toHaveLength(1);expect(repo.state.resources).toHaveLength(2);
});
it('three case journeys progress entirely through conversation and retain clean recurrence cycles',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
 for(const caseId of ['downtime','speed','quality'] as const){let c=await client.createConversation('create-'+caseId);let i=0;const turn=async(text:string)=>{c=await client.turn(c.id,c.version,text,caseId+'-'+(++i));expect(c.content.conversation.turns.at(-1)?.blocked,text).toBeNull();};
  await turn('Investigate '+caseId+' case.');await turn('Record the first hypothesis.');await turn('Plan the first test.');await turn('Assign it.');await turn('Maintenance accepted it.');await turn('Recommend the bounded repair.');await turn('Request approval.');await turn('As manager approve the repair.');await turn('Advance simulation to repair completed.');await turn('Record the inspection result.');await turn('As maintenance record the repair.');await turn('Advance simulation to the post verification period.');await turn('Record verification.');await turn('As safety record safety review.');await turn('As manager accept the measured result.');await turn('Advance simulation to sustain.');await turn('Record sustain observations.');await turn('Did it hold?');expect(c.content.conversation.turns.at(-1)?.view?.sustain.status).toBe('sustained');await turn('Advance simulation to recurrence.');await turn('Record sustain observations.');await turn('Reopen it.');expect(c.content.conversation.turns.at(-1)?.view?.cycle).toBe(2);expect(c.content.conversation.turns.at(-1)?.view?.verification.postCount).toBe(0);
 }
},30000);
