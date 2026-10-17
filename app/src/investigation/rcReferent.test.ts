import{it,expect}from'vitest';
import{MockRepository}from'../platform/mockRepository';
import{ManufacturingService,createManufacturingClient}from'./service';
import{emptyConversationContext,routeConversation}from'./conversation';
import{operatingReview}from'./operatingReview';

const live=(question:string,previous=emptyConversationContext())=>routeConversation(question,previous,'2026-10-06T14:45:00Z',false,true,true,true,4,2,5,2,1,1,1,1,1,1,8);
const replay7=(question:string,previous=emptyConversationContext())=>routeConversation(question,previous,'2026-10-06T14:45:00Z',false,true,true,true,4,2,5,2,1,1,1,1,1,1,7);

async function turns(id:string,...questions:string[]){
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
 let record=await client.createConversation(id);
 for(const [i,question] of questions.entries())record=await client.turn(record.id,record.version,question,id+'-'+i);
 return record;
}

it('1. Plant Review then Investigate it opens the unique recommended case',async()=>{
 const recommended=operatingReview().gaps[0];
 const record=await turns('referent-plant','Run my plant review.','Investigate it.');
 const last=record.content.conversation.turns.at(-1)!;
 expect(record.content.conversation.context.caseFocus).toBe(recommended.caseId);
 expect(record.content.conversation.context.caseFocus).toBe('downtime');
 expect(last.view?.title).toBe(recommended.title);
 expect(last.answer.text).toMatch(/150 good units/);
 expect(last.answer.text).toMatch(/2154 against 2304/);
 expect(last.answer.text).toMatch(/Line 03 missed by 138/);
 expect(last.answer.text).not.toMatch(/Quality loss: observed/);
 expect(record.content.conversation.context.auditMetricId??null).toBeNull();
});

it('2. What should I focus on first then Investigate it opens that same case',async()=>{
 const record=await turns('referent-focus','Run my plant review.','What should I focus on first?','Investigate it.');
 const focus=record.content.conversation.turns.at(-2)!;
 const opened=record.content.conversation.turns.at(-1)!;
 expect(focus.answer.text).toContain('Focus first on Northworks feeder-jam plan miss');
 expect(focus.answer.text).toMatch(/150 good units/);
 expect(focus.context.selectedAuditMetricId??null).toBeNull();
 expect(record.content.conversation.context.caseFocus).toBe('downtime');
 expect(opened.answer.text).toMatch(/150 good units/);
 expect(opened.answer.text).toMatch(/Line 03 missed by 138/);
 expect(opened.answer.text).not.toMatch(/Quality loss: observed/);
});

it('3. an explicit quality question then Investigate it stays on the quality case',async()=>{
 const record=await turns('referent-quality','Investigate quality.','Investigate it.');
 expect(record.content.conversation.context.caseFocus).toBe('quality');
 expect(record.content.conversation.context.machine).toBe('FORM-Q1');
 expect(record.content.conversation.turns.at(-1)!.context.caseFocus).toBe('quality');
 expect(record.content.conversation.investigationIds.quality).toBeTruthy();
 expect(record.content.conversation.investigationIds.downtime).toBeUndefined();
});

it('4. an explicit speed-loss question then Investigate it stays on the speed case',async()=>{
 const record=await turns('referent-speed','Investigate the speed loss.','Investigate it.');
 expect(record.content.conversation.context.caseFocus).toBe('speed');
 expect(record.content.conversation.context.machine).toBe('PRESS-S1');
 expect(record.content.conversation.turns.at(-1)!.context.caseFocus).toBe('speed');
 expect(record.content.conversation.investigationIds.speed).toBeTruthy();
 expect(record.content.conversation.investigationIds.downtime).toBeUndefined();
});

it('5. an ambiguous multi-case answer makes Investigate it ask instead of choosing',async()=>{
 const record=await turns('referent-ambiguous','Run my plant review.','Compare the speed loss and the quality loss.','Investigate it.');
 const named=record.content.conversation.turns.at(-2)!;
 const pronoun=record.content.conversation.turns.at(-1)!;
 expect(named.context.lastIntent).toBe('audit-referent-clarify');
 expect(named.answer.text).toMatch(/more than one case/i);
 expect(pronoun.context.lastIntent).toBe('audit-referent-clarify');
 expect(pronoun.answer.text).toMatch(/more than one case/i);
 expect(record.content.conversation.context.caseFocus).toBeNull();
 expect(record.content.conversation.investigationId).toBeNull();
 expect(pronoun.answer.text).not.toMatch(/Quality loss: observed|150 good units below the approved plan/);
});

