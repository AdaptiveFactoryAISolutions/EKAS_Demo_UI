# Backend gap contract — EKAS DEMO RC1 handoff

The full contract is `docs/integration/WP5B-GAP-CONTRACT.md`, written against current backend main `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`. This page is the RC1 handoff. It does not change that contract and it does not change the UI.

Deferred production dependency: current EKAS_Platform_v2 main lacks the complete investigation/case/metrics contract required for full backend-connected EKAS behavior. Backend Gap Contract is defined. Adapter remains fail-closed. Live integration is not claimed.

Adapter Verified: **NO**. Live Integration Verified: **NO**.

## Missing on current main

- Investigation aggregate: identity, conversation, case type, scope, version, status, owner, hypothesis, recommendation, authorization, performed work, verification, sustain, recurrence, history, evidence references.
- Command envelope with `expectedVersion` and an idempotency key for an investigation command.
- Owner request, owner acceptance, and reassignment.
- Hypothesis, bounded recommendation, authorization, and performed work as this lifecycle. The opportunity workflow is non-equivalent and is not called.
- Verification plan with main measure, target, observations, guardrails, and acceptance.
- Sustain rule, recurrence threshold, and a reopen that preserves the prior cycle and opens a new one.
- A dedicated governed metric read. Kernel compute v1 is an uncertified candidate and is not mounted. Kernel aggregate v1 is titled draft, not effective.

## What the adapter does

Live mode refuses each unsupported capability in words and does not substitute the synthetic demo or the opportunity routes. Ownership refusal, exact sentence: "This connected EKAS backend does not currently support investigation ownership. No assignment was recorded."

## Required schemas and operations

Use the sections in `docs/integration/WP5B-GAP-CONTRACT.md` for the field lists and the error classes. The mapping of current-main files is in `docs/integration/WP5B-CURRENT-MAIN.md` and `docs/integration/WP5B-COMPATIBILITY-MATRIX.md`. Do not fill a gap from the stale baseline `fe2635cef64cf99eccad6c84df82bff466cb46df`.

## Next production steps

1. Add the investigation aggregate and command envelope on the backend, including owner, hypothesis, authorization, performed work, verification, sustain, and reopen.
2. Add a dedicated governed metric read with definition version, scope, period, value, unit, target, direction, status, and source time.
3. Map those routes in the adapter and remove the matching fail-closed refusal only after the contract is present.
4. Run an authorized live test. Until that test passes, Live Integration Verified stays NO.

## Cross-system gaps, documented after RC3

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

These rows are not part of the RC1 handoff above and do not change the deferred investigation, case, and metrics dependency. They are additional missing capabilities, specified for a later authorization. The contract text is [docs/wiki/14-production-backend-gaps.md](../wiki/14-production-backend-gaps.md) and [docs/wiki/cross-system/](../wiki/cross-system/01-cross-system-manufacturing-data.md).

- Canonical entity resolve: external system plus external id to a canonical entity. A miss stays unresolved.
- Entity aliases: canonical entity to the source ids a mapping version allows.
- Evidence search by context: plant, line, asset, job, part, revision, and period.
- Evidence search by canonical entity.
- Cross-system relationship lookup. `CAUSED_BY` is never created from correlation.
- Historical and effectivity lookup.
- Source-version lookup.

No adapter refusal is removed for these rows. None of the future acceptance tests has been run.
