# Independent EKAS metric contract and synthetic-data handoff

This is a test oracle/specification, not owner implementation acceptance or production integration. All work is local to `/home/pat/Documents/Codex/2026-10-09/task/metric-oracle/`. No candidate source, browser, unfamiliar template code or production system was executed/changed.

## Coverage and deliverables

- `metric-contract.json`: all **322 occurrences**, **28 sections**, **257 all-type source keys** and **162 tentative analytical groups** reconciled without exclusions. Each occurrence retains its exact original ID, name, kind, source-line anchor, formula, family and flags plus explicit resolved IDs/bundle/unresolved disposition. Source IDs are not unique occurrence IDs; use `occurrenceReviewID` as the join key.
- **178 explicit executable arithmetic definitions** with expressions, units, operands, scope/grain policies, aggregation rules, prerequisites and boundary cases. This exceeds162 because some tentative groups contain incompatible quantities and because independent demo extensions are explicit. These are not178 approved production KPIs. Source mathematical shape, required operand governance, and proposed demo conventions are distinguished. All178 have an independently computed algebra known-answer binding.
- `known-answer-scenarios.json`: **24 focused cases**, plus **15 boundary/negative cases**. Cases are separate arithmetic cohorts, not one asserted physical plant. Raw expected values are unrounded; absolute/relative1e-9 tolerance is specified. Every formula is computed by safe AST arithmetic in `build_contract.py`, with no eval/template imports. Host eligibility/dimensional checks are required before using the expression evaluator.
- `training-relational-seed.json`: separate `training-plant-v1`, finite coherent joined records. `relational-spec.json` defines tables, source bindings, time/effectivity/scope policies, remaining prerequisites and sparse-data behavior.
- `seed-query-oracles.json`: expected aggregate results independently calculated from that actual seed, including unequal order/line OTIF and mixed-cycle production.
- `northworks-freeze-contract.json`: exact source identities/hashes, locked values and temporal gates. No training backfill into unsupported Northworks contexts.
- `spc-demo-conventions.json`: explicitly proposed SPC extension, with numerical Xbar/known-sigma and p-chart checks. No source-approved universal run rule or stability certification is invented.
- `validation.json` and `relational-validation.json`: source preservation/counts, all-definition oracle coverage, **1,939 checked foreign-key references, zero dangling references**, reconciled job intervals/counts and raw capability summaries.
- Reproduce with `python3 build_contract.py`, `python3 build_relational.py`, then `python3 finalize_spec.py`, from this directory. These are independently authored scripts, not supplied template code. The finalizer adds grain/governance enrichment after the builder; run in that order.

Occurrence disposition counts:175 executable-definition bindings,1 explicit source-definition split,65 conditional alias/concept bindings,18 unresolved choices,3 multi-quantity bundles,7 illustrative reference targets,35 registry fields,17 governed non-scalar concepts and1 explicit unresolved shorthand. These sum322. All unresolved items remain present with rationale/candidates; they are not arbitrary metric exclusions.

## Sources and authority limits

Read-only source paths:

- `/home/pat/Documents/Codex/2026-10-08/task-3/evidence/template-coverage/metric-coverage-plan.json`
- Same directory: `INDEPENDENT-ACCEPTANCE-PLAN.md`.
- `/home/pat/Documents/Codex/2026-10-08/task-4/TEMPLATE-INTEGRATION-ASSESSMENT.md`
- `/home/pat/Documents/Codex/2026-10-08/task-4/ekas-template-adaptation/app/inputs/metrics.inventory.md`, `metrics-source-occurrences.json`, `metrics-source-sections.json`, `canonical-metric-groups.json`, `metric-alias-guards.json`, `metrics-missing-rows.json`.
- Same inputs directory: `scenario-fixture.json`, `production-jobs-fixture.json`, `scenario-temporal-policy.json`; Northworks freeze manifest additionally records maintenance/knowledge/SME-change fixture hashes.

