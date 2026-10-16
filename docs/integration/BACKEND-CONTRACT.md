# Backend contract

This is the boundary the local demo expects. It is not a second closure register. Three states stay separate. A missing live backend does not block Demo complete.

| State | Meaning on 2026-10-15 |
|---|---|
| Demo complete | The plant-leader journey runs on the synthetic local adapter with no network call to EKAS. |
| Adapter verified | A typed adapter and contract tests match a documented interface. |
| Live integration verified | Auth, real calls, persistence, errors, and a real environment were exercised against current `EKAS_Platform_v2` `main`. |

A retry on 2026-10-15, as GitHub account `cursor`, still cannot read `github.com/AdaptiveFactoryAISolutions/EKAS_Platform_v2`. `gh api repos/AdaptiveFactoryAISolutions/EKAS_Platform_v2` returns HTTP 404 / "Not Found". `git ls-remote` returns "Repository not found". Current `main` was not opened. Compatibility with current `EKAS_Platform_v2` `main` remains **UNVERIFIED**. No row below is **VERIFIED** against current `main`.

A further read-only retry on 2026-10-16 received the same repository HTTP 404 / "Not Found" from `gh api repos/AdaptiveFactoryAISolutions/EKAS_Platform_v2`, and `git ls-remote` again returned "Repository not found". `gh api user` returned HTTP 403, so this run could not read an account login. No live base URL or bearer was configured. Current `main` was then reconciled from a read-only 165-file snapshot whose manifest records HEAD `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`, after every listed blob SHA was recomputed. That reconciliation is `docs/integration/WP5B-CURRENT-MAIN.md`. It does not verify live integration. The rows below this paragraph remain the earlier fe2635c record.

**MISSING IN BACKEND** means the route or behavior is absent from the recorded baseline that was actually inspected, `fe2635cef64cf99eccad6c84df82bff466cb46df` in `docs/V2-SOURCE-IDENTITY.json` (branch `docs/d274-sonar-host-identity-skips` on a private working copy). It is not a claim about current EKAS v2. Where that baseline and the local adapter agree, the mapping is **PARTIAL**.

Live failure must say that the live EKAS connection is unavailable and let the user choose demo mode. The local demo must not silently pretend a live call succeeded.

## Identity and roles

Demo roles are fictional session labels: `manager`, `supervisor`, `maintenance`, `safety`, `viewer` (`app/src/investigation/Replies.tsx`). Command guards in the local manufacturing service check those labels. Example: comparison work proof requires `maintenance`, and acceptance requires `manager` (`app/src/investigation/comparison.ts`). Sessions used by the in-process client carry `presentationOnly: true`. They are not bearer credentials.

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| Fictional role on the next local command | Implemented in the local service | Not an adapter concern | Not run | **MISSING IN BACKEND** as production auth. `PilotAdapter` does not authenticate (`app/src/platform/pilotAdapter.ts` lines 41–42). |
| Bearer session supplied by the caller | Not used by the local demo | The adapter accepts an injected wire and does not mint tokens (`pilotAdapter.ts` lines 41–44) | Not run | **PARTIAL** against recorded baseline `fe2635ce`. Current `main` `apps/api/ekas_api/auth.py` was not opened and remains **UNVERIFIED**. |

## Manufacturing scope, hierarchy, and time

Local manufacturing cases use explicit synthetic identities: plant, line, asset, part, revision, job, operation, and shift. The supplied cases are downtime (`FEED-03`), speed (`PRESS-S1`), and quality (`FORM-Q1`). Monthly rows use `Machine 1` and `Machine 2` with month names. Training queries use the training-plant grain. Captured timestamps that the pilot adapter checks are RFC3339 instants (`app/src/platform/pilotTime.ts`, used from `pilotAdapter.ts`).

A month name without a year still uses the supplied 2026 monthly cohort. An explicit year other than that cohort, including March 2025, is refused and no 2026 figure is published (`N04.01`, now implemented on this candidate and awaiting final-RC acceptance). "Why did we miss production yesterday?" says "I don't have data for yesterday. The latest available production day is 2026-10-06. Would you like me to use that?" and answers the plan only after that day is accepted. It does not open the training dataset and does not swap the day in silently.

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| ISA95-style case tuple on a manufacturing turn | Local context object | Pilot completed turns require `machine_id`, ordered `window_start`/`window_end`, and `ontology_version` (`pilotAdapter.ts` lines 35–37) | Not run | **PARTIAL**. Site, line, part, revision, and job are not required by the pilot turn validator. |
| Half-open windows and cohort identity | Enforced inside the local investigation service for governed cases | Pilot windows must end after they start and must not end after certification (`pilotAdapter.ts` line 37) | Not run | **PARTIAL**. |
| Production plant timezone and unavailable periods | Explicit non-cohort years are refused locally. Yesterday is refused with an offer of the latest supplied production day, 2026-10-06, and that day is used only after acceptance | Not covered by the pilot adapter | Not run | **MISSING IN BACKEND** relative to inspected baseline `fe2635ce`. Current `main` remains **UNVERIFIED**. Demo acceptance does not wait on that. |

## Conversation, Governor, and ContextContract

The running UI talks to an in-process `ManufacturingService` through `/api/v1/manufacturing/conversations` and `/api/v1/manufacturing/conversations/{id}/messages` (`app/src/investigation/decisionCapabilities.ts`). One conversation holds dataset, training query, monthly context, manufacturing context, and the active case id (`app/src/investigation/service.ts`).

`Governor` and `ContextContract` are names in the product goal. This UI does not import either type. Local command guards are the demo stand-in.

