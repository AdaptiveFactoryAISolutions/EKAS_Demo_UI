# WP5B current-main reconciliation

Status: **PENDING INDEPENDENT REVIEW**. This package does not certify WP5B and does not request a live base URL or bearer.

## 1. Exact backend main SHA

| Field | Value |
|---|---|
| Repository | `AdaptiveFactoryAISolutions/EKAS_Platform_v2` |
| Branch | `main` |
| HEAD | `473bdc0d2458fcffdbe516d220d4f88bcb2f1916` |
| Root tree | `5d77277cb1678534e44c72b08da7e3df977c8b6e` |
| Commit note in the snapshot manifest | merge of PR #606, committed 2026-10-05 15:32 ET |
| Snapshot fetched | 2026-10-16 13:46 America/New_York, read-only |
| Files | 165 blobs. Every git blob SHA in `MANIFEST.md` was recomputed here: 165 matched, 0 mismatched. Manifest SHA-256 `c736d351777c3e882c8cce33d93baee59ba6d6c89e9472fa22dfe9bd72770359`. |
| This workspace | The snapshot was not copied into the UI repo and was not modified. |

This credential still cannot open the GitHub repository. The SHA above is the snapshot's recorded HEAD after the blob check. It was not assumed before that check.

### Addendum at the same SHA

A second read-only export, fetched 2026-10-16 13:57 America/New_York, holds five paths that the 165-file snapshot did not. Its manifest records the same repository, branch, and HEAD `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`. Git blob SHAs were recomputed here from the file bytes and matched the manifest. The addendum was not copied into this repo and was not modified.

| Path | Blob SHA | Bytes |
|---|---|---|
| `apps/web/src/features/pilot/schemas.ts` | `4de1da4a57ce9ba1d813ba8ee4ea3af236773aee` | 28511 |
| `contracts/tools/kernel.compute_metric.arguments.v1.json` | `d12beb62108dbdbf4d758653ee0a7f001725ec84` | 15776 |
| `contracts/tools/kernel.compute_metric.result.v1.json` | `8adaf4bd8d0daa892ce9fc1b54e38b37a1672438` | 5843 |
| `contracts/tools/kernel.aggregate_metric.arguments.v1.json` | `bc57de4e5d6658ad3e67d32c8844f32dc29c3c70` | 4216 |
| `contracts/tools/kernel.aggregate_metric.result.v1.json` | `4c43cd4a536365c20b6bebbab566ee22cd9341df` | 7260 |

Addendum missing-file list: none. These five paths were the unresolved file list from the prior round. Rows that stay UNVERIFIED below are contradictions or an unread branch inside a file the 165-file snapshot already contained. No further repository path is requested.

## 2. Current contract inventory

Read from the snapshot. `contracts/pilot/api-surface.v1.md` is the pilot surface. `contracts/api/openapi-v1.json` is a one-route stub (`GET /api/v1/metric-calculations/{calc_request_id}/failure` only). Its bytes are unchanged from the recorded `fe2635c` hash, and the file itself is still only that stub.

