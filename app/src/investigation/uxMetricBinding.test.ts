import {it,expect} from 'vitest';
import {MockRepository} from '../platform/mockRepository';
import {ManufacturingService} from './service';
import {createManufacturingClient} from './clientPort';
it('F01 fresh quality and FPY questions do not silently publish an OEE result',async()=>{
 for(const question of ['Why did quality drop?','Why is FPY lower?']){
  const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
  let c=await client.createConversation('ux-f01');
  c=await client.turn(c.id,c.version,question,'quality-binding');
  const t=c.content.conversation.turns.at(-1)!;
  expect(['quality','fpy','unavailable']).toContain(t.answer.metric);
  expect(t.answer.text).not.toMatch(/30.*90.*7.*OEE/s);
  expect(await client.readConversation(c.id)).toEqual(c);
 }
},30000);
it.each(['Why did quality drop?','Why is FPY lower?'])('F01 case follow-up binds %s to the requested endpoint without changing the case',async question=>{const client=createManufacturingClient(new ManufacturingService(new MockRepository()));let c=await client.createConversation('case-binding');c=await client.turn(c.id,c.version,'We missed our production goal.','open');const historical=structuredClone(c.content.conversation.turns),caseId=c.content.conversation.investigationId;c=await client.turn(c.id,c.version,question,'follow-up');const t=c.content.conversation.turns.at(-1)!;expect(t.answer.metric).toBe(question.includes('FPY')?'fpy':'quality');expect(t.answer.text).not.toContain('72 feeder-jam minutes');expect(t.answer.text).not.toContain('theoretical capacity');expect(t.answer.text).toMatch(/quality|FPY/i);expect(t.answer.text).toMatch(/cause.*unconfirmed|not establish|unavailable/i);expect(c.content.conversation.investigationId).toBe(caseId);expect(c.content.conversation.turns.slice(0,-1)).toEqual(historical);expect(await client.readConversation(c.id)).toEqual(c);},30000);
