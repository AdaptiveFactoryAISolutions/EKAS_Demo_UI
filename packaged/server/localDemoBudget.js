import { unresolvedReservation, validConservativeDisposition } from "./conservativeDisposition.js";
import { localBudgetHistoryDigest } from "./localBudgetHistoryDigest.js";
import { createProviderBudget } from "./providerBudget.js";
import { createProviderTestBudget, isProviderTestRaw } from "./providerTestBudget.js";
//#region app/src/server/localDemoBudget.ts
const integer = (x, min = 0) => Number.isSafeInteger(x) && Number(x) >= min;
const exact = (x, keys) => !!x && typeof x === "object" && !Array.isArray(x) && Object.keys(x).sort().join(",") === [...keys].sort().join(",");
const oldReservation = (output) => Math.ceil((5775e4 + output * 165) / 10 / 1e4) * 1e4;
function mergeCurrent(h, s) {
	const p = s?.policy;
	if (!exact(s, [
		"version",
		"policy",
		"halted",
		"entries"
	]) || s.version !== 1 || !exact(p, [
		"version",
		"authorizationId",
		"model",
		"expiresAt",
		"totalMicroUsd",
		"inputContextTokenBound",
		"maxOutputTokens",
		"inputMicroUsdPerMillion",
		"outputMicroUsdPerMillion"
	]) || p.version !== 1 || p.authorizationId !== "Patrick-20261010-USD20-total" || p.model !== "gpt-6.1-sol" || p.totalMicroUsd !== 18e6 - h.reserved || !Number.isFinite(Date.parse(p.expiresAt)) || !integer(p.inputContextTokenBound, 1) || p.inputContextTokenBound > 105e4 || !integer(p.maxOutputTokens, 1) || p.maxOutputTokens > 1200 || !integer(p.inputMicroUsdPerMillion, 1) || !integer(p.outputMicroUsdPerMillion, 1) || typeof s.halted !== "boolean" || !Array.isArray(s.entries) || s.entries.length > 1e4) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	const ids = new Set(h.entries.map((e) => e.id));
	let reserved = h.reserved;
	for (const e of s.entries) {
		const amount = Math.ceil((p.inputContextTokenBound * p.inputMicroUsdPerMillion + e?.maxOutputTokens * p.outputMicroUsdPerMillion) / 1e6);
		if (!(exact(e, [
			"id",
			"maxOutputTokens",
			"reservationMicroUsd",
			"phase",
			"usage"
		]) || exact(e, [
			"id",
			"maxOutputTokens",
			"reservationMicroUsd",
			"phase",
			"usage",
			"reviewDisposition"
		]) && validConservativeDisposition(e)) || typeof e.id !== "string" || !e.id || ids.has(e.id) || !integer(e.maxOutputTokens, 1) || e.maxOutputTokens > p.maxOutputTokens || !integer(amount, 1) || e.reservationMicroUsd !== amount || ![
			"reserved",
			"in_flight",
			"accounted",
			"unknown"
		].includes(e.phase)) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		if (e.phase === "accounted") {
			if (!e.usage || !integer(e.usage.input_tokens) || e.usage.input_tokens > p.inputContextTokenBound || !integer(e.usage.output_tokens) || e.usage.output_tokens > e.maxOutputTokens) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		} else if (e.usage !== null) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		ids.add(e.id);
		reserved += e.reservationMicroUsd;
	}
	if (!integer(reserved) || reserved > 18e6) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	return {
		entries: [...h.entries, ...s.entries],
		reserved,
		halted: h.halted || s.halted || s.entries.some(unresolvedReservation)
	};
}
function history(raw, depth = 0) {
	if (depth > 3 || raw.length > 2097152) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	const s = JSON.parse(raw);
	if (s.schema === "local-demo-budget-v1") {
		if (!exact(s, [
			"schema",
			"originalRaw",
			"current"
		]) || typeof s.originalRaw !== "string") throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		return mergeCurrent(history(s.originalRaw, depth + 1), s.current);
	}
	if (s.schema === 3) {
		if (!exact(s, [
			"schema",
			"kind",
			"reviewDisposition",
			"legacy",
			"current"
		]) || s.kind !== "EKAS_REVIEWED_BUDGET_CARRY_FORWARD" || !["ACCEPTED_PRESERVED_HISTORY", "UNREVIEWED_PREVIEW"].includes(s.reviewDisposition) || !exact(s.legacy, [
			"sourcePath",
			"originalRaw",
			"originalSha256"
		]) || typeof s.legacy.originalRaw !== "string" || typeof s.legacy.sourcePath !== "string" || !s.legacy.sourcePath.startsWith("/") || localBudgetHistoryDigest(s.legacy.originalRaw) !== s.legacy.originalSha256) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		return mergeCurrent(history(s.legacy.originalRaw, depth + 1), s.current);
	}
	if (!exact(s, [
		"schema",
		"authorization",
		"model",
		"authorizedMicroUsd",
		"usableMicroUsd",
		"priceReviewUntil",
		"halted",
		"entries"
	]) || s.schema !== 2 || s.authorization !== "Patrick-20261010-USD20-total" || s.model !== "gpt-6.1-sol" || s.authorizedMicroUsd !== 2e7 || s.usableMicroUsd !== 18e6 || s.priceReviewUntil !== "2026-10-11T00:00:00Z" || typeof s.halted !== "boolean" || !s.entries || typeof s.entries !== "object" || Array.isArray(s.entries)) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	const entries = Object.entries(s.entries).map(([id, e]) => {
		if (!exact(e, [
			"id",
			"inputBound",
			"maxOutputTokens",
			"reservationMicroUsd",
			"createdAt",
			"phase",
			"usage"
		]) || e.id !== id || !id || e.inputBound !== 105e4 || !integer(e.maxOutputTokens, 1) || e.maxOutputTokens > 1200 || e.reservationMicroUsd !== oldReservation(e.maxOutputTokens) || !Number.isFinite(Date.parse(e.createdAt)) || ![
			"reserved",
			"in_flight",
			"accounted",
			"unknown"
		].includes(e.phase)) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		if (e.phase === "accounted") {
			const u = e.usage;
			if (!u || !integer(u.input_tokens) || u.input_tokens > 105e4 || !integer(u.output_tokens) || u.output_tokens > e.maxOutputTokens) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
			for (const [details, fields, total] of [[
				u.input_tokens_details,
				["cached_tokens", "cache_write_tokens"],
				u.input_tokens
			], [
				u.output_tokens_details,
				["reasoning_tokens"],
				u.output_tokens
			]]) if (details !== void 0 && (!details || typeof details !== "object" || Array.isArray(details) || fields.some((k) => details[k] !== void 0 && (!integer(details[k]) || details[k] > total)) || fields.reduce((n, k) => n + (details[k] || 0), 0) > total)) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		} else if (e.usage !== null) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
		return e;
	});
	const reserved = entries.reduce((n, e) => n + e.reservationMicroUsd, 0);
	if (!integer(reserved) || reserved > 18e6) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	return {
		entries,
		reserved,
		halted: s.halted || entries.some((e) => ["in_flight", "unknown"].includes(e.phase))
	};
}
const blockedStatus = {
	available: false,
	synthetic: false,
	ceilingMicroUsd: 2e7,
	usableMicroUsd: 18e6,
	remainingMicroUsd: 0,
	confirmedSpendMicroUsd: null,
	inFlightMicroUsd: 0,
	unknownMicroUsd: 0,
	halted: true
};
/** Explicitly supplied original history, never a credential/environment/original-file reader.
* No live allowance when history is absent. Full original bytes and reservations survive
* in the local owned journal; no signing sidecar, reset, refund or automatic reconciliation. */
function createLocalDemoBudget({ originalRaw, store, now, nextId }) {
	if (isProviderTestRaw(originalRaw)) return createProviderTestBudget({
		originalRaw,
		store,
		now,
		nextId
	});
	let h;
	try {
		if (!originalRaw || originalRaw.length > 2097152) throw Error();
		h = history(originalRaw);
	} catch {
		return {
			status: () => ({ ...blockedStatus }),
			reserve() {
				throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
			},
			beforeRequest() {
				throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
			},
			recordUsage() {
				throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
			},
			markUnknown() {
				throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
			}
		};
	}
	let wrapped = null;
	const prior = store.read();
	if (prior !== null) {
		try {
			wrapped = JSON.parse(prior);
		} catch {
			throw Error("DEMO_BUDGET_RECOVERY_REQUIRED");
		}
		if (!exact(wrapped, [
			"schema",
			"originalRaw",
			"current"
		]) || wrapped.schema !== "local-demo-budget-v1" || wrapped.originalRaw !== originalRaw) throw Error("ORIGINAL_BUDGET_HISTORY_CHANGED");
	}
	const available = 18e6 - h.reserved;
	if (available === 0) return {
		status: () => ({
			...blockedStatus,
			available: true,
			unknownMicroUsd: h.entries.filter(unresolvedReservation).reduce((n, e) => n + e.reservationMicroUsd, 0)
		}),
		reserve() {
			throw Error("DEMO_BUDGET_EXHAUSTED");
		},
		beforeRequest() {
			throw Error("DEMO_BUDGET_EXHAUSTED");
		},
		recordUsage() {
			throw Error("DEMO_BUDGET_EXHAUSTED");
		},
		markUnknown() {
			throw Error("DEMO_BUDGET_EXHAUSTED");
		}
	};
	const policy = {
		version: 1,
		authorizationId: "Patrick-20261010-USD20-total",
		model: "gpt-6.1-sol",
		expiresAt: "2026-10-16T00:00:00Z",
		totalMicroUsd: available,
		inputContextTokenBound: 64096,
		maxOutputTokens: 1200,
		inputMicroUsdPerMillion: 275e4,
		outputMicroUsdPerMillion: 11e6
	};
	const nested = {
		read: () => wrapped === null ? null : JSON.stringify(wrapped.current),
		write: (raw) => {
			const next = {
				schema: "local-demo-budget-v1",
				originalRaw,
				current: JSON.parse(raw)
			};
			store.write(JSON.stringify(next));
			wrapped = next;
		}
	};
	const ids = new Set(h.entries.map((e) => e.id)), b = createProviderBudget({
		policy,
		store: nested,
		now,
		nextId: () => {
			const id = nextId();
			if (ids.has(id)) throw Error("ORIGINAL_BUDGET_IDENTITY_REUSED");
			return id;
		}
	});
	const eligible = () => {
		if (h.halted) throw Error("DEMO_LEGACY_USAGE_REVIEW_REQUIRED");
	};
	return {
		status() {
			const summary = b.summary(), current = wrapped?.current?.entries || [], oldUnknown = h.entries.filter(unresolvedReservation).reduce((n, e) => n + e.reservationMicroUsd, 0);
			return {
				...blockedStatus,
				available: true,
				remainingMicroUsd: summary.remainingMicroUsd,
				inFlightMicroUsd: current.filter((e) => e.phase === "in_flight").reduce((n, e) => n + e.reservationMicroUsd, 0),
				unknownMicroUsd: oldUnknown + current.filter((e) => e.phase === "unknown" && !validConservativeDisposition(e)).reduce((n, e) => n + e.reservationMicroUsd, 0),
				halted: h.halted || summary.halted,
				...[...h.entries, ...current].some(validConservativeDisposition) ? { retainedUnknownMicroUsd: [...h.entries, ...current].filter(validConservativeDisposition).reduce((n, e) => n + e.reservationMicroUsd, 0) } : {}
			};
		},
		reserve(x) {
			eligible();
			return b.reserve(x);
		},
		beforeRequest(id) {
			eligible();
			b.beforeRequest(id);
		},
		recordUsage: (id, u) => b.recordUsage(id, u),
		markUnknown: (id) => b.markUnknown(id)
	};
}
//#endregion
export { createLocalDemoBudget };
