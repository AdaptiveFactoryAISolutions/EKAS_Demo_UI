# V49 Grid visibility and height candidate

V48 remains served. Candidate source corrections do not independently close Search/Inspection. No programmatic browser-state work, Dot/security/extension changes or paid/live/backend calls.

## Visibility contract

Original Search specification requires sorting; the retained Grid disclosure additionally promised visibility. The installed Grid Lite3.2.0 supports columns.enabled and updateColumn but its configured headers expose sorting, not a built-in visibility menu. This candidate implements visibility rather than deleting that contract. Official option reference: https://api.highcharts.com/grid/columns.enabled (web documentation version3.0; installed3.2 source remains version authority). Source: Grid/Core/Options.d.ts enabled option, Grid/Core/Grid.js updateColumn.

Open Full Grid column names below the native Board/Grid. Named Show Grid column [full name] checkboxes show/hide that column in every mounted Grid for this Board using actual updateColumn. Buttons wait for native update completion; Save view is disabled during updates. Controls affect Grid presentation only, retaining query, source DataPool, full proof and CSV. Exact Grid row-selection buttons live in Slice: hiding Slice also hides those buttons until it is shown again; chart point selection remains available. Measure-column visibility must be tested with Slice visible for row-selection acceptance. Existing native chart-to-Grid visibility synchronization remains; reverse synchronization is not falsely claimed. State is read from installed public Grid.options because getOptions intentionally drops id-only defaults. Saved native options capture enabled states; governed restore retains formatter/unit/source IDs and sorting. Captured read-only results expose names only, with no layout controls or Save view guidance.

## Height diagnosis and correction

Reviewer exported cell heights include -511.390625px and -179.09375px. This proves impossible stored geometry, not a complete explanation of every failed drag. Installed Dashboards4.2 Resizer.onMouseMove uses current pointer minus current cell top and does not enforce its declared minimum; Cell.setSize accepts negative heights. HighchartsComponent.resize follows cell geometry. No installed dependency or global handler is patched.

The local pinned adapter attaches only to the actual bottom snap (.highcharts-dashboards-edit-resize-snap-y). Drag starts at the selected native cell height and pointer position; later moves apply bounded delta through native Cell.setSize. New changes bound240–1600px, integer pixels. Native horizontal behavior remains intact. The actual bottom handle is keyboard-focusable when visible, named Resize dashboard component height, with Down/Up44px, Home240, End1600. Current ARIA geometry reads the cell; existing natural heights remain until edited. Pointer handlers/observer detach with the Board. Invalid nonpositive saved heights are omitted from the restored copy, retaining natural governed layout; original stored packets are not rewritten. Positive saved geometry is retained exactly.

## Reviewer affordance and required re-test

Edit native layout; select the chart/cell so native handles appear (toolbar resize icon now accurately says Show component resize handles). Drag the bottom-center44px rotated handle downward200px, not the right horizontal snap. Observe actual cell/chart height, Save view, reload and compare saved cell height and visible geometry. Also Tab to Resize dashboard component height and Down/Up/Home/End. Native pointer/pixel/persistence acceptance remains required; unit tests do not replace it.

For Grid, open Full Grid column names, uncheck/recheck OEE (%) or Downtime (min), verify actual native header disappears/returns, sorting and row selection still work, Save view/reload preserves enabled state and exact source/query/CSV, Restore view returns saved state. Repeat320/390/desktop keyboard with long formula/prior names and missing/zero scope. Added native components/reorder/removal and chart-to-Grid visibility carry only unchanged independent evidence until new verification.

## Engineering evidence limits

Real installed Grid test covers updateColumn, native rendered-column roster (jsdom glyph geometry is not acceptance), unchanged actual DataTable columns, saved enabled state and governed restore. Rendered control test covers named checkbox, save and instructions with Board boundary simulated. Bounded height test covers real adapter events against Cell.setSize contract; original red failure retained. Saved-geometry test covers impossible heights without packet rewrite and500px retention. Real browser geometry remains independent reviewer work. Initial native Grid test setup errors (async factory, missing jsdom ResizeObserver, serialization dropping id-only columns, jsdom header text/retained accessibility summary not serving as geometry evidence) remain recorded; corrected test uses actual async Grid and a minimal ResizeObserver shim. No fake browser acceptance.

V48 independent metric-routing and parameter closures remain intact. All numeric definitions, fixtures, captured answers, query parser, warnings, temporal policy, registry and source anchors are unchanged. OpenAI remains server-side, no Ollama fallback; Tom real authenticated contract remains external.

The first full run passed1025/1026 but caught Save view text leaking into read-only captures. It remains as unit-results-v49-interim.json; corrected by preserving static name disclosure and removing edit guidance/controls from read-only results. Final full results supersede that interim run.
