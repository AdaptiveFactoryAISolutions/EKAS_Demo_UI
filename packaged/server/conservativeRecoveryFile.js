import { acquireLocalDemoProfile, canonicalLocalBudgetJournalPath, ownedFileStorage } from "./demoRuntime.js";
import { RECOVERY_AUTHORIZATION } from "./conservativeDisposition.js";
import { localBudgetHistoryDigest } from "./localBudgetHistoryDigest.js";
import { reviewUnknownBudgetJournal } from "./conservativeRecovery.js";
import { closeSync, fsyncSync, openSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
//#region app/src/server/conservativeRecoveryFile.ts
/** Explicit offline owner action. The exact shared live-journal lock must be free. */
function recoverConservativeBudgetFile({ originalBudgetPath, expectedJournalSha256, authorizationRef, now = () => /* @__PURE__ */ new Date() }) {
	if (authorizationRef !== "Sentinel_9ea7c41c518081918035722b6f491e8c") throw Error("DEMO_RECOVERY_AUTHORIZATION_REQUIRED");
	const original = realpathSync(originalBudgetPath), journal = canonicalLocalBudgetJournalPath(original), release = acquireLocalDemoProfile(journal);
	try {
		const originalRaw = readFileSync(original, "utf8"), raw = readFileSync(journal, "utf8");
		if (JSON.parse(raw).originalRaw !== originalRaw) throw Error("ORIGINAL_BUDGET_HISTORY_CHANGED");
		const result = reviewUnknownBudgetJournal({
			raw,
			expectedSha256: expectedJournalSha256,
			authorizationRef,
			reviewedAt: now().toISOString()
		}), backup = journal + ".before-" + RECOVERY_AUTHORIZATION + ".json";
		try {
			const fd = openSync(backup, "wx", 384);
			try {
				writeFileSync(fd, raw, "utf8");
				fsyncSync(fd);
			} finally {
				closeSync(fd);
			}
		} catch (e) {
			if (e.code !== "EEXIST" || readFileSync(backup, "utf8") !== raw) throw Error("DEMO_RECOVERY_BACKUP_REQUIRED");
		}
		if (readFileSync(original, "utf8") !== originalRaw || localBudgetHistoryDigest(readFileSync(journal, "utf8")) !== expectedJournalSha256) throw Error("DEMO_RECOVERY_SOURCE_CHANGED");
		ownedFileStorage(journal).write(result.journalRaw);
		if (readFileSync(original, "utf8") !== originalRaw) throw Error("ORIGINAL_BUDGET_HISTORY_CHANGED");
		return {
			applied: true,
			authorizationRef,
			backupPath: backup,
			beforeSha256: result.beforeSha256,
			afterSha256: result.afterSha256,
			...result.summary,
			qualification: "Full unknown reservation permanently retained; token usage and billed spend remain unknown. No inference, refund, reset or new allowance."
		};
	} finally {
		release();
	}
}
//#endregion
export { recoverConservativeBudgetFile };
