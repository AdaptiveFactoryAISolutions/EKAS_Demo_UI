# Lot Genealogy Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for the parent-authorized inline implementation. Preserve the ledger and obtain parent-coordinated whole-candidate independent review after freeze.

**Goal:** Let the current synthetic case trace declared lot/job/unit/shipment relationships, expose unknown exposure and record an owned bounded scope review without inventory mutation.

**Architecture:** A new typed lineage module projects independently authored relationship metadata against the exact existing case/cycle/clock/role. Optional workflow selection and scope review reuse the versioned atomic command envelope; a captured conversation projection and actual Dashboards organization chart/native Grids disclose its limits.

**Tech Stack:** Existing TypeScript/React/Vite, Highcharts12.6.0, Dashboards4.2.0, GridLite3.2.0, existing service/repository and Node20.20.2 portable runtime. No dependency install or live provider/backend call.

**Spec:** `docs/superpowers/specs/2026-10-14-lot-genealogy-design.md`

## Global Constraints

- Protect frozen V102 and all predecessors; work only in this isolated V103 successor. Copy no runtime or credentials.
- Preserve all99 predecessor inputs, original72 temporal records, public74assets, pinned dependencies,2648 source identities and483 compiled identities.
- Primary goals/units/clocks, exact context and source anchors remain unchanged; approval is not intervention; cause/financial savings remain unverified.
- Unknown quantity is null, not zero. Count unique eligible existing unit references through split/rework once; do not infer total exposure or all product contained.
- No actual hold/release, shipment, CMMS/document mutation, permission grant, live OpenAI call/spend, hosting or push. Server-only OpenAI/no Ollama and actual Tom contract requirement retained.
- Source edits and tests/builds run serially. No app edit while a runner is active. Failed phases are preserved, never credited as final.

## Review Focus

- A misspelled or foreign root must not select the first/current/neighbor lot: Task1 explicit membership tests.
- Rework and merge paths must not double-count a source unit or synthesize missing quantity: Task1 unique-reference and unknown-exposure tests.
- Changing actor/case/clock during an awaited read/save must not redirect an intent: Task4 late-read and held-original-recovery tests.
- Old captured traces must not gain newer completeness/quantity after restart: Task3 immutable capture/replay tests.
- Declared trace completeness must not certify a defect, containment or release: Task2 physical-state invariance and prohibited broad-claim tests.

## Task0 — Current independent/native review observations

Preserve V102 reports and exact failure evidence. F056 controlled actual digest delay, pending acknowledgment, duplicate prevention and actor/board precommit lease tests precede source correction; do not close from retry alone. F003 compares the actual quality/Monitors context under presentation-only versus true cohort changes; preserve history and pause rules. Final V103 whole-suite/HTTP/native review re-tests these fixes. Frozen V102 stays unchanged.

## Task1 — Source model, scoped traversal and read port

**Files:** Create `app/inputs/lot-genealogy-synthetic-v1.json`, `app/src/investigation/lotGenealogy.ts`, `app/src/investigation/v103LotGenealogy.test.ts`; modify service dispatch/client read port.

**Consumes:** `WorkflowRecord`, `Actor`, canonical `Context`, `fixtureCase(caseId)`, existing session allowed assets.
**Produces:** `genealogyProjection(record,options)`, `genealogyRequest(request,repo,actor,assertLease)` and typed `GenealogyProjection`; exact roots/snapshots, reachable nodes/links, unique unit refs, gaps, null affected quantity, bounded admission and provenance.

- [ ] Write API assertions for no selection, exact roles/context and unknown root, e.g. `expect((await env.read()).selectedRootLotId).toBeNull()` and `await expect(env.select('UNKNOWN')).rejects.toThrow()`.
- [ ] Observe actual missing-port failures and preserve their JSON/text.
- [ ] Author54 metadata alternatives:3contexts×6existingclocks×3statuses, with null lot totals, no physical events and exact source identity. Quality links three existing current-unit IDs; speed/downtime do not invent serialized IDs. Map unit known time through its canonical shift.
- [ ] Implement directed visited-set traversal with max4hops/32nodes/64edges. Reject invalid identifiers/known edges and disclose unknown boundary/gaps. A reference repeated through rework is counted once. Validate current cutoff/cycle/context/role before returning data.
- [ ] Assert `uniqueKnownUnitIds` equals the exact source IDs once, `unmappedQuantity` is null, and `allProductContained`/`actualReleasePerformed` are false. Test partial/untraced boundaries and unavailable references.
- [ ] Run Task1 green cohort without changing assertion limits, then ledger source/interface decisions.

## Task2 — Explicit selection and owned scope review

**Files:** Modify `workflow.ts`, `model.ts`, `service.ts`; add `v103GenealogyCommands.test.ts` and `v103GenealogyJourney.test.ts`.

