# Unit omission and decision clarification

In the **earlier V19 occurrence matrix**, 125 omitted source unit cells affect **120 distinct mapped base metric definitions**. **Frozen V32 is a different layer: 79 cells are already retained correctly; only 46 source-unit cells are missing, affecting 42 distinct definitions.** There are no retained-unit mismatches. All 125 cells belong to metric rows, not targets; none is unmapped. Repeated entries and conditional aliases reduce the count, while WIP Days maps to two definitions. All 120 affected definitions have nonempty runtime units; all 178 base definitions do too. The evaluator returns `definition.unit` (V32 `app/src/platform/metricEngine.ts:24`). **Earlier extract: 125 metadata losses; frozen V32: 46 metadata losses. Zero confirmed runtime missing units or arithmetic/unit defects caused by either loss.** This is static contract/source reconciliation backed by historical positive API evidence, not a new browser formatting test.

## Priority 1: preserve correct arithmetic; resolve only genuine dimensional ambiguity

| Original source anchor | Classification | Existing runtime and action |
|---|---|---|
| 11–19 | Fraction formulas displayed as % | Runtime multiplies ratios by 100 and returns %. This is correct normalization, not a scaling defect. Multiplying already-percent components together would be wrong; no such correction is proposed. |
| 79–81 | Convertible display units | Source cycle units sec/unit; runtime min/unit consistently uses minute operands. Correct dimensional arithmetic. A source-style seconds display needs value ×60 plus label conversion together; simply relabeling is wrong. No browser display defect established here. |
| 102–104 | Ambiguous source shorthand | Source `min/hr` alongside sum-of-duration formulas; runtime duration is min. If source meant minutes **or** hours, runtime is compatible. If it meant minutes **per** hour, that would be a separate normalized rate, not a relabeling. Do not change duration arithmetic to a rate without naming/binding that requirement. |
| 42, 113 | Genuine quantity-versus-rate ambiguity | Unused capacity subtracts capacity/output; Speed Loss subtracts expected/actual output. Source says units/time; runtime returns good_unit/unit. Quantity arithmetic is dimensionally sound for matched-window totals. A rate interpretation requires a declared elapsed-time denominator and separate metric, not source-unit overwrite. Production capacity/output boundary remains customer configuration. |
| 33; 304, 311, 351 | Quantity basis refinement | Production variance source says units; runtime labels good_unit under its final-good fixture convention, so production numerator binding must be explicit. Labor productivity, employee-hour output and energy formulas already explicitly use Good Units in the original; their good-unit runtime labels are correct refinements, requiring no new formula choice. |
| 66 | Explicit source alternative | Schedule variance allows time or units; runtime selects timestamp difference in min. Correct selected variant; quantity variance must be separately defined rather than replacing it. |

Generic `time`, `currency`, `mass` or `volume` units refined to min/h, synthetic USD, kg or m³ are documentation/binding choices, not demonstrated incorrect arithmetic. Production currency and measurement basis remain governed inputs.

## Priority 2: separations already implemented—do not reopen formula approval

- **Annual versus period inventory turns:** source 264; `ekas.inventory_turns = annual_cogs/average_inventory_value`, unit turn/year. Period turns is a separate definition/cohort. The earlier audit warning describes a potential alias mistake, not a current annual formula defect. Source 265–268 days formulas use matched period totals. Customer partial-period accrual/window rules remain configuration.
- **WIP days:** source 267; value-based `average_wip_value × period_days / period_manufacturing_cost` and physical `average_wip_units / throughput_units_per_day` already split. No money/units division in those definitions. Keep their cohorts separate.
- **Repair versus restore:** source 208–209, 226–239; separate h/repair and h/incident. Bare MTTR clarification is already required, not a choice between changing correct formulas.
- **Absolute versus relative change:** source 466–496, 549–558; percentage-point and percent variants remain separate. Source-default pp comparison is settled. Cost amount/share and cost absolute/percent variants (324, 327–328, 341) are likewise separate.
- **Mixed-product OEE:** original 11–15; MIK-001 211 controls MET-004 component ratio-of-sums; MIK-001 357 capacity family retains its own explicit aggregation context. Keep both contexts. Homogeneous arithmetic is unblocked; do not ask Patrick to choose one universal replacement. Only a proposed unified arbitrary mixed-product interpretation needs controlled source clarification. V-OEE-01 `0.812403` at MIK line 223 is an arithmetic typo: exact 0.8125, same displayed 81.2%; owner document correction, not a new calculation decision.
- **Changeover overrun versus setup variance:** original 127/129 and canonical MET-018/019. Canonical `max(0, elapsed−PUST)` versus signed `AUST−PUST` is settled. MIK line 470's under-standard diagnostic equality needs a source correction; clean 0/−5 calculations require no reapproval.

