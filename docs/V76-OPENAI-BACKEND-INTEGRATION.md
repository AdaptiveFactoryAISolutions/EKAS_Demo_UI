# V76 server integration status and handoff

This is an interim architecture implementation, not live OpenAI activation or production-backend acceptance. The runnable port18223 remains a scripted fake provider on an earlier build until the current source suite and rebuild complete. Prior frozen V75 review artifacts remain unchanged.

## Implemented separation

Browser -> same-origin POST /api/v1/application -> trusted server principal -> canonical manufacturing service and provider-neutral conversation boundary -> injected OpenAI Responses adapter.

The browser sends apiVersion, requestId, method, path, body and idempotencyKey. Browser authority fields are discarded. The HTTP handler injects actor, allowed asset IDs and policy revision. The present runnable preview uses a fixed synthetic manager; production authentication and UI role binding are still open. Existing synthetic canonical resources remain the sole conversation, context, source and workflow authority. The model cannot create a second case store or execute physical work.

The OpenAI adapter is import-inert, reads no environment or credentials, and requires explicit server configuration: apiKey, model, maxOutputTokens, fetchImpl and durable budget authority. Budget authority supplies reserve, beforeRequest, recordUsage and markUnknown. The adapter fixes https://api.openai.com/v1/responses, rejects redirects, uses store:false, bounded output, strict function schemas and no automatic retry. Only context_read and metric_query are currently implemented. publish_response returns an interpretation and receipt-bound claims. Source claims are independently revalidated by the canonical service. No actual OpenAI request, key setup, or spend occurred during implementation; tests use fake keys and injected fake HTTP responses.

Source/policy/version/cancellation admission surrounds generation and now includes a synchronous lease check inside the canonical commit lock. An operation ledger persists STARTED before generation and COMMITTED with the canonical turn/idempotency result. Committed retry after restart returns the prior result without generation. Interrupted operations remain held pending reconciliation. Full unknown-usage/unknown-commit reconciliation and durable budget implementation are not yet complete.

The HTTP event stream currently emits operation.started and then turn.committed or operation.error. It is not provider token streaming. Browser Stop/navigation cancellation reaches the provider signal; normal transport and mounted Send tests exist. Full native UI acceptance remains pending.

## Tom backend mapping

The provider API and Tom's manufacturing backend are separate adapters. The current synthetic boundary defines requests and error envelopes; it does not assert that Tom's backend already implements these paths. Tom's actual OpenAPI/schema, authentication, tenant/asset authorization, concurrency/version rules, persistence, source freshness and audit semantics must be mapped and contract-tested once supplied. No original backend process or database was contacted or mutated.

Required production mappings: canonical conversation creation/read/messages/history and archived state; scoped source/metric/evidence/definition reads; governed context proposals; view/layout persistence; owned improvement and controlled-document proposals; explicit approval/physical-work/verification separation; durable operation/idempotency/audit records; trusted principal and masks. Existing platform client contracts provide the provisional seam. A live backend must fail closed for unsupported scope, stale/missing source, permission, conflict and outage; it must never silently substitute the synthetic fixture or finite router.

## Open acceptance items

- Live activation: approved model/pricing/usage budget and secure server-held credential installation.
- Complete tool coverage, context-changing natural turns, role/mask/history projection, and stricter prose safeguards.
- Actual Tom contract implementation and real contract tests with authorized credentials.
- Token streaming, durable budget and unknown usage/commit reconciliation; crash-safe storage.
- Remaining original UX/normal-entry compatibility controls, independent native scope/grid/visual/export/outage review.
- Final rebuilt immutable identity, portable static/editable-source/server package, notices and supported Library save.

Documentation basis: official OpenAI Function calling guide, https://developers.openai.com/api/docs/guides/function-calling (consulted during implementation). No model-price or entitlement claims made.
