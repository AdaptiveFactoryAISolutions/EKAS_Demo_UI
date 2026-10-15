# Conversational configuration implementation plan

Goal: compose the existing server OpenAI adapter with normal conversation UI under an explicit mock-only configuration while leaving live activation held and default provider disabled.
Architecture: a server configuration module selects disabled, scripted-test or mocked Responses provider. Browser receives only mode and synthetic conversation ID. Existing trusted authority, receipts, commit and SSE transport remain canonical. No live credential/network or architecture changes.
Tech: TypeScript, React, Vitest, Responses adapter, existing HTTP/SSE.

Global constraints: preserve frozenV92; default disabled; no credentials/livecalls/price reset; originalR5approved, freshmergedartifactheld; unchanged deterministic calculation/evidence/permission; no internal reasoning.

1. Write configuration and bootstrap regression tests. Default no provider; fake selection explicit; mocked Responses selection uses existing adapter, no credential argument; live selection fails held before factory. Bootstrap truthfully distinguishes mocked provider. Run red, implement selector/bootstrap types/disclosure, run green.
2. Combined normal UI→HTTP/SSE→mocked Responses tests: arbitrary question and follow-up, context/evidence/metric tool output, clarification, persisted history/replay. Assert actual visible reply and original text/history, not canned router output.
3. Add cancellation/interruption recovery/history and source/policy conflict combined tests without retrying unknown operations. Retain operation-status label; no token-delta addition.
4. Map tool declarations against actual canonical authority. Remove unsupported advertised names, implement admitted read/proposal capabilities only with typed canonical receipt and no implicit release/intervention. Add refusals and exact source/context tests.
5. Appropriate existing regression/full source/build checks serially. Package a separate candidate only after all local checks pass; independent/native acceptance remains separate.

Review focus: disabled mode cannot fall back; mock mode cannot claim live OpenAI; ambiguous scope must clarify; aborted/unknown operations do not replay provider; factual claims remain exact receipt-bound. These are tested in tasks1–4.

Native execution authorized by parent; no new approval pause or subagents. First increment ends after focused source pass, with remaining work explicitly pending.
