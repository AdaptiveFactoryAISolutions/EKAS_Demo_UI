//#region app/src/server/conversationHistoryWindow.ts
const bytes = (value) => new TextEncoder().encode(JSON.stringify(value)).length;
/** Keep complete recent public turns and the entire current tool transcript.
* Omitted history is explicit, never a fabricated summary or current evidence.
* The48000-byte target may retain one oversized latest complete turn within
* a60000-byte hard history cap. Provider wire/context checks still apply; the
* original64000-character adapter threshold is never increased. */
function conversationHistoryWindow(prior, current, limit = 48e3, hardLimit = 6e4) {
	let target = limit;
	if (bytes(current) > limit) throw Error("MODEL_CONTEXT_LIMIT");
	const groups = [];
	for (const item of prior) {
		if (item.role === "user" || !groups.length) groups.push([]);
		groups.at(-1).push(structuredClone(item));
	}
	let selected = [];
	for (let n = groups.length - 1; n >= 0; n--) {
		const candidate = [groups[n], ...selected];
		const size = bytes([
			...current.slice(0, 1),
			...candidate.flat(),
			...current.slice(1)
		]);
		if (size > target) {
			if (!selected.length && size <= hardLimit) target = hardLimit;
			else {
				if (!selected.length) throw Error("MODEL_CONTEXT_LIMIT");
				break;
			}
		}
		selected = candidate;
	}
	const assemble = () => {
		const omitted = prior.length - selected.flat().length, notice = omitted ? [{
			role: "developer",
			content: omitted + " earlier historical messages omitted to stay within the reviewed context bound. No summary or current evidence substituted. Ask clarification if an antecedent is absent; retained captures keep original status/time."
		}] : [];
		return {
			history: [
				...structuredClone(current.slice(0, 1)),
				...notice,
				...selected.flat(),
				...structuredClone(current.slice(1))
			],
			omittedMessages: omitted
		};
	};
	let result = assemble();
	while (bytes(result.history) > target) {
		if (selected.length <= 1) throw Error("MODEL_CONTEXT_LIMIT");
		selected.shift();
		result = assemble();
	}
	return result;
}
//#endregion
export { conversationHistoryWindow };
