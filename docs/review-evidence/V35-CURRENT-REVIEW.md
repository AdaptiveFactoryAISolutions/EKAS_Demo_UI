# Independent current review — V35

**310 pass /41 partial across351 cumulative criteria.** Catalog is newly closed. The source-unit presentation gate is closed, while broader A06 semantic/governance acceptance remains partial. The missing-formula presentation fix is accepted for explicit-null snapshots but does not cover omitted snapshot metadata. The demo is not production-ready or fully accepted.

## Identity and reviewed scope

Actual browser URL: `http://localhost:18191/ekas-review/?suite=workspace&fixture=training-ui-acceptance-v1&context=oee-zero-unavailable`.
Actual served main script: `index-DCV_LXI2.js`. Parent deployment manifest binds ZIP SHA256 `2e81f5b9862d798fd23d10b1368422e1e2c6638346dcdc8f44d126ec94330deb`. The owner reports907tests/build/typecheck/portable checks passing; this reviewer did not rerun or equate them with native browser acceptance.

Fresh V35 coverage: Catalog default list/alias/unit/title/no-match/recovery/reload/mobile; explicit-null and omitted formula-snapshot states; null Search/Grid/headline/source evidence; all46 recovered source-unit occurrences across42 metric selections; positive defined43.20formula/reload/evidence; saved-answer-to-working-copy editing; baseline preservation. Desktop1854×909 and narrow320/390 were inspected through actual screenshots and supported browser controls. Dark-only is the clarified product contract; no light-mode acceptance is required.

The remaining cumulative records retain their original version/evidence identity. A pass in an earlier version is not described as a fresh V35 execution. The separate Dot/security cohort is not added to351 or silently accepted.

## Verified V35 changes

**Catalog:** No-match now says “No matching definitions. Clear or change the search.” Alias `effectiveness` returns OEE; unit `kWh/unit` returns Energy intensity; title `First-pass yield` returns its definition. Changing search restores results. No-match search survives reload. Desktop and390px empty-state screenshots are legible. This completes the bounded read-only Catalog acceptance; no definition approval is inferred.

**Explicit-null formula metadata:** Search and headline now explain that the saved custom formula definition and units are missing, its result is withheld, and a formula should be chosen before rerunning. Native Grid heading is “Custom formula unavailable (units unknown).” All three scopes remain Unavailable; no zero/numeric fallback appears. Headline retains10/9/9 source-reference counts. Native source disclosure retains exact fx identifier, all existing evidence identifiers, synthetic description, and2026-09-29 cutoff. Reload retains the message. Diagnostic reasons in the evidence layer remain unchanged.

**Source units:** Each of the46 recovered occurrences was selected through the visible Exact definition UI. All46 source anchors/literal units and46 implementation unit strings match the deployed metadata. Run Time shows `Source unit: time` versus `Implementation unit: min`; OCC001/KPI001 at line11 displays `%`. OEE occurrences at lines399/411/691 explicitly state “No explicit source unit cell,” preserving the distinction from implementation `%`. Unit presentation survives reload and stacks vertically at320px.

The source facts remain322occurrences,28sections,162tentative canonical groups and178arithmetic definitions. The authentic reattached729-line/33179-byte source hash is `85d4602f63c2fbb432a43d2dbe1482839830f57a6805246090e45e2de8f2100e`; previous independent review matched all322source spans. Historical original byte identity remains unprovable without the earlier hash. The literal source-unit layer has125explicit cells:79retained plus46recovered;41two-column source rows have no explicit unit. Unit display does not certify formulas, denominators, effectiveness dates, causal explanations, or an approved ontology.

**Regression spot checks:** Defined good-units/downtime formula returns43.20units/min; zero-downtime and missing-input scopes remain unavailable. Names/units/cutoff/evidence persist after reload. Opening saved OEE by Job creates a working query with90/90/Unavailable. Its retained native layout restores; working-copy layout editor enters and exits. The original saved answer remains byte-identical in exported state. This is working-copy evidence, not a fresh read-only shared-capture guard retest or genuine authorization test.

## Actionable current findings

