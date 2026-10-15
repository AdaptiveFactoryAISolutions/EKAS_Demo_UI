# V97 reviewed action and workload contract

This is the existing prototype's proposed domain API. Physical HTTP transport: POST `/api/v1/application` carries `{apiVersion, requestId, method, path, body?, idempotencyKey?}`; logical manufacturing paths below are inside that envelope. The trusted synthetic listener supplies session/role scope. Direct REST/auth mapping and production CMMS/controlled release require Tom’s approved contract; no actual conformance is claimed.

GET logical `/api/v1/manufacturing/decision-support/{conversationId}` returns current scope/support version, derived governed records and nullable latest exact saved model interpretation. Existing PM/handover/lesson operations remain.

## Guarded model-selected recommendation

The unchanged `action_draft` tool reads current canonical state. A ready traceable hypothesis, accepted owner and draft/rejected/failed action may yield an additional read-only `reviewable_operation` fact with exactly `{kind: recommend-action}`. The model must select that exact receipt fact in its final bound claims. There are still seven model tools; no tool creates this proposal, approves it or performs work. Context/history/four-round/usage limits are unchanged.

A human-confirmed `decision-lifecycle` create payload of type `action` needs the current `modelDraftTurnId`, title/text, exact basis IDs and optional `workloadPlanId`. The service stores the original unverified capture and fixed canonical operation. Create/submit/separate review are held records. They do not mutate the case.

Explicit apply payload: `{operation: apply, recordId, expectedRecordVersion}`. It accepts no caller command/operands. Its outer confirmation must be `CONFIRM_REVIEWED_SYNTHETIC_RECOMMENDATION`, distinct from `CONFIRM_SYNTHETIC_DECISION_RECORD` for proposal records. The public form requires the separate application checkbox and button. The exact reviewed operation runs through the unchanged canonical command API in a staged repository. Parent commits canonical recommendation and applied receipt together once; failed persistence acknowledges neither. Idempotent replay returns the original receipt without another change. Changed source/plan/case/cutoff/role/record/workload versions refuse application. No authorize/performed/engineering-change/knowledge-release/CMMS/savings operation is model-applicable.

## Workload and verification duties

Create payload type `workload`: title/text/basis IDs plus profile (`normal`, `absent-maintenance`, `reduced-maintenance`), explicit UTC deadline and1–16 unique duties. Duty fields: id, fictional role, kind (`repair-planning`, `verification-measurement`, `verification-review`, `safety-review`), UTC date, proposed person-hours. These are declared synthetic planning assumptions, not actual roster or attendance.

Calendar version `synthetic-role-planning-v1`, known2026-10-06T13:00:00Z. Windows are UTC15:00–17:00 per selected date. Normal maintenance capacity2person-hours, reduced1, absent0; other named roles1. Remaining planning-window hours at the selected scenario clock cap capacity. Hours aggregate only within the same role/date. Case endpoint/unit/required eligible shifts/plan version are captured separately; jam/speed/FPY are never converted or pooled as workload.

Create records a draft and exact constraint assessment. Submit becomes `held-workload` for overload/absence/past window/conflicting deadline; no dispatch. A feasible submitted plan requires each named role's `accept-duty` on its exact duty ID, then separate manager review. Rejected/edited plans preserve history. `edit-workload` explicitly replaces profile/duties/deadline and clears every acceptance/review. Generic text-only edits cannot hide changes to planning basis. Production release remains held even after endorsement.

An action proposal may explicitly bind workload ID and revision. Recommendation review/application require that exact same-case/current-source plan, feasible capacity/deadline, every named duty acceptance and held manager endorsement. Changed planning revision requires editing and reviewing the action again. The existing unlinked/manual recommendation path is preserved; a selected workload basis cannot silently disappear during editing.

## Scope and evidence

All requests bind the exact current returned scope/support version, knownAt/reason/role and appropriate confirmation. Canonical authority remains the investigation resource; the existing decision resource holds immutable proposal/planning events. No duplicate case, ownership, verification or release ledger is created. Public capacity table/chart uses actual EvidenceBoard/Highcharts/Dashboards data views. Native chart geometry, device/AT/200%/file/print remain independent.

GAP041 is a bounded callable local flow in working V97, with full source/build/compiled/freeze/retest pending. Original13-row inventory is retained; other12 local gaps and11 externally declared decisions remain separate. Original R5 approval is distinct from fresh merged-artifact security acceptance after denial. No key/spend/live provider/backend/CMMS/controlled-document action occurred. Original17:01 assets18244 download remains pending; no browser or alternate download bypass.
