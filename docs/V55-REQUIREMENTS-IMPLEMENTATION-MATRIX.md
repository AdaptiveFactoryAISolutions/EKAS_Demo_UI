# V55 implementation traceability — provisional

OpenAI is the selected model provider. Server-held credentials are the intended architecture; no key was accessed or configured. Tom’s real API contract and capability/auth/entity mappings are required before live integration can be verified. No live provider or backend calls were made.

All three master files were materialized through Library and read completely. Their original versions and metadata remain preserved.

- Pasted text(20261011-060550).txt: 33031 bytes; 1521 lines; SHA-256 `3a71c02f0bac352da8da2f4b8b17ebe1243e329f30e7d444ff254a8bb3088049`.
- Pasted text(20261011-060553).txt: 8531 bytes; 384 lines; SHA-256 `e4a00c2bd5f3b94c79d12f2409bf4bdbb07f863dcfee253f8e5fc7f687c93aaa`.

- Pasted text(20261011-062241).txt (TrueNorth): 26021 bytes; 1293 lines; SHA-256 `915cff63e0844c8d964100b75dbc0ec50e1b177ba91f0f8d2e8a99835aa256a3`.

This register tracks implementation work, not independent acceptance. The separate MIW cohort remains 53 NOT_RUN / 2 BLOCKED / zero PASS. No deployment or review-route swap is authorized while the reviewer owns the current browser session.

| DoD | Requirement | Service / UI / test work | Current evidence |
|---|---|---|---|
| 1 | Demo is a real functioning EKAS service using synthetic data. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 2 | UI does not directly depend on fixture internals. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 3 | Production-shaped typed API contracts exist. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Initial local typed transport implemented; focused API tests; production adapter contract remains pending |
| 4 | Mock adapters implement those contracts. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Initial local typed transport implemented; focused API tests; production adapter contract remains pending |
| 5 | Real backend can later replace adapters without UI redesign. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Actual Tom authenticated API contract required; no compatibility claim |
| 6 | Goal exception creates/opens a persistent investigation. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 7 | Plan vs actual works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 8 | Capacity loss bridge works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 9 | Baselines are not confused. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 10 | Loss accounting is mutually exclusive. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 11 | Contributors work. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 12 | Machine/job/part/revision/operation context persists. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 13 | Evidence is source-linked. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 14 | Controlled/uncontrolled evidence remains distinct. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 15 | Hypotheses are not causes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 16 | Hypothesis lifecycle works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 17 | Ownership works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 18 | Assignment acceptance works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 19 | Recommended action works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 20 | Authorization works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 21 | Performed work is separate from authorization. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 22 | Verification plan works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 23 | Explicit simulation time works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 24 | Future evidence cannot leak. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 25 | Before/after measurement works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 26 | Safety/quality guardrails work. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 27 | Result acceptance works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 28 | Sustain works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 29 | Recurrence works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 30 | Reopen works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 31 | Prior-cycle evidence is not improperly reused. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 32 | Downtime case works end to end. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 33 | Speed/performance case works end to end. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 34 | Quality case works end to end. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 35 | Plant Head Audit can open investigations. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 36 | Chat can drive the entire lifecycle. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 37 | Conversation remains natural and ChatGPT-quality. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Bounded deterministic grammar implemented; unrestricted model quality and native acceptance unverified |
| 38 | Deterministic services own manufacturing truth. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Source-bound canonical model and connected service/UI tests implemented; independent native acceptance pending |
| 39 | LLM cannot invent metrics/evidence/root cause/authority. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 40 | R5 security protections remain intact. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Independent merged review pending; declined review must not be replaced by implementation evidence |
| 41 | Persistence/reload works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 42 | Versioning works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Initial local typed transport implemented; focused API tests; production adapter contract remains pending |
| 43 | Idempotency works. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Initial local typed transport implemented; focused API tests; production adapter contract remains pending |
| 44 | Negative cases fail closed. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 45 | Visible Chrome acceptance passes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 46 | Desktop passes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 47 | 390 px passes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 48 | 320 px passes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 49 | Keyboard/accessibility passes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 50 | Existing EKAS features remain intact. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 51 | Final full regression passes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 52 | Exact final artifact is frozen. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Local implementation covered by cases/workflow/service/conversation and connected Ask tests; independent acceptance pending |
| 53 | Fresh independent review returns VERDICT: APPROVE. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Independent merged review pending; declined review must not be replaced by implementation evidence |
| 54 | Normal integration completes. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Actual Tom authenticated API contract required; no compatibility claim |
| 55 | No current-scope product blocker remains. | Investigation application service; primary conversation and evidence surface; API + component + native acceptance | Held independent/native/provider/Tom integration gates remain; no final-ready claim |

## Independent acceptance mapping

