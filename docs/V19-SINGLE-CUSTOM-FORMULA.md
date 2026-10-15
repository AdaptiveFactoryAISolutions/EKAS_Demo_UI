# V19 explicit custom formula selection

NEW-DEFECT-FORMULA-MISLABEL.md and new-formula-stale-units.png were read/viewed. A captured downtime formula token remains when adding a labor formula; the old token/title/units show the new30.4value. calculate previously applied its one Formula argument to every fx ID. Add dialog appended IDs and kept the old title.

One custom formula per query is now explicit in the dialog. Saving or selecting a formula replaces prior fx tokens, preserves built-in measures/grouping/filters/cutoff and captures the new definition/name in the query. Removing the selected formula clears its metadata and generated formula title. Selecting another formula updates them together. Arithmetic additionally requires exact formula ID. Older saved multi-formula contexts are retained without migration; all formula values are unavailable until the user selects one, with an explicit Search status. Built-in measures remain independently meaningful.

Four new regressions failed against V18 and pass after correction: actual add dialog, both saved ID orders refusing all formula numbers, and remove/reselect. Coverage includes JSON reload, selected title/units, retained grouping, saving KPI, deleted global formula and current masking. V18 captured edit/delete/followup tests remain passing. Original controls/layout remain; no browser, route, storage or reviewer-register actions.

Independent retest must check actual headline and chart labels after adding/replacing/removing a formula, both token orders from older backups, saved Answer/KPI reopen, captured definition through followups and masking. Full review/provenance acceptance remains reviewer-owned and unfinished.
