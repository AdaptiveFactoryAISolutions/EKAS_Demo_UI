# Canonical Local Simulation Implementation Plan

> For agentic workers: use superpowers:executing-plans in this session. No subagent dispatch is authorized. Steps use checkboxes for tracking.

**Goal:** Integrate the locally missing decision/data/Guide capabilities with one canonical source of truth.

**Architecture:** Add small typed services and public UI projections to the existing manufacturing repository/transport. Keep training defaults, governed scenario datasets and original cases distinct; derive shared case state instead of duplicating it.

**Tech stack:** TypeScript/React, existing owned repository and synthetic HTTP envelope, Highcharts12.6.0, Dashboards4.2.0, GridLite3.2.0.

**Spec:** ARCHITECTURE.md. Execution follows the existing user-authorized native builder workflow after V89 freeze.

## Global constraints

- Preserve frozen V88/V89, visual baseline, existing journeys, original85/82 inputs and old capture timestamps/status.
- No Chrome, vendor source edits/browsing, provider keys/live calls, private backend mutations, external delivery, security reroute or paid licence claims.
- Five-area shell remains; decision support is an Explore subpane, not a second application.
- Observations/proposals are synthetic and unverified; no causal or financial upgrade.
- Complete metric scenarios are explicit namespaces; missing ordinary inputs/qualification are never filled silently.

## Review focus

1. A scope/source/version change during a form must reject stale writes and preserve the draft.
2. Switching to a scenario must not rewrite the case clock, old replies or owner/verification state.
3. Partial/masked/future inputs and unqualified capability data must remain unavailable.
4. Reading/skipping Guide steps must not produce business receipts or trigger consequential controls.
5. Mixed units/horizons and unsupported aliases/scopes must not become pooled numbers or neighboring results.

## Task 1: Canonical decision support and review packet

**Files:** create `app/src/investigation/decisionSupport.ts`, `DecisionSupportPanel.tsx`, `decisionSupport.test.ts`, `decisionSupportUi.test.tsx`; modify `service.ts`, `clientPort.ts`, `CanonicalWorkspace.tsx`, `applicationHandler.ts` only at their existing dispatch/entry boundaries.

**Interfaces:** `DecisionScopeRef {conversationId:string; conversationVersion:number; investigationId:string; investigationVersion:number; asOf:string; sourceRowId:string; sourceVersion:number; planVersion:number}`. `DecisionCommand {kind:'record-observation'|'record-pm-review'|'record-handover'|'record-lesson'|'save-scenario'|'record-portfolio-review'; scope:DecisionScopeRef; expectedVersion:number; knownAt:string; reason:string; confirmation:string; payload:Record<string,unknown>}`. `decisionSupportRequest(repository,request,actor)` returns a typed synthetic response. `readDecisionSupport(scope)` derives case state; `writeDecisionSupport(command,key)` appends reviewed records. Routes: GET/POST `/api/v1/manufacturing/decision-support`, GET `/api/v1/manufacturing/decision-support/:investigationId/packet`.

- [ ] Write API regressions for stale conversation/workflow/source/plan references, unavailable scope, missing confirmation, notes that claim a cause, and repeat idempotency.
- [ ] Pin the core invariant with `expect(afterWorkflow).toEqual(beforeWorkflow)` for note/PM/scenario writes; assert PM status held, cause unconfirmed, financial validation false.
- [ ] Run these failing regressions before service implementation.
- [ ] Implement exact reference validation against current conversation/workflow/dependency projection. Append only owned records; use existing repository commit/version patterns. PM release, real dispatch and automatic owner acceptance are forbidden.
- [ ] Test/read scenario assumptions with `recoveredMinutes>=10&&<=40`, `effectiveness>=0&&<=1`, nonnegative demand/capacity, governed unit/horizon and finite operands; reject absent standards instead of supplying defaults.
- [ ] Add public Explore decision-support navigation/forms and read-only earlier-draft inspection. Derive shared state; keep unsubmitted drafts through errors. No automatic legacy import.
- [ ] Test real forms and packet contents: exact IDs/versions, source/cutoff, all linked current/historical records, no current relabeling of old captures.
- [ ] Run bounded service/public UI/compiled HTTP checks and record exact remaining56-gap implementation states.

## Task 2: Current metadata and contracts

**Files:** modify `app/src/investigation/manufacturingContract.ts`; create/update current contract documentation and a candidate identity check in the verification harness.

**Interfaces:** current contract includes `candidateRevision`, existing `apiVersion`, additive `decisionSupport`/`metricScenarios` capabilities; preserved old schemas remain readable.

