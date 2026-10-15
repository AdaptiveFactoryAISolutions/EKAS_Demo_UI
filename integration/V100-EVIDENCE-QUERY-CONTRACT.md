# V100 proposed Tom evidence ports

This extends the existing editable HTTP/transport boundary; no actual Tom backend contract or authentication is accepted. Server-side OpenAI remains the intended provider, with a secure server key owned by the future deployment. No Ollama, browser key, configured real credential, live call, provider spend or model-quality claim. Existing disabled and disclosed mock modes remain separate.

All paths below have the existing `/api/v1/manufacturing` prefix and synthetic request/error envelopes. They run inside the same repository transaction/lease and server-selected actor/scope boundary.

| Method/path | Meaning | Preconditions |
| --- | --- | --- |
| POST /evidence-queries | Immutable authored batch/window query | exact investigation ID/version, from/to UTC, limit 1–50, complete or partial-source, original idempotency key |
| GET /evidence-queries/{id} | Exact historical query | permitted original asset; no new source substitution |
| GET /evidence-queries/{id}/page | Snapshot-bound page | exact cursor/query/source/limit/offset; changed source requires reload unless explicitly historical |
| POST /evidence-captures | Immutable non-certified Resource answer | typed query or saved diagnostic-turn origin/version, title/reason, explicit historical intent, partial acknowledgement, confirmation and original key |
| GET /evidence-captures[/{id}] | Scope-filtered exact captures | original asset permission before disclosure |

Full admitted source average keeps numerator, denominator, unit and horizon. Partial source returns null/unavailable; page totals are never whole-source aggregates. A failed page retains the original cursor and prior known rows. Explicit source reload allocates a new query and preserves the old one. Empty complete sources, missing coverage, future-known records and source changes are distinct.

Saved diagnostic sources are compact single-turn snapshots; provider request/history is omitted. Multiple diagnostic units remain separate native Grid columns/rows, never a fabricated common axis. Query captures use actual Highcharts line chart and native Grid backed by one Dashboards DataPool, plus saved layout/source exports. Answer and Board bindings use `evidenceCaptureId`, not CanonicalResultId. Board filters do not recompute captured evidence.

Tom's engineer owns mapping real principal/asset permissions, stable historian snapshots, coverage guarantees, calibration/topology/schema provenance, cursor limits, durable receipts, idempotency storage, timeout reconciliation and external API conformance. These source interfaces and synthetic tests do not establish production behavior or replace the held security/key/model-budget/native acceptance steps.
