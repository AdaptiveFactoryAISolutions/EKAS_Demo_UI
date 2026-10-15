# Tom backend conformance handoff

> Current artifact and verification scope: [CURRENT-DEVELOPER-HANDOFF.md](../docs/CURRENT-DEVELOPER-HANDOFF.md). Local proposed contracts and synthetic tests do not certify Tom's actual service.

The user requires full integration with Tom's appropriate backend API. This package supplies an editable proposed boundary and a working synthetic implementation; it does not claim conformance with an unseen backend.

Provide the versioned API specification, test base URL, principal/tenant/asset authorization model and secure authentication mechanism. Do not paste credentials into chat or add them to the static bundle, source archive or workspace export.

The engineer should map the existing application envelope, streaming operation/receipt transport and versioned manufacturing client to the real service. Preserve these behavioral guarantees:

- Exact part, revision, job, asset and ISA95 scope, with explicit source versions and UTC event/knowledge/cutoff times.
- Atomic version checks and durable idempotency. Unknown outcomes reconcile the original body and key; only a correlated authoritative precommit refusal permits a new intent.
- Read-only query/capture access, opaque page cursors, coverage and completeness, immutable historical source records and explicit historical presentation.
- Independent work authorization, performed work, verification, safety review, acceptance, sustainment and recurrence. Approval does not perform an intervention; calibration does not replace MSA or certify cause.
- Server-side OpenAI Responses configuration and budget controls. Browser/static/exported data never contain the key. The disclosed mock is separate from live-provider behavior.

V102 adds proposed manufacturing ports for GET `/api/v1/manufacturing/measurement-trust/{investigationId}`, the existing versioned command envelope with `select-measurement-trust-record`, and GET `/api/v1/manufacturing/evidence-queries?investigationId={id}`. The latter returns at most100 references with explicit total, returned and complete fields; it never substitutes another investigation. The synthetic assurance fixture is an authored alternative set, not production calibration history.

Use `app/src/investigation/clientPort.ts`, `manufacturingContract.ts`, the server transport and the integration documents as the mapping starting point. Real contract/error/permission mapping and authenticated end-to-end conformance remain unperformed until the actual specification and authorized test connection are available. No endpoint, credential scheme or plant mutation is guessed.
