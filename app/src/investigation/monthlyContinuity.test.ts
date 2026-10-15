import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {ManufacturingService,createManufacturingClient} from './service';
it('monthly explanation evidence and investigation retain exact source context, uncertainty and history',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));let c=await client.createConversation('monthly');let n=0;const turn=async(text:string)=>{c=await client.turn(c.id,c.version,text,'m-'+(++n));return c.content.conversation.turns.at(-1)!};
 await turn('What was OEE in March?');await turn('Why?');const show=await turn('Show me.');expect(show.answer.visual?.unit).toBe('min');expect(show.answer.visual?.values).toEqual([80]);expect(show.answer.sourceIds).toContain('MONTH-EVENT-March-1');
 const start=await turn('Investigate the root cause.');expect(start.investigationId).toBeTruthy();expect((start as any).monthlySnapshot.context).toMatchObject({machine:'Machine 1',period:'March'});expect((start as any).monthlySnapshot.goal).toBeNull();expect(start.answer.text).toMatch(/investigation|unavailable|unconfirmed/i);
 const proposal=await turn("Let's record a mechanical failure as a possible cause.");expect(proposal.blocked).toBeNull();expect((proposal as any).monthlySnapshot.hypotheses).toHaveLength(1);const question=await turn('Could guide wear be causing this?');expect(question.commands).toEqual([]);expect(question.investigationId).toBe(start.investigationId);
 const work=await turn('Record the repair.');expect(work.blocked).toMatch(/missing|unavailable|proof/i);expect((work as any).monthlySnapshot.action.status).toBe('draft');const saved=await client.readConversation(c.id);expect(saved.content.conversation.turns.at(-1)).toEqual(work);
});
it('monthly discovery retains read-only metric questions and different machine scopes',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));let c=await client.createConversation('scoped');let n=0;const turn=async(text:string)=>{c=await client.turn(c.id,c.version,text,'s-'+(++n));return c.content.conversation.turns.at(-1)!};
 await turn('What was OEE in March?');const original=await turn('Investigate the root cause.');const fpy=await turn('What was FPY?');expect(fpy.answer.text).toMatch(/unavailable|first-pass/i);expect(fpy.commands).toEqual([]);expect(fpy.investigationId).toBe(original.investigationId);const other=await turn('What about Machine 2?');expect(other.investigationId).toBeNull();const returnTurn=await turn('No, I meant Machine 1.');expect(returnTurn.investigationId).toBe(original.investigationId);expect((returnTurn as any).monthlySnapshot.sourceRowId).toBe('MONTH-March-1');
});
