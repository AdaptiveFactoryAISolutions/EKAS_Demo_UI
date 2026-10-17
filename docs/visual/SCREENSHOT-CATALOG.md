# Visual system screenshot catalog

Status: **PENDING INDEPENDENT REVIEW**. This catalog records the correction after `9245f20`. It does not certify the visual system.

Hard rule: "This visual package may make EKAS look more polished, but it may not make EKAS feel more like a dashboard product. Chat remains the primary product experience; dashboards remain supporting views."

These frames replace the `9245f20` set. They were captured again from `http://127.0.0.1:18191/` after the four corrections. Each frame uses a new browser session. Light is still the default. Dark is chosen in that session from More → Use dark appearance. Desktop is 1366×768. Phone widths are 390×844 and 320×844.

## Issue 1 — stale-scope warning

Classification: **A. Capture-state contamination.** Not B, and not C.

Evidence:

- `git diff f36ecb3..9245f20` does not change conversation routing, scope eligibility, or the context model. The only store change in that range is the saved appearance field.
- A fresh browser session shows no stale-scope warning on Chat, on Dashboards, or at 320px. The context line is `Oct 6 · Day Shift · Synthetic`.
- Opening the downtime case and then opening Dashboards also stays clean.
- Asking "Show the plant operating review." on a fresh conversation stays clean. The scope reads Northworks › Northworks Plant Review.
- The warning appears only when that plant-review question is asked after a case is already open. The existing route keeps the open case on an operating-review question, and the existing eligibility check then reports that the captured review scope does not match the frozen plant-review shape. That check is unchanged from the accepted WP5A revision. The warning is still shown for that real mismatch. It is not hidden.
- The `9245f20` frames asked for the plant review after the downtime starter, in the same session, and then captured Dashboards and the 320px Chat from that session. That sequence produced the banner and the raw period. These new frames do not do that.

The raw period `2026-10-06 day shift` was the context bar falling back to the stored period while the case view was withheld. The bar now formats a stored `YYYY-MM-DD` period with the existing plant day label, so the visible line stays `Oct 6 · Day Shift · Synthetic`. The stored period is unchanged.

## Light

| File | What the frame shows |
| --- | --- |
| `light-01-chat-first.png` | First-load Chat. No warning. |
| `light-02-chat-answer.png` | Chat after "We missed our production goal." Send is empty, so it uses the quiet disabled treatment. |
| `light-03-plant-review.png` | Plant review from a fresh conversation, not stacked on an open case. |
| `light-04-investigation.png` | Investigations after the downtime starter. |
| `light-05-evidence.png` | Evidence for that answer. |
| `light-06-plant-operations.png` | Dashboards, Plant operations, from a fresh session. |
| `light-07-production-oee.png` | Production and OEE in that same fresh dashboard session. |
| `light-08-390.png` | First-load Chat at 390px. |
| `light-09-320.png` | First-load Chat at 320px. Chat is on the first screen. |
| `light-10-header.png` | Header close-up. Icon, 8px gap, label. 12px between controls. 18px icons. |
| `light-11-composer-enabled.png` | Draft typed. Send uses the dark neutral primary fill and light text. |
| `light-11-composer-disabled.png` | Empty composer. Send is pale, with a border, and is visibly not the primary action. |

## Dark

| File | What the frame shows |
| --- | --- |
| `dark-12-chat.png` | First-load Chat. |
| `dark-13-investigation.png` | Investigations after the downtime starter. |
| `dark-14-evidence.png` | Evidence for that answer. |
| `dark-15-plant-operations.png` | Plant operations from a fresh dark session. |
| `dark-16-production-oee.png` | Production and OEE. |
| `dark-17-390.png` | First-load Chat at 390px. |
| `dark-18-320.png` | First-load Chat at 320px. |
| `dark-19-header.png` | Header close-up. |

## Checks made while capturing

These notes are for the reviewer. They are not a pass.

- No captured frame contains the stale-scope warning or the raw `2026-10-06 day shift` string.
- Enabled Send is `rgb(44, 44, 42)` with light text in light mode. Empty Send is pale (`rgb(243, 243, 241)`) at full opacity, not a washed copy of the primary. Dark enabled Send is a light neutral fill with dark text. Hover uses the slightly stronger primary. Focus draws the blue outline. The busy label keeps the primary fill while saving.
- Scope lines, the Ask EKAS label, and the composer helper use the darker secondary and tertiary grays. Primary text stays charcoal.
- At 200% zoom on the desktop Chat shell, the shell reports no horizontal overflow. The 320px frame is a separate first load.
