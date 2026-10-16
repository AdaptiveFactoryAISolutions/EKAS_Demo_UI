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

## 2. Current contract inventory

Read from the snapshot. `contracts/pilot/api-surface.v1.md` is the pilot surface. `contracts/api/openapi-v1.json` is a one-route stub (`GET /api/v1/metric-calculations/{calc_request_id}/failure` only). Its bytes are unchanged from the recorded `fe2635c` hash, and the file itself is still only that stub.

| Area | What the snapshot contains |
|---|---|
| Auth | `apps/api/ekas_api/auth.py`: RS256, issuer, audience, required `sub`, `tenant_id`, and current-mode `exp`/`iat`/`jti`/`azp`. `Principal` is `sub`, `tenant_id`, `roles` from `realm_access.roles`. Missing or malformed bearer is HTTP 401. Stale current authority is `AUTHORIZATION_STALE`. Signing-key or introspection failure can be 401 or retryable 503 `DEPENDENCY_UNAVAILABLE`. `authz.py` roles: `viewer`, `request_scope_certifier`, `data_steward`, `knowledge_editor`, `action_approver`, `action_recorder`. |
| Conversation | `conversations.py`: `POST /v1/conversations`, `GET /v1/conversations/{id}/turns`, `POST /v1/conversations/{id}/messages` with required `Idempotency-Key`. `history.py`: list, `PATCH`, draft get/put/delete, preferences. `GET /v1/conversations/{id}/events` is SSE. Message body is exactly one of `text`, `structured_request {metric, machine, window}`, or `clarification_answer`. Optional `client_context` and `attachment_refs`. Natural clarification allows `client_context.clarification_id` on text only (`natural_clarification.py`). Presentation labels are `operator`, `supervisor`, `plant_manager`, `continuous_improvement_engineer` (`explain.py`). |
| Context | `contracts/master-foundation/context-contract.v1.2.schema.json` is a full projection (`contract_version` 1.2.0, revision, resolved scope, facets). ICD-001's opening says CR-103 is approved and, in the same paragraph, that the clause is not to be depended on until effectivity. `retained_context` is still named on the pilot turn. The action loop says it is derived and is not read for manufacturing scope (`services/action_loop/ekas_action_loop/scope.py`). |
| Metrics | No `/v1/metrics` route in `apps/api`. `services/manufacturing-kernel/ekas_manufacturing_kernel/api.py` defines `POST /v1/tools/kernel.compute_metric`, and `create_app` in `main.py` does not mount it. Arguments/result v2 files are present and titled draft, not effective. Arguments/result v1 files are not in the snapshot. `apps/web/src/features/dashboards/metricsApi.ts` calls `GET /api/v1/metrics/oee-tiles-v2`. No matching route is in the snapshot. |
| Evidence | `GET /v1/evidence/{certification_id}` builds `certification_id`, scope certificate ref, result hash, kernel input ref, ledger hashes, snapshot refs, lineage refs, `certified_at`, `verdict`, and `completeness` (`_evidence_bundle`). Optional `publication` is added only when it matches the certified snapshot refs. A foreign, malformed, or missing id is one 403 `FORBIDDEN` / `EVIDENCE_FORBIDDEN`. `apps/web/src/features/pilot/schemas.ts` is not in the snapshot. |
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
| `apps/web/src/features/pilot/schemas.ts` | UNKNOWN. Not in the snapshot. |
| `kernel.compute_metric` arguments/result v1 | UNKNOWN. Not in the snapshot. v2 files exist and are titled draft. |
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
| Plant, line, job, part, shift, comparison period | Not sent as a pilot body | Context contract 1.2 and CR-103 scope | Projection / resolved scope | Not one retained-context object | Server-side | Context store has an internal expected version | Not mapped | UNVERIFIED. The snapshot contradicts itself on whether CR-103 replaces `retained_context`. |
| Completed pilot context | `validatePilotTurn` still requires `retained_context.machine_ids`, ordered window, `ontology_version` | ICD-001 response-turn sentence and `api-surface.v1.md` | n/a | Those fields, plus optional `period_ref` and `metric` | n/a | n/a | Rejected turn, not a synthetic case | PARTIAL. Required by the ICD sentence. The CR-103 paragraph says the same field is superseded. |
| Chat metric slots | `structured_request` | `MessageBody.StructuredRequest` | `metric`, `machine`, `window` | Completed components | Bearer | Message idempotency key | 422 certification refusals described, not re-executed | VERIFIED for the request and the VALUE / non-VALUE exact rule. |
| Kernel metric | Not sent | `TOOL_PATH` in the kernel package; not mounted by `create_app` | v2 arguments file is draft; v1 file absent | v2 result file is draft | Separate trusted context, unavailable in that module's default dependency | n/a | Kernel typed error | UNVERIFIED for the effective contract. |
| Dashboard OEE tiles | Not sent | No route for `/api/v1/metrics/oee-tiles-v2` | Web client only | Web client only | Web client sends auth headers | n/a | n/a | MISSING. |
| Evidence fetch | `GET /v1/evidence/sha256:{64 hex}` | `conversations.py` `evidence` | Path id | `_evidence_bundle` plus optional publication | Bearer; one 403 for foreign, missing, and malformed | n/a | `EVIDENCE_FORBIDDEN` | VERIFIED for the bundle fields the tests check. Cryptographic trust is not claimed. |
| Investigation create / read / lifecycle | Refused. Not translated. | No route | n/a | n/a | n/a | No `expected_version` header | `UNSUPPORTED_BACKEND_OPERATION` | MISSING. |
| Assignment, acceptance, recommendation, authorization, performed work, verification, sustain, reopen | Not sent | Opportunity routes cover recommendation, disposition, intervention, verification, and sustainment only | `actions.py` bodies | Web client expects schemas that are not in the snapshot | Roles `action_approver`, `action_recorder`, `request_scope_certifier` | No idempotency header on those handlers | Dependency 503 if the action-loop package is missing | PARTIAL. Different resources. Owner assignment and reopen are MISSING. |
| Optimistic version on a chat or case write | `expectedVersion` on a pilot message is rejected | Not an HTTP field on message or opportunity routes | n/a | n/a | n/a | Draft `expected_revision` only | 409 only for drafts | MISSING for investigation writes. PARTIAL for drafts. |
| Idempotent message | `Idempotency-Key` | `_replay_or_conflict` | Same recorded body replays | 200 stored payload, or 409 | Bearer | Key plus body | `IDEMPOTENCY_KEY_REUSED` | VERIFIED. |
| Typed failure | `validatePilotError` | `error.v1.json`, `typed_errors.py` | n/a | Nine classes; required correlation, retryable, time | n/a | n/a | Malformed envelope is refused | VERIFIED for that object. |
| Capability negotiation | Not sent | No route in `apps/` | Schema files only | n/a | n/a | n/a | n/a | MISSING as an HTTP operation. |
| Health | `validateRuntimeProbe` for `/healthz` and `/livez` only | `main.py`, `runtime_identity.py` | None | The two literal bodies above | None for those two | n/a | Readiness failure body was not asserted | VERIFIED for `/healthz` and `/livez`. `/readyz` failure content is UNVERIFIED. |

