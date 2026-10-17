import { createOpenAIConversationProvider } from "./openAIProvider.js";
//#region app/src/server/localAiRuntime.ts
const DEFAULT = {
	mode: "disabled",
	model: "gpt-6.1-sol",
	maxOutputTokens: 1200,
	inputByteBound: 6e4
};
const expiresAt = "2026-11-16T00:00:00Z";
const safeCodes = /* @__PURE__ */ new Set([
	"CONFIGURATION_CONFLICT",
	"AI_TEST_BUSY",
	"AI_MOCK_TRANSPORT_REQUIRED",
	"AI_TEST_INCOMPLETE",
	"AI_TEST_FAILED",
	"AI_BUDGET_UNAVAILABLE",
	"AI_LIVE_BUDGET_REQUIRED",
	"AI_MOCK_BUDGET_REQUIRED",
	"AI_PRICING_EXPIRED",
	"AI_MODE_UNAVAILABLE",
	"CREDENTIAL_REQUIRED",
	"DEMO_BUDGET_EXHAUSTED",
	"DEMO_BUDGET_HALTED",
	"DEMO_BUDGET_RECOVERY_REQUIRED",
	"DEMO_PRICE_REVIEW_REQUIRED"
]);
const safeFailure = (e) => e instanceof Error && safeCodes.has(e.message) ? e.message : "AI_TEST_FAILED";
/** Explicit local-demo composition: no compulsory signing/root/enterprise machinery.
* Credentials remain server-memory only; original budget authority is independent. */
function createLocalAiRuntime({ credentialStore, budget, mockBudget, fetchImpl, mockFetchImpl, now = Date.now, persistSettings, rehearsalOnly = false }) {
	let settings = { ...DEFAULT }, revision = 0, generation = 0, enabled = false, testInvalidated = true, testBusy = false, currentProvider, tested = null;
	const tests = /* @__PURE__ */ new Map();
	const activeBudget = () => settings.mode === "mock" ? mockBudget || budget : budget;
	const safeBudget = () => {
		const b = activeBudget().status();
		return {
			available: b.available,
			synthetic: b.synthetic,
			ceilingMicroUsd: b.ceilingMicroUsd,
			usableMicroUsd: b.usableMicroUsd,
			remainingMicroUsd: b.remainingMicroUsd,
			confirmedSpendMicroUsd: b.confirmedSpendMicroUsd,
			inFlightMicroUsd: b.inFlightMicroUsd,
			unknownMicroUsd: b.unknownMicroUsd,
			halted: b.halted,
			...b.retainedUnknownMicroUsd === void 0 ? {} : { retainedUnknownMicroUsd: b.retainedUnknownMicroUsd },
			...b.reportedSpendEstimateMicroUsd === void 0 ? {} : { reportedSpendEstimateMicroUsd: b.reportedSpendEstimateMicroUsd },
			...b.legacyAudit === void 0 ? {} : { legacyAudit: b.legacyAudit }
		};
	};
	const currentTest = () => !testInvalidated && !!tested && tested.revision === revision && tested.credentialRevision === credentialStore.status().revision;
	function assertRevision(expected) {
		if (expected !== revision) throw Error("CONFIGURATION_CONFLICT");
	}
	function invalidate() {
		testInvalidated = true;
		enabled = false;
		currentProvider = void 0;
		generation++;
	}
	function readiness() {
		const reasons = [], b = safeBudget();
		if (settings.mode === "disabled") reasons.push("AI is disabled in settings.");
		if (settings.mode === "future-backend") reasons.push("Future backend integration is not selected for this local OpenAI demo.");
		if (!credentialStore.status().configured) reasons.push("Set the write-only server-session credential first.");
		if (settings.mode === "openai" && now() >= Date.parse(expiresAt)) reasons.push("Reviewed pricing has expired; refresh verified pricing before paid use.");
		if (!b.available || b.halted || b.unknownMicroUsd > 0 || b.remainingMicroUsd <= 0) reasons.push("Original cumulative budget is unavailable, exhausted or has unresolved usage.");
		if (settings.mode === "openai" && b.synthetic) reasons.push("A real original cumulative budget history is required for OpenAI calls.");
		if (settings.mode === "mock" && !b.synthetic) reasons.push("Mock rehearsal requires a separate synthetic budget.");
		return reasons;
	}
	function assertReady() {
		if (rehearsalOnly && settings.mode !== "mock") throw Error("AI_REHEARSAL_ONLY");
		const b = safeBudget();
		if (!b.available || b.halted || b.unknownMicroUsd > 0 || b.remainingMicroUsd <= 0) throw Error("AI_BUDGET_UNAVAILABLE");
		if (settings.mode === "openai" && b.synthetic) throw Error("AI_LIVE_BUDGET_REQUIRED");
		if (settings.mode === "mock" && !b.synthetic) throw Error("AI_MOCK_BUDGET_REQUIRED");
		if (settings.mode === "openai" && now() >= Date.parse(expiresAt)) throw Error("AI_PRICING_EXPIRED");
		if (!["openai", "mock"].includes(settings.mode)) throw Error("AI_MODE_UNAVAILABLE");
		if (!credentialStore.status().configured) throw Error("CREDENTIAL_REQUIRED");
	}
	const api = {
		status() {
			return {
				revision,
				generation,
				rehearsalOnly,
				ownerAuthority: rehearsalOnly ? "synthetic-rehearsal-only" : "local-demo-owner",
				settings: { ...settings },
				enabled,
				effectiveMode: enabled ? settings.mode : "disabled",
				credential: credentialStore.status(),
				tested: tested ? {
					...tested,
					current: currentTest()
				} : null,
				budget: safeBudget(),
				readiness: {
					testAllowed: readiness().length === 0,
					enableAllowed: readiness().length === 0 && currentTest(),
					blockedReasons: [...readiness(), ...!currentTest() ? ["Test the current configuration explicitly before Enable AI."] : []]
				},
				limits: {
					models: ["gpt-6.1-sol"],
					maxOutputTokens: 1200,
					maxInputBytes: 6e4,
					providerRounds: 4,
					reasoningEffort: "low",
					endpointEditable: false
				},
				pricing: {
					appliesToLiveRequests: true,
					reviewedAt: "2026-10-17",
					expiresAt,
					source: "https://platform.openai.com/docs/models/gpt-6.1-sol",
					inputMicroUsdPerMillion: 2e6,
					cachedInputMicroUsdPerMillion: 1e5,
					cacheWriteMicroUsdPerMillion: 25e5,
					outputMicroUsdPerMillion: 1e7,
					reservationInputMicroUsdPerMillion: 25e5,
					serviceTier: "default",
					unloadedRefused: [
						"fast",
						"batch",
						"flex",
						"ultrafast",
						"regional",
						"input-above-272k"
					],
					basis: "Official standard text rates retrieved 2026-10-17. Reservation uses the cache-write rate as the loaded input ceiling. Fast, Batch, Flex, Ultrafast, regional, and input above 272K are refused. Cumulative provider-test cap is 40000000 micro-USD."
				},
				projectReview: "Production/project signing infrastructure deferred by user for local demo; no accepted review is fabricated.",
				transport: "Loopback local demo; plain HTTP is not encryption."
			};
		},
		saveSettings(next, expected) {
			assertRevision(expected);
			if (rehearsalOnly && next && ["openai", "future-backend"].includes(next.mode)) throw Error("AI_REHEARSAL_ONLY");
			if (!next || typeof next !== "object" || Array.isArray(next) || Object.keys(next).sort().join(",") !== "inputByteBound,maxOutputTokens,mode,model" || ![
				"disabled",
				"mock",
				"openai",
				"future-backend"
			].includes(next.mode) || next.model !== "gpt-6.1-sol" || !Number.isSafeInteger(next.maxOutputTokens) || next.maxOutputTokens < 64 || next.maxOutputTokens > 1200 || !Number.isSafeInteger(next.inputByteBound) || next.inputByteBound < 8192 || next.inputByteBound > 6e4) throw Error("AI_SETTINGS_REFUSED");
			const value = {
				revision: revision + 1,
				settings: { ...next }
			};
			try {
				persistSettings?.(value);
			} catch {
				throw Error("AI_SETTINGS_SAVE_FAILED");
			}
			settings = value.settings;
			revision = value.revision;
			invalidate();
			return api.status();
		},
		setCredential(raw, expected, keyRevision) {
			assertRevision(expected);
			if ((rehearsalOnly || settings.mode === "mock") && (typeof raw !== "string" || !raw.startsWith("DUMMY_"))) throw Error("CREDENTIAL_MOCK_ONLY");
			credentialStore.replace(raw, keyRevision);
			revision++;
			invalidate();
			return api.status();
		},
		removeCredential(expected, keyRevision, confirmation) {
			assertRevision(expected);
			if (confirmation !== "REMOVE_SERVER_SESSION_KEY") throw Error("CREDENTIAL_CONFIRMATION_REQUIRED");
			credentialStore.remove(keyRevision);
			revision++;
			invalidate();
			return api.status();
		},
		test(request, signal) {
			if (request.acceptPotentialCost !== true) return Promise.reject(Error("COST_CONFIRMATION_REQUIRED"));
			if (typeof request.operationId !== "string" || !request.operationId.trim() || request.operationId.length > 128) return Promise.reject(Error("AI_TEST_REQUEST_REFUSED"));
			const fingerprint = JSON.stringify(request), prior = tests.get(request.operationId);
			if (prior) return prior.fingerprint === fingerprint ? prior.pending : Promise.reject(Error("CONFIGURATION_CONFLICT"));
			const pending = (async () => {
				assertRevision(request.expectedRevision);
				assertReady();
				if (testBusy) throw Error("AI_TEST_BUSY");
				testInvalidated = true;
				const testGeneration = generation, keyRevision = credentialStore.status().revision, selected = { ...settings }, at = new Date(now()).toISOString(), b = activeBudget(), fetcher = selected.mode === "mock" ? mockFetchImpl : fetchImpl;
				if (!fetcher) throw Error("AI_MOCK_TRANSPORT_REQUIRED");
				testBusy = true;
				let reservation, accounted = false;
				try {
					const body = {
						model: selected.model,
						input: [{
							role: "user",
							content: "This is a synthetic connection test. Reply briefly: connection test received."
						}],
						store: false,
						stream: false,
						service_tier: "default",
						reasoning: { effort: "low" },
						max_output_tokens: 64
					};
					reservation = b.reserve({
						model: selected.model,
						maxOutputTokens: 64,
						inputBytes: new TextEncoder().encode(JSON.stringify(body)).length
					});
					b.beforeRequest(reservation);
					const response = await credentialStore.withCredential((key) => fetcher("https://api.openai.com/v1/responses", {
						method: "POST",
						redirect: "error",
						signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(6e4)]) : AbortSignal.timeout(6e4),
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + key
						},
						body: JSON.stringify(body)
					}));
					if (!response.ok) throw Error("AI_TEST_FAILED");
					const data = await response.json();
					b.recordUsage(reservation, data.usage);
					accounted = true;
					if (data.status !== "completed" || !Array.isArray(data.output) || !data.output.some((x) => x.type === "message" && x.role === "assistant" && x.content?.some((c) => c.type === "output_text" && typeof c.text === "string" && c.text.trim()))) throw Error("AI_TEST_INCOMPLETE");
					assertRevision(request.expectedRevision);
					if (generation !== testGeneration || credentialStore.status().revision !== keyRevision) throw Error("CONFIGURATION_CONFLICT");
					testInvalidated = false;
					tested = {
						operationId: request.operationId,
						revision,
						credentialRevision: keyRevision,
						at,
						status: "passed",
						kind: "tiny-synthetic-inference"
					};
					return {
						...tested,
						synthetic: selected.mode === "mock",
						costMayHaveBeenIncurred: selected.mode === "openai",
						invoiceConfirmed: false
					};
				} catch (e) {
					if (reservation && !accounted) b.markUnknown(reservation);
					throw Error(safeFailure(e));
				} finally {
					testBusy = false;
				}
			})();
			tests.set(request.operationId, {
				fingerprint,
				pending
			});
			return pending;
		},
		enable(expected) {
			assertRevision(expected);
			assertReady();
			if (!currentTest()) throw Error("AI_TEST_REQUIRED");
			const selectedBudget = activeBudget(), fetcher = settings.mode === "mock" ? mockFetchImpl : fetchImpl;
			if (!fetcher) throw Error("AI_MOCK_TRANSPORT_REQUIRED");
			currentProvider = credentialStore.withCredential((apiKey) => createOpenAIConversationProvider({
				apiKey,
				model: settings.model,
				maxOutputTokens: settings.maxOutputTokens,
				reasoningEffort: "low",
				canonicalToolFlow: "guided",
				streamResponses: true,
				budget: selectedBudget,
				fetchImpl: fetcher,
				wirePolicy: {
					inputByteBound: settings.inputByteBound,
					framingTokenAllowance: 4096,
					inputContextTokenBound: settings.inputByteBound + 4096,
					serviceTier: "default"
				}
			}));
			enabled = true;
			generation++;
			return api.status();
		},
		disable(expected) {
			assertRevision(expected);
			invalidate();
			return api.status();
		},
		provider: () => enabled ? currentProvider : void 0,
		policyRevision: () => "local-ai:" + revision + ":" + generation
	};
	return api;
}
//#endregion
export { createLocalAiRuntime };
