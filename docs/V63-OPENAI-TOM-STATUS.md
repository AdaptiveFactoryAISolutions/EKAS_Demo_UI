# OpenAI and Tom backend status

The user requires OpenAI API access rather than Ollama. That provider selection is preserved. Browser/static assets contain no API key, and the offline demonstration makes no provider requests. The key must be configured on the authenticated server, never entered in chat, bundled source, fixtures, browser storage or exports.

Existing `app/src/platform/pilotAdapter.ts` supplies an injected typed v2 conversation/evidence wire boundary, not a live authentication implementation. The synthetic `Transport` and `/api/v1/manufacturing` routes cover durable conversations, source revisions, exact raw reconciliation, scoped refresh, separate comparison records and combined audits. These route families are local mock contracts; they must not be asserted as Tom’s deployed endpoints.

Required next evidence from Tom: actual OpenAPI/schema location and base URL; authentication/tenant/ISA95 identities; conversation, evidence and controlled-command mappings; source cutoff/effectivity; expected-version/idempotency semantics; errors and actual permission/dispatch behavior. The current task requested that specification from the user. No guessed endpoint, token or integration result is represented as live conformance. Prior held provider/security execution and spending controls remain unchanged.

See V56-OPENAI-TOM-INTEGRATION.md and V55-SERVICE-ADAPTER-CONTRACT.md for preserved architecture and subtype constraints. Actual OpenAI introduces an intentional server-side external dependency; it cannot be an offline provider. Static local CSV/SVG/JSON export remains offline.