## 5. Status list

**VERIFIED** (source read and a local contract test passes): pilot message exclusivity; natural clarification id; presentation labels; conversation idempotency conflict; §3.1 error object; completed VALUE versus non-VALUE exact binding; evidence bundle including optional publication; foreign-id 403 envelope; unauthenticated `/healthz` and `/livez` bodies; live timeout, missing bearer, and dependency 503 do not call the demo service.

**PARTIAL:** bearer authentication (source read, signature not executed); SSE events; history and drafts; retained context versus CR-103; opportunity commands versus the UI investigation lifecycle; draft compare-and-swap.

**MISSING:** `/v1/investigations` and `/v1/cases`; owner assignment; reopen; `/v1/metrics`; `/api/v1/metrics/oee-tiles-v2`; HTTP capability negotiation; `If-Match` / investigation `expected_version`.

**UNVERIFIED:** effective kernel v1 contract (files absent); kernel v2 effectivity (file title says draft, ICD opening disagrees); `schemas.ts`; whether CR-103 `scope` replaces `retained_context`; `/readyz` failure body; any route not in the 165 files.

No gap was filled from `fe2635c`.

## 6. Adapter changes

`app/src/platform/pilotAdapter.ts` now checks the current error object, presentation labels, text clarification id, attachment refs, `CERTIFIED` and `CERTIFIED_INCOMPLETE`, component outcomes `VALUE` / `NOT_APPLICABLE` / `EVIDENCE_INSUFFICIENT` / `NOT_SERVED`, and an exact fraction only when the outcome is `VALUE`.

`app/src/platform/backendMode.ts` still refuses a fictional role, a missing bearer, an undocumented path, and an investigation command. A timed-out fetch throws `LIVE_BACKEND_UNAVAILABLE` and does not call the demo service. `/healthz` and `/livez` have a shape check. Opportunity and kernel paths are refused rather than invented.

The accepted shell, WP4 journeys, and dashboards were not changed. The running UI still uses the synthetic manufacturing service.

## 7. Targeted contract tests

`npx vitest run src/platform/backendMode.test.ts src/platform/pilotAdapter.test.ts src/platform/integrationRecheck.test.ts src/platform/reviewerRegressions.test.ts` — 24 passed.

`npx tsc --noEmit` — passed.

Negative cases covered: backend unreachable, auth missing, auth denied, wrong tenant as `EVIDENCE_FORBIDDEN`, stale authorization, malformed error and evidence, unsupported route, reused idempotency key with a different body, timeout, dependency unavailable. A live failure does not call the demo service.

Full regression remains deferred to RC freeze.

## 8. Remaining live prerequisites

Not requested now. Adapter Verified is not met while the UNVERIFIED and MISSING rows above are open. A later live gate would need, privately and not in this repo: repository read of current `main` beyond this 165-file subset, then a base URL, a caller-supplied bearer, and the tenant or plant identifier Patrick authorizes for a bounded test. No token is stored here.

Files that would close specific UNVERIFIED rows, if fetched read-only at this same SHA:

- `apps/web/src/features/pilot/schemas.ts`
- `contracts/tools/kernel.compute_metric.arguments.v1.json`
- `contracts/tools/kernel.compute_metric.result.v1.json`
- `contracts/tools/kernel.aggregate_metric.arguments.v1.json`
- `contracts/tools/kernel.aggregate_metric.result.v1.json`

## 9. Live integration

**Live integration is not verified.** No live process was called.

## Separate states

| State | Result |
|---|---|
| Demo complete | Yes for the unchanged synthetic service. This package did not re-run WP4. |
| Backend adapter verified | No. Reconciled and tested against snapshot `473bdc0d2458fcffdbe516d220d4f88bcb2f1916` for the VERIFIED rows only. PARTIAL, MISSING, and UNVERIFIED rows remain. |
| Live integration verified | No. |
