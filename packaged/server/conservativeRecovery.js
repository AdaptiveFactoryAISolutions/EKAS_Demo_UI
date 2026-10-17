import { RECOVERY_APPROVED_AT, validConservativeDisposition } from "./conservativeDisposition.js";
import { localBudgetHistoryDigest } from "./localBudgetHistoryDigest.js";
import { createLocalDemoBudget } from "./localDemoBudget.js";
//#region app/src/server/conservativeRecovery.ts
/** Pure, one-time, hash-bound approved disposition. Original entry/usage/hold remain intact. */
function reviewUnknownBudgetJournal({ raw, expectedSha256, authorizationRef, reviewedAt }) {
	if (authorizationRef !== "Sentinel_9ea7c41c518081918035722b6f491e8c") throw Error("DEMO_RECOVERY_AUTHORIZATION_REQUIRED");
	if (localBudgetHistoryDigest(raw) !== expectedSha256) throw Error("DEMO_RECOVERY_SOURCE_CHANGED");
	if (!Number.isFinite(Date.parse(reviewedAt)) || Date.parse(reviewedAt) < Date.parse("2026-10-15T04:09:28.000Z")) throw Error("DEMO_RECOVERY_DATE_REQUIRED");
	const saved = JSON.parse(raw);
	if (saved?.schema !== "local-demo-budget-v1" || typeof saved.originalRaw !== "string" || !Array.isArray(saved.current?.entries)) throw Error("DEMO_BUDGET_RECOVERY_REQUIRED");
	if (saved.current.entries.some((e) => e.reviewDisposition?.authorizationRef === authorizationRef)) throw Error("DEMO_RECOVERY_ALREADY_RECORDED");
	if (saved.current.entries.some((e) => ["reserved", "in_flight"].includes(e.phase))) throw Error("DEMO_RECOVERY_REQUEST_IN_FLIGHT");
	const before = createLocalDemoBudget({
		originalRaw: saved.originalRaw,
		store: {
			read: () => raw,
			write: () => {}
		},
		now: () => new Date(reviewedAt),
		nextId: () => {
			throw Error("NO_RESERVATION_ALLOWED");
		}
	}).status();
	if ((before.retainedUnknownMicroUsd || 0) > 0) throw Error("DEMO_RECOVERY_ALREADY_RECORDED");
	if (!before.available || !before.halted) throw Error("DEMO_RECOVERY_NOT_REQUIRED");
	const unknown = saved.current.entries.filter((e) => e.phase === "unknown" && !validConservativeDisposition(e));
	if (unknown.length !== 1 || unknown[0].reservationMicroUsd !== 189464 || unknown[0].maxOutputTokens !== 1200 || unknown[0].usage !== null) throw Error("DEMO_RECOVERY_SCOPE_MISMATCH");
	const next = structuredClone(saved), entry = next.current.entries.find((e) => e.id === unknown[0].id);
	entry.reviewDisposition = {
		version: 1,
		kind: "permanently-retained-unknown",
		authorizationRef,
		approvedAt: RECOVERY_APPROVED_AT,
		reviewedAt,
		retainedMicroUsd: entry.reservationMicroUsd,
		priorJournalSha256: expectedSha256
	};
	next.current.halted = false;
	const journalRaw = JSON.stringify(next);
	const after = createLocalDemoBudget({
		originalRaw: saved.originalRaw,
		store: {
			read: () => journalRaw,
			write: () => {
				throw Error("DEMO_RECOVERY_INVALID_RESULT");
			}
		},
		now: () => new Date(reviewedAt),
		nextId: () => {
			throw Error("NO_RESERVATION_ALLOWED");
		}
	}).status();
	if (after.halted || after.remainingMicroUsd !== before.remainingMicroUsd || after.unknownMicroUsd !== 0 || after.retainedUnknownMicroUsd !== 189464 || next.originalRaw !== saved.originalRaw) throw Error("DEMO_RECOVERY_INVALID_RESULT");
	return {
		journalRaw,
		beforeSha256: expectedSha256,
		afterSha256: localBudgetHistoryDigest(journalRaw),
		summary: after
	};
}
//#endregion
export { reviewUnknownBudgetJournal };
