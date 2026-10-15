# V55 service adapter contract — proposed, synthetic

OpenAI is the selected future model provider. Its key belongs on the server. No key has been accessed or configured. The browser receives no credential and the current static app does not invoke a provider. There is no Ollama fallback. The separately frozen Dot V54 server contains the provider adapter, streaming/cancel handling, tool governance and cumulative budget checks, but remains undeployed behind its held independent gate. This candidate does not override that gate or the expired price guard.

Tom's backend must implement or map the operations below through an authenticated server adapter. Its actual endpoints, OpenAPI schema, tenant/entity identity mappings, permissions and response/error shapes are still required for conformance testing. The fixture-only `presentationOnly` sessions are not production authentication.

| Method | Proposed route | Semantics |
|---|---|---|
| POST | /api/v1/manufacturing/conversations | Create one durable conversation with optional retained query context. |
| GET | /api/v1/manufacturing/conversations[/id] | List or read saved conversation and immutable historical snapshots. |
| POST | /api/v1/manufacturing/conversations/id/messages | expectedVersion, text, idempotency key; atomic conversation and investigation change. |
| POST | /api/v1/manufacturing/conversations/id/commands | expectedVersion and archive/restore; preserves history. |
| GET | /api/v1/manufacturing/results/caseId | Exact immutable synthetic result identity/version, goal, fixture, context, cutoff and typed view. |
| POST | /api/v1/manufacturing/investigations | caseId, optional declared condition and exact resultRef; inconsistent goal/version/scope/cutoff refused. |
| GET | /api/v1/manufacturing/investigations/id[/view] | Read durable aggregate or canonical computed view. |
| POST | /api/v1/manufacturing/investigations/id/commands | expectedVersion, closed validated command fields, idempotency key. |
| GET | /api/v1/manufacturing/review | Core seven operating metrics and governed gaps; full plant/case scope required. |

`Transport.send(Request): Promise<Response<T>>` is the client replacement port in `src/platform/contract.ts`. `src/investigation/clientPort.ts` owns request construction. `ManufacturingService` provides the local deterministic adapter and does not dispatch workplace work. Existing training queries delegate to `evaluateWorkspaceConversation`; the browser has one conversation ID and captured history across datasets. Dataset-specific cursors retain exact horizons and never silently substitute records.

The service owns metrics, source eligibility, scope, commands, role checks, explicit simulation time, expected-version conflicts, stable exact retries, atomic saves and typed failures. The presenter owns bounded prose and optional evidence visuals. Future model tool calls must traverse the server authorization and capability boundary, then invoke these services. A model's prose or claimed role is never authorization or manufacturing evidence. New-service merged R5 review and actual Tom adapter conformance are pending.

All three cases are synthetic. Approval is distinct from performed-work proof. Locked verification uses ten eligible shifts and primary jam/speed/FPY endpoints, with quality, energy and separate safety review. Observed change remains causally unconfirmed and financially unvalidated. Reopening retains old history and removes old-cycle proof from the new measurement.

Deployment, live provider calls, credentials, budget changes and real backend mutations were not performed. Portable static operation and local export stay offline after loading local assets; enabling OpenAI will intentionally require a server-side external provider call under the separately approved controls.
