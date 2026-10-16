# WP5B compatibility matrix

Superseded for current-main claims by `docs/integration/WP5B-CURRENT-MAIN.md` at snapshot `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`, including the five-file addendum at that same SHA. The table below is the earlier fe2635c-oriented pass and is not the current mapping.

Status: **PENDING INDEPENDENT REVIEW**. This file does not certify WP5B.

Three states stay separate.

| State | Result of this package |
|---|---|
| Demo complete | Unchanged. Chat still uses the in-process synthetic `ManufacturingService`. A missing live backend does not change that path. This package does not re-certify WP4. |
| Adapter verified | Contract tests exercise the documented pilot interface through an injected fetch or wire. Pending independent review. This is not verification against current `EKAS_Platform_v2` `main`. |
| Live integration verified | Not run. Current `main` was not opened and no live process was called. |

Documented means the behavior is described by the recorded baseline `fe2635cef64cf99eccad6c84df82bff466cb46df` (`docs/V2-SOURCE-IDENTITY.json`) and the source-derived adapter in `app/src/platform/pilotAdapter.ts`. The baseline files are not in this workspace. Current `EKAS_Platform_v2` `main` was not opened on 2026-10-16: `gh api repos/AdaptiveFactoryAISolutions/EKAS_Platform_v2` returned HTTP 404 / "Not Found", and `git ls-remote` returned "Repository not found". `gh api user` returned HTTP 403, so this run could not name the credential. No row is live-tested.

| Contract area | Documented | Adapter-tested | Live-tested | Evidence |
|---|---|---|---|---|
| Auth | Caller supplies the bearer. `PilotAdapter` does not mint tokens. Fictional roles (`manager`, `supervisor`, `maintenance`, `safety`, `viewer`) are `presentationOnly` labels. RS256 principal, tenant, and role checks are in recorded `apps/api/ekas_api/auth.py`, which was not re-opened. | Yes. A fictional role or a `presentationOnly` string is refused before fetch. A caller bearer is forwarded as `Authorization`. HTTP 401 stays `PilotResponseError`. | No | `app/src/platform/backendMode.ts` `assertLiveAccess`, `LivePilotWire.send`; `app/src/platform/backendMode.test.ts` bearer and role cases; `app/src/platform/pilotAdapter.ts` class comment |
| Context | A completed pilot turn binds `retained_context.machine_ids`, ordered `window_start` / `window_end`, and `ontology_version` to `result.machine_id`. | Yes. A completed fixture is accepted. Moving `machine_id` outside `machine_ids` is rejected and is not replaced with a local case. | No | `pilotAdapter.ts` `validatePilotTurn`; `backendMode.test.ts` metric/context case |
| Metric | A message is one `structured_request` of `metric`, `machine`, and `window`, or text, or a clarification answer. A completed result needs an exact fraction and availability, performance, quality, and OEE components. | Yes. The structured request is sent unchanged with its idempotency key. The completed fixture's exact fraction is preserved. | No | `pilotAdapter.ts` `validatePilotMessage`, `validatePilotTurn`; `backendMode.test.ts` |
| Evidence | `GET /v1/evidence/sha256:{64hex}` must echo that certification id, verdict `CERTIFIED`, time, and lineage arrays. Cryptographic verification is not in the local adapter. | Yes. Matching identity resolves. A different `certification_id` is rejected. | No | `pilotAdapter.ts` `fetchEvidence`; `backendMode.test.ts`; `docs/PILOT-ADAPTER-MAPPING.md` |
| Investigation | Local investigation lifecycle is `/api/v1/manufacturing/investigations`. That route is not on the recorded pilot surface. | Yes, as a refusal. `refuseLiveInvestigationCommand` throws `UNSUPPORTED_BACKEND_OPERATION` and does not call demo or fetch. | No | `backendMode.ts`; `docs/integration/BACKEND-CONTRACT.md` workflow section |
| Command | Recorded pilot routes are conversation create, list, turns, messages, and evidence get. Workflow commands are not pilot messages. | Yes, as a refusal. `/api/v1/manufacturing/.../commands` and `/v1/actions` are not sent. | No | `backendMode.ts` `assertDocumentedPilotPath`; `backendMode.test.ts` |
| Version / idempotency | Pilot messages carry `Idempotency-Key` and do not carry `expectedVersion`. Exclusive message bodies are text, structured request, or clarification answer. Uniform compare-and-swap is not a documented pilot field. | Yes. `expectedVersion` makes the body exclusive and is rejected. Reusing one key for a different body surfaces `IDEMPOTENCY_CONFLICT` from the wire. The adapter sends the second body and does not replay the first. | No | `pilotAdapter.ts` `validatePilotMessage`, `sendMessage`; `backendMode.test.ts` |
| Error behavior | Pilot errors are `{ error: { error_class, error_code, message, retryable? } }`. A live outage must say the live connection is unavailable and must not answer from demo data. | Yes. Network failure and non-JSON failure throw `LIVE_BACKEND_UNAVAILABLE`. A partial error object throws `Invalid pilot error envelope`. Demo send count stays unchanged. | No | `backendMode.ts` `LiveBackendUnavailable`; `pilotAdapter.ts` error branch; `backendMode.test.ts` |

Adapter-tested rows use an injected `fetch`. They do not open `EKAS_Platform_v2` and they do not prove a deployed API.

## USER ACTION

1. Grant this credential read access to `github.com/AdaptiveFactoryAISolutions/EKAS_Platform_v2` so current `main` can be compared with recorded baseline `fe2635cef64cf99eccad6c84df82bff466cb46df`. The repository is HTTP 404 for this credential.
2. Provide the live API base URL and a caller-supplied bearer for that deployment. No URL or token is stored here. This package does not guess either value.

## Not claimed

Shell, WP4 journeys, and dashboards were not changed. No dashboard or journey defect was exposed by this wiring, because the running UI was not switched off the synthetic service. Cancellation and uniform compare-and-swap remain unsupported on the documented pilot surface. Production enum completeness, tenant binding, RS256 verification, and cryptographic evidence trust remain deferred.
