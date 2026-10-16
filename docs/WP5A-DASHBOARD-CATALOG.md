# WP5A dashboard catalog

Status: PENDING INDEPENDENT REVIEW. This note records the governed mapping. It does not certify usability.

The third-party dashboard images supplied for research were not copied into the product and are not in the repository. No image, layout, brand, title, color, icon, composition, or tile placement from those references is used. The seven families, the questions they answer, and the chart types below come from the WP5A directive. Every number is read from the operating review, the Northworks plant bridge, or a supplied case fixture. A missing record is shown as Unavailable. It is not drawn as zero.

The decision chart and the table under it use the same rows. Selection writes the shared conversation context. It does not keep a second case status. An open investigation is read from the investigation view.

## Shared context

| Action | Context | Case |
| --- | --- | --- |
| Open Dashboards before a selection | Home crumb remains Northworks › Line 03 › FEED-03. The dashboard context line is the plant operating review, not a selected asset. | No investigation |
| Focus the dashboard on Line 03 | Northworks › Line 03. FEED-03 is not the current context. | Not opened |
| Why? / What happened? / Investigate it. | Opens the downtime investigation | Same downtime case as the accepted journey |
| Ask about this, after a line is focused and no case is open | Sends Why? | Opens that case |
| Investigate, after the case is open | Opens Investigations | Does not create another case |

Speed line and Quality line use the same focus pattern for the speed and quality cases.

## Metric to visual

Plant operations, cutoff 2026-10-06T14:45:00Z. Targets are the effective synthetic approvals. They are not illustrative goals from the older summary list.

| Measure | Visual | Value | Target |
| --- | --- | --- | --- |
| Production versus plan | KPI card and table | 93.49% | 100% |
| OEE | KPI card and table | 74.79% | 80% |
| Downtime | KPI card and table | 240 min | 180 min |
| Quality loss | KPI card and table | 2.18% | 1.50% |
| Schedule adherence | KPI card and table | 85.71% | 95% |
| Inventory days | KPI card and table | 4.80 day | 4.50 day |
| OTIF | KPI card and table | 91.30% | 95% |
| Line 03 case | Ranking bar and button | 150 good units below plan; 2,154 against 2,304 | Approved plant plan |
| Speed line case | Ranking bar and button | 114 good units; 706 against 820 | Approved case plan |
| Quality line case | Ranking bar and button | 58 good units; 792 against 850 | Approved case plan |
| Line 03 contribution | Table only | 138 good units | 768 good units planned |
| Line 02 contribution | Table only | 38 good units | 768 good units planned |
| Line 01 contribution | Table only | 26 good units above plan | 768 good units planned |

The 150 good-unit figure is the approved plant-plan shortfall for the Line 03 investigation. The 138 good-unit line contribution sits inside that plan. The two figures are not added.

Production and OEE uses the same line pool.

| Measure | Visual | Value | Target |
| --- | --- | --- | --- |
| Availability | KPI and bar | 83.33% | Unavailable |
| Performance | KPI and bar | 91.75% | Unavailable |
| Quality | KPI and bar | 97.82% | Unavailable |
| Good units | KPI | 2,154 good units | Unavailable |
| Plan attainment | KPI | 93.49% | 100% |
| OEE | KPI | 74.79% | 80% |
| FEED-03 feeder jams | Table | 72 minutes | Unavailable |
| FEED-03 other stops | Table | 24 minutes | Unavailable |
| FEED-03 changeover | Table | 24 minutes | Unavailable |
| OEE trend versus target | Not drawn | Unavailable | The 80% target has no time series |
| Speed-loss Pareto | Not drawn | Unavailable | Plant-wide modes are not supplied |
| Quality-loss Pareto | Not drawn | Unavailable | Plant-wide modes are not supplied |
| Shift comparison | Not drawn | Unavailable | Only the day shift is supplied |

Capacity keeps the theoretical bridge apart from the plan shortfall.

| Measure | Visual | Value |
| --- | --- | --- |
| Theoretical capacity | Bar and table | 2,880 good-equivalent units |
| Downtime loss | Bar and table | 480 good-equivalent units |
| Speed residual | Bar and table | 198 good-equivalent units |
| Final non-good | Bar and table | 48 good-equivalent units |
| Good output | Bar and table | 2,154 good-equivalent units |
| Approved plan | KPI | 2,304 good units |
| Plan gap | KPI and separate table row | 150 good units |
| Active constraint | Not drawn | Unavailable |
| Recoverable opportunity | Not drawn | Unavailable |
| Utilization | KPI | 83.33% run / planned |
| Planned runtime | KPI | 1,440 minutes |
| Actual runtime | KPI | 1,200 minutes |

Maintenance does not show MTBF, MTTR, PM compliance, backlog, repeat failures, or work-order aging. Those records are unavailable. The bars are recorded production downtime minutes: Line 01 48, Line 02 72, Line 03 120. That 120 minutes is not the 150 good-unit plan gap.

Quality is the quality fixture’s selected shift only. First-pass yield 85%. Final yield 90%. Scrap 88 units. Rework 44 units. Burr 132 units. PPM, NCR, and a document count used as a defect rate are unavailable. Hypotheses, actions, verification, and sustainment are shown only from the open investigation.

Flow shows OTIF 91.30% (target 95%), schedule adherence 85.71% (target 95%), and inventory days 4.80 day (target 4.50 day). OTD, fill rate, WIP, turns, shortage, lead time, queue, and starvation or blocking are unavailable.

Safety shows incidents, near misses, open actions, audit findings, closure aging, and repeat conditions as unavailable. It does not infer a safety result from production loss. An open investigation shows its own guardrail status.

## Interaction

Dashboards → Plant operations → Line 03 sets the shared context to Northworks › Line 03. Why? explains the 150 good-unit plan gap, 2,154 against 2,304, and opens the downtime investigation. Investigate then opens that same case at “Record this hypothesis.” Evidence uses the case evidence reply. Reload keeps the conversation context.

Below 768px the frozen shell compacts the context bar. The dashboard repeats Northworks › Line 03 in its own context line. At 390px and 320px the KPI cards stack, the table is replaced by the same rows as cards, and Ask about this, Investigate, and Show evidence stay full-height buttons.

Role depth does not fork the calculation. An engineering session can reveal the source line under each KPI. The numbers stay the same.
