# Canonical metric gap completion — implementation handoff

Prepared from the existing manufacturing kernel documents, without product edits or browser interaction. Everything in this package is **UNCERTIFIED_SYNTHETIC**. Fictional approval records enable synthetic eligibility scenarios; they do not assert customer approval. The original 178 fixtures and frozen Northworks values remain unchanged, verified by hashes.

## Complete gap list and known answers

The 14 missing contracts are MET-011–016, MET-020–021, MET-023–024 and MET-026–029. The three semantic mismatches are MET-018, MET-019 and MET-022. QAC-001 is a governed reference/reconciliation contract, not an additional metric.

| Contract | Distinct behavior / synthetic expected result |
|---|---|
| MET-011 Gross OEE Loss Equivalent Hours | 100 × (1 − 0.60) = **40 h**; no entitlement required |
| MET-012 Available Productive Capacity Opportunity | 100 × 0.75 − 0.01 × 6,000 = **15 h** |
| MET-013 Available Productive Capacity Opportunity Units | 15 / 0.01 = **1,500 pieces**, within one part/rate grain |
| MET-014 Released Clock Time Opportunity | 100 × (1 − 0.60 / 0.75) = **20 h**, distinct from MET-012 |
| MET-015 Validated Recoverable Capacity | **Unavailable**: validation formula, overlap rules and method are still undefined |
| MET-016 Validated Recoverable Value | **Unavailable**: approved valuation basis/method absent |
| MET-018 Changeover Overrun | max(0, 85 − 40) = **45 min**; inside-standard case gives 0 |
| MET-019 Setup Time Variance | 55 active setup − 40 standard = **15 min**; signed variance permits −5 |
| MET-020 Tooling-Induced Changeover Delay | **30 min**, with explicit synthetic tooling causality; press failure is unnecessary |
| MET-021 Net Equipment Effectiveness | Candidate (7 / 8) × 0.80 × 0.95 = **66.5%**; component/version binding requires resolution before admission |
| MET-022 Equipment Restoration Time | Technical loss-to-available **120 min**; detection-to-available **115 min**; production restoration **150 min**; release lag **30 min**. Aggregate publication withheld pending distribution protocol |
| MET-023 Work Order Administrative Closure Time | **240 min**, separately per WO; never substitute for restoration |
| MET-024 Maintenance Response Time | Notification-to-ack **10 min**, arrival **20 min**, work start **30 min**; anchor must be named |
| MET-026 Maintenance Labor Effort | Deduplicated concurrent person time **90 person-min = 1.5 person-h** for one repair; equipment union is separately 60 min |
| MET-027 Current Commitment Exposure | **2 exposed lines / 100 open pieces**; 1 unknown line, coverage 5 / 6. Unknown links are not “not exposed” |
| MET-028 Quoted-versus-Demonstrated Rate Gap | Separate below/equal/above runs yield **25 / 0 / −25 pieces/h**, or **25 / 0 / −25%**. No blended package rate or inferred severity |
| MET-029 Standard-Cost Loss Equivalent | Candidate 24 h × 100 USD/h = **2,400 USD**; published amount/confidence pair withheld pending governed confidence and applicable rate basis |
| QAC-001 | Bridge B: **3 + 3 + 18 = 24 h**; Bridge A: **10 + 8 = 18 h**; both residuals zero |

There are 12 contracts with source-shaped numeric synthetic examples, three with conditional arithmetic (021/022/029), and two with undefined methods (015/016). This does not claim production certification or complete owner integration.

## Deliverables

