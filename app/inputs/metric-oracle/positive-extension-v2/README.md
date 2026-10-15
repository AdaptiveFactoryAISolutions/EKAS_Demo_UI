# Additive positive-case domain proposal v2

**178/178 definitions have reproducible raw-record-backed arithmetic cases. No arithmetic metric remains unsupplied.** This is a data/aggregation proposal, not a report that the owner's service now supports178 metrics. The captured client report remains49 observed/129 unsupported. Fifteen explicit policy decisions remain before production interpretations can be accepted; see `policy-decisions.json` for exact metric IDs.

The positive contexts use an explicit simulated `asOf=2027-01-01`; full-year 2026 actual accounting remains unavailable at the current September/October cutoff. Select a future simulation deliberately, or supply a separate prior-year annual ledger; do not expose future postings in the initial board snapshot.

The sidecar contains **2,802 new records in50 domain tables**, referencing the unchanged `training-plant-v1` dataset through explicit namespace-qualified references. It has its own namespace, `training-positive-v2`, and **15 contexts**. Original Northworks, the original seed, and previous known-answer files were not edited. The original seed's pooled OEE remains79.0494791667%; the new homogeneous TP-J01 context is79.0625%. Never replace one result with the other: their cohorts differ.

## Deliverables

| File | Purpose |
|---|---|
| `additive-domain-records.json` | Versioned raw/domain facts, effective standards and coverage/design records; no precomputed metric values |
| `domain-schema.json` | Fields, units, reference conventions, table counts and scope rules |
| `positive-contexts.json` | Fifteen explicit scope/time/grain contexts; derived sufficient statistics and source aggregation instructions |
| `known-answer-outputs.json` | All178 metric IDs, formulas, units, expected outputs, operand snapshots and source-record mappings |
| `service-extension-map.json` | Each definition's captured client availability/reason and required source families/aggregation work |
| `capability-eligibility-evidence.json` | Computed synthetic protocol checks, raw study references and limitations |
| `policy-decisions.json` | Exact metrics with proposed conventions needing production decisions |
| `negative-and-eligibility-cases.json` | Twelve separately specified no-data/partial/future/masked/eligibility cases; positive seed is not polluted with these |
| `validation.json` | Foreign-key, conservation, eligibility and recognizable known-answer checks |
| `manifest.json` | Output hashes and unchanged base hash |

`build_positive.py`, `verify_positive.py`, and `package_metadata.py` are independent proposal tools. They execute no owner or template code. Reproduce in that order with Python3; generation writes only this directory. Expected outputs belong in the oracle, not in runtime source tables.

## What closes the gaps

Existing source records already provide stop durations/reasons, quality-stage route yields, schedules, inventory openings/movements, demand intervals and safety events. The owner extractor does not yet supply many corresponding operands. New domain records supply asset calendars, frozen demand, explicit capacity/constraint designations, lot journeys, changeovers and setup tasks, unique rejected-piece dispositions, material/cost/rework postings, maintenance plans/labor/backlog/rosters/classifications, nonrepairable component lifetimes, actual immediate-dispatch orders, finance postings, stock replenishment/dispatch, closed WIP unit journeys, raw gauge study/calibration/capability records, and intervention/sustain/action observations.

These are shared domain records. For example, a job's interval/count/standard sources support OEE, loss waterfall, rates, quality, labor and cost; they are not separate scalar fixtures for each widget. Setup tasks share changeover/stop references. Shipment pieces share order records. WIP tokens supply residence, population and throughput together.

## Positive contexts and example answers

