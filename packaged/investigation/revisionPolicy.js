import { validCorrectionChain } from "./governedRecords.js";
import { dependencyView, validDependencyRecords } from "./dependencies.js";
//#region app/src/investigation/revisionPolicy.ts
function correctionRecords(resources) {
	return resources.filter((r) => r.content.domain === "manufacturing-governed-record-v1" && r.content.kind === "correct-current-source");
}
const mergedRecords = (x) => [...x.records, ...x.dependencyRecords || []].sort((a, b) => Number(a.id.match(/-(\d+)$/)?.[1]) - Number(b.id.match(/-(\d+)$/)?.[1]));
function sourceRevision(resources, caseIds, asOf, mode = "stale") {
	const records = correctionRecords(resources).filter((r) => caseIds.includes(r.content.caseId) && Date.parse(r.createdAt) <= Date.parse(asOf)), dependencies = resources.filter((r) => r.content.domain === "manufacturing-source-dependencies-v1" && records.some((c) => c.content.caseId === r.content.caseId) && Date.parse(r.createdAt) <= Date.parse(asOf));
	return records.length ? {
		schemaVersion: 1,
		mode,
		asOf,
		caseIds,
		records: structuredClone(records),
		...dependencies.length ? {
			dependencyRecords: structuredClone(dependencies),
			dependencyPolicyVersion: 2
		} : {}
	} : null;
}
function validRevisionCapture(x) {
	return x?.schemaVersion === 1 && [
		"stale",
		"refreshed",
		"original"
	].includes(x.mode) && Number.isFinite(Date.parse(x.asOf)) && Array.isArray(x.caseIds) && x.caseIds.length > 0 && x.caseIds.every((id) => [
		"downtime",
		"speed",
		"quality"
	].includes(id)) && (x.mode === "original" ? x.records.length === 0 : x.records.length > 0) && x.records.every((r) => x.caseIds.includes(r.content.caseId) && Date.parse(r.createdAt) <= Date.parse(x.asOf)) && (x.dependencyPolicyVersion === void 0 || x.dependencyPolicyVersion === 2) && validCorrectionChain(x.records) && (x.dependencyRecords === void 0 || x.mode !== "original" && Array.isArray(x.dependencyRecords) && x.dependencyRecords.length > 0 && x.dependencyRecords.every((r) => r.content.domain === "manufacturing-source-dependencies-v1" && x.caseIds.includes(r.content.caseId) && r.createdAt <= x.asOf) && validDependencyRecords(mergedRecords(x)));
}
function revisionPresentation(x, metric) {
	if (x.mode === "original") return {
		text: `No eligible source revision exists for ${x.caseIds.join(", ")} at ${x.asOf}. Original version0 remains the source for that cutoff; no later corrected values, charts or cohorts were substituted.`,
		evidence: "none",
		chart: false,
		metric,
		sourceIds: [],
		qualification: "Explicit original-source cutoff; revised evidence is not eligible."
	};
	const last = x.records.at(-1), r = last.content.response, version = last.version, sourceIds = x.records.map((r) => r.id), scope = r.affectedScope;
	const qualification = x.dependencyRecords ? dependencyQualification(x) : "Combined Plant Review rankings remain stale; this scoped refresh does not rank other cases. Raw unit evidence, original contributors and verification cohorts remain at baseline source version0; stale for comparisons against this revised current row. Refresh requires separately validated matching raw/cohort evidence. No work, cause or savings are verified.";
	if (x.mode === "stale") return {
		text: `This current manufacturing result is stale after source revisions ${[...new Map(x.records.map((r) => [r.content.caseId, r])).values()].map((r) => {
			const p = r.content.response;
			return p.affectedScope.asset + "/" + p.affectedScope.job + " version" + r.version + " known at " + r.createdAt;
		}).join("; ")}. Original version0 summaries, Highcharts/Dashboards, tables and rankings were withheld. Ask “Refresh revised source as of ${x.asOf}” for the consistent corrected summary, chart and connected table. ${qualification}`,
		evidence: "none",
		chart: false,
		metric,
		sourceIds,
		qualification
	};
	const parent = r.parentProjection, p = parent || r.projection, actual = p.metrics.good, target = p.target, gap = p.gap;
	return {
		text: `Refreshed synthetic source revision${version} at ${x.asOf}: ${scope.asset}/${scope.job} good output ${r.projection.metrics.good} against job plan ${r.projection.target}, shortfall ${r.projection.gap} good units. ${parent ? `Northworks parent output ${actual} against plant plan ${target}, shortfall ${gap} good units.` : ""} Current-row OEE ${Number(r.projection.metrics.oee.value).toFixed(2)}%; quality ${Number(r.projection.metrics.quality.value).toFixed(2)}%. Chart and connected table use this same revised projection. Original captures remain immutable. ${qualification}`,
		evidence: "metrics",
		chart: true,
		metric,
		sourceIds,
		qualification,
		visual: {
			kind: "column",
			title: `${parent ? "Northworks plant" : scope.job} · source revision${version} · ${x.asOf}`,
			categories: ["Revised good output", "Same-scope plan"],
			values: [actual, target],
			unit: "good units",
			sourceIds
		}
	};
}
function dependencyQualification(x) {
	return "Combined Plant Review rankings remain stale; this scoped refresh does not rank other cases. " + [...new Set(x.records.map((r) => r.content.caseId))].map((id) => dependencyView(mergedRecords(x), id, x.asOf, x.dependencyPolicyVersion === 2 ? 2 : 1)).map((v) => (v.raw.status === "reconciled" ? "Exact current raw unit evidence reconciled at source version" + v.current.sourceVersion + " for " + v.scope.asset + "/" + v.scope.job + ". First-pass classification unchanged." : "Raw unit evidence missing for " + v.scope.asset + "/" + v.scope.job + " source version" + v.current.sourceVersion + ": " + v.raw.reason) + " Current contributors regenerated from exact source version" + v.current.sourceVersion + ".").join(" ") + " Baseline/post cohorts remain unaffected source version0; each dated source retains its original eligibility. Corrected current rows are not members of the fixed comparison cohorts; new verification requires explicit matching comparison evidence. No work, accepted verification, cause or savings are inferred.";
}
function revisionClaims(x, turnId) {
	if (x.mode !== "refreshed") return [];
	const last = x.records.at(-1), r = last.content.response;
	return [
		{
			text: x.dependencyRecords && dependencyView(mergedRecords(x), last.content.caseId, x.asOf, x.dependencyPolicyVersion === 2 ? 2 : 1).raw.status === "reconciled" ? "Corrected synthetic current-row count with exact reviewed raw unit reconciliation; not work or verified improvement." : "Corrected synthetic current-row count; raw unit proof remains stale.",
			value: r.projection.metrics.good,
			unit: "good units",
			scope: r.affectedScope
		},
		{
			text: "Same-scope job shortfall from the corrected count.",
			value: r.projection.gap,
			unit: "good units",
			scope: r.affectedScope
		},
		{
			text: "Current-row OEE computed from corrected count and original exposure.",
			value: r.projection.metrics.oee.value,
			unit: "%",
			scope: r.affectedScope
		},
		{
			text: "Current-row quality computed from corrected count and original total.",
			value: r.projection.metrics.quality.value,
			unit: "%",
			scope: r.affectedScope
		},
		...r.parentProjection ? [{
			text: "Corrected parent aggregate output; not verified raw proof.",
			value: r.parentProjection.metrics.good,
			unit: "good units",
			scope: r.parentProjection.scope
		}, {
			text: "Corrected parent plan shortfall.",
			value: r.parentProjection.gap,
			unit: "good units",
			scope: r.parentProjection.scope
		}] : []
	].map((v, i) => ({
		id: turnId + "-claim-" + (i + 1),
		version: 1,
		classificationVersion: "ekas-claim-semantics-v1",
		kind: "DERIVED RESULT",
		text: v.text,
		evidenceIds: [...x.records.map((r) => r.id), ...(x.dependencyRecords || []).filter((r) => r.content.command.sourceVersion === last.version && r.content.caseId === last.content.caseId).map((r) => r.id)],
		provenanceIds: [
			turnId,
			r.projection.row.source,
			...r.parentProjection ? r.parentProjection.scope.jobIds.map((id) => "production-jobs-fixture.json#/jobs/" + id) : []
		],
		scope: v.scope,
		asOf: x.asOf,
		quantity: {
			kind: "source_revision_projection",
			value: v.value,
			unit: v.unit
		},
		causalStatus: "unconfirmed",
		confidence: null,
		synthetic: true,
		financiallyValidated: false
	}));
}
//#endregion
export { correctionRecords, revisionClaims, revisionPresentation, sourceRevision, validRevisionCapture };
