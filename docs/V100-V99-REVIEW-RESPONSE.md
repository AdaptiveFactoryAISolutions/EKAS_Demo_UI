# V99 independent review response in V100

Independent report: /home/pat/Documents/Codex/2026-10-11/task-3/review-v99/REPORT.md. V99 remains PARTIAL (846 fresh cases, 844 passed, two reproduced P2 defects), immutable. V100 fixes are successor changes, not retrospective V99 acceptance.

D01: reload previously read the generation after awaiting the case and could combine an old command version with a newer projection. The successor captures the operation generation and exact case/workflow/actor signature before awaiting, checks after each read, and holds projections whose investigation version cannot be reconciled with the command record.

D02: boolean confirmation survived external changes. The successor binds confirmation to exact scope, loaded record, full diagnostic projection, selected hypothesis and assessment fields. Scope changes immediately invalidate confirmation and reset loading state while retaining same-case assessment fields. Snapshot selection has its own exact scope confirmation.

Permanent matrix tests cover aggregate, hypothesis, cutoff, role and case confirmation changes; delayed version, cutoff, case and role reloads; and a source projection ahead of the captured case. Red phase: 9/10 failed. Current focused green: 10/10, combined with retained diagnostic/new query UI: 15/15. Full regression and independent successor re-test remain pending. No native, provider, actual Tom, security or whole-plan acceptance is implied.