| Context | Examples and important boundaries |
|---|---|
| Homogeneous production TP-J01 | planned480 min, run430 min,774 produced,759 accepted; OEE79.0625%; changeover10 min; lot lead600 min, touch450 min; setup internal10/external5 min |
| Daily TP-A1 comparisons | Daily OEE derived from original completed jobs; explicit higher-benefit OEE target80%; lower-benefit downtime target8% has its own context |
| Maintenance | Observed repairable exposure129 h /20 failures gives MTBF6.45 h; active repair6 min and restore10 min remain separate; backlog48 personh /40 availablepersonh gives1.2 weeks |
| Nonrepairable lifetime | Four completed component lifetimes100/120/140/160 h give conditional complete-case MTTF130 h; no censoring inference |
| Due-order delivery | Original12 order conjunction retains OTIF50%; delay uses fully completed late orders only |
| Immediate fulfillment | Four additional100 piece orders each dispatch80 at entry and20 two days later; fill80%; actual shipping, not reservation |
| Annual inventory | Full365 day inventory transactions with replenishment/dispatch and12 monthly COGS postings; annual turns7.5623693; year-end availability required |
| Period inventory/finance |90 day transaction integration and same90 day accrual postings; period turns1.8685121; DIO48.1666667 days; counts5 of6 exactly match |
| Closed WIP flow | Token-level20 WIP units,450 completions over90 days,4 day residence; WIP days/Little-law proxy4 days; separate from monetary inventory |
| Aligned site1 resources | Sixday600 kWh and7,590 accepted pieces; energy/piece0.07905138 kWh; water/waste/emissions use the same scope/window |
| Demand peak | Only the complete three15 min interval window supports40 kW; no90 day peak claim |
| Same-site safety |192 workedpersonh,1 recordable; TRIR1041.6667 is a short-window synthetic standardized rate, not a risk estimate |
| Verified synthetic case | Tenbaseline60 min shifts, tenverification30 min shifts; signed change−30 min/−50%; five sustain shifts28,29,27,30,26 pass stated lower≤30 rule; actions75%closed/50%on-time closed |
| Qualified synthetic capability protocol | New one-characteristic25×5 assessment plus separate30 subgroup baseline; within SD2 mm, Cp/Cpk1.6666667, overall Pp about1.8444478; see protocol qualifications below |

## Statistical qualification is conditional and explicit

The new characteristic has a versioned specification, single applicable operation/revision, calibrated0.001 mm-resolution gauge, distinct pieces,25 rational five-piece subgroups, and a separate30 subgroup frozen baseline. Raw10 part×3 operator×3 trial readings yield repeatability sigma0.01 mm, six-sigma repeatability0.3%of20 mm specification width, zero mean bias and identical operator mean biases. Calibration maximum error0.001 mm is below0.01 mm tolerance.

Assessment points pass the declared Xbar3 sigma and S-chart B3=0/B4=2.089 checks against the frozen baseline. There is **no blanket qualified flag**. This supports the explicit limited synthetic protocol only. It does not establish a full AIAG crossed-ANOVA study, real independence, normality, customer acceptance, expanded run-rule stability, or yield predictions. Additional run rules can change eligibility. The original TP-CHAR1 remains unqualified; new evidence must never silently qualify it.

## Service work required

1. Load the sidecar as an explicit versioned scenario alongside the hashed base. Keep Northworks namespaces and accepted snapshots isolated. Join `(namespace,id,record_version)`; use table-qualified keys and effective times.
2. Implement the `operandSources` aggregation rules. A generic formula evaluator is insufficient: union/partition intervals, deduplicate terminal pieces/orders, match route stages, integrate step balances, scope accounting cohorts, join effective rates, and re-estimate statistics from raw samples.
3. Add explicit context selection and operand-level time bases. A single global operand bag cannot represent these definitions. Manufacturing job elapsed time, pooled asset-time, maintenance due windows, backlog snapshots, annual accounting, meter windows and characteristic samples are different grains. Maintenance context explicitly records its failure/repair, PM/labor and backlog/roster subwindows.
4. Require raw eligibility/coverage evidence at calculation time. Complete45 min demand coverage does not authorize90 day peak; sixday resource and production windows must align. Reject missing/masked/future inputs; retain unsupported grouping until implemented.
5. Evaluate capability protocol details rather than merely accepting strings such as `msaStatus='qualified'`. Preserve limitations and protocol versions in the result/evidence view.
6. Use known answers to test the real service after integration. This proposal has not run the owner service or changed its advertised coverage.

## Remaining unsupplied metrics and decisions

**Unsupplied arithmetic metrics: none.** Every178 definition has an explicit raw-record-derived example. This does not resolve all source-policy ambiguity. `policy-decisions.json` names the exact affected IDs for mixed-cycle OEE, capacity, productive constraint time, schedule tolerance, loss taxonomy, lot clock, lifetime/reliability assumptions, delivery grain, accounting horizons, Little-law cohorts, cost conventions, capability qualification, safety exposure, improvement eligibility and energy boundaries.

Positive demonstrations use declared conventions; they do not establish approved production meanings. No savings are finance-approved, no live intervention occurred, and no capability or safety certification is claimed. The original729 line source document remains unavailable; this expansion relies on the previously reconciled retained source extracts.

## Verification performed

All178 definitions mapped uniquely; all output operands have resolving source-record IDs. **3,453 namespace-qualified/local references resolve**. Twenty-four lot journeys conserve600 min; warehouse balances stay nonnegative and close at50 pieces per item;90 dispatches match stock movements. Four immediate orders conserve100 pieces each. The closed WIP population stays20 units with450 completions and exact fourday residency. Recognizable expected values and raw synthetic capability checks pass. Frozen base pooled OEE is rechecked unchanged.
