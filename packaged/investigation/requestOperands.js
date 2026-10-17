//#region app/src/investigation/requestOperands.ts
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
function entitySlot(text, index) {
	return /\b(?:plant|site|facility|part|product|job|revision|operation|asset|machine|line|owner|at|within|across)\s+$/i.test(text.slice(0, index));
}
function calendarSlot(text, index, length) {
	if (entitySlot(text, index)) return false;
	const before = text.slice(0, index), after = text.slice(index + length);
	return /^\s*(?:and|also)\s+$/i.test(before) && /^[.!?\s]*$/.test(after) || /\b(?:in|for|during|since|until|through|from|to|of|about|with|against|versus|vs|period|month)\s+(?:the month of\s+)?$/i.test(before) || /^\s*(?:20\d{2}|\d{1,2}(?:st|nd|rd|th)?)\b/i.test(after) || /^\s*(?:availability|performance|quality|fpy|oee|production|observations?|results?|data)(?:\s+(?:metrics?|data|results?))?(?:[.!?\s]*$|\s+(?:at|in|for|from|of|on|vs|versus|compared)\b)/i.test(after) || /\b(?:compare|show|plot|graph|display|use|select|set|mean|meant)\s*$/i.test(before) || /^\s+(?:as (?:the )?comparison|versus|vs|with|against|and)\b/i.test(after) || !before.trim() && /^[.!?\s]*$/.test(after) || /^(?:show|plot|graph|display|compare|what|how|give|tell)\b.*\b(?:oee|fpy|availability|performance|quality|production)\s*$/i.test(before) && /^[.!?\s]*$/.test(after);
}
function requestedScopeText(question) {
	if (authoredWorkflowPayload(question)) return "";
	return question.replace(monthPattern, (word, _name, index) => entitySlot(question, index) || calendarSlot(question, index, word.length) ? word : "");
}
function requestedCalendarMonth(question) {
	const scope = requestedScopeText(question), match = [...scope.matchAll(new RegExp(monthPattern.source, "gi"))].find((m) => calendarSlot(scope, m.index, m[0].length));
	return match ? months.find((m) => m.toLowerCase() === match[0].toLowerCase()) : void 0;
}
/** A year counts only when it sits immediately beside the resolved calendar month. */
function requestedCalendarYear(question) {
	const month = requestedCalendarMonth(question);
	if (!month) return void 0;
	const scope = requestedScopeText(question), match = new RegExp("\\b" + month + "\\b", "i").exec(scope);
	if (!match || match.index === void 0) return void 0;
	const adjacent = scope.slice(Math.max(0, match.index - 8), match.index).match(/\b(20\d{2})\s*$/) || scope.slice(match.index + match[0].length, match.index + match[0].length + 8).match(/^\s*(20\d{2})\b/);
	return adjacent ? Number(adjacent[1]) : void 0;
}
/** Only an explicit imperative request maps to the guarded authorization command. */
function requestsActionAuthorization(question) {
	return (/* @__PURE__ */ new RegExp("^(?:please\\s+)?(?:as\\s+(?:the\\s+)?(?:authorized\\s+)?(?:manager|supervisor|maintenance|safety|viewer)[,:]?\\s+)?(?:approve|authorize)\\s+(?:the\\s+)?(?:bounded\\s+)?(?:repair|action|work|it)(?:\\s+as\\s+(?:the\\s+)?(?:authorized\\s+)?(?:manager|supervisor|maintenance|safety|viewer))?[.!]?\\s*$", "i")).test(question.trim());
}
function authoredHypothesisFields(question) {
	const m = question.match(/^\s*(?:(?:add|record|propose)\s+(?:a\s+)?hypothesis|hypothesis)(?:\s+([A-Z][A-Z0-9_-]*))?\s*:\s*(.+?)(?:\s*[.;]\s*test:\s*(.+))?\s*$/i);
	return m ? [
		question,
		(m[1] ? m[1] + ": " : "") + m[2],
		m[3]
	] : void 0;
}
/** Ordinals refer to recorded hypotheses in this case, not fixture labels. */
function requestedHypothesisOrdinal(question) {
	const m = question.match(/^plan (?:the )?(?:(first|second) )?test[.!]?$/i);
	return m ? m[1]?.toLowerCase() === "second" ? 1 : 0 : void 0;
}
/** Mask typed entity nouns only while the legacy admission engine scans calendar words. */
function publicationOperands(question) {
	const scope = requestedScopeText(question), entities = [];
	return {
		question: scope.replace(new RegExp(monthPattern.source, "gi"), (word, _name, index) => {
			if (!entitySlot(scope, index)) return word;
			const token = "RequestedScopeNoun" + entities.length;
			entities.push({
				token,
				value: word
			});
			return token;
		}),
		restore(value) {
			let restored = value;
			for (const e of entities) restored = restored.replace(new RegExp(e.token, "gi"), (m) => m === e.token.toUpperCase() ? e.value.toUpperCase() : e.value);
			return restored;
		}
	};
}
function performedWorkRequest(question) {
	const m = question.trim().match(/* @__PURE__ */ new RegExp("^(?:please\\s+)?(?:as\\s+(?:the\\s+)?(?:assigned\\s+)?(?:manager|supervisor|maintenance|safety|viewer)[,:]?\\s+)?record\\s+(?:the\\s+)?(?:(?:performed|completed)\\s+)?(?:work|repair|completion)(?:\\s+([A-Za-z][A-Za-z0-9-]*))?(?:\\s+as\\s+(?:the\\s+)?(?:assigned\\s+)?(?:manager|supervisor|maintenance|safety|viewer))?[.!]?\\s*$", "i"));
	return m ? { workId: m[1] && /^DEMO-WO-/i.test(m[1]) ? m[1].toUpperCase() : m[1] } : void 0;
}
/** Explicit workflow-clock directives carry control operands, not query periods. */
function workflowClockDirective(question) {
	return /^(?:please |let's )?(?:advance\b|simulate\b|move (?:the )?(?:clock|time)\b)/i.test(question.trim());
}
//#endregion
export { authoredHypothesisFields, authoredWorkflowPayload, performedWorkRequest, publicationOperands, requestedCalendarMonth, requestedCalendarYear, requestedHypothesisOrdinal, requestedScopeText, requestsActionAuthorization, workflowClockDirective };
