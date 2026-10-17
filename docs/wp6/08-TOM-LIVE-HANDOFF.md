# Tom and live production handoff — EKAS DEMO RC1

This handoff starts after the local demo is accepted. It is not a reason to keep changing the UI.

## What Tom receives

- RC1 archive, SHA, and hashes in `RC1-IDENTITY.md`.
- Backend main that was read: `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`.
- `docs/integration/WP5B-GAP-CONTRACT.md` and `docs/wp6/07-BACKEND-GAP-CONTRACT.md`.
- `docs/integration/WP5B-CURRENT-MAIN.md` and the compatibility matrix.
- The fail-closed adapter in `app/src/platform/backendMode.ts`.

## What stays deferred

Tom conformance and later live integration are deferred production work. The closure register already marks those production-only facets deferred. The local demo facet of those rows stays unverified until an independent review accepts this RC. Completing the backend contract is production work. It is not a new UI work package.

## Rules for the next integration

- Do not modify the local UI lifecycle so that it fits the missing contract.
- Do not call the opportunity workflow and label it an investigation.
- Do not copy backend snapshots into this repository.
- Do not claim Adapter Verified or Live Integration Verified until the contract exists and an authorized live test passes.
- A real provider key is not part of this handoff. Patrick enters it privately in Admin if a provider test is authorized.

## Suggested order

Backend contract, adapter mapping, authorized live test, then customer-specific configuration. The local demo can be shown from RC1 while that work proceeds.
