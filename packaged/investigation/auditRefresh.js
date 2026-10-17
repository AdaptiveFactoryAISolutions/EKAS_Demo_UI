import { API_VERSION } from "../platform/contract.js";
import { PersistenceFailure } from "../platform/mockRepository.js";
import production_jobs_fixture_default from "../inputs/production-jobs-fixture.js";
import { operatingReview } from "./operatingReview.js";
import "./governedRecords.js";
import { dependencyView, validDependencyRecords } from "./dependencies.js";
//#region app/src/investigation/auditRefresh.ts
const auditDomain = "manufacturing-audit-refresh-v63";
const ids = [
	"downtime",
	"speed",
	"quality"
];
function auditView(records, asOf) {
	if (!validDependencyRecords(records)) throw Error("Invalid source/dependency chain; no rank substituted.");
	const original = operatingReview(asOf), views = ids.map((id) => dependencyView(records, id, asOf)), north = views[0], good = north.parent.good;
	north.current.metrics;
	const mappedJobs = production_jobs_fixture_default.jobs.filter((j) => north.parent.sourceVersions.some((s) => s.job === j.job_id)), planned = mappedJobs.reduce((n, j) => n + j.planned_min, 0), total = mappedJobs.reduce((n, j) => n + j.total_units, 0), plan = mappedJobs.reduce((n, j) => n + j.plan_good_units, 0), idealGood = mappedJobs.reduce((n, j) => n + (j.job_id === north.scope.job ? north.current.metrics.good : j.good_units) * j.ideal_cycle_min, 0);
	const mapped = {
		production: 100 * good / plan,
		oee: 100 * idealGood / planned,
		qualityLoss: 100 * (total - good) / total
	};
	const bundle = original.bundle.map((m) => {
		const affected = Object.hasOwn(mapped, m.id), value = affected ? mapped[m.id] : m.value, target = m.target, difference = target === null || value === null ? null : m.deviation.direction === "higher" ? target - value : value - target;
		return {
			...m,
			value,
			sourceVersion: affected ? north.current.sourceVersion : 0,
			sourceVersions: affected ? north.parent.sourceVersions : [],
			deviation: {
				...m.deviation,
				value: difference
			},
			priorityScore: difference === null || target === null || target === 0 ? null : Math.max(0, difference) / Math.abs(target)
		};
	});
	const caseReadiness = original.caseReadiness.map((c) => {
		const d = views.find((v) => v.caseId === c.caseId), actual = c.caseId === "downtime" ? d.parent.good : d.current.metrics.good;
		return {
			...c,
			actual,
			gap: c.target === null ? null : c.target - actual,
			sourceVersion: d.current.sourceVersion,
			sourceId: d.current.sourceId,
			rawReadiness: d.raw.status,
			rawQualification: d.raw.reason
		};
	});
	const gaps = caseReadiness.filter((c) => c.target !== null && c.gap !== null && c.gap > 0).sort((a, b) => b.gap - a.gap || a.caseId.localeCompare(b.caseId)), metricGaps = bundle.filter((m) => m.deviation.value !== null && m.deviation.value > 0 && m.priorityScore !== null).sort((a, b) => b.priorityScore - a.priorityScore || a.id.localeCompare(b.id));
	return {
		...original,
		bundle,
		caseReadiness,
		gaps,
		metricGaps,
		investigationLinks: [...gaps.map((c) => ({
			kind: "case",
			id: c.caseId
		})), ...metricGaps.map((m) => ({
			kind: "metric",
			id: m.id
		}))],
		currentSourceVersions: Object.fromEntries(views.map((v) => [v.caseId, v.current.sourceVersion])),
		links: [...views.map((v) => ({
			relation: "case-goal-gap",
			sourceId: v.current.sourceRowId,
			sourceVersion: v.current.sourceVersion,
			targetId: v.caseId + "-goal-gap",
			scope: v.caseId === "downtime" ? "Northworks plant" : v.scope,
			denominator: v.caseId === "downtime" ? v.parent.target : v.current.target
		})), ...[
			"production",
			"oee",
			"qualityLoss"
		].map((id) => ({
			relation: "plant-metric",
			sourceId: north.current.sourceRowId,
			sourceVersion: north.current.sourceVersion,
			targetId: id,
			scope: "Northworks original reporting context",
			denominator: id === "production" ? plan : id === "oee" ? planned : total
		}))],
		qualification: "Explicit combined refresh uses each independently eligible source version. Separate case scopes are not additive. Current aggregate ranks do not verify raw unit proof, performed work, cause or financial savings. Original and separate comparison cohorts are not changed.",
		synthetic: true,
		causalStatus: "unconfirmed",
		financiallyValidated: false
	};
}
function auditPresentation(x) {
	const v = auditView(x.records, x.asOf);
	return {
		text: "Refreshed combined synthetic audit at " + x.asOf + ". Independently ranked case gaps: " + v.gaps.map((c) => c.scope + " " + c.actual + "/" + c.target + ", gap " + c.gap + " good units, source version" + c.sourceVersion).join("; ") + ". Governed metric priorities: " + v.metricGaps.map((m) => m.name + " deviation " + Number(m.deviation.value).toFixed(3) + " " + m.deviation.unit).join("; ") + ". " + v.qualification,
		evidence: "audit",
		chart: true,
		metric: "oee",
		sourceIds: [.../* @__PURE__ */ new Set([...x.records.map((r) => r.id), ...v.caseReadiness.map((r) => r.sourceId)])],
		qualification: v.qualification,
		visual: {
			kind: "column",
			title: "Independent case goal shortfalls · " + x.asOf,
			unit: "good units",
			categories: v.gaps.map((c) => c.scope),
			values: v.gaps.map((c) => c.gap),
			sourceIds: [.../* @__PURE__ */ new Set([...x.records.map((r) => r.id), ...v.caseReadiness.map((r) => r.sourceId)])]
		}
	};
}
function validAuditCapture(x) {
	try {
		return x?.schemaVersion === 1 && Array.isArray(x.records) && x.records.every((r) => ["manufacturing-governed-record-v1", "manufacturing-source-dependencies-v1"].includes(String(r.content.domain)) && r.createdAt <= x.asOf) && !!auditView(x.records, x.asOf);
	} catch {
		return false;
	}
}
async function auditRequest(repo, q, actor) {
	const reply = (status, data, code, message) => ({
		requestId: q.requestId,
		apiVersion: API_VERSION,
		status,
		synthetic: true,
		...code ? { error: {
			code,
			message: message || code,
			retryable: code === "STORAGE_UNAVAILABLE"
		} } : { data }
	});
	const base = "/api/v1/manufacturing/audit-refresh", route = q.path.match(/^\/api\/v1\/manufacturing\/audit-refresh\/([^/]+)$/);
	if (q.path !== base && (!route || q.method !== "GET")) return reply(404, void 0, "UNKNOWN_ENDPOINT");
	if (![
		"FEED-01",
		"FEED-02",
		"FEED-03",
		"PRESS-S1",
		"FORM-Q1"
	].every((a) => q.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
	try {
		if (q.method === "GET" && route) return reply(200, auditView(repo.state.resources, decodeURIComponent(route[1])));
		if (q.method === "GET") {
			const ledger = repo.state.resources.filter((r) => r.content.domain === auditDomain);
			if (ledger.some((r) => !validAuditCapture(r.content.capture) || JSON.stringify(auditView(r.content.capture.records, r.content.capture.asOf)) !== JSON.stringify(r.content.view))) return reply(422, void 0, "INVALID_RESULT", "Captured audit requires recovery.");
			return reply(200, ledger);
		}
		if (q.method !== "POST" || actor === "viewer" || q.session.role !== "engineer") return reply(403, void 0, "FORBIDDEN");
		const b = q.body, key = q.idempotencyKey;
		if (!b || Object.keys(b).some((k) => ![
			"asOf",
			"sourceVersions",
			"confirmation"
		].includes(k)) || !key || key.length > 100 || b.confirmation !== "CONFIRM_SYNTHETIC_AUDIT_REFRESH") throw Error("Exact combined source-version review and explicit synthetic refresh confirmation required.");
		const fingerprint = JSON.stringify({
			actor,
			path: q.path,
			body: b
		}), slot = "audit:" + actor + ":" + key, prior = repo.state.idempotency[slot];
		if (prior) return prior.fingerprint === fingerprint ? reply(200, prior.result.content.view) : reply(409, void 0, "IDEMPOTENCY_CONFLICT");
		const view = auditView(repo.state.resources, b.asOf);
		if (JSON.stringify(b.sourceVersions) !== JSON.stringify(view.currentSourceVersions)) return reply(409, void 0, "CONFLICT", "Reload all independent source versions before audit refresh.");
		const next = structuredClone(repo.state), capture = {
			schemaVersion: 1,
			asOf: b.asOf,
			records: structuredClone(next.resources.filter((r) => ["manufacturing-governed-record-v1", "manufacturing-source-dependencies-v1"].includes(String(r.content.domain)) && r.createdAt <= b.asOf))
		}, r = {
			id: "audit-" + ++next.sequence,
			kind: "domain",
			version: 1,
			createdAt: b.asOf,
			updatedAt: b.asOf,
			content: {
				domain: auditDomain,
				capture,
				view
			},
			ownerSessionId: "manufacturing-demo",
			assetIds: [
				"FEED-01",
				"FEED-02",
				"FEED-03",
				"PRESS-S1",
				"FORM-Q1"
			],
			synthetic: true,
			notGranted: true,
			notDispatched: true
		};
		next.resources.push(r);
		next.idempotency[slot] = {
			fingerprint,
			result: r
		};
		await repo.commit(next);
		return reply(201, view);
	} catch (e) {
		return reply(e instanceof PersistenceFailure ? 503 : 400, void 0, e instanceof PersistenceFailure ? "STORAGE_UNAVAILABLE" : "INVALID_REQUEST", e instanceof Error ? e.message : "Invalid audit refresh.");
	}
}
function auditClaims(x, turnId) {
	return auditView(x.records, x.asOf).gaps.map((r, i) => ({
		id: turnId + "-audit-claim-" + (i + 1),
		version: 1,
		classificationVersion: "ekas-claim-semantics-v1",
		kind: "DERIVED RESULT",
		text: "Independent scoped synthetic case shortfall, source version" + r.sourceVersion + ". No cause or verified improvement.",
		evidenceIds: x.records.filter((s) => s.content.caseId === r.caseId).map((s) => s.id),
		provenanceIds: [turnId, r.sourceId],
		scope: r.scope,
		asOf: x.asOf,
		quantity: {
			kind: "independent_case_goal_gap",
			value: r.gap,
			unit: "good units"
		},
		causalStatus: "unconfirmed",
		confidence: null,
		synthetic: true,
		financiallyValidated: false
	}));
}
//#endregion
export { auditClaims, auditDomain, auditPresentation, auditRequest, auditView, validAuditCapture };
