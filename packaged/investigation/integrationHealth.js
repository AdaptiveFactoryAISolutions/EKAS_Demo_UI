import { API_VERSION } from "../platform/contract.js";
import { fixtureCase } from "./cases.js";
import { fixtureVersion, qualification, records } from "../inputs/integration-health-synthetic-v1.js";
import { workflowView } from "./workflow.js";
//#region app/src/investigation/integrationHealth.ts
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function integrationHealthStatus(w) {
	const selection = w.healthSelection, record = selection ? records.find((r) => r.id === selection.snapshotId) : void 0;
	if (!selection) return {
		policyApplied: false,
		effectiveStatus: "unassessed",
		ready: true,
		record: null,
		ageMin: null,
		reasons: ["Case integration health is unassessed. Existing synthetic fixture readiness is unchanged; this is not live health assurance."]
	};
	const fail = (status, reason) => ({
		policyApplied: true,
		effectiveStatus: status,
		ready: false,
		record: record ? structuredClone(record) : null,
		ageMin: null,
		reasons: [reason]
	});
	if (!record || record.sourceVersion !== selection.sourceVersion || record.caseId !== w.caseId || record.sourceId !== selection.sourceId || !same(record.contextRef, w.context) || record.cycleId !== w.cycle || selection.cycleId !== w.cycle) return fail("scope-inapplicable", "Selected integration-health source/cycle/context is historical or incompatible; no neighboring/current healthy source is substituted.");
	if (record.knownAt > w.asOf || record.frameAsOf > w.asOf) return fail("unavailable", "Integration-health source is not yet known at this explicit case clock.");
	const ageMin = (Date.parse(w.asOf) - Date.parse(record.lastSuccessfulSyncAt)) / 6e4;
	let status = record.declaredStatus === "recovered" ? "healthy" : record.declaredStatus;
	if (status === "healthy" && ageMin > record.maxSuccessfulSyncAgeMin) status = "stale";
	const ready = status === "healthy" && record.coverage.provided === record.coverage.expected && ageMin <= record.maxSuccessfulSyncAgeMin;
	const reason = record.sourceId + " source version " + record.sourceVersion + " · " + status + " at " + w.asOf + "; successful sync age " + ageMin + " min (maximum " + record.maxSuccessfulSyncAgeMin + "), transfer coverage " + record.coverage.provided + "/" + record.coverage.expected + " " + record.coverage.unit + ". " + (ready ? "Original compatible known-time inputs and all independent business guards still required." : "Current evidence-dependent decisions are blocked; unavailable is not zero, recovering is not recovered, and healthy metadata never performs work.");
	return {
		policyApplied: true,
		effectiveStatus: status,
		ready,
		record: structuredClone(record),
		ageMin,
		reasons: [reason]
	};
}
function selectIntegrationHealthSnapshot(w, command, actor) {
	if (![
		"manager",
		"supervisor",
		"maintenance"
	].includes(actor)) throw Error("An existing fictional manager, supervisor or maintenance role must review health selection. No real access is granted.");
	if (command.confirmation !== "SELECT_SYNTHETIC_INTEGRATION_HEALTH_SNAPSHOT" || typeof command.reason !== "string" || command.reason.trim().length < 10 || command.reason.length > 1e3) throw Error("Exact source-health snapshot/version, bounded reason and explicit synthetic confirmation required.");
	const r = records.find((r) => r.id === command.snapshotId);
	if (!r || r.sourceVersion !== command.sourceVersion || r.caseId !== w.caseId || r.cycleId !== w.cycle || r.frameAsOf !== w.asOf || r.knownAt > w.asOf || !same(r.contextRef, w.context)) throw Error("Exact current case/cycle/context and known-time integration-health source/version required; no foreign or future record admitted.");
	if (w.healthSelection && r.sourceId === w.healthSelection.sourceId && r.sourceVersion <= w.healthSelection.sourceVersion) throw Error("Older/identical integration-health source version cannot rewind current admission. Reconcile the exact original request key or select a newer known recovery snapshot.");
	w.healthSelection = {
		policyVersion: 1,
		snapshotId: r.id,
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
function integrationHealthProjection(record) {
	const w = record.content.workflow, h = integrationHealthStatus(w), v = workflowView(w);
	fixtureCase(w.caseId, w.condition);
	const baseReady = v.eligibility.status === "ready", knowledge = v.documents.filter((d) => d.kind === "SW" && d.eligible), work = v.availableWork, requiredInputs = [
		{
			id: "case-evidence-feed",
			status: !h.policyApplied ? "unassessed" : h.ready ? "available" : h.effectiveStatus,
			sourceIds: h.record ? [h.record.id] : [],
			sourceVersion: h.record?.sourceVersion ?? null,
			knownAt: h.record?.knownAt ?? null,
			reason: h.reasons.join(" "),
			unit: "authored transfer records",
			provided: h.record?.coverage.provided ?? null,
			expected: h.record?.coverage.expected ?? null
		},
		{
			id: "controlled-standard-work",
			status: knowledge.length ? "available" : "unavailable",
			sourceIds: knowledge.map((d) => d.id),
			sourceVersion: knowledge[0]?.version ?? null,
			knownAt: knowledge[0]?.knownAt ?? null,
			reason: "Applicable released same-context standard work remains an independent guard; feed recovery cannot release documents."
		},
		{
			id: "known-current-cycle-work-proof",
			status: work && w.action.status === "performed" && w.cycle === 1 ? "available" : "unavailable",
			sourceIds: work ? [work.id] : [],
			sourceVersion: null,
			knownAt: work?.knownAt ?? null,
			reason: "Separately authorized and explicitly recorded current-cycle work is required; no future proof/detail is disclosed."
		}
	];
	const decisions = [
		{
			id: "current-evidence",
			eligible: h.policyApplied ? baseReady : null,
			requiredInputs: ["case-evidence-feed", "controlled-standard-work"],
			reason: !h.policyApplied ? h.reasons.join(" ") : v.eligibility.reasons.join(" ") || "Original known-time observed fixture only; no live source or cause certification."
		},
		{
			id: "controlled-knowledge",
			eligible: knowledge.length > 0,
			requiredInputs: ["controlled-standard-work"],
			reason: "Independent applicable knowledge remains readable; inspecting it is not business completion."
		},
		{
			id: "ownership-review",
			eligible: true,
			requiredInputs: [],
			reason: "Ownership/history review remains available; a new assignment still requires its own version/actor/acceptance guards."
		},
		{
			id: "record-performed-work",
			eligible: baseReady && !!work && w.action.status === "authorized" && !!w.owner.accepted && w.cycle === 1,
			requiredInputs: [
				"case-evidence-feed",
				"controlled-standard-work",
				"known-current-cycle-work-proof"
			],
			reason: "Healthy feed is insufficient: exact known work, authorization, performer/operator confirmation and role remain required."
		},
		{
			id: "record-verification",
			eligible: baseReady && v.verification.proof && v.verification.baselineCount >= w.plan.requiredShifts && v.verification.postCount >= w.plan.requiredShifts,
			requiredInputs: [
				"case-evidence-feed",
				"known-current-cycle-work-proof",
				"fixed-plan-compatible-before-after-cohorts"
			],
			reason: "Original endpoint, units, exact denominators and matching current-cycle work/cohorts remain required."
		},
		{
			id: "accept-result",
			eligible: baseReady && w.verificationRecorded && ["awaiting_acceptance", "accepted"].includes(v.verification.status),
			requiredInputs: [
				"case-evidence-feed",
				"known-current-cycle-work-proof",
				"fixed-plan-compatible-before-after-cohorts",
				"independent-safety-guardrails"
			],
			reason: "Separate human acceptance and passing original guardrails required; health recovery is not intervention, cause or savings."
		},
		{
			id: "record-sustain",
			eligible: baseReady && w.accepted,
			requiredInputs: [
				"case-evidence-feed",
				"accepted-result",
				"eligible-known-sustain-observations"
			],
			reason: "Original sustain coverage/time/observer and recurrence policy still applies."
		}
	];
	return {
		schemaVersion: 1,
		fixtureVersion,
		investigationId: record.id,
		investigationVersion: record.version,
		caseId: w.caseId,
		cycleId: w.cycle,
		contextRef: structuredClone(w.context),
		asOf: w.asOf,
		...h,
		selection: structuredClone(w.healthSelection || null),
		availableSnapshots: records.filter((r) => r.caseId === w.caseId && r.cycleId === w.cycle && r.frameAsOf === w.asOf && r.knownAt <= w.asOf && same(r.contextRef, w.context)).map((r) => structuredClone(r)),
		requiredInputs,
		decisions,
		baseEligibility: v.eligibility,
		synthetic: true,
		productionConformance: false,
		physicalAssetHealthCertified: false,
		calibrationCertified: false,
		physicalInterventionPerformed: false,
		causalStatus: "unconfirmed",
		financiallyValidated: false,
		notDispatched: true,
		notGranted: true,
		qualification
	};
}
async function integrationHealthRequest(repo, request) {
	const reply = (status, data, code, message) => ({
		apiVersion: API_VERSION,
		requestId: request.requestId,
		status,
		synthetic: true,
		...code ? { error: {
			code,
			message: message || code,
			retryable: false
		} } : { data }
	});
	if (request.method !== "GET") return reply(422, void 0, "INVALID_REQUEST");
	const m = request.path.match(/^\/api\/v1\/manufacturing\/integration-health\/([^/?]+)$/);
	if (!m) return reply(422, void 0, "INVALID_REQUEST", "Exact health read path required.");
	const r = repo.state.resources.find((r) => r.id === m[1] && r.content.domain === "manufacturing-investigation-v2");
	if (!r) return reply(404, void 0, "NOT_FOUND");
	if (!request.session.allowedAssetIds.includes(r.content.workflow.context.asset)) return reply(403, void 0, "FORBIDDEN");
	return reply(200, integrationHealthProjection(r));
}
//#endregion
export { integrationHealthProjection, integrationHealthRequest, integrationHealthStatus, selectIntegrationHealthSnapshot };
