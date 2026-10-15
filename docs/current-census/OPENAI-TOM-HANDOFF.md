# OpenAI and Tom integration — required handoff

OpenAI is the selected demo provider; no local Ollama model is planned. No key has been supplied or activated. The editable/static synthetic runtime still operates deterministically without a provider connection.

## Provider boundary

A server holds the OpenAI key. The browser receives authenticated EKAS results and validated proposed fields, never the provider key. Permission-filtered evidence and exact versions accompany each proposed extraction. Model wording does not calculate manufacturing truth, select contradictory truth, authorize work or establish performed work, causality or savings. Human confirmation and existing typed guards remain authoritative. Core flows and contextual help remain available with the LLM disabled. Temporary OpenAI activation requires its own server/key/spend/permission and conformance review; it does not wait for Tom’s contract.

## Tom boundary

Tom’s confirmed backend owns production authentication, principal/tenant scope, calculations, lifecycle transitions, concurrency, idempotency and persistence. The current synthetic service and proposed pilot adapter are reference implementations, not confirmation of his contract. Full integration requires his exact API revision/base path, request/response/error schemas, auth mechanism, principal/tenant capabilities, resource/version/receipt semantics and adapter tests against authenticated backend responses. Wire only one authoritative adapter; connection errors must not silently fall back to synthetic writes. Preserve full manufacturing/chat requirements rather than treating the reference pilot as the product ceiling.

## Required review evidence

Provider: key absent from source/build/browser/export/logs; permission filtering; validated field proposals; refusal/timeout/cost handling; deterministic no-provider parity. Tom: exact schema mapping, auth/principal/tenant enforcement, stale-version rejection, duplicate retry identity, durable-write failure handling, governed document/evidence versions and complete workflow parity. Offline static/export behavior must remain independent of external services. Live provider/backend execution is not authorized by this local handoff.

This is a provisional implementation handoff, not a claim of completed integration. See CENSUS.json gates G03 and G04 and packages P08 and P09.
