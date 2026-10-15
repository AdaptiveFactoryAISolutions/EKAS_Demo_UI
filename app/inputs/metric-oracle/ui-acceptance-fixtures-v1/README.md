# Additive synthetic UI acceptance fixtures — owner handoff

Package: `training-ui-acceptance-v1`, version 1.0.0. **790 fictional raw records / 19 tables / 87 distinct jobs.** This prepares the missing qualifying data, not product integration or independent browser acceptance. No original observations, definitions, oracles, product/served/browser state were changed. Existing 178 and canonical definitions remain untouched.

## Selectable contexts and known answers

| Proposed context | Raw population and expected behavior | Dependencies |
|---|---|---|
| `oee-zero-unavailable` | Three distinct closed shifts on UIA-A1: HIGH OEE 90%, downtime20min; ZERO downtime0min with OEE90%; UNAVAILABLE quality dispositions/equipment classification, OEE and downtime null | F031; F062/C112/A25 |
| `pagination-84days` | 84 distinct daily shifts, July1–September22. Group Observation day (`date_raw`), Good units descending. Total84, returned80, truncatedtrue | A10 |
| `ownership-all-yours` | Reuse source-owned Shared team set (`yours:false`, TP-S2) and Personal set (`yours:true`, TP-S1) metadata against the unchanged original data fixture | F026/C034/A15 |

Default cutoff is **2026-09-29T00:00:00Z**, all observations are closed, UTC. No source is later than cutoff; no present-day or future financial claim. Pagination records represent 84 actual fictional observed shifts, including fictional weekend operation, not a complete scheduled calendar or duplicated records.

High/zero shifts each have 480 planned minutes, 900 unique produced pieces, 864 accepted pieces and a 0.5min/piece effective standard: **432 / 480 = 0.90 = 90% OEE**. HIGH runs460min and stops20min; ZERO runs480min with complete observed primary-state partition and no stop. ZERO is a verified numeric zero, not an absent interval interpreted as zero. First-pass/rework/scrap conservation is explicit. Human person-time stays separate from equipment elapsed.

UNAVAILABLE has positive 480min planned exposure and 900 observed produced pieces, but final quality outcomes and equipment-state classification are unknown. Its selected equipment window is explicitly unclassified; quality values and run/down minutes stay **null**, not zero. It is neither an empty cohort nor zero production. Do not aggregate unknown quality into a supposedly complete OEE numerator.

Downtime controls on the three edge rows:

- Drop zeros removes **UIA-ZERO-DOWNTIME**, retaining HIGH and UNAVAILABLE.
- Drop empty removes **UIA-UNAVAILABLE**, retaining HIGH and ZERO.
- Both retain HIGH only.
- Unrounded OEE >80% admits HIGH and ZERO; unknown has no numeric condition result.

Pagination Good units are **100…183**, one per distinct observed day/job, not replicated records. Native descending sort returns UIA-PAGE-084…UIA-PAGE-005: **80 rows /11,480 good units**. Four hidden rows carry406units; full population **84 /11,886units**, planned40,320min, downtime420min. Current bounded-view export must contain80data rows and disclose total84/truncation. A full-population export needs an explicit all-row query; do not relabel a view export as complete.

## Files

- `raw-records.json`: source facts, exact keys, effectivity, counts, run/stop/unknown intervals, full-window coverage and lineage.
- `known-answers.json`: independently calculated per-job values, units, eligibility and edge/pagination/ownership expectations. **Never import this as runtime observations.**
- `selectable-contexts.json`: exact queries, synthetic labels, dataset/context identity and run context. Selector/import routes are proposed owner integration, not live URLs.
- `ownership-metadata.json`: exact existing test source/hash and retained names/values/yours classification, with isolated IDs. This changes no observation data and grants no real access.
- `schema.json`: table/field types and explicit unit/nullable rules.
- `source-and-protection-binding.json`: V25 request/projection hashes and64 protected existing artifact hashes.
- `build_records.py`: deterministic raw generator; `calculate_oracles.py`: separate calculator; `build_contexts.py`: query/metadata binding; `validate.py`: independent consistency/preservation checks.
- `verification-report.json`: **3,662 checks passed**. `manifest.json` contains deliverable hashes.

