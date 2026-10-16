# Admin and provider setup — EKAS DEMO RC1

Local owner access is separate from the fictional chat role (manager, supervisor, maintenance, safety, viewer). The chat role does not grant Admin.

## Rehearsal

The local demo server can start in rehearsal. The sign-in control is **Sign in as rehearsal owner**. The non-secret fixture code is `DUMMY_REHEARSAL_OWNER_CODE`. It has no paid-provider authority.

Use only credentials that begin with `DUMMY_`. The key field is a password input. **Clear entry** empties it and does not remove a credential already held by the server. After a cleared entry, the marker is not left in the page, in `localStorage`, or in `sessionStorage`.

Rehearsal keeps the provider in a mock session. It does not call OpenAI. The server-side rehearsal credential is not written into the browser.

## Real provider — not performed in this package

Patrick enters a real provider key privately through **Admin AI**. Do not paste it into chat, a ticket, a screenshot, or a document. This package does not request the key and does not display one.

The expired saved pricing cannot authorize spend. The fixture pricing used by older tests expires `2026-10-16T00:00:00Z`. Before the key is entered privately in Admin, Patrick must refresh all three of the following:

1. Current model availability
2. Current pricing
3. Authorized test budget

A saved pricing record from that expired fixture is not authority to spend. This package does not perform a paid call and does not record a pass.

Save, Test connection, Enable, and Disable are the local controls. Test connection requires the cost confirmation. Canceling an uncertain Save holds Test and Enable until a fresh status succeeds. A key is for the server session. It is not a browser secret and it does not survive as a documented value here.

Restart does not keep a live key. Rehearsal state is a new local profile, not a production account.

## Boundary

Admin is unavailable to an ordinary plant session. Engineering or a local administrator session is required. Failing closed is the expected result when the provider is disabled: Chat continues on governed local rules, and the reply says OpenAI is not connected.
