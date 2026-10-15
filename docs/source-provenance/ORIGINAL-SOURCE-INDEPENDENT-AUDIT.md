# Reattached manufacturing catalog: independent source reconciliation

The missing-source blocker is closed for content review. Library attachment `libfile_7339ee5c81ac8191b5e8d303994a1f71`, version 0, materialized as `source/Pasted text(4).md`, is content/anchor-compatible with the source used by the retained inventory. Identity rests on all 322 occurrence anchors, every named table row and formula, all 28 section headings, registry fields and end-of-catalog aliases—not its filename or line count. No previously recorded original-byte hash was supplied, so historical byte identity cannot independently be proved.

Exact source identity: SHA256 `85d4602f63c2fbb432a43d2dbe1482839830f57a6805246090e45e2de8f2100e`; 33,179 bytes; 729 logical lines; 728 LF characters; no trailing LF. Retained inventory SHA256 independently matches `c642387150f6501b5e4e1a3790fcb2c98a5992f163ea702d2a0b00580424e348`. Source bytes and all existing source, inventory, oracle and builder files were preserved. Prose inside the attachment was treated as evidence, never instructions.

## Coverage and omissions

| Check | Result |
|---|---|
| Derived inventory against existing occurrence extracts | All 322 IDs, names, kinds, keys, line ranges and formulas match exactly |
| Independent original named table enumeration | 166 table entries: 159 metric entries and 7 illustrative targets; every entry mapped; no missing named table row |
| Original analytical/model formulas | 22 occurrences match formula text in anchored source, including multiple-formula bundles |
| Registry and concluding aliases | 35 fields plus 69 alias mentions; each literal name exists at its recorded anchor |
| Concepts/governance | 30 anchored concepts manually reviewed; conceptual records describe prose rather than literal scalar formulas |
| Base definitions | All 178 present and structurally identical in V32's imported metric contract |
| Original unit retention | Earlier V19 occurrence matrix: 125 explicit cells absent. Frozen V32 sourceRows: 79 retained correctly, 46 absent across 42 distinct definitions; runtime units present |
| Later normative catalog | 29 primary MET contracts reconciled separately; 17 later gap contracts are not missing original-source entries |

The earlier V19 occurrence matrix lost all 125 explicit source unit cells (120 distinct mapped definitions). This is a separate layer from frozen V32: its sourceRows already retain 79 correctly and lack only 46 cells (42 distinct mapped definitions). No retained unit mismatch was found. The owner correction scope is source metadata for KPI-001..KPI-046 only; preserve the other 79 cells and all runtime units/arithmetic. The recovered units are in a separate matrix; no product inventory was overwritten. Another 41 table rows are two-column tables and have no explicit unit cell in the original; inferred dimensional units must not be attributed to it. Some analytical units are expressed in surrounding prose rather than unit cells.

The 322 occurrences are not 322 distinct executable KPIs. Their retained dispositions are 175 executable-definition occurrences, 65 conditional aliases/concept bindings, 35 registry fields, 18 choices requiring resolution, 17 non-scalar concepts, 7 illustrative targets, 3 bundles, 1 definition split and 1 explicitly unresolved item. These are specification classifications, not production execution/certification states. Repetition across the daily audit, reference table and concluding library is intentionally preserved. `repeated-names.json` lists repeats; `source-to-inventory.csv` includes every original anchor, source text, unit, disposition and definition mapping.

No omitted named table/formula requirement was found. That narrower result does not mean every narrative governance requirement has been implemented. The inventory's broad concept ranges should be supplemented by explicit acceptance evidence for the requirements below.

## Formula, unit and semantic findings

| Source lines | Finding and required interpretation |
|---|---|
| 11–15, 399 | Original OEE is A × P × count-quality. Base implementation uses ideal-good-time/planned-time. Equivalent at homogeneous cycle basis; mixed products can diverge. Existing conflict is explicit; keep count-quality and time-weighted quality distinct. Recovery of this source does not authorize a formula switch. |
| 43, 369 | Constraint utilization uses run time in one occurrence and productive time in another. They require separate definitions unless an approved plant policy establishes equivalence. |
| 113 | Speed Loss is a difference of potential and actual output but has source unit `units/time`. Quantity difference versus rate requires explicit period interpretation; do not silently substitute performance-loss minutes. |
| 42 | Unused Capacity also pairs output subtraction with `units/time`; available capacity and output must be expressed on the same time basis. |
| 63–69, 402 | Schedule adherence has configurable denominator; quantity, orders, jobs, due-date tolerance and frozen schedule version must be governed. Similar schedule/plan attainment names are conditional aliases. |
| 139–153 | Final quality/yield versus first-pass yield and accepted rework must remain distinct. Good Count subtraction can double-count overlapping scrap/reject/rework dispositions without a governed unique-unit boundary. |
| 187–199 | Cp/Cpk and Pp/Ppk require distinct within/overall sigma, justified estimator, sample adequacy and measurement-system integrity. Numeric arithmetic alone is insufficient. |
| 208–212, 226–239 | Repair MTTR and restore MTTR are distinct; bare MTTR needs clarification. MTTF needs censoring/cohort policy; exponential reliability is a conditional constant-hazard model. |
| 248–256 | OTD/OTIF need original versus revised approved promise dates and explicit delivery/order cohort. |
| 264–267 | Inventory Turns specifies annual COGS; a period-turns fixture must be labelled separately or annualized by policy. WIP Days permits manufacturing cost or throughput: value and physical-unit denominators cannot be mixed. |
| 324, 327–328, 341 | Scrap cost amount versus cost share, and absolute cost variance versus percent variance, require distinct units/IDs. |
| 410–419 | Seven reference targets are illustrative, not activated plant targets. Do not hardcode OEE 85%, schedule 95% or quality-loss 2% from this table. |
| 436–443 | Quality loss units is total minus good; quality loss time uses defective count × ICT. Defective count need not equal total-minus-good under every rework disposition. The occurrence is a two-quantity bundle. |
| 448–459, 487–496 | Unfavorable gap depends on good direction; positive-only ranking must retain signed underlying gap. Target variance is actual minus target, with a separate normalized version. |
| 466–487 | Absolute percentage-point change and relative percent change differ; percentage points are the source default for percent-valued KPIs. |
| 515–520 | Volatility is standard deviation or CV; sample versus population estimator and zero/nonpositive mean must be governed. |
| 549–563 | Post-minus-pre improvement is not automatically favorable for lower-is-better measures. Sustained improvement requires threshold and N consecutive periods; the source does not approve a universal N=3. |
| 386 | Near-miss exposure denominator and normalization factor remain unspecified; a meaningful numeric rate cannot be certified from this prose alone. |

