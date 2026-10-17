# Operator runbook — phases 3 to 7

Status: **PENDING**. Phases 3, 4, 5, and 6 are not run in this package. RC3 cannot enforce the $40 ceiling. RC4 source can. Do not enter a key and do not press Test connection until RC4 is frozen and `RC4-IDENTITY.md` names the source under test. The steps below are the exact procedure for that later session. They are not a record of a session that already happened.

Build under test when that session is allowed: the frozen RC4 source named in `docs/wp6/RC4-IDENTITY.md`. The key is typed only into the Admin password field. Confirm the screen before any test: pricing reviewed 2026-10-17, expires `2026-11-16T00:00:00Z`, input $2, cached input $0.10, cache writes $2.50, output $10 per 1M tokens, and a cumulative provider-test cap of $40. Prior $20 history, if shown, is audit-only and is not counted toward that cap.

## Phase 3 — one Admin Test connection

Sign in as the local owner, not the rehearsal owner. Rehearsal has no paid authority.

1. Open Admin AI on the local demo.
2. Set mode to OpenAI. Leave the model on `gpt-6.1-sol`. Do not edit an endpoint. The endpoint is not editable.
3. Enter the key in the password field. Do not paste it anywhere else.
4. Read the potential-cost confirmation. Confirm it only if the reviewed price and the $40 ceiling are the ones on screen.
5. Press **Test connection** once.

The call that control sends is one Responses request: input “This is a synthetic connection test. Reply briefly: connection test received.”, `max_output_tokens` 64, `store` false, reasoning effort low, service tier default. It is not Enable AI and it is not a Chat message.

Pass only if all of these are true:

- The key was accepted. Status says a credential is configured. The key string is absent from the page, the status JSON, the audit file, and the screenshot.
- The model was available. The test status is passed, kind tiny synthetic inference, and the assistant reply completed.
- Pricing was accepted. Readiness does not say pricing expired, and the rates on screen match the reviewed quote above. On RC3 this check fails with `AI_PRICING_EXPIRED`. On RC4 the reviewed window runs through `2026-11-16T00:00:00Z` and a later clock is refused before the call.
- The reservation is correct. One reservation was taken, usage was recorded, the reservation is not left in flight or unknown, and the remaining ceiling dropped by that reservation only.
- Nothing leaked. The provider error body, if any, is not shown. The key is not in the reply.
- There was no duplicate call. Pressing the same test again returns the original outcome and does not send a second request.

A failure closes the reservation as unknown or refuses before the call. Do not press Enable. Remove the server-session key after the result is seen. Restart does not keep the key.

## Phase 4 — Enable AI for one local acceptance session

Enable only after the current test is still current. A settings change or a key change invalidates it and demands a new test.

Enable AI for that local session only. The model may interpret the question, phrase the answer, and call the approved tools. It does not own:

- calculations
- metric truth or evidence truth
- authorization
- case lifecycle
- verification
- sustain
- certification

Canonical tools and the governed records remain the authority. If the model and the governed record disagree, the governed record stands and the answer says so. Do not leave AI enabled after the acceptance session. Disable it and remove the key.

## Phase 5 — conversational chain

Use one fresh conversation, then the plant-review continuation in that same conversation. Record each question, the answer, the tool calls, and the next action. Stop at the first wrong item in the list below.

Exact phrases, in order:

1. What was OEE in January?
2. And March?
3. Machine 2
4. No, I meant Machine 1
5. Why?
6. Show me
7. Compare with last month
8. Go back to the first machine
9. FPY
10. Run my plant review.
11. What's off target?
12. What should I focus on first?
13. Investigate it.
14. Where did we lose the most?
15. Which line?
16. Which machine?
17. What job?
18. What evidence do we have?
19. How do you know?
20. Are you sure?
21. What are possible causes?
22. What should we check first?
23. Who owns it?
24. Assign it.
25. Did they accept it?
26. What should we do?
27. Request approval.
28. Was it approved?
29. What work was done?
30. Did it work?
31. What still blocks acceptance?
32. Did it hold?
33. Why did it reopen?

None of these may be wrong:

- metric
- plant
- period
- case
- a silent substitution of machine, line, or case
- sticky context from an earlier topic after an explicit correction or a new conversation
- developer wording in the plant answer
- a raw ISO timestamp in the normal answer
- an unsupported causal claim
- synthetic fallback while live mode is on

Tool calls must be the approved tools for that question. The next action must match the case state: do not say an owner accepted, an action was approved, work was performed, verification passed, or sustain held unless that governed record exists.

Plant Review through Investigate it must open the Northworks feeder-jam plan miss: plant gap 150 good units, largest contributor Line 03 at 138. It must not open Quality loss.

## Phase 6 — tokens, latency, spend, recovery, cancellation

For every paid call record:

- input tokens, output tokens, and cached input tokens
- per-call latency and any tool-call latency
- reservation micro-USD and accounted micro-USD
- running cumulative spend against the $40 ceiling
- whether the call was recovered, cancelled, or left unknown

Stop when the next reservation would exceed 40,000,000 micro-USD. Stop earlier if the acceptance evidence is already sufficient. RC3 has no Admin field that tracks this $40 ceiling. That is part of the source change Phase 2 refused to invent.

## Phase 7 — failure behavior

Each case must fail in words the operator can read. Live mode must not fill the gap with synthetic demo data.

| Case | Expected |
| --- | --- |
| Invalid key | One refused test, `AI_TEST_FAILED`, AI stays disabled, key and provider body stay off the page |
| Provider down | Refused, no fabricated answer, no silent demo substitute |
| Model unavailable | `MODEL_UNAVAILABLE`, no retry loop, usage marked unknown if a reservation was opened |
| Timeout | The call ends, no partial answer is committed |
| Stop / cancel | The in-flight turn aborts, no late commit |
| Duplicate submit | The same operation id does not send a second provider call |
| Interruption | Status stays reviewable; Chat does not invent the missing result |
| Retry | A new explicit request only. The failed call is not replayed by itself |
| Long conversation | Context stays on the named metric, plant, and period |
| Reload / history | The saved referent and the saved answer return; a new conversation does not |
| Tool failure | The tool error is visible and is not rewritten as a plant fact |

### Pre-run on RC3 with no real key

These four checks were run against the extracted RC3 tree with mock transports. They are not a paid test.

| Check | Result |
| --- | --- |
| Invalid key (`401`, body discarded) | `AI_TEST_FAILED`, one call, AI disabled, key absent from status |
| Offline (`TypeError: Failed to fetch`) | `AI_TEST_FAILED`, one call, provider stays unset |
| Timeout (abort during the mock call) | `AI_TEST_FAILED`, one call, AI disabled |
| Expired pricing at 2026-10-17T01:00:00Z | `AI_PRICING_EXPIRED` before any call |
| Admin settings plus a $40 history file | `AI_SETTINGS_REFUSED` and `ORIGINAL_BUDGET_HISTORY_REQUIRED` |

The temporary test file lived only in the extraction directory and is not part of the RC3 source commit.
