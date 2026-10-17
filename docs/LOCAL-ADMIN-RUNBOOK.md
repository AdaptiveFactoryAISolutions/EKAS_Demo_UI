# Local demo Admin runbook

Current CF provisional implementation reference; independent ordinary review is PARTIAL/not release approved (255/255 evidence audit,9/9 focused behavior). Owner source2859/compiled501 are successful same-source unions with preserved initial failures, not one clean initial run. Final exact-candidate acceptance is tracked only in `FINAL-CLOSURE-REGISTER.json`. The visible working preview is an explicitly preconfigured synthetic rehearsal. It does not prove real OpenAI quality, financial savings or Tom integration.

## Start the portable local server

After extracting the candidate, use Node. This command was verified on Node v22.14.0. The archive already contains the compiled server and the static UI, so do not compile, copy, or install packages before starting:

```sh
node integration/local-demo/start.mjs --port 18330 --state /absolute/private-demo/workspace.json --owner-code /absolute/private-demo/owner-code
```

`integration/local-demo/start.mjs` imports `packaged/server/localDemoServer.js` and serves the `static/` directory. That module is the compiled `app/src/server/localDemoServer.ts` graph. `static/` is the production UI build. This starts on `127.0.0.1`, creates a private one-time owner-code file, and leaves AI disabled. The workspace and owner code must be outside the served static directory. Keep the chosen workspace path to preserve conversations and controlled synthetic records. No private legacy repository, key file or environment secret is required. No provider request occurs on startup in this normal launch. Without `--original-budget-history`, paid use stays blocked. Supplying the provider-test history file activates the $40 cumulative ceiling; it does not enable AI or attach a key.

Open the displayed exact loopback address. Use **Admin AI**, then privately enter the local owner code from the chosen file. This code is not the OpenAI key and does not grant a real manufacturing role. Fictional roles remain a separate synthetic business context.

## Public working-preview test identity

Current mock http://127.0.0.1:18339/?demonstration=ekas-guided-journey-review-20261015 serves exact CF code and starts preconfigured/enabled under rehearsal composition with one dummy startup test. Its enlarged versioned synthetic allowance is not real spending authority; do not copy its journal into a paid profile. Normal launch above still starts disabled with an empty credential store.

Only the explicitly marked corrective working preview supplies the public fixture code `DUMMY_REHEARSAL_OWNER_CODE` on its Admin page. It signs in as `synthetic-rehearsal-owner`, may be reused for repeat tests, accepts only `DUMMY_` credentials and cannot select real-provider modes. Its scope/cookie cannot authorize normal owner administration or paid calls. This is not a real bootstrap secret or production identity; normal private-owner login below is unchanged.

## Rehearse before a real key

Choose **Mock rehearsal**, Save settings, and set a dummy credential beginning `DUMMY_`. Save makes no provider call. Explicitly Test, then Enable AI. Mock requests use the installed Responses adapter and a separate synthetic journal; no live fallback exists. Offline mock eligibility uses an authored rehearsal clock and does not expire with live pricing; paid mode still requires current verified pricing. Normal conversation can use mock mode without paid-request owner authority. Privileged configuration still requires the local owner session.

## Prepare the authorized OpenAI test

Real-key entry and the cost-authorized inference remain user actions. The current owner explicitly attested first use on15Oct2026, authorizing initial accounting under the existing cumulative USD20 ceiling. That preparation is recorded separately; it does not establish billed spend or a successful live call. No real key is read or configured by the implementation tests. An owner-authorized launch explicitly attaches the accounting source with:

```sh
--original-budget-history /absolute/path/to/the-original-complete-budget-history.json
```

The CLI supplies that exact source and its canonical path. Original bytes remain read-only. A durable cumulative journal beside the canonical source (`.ekas-local-cumulative.json`) carries every original and newer reservation; all workspace profiles using that source share its allowance and exclusive ownership. It is ordinary budget persistence, not a signing requirement. Moving a workspace, replacing a key or restarting cannot create another allowance. A changed original source, conflicting ownership, missing/invalid history, exhausted allowance or unresolved usage blocks paid requests. Do not substitute an earlier incomplete history for the complete cumulative source.

The authorized ceiling remains USD20; original usable allowance remains USD18 before all preserved non-refundable reservations. Confirmed billed spend stays unavailable without invoice evidence. In-flight and unresolved amounts are distinct. Test and normal conversation consume the same real cumulative authority. No UI setting can raise it or clear unknown usage.

