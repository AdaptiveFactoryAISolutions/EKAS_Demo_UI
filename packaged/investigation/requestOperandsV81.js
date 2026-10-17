//#region app/src/investigation/requestOperandsV81.ts
/** Requested context is separate from text authored into a workflow record.
* Calendar names must occupy a calendar noun slot, not merely occur as words. */
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
const monthPattern = new RegExp("\\b(" + months.join("|") + ")\\b", "gi");
function authoredWorkflowPayload(question) {
	return /^(?:hypothesis\s*:|(?:add|record|propose)\s+(?:a\s+)?hypothesis\b|i propose\s+(?:a\s+)?hypothesis\b|plan\s+(?:a\s+)?test to\b|test\s+(?:this|that|the) hypothesis by\b|(?:let's |please )?test (?:that|it|this) by\b)/i.test(question.trim()) || /^(?:let's |please )?(?:record|add|propose) .+ as (?:a )?(?:possible cause|hypothesis)[.!]?$/i.test(question.trim());
}
function calendarSlot(text, index, length) {
	const before = text.slice(0, index), after = text.slice(index + length);
	return /\b(?:in|for|during|since|until|through|from|to|of|about|period|month)\s+(?:the month of\s+)?$/i.test(before) || /^\s*(?:20\d{2}|\d{1,2}(?:st|nd|rd|th)?)\b/i.test(after) || /^\s*(?:availability|performance|quality|fpy|oee|production|observations?|results?|data)\b/i.test(after) || !before.trim() && /^[.!?\s]*$/.test(after) || /^(?:show|plot|graph|display|compare|what|how|give|tell)\b.*\b(?:oee|fpy|availability|performance|quality|production)\s*$/i.test(before) && /^[.!?\s]*$/.test(after);
}
function requestedScopeText(question) {
	if (authoredWorkflowPayload(question)) return "";
	return question.replace(monthPattern, (word, _name, index) => calendarSlot(question, index, word.length) ? word : "");
}
function requestedCalendarMonth(question) {
	const match = [...requestedScopeText(question).matchAll(new RegExp(monthPattern.source, "gi"))][0];
	return match ? months.find((m) => m.toLowerCase() === match[0].toLowerCase()) : void 0;
}
//#endregion
export { authoredWorkflowPayload, requestedCalendarMonth, requestedScopeText };
