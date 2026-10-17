import { API_VERSION } from "../platform/contract.js";
import { trainingAssetIds } from "./trainingPort.js";
import { ManufacturingResponseError } from "./requestOutcome.js";
//#region app/src/investigation/clientPort.ts
const assets = [
	"FEED-01",
	"FEED-02",
	"FEED-03",
	"PRESS-S1",
	"FORM-Q1",
	"MONTH-MACHINE1",
	"MONTH-MACHINE2",
	...trainingAssetIds
];
function createManufacturingClient(transport, actor = "manager") {
	let seq = 0;
	const request = async (method, path, body, key) => {
		const requestId = "manufacturing-request-" + ++seq;
		const r = await transport.send({
			apiVersion: API_VERSION,
			requestId,
			session: {
				id: "manufacturing-" + actor,
				role: actor === "viewer" ? "viewer" : "engineer",
				presentationOnly: true,
				allowedAssetIds: assets
			},
			method,
			path,
			body,
			idempotencyKey: key
		});
		if (r.error) throw new ManufacturingResponseError(r.error.code + ": " + r.error.message, {
			code: r.error.code,
			status: r.status,
			commitOutcome: r.error.details?.commitOutcome,
			authoritativeNonCommit: method === "POST" && r.apiVersion === "ekas-proposed-v1" && r.requestId === requestId && r.synthetic === true && r.error.details?.commitOutcome === "not_committed",
			retryable: r.error.retryable
		});
		if (method !== "GET" && typeof window !== "undefined") window.dispatchEvent(new Event("ekas-manufacturing-updated"));
		return r.data;
	};
	return {
		readAttention: (id) => request("GET", "/api/v1/manufacturing/attention/" + encodeURIComponent(id)),
		readObligations: (id) => request("GET", "/api/v1/manufacturing/obligations/" + encodeURIComponent(id)),
		readGenealogy: (id) => request("GET", "/api/v1/manufacturing/genealogy/" + encodeURIComponent(id)),
		readEvidenceQueryRefs: (id) => request("GET", "/api/v1/manufacturing/evidence-queries?investigationId=" + encodeURIComponent(id)),
		readMeasurementTrust: (id) => request("GET", "/api/v1/manufacturing/measurement-trust/" + encodeURIComponent(id)),
		readIntegrationHealth: (id) => request("GET", "/api/v1/manufacturing/integration-health/" + encodeURIComponent(id)),
		createEvidenceQuery: (body, key) => request("POST", "/api/v1/manufacturing/evidence-queries", body, key),
		readEvidenceQuery: (id) => request("GET", "/api/v1/manufacturing/evidence-queries/" + encodeURIComponent(id)),
		readEvidencePage: (id, options = {}) => request("GET", "/api/v1/manufacturing/evidence-queries/" + encodeURIComponent(id) + "/page" + (Object.keys(options).length ? "?" + new URLSearchParams(options) : "")),
		createEvidenceCapture: (body, key) => request("POST", "/api/v1/manufacturing/evidence-captures", body, key),
		readEvidenceCapture: (id) => request("GET", "/api/v1/manufacturing/evidence-captures/" + encodeURIComponent(id)),
		readEvidenceCaptures: () => request("GET", "/api/v1/manufacturing/evidence-captures"),
		readDiagnostics: (id) => request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id) + "/diagnostics"),
		readChronology: (id, options = {}) => request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id) + "/chronology?" + new URLSearchParams(options)),
		readNeighborhood: (id, options = {}) => request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id) + "/neighborhood?" + new URLSearchParams(options)),
		readMetricDemonstrations: () => request("GET", "/api/v1/manufacturing/metric-demonstrations"),
		runMetricDemonstration: (body, key) => request("POST", "/api/v1/manufacturing/metric-demonstrations", body, key),
		readDecisionSupport: (id) => request("GET", "/api/v1/manufacturing/decision-support/" + encodeURIComponent(id)),
		writeDecisionSupport: (body, key) => request("POST", "/api/v1/manufacturing/decision-support", body, key),
		readDecisionPacket: (id) => request("GET", "/api/v1/manufacturing/decision-support/" + encodeURIComponent(id) + "/packet"),
		readModelOperation: (id) => request("GET", "/api/v1/manufacturing/model-operations/" + encodeURIComponent(id)),
		readComparisonCatalog: () => request("GET", "/api/v1/manufacturing/comparison-catalog"),
		readComparisons: () => request("GET", "/api/v1/manufacturing/comparisons"),
		openComparison: (body, key) => request("POST", "/api/v1/manufacturing/comparisons", body, key),
		comparisonCommand: (id, expectedVersion, command, key) => request("POST", "/api/v1/manufacturing/comparisons/" + encodeURIComponent(id) + "/commands", {
			expectedVersion,
			command
		}, key),
		readAudit: (asOf) => request("GET", "/api/v1/manufacturing/audit-refresh/" + encodeURIComponent(asOf)),
		saveAudit: (body, key) => request("POST", "/api/v1/manufacturing/audit-refresh", body, key),
		readDependencies: (caseId, asOf) => request("GET", "/api/v1/manufacturing/dependencies/" + caseId + "/" + encodeURIComponent(asOf)),
		readDependencyRecords: () => request("GET", "/api/v1/manufacturing/dependencies"),
		writeDependencyRecord: (body, key) => request("POST", "/api/v1/manufacturing/dependencies", {
			...body,
			dependencyPolicyVersion: 2
		}, key),
		readSourceEditor: (caseId) => request("GET", "/api/v1/manufacturing/governed-records/editor/" + caseId),
		correctSource: (body, key) => request("POST", "/api/v1/manufacturing/governed-records", body, key),
		recordReviewedClaim: (body, key) => request("POST", "/api/v1/manufacturing/governed-records", body, key),
		readContract: () => request("GET", "/api/v1/manufacturing/contract"),
		readAggregate: (id) => request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id)),
		readMonthlyInvestigation: async (id) => {
			const r = await request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id));
			if (r.content.domain !== "monthly-investigation-v1") throw Error("INVALID_RESULT: Expected discovery aggregate.");
			return r;
		},
		createConversation: (key, initialQuery) => request("POST", "/api/v1/manufacturing/conversations", initialQuery ? { initialQuery } : {}, key),
		readConversation: (id) => request("GET", "/api/v1/manufacturing/conversations/" + encodeURIComponent(id)),
		listConversations: () => request("GET", "/api/v1/manufacturing/conversations"),
		turn: (id, expectedVersion, text, key) => request("POST", "/api/v1/manufacturing/conversations/" + encodeURIComponent(id) + "/messages", {
			expectedVersion,
			text
		}, key),
		archive: (id, expectedVersion, archived, key) => request("POST", "/api/v1/manufacturing/conversations/" + encodeURIComponent(id) + "/commands", {
			expectedVersion,
			kind: archived ? "archive" : "restore"
		}, key),
		readSourceResult: (caseId) => request("GET", "/api/v1/manufacturing/results/" + caseId),
		createFromResult: (caseId, resultRef, key) => request("POST", "/api/v1/manufacturing/investigations", {
			caseId,
			resultRef
		}, key),
		createInvestigation: (caseId, condition, key) => request("POST", "/api/v1/manufacturing/investigations", {
			caseId,
			condition
		}, key),
		readInvestigation: (id) => request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id)),
		view: (id) => request("GET", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id) + "/view"),
		command: (id, expectedVersion, command, key) => request("POST", "/api/v1/manufacturing/investigations/" + encodeURIComponent(id) + "/commands", {
			expectedVersion,
			command
		}, key)
	};
}
//#endregion
export { createManufacturingClient };