**Produces:** Optional `genealogySelection` and `genealogyScopeReview`; commands `select-genealogy-snapshot` and `record-genealogy-scope-review`, strict source/root/version/reason/confirmation and named owner/due time/uncertainty acknowledgment.

- [ ] Write red tests for foreign/future/older snapshots, missing owner/reason, unrelated node injection and changed body with reused key.
- [ ] Select only exact known source/root in current context/cycle; retain original action/owner/verification/acceptance state. Scope-review packet is generated from reachable IDs, not arbitrary client text.
- [ ] Require explicit fictional owner, UTC due time and acknowledgment of unknown quantity/links; store accountability/review, with no hold/release or intervention flags. Refuse global unaffected/full-contained claims.
- [ ] Test source aging/current-cycle mismatch and explicit newer metadata recovery without curing failed MSA, changing primary measurements, performing work or certifying cause/savings.
- [ ] Prove known precommit versus unknown original outcome through real service/repository/idempotency; ledger the green result.

## Task3 — Natural multi-turn evidence and immutable captures

**Files:** Create `lotGenealogyConversation.ts`, modify `conversation.ts`, `service.ts`, `Replies.tsx`; tests `v103GenealogyConversation.test.ts`, `v103GenealogyCapture.test.tsx`.

**Produces:** `genealogyQuestion`, `captureGenealogy`, `genealogyPresentation` and versioned `GenealogyCapture`.

- [ ] Write red API/root tests for no-case clarification, exact source/root and repeated contextual follow-up, including affected-unit refusal.
- [ ] Route explicit trace reads ahead of generic presentation; capture exact source/root/cycle/time/gaps/unit identity count, with unknown total exposure. Old turns retain prior policy and bytes.
- [ ] Test restart/tamper/newer selection: `expect(oldTurn).toEqual(original)`; verify captured Board renders its original status and source.
- [ ] Confirm ordinary known-work/measurement/knowledge semantics remain separate and do not infer physical containment or cause from a trace.

## Task4 — Actual Board/DataPool and safe public review controls

**Files:** Create `LotGenealogyBoard.tsx`, `LotGenealogyPanel.tsx`; modify `CanonicalWorkspace.tsx`; tests `v103GenealogyBoard.test.tsx`, `v103GenealogyUi.test.tsx`, `v103GenealogyRoot.test.tsx`.

**Produces:** Optional Explore disclosure, exact review controls, qualitative organization component plus native node/link/decision Grids on one actual Dashboards Board/DataPool, with layout/source/keyboard behavior.

- [ ] Write red actual SDK/root tests for known graph edges, no numeric weights, shared/rework references, native sorting/saved semantic layout and null quantity labels.
- [ ] Use installed organization+sankey module dependency for qualitative organization rendering only. Keep chart identity/data sourced from the immutable projection; no quantitative Sankey series.
- [ ] Apply current case/version/actor membership and generation leases, clear foreign choices/feedback, preserve held original body/key/case/role. Show explicit preconditions and errors, no silent noop.
- [ ] Test real root panel→read→explicit select→scope review→capture→source change, original held recovery and current-option/late-response regressions. Keep native/download acceptance qualified.

## Task5 — Contract, reconciliation and provisional packaging

**Files:** `manufacturingContract.ts`, `decisionCapabilities.ts`, new integration/remaining-scope/validation/handoff docs and serial source/compiled/package helpers.

- [ ] Pin proposed genealogy paths/fields and bound GAP010 source capability; retain all original56 dispositions and whole acceptance false. Update only current-candidate expectation literals where needed, not names/assertions.
- [ ] Add actual compiled HTTP journeys/source/recovery checks; stage every predecessor `.ts/.tsx` test/helper and immutable imported oracle JSON byte exact. Never copy prior result files as pass evidence.
- [ ] Run typecheck and full serial final source groups; reconcile all2648 predecessor identities/source bytes/99inputs/74assets/lock and all483 compiled identities. Preserve failures and fix actual product/setup causes.
- [ ] Build browser/server, freeze hashes, ZIP source/static/server with no node_modules/env/private repo; fresh extract, Node-only offline and exact served assets. Planned isolated review ports18260/18261 must be free; never stop predecessors.
- [ ] Save provisional plan/main/proof via supported Library flow, apply returned xattrs and rehash. Preserve atomic arrays/history, guarded expected-version update only after main save. Ask parent for exact-candidate independent/native review and report actual blockers, without final-ready claims.

## Execution ledger

Inline continuation is explicitly admitted by the parent; the user authorized proceeding until review. This controls execution instead of redundant design/plan permission gates. Independent/native review is parent-coordinated. No git repository is supplied for this snapshot workspace, so preservation uses canonical source/build/ZIP hashes and source identity ledgers instead of invented commits/worktrees.
