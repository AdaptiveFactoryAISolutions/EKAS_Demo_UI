# Decision summary for Patrick and the implementation owner

Revision: canonical-gap-spec@1.0.1. This is a disposition overlay, not an approval or change to source authority. Original gap statements remain in `decisions-required.json`; `revision-provenance.json` preserves prior package hashes. No product code or original 178 fixtures changed.

## Genuine method decisions

- **D01/D02 — validated recovery and value:** What source evidence, formula, overlap handling and independent validation establish recoverable capacity? Which Finance/customer-approved valuation method applies? MET-015/016 remain unavailable. No percentage or valuation default is justified. Basis: approved `WP-P4-16-met-011-027-input-contract.md` §5.3, lines 130–138; MIK-001 lines 421–447.
- **D03 — dollar confidence:** What exact High/Medium/Low rule applies, per figure or per input-state combination? TBC-420 remains open. D-096 already settles standard-cost conversion variance, adjacent confidence, hours evidence and visible lens; do not ask to approve those again. A synthetic $2,400 arithmetic candidate does not establish a computed band. Basis: D-096 Decision items 1–4; CR-051 lines 43–55; MIK-001 line 647.
- **D05 — restoration distribution:** Which upper percentile and estimator should accompany the mean? No default is selected by source. Event arithmetic is defined; published means need distribution. Equipment-state precedence, contradiction quarantine and open-event reporting are already controlled, not new decisions. Basis: MIK-001 lines 531–534; approved input contract §7.
- **D07 — NEE components:** Which versioned Effectiveness/Quality definitions and denominator bind the setup-inclusive NEE formula? The approved input mapping repeats the inputs but does not resolve this. The 66.5% candidate remains conditional. Basis: MIK-001 lines 509–514; approved input contract §6.4, lines 162–166.

## Customer configuration and activation, not undefined clean arithmetic

- **D04/D10/D11 — quote controls:** Obtain customer severity configuration, explicit shop-rate applicability to conversion hours, and any broader-scope precedence or allowance-transform method. Recommended interim behavior, grounded in source: exact-scope rate results with severity unavailable; refuse ambiguous/incompatible mappings. No profitability claim follows from rate gap. Both QAC bridges, four presence states and no-double-count rules are already adopted. Basis: D-092/D-093/D-096; MIK-001 lines 625–636 and 647–677.
- **TBC-417 status correction:** Later CR-051 lines 55/66 and the controlled TBC register line 302 mark TBC-417 **RESOLVED** through the MET-029 doctrine. Earlier D-092's open wording is retained history, not current status. Resolution does not supply customer severity records or thresholds. Missing customer configuration remains separately `SEVERITY_UNAVAILABLE`. TBC-420 is still open.
- **D11 — QAC activation:** A confidentiality-cleared representative quote artifact must validate field/scope/unit/presence-state mapping before activation (TBC-418; D-093 Validation Disclosure; MIK-001 line 677). Existing repository oracle `reconcile(..., tolerance_hours=1e-9)` supports the synthetic tolerance, not an automatically approved production tolerance.
- **D12/D13 — source exceptions:** Conflicting person bookings, negative open quantities and source freshness need customer/source-adapter rules when encountered. Recommended interim treatment: conflict/unknown/refusal; no fabricated split or clamp. Clean deduplicated person effort and current-plan exposure examples can proceed. Basis: approved input contract §2/§7/§8.
- **D14 — mapping/activation:** WP-P4-16 logical inputs are APPROVED/DONE. Physical DAT identifiers TBC-411..414 and controlled active versions remain open. Do not reapprove synthetic metric definitions or infer production certification from them. Basis: approved input contract header and §9; TBC register lines 296–299; MIK-004 DRAFT pointer status.

## Owner-resolvable corrections and separation

- **D06:** calculate MET-018 as `max(0, elapsed−PUST)` and MET-019 as signed `AUST−PUST`. Under-standard results 0 and −5 are defined. The source diagnostic equality requires a document correction for that case, not a new calculation approval (MIK-001 line 470).
- **D08:** keep MET-004 component aggregation (§5, line 211) and capacity-family aggregation (§5a, line 355) in their own contexts. Homogeneous examples agree. Do not silently unify mixed-product formulas or rewrite frozen Northworks values; a unified interpretation requires controlled clarification. The V-OEE-01 `0.812403` discrepancy is a source arithmetic typo; actual 0.8125 still displays 81.2% (line 223).
- **D09:** keep the QAC 490-minute/run reconstruction separate from qualified four-hour MET-028 runs. D-092 already adopts 300 consecutive parts within 1–8 hours unless an effective customer-approved override exists. No new override is needed or requested for separate fixtures.

## MET-027 package correction and known answer

The approved input contract requires **actual accepted completion quantity** independently of **accepted shipped quantity** (line 212). Its retained `TBC-P4-16-027-COMPLETION-SHIPMENT` explicitly forbids inventing equivalence/substitution (line 234).

The revised raw fixture adds six independently stated fictional completion facts: CL-1..6 = **65, 40, 25, 0, 10, 8 pieces**, with acceptance authority, unit, snapshot and lineage. These quantities are not copied or calculated from shipments or finished-goods allocation. Open quantity still uses only the controlled operands:

- CL-1: 100 committed − 20 shipped − 30 approved available FG = 50 pieces exposed.
- CL-2: 80 − 20 − 10 = 50 pieces exposed.
- Total: **2 exposed lines / 100 pieces; 1 unknown line; 5/6 coverage (83.333…%)**.

New boundary cases: missing CL-1 completion or incompatible unit → **1 exposed line / 50 pieces / 2 unknown**; changing its completion to 70 pieces → exposure remains **2 / 100 / 1 unknown**. Shipment never fills missing completion. Unknown CL-4 has an explicit zero completion but still lacks production linkage, so remains unknown.

## Validation and reproduction

Revised package: **43 tables / 1,431 records; 25 positive/conditional cases; 60 negative/boundary cases**. Independent checks validate completion lineage, formula operands, exposure/coverage and prior protected hashes. No API/UI/backend integration or certification is claimed.

Run `python3 negative_fixture_checks.py` then `python3 verify_package.py`. Regeneration order is `build_records.py`, `build_oracles.py`, `build_spec.py` (which applies the disposition overlay), then the two checks. The independent calculator is separate from the raw-record generator.
