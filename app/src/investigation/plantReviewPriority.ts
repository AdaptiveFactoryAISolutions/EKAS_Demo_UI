import type{ConversationContext}from'./conversation';
/** A ranking request has no asset operand. Explicit asset/ordinal-machine requests remain governed by the asset map. */
export function plantReviewPriorityQuestion(question:string,context:ConversationContext){return context.sourceFocus==='plant'&&context.reviewFocus?.kind==='plant-review'&&/^\s*what should (?:i|we) focus on first[?.!]?\s*$/i.test(question)}
