import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {ManufacturingService,createManufacturingClient} from './service';
async function ask(text:string,prior:string[]=[]){
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
 let c=await client.createConversation('trust-period');let i=0;
 for(const q of [...prior,text])c=await client.turn(c.id,c.version,q,'trust-'+(++i));
 return c;
}
it('yesterday production stays off the training dataset and offers the latest supplied day',async()=>{
 const c=await ask('Why did we miss production yesterday?'),turn=c.content.conversation.turns.at(-1)!;
 expect(c.content.conversation.dataset).not.toBe('training');
 expect(c.content.conversation.context.caseFocus).toBeNull();
 expect(c.content.conversation.context.lastIntent).toBe('period-offer');
 expect(turn.answer.sourceIds).toEqual([]);
 expect(turn.answer.text).toBe("I don't have data for yesterday. The latest available production day is 2026-10-06. Would you like me to use that?");
 expect(turn.answer.text).not.toMatch(/below the approved plan|TP-S\d: Good units|good units total/i);
});
it('an accepted latest day answers the supplied plan without a silent swap',async()=>{
 const c=await ask('Yes, use 2026-10-06',['Why did we miss production yesterday?']),turn=c.content.conversation.turns.at(-1)!;
 expect(c.content.conversation.context.caseFocus).toBe('downtime');
 expect(c.content.conversation.context.period).toBe('2026-10-06 day shift');
 expect(turn.answer.text).toMatch(/latest available day you accepted, 2026-10-06/);
 expect(turn.answer.text).toMatch(/below the approved plan/);
 expect(turn.answer.text).toMatch(/against/);
 expect(turn.answer.text).toMatch(/Line 03/);
 expect(turn.answer.text).toMatch(/FEED-03/);
 expect(turn.answer.text).toMatch(/JOB-8303/);
 expect(turn.answer.text).toMatch(/I would start with the feeder-jam evidence/);
 expect(turn.answer.sourceIds.length).toBeGreaterThan(0);
});
it('a refusal of the offered day does not open the supplied case',async()=>{
 const c=await ask('No',['Why did we miss production yesterday?']);
 expect(c.content.conversation.context.caseFocus).toBeNull();
 expect(c.content.conversation.turns.at(-1)!.answer.text).not.toMatch(/below the approved plan/);
});
it('yes without an offered day does not open yesterday’s case',async()=>{
 const c=await ask('Yes');
 expect(c.content.conversation.context.caseFocus).toBeNull();
});
it('an explicit year other than the supplied cohort is not answered with that cohort',async()=>{
 const c=await ask('OEE by machine in March 2025'),text=c.content.conversation.turns.at(-1)!.answer.text;
 expect(text).toBe('March 2025 is not supplied. No other year was substituted.');
 expect(text).not.toMatch(/2026/);
 expect(c.content.conversation.turns.at(-1)!.answer.sourceIds).toEqual([]);
 expect(c.content.conversation.context.period).not.toBe('March');
});
it('a month name without a year still uses the supplied monthly cohort',async()=>{
 const text=(await ask('What was OEE in March?')).content.conversation.turns.at(-1)!.answer.text;
 expect(text).toMatch(/March/);
 expect(text).toMatch(/2026/);
});
it('an explicit Machine 1 question clears an unresolved TP-S1 clarification',async()=>{
 const c=await ask('Show quality for Machine 1',['What is quality on TP-S1?']),turns=c.content.conversation.turns;
 expect(turns[0].answer.text).toMatch(/Requested: TP-S1/);
 expect(turns[1].answer.text).not.toMatch(/Requested: TP-S1/);
 expect(turns[1].answer.text).toMatch(/Machine 1/);
 expect(c.content.conversation.context.machine).toBe('Machine 1');
 expect(c.content.conversation.context.clarification).toBeNull();
});
it('a vague follow-up keeps the unresolved TP-S1 clarification',async()=>{
 const c=await ask('Show me.',['What is quality on TP-S1?']);
 expect(c.content.conversation.context.lastIntent).toBe('asset-scope-clarify');
 expect(c.content.conversation.turns.at(-1)!.answer.text).toMatch(/Requested: TP-S1/);
});
