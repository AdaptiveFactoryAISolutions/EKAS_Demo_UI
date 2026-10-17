import { API_VERSION } from "../platform/contract.js";
import { validateWorkflow } from "./workflow.js";
import { validEvidenceQuery } from "./evidenceQueries.js";
import { validConversationResult, validSavedDiagnosticTurn } from "./service.js";
//#region app/src/investigation/evidenceCaptures.ts
const evidenceCaptureDomain = "manufacturing-evidence-capture-v1";
function sourceProjection(origin, source) {
	if (origin.kind === "query") {
		if (source.id !== origin.queryId || !validEvidenceQuery(source)) throw Error("Exact valid query snapshot required.");
		return {
			investigationId: source.content.investigationId,
			investigationVersion: source.content.investigationVersion,
			originVersion: source.version,
			knownAt: source.content.snapshot.asOf,
			partial: source.content.snapshot.sourceCompleteness !== "complete",
			querySnapshot: structuredClone(source.content.snapshot),
			workflow: source.content.workflowSnapshot,
			asset: source.assetIds[0]
		};
	}
	if (source.id !== origin.conversationId) throw Error("Exact saved conversation/turn source required.");
	const turn = source.content.domain === "manufacturing-diagnostic-source-v1" ? validSavedDiagnosticTurn(source.content.turn, origin.conversationId) ? source.content.turn : void 0 : validConversationResult(source, origin.conversationId) ? source.content.conversation.turns.find((t) => t.id === origin.turnId) : void 0;
	if (turn?.id !== origin.turnId) throw Error("Exact valid diagnostic turn required.");
	if (!turn?.diagnosticCapture || !turn.workflowSnapshot || turn.answer.evidence !== "events" || !turn.investigationId || !turn.investigationVersion || turn.diagnosticCapture.projection.evidenceEligibility.status !== "ready" || turn.diagnosticCapture.chronology.completeness === "unavailable") throw Error("An eligible original diagnostic turn is required; no current answer was substituted.");
	return {
		investigationId: turn.investigationId,
		investigationVersion: turn.investigationVersion,
		originVersion: turn.investigationVersion,
		knownAt: turn.asOf,
		partial: turn.diagnosticCapture.chronology.sourceCompleteness !== "complete",
		diagnosticCapture: structuredClone(turn.diagnosticCapture),
		workflow: turn.workflowSnapshot,
		asset: turn.workflowSnapshot.context.asset
	};
}
function validEvidenceCapture(value) {
	try {
		const c = value.content;
		if (value.kind !== "answer" || value.ownerSessionId !== "manufacturing-demo" || !/^evidence-capture-\d+$/.test(value.id) || c.domain !== "manufacturing-evidence-capture-v1" || c.schemaVersion !== 1 || typeof c.title !== "string" || c.title !== c.title.trim() || !c.title || c.title.length > 120 || typeof c.reason !== "string" || c.reason.trim().length < 10 || c.reason.length > 1e3 || ![
			"manager",
			"supervisor",
			"maintenance",
			"safety"
		].includes(c.actor) || typeof c.historical !== "boolean" || typeof c.acknowledgePartial !== "boolean" || c.synthetic !== true || c.certified !== false || c.financiallyValidated !== false || c.causalStatus !== "unconfirmed" || c.notDispatched !== true || c.notGranted !== true || Object.keys(c).some((k) => ![
			"domain",
			"schemaVersion",
			"title",
			"reason",
			"actor",
			"origin",
			"originVersion",
			"sourceResourceSnapshot",
			"diagnosticCapture",
			"querySnapshot",
			"knownAt",
			"savedAt",
			"historical",
			"acknowledgePartial",
			"synthetic",
			"certified",
			"financiallyValidated",
			"causalStatus",
			"notDispatched",
			"notGranted"
		].includes(k))) return false;
		const p = sourceProjection(c.origin, c.sourceResourceSnapshot);
		return value.assetIds.length === 1 && value.assetIds[0] === p.asset && c.originVersion === p.originVersion && c.knownAt === p.knownAt && (!p.partial || c.acknowledgePartial) && JSON.stringify(c.diagnosticCapture) === JSON.stringify(p.diagnosticCapture) && JSON.stringify(c.querySnapshot) === JSON.stringify(p.querySnapshot);
	} catch {
		return false;
	}
}
async function evidenceCaptureRequest(repo, request, actor, assertLease) {
	const reply = (status, data, code, message) => {
		assertLease?.();
		return {
			apiVersion: API_VERSION,
			requestId: request.requestId,
			status,
			synthetic: true,
			...code ? { error: {
				code,
				message: message || code,
				retryable: code === "STORAGE_UNAVAILABLE",
				...[
					"INVALID_REQUEST",
					"CONFLICT",
					"FORBIDDEN",
					"NOT_FOUND",
					"UNKNOWN_ENDPOINT",
					"INVALID_RESULT"
				].includes(code) ? { details: {
					commitOutcome: "not_committed",
					qualification: "Authoritative validation/version/scope refusal before requested mutation commit."
				} } : { details: { commitOutcome: "unknown" } }
			} } : { data }
		};
	};
	const base = "/api/v1/manufacturing/evidence-captures";
	if (repo.state.resources.some((r) => r.content.domain === "manufacturing-evidence-capture-v1" && !validEvidenceCapture(r))) return reply(422, void 0, "INVALID_RESULT", "Saved capture needs recovery; no neighboring/current source substituted.");
	const exact = request.path.match(/^\/api\/v1\/manufacturing\/evidence-captures\/([^/?]+)$/);
	if (exact && request.method === "GET") {
		const r = repo.state.resources.find((r) => r.id === exact[1] && r.content.domain === "manufacturing-evidence-capture-v1");
		if (!r) return reply(404, void 0, "NOT_FOUND");
		if (r.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
		return reply(200, structuredClone(r));
	}
	if (request.path === base && request.method === "GET") return reply(200, repo.state.resources.filter((r) => r.content.domain === "manufacturing-evidence-capture-v1" && r.assetIds.every((a) => request.session.allowedAssetIds.includes(a))).map((r) => structuredClone(r)));
	if (request.path !== base || request.method !== "POST") return reply(404, void 0, "UNKNOWN_ENDPOINT");
	if (actor === "viewer") return reply(403, void 0, "FORBIDDEN");
	const b = request.body, o = b?.origin;
	if (!b || typeof b !== "object" || Array.isArray(b) || Object.keys(b).some((k) => ![
		"origin",
		"expectedOriginVersion",
		"title",
		"reason",
		"historical",
		"acknowledgePartial",
		"confirmation"
	].includes(k)) || typeof b.title !== "string" || !b.title.trim() || b.title.trim().length > 120 || typeof b.reason !== "string" || b.reason.trim().length < 10 || b.reason.length > 1e3 || typeof b.historical !== "boolean" || typeof b.acknowledgePartial !== "boolean" || b.confirmation !== "CAPTURE_QUALIFIED_SYNTHETIC_EVIDENCE" || !request.idempotencyKey || request.idempotencyKey.length > 100 || !o || typeof o !== "object" || Array.isArray(o) || !["query", "diagnostic-turn"].includes(o.kind) || Object.keys(o).sort().join(",") !== (o.kind === "query" ? "kind,queryId" : "conversationId,kind,turnId")) return reply(422, void 0, "INVALID_REQUEST", "Explicit bounded typed origin/review fields and confirmation required.");
	const slot = "evidence-capture:" + actor + ":" + request.idempotencyKey, fingerprint = JSON.stringify({
		path: request.path,
		body: b
	}), prior = repo.state.idempotency[slot];
	if (prior) {
		if (prior.fingerprint !== fingerprint) return reply(409, void 0, "IDEMPOTENCY_CONFLICT");
		if (!validEvidenceCapture(prior.result) || prior.result.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
		return reply(200, structuredClone(prior.result));
	}
	let source = repo.state.resources.find((r) => r.id === (o.kind === "query" ? o.queryId : o.conversationId));
	if (!source) return reply(404, void 0, "NOT_FOUND");
	let p;
	try {
		p = sourceProjection(o, source);
	} catch (e) {
		return reply(422, void 0, "INVALID_REQUEST", String(e));
	}
	if (!request.session.allowedAssetIds.includes(p.asset)) return reply(403, void 0, "FORBIDDEN");
	if (o.kind === "diagnostic-turn") {
		const turn = source.content.conversation.turns.find((t) => t.id === o.turnId);
		source = {
			...source,
			assetIds: [p.asset],
			content: {
				domain: "manufacturing-diagnostic-source-v1",
				schemaVersion: 1,
				turn: {
					...structuredClone(turn),
					providerInterpretationCapture: void 0,
					modelCapture: void 0
				}
			}
		};
	}
	if (b.expectedOriginVersion !== p.originVersion) return reply(409, void 0, "CONFLICT");
	if (p.partial && !b.acknowledgePartial) return reply(422, void 0, "INVALID_REQUEST", "Acknowledge partial/unknown source; aggregate stays unavailable, not zero or certified.");
	const current = repo.state.resources.find((r) => r.id === p.investigationId && r.content.domain === "manufacturing-investigation-v2");
	if (!current || !validateWorkflow(current.content.workflow)) return reply(422, void 0, "INVALID_RESULT");
	if (!b.historical && (current.version !== p.investigationVersion || JSON.stringify(current.content.workflow) !== JSON.stringify(p.workflow))) return reply(409, void 0, "CONFLICT", "Current case/source changed. Explicit historical capture or a new current query/answer is required.");
	const next = structuredClone(repo.state), saved = {
		id: "evidence-capture-" + ++next.sequence,
		kind: "answer",
		version: 1,
		ownerSessionId: "manufacturing-demo",
		assetIds: [p.asset],
		createdAt: current.content.workflow.asOf,
		updatedAt: current.content.workflow.asOf,
		synthetic: true,
		notDispatched: true,
		notGranted: true,
		content: {
			domain: evidenceCaptureDomain,
			schemaVersion: 1,
			title: b.title.trim(),
			reason: b.reason.trim(),
			actor,
			origin: structuredClone(o),
			originVersion: p.originVersion,
			sourceResourceSnapshot: structuredClone(source),
			...p.diagnosticCapture ? { diagnosticCapture: p.diagnosticCapture } : {},
			...p.querySnapshot ? { querySnapshot: p.querySnapshot } : {},
			knownAt: p.knownAt,
			savedAt: current.content.workflow.asOf,
			historical: b.historical,
			acknowledgePartial: b.acknowledgePartial,
			synthetic: true,
			certified: false,
			financiallyValidated: false,
			causalStatus: "unconfirmed",
			notDispatched: true,
			notGranted: true
		}
	};
	if (!validEvidenceCapture(saved)) return reply(422, void 0, "INVALID_RESULT");
	next.resources.push(saved);
	next.idempotency[slot] = {
		fingerprint,
		result: saved
	};
	assertLease?.();
	try {
		await repo.commit(next);
	} catch {
		return reply(503, void 0, "STORAGE_UNAVAILABLE", "Capture save failed; original case/query/history unchanged. Retain original request identity before retry.");
	}
	return reply(201, structuredClone(saved));
}
//#endregion
export { evidenceCaptureDomain, evidenceCaptureRequest, validEvidenceCapture };
