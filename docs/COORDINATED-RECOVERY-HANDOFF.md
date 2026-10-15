## Applied coordinated recovery —2026-10-15 04:28UTC

Parent confirmed capturespaused04:26. OldownedPID2041445 gracefully stopped; approvedCLI appliedonce with exactbackup preserved; replacementPID2418093 now serves same18329 URL/source4520d319. Publicroot200,publicdisabledstatus200,Admin401,owner-code0600verified withoutreadingcode. Journal unchangedacrosslaunch; allholds retained,unknownreviewed189464,remaining17444104. No keyread/transfer,test,enableorprovider call. Privateentry/capturepause continues. Detailed currentsteps in NORMAL-OWNER-SETUP-READY.json. Historical preparation below remains preserved.

# Validated recovery replacement — coordination required

Patrick approved this exact one-time recovery at2026-10-15T04:09:28Z, reference `Sentinel_9ea7c41c518081918035722b6f491e8c`. No actual recovery/restart has occurred. Keep18329 unchanged until the parent confirms browser captures are paused and the user is ready for private re-entry.

Replacement directory: `/home/pat/Documents/Codex/2026-10-08/task-4/ekas-demo-final-rc-working/evidence/recovery-validated-replacement`. Identity is in its `IDENTITY.json`. This is a working recovery deployment, not a final release/whole-product approval. The separate actual contextual “Investigate it” defect remains tracked FIX.

## Verified scope

Typecheck0,78targeted assertions, browser/localserver working builds0. Compiled normal HTTP fixture with injected fake Responses passed lock refusal, exact backup/original preservation, offline disposition, restart, fresh private fake activation, two canonical monthly turns, no-spend replay and another restart. External provider calls0. Actual frozen CLI fixture proof also passed, with empty child environment, exact backup/original, full hold and duplicate refusal.

## Coordinated owner actions after private-entry pause

1. Confirm the currently recorded genuine process is PID2041445 from its own startup record/heartbeat. Stop only that owned process gracefully. Its volatile credential will be discarded, as disclosed/approved. Wait for normal release of the shared journal lock; do not delete a lock as a workaround.
2. Run the frozen recovery CLI once, while the old process is stopped:

```sh
node '/home/pat/Documents/Codex/2026-10-08/task-4/ekas-demo-final-rc-working/evidence/recovery-validated-replacement/integration/local-demo/recover-conservative.mjs' \
  --original-budget-history '/home/pat/.local/state/ekas-demo-budget/Patrick-20261010-USD20.json' \
  --expected-journal-sha256 '8e287361859d087f8a0217c2696a95b97a6d94d7e36fd2cc20ca54dd947a9898' \
  --authorization-ref 'Sentinel_9ea7c41c518081918035722b6f491e8c'
```

The digest was observed at2026-10-15T04:22:45.756072+00:00. Any changed journal refuses the command. The active-profile lock also refuses it. The command writes an exclusive0600 byte-exact before-recovery backup, appends the approved disposition to the sole unknown entry and atomically persists it. Original source/history/phaseunknown/usagenull/fullUSD0.189464 hold stay intact. Total holds remainUSD0.555896; guard balanceUSD17.444104. Confirmed billed spend remains unknown. Duplicate recovery and reuse after a later unknown are refused.

3. Launch the prepared `launch.mjs` in the replacement directory as a detached owned process, recording its PID and redirecting output to its own server log. It uses the SAME state path, original accounting source, one-time owner-code path and port18329. Never read or transfer the actual key; no environment secret is used. Do not read secret-bearing logs.
4. Verify public root200, public modeserver-disabled, protected Admin401 and owner-code permissions0600 without reading the code. Do not perform Test or send chat. The real accounting observation after recovery should show retainedUnknownMicroUsd189464, unknownMicroUsd0, remainingMicroUsd17444104, nothalted; do not infer invoice spending.

## Patrick’s private steps

Reload the same URL: http://127.0.0.1:18329/?demonstration=ekas-normal-first-use-20261015 . Open Admin AI. Privately reopen the newly written one-time owner code at:

`/home/pat/Documents/Codex/2026-10-08/task-4/ekas-demo-final-rc-working/evidence/normal-owner-first-use/private/owner-code`

Paste into Private local owner code; Sign in as local owner. This code differs from the earlier consumed code. Choose/confirm OpenAI · server-held credential, modelgpt-6.1-sol, Save settings. Privately enter the key; Set server key. Initial save has no replacement-confirmation dialog.

Review the non-secret budget: the unknown hold is now explicitly shown as conservatively consumed with actual usage unknown. All prior reservations remain. A NEW explicit connection test may incur another charge/hold; no earlier test was refunded. Tick the bounded-cost checkbox and Test connection once only if Patrick elects to do so. After a current passed test, Enable AI separately. The expected remaining reservation allowance after that64-token test would beUSD17.267136, assuming no other new requests; it is not a prediction of billed spend. Pricing guard still expires2026-10-16T00:00:00Z.

Clear key entry, close the private code file and return to chat before resuming any capture. One live tester only; source owner makes no paid calls. Use a new explicit conversation/request; do not regenerate any held old operation. Preserve all old drafts, operation history and failure evidence. If a later outcome is unknown, stop: this one-time approval cannot be reused.
