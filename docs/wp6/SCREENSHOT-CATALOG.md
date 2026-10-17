# Browser evidence catalog — EKAS DEMO RC3 checkpoint

Clean Chrome profile against `vite preview` of extracted `45568c5` at `http://127.0.0.1:18195`. These frames are the referent correction. They are not the unaided Step 16 rehearsal.

| File | What it shows |
| --- | --- |
| `rc3-checkpoint-1-plant-review.png` | After `Run my plant review.` Priority is the Northworks feeder-jam plan miss, 150 good units (2,154 against 2,304). |
| `rc3-checkpoint-2-focus-first.png` | After `What should I focus on first?` The stated priority is still that 150-unit miss. |
| `rc3-checkpoint-3-investigate-it.png` | After `Investigate it.` The open case is the feeder-jam plan miss: 150 good units, Line 03 missed by 138. |
| `rc3-timestamp-normal.png` | A later quality-gap answer shows `Oct 6, 2026 · 2:45 PM` in the normal reply. |
| `rc3-timestamp-technical.png` | Technical details of that reply keep `2026-10-06T14:45:00Z`. |

Reply crops of the three checkpoint turns are the `*-reply.png` files beside them. Wording is in `rc3-checkpoint.json`.

# Browser evidence catalog — EKAS DEMO RC2 checkpoint

These three frames are the mandatory Step 16 checkpoint on the RC2 production build, in a clean Chrome profile. They are not a pass. “What should I focus on first?” states the 150-unit feeder-jam miss. “Investigate it.” opens Quality loss.

| File | What it shows |
| --- | --- |
| `rc2-checkpoint-1-plant-review.png` | After `Run my plant review.` Priority is the Northworks feeder-jam plan miss, 150 good units. |
| `rc2-checkpoint-2-focus-first.png` | After `What should I focus on first?` The stated priority is still that 150-unit miss. |
| `rc2-checkpoint-3-investigate-it.png` | After `Investigate it.` The open discovery is Quality loss, 2.18% against 1.50%. The context bar says qualityLoss. |

Reply crops of the same three turns are the `*-reply.png` files beside them. Wording is in `rc2-checkpoint.json`.

# Browser evidence catalog — EKAS DEMO RC1

Fresh Chrome profile against the production build of `63ccec742c73b824c7c99c5ee1ba0a3e689801b6`, served by `vite preview` at `http://127.0.0.1:18192`. Admin frames use the rehearsal demo server at `http://127.0.0.1:18193`. Historical `docs/wp1`, `docs/wp4`, and `docs/wp5` screenshots were not rewritten.

The script is `docs/wp6/rc1-browser.spec.ts`. All 13 tests passed on the final run (10 on the first pass, 3 after the harness waited for the shell, kept the dark-mode menu open, and matched the honest Quality-loss wording).

| File | What it shows |
| --- | --- |
| `01-chat-light-1366.png` | First-load Chat at 1366×768. Light appearance. |
| `01-dashboards-1366.png` | Dashboards from that clean session. |
| `01-investigations-1366.png` | Investigations. |
| `01-improvements-1366.png` | Improvements. |
| `01-knowledge-1366.png` | Knowledge. |
| `01-new-conversation.png` | New conversation clears the thread. |
| `02-chat-dark-1366.png` | Dark appearance from More. Light was restored afterward. |
| `03-chat-390.png` | Chat at 390×844. |
| `03-chat-320.png` | Chat at 320×844. Menu opens; composer stays in frame. |
| `04-master-journey-end.png` | End of the exact master-phrase journey. Answers are in `master-journey.json`. |
| `05-dashboards-150-138.png` | Plant shortfall 150 and Line 03 contribution 138. |
| `05-production-oee.png` | Production and OEE, Highcharts visible. |
| `06-copy-export.png` | Copy answer and export. No Print control on the plant reply. |
| `07-reopen-history.png` | Reload, new conversation, reopen the saved January OEE thread. |
| `08-admin-dummy-cleared.png` | Rehearsal Admin after a dummy key was cleared. The marker is not in the image. |
| `09-zoom-attempt.png` | Engine page scale 2. See `zoom-measurement.json`. |
| `downtime-goal.png` through `downtime-reopened.png` | Downtime journey at 1366, including owner, hypothesis, action, authorization, performed work, safety, verification, sustainment, and reopen. |
| `speed-*.png` | Speed journey through reopen. |
| `quality-*.png` | Quality journey through reopen. |
| `downtime-320-*.png` | The same downtime lifecycle at 320×844. |

No screenshot contains `DUMMY_BROWSER_MARKER_NOT_A_KEY`.
