# V96 synthetic governed proposal contract

This extends the existing shared decision-support API in the isolated prototype. It is an editable integration specification for Tom’s future implementation, not conformance evidence for an unseen backend. Real authentication, CMMS dispatch, controlled release and fresh merged-artifact security acceptance remain separate. OpenAI Responses remains the intended server provider; no Ollama dependency is introduced.

## Existing routes

GET `/api/v1/manufacturing/decision-support/{conversationId}` returns the exact current `scope`, `version`, `admissible`, existing decision entries, derived `governedDecisions` and nullable `modelDraft`.

POST `/api/v1/manufacturing/decision-support` uses the existing versioned transport envelope and idempotency key. Body: `kind: decision-lifecycle`, exact returned `scope`, `expectedVersion`, `knownAt` equal to the selected scenario clock, a review reason, `confirmation: CONFIRM_SYNTHETIC_DECISION_RECORD`, and a typed `payload`. Existing role/context/storage/lease checks remain.

| Operation | Payload fields | Synthetic meaning |
| --- | --- | --- |
| create | operation, type pm/handover/lesson, title, text, basisRecordIds; handover receivingRole; optional modelDraftTurnId | Source-pinned draft only |
| edit | operation, recordId, expectedRecordVersion, text | New draft revision; prior review/acceptance/promotion invalidated |
| submit | operation, recordId, expectedRecordVersion | PM/lesson submitted; handover offered |
| review | operation, recordId, expectedRecordVersion, outcome approved-held/rejected | Separate fictional manager/safety review; release remains held |
| accept | operation, recordId, expectedRecordVersion | Named fictional receiving role acknowledges handover; case ownership unchanged |
| promote | operation, recordId, expectedRecordVersion | Reviewed lesson becomes a candidate only after accepted verification and sustained eligible observations |

The caller receives the committed receipt and fresh projection. Each operation appends an immutable event to the existing decision resource; derived proposal revisions reopen from those events. No parallel case, approval, verification or ownership ledger is created.

## Model preparation

`modelDraft` is exposed only for the latest saved conversation turn whose entire case snapshot and clock match the current selected case, with a valid saved model capture. It retains turn/capture/operation/provider/policy/source revision/time/author and the original unverified interpretation. Oversized or non-current interpretations are unavailable for preparation; prior answers remain historical.

The public preparation button copies text into a human review form and saves nothing. A confirmed `create` may name that exact `modelDraftTurnId`; the service refuses foreign, missing or wrong-role capture references. The record retains the original captured interpretation even if the human edits the proposal text. The model cannot call submit/review/accept/promote or authorize a write. Existing seven model tools, four-round/context/history/usage caps and provider-disabled defaults are unchanged.

## Outcomes and holds

403: fictional role does not satisfy the ordinary lifecycle condition. 409: scope, source/plan/case/cutoff/support or proposal revision conflicts, or conflicting idempotency payload. 422: invalid/unsupported fields, missing basis, unsupported state transition or ineligible model capture. Durable failure produces no acknowledged decision receipt; refresh/reconciliation uses the existing repository contract.

All records retain `causalStatus: unconfirmed`, `financiallyValidated: false`, `productionReleased: false`, `notDispatched: true`. Observed verification and sustainment do not establish causality or certified financial savings. Like-for-like repair remains distinct from unreleased EC003. Native review and actual Tom endpoint/auth contract acceptance remain open.
