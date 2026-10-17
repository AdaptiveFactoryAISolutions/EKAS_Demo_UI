# RC5 Phase 1 — provider policy verification

Status: **PROVIDER POLICY VERIFIED**. This is the no-key policy check only. It is not Provider Acceptance, not a live Admin Test connection, and not `VERDICT: APPROVE`.

RC5 product source and `docs/wp6/EKAS-DEMO-RC5.zip` were not modified. No API key was entered, logged, or shown. No paid call was made. Phases 2 through 13 were not started.

| Item | Value |
| --- | --- |
| Candidate | EKAS DEMO RC5 |
| Source | `f513cd6e068c758d0443aeec8c3410f88a848d4b` |
| Tree | `64438f893ec4d3d7bebb878bf839ad1e0a4274ea` |
| ZIP | `docs/wp6/EKAS-DEMO-RC5.zip`, 36,962,811 bytes |
| ZIP SHA256 | `42d9cd0b1de878e68886e457dbe4f4fe4258711fdb7c043d9a9d00d96b023222` |
| Model | `gpt-6.1-sol` only |
| Cumulative ceiling | 40,000,000 micro-USD ($40), authorization `Patrick-20261017-USD40-provider-test` |
| Price review | `2026-10-17` through `2026-11-16T00:00:00Z` |
| Price source | `https://platform.openai.com/docs/models/gpt-6.1-sol` |
| Checked extract | npm 10 extract of that source, `app/` sources byte-matched to `f513cd6` |
| Runner | Vitest 4.1.11, `npm test` equivalent `vitest run --maxWorkers=4` |
| Result | 9 files, 39 passed, 0 failed, process exit 0. Repeated with the verbose reporter, same count, exit 0 |

The three Phase 1 assertions that are not already in the frozen suite were run from the extract and then deleted. They are not part of the candidate.

## Prices and the ceiling

Loaded live pricing, in micro-USD per 1,000,000 tokens:

| Rate | micro-USD | USD |
| --- | ---: | ---: |
| Standard input | 2,000,000 | $2.00 |
| Cached input | 100,000 | $0.10 |
| Cache-write input | 2,500,000 | $2.50 |
| Output | 10,000,000 | $10.00 |

`status().pricing` publishes all four rates, `reviewedAt` `2026-10-17`, `expiresAt` `2026-11-16T00:00:00Z`, `appliesToLiveRequests: true`, and `serviceTier: 'default'`. The review clock used for a live reserve was `2026-10-17T12:00:00Z`, which is before expiry, and that reserve was accepted.

A hold is the cache-write input rate times the 64,096-token input bound, plus the output rate times the requested output bound, rounded up. A 64-token probe holds 160,880 micro-USD. A 1,200-token hold is 172,240 micro-USD. Recording usage, including a usage object that names `cached_tokens` and `cache_write_tokens`, does not reprice the hold downward. The cached rate is loaded and that detail is accepted. The cap debit stays the larger cache-write reservation.

The certificate ceiling and usable amount are both 40,000,000 micro-USD. `synthetic` is false.

## Historical spend

The prior certificate `Patrick-20261010-USD20-total` stays readable: ceiling 20,000,000, unresolved 5,800,000, reserved 5,800,000, `countedTowardCap: false`. Opening the $40 certificate with that history leaves remaining at 40,000,000, unknown at 0, and halted false. Nesting a second $40 certificate as if it were history throws `ORIGINAL_BUDGET_HISTORY_REQUIRED`.

## Over the ceiling

Two hundred thirty-two maximum holds fit. The next 1,200-token hold and the next 1-token hold both throw `DEMO_BUDGET_EXHAUSTED`. Remaining stays 40,320 micro-USD and the budget is not halted by that refusal. A model other than `gpt-6.1-sol` throws `DEMO_MODEL_REFUSED`.

## Expiry and unknown tiers

At `2026-11-16T00:00:00Z`, reserve throws `DEMO_PRICE_REVIEW_REQUIRED` and remaining stays 40,000,000. The runtime test throws `AI_PRICING_EXPIRED`. The injected fetch count is 0.

These usage shapes throw `DEMO_PRICE_REVIEW_REQUIRED`, mark the hold unknown, and halt further reserves: `service_tier: 'fast'`, `batch: true`, `regional: 'eu'`, input tokens 272,001, and `audio_tokens` inside input details. Remaining is reduced once, by the original reservation.

## Retry and an interrupted call

Recording the same usage JSON twice leaves one debit: remaining `40,000,000 - 160,880`, in-flight 0, unknown 0. Two `test()` calls with the same operation id share one promise: one injected fetch and one reserve.

An in-flight reservation reloaded from the store becomes unknown. The reloaded budget is halted, in-flight is 0, unknown equals the reservation, and remaining is reduced by that reservation. Another reserve throws `DEMO_USAGE_REVIEW_REQUIRED`. Remaining does not change again.

A runtime test whose injected fetch throws is accounted the same way. The stub was invoked once, at `https://api.openai.com/v1/responses`, and threw before any socket. The failure is `AI_TEST_FAILED`. A later operation id throws `AI_BUDGET_UNAVAILABLE` and does not call fetch again. `enabled` stays false. `effectiveMode` stays `disabled`. `provider()` stays undefined. The default conversation selection remains `{mode: 'server-disabled', provider: undefined}`.

## No demo fallback and no production activation

Enable before a passed test throws `AI_TEST_REQUIRED`. A failed test does not switch the effective mode to mock or disabled-local answers. Settings mode `production` throws `AI_SETTINGS_REFUSED` and the saved mode stays `disabled`. A rehearsal runtime refuses `openai` with `AI_REHEARSAL_ONLY`. Limits advertise only `gpt-6.1-sol`, and `endpointEditable` is false.

Bootstrap objects that contain an `apiKey` field throw `INVALID_APPLICATION_BOOTSTRAP`. The standalone launcher HTML contains `"mode":"server-disabled"`. A live provider selection still requires activation authority and the budget contract. Mock mode refuses the global fetch.

## Key handling and the Admin field

The session status is `{configured, revision, reference, persistence: 'server-session-only'}`. Its JSON does not contain the session marker. A new store starts unconfigured. Restart does not reload a key.

The Admin handler audit record has only `operation`, `subject`, `revision`, `outcome`, and `at`. Anonymous and cross-origin credential requests return 401 or 403 and do not echo the marker. An authenticated PUT of the credential returns 200, makes zero provider calls, and neither the response nor the following GET status contains the marker. Console log, info, debug, warn, and error spies recorded none of the marker during that save.

The Admin key control is an uncontrolled `<input type="password" aria-label="OpenAI API key" autoComplete="off">`. It has no value binding. Submit reads the field and clears it before the request. Cancel, navigation unmount, and the confirmation dialog clear it as well. The rendered text and the dialog markup do not contain the marker after those actions. No screenshot was taken in this phase, so none can show a secret.

## What this does not authorize

Adapter Verified remains **NO**. Live Integration Verified remains **NO**. Demo Complete is not claimed. The LLM does not own OEE, metrics, evidence, authorization, case state, verification, sustain, identity, lineage, or financial proof. Cross-system work stays documented and is not implemented in production. The next step, when Patrick chooses it, is Phase 2: he enters the key himself through the EKAS Admin UI.
