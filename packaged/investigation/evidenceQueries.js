import { API_VERSION } from "../platform/contract.js";
import { validateWorkflow, workflowView } from "./workflow.js";
import { cases, fixtureVersion, qualification } from "../inputs/evidence-batch-synthetic-v1.js";
//#region app/src/investigation/evidenceQueries.ts
const evidenceQueryDomain = "manufacturing-evidence-query-v1";
const exactTime = (x) => typeof x === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().replace(".000Z", "Z") === x;
function evidenceSnapshot(w, from, to, sourceScenario) {
	const f = cases[w.caseId];
	if (!validateWorkflow(w) || workflowView(w).eligibility.status !== "ready" || w.cycle !== 1 || !exactTime(from) || !exactTime(to) || from > to || from < f.coverageFrom || to > f.coverageTo || !["complete", "partial-source"].includes(sourceScenario)) throw Error("Exact eligible current-cycle authored batch/window required; missing/stale/foreign source is not zero.");
	const sourceVersion = w.asOf >= "2026-10-06T15:15:00Z" ? 2 : 1, sourceCutoff = sourceVersion === 2 ? "2026-10-06T15:15:00Z" : "2026-10-06T14:00:00Z", all = [...f.records, ...sourceVersion === 2 ? [f.lateRecord] : []], records = (sourceScenario === "partial-source" ? all.filter((r, i) => i < 200 || i === 240) : all).filter((r) => r.eventTime >= from && r.eventTime <= to && r.knownAt <= sourceCutoff && r.knownAt <= w.asOf).map((r) => ({
		...r,
		contextRef: structuredClone(w.context)
	})), sourceCompleteness = sourceScenario === "partial-source" ? "partial" : "complete", numerator = Math.round(records.reduce((n, r) => n + r.value, 0) * 1e10) / 1e10, availability = sourceCompleteness === "partial" ? "partial_coverage" : records.length ? "observed" : "no_data";
	return {
		schemaVersion: 1,
		fixtureVersion,
		synthetic: true,
		certified: false,
		causalStatus: "unconfirmed",
		financiallyValidated: false,
		notDispatched: true,
		notGranted: true,
		caseId: w.caseId,
		cycleId: w.cycle,
		contextRef: structuredClone(w.context),
		asOf: w.asOf,
		sourceCutoff,
		sourceVersion,
		sourceScenario,
		from,
		to,
		unit: f.unit,
		sourceCompleteness,
		matched: records.length,
		expectedSourceRows: all.length,
		records,
		aggregate: {
			kind: "descriptive auxiliary sample mean",
			value: availability === "observed" ? numerator / records.length : null,
			numerator: availability === "observed" ? numerator : null,
			denominator: availability === "observed" ? records.length : null,
			unit: f.unit,
			availability,
			fullAdmittedSource: true,
			notPrimaryMetric: true
		},
		snapshotKey: JSON.stringify({
			fixtureVersion,
			caseId: w.caseId,
			cycle: w.cycle,
			context: w.context,
			asOf: w.asOf,
			sourceVersion,
			sourceScenario,
			from,
			to,
			...w.measurementSelection ? { measurementTrust: {
				recordId: w.measurementSelection.recordId,
				sourceVersion: w.measurementSelection.sourceVersion,
				cycleId: w.measurementSelection.cycleId,
				knownAt: w.measurementSelection.knownAt
			} } : {},
			...w.healthSelection ? { integrationHealth: {
				snapshotId: w.healthSelection.snapshotId,
				sourceVersion: w.healthSelection.sourceVersion,
				cycleId: w.healthSelection.cycleId,
				knownAt: w.healthSelection.knownAt
			} } : {}
		}),
		qualification: qualification + " Same-sensor repeated samples are not independent cause witnesses. Complete-source arithmetic uses the full admitted snapshot, never the displayed page."
	};
}
function validEvidenceQuery(value) {
	try {
		const q = value, c = q.content;
		if (q.kind !== "answer" || q.ownerSessionId !== "manufacturing-demo" || c.domain !== "manufacturing-evidence-query-v1" || c.schemaVersion !== 1 || typeof c.investigationId !== "string" || !Number.isSafeInteger(c.investigationVersion) || c.investigationVersion < 1 || ![
			"manager",
			"supervisor",
			"maintenance",
			"safety"
		].includes(c.actor) || !Number.isInteger(c.limit) || c.limit < 1 || c.limit > 50 || q.assetIds.length !== 1 || q.assetIds[0] !== c.workflowSnapshot.context.asset) return false;
		return JSON.stringify(c.snapshot) === JSON.stringify(evidenceSnapshot(c.workflowSnapshot, c.snapshot.from, c.snapshot.to, c.snapshot.sourceScenario));
	} catch {
		return false;
	}
}
async function evidenceRequest(repo, request, actor, assertLease) {
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
	const [path, search = ""] = request.path.split("?"), base = "/api/v1/manufacturing/evidence-queries";
	if (repo.state.resources.some((r) => r.content.domain === "manufacturing-evidence-query-v1" && !validEvidenceQuery(r))) return reply(422, void 0, "INVALID_RESULT", "Stored evidence query needs recovery; no current source substituted.");
	if (path === base && request.method === "GET" && search) {
		const params = new URLSearchParams(search);
		if ([...params.keys()].some((k) => k !== "investigationId") || params.getAll("investigationId").length !== 1 || !params.get("investigationId")) return reply(422, void 0, "INVALID_REQUEST", "Choose one exact investigation for saved-source rediscovery.");
		const id = params.get("investigationId"), record = repo.state.resources.find((r) => r.id === id && r.content.domain === "manufacturing-investigation-v2");
		if (!record) return reply(404, void 0, "NOT_FOUND");
		if (record.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
		const all = repo.state.resources.filter((r) => r.content.domain === "manufacturing-evidence-query-v1" && r.content.investigationId === id && r.assetIds.every((a) => request.session.allowedAssetIds.includes(a))).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || Number(b.id.match(/-(\d+)$/)?.[1]) - Number(a.id.match(/-(\d+)$/)?.[1])), queries = all.slice(0, 100).map((q) => ({
			id: q.id,
			version: q.version,
			investigationId: id,
			asOf: q.content.snapshot.asOf,
			caseId: q.content.workflowSnapshot.caseId,
			contextRef: structuredClone(q.content.workflowSnapshot.context),
			sourceVersion: q.content.snapshot.sourceVersion,
			sourceCutoff: q.content.snapshot.sourceCutoff,
			sourceCompleteness: q.content.snapshot.sourceCompleteness,
			matched: q.content.snapshot.matched,
			unit: q.content.snapshot.unit,
			synthetic: true,
			certified: false
		}));
		return reply(200, {
			schemaVersion: 1,
			investigationId: id,
			total: all.length,
			returned: queries.length,
			complete: queries.length === all.length,
			queries,
			synthetic: true
		});
	}
	if (path === base && request.method === "POST") {
		if (actor === "viewer") return reply(403, void 0, "FORBIDDEN");
		const b = request.body;
		if (search || !b || typeof b !== "object" || Array.isArray(b) || Object.keys(b).some((k) => ![
			"investigationId",
			"expectedInvestigationVersion",
			"from",
			"to",
			"limit",
			"sourceScenario"
		].includes(k)) || typeof b.investigationId !== "string" || !Number.isInteger(b.limit) || b.limit < 1 || b.limit > 50 || !request.idempotencyKey || request.idempotencyKey.length > 100) return reply(422, void 0, "INVALID_REQUEST", "Exact bounded query fields and request identity required.");
		const slot = "evidence:" + actor + ":" + request.idempotencyKey, fingerprint = JSON.stringify({
			path,
			body: b
		}), prior = repo.state.idempotency[slot];
		if (prior) {
			if (prior.fingerprint !== fingerprint) return reply(409, void 0, "IDEMPOTENCY_CONFLICT");
			if (!validEvidenceQuery(prior.result) || prior.result.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
			return reply(200, structuredClone(prior.result));
		}
		const r = repo.state.resources.find((r) => r.id === b.investigationId && r.content.domain === "manufacturing-investigation-v2");
		if (!r) return reply(404, void 0, "NOT_FOUND");
		if (r.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
		if (b.expectedInvestigationVersion !== r.version) return reply(409, void 0, "CONFLICT");
		let snapshot;
		try {
			snapshot = evidenceSnapshot(r.content.workflow, b.from, b.to, b.sourceScenario);
		} catch (e) {
			return reply(422, void 0, "INVALID_REQUEST", String(e));
		}
		const next = structuredClone(repo.state), query = {
			id: "answer-" + ++next.sequence,
			kind: "answer",
			version: 1,
			createdAt: r.content.workflow.asOf,
			updatedAt: r.content.workflow.asOf,
			synthetic: true,
			notDispatched: true,
			notGranted: true,
			ownerSessionId: "manufacturing-demo",
			assetIds: [r.content.workflow.context.asset],
			content: {
				domain: evidenceQueryDomain,
				schemaVersion: 1,
				investigationId: r.id,
				investigationVersion: r.version,
				actor,
				workflowSnapshot: structuredClone(r.content.workflow),
				limit: b.limit,
				snapshot
			}
		};
		next.resources.push(query);
		next.idempotency[slot] = {
			fingerprint,
			result: query
		};
		assertLease?.();
		try {
			await repo.commit(next);
		} catch {
			return reply(503, void 0, "STORAGE_UNAVAILABLE", "The original case and query state remain unchanged; preserve the exact request before retry.");
		}
		return reply(201, structuredClone(query));
	}
	const match = path.match(/^\/api\/v1\/manufacturing\/evidence-queries\/([^/]+)(?:\/(page))?$/);
	if (!match || request.method !== "GET") return reply(404, void 0, "UNKNOWN_ENDPOINT");
	const q = repo.state.resources.find((r) => r.id === match[1] && r.content.domain === "manufacturing-evidence-query-v1");
	if (!q) return reply(404, void 0, "NOT_FOUND");
	if (q.assetIds.some((a) => !request.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
	if (!match[2]) return search ? reply(422, void 0, "INVALID_REQUEST") : reply(200, structuredClone(q));
	const params = new URLSearchParams(search);
	if ([...params.keys()].some((k) => !["cursor", "historical"].includes(k) || params.getAll(k).length !== 1) || params.has("historical") && params.get("historical") !== "true") return reply(422, void 0, "INVALID_REQUEST");
	let offset = 0;
	const s = q.content.snapshot, limit = q.content.limit;
	if (params.has("cursor")) try {
		const c = JSON.parse(decodeURIComponent(params.get("cursor")));
		if (Object.keys(c).sort().join(",") !== "limit,offset,queryId,snapshotKey" || c.queryId !== q.id || c.snapshotKey !== s.snapshotKey || c.limit !== limit || !Number.isInteger(c.offset) || c.offset < limit || c.offset % limit || c.offset >= s.matched) throw Error("Wrong snapshot/page");
		offset = c.offset;
	} catch {
		return reply(422, void 0, "INVALID_REQUEST", "Foreign/malformed page cursor; no source or page substituted.");
	}
	const current = repo.state.resources.find((r) => r.id === q.content.investigationId && r.content.domain === "manufacturing-investigation-v2");
	let currentSourceStatus = "changed";
	try {
		if (current && evidenceSnapshot(current.content.workflow, s.from, s.to, s.sourceScenario).snapshotKey === s.snapshotKey) currentSourceStatus = "same";
	} catch {}
	const historical = params.get("historical") === "true", requiresReload = currentSourceStatus === "changed" && !historical, rows = requiresReload ? [] : s.records.slice(offset, offset + limit), nextCursor = !requiresReload && offset + limit < s.matched ? encodeURIComponent(JSON.stringify({
		queryId: q.id,
		snapshotKey: s.snapshotKey,
		limit,
		offset: offset + limit
	})) : null;
	return reply(200, {
		schemaVersion: 1,
		queryId: q.id,
		snapshotKey: s.snapshotKey,
		sourceVersion: s.sourceVersion,
		asOf: s.asOf,
		sourceCutoff: s.sourceCutoff,
		currentSourceStatus,
		historical,
		requiresReload,
		sourceCompleteness: s.sourceCompleteness,
		pageCompleteness: requiresReload ? "unavailable" : nextCursor ? "partial" : "last-page",
		matched: s.matched,
		offset,
		limit,
		returned: rows.length,
		rows: structuredClone(rows),
		nextCursor,
		returnedPageIsFullCohort: false,
		aggregate: requiresReload ? {
			...s.aggregate,
			value: null,
			numerator: null,
			denominator: null,
			availability: "partial_coverage"
		} : structuredClone(s.aggregate),
		qualification: s.qualification + (requiresReload ? " Source/context changed. Explicitly reload to a new query or choose historical read; no pages were mixed." : historical ? " Explicit historical source snapshot; not current." : " Preview page is not the full cohort or a business-completion receipt.")
	});
}
//#endregion
export { evidenceQueryDomain, evidenceRequest, evidenceSnapshot, validEvidenceQuery };
