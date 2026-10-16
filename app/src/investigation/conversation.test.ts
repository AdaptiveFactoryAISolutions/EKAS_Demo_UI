import {it,expect} from 'vitest';
import {routeConversation,emptyConversationContext,presentTurn} from './conversation';
import {createWorkflow,workflowView} from './workflow';
it('preserves dimensions through the complete month/machine correction/comparison/FPY chain',()=>{
 let context=emptyConversationContext();
 const questions=['What was OEE in January?','And March?','What about Machine 2?','No, I meant Machine 1.','Why?','Show me.','Compare that to last month.','Go back to the first machine.','Investigate the root cause.','What was FPY?'];
 const replies=[];
 for(const question of questions){const result=routeConversation(question,context);context=result.context;replies.push(presentTurn(result,null));}
 expect(context).toMatchObject({machine:'Machine 1',period:'March',comparisonPeriod:'February',metric:'fpy'});
 expect(replies[0].text).toContain('77.08%');expect(replies[3].text).toContain('83.33%');expect(replies[9].text).toMatch(/first.pass|FPY/);expect(replies[9].text).toMatch(/unavailable|not include/);expect(replies[9].text).not.toContain('OEE was');
});
it('recognizes conversational workflow questions and typed command intents without inventing completion',()=>{
 const context=routeConversation('We missed our production goal.',emptyConversationContext()).context,view=workflowView(createWorkflow('downtime'));
 for(const text of ['Where was the biggest loss?','Which machine?','What job?','What evidence do we have?','What are the possible causes?','What should we test?','Who owns it?','Was it accepted?','Was it approved?','Did it work?','Did it hold?','What happened when it came back?'])expect(presentTurn(routeConversation(text,context),view).text.length).toBeGreaterThan(25);
 expect(routeConversation('Assign it.',context).commands).toEqual([{kind:'request-assignment',owner:'maintenance'}]);
 expect(routeConversation('Maintenance accepted it.',context).commands).toEqual([{kind:'record-assignment-acceptance'}]);
 expect(routeConversation('Record the repair.',context).commands[0].kind).toBe('record-performed-work');
 expect(presentTurn(routeConversation('Was it approved?',context),view).text).toMatch(/not.*approved|draft/i);
 const why=routeConversation('Why did it reopen?',context);
 expect(why.intent).toBe('sustain');
 expect(why.commands).toEqual([]);
 expect(presentTurn(why,view).text).toMatch(/Reopen if feeder-jam minutes goes above 45 min per eligible shift/);
 expect(routeConversation('Reopen the investigation.',context).commands).toEqual([{kind:'reopen'}]);
});
it('unknown ambiguity clarifies without mutating dimensional context or issuing lifecycle commands',()=>{
 const c={...emptyConversationContext(),period:'March',comparisonPeriod:'February',machine:'Machine 2'};
 const r=routeConversation('Change it to the other one',c);expect({...r.context,clarification:null}).toEqual(c);expect(r.intent).toBe('clarify');expect(r.commands).toEqual([]);
});
it('interrogative acceptance is read-only and unsupported job/revision changes preserve other dimensions',()=>{
 const c={...emptyConversationContext(),caseFocus:'downtime' as const,machine:'FEED-03',job:'JOB-8303',part:'NW-A',revision:'P2',operation:'OP-030'};
 expect(routeConversation('Has maintenance accepted it?',c).commands).toEqual([]);
 expect(routeConversation('Has maintenance accepted it?',c).intent).toBe('owner');
 const job=routeConversation('Actually, job JOB-8402.',c);expect(job.context).toMatchObject({job:'JOB-8402',machine:'FEED-03',revision:'P2',period:'January'});
 expect(presentTurn(job,workflowView(createWorkflow('downtime'))).text).toMatch(/does not match|unavailable|not supplied/i);
 const revision=routeConversation('No, revision P1.',c);expect(revision.context).toMatchObject({revision:'P1',machine:'FEED-03',job:'JOB-8303'});expect(revision.commands).toEqual([]);
});
it('entity comparisons retain the primary machine and period independently',()=>{
 const c={...emptyConversationContext(),machine:'Machine 1',period:'March',comparisonPeriod:'February'};
 const r=routeConversation('Compare that with Machine 2.',c);expect(r.context).toMatchObject({machine:'Machine 1',period:'March',comparisonPeriod:'February',comparisonEntity:'Machine 2'});expect(r.intent).toBe('compare');
 expect(presentTurn(r,null).text).toContain('Machine 2');
});
it('why explains the requested quality or performance metric without substituting OEE',()=>{
 for(const metric of ['quality','performance'] as const){const c={...emptyConversationContext(),metric,period:'March'};const answer=presentTurn(routeConversation('Why?',c),null);expect(answer.text).toContain(metric.toUpperCase());expect(answer.text).not.toMatch(/OEE was/);expect(answer.text).toMatch(/not|unknown|does not/);}
});