The source-derived pilot adapter is a different surface: `POST /v1/conversations`, `GET /v1/conversations`, `GET /v1/conversations/{id}/turns`, `POST /v1/conversations/{id}/messages` with `Idempotency-Key`, and `GET /v1/evidence/sha256:{64hex}` (`pilotAdapter.ts` lines 53–57). A pilot message is exactly one of text (≤4000), `structured_request` (`metric`, `machine`, `window`), or `clarification_answer` (`pilotAdapter.ts` lines 6–23). Narrative is rejected (`pilotAdapter.ts` line 29).

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| Local manufacturing conversation | Implemented and used by Chat Home | Contract tests cover the in-process service, not the v2 wire | Not run | **MISSING IN BACKEND** relative to inspected baseline `fe2635ce`. `/api/v1/manufacturing/*` is not on that recorded surface. Current `main` remains **UNVERIFIED**. |
| Pilot conversation wire | Not on the Chat Home path | Validator implemented; no default network transport (`pilotAdapter.ts` lines 2–4, 44–57) | Not run | **PARTIAL** against recorded `apps/api/ekas_api/conversations.py` at `fe2635ce`. Current `main` line numbers remain **UNVERIFIED**. |
| Governor / ContextContract | Not present under those names | Not implemented in `PilotAdapter` | Not run | **MISSING IN BACKEND** relative to inspected baseline `fe2635ce`. Current `main` remains **UNVERIFIED**. |

## Analytics

Chat can request OEE, availability, performance, quality, FPY, and downtime. Governed manufacturing answers come from the case view. Training and monthly answers come from other datasets, and the context bar must name the dataset that produced the answer. The Metrics page demonstrates synthetic definitions through `/api/v1/manufacturing/metric-demonstrations` (`app/src/investigation/metricDemonstrations.ts`). The pilot completed-turn result requires a certified exact fraction and availability, performance, quality, and OEE components (`pilotAdapter.ts` lines 36–39).

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| Synthetic case and training metrics | Implemented. "Why did we miss production yesterday?" offers 2026-10-06 and answers the supplied plan only after acceptance. It stays off the training dataset (`N04.03`). | Pilot result shape is validated when a wire is injected | Not run | **PARTIAL** for the pilot metric result. The manufacturing metric-demonstration route is **MISSING IN BACKEND** relative to inspected baseline `fe2635ce`. |
| Recorded kernel metric contracts | Not executed against the backend | Hashes only, in `docs/V2-SOURCE-IDENTITY.json` | Not run | **PARTIAL**. `contracts/tools/kernel.compute_metric.*.v1.json` and `contracts/charts/oee-chart-contract.v2.json` were not re-opened. |

## Evidence

A captured reply keeps its source ids, timestamp, and evidence dialog (`app/src/investigation/Replies.tsx`). Pilot evidence requires `certification_id`, verdict `CERTIFIED`, `certified_at`, and lineage arrays (`pilotAdapter.ts` lines 57). The local demo does not perform cryptographic verification.

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| Captured synthetic evidence on a reply | Implemented | Pilot evidence schema checked only for an injected wire | Not run | **PARTIAL** against recorded evidence identity at `fe2635ce`. Cryptographic trust is **MISSING IN BACKEND** from the local adapter (`docs/PILOT-ADAPTER-MAPPING.md`). Current `main` remains **UNVERIFIED**. |

## Workflow transitions

Local transitions are separate: goal, loss, evidence, hypothesis, action, owner acceptance, authorization, performed work, verification, sustainment, and reopen. Approval is not performed work, and performed work is not verification. Improvements and Chat read the same investigation view (`app/src/investigation/CanonicalWorkspace.tsx`). Decision-support writes stay on `/api/v1/manufacturing/decision-support` and do not release production or dispatch work (`app/src/investigation/decisionSupport.ts`).

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| Synthetic investigation lifecycle | Implemented for the supplied cases. The lightweight journey opens "We missed our production goal." and shows that case under Improvements. | No pilot route carries these commands | Not run | **MISSING IN BACKEND** relative to inspected baseline `fe2635ce`. Recorded `apps/api/ekas_api/actions.py` was not re-opened. Current `main` remains **UNVERIFIED**. |

## Errors

Pilot HTTP errors must be `{ error: { error_class, error_code, message, retryable? } }` with `retryable` absent or boolean (`pilotAdapter.ts` lines 13 and 50). Local manufacturing replies use `{ code, message, retryable }` and statuses such as 403 `FORBIDDEN`, 404 `NOT_FOUND` / `UNKNOWN_ENDPOINT`, and 422 `INVALID_REQUEST` (`app/src/investigation/comparison.ts`). Idempotency keys are required on pilot messages (`pilotAdapter.ts` line 56) and on local commands. Reusing one local key for a different turn conflicts; callers mint a new key per turn.

| | Demo complete | Adapter verified | Live integration verified | Backend mapping |
|---|---|---|---|---|
| Typed error envelope | Local codes are implemented | Pilot envelope is validated | Not run | **PARTIAL** for the pilot envelope against baseline `fe2635ce`. Production enum completeness is **MISSING IN BACKEND** relative to that baseline (`docs/PILOT-ADAPTER-MAPPING.md`). Current `main` remains **UNVERIFIED**. |
| Live outage disclosure | Required before any live mode is offered. Not exercised, because no live client is connected. | Not applicable | Not run | **UNVERIFIED** against current `main`. A live refusal has not been observed. |

## What would move a row to VERIFIED

Opening current `EKAS_Platform_v2` `main`, citing the implementing file and line, and running the adapter contract tests against that process would be required before any row can say **VERIFIED**. This credential still cannot open that repository. Demo complete is judged only on the local synthetic product.
