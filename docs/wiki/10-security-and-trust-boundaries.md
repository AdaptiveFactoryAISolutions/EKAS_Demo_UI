# 10 Security and trust boundaries

## Roles

The chat role is fictional: manager, supervisor, maintenance, safety, or viewer. It selects presentation scope. It does not open Admin and it does not authorize a paid provider call.

The local owner is a separate session. The rehearsal owner is synthetic, uses `DUMMY_` credentials only, and cannot enable a real provider. A real key is typed only into the Admin password field by Patrick. It is not a browser secret, not a fixture, and not a document.

## Provider

The key stays in server memory for the session. Status JSON must not contain it. Restart drops it. Test connection and Enable are separate. A failed test does not enable AI. Expired pricing and a missing original budget refuse the call before the network.

RC3 cannot record the newly authorized $40 ceiling. Until a reviewed source change can, no paid call is in scope. See `docs/wp6/PHASE-2-PROVIDER-PREP.md`.

## Live backend

The adapter sends only documented conversation and evidence paths. Investigation commands are refused locally. The refusal does not fetch, does not write a local substitute, and does not call the opportunity API under another name.

A live base URL must not embed a user or password. A fictional role string is not a bearer.

## Data

Fixtures are synthetic. The UI says so. A saved reply is not rewritten by a later measurement. Technical details keep the original instant.

## What must not leak

Provider keys, owner bootstrap codes, raw provider error bodies, and budget-file paths that identify a private machine. Tests use `DUMMY_` markers and assert those markers stay out of responses.

## Browser

Demo state is IndexedDB and local preferences. Clearing the profile clears the demo conversations. It does not clear a server-side budget journal if a local server was used. That journal is not a place to store a key.
