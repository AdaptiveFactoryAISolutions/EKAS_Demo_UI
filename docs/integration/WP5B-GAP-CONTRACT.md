# WP5B backend gap contract

Status: **PENDING INDEPENDENT REVIEW**. This is the contract current EKAS main does not implement for the accepted investigation lifecycle. It is not a claim that the adapter is verified, and it is not a license to rename opportunity fields or to change the accepted UI.

Source: read-only `EKAS_Platform_v2` `main` `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`, the 165-file snapshot plus the five-file addendum. Backend files were not modified and were not copied here. Nothing below was filled from `fe2635cef64cf99eccad6c84df82bff466cb46df`.

The opportunity workflow is **NON-EQUIVALENT**. Lifecycle, authority, ownership, evidence binding, versioning, idempotency, verification, sustain, reopen, and history each differ from the investigation aggregate. Where an opportunity field is named below, it is named so the difference stays visible.

## Investigation aggregate

Required: `investigationId`, `conversationId`, `caseType`, `scope`, `currentVersion`, `status`, `owner`, `hypothesis`, `recommendation`, `authorization`, `performedWork`, `verification`, `sustain`, `recurrence`, `history`, `evidenceReferences`.

Current main: no investigation or case resource. `schemas.ts` has no aggregate with these fields. Conversation ids and evidence refs exist on pilot turns and are not this aggregate.

## Command envelope

Required: command kind, `investigationId`, `expectedVersion`, `idempotencyKey`, actor, `knownAt`, payload, and reason or confirmation where the command needs it.

Current main: no investigation command route. Conversation messages have an `Idempotency-Key` and no `expectedVersion`. Draft writes have `expected_revision` for a draft, not for a case command. Live mode refuses the command and does not store a local substitute.

## Owner operations

Required: request owner; accept owner; reassign where the contract supports it.

Current main: no owner-request, owner-accept, or reassign route. `recommendation.responsible_owner` is a text field on an opportunity recommendation. It is not an owner request or an owner acceptance. Live mode returns: "This connected EKAS backend does not currently support investigation ownership. No assignment was recorded."

## Action operations

Required: record hypothesis; recommend a bounded action; request authorization; approve or reject; record performed work.

Current main: no hypothesis. An opportunity recommendation, disposition, and intervention exist and are a different lifecycle. They are not called, and they are not relabeled as hypothesis, authorization, or performed work.

## Verification

Required: verification plan, main measure, baseline, target, observation requirements, guardrails, measured result, acceptance.

Current main: `verification_method` carries `baseline_period`, `post_period`, and `rule_ref`. An opportunity verification compares two certification ids and reports effectiveness and confounders. That set does not include the investigation plan's main measure, target, observation requirements, guardrails, and acceptance. No safety or guardrail review exists.

## Sustain

Required: eligible observations, sustain rule, recurrence threshold, sustain status.

Current main: a sustainment check has `period_ref`, `time_basis`, `outcome`, and an optional `reopened` boolean. `opportunity.factors.recurrence` is a ranking quantity. Neither is the sustain contract above.

## Reopen

Required: preserve the prior cycle; create a new cycle; do not reuse the prior verification as proof.

Current main: no such operation. The sustainment `reopened` boolean does not preserve a prior cycle or open a new one.

## Metric read

Required: metric identity, definition version, scope, period, value, unit, target, target direction, status, evidence or source refs, `knownAt`, availability or qualification.

Current main: no dedicated metric-read route. A conversation may send `structured_request` `{metric, machine, window}` and receive a certified component result. Kernel compute v1 is an uncertified candidate calculation, `result_kind` `CANDIDATE_CALCULATION`, metric `EKAS-MIK-001@1.0.1#MET-004`, tenant `SYN-TENANT-01`, and `create_app` does not mount the tool. Kernel aggregate v1 is titled draft, not effective, with `result_kind` `CANDIDATE_AGGREGATE`. `GET /api/v1/metrics/oee-tiles-v2` has no route. Live mode returns: "This connected EKAS backend does not currently support a dedicated governed metric read. No metric was fetched."

## Errors

Required classes of outcome: invalid request; authorization denied; stale version; conflict; unsupported capability; dependency unavailable; not found; retryable or not, where the contract distinguishes them.

Current main, on the conversation surface that was read: `INVALID_REQUEST`; `UNAUTHORIZED` and `FORBIDDEN`; `AUTHORIZATION_STALE` for a stale principal, which is not a stale investigation version; `CONFLICT` / `IDEMPOTENCY_KEY_REUSED`; `DEPENDENCY_UNAVAILABLE` with `retryable`; evidence that is foreign, missing, or malformed is one 403 `EVIDENCE_FORBIDDEN` rather than a distinct not-found. Draft revision conflict is `DRAFT_REVISION_CONFLICT`. Unsupported investigation capability is not a backend error class. The adapter refuses it locally, before fetch, with `UNSUPPORTED_BACKEND_OPERATION`.

There is no stale-version error for an investigation command, because the command does not exist.
