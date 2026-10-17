import { API_VERSION } from "../platform/contract.js";
import { PersistenceFailure } from "../platform/mockRepository.js";
import { reconcileIntervals } from "./model.js";
import { applicable, caseFixtures, shiftMetrics } from "./cases.js";
import { evaluateVerificationGuardrails } from "./workflow.js";
import "./governedRecords.js";
import { dependencyView, validDependencyRecords } from "./dependencies.js";
import { authorship, context, originPolicy, plan, rows, safety, scenarioId, snapshots, variants, work } from "../inputs/quality-correction-comparison-v63.js";
//#region app/src/investigation/comparison.ts
const comparisonDomain = "manufacturing-comparison-v63";
/** UI receives authored experiment metadata through the application read model. */
function comparisonCatalog() {
	return {
		scenarioId,
		context: structuredClone(context),
		snapshots: [...snapshots],
		workId: work.id,
		safetyId: safety.id,
		target: plan.target,
		synthetic: true
	};
}
/** Read-only procedure projection. Every action is probed through the existing guard on a copy. */
function comparisonGuideReadiness(state, actor) {
	const view = comparisonView(state);
	return [
		{
			label: "Fix separate prospective plan",
			command: {
				kind: "fix-comparison-plan",
				confirmation: "CONFIRM_FICTIONAL_COMPARISON_PLAN"
			},
			completed: !!state.planFixedAt
		},
		{
			label: "Authorize separate fictional work",
			command: {
				kind: "authorize-comparison-work",
				confirmation: "CONFIRM_FICTIONAL_COMPARISON_AUTHORIZATION"
			},
			completed: !!state.authorizedAt
		},
		{
			label: "Record comparison technician proof",
			command: {
				kind: "record-comparison-work",
				workId: work.id
			},
			completed: view.workProof
		},
		{
			label: "Record separate safety proof",
			command: {
				kind: "record-comparison-safety",
				evidenceId: safety.id
			},
			completed: !!state.safetyId
		},
		{
			label: "Measure new comparison result",
			command: { kind: "record-comparison-verification" },
			completed: view.resultStatus === "measured" || view.resultStatus === "accepted"
		},
		{
			label: "Accept fictional measured result",
			command: {
				kind: "accept-comparison-result",
				reason: "Reviewed separate fictional comparison result.",
				confirmation: "CONFIRM_FICTIONAL_COMPARISON_ACCEPTANCE"
			},
			completed: view.resultStatus === "accepted"
		}
	].map((control) => {
		try {
			if (actor === "viewer") throw Error("FORBIDDEN: Viewer has no comparison write authority.");
			execute(state, control.command, actor, "guide-read-only");
			return {
				...control,
				ready: true,
				reason: "Available through the existing explicit review control; this guide performed nothing."
			};
		} catch (error) {
			return {
				...control,
				ready: false,
				reason: error instanceof Error ? error.message : String(error)
			};
		}
	});
}
function comparisonGuideText(state, actor, recoveryTarget = "none") {
	const view = comparisonView(state), next = comparisonGuideReadiness(state, actor).find((step) => !step.completed);
	const authorizationMissing = !state.authorizedAt;
	const recovery = authorizationMissing && state.asOf >= work.performedAt ? " Prior authorization is missing. This record cannot authorize already performed work retrospectively. Keep its history." + (recoveryTarget === "conversation" ? " To review another supplied Q1 prospective simulation, first ask “Return to original investigation.” Then explicitly ask “Open separate quality comparison as of " + snapshots[0] + ".”" : recoveryTarget === "pane" ? " Use “Open another supplied prospective comparison” below to create a separate Q1 simulation from the declared initial snapshot; the blocked record remains saved." : "") : authorizationMissing ? " Prior authorization is missing. Fix the prospective plan, then use the separate fictional authorization control before performed work." : "";
	const proof = state.authorizedAt && !view.workProof && !view.workAvailable ? " Performed proof is not yet known at this snapshot. Choose an explicit later snapshot using the existing simulation control; this guide does not advance time." : "";
	return "Separate comparison guidance at " + state.asOf + " for fictional " + actor + ". " + (next ? "Next prerequisite: " + next.label + ". " + next.reason : "The current comparison result is accepted; its gain remains an observation, with cause and financial savings unconfirmed.") + recovery + proof + " Plan, authorization, technician/operator proof, separate safety review, measurement and explicit acceptance are distinct. Reading help changes none of them.";
}
const utc = (s) => typeof s === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().replace(".000Z", "Z") === s;
const text = (s) => typeof s === "string" && s.trim().length >= 10 && s.length <= 2e3;
function seed(originRecords, sourceVersion, variant, asOf) {
	if (asOf !== snapshots[0] || !Object.hasOwn(variants, variant) || !validDependencyRecords(originRecords)) throw Error("Declared comparison variant and explicit initial November snapshot required.");
	const origin = dependencyView(originRecords, "quality", asOf);
	if (origin.current.sourceVersion !== sourceVersion || origin.current.metrics?.good !== 791 || origin.raw.status !== "reconciled") throw Error("This declared comparison requires the exact reviewed Quality791 current correction and reconciled raw source version; no guessed origin.");
	return {
		schemaVersion: 1,
		scenarioId,
		variant,
		originRecords: structuredClone(originRecords),
		originSourceVersion: sourceVersion,
		asOf,
		planVersion: 1,
		planFixedAt: null,
		authorizedAt: null,
		workId: null,
		safetyId: null,
		patches: [],
		results: [],
		acceptances: [],
		history: []
	};
}
function rowsFor(s) {
	const variant = variants[s.variant];
	return rows.filter((r) => r.period !== "post" || rows.filter((x) => x.period === "post").indexOf(r) < variant.postCount).map((spec) => {
		const changed = "postGood" in variant && spec.period === "post", good = changed ? variant.postGood : spec.good, fp = changed ? variant.postFirstPassGood : spec.firstPassGood, ranges = changed ? [
			{
				first: 1,
				last: fp,
				disposition: "accepted_first_pass",
				firstPassAccepted: true
			},
			{
				first: fp + 1,
				last: good,
				disposition: "accepted_rework",
				firstPassAccepted: false
			},
			{
				first: good + 1,
				last: spec.total,
				disposition: "scrap",
				firstPassAccepted: false
			}
		] : spec.unitDispositionRanges;
		let cursor = 1;
		for (const r of ranges) {
			if (r.first !== cursor || r.last < r.first || ![
				"accepted_first_pass",
				"accepted_rework",
				"scrap"
			].includes(r.disposition) || r.firstPassAccepted !== (r.disposition === "accepted_first_pass")) throw Error("Incomplete or overlapping authored raw ranges.");
			cursor = r.last + 1;
		}
		if (cursor !== spec.total + 1 || ranges.filter((r) => r.disposition !== "scrap").reduce((n, r) => n + r.last - r.first + 1, 0) !== good || ranges.filter((r) => r.firstPassAccepted).reduce((n, r) => n + r.last - r.first + 1, 0) !== fp) throw Error("Authored unique terminal dispositions do not reconcile.");
		const patches = s.patches.filter((p) => p.rowId === spec.id && p.knownAt <= s.asOf), last = patches.at(-1), units = /* @__PURE__ */ new Map();
		for (const p of patches) for (const u of p.unitChanges) units.set(u.unitId, u.terminalDisposition);
		let projectedGood = good;
		for (const [id, to] of units) {
			const ordinal = Number(id.slice((spec.id + "-unit-").length)), original = ranges.find((r) => r.first <= ordinal && ordinal <= r.last);
			projectedGood += (to !== "scrap" ? 1 : 0) - (original.disposition !== "scrap" ? 1 : 0);
		}
		if (last && projectedGood !== last.good) throw Error("Exact raw changes and corrected row count disagree.");
		const row = {
			...spec,
			good: projectedGood,
			firstPassGood: fp,
			knownAt: last?.knownAt || spec.knownAt,
			source: "quality-correction-comparison-v63.json#/rows/" + spec.id + (last ? "; reviewed version" + last.version : ""),
			period: spec.period,
			crew: spec.crew,
			unitIds: []
		};
		const scope = context;
		const compatible = row.assetId === scope.asset && row.jobId === scope.job && row.part === scope.part && row.revision === variant.revision && row.operation === scope.operation && row.coverage >= .95 && row.eligible && row.definitionVersion === "independent-metric-contract-1.0" && row.plannedMin === 480 && row.idealCycleMin === .5 && row.runMin === row.plannedMin - row.downMin && row.runMin >= row.total * .5 && row.good >= row.firstPassGood && row.good <= row.total && reconcileIntervals(row.intervals, [0, row.plannedMin]) === row.downMin;
		return {
			...row,
			sourceVersion: last?.version || 0,
			eligible: compatible && row.knownAt <= s.asOf,
			reason: !compatible ? "Wrong revision or incompatible exposure/raw source." : row.knownAt > s.asOf ? "Future observation; explicit later comparison snapshot required." : "Exact separate comparison member with complete authored/reviewed raw reconciliation.",
			raw: {
				total: row.total,
				good: projectedGood,
				firstPassGood: fp,
				complete: true,
				ranges,
				changes: patches.flatMap((p) => p.unitChanges)
			},
			membership: {
				planVersion: s.planVersion,
				sourceId: row.id,
				sourceVersion: last?.version || 0,
				source: row.source,
				period: row.period,
				date: row.date,
				scope: {
					...context,
					from: row.date + "T06:00:00Z",
					to: row.date + "T14:00:00Z"
				}
			}
		};
	});
}
function comparisonView(s) {
	const rows = rowsFor(s), before = rows.filter((r) => r.period === "baseline" && r.eligible), after = rows.filter((r) => r.period === "post" && r.eligible), b = shiftMetrics(before), p = shiftMetrics(after), complete = before.length >= plan.requiredShifts && after.length >= plan.requiredShifts, bv = before.length >= 10 ? Number(b.fpy.value) : null, pv = after.length >= 10 ? Number(p.fpy.value) : null, guardrails = evaluateVerificationGuardrails({
		...plan,
		direction: plan.direction
	}, {
		qualityLossPct: p.qualityLoss.value === null ? null : Number(p.qualityLoss.value),
		energyPerGood: p.energyPerGood
	}, {
		qualityLossPct: b.qualityLoss.value === null ? null : Number(b.qualityLoss.value),
		energyPerGood: b.energyPerGood
	});
	const standard = caseFixtures.quality.documents.some((d) => d.id === plan.controlledDocumentId && d.version === plan.controlledDocumentVersion && applicable(d, {
		...context,
		revision: variants[s.variant].revision
	}, s.asOf));
	const work$1 = !!s.workId && s.workId === work.id && s.authorizedAt !== null && s.planFixedAt !== null && s.planFixedAt <= s.authorizedAt && s.authorizedAt < work.performedAt && work.knownAt <= s.asOf && variants[s.variant].workAvailable;
	const ready = standard && s.planFixedAt !== null && work$1 && complete && bv !== null && pv !== null && pv > bv && pv >= plan.target && guardrails.quality.status === "pass" && guardrails.energy.status === "pass";
	const fingerprint = JSON.stringify({
		scenarioId: s.scenarioId,
		planVersion: s.planVersion,
		planFixedAt: s.planFixedAt,
		sourceVersions: rows.map((r) => ({
			id: r.id,
			version: r.sourceVersion
		})),
		workId: s.workId,
		originSourceVersion: s.originSourceVersion
	});
	const latest = s.results.at(-1), same = !!latest && latest.fingerprint === fingerprint, accepted = same && s.acceptances.some((a) => a.resultId === latest.id && a.fingerprint === fingerprint);
	const reason = !standard ? "Applicable controlled standard or exact revision missing." : !s.planFixedAt ? "Fix the separate prospective comparison plan first." : !work$1 ? "Separate authorized, later technician/operator performed-work proof required; original work is not reused." : !complete ? "Ten exact eligible baseline and ten post observations required." : !(pv > bv && pv >= 95) ? "Comparison does not demonstrate improvement to its fixed95% FPY target." : !ready ? "Quality or energy guardrail failed or unavailable." : !s.safetyId ? "Separate comparison safety review required before acceptance." : "Own plan, raw source versions, work proof and guardrails eligible; explicit manager acceptance remains separate.";
	return {
		scenarioId: s.scenarioId,
		asOf: s.asOf,
		context: {
			...context,
			revision: variants[s.variant].revision
		},
		authorship,
		originPolicy,
		plan: {
			...plan,
			version: s.planVersion,
			fixedAt: s.planFixedAt
		},
		rows,
		beforeMetrics: b,
		afterMetrics: p,
		before: bv,
		after: pv,
		baselineCount: before.length,
		postCount: after.length,
		guardrails,
		workAvailable: variants[s.variant].workAvailable && work.knownAt <= s.asOf ? work : null,
		safetyAvailable: safety.knownAt <= s.asOf ? safety : null,
		workProof: work$1,
		eligible: ready,
		reason,
		fingerprint,
		activeResult: latest ? {
			...latest,
			accepted: same && accepted
		} : null,
		resultStatus: latest ? !same ? "stale" : accepted ? "accepted" : "measured" : "not_recorded",
		sourceMap: rows.map((r) => r.membership),
		synthetic: true,
		notGranted: true,
		notDispatched: true,
		causalStatus: "unconfirmed",
		financiallyValidated: false
	};
}
function execute(previous, c, actor, key) {
	const fields = {
		"correct-comparison-source": [
			"rowId",
			"expectedRowVersion",
			"previousGood",
			"good",
			"knownAt",
			"reviewer",
			"reason",
			"unitChanges",
			"confirmation"
		],
		"fix-comparison-plan": ["confirmation"],
		"authorize-comparison-work": ["confirmation"],
		"advance-comparison-time": ["asOf"],
		"record-comparison-work": ["workId"],
		"record-comparison-safety": ["evidenceId"],
		"record-comparison-verification": [],
		"accept-comparison-result": ["reason", "confirmation"]
	};
	if (!c || !Object.hasOwn(fields, c.kind) || Object.keys(c).some((k) => k !== "kind" && !fields[c.kind].includes(k))) throw Error("Exact declared comparison command required.");
	const s = structuredClone(previous), v = comparisonView(s), role = (required) => {
		if (actor !== required) throw Error("FORBIDDEN: Separate fictional " + required + " role required.");
	};
	switch (c.kind) {
		case "correct-comparison-source": {
			const r = v.rows.find((r) => r.id === c.rowId);
			if (!r || !r.eligible || c.expectedRowVersion !== r.sourceVersion || c.previousGood !== r.good || !Number.isSafeInteger(c.good) || c.good < r.firstPassGood || c.good > r.total || c.good === r.good || !utc(c.knownAt) || c.knownAt < r.knownAt || c.knownAt > s.asOf || !text(c.reviewer) || !text(c.reason) || c.confirmation !== "CONFIRM_EXACT_COMPARISON_CORRECTION" || !Array.isArray(c.unitChanges) || !c.unitChanges.length || new Set(c.unitChanges.map((u) => u.unitId)).size !== c.unitChanges.length) throw Error("Exact eligible separate row/version/count, reviewed unit changes and explicit confirmation required.");
			const existing = new Map(r.raw.changes.map((u) => [u.unitId, u.terminalDisposition]));
			let good = r.good;
			for (const u of c.unitChanges) {
				const prefix = r.id + "-unit-", ordinal = typeof u.unitId === "string" && u.unitId.startsWith(prefix) ? Number(u.unitId.slice(prefix.length)) : NaN, range = r.raw.ranges.find((x) => x.first <= ordinal && ordinal <= x.last), old = existing.get(u.unitId) || range?.disposition;
				if (Object.keys(u).some((k) => ![
					"unitId",
					"previousDisposition",
					"terminalDisposition"
				].includes(k)) || !range || range.firstPassAccepted || !Number.isSafeInteger(ordinal) || u.unitId !== prefix + ordinal || old !== u.previousDisposition || !["scrap", "accepted_rework"].includes(u.terminalDisposition) || u.terminalDisposition === old) throw Error("Exact non-first-pass unit in this row required; unrelated periods and first-pass inference refused.");
				good += (u.terminalDisposition !== "scrap" ? 1 : 0) - (old !== "scrap" ? 1 : 0);
			}
			if (good !== c.good) throw Error("Specific raw dispositions must reconcile exactly to proposed count.");
			s.patches.push({
				rowId: r.id,
				version: r.sourceVersion + 1,
				good,
				knownAt: c.knownAt,
				reviewer: c.reviewer,
				reason: c.reason,
				unitChanges: structuredClone(c.unitChanges)
			});
			break;
		}
		case "fix-comparison-plan":
			role("manager");
			if (s.planFixedAt || s.asOf !== plan.fixedAt || c.confirmation !== "CONFIRM_FICTIONAL_COMPARISON_PLAN" || v.context.revision !== "Q1") throw Error("Prospective fixed comparison plan at its declared initial snapshot required; no retrospective replacement.");
			s.planFixedAt = s.asOf;
			break;
		case "authorize-comparison-work":
			role("manager");
			if (!s.planFixedAt || s.authorizedAt || s.asOf >= work.performedAt || c.confirmation !== "CONFIRM_FICTIONAL_COMPARISON_AUTHORIZATION") throw Error("Separate explicit fictional authorization after plan fixation and before performed work required.");
			s.authorizedAt = s.asOf;
			break;
		case "advance-comparison-time":
			if (!snapshots.includes(c.asOf) || c.asOf <= s.asOf) throw Error("Choose an explicit declared later comparison snapshot.");
			s.asOf = c.asOf;
			break;
		case "record-comparison-work":
			role("maintenance");
			if (!s.authorizedAt || !v.workAvailable || c.workId !== work.id || s.workId) throw Error("Separate known comparison technician/operator proof and prior authorization required.");
			s.workId = c.workId;
			break;
		case "record-comparison-safety":
			role("safety");
			if (!v.workProof || !v.safetyAvailable || c.evidenceId !== safety.id || safety.workId !== s.workId) throw Error("Separate known same-work comparison safety record required.");
			s.safetyId = c.evidenceId;
			break;
		case "record-comparison-verification":
			if (!v.eligible) throw Error(v.reason);
			s.results.push({
				id: "CMP-Q63-VERIFICATION-" + (s.results.length + 1),
				version: s.results.length + 1,
				recordedAt: s.asOf,
				planVersion: s.planVersion,
				planSource: plan.source,
				originSourceVersion: s.originSourceVersion,
				sourceVersions: structuredClone(v.sourceMap),
				workId: s.workId,
				fingerprint: v.fingerprint,
				before: v.before,
				after: v.after,
				beforeGood: v.beforeMetrics.good,
				afterGood: v.afterMetrics.good,
				outputGain: v.afterMetrics.good - v.beforeMetrics.good,
				guardrails: structuredClone(v.guardrails),
				accepted: false,
				causalStatus: "unconfirmed",
				financiallyValidated: false,
				synthetic: true
			});
			break;
		case "accept-comparison-result":
			role("manager");
			if (!v.eligible || !s.safetyId || v.resultStatus !== "measured" || !v.activeResult || !text(c.reason) || c.confirmation !== "CONFIRM_FICTIONAL_COMPARISON_ACCEPTANCE") throw Error("New measured same-source/plan result, separate safety review and explicit fictional manager acceptance required; stale results cannot verify new sources.");
			s.acceptances.push({
				resultId: v.activeResult.id,
				fingerprint: v.fingerprint,
				at: s.asOf,
				actor,
				reason: c.reason
			});
	}
	s.history.push({
		key,
		actor,
		command: structuredClone(c),
		at: s.asOf
	});
	return s;
}
function validComparison(s) {
	try {
		if (s?.schemaVersion !== 1 || s.scenarioId !== scenarioId || !Array.isArray(s.history) || s.history.length > 200) return false;
		let replay = seed(s.originRecords, s.originSourceVersion, s.variant, snapshots[0]);
		for (const h of s.history) {
			if (![
				"manager",
				"supervisor",
				"maintenance",
				"safety"
			].includes(h.actor)) return false;
			replay = execute(replay, h.command, h.actor, h.key);
			if (h.at !== replay.asOf) return false;
		}
		return JSON.stringify(replay) === JSON.stringify(s);
	} catch {
		return false;
	}
}
async function comparisonRequest(repo, q, actor) {
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
	const match = q.path.match(/^\/api\/v1\/manufacturing\/comparisons(?:\/([^/]+)(?:\/(commands))?)?$/);
	if (!match) return reply(404, void 0, "UNKNOWN_ENDPOINT");
	if (!q.session.allowedAssetIds.includes("FORM-Q1")) return reply(403, void 0, "FORBIDDEN");
	const [, id, operation] = match, r = id ? repo.state.resources.find((r) => r.id === id && r.content.domain === "manufacturing-comparison-v63") : void 0;
	if (id && !r) return reply(404, void 0, "NOT_FOUND");
	if (r && !validComparison(r.content.state)) return reply(422, void 0, "INVALID_RESULT", "Separate comparison requires recovery; originals unchanged.");
	const output = (r) => ({
		id: r.id,
		version: r.version,
		state: structuredClone(r.content.state),
		view: comparisonView(r.content.state)
	});
	if (q.method === "GET" && !operation) {
		const records = repo.state.resources.filter((r) => r.content.domain === comparisonDomain);
		if (records.some((r) => !validComparison(r.content.state))) return reply(422, void 0, "INVALID_RESULT", "Separate comparison ledger requires recovery.");
		return reply(200, r ? output(r) : records.map(output));
	}
	if (q.method !== "POST" || actor === "viewer" || q.session.role !== "engineer") return reply(403, void 0, "FORBIDDEN");
	const b = q.body, key = q.idempotencyKey;
	if (!b || !key || key.length > 100) return reply(400, void 0, "INVALID_REQUEST");
	const fingerprint = JSON.stringify({
		actor,
		path: q.path,
		body: b
	}), slot = "comparison:" + actor + ":" + key, prior = repo.state.idempotency[slot];
	if (prior) return prior.fingerprint === fingerprint ? reply(200, output(prior.result)) : reply(409, void 0, "IDEMPOTENCY_CONFLICT");
	try {
		let state;
		if (!r) {
			if (id || operation || Object.keys(b).some((k) => ![
				"sourceVersion",
				"asOf",
				"variant"
			].includes(k))) throw Error("Exact comparison creation contract required.");
			state = seed(repo.state.resources.filter((r) => (r.content.domain === "manufacturing-governed-record-v1" && r.content.caseId === "quality" || r.content.domain === "manufacturing-source-dependencies-v1" && r.content.caseId === "quality") && r.createdAt <= b.asOf), b.sourceVersion, b.variant || "complete", b.asOf);
		} else {
			if (operation !== "commands" || Object.keys(b).some((k) => !["expectedVersion", "command"].includes(k))) throw Error("Typed comparison command route required.");
			if (b.expectedVersion !== r.version) return reply(409, void 0, "CONFLICT");
			state = execute(r.content.state, b.command, actor, key);
		}
		if (!validComparison(state)) throw Error("Comparison replay failed.");
		const next = structuredClone(repo.state), result = {
			id: r?.id || "comparison-" + ++next.sequence,
			kind: "domain",
			version: (r?.version || 0) + 1,
			createdAt: r?.createdAt || state.asOf,
			updatedAt: state.asOf,
			content: {
				domain: comparisonDomain,
				state
			},
			ownerSessionId: "manufacturing-demo",
			assetIds: ["FORM-Q1"],
			synthetic: true,
			notGranted: true,
			notDispatched: true
		};
		const i = next.resources.findIndex((x) => x.id === result.id);
		if (i < 0) next.resources.push(result);
		else next.resources[i] = result;
		next.idempotency[slot] = {
			fingerprint,
			result: structuredClone(result)
		};
		await repo.commit(next);
		return reply(r ? 200 : 201, output(result));
	} catch (e) {
		return reply(e instanceof PersistenceFailure ? 503 : String(e).includes("FORBIDDEN:") ? 403 : 400, void 0, e instanceof PersistenceFailure ? "STORAGE_UNAVAILABLE" : String(e).includes("FORBIDDEN:") ? "FORBIDDEN" : "INVALID_REQUEST", e instanceof Error ? e.message : "Invalid comparison.");
	}
}
/** Exact authored cursor context for read-only Help; no result is evaluated. */
function comparisonGuideScope(s) {
	return JSON.stringify({
		scenarioId: s.scenarioId,
		context: {
			...context,
			revision: variants[s.variant].revision
		},
		planVersion: s.planVersion,
		originSourceVersion: s.originSourceVersion,
		asOf: s.asOf
	});
}
//#endregion
export { comparisonCatalog, comparisonDomain, comparisonGuideReadiness, comparisonGuideScope, comparisonGuideText, comparisonRequest, comparisonView, validComparison };
