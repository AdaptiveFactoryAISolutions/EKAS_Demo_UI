# Visual system screenshot catalog

Status: **PENDING INDEPENDENT REVIEW**. This catalog records what was captured. It does not certify the visual system.

Hard rule for this package: "This visual package may make EKAS look more polished, but it may not make EKAS feel more like a dashboard product. Chat remains the primary product experience; dashboards remain supporting views."

Captured from `http://127.0.0.1:18191/` after the presentation-only theme. Light is the default (`document.documentElement.dataset.theme` is `light` before any appearance control is used). Dark is selected from More → Use dark appearance and is the same local preference used by the Theme screen. Desktop frames are 1366×768. Mobile frames are 390×844 and 320×844.

Chat is the first screen in both themes. Dashboards are opened from the supporting navigation. No manufacturing numbers, context, or journey steps were changed to produce these frames.

## Light and dark matrix

| File | Theme | Viewport | What the frame shows |
| --- | --- | --- | --- |
| `light-01-chat-first.png` | Light | 1366×768 | First-load Chat, before a question is sent |
| `light-02-chat-answer.png` | Light | 1366×768 | Chat after the starter "We missed our production goal." |
| `light-03-plant-review.png` | Light | 1366×768 | Chat after "Show the plant operating review." |
| `light-04-investigation.png` | Light | 1366×768 | Investigations for the same conversation |
| `light-05-evidence.png` | Light | 1366×768 | Evidence opened from that Chat answer |
| `light-06-plant-operations.png` | Light | 1366×768 | Dashboards, Plant operations, Highcharts column chart |
| `light-07-production-oee.png` | Light | 1366×768 | Dashboards, Production and OEE selected |
| `light-08-390.png` | Light | 390×844 | Chat at the phone width |
| `light-09-320.png` | Light | 320×844 | Chat at the narrow width |
| `dark-01-chat-first.png` | Dark | 1366×768 | Same first-load Chat |
| `dark-02-chat-answer.png` | Dark | 1366×768 | Same answered Chat |
| `dark-03-plant-review.png` | Dark | 1366×768 | Same plant operating review |
| `dark-04-investigation.png` | Dark | 1366×768 | Same Investigations view |
| `dark-05-evidence.png` | Dark | 1366×768 | Same evidence view |
| `dark-06-plant-operations.png` | Dark | 1366×768 | Same Plant operations dashboard |
| `dark-07-production-oee.png` | Dark | 1366×768 | Same Production and OEE dashboard |
| `dark-08-390.png` | Dark | 390×844 | Same Chat at 390px |
| `dark-09-320.png` | Dark | 320×844 | Same Chat at 320px |

## Additional frames

| File | Theme | Viewport | What the frame shows |
| --- | --- | --- | --- |
| `sidebar-expanded.png` | Light | 1366×768 | Expanded sidebar: New conversation, Chat, Dashboards, Investigations, Improvements, Knowledge, Administration, with Lucide outline icons and text labels |
| `mobile-menu.png` | Light | 390×844 | Menu open, with the same destinations including Dashboards |
| `chart-tooltip.png` | Light | 1366×768 | Plant operations column chart with the first point's tooltip in view |
| `selected-family.png` | Light | 1366×768 | Production and OEE family selected; selection is a neutral gray, not a green accent |
| `status-passed-pending-failed.png` | Light | 1366×768 | Downtime investigation at Review safety |

## Governed status colors

`status-passed-pending-failed.png` is the downtime journey after the next step reaches Review safety. The journey record on that frame reads:

- Quality: Passed
- Energy: Passed
- Safety: Pending

Passed uses the success color. Pending uses the warning color. The words stay in the sentence, so status is not color alone.

That supplied journey does not display the word Failed. The off-target semantic is the same failed color, with the governed words Below target and Above target. Those words are on the Plant operations frames (`light-06-plant-operations.png` and `dark-06-plant-operations.png`). Not evaluated and unavailable stay gray. No status word was invented for the screenshot.

## Checks made while capturing

These are notes for the reviewer, not a pass.

- First load reports light before Dark is chosen.
- Chat, the answer, the plant review, Investigations, evidence, and both dashboard families were captured in both themes.
- Sidebar labels stay visible with the icons.
- Focus on the EKAS control draws a 3px blue outline (`#1d4ed8`) in light.
- At CSS zoom 200% on the light Chat shell, the heading and composer remain and the shell reports no horizontal overflow.
- Primary actions in the captured pixels are charcoal on light (`#2c2c2a`) and light on dark, not the previous green accent.
