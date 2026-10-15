export const guideControlRecipes={
  "F007": [
    "trial-usage",
    "View data usage",
    "Review the local trial counts and their retained window before opening usage.",
    "Use View data usage to inspect classified local audit events. Seats are local synthetic users; query submissions are not successful replies or provider requests.",
    "If the audit window is empty, preserve that empty state. Bytes, tokens and charges are not measured; activation requires the separate authorized server accounting boundary."
  ],
  "F010": [
    "palette-open",
    "Search the library",
    "Return to Home to search saved local answer and board names; keep the current case and draft.",
    "Type a name fragment into Search the library. Home Recents filters by that text. Opening Jump is a separate palette action; close it with Escape to inspect matching saved items.",
    "Clear the text when no item matches. Removal is separately restorable; a missing item is not recreated by search. Opening an answer must preserve its captured query and historical cutoff."
  ],
  "F011": [
    "recent-open",
    "Open recent item",
    "Require a matching saved local answer or board in Home Recents.",
    "Choose the exact named item. Boards open the stored board ID; answers load their stored query and answer ID. Favorite, scheduling and Remove from library are separate normal controls.",
    "If no matching item exists, clear Library search or create a saved item normally. A removed item can be recovered through Removed local items. Local schedules do not send messages."
  ],
  "F014": [
    "ask-suggestion",
    "Suggested question",
    "Keep the saved conversation context visible and eligible; manufacturing-mode suggestions retain their own scope.",
    "Choose a suggested question to place its text in the draft. Review grouping, filters, cutoff and tuple exclusions before using normal Run. The suggestion click alone executes nothing.",
    "If saved context is loading or unavailable, wait or reopen the exact conversation. Correct an unsupported asset explicitly; do not substitute the working query for a failed saved-context read."
  ],
  "F019": [
    "search-suggestion",
    "Column suggestion",
    "Enter a column name or authored synonym in the Search draft to make matching suggestions visible.",
    "Choose the exact suggested column. Inspect resulting query tokens and use Go to capture the governed result. A suggestion is not a claim about cause or current production.",
    "No match means no suggestion control. Shorten or correct the term, inspect Catalog, or clear the draft; do not create guessed metric identifiers."
  ],
  "F022": [
    "column-find",
    "Find columns",
    "Inspect Popular versus All and the separate measure, attribute and date sections.",
    "Type in Find columns, then use the exact column checkbox to include or remove it from the working query. Use column information to inspect its definition before Go.",
    "Clear the search when no definition matches. A hidden or masked operand cannot become eligible by selecting its name; inspect the refusal and keep missing values unavailable."
  ],
  "F023": [
    "column-filter",
    "Filter column",
    "Require an authored attribute/date column and review the current included/excluded values.",
    "Use Filter next to the exact column. Select Include or Exclude and the bounded values, then apply through the normal dialog. This filters without adding the column as a chart axis.",
    "Cancel retains the existing query and returns focus. Empty or invalid selections must remain explicit. Clear the filter normally to recover the broader scope; do not silently reuse another cohort."
  ],
  "F028": [
    "coach-dismiss",
    "Got it",
    "Require the visible retained Search coach mark; it may already be dismissed.",
    "Read its explanation, then use Got it to dismiss the local orientation message. Dismissal changes no query, result, source or permission.",
    "When absent, there is no current dismiss action. Do not reset preferences to manufacture a Guide observation. Help remains available separately."
  ],
  "F029": [
    "chart-choice",
    "Choose chart",
    "Require eligible captured rows and an appropriate metric/unit combination.",
    "Choose column, bar, line, area, pie, table, headline, pivot or waterfall through the existing chart controls. Inspect the actual chart and connected Grid under the same query.",
    "When the chart is withheld, read its reason and use the exact Grid table. A view change cannot create missing denominators, valid mixed-unit totals or causal proof."
  ],
  "F030": [
    "chart-labels",
    "Labels",
    "Inspect the current chart, units and configured decimal precision.",
    "Toggle Labels and inspect the normal chart. Decimals and time bucket have separate controls; Compare prior requires an actual eligible prior cohort.",
    "Restore the prior label/decimal/bucket setting normally. A formatting change does not alter raw source values; missing comparison remains unavailable rather than zero."
  ],
  "F033": [
    "legend-exclude",
    "Exclude slice",
    "Require a grouped eligible result with the Slice legend and mutable current query.",
    "Choose Exclude for the exact displayed group/value. Inspect the exclusion filter and returned source scope. Historical read-only captures cannot be recomputed by this control.",
    "Remove the explicit exclusion through normal query controls to restore scope. An absent legend or unavailable group is not substituted with another result."
  ],
  "F034": [
    "slice-drill",
    "Drill by column",
    "Select a point or Grid slice first and inspect its exact displayed dimensions.",
    "Use Drill by the chosen authored column. Review the resulting scope and dimensions; Keep only and Exclude selected scope are separate operations.",
    "Without a selected slice, drill controls are absent. Clear/reset the current working query or undo normally to recover; preserve compound selected scope and cutoff."
  ],
  "F044": [
    "unvisualized-axis",
    "Second attribute notice",
    "Require two grouped attributes with a chart that uses one axis.",
    "Read Not visualized as its own axis and the exact omitted attribute name. Choose pivot or table using the normal chart catalog to expose both dimensions.",
    "The notice is absent when there is only one group or a full pivot/table. Do not add arbitrary dimensions to create a notice; exact Grid rows remain the source for hidden axes."
  ],
  "F047": [
    "boards-owner",
    "Board owner",
    "Require the local Boards list; ownership is local presentation metadata.",
    "Choose All local owners or Yours and then a Tag. Open the exact matching board by name. These list filters do not change a board query or backend permission.",
    "If no boards match, clear owner/tag filters or create a board normally. Do not treat an empty list as a deleted object or an authenticated access grant."
  ],
  "F049": [
    "tile-open",
    "Open tile",
    "Require an existing board and selected tab containing a saved tile.",
    "Inspect the tile headline, units and source/cutoff. Use its normal Open control to reopen the exact saved query or captured canonical answer.",
    "An immutable capture remains historical. If its saved canonical answer is absent, inspect the existing tile or save an answer through Metric workbench; never substitute a live query silently."
  ],
  "F051": [
    "connected-result",
    "Connected board result",
    "Require a mutable query tile with eligible grouped points; immutable canonical tiles are excluded.",
    "Select an exact point or Grid slice on the tile. Inspect the board personal filter containing that column and value. Existing board filters and content remain distinct.",
    "Remove the personal filter normally to restore scope. If the tile is immutable or unavailable, create a new explicit capture for changed filters; clicking must not rewrite historical evidence."
  ],
  "F055": [
    "board-review",
    "Mark locally reviewed",
    "Require the exact selected local board and inspect its definition/source before review.",
    "Use Mark locally reviewed to toggle this local definition marker. Follow is a separate local preference; neither verifies a manufacturing intervention nor grants production release.",
    "Use Locally reviewed or Following again to remove the marker/preference. Preserve the underlying board content and local notes; manufacturing verification requires its separate owned case evidence."
  ],
  "F062": [
    "pattern-empty",
    "Drop empty",
    "Require a grouped pattern scan and inspect current query/filter scope.",
    "Toggle Drop empty and Drop zeros separately, then inspect excluded slices. Drop empty hides missing/unavailable entries; Drop zeros hides observed zero values.",
    "A headline-only query has no comparable slice. Add an authored attribute normally. Empty filtered results remain explicit, and scan differences do not establish causality."
  ],
  "F070": [
    "definition-find",
    "Search definitions",
    "Open Catalog and inspect the governed local metric/column definitions.",
    "Type a name, ID or authored synonym in Search definitions. Read its description, aggregation and units; the search changes only the visible catalog list.",
    "Clear or correct unmatched text. No matching definitions does not authorize invented IDs or aliases. Production definition changes require a separately controlled source workflow."
  ],
  "F076": [
    "theme-density",
    "Density",
    "Inspect the retained dark theme and current display name/density.",
    "Use Density to switch compact or comfortable spacing. Edit Display name separately. Charts retain their governed labels, units and source qualifications.",
    "Toggle back to restore spacing. The palette remains the authored dark theme; no color-theme change or branding deployment is claimed."
  ],
  "F081": [
    "onboarding-welcome",
    "Welcome message",
    "Open Onboarding to inspect the current local welcome message and option checkboxes.",
    "Edit Welcome message and toggle the intended onboarding options through their normal controls. These are presentation preferences, not role grants or completed training.",
    "Restore the prior text/options explicitly if unintended. A storage failure requires local recovery; reload and inspect preferences without resetting the manufacturing case."
  ]
} as const;