In Admin choose OpenAI, Save, privately set the server key in **Write-only server key / OpenAI API key**, immediately below Save settings (not under Advanced), review current model/pricing/remaining allowance, explicitly accept the bounded test cost, and Test. Test sends one fixed synthetic sentence, uses low reasoning effort and at most64 output tokens, and may fail or cost money even when cancelled. It makes no automatic retry. Enable is separate and requires the exact tested configuration. If sign-in succeeded but Settings/key controls are absent, use Refresh status and inspect its safe visible error; those controls require a loaded status snapshot. Do not guess that the key is missing or repeat a paid test to fix a status refresh. Close private-entry windows/clear the field before reviewer captures. A passed connection test does not prove conversational quality. Actual normal multi-turn quality, Stop/reopen and scope behavior must be tested separately with the authorized user and budget.

## Key and session behavior

The masked key input is write-only and transient. Submit, cancel and navigation clear its raw entry. Blank input never removes a configured key. Replacement/removal are explicit. GETs, workspace traces, audit metadata and exports do not contain the key. The key exists only in the server process; restart clears it and disables AI while durable budget/history remain. Disabling blocks new requests and invalidates the tested configuration. An obsolete pending test cannot reactivate it. Sign out revokes the owner session; real paid calls need a current owner session and CSRF protection.

Loopback HTTP is not encryption. Masking is not protection from browser extensions, and JavaScript memory erasure is not guaranteed. No OS vault, enterprise SSO or root-owned signing setup is required for this local demo. These are not production authentication claims.

If owner access expires or is signed out, restart the same owned local process/profile to obtain a fresh code; the key must be entered again. Preserve the cumulative journal. Do not delete a budget lock or held reservation as a spending reset. Failed/interrupted operations retain their identity for reconciliation; no automatic regeneration or refund is performed.

## Streaming and history

The local provider consumes actual Responses SSE. Raw prose/tool arguments stay buffered server-side until receipt checks and canonical saving succeed. The UI reports receiving/checking progress; it does not play prerecorded typing. Stop retains the draft and saved operation identity. Reopen/check the operation before another request when the outcome is uncertain.

Prior canonical answers and displayed model commentary retain original timestamps, qualifications and source context. Context windows may omit explicitly marked older complete turns for model input; the saved full transcript remains available. Reading/reopening alone makes no provider request. Known busy/four-round/pre-request input-limit refusals can be confirmed as not committed; checking them makes no provider request, keeps prior history and does not refund completed rounds. Only an explicit new request can proceed afterward; uncertain network/accounting outcomes remain held.

Configured price-policy/source review was refreshed15Oct2026 against [the official GPT-6.1 Sol model page](https://developers.openai.com/api/docs/models/gpt-6.1-sol). The conservative local default-tier bound is USD2.75/M input and USD11/M output under64096 tokens, expiring16Oct2026. Refresh verified pricing before later paid use. Streaming follows [the official Responses streaming guide](https://developers.openai.com/api/docs/guides/streaming-responses). Neither source is evidence of a successful live call or invoice.

## Current scoped live evidence and pending acceptance

On15Oct2026 actual private setup and two normal-UI OpenAI turns in conversation11 committed:JanuaryOEE77.08%,March83.33%,version3,onevalidatedreceipteach,Machine1/OEE context and January retained. These are recorded outcomes, not a claim from connection-test success. No invoice spend is established. The separately approved seven-turn continuation completed,bringing conversation11 toversion10/nine savedOpenAIturns. No additional paid request or automatic resubmission is authorized by this runbook. Parent coordinates the sole paid reviewer.

Broader actual-model dialogue,Stop/reopen,error recovery,three-case lifecycle and human acceptance remain pending. Native mock lifecycle work is underway and must be judged from actual supported state transitions. Review FINAL-REVIEW-STATUS.md and CF-CURRENT-NATIVE-ACCEPTANCE-CHECKLIST.md for current scope. No key re-entry or restart is requested by this documentation change; preserve the live profile during acceptance.

Current corrected mock18344 is DUMMY-only7e26;the liveCF18329 remains unchanged. No restart or private-key re-entry is requested by the source/native correction. Newfullvalidation and broader acceptance remainseparate.
