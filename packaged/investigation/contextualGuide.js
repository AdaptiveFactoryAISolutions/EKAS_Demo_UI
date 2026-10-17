import { executeWorkflow, validateWorkflow, workflowCommandFields, workflowView } from "./workflow.js";
import { collectorScopeMatches } from "./collectorScope.js";
import { guideRecoveryText, validGuideOrigin } from "./guideActions.js";
import { comparisonGuideScope, comparisonGuideText, validComparison } from "./comparison.js";
//#region app/src/investigation/contextualGuide.ts
function isGuideQuestion(q) {
	return /^(?:i [dD]on[’']?t (?:know how|how how) to complete this page|how do i approve this\??|help(?: me)?|show me around|guide me|help me (?:complete|use|understand) this page|how (?:do|can) i (?:use|complete|finish) this page\??|what (?:does this page do|should i do (?:here|next))\??|explain this (?:page|control))\.?$/i.test(q.trim());
}
const guideControls = [
	{
		label: "Authorize action",
		command: { kind: "authorize-action" }
	},
	{
		label: "Recommend action",
		command: { kind: "recommend-action" }
	},
	{
		label: "Request authorization",
		command: { kind: "request-authorization" }
	},
	{
		label: "Record verification",
		command: { kind: "record-verification" }
	},
	{
		label: "Accept result",
		command: { kind: "accept-result" }
	},
	{
		label: "Record sustainment",
		command: { kind: "record-sustain" }
	}
];
/** Every readiness reason comes from the actual command guard on an isolated copy. */
function guideReadiness(w, actor) {
	return guideControls.map((c) => {
		try {
			executeWorkflow(structuredClone(w), c.command, actor, "guide-read-only");
			return {
				label: c.label,
				ready: true,
				reason: "Available for normal explicit action review; this guide performed nothing."
			};
		} catch (e) {
			return {
				label: c.label,
				ready: false,
				reason: e instanceof Error ? e.message : String(e)
			};
		}
	});
}
function contextualGuidePresentation(c) {
	if (c.schemaVersion === 4) return {
		text: "EKAS Guide — this help request performs no action. Active dataset: separate comparison. " + comparisonGuideText(c.comparisonState, c.actor, c.retainedOrigin?.workflow.caseId === "quality" ? "conversation" : "none") + " " + guideRecoveryText(c.retainedOrigin) + (c.pendingReview ? " Your pending review fields remain saved; help does not fill or confirm them." : "") + " Earlier answers keep their original context and clock.",
		evidence: "none",
		chart: false,
		metric: c.context.metric,
		sourceIds: [],
		qualification: "Read-only comparison prerequisite guidance from the captured state; no action or new evidence."
	};
	if (c.schemaVersion === 3 && c.activeTarget) {
		const t = c.activeTarget;
		return {
			text: "EKAS Guide — this help request performs no action. Active dataset: " + (t.kind === "training" ? "training" : t.kind === "metric-demonstration" ? "explicit synthetic metric demonstration" : "separate comparison") + ". Active cursor " + t.id + " at " + t.asOf + (t.version === null ? "" : ", version " + t.version) + ". Recorded context: " + t.scope + ". " + guideRecoveryText(c.retainedOrigin) + " " + (c.pendingReview ? "Your pending review fields remain saved; help does not fill or confirm them. " : "") + "Use the current dataset’s visible evidence and normal controls. No manufacturing approval readiness is inferred. Earlier answers keep their original context and clock.",
			evidence: "none",
			chart: false,
			metric: c.context.metric,
			sourceIds: [],
			qualification: "Read-only contextual guidance for the active cursor; no action or new evidence."
		};
	}
	if (c.schemaVersion === 2 && c.activeTarget) {
		const t = c.activeTarget;
		return {
			text: "EKAS Guide — this help request performs no action. Active dataset: " + (t.kind === "training" ? "training" : t.kind === "metric-demonstration" ? "explicit synthetic metric demonstration" : "separate comparison") + ". Active cursor " + t.id + " at " + t.asOf + (t.version === null ? "" : ", version " + t.version) + ". Recorded context: " + t.scope + ". The original manufacturing case is an inactive retained investigation. Explicitly return to its original investigation before using its approval readiness. " + (c.pendingReview ? "Your pending review fields remain saved; help does not fill or confirm them. " : "") + "Use the current dataset’s visible evidence and normal controls. No manufacturing approval readiness is inferred. Earlier answers keep their original context and clock.",
			evidence: "none",
			chart: false,
			metric: c.context.metric,
			sourceIds: [],
			qualification: "Read-only contextual guidance for the active cursor; no action or new evidence."
		};
	}
	const w = c.workflow, v = w ? workflowView(w, true) : null, scope = [
		c.context.plant,
		c.context.line,
		c.context.machine,
		c.context.part,
		c.context.revision,
		c.context.job,
		c.context.operation,
		c.context.period,
		c.context.shift
	].filter(Boolean).join(" · ");
	const scopeValid = !!w && collectorScopeMatches(c.context, w);
	const readiness = w && scopeValid ? guideReadiness(w, c.actor) : [];
	const approve = /approve/i.test(c.question), target = readiness.find((x) => x.label === "Authorize action"), available = readiness.filter((x) => x.ready);
	const next = approve && target ? target : available[0];
	return {
		text: "EKAS Guide — this help request performs no action. Selected conversation scope: " + scope + ". " + (w ? (scopeValid ? "Verified current investigation version " : "Scope mismatch: restate the exact original investigation date, day shift and part/revision before acting. Current saved investigation version ") + c.resourceVersion + " at " + w.asOf + ": action " + w.action.status + ", owner " + (w.owner.accepted || "not yet accepted") + ". " + (v?.eligibility.reasons.length ? "Current prerequisites: " + v.eligibility.reasons.join(" ") + ". " : "") : "No verified manufacturing investigation is open. Explicitly open a supplied case before approval guidance. ") + (next ? next.label + ": " + next.reason + " " : "No successful action is inferred from reading help. ") + (c.pendingReview ? "Your pending review fields remain saved; help does not fill or confirm any field. " : "") + "Use the normal controls to inspect captured source records, hypotheses/tests, owner, action and verification. Approval is separate from performed work and accepted results. Frozen observation snapshots do not make the live investigation read-only. Earlier answers keep their original context and clock.",
		evidence: "none",
		chart: false,
		metric: c.context.metric,
		sourceIds: [],
		qualification: "Read-only contextual guidance; no workflow transition or future evidence disclosure."
	};
}
function validContextualGuide(c) {
	if (c?.schemaVersion === 4) return validContextualGuide({
		...c,
		schemaVersion: 3
	}) && c.activeTarget?.kind === "comparison" && !!c.comparisonState && validComparison(c.comparisonState) && c.activeTarget.version === c.comparisonState.history.length + 1 && c.activeTarget.asOf === c.comparisonState.asOf && c.activeTarget.scope === comparisonGuideScope(c.comparisonState);
	return (c?.schemaVersion === 1 || (c?.schemaVersion === 2 || c?.schemaVersion === 3 && c.recoveryPolicyVersion === 1 && (c.retainedOrigin === null || !!c.retainedOrigin && validGuideOrigin(c.retainedOrigin))) && !!c.activeTarget && [
		"training",
		"comparison",
		"metric-demonstration"
	].includes(c.activeTarget.kind) && typeof c.activeTarget.id === "string" && !!c.activeTarget.id && typeof c.activeTarget.scope === "string" && !!c.activeTarget.scope && typeof c.activeTarget.asOf === "string" && Number.isFinite(Date.parse(c.activeTarget.asOf)) && c.workflow === null && c.resourceVersion === null && (c.activeTarget.version === null || Number.isInteger(c.activeTarget.version) && c.activeTarget.version > 0)) && isGuideQuestion(c.question) && [
		"supervisor",
		"maintenance",
		"manager",
		"safety",
		"viewer"
	].includes(c.actor) && typeof c.pendingReview === "boolean" && !!c.context && (c.workflow === null ? c.resourceVersion === null : validateWorkflow(c.workflow) && Number.isInteger(c.resourceVersion) && c.resourceVersion > 0);
}
Object.entries(workflowCommandFields).map(([kind, fields]) => ({
	kind,
	fields: [...fields]
}));
const contextualGuideClock = (c) => c.schemaVersion !== 1 ? c.activeTarget.asOf : c.workflow?.asOf || c.context.sourceCutoff || "2026-10-06T14:45:00Z";
function nonManufacturingGuideTarget(c, comparison) {
	if (c.dataset === "metric-demonstration" && c.metricDemonstrationContext) return {
		kind: "metric-demonstration",
		id: c.metricDemonstrationContext.resultId,
		asOf: c.metricDemonstrationContext.asOf,
		scope: JSON.stringify(c.metricDemonstrationContext),
		version: 1
	};
	if (c.dataset === "training") return {
		kind: "training",
		id: "training",
		asOf: c.trainingContext.asOf || "2026-09-29T00:00:00Z",
		scope: JSON.stringify({
			query: c.trainingContext,
			presentation: c.trainingPresentation
		}),
		version: null
	};
	if (c.comparisonId) {
		if (!comparison || comparison.id !== c.comparisonId) throw Error("Active comparison requires recovery; no retained investigation was substituted.");
		return {
			kind: "comparison",
			id: comparison.id,
			asOf: comparison.state.asOf,
			scope: comparisonGuideScope(comparison.state),
			version: comparison.version
		};
	}
	return null;
}
//#endregion
export { contextualGuideClock, contextualGuidePresentation, guideControls, guideReadiness, isGuideQuestion, nonManufacturingGuideTarget, validContextualGuide };
