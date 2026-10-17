import { collectorScopeMatches } from "../investigation/collectorScope.js";
import { canonicalReadonlyReceipt } from "./readonlyReceipts.js";
//#region app/src/server/modelCapture.ts
function validModelCapture(c, view, context, trainingContext) {
	if (!c || c.schemaVersion !== 1 || !c.conversationId || !c.operationId || !Number.isSafeInteger(c.expectedVersion) || !c.policyRevision || !c.sourceRevision || !c.provider || !c.question?.trim() || c.question.length > 4e3 || typeof c.response?.interpretation !== "string" || c.response.interpretation.length > 16e3 || !Array.isArray(c.receipts) || !Array.isArray(c.response.claims)) return false;
	const ids = /* @__PURE__ */ new Set();
	for (const r of c.receipts) {
		if (ids.has(r.id) || !r.id || !Array.isArray(r.sourceIds) || r.sourceIds.some((id) => typeof id !== "string") || !Number.isFinite(Date.parse(r.asOf)) || !Array.isArray(r.facts)) return false;
		ids.add(r.id);
		if (r.id.startsWith("metric:")) {
			const key = r.id.slice(7);
			const m = view?.selected.metrics[key];
			const available = !!view && collectorScopeMatches(context, view) && view.eligibility.status === "ready" && typeof m?.value === "number";
			if (r.status === "observed" && (!available || r.asOf !== view.asOf || JSON.stringify(r.sourceIds) !== JSON.stringify(view.selected.sourceIds) || JSON.stringify(r.facts) !== JSON.stringify([{
				key,
				value: m.value,
				unit: "%"
			}]))) return false;
		} else if (r.id === "context") {
			if (JSON.stringify(r.facts) !== JSON.stringify([{
				key: "context",
				value: JSON.stringify(trainingContext || context),
				unit: ""
			}])) return false;
		} else {
			const expected = canonicalReadonlyReceipt(r.id, view, context, r.asOf);
			if (!expected || JSON.stringify(expected) !== JSON.stringify(r)) return false;
		}
	}
	return c.response.claims.every((claim) => {
		const r = c.receipts.find((r) => r.id === claim.receiptId);
		return !!r && r.status === "observed" && r.sourceIds.length > 0 && r.facts.some((f) => f.key === claim.key && f.unit === claim.unit && f.value === claim.value);
	});
}
function modelPresentation(c) {
	const sources = [...new Set(c.response.claims.flatMap((claim) => c.receipts.find((r) => r.id === claim.receiptId)?.sourceIds || []))];
	return {
		text: "Unverified model interpretation: " + c.response.interpretation + (c.response.claims.length ? "\n\nSource-bound observations:\n" + c.response.claims.map((x) => x.key + ": " + x.value + " " + x.unit).join("\n") : ""),
		metric: c.response.claims[0]?.key || "conversation",
		evidence: sources.length ? "metrics" : "none",
		chart: false,
		sourceIds: sources,
		qualification: "Synthetic data. Model interpretation is unverified; no intervention, cause or financial savings certified."
	};
}
//#endregion
export { modelPresentation, validModelCapture };
