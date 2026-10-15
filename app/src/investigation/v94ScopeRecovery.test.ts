import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';import {ManufacturingService} from './service';import {createManufacturingClient} from './clientPort';
it('keeps the active training dataset and cutoff on an unknown asset, withholds ambiguous followups and accepts an explicit training recovery',async()=>{
 let raw:string|null=null;const storage={read:()=>raw,write:(x:string)=>{raw=x}},repo=new MockRepository(storage),service=new ManufacturingService(repo),client=createManufacturingClient(service);let c=await client.createConversation('create'),key=0;const say=async(q:string)=>{c=await client.turn(c.id,c.version,q,'turn-'+(++key));return c.content.conversation};
 await say('Investigate quality.');const investigation=c.content.conversation.investigationId;
 await say('Why did OEE move in TP-S1 manufacturing?');await say('What about downtime?');const cutoff=c.content.conversation.turns.at(-1)!.asOf;
 let x=await say('What is OEE for FEED99?');const old=structuredClone(x.turns.at(-1));expect(x.dataset).toBe('training');expect(x.turns.at(-1)!.asOf).toBe(cutoff);expect(x.investigationId).toBe(investigation);expect(x.turns.at(-1)!.answer.sourceIds).toEqual([]);
 x=await say('What about downtime?');expect(x.turns.at(-1)!.answer.sourceIds).toEqual([]);expect(x.turns.at(-1)!.answer.text).toContain('FEED99');
 x=await say('What is OEE in TP-S1 manufacturing?');expect(x.dataset).toBe('training');expect(x.turns.at(-1)!.answer.text).toContain('OEE 79.1%');
 x=await say('Show downtime in TP-S1 manufacturing as a table.');expect(x.turns.at(-1)!.answer.text).toContain('Downtime 600');
 const restarted=createManufacturingClient(new ManufacturingService(new MockRepository(storage))),saved=await restarted.readConversation(c.id);expect(saved).toEqual(c);expect(saved.content.conversation.turns[3]).toEqual(old);
 x=await say('Return to original investigation.');expect(x.dataset).toBe('manufacturing');expect(x.context.caseFocus).toBe('quality');expect(x.investigationId).toBe(investigation);
});
