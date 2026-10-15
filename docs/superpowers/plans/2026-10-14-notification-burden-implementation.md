# Notification burden and acknowledgment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Current parentcontinuation anduserfullapproval authorize this architecturalspec/plan execution; no subagents or redundantapproval.

**Goal:** Deduplicate local synthetic attention notices, retain read/ack/permittedsnooze/reopen history and expose overload/failed delivery without implying resolution or safety delivery.

**Architecture:** Optional reviewed notification snapshot andappend-only localattention journal in existingcanonical WorkflowRecord/version/idempotency. Separate readonlygroup/policy projection andtyped immutablechat capture; actual sharedHighcharts/nativeGrid Dashboard.

**Tech Stack:** React/TypeScript, Highcharts12.6.0, Dashboards4.2.0, GridLite3.2.0, Vitest4.1.11, bundledNode20.

**Spec:** `docs/superpowers/specs/2026-10-14-notification-burden-design.md`

## Global Constraints
- V105only; preservefrozenV104andallpriorartifacts/profiles/repos/pausedbackend. No runtimecopied.
- NativeQA stoppedafterdeniedretry/directuserconfirmation pending; no browser/CUA/DevTools/tool/hostname/routearound ornativeacceptance.
- Source/tests/builds serial; no appchangeswhileanyrunneractive.
- All2705/494prior testidentities,101inputs/74assets/dependencies/72temporal and82/294/85/56acceptance rows retained.
- New54snapshot notice metadatafixture; no actualalarm, delivery, physicalrecurrence, work, CMMS/document/portal/contact mutation. Localnothingdispatched.
- Ten duplicates groupedbyevent/case/cycle identity; read/ack notresolved; critical/escalation notsnoozed/muted; failurevisible.
- Noticegeneration/policyresurfacing distinctfromphysicalrecurrence; onlysixexistingexplicitclocks exposefuture snapshots.
- OwnsnoozeUTC secondsZ realcalendar, laterthanclock/max30min; normalizingoffset/day/fraction notvalid.
- ServerheldOpenAI/noOllama/fullactualTomAPI required; no realkey/envreads/livecalls/spend/security/hosting/purchases/pushes. Eleven broaderpartial/full/native/live/Tom/security/licence/causalfinancial gates open.

## Review Focus
1. Same text/different eventorcase: no inappropriatecoalescing; duplicate identity/context validation (Task1).
2. Read/ack withfailed/unverified critical delivery: failurepersists, noresolved/safetyreadiness (Task2/4).
3. Newgeneration aftersnooze expiry: originalack/snooze historical, currentattention resurfaces andnophysicalrecurrenceclaim (Task1/2/3).
4. Unappliedsource draft/case/actor/sourceversion changeswhileform ready: invalidatesintent, oldbody/key held onlyoriginalscope (Task4).
5. Detail/overload truncation: total/returned/complete anddeferredreason clear; hiddenitems notcertifiedsafe, actualSDK semanticunits/sources preservedonrestore (Task1/4).

### Task0: Independent V104 ordinary feedback
**Files:** `evidence/independent-v104/`, `V105-LEDGER.md`.
- [ ] Copyfinal orinterimV104report/findings byteexactwhenparentprovides; reproduceactualsymptom beforefix. No modificationto V104freeze.
- [ ] Preservefailed initialevidence, clarify environmentaltestlimits andkeepnative authorizationseparate.

### Task1: Canonical grouped source andburden projection
**Files:** Create `app/inputs/notification-synthetic-v1.json`, `app/src/investigation/notifications.ts`, `v105Notifications.test.ts`; modify `workflow.ts`, `service.ts`, `clientPort.ts`.
**Interfaces:** `notificationProjection(r:WorkflowRecord):NotificationProjection`; `selectNotificationSnapshot(w:Workflow,c:Record<string,unknown>,actor:Actor):void`; `readAttention(id:string):Promise<NotificationProjection>`.
- [ ] Write API404/grouping/scope/policy redtests andrun default+JSONreport withactualexit.
```ts
expect((await client.readAttention(r.id)).effectiveStatus).toBe('unassessed');
expect(burst.groups.find(g=>g.totalMembers===10)?.members).toHaveLength(10);expect(burst.groups.filter(g=>g.eventIdentity===eventId)).toHaveLength(1);
expect(burst.policy).toMatchObject({visibleGroupCap:6,digestCap:3,snoozeMaxMinutes:30});expect(burst.underlyingResolved).toBe(false);
```
- [ ] Author54normal/burst/failed snapshots fromexisting6clocks andexactcontext; stablecanonicalevent/group, distinct envelopeIDs, generations/frame, actualdeliveryfalse and noactualphysicalrecurrence.
- [ ] GETread role/asset scopedbefore disclosure; explicitsource selection currentcontext/cycle/known-time/exclusivevalidity/rollback. Identity validation/group budgets32/envelope128/member10, total/returned/complete.
- [ ] Policyprojection allcorevisible, capped/deferreddigest withreason, overload/sourcefailure/why; unknown/stale notcurrentready.
- [ ] Green3cases/10duplicates/contextcollision/generation/detailbudget/failure/corevisibility/future/stale/unknownasset/strictsource tests.