`formula-unit-policy-findings.json` preserves all 21 existing conflict families with their recovered anchors. The source corroborates these limitations rather than resolving them by reattachment.

## Narrative and status requirements

Source line 3 explicitly frames a target catalog rather than blanket execution/certification. Important independent acceptance obligations are configurable schedule definitions (69), good/reject/scrap/rework boundaries (155), capability prerequisites (199), MTTR clarification (226–239), promise-date policy (256), plant target override (419), benefit-direction ranking (459), percentage-point semantics (487), configurable sustain threshold/window (559–563), and governed metric identity/effectivity (588–627, 727–729).

The registry has 32 proposed fields at 588–619 and three independent recognition/execution/certification axes at 625–627. The FPY ACTIVE/UNAVAILABLE/UNAVAILABLE example at 634–639 is explanatory, not a current product status receipt. Source line 648 claims API coverage of 59 catalog subjects; it supplies no test evidence and is not used as proof. Lines 652–683 distinguish deterministic metrics, derived observations, investigation and root cause; correlated observations must not be promoted to proven root cause.

## Implementation and later canonical extension

`definition-coverage.csv` traces all 178 base definitions to their occurrence IDs and exact original lines, retaining proposed implementation expressions, units and conflicts. V32 imports the same complete contract and exposes its definitions in `metricEngine.ts` lines 1–2. All seven computation/binding/canonical modules examined are byte-identical to the independently tested V28 modules (`v28-v32-computation-identity.json`). Prior V28 independent evidence includes all 178 original positive-context API results, 25 canonical positive/conditional cases, 60 boundary cases and QAC gates; see `../v28-independent-validation/REPORT.md`. Those receipts remain historical V28 evidence. No fresh browser, live V32 API, provider/model call, storage durability or production certification was performed here.

The later authoritative MIK document declares version 1.0.2 and 29 contracts; it predates this audit but is distinct from the reattached target catalog. `canonical-extension-reconciliation.csv` records authority path/lines, canonical formula, candidate legacy IDs, original anchors and retained normative gaps for all 29. Twelve contracts have legacy analogues outside the 17-contract gap extension; three extension contracts also have legacy arithmetic analogues (MET-018 changeover overrun, MET-019 setup variance, MET-022 restoration). Arithmetic resemblance does not establish normative aggregation, bindings, exclusions, boundary semantics or certified activation.

The extension introduces governed capacity opportunity, recoverability, economic opportunity, restoration boundaries, work-order/response/labor time, commitment exposure, rate gap and dollar valuation. These must not be retrospectively counted as omitted original formulas. Recoverable capacity/economic opportunity, NEE, restoration percentile/bindings and confidence/customer policy decisions remain separate gates. No target recommendation or mock positive fixture supersedes the controlled MIK contract or R4 policy; no savings/realization approval is inferred.

## Closure and remaining work

Close only the authentic-source availability/content-review blocker. The prior statement that the 729-line source could not be located is superseded by this attachment, with its identity above. Keep V32's served state, pending Dot R3 review and R4 policy unchanged. Follow-up work is to carry only the 46 missing frozen-V32 source-unit cells into an approved metadata revision, obtain explicit plant choices for ambiguous operands/denominators, and verify narrative/status/canonical requirements against controlled evidence. That work was not silently performed in this source-only audit.

Files are additive under `metric-oracle/reattached-source-audit/`; `read-only-input-manifest.json` records the source and existing inputs inspected. No source/builder overwrite, formula change, Chrome access, credential inspection, model request, upload or deployment occurred.

## Unit-layer reconciliation correction

The initial “125 omissions” wording described the unit loss in `metric-oracle/v19-completeness-audit/occurrence-matrix.json`, not frozen V32's sourceRows. The browser reviewer's `task-3/evidence/v32/batch2/reattached-source-independent-check.json` is corroborated by direct V32 contract inspection: 125 original explicit cells = 79 exact retained cells + 46 missing cells. The occurrence CSV/JSON now names separate `earlierExtractUnit` and `frozenV32SourceRowUnit` columns. See `unit-layer-reconciliation.json`; the missing ID set matches the reviewer exactly. All 178 runtime definition units remain present. This correction narrows metadata work; it establishes no runtime unit defect or formula-change requirement.

Layer-path correction: the earlier null-unit records are the V19 occurrence matrix. The author `metric-oracle/metric-contract.json` is already byte-identical to frozen V32 and also retains 79 explicit unit cells. Prior wording that attributed all 125 omissions to the author contract was incorrect. The CSV now preserves historical `earlierExtractUnit`, `authorContractSourceRowUnit` and `frozenV32SourceRowUnit` separately.
