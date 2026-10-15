import type {ConversationContext} from './conversation';
import type {CaseFixture} from './cases';
/** Read-only confirmation guard; never remaps a draft into selected evidence. */
export function collectorScopeMatches(context:ConversationContext,fixture:Pick<CaseFixture,'context'>){
 return context.period===fixture.context.from.slice(0,10)+' day shift' && context.shift==='day' && ([['machine','asset'],['job','job'],['part','part'],['revision','revision'],['operation','operation'],['plant','plant'],['line','line']] as const).every(([query,source])=>context[query]===fixture.context[source]);
}
