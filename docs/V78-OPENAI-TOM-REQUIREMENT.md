# OpenAI and Tom backend requirement

User reaffirmed: the demo uses an OpenAI API key, not Ollama, and must fully integrate with the appropriate API for Tom’s backend build. This is a delivery requirement, not completed integration.

The existing server-only OpenAI Responses adapter is import-inert and uses injected credentials, transport and budget authority. Never package keys, expose them to browser code, or substitute the scripted fake provider as live acceptance. No real credential read, provider request or spend has been performed.

Tom integration requires his actual OpenAPI/schema, endpoint base URL, authentication and tenant/ISA95 authorization mapping, source timestamp/effectivity and command/version/idempotency semantics. The synthetic service contract is a mapping seam, not proof of production compatibility. Existing runtime reviews remain on immutable V77.
