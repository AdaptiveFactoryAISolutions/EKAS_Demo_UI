# Independent current review — V36

310 pass / 41 partial across 351 cumulative criteria. Counts are unchanged. This is a targeted presentation retest, not full acceptance or a new execution of historical passes.

Verified own URL: http://localhost:18191/ekas-review/?suite=workspace&fixture=training-ui-acceptance-v1&context=oee-zero-unavailable
Actual DOM script: index-DEnln2Ef.js. Parent deployment manifest ZIP SHA256: cb78ad73fae73792529718c7520714e172e091cf05cf5ee526e5883b5c5dc346. Owner reports 917 tests in 131 files and build/typecheck/portable pass; not independently rerun.

Fresh findings:
- FIX VERIFIED: omitted formulaSnapshot and missing global now explain missing definition/units, withhold all three results and retain exact source evidence/cutoff. Explicit null behaves the same, including when the matching global definition exists: no substitution and no 43.20 fallback.
- RETAINED: valid captured definition survives missing global and reload, returning 43.20 units/min only for UIA-HIGH-OEE. UIA-UNAVAILABLE and UIA-ZERO-DOWNTIME remain Unavailable. Omitted snapshot with an available global definition resolves 43.20 without a false missing-definition message.
- FIX VERIFIED: OEE provenance at 320 px shows readable labels, separate source/implementation units, expandable exact identifiers/anchors/raw dispositions. OCC-163/KPI-163 line 411 and OCC-254/KPI-254 line 691 retained. Four cards each clientWidth=scrollWidth=239; no descendant overflow. Document width 305 versus viewport 320. Actual full-page pixels inspected.
- CURRENT VISUAL DEFECT: missing-definition Search at desktop 1854 px places the new status as a separate left grid item, expands the column picker on the right, then places query/results in a narrow approximately 280 px left column. The Grid truncates scope/value cells and leaves a large unused right area. Repair: give diagnostic its own full-width row, preserve intended picker/query/result grid placement, retest table/headline at desktop and 320/390. This is a confirmed current presentation defect; introduction/version causality was not independently established. Numeric withholding is correct.
- LIMIT: JavaScript undefined cannot be represented distinctly from an absent property in JSON backups. The ordinary restore workflow tests the omitted serialized state; the runtime undefined branch is owner unit-test evidence only. No hidden-state injection or substitute security review used.
- RESTORATION: final ordinary UI export entries and preservedLegacyEntries equal the pretest baseline byte-for-byte. Normal desktop metrics restored, IndexedDB committed. No Main, original Northworks, builder tab, live backend or security settings mutated.

Remaining 41 criteria retain partial status. The following prior disposition table is preserved, with the missing-property gap now replaced by the confirmed desktop diagnostic layout defect. Native Print requires human native-preview inspection; separate security/access-control review was declined and was not bypassed. Other screen/control aggregates still require their ordinary UI branch coverage, product contracts and semantic approvals; they are not all tool-blocked or exhausted.

| Criterion | Current status | Exact current disposition |
| --- | --- | --- |
| home | partial | Ordinary brief/KPI branches tested historically; complete brief and linked result-state acceptance incomplete. |
| ask | partial | Multi-turn clarification/memory evidence branches tested historically; bounded NL and complete conversation aggregate incomplete. |
| search | partial | Extensive formula/scope/drill/reload/native checks retained; missing-property diagnostic fixed in V36; diagnostic desktop layout defect and complete raw operands/native print remain. |
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




Human next steps: inspect and cancel actual native Search/Board print preview on own synthetic route; authorized separate security review through its approved workflow; engineer repair diagnostic grid placement and define unresolved alias-screen contracts; continue ordinary UI branches for the listed aggregates. No complete/production-ready claim.
