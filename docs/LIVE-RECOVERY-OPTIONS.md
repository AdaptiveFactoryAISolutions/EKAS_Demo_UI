# Live recovery decision — current profile preserved

The running18329 profile remains halted. No journal, key, settings or owner session has been changed. This document proposes options; none has been applied.

## Established behavior

`providerBudget.ts` has reserve/beforeRequest/recordUsage/markUnknown and summary only. recordUsage accepts an in-flight entry, not an already-unknown entry. Startup converts in-flight entries to unknown and halts. Eligibility rejects unknown entries independently of the halted flag. `localDemoBudget.ts` preserves that restriction in both current storage and schema3 accepted carry-forward history. Therefore changing halted=false, accepting a carry-forward label, creating a new workspace or replacing the key is not a supported reconciliation. No current Admin endpoint offers a reviewed write-off or unknown-usage reconciliation.

The current unknown reservation isUSD0.189464 and remains fully charged against the USD18 usable guard. All three holds totalUSD0.555896. The dated remaining guard balance isUSD17.444104. These are reservation/accounting bounds, not verified invoice spending.

## Precise options

1. **Keep the block and obtain evidence.** Preserve everything while Patrick supplies the earlier safe error/status or authoritative provider usage evidence. Do not send another inference to diagnose it. Existing unknown status cannot be converted to measured usage without evidence. A reviewed reconciliation path would still need to be implemented and tested; the existing API cannot resolve an already-unknown entry.
2. **Explicitly authorize permanent conservative consumption of the full unknown hold.** Implement a new reviewed disposition that leaves the original unknown entry, null usage, fullUSD0.189464 reservation and all prior accounting intact, and appends who reviewed it, when and the exact source/state digest. It must never claim actual token usage or billed spend, refund a reservation, change the ceiling, create a fresh allowance, or clear another unresolved request. Only an explicitly reviewed unknown hold would cease blocking future admission; the remaining balance would still beUSD17.444104 before any new reservations. This is a new supported recovery mechanism, not an existing command or a file-edit workaround. It requires Patrick’s explicit decision before application and comprehensive fake-only tests.

Either runtime reconciliation implementation requires a coordinated update/restart of the current compiled server. The key is volatile; restarting will clear it and disable AI. Patrick would privately sign in with a fresh one-time owner code and re-enter the key. No restart or re-entry is requested or performed silently. Preserve the existing journal and all holds through that update. Current pricing expires2026-10-16T00:00:00Z.

## Status-visibility correction being verified

Previously the boundary persisted FAILED_NO_COMMIT only for four known refusal codes. Other errors left STARTED without sanitized failure metadata, so a settled request could appear unresolved indefinitely and the original failure could not be recovered from the operation status. The working correction appends only an allowlisted failure code, observation time and successfully returned adapter-round count while retaining STARTED/uncertain accounting and no retry. Raw exception text, credentials, provider payloads and headers are not stored. Policy/lease/storage refusals preserve the previous uncertainty rather than inventing a terminal outcome. Existing earlier operations are not rewritten with a guessed cause.

Native first-request chronology is retained in `evidence/LIVE-FIRST-REQUEST-DIAGNOSIS.json`. Recovery regression evidence is in `evidence/rc-operation-review-status-red.json` and the related green report. Whole-source/type/build/native acceptance remains separately required.
