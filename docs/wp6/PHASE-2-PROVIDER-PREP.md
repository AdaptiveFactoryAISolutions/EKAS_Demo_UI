# Phase 2 — provider preparation

Status: **BLOCKED BEFORE ANY PAID CALL**. No key was requested. No Test connection was sent. No AI was enabled. Retrieval date for the official pages below: **2026-10-17**.

## Official availability

`gpt-6.1-sol` is listed by OpenAI as GPT-6.1 Sol.

- Catalog: https://platform.openai.com/docs/models
- Model page: https://platform.openai.com/docs/models/gpt-6.1-sol

The model page, retrieved 2026-10-17, says the model id is `gpt-6.1-sol`, the Responses API supports it, function calling is supported, and Chat Completions is supported without tool calling. Context window 1,050,000. Maximum output 128,000. Knowledge cutoff April 30, 2026. Reasoning efforts include `low`, `medium`, `high`, `xhigh`, and `max`. `none` and `minimal` are not supported.

This build can select only `gpt-6.1-sol`. That id matches the official model id. Selecting another model would be a product change and was not done.

## Official standard text pricing

From the same model page, retrieved 2026-10-17, standard text tokens:

| Metric | Price |
| --- | --- |
| Input | $2 / 1M tokens |
| Cached input | $0.10 / 1M tokens |
| Cache writes | $2.50 / 1M tokens |
| Output | $10 / 1M tokens |

The page also states that prompts above 272K input tokens are priced higher, Fast mode is 2× standard, Batch and Flex are 50% lower, Ultrafast is 6× standard, and regional processing can add 10%. Those multipliers are not loaded into EKAS.

## Authorized budget

Patrick authorizes **$40 cumulative** for this acceptance test. 40 dollars is 40,000,000 micro-USD. It is a hard ceiling, not a target. Production use is not authorized. Paid testing stops when the evidence is sufficient and stops at $40 regardless.

## What RC3 actually enforces

RC3 source `45568c5` does not contain this $40 authorization.

The live pricing record is a constant in `app/src/server/localAiRuntime.ts`:

- reviewed 2026-10-14
- expires `2026-10-16T00:00:00Z`
- input 2,750,000 micro-USD per million tokens ($2.75)
- output 11,000,000 micro-USD per million tokens ($11.00)

Those rates are not the official rates retrieved on 2026-10-17. `assertReady` throws `AI_PRICING_EXPIRED` when the clock is at or after the expiry. The provider budget throws `DEMO_PRICE_REVIEW_REQUIRED` at the same instant. On 2026-10-17 the expired authority is not active. A live call is refused before the network.

The original budget parser in `app/src/server/localDemoBudget.ts` accepts only authorization id `Patrick-20261010-USD20-total`, `authorizedMicroUsd` exactly 20,000,000, and `usableMicroUsd` exactly 18,000,000, with `priceReviewUntil` exactly `2026-10-11T00:00:00Z`. Any other history, including a $40 file, throws `ORIGINAL_BUDGET_HISTORY_REQUIRED` and leaves the budget unavailable. The policy expiry inside that module is also `2026-10-16T00:00:00Z`.

## Can Admin enter a new price and a $40 budget without a source change?

No.

`saveSettings` accepts only `mode`, `model`, `maxOutputTokens`, and `inputByteBound`. The model must be `gpt-6.1-sol`. Any extra field, including a pricing expiry or a ceiling, is `AI_SETTINGS_REFUSED`. There is no Admin control for input price, output price, cache price, expiry, authorization id, or cumulative ceiling. The key field is write-only and is not a budget.

A budget file placed beside the demo is also refused unless it is the old $20 history. Even that old history is past both expiry checks, so it cannot authorize a call on 2026-10-17.

Enforcing the $40 ceiling and the current official price therefore needs a source change. This pass stops there and does not change source. Phases 3 through 6 stay unrun.

## What a later source change would have to do

It is not implemented here. A future change would have to accept the 2026-10-17 official rates (or a newer reviewed quote), set a hard cumulative ceiling of 40,000,000 micro-USD, refuse another call when the next reservation would pass that ceiling, and keep the key out of the browser, logs, and fixtures. Until that change is reviewed, Patrick does not press Test connection.
