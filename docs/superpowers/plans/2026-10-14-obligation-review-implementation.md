# Supplier/customer obligation exception review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Inline execution is explicitly authorized by the current continuation and user's full approval; no subagents or redundant design/plan confirmation.

**Goal:** Review fictional supplier/customer obligation exceptions with exact scope, owned acknowledgement/follow-up and external-decision boundaries.

**Architecture:** Separate optional source selection and immutable local journal in the existing WorkflowRecord/ManufacturingService; strict versioned commands and readonly projection. Captured natural chat answers reconstruct original source, with actual linked due-target Dashboard/native Grids.

**Tech Stack:** React/TypeScript, Highcharts12.6.0, Dashboards4.2.0, GridLite3.2.0, Vitest4.1.11, bundled Node20 server.

**Spec:** `docs/superpowers/specs/2026-10-14-obligation-review-design.md`

## Global Constraints
- Work only in isolated V104; frozenV103 and all earlier artifacts/profiles/private repos/paused session unchanged.
- Native QA stopped pending direct user confirmation after denied retry; no browser/CUA/DevTools/alternate route.
- Serial app edits/tests/builds; no app changes while any runner active.
- Original2673/487test identities,100inputs,74publicassets/pinneddependencies,72temporal and82/294/85/56acceptance rows retained.
- One authored54snapshot×4obligation metadata fixture, no physical/delivery/OTIF/severity/quantity/approval facts invented.
- SubmittedPPAP pending; unknown supplier unapproved; CSR program-specific. Localack/review never externalapproval/fulfillment/submission/communication.
- Server-heldOpenAI/noOllama/fullactualTomAPI requirement preserved; no key/env reads, live calls/spend/backend/security changes.
- All eleven broader packages/whole/native/AT/human/licence/live/security/Tom gates remain.

## Review Focus
1. Program changes under same customer: CSR only its original program; no broad unaffected/approved claim (Task1/4).
2. Source ages while owner form open: stale source rejects new review, old receipt/time retained (Task2/4).
3. Unknown postcommit while role/case changes: exact body/key/actor held and recover only original scope (Task2/4).
4. New source after saved answer: original projection and UTC chart retained across restart (Task3/4).
5. Missing/overdue UTC target: missing never zero, planned date never shipment fact; actual restored chart keepsUTC/range/source IDs (Task1/4).

### Task0: Retain independent ordinary findings
**Files:** `evidence/independent-v103/`, `V104-LEDGER.md`
- [ ] Read any parent-reported V103 ordinary report, copy byte-exact with hash. Never mutate frozenV103.
- [x] G01 impossibleUTCcalendar date reproduced3casesbeforefix; strictUTCroundtrip added inV104only. Sourcecoupled21/21 passed; finalcompiledthree-case invalid/validcalendar regression mandatory. PreservefinalV103PARTIAL1060/1 andV102historicaluncertainty; nativegate remains stopped.

### Task1: Source projection and exact applicability
**Files:** Create `app/inputs/obligation-synthetic-v1.json`, `app/src/investigation/obligations.ts`, `v104Obligations.test.ts`; modify `workflow.ts`, `service.ts`, `clientPort.ts`.
**Interfaces:** `obligationProjection(record:WorkflowRecord):ObligationProjection`; `selectObligation(w:Workflow,actor:Actor,id:string,version:number,programId:string,reason:string):ObligationSelection`; `readObligations(id:string):Promise<ObligationProjection>`.
- [ ] Write API failing tests and run explicit exit/default+JSON reporting.
```ts
const p=await client.readObligations(r.id);expect(p.effectiveStatus).toBe('unassessed');expect(p.commercialReadiness).toBe('unknown');expect(p.otif).toBeNull();
expect(selected.records.find(x=>x.type==='ppap')?.externalDecision).toBe('pending');expect(selected.records.find(x=>x.type==='supplier-qualification')?.externalDecision).toBe('unknown');
expect(programB.records.some(x=>x.type==='csr'&&x.programId!==programB.programId)).toBe(false);
```
- [ ] Author54snapshots using existing six clocks/exact fixture context; four documentary records with synthetic source/time/evidence/due/applicability, null unknown numerics. No originalinput edit.
- [ ] Implement readonly GET, role/asset checks before disclosure, optionalWorkflowselection compatibility/UTC/older-source guards. Future snapshots excluded; historical source retained.
- [ ] Run3case,programA/B,unknownsource/rootrole/context/cycle/known-time/due/null tests; inspect process exit and failures.

### Task2: Owned ack/follow-up and receipt recovery
**Files:** `obligations.ts`, `workflow.ts`, `service.ts`, `requestOutcome.ts`, `v104ObligationCommands.test.ts`.
**Interfaces:** `recordObligationReview(w:Workflow,actor:Actor,command:ObligationReviewCommand):ObligationReview`; strict command unions `select-obligation-snapshot` and `record-obligation-review`.
- [ ] Red tests for currently unsupported selection/review and forged external approval/dispatch.
```ts
const ack=await client.command(r.id,r.version,{kind:'record-obligation-review',obligationId,stage:'acknowledged',ownerName:'Synthetic quality owner',ownerRole:'supervisor',dueAt:'2026-10-07T16:00:00Z',reason:'Review original scoped pending evidence; no real external approval.',acknowledgeExternalPending:true,confirmation:'REVIEW_SYNTHETIC_OBLIGATION_EXCEPTION'},'ack-key');
expect(ack.content.workflow.action).toEqual(before.action);expect(ack.content.workflow.accepted).toBe(before.accepted);
expect((await client.readObligations(r.id)).records.find(x=>x.id===obligationId)?.externalDecision).toBe('pending');
```
- [ ] Enforce current exact source/program/record, manager/supervisor review, ownerName2..120/reason10..1000/futureUTCdue, current-sourcepriorack for evidence-request/follow-up and20journalcap. Derive scope server-side.
- [ ] Exact idempotent repeated ack returns same receipt; changed body conflicts; known precommit refusal distinguished from unknown outcome. Assert no physical/intervention/submission/contact flags become true.
- [ ] Green role/viewer/safety/stale/program/case/futuretime/forgedfields/ack-order tests.