### Task2: Persistent localattention journal andreceipt guards
**Files:** `notifications.ts`, `workflow.ts`, `service.ts`, `v105AttentionCommands.test.ts`.
**Interfaces:** `recordNotificationAttention(w:Workflow,c:Record<string,unknown>,actor:Actor):void`; optional `notificationJournal:NotificationJournal[]`; commands `select-notification-snapshot`, `record-notification-attention`.
- [ ] Redunsupportedoperation/forgedactualdelivery/criticalmute/expiry/duplicateack tests.
```ts
const command={kind:'record-notification-attention',groupId,generation,sourceVersion,operation:'ack',reason:'Localattention reviewed; underlyingexception anddelivery remainunverified.',acknowledgeAttentionOnly:true,confirmation:'RECORD_SYNTHETIC_NOTIFICATION_ATTENTION'};
const ack=await client.command(r.id,r.version,command,'ack-original');expect(ack.content.workflow.action).toEqual(before.action);expect((await client.readAttention(r.id)).underlyingResolved).toBe(false);
```
- [ ] Strictgroup/generation/current sourceVersion/reason/explicitlocalonlyconfirmation; readallroles, acknonviewer, digest snooze/mute/reopen manager/supervisor/maintenance, critical/escalation snooze/muterefused. ExactUTCfuture/max30min, journal40cap, oneack pergroupgeneration. No sourcefailurecleared/localack-as-delivery.
- [ ] Originalkey replay/restart exact; changedbody/actor conflict, authoritativeprecommitrefusal vsunknown. Scope/cycle/future/stale/forged fields rejected.
- [ ] Advance explicit14:45→15:15 aftersnooze15:05, selectnewsourcegeneration2, verifyresurfacing/currentreviewneeded/oldjournalretained/nophysicalrecurrence.
- [ ] Greencritical/delivery/expiry/calendar/lostack/idempotency/roles/journal stage tests.

### Task3: Naturalmulti-turn andimmutablecapture
**Files:** Create `notificationConversation.ts`, `v105AttentionConversation.test.ts`; modify `conversation.ts`, `service.ts`, `Replies.tsx`.
**Interfaces:** `notificationQuestion(q:string):boolean`; `captureNotification(r:WorkflowRecord,q:string):NotificationCapture`; `notificationPresentation(c:NotificationCapture):PresentedTurn`; policy1 optionalturnfield.
- [ ] Red five readonlyqueries/no-case/3cases/why/failure/unknownphysical qualifiers, no implicitread/ack command.
```ts
const old=structuredClone(c.turns.at(-1));expect(old.notificationCapture.projection.actualDispatched).toBe(false);
await advanceAndSelectNewGeneration();expect((await restart.readConversation(c.id)).content.conversation.turns.find(t=>t.id===old.id)).toEqual(old);
```
- [ ] Onlynewpolicy1 routes; oldpolicy0/replay unchanged. Reconstructexactprojection fromoriginalWorkflowSnapshot before accepting savedanswer. Bypass genericnumericpublication forsystemmetadata.
- [ ] Typed savedReplyBoard bindsoriginalsource/time/generation/ack/failure, historicalasseteligibility unchanged. Greenoldcaptures/restart/newgeneration/notphysicalrecurrence/noimplicitread.

