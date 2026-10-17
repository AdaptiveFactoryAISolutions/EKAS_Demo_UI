# Regression — EKAS DEMO RC3 referent correction

Source under test: extracted `EKAS-DEMO-RC3.zip`, git archive of `45568c575a00a8810b661929624995ec24e6de1e` excluding the nested RC1 and RC2 zip binaries.

Command: `npm ci`, then `npm run build` (`tsc --noEmit && vite build`, exit 0), then one `npx vitest run` in `app/` after the gitignored `evidence/` directory was created. Started 2026-10-17T00:15:18Z. Duration 467.90s. Result: **2,952 passed, 0 failed, 496 files**. Exit code 0. No failure was deleted. `validConversation` was not loosened.

`src/investigation/rcReferent.test.ts` on that extraction: 9 passed, including the eight referent cases and the policy-7 replay. The clean Chrome checkpoint on this build opened the feeder-jam case for “Investigate it.” See `16-REHEARSAL-GUIDE.md`. That checkpoint is not Step 16.

# Regression — EKAS DEMO RC2 test-only delta

Patrick's decision, recorded verbatim:

"Residual regression disposition: 10 accepted as non-blocking for human acceptance. No P0/P1. Six are superseded historical-fixture expectations; two are superseded UI expectations; two are test-only machine-specific path defects. The machine-specific test dependencies must be removed before final release approval."

Release state:

- RC1 Technical Gate: PASS WITH ACCEPTED NON-BLOCKING RESIDUALS
- Human Gates: OPEN
- Final Release: NOT YET APPROVED

RC2 does not change product source. `validConversation` is unchanged. The ten residual tests now assert the current behavior.

| Residual | RC2 assertion |
| --- | --- |
| `assetScopeGuard.test.ts` legacy V67 | `readConversation` rejects `INVALID_RESULT`. Stored bytes stay unchanged. |
| `historyCompatibility.test.ts` original V57 | `readConversation` rejects `INVALID_RESULT`. Stored bytes stay unchanged. |
| `legacyAssetPublication.test.ts` frozen V89 history | `readConversation` rejects `INVALID_RESULT`. Stored bytes stay unchanged. |
| `legacyAssetPublication.test.ts` reopened legacy selection | `loadCanonicalSelection` rejects `INVALID_RESULT`. Stored bytes stay unchanged. |
| `legacyAssetPublication.test.ts` relative ownership on unsafe legacy bytes | `readConversation` rejects `INVALID_RESULT`. No assignment is committed. |
| `v58Compatibility.test.ts` | Clarification capture `conversation-3` rejects `INVALID_RESULT`. Stored bytes stay unchanged. The frozen wrong-cutoff capture `conversation-1` still validates, so that read remains an equality check. It is not forced to fail, and the validator is not loosened to reject it. The old continuation turn is not issued. |
| `v45ReplyOffset.test.tsx` | `scrollMarginTop` is `197px`, the offset already locked by `rcLatestReplyPosition.test.ts`. |
| `v94ProfileControls.test.tsx` | Plant Metrics does not render "Discuss this synthetic metric". The test expects that label to be absent. The composer-disabled checks stay. |
| `v102HealthCaseTransitionRegression.test.tsx` | The proof file is written under `os.tmpdir()`, not `/home/pat/...`. |
| `v102MeasurementCaseTransitionRegression.test.tsx` | The proof file is written under `os.tmpdir()`, not `/home/pat/...`. |

Fresh extraction of `94517b4` (`EKAS-DEMO-RC2.zip`): `npm ci`, then `tsc --noEmit && vite build` (exit 0), then one `npx vitest run` after the gitignored `evidence/` directory was created. Result: **2,943 passed, 0 failed, 495 files**. Exit code 0. Duration 419.72s. Started 2026-10-16T23:01:39Z. No failure was deleted. The validator was not changed.

The production build from that extraction is byte-identical to the RC1 dist, including the seven published file hashes. See `RC2-IDENTITY.md`.

The RC1 classification below is kept as the record of what failed before this delta.

# Regression — EKAS DEMO RC1

