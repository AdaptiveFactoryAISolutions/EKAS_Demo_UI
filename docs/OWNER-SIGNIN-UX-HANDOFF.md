> Current authority: the approved 2026-10-15 goal authorizes bounded workspace consolidation and backend adapter verification. See [current goal plan](superpowers/plans/2026-10-15-unified-ekas-goal.md). Earlier statements that consolidation was not authorized are historical.

# Isolated owner sign-in UX successor

The bounded fix is implemented and locally verified in source `d68f632c304c96aa4e6a75310e929b946d266d66f4b9397fda03577b1c657354`. It is not served or promoted. Patrick's 711b preview18352 and live cf296 preview18329 remain unchanged. The competing-workspaces/navigation concern is not implemented.

## Exact changes from f2b

- `app/src/admin/AdminAiPage.tsx`: explicit checking/active/inactive/unconfirmed owner status; persistent accessible errors; existing read-only session check and cancellation available throughout sign-in; server-supplied expiry display and advisory expiry handling; clear stale controls on lost authority; no success notice before required status refresh; synchronous duplicate-submit latch; lifecycle guards against stale/aborted responses; raw entry cleanup. Private one-use and existing reusable public-rehearsal guidance are distinct.
- `app/src/admin/localAiAdminClient.ts`: safe allowlisted error codes for UI recovery, malformed session/login metadata rejection including unrepresentable dates, and generation/abort guards so stale responses cannot replace or clear newer CSRF state. Raw server/network errors remain masked.
- `app/src/admin/ownerSignInRecovery.test.tsx`: 13 new consumer-visible tests using the real client, authority, runtime and handler with synthetic credentials; only the transport is controlled to exercise races/failures.
- `app/src/admin/localAiAdminClient.test.ts`: one new invalid-expiry regression; original cases retained.

All server source files, input/public fixtures and dependency manifests are unchanged. The entire compiled server directory is byte-identical to f2b. No endpoint, authority, TTL, origin/CSRF policy, credential store, budget control, provider architecture, key issuance or renewal was added or altered. Test/Enable remain separate; recovery reads never perform either action. UI Test/Enable remain unavailable while displayed configuration is unconfirmed.

## Validation

Final serial validation passed **63 related source cases across 12 files**, **three real loopback HTTP cases**, complete TypeScript checking and browser/server builds. There are 14 new regressions and 49 retained related cases. The HTTP cases verify login/reload/save/logout, unchanged two-hour expiry with non-renewing reads, consumed-code refusal and pre-aborted requests. Synthetic budgets reject spending; no real provider/key is used.

RED evidence is preserved: initial recovery failures; 12/12 against an unchanged f2b implementation copy; invalid-expiry rejection; public-rehearsal guidance. Earlier intermediate results and the corrected neutral reload-status expectation remain available. Final logs and process exits are in `evidence/owner-signin-ux-candidate/VALIDATION-COMPLETION.json`; detailed reports are `final-related-results.json` and `final-http-results.json`.

This is **full related verification**, not a fresh whole-source or whole-product run of the successor. The f2b baseline's 2,910-source/501-compiled evidence and bounded independent review remain scoped to f2b. No independent or native acceptance of d68f is claimed. No new security-review gate is requested.

## Artifacts

| Member | Identity/path |
| --- | --- |
| Editable source | `evidence/owner-signin-ux-candidate/app` |
| Supporting source fixture | `evidence/owner-signin-ux-candidate/docs/FEATURE-RETENTION.json`; preserve its relative position for typecheck/tests |
| Source SHA256 | `d68f632c304c96aa4e6a75310e929b946d266d66f4b9397fda03577b1c657354` |
| Static SHA256 | `b64a6d6efa39e774e2d8bf91c2f710029134d1d32621c71aacbd035183b9288c` |
| Static path | `evidence/owner-signin-ux-candidate/app/dist` — 81 members |
| Server SHA256 | `262aa8491ced0aecf1e7349b6d41c6ed399937d9f91f24c8d12bc1ef2be0cf8b` — exact f2b directory |
| Server path | `evidence/owner-signin-ux-candidate/server` |
| File/member inventory | `evidence/owner-signin-ux-candidate/VALIDATED-IDENTITY.json` |
| Verification summary | `CURRENT-OWNER-UX-CHECKPOINT.json` |

Directory hashes use sorted relative path + NUL + member SHA256 + newline, excluding source node_modules/dist/.cache. No final release freeze, ZIP, Library release upload, live restart or preview swap occurred.

## Parent-coordinated review

Use a separate synthetic candidate profile/URL if a visible review is assigned; no URL was launched here. Use synthetic test credentials only. Verify initial signed-out status, invalid and consumed-code refusal, supplied expiry, network/status failure, interrupted response, cancellation, duplicate submission, late initial checks, reload and public-rehearsal sign-in again. Confirm errors persist and focus is usable; check navigation away/back and 320px in an actual browser. Source DOM focus tests are not native screen-reader/geometry acceptance.

The private server deliberately returns the same safe refusal for several authentication states. The UI does not identify a particular private code as invalid, consumed or expired, nor disclose additional credential state. If no valid cookie remains and the private code has been consumed, actual access restoration still requires operator-coordinated recovery under the existing policy. This fix explains that boundary; it cannot issue a new code or restart anything. Self-service restoration would be a separate policy/design decision, not an unperformed part of this bounded fix.

The original reported silent POST outcome cannot be reconstructed from absent historical audit data. Reproduced source failures/races are fixed; no new login telemetry or disclosure was introduced. Whole-successor source/domain verification, independent ordinary review and native acceptance remain separately unperformed. Current live credentials/provider state and Tom production conformance remain uninspected/unverified.