### Task4: ActualsharedDashboard andattentionInbox UI
**Files:** Create `NotificationBoard.tsx`, `NotificationPanel.tsx`, `v105AttentionRoot.test.tsx`, `v105AttentionLease.test.tsx`, `v105AttentionReplyBinding.test.tsx`; modify `CanonicalWorkspace.tsx`, `Replies.tsx`.
**Interfaces:** Board `{projection:NotificationProjection,identity:string}`; Panel existingrecord/actor/client/onUpdated ports withcoherentgeneration lease.
- [ ] Redpublicoptionalattention entry/fullsource/group/operation/reason/confirm flow, expandtenchildren andpolicylabels.
- [ ] Actual Board/DataPool Highcharts grouped-envelope bar andsharednativegroupGrid; evidence andpolicy/journal/deliveryGrids. Unitsnoticeenvelopes/selectedsnapshot, no severityscore/physicalalarmcount; exactsource/time/visibledeferred qualifiers.
```ts
expect(chart.yAxis[0].options.title.text).toContain('notice envelopes');expect(chartComponent.connector.id).toBe(groupGrid.connector.id);
await groupGrid.grid.updateColumn('Known UTC',{sorting:{order:'desc',priority:1}});await save();await remount();expect(restoredDataPool).toEqual(originalDataPool);expect(restoredUnitsSources).toEqual(originalUnitsSources);
```
- [ ] Edit/save/restore/nativeSort/highlight/localexport/sourceJSON/keyboard; missing/unassessed no numericcurrentreadiness.
- [ ] Actualcase/actor/late response/sourceaging/unapplieddraft clearsforeignfields/confirm; unknownoriginalbody/key/actor inownbounded sessionintent, originalcase/roleonlyrecovery, malformedhold; knownrefusalfreshintent afterread. Noautomaticreplay.
- [ ] GreenrealSDKsort/layout/units/source binding, criticalnofalse-resolve/failurevisible, sourcelease andoriginalrequest,restartsavedReply tests. Nativeacceptancefalse.

### Task5: Fullfinalbyte coverage/portablefreeze/Library
**Files:** V105helpers/sourcecoverage/docs/contracts/compiledtests; guardedatomic16.
- [ ] Advanceonlycurrentcandidate label/test literals; contract strictproposedattentionports/policy/docack externalfalse documentedforengineer. Sourceinventory current102inputs/new54snapshot countsderivedactual, all101prior/74assets/deps/72temporal exact.
- [ ] Fulltype/sourceunion retainsall2705identities/testbudgets, sourcefixedduringrun; browser/SSRbuilds0. Compiledactualbundled-server3case +group/critical/snooze/receipt flow, all494priorchecks unchanged. Derive newcounts fromreports, no inventedpasses.
- [ ] Freeze exactsource/static/server/manifest ZIP; safeentries/freshextraction/Node20only/externalblocked/assets exact; newunused18264/65 disabled/disclosedmock ifneeded, no oldserver/QA changes.
- [ ] SupportedLibrarymain/proof+allxattrs; guardedatomic16 CAS15→16 samefile, archive15exact/original82/294/85/56arrays. NewordinaryV104findings retained, independent/native/whole false.
- [ ] Parent exacthashes/IDs/URLs andindependentretest handoff; consolidatedelevenbroaderpartials/nextselection explicit. NativeQA remainsstopped pendingdirectconfirmation; realOpenAI/Tom/security gates separate.

## Plan self-review
Grouping/source/context/policy/detailcaps ownedTask1; ack/read/expiry/critical/failure/receipt Task2; natural immutablehistory Task3; actualSDK/lease/typedReplyTask4; originals/fullbytes/LibraryTask5; ordinaryreviewcorrections Task0. FiveReviewFocus risks each have tests. No actualalarm/notification/channel/safety mutation, secretuse or nativeworkaround.


## Explicitly admitted current OpenAI operator preparation

Parent and user authorized this successor scope on 2026-10-14. Preserve R5 architecture and prior flagged security-review hold. Add default-disabled actual operator composition; tests use fake credentials/mock transport only. Add durable exclusive existing-only journal, signed artifact/policy/journal/executable-identity acceptance through a fixed independently provisioned root-controlled public anchor, policy expiry/cumulative USD20/wire-byte/framing/output bounds and masked private user-owned credential entry. Ship neither acceptance nor signing key. Do not read actual journals or secrets, make provider requests/spend, alter old expired guard or provision security settings. Existing legacy migration needs explicit reviewed acceptance and retained reservations/unknowns; unsupported old schema refuses. Separate real conversation plan and Tom production integration gates. Provisional handoff published through Library; final exact artifact and full source/compiled/ordinary regressions still required.
