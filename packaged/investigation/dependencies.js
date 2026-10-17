import { API_VERSION } from "../platform/contract.js";
import { PersistenceFailure } from "../platform/mockRepository.js";
import production_jobs_fixture_default from "../inputs/production-jobs-fixture.js";
import { caseFixtures, checkShift, shiftMetrics } from "./cases.js";
import { ledgers } from "../inputs/current-unit-ledgers-v63.js";
import { validCorrectionChain } from "./governedRecords.js";
//#region app/src/investigation/dependencies.ts
const dependencyDomain = "manufacturing-source-dependencies-v1";
const base = "/api/v1/manufacturing/dependencies";
const utc = (x) => typeof x === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().replace(".000Z", "Z") === x;
const reviewed = (x) => typeof x === "string" && x.trim().length >= 10 && x.length <= 2e3;
const corrections = (resources) => resources.filter((r) => r.content.domain === "manufacturing-governed-record-v1" && r.content.kind === "correct-current-source");
const records = (resources) => resources.filter((r) => r.content.domain === dependencyDomain);
function dependencyView(resources, caseId, asOf, policyVersion = 2) {
	if (!utc(asOf) || !Object.hasOwn(caseFixtures, caseId)) throw Error("Exact case and canonical UTC cutoff required.");
	const f = caseFixtures[caseId], latest = corrections(resources).filter((r) => r.content.caseId === caseId && r.createdAt <= asOf).at(-1), response = latest?.content.response;
	const row = response?.projection.row || f.current, sourceVersion = latest?.version || 0;
	if (row.knownAt > asOf || f.context.to > asOf) throw Error("Current source is not known at this cutoff; no dependent numeric projection substituted.");
	const links = [];
	const link = (relation, sourceId, version, targetId, targetVersion, scope) => links.push({
		id: relation + ":" + sourceId + ":v" + version + ":" + targetId,
		relation,
		sourceId,
		sourceVersion: version,
		targetId,
		targetVersion,
		scope
	});
	link("current-metrics", row.id, sourceVersion, caseId + "-current-projection", sourceVersion, f.context);
	link("contributor", row.id, sourceVersion, caseId + "-current-contributor", sourceVersion, f.context);
	const ledger = policyVersion === 2 ? ledgers.find((l) => l.caseId === caseId && l.sourceRowId === row.id && l.knownAt <= asOf) : void 0;
	if (ledger && (JSON.stringify(ledger.scope) !== JSON.stringify(f.context) || ledger.total !== f.current.total || ledger.good !== f.current.good)) throw Error("Later ledger does not match the exact original source scope/count.");
	const originalUnits = ledger ? ledger.unitDispositionRanges.flatMap((r, i) => Array.from({ length: r.last - r.first + 1 }, (_, n) => ({
		id: row.id + "-unit-" + (r.first + n),
		shiftId: row.id,
		firstPassAccepted: r.firstPassAccepted,
		terminalDisposition: r.disposition,
		defectMode: null,
		source: "current-unit-ledgers-v63.json#/ledgers/" + caseId + "/unitDispositionRanges/" + i
	}))) : (f.units || []).filter((u) => u.shiftId === row.id), patches = records(resources).filter((r) => r.content.caseId === caseId && r.content.kind === "record-raw-reconciliation" && r.content.command.sourceVersion === sourceVersion && r.createdAt <= asOf);
	const changes = /* @__PURE__ */ new Map();
	for (const r of patches) for (const c of r.content.command.unitChanges) changes.set(c.unitId, {
		disposition: c.terminalDisposition,
		recordId: r.id
	});
	const units = originalUnits.map((u) => {
		const c = changes.get(u.id);
		link("unit-membership", u.id, 0, row.id, sourceVersion, {
			...f.context,
			shiftId: row.id
		});
		return {
			...u,
			terminalDisposition: c?.disposition || u.terminalDisposition,
			sourceVersion: c ? sourceVersion : 0,
			changed: !!c,
			reviewRecordId: c?.recordId || null,
			originalDisposition: u.terminalDisposition
		};
	});
	const rawGood = units.filter((u) => u.terminalDisposition !== "scrap").length, firstPassGood = units.some((u) => u.firstPassAccepted === null) ? null : units.filter((u) => u.firstPassAccepted).length, rawComplete = (caseId === "quality" || !!ledger) && units.length === row.total && new Set(units.map((u) => u.id)).size === row.total && rawGood === row.good && firstPassGood === row.firstPassGood;
	const raw = {
		status: rawComplete ? "reconciled" : sourceVersion ? "missing_prerequisite" : "not_supplied",
		reason: rawComplete ? "Exact current unit membership and reviewed terminal dispositions reconcile. First-pass classification is unchanged." : caseId === "quality" || ledger ? "Exact current unit terminal dispositions do not reconcile to corrected good count. Review specific unit IDs; aggregate counts cannot determine which unit changed." : "No complete final-good unit ledger exists for this current source row. Supply exact row-linked unit dispositions; cycle or stop timing cannot establish terminal good counts.",
		sourceRowId: row.id,
		sourceVersion,
		reviewVersion: patches.length,
		total: units.length || null,
		good: rawComplete ? rawGood : null,
		firstPassGood: rawComplete ? firstPassGood : null,
		units
	};
	const target = response?.projection.target || (caseId === "downtime" ? 768 : f.goal.value);
	const contributors = caseId === "downtime" ? production_jobs_fixture_default.jobs.filter((j) => j.end === f.context.to && j.product_id === f.context.part && j.product_revision === f.context.revision).map((j) => ({
		job: j.job_id,
		asset: j.asset_id,
		line: j.line_id,
		part: j.product_id,
		revision: j.product_revision,
		operation: j.operation_id,
		from: j.start,
		to: j.end,
		good: j.job_id === row.jobId ? row.good : j.good_units,
		target: j.plan_good_units,
		gap: j.plan_good_units - (j.job_id === row.jobId ? row.good : j.good_units),
		unit: "good units",
		sourceVersion: j.job_id === row.jobId ? sourceVersion : 0,
		affected: j.job_id === row.jobId && sourceVersion > 0,
		sourceId: "production-jobs-fixture.json#/jobs/" + j.job_id
	})) : [{
		job: f.context.job,
		asset: f.context.asset,
		line: f.context.line,
		part: f.context.part,
		revision: f.context.revision,
		operation: f.context.operation,
		from: f.context.from,
		to: f.context.to,
		good: row.good,
		target,
		gap: target - row.good,
		unit: "good units",
		sourceVersion,
		affected: sourceVersion > 0,
		sourceId: row.source
	}];
	const parent = caseId === "downtime" ? {
		good: contributors.reduce((n, c) => n + c.good, 0),
		target: contributors.reduce((n, c) => n + c.target, 0),
		gap: contributors.reduce((n, c) => n + c.gap, 0),
		unit: "good units",
		sourceVersions: contributors.map((c) => ({
			job: c.job,
			version: c.sourceVersion
		}))
	} : null;
	const cohortRows = f.shifts.filter((s) => f.verification.baselineIds.includes(s.id) || f.verification.postIds.includes(s.id)).map((s) => {
		const affected = s.id === row.id && s.source === f.current.source;
		const projected = affected ? row : s;
		const error = checkShift(projected, f), known = projected.knownAt <= asOf;
		const reason = !known ? "Future row is not known at cutoff." : error || "Original exact cohort member; not dependent on the corrected current row.";
		if (affected) link("verification-membership", row.id, sourceVersion, f.verification.source, f.verification.version, {
			shiftId: s.id,
			period: s.period,
			date: s.date,
			asset: s.assetId,
			job: s.jobId,
			part: s.part,
			revision: s.revision,
			operation: s.operation
		});
		return {
			id: s.id,
			period: s.period,
			date: s.date,
			asset: s.assetId,
			job: s.jobId,
			part: s.part,
			revision: s.revision,
			operation: s.operation,
			sourceId: s.source,
			sourceVersion: affected ? sourceVersion : 0,
			affected,
			eligible: known && !error,
			reason,
			metrics: known && !error ? shiftMetrics([projected]) : null
		};
	});
	const before = f.shifts.filter((s) => cohortRows.some((r) => r.id === s.id && r.period === "baseline" && r.eligible)), after = f.shifts.filter((s) => cohortRows.some((r) => r.id === s.id && r.period === "post" && r.eligible));
	const membership = links.some((l) => l.relation === "verification-membership");
	const verification = {
		status: "missing_prerequisite",
		accepted: false,
		recorded: false,
		sourceVersion,
		planVersion: f.verification.version,
		affectedMembership: membership,
		reason: !membership ? "The corrected current source row is not a member of the fixed baseline/post verification cohorts. Supply an explicitly linked comparison source correction and matching raw proof before new verification; job identity alone is insufficient." : !rawComplete ? raw.reason : "New compatible work proof, guardrails, safety review and explicit acceptance are required; prior verification is not reused.",
		priorAcceptanceReused: false,
		causalStatus: "unconfirmed",
		financiallyValidated: false
	};
	return {
		schemaVersion: 1,
		caseId,
		asOf,
		scope: structuredClone(f.context),
		current: {
			sourceRowId: row.id,
			sourceVersion,
			sourceId: row.source,
			knownAt: row.knownAt,
			eligible: row.knownAt <= asOf && f.context.to <= asOf,
			metrics: row.knownAt <= asOf && f.context.to <= asOf ? shiftMetrics([row]) : null,
			target,
			gap: target - row.good
		},
		raw,
		contributors,
		parent,
		links,
		cohorts: {
			planVersion: f.verification.version,
			source: f.verification.source,
			rows: cohortRows,
			baselineCount: before.length,
			postCount: after.length,
			beforeMetrics: shiftMetrics(before),
			afterMetrics: shiftMetrics(after),
			qualification: "Exact source IDs and dated shift membership govern dependencies. Shared job IDs do not propagate a current-row correction into other dates. Unaffected cohort metrics are original source version0, not new verification."
		},
		verification,
		historyPolicy: "Immutable dependency capture; later source corrections or reviews cannot rewrite it.",
		synthetic: true,
		notDispatched: true,
		notGranted: true
	};
}
function rawCommand(resources, b) {
	const f = caseFixtures[b.caseId];
	if (!f || f.caseId !== "quality" && b.dependencyPolicyVersion !== 2) throw Error("Exact current quality unit records are required; no final-good unit ledger supplied for this case.");
	if (Object.keys(b).some((k) => ![
		"kind",
		"caseId",
		"sourceVersion",
		"expectedVersion",
		"knownAt",
		"reviewer",
		"reason",
		"unitChanges",
		"confirmation",
		"dependencyPolicyVersion"
	].includes(k)) || !utc(b.knownAt) || !reviewed(b.reviewer) || !reviewed(b.reason) || b.confirmation !== "CONFIRM_EXACT_RAW_RECONCILIATION") throw Error("Exact reviewed raw contract, canonical UTC time, human reviewer, reason and explicit confirmation required.");
	const latest = corrections(resources).filter((r) => r.content.caseId === b.caseId).at(-1);
	if (!latest || b.sourceVersion !== latest.version || b.knownAt < latest.createdAt) throw Error("Raw review requires the latest exact source version and time at or after correction.");
	const same = records(resources).filter((r) => r.content.kind === b.kind && r.content.caseId === b.caseId && r.content.command.sourceVersion === b.sourceVersion);
	if (b.expectedVersion !== same.length) throw Error("Raw review version changed; reload the exact source.");
	if (!Array.isArray(b.unitChanges) || !b.unitChanges.length || b.unitChanges.length > f.current.total || new Set(b.unitChanges.map((u) => u.unitId)).size !== b.unitChanges.length) throw Error("Unique specific current unit changes are required.");
	if (b.dependencyPolicyVersion !== void 0 && b.dependencyPolicyVersion !== 2) throw Error("Unsupported dependency policy version.");
	const current = dependencyView(resources, b.caseId, b.knownAt, b.dependencyPolicyVersion === 2 ? 2 : 1);
	if (same.at(-1) && b.knownAt < same.at(-1).createdAt) throw Error("Raw review time cannot precede its previous version.");
	for (const c of b.unitChanges) {
		const u = current.raw.units.find((u) => u.id === c.unitId);
		if (!c || Object.keys(c).some((k) => ![
			"unitId",
			"previousDisposition",
			"terminalDisposition"
		].includes(k)) || !u || u.firstPassAccepted || u.terminalDisposition !== c.previousDisposition || !(u.firstPassAccepted === null ? ["scrap", "accepted_terminal"] : ["scrap", "accepted_rework"]).includes(c.terminalDisposition) || c.terminalDisposition === c.previousDisposition) throw Error("Only an exact current non-first-pass unit with matching previous disposition can change. Unrelated periods and first-pass classification cannot be inferred.");
	}
}
function calculate(resources, b, id) {
	if (!b || !Object.hasOwn(caseFixtures, b.caseId)) throw Error("Exact case required.");
	if (b.kind === "record-raw-reconciliation") {
		rawCommand(resources, b);
		const proposed = {
			id,
			kind: "domain",
			version: b.expectedVersion + 1,
			content: {
				domain: dependencyDomain,
				kind: b.kind,
				caseId: b.caseId,
				command: b
			},
			createdAt: b.knownAt,
			updatedAt: b.knownAt,
			synthetic: true,
			notDispatched: true,
			notGranted: true,
			ownerSessionId: "manufacturing-demo",
			assetIds: [caseFixtures[b.caseId].context.asset]
		};
		const v = dependencyView([...resources, proposed], b.caseId, b.knownAt, b.dependencyPolicyVersion === 2 ? 2 : 1);
		if (v.raw.status !== "reconciled") throw Error("Reviewed unit changes must reconcile exactly to this corrected count; no partial or guessed unit proof accepted.");
		return v;
	}
	if (!["refresh-dependencies", "reverify-dependencies"].includes(b.kind) || Object.keys(b).some((k) => ![
		"kind",
		"caseId",
		"sourceVersion",
		"asOf",
		"dependencyPolicyVersion"
	].includes(k)) || !utc(b.asOf)) throw Error("Exact dependency refresh/reverification contract required.");
	if (b.dependencyPolicyVersion !== void 0 && b.dependencyPolicyVersion !== 2) throw Error("Unsupported dependency policy version.");
	const v = dependencyView(resources, b.caseId, b.asOf, b.dependencyPolicyVersion === 2 ? 2 : 1);
	if (!v.current.eligible || v.current.sourceVersion !== b.sourceVersion) throw Error("Source version is unavailable at this cutoff. Refresh the exact eligible version.");
	if (b.kind === "reverify-dependencies") throw Error(v.verification.reason);
	return v;
}
function validDependencyRecords(resources) {
	try {
		if (!validCorrectionChain(corrections(resources))) return false;
		const replay = [];
		for (const r of resources) {
			if (r.content.domain !== "manufacturing-source-dependencies-v1") {
				replay.push(r);
				continue;
			}
			const b = r.content.command;
			if (!b || r.content.caseId !== b.caseId || r.content.kind !== b.kind || r.createdAt !== (b.knownAt || b.asOf) || r.updatedAt !== r.createdAt || ![
				"manager",
				"supervisor",
				"maintenance",
				"safety"
			].includes(String(r.content.actor)) || JSON.stringify(r.assetIds) !== JSON.stringify([caseFixtures[b.caseId]?.context.asset])) return false;
			const expected = calculate(replay, b, r.id);
			if (JSON.stringify(r.content.response) !== JSON.stringify(expected)) return false;
			const version = b.kind === "record-raw-reconciliation" ? b.expectedVersion + 1 : records(replay).filter((x) => x.content.kind === b.kind && x.content.caseId === b.caseId).length + 1;
			if (r.version !== version) return false;
			replay.push(r);
		}
		return true;
	} catch {
		return false;
	}
}
async function dependencyRequest(repo, q, actor) {
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
	const route = q.path.match(/^\/api\/v1\/manufacturing\/dependencies\/(downtime|speed|quality)\/([^/]+)$/);
	if (q.path !== base && (!route || q.method !== "GET")) return reply(404, void 0, "UNKNOWN_ENDPOINT");
	if (!validDependencyRecords(repo.state.resources)) return reply(422, void 0, "INVALID_RESULT", "Saved dependency records require recovery; no original evidence substituted.");
	if (q.method === "GET") {
		if (route) {
			const id = route[1];
			if (!q.session.allowedAssetIds.includes(caseFixtures[id].context.asset)) return reply(403, void 0, "FORBIDDEN");
			try {
				return reply(200, dependencyView(repo.state.resources, id, decodeURIComponent(route[2])));
			} catch (e) {
				return reply(400, void 0, "INVALID_REQUEST", String(e));
			}
		}
		const visible = records(repo.state.resources);
		if (visible.some((r) => !r.assetIds.every((a) => q.session.allowedAssetIds.includes(a)))) return reply(403, void 0, "FORBIDDEN");
		return reply(200, { records: structuredClone(visible) });
	}
	if (q.method !== "POST" || actor === "viewer" || q.session.role !== "engineer") return reply(403, void 0, "FORBIDDEN");
	const b = q.body, key = q.idempotencyKey;
	if (!b || !key || key.length > 100 || !Object.hasOwn(caseFixtures, b.caseId)) return reply(400, void 0, "INVALID_REQUEST");
	if (!q.session.allowedAssetIds.includes(caseFixtures[b.caseId].context.asset)) return reply(403, void 0, "FORBIDDEN");
	const fingerprint = JSON.stringify({
		actor,
		path: q.path,
		body: b
	}), slot = "dependencies:" + actor + ":" + key, prior = repo.state.idempotency[slot];
	if (prior) return prior.fingerprint === fingerprint ? reply(200, structuredClone(prior.result.content.response)) : reply(409, void 0, "IDEMPOTENCY_CONFLICT");
	try {
		const next = structuredClone(repo.state), id = "dependency-" + ++next.sequence, result = calculate(next.resources, b, id), version = b.kind === "record-raw-reconciliation" ? b.expectedVersion + 1 : records(next.resources).filter((r) => r.content.caseId === b.caseId && r.content.kind === b.kind).length + 1, at = b.knownAt || b.asOf;
		const r = {
			id,
			kind: "domain",
			version,
			content: {
				domain: dependencyDomain,
				kind: b.kind,
				caseId: b.caseId,
				actor,
				command: structuredClone(b),
				response: result
			},
			createdAt: at,
			updatedAt: at,
			synthetic: true,
			notDispatched: true,
			notGranted: true,
			ownerSessionId: "manufacturing-demo",
			assetIds: [caseFixtures[b.caseId].context.asset]
		};
		next.resources.push(r);
		next.idempotency[slot] = {
			fingerprint,
			result: r
		};
		await repo.commit(next);
		return reply(201, structuredClone(result));
	} catch (e) {
		return reply(e instanceof PersistenceFailure ? 503 : 400, void 0, e instanceof PersistenceFailure ? "STORAGE_UNAVAILABLE" : "INVALID_REQUEST", e instanceof Error ? e.message : "Invalid dependency record.");
	}
}
//#endregion
export { dependencyDomain, dependencyRequest, dependencyView, validDependencyRecords };
