import { validGovernedModelDraft } from "./governedModelDraft.js";
import { transitionContainment, validContainment } from "./containment.js";
import { makeWorkloadPlan, validWorkloadPlan } from "./workloadPlanning.js";
//#region app/src/investigation/governedDecisions.ts
var GovernedDecisionError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
const fail = (status, message) => {
	throw new GovernedDecisionError(status, message);
};
const bounded = (x, max = 2e3) => typeof x === "string" && !!x.trim() && x.length <= max;
const roles = [
	"manager",
	"supervisor",
	"maintenance",
	"safety"
];
const samePins = (a, b) => [
	"conversationId",
	"investigationId",
	"investigationVersion",
	"asOf",
	"sourceRowId",
	"sourceVersion",
	"planVersion"
].every((k) => a[k] === b[k]);
function validGovernedDecision(x) {
	return !!x && bounded(x.id) && [
		"pm",
		"handover",
		"lesson",
		"action",
		"workload",
		"containment"
	].includes(x.type) && bounded(x.title, 160) && bounded(x.text) && [
		"draft",
		"submitted",
		"offered",
		"approved-held",
		"rejected",
		"accepted",
		"promoted-candidate",
		"applied-recommendation",
		"held-workload",
		"contained-simulation",
		"release-reviewed-held",
		"released-simulation"
	].includes(x.status) && Number.isSafeInteger(x.version) && x.version >= 1 && roles.includes(x.authorRole) && x.scope && Array.isArray(x.basisReferences) && x.basisReferences.length > 0 && x.basisReferences.every((b) => b && bounded(b.id) && Number.isSafeInteger(b.version) && b.version > 0 && typeof b.knownAt === "string" && b.knownAt <= x.scope.asOf) && Array.isArray(x.history) && x.history.length === x.version && x.history.every((h, i) => h && h.version === i + 1 && roles.includes(h.actor) && typeof h.knownAt === "string" && h.knownAt <= h.scope?.asOf) && (![
		"contained-simulation",
		"release-reviewed-held",
		"released-simulation"
	].includes(x.status) || x.type === "containment") && (x.type !== "containment" || validContainment(x.containment) && (!x.containment.activatedAt || x.containment.activatedAt <= x.scope.asOf) && (!x.containment.releasedAt || x.containment.releasedAt <= x.scope.asOf) && (![
		"contained-simulation",
		"release-reviewed-held",
		"released-simulation"
	].includes(x.status) || !!x.containment.activatedAt) && (x.status !== "release-reviewed-held" || !!x.containment.releaseReview) && (x.status !== "released-simulation" || !!x.containment.releasedAt && !!x.containment.releaseReview)) && (!x.workloadReference || x.type === "action" && bounded(x.workloadReference.id) && Number.isSafeInteger(x.workloadReference.version) && x.workloadReference.version > 0) && (x.type !== "workload" || validWorkloadPlan(x.workload) && x.workload.verificationBasis.planVersion === x.scope.planVersion) && (x.type !== "action" || x.operation?.kind === "recommend-action" && Object.keys(x.operation).length === 1 && x.modelDraft?.operation?.kind === "recommend-action") && (x.status !== "applied-recommendation" || x.type === "action" && x.canonicalReceipt?.id === x.scope.investigationId && x.canonicalReceipt?.version === x.scope.investigationVersion + 1 && bounded(x.canonicalReceipt.operationId)) && (!x.modelDraft || validGovernedModelDraft(x.modelDraft)) && x.causalStatus === "unconfirmed" && x.financiallyValidated === false && x.productionReleased === false && x.notDispatched === true;
}
function governedDecisionsFromEntries(entries) {
	const records = [];
	for (const entry of entries) {
		if (entry.kind !== "decision-lifecycle") continue;
		const record = entry.evaluation?.governedDecision;
		const old = records.find((r) => r.id === record?.id);
		if (!validGovernedDecision(record) || record.version !== (old?.version || 0) + 1 || JSON.stringify(record.history.slice(0, -1)) !== JSON.stringify(old?.history || []) || JSON.stringify(record.scope) !== JSON.stringify(entry.scope) || record.history.at(-1)?.operation !== entry.payload.operation || record.history.at(-1)?.actor !== entry.actor) throw Error("Governed decision history requires recovery; originals retained.");
		const i = records.findIndex((r) => r.id === record.id);
		if (i < 0) records.push(structuredClone(record));
		else records[i] = structuredClone(record);
	}
	return records;
}
function transitionGovernedDecision(records, payload, ctx) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload) || !roles.includes(ctx.actor)) return fail(403, "A permitted fictional decision role is required.");
	if (payload.type === "containment" || records.some((r) => r.id === payload.recordId && r.type === "containment")) {
		const result = transitionContainment(records, payload, ctx, fail);
		if (!validGovernedDecision(result)) return fail(422, "Invalid canonical containment result.");
		return result;
	}
	const keys = {
		create: [
			"operation",
			"type",
			"title",
			"text",
			"receivingRole",
			"basisRecordIds",
			"modelDraftTurnId",
			"profile",
			"duties",
			"deadline",
			"workloadPlanId"
		],
		edit: [
			"operation",
			"recordId",
			"expectedRecordVersion",
			"text",
			"workloadPlanId"
		],
		submit: [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		review: [
			"operation",
			"recordId",
			"expectedRecordVersion",
			"outcome"
		],
		accept: [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		promote: [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		apply: [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		"edit-workload": [
			"operation",
			"recordId",
			"expectedRecordVersion",
			"text",
			"profile",
			"duties",
			"deadline"
		],
		"accept-duty": [
			"operation",
			"recordId",
			"expectedRecordVersion",
			"dutyId"
		]
	};
	if (!keys[payload.operation] || Object.keys(payload).some((k) => !keys[payload.operation].includes(k))) return fail(422, "Unsupported decision fields or transition.");
	const bindWorkload = (id) => {
		const plan = records.find((r) => r.id === id && r.type === "workload");
		if (!plan || !samePins(plan.scope, ctx.scope)) return fail(422, "Select an exact same-case current workload planning record.");
		return {
			id: plan.id,
			version: plan.version
		};
	};
	const workloadReady = (record) => {
		if (!record.workloadReference) return;
		const plan = records.find((r) => r.id === record.workloadReference.id && r.type === "workload");
		if (!plan || plan.version !== record.workloadReference.version || !samePins(plan.scope, ctx.scope)) return fail(409, "The linked workload basis changed; edit and review this proposal again.");
		if (plan.status !== "approved-held" || plan.workload.assessment.constraintReasons.length || plan.workload.duties.some((d) => !d.acceptance)) return fail(422, "Linked workload capacity, deadline, named duty acceptance and manager endorsement must be ready.");
	};
	let next;
	if (payload.operation === "create") {
		if (![
			"pm",
			"handover",
			"lesson",
			"action",
			"workload"
		].includes(payload.type) || !bounded(payload.title, 160) || !bounded(payload.text) || !Array.isArray(payload.basisRecordIds) || !payload.basisRecordIds.length || payload.basisRecordIds.length > 16 || new Set(payload.basisRecordIds).size !== payload.basisRecordIds.length || payload.basisRecordIds.some((id) => !bounded(id))) return fail(422, "Provide a bounded title, draft and exact nonduplicate basis IDs.");
		if (payload.type === "handover" ? !roles.includes(payload.receivingRole) : payload.receivingRole !== void 0) return fail(422, "A handover needs its exact receiving role; other proposals have no receiver.");
		let basis;
		try {
			basis = payload.basisRecordIds.map(ctx.resolveBasis);
		} catch {
			return fail(422, "Exact owned basis and known time are required.");
		}
		if (payload.modelDraftTurnId !== void 0 && (!ctx.modelDraft || payload.modelDraftTurnId !== ctx.modelDraft.turnId || ctx.modelDraft.authorRole !== ctx.actor)) return fail(422, "Use the latest exact saved model interpretation for this fictional role; retained interpretations remain historical.");
		if (payload.workloadPlanId !== void 0 && payload.type !== "action") return fail(422, "Workload linkage requires a typed canonical action proposal.");
		if (payload.type !== "workload" && [
			"profile",
			"duties",
			"deadline"
		].some((k) => Object.hasOwn(payload, k))) return fail(422, "Workload fields require a workload proposal.");
		if (payload.type === "action" && (!payload.modelDraftTurnId || ctx.modelDraft?.operation?.kind !== "recommend-action")) return fail(422, "A current exact model-endorsed canonical action preview is required.");
		next = {
			id: ctx.newId,
			...payload.workloadPlanId !== void 0 ? { workloadReference: bindWorkload(payload.workloadPlanId) } : {},
			...payload.type === "action" ? { operation: structuredClone(ctx.modelDraft.operation) } : {},
			...payload.modelDraftTurnId !== void 0 ? { modelDraft: structuredClone(ctx.modelDraft) } : {},
			type: payload.type,
			...payload.type === "workload" ? { workload: makeWorkloadPlan(payload, ctx.scope.asOf, ctx.verificationBasis) } : {},
			title: payload.title.trim(),
			text: payload.text.trim(),
			...payload.type === "handover" ? { receivingRole: payload.receivingRole } : {},
			status: "draft",
			version: 1,
			authorRole: ctx.actor,
			scope: structuredClone(ctx.scope),
			basisReferences: basis,
			history: [],
			causalStatus: "unconfirmed",
			financiallyValidated: false,
			productionReleased: false,
			notDispatched: true
		};
	} else {
		const old = records.find((r) => r.id === payload.recordId);
		if (!old) return fail(422, "Exact governed decision not found.");
		if (payload.expectedRecordVersion !== old.version) return fail(409, "Decision revision changed; retain draft and refresh.");
		next = structuredClone(old);
		if (!["edit", "edit-workload"].includes(payload.operation) && !samePins(old.scope, ctx.scope)) return fail(409, "Case/source/plan/cutoff changed; explicitly edit and resubmit the proposal.");
		let basis;
		try {
			basis = old.basisReferences.map((b) => ctx.resolveBasis(b.id));
		} catch {
			return fail(422, "Decision basis is unavailable.");
		}
		if (!["edit", "edit-workload"].includes(payload.operation) && basis.some((b, i) => JSON.stringify(b) !== JSON.stringify(old.basisReferences[i]))) return fail(409, "A bound basis version changed; review and explicitly edit.");
		next.version++;
		next.scope = structuredClone(ctx.scope);
		if (payload.operation === "edit-workload") {
			if (old.type !== "workload" || !ctx.verificationBasis || !bounded(payload.text)) return fail(422, "Edit an exact workload proposal with a bounded explanation.");
			if (ctx.actor !== old.authorRole && ctx.actor !== "manager") return fail(403, "The proposing role or manager must review workload edits.");
			next.workload = makeWorkloadPlan(payload, ctx.scope.asOf, ctx.verificationBasis);
			next.text = payload.text.trim();
			next.status = "draft";
			next.basisReferences = basis;
			delete next.review;
		} else if (payload.operation === "accept-duty") {
			if (old.type !== "workload" || old.status !== "submitted") return fail(422, "Only an eligible submitted workload can be acknowledged.");
			const duty = next.workload.duties.find((d) => d.id === payload.dutyId);
			if (!duty || duty.role !== ctx.actor) return fail(403, "Only the exact named duty role may acknowledge this planning task.");
			if (duty.acceptance) return fail(422, "This named duty is already acknowledged.");
			duty.acceptance = {
				actor: ctx.actor,
				knownAt: ctx.knownAt
			};
		} else if (payload.operation === "edit") {
			if (old.type === "workload") return fail(422, "Use the typed workload edit to preserve the entire planning basis.");
			if (ctx.actor !== old.authorRole && ctx.actor !== "manager") return fail(403, "Only the proposing role or manager may edit a synthetic draft.");
			if (!bounded(payload.text)) return fail(422, "Keep the edited proposal bounded and nonempty.");
			if (payload.workloadPlanId !== void 0) {
				if (old.type !== "action") return fail(422, "Only a canonical action has a workload application basis.");
				next.workloadReference = bindWorkload(payload.workloadPlanId);
			}
			if (old.type === "action") {
				if (ctx.modelDraft?.operation?.kind !== "recommend-action" || ctx.modelDraft.authorRole !== ctx.actor) return fail(422, "Refresh a current model action preview before revising this proposal.");
				next.modelDraft = structuredClone(ctx.modelDraft);
				delete next.canonicalReceipt;
			}
			next.text = payload.text.trim();
			next.status = "draft";
			next.basisReferences = basis;
			delete next.review;
			delete next.acceptance;
			delete next.promotion;
		} else if (payload.operation === "submit") {
			if (ctx.actor !== old.authorRole) return fail(403, "The proposing fictional role must submit its own draft.");
			if (!["draft", "rejected"].includes(old.status)) return fail(422, "Only a draft or rejected proposal may be resubmitted.");
			next.status = old.type === "handover" ? "offered" : old.type === "workload" && old.workload.assessment.constraintReasons.length ? "held-workload" : "submitted";
		} else if (payload.operation === "review") {
			if (!["manager", "safety"].includes(ctx.actor) || ctx.actor === old.authorRole) return fail(403, "A separate permitted fictional review role is required.");
			if (old.type === "handover" || old.status !== "submitted" && !(old.type === "workload" && old.status === "held-workload" && payload.outcome === "rejected") || !["approved-held", "rejected"].includes(payload.outcome)) return fail(422, "Review a submitted PM or lesson candidate with an explicit held/reject outcome.");
			if (old.type === "action" && payload.outcome === "approved-held") workloadReady(old);
			if (old.type === "workload" && payload.outcome === "approved-held" && (ctx.actor !== "manager" || old.workload.assessment.constraintReasons.length || old.workload.duties.some((d) => !d.acceptance))) return fail(422, "Manager endorsement requires feasible capacity/deadline and every named duty acceptance.");
			next.status = payload.outcome;
			next.review = {
				actor: ctx.actor,
				knownAt: ctx.knownAt,
				outcome: payload.outcome
			};
		} else if (payload.operation === "accept") {
			if (old.type !== "handover" || old.receivingRole !== ctx.actor) return fail(403, "Only the named receiving fictional role can acknowledge this handover.");
			if (old.status !== "offered") return fail(422, "Only an offered handover can be accepted.");
			next.status = "accepted";
			next.acceptance = {
				actor: ctx.actor,
				knownAt: ctx.knownAt
			};
		} else if (payload.operation === "apply") {
			if (old.type !== "action" || old.status !== "approved-held" || !ctx.canonicalReceipt) return fail(422, "Apply only a separately reviewed canonical action proposal.");
			if (ctx.actor !== old.authorRole && ctx.actor !== "manager") return fail(403, "The proposing role or manager must explicitly confirm application.");
			workloadReady(old);
			next.status = "applied-recommendation";
			next.canonicalReceipt = structuredClone(ctx.canonicalReceipt);
		} else if (payload.operation === "promote") {
			if (!["manager", "safety"].includes(ctx.actor)) return fail(403, "Candidate promotion requires a permitted fictional review role.");
			if (old.type !== "lesson" || old.status !== "approved-held" || !ctx.verificationAccepted || !ctx.sustained) return fail(422, "Candidate promotion needs accepted verification and sustained eligible observations.");
			next.status = "promoted-candidate";
			next.promotion = {
				actor: ctx.actor,
				knownAt: ctx.knownAt
			};
		}
	}
	next.history.push({
		operation: payload.operation,
		actor: ctx.actor,
		knownAt: ctx.knownAt,
		version: next.version,
		scope: structuredClone(ctx.scope)
	});
	if (!validGovernedDecision(next)) return fail(422, "Governed decision result is invalid.");
	return next;
}
//#endregion
export { GovernedDecisionError, governedDecisionsFromEntries, transitionGovernedDecision, validGovernedDecision };