- `gap-contracts.json`: authoritative source fields and line pointers for all 17 contracts, required inputs, units, scope/grain and governance; candidate metric version pointers retain the register's DRAFT status.
- `domain-schema.json` and `raw-domain-records.json`: 43 tables / 1,431 fictional records, explicit raw intervals, counts, scope and provenance. Separate namespace; no implicit joins to the original 178 fixtures.
- `positive-oracles.json`: 25 traced positive or conditional cases, expected arithmetic, as-of cutoff, raw record IDs, units and publication state.
- `negative-boundary-fixtures.json`: 60 isolated mutations and expected arithmetic/unavailable results. Fixture diagnostic names are not proposed production enums; source-defined refusal codes retain their authority.
- `qac-reconciliation-oracle.json`: seven typed quote assumptions, explicit value/zero versus missing states, independent parent conversion intervals and classified productive-loss intervals, both reconciliation bridges and lineage.
- `api-result-contract.json`: proposed mock envelope and per-metric metadata, eligibility/coverage, unknown/open population, anchors, versions, source watermarks, lineage and typed unavailable results. This is not a claim about the current live API.
- `decisions-required.json`: 14 unresolved governance/source questions with source anchors; no missing policy was invented.
- `source-and-protection-binding.json`: authoritative document hashes and protected pre-existing artifact hashes.
- `verification-report.json`: 75 package integrity checks passed, including source/protection hashes, lineage, raw partitions and independently stated arithmetic. `negative_fixture_checks.py` passes all 60 cases.

## Owner implementation sequence

1. Add isolated canonical fixture contexts using these raw records and exact IDs. Preserve existing 178 contexts, scenario behavior and source semantics. Translate fixture-only diagnostics to the approved API contract explicitly.
2. Implement the 12 numeric contracts with scope, eligibility, effective versions, cutoff and coverage metadata intact. Exercise both positive cases and their negative mutations through the owner API and UI.
3. Expose typed unavailable/conditional states for 015/016/021/022/029. Resolve the decisions below before activating unresolved calculations or publication.
4. Implement QAC-001 typed records and two independent reconciliations. Never default missing allowances to zero, collapse the seven assumption types, silently pick quote precedence, or double-count transformed losses.
5. Confirm controlled active metric versions and approved source/DAT mappings before certification. Preserve the certified-serving refusal gate from MIK-002; local synthetic arithmetic is not a certified path.

## Decisions and limitations

**Revision 1.0.1:** read `DECISION-SUMMARY.md` and the categorized decision overlay before treating the original gap statements below as new approval requests. TBC-417 was resolved by later CR-051; customer severity is independently absent. Approved logical input mapping is now explicitly bound. MET-027 has six independent accepted-completion facts and new non-substitution checks.

Undefined calculation/method decisions remain for MET-015/016, MET-029 confidence (TBC-420), restoration percentile selection and NEE component binding. Customer severity, shop-rate applicability, QAC adapters, source exceptions and physical mappings are separately categorized configuration/activation work. TBC-417 is resolved by CR-051, not an open method decision. See the 14 categorized dispositions in `decisions-required.json` and their concise explanation in `DECISION-SUMMARY.md`.

Two source contradictions are retained explicitly: MET-018's clamped overrun cannot universally equal its signed diagnostic expression when under standard; the source's alternate OEE aggregation forms need reconciliation. The capacity fixture is homogeneous so those OEE forms coincide here, without silently choosing a general mixed-part rule.

The QAC 10,000-piece/12-run reconstruction deliberately reproduces the source arithmetic. Its 490-minute machine production intervals exceed MET-028's default 480-minute limit. It is **not** reused as a qualified MET-028 positive run. Separate four-hour rate runs supply those positives; this reconstruction does not prove that all possible source benchmark reconstructions fail qualification.

No representative real quote artifact, customer-approved transformation or independent production certification is claimed. Synthetic causal evidence is hypothetical. The 1e-9 comparison tolerance is for these oracle checks only, not a proposed governed production tolerance. All original fixture/served/browser state was preserved; no product source, server, browser tab or owner test was changed or run.

## Reproduce isolated checks

Run from this directory using Python 3:

```sh
python3 negative_fixture_checks.py
python3 verify_package.py
```

Generators are provided for auditability (`build_records.py`, `build_oracles.py`, `build_spec.py`). They are separate from product implementation. Running package checks proves package integrity/expectations, not that the EKAS owner implementation passes them.
