//#region app/src/investigation/collectorScope.ts
/** Read-only confirmation guard; never remaps a draft into selected evidence. */
function collectorScopeMatches(context, fixture) {
	return context.period === fixture.context.from.slice(0, 10) + " day shift" && context.shift === "day" && [
		["machine", "asset"],
		["job", "job"],
		["part", "part"],
		["revision", "revision"],
		["operation", "operation"],
		["plant", "plant"],
		["line", "line"]
	].every(([query, source]) => context[query] === fixture.context[source]);
}
//#endregion
export { collectorScopeMatches };
