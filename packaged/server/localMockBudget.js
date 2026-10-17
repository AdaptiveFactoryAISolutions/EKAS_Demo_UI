import { createProviderBudget } from "./providerBudget.js";
//#region app/src/server/localMockBudget.ts
/** Version2 has10000maximum-request fixture slots; this is no real spending authority.
* Separate synthetic journal: cannot be supplied as live allowance. Its authored
* rehearsal clock is fixed; live price expiry must not disable offline mock use. */
function createLocalMockBudget({ store, now, nextId }) {
	const b = createProviderBudget({
		policy: {
			version: 1,
			authorizationId: "synthetic-local-rehearsal-v2-only",
			model: "gpt-6.1-sol",
			expiresAt: "2026-10-16T00:00:00Z",
			totalMicroUsd: 189464e4,
			inputContextTokenBound: 64096,
			maxOutputTokens: 1200,
			inputMicroUsdPerMillion: 275e4,
			outputMicroUsdPerMillion: 11e6
		},
		store,
		now: () => /* @__PURE__ */ new Date("2026-10-14T00:00:00Z"),
		nextId
	});
	return {
		...b,
		status() {
			const s = b.summary(), entries = JSON.parse(store.read() || "{}").entries || [];
			return {
				available: true,
				synthetic: true,
				ceilingMicroUsd: 189464e4,
				usableMicroUsd: 189464e4,
				remainingMicroUsd: s.remainingMicroUsd,
				confirmedSpendMicroUsd: null,
				inFlightMicroUsd: entries.filter((e) => e.phase === "in_flight").reduce((n, e) => n + e.reservationMicroUsd, 0),
				unknownMicroUsd: entries.filter((e) => e.phase === "unknown").reduce((n, e) => n + e.reservationMicroUsd, 0),
				halted: s.halted
			};
		}
	};
}
//#endregion
export { createLocalMockBudget };