The inventory cites an original **729-line `Pasted text.md`**. That original was not located in the scoped owner/reviewer paths or Downloads name check. Retained occurrence formulas/anchors are verified against the supplied structured source inventory, not independently against original full text. The plan's `sourceSha256` was not established as the original metric-document hash and is not presented as such. This is a remaining provenance limitation. Inputs' alias guards explicitly say conditional naming is not approved plant semantic equivalence. Source reference targets (including85%OEE) are illustrative; they must not overwrite Northworks' governed targets.

## Highest-priority definition decisions

1. **Mixed-product OEE:** homogeneous source A×P×countQ is accepted mathematically. Across mixed cycle times, pooled ideal-good time/planned time requires time-weighted quality to decompose; count-quality is a separate valid ratio. Do not quietly redefine it. Example totals100units×0.5min +50units×1min, good90/40: ideal-total100min, ideal-good85min, planned200/run150. Time-weighted OEE42.5%; count-Q86.6667%; count A×P×Q43.3333%. Proposed mixed time-weighted extension remains subject to governed approval; frozen single-cycle Northworks unchanged.
2. **Tentative group collisions:** split currency/percent cost variance (KPI129/130), scrap cost amount/share(KPI126/136), absolute/relative improvement(KPI183/184), constraint run/productive utilization(KPI024/146), and bundle quality-loss units/time(KPI171), target variance(KPI176), direction-sensitive unfavorable gap(KPI173).
3. **Inventory turns:** source says annual COGS; D07 acceptance says period turns. Annual and period IDs are separate. Do not annualize90days silently. DIO needs matching valuation/COGS period; value-based WIP days and physical WIP residence time cannot share a denominator.
4. **MTTR/reliability:** active repair elapsed, restoration elapsed and technician person-hours are distinct. MTBF is descriptive exposure/failure ratio. Complete failed-life MTTF is a proposed complete-case demo calculation, not survival inference with censoring. Constant-hazard reliability is conditional; Weibull fit/uncertainty are prerequisites, not inferable from a few WOs.
5. **Quality:** defective units differ from defects. Final accepted count needs terminal unique-unit dispositions; subtracting reject/rework/scrap independently can double count. FPY never includes recovered rework. RTY must retain aligned route cohorts.
6. **SPC/capability:** within estimator, overall estimator, subgroup design, sample adequacy, MSA and stability require explicit policy. Proposed pooled within sample sigma and sample overall sigma are transparent; raw25×5 seed has mean100/within2/overall2.5. Cp/Cpk1.6667 andPp/Ppk1.3333 are algebra expectations, not certification. Zero sigma, invalid limits or inadequate/unknown qualification are withheld.
7. **Speed loss:** source formula produces units, while retained missing-rows units say units/time. Executable quantity unit is units and conflict is retained. Performance-loss time is a different metric.
8. **Schedule/OTIF:** freeze plan/promise version, order vs line vs quantity grain and time tolerance. Training schedule-adherence quantity convention is proposed. OTIF order conjunction must cover all its lines; OTD delivered cohort differs from due-order OTIF cohort.
9. **Improvement:** signed post-minus-pre is not benefit direction. For loss60→30, signed change−30min/shift and−50%; favorable reduction+50%. Locked eligible10-shift windows and guardrails determine acceptance; action closure/approval alone does not.
10. **Shorthand:** MTTR, utilization, attainment, throughput, yield, PPM, WIP, scrap, cost/unit, trend, gap and late orders require explicit resolver choices. Registry fields, root-cause claims, SMED and audit methods are typed governance objects, not fabricated scalar metrics.

## Known-answer highlights