1. **Missing-property diagnostic gap:** The V33 test state omits `formulaSnapshot` entirely while its global custom definition is unavailable. V35 still withholds every value, but keeps a raw fx Grid heading and generic “unavailable or masked” copy. The new presentation helper only recognizes explicit `null`. Support both actual absent-metadata representations after establishing no available definition; keep unknown versus zero-denominator reasons distinct. Evidence: `missing-reason.dom.txt`, `missing-reason-desktop.png`; contrast `null-reason.dom.txt`/`null-source.dom.txt`. This is incomplete fix coverage, not a numeric regression.
2. **320px provenance text overflow:** OCC163/254 raw disposition names overflow their239px paragraphs (scroll widths273/254px). Page-wide width remains constrained, so this is local text overflow/clipping, not a whole-page horizontal-scroll claim. Use readable disposition labels, wrapping, and expandable technical IDs. Evidence: `source-oee-320.png`. Literal and implementation units themselves match.
3. **Visual hierarchy:** The workbench remains dense: two navigation tiers, prominent technical disclaimers, tightly adjacent inline selectors, and long provenance prose compete with the result. Source-unit labels are now truthful, but a compact structured source/implementation comparison and spacing around scope/time controls would improve scanning. Mobile stacks correctly but requires substantial vertical travel. The null diagnostic appears above the large column picker and again near the result; make the result-level explanation easy to reach without duplicating a long paragraph.
4. **Broader retained gaps:** Plan/Data usage and Maintenance/Terms are limited informational shells. Developer Home/Embed playground alias existing surfaces. Bounded NL, Studio evidence projection, full raw-denominator inspection, native print, and whole-screen aggregate coverage remain partial. Complete exact linked branches before making full-screen acceptance claims.

## Dispositions and blockers

The42prior partial criteria now comprise one Catalog pass and41partials. Exact dispositions follow; categories are not independent defects.31aggregate criteria still require linked normal UI acceptance; four native-print/tool-limited criteria, two protected-scope criteria, three capability/contract criteria, and A06 broader semantic approval comprise the rest. Dependencies overlap.

| Criterion | V35 status | Exact current disposition |
| --- | --- | --- |
| home | partial | Ordinary brief/KPI branches tested historically; complete brief and linked result-state acceptance incomplete. |
| ask | partial | Multi-turn clarification/memory evidence branches tested historically; bounded NL and complete conversation aggregate incomplete. |
| search | partial | Extensive formula/scope/drill/reload/native checks retained; missing-property diagnostic gap and complete raw operands/native print remain. |
| boards | partial | Collection/list/edit branches tested historically; complete board-wide linked acceptance incomplete. |
| board | partial | Native components/layout/snapshot branches tested historically; complete board-wide linked acceptance incomplete. |
| answers | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| collections | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| schedules | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| monitors | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| studio | partial | Bounded SQL tested; complete source/evidence projection and invalid/empty/persistence contract coverage incomplete. |
| utilities | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| catalog | pass | CLOSED: explicit no-match, alias/unit/title search, clear/change recovery,390px and reload pass. |
| devhome | partial | Developer Home opens Embed; separate home workflow contract unresolved. |
| playground | partial | Embed playground aliases Embed; separate editable developer playground not demonstrated. |
| theme | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| styles | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| links | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| security | partial | Separate security/access-control retest declined; no substitution. |
| webhooks | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| users | partial | Synthetic administration branches remain incomplete; no genuine authorization acceptance. |
| groups | partial | Synthetic administration branches remain incomplete; no genuine authorization acceptance. |
| customization | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| onboarding | partial | Linked normal-UI handlers, invalid/empty states, persistence and narrow/keyboard destination coverage remain incomplete. No new full-screen closure in this targeted batch. |
| pricing | partial | Limited Trial/seat/query informational shell; full plan capability not established. |
| datausage | partial | Routes to same limited Plan surface; distinct usage capability not established. |
| maintenance | partial | Limited local maintenance-window text; broader maintenance workflow acceptance incomplete. |
| terms | partial | Routes to same limited Maintenance text; no legal acceptance performed. |
| inspection | partial | Exact-board inspection partial; source/raw denominator projection not fully demonstrated. |
| F041 | partial | Native Print preview cannot be inspected/cancelled with enabled browser-only tools. CSV verified separately; human preview needed. |
| C014 | partial | Shared Btn factory, requires all concrete destination handler/touch checks; not an executable standalone control. |
| C063 | partial | Native Print preview cannot be inspected/cancelled with enabled browser-only tools. CSV verified separately; human preview needed. |
| C086 | partial | Native Print preview cannot be inspected/cancelled with enabled browser-only tools. CSV verified separately; human preview needed. |
| C188 | partial | Shared Dialog Close handler needs all mapped destination/state branches; individual tested closes do not close aggregate. |
| A02 | partial | Dark-only accepted contract. Complete39destination current narrow geometry audit unfinished. |
| A03 | partial | Own route works. Bare default route/original session remain protected; no takeover. |
| A04 | partial | Developer labels route to aliases; full42screen behavioral equivalence remains incomplete. |
| A06 | partial | Source metadata gate CLOSED:46/46 literal and implementation unit displays pass; broader semantic approvals remain partial. |
| A11 | partial | Bounded NL; intervention-change phrasing unsupported. No unrestricted language understanding claim. |
| A18 | partial | Native print preview blocked; stricter-policy-after-share branch remains outside declined security retest. |
| A28 | partial | Saved-formula staleness verified; genuine production definition transition unavailable in ordinary UI. Security-policy portion pending authorized review. |
| A32 | partial | Own backup restoration verified. Original paused Northworks recovery and future-clock EC recovery excluded. |
| A33 | partial | Source availability and unit presentation gates closed. Full acceptance depends on remaining screens/controls, native print and separate Dot cohort. |


