# Confirmed F001 Profile Jump correction

Current immutable candidate: 7e26e707, mock18344. Independent report: evidence/native-next-ten-7e26/RC-7E26E707-NEXT-TEN-COMPLETIONS.md.

Root cause observed in source: the Jump results invoke generic go(w.screen). The Global Profile workflow has Home as its screen and requires opening a modal; generic routing therefore closes Jump and navigates Home without opening Profile. Normal More > Profile already opens the correct dialog.

After current full validation reaches terminal, add a failing targeted regression using the normal Console/Jump control and actual Overlays. Assert Profile opens from a non-Home work context, Jump closes, query and page remain unchanged, dialog focus moves inside, Escape/Close restores the connected original opener. Include pointer and native button semantics; actual narrow keyboard confirmation remains independent native work. Correct only the confirmed Profile target and preserve other target mappings.

Dialog handoff must close Jump before capturing Profile return focus, otherwise the newly opened dialog can retain an about-to-unmount Jump result as its return target. Test this transition explicitly. Do not mark native keyboard/320px acceptance from jsdom.

Run targeted regression and related Dialog/Guide/Jump tests, typecheck, browser and local server builds serially. Prepare an isolated successor with source/build hashes and exact HTTP asset verification, preserving all current snapshots and previews. Batch any further actual native defects before another full suite. No paid call, real key access, backend mutation, freeze or final ZIP.