| Area | What the snapshot contains |
|---|---|
| Auth | `apps/api/ekas_api/auth.py`: RS256, issuer, audience, required `sub`, `tenant_id`, and current-mode `exp`/`iat`/`jti`/`azp`. `Principal` is `sub`, `tenant_id`, `roles` from `realm_access.roles`. Missing or malformed bearer is HTTP 401. Stale current authority is `AUTHORIZATION_STALE`. Signing-key or introspection failure can be 401 or retryable 503 `DEPENDENCY_UNAVAILABLE`. `authz.py` roles: `viewer`, `request_scope_certifier`, `data_steward`, `knowledge_editor`, `action_approver`, `action_recorder`. |
| Conversation | `conversations.py`: `POST /v1/conversations`, `GET /v1/conversations/{id}/turns`, `POST /v1/conversations/{id}/messages` with required `Idempotency-Key`. `history.py`: list, `PATCH`, draft get/put/delete, preferences. `GET /v1/conversations/{id}/events` is SSE. Message body is exactly one of `text`, `structured_request {metric, machine, window}`, or `clarification_answer`. Optional `client_context` and `attachment_refs`. Natural clarification allows `client_context.clarification_id` on text only (`natural_clarification.py`). Presentation labels are `operator`, `supervisor`, `plant_manager`, `continuous_improvement_engineer` (`explain.py`). |
| Context | `contracts/master-foundation/context-contract.v1.2.schema.json` is a full projection (`contract_version` 1.2.0, revision, resolved scope, facets). ICD-001's opening says CR-103 is approved and, in the same paragraph, that the clause is not to be depended on until effectivity. `retained_context` is still named on the pilot turn. The action loop says it is derived and is not read for manufacturing scope (`services/action_loop/ekas_action_loop/scope.py`). |
| Metrics | No `/v1/metrics` route in `apps/api`. `services/manufacturing-kernel/ekas_manufacturing_kernel/api.py` defines `POST /v1/tools/kernel.compute_metric`, and `create_app` in `main.py` does not mount it. Compute arguments/result v1 are in the addendum: an uncertified MET-004 candidate calculation for `SYN-TENANT-01`, not a metric-read API. Aggregate arguments/result v1 are in the addendum and titled draft, not effective. Arguments/result v2 files in the 165-file snapshot are titled draft. `apps/web/src/features/dashboards/metricsApi.ts` calls `GET /api/v1/metrics/oee-tiles-v2`. No matching route is in the snapshot. |
| Evidence | `GET /v1/evidence/{certification_id}` builds `certification_id`, scope certificate ref, result hash, kernel input ref, ledger hashes, snapshot refs, lineage refs, `certified_at`, `verdict`, and `completeness` (`_evidence_bundle`). Optional `publication` is added only when it matches the certified snapshot refs. A foreign, malformed, or missing id is one 403 `FORBIDDEN` / `EVIDENCE_FORBIDDEN`. The addendum `schemas.ts` names that bundle. Its publication `snapshot_id` and `approved_publication_ref` are nullable; the adapter still requires them when publication is present. |
| Investigation | No `/v1/investigations` or `/v1/cases` route or schema in the fetched routers. |
| Commands | `actions.py` opportunity routes: qualify, list, get, recommendations, dispositions (`APPROVE`/`REJECT`/`DEFER` in the web client), interventions, verifications, value, sustainment checks, financial assumptions. No owner-assignment route and no reopen route. |
| Version / idempotency | Conversation replay is `Idempotency-Key`. The same body replays. A different body is 409 `CONFLICT` / `IDEMPOTENCY_KEY_REUSED`. Draft writes use `expected_revision` and 409 `DRAFT_REVISION_CONFLICT`. No `If-Match`, `ETag`, or `expected_version` on the API routers. `services/agents/ekas_agents/context/store.py` has an internal `expected_version`. |
| Errors | `contracts/envelopes/error.v1.json` requires `error_class`, `error_code`, `message`, `correlation_id`, `retryable`, `occurred_at`. Classes are the nine in `contracts/errors/error-taxonomy.v1.json`. Conversation routes render that object. `main.py` also has a separate `{"error":"FM-VALIDATION-FAILED"}` handler for non-conversation validation. |
| Capabilities | Schema files under `contracts/capabilities/` and `contracts/master-foundation/capability-descriptor.v1.2.schema.json`. No capability route under `apps/`. |
| Health | `GET /healthz` returns `{status:"ok", component:"ui-shell-api", wp:"WP-P3-15"}` with no auth. `GET /livez` returns `{status:"ok", component:"api-runtime", wp:"WP-P4-23"}`. `GET /readyz` and `GET /v1/system/identity` go through `runtime_identity.py`. Identity requires a principal. |

## 3. Old-versus-current delta

Compared by SHA-256 of the same path. `fe2635cef64cf99eccad6c84df82bff466cb46df` content was not opened. A missing current file is `UNKNOWN`, not a reconstruction.

