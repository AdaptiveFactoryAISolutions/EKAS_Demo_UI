# Proposed lot genealogy domain port — V103

Synthetic demo only. The server-held OpenAI Responses adapter interprets requests; Tom owns the real manufacturing implementation, endpoint/auth agreement and production conformance. No Ollama path is proposed. No key is embedded in browser assets.

GET `/api/v1/manufacturing/genealogy/{investigationId}` is role/asset scoped and read only. It returns exact investigation/cycle/context/as-of, optional reviewed source/version/root, declared directed links, bounded traversal, unknown boundaries, eligible deduplicated existing unit references and local owned scope-review records. The 54 fixture records are relationship metadata; they introduce no physical measurements or shipment/hold/release observations.

Commands `select-genealogy-snapshot` and `record-genealogy-scope-review` use the existing version and idempotency contract. Explicit confirmations and reasons are required; owner/due UTC and unknown quantity/link acknowledgments are required for review. Roles, known time, exact context/cycle/root and source version are checked on the server. Unknown outcomes retain the original body/key/actor and must be reconciled before fresh intent.

Traversal limits: four hops, 32 nodes, 64 edges. Repeated split/rework references count once. Source completeness is an authored subset only. Total affected quantity and unmapped quantity remain null. Global containment, unaffected external lots, production conformance, physical hold/release, cause and financial savings are never inferred. The organization chart is qualitative, without numeric flow weights. Saved chat captures retain their original source and clock.

Live activation remains gated on Tom's actual API contract/base URL/authentication, protected server credentials, model/budget and security review. No external calls, spend or operational mutation are part of owner checks.
