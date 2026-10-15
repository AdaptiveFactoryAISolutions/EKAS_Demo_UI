# V15 isolated shortcut and EC-review display repairs

Served V14 stays unchanged during candidate preparation. Builder performed only the parent-authorized V14 review-route swap, with exact HTTP index/JS/CSS verification, preserved V13 rollback/Main/root and no browser/storage actions.

Ctrl/Command-K: replaced independent Console and manufacturing WorkspaceBar listeners with one shared priority owner. The mounted manufacturing search has priority over the outer retained Jump palette; standalone retained workspace still owns its Jump shortcut. Removed the third main.tsx shortcut branch that navigated to Metrics. Repeated keydown does not rapidly toggle state. No background screen or query is changed merely by opening search.

Focus/Escape: manufacturing search captures its opener before opening. Escape closes one dialog and stops background propagation; focus is restored after the native dialog closes, avoiding an attempted focus on an inert background followed by BODY focus. Search results and explicit navigation remain unchanged.

EC current-review status: complete means one nonempty local review from each of Quality, Operations and Manufacturing engineering for the current proposal version, known at the selected clock. Stale historical rows remain displayed but do not invalidate a complete current set. Duplicate reviews from one role and future-dated reviews cannot substitute. Future review display now states not yet known at selected snapshot.

This is a local review-set status only: the production release button remains disabled, and validation/customer/training gates, unknown impact checks, effectivity, WIP/stock disposition and current approved document authority remain blocked exactly as before. No EC release or performed intervention was granted.

Four failing regression tests were observed before repair; afterward all four pass: embedded single shortcut modal/screen preservation/Escape/focus return; three current roles plus stale history; duplicate-role incompleteness; future review incompleteness. Completed-role test explicitly asserts production release disabled. Production build passes. Visible native shortcut and EC status still require reviewer re-test. All fixtures and historical evidence preserved; no broader redesign.