| Adapter dependency | Delta |
|---|---|
| `contracts/pilot/api-surface.v1.md` | CHANGED-ADAPTER-UPDATE-REQUIRED. Current text adds history, drafts, natural `clarification_id`, and the rule that `result.exact` exists only when OEE outcome is `VALUE`. |
| `apps/api/ekas_api/conversations.py` | CHANGED-ADAPTER-UPDATE-REQUIRED. Idempotency conflict code is `IDEMPOTENCY_KEY_REUSED`. Evidence always includes `completeness`. |
| `apps/api/ekas_api/auth.py` | CHANGED-ADAPTER-UPDATE-REQUIRED. Current principal is RS256 `sub` / `tenant_id` / `roles`, with `AUTHORIZATION_STALE`. |
| `apps/api/ekas_api/actions.py` | CHANGED. Opportunity routes are not investigation commands. No adapter route was added for them. |
| `apps/web/src/features/pilot/pilotClient.ts` | CHANGED-COMPATIBLE for the five pilot calls the adapter already makes. History, drafts, acquisition, knowledge, and opportunity helpers are new and not called. |
| `apps/web/src/features/pilot/schemas.ts` | READ in the addendum. Web-client zod only. It does not add a server route. |
| `kernel.compute_metric` arguments/result v1 | READ in the addendum. Uncertified candidate calculation. Not a mounted metric read. v2 files exist and are titled draft. |
| `kernel.aggregate_metric` arguments/result v1 | READ in the addendum. Both titles say draft, not effective. |
| `contracts/charts/oee-chart-contract.v2.json` | UNCHANGED. |
| `contracts/ontology/resolve-terms.v1.json` | UNCHANGED. |
| `contracts/api/openapi-v1.json` | UNCHANGED, and still a stub. |
| `knowledge.py`, `acquisition.py` | UNCHANGED. Not on the demo chat path. |
| Error envelope required `correlation_id`, `retryable`, `occurred_at` | CHANGED-ADAPTER-UPDATE-REQUIRED relative to the previous adapter, which treated them as optional. |
| `/v1/investigations`, owner assignment, reopen, `If-Match` | Not a fe2635c fill-in. Absent from the current routers that were read. |

Stale assumptions removed from the adapter: optional error fields, `error_class: AUTHORIZATION`, outcome word `OK`, an exact fraction on every component, and `verdict` limited to `CERTIFIED`.

## 4. Adapter mapping matrix

