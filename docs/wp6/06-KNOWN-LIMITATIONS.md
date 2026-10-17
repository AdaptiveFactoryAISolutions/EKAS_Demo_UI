# Known limitations — EKAS DEMO RC1

These limits are part of the candidate. They are not hidden, and they are not new scope.

## Production backend

Current EKAS_Platform_v2 main lacks the complete investigation/case/metrics contract required for full backend-connected EKAS behavior. The Backend Gap Contract is defined. The adapter remains fail-closed. Live integration is not claimed.

Adapter Verified: **NO**. Live Integration Verified: **NO**.

## Provider

No real provider key was entered. No paid call was made. Pricing in the older fixture expires `2026-10-16T00:00:00Z`. A real conversation remains a Patrick action in the Admin UI.

## Plant Review pronoun

RC2 left a release-blocking gap. After “Run my plant review.” and “What should I focus on first?”, the scorecard priority is the Northworks feeder-jam plan miss, 150 good units, and “Investigate it.” opened Quality loss.

RC3 resolves “it” from the current conversational referent. Plant Review and the focus-first answer name that feeder-jam plan miss, and “Investigate it.” opens that case: plant gap 150 good units, largest contributor Line 03, 138 units. An explicit quality or speed question still opens that named case. A reply that names more than one case asks which one, instead of choosing. A new conversation does not keep the previous referent. Topic policy 7 replays the older Quality-loss pronoun; new turns use policy 8. The Step 16 rehearsal in `16-REHEARSAL-GUIDE.md` is still a human gate. This note does not mark it done.

The downtime, speed, and quality journeys are separate. Each reached reopen from a clean profile, including downtime at 320px.

## Print

Plant Chat does not offer print. Copy and JSON export are the promised reply outputs. This package does not claim a native print preview for Chat.

## Zoom

Keyboard zoom on the automated Chrome session left `visualViewport.scale` at 1. Chromium `Emulation.setPageScaleFactor` 2 then set `visualViewport.scale` to 2 and the layout width to 683. That measurement is in `zoom-measurement.json`. It is engine page scale, not a person using the browser zoom control.

## Test residuals

RC1 left ten failing source tests, classified in `REGRESSION.md`. Patrick accepted them as non-blocking for human acceptance. No P0 or P1. RC2 rewrites those tests only: historical fixtures expect `INVALID_RESULT`, the reply offset expectation is 197px, the removed dashboard label is expected to be absent, and the two proof files use a temporary directory. The validator was not loosened. The fresh RC2 extraction suite passed 2,943 tests and failed 0.

## Human review

No unaided plant-leader rehearsal was run. No independent approval was given. Live-user scores are not filled in.