| Row | Requirement | Service | UI | Test obligation | Status |
|---|---|---|---|---|---|
| MIW-01 | Deterministic complete journey | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-02 | Goal versus actual | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-03 | Loss reconciliation | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-04 | Overlap and double counting | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-05 | Scoped contributors | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-06 | Effective documents | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-07 | Traceable events | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-08 | Hypothesis versus cause | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-09 | Action plan | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-10 | Rejected or failed action | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-11 | Performed-work proof | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-12 | Eligible before/after | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-13 | No improvement / worse outcome | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-14 | Sustainment | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-15 | Missing/stale target or input | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-16 | Zero versus unavailable | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-17 | Invalid / empty scope | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-18 | Late evidence and reproducibility | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-19 | Persistence and working copy | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-20 | Errors and recovery | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-21 | Desktop comprehension | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-22 | Mobile 390 / 320 | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-23 | Keyboard | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-24 | Truthful summary/export | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-25 | Safe boundary | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-26 | CASE A downtime unaided journey | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-27 | CASE B speed unaided journey | Separate versioned fixture and canonical metric/evidence services | Primary chat + evidence | Independent arithmetic oracle + unaided chat journey | NOT_RUN |
| MIW-28 | CASE C quality unaided journey | Separate versioned fixture and canonical metric/evidence services | Primary chat + evidence | Independent arithmetic oracle + unaided chat journey | NOT_RUN |
| MIW-29 | Plant Head operating review front door | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-30 | Existing chat chain: What was OEE in January? | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-31 | Existing chat chain: And March? | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-32 | Existing chat chain: What about Machine 2? | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-33 | Existing chat chain: No, I meant Machine 1. | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-34 | Existing chat chain: Why? | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-35 | Existing chat chain: Show me. | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-36 | Existing chat chain: Compare that to last month. | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-37 | Existing chat chain: Go back to the first machine. | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-38 | Existing chat chain: Investigate the root cause. | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-39 | Existing chat chain: What was FPY? | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-40 | Full required investigation chat chain | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-41 | Free-form ambiguity and dimension retention | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-42 | Conversation response quality | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-43 | Conversation/history lifecycle | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-44 | Controlled evidence, supersession and contradictions | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-45 | Claim and hypothesis state machine | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-46 | Assignment acceptance and owner change | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-47 | Action state and performed-work evidence | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-48 | Verification plan immutability and guardrails | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-49 | Explicit simulation clock and result acceptance | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-50 | Versioning, duplicate commands and write failure | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-51 | Production-shaped contracts and mock adapter separation | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-52 | Router and presenter boundary / LLM-disabled | Context router + ConversationPresenter + typed service calls | Primary chat + evidence | Exact chain + freeform/ambiguity + context preservation + reload | NOT_RUN |
| MIW-53 | Existing product preservation | Investigation service | Primary chat + evidence | API, persistence and native end-to-end | NOT_RUN |
| MIW-54 | R5 security/policy preservation external dependency | External independent gate | No execution workaround | Named authorized independent evaluation | BLOCKED |
| MIW-55 | Held authorization/provider/external integration | External independent gate | No execution workaround | Named authorized independent evaluation | BLOCKED |

## Next milestone

Expand the aggregate to multiple declared cases, hypothesis tests and role-aware assignment; connect DurableRepository; keep canonical metric formulas shared. Then add the primary conversational service route and presenter. The existing single-case model is foundation work and cannot satisfy the complete service definition.

## Provider and backend boundary

The frozen Dot candidate already contains a server-only OpenAI Responses adapter with streaming, tool calls, cancellation and budget controls. It is undeployed and its independent merged review is pending. The Tom provider is a proposed capability-negotiated interface, not Tom’s actual API. The actual backend must supply OpenAPI/schema, authentication, tenant/role and entity mapping, version/capability negotiation, source/effectivity reads, action/authorization/work-proof commands, concurrency/idempotency, and timeout/error semantics. Model wording cannot mutate manufacturing facts or lifecycle authority.

## Current implementation evidence

The existing Ask composer now submits to one durable manufacturing conversation identity. That conversation delegates training queries to the accepted deterministic workspace query port, and retains monthly and investigation cursors without substituting datasets or cutoffs. Training captures, monthly replies, investigation snapshots and refused commands appear in the same saved history. The client port is separate from the lazy fixture/service implementation; UI components read typed service results.

- `src/investigation/cases.ts`: separate A/B/C fixtures, canonical metric engine, raw stop union, cycle timing, unique unit dispositions, document effectivity.
- `workflow.ts`: persistent replay-validated aggregate; hypotheses, assignment, action authorization/performed proof, locked comparison, guardrails, sustain and fresh recurrence cycle.
- `service.ts` / `clientPort.ts`: versioned conversation/investigation API, atomic commit, exact retry, read/calculation/write failures, presentation-session roles and asset scope.
- `trainingPort.ts` / `platform/workspaceConversation.ts`: reuse existing query engine under one conversation identity; each capture retains its original dataset and cutoff.
- `conversation.ts`: deterministic bounded natural language routing; explicit dimension corrections and unavailable requested metrics. This is not unrestricted model parity.
- `Replies.tsx`: existing Ask reply/evidence/history controls; immutable captured workflow/view and replay-checked manufacturing/monthly prose.
- `EvidenceBoard.tsx`: installed Dashboards Board, DataPool, Highcharts waterfall/column and native sortable Grid; persisted layout and local SVG/CSV export.

