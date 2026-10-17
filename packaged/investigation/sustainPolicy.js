//#region app/src/investigation/sustainPolicy.ts
function assessSustain(rows, policy, asOf, accepted) {
	const cutoff = Date.parse(asOf), ordered = rows.map((row, index) => ({
		row,
		index
	})).sort((a, b) => Date.parse(a.row.at) - Date.parse(b.row.at) || a.index - b.index).map((x) => x.row);
	const window = ordered.slice(-policy.required), valid = (r) => Number.isFinite(r.value) && r.eligible && r.coverage === 1 && r.observerHealth === "healthy" && Number.isInteger(r.sourceVersion) && r.sourceVersion > 0 && !!r.source && r.scope === policy.scope && r.definitionVersion === policy.definitionVersion && Number.isFinite(Date.parse(r.at)) && Number.isFinite(Date.parse(r.knownAt)) && Date.parse(r.at) <= cutoff && Date.parse(r.knownAt) <= cutoff;
	const invalidPolicy = !Number.isFinite(policy.target) || !Number.isFinite(policy.alarm) || !Number.isInteger(policy.required) || policy.required < 1 || !Number.isInteger(policy.consecutiveRecurrence) || policy.consecutiveRecurrence < 1 || !Number.isFinite(policy.maxAgeHours) || policy.maxAgeHours <= 0 || new Set(ordered.map((r) => r.id)).size !== ordered.length;
	const latest = ordered.at(-1), interrupted = invalidPolicy || !Number.isFinite(cutoff) || window.some((r) => !valid(r)) || !!latest && cutoff - Date.parse(latest.at) > policy.maxAgeHours * 36e5;
	const outside = (value, limit) => policy.direction === "lower" ? value > limit : value < limit;
	const tail = ordered.slice(-policy.consecutiveRecurrence);
	const recurrence = !interrupted && tail.length === policy.consecutiveRecurrence && tail.every((r) => valid(r) && outside(r.value, policy.alarm));
	const status = !accepted ? "insufficient" : interrupted ? "interrupted" : recurrence ? "recurrence" : window.length < policy.required ? "insufficient" : window.some((r) => outside(r.value, policy.target)) ? "regressed" : "sustained";
	return {
		policyVersion: 2,
		status,
		primaryTarget: policy.target,
		recurrenceAlarm: policy.alarm,
		windowIds: window.map((r) => r.id),
		qualification: status === "interrupted" ? "Monitoring coverage, health, scope, definition or freshness is unavailable." : status === "regressed" ? "The latest monitoring window misses the primary target." : status === "recurrence" ? "The recurrence alarm is crossed in consecutive eligible observations." : status === "sustained" ? "The latest complete eligible monitoring window meets the primary target." : "An accepted result and complete monitoring window are required."
	};
}
//#endregion
export { assessSustain };