## Integration instructions — additive owner work only

1. Copy this package into a **new** `app/inputs/metric-oracle/ui-acceptance-fixtures-v1/` folder. Keep all current58 input files and original/canonical files byte-identical. Production modules may import only raw records and declared context metadata, not expected answers.
2. Add an explicit labelled dataset/context selector. Proposed local route envelope: existing review route with `?fixture=training-ui-acceptance-v1&context=oee-zero-unavailable` or `pagination-84days`. It must actually bind the dataset provider and persist its version with captured results, not merely change a URL/badge. Ownership context selects original `training-plant-v1` plus isolated metadata overlay. No selector is implemented by this package.
3. Current `workspaceQuery.ts` imports a fixed seed and constructs FACTS once. Use a provider/factory that constructs facts from selected relational raw records and performs the same joins/effectivity/cutoff calculations. Do not append these jobs to the original static FACTS, alias them to TP entities or inject known-answer scalars. An explicit envelope `{fixtureVersion, contextId, query, runCtx}` can wrap the existing Query type without redefining original metrics.
4. Calculate planned exposure from the selected job, counts from exact job/lot/operation, ideal cycle from effective revision/operation, and downtime from mutually exclusive intervals plus **coverage**. Complete480min production supports zero downtime; unclassified time supports unavailable. Honor explicit nulls: JavaScript `Number(null)` or `null * standard` would incorrectly turn missing into zero. If internal existing numerical reducers require NaN, create it only as an unavailable representation in the adapter and emit null plus typed availability in captured JSON/API output. Null must propagate through incomplete aggregate values rather than silently dropping the job.
5. Preserve original percentage semantics: workspace OEE value0.90 displays90%; the existing metric evaluator may use90 as percent. Do not compare0.90 to80 or feed90 into fractional UI formatting. Use `>0.8` on the fractional workspace value without rounding first. Keep original measure/metric identifiers, grains and formulas; no new metric IDs are needed.
6. The fixture's sole SiteUIA-S1/LineUIA-L1/AssetUIA-A1 is explicit synthetic context. Apply policy within the selected labelled dataset; do not bypass existing policy or grant original-site access. Ownership metadata is static test classification, not current-user authentication. All/Yours label visibility is not row authorization; selecting a TP-S2 set under enforced Site1 still admits no TP-S2 observations.
7. Give fixture state, caches and captured resources a separate versioned namespace. Cache fingerprints must include fixtureVersion/context and preserve full total84/returned80/truncatedtrue on repeat queries, not recompute total from80cached rows. Existing V25 cached branch reports cached-row length; the new acceptance path must preserve full-query metadata. Retain exact scope, cutoff, units/evidence, filters, masks and unavailable states through capture/history/export. Switching back restores original fixture context, not rewritten old snapshots.
8. Add isolated ownership metadata selection (proposed `?fixture=training-plant-v1&metadata=training-ui-ownership-v1`) or validated fixture importer with a dedicated local store. Do not replace live saved sets or restore an unvalidated entire browser backup. Source test is `src/retained/exactSpecUi.test.tsx:7`; preserve names and classification. New isolated IDs prevent collisions with real/local sets.
9. Integrate raw-derived outputs through actual workspace query/API, then independently retest native UI branches, total/returned/export boundary, repeat-query cache, masks and saved reload. This package makes data dependencies testable; it does not close reviewer IDs by itself.

## Reproduce fixture checks

From this folder run `python3 validate.py`. To regenerate: `python3 build_records.py`, `python3 calculate_oracles.py`, `python3 build_contexts.py`, then `python3 validate.py`. Oracle comparison/integrity is local and synthetic; it does not prove owner API/UI integration or production certification.
