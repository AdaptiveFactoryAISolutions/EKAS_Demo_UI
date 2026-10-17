# 14 Production backend gaps

Adapter Verified: **NO**. Live Integration Verified: **NO**.

Source read for this matrix: EKAS_Platform_v2 main `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`, as recorded in `docs/integration/WP5B-GAP-CONTRACT.md` and `docs/wp6/07-BACKEND-GAP-CONTRACT.md`. This page does not reopen that read and does not copy backend files. The opportunity workflow is not the investigation lifecycle.

Deferred production dependency, verbatim in substance: current EKAS_Platform_v2 main lacks the complete investigation, case, and metrics contract required for full backend-connected EKAS behavior. The adapter remains fail-closed. Live integration is not claimed.

| UI requirement | Current backend capability | Route or function | Status | Required action |
| --- | --- | --- | --- | --- |
| Conversation turn with idempotency | Pilot conversation messages exist | `/v1/conversations` and message paths; local envelope `/api/v1/manufacturing/conversations/{id}/messages` | PARTIAL | Keep the documented path. Do not treat it as the investigation aggregate |
| Evidence by hash | Evidence refs exist on pilot turns | `/v1/evidence/sha256:{hash}` | PARTIAL | Confirm the hash route on the target main before calling it live. UNVERIFIED against a fresh fetch in this pass |
| Investigation aggregate | No investigation or case resource in `schemas.ts` | No route | MISSING | Add the aggregate before the adapter will call it |
| Command envelope with expected version and idempotency | Conversation messages have an idempotency key and no investigation `expectedVersion` | No investigation command route | MISSING | Add the envelope. Draft `expected_revision` is not this |
| Owner request, accept, reassign | `recommendation.responsible_owner` is text on an opportunity | No owner route | MISSING | Add owner operations. Do not call the opportunity field |
| Hypothesis and bounded recommendation | Opportunity recommendation is a different lifecycle | Opportunity routes, not called | MISSING | Add the investigation commands |
| Authorization | Opportunity disposition is not this decision | Not called | MISSING | Add authorization. Refusal stays "No decision was recorded." |
| Performed work | Opportunity intervention is not performed work | Not called | MISSING | Add the work record |
| Verification plan and result | Opportunity verification compares certification ids | Not the investigation plan | MISSING | Add measure, target, observations, guardrails, acceptance |
| Sustain rule and recurrence | Sustainment check has a different shape | Not the sustain contract | MISSING | Add the rule and threshold |
| Reopen into a new cycle | A `reopened` boolean does not preserve the prior cycle | No operation | MISSING | Add reopen |
| Dedicated metric read | No mounted governed metric read. Kernel compute is an uncertified candidate and is not mounted | `GET /api/v1/metrics/oee-tiles-v2` has no route | MISSING | Add the metric read. Do not mount the kernel as a substitute |
| Health probe | Unauthenticated `/healthz` and `/livez` exist as a shape the UI knows how to validate | `/healthz`, `/livez` | PARTIAL | A green probe is not readiness for the rows above |
| Expected-version conflicts for investigation commands | Not applicable | No command | MISSING | Define the stale-version error when the command exists |
| Live integration test | Not run | — | UNVERIFIED | Run only after the missing rows exist |

Status meanings: VERIFIED means an accepted test against this main; PARTIAL means a related surface exists and is not the required contract; MISSING means the contract is absent; UNVERIFIED means this pass did not re-fetch the backend.

Required action for every MISSING row is the same shape: add it on the backend, map it in the adapter, then remove the matching refusal only after a test. Until then the refusal stays.