### Task3: Natural multi-turn and immutable capture
**Files:** Create `obligationConversation.ts`, `v104ObligationConversation.test.ts`; modify `conversation.ts`, `service.ts`, `unified.ts`, `Replies.tsx`.
**Interfaces:** `obligationQuestion(q:string):ObligationQuestion|null`; `obligationAnswer(projection,question)`; `obligationCapture` policy1 immutable projection linked to original WorkflowRecord.
- [ ] Red5naturalreads/no-case clarification/threecases/selectedprogram/context retention. No commands on reads.
```ts
const old=structuredClone(c.content.conversation.turns.at(-1));expect(old.obligationCapture.projection.records[0].synthetic).toBe(true);
await chooseNewSource();expect((await restarted.readConversation(c.id)).content.conversation.turns.find(t=>t.id===old.id)).toEqual(old);
```
- [ ] Route only new policy1, original questions/policies unchanged. Validate reconstructed projection; bypass generic metric publication for these metadata reads. Replies bind original capture and timestamp, gated by historical asset eligibility.
- [ ] Green captured scope/externalpending/localack distinctions; generic primary performance remains physical supporting only and commercial clearance never inferred.

### Task4: Real connected Dashboard and optional review flow
**Files:** Create `ObligationBoard.tsx`, `ObligationPanel.tsx`, `v104ObligationBoard.test.tsx`, `v104ObligationRoot.test.tsx`, `v104ObligationReplyBinding.test.tsx`; modify `CanonicalWorkspace.tsx`, `Replies.tsx`.
**Interfaces:** Board `{projection:ObligationProjection,identity:string}`; Panel existingcontextactor/client/onUpdated/onNotice port, exact generational scope lease.
- [ ] Red public Explore entry/form tests, original-role heldrequest case switch, lateresponse/sourceaging/programforeignselection; red savedReply Board binding.
- [ ] Implement optional explicit source/program review and owned record/stage fields. Unapplied source/program draft clears incompatible ownedfields/ack andblocks review untilmatching appliedscope; pin this transition in v104ObligationPanelLease.test.tsx. Reconcile unknown exact body/key only originalcase/role; knownrefusal permits freshintent. Clear foreign fields/confirmation/notices and reject late reads.
- [ ] Actual Board/DataPool three Grid connectors due/evidence/decisions; UTC scatter and due Grid share the due connector when datesknown, full evidence retains missing-date records; noquantity/severity. FixedexplicitUTCaxis/range/sourceIDs/asOfline; local export fallback disabled. NativeSort/Edit/Save/Restore/JSON/keyboard.
```ts
expect(board.options.dataPool.connectors).toHaveLength(3);expect(chart.xAxis[0].options.type).toBe('datetime');expect(chart.options.time.timezone).toBe('UTC');
await grid.updateColumn('Known UTC',{sorting:{order:'desc',priority:1}});await save();await remount();expect(restoredDataPool).toEqual(originalDataPool);expect(restoredAxis).toEqual(originalAxis);
```
- [ ] Run SDKnative test with explicit ResizeObserver primitive and cleanexit; source/clock/program/known-date-null assertions; immutable savedReply across source/restart/rehydrate. No native/browser acceptance claim.

### Task5: Reconcile, portable freeze and Library/handoff
**Files:** New V104 owner scripts/docs/contracts/compiled tests, external guardedatomic15 update.
- [ ] Advance only candidate contract label/test expectation literals; proposed readonly/strictcommandports documented for engineer. Inventory101inputs/216newmetadatarecords and all100priorhashes/assets/dependencies.
- [ ] Serial type/fullsource union inclall2673prioridentities; browser/SSR builds; all487priorcompiledidentities plus threecase andrefusal/receipt HTTP journeys using newownedloopback state. Preserve harness failures and explicitexit codes.
- [ ] Freeze source/static/server/ZIP manifest; safe unique entries, fresh extraction/Node20only/externalblocked/assets exact. Newunused18262/63 disabled/disclosedmock profiles; no old runtime modifications.
- [ ] Supported Library save main/proof withallxattrs; guardedatomic15 CAS14→15 samefile, archive14byteexact/original82/294/85/56rows. Keep independent/native status qualified.
- [ ] Parent checkpoint exactIDs/hashes/URLs, request independent V104 retest. Ordinary defects only successor; native gate remains stopped.

## Plan self-review
OriginalPPAP/supplier/program acceptance owned byTasks1/2/4; synthetic noOTIF/severity/physicalfacts by1/3/5; owner/due/ack/receipt by2/4; natural/history by3/4; actualSDK+UTCunits by4; prioridentity/offline/Library by5. Reviewfocus five classes have explicit tests. No approval/dispatch endpoint or hidden native workaround. Scope remains bounded syntheticGAP012, all11broaderpartials retained.
