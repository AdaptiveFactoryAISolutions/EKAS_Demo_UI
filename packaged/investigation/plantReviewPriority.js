//#region app/src/investigation/plantReviewPriority.ts
/** A ranking request has no asset operand. Explicit asset/ordinal-machine requests remain governed by the asset map. */
function plantReviewPriorityQuestion(question, context) {
	return context.sourceFocus === "plant" && context.reviewFocus?.kind === "plant-review" && /^\s*what should (?:i|we) focus on first[?.!]?\s*$/i.test(question);
}
//#endregion
export { plantReviewPriorityQuestion };
