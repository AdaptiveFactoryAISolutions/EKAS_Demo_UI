import { metricDefinitions } from "../platform/metricEngine.js";
import { collectorScopeMatches } from "../investigation/collectorScope.js";
//#region app/src/server/readonlyReceipts.ts
function canonicalReadonlyReceipt(id, view, context, asOf) {
	if (![
		"evidence:documents",
		"preview:view",
		"preview:action"
	].includes(id) && !/^definition:(oee|availability|performance|quality|fpy)$/.test(id)) return null;
	if (!(!!view && view.eligibility.status === "ready" && collectorScopeMatches(context, view))) return {
		id,
		sourceIds: [],
		asOf,
		status: "unavailable",
		facts: []
	};
	if (id === "preview:view" || id === "preview:action") {
		const value = id === "preview:view" ? {
			context: view.context,
			asOf: view.asOf,
			title: view.title,
			bridge: view.bridge,
			unit: "good units",
			sourceIds: view.sourceIds
		} : {
			context: view.context,
			asOf: view.asOf,
			owner: view.owner,
			action: view.action,
			plan: view.plan,
			verification: view.verification.status
		};
		const sourceIds = [...view.selected.sourceIds];
		return {
			id,
			sourceIds,
			asOf: view.asOf,
			status: sourceIds.length ? "observed" : "unavailable",
			facts: sourceIds.length ? [{
				key: id === "preview:view" ? "view_preview" : "action_preview",
				value: JSON.stringify({
					qualification: "Read-only preview of current canonical state. No new draft, view application, assignment, approval, work, causal proof or savings is performed.",
					...value
				}),
				unit: ""
			}, ...id === "preview:action" && [
				"draft",
				"rejected",
				"failed"
			].includes(view.action.status) && ["maintenance", "maintenance-backup"].includes(view.owner.accepted || "") && view.hypotheses.some((h) => h.status !== "refuted") ? [{
				key: "reviewable_operation",
				value: JSON.stringify({ kind: "recommend-action" }),
				unit: ""
			}] : []] : []
		};
	}
	if (id === "evidence:documents") {
		const documents = view.documents.map((d) => ({
			id: d.id,
			version: d.version,
			kind: d.kind,
			controlled: d.controlled,
			status: d.status,
			eligible: d.eligible,
			effectiveFrom: d.effectiveFrom,
			effectiveTo: d.effectiveTo,
			knownAt: d.knownAt,
			part: d.part,
			revision: d.revision,
			assetId: d.assetId,
			operation: d.operation,
			text: d.text,
			source: d.source
		})), sourceIds = [...new Set(documents.map((d) => d.source))];
		return {
			id,
			sourceIds,
			asOf: view.asOf,
			status: sourceIds.length ? "observed" : "unavailable",
			facts: sourceIds.length ? [{
				key: "documents",
				value: JSON.stringify({
					context: view.context,
					asOf: view.asOf,
					documents,
					qualification: "Known source documents; eligible flag and controlled/release status determine applicability. Presence is not approval, physical work, causal proof or financial validation."
				}),
				unit: ""
			}] : []
		};
	}
	const key = id.slice(11), metric = view.selected.metrics[key], index = metricDefinitions.findIndex((d) => d.id === metric?.metricId);
	if (index < 0) return {
		id,
		sourceIds: [],
		asOf: view.asOf,
		status: "unavailable",
		facts: []
	};
	const definition = metricDefinitions[index];
	return {
		id,
		sourceIds: ["metric-oracle/metric-contract.json#/definitions/" + index],
		asOf: view.asOf,
		status: "observed",
		facts: [{
			key: "definition",
			value: JSON.stringify({
				definition,
				context: view.context,
				asOf: view.asOf,
				qualification: "Synthetic governed definition. Operand availability is required; definition presence alone does not establish a result or certified benefit."
			}),
			unit: ""
		}]
	};
}
//#endregion
export { canonicalReadonlyReceipt };
