# Additive proposed API contract — V90

Contract identifier stays `ekas-proposed-v1`; actual Tom/GLiDE compatibility is unverified. All operations are synthetic. The browser application boundary accepts the proposed request envelope, replaces client authority with an injected synthetic principal and delegates to the canonical service. Future real API/auth/tenant/capability/version mapping belongs to the engineer's conformance adapter. No live backend path is guessed.

GET `/api/v1/manufacturing/contract`: current candidate/capture/provider/capability disclosure.
GET `/api/v1/manufacturing/decision-support/capabilities`: all56 exact dispositions; callable local surfaces, missing flows and authority gates; no whole acceptance.
GET `/api/v1/manufacturing/decision-support/{conversationId}`: current authoritative case projection, eligibility/qualification, exact scope reference, ledger version, immutable entries and permitted owned candidate references.
POST `/api/v1/manufacturing/decision-support`: reviewed synthetic command with `kind`, exact returned `scope`, `expectedVersion`, canonical `knownAt`, `reason`, `confirmation: CONFIRM_SYNTHETIC_DECISION_RECORD`, `payload`, and envelope `idempotencyKey`.
GET `/api/v1/manufacturing/decision-support/{conversationId}/packet`: exact original records, source/audit anchors and explicit missing evidence. It does not rewrite old answers or validate cause/savings.

Implemented command kinds: `record-observation`, `record-pm-review` (proposed/held/rejected only), `record-handover` (note, not ownership acceptance), `record-lesson` (candidate, exact basis), `save-scenario` (bounded downtime assumptions), `record-portfolio-review` (distinct exact candidate versions, reviewed budget/hours/dimensionless priority). Workflow ownership/authorization/performed proof/verification/sustainment continue through the original canonical commands. These additions do not grant another authority path.

GET `/api/v1/manufacturing/metric-demonstrations`:178 exact definitions,15declared raw contexts, units/expression/qualification. POST same path: `{dataset: "training-positive-v2", metricId: "exact ID", optional simulationCase, optional asOf}` and idempotency key. Returns a stored canonical result with source/definition/fixture/scope/window/eligibility metadata. Narrower or unintended datasets are not substituted. The supported adverse simulations are masked evidence, zero exposure, unsupported production protocol and unrelated cohorts.

Explicit chat selector: `Demonstrate synthetic metric {exact ID}.` Optionally `as of {canonical UTC}`. Sources/table/chart/help followups remain on that declared dataset; unsupported manufacturing action requests do not borrow a case. `Return to original investigation.` restores the unchanged retained case. Public Metrics offers normal dataset selection and a Discuss control; no API details or key is required from the operator.

Replay versions: new asset interpretation4, original2/3 preserved; new presentation6, original1–5 preserved; new scope publication11, original1–10 preserved; inherited asset clarification3 binds an actual original turn/question/request context. Original recorded text/status/time/source versions remain unchanged. Eligibility is a separate current projection, not a history rewrite.

Current provider is synthetic fake/disabled/local governed rules according to launch mode; no key or live OpenAI call is configured. Future OpenAI key stays server-side. Secure credentials, reviewed price/budget and existing security approval gate activation. Tom contract gates later backend conformance, not temporary otherwise-approved OpenAI demo activation. No Ollama or production entitlement assertion.
