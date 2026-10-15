import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {ManufacturingService} from './service';
import {createManufacturingClient} from './clientPort';
it.each(['Cancel this claim review.','Cancel this reviewed claim','Cancel claim','Cancel the claim relationship review.'])('parser-supported cancellation works after scope pause: %s',async(cancel)=>{
 const repo=new MockRepository(),client=createManufacturingClient(new ManufacturingService(repo));let c=await client.createConversation('cancel-alias');let n=0;const say=async(q:string)=>c=await client.turn(c.id,c.version,q,'alias-'+(++n));
 await say('Investigate quality.');await say(cancel.includes('relationship')?'Review a claim relationship.':'Record a reviewed claim.');await say('Change shift to night.');const before=structuredClone(c.content.conversation.turns),count=repo.state.resources.length;
 await say(cancel);expect(c.content.conversation.claimReviewDraft).toBeUndefined();expect(c.content.conversation.evidenceReviewDraft).toBeUndefined();expect(c.content.conversation.turns.at(-1)?.answer.text).toContain('canceled');expect(c.content.conversation.turns.slice(0,before.length)).toEqual(before);expect(repo.state.resources).toHaveLength(count);
},30000);