Source under test: extracted `EKAS-DEMO-RC1.zip`, SHA `63ccec742c73b824c7c99c5ee1ba0a3e689801b6`.
Command: `npm ci`, then `npx vitest run` in `app/`.
Result on the product tree: **2,933 passed, 10 failed, 2,943 tests**. Exit code 1. No failure was deleted or weakened.

The extraction also contained a temporary launch file, `app/wp6-hold-admin.test.ts`, which is not in the ZIP. That extra test failed with `LOCAL_PROFILE_ALREADY_OPEN` because the rehearsal server already held the profile lock. It is not a product failure and it is not in RC1. With it included, the process reported 2,944 tests and 11 failures.

An earlier run on the same product source, before the training-scope fix was confirmed, was 2,916 passed and 27 failed of 2,943. Seventeen of those failures were retested with the assertions unchanged after the missing gitignored `evidence/` directory was created, the ResizeObserver harness polyfill was added, the lifecycle selector was aligned to the accepted Chat label, the acceptance assertion was aligned to the capitalized role name, and the training evidence scope line was corrected. Those seventeen passed. The ten below remained.

Build on the extraction: `tsc --noEmit && vite build` exited 0. Targeted protected tests on the extraction (`rcTrainingEvidenceContext`, `rcAuditJourney`, `backendMode`): 25 passed.

Browser cohort before this archive, on the Vite dev server of the same source: 19 Playwright tests passed (admin cancel, WP5 dashboards, journey smoke, three WP4 journeys, 320px downtime, three chat journeys, shell walk-through, seven trust failures). Official RC browser proof is the fresh-profile run against `vite preview` of the extraction: 13 passed. See `SCREENSHOT-CATALOG.md`.

## P0

None.

## P1

None.

## P2 — historical fixtures fail closed

`validConversation` refuses the frozen historical bytes. The read returns `INVALID_RESULT`. Current conversations still load, including reload and reopen in the browser. The validator was not loosened.

| Test | Failure |
| --- | --- |
| `assetScopeGuard.test.ts` — legacy V67 unknown-asset answer stays byte-exact | `INVALID_RESULT` |
| `historyCompatibility.test.ts` — original V57 captures load unchanged | `INVALID_RESULT` |
| `legacyAssetPublication.test.ts` — frozen V89 wrong-asset history stays byte-identical | `INVALID_RESULT` |
| `legacyAssetPublication.test.ts` — reopened legacy wrong asset | `INVALID_RESULT` |
| `legacyAssetPublication.test.ts` — relative ownership after an unsafe legacy request | `INVALID_RESULT` |
| `v58Compatibility.test.ts` — original V58 wrong-cutoff captures load unchanged | `INVALID_RESULT` |

Disposition: preserved. Not a fresh-RC silent loss of a current conversation. Not a release blocker for a new plant-leader session.

## P3 — setup or superseded assertion

| Test | Failure | Evidence |
| --- | --- | --- |
| `v102HealthCaseTransitionRegression.test.tsx` | `ENOENT` writing `/home/pat/Documents/Codex/2026-10-08/task-4/ekas-v102-measurement-trust-working/evidence/v102-health-cross-case-independent-proof.json` | The case transition ran. The throw is the write. Creating `/home/pat` was denied. The path was not changed. |
| `v102MeasurementCaseTransitionRegression.test.tsx` | `ENOENT` writing `.../v102-measurement-cross-case-proof.json` | Same. |
| `v94ProfileControls.test.tsx` | `button('Discuss this synthetic metric')` is undefined, then reading `disabled` throws | The plant dashboard does not mount that metric-lab control. The composer-disabled check was reached earlier in the test. The lab was not restored. |
| `v45ReplyOffset.test.tsx` | expected `scrollMarginTop` `185px`, received `197px` | The current offset is locked by the passing `rcLatestReplyPosition.test.ts`. The older expectation was not weakened and the product offset was not changed. |

## Preserved browser observation

Not a failing test. After Plant Review, “Investigate it.” opens the Quality loss discovery. The scorecard’s first case line remains the feeder-jam plan miss of 150. This matches the locked audit-journey test. The reply does not invent approval, performed work, verification, or a reopen. The separate downtime, speed, and quality journeys reached reopen.

## FIX count

0. No further product change was made for these residuals.