- [ ] Assert GET contract reports the new candidate revision and real implemented routes, with synthetic/proposed labels.
- [ ] Update the metadata and docs to match actual code; retain old evidence as historical.
- [ ] Verify request API version stays `ekas-proposed-v1` and all prior record readers pass.
- [ ] Reconcile notice-copy status without claiming exact licence entitlement or production authentication.

## Task 3: Complete governed mock metric datasets/API

**Files:** create `app/src/investigation/metricScenarios.ts`, `MetricScenarioPanel.tsx`, `metricScenarios.test.ts`; modify existing `metricEngine.ts`/`positiveBinding.ts` only for verified missing bindings, plus `service.ts`, `clientPort.ts`, `MetricLab.tsx`, conversation/Guide dataset boundaries. Add separately versioned fixtures only when existing raw records cannot represent a required scenario.

**Interfaces:** `ScenarioQuery {metricIds:string[]; contextId:string; fixtureVersion:'training-positive-v2'; asOf:string; scope:Record<string,string>; parameters:Record<string,string|number|boolean>}`; `ScenarioResult {id:string; version:number; query:ScenarioQuery; rows:CanonicalResult['rows']; synthetic:true; financiallyValidated:false; causalStatus:'unconfirmed'}`. Catalogue enumerates all178 definitions with declared context, required inputs, units, window/knowledge cutoff, policies, source records and unavailability reasons. POST `/api/v1/manufacturing/metric-scenarios/query`, GET catalogue/result paths.

- [ ] Enumerate all178 definitions and independently calculate every scenario from its raw records; assert source record IDs exist, units/windows align, denominator statistics are meaningful and internally consistent.
- [ ] Preserve defaulttraining49observed/125missing/4qualificationblocked as a negative dataset; assert no backfill into original cases or training defaults.
- [ ] Test masked/missing/future/zero/incompatible data and Cp/Cpk/Pp/Ppk qualification; invalid datasets return unavailable and no fallback values.
- [ ] Implement explicit scenario catalogue/query persistence using existing positive raw aggregation and owned repository patterns. No arbitrary direct-input fallback.
- [ ] Make complete governed scenarios the clearly labelled demonstration entry; keep partial training and algebra examples selectable and labelled separately. Selecting a context displays its exact cutoff/scope before calculation.
- [ ] Add explicit chat/metrics dataset selection and return-original behavior, retaining old captures/case clock/state. Different context/horizon metrics remain separate results.
- [ ] Verify query -> captured answer -> native Board/DataPool/Grid/export share values/units/source identity. Preserve existing charts and layouts.

## Task 4: Bind all85 Guide workflows

**Files:** create `app/src/guideWorkflowBindings.ts`, `guideWorkflowBindings.test.ts`, `guideWorkflowTargets.test.tsx`; update `guideProcedures.ts`, `pageGuideRegistry.ts`, `Guide.tsx`, and only specific public control attributes/receipt emissions in existing screens.

**Interfaces:** `GuideWorkflowBinding {id:string; screen:string; action:string; source:string; target:GuideTarget; requiredInputs:string[]; authority:string; receiptKinds:string[]; unavailableReason:string|null; automaticBusinessAction:false}`. All85 retained workflow IDs map exactly once to a public callable action or an explicit gap/held reason.

- [ ] Assert every retained workflow has one binding; source/action names and public selectors resolve; no metadata-only entry is claimed callable.
- [ ] Inspect each actual callback/service action; map unsupported external/held functions explicitly. Security authority is not rerouted.
- [ ] Replace generic steps with task-specific inspect/input/focus/receipt steps, using visible enabled controls only.
- [ ] Test context/version mismatch, disabled/missing target, pending drafts, read-only inspections, no new receipt after skip/read, and exact completion receipt after ordinary user action.
- [ ] Test inline Help -> Show me -> Escape, foreground dialog ownership, repeated invokers and unavailable/recovery states. Native keyboard/menu/zoom/IME remains independent review work.

## Whole-candidate validation

- [ ] Run appropriate focused tests first; final browser typecheck/build before complete fixed serial source groups.
- [ ] Reconcile every prior source identity and original85/82 input/capture hash; build SSR and run compiled domain/UI/HTTP checks with unchanged budgets. Preserve failures and qualified rechecks.
- [ ] Audit 178scenario data,85bindings,56gap and82requirement matrices against final code; no whole closure from coverage alone.
- [ ] Freeze source/static/server/ZIP hashes, fresh extraction/zero-external-fetch proof and Library artifacts. Parent coordinates independent current-version native/domain/human acceptance.
