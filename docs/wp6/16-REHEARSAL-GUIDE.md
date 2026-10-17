# Step 16 rehearsal guide

Status: **USER ACTION**. A fresh unaided human reviewer runs the two-hour plant-leader rehearsal. This package does not simulate that rehearsal, does not score it, and does not mark Step 16 done.

Human Gates: **OPEN**. Final Release: **NOT YET APPROVED**.

## Mandatory checkpoint

Run Plant Review → "What should I focus on first?" → "Investigate it."

Expected: EKAS opens the investigation for the priority it just recommended. If it opens Quality while the stated priority is the 150-unit feeder-jam miss, that is a real usability/context defect regardless of any older locked test, and it must be corrected before final approval.

Use these phrases, in order, from a clean Chat:

1. `Run my plant review.`
2. `What should I focus on first?`
3. `Investigate it.`

Read the priority named in the second reply before judging the third. The investigation that opens must be that priority. An older locked unit test that expects the Quality-loss discovery does not accept this checkpoint. Final approval requires the correction if Quality opens while the stated priority is the 150-unit feeder-jam miss.

## Observed on RC2, without a product change

Build: production preview of extracted `94517b4` at `http://127.0.0.1:18194`. Browser: a new Chrome profile, empty before Chat loaded. Light appearance. No prior conversation.

1. `Run my plant review.` Priority: Northworks feeder-jam plan miss. 150 good units below the approved goal (2,154 against 2,304). Next: investigate Northworks feeder-jam plan miss.
2. `What should I focus on first?` The same priority and the same next step.
3. `Investigate it.` The reply is Quality loss: observed 2.18%, approved fictional target 1.50%, unfavorable deviation 0.68 percentage points. The context bar becomes Northworks Plant Review, Frozen report 2026-10-06 · qualityLoss. It does not open the 150-unit feeder-jam investigation.

That was the RC2 defect. RC2 does not correct it. RC3 does: the same three phrases open the Northworks feeder-jam plan miss, plant gap 150, Line 03 contribution 138. The RC2 frames stay as the before state.

Frames: `screenshots/rc2-checkpoint-1-plant-review.png`, `screenshots/rc2-checkpoint-2-focus-first.png`, `screenshots/rc2-checkpoint-3-investigate-it.png`. The captured replies are in `rc2-checkpoint.json`.

The unaided reviewer still runs this checkpoint. A recorded clean-profile pass is not a substitute for that rehearsal.

## What the reviewer still does

The rest of the two-hour rehearsal is unaided. This guide does not script those minutes and does not fill live-user scores.
