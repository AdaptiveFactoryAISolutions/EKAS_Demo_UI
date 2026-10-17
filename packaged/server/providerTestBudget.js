import { createProviderBudget } from "./providerBudget.js";
import { createLocalDemoBudget } from "./localDemoBudget.js";
//#region app/src/server/providerTestBudget.ts
const PROVIDER_TEST_AUTHORIZATION = "Patrick-20261017-USD40-provider-test";
const LEGACY_AUTHORIZATION = "Patrick-20261010-USD20-total";
const PROVIDER_TEST_CAP_MICRO_USD = 4e7;
const PROVIDER_TEST_REVIEWED_AT = "2026-10-17";
const PROVIDER_TEST_EXPIRES_AT = "2026-11-16T00:00:00Z";
const PROVIDER_TEST_PRICE_SOURCE = "https://platform.openai.com/docs/models/gpt-6.1-sol";
const CACHE_WRITE_MICRO_USD_PER_MILLION = 25e5;
const OUTPUT_MICRO_USD_PER_MILLION = 1e7;
const INPUT_BOUND = 64096;
const MAX_OUTPUT = 1200;
const PRICE_BREAK_TOKENS = 272e3;
const exact = (x, keys) => !!x && typeof x === "object" && !Array.isArray(x) && Object.keys(x).sort().join(",") === [...keys].sort().join(",");
function isProviderTestRaw(raw) {
	if (!raw) return false;
	try {
		return JSON.parse(raw)?.authorization === PROVIDER_TEST_AUTHORIZATION;
	} catch {
		return false;
	}
}
function assertLoadedUsage(usage) {
	if (!usage || typeof usage !== "object" || Array.isArray(usage)) throw Error("DEMO_PRICE_REVIEW_REQUIRED");
	if (!Number.isSafeInteger(usage.input_tokens) || usage.input_tokens < 0 || usage.input_tokens > PRICE_BREAK_TOKENS) throw Error("DEMO_PRICE_REVIEW_REQUIRED");
	const tier = usage.service_tier ?? usage.serviceTier;
	if (tier !== void 0 && tier !== "default" && tier !== "standard") throw Error("DEMO_PRICE_REVIEW_REQUIRED");
	for (const key of [
		"batch",
		"flex",
		"fast",
		"ultrafast",
		"regional",
		"region",
		"speed"
	]) if (usage[key] !== void 0) throw Error("DEMO_PRICE_REVIEW_REQUIRED");
	const details = usage.input_tokens_details;
	if (details !== void 0) {
		if (!details || typeof details !== "object" || Array.isArray(details)) throw Error("DEMO_PRICE_REVIEW_REQUIRED");
		for (const key of Object.keys(details)) if (key !== "cached_tokens" && key !== "cache_write_tokens") throw Error("DEMO_PRICE_REVIEW_REQUIRED");
	}
}
function legacyAudit(raw, now) {
	if (raw === null) return null;
	if (typeof raw !== "string") throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	}
	if (parsed?.authorization === "Patrick-20261017-USD40-provider-test") throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	if (parsed?.authorization !== "Patrick-20261010-USD20-total") throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	const status = createLocalDemoBudget({
		originalRaw: raw,
		store: {
			read: () => null,
			write() {
				throw Error("LEGACY_AUDIT_READONLY");
			}
		},
		now,
		nextId: () => {
			throw Error("LEGACY_AUDIT_READONLY");
		}
	}).status();
	if (!status.available) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	return {
		authorizationId: LEGACY_AUTHORIZATION,
		ceilingMicroUsd: status.ceilingMicroUsd,
		unresolvedMicroUsd: status.unknownMicroUsd,
		reservedMicroUsd: status.usableMicroUsd - status.remainingMicroUsd,
		countedTowardCap: false
	};
}
function createProviderTestBudget({ originalRaw, store, now, nextId }) {
	let certificate;
	try {
		certificate = JSON.parse(originalRaw);
	} catch {
		throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	}
	if (!exact(certificate, [
		"schema",
		"authorization",
		"model",
		"authorizedMicroUsd",
		"usableMicroUsd",
		"priceReviewUntil",
		"reviewedAt",
		"priceSource",
		"halted",
		"entries",
		"legacyAudit"
	]) || certificate.schema !== 2 || certificate.authorization !== "Patrick-20261017-USD40-provider-test" || certificate.model !== "gpt-6.1-sol" || certificate.authorizedMicroUsd !== 4e7 || certificate.usableMicroUsd !== 4e7 || certificate.priceReviewUntil !== "2026-11-16T00:00:00Z" || certificate.reviewedAt !== "2026-10-17" || certificate.priceSource !== "https://platform.openai.com/docs/models/gpt-6.1-sol" || certificate.halted !== false || !exact(certificate.entries, [])) throw Error("ORIGINAL_BUDGET_HISTORY_REQUIRED");
	const legacy = legacyAudit(certificate.legacyAudit, now);
	const policy = {
		version: 1,
		authorizationId: PROVIDER_TEST_AUTHORIZATION,
		model: "gpt-6.1-sol",
		expiresAt: PROVIDER_TEST_EXPIRES_AT,
		totalMicroUsd: PROVIDER_TEST_CAP_MICRO_USD,
		inputContextTokenBound: INPUT_BOUND,
		maxOutputTokens: MAX_OUTPUT,
		inputMicroUsdPerMillion: CACHE_WRITE_MICRO_USD_PER_MILLION,
		outputMicroUsdPerMillion: OUTPUT_MICRO_USD_PER_MILLION
	};
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
	const budget = createProviderBudget({
		policy,
		store: {
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
		},
		now,
		nextId
	});
	const base = {
		available: true,
		synthetic: false,
		ceilingMicroUsd: PROVIDER_TEST_CAP_MICRO_USD,
		usableMicroUsd: PROVIDER_TEST_CAP_MICRO_USD,
		confirmedSpendMicroUsd: null
	};
	return {
		status() {
			const summary = budget.summary();
			const current = wrapped?.current?.entries || [];
			return {
				...base,
				remainingMicroUsd: summary.remainingMicroUsd,
				inFlightMicroUsd: current.filter((entry) => entry.phase === "in_flight").reduce((sum, entry) => sum + entry.reservationMicroUsd, 0),
				unknownMicroUsd: current.filter((entry) => entry.phase === "unknown").reduce((sum, entry) => sum + entry.reservationMicroUsd, 0),
				halted: summary.halted,
				...legacy ? { legacyAudit: legacy } : {}
			};
		},
		reserve(input) {
			return budget.reserve(input);
		},
		beforeRequest(id) {
			budget.beforeRequest(id);
		},
		recordUsage(id, usage) {
			const existing = (wrapped?.current?.entries || []).find((entry) => entry.id === id);
			if (existing?.phase === "accounted" && JSON.stringify(existing.usage) === JSON.stringify(usage)) return;
			try {
				assertLoadedUsage(usage);
			} catch (error) {
				if (existing && existing.phase !== "accounted") budget.markUnknown(id);
				throw error;
			}
			budget.recordUsage(id, usage);
		},
		markUnknown(id) {
			budget.markUnknown(id);
		}
	};
}
//#endregion
export { CACHE_WRITE_MICRO_USD_PER_MILLION, LEGACY_AUTHORIZATION, OUTPUT_MICRO_USD_PER_MILLION, PROVIDER_TEST_AUTHORIZATION, PROVIDER_TEST_CAP_MICRO_USD, PROVIDER_TEST_EXPIRES_AT, PROVIDER_TEST_PRICE_SOURCE, PROVIDER_TEST_REVIEWED_AT, createProviderTestBudget, isProviderTestRaw };
