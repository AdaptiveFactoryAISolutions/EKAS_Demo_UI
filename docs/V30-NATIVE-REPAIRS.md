# V30 isolated native repair candidate

This candidate preserves V29 and separates EKAS Dot implementation. It is provisional pending independent browser review. The active review route remains V29; no browser/storage or route changes were made.

Menu Escape now closes expanded navigation and focuses Menu, with dialog/native palette priority preserved. Menu reports its expanded state.

Inactive native sidebars normally remain offscreen. V29's portal positioning brought those empty sidebars onscreen as well, allowing them to cover the active palette. V30 hides portalled palettes until their native show class is present. Native close controls now have visible text when the installed component supplies an empty icon button. Native callbacks, component palette generation and cleanup remain intact.

Saved native KPI additions now restore their cells and whitelisted local presentation/value options. Connector restoration permits only a connector already present in the governed current DataPool. Saved chart options, scripts and external resources are not imported into the added KPI. Existing governed chart/source/unit/axis restore rules remain intact.

Regression evidence includes Menu Escape state/focus, CSS visibility of active versus inactive portalled palettes, and installed Dashboards KPI serialization followed by a fresh Board rendering the same canonical 30 min value. Full tests/build are recorded in evidence/unit-results-v30.json and the freeze. Native drag/reorder/resize and complete browser acceptance remain unverified.

Independent re-test: first Add component open in captured Ask and at 320px with multiple Boards mounted; visible Close; native KPI add/save/reload; Menu Escape; preserved Grid selection/sorting and mobile presentation keyboard behavior. Reviewer owns browser state and must coordinate any deployment swap.