| UI capability | Adapter request | Current backend route / function | Request schema | Response schema | Auth | Version / idempotency | Error | Status |
|---|---|---|---|---|---|---|---|---|
| Demo chat | In-process `ManufacturingService`. Live mode does not call it. | Not a backend route. | Local `/api/v1/manufacturing/...` | Local `{code,message,retryable}` | Fictional `presentationOnly` label | Local `expectedVersion` and idempotency key | Local codes | Demo only. Not a current-main mapping. |
| Live bearer | `Authorization: Bearer` from the caller, or refusal before fetch | `auth.py` `current_principal_for_request` | Bearer JWT | `Principal` | RS256 `sub`, `tenant_id`, `roles` | Current authority can go stale mid-request | 401 `AUTHENTICATION_FAILED` or `AUTHORIZATION_STALE`; 503 `DEPENDENCY_UNAVAILABLE` | PARTIAL. Source read. Adapter tests the refusal and the envelopes. Signature verification was not executed. |
| Open / list / turns / message | `PilotAdapter` `/v1/conversations...` | `conversations.py` `open_conversation`, `conversation_turns`, `post_message` | One of text, structured request, clarification answer; optional label, question id, attachment refs | Created id and time; turn list; clarification or completed payload | Bearer; foreign id is 403 | `Idempotency-Key`; different body is `IDEMPOTENCY_KEY_REUSED` | §3.1 envelope | VERIFIED for those tested shapes. |
| Conversation stream | Not sent | `GET /v1/conversations/{id}/events` | None | `text/event-stream` | Bearer | None on this GET | 403 ownership | PARTIAL. Route exists. Adapter does not consume it. |
| History search, archive, drafts | Not sent | `history.py` | Query, patch, `expected_revision` | Summary, draft, 409 `DRAFT_REVISION_CONFLICT` | Bearer | Draft revision is the only HTTP compare-and-swap found | Typed 409 / 503 | PARTIAL. Documented. Not adapted. |
| Plant, line, job, part, shift, comparison period | Not sent as a pilot body | Context contract 1.2 and CR-103 scope | Projection / resolved scope | Not one retained-context object. Addendum `schemas.ts` still requires `retained_context` on a completed turn. Aggregate v1 titles say the CR-103 rollup is draft, not effective. | Server-side | Context store has an internal expected version | Not mapped | UNVERIFIED. The sources still contradict each other on whether CR-103 replaces `retained_context`. |
| Completed pilot context | `validatePilotTurn` still requires `retained_context.machine_ids`, ordered window, `ontology_version` | ICD-001 response-turn sentence and `api-surface.v1.md` | n/a | Those fields, plus optional `period_ref` and `metric` | n/a | n/a | Rejected turn, not a synthetic case | PARTIAL. Required by the ICD sentence. The CR-103 paragraph says the same field is superseded. |
| Chat metric slots | `structured_request` | `MessageBody.StructuredRequest` | `metric`, `machine`, `window` | Completed components | Bearer | Message idempotency key | 422 certification refusals described, not re-executed | VERIFIED for the request and the VALUE / non-VALUE exact rule. |
| Kernel metric | Not sent | `TOOL_PATH` in the kernel package; not mounted by `create_app` | Compute v1 is an uncertified bounded candidate. Aggregate v1 is draft, not effective. v2 arguments file is draft. | Compute v1 `result_kind` is `CANDIDATE_CALCULATION`. Aggregate v1 `result_kind` is `CANDIDATE_AGGREGATE` and is draft. v2 result file is draft. | Separate trusted context, unavailable in that module's default dependency | n/a | Kernel typed error | PARTIAL. The v1 files are read. They are not a governed metric read, and the tool is not mounted. v2 effectivity stays UNVERIFIED. |
| Dashboard OEE tiles | Not sent | No route for `/api/v1/metrics/oee-tiles-v2` | Web client only | Web client only | Web client sends auth headers | n/a | n/a | MISSING. |
| Evidence fetch | `GET /v1/evidence/sha256:{64 hex}` | `conversations.py` `evidence` | Path id | `_evidence_bundle` plus optional publication | Bearer; one 403 for foreign, missing, and malformed | n/a | `EVIDENCE_FORBIDDEN` | VERIFIED for the bundle fields the tests check. Cryptographic trust is not claimed. |
| Investigation create / read / lifecycle | Refused. Not translated. | No route | n/a | n/a | n/a | No `expected_version` header | `UNSUPPORTED_BACKEND_OPERATION` | MISSING. |
| Assignment, acceptance, recommendation, authorization, performed work, verification, sustain, reopen | Not sent. Opportunity paths are refused before fetch. | Opportunity routes cover recommendation, disposition, intervention, verification, and sustainment only | `actions.py` bodies | Addendum `schemas.ts` describes those opportunity records, including `responsible_owner` text, a sustainment `reopened` boolean, and optional financial fields | Roles `action_approver`, `action_recorder`, `request_scope_certifier` | No idempotency header on those handlers | Dependency 503 if the action-loop package is missing | NON-EQUIVALENT / PARTIAL. Owner assignment and reopen are MISSING. |
| Optimistic version on a chat or case write | `expectedVersion` on a pilot message is rejected | Not an HTTP field on message or opportunity routes | n/a | n/a | n/a | Draft `expected_revision` only | 409 only for drafts | MISSING for investigation writes. PARTIAL for drafts. |
| Idempotent message | `Idempotency-Key` | `_replay_or_conflict` | Same recorded body replays | 200 stored payload, or 409 | Bearer | Key plus body | `IDEMPOTENCY_KEY_REUSED` | VERIFIED. |
| Typed failure | `validatePilotError` | `error.v1.json`, `typed_errors.py` | n/a | Nine classes; required correlation, retryable, time | n/a | n/a | Malformed envelope is refused | VERIFIED for that object. |
| Capability negotiation | Not sent | No route in `apps/` | Schema files only | n/a | n/a | n/a | n/a | MISSING as an HTTP operation. |
| Health | `validateRuntimeProbe` for `/healthz` and `/livez` only | `main.py`, `runtime_identity.py` | None | The two literal bodies above | None for those two | n/a | Readiness failure body was not asserted | VERIFIED for `/healthz` and `/livez`. `/readyz` failure content is UNVERIFIED. |

## 5. Status list

**VERIFIED** (source read and a local contract test passes): pilot message exclusivity; natural clarification id; presentation labels; conversation idempotency conflict; §3.1 error object; completed VALUE versus non-VALUE exact binding; evidence bundle including optional publication; foreign-id 403 envelope; unauthenticated `/healthz` and `/livez` bodies; live timeout, missing bearer, and dependency 503 do not call the demo service.

**PARTIAL:** bearer authentication (source read, signature not executed); SSE events; history and drafts; retained context versus CR-103; opportunity commands versus the UI investigation lifecycle; draft compare-and-swap.

**MISSING:** `/v1/investigations` and `/v1/cases`; owner assignment; reopen; `/v1/metrics`; `/api/v1/metrics/oee-tiles-v2`; HTTP capability negotiation; `If-Match` / investigation `expected_version`.

