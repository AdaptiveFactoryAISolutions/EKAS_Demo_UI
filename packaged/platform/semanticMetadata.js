import { metricDefinitions } from "./metricEngine.js";
//#region app/src/platform/semanticMetadata.ts
const object = (x) => !!x && typeof x === "object" && !Array.isArray(x);
const text = (x, max = 256) => typeof x === "string" && x.trim().length > 0 && x.length <= max;
const strings = (x, max = 1e4) => Array.isArray(x) && x.length > 0 && x.length <= max && x.every((s) => text(s)) && new Set(x).size === x.length;
const hash = (x) => typeof x === "string" && /^[a-f0-9]{64}$/.test(x);
const instant = (x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().slice(0, 19) === x.slice(0, 19);
function windowPolicy(x) {
	return Array.isArray(x) ? x.length === 2 && x.every(instant) && Date.parse(x[0]) < Date.parse(x[1]) : object(x) && Object.keys(x).length > 0 && Object.keys(x).length <= 20 && Object.entries(x).every(([k, v]) => text(k) && text(v, 1e3));
}
/** Optional base metadata remains backward compatible; positive observed values require the full semantic/provenance envelope. */
function validSemanticMetadata(value, metricId, q) {
	const positive = q.fixtureVersion === "training-positive-v2" && value.availability === "observed";
	if (value.reasonCode !== void 0 && (!text(value.reasonCode, 64) || !/^[A-Z][A-Z0-9_]*$/.test(value.reasonCode))) return false;
	if (positive && value.reasonCode !== "OBSERVED_SYNTHETIC") return false;
	const versions = value.semanticVersions;
	if (versions !== void 0) {
		if (!object(versions) || versions.metric !== q.definitionVersions[metricId] || versions.fixture !== q.fixtureVersion || versions.metricContract !== "independent-metric-contract-1.0" || ![
			"positive-raw-v2.1",
			"positive-raw-v2.2",
			"positive-raw-v2.3"
		].includes(String(versions.aggregation)) || versions.policy !== "proposed-demo-policy-v2" || ![
			versions.rawSnapshotHash,
			versions.baseSnapshotHash,
			versions.policyHash
		].every(hash)) return false;
	} else if (positive) return false;
	const evidence = /* @__PURE__ */ new Set();
	for (const id of value.evidenceIds) {
		const split = id.lastIndexOf("@");
		if (split >= 0 && /^[1-9]\d*$/.test(id.slice(split + 1))) evidence.add(id.slice(0, split));
	}
	const contexts = value.operandContexts;
	if (contexts !== void 0) {
		const definition = metricDefinitions.find((d) => d.id === metricId);
		if (!Array.isArray(contexts) || !contexts.length || contexts.length > 100 || !definition || new Set(contexts.map((c) => object(c) ? c.operand : null)).size !== contexts.length || contexts.length !== definition.requiredOperands.length || contexts.some((c) => !object(c) || !definition.requiredOperands.includes(String(c.operand)) || !text(c.aggregation, 4e3) || !strings(c.tables, 30) || !c.tables.every((t) => /^(?:base\.)?[a-z][a-z0-9_]*$/.test(t)) || !strings(c.recordIds) || !windowPolicy(c.windowPolicy) || !text(c.coverage, 1e3) || !text(c.authority, 1e3) || !c.recordIds.every((id) => c.tables.some((table) => {
			const namespace = table.startsWith("base.") ? "training-plant-v1" : "training-positive-v2", name = table.replace(/^base\./, "");
			return evidence.has(namespace + "/" + name + "/" + id);
		})))) return false;
	} else if (positive) return false;
	return true;
}
//#endregion
export { validSemanticMetadata };
