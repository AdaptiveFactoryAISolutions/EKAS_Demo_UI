import { API_VERSION } from "../platform/contract.js";
import { PersistenceFailure } from "../platform/mockRepository.js";
import { validateWorkflow, workflowView } from "./workflow.js";
import { currentConversationScopeIssue } from "./conversationScopeEligibility.js";
import { currentGovernedModelDraft } from "./governedModelDraft.js";
import { GovernedDecisionError, governedDecisionsFromEntries, transitionGovernedDecision } from "./governedDecisions.js";
import { decisionCapabilities } from "./decisionCapabilities.js";
import { constrainedPortfolio, recoveryScenario } from "./decisionScenarios.js";
import { collectorScopeMatches } from "./collectorScope.js";
import { dependencyView } from "./dependencies.js";
//#region app/src/investigation/decisionSupport.ts
const decisionSupportDomain = "manufacturing-decision-support-v1";
const base = "/api/v1/manufacturing/decision-support";
const text = (x, min = 1) => typeof x === "string" && x.trim().length >= min && x.length <= 2e3;
const exact = (x, keys) => Object.keys(x).every((k) => keys.includes(k));
const classification = (kind) => ({
	"decision-lifecycle": "governed_decision_event",
	"record-observation": "unverified_synthetic_note",
	"record-pm-review": "held_pm_proposal",
	"record-handover": "handover_note",
	"record-lesson": "candidate_lesson",
	"save-scenario": "bounded_synthetic_scenario",
	"record-portfolio-review": "constrained_portfolio_proposal"
})[kind];
function orderedJson(value) {
	return Array.isArray(value) ? value.map(orderedJson) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, orderedJson(value[k])])) : value;
}
function sameFingerprint(a, b) {
	try {
		return JSON.stringify(orderedJson(JSON.parse(a))) === JSON.stringify(orderedJson(JSON.parse(b)));
	} catch {
		return false;
	}
}
function basisReference(repo, id, w, knownAt) {
	if (id === w.origin.resultId) {
		if (w.origin.asOf > knownAt) throw Error("Basis origin is later than the recorded review time.");
		return {
			id,
			version: w.origin.resultVersion,
			knownAt: w.origin.asOf,
			domain: w.fixtureVersion,
			qualification: "Pinned immutable case origin; synthetic, unverified causal basis."
		};
	}
	const r = repo.state.resources.find((r) => r.id === id && r.ownerSessionId === "manufacturing-demo" && r.assetIds.every((a) => w.context.asset === a));
	if (!r || !Number.isSafeInteger(r.version) || r.version < 1) throw Error("Basis reference is not an exact owned and permitted version.");
	const times = [
		r.createdAt,
		r.updatedAt,
		...r.content.workflow ? [String(r.content.workflow.asOf)] : [],
		...Object.hasOwn(r.content, "knownAt") ? [String(r.content.knownAt)] : []
	];
	if (times.some((t) => typeof t !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(t) || !Number.isFinite(Date.parse(t)) || new Date(t).toISOString().replace(".000Z", "Z") !== t || t > knownAt)) throw Error("Basis version or source snapshot is future/unqualified at this recorded review time.");
	return {
		id,
		version: r.version,
		knownAt: times.sort().at(-1),
		domain: String(r.content.domain || r.kind),
		qualification: "Exact owned reference version and known time; applicability and causal proof remain unverified."
	};
}
function basisQualifications(repo, entries) {
	return Object.fromEntries(entries.filter((e) => ["record-pm-review", "record-lesson"].includes(e.kind)).map((e) => [e.id, !e.payload.basisRecordIds.length ? "No supplied basis; this record remains uncertain." : !e.basisReferences ? "Legacy basis IDs have no bound version or known time; references are unqualified. Original record retained." : e.basisReferences.map((r) => {
		const current = repo.state.resources.find((x) => x.id === r.id);
		return r.id + " / version " + r.version + " / known " + r.knownAt + ". " + r.qualification + (current && current.version !== r.version ? " Current reference version changed; reassess applicability without rewriting this bound history." : "");
	}).join(" ")]));
}
function projection(repo, id, allowedAssets) {
	const conversation = repo.state.resources.find((r) => r.id === id && r.ownerSessionId === "manufacturing-demo" && r.content.domain === "manufacturing-conversation-v1");
	if (!conversation) throw Error("NOT_FOUND");
	const c = conversation.content.conversation;
	const workflow = repo.state.resources.find((r) => r.id === c.investigationId && r.ownerSessionId === "manufacturing-demo" && r.content.domain === "manufacturing-investigation-v2");
	if (!workflow || !validateWorkflow(workflow.content.workflow)) throw Error("INVALID_RESULT");
	const w = workflow.content.workflow, d = dependencyView(repo.state.resources, w.caseId, w.asOf), support = repo.state.resources.find((r) => r.content.domain === "manufacturing-decision-support-v1" && r.content.investigationId === workflow.id);
	if (support) {
		const entries = support.content.entries;
		if (!Array.isArray(entries) || entries.length !== support.version || !exact(support.content, [
			"domain",
			"investigationId",
			"entries"
		]) || repo.state.resources.filter((r) => r.content.domain === "manufacturing-decision-support-v1" && r.content.investigationId === workflow.id).length !== 1 || entries.some((e, i) => !e || e.id !== support.id + "/entry-" + (i + 1) || ![
			"decision-lifecycle",
			"record-observation",
			"record-pm-review",
			"record-handover",
			"record-lesson",
			"save-scenario",
			"record-portfolio-review"
		].includes(e.kind) || e.classification !== classification(e.kind) || e.causalStatus !== "unconfirmed" || e.financiallyValidated !== false || e.productionReleased !== false || e.notDispatched !== true || !e.scope || e.scope.investigationId !== workflow.id || !Number.isSafeInteger(e.scope.investigationVersion) || e.scope.investigationVersion > workflow.version || e.knownAt > e.scope.asOf || !text(e.reason, 10) || !e.payload || ![
			"supervisor",
			"maintenance",
			"manager",
			"safety"
		].includes(e.actor))) throw Error("Decision support records require recovery; no unverified data displayed.");
	}
	if (support) {
		for (const e of support.content.entries) if (e.basisReferences !== void 0 && (!["record-pm-review", "record-lesson"].includes(e.kind) || !Array.isArray(e.basisReferences) || !Array.isArray(e.payload.basisRecordIds) || e.basisReferences.length !== e.payload.basisRecordIds.length || e.basisReferences.some((r, i) => !r || r.id !== e.payload.basisRecordIds[i] || !Number.isSafeInteger(r.version) || r.version < 1 || typeof r.knownAt !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(r.knownAt) || !Number.isFinite(Date.parse(r.knownAt)) || new Date(r.knownAt).toISOString().replace(".000Z", "Z") !== r.knownAt || r.knownAt > e.knownAt || !text(r.domain) || !text(r.qualification)))) throw Error("Bound basis references require recovery; original records retained.");
	}
	if (support) for (const e of support.content.entries) {
		const expected = e.kind === "save-scenario" ? recoveryScenario(w.caseId, e.scope.asOf, e.payload) : e.kind === "record-portfolio-review" ? constrainedPortfolio(e.payload) : void 0;
		if (expected && JSON.stringify(e.evaluation) !== JSON.stringify(expected)) throw Error("Saved decision evaluation requires recovery.");
	}
	const selectionIssue = currentConversationScopeIssue(c);
	const admissible = !selectionIssue && workflowView(w).eligibility.status === "ready" && !c.archived && c.dataset === "manufacturing" && !c.comparisonId && collectorScopeMatches(c.context, w) && d.current.eligible && d.current.sourceVersion === 0;
	const scope = {
		conversationId: id,
		conversationVersion: conversation.version,
		investigationId: workflow.id,
		investigationVersion: workflow.version,
		asOf: w.asOf,
		sourceRowId: d.current.sourceRowId,
		sourceVersion: d.current.sourceVersion,
		planVersion: w.plan.version
	};
	const candidateCases = repo.state.resources.filter((r) => r.ownerSessionId === "manufacturing-demo" && r.content.domain === "manufacturing-investigation-v2" && r.assetIds.every((a) => allowedAssets.includes(a))).map((r) => {
		const candidate = r.content.workflow;
		if (!validateWorkflow(candidate)) throw Error("A candidate case requires recovery.");
		const v = workflowView(candidate), eligible = candidate.asOf <= w.asOf && v.eligibility.status === "ready" && dependencyView(repo.state.resources, candidate.caseId, w.asOf).current.sourceVersion === 0;
		return {
			id: r.id,
			version: r.version,
			caseId: candidate.caseId,
			asset: candidate.context.asset,
			endpoint: candidate.plan.endpoint,
			unit: candidate.plan.unit,
			eligible,
			qualification: eligible ? "Owned synthetic case; budget/hours/priority require explicit reviewed assumptions." : "Future, unavailable or revised source; not eligible for this planning cutoff."
		};
	});
	return {
		data: {
			version: support?.version || 0,
			scope,
			admissible,
			qualification: selectionIssue || (admissible ? "Synthetic, unverified decision records. Approval is not intervention; notes do not establish cause or financial savings." : "The selected scope or current source does not match this retained case. Refresh an eligible case before recording a decision."),
			containmentReadiness: {
				performed: w.action.status === "performed",
				verificationAccepted: w.accepted,
				sustained: workflowView(w).sustain.status === "sustained",
				recurrence: workflowView(w).sustain.status === "recurrence"
			},
			currentCase: {
				origin: w.origin,
				owner: w.owner,
				action: w.action,
				plan: w.plan,
				verificationRecorded: w.verificationRecorded,
				accepted: w.accepted,
				sustainIds: w.sustainIds
			},
			entries: structuredClone(support?.content.entries || []),
			governedDecisions: governedDecisionsFromEntries(support?.content.entries || []),
			modelDraft: currentGovernedModelDraft(conversation, w),
			basisQualifications: basisQualifications(repo, support?.content.entries || []),
			candidateCases,
			synthetic: true
		},
		workflow,
		conversation,
		support
	};
}
async function decisionSupportRequest(repo, q, actor, assertLease) {
	const reply = (status, data, code, message) => {
		assertLease?.();
		return {
			requestId: q.requestId,
			apiVersion: API_VERSION,
			status,
			synthetic: true,
			...code ? { error: {
				code,
				message: message || code,
				retryable: code === "STORAGE_UNAVAILABLE"
			} } : { data }
		};
	};
	try {
		if (q.method === "GET" && q.path === "/api/v1/manufacturing/decision-support/capabilities") return reply(200, decisionCapabilities);
		const route = q.path.match(/^\/api\/v1\/manufacturing\/decision-support\/([^/]+)(\/packet)?$/), b = q.body;
		if (q.method !== "GET" && !(q.method === "POST" && q.path === base)) return reply(404, void 0, "UNKNOWN_ENDPOINT");
		if (q.method === "GET" && !route) return reply(404, void 0, "UNKNOWN_ENDPOINT");
		if (q.method === "POST" && (actor === "viewer" || q.session.role === "viewer")) return reply(403, void 0, "FORBIDDEN");
		if (q.method === "POST" && (!b || !q.idempotencyKey || !text(q.idempotencyKey) || !b.scope)) return reply(400, void 0, "INVALID_REQUEST");
		const slot = "decision-support:" + actor + ":" + q.idempotencyKey, fingerprint = JSON.stringify({
			actor,
			path: q.path,
			body: b
		});
		const cached = q.method === "POST" ? repo.state.idempotency[slot] : void 0;
		if (cached) return sameFingerprint(cached.fingerprint, fingerprint) && cached.result.assetIds.every((a) => q.session.allowedAssetIds.includes(a)) ? reply(200, structuredClone(cached.result.content.response)) : reply(409, void 0, "IDEMPOTENCY_CONFLICT");
		const { data, workflow, conversation, support } = projection(repo, route?.[1] || b.scope.conversationId, q.session.allowedAssetIds);
		if (![...workflow.assetIds, ...conversation.assetIds].every((a) => q.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
		if (q.method === "GET") return reply(200, route?.[2] ? {
			kind: "synthetic_manufacturing_review_packet",
			projection: data,
			supportEntries: structuredClone(data.entries),
			sourceAnchors: {
				result: structuredClone(workflow.content.workflow.origin),
				planVersion: workflow.content.workflow.plan.version,
				documents: workflowView(workflow.content.workflow).documents.map((d) => ({
					id: d.id,
					version: d.version,
					source: d.source,
					knownAt: d.knownAt,
					eligible: d.eligible,
					status: d.status
				}))
			},
			auditRecords: structuredClone(repo.state.resources.filter((r) => r.ownerSessionId === "manufacturing-demo" && r.content.caseId === workflow.content.workflow.caseId && r.createdAt <= data.scope.asOf && r.assetIds.every((a) => q.session.allowedAssetIds.includes(a)) && ["manufacturing-governed-record-v1", "manufacturing-source-dependencies-v1"].includes(String(r.content.domain)))),
			missingEvidence: ["Production/backend conformance and financial signoff are unverified.", "Notes and candidate lessons do not establish cause or controlled-document release."],
			historyPolicy: "Original captures and audit records are immutable; this is a separately dated review projection.",
			workflow: structuredClone(workflow),
			conversations: structuredClone(repo.state.resources.filter((r) => r.ownerSessionId === "manufacturing-demo" && r.content.domain === "manufacturing-conversation-v1" && r.content.conversation.investigationIds[workflow.content.workflow.caseId] === workflow.id && r.assetIds.every((a) => q.session.allowedAssetIds.includes(a)))),
			causalStatus: "unconfirmed",
			financiallyValidated: false,
			notDispatched: true
		} : data);
		if (typeof b.scope !== "object" || Array.isArray(b.scope) || Object.keys(b.scope).length !== Object.keys(data.scope).length || Object.entries(data.scope).some(([k, v]) => b.scope[k] !== v) || b.expectedVersion !== data.version) return reply(409, void 0, "CONFLICT", "Exact case, conversation, source and plan versions changed; reload before recording.");
		if (!data.admissible) return reply(422, void 0, "INVALID_REQUEST", data.qualification);
		if (!exact(b, [
			"kind",
			"scope",
			"expectedVersion",
			"knownAt",
			"reason",
			"confirmation",
			"payload"
		]) || !text(b.reason, 10) || b.confirmation !== (b.kind === "decision-lifecycle" && b.payload?.operation === "apply" ? "CONFIRM_REVIEWED_SYNTHETIC_RECOMMENDATION" : b.kind === "decision-lifecycle" && b.payload?.operation === "activate-containment" ? "CONFIRM_SIMULATED_CONTAINMENT_ACTIVATION" : b.kind === "decision-lifecycle" && b.payload?.operation === "release-containment" ? "CONFIRM_SIMULATED_CONTAINMENT_RELEASE" : "CONFIRM_SYNTHETIC_DECISION_RECORD") || typeof b.knownAt !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(b.knownAt) || !Number.isFinite(Date.parse(b.knownAt)) || new Date(b.knownAt).toISOString().replace(".000Z", "Z") !== b.knownAt || b.knownAt > data.scope.asOf || b.knownAt < workflow.content.workflow.openedAt || data.entries.some((e) => e.knownAt > b.knownAt) || !b.payload || typeof b.payload !== "object" || Array.isArray(b.payload)) return reply(422, void 0, "INVALID_REQUEST");
		let evaluation, basisReferences, stagedState;
		if (b.kind === "decision-lifecycle") try {
			let canonicalReceipt;
			if (b.payload.operation === "apply") {
				if (!exact(b.payload, [
					"operation",
					"recordId",
					"expectedRecordVersion"
				])) throw new GovernedDecisionError(422, "Only the exact saved operation may be applied; reserved or substituted commands are refused.");
				const proposal = data.governedDecisions.find((r) => r.id === b.payload.recordId);
				if (!proposal || proposal.type !== "action" || proposal.operation?.kind !== "recommend-action" || proposal.status !== "approved-held" || proposal.version !== b.payload.expectedRecordVersion) throw new GovernedDecisionError(422, "A current separately reviewed action proposal is required.");
				const { MockRepository: StagedRepository } = await import("../platform/mockRepository.js"), { ManufacturingService } = await import("./service.js");
				const staged = new StagedRepository();
				await staged.ready;
				staged.state = structuredClone(repo.state);
				const operationId = "reviewed-action:" + proposal.id + "/v" + proposal.version;
				const applied = await new ManufacturingService(staged).send({
					...q,
					path: "/api/v1/manufacturing/investigations/" + workflow.id + "/commands",
					body: {
						expectedVersion: workflow.version,
						command: proposal.operation
					},
					idempotencyKey: operationId
				}, assertLease);
				if (applied.error || ![200, 201].includes(applied.status)) throw new GovernedDecisionError(applied.status, applied.error?.message || "Canonical action guards refused this proposal.");
				canonicalReceipt = {
					id: applied.data.id,
					version: applied.data.version,
					operationId
				};
				stagedState = staged.state;
			}
			evaluation = { governedDecision: transitionGovernedDecision(data.governedDecisions, b.payload, {
				actor,
				scope: data.scope,
				knownAt: b.knownAt,
				newId: (support?.id || "domain-" + (repo.state.sequence + 1)) + "/decision-" + (data.governedDecisions.length + 1),
				resolveBasis: (id) => basisReference(repo, id, workflow.content.workflow, b.knownAt),
				verificationBasis: {
					endpoint: workflow.content.workflow.plan.endpoint,
					unit: workflow.content.workflow.plan.unit,
					requiredShifts: workflow.content.workflow.plan.requiredShifts,
					planVersion: workflow.content.workflow.plan.version
				},
				canonicalReceipt,
				actionPerformed: workflow.content.workflow.action.status === "performed",
				recurrence: workflowView(workflow.content.workflow).sustain.status === "recurrence",
				affectedContext: workflow.content.workflow.context,
				verificationAccepted: workflow.content.workflow.accepted,
				modelDraft: data.modelDraft,
				sustained: workflowView(workflow.content.workflow).sustain.status === "sustained"
			}) };
		} catch (e) {
			if (e instanceof GovernedDecisionError) return reply(e.status, void 0, e.status === 403 ? "FORBIDDEN" : e.status === 409 ? "CONFLICT" : "INVALID_REQUEST", e.message);
			throw e;
		}
		else if (b.kind === "record-observation") {
			if (!exact(b.payload, ["text", "authorAlias"]) || !text(b.payload.text) || b.payload.authorAlias !== void 0 && !text(b.payload.authorAlias)) return reply(422, void 0, "INVALID_REQUEST");
		} else if (b.kind === "record-pm-review") {
			if (!exact(b.payload, [
				"proposal",
				"basisRecordIds",
				"decision"
			]) || !text(b.payload.proposal) || ![
				"proposed",
				"held",
				"rejected"
			].includes(b.payload.decision) || !Array.isArray(b.payload.basisRecordIds) || b.payload.basisRecordIds.length > 16 || b.payload.basisRecordIds.some((id) => id !== workflow.content.workflow.origin.resultId && !repo.state.resources.some((r) => r.id === id && r.assetIds.every((a) => workflow.assetIds.includes(a))))) return reply(422, void 0, "INVALID_REQUEST");
			try {
				basisReferences = b.payload.basisRecordIds.map((id) => basisReference(repo, id, workflow.content.workflow, b.knownAt));
			} catch (e) {
				return reply(422, void 0, "INVALID_REQUEST", e instanceof Error ? e.message : "Basis unavailable.");
			}
		} else if (b.kind === "record-handover") {
			if (!exact(b.payload, ["text", "receivingRole"]) || !text(b.payload.text) || ![
				"supervisor",
				"maintenance",
				"manager",
				"safety"
			].includes(b.payload.receivingRole)) return reply(422, void 0, "INVALID_REQUEST");
		} else if (b.kind === "record-lesson") {
			if (!exact(b.payload, ["text", "basisRecordIds"]) || !text(b.payload.text) || !Array.isArray(b.payload.basisRecordIds) || b.payload.basisRecordIds.length > 16 || !b.payload.basisRecordIds.length || b.payload.basisRecordIds.some((id) => id !== workflow.content.workflow.origin.resultId && !repo.state.resources.some((r) => r.id === id && r.ownerSessionId === "manufacturing-demo" && r.content.caseId === workflow.content.workflow.caseId && r.createdAt <= data.scope.asOf && r.assetIds.every((a) => workflow.assetIds.includes(a))))) return reply(422, void 0, "INVALID_REQUEST");
			try {
				basisReferences = b.payload.basisRecordIds.map((id) => basisReference(repo, id, workflow.content.workflow, b.knownAt));
			} catch (e) {
				return reply(422, void 0, "INVALID_REQUEST", e instanceof Error ? e.message : "Basis unavailable.");
			}
		} else if (b.kind === "save-scenario") try {
			evaluation = recoveryScenario(workflow.content.workflow.caseId, data.scope.asOf, b.payload);
		} catch (e) {
			return reply(422, void 0, "INVALID_REQUEST", e instanceof Error ? e.message : "Invalid bounded scenario");
		}
		else if (b.kind === "record-portfolio-review") {
			try {
				evaluation = constrainedPortfolio(b.payload);
			} catch (e) {
				return reply(422, void 0, "INVALID_REQUEST", e instanceof Error ? e.message : "Invalid constrained portfolio");
			}
			for (const candidate of b.payload.candidates) {
				const r = repo.state.resources.find((r) => r.id === candidate.investigationId && r.ownerSessionId === "manufacturing-demo" && r.content.domain === "manufacturing-investigation-v2");
				if (!r || !validateWorkflow(r.content.workflow) || !r.assetIds.every((a) => q.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN", "Every portfolio case must be an exact owned and permitted investigation.");
				if (r.version !== candidate.expectedVersion) return reply(409, void 0, "CONFLICT", "A portfolio case version changed; retain assumptions and refresh.");
				if (r.content.workflow.asOf > data.scope.asOf || workflowView(r.content.workflow).eligibility.status !== "ready" || dependencyView(repo.state.resources, r.content.workflow.caseId, data.scope.asOf).current.sourceVersion !== 0) return reply(422, void 0, "INVALID_REQUEST", "A portfolio source is future, unavailable or revised. No cached priority substituted.");
			}
		} else return reply(422, void 0, "UNSUPPORTED", "This decision type has no implemented canonical action.");
		const next = structuredClone(stagedState || repo.state), id = support?.id || "domain-" + ++next.sequence, entry = {
			id: id + "/entry-" + (data.entries.length + 1),
			kind: b.kind,
			...basisReferences ? { basisReferences } : {},
			...evaluation ? { evaluation } : {},
			scope: structuredClone(data.scope),
			knownAt: b.knownAt,
			actor,
			reason: b.reason,
			payload: structuredClone(b.payload),
			classification: classification(b.kind),
			causalStatus: "unconfirmed",
			financiallyValidated: false,
			productionReleased: false,
			notDispatched: true
		};
		const current = {
			...data,
			version: data.version + 1,
			entries: [...data.entries, entry],
			governedDecisions: governedDecisionsFromEntries([...data.entries, entry]),
			basisQualifications: basisQualifications(repo, [...data.entries, entry])
		}, response = {
			receipt: {
				id: entry.id,
				version: current.version,
				synthetic: true,
				notDispatched: true
			},
			projection: current
		};
		const record = {
			id,
			kind: "domain",
			version: current.version,
			content: {
				domain: decisionSupportDomain,
				investigationId: workflow.id,
				entries: current.entries
			},
			createdAt: support?.createdAt || b.knownAt,
			updatedAt: b.knownAt,
			ownerSessionId: "manufacturing-demo",
			assetIds: [...workflow.assetIds],
			synthetic: true,
			notGranted: true,
			notDispatched: true
		};
		const index = next.resources.findIndex((r) => r.id === id);
		if (index < 0) next.resources.push(record);
		else next.resources[index] = record;
		if (stagedState) {
			const staged = new (await (import("../platform/mockRepository.js"))).MockRepository();
			await staged.ready;
			staged.state = next;
			response.projection = projection(staged, conversation.id, q.session.allowedAssetIds).data;
		}
		next.idempotency[slot] = {
			fingerprint,
			result: {
				...record,
				content: {
					...record.content,
					response
				}
			}
		};
		assertLease?.();
		await repo.commit(next);
		return reply(200, response);
	} catch (e) {
		return reply(e instanceof PersistenceFailure ? 503 : e instanceof Error && e.message === "NOT_FOUND" ? 404 : 422, void 0, e instanceof PersistenceFailure ? "STORAGE_UNAVAILABLE" : e instanceof Error && e.message === "NOT_FOUND" ? "NOT_FOUND" : "INVALID_RESULT", e instanceof Error ? e.message : "Decision records require recovery.");
	}
}
//#endregion
export { decisionSupportDomain, decisionSupportRequest };
