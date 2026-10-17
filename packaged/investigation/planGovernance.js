import { records } from "../inputs/verification-plan-governance-v57.js";
//#region app/src/investigation/planGovernance.ts
function sourcePlan(f) {
	const record = records.find((r) => r.caseId === f.caseId);
	return {
		plan: structuredClone(f.verification),
		scope: structuredClone(f.context),
		createdAt: record.knownAt,
		fixedAt: record.fixedAt,
		reason: "Original source policy with explicit additional fictional preregistration governance.",
		status: "fixed",
		approval: {
			id: record.id,
			actor: record.actor,
			at: record.approvedAt,
			synthetic: true,
			notGranted: true
		},
		definitionVersion: "independent-metric-contract-1.0",
		minimumCoverage: .95,
		plannedMinPerShift: 480,
		idealCycleMin: .5,
		source: record.source + "; policy " + f.verification.source
	};
}
function draftPlan(f, target, requiredShifts, version, at, reason) {
	const limit = f.verification.endpoint === "fpy" ? 100 : f.verification.target;
	if (typeof target !== "number" || !Number.isFinite(target) || target < 0 || target > limit || f.verification.endpoint === "fpy" && target < f.verification.target || typeof requiredShifts !== "number" || !Number.isSafeInteger(requiredShifts) || requiredShifts < 10 || requiredShifts > 100) throw Error("Use an own-case target in its declared range and at least ten eligible shifts; no weaker sample or cross-case endpoint.");
	return {
		...sourcePlan(f),
		plan: {
			...structuredClone(f.verification),
			version,
			target,
			requiredShifts,
			source: "synthetic-chat-plan-v57; evidence/guardrail authority " + f.verification.source
		},
		createdAt: at,
		fixedAt: null,
		reason,
		status: "draft",
		source: "synthetic-chat-plan-v57",
		approval: null
	};
}
//#endregion
export { draftPlan, sourcePlan };
