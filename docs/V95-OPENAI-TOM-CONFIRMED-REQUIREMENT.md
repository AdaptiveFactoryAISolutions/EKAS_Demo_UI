# Confirmed provider and backend requirement

The user reaffirmed on 2026-10-13 that the demo must use an OpenAI API key rather than a local Ollama model and fully integrate with the appropriate API for Tom’s backend build. OpenAI is the selected provider. This confirmation does not mean live integration has been completed.

The retained server-only Responses adapter and explicit launcher composition are the implementation seam. The browser must never receive the provider credential. Current scripted/mock review profiles remain explicitly labeled synthetic and do not establish natural model or live backend acceptance. No key was read or installed, no provider request or spend occurred, and no backend was contacted in this continuation.

Tom’s exact API specification is still needed: contract location/version, test base URL, authentication and trusted principal/tenant/asset permissions, resource and error schemas, concurrency/version rules, durable idempotency/receipts, timestamps and source freshness, governed actions and complete workflow mappings. The user has been asked for the contract location through the text input panel; do not paste the credential there. Production API errors must not silently fall back to synthetic data or writes.

Original R5 architecture approval is preserved. The separate fresh artifact security hold and secure credential/model-budget setup remain distinct from Tom contract conformance. Local source work continues independently.
