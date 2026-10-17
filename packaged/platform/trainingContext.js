import { providerFixture } from "./fixtureSelection.js";
import { activeGroup, activeMeasures, emptyQuery } from "./workspaceQuery.js";
//#region app/src/platform/trainingContext.ts
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
/** Built by the shared execution port from the admitted records, never monthly defaults. */
function buildTrainingSourceContext(query, rows, presentation, facts, resultKind = "query") {
	const dimension = (key) => unique(facts ? facts.map((f) => f[key]) : rows.map((r) => r.dims[key]));
	const ends = (facts || []).map((f) => f.at).sort((a, b) => Date.parse(a) - Date.parse(b));
	return {
		schemaVersion: 1,
		fixtureVersion: providerFixture(query.provider),
		query: structuredClone(query),
		grain: activeGroup(query),
		metricIds: activeMeasures(query),
		asOf: query.asOf || emptyQuery().asOf,
		...presentation ? { presentation: structuredClone(presentation) } : {},
		assetsWithRecords: dimension("asset"),
		sitesWithRecords: dimension("site"),
		linesWithRecords: dimension("line"),
		observedMonths: facts ? unique(facts.map((f) => f.month)) : unique(rows.flatMap((r) => [r.dims.date, r.dims.date_raw].filter((v) => typeof v === "string" && /^\d{4}-\d{2}(?:$|-\d{2}$)/.test(v)).map((v) => v.slice(0, 7)))),
		observedRecordEnds: ends.length ? {
			earliest: ends[0],
			latest: ends.at(-1)
		} : null,
		sourceRecordIds: unique(rows.flatMap((r) => r.evidence || [])),
		provenance: presentation ? "executed-query" : "legacy-captured-query",
		resultKind
	};
}
function validTrainingSourceContext(value, capture) {
	const c = value;
	if (!c || c.schemaVersion !== 1 || c.fixtureVersion !== providerFixture(capture.queryContext.provider) || JSON.stringify(c.query) !== JSON.stringify(capture.queryContext) || JSON.stringify(c.grain) !== JSON.stringify(activeGroup(capture.queryContext)) || JSON.stringify(c.metricIds) !== JSON.stringify(activeMeasures(capture.queryContext)) || c.asOf !== (capture.asOf || capture.queryContext.asOf || emptyQuery().asOf)) return false;
	const strings = (v) => Array.isArray(v) && v.every((x) => typeof x === "string");
	if (![
		c.assetsWithRecords,
		c.sitesWithRecords,
		c.linesWithRecords,
		c.observedMonths,
		c.sourceRecordIds
	].every(strings) || !["executed-query", "legacy-captured-query"].includes(c.provenance)) return false;
	if (![
		"query",
		"definition",
		"clarification",
		"legacy"
	].includes(c.resultKind) || c.presentation && (typeof c.presentation.rls !== "boolean" || typeof c.presentation.site !== "string" || typeof c.presentation.maskDowntime !== "boolean")) return false;
	const sources = new Set(capture.rows.flatMap((r) => r.evidence || []));
	return c.sourceRecordIds.every((id) => sources.has(id)) && (!c.observedRecordEnds || Number.isFinite(Date.parse(c.observedRecordEnds.earliest)) && Number.isFinite(Date.parse(c.observedRecordEnds.latest)) && Date.parse(c.observedRecordEnds.earliest) <= Date.parse(c.observedRecordEnds.latest));
}
/** Older captures use only their saved query/rows; no current-fixture backfill. */
function capturedTrainingContext(capture) {
	return validTrainingSourceContext(capture.sourceContext, capture) ? structuredClone(capture.sourceContext) : buildTrainingSourceContext(capture.queryContext, capture.rows, void 0, void 0, "legacy");
}
function currentTrainingContext(c) {
	const matching = [...c.turns].reverse().filter((t) => t.training && JSON.stringify(t.training.queryContext) === JSON.stringify(c.trainingContext)), capture = (matching.find((t) => t.training?.sourceContext?.resultKind === "query" || t.training?.answers?.at(-1)?.intent === "query") || matching[0])?.training;
	return capture ? capturedTrainingContext(capture) : buildTrainingSourceContext(c.trainingContext, []);
}
//#endregion
export { buildTrainingSourceContext, capturedTrainingContext, currentTrainingContext, validTrainingSourceContext };