it('6. reload preserves the current recommended referent',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
 let record=await client.createConversation('referent-reload');
 record=await client.turn(record.id,record.version,'Run my plant review.','referent-reload-review');
 const reloaded=await client.readConversation(record.id);
 expect(reloaded.content.conversation.context.dashboardCase).toBe('downtime');
 record=await client.turn(reloaded.id,reloaded.version,'Investigate it.','referent-reload-it');
 expect(record.content.conversation.context.caseFocus).toBe('downtime');
 expect(record.content.conversation.turns.at(-1)!.answer.text).toMatch(/Line 03 missed by 138/);
 const again=await client.readConversation(record.id);
 expect(again.content.conversation.context.caseFocus).toBe('downtime');
 expect(again.content.conversation.turns.at(-1)!.answer.text).toBe(record.content.conversation.turns.at(-1)!.answer.text);
});

it('7. a new conversation does not keep the previous referent',async()=>{
 const client=createManufacturingClient(new ManufacturingService(new MockRepository()));
 let first=await client.createConversation('referent-old');
 first=await client.turn(first.id,first.version,'Run my plant review.','referent-old-review');
 expect(first.content.conversation.context.dashboardCase).toBe('downtime');
 let next=await client.createConversation('referent-new');
 next=await client.turn(next.id,next.version,'Investigate it.','referent-new-it');
 expect(next.content.conversation.context.caseFocus).toBeNull();
 expect(next.content.conversation.investigationId).toBeNull();
 expect(next.content.conversation.context.dashboardCase??null).toBeNull();
 expect(next.content.conversation.turns.at(-1)!.answer.text).not.toMatch(/Northworks feeder-jam plan miss|150 good units below the approved plan/);
 expect((await client.readConversation(first.id)).content.conversation.context.dashboardCase).toBe('downtime');
});

it('8. an explicit new topic overrides the prior referent',async()=>{
 const quality=await turns('referent-override-case','Run my plant review.','Investigate quality.','Investigate it.');
 expect(quality.content.conversation.context.caseFocus).toBe('quality');
 expect(quality.content.conversation.context.machine).toBe('FORM-Q1');
 expect(quality.content.conversation.turns.at(-1)!.answer.text).not.toMatch(/Line 03 missed by 138/);
 const monthly=await turns('referent-override-metric','Run my plant review.','What was OEE in January?','Investigate it.');
 expect(monthly.content.conversation.context.caseFocus).toBeNull();
 expect(monthly.content.conversation.context.dashboardCase??null).toBeNull();
 expect(monthly.content.conversation.context.period).toBe('January');
 expect(monthly.content.conversation.investigationId).toBeNull();
 expect(monthly.content.conversation.turns.at(-1)!.answer.text).not.toMatch(/150 good units below the approved plan/);
});

it('policy 8 pronouns resolve to the recommended case and policy 7 replay does not',()=>{
 const review=live('Run my plant review.');
 expect(review.context.dashboardCase).toBe(operatingReview().gaps[0].caseId);
 for(const question of ['Investigate it.','Open it.','Why?','What caused it?']){
  const routed=live(question,review.context);
  expect(routed.createCase,question).toBe('downtime');
  expect(routed.context.caseFocus,question).toBe('downtime');
  expect(routed.intent,question).toBe('goal');
 }
 expect(live('Show me.',review.context).context.caseFocus).toBe('downtime');
 expect(live('Who owns it?',review.context).context.caseFocus).toBe('downtime');
 expect(live('Who owns it?',review.context).intent).toBe('owner');
 expect(operatingReview().gaps[0].gap).toBe(150);
 const old=replay7('Run my plant review.');
 expect(old.context.dashboardCase).toBeUndefined();
 expect(replay7('Investigate it.',old.context).intent).toBe('audit-referent-clarify');
});