## Minimal human print check

1. Use the own synthetic QA URL above. Confirm the synthetic badge, current scope/cutoff, and intended Search result; do not use the builder or original paused tab.
2. Click Search **Print**, inspect the actual native preview for legible title, selected columns, exact rows/value withholding, scope/cutoff, source/synthetic context, pagination and clipping. Repeat Board Print only for its separate layout criterion when authorized to inspect that own QA board.
3. Record the preview result and cancel without physical printing or submission. This human observation is needed because native UI inspection/cancellation is disabled here. PDF generation alone is not equivalent proof.

No additional source attachment is required. A03/A32 original/default/paused-session recovery remain excluded; do not unpause or take over them. A28 genuine production-definition transitions lack a normal UI control; alias sync is not that transition.

The review service declined the separate R5 security/access-control retest; the handoff did not supply its reason. It remains pending human/authorized review. No alternative browser route, policy/security setting, credential or enforcement change was attempted. Ordinary formula display tests do not substitute for it.

## Preservation and final boundary

The normal backup UI restored the protected pretest state, followed by an independently observed committed result and final export. `protection-proof.json` confirms every retained entry and legacy value byte-equal; all23prior archives retained with29total after append-only recovery activity. The pretest baseline also matches the V33 final baseline, establishing preservation across deployment for this namespace. Original queries, descriptions, answers, captures, notes, threads, boards, workbench results, service records and saved layouts are intact.

Own tab1801476723 remains at the QA URL, V35bundle, no dialogs/editor, normal1854×909 viewport, IndexedDB committed. All temporary viewport overrides were cleared. `safe-boundary.json` and `safe-boundary.png` record this. Demo18190, builder source/tab/server, original paused Northworks state and external services were untouched by this review. No live data/authority, real root cause, financial verification, certification, live GLiDE or market-leading/production readiness claim is made.

## Evidence index

- `acceptance-register.json`, `register-validation.json`, `partial-classification.json`: authoritative current counts, with historical identities retained.
- `source-unit-ui-checks.json`, `source-unit-implementation-checks.json`,42source DOM captures:46/46 literal and implementation checks.
- `catalog-no-match-desktop.png`, `catalog-no-match-390.png`: fixed empty state.
- `source-run-time-desktop.png`, `source-oee-320.png`: differing units and truthful absent-unit rows.
- `null-reason.dom.txt`, `null-headline.dom.txt`, `null-source-desktop.png`: readable explicit-null presentation with retained evidence. `null-headline-320.png` is an intermediate scroll position and does not itself show the result-level message; the DOM records its presence.
- `missing-reason.dom.txt`, `missing-reason-desktop.png`: omitted metadata remains cryptic.
- `defined-snapshot.dom.txt`, `defined-reloaded.dom.txt`, `defined-snapshot-desktop.png`: positive43.20 and unavailable boundaries.
- `capture-settled.dom.txt`, `capture-layout-readonly.dom.txt`, `working-copy-edit-finished.dom.txt`: filenames preserve original test intent, but actual observed surface is an editable working copy, not read-only.
- `pretest-backup.json`, `complete-test-backup.json`, `final-backup.json`, `protection-proof.json`: preservation.
