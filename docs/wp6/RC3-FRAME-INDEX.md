# RC3 frame index

Recaptured 2026-10-17 from the RC3 production preview at `http://127.0.0.1:18195`. That preview is `vite preview` of the extracted source `45568c575a00a8810b661929624995ec24e6de1e` (tree `b32f8287ce6bcf18e494de27d4882ba4d01b91b2`). The served `dist` manifest is `b6fbf96c60ee3d1ccdb3eb8ffa4cd2e9bb664fcf9692c057a07f79e280652aaa`. Chrome 154, clean persistent profile, 1366×768 unless the filename says 390 or 320.

The capture script is `rc3-frames.spec.ts`. The shell, dashboard, mobile, tooltip, ambiguous referent, new conversation, investigation, evidence, downtime, speed, quality, and downtime-at-320 tests passed (6 passed, then the Plant Review shot was added and that test passed again). Historical RC1 and RC2 filenames were not overwritten.

The frozen ZIP `EKAS-DEMO-RC3.zip` is the archive of `45568c5`, taken before these frames existed. It has 70 png members under `docs/wp6/screenshots/` and **0** members whose names contain `rc3-`. Those 70 are the RC1 set from `63ccec7`, plus the RC2 checkpoint names that were already in that tree. Files in this folder that are not named `rc3-*` remain that RC1/RC2 evidence. This catalog does not put the new frames back into the ZIP.

Hashes for all 69 `rc3-*.png` files are in `RC3-FRAMES.sha256` (`{sha256}  {bytes}  screenshots/{name}`).

| Need | File | What the frame shows |
| --- | --- | --- |
| Light | `screenshots/rc3-light-chat.png` | First-load Chat, light appearance |
| Chat | `screenshots/rc3-chat.png` | Same Chat view |
| Composer | `screenshots/rc3-composer.png` | Ask EKAS composer |
| Dark | `screenshots/rc3-dark-chat.png` | Chat after Use dark appearance |
| 390 | `screenshots/rc3-390.png` | 390×844, menu open on Chat |
| 320 | `screenshots/rc3-320.png` | 320×844, menu open |
| Dashboard | `screenshots/rc3-dashboard.png` | Plant dashboard, Northworks plan miss, 150 good units |
| Tooltip | `screenshots/rc3-tooltip.png` | Highcharts tooltip on the dashboard |
| Plant Review | `screenshots/rc3-plant-review.png` | After `Run my plant review.` Priority is the Northworks feeder-jam plan miss, 150 good units, Line 03 contribution 138 |
| Ambiguous referent | `screenshots/rc3-ambiguous-referent.png` | Plant Review, then `Compare the speed loss and the quality loss.`, then `Investigate it.` Reply: more than one case is named |
| New conversation | `screenshots/rc3-new-conversation.png` | New conversation, then `Investigate it.` The feeder-jam referent is gone |
| Investigation | `screenshots/rc3-investigation.png` | Fresh Plant Review, focus first, `Investigate it.`, then Investigations. Feeder-jam plan miss, 150 and 138 |
| Evidence | `screenshots/rc3-evidence.png` | Captured evidence dialog for that feeder-jam reply |
| Downtime journey | `screenshots/rc3-downtime-*.png` | `We missed our production goal.` through reopen |
| Speed journey | `screenshots/rc3-speed-*.png` | `Investigate speed.` through reopen |
| Quality journey | `screenshots/rc3-quality-*.png` | `Investigate quality.` through reopen |
| Downtime at 320 | `screenshots/rc3-downtime-320-*.png` | The downtime journey at 320×844 |

Journey key frames, each journey: goal, request an owner, accept ownership, record this hypothesis, recommend this action, authorize the action, record performed work, review safety, review verification result, record sustainment, reopen the investigation, reopened.

Earlier same-preview checkpoint and timestamp frames, not overwritten by this recapture:

| File | What it shows |
| --- | --- |
| `screenshots/rc3-checkpoint-1-plant-review.png` | Step 16 checkpoint, Plant Review |
| `screenshots/rc3-checkpoint-2-focus-first.png` | Step 16 checkpoint, focus first |
| `screenshots/rc3-checkpoint-3-investigate-it.png` | Step 16 checkpoint, Investigate it opens the feeder-jam miss |
| `screenshots/rc3-timestamp-normal.png` | Normal reply shows `Oct 6, 2026 · 2:45 PM` |
| `screenshots/rc3-timestamp-technical.png` | Technical details keep `2026-10-06T14:45:00Z` |

Reply crops of the checkpoint turns are the `*-reply.png` files beside them.