The five previously absent files are read. Section 10 is the capability status after that read. The paragraph above is the prior round and is not the current status list.

No gap was filled from `fe2635c`.

## 6. Adapter changes

`app/src/platform/pilotAdapter.ts` now checks the current error object, presentation labels, text clarification id, attachment refs, `CERTIFIED` and `CERTIFIED_INCOMPLETE`, component outcomes `VALUE` / `NOT_APPLICABLE` / `EVIDENCE_INSUFFICIENT` / `NOT_SERVED`, and an exact fraction only when the outcome is `VALUE`.

`app/src/platform/backendMode.ts` still refuses a fictional role, a missing bearer, an undocumented path, and an investigation command. A live attempt at an unsupported investigation capability throws `UNSUPPORTED_BACKEND_OPERATION` with an explicit sentence, including "This connected EKAS backend does not currently support investigation ownership. No assignment was recorded." Opportunity paths are refused as not the investigation lifecycle. Kernel and metric paths are refused as no dedicated governed metric read. None of those refusals fetch, write local live state, or call the demo service. A timed-out fetch throws `LIVE_BACKEND_UNAVAILABLE`. `/healthz` and `/livez` have a shape check.

The accepted shell, WP4 journeys, and dashboards were not changed. The running UI still uses the synthetic manufacturing service.

## 7. Targeted contract tests

`npx vitest run src/platform/backendMode.test.ts src/platform/pilotAdapter.test.ts src/platform/integrationRecheck.test.ts src/platform/reviewerRegressions.test.ts` — 24 passed.

`npx tsc --noEmit` — passed.

Negative cases covered: backend unreachable, auth missing, auth denied, wrong tenant as `EVIDENCE_FORBIDDEN`, stale authorization, malformed error and evidence, unsupported route, opportunity and kernel paths refused before fetch, each missing investigation capability refused with its explicit sentence, reused idempotency key with a different body, timeout, dependency unavailable. A live failure does not call the demo service.

Full regression remains deferred to RC freeze.

## 8. Remaining live prerequisites

Not requested. Adapter Verified stays no while investigation, case, owner, reopen, and dedicated metric-read contracts are missing. No further repository path is requested. A later live gate would need, privately and not in this repo, a base URL, a caller-supplied bearer, and the tenant or plant identifier Patrick authorizes for a bounded test. No token is stored here. This round does not ask for them.

## 9. Live integration

**Live integration is not verified.** No live process was called.

## Separate states

| State | Result |
|---|---|
| Demo complete | Yes for the unchanged synthetic service. This package did not re-run WP4. |
| Backend adapter verified | No. |
| Live integration verified | No. |

WP5B current-main reconciliation complete. Adapter Verified: NO. Blocker: explicit current backend contract gaps. Live Integration Verified: NO.

The Backend Gap Contract is `docs/integration/WP5B-GAP-CONTRACT.md`. The PLC-to-P&L note is a separate future reference, `docs/integration/WP5B-PLC-PNL-REFERENCE.md`, and is not part of this acceptance.

## 10. Capability status after the addendum

Each row is one of VERIFIED, PARTIAL, MISSING, or UNVERIFIED. Opportunity records that share a word with the case lifecycle are NON-EQUIVALENT where STEP 3 requires that judgment. They were not renamed into investigation fields, and the accepted UI lifecycle was not changed to match them.