| Family | Independent expected values |
|---|---|
| Frozen Northworks Line03 | planned480/run360/total648/good630; A75%,P90%,Q97.222222%,OEE65.625%; time bridge480−120−36−9=315ideal-goodmin |
| Frozen plant | planned1440asset-min/run1200/total2202/good2154; A83.333333%,P91.75%,Q97.820163%,OEE74.791667%; never mean line percentages |
| Capacity/plan | 2880−480−198−48=2154; capacity loss726; plan2304 gap150; production-vs-plan93.489583%; capacity ratio74.791667% |
| Unequal ratios | 10/10 and45/90 pool55/100=55%, not75% |
| Flow/setup | lead120min,value-add50→41.666667%; last-good/new-good30min; two changes total50→25min/change |
| Quality/route | FPY90%; defect-unit8%,DPU0.12,DPMO24000 with500opportunities; RTY90/100×80/90=80%; source98%×97%×99%=94.1094% |
| Capability | μ100,LSL90,USL110,within2,overall2.5→Cp/Cpk1.666667,Pp/Ppk1.333333 |
| Maintenance | 1000operatingh/4failures→MTBF250h;8activeh/4repairs→2h vs12restoreh/4incidents→3h;3/4on-timePM→75% |
| Delivery | focused2/4orderOTIF50%; actual joined seed6/12orders50%,15/24lines62.5% |
| Inventory | opening300/closing500→two-point average400;90dayCOGS800→periodturns2,DIO45days; annualCOGS3200separate→annualturns8 |
| Labor/cost | 10good/5personh→2good/personh; costCOQ20+30+85+15=150,COPQ100; cost estimate is not realized savings |
| Energy/safety |100kWh/50good→2kWh/good;idle10%;peak40kW;2recordables/200000h→TRIR2,DART1 |
| Trend/Pareto | [10,12,14] mean12,sampleSD2,slope2/day,CV16.666667%; ninecategories9..1total45,Other1aftertop8 |
| Improvement | Northworks10shift mean60→30; reduction50%; fiveeligible<=45sustain observations;55/58in two consecutive eligible periods trigger recurrence onNov3 |

## Relational seed and time/context rules

Actual finite seed includes2sites,4lines,8assets,4products×2revisions×3operations,24jobs/lots,90calendar periods,12weekly windows,120stops in9reasons,125measurements25×5,20failures,12WOs,8PMtasks,6documents (obsolete/current conflict),4cases/2blockedECs,12orders/24lines,6inventory items,24labor shifts,90daily energy readings/91meter boundaries and3demand intervals,one cost table and2safety events.

The six-day production population is intentionally sparse, not90days production. Second assets lack operating facts rather than having fabricated zero OEE. Energy exists only at site1;45minutes demand cannot certify whole-period peak. Inventory lacks COGS in raw seed; focused arithmetic COGS input must not masquerade as ledger fact. Finite seed support for broad families does not mean every declared metric can be calculated from every context. Remaining prerequisites are documented, with explicit availability rather than arbitrary exclusions. Focused oracles can drive unit tests; raw seed drives coherent joined mock-query tests.

Namespace+ID+version foreign keys; half-open intervals; effective standards by exact product/revision/operation/date; UTC storage plus IANA site calendar; known-at and dependency visibility; completed observation end<=as-of; coverage/exclusion lists and mask propagation. No P3/P2 substitution; no training fallback into Northworks. No join multiplication, parallel interval double counting, snapshot balance summation or percentage averaging.

Frozen initial as-of6Oct14:45/data cutoff14:00 excludes15:10repair,Oct20verification andNov3recurrence. Later snapshots are explicit. Preserve safety review, five-shift sustain and recurrence gates. No measured improvement is assigned to unreleasedEC003, and financial realization stays unavailable.

## Owner integration and remaining blockers

Bind expressions to typed sufficient statistics after eligibility, never eval arbitrary saved formulas. Share one canonical result ID/context/definition across chat/chart/table/board/presentation/export/evidence. Unsupported/missing/masked/zero-denominator/invalid and observed-zero are different states. Preserve all322dispositions in the searchable registry, including non-scalar behavior and clarification. Do not claim178 executable production metrics from passing arithmetic tests. Source-original provenance and plant-definition decisions above remain open.

The two-hour board demonstration should use frozen Northworks for the full loss→knowledge→governed action→later verification→sustain→recurrence journey, and an explicitly switched training namespace for wider metrics. Include unavailable/blocked/model-prerequisite paths honestly. This specification does not replace42screen/85workflow/191control acceptance, owner full builds/tests or actual end-to-end rehearsal. No production connections, learned ML, authorization, document release, work dispatch or realized financial benefit is asserted.