Focused unified service, negative, conversation and retained conversation tests: 25 passed. The final focused investigation run passed all 48 tests across 10 files, including the existing Ask component and actual installed Dashboards Board/Grid in component tests save/reopen. The final TypeScript/Vite build passed. Final full regression passed 1,131 tests across 178 files, with zero failures; final TypeScript/Vite build passed. All 74 original V54 input files remain byte exact, with five additive synthetic fixture files. These are implementation results, not native acceptance verdicts.

Declared negative-variant provenance and exact result/goal-bound creation are now implemented. The static router remains a bounded grammar; unrestricted model conversation quality is unverified while provider execution is held. The future authenticated OpenAI/Tom server path must project the accepted R5 policy boundary over these new service operations and obtain its required merged independent verdict. Local presentation roles do not replace that boundary. Tom contract conformance, actual provider execution, independent merged review and visible browser acceptance remain separate held gates.

## TrueNorth completion criteria

| Criterion | Requirement | Concrete mapping / remaining obligation | Independent status |
|---|---|---|---|
| TN-01 | The UI is chat-first. | conversation.ts, service.ts, unified.ts, Replies.tsx; verify full unaided behavior | NOT_RUN / no acceptance claim |
| TN-02 | Conversation feels natural. | conversation.ts, service.ts, unified.ts, Replies.tsx; verify full unaided behavior | NOT_RUN / no acceptance claim |
| TN-03 | Context persists correctly. | conversation.ts, service.ts, unified.ts, Replies.tsx; verify full unaided behavior | NOT_RUN / no acceptance claim |
| TN-04 | Metrics are deterministic and governed. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-05 | The Plant Review works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-06 | Goal exceptions can become investigations. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-07 | Investigations persist. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-08 | Losses reconcile. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-09 | Contributors are evidence-based. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-10 | Documents are evidence-linked. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-11 | Hypotheses remain distinct from causes. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-12 | Ownership works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-13 | Authorization works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-14 | Performed work is distinct from authorization. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-15 | Verification works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-16 | Temporal integrity works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-17 | Sustain works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-18 | Reopen works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-19 | Downtime case works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-20 | Performance case works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-21 | Quality case works. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-22 | API contracts are production-shaped. | clientPort.ts / Transport; actual Tom authenticated contract and adapter conformance remain unverified | NOT_RUN / no acceptance claim |
| TN-23 | Mock adapters can be replaced by real adapters. | clientPort.ts / Transport; actual Tom authenticated contract and adapter conformance remain unverified | NOT_RUN / no acceptance claim |
| TN-24 | Security remains intact. | Original R5 preserved; new-service merged independent policy review pending; no substitute verdict | NOT_RUN / no acceptance claim |
| TN-25 | Evidence is inspectable. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-26 | History is immutable. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-27 | Mobile works. | Fresh coordinated native/independent review pending; no deployment or Chrome action performed | NOT_RUN / no acceptance claim |
| TN-28 | Accessibility works. | Fresh coordinated native/independent review pending; no deployment or Chrome action performed | NOT_RUN / no acceptance claim |
| TN-29 | Existing accepted features remain available. | cases.ts, workflow.ts, service.ts; source-bound model/API and independent journey checks | NOT_RUN / no acceptance claim |
| TN-30 | No hidden manual manipulation is required. | conversation.ts, service.ts, unified.ts, Replies.tsx; verify full unaided behavior | NOT_RUN / no acceptance claim |
| TN-31 | An unaided user completes the full journey. | conversation.ts, service.ts, unified.ts, Replies.tsx; verify full unaided behavior | NOT_RUN / no acceptance claim |
| TN-32 | The system behaves like one product, not connected demos. | conversation.ts, service.ts, unified.ts, Replies.tsx; verify full unaided behavior | NOT_RUN / no acceptance claim |
| TN-33 | Backend replacement requires adapter work, not product redesign. | clientPort.ts / Transport; actual Tom authenticated contract and adapter conformance remain unverified | NOT_RUN / no acceptance claim |
| TN-34 | Independent acceptance confirms the end-to-end behavior. | Fresh coordinated native/independent review pending; no deployment or Chrome action performed | NOT_RUN / no acceptance claim |
| TN-35 | No unresolved current-scope blocker remains. | Bounded grammar limitation and external acceptance/integration gates listed explicitly above | NOT_RUN / no acceptance claim |

Final evidence: `evidence/v55-full-test-results.json`, `evidence/v55-full-tests.txt`, `evidence/v55-build.txt` and `evidence/V55-SOURCE-RECONCILIATION.json`. These are local implementation checks, not a substitute for independent/native acceptance.
