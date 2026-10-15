# V12 independent-review repairs

Candidate only; served V11 and Chrome are untouched. Parent coordinates later deployment and visible re-test.

Notifications: Open monitors now clears notifOpen before navigating; the dialog previously had no close transition on that action.

Grouped OEE: query rows now retain ideal-good-minute numerator, planned-minute denominator and total group count. The headline combines only a complete, uniquely keyed, finite eligible cohort using ratio of sums. It never averages percentages or chooses the first group. Older captures without denominator evidence, unavailable groups, incomplete returned groups or other grouped measures show explicit per-scope headlines and Aggregate unavailable. No historical query is rerun or timestamp rewritten. The additive basis is retained in captures.

Captured formulas: sharing uses the selected formula definition in the same governed query operation as the working result; formerly runQuery omitted it and produced NaN/null formula values. Captured rows remain immutable when a later definition changes. Current redaction/scope eligibility still applies.

Grid contrast: native Grid row hover, synced row, cell hover and synced cell layers explicitly use #24344f background and #e7eef8 foreground. Existing dark treatment and interactions remain. Native visible confirmation remains required.

Five failing regression tests were observed before repair; afterward all five pass. They cover correct full-cohort OEE ratio, older no-basis grouped scope, unavailable groups, notification dismissal and captured formula value/immutability. Real Viz/headline rendering is exercised; Chart/Board native interactions remain the independent browser reviewer's responsibility. Source build initially caught a test-only literal typing mismatch, corrected before final build.

Runtime changed files: src/platform/workspaceQuery.ts; src/retained/viz.tsx; src/retained/screens.tsx; src/retained/retained.css. Added test files: src/retained/v12Headline.test.tsx; src/retained/v12Interactions.test.tsx. Packaging script version advances only. V11 wording/icons and V10 recovery repair retained. No navigation/layout redesign, external backend mutation or legal clearance claim.
