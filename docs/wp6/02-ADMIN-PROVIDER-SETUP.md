# Admin and provider setup — EKAS DEMO RC1

Local owner access is separate from the fictional chat role (manager, supervisor, maintenance, safety, viewer). The chat role does not grant Admin.

## Rehearsal

The local demo server can start in rehearsal. The sign-in control is **Sign in as rehearsal owner**. The non-secret fixture code is `DUMMY_REHEARSAL_OWNER_CODE`. It has no paid-provider authority.

Use only credentials that begin with `DUMMY_`. The key field is a password input. **Clear entry** empties it and does not remove a credential already held by the server. After a cleared entry, the marker is not left in the page, in `localStorage`, or in `sessionStorage`.

Rehearsal keeps the provider in a mock session. It does not call OpenAI. The server-side rehearsal credential is not written into the browser.

## Real provider — not performed in this package

Patrick enters a real provider key privately through **Admin AI**. Do not paste it into chat, a ticket, a screenshot, or a document. This package does not request the key and does not display one.

The expired saved pricing cannot authorize spend. The fixture pricing used by older tests expires `2026-10-16T00:00:00Z`. The runtime refuses a live call with `AI_PRICING_EXPIRED` once that instant has passed. Before the key is entered privately in Admin, Patrick refreshes only:

1. Current model availability
2. Current pricing
3. The currently authorized remaining test budget / spend guard

A saved pricing record from that expired fixture is not authority to spend. This package does not perform a paid call and does not record a pass.

## Smallest real-provider test — planned, not run

This build can select only `gpt-6.1-sol`. If the refreshed availability does not include that model, stop. Selecting another model is a product change and is not part of this test.

The spend guard must be a real, non-synthetic budget: remaining allowance above zero, no unresolved usage, and not halted. Otherwise the runtime refuses with `AI_BUDGET_UNAVAILABLE`.

Patrick signs in as the local owner, not the rehearsal owner. He enters the key only in the Admin password field. He confirms potential test cost and presses **Test connection** once. That control sends one Responses call: “This is a synthetic connection test. Reply briefly: connection test received.”, `max_output_tokens` 64. A pass is one completed assistant reply, with the reservation closed on the spend guard. It does not confirm an invoice. Do not press **Enable AI**. Do not send a Chat message. Remove the server-session key after the result is seen.

Provider readiness: **NOT READY**. The three refreshes are still open. No key has been entered here. This test has not been run.

Save, Test connection, Enable, and Disable are the local controls. Test connection requires the cost confirmation. Canceling an uncertain Save holds Test and Enable until a fresh status succeeds. A key is for the server session. It is not a browser secret and it does not survive as a documented value here.

Restart does not keep a live key. Rehearsal state is a new local profile, not a production account.

## Boundary

Admin is unavailable to an ordinary plant session. Engineering or a local administrator session is required. Failing closed is the expected result when the provider is disabled: Chat continues on governed local rules, and the reply says OpenAI is not connected.
