import { providerFixture, providerSites } from "../platform/fixtureSelection.js";
import { tables } from "../inputs/metric-oracle/training-relational-seed.js";
import { columnById, emptyQuery, formatValue, sourceRecords } from "../platform/workspaceQuery.js";
import { validWorkspaceQuery } from "../retained/stateValidation.js";
import { evaluateWorkspaceConversation } from "../platform/workspaceConversation.js";
//#region app/src/investigation/trainingPort.ts
const trainingAssetIds = tables.assets.map((a) => a.id);
function initialTrainingContext() {
	return emptyQuery();
}
function initialTrainingPresentation(query) {
	return {
		rls: false,
		site: providerSites(query.provider)[0],
		maskDowntime: false
	};
}
function executeTrainingTurn(text, query, presentation, allowedAssetIds, conversationId) {
	if (!validWorkspaceQuery(query) || !providerSites(query.provider).includes(presentation.site)) throw Error("Invalid retained dataset context.");
	if (sourceRecords(query, presentation).some((f) => !allowedAssetIds.includes(f.asset))) throw Error("Dataset assets outside simulated session scope.");
	const capture = evaluateWorkspaceConversation({
		text,
		memoryContext: [],
		presentationContext: presentation
	}, query, allowedAssetIds, conversationId);
	const parts = capture.answers.map((a) => {
		if (a.intent !== "query") return a.intentNote;
		const metrics = a.queryContext.columns.filter((id) => columnById(id)?.kind === "measure");
		const values = a.rows.map((row) => row.key + ": " + metrics.map((id) => (columnById(id)?.name || id) + " " + formatValue(id, row.values[id], a.queryContext.decimals, presentation.maskDowntime)).join("; "));
		return (values.length ? values.join("\n") : "The requested cohort has no eligible observations.") + "\n" + a.note;
	});
	const sources = [...new Set(capture.rows.flatMap((row) => row.evidence || []))], metric = capture.queryContext.columns.find((id) => columnById(id)?.kind === "measure") || "unavailable", unit = columnById(metric)?.unit || "";
	const visual = capture.rows.length && capture.queryContext.columns.filter((id) => columnById(id)?.kind === "measure").length === 1 ? {
		title: columnById(metric)?.name || metric,
		unit,
		categories: capture.rows.map((r) => r.key),
		values: capture.rows.map((r) => {
			const v = r.values[metric];
			return typeof v === "number" && Number.isFinite(v) ? unit === "%" ? v * 100 : v : null;
		}),
		kind: "column",
		sourceIds: sources
	} : void 0;
	return {
		capture,
		answer: {
			text: parts.join("\n\n") + "\n\nDataset: " + providerFixture(query.provider) + "; cutoff " + capture.asOf + ".",
			evidence: "metrics",
			chart: !!visual,
			metric,
			sourceIds: sources,
			qualification: capture.answers.some((a) => a.availability !== "synthetic_observation") ? capture.note : null,
			...visual ? { visual } : {}
		}
	};
}
//#endregion
export { executeTrainingTurn, initialTrainingContext, initialTrainingPresentation, trainingAssetIds };
