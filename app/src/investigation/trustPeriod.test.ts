import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {ManufacturingService,createManufacturingClient} from './service';
async function ask(text:string,prior:string[]=[]){
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
 let c=await client.createConversation('trust-period');let i=0;
 for(const q of [...prior,text])c=await client.turn(c.id,c.version,q,'trust-'+(++i));
 return c;
}
it('yesterday production stays off the training dataset and does not substitute a plan',async()=>{
 const c=await ask('Why did we miss production yesterday?'),turn=c.content.conversation.turns.at(-1)!;
 expect(c.content.conversation.dataset).not.toBe('training');
 expect(c.content.conversation.context.caseFocus).toBeNull();
 expect(turn.answer.sourceIds).toEqual([]);
 expect(turn.answer.text).toMatch(/Yesterday is unavailable/);
 expect(turn.answer.text).not.toMatch(/TP-S\d: Good units|good units total/i);
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
