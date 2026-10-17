# EKAS final completion directive

Status: **PENDING**. This page records Patrick's final completion directive in operational language. It does not change product source. RC3 source `45568c575a00a8810b661929624995ec24e6de1e` and RC2 stay immutable.

## Authorized provider test

Patrick authorizes a cumulative spend ceiling of **$40**. That figure is a hard stop, not a spending target. The only model in scope is `gpt-6.1-sol`. The purpose is final acceptance of conversation, tool calling, latency, recovery, and the end-to-end UI. Production use is not authorized. Paid testing stops when the evidence is sufficient, and it stops at $40 even if evidence is still incomplete.

The key is entered only in the Admin UI. It is not written into chat, prompts, GitHub, source, logs, screenshots, or fixtures.

## What this checkout does now

Machine-verifiable work only:

1. Publish the exact RC3 ZIP and the RC3 screenshot set, and capture any missing RC3 frames without changing source.
2. Prepare the provider facts: official model availability, official pricing, the $40 ceiling, and whether Admin can enforce that ceiling without a source change. If enforcement needs a source change, stop and report. Do not change source.
3. Write the operator runbook for the single Test connection, Enable AI, the full conversational chain, spend and latency tracking, and failure behavior. Pre-run only the failure cases that need no real key.
4. Complete the repository Wiki, the start-here README, the UI API contract, and the backend gap matrix.
5. Prepare the unaided rehearsal packet, the senior engineering review packet, and the final independent reviewer packet. Do not simulate those reviews.

## Phases that a person still has to run

These phases are specified and not performed here:

- Phase 3, the single Admin Test connection.
- Phase 4, Enable AI for a local acceptance session.
- Phase 5, the full conversational chain.
- Phase 6, token, latency, spend, recovery, and cancellation measurement.
- Phase 8, the 120-minute unaided plant-leader rehearsal. Required result: READY FOR LIVE USER TESTING, 0 P0, 0 P1, critical P2 closed. The mandatory checkpoint is Plant Review, then focus first, then Investigate it, opening the feeder-jam case.
- Phase 9, senior engineering review. Verdict is APPROVE, APPROVE WITH REQUIRED REFACTORING, or REJECT FOR PRODUCTION. The review does not change features.
- Phase 18, final independent review. It requires VERDICT: APPROVE. This package does not approve itself.

## Binding product rules carried into the documents

- MES executes and records. EKAS interprets, connects evidence, governs decisions, and verifies outcomes.
- EKAS does not replace MES.
- Observed loss, modeled opportunity, and verified financial value stay distinct. Modeled opportunity is not called savings.
- The claim to fame is a conversation that takes a plant leader from a missed operating goal to evidence, a governed decision, accountable action, verification, and sustained improvement.
- Short form: From production miss to verified improvement.
- Improve the implementation without losing the product.
- Refactoring is allowed; feature or governance regression is not.

## Provider gate found in this pass

The expired pricing authority is no longer active. Admin cannot accept a new pricing record or a $40 cumulative budget without a source change. Paid phases stay unrun. Detail is in `PHASE-2-PROVIDER-PREP.md`.
