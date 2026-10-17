import { absoluteDifference } from "./quantitySemantics.js";
import { monthMetric, monthlyComparisonEvidence } from "./conversation.js";
//#region app/src/investigation/turnSemantics.ts
const claimKinds = [
	"OBSERVATION",
	"MEASURED RESULT",
	"DERIVED RESULT",
	"HYPOTHESIS",
	"SUPPORTED HYPOTHESIS",
	"REFUTED HYPOTHESIS",
	"CONFIRMED CAUSE",
	"RECOMMENDATION",
	"AUTHORIZED ACTION",
	"PERFORMED ACTION",
	"VERIFIED RESULT",
	"FINANCIAL ESTIMATE"
];
function turnSemantics(i) {
	const claims = [], w = i.workflow, v = i.view, m = i.monthly;
	const add = (kind, text, evidenceIds, scope, quantity, extra = {}) => claims.push({
		id: i.turnId + "-claim-" + (claims.length + 1),
		version: 1,
		classificationVersion: "ekas-claim-semantics-v1",
		kind,
		text,
		evidenceIds: [...new Set(evidenceIds)],
		provenanceIds: [i.turnId],
		scope,
		asOf: i.asOf,
		...quantity ? { quantity } : {},
		causalStatus: "unconfirmed",
		confidence: null,
		synthetic: true,
		financiallyValidated: false,
		...extra
	});
	const readyForClaims = !i.blocked && ![
		"clarify",
		"plan-clarify",
		"claim-clarify",
		"due-clarify",
		"cutoff-clarify",
		"data-correction-clarify",
		"quote-clarify",
		"source-stale",
		"source-refresh",
		"cutoff-clear",
		"investigation-select"
	].includes(i.intent);
	const match = !v || [
		["machine", "asset"],
		["job", "job"],
		["part", "part"],
		["revision", "revision"],
		["operation", "operation"],
		["plant", "plant"],
		["line", "line"]
	].every(([q, s]) => i.context[q] === null || i.context[q] === v.context[s]) && i.context.period === v.context.from.slice(0, 10) + " day shift" && (!i.context.shift || i.context.shift === "day");
	if (readyForClaims && v && w && match) {
		if (v.eligibility.status === "ready" && v.goal) {
			add("MEASURED RESULT", "Observed output in the declared goal scope.", v.sourceIds, v.goalContext, {
				kind: "metric_level",
				value: v.goal.actual,
				unit: "good units"
			});
			add("DERIVED RESULT", "Goal shortfall; scopes are not additive.", [...v.sourceIds, v.goalSource.source], v.goalContext, absoluteDifference(v.goal.gap, "good units"));
		}
		if (v.reasonEvidence && v.reasonEvidence.knownAt <= i.asOf) add("OBSERVATION", v.reasonEvidence.text, [v.reasonEvidence.id, v.reasonEvidence.source], v.context);
		for (const h of w.hypotheses) add(h.status === "supported" ? "SUPPORTED HYPOTHESIS" : h.status === "refuted" ? "REFUTED HYPOTHESIS" : "HYPOTHESIS", h.description, [
			...h.supportingEvidenceIds,
			...h.contradictingEvidenceIds,
			...h.testResultId ? [h.testResultId] : []
		], v.context, void 0, {
			supportingEvidenceIds: [...h.supportingEvidenceIds],
			contradictingEvidenceIds: [...h.contradictingEvidenceIds]
		});
		if (w.action.description) add("RECOMMENDATION", w.action.description, [v.availableWork?.source || w.fixtureVersion + "#/work"], v.context);
		if (w.action.authorizationId) add("AUTHORIZED ACTION", "Fictional authorization record; not intervention or real permission.", [w.action.authorizationId], v.context);
		if (v.verification.proof && w.action.performedId) add("PERFORMED ACTION", "Matching performed-work record and confirmation.", [w.action.performedId], v.context);
		if (w.verificationRecorded && v.verification.proof && v.verification.after !== null) add("MEASURED RESULT", "Recorded eligible post-action endpoint; causality is not established.", v.plan.postIds, v.context, {
			kind: "metric_level",
			value: v.verification.after,
			unit: v.plan.unit
		});
		if (w.accepted && v.verification.status === "accepted" && v.verification.proof) add("VERIFIED RESULT", "Operational result accepted against the plan and guardrails; not causal proof or cash savings.", [
			...v.plan.baselineIds,
			...v.plan.postIds,
			w.action.performedId,
			w.safetyEvidence
		], v.context);
		if (w.action.expectedBenefit) {
			const e = w.action.expectedBenefit;
			add("FINANCIAL ESTIMATE", "Projected action cost assumption, not realized savings.", [w.fixtureVersion + "#/costAssumptions"], v.context, {
				kind: "estimate",
				value: e.costUsd,
				unit: "USD"
			});
			add("DERIVED RESULT", "Estimated operational opportunity over " + e.horizon + "; not observed output.", [w.fixtureVersion + "#/costAssumptions"], v.context, {
				kind: "estimate",
				value: e.value,
				unit: e.unit
			});
		}
	}
	if (readyForClaims && i.review) {
		for (const metric of i.review.bundle) if (metric.value !== null) {
			add("DERIVED RESULT", "Observed computed " + metric.name + " in its declared reporting horizon.", [metric.source], metric.context, {
				kind: "metric_level",
				value: metric.value,
				unit: metric.unit
			});
			if (metric.deviation.value !== null) add("DERIVED RESULT", "Absolute target deviation; not relative percent or additive impact.", [metric.source, metric.targetSource], metric.context, absoluteDifference(metric.deviation.value, metric.unit));
		}
	}
	if (readyForClaims && i.sourceDomain !== "training" && !w && !i.review && m?.sourceKind !== "operating-review") {
		const measured = monthMetric(i.context);
		if (measured && measured.row.knownAt <= i.asOf && typeof measured.result.value === "number") {
			add("MEASURED RESULT", "Accepted good-unit count in the separate monthly source.", [measured.row.id, measured.row.source], i.context, {
				kind: "metric_level",
				value: measured.row.good,
				unit: "good units"
			});
			add("DERIVED RESULT", "Computed " + i.context.metric.toUpperCase() + "; correlation is not a cause.", [measured.row.id, measured.row.source], i.context, {
				kind: "metric_level",
				value: measured.result.value,
				unit: "%"
			});
		}
	}
	if (readyForClaims && m) {
		if (m.goal) {
			add("DERIVED RESULT", "Observed computed metric level in the exact audit reporting scope.", [m.auditOrigin.source], m.auditOrigin.context, {
				kind: "metric_level",
				value: m.goal.actual,
				unit: m.goal.unit
			});
			add("DERIVED RESULT", "Unfavorable absolute deviation from the fictional target.", [m.auditOrigin.source, m.auditOrigin.approvalId], m.auditOrigin.context, absoluteDifference(m.goal.gap, m.goal.unit));
		}
		for (const h of m.hypotheses) add("HYPOTHESIS", h.description, [], m.context, void 0, {
			supportingEvidenceIds: [],
			contradictingEvidenceIds: []
		});
	}
	if (readyForClaims && i.sourceDomain !== "training" && !w && !i.review && i.answer.monthlyComparison) {
		const pair = monthlyComparisonEvidence(i.context, i.asOf);
		if (pair && JSON.stringify(pair) === JSON.stringify(i.answer.monthlyComparison)) {
			add("DERIVED RESULT", "Computed comparison-period " + i.context.metric.toUpperCase() + " from its exact monthly source.", pair.comparison.sourceIds, {
				...i.context,
				machine: pair.comparison.machine,
				period: pair.comparison.period,
				comparisonPeriod: null,
				comparisonEntity: null
			}, {
				kind: "metric_level",
				value: pair.comparison.value,
				unit: "%"
			});
			add("DERIVED RESULT", "Signed primary minus comparison percentage-point change; no causal proof.", [.../* @__PURE__ */ new Set([...pair.primary.sourceIds, ...pair.comparison.sourceIds])], {
				primary: {
					machine: pair.primary.machine,
					period: pair.primary.period
				},
				comparison: {
					machine: pair.comparison.machine,
					period: pair.comparison.period
				}
			}, absoluteDifference(pair.difference.value, pair.difference.unit));
		}
	}
	const corrections = [
		"plant",
		"line",
		"machine",
		"job",
		"part",
		"revision",
		"operation",
		"shift",
		"period",
		"comparisonPeriod",
		"comparisonEntity",
		"metric",
		"chart",
		"reviewCutoff",
		"sourceCutoff"
	].filter((d) => i.context[d] !== i.previousContext[d]).map((d) => ({
		dimension: d,
		previous: i.previousContext[d],
		requested: i.context[d]
	}));
	const actionVerified = !!w && !!v && match && w.accepted && v.verification.status === "accepted" && v.verification.proof;
	return {
		version: 1,
		claimScope: "captured investigation state",
		claims,
		corrections,
		execution: {
			status: i.blocked ? "blocked" : i.committedKinds.length ? "committed" : [
				"clarify",
				"plan-clarify",
				"claim-clarify",
				"due-clarify",
				"cutoff-clarify",
				"data-correction-clarify",
				"investigation-select"
			].includes(i.intent) || !match ? "clarification" : "read",
			attemptedKinds: i.attemptedKinds,
			committedKinds: i.committedKinds,
			reason: i.blocked || i.answer.qualification
		},
		action: {
			lifecycleState: actionVerified ? "VERIFIED" : (w?.action.status || m?.action.status || "unavailable").toUpperCase(),
			dueAt: w?.action.dueAt || null,
			performedRecord: w?.action.performedId || null,
			authorizedAt: w?.action.authorizedAt || null,
			performedAt: w?.action.performedAt || null,
			verifiedAt: actionVerified ? w.history.filter((h) => h.cycle === w.cycle && h.command.kind === "accept-result").at(-1)?.at || null : null,
			verified: actionVerified,
			derivedFrom: "Existing performed proof, eligible measurement, guardrails, safety and accepted result; no manual verification toggle"
		},
		hypothesisLifecycle: w?.hypotheses.map((h) => ({
			id: h.id,
			state: h.status === "tested" ? "TESTED" : h.status.toUpperCase(),
			tested: !!h.testResultId,
			disposition: [
				"supported",
				"refuted",
				"inconclusive"
			].includes(h.status) ? h.status : null,
			testResultId: h.testResultId,
			causalStatus: h.causalStatus
		})) || [],
		confirmedCause: {
			status: "unavailable",
			reason: "A separate governed causal disposition is not supplied; language cannot promote it."
		},
		synthetic: true,
		notGranted: true,
		notDispatched: true,
		financiallyValidated: false
	};
}
//#endregion
export { claimKinds, turnSemantics };