| Capability | Status | What current main shows |
|---|---|---|
| Authentication | PARTIAL | `auth.py` RS256 principal was read. Signature verification was not executed. The adapter refuses a missing bearer and a fictional role before fetch. |
| Authorization | PARTIAL | `authz.py` names `viewer`, `request_scope_certifier`, `data_steward`, `knowledge_editor`, `action_approver`, `action_recorder`. Enforcement was not executed. |
| Conversation | VERIFIED | Create, turns, and message routes match the adapter checks, including one-of message body, presentation labels, and natural `clarification_id` on text only. |
| Conversation history | PARTIAL | `history.py` list, archive, and draft routes exist. The adapter does not call them. |
| Streaming | PARTIAL | `GET /v1/conversations/{id}/events` is SSE. The adapter does not consume it. |
| Context/scope | UNVERIFIED | ICD-001 both treats CR-103 as approved and forbids depending on it. Context contract 1.2 is titled draft. `schemas.ts` still requires `retained_context` on a completed turn. Aggregate v1 says the CR-103 rollup is draft, not effective. The contradiction is not resolved. |
| Metrics | PARTIAL | A conversation `structured_request` can name `metric`, `machine`, and `window`, and a completed turn can return certified components. There is no dedicated governed metric-read route. Compute v1 is an uncertified candidate schema and is not mounted. Aggregate v1 is draft, not effective. `/api/v1/metrics/oee-tiles-v2` has no route. |
| Evidence/provenance | VERIFIED | The evidence route and the adapter tests agree on the bundle fields. `schemas.ts` names the same fields. |
| Investigation create/read/update | MISSING | No investigation route or schema in the fetched routers or in `schemas.ts`. |
| Case lifecycle | MISSING | No case resource. |
| Owner request | MISSING | No request operation. `recommendation.responsible_owner` is text on an opportunity recommendation. |
| Owner acceptance | MISSING | No acceptance operation. |
| Hypothesis | MISSING | No hypothesis field or route. |
| Recommendation | PARTIAL | NON-EQUIVALENT. An opportunity recommendation has `proposed_action`, `responsible_owner`, `intended_result`, and `verification_method`. That is not an investigation recommendation. It is not called. |
| Authorization (case decision) | PARTIAL | NON-EQUIVALENT. A disposition records a decision on an opportunity recommendation. That is not investigation authorization. Access authorization is the earlier row. |
| Performed work | PARTIAL | NON-EQUIVALENT. An intervention records `performed_by`, `performed_at`, and `description`. That is not investigation performed work. It is not called. |
| Verification plan | PARTIAL | NON-EQUIVALENT. `verification_method` has `baseline_period`, `post_period`, and `rule_ref`. It does not carry the investigation plan's main measure, target, observation requirements, and guardrails. |
| Verification result | PARTIAL | NON-EQUIVALENT. An opportunity verification compares two certification ids. It is not an investigation verification result with acceptance. |
| Safety/guardrail review | MISSING | No safety or guardrail review route or schema. |
| Sustain | PARTIAL | NON-EQUIVALENT. A sustainment check has `period_ref`, `time_basis`, `outcome`, and an optional `reopened` boolean. It is not an investigation sustain rule, threshold, and status. |
| Recurrence | PARTIAL | NON-EQUIVALENT. `opportunity.factors.recurrence` is a ranking quantity. It is not an investigation recurrence record. |
| Reopen/new cycle | MISSING | No operation that preserves the prior cycle and opens a new one. The sustainment `reopened` boolean is not that operation. |
| Expected-version handling | MISSING | Investigation commands have no `expectedVersion`. Draft `expected_revision` is a different resource and does not supply this row. |
| Optimistic concurrency | PARTIAL | Draft writes use `expected_revision` and can return 409 `DRAFT_REVISION_CONFLICT`. Message and opportunity routes have no `If-Match` or `ETag`. |
| Idempotency | PARTIAL | Conversation `Idempotency-Key` replay and `IDEMPOTENCY_KEY_REUSED` are verified. Opportunity handlers have no idempotency header. Investigation commands have no route. |
| Health/readiness | PARTIAL | `/healthz` and `/livez` bodies are verified. The `/readyz` failure body was not asserted. `runtime_identity.py` was already in the 165-file snapshot. |
| Error semantics | VERIFIED | Conversation routes use `error.v1`, and the adapter requires `error_class`, `error_code`, `message`, `correlation_id`, `retryable`, and `occurred_at`. `schemas.ts` treats the last three as optional; that client schema is not the server contract, and the adapter was not loosened to match it. |

`schemas.ts` is a web-client zod layer. It also describes acquisition, knowledge, observed downtime events labeled `OBSERVED_FACT`, and opportunity value with an optional financial assumption. Those client shapes do not add server routes and do not make a governed downtime-cost or P&L read. Kernel compute v1 `result_kind` is `CANDIDATE_CALCULATION` for `EKAS-MIK-001@1.0.1#MET-004` on `SYN-TENANT-01`. Kernel aggregate v1 `result_kind` is `CANDIDATE_AGGREGATE`, and both aggregate titles say draft, not effective.

Rows still UNVERIFIED, with no absent path left to request: whether CR-103 replaces `retained_context`; kernel v2 effectivity; the `/readyz` failure body.