## Priority 3: actual outstanding method decisions

| Decision | Exact authority anchor | Still unresolved |
|---|---|---|
| D01 / MET-015 | MIK-001 421–432; approved WP-P4-16 input contract §5.3 | Validated recovery formula, causal/countermeasure evidence, overlap handling and validation |
| D02 / MET-016 | MIK-001 433–447; approved input contract §5.3 | Finance/customer-approved economic opportunity method; MET-029 standard-cost doctrine does not define savings |
| D03 / TBC-420 | D-096 23/31; CR-051 45/55; MIK-001 647–660 | Exact confidence thresholds and per-figure versus input-state-combination computation |
| D05 / MET-022 | MIK-001 531–534 | Upper percentile and estimator. Equipment-state precedence, contradictory-sequence quarantine and open-event reporting are already controlled |
| D07 / MET-021 | MIK-001 509–514; approved input contract §6.4 | Pinned Effectiveness/Quality components and setup-inclusive denominator binding |

Do not relabel these as missing unit issues. Their arithmetic/activation prerequisites are independent of the reattached catalog.

## Priority 4: adopted rulings and customer evidence, not new doctrine decisions

- **TBC-417 is resolved:** CR-051 55/66 and current TBC register 302. MET-029 first lens—reconciled conversion hours × approved current standard shop rate—and visible lens/adjacent confidence are adopted (D-096 23–25). No need to reapprove them. Missing customer severity remains `SEVERITY_UNAVAILABLE`; rate applicability to setup/downtime remains explicit customer evidence. CR-051 adoption is not certification or implementation authorization.
- **QAC bridges and scopes are controlled:** no double counting, exact conjunctive scope, ambiguity refusal, presence-state discipline. Broader precedence/transforms, production tolerance and cleared representative quote artifact validation (TBC-418) remain customer mapping/activation work.
- **MET-028 run qualification is adopted:** D-092's 300 consecutive parts within 1–8 hours unless effective customer override. Keep the 490-minute QAC reconstruction separate; no override/reapproval requested.
- **Logical inputs approved:** WP-P4-16. Physical DAT bindings TBC-411..414, controlled active versions and production acceptance remain open. Customer exceptions—conflicting effort, freshness, over-allocation—require adjudication when encountered, not hypothetical new formulas.
- **Original catalog choices not settled by generic canonical rulings:** schedule denominator/calendar/tolerance (63–69); constraint productive-time definition versus run-time (43/369); final-good/rework/unique-count boundary (139–155, 436–443); capability sigma/cohort/measurement protocol (187–199); delivery promise version/cohort (248–256); sustain N/threshold/window (559–563); near-miss normalization (386); reliability/censoring model (210–212). Existing synthetic conventions stay frozen; obtain effective plant/source policy for production, not repeat approval of the fixture arithmetic.

No code, source authority, original inventory, formula, served files or browser state changed. Evidence: `source-to-inventory.csv`, `definition-coverage.csv`, `v28-v32-computation-identity.json`, and `../canonical-gap-spec-v1/decisions-required.json`. The earlier report's broad “ambiguous definitions require decisions” wording is narrowed by this clarification: many are already-separated formulas, adopted doctrine or customer configuration rather than outstanding formula approval.

## Owner correction scope after browser reviewer reconciliation

Only frozen-V32 `sourceRows.unit` / `sourceUnitRetained` metadata for KPI-001..KPI-046 needs recovered original text, subject to owner review. The 79 existing explicit source units match exactly and should stay unchanged. The 41 two-column rows have no original explicit unit cell: do not invent one. Preserve source wording such as `min/hr` and `units/time` as lineage while keeping existing declared runtime units separate. CSV columns `earlierExtractUnit` and `frozenV32SourceRowUnit` make the layers explicit. Direct V32 inspection and the browser reviewer missing-ID set agree; see `unit-layer-reconciliation.json`.

Layer-path correction: the earlier null-unit records are the V19 occurrence matrix. The author `metric-oracle/metric-contract.json` is already byte-identical to frozen V32 and also retains 79 explicit unit cells. Prior wording that attributed all 125 omissions to the author contract was incorrect. The CSV now preserves historical `earlierExtractUnit`, `authorContractSourceRowUnit` and `frozenV32SourceRowUnit` separately.
