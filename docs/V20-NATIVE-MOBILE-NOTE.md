# V20 isolated UI repair candidate

Read PARENT-CHECKPOINT-NOW.md and remaining-assertions.json; viewed native-editor-settled.png and northworks-metrics-mobile390.png. Current independent351register:95pass251partial5fail0notrun; five rows represent three reported issues, not full acceptance. Print-preview disabled native controls remain a tool limitation, not a proven product defect.

Native Dashboards4.2 EditRenderer renders a real button with onclick and background-image icon. Native tools container is30px high/overflow hidden; the retained global button override makes the target44px high and replaces native40px left icon padding with10px. Active edit overlay hasz9996 while tools lack a positioned stacking level. Scoped retained CSS now contains a52px row with visible overflow, restored40px icon padding and toolsz9997 above active overlay but below popup/modal9998/9999. Native callback/keyboard semantics unchanged. This is a source-based hit-layer repair; actual browser pointer hit-testing remains required.

Mobile catalog selectors used flex:1 with max50% but four selectors shared the same wrapping row at31/48px. Scoped retained-case rules now reserve160px preferred/minimum width (bounded by100% available), allow wrap and keep44px target. Context select/button targets also44px. No layout/header/navigation/function redesign.

Important Note discrepancy: currentV19 source already uses noteRef.focus, not moveTile(-1), and tile-note-noop.dom.txt shows note textarea active. We do not claim a reproduced reorder no-op. Added clearer discoverability: first Note scrolls to and focuses the same editor; textarea has Board note accessible name. Existing Save note is regression-tested and tile order remains unchanged. Independent reviewer should correct classification only after retest; register untouched by builder.

Three new regressions fail againstV19 and pass after: actual stylesheet-native target/padding/stacking and callback, selector/context sizing, firsttile Note focus/scroll/name/save/tile-order. CSS jsdom checks do not establish real mobile geometry or pointer hit-test. Full native/narrow/keyboard acceptance remains independent.
