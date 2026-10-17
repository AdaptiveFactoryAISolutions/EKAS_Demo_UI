import { clocks } from "./model.js";
//#region app/src/investigation/containment.ts
const roles = [
	"supervisor",
	"maintenance",
	"manager",
	"safety"
];
const bounded = (v, max = 2e3) => typeof v === "string" && !!v.trim() && v.length <= max;
const same = (a, b) => !!a && !!b && JSON.stringify(Object.keys(a).sort().map((k) => [k, a[k]])) === JSON.stringify(Object.keys(b).sort().map((k) => [k, b[k]]));
const sameLineage = (a, b) => [
	"conversationId",
	"investigationId",
	"sourceRowId",
	"sourceVersion",
	"planVersion"
].every((k) => a[k] === b[k]) && b.investigationVersion >= a.investigationVersion && b.asOf >= a.asOf;
function validContainment(x) {
	return !!x && roles.includes(x.ownerRole) && x.affectedContext && Object.keys(x.affectedContext).length > 0 && Object.values(x.affectedContext).every((v) => typeof v === "string" && !!v) && clocks.includes(x.activateAt) && x.activateAt > clocks[0] && bounded(x.exitCriterion) && Array.isArray(x.priorEpisodes) && x.priorEpisodes.every((p) => bounded(p.activatedAt) && bounded(p.releasedAt) && p.activatedAt <= p.releasedAt && p.activationBasis && p.releaseBasis && bounded(p.exitCriterion)) && (!x.activatedAt || x.activatedAt >= x.activateAt && x.activationBasis?.asOf === x.activatedAt) && (!x.releasedAt || !!x.activatedAt && x.releasedAt >= x.activatedAt && x.releaseBasis?.asOf === x.releasedAt) && (!x.releaseReview || roles.includes(x.releaseReview.actor) && x.releaseReview.scope?.asOf === x.releaseReview.knownAt);
}
function transitionContainment(records, payload, ctx, fail) {
	if ([
		"activate-containment",
		"review-containment-release",
		"release-containment",
		"reopen-containment"
	].includes(payload.operation) && ctx.knownAt !== ctx.scope.asOf) return fail(422, "Timed containment events require the exact selected simulation capture; historical timestamps cannot be rewritten as current.");
	const keys = {
		create: [
			"operation",
			"type",
			"title",
			"text",
			"basisRecordIds",
			"containment"
		],
		"edit-containment": [
			"operation",
			"recordId",
			"expectedRecordVersion",
			"text",
			"containment"
		],
		submit: [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		"accept-containment": [
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
		"activate-containment": [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		"review-containment-release": [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		"release-containment": [
			"operation",
			"recordId",
			"expectedRecordVersion"
		],
		"reopen-containment": [
			"operation",
			"recordId",
			"expectedRecordVersion"
		]
	};
	if (!keys[payload.operation] || Object.keys(payload).some((k) => !keys[payload.operation].includes(k))) return fail(422, "Only typed containment fields and exact saved transitions are permitted.");
	const plan = (input) => {
		if (!input || Array.isArray(input) || Object.keys(input).some((k) => ![
			"ownerRole",
			"affectedContext",
			"activateAt",
			"exitCriterion"
		].includes(k)) || !roles.includes(input.ownerRole) || !same(input.affectedContext, ctx.affectedContext) || !clocks.includes(input.activateAt) || input.activateAt <= clocks[0] || !bounded(input.exitCriterion)) return fail(422, "Provide exact affected part/revision/job/asset context, a named fictional owner, declared later simulation time and bounded exit criterion.");
		return {
			...structuredClone(input),
			exitCriterion: input.exitCriterion.trim(),
			priorEpisodes: []
		};
	};
	let next;
	if (payload.operation === "create") {
		if (!["supervisor", "maintenance"].includes(ctx.actor) || !bounded(payload.title, 160) || !bounded(payload.text) || !Array.isArray(payload.basisRecordIds) || !payload.basisRecordIds.length || payload.basisRecordIds.length > 16 || new Set(payload.basisRecordIds).size !== payload.basisRecordIds.length) return fail(422, "A supervisor or maintenance proposer needs bounded instructions and exact unique basis records.");
		let basis;
		try {
			basis = payload.basisRecordIds.map(ctx.resolveBasis);
		} catch {
			return fail(422, "Exact owned current containment basis is required.");
		}
		next = {
			id: ctx.newId,
			type: "containment",
			title: payload.title.trim(),
			text: payload.text.trim(),
			containment: plan(payload.containment),
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
		const old = records.find((r) => r.id === payload.recordId && r.type === "containment");
		if (!old) return fail(422, "Select the exact canonical containment record.");
		if (old.version !== payload.expectedRecordVersion) return fail(409, "Containment revision changed; preserve your draft and reload.");
		const p = old.containment;
		if (!sameLineage(old.scope, ctx.scope) || !same(p.affectedContext, ctx.affectedContext)) return fail(409, "Containment source, plan, case or affected cohort changed; original capture remains historical and progression is held.");
		let basis;
		try {
			basis = old.basisReferences.map((b) => ctx.resolveBasis(b.id));
		} catch {
			return fail(422, "Containment basis is unavailable.");
		}
		if (basis.some((b, i) => !same(b, old.basisReferences[i]))) return fail(409, "A containment basis version changed; hold and review the original record.");
		next = structuredClone(old);
		next.version++;
		next.scope = structuredClone(ctx.scope);
		if (payload.operation === "edit-containment") {
			if (![
				"draft",
				"submitted",
				"approved-held",
				"rejected"
			].includes(old.status) || p.activatedAt) return fail(422, "Active containment cannot be silently rewritten; retain its history.");
			if (ctx.actor !== old.authorRole && ctx.actor !== "manager") return fail(403, "Only proposer or manager may revise the draft.");
			if (!bounded(payload.text)) return fail(422, "A bounded revised instruction is required.");
			next.containment = plan(payload.containment);
			next.containment.priorEpisodes = structuredClone(p.priorEpisodes);
			next.text = payload.text.trim();
			next.status = "draft";
			delete next.review;
			delete next.acceptance;
		} else if (payload.operation === "submit") {
			if (ctx.actor !== old.authorRole) return fail(403, "The proposer must submit containment.");
			if (!["draft", "rejected"].includes(old.status)) return fail(422, "Submit a draft or rejected containment.");
			next.status = "submitted";
		} else if (payload.operation === "accept-containment") {
			if (ctx.actor !== p.ownerRole) return fail(403, "Only the named containment owner may accept.");
			if (old.status !== "submitted" || old.acceptance) return fail(422, "Accept a submitted unacknowledged containment task.");
			next.acceptance = {
				actor: ctx.actor,
				knownAt: ctx.knownAt
			};
		} else if (payload.operation === "review") {
			if (!["manager", "safety"].includes(ctx.actor) || ctx.actor === old.authorRole || ctx.actor === p.ownerRole) return fail(403, "A separate manager or safety reviewer is required.");
			if (old.status !== "submitted" || !["approved-held", "rejected"].includes(payload.outcome)) return fail(422, "Review a submitted containment with an explicit outcome.");
			if (payload.outcome === "approved-held" && !old.acceptance) return fail(422, "Named owner acceptance is required before endorsement.");
			next.status = payload.outcome;
			next.review = {
				actor: ctx.actor,
				knownAt: ctx.knownAt,
				outcome: payload.outcome
			};
		} else if (payload.operation === "activate-containment") {
			if (ctx.actor !== p.ownerRole) return fail(403, "Only the accepted containment owner may confirm simulated activation.");
			if (old.status !== "approved-held" || !old.acceptance || !old.review || ctx.scope.asOf < p.activateAt || ctx.scope.asOf === clocks[0]) return fail(422, "Containment needs owner acceptance, separate endorsement and the explicit eligible later simulation snapshot.");
			next.status = "contained-simulation";
			next.containment.activatedAt = ctx.scope.asOf;
			next.containment.activationBasis = structuredClone(ctx.scope);
		} else if (payload.operation === "review-containment-release") {
			if (!["manager", "safety"].includes(ctx.actor) || ctx.actor === old.authorRole || ctx.actor === p.ownerRole) return fail(403, "A separate permitted release reviewer is required.");
			if (!["contained-simulation", "release-reviewed-held"].includes(old.status) || !ctx.actionPerformed || !ctx.verificationAccepted || !ctx.sustained) return fail(422, "Release review requires performed permanent correction, accepted current verification and sustained eligible observations; temporary containment is not corrective benefit.");
			next.status = "release-reviewed-held";
			next.containment.releaseReview = {
				actor: ctx.actor,
				knownAt: ctx.knownAt,
				scope: structuredClone(ctx.scope)
			};
		} else if (payload.operation === "release-containment") {
			if (ctx.actor !== p.ownerRole) return fail(403, "Only the accepted owner may explicitly confirm simulated release.");
			if (old.status !== "release-reviewed-held" || !p.releaseReview || !same(p.releaseReview.scope, ctx.scope) || !ctx.actionPerformed || !ctx.verificationAccepted || !ctx.sustained) return fail(422, "Use exact current release review, performed correction, accepted verification and sustained observations.");
			next.status = "released-simulation";
			next.containment.releasedAt = ctx.scope.asOf;
			next.containment.releaseBasis = structuredClone(ctx.scope);
		} else if (payload.operation === "reopen-containment") {
			if (ctx.actor !== old.authorRole && ctx.actor !== "manager") return fail(403, "The proposer or manager must reopen the recorded recurrence.");
			if (old.status !== "released-simulation" || !ctx.recurrence) return fail(422, "Reopen only after an explicit eligible recurrence observation; retain the previous release capture.");
			next.containment = {
				ownerRole: p.ownerRole,
				affectedContext: structuredClone(p.affectedContext),
				activateAt: ctx.scope.asOf,
				exitCriterion: p.exitCriterion,
				priorEpisodes: [...structuredClone(p.priorEpisodes), {
					activatedAt: p.activatedAt,
					releasedAt: p.releasedAt,
					activationBasis: structuredClone(p.activationBasis),
					releaseBasis: structuredClone(p.releaseBasis),
					exitCriterion: p.exitCriterion
				}]
			};
			next.status = "draft";
			delete next.acceptance;
			delete next.review;
		}
	}
	next.history.push({
		operation: payload.operation,
		actor: ctx.actor,
		knownAt: ctx.knownAt,
		version: next.version,
		scope: structuredClone(ctx.scope)
	});
	return next;
}
//#endregion
export { transitionContainment, validContainment };
