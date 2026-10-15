# V53 scrolled mobile Menu

V52 remains frozen/served; V53 undeployed. Independent V52-FINAL-MOBILE-MENU-OFFSCREEN P2 at320/390: sidebar opens above viewport/behind stickyheader after page scroll. Reviewer screenshots and real geometry read before correction. No Chrome actions performed by builder.

Narrow fix: mobile sidebar is fixed below measured current stickyheader bottom, with own bounded viewport-height vertical overflow. Existing header/navigation darkstyle/order/menu state unchanged. Header ResizeObserver, window scroll/resize updates measured boundary while open; cleanup on close. Desktop media unchanged. Existing Menu toggle, Escape focus restoration, selected destination collapse/mainfocus and nativebutton semantics retained. No document scroll reset/auto-scroll used to disguise offscreen state.

Regression actualConsole at320/390/1366 covers scrolledheader121px, updated84px boundary, clickopen/close, Escape/restored Menu focus, Search selection/navcollapse/mainfocus. Header geometry shim proves mounted positioning state and cleanup, not actual CSS pixels/native EnterSpace. Corrected regression against freshly extracted frozenV52 reproduces2mobilefail/1desktoppass. Initial test selected unrelated firstaside; retained diagnosis corrected to exact Template sidebar navigation selector. Focused8tests3files PASS; final suite/build recorded separately.

Independent retest: on longInspection andHome scroll then click/Enter/SpaceMenu; navigation must be visible below stickyheader without locatorautoscroll, its own scroll reaches every destination; Escape closes/restoresMenu; destinationclick/Enter collapses/focusesmain.320/390 andlaptop1366, longheader/More/alertclose/resizing. Preserve original39navigation, current41items/44routes/darktemplate, V52aliases/groupfixture and all accepted scope/Grid/resize/knowledge/calculations. No aggregateP3/protected closure inferred.

No deployment/browser/storage/Dot/security/provider/credential change. Existing independent328PASS/23PARTIAL unchanged. Dot integration separately underway, heldreview/expiredpriceguard/USD20journal unchanged; identicalMenufix will be carried afterward. No heldreview reroute/bypass.

Final1084tests/168files PASS exit0; typecheck/build PASS. Independent native pixel/keyboard acceptance pending.
