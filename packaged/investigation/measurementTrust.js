import { API_VERSION } from "../platform/contract.js";
import { records } from "../inputs/measurement-trust-synthetic-v1.js";
import { workflowView } from "./workflow.js";
//#region app/src/investigation/measurementTrust.ts
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function measurementTrustStatus(w) {
	const selected = w.measurementSelection, record = selected ? records.find((r) => r.id === selected.recordId) : void 0;
	if (!selected) return {
		policyApplied: false,
		effectiveStatus: "unassessed",
		ready: true,
		record: null,
		reasons: ["Measurement assurance is unassessed. Legacy synthetic operands remain demonstrative; no real calibration or fitness for purpose is certified."]
	};
	const result = (status, ready, reason) => ({
		policyApplied: true,
		effectiveStatus: status,
		ready,
		record: record ? structuredClone(record) : null,
		reasons: [reason]
	});
	if (!record || record.sourceId !== selected.sourceId || record.sourceVersion !== selected.sourceVersion || record.caseId !== w.caseId || record.cycleId !== w.cycle || selected.cycleId !== w.cycle || !same(record.contextRef, w.context)) return result("scope-inapplicable", false, "Selected measurement assurance belongs to a different or historical context/cycle. No neighboring qualified record is substituted.");
	if (record.knownAt > w.asOf || record.decisionEffectiveFrom > w.asOf) return result("unavailable", false, "Measurement assurance is not yet known or effective at this explicit cutoff.");
	if (record.decisionEffectiveUntil <= w.asOf || record.calibration.status === "expired") return result("expired", false, "Measurement calibration/assurance has expired at the current UTC decision cutoff. Original historical evidence remains qualified by its captured status.");
	const ready = record.calibration.status === "valid" && record.msa.status === "qualified";
	return result(ready ? "qualified" : record.declaredStatus, ready, record.sourceId + " v" + record.sourceVersion + ": calibration " + record.calibration.status + ", MSA " + record.msa.status + " for " + record.measurementFamily + ". " + (ready ? "Demonstrative operands are admitted by this authored policy; original source/work/safety/acceptance prerequisites still apply. No real calibration, uncertainty fitness, cause or savings is certified." : "Current dependent measurement claims, verification, acceptance and sustainment are blocked. Uncertainty is not zero or a confidence probability."));
}
function selectMeasurementTrustRecord(w, command, actor) {
	if (![
		"manager",
		"supervisor",
		"maintenance"
	].includes(actor)) throw Error("A fictional authorized measurement-assurance reviewer is required.");
	if (command.confirmation !== "SELECT_SYNTHETIC_MEASUREMENT_TRUST_RECORD" || typeof command.reason !== "string" || command.reason.trim().length < 10 || command.reason.length > 1e3) throw Error("Exact measurement assurance record/version, bounded reason and explicit synthetic confirmation required.");
	const r = records.find((r) => r.id === command.recordId);
	if (!r || r.sourceVersion !== command.sourceVersion || r.caseId !== w.caseId || r.cycleId !== w.cycle || r.frameAsOf !== w.asOf || r.knownAt > w.asOf || !same(r.contextRef, w.context)) throw Error("Exact current case/cycle/context and known-time measurement assurance source/version required; foreign/future metadata cannot qualify this decision.");
	if (w.measurementSelection && r.sourceId === w.measurementSelection.sourceId && r.sourceVersion <= w.measurementSelection.sourceVersion) throw Error("Older/identical measurement assurance cannot rewind current admission. Reconcile the original key or explicitly review a newer source record.");
	w.measurementSelection = {
		policyVersion: 1,
		recordId: r.id,
		sourceId: r.sourceId,
		sourceVersion: r.sourceVersion,
		cycleId: w.cycle,
		knownAt: r.knownAt,
		selectedAt: w.asOf,
		actor,
		reason: command.reason.trim(),
		synthetic: true
	};
}
function measurementTrustProjection(record) {
	const w = record.content.workflow, t = measurementTrustStatus(w), v = workflowView(w), base = workflowView({
		...w,
		measurementSelection: void 0
	}), businessReady = v.eligibility.status === "ready", knowledge = v.documents.filter((d) => d.kind === "SW" && d.eligible);
	const decisions = [
		{
			id: "current-measurement",
			eligible: t.policyApplied ? businessReady : null,
			reason: t.reasons.join(" "),
			measurementDependent: true
		},
		{
			id: "verification",
			eligible: businessReady && v.verification.proof && v.verification.before !== null && v.verification.after !== null,
			reason: businessReady ? "Exact performed work, prospective plan and complete comparable cohorts still required." : v.eligibility.reasons.join(" "),
			measurementDependent: true
		},
		{
			id: "acceptance",
			eligible: businessReady && w.verificationRecorded && v.verification.safetyPass && ["awaiting_acceptance", "accepted"].includes(v.verification.status),
			reason: "Separate measured endpoint, quality/energy guards, safety review and explicit manager acceptance required.",
			measurementDependent: true
		},
		{
			id: "sustainment",
			eligible: businessReady && w.accepted && v.sustain.status === "sustained",
			reason: "Accepted result and due eligible current-cycle observations required; assurance alone cannot sustain a result.",
			measurementDependent: true
		},
		{
			id: "controlled-knowledge",
			eligible: knowledge.length > 0,
			reason: "Applicable controlled knowledge remains independently readable.",
			measurementDependent: false
		},
		{
			id: "record-performed-work",
			eligible: base.eligibility.status === "ready" && w.action.status === "authorized" && !!base.availableWork,
			reason: "Compatible known work proof and separately authorized owner required; no calibration or measurement outcome is inferred.",
			measurementDependent: false
		}
	];
	return {
		schemaVersion: 1,
		investigationId: record.id,
		investigationVersion: record.version,
		caseId: w.caseId,
		cycleId: w.cycle,
		contextRef: structuredClone(w.context),
		asOf: w.asOf,
		selectedRecord: t.record,
		selection: w.measurementSelection ? structuredClone(w.measurementSelection) : null,
		effectiveStatus: t.effectiveStatus,
		ready: t.ready,
		policyApplied: t.policyApplied,
		reasons: t.reasons,
		availableRecords: records.filter((r) => r.caseId === w.caseId && r.cycleId === w.cycle && r.frameAsOf === w.asOf && r.knownAt <= w.asOf && same(r.contextRef, w.context)).map((r) => structuredClone(r)),
		decisions,
		synthetic: true,
		productionConformance: false,
		realCalibrationCertified: false,
		physicalInterventionPerformed: false,
		causeConfirmed: false,
		financiallyValidated: false
	};
}
async function measurementTrustRequest(repo, request) {
	const reply = (status, data, code) => ({
		requestId: request.requestId,
		apiVersion: API_VERSION,
		status,
		synthetic: true,
		...code ? { error: {
			code,
			message: code,
			retryable: false
		} } : { data }
	});
	const match = request.path.match(/^\/api\/v1\/manufacturing\/measurement-trust\/([^/]+)$/);
	if (request.method !== "GET" || !match) return reply(404, void 0, "UNKNOWN_ENDPOINT");
	const record = repo.state.resources.find((r) => r.id === match[1] && r.content.domain === "manufacturing-investigation-v2");
	if (!record) return reply(404, void 0, "NOT_FOUND");
	if (record.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
	return reply(200, measurementTrustProjection(record));
}
//#endregion
export { measurementTrustProjection, measurementTrustRequest, measurementTrustStatus, selectMeasurementTrustRecord };
