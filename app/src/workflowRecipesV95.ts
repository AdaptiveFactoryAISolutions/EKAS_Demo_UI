// Workflow-specific human procedures grounded in existing public callbacks; no automatic execution or whole-workflow acceptance.
export const workflowRecipesV95:Record<string,readonly [string,string,string]>={
  "F002": [
    "Require a saved monitor in the local notice list; a notice is not a plant alarm acknowledgement.",
    "Open Notices yourself, inspect the named monitor and its latest local condition, then use Open monitors to inspect that exact monitor. Mute belongs to the monitor and does not resolve the underlying condition.",
    "An empty notice list is a valid empty state. Close Notices with Escape and reopen the same monitor after refresh; do not invent an alert or acknowledge a production alarm."
  ],
  "F005": [
    "Enter a valid local synthetic user name and email. The current form assigns the default Viewers group; there is no group selector before Add user.",
    "Use Add user once, inspect the Invited row and Viewers membership, and reopen Users after storage acknowledgement. This is local bookkeeping and sends no email.",
    "Invalid/duplicate/bounded input has no added user. Keep the entered draft on failure; a local invitation record grants no real account permission."
  ],
  "F008": [
    "Choose whether you need an answer, board, collection or monitor; creation uses the current local workspace.",
    "Open Create yourself and select the intended object type. Enter its required name and context, use its normal confirmation, and inspect the newly saved object before adding further content.",
    "Cancel leaves existing objects intact. When a save fails, keep the entered fields and inspect the save banner; do not create a second object to bypass a pending write."
  ],
  "F009": [
    "Check the selected source and provider mode before entering a manufacturing question.",
    "Enter a supported question in Home ask and use Submit once. Review its captured source, cutoff, qualification and result; use the exact saved conversation for the next question.",
    "The disabled profile cannot submit a model question. Unknown scope or missing evidence must remain a refusal; preserve the draft and use the stated context or operation recovery."
  ],
  "F012": [
    "Choose an available current local query and inspect its scope before adding a headline.",
    "Use Add KPI from current query, inspect the new Watchlist item and its captured query, then reopen Home to check the saved binding. A missing comparison must remain unavailable.",
    "Do not treat a blank comparison as zero. If the write fails, keep the query and retry the workspace save explicitly; removal and recreation are separate actions."
  ],
  "F013": [
    "Use the selected conversation, fictional role, exact asset and current cutoff; provider mode must permit a question.",
    "Enter one question and use the normal Run or current Send control. Inspect the answer and source qualification before a follow-up; earlier answers retain their captured scope and timestamp.",
    "Unknown operations require Check saved operation. A confirmed no-commit can permit a new explicit attempt; a held or committed operation is never automatically generated again."
  ],
  "F016": [
    "Inspect the current local assistant feedback selection. The existing control stores a global feedback.ask value, not a rating tied to a historical turn ID.",
    "Choose Useful or Unclear and inspect that saved local preference. This does not validate answer arithmetic, root cause, performed work or document release.",
    "No source-specific rating should be inferred. Failed persistence retains the preference draft; reopening must distinguish this global setting from historical captured answers."
  ],
  "F017": [
    "Use the exact selected local query with an available grouping and source window; the current page has Run and Drop empty/zeros, not a pattern-type selector.",
    "Run the local scan and inspect the available outlier/change/trend/association cards, source window and uncertainty, or the explicit empty state. Run saves a bounded synthetic scan capture with its exact query, source context, preferences, insights and uncertainty. Reopened captures are historical; empty results remain explicit and associations do not prove cause.",
    "No grouping, empty data or unavailable values cannot become a successful finding. Preserve the original query and preferences; a definitional association does not prove root cause or verified savings."
  ],
  "F020": [
    "Review the current selected measures, grouping and source cutoff before Go.",
    "Enter the intended query description and use Go to confirm its current title, selected tokens and result. Inspect the source caption and units; Clear explicitly resets the working query and tokens.",
    "A refused or empty query is not a numeric result. Keep the draft on failure. Reopen a saved answer to restore its original query; Go names the working copy rather than rewriting that saved object."
  ],
  "F021": [
    "Undo requires a prior working-query change, Redo an undone change, and Reset an exact saved answer.",
    "Use one history control at a time and inspect the selected columns, filters and title after each change. Reset to saved restores that answer snapshot; it does not create a new result.",
    "Unavailable history controls must remain disabled. Do not invent an undo step. Keep a working draft separate from the saved answer and inspect it again after refresh."
  ],
  "F024": [
    "Select the exact authored column whose definition you want to inspect.",
    "Open Column information using its normal control and read description, aggregation and synonyms for that column. Compare those units and semantics with the current selected result.",
    "A missing field has no inferred definition. Close the inspection without changing the query, then reopen the same column when returning; reading is not a governed definition edit."
  ],
  "F025": [
    "Open Add formula yourself and provide a unique local name, left measure, Divide/Subtract operator and right measure.",
    "Choose supported measures and inspect their units. Save formula selects the new captured local formula, replacing the previous custom-formula token while retaining built-in measures/grouping. Inspect the exact operands and result.",
    "An empty name or incompatible subtraction units are refused. Preserve the form draft or cancel. Missing operands/denominators are unavailable, not zero; a local formula is not a released canonical definition."
  ],
  "F026": [
    "Open Add set yourself and choose the intended attribute and explicit values.",
    "Name the set, save the supported value list, then inspect All sets or Your sets and apply only that set to the intended query. Check the resulting filter and source scope.",
    "An empty or invalid set needs correction. Cancel preserves the previous query. After storage failure retain the draft and reload only after explicit save recovery; no missing values are fabricated."
  ],
  "F027": [
    "Open Add parameter yourself. The current authored form supports a name and the fixed TP-S1 site filter; it is not a general parameter editor.",
    "Enter a non-empty Parameter name and use Apply TP-S1. Inspect the new local parameter and the exact site=TP-S1 filter; its previous site filters are retained for explicit removal/undo.",
    "An empty name stays in the form with validation. Cancel keeps the previous query. A failed write retains its draft; do not infer another column/value or treat focus as filter application."
  ],
  "F035": [
    "Select one eligible chart point or exact Grid slice before choosing a scope operation.",
    "Use Keep only or Exclude on that selected scope. Inspect the resulting dimensions and filters, then compare the qualified result with the previous working query.",
    "No selected point means no scope operation. Empty results remain empty. Undo restores the previous working query; never substitute another cohort or rank jobs without exposure."
  ],
  "F036": [
    "Select an eligible aggregate or exact Grid slice and review its source cutoff.",
    "Open Underlying with the normal control, inspect the constituent row grain and source identifiers, and compare them with the selected aggregate without changing the query.",
    "Missing exposure or unavailable rows remain qualified. Close the inspection to return to the same aggregate; opening rows is not a correction or a new captured answer."
  ],
  "F037": [
    "Use the current working query and its selected source; SQL inspection is separate from governed execution.",
    "Open SQL yourself and inspect the shown query, selected columns, filters, grouping and row rule. Compare it with the visible result and close the panel without changing inputs.",
    "The displayed SQL grants no warehouse connection or arbitrary execution. If it is unavailable, retain the query and read its validation; return to the captured result rather than changing a hidden source."
  ],
  "F038": [
    "Check the current working title, tokens, chart, scope, qualification and definition version before Save.",
    "Use Save once and inspect the exact saved answer entry. Reopen it to check title, measures, source and historical cutoff. Confirming Go names a working copy; saving is a separate operation.",
    "A failed write is not a saved answer. Keep the working draft and explicitly recover storage. Do not overwrite an immutable captured service result or silently rename an unrelated original."
  ],
  "F039": [
    "Select the exact available answer/result and the intended local Board and tab.",
    "Use Pin and confirm the target Board. Inspect the new tile title, captured query, source, units and cutoff on that Board, then reopen the Board after its save acknowledgement.",
    "A missing Board or unavailable result cannot be pinned elsewhere. Keep the current answer when the write fails; avoid a duplicate tile until the prior operation is reconciled."
  ],
  "F040": [
    "Select the exact local answer or Board and intended local view/edit permission.",
    "Open Share, inspect the selected object and permission, and use its normal local confirmation. Review the recorded local share entry; no external user access or invitation is granted.",
    "Cancel preserves the object. Invalid permission or failed persistence gives no saved share. Do not use this synthetic record as proof of real account authorization."
  ],
  "F041": [
    "Review the exact current result, source cutoff, units and any unavailable cells before export.",
    "Use CSV to prepare the current local result, or the ordinary print preview when separately permitted. Inspect the artifact contents against the displayed scope and qualification.",
    "An unavailable value must not become zero. Browser download or print delivery is a separate native outcome; cancel or preparation failure leaves the captured result intact and permits a new explicit export."
  ],
  "F042": [
    "Choose the exact local embed description and its captured query/context.",
    "Inspect the embed payload and use Copy exact embed payload only after confirming the intended object, source and capability limits. Review the copy acknowledgement without enabling an external runtime.",
    "Clipboard denial is not a successful copy. Keep the description and retry copying explicitly when permitted. No embed key, external hosting or real permission is created."
  ],
  "F043": [
    "Choose the current result and a supported dimension or comparison before Explore.",
    "Use Explore to select the intended filter, additional attribute, replacement or comparison. Inspect the working-query change and source qualification before saving the explored view.",
    "Unsupported or empty scope is withheld. Back/Undo restores the working query; it does not alter the original captured answer. Preserve the draft if an operation fails."
  ],
  "F045": [
    "Use an available current answer with an exact metric, scope and cutoff.",
    "Use Watch to create the local headline from that query, then inspect its Watchlist binding and comparison qualification. Reopen the item to verify the same captured query.",
    "No result means no implied KPI. Missing prior data remains unavailable. A local watch does not monitor a live plant or schedule notifications; failed persistence retains the working query."
  ],
  "F046": [
    "Use the exact selected local query with an available grouping and source window; the current page has Run and Drop empty/zeros, not a pattern-type selector.",
    "Run the local scan and inspect the available outlier/change/trend/association cards, source window and uncertainty, or the explicit empty state. Run saves a bounded synthetic scan capture with its exact query, source context, preferences, insights and uncertainty. Reopened captures are historical; empty results remain explicit and associations do not prove cause.",
    "No grouping, empty data or unavailable values cannot become a successful finding. Preserve the original query and preferences; a definitional association does not prove root cause or verified savings."
  ],
  "F048": [
    "Open the exact Board and inspect its existing tabs before adding one.",
    "Use Add tab, enter the intended name, and inspect the new tab on that Board. Choose its contents explicitly and reopen the Board to check the saved tab binding.",
    "An invalid name or failed save must preserve the old tabs. Switching tabs alone is not adding one; recover the workspace write before creating a duplicate."
  ],
  "F050": [
    "Open the exact Board and distinguish its shared saved filters from your personal layer.",
    "Enter a supported Board filter and use Save board filter. Inspect its scope and resulting tiles, then apply or reset the separate personal layer using its normal controls.",
    "Unsupported or unavailable scope must remain qualified. Reset personal filters must not remove shared filters; reload only after save acknowledgement and keep failed draft fields."
  ],
  "F052": [
    "Choose the exact Board/tile and inspect its current layout before editing.",
    "Use the normal tile Up control or native layout editor, inspect the resulting order/height, then Save view and finish editing. Reopen the same Board and inspect the stored layout with its source/query/unit semantics.",
    "A working layout is not saved until acknowledged. Cancel or restore preserves the original; sorting and chart options must not change metric meaning or hide unavailable values."
  ],
  "F053": [
    "Open the exact Board with its saved tiles and source qualification.",
    "Use Present and step through the intended tiles, checking each captured scope, cutoff and units. Leave presentation through its normal control to return to the same Board.",
    "An empty Board has no invented slide. Presentation does not refresh sources or create a verification receipt; missing comparisons stay unavailable and the retained draft stays intact."
  ],
  "F054": [
    "Open the exact Board and enter a local note or explicitly selected thread response.",
    "Use Save note, inspect the resulting note/thread and its local feedback type, then reopen the Board after save acknowledgement. Keep observation, question and hypothesis distinct.",
    "An empty or failed note save has no recorded comment. Preserve the entered text and recover storage explicitly; a comment is not performed-work proof or a controlled document release."
  ],
  "F056": [
    "Bind the schedule to the exact current Board/tab and local cadence/recipient description.",
    "Use Schedule current and inspect the newly saved local row and its captured target. Review the intended cadence and source binding before reopening the schedule.",
    "This is local schedule bookkeeping, not external delivery. Missing target or failed save stays unresolved; no messages are sent and a duplicate schedule is not a recovery method."
  ],
  "F057": [
    "Inspect the exact Board definition, tiles, query and source qualification before exporting.",
    "Use Export to prepare its local JSON definition. Inspect Board identity, scopes, source versions and layout values against the current Board before using the file elsewhere.",
    "Preparation does not prove native download delivery or remote compatibility. Cancel/failed export leaves the Board intact; do not strip units, unavailable cells or historical timestamps."
  ],
  "F058": [
    "Choose the exact saved answer; if none exists, create one through the normal supported query flow.",
    "Open that named answer and inspect its saved title, tokens, chart and captured source/cutoff. Make a working-copy edit explicitly, then use Reset to saved to compare with its stored snapshot.",
    "A missing answer is not recreated by opening another. Original service captures remain historical; failed working-copy saves keep the draft and do not silently replace another answer."
  ],
  "F059": [
    "Choose the intended local collection name and exact answer or Board membership.",
    "Use Create collection, inspect the new collection, then Add the open answer or selected Board explicitly. Reopen the collection to verify the saved member identifiers.",
    "An empty collection is valid. Missing objects cannot be substituted. On write failure retain the membership draft and recover storage before adding a duplicate."
  ],
  "F060": [
    "Choose the intended local monitor condition and exact metric/source scope.",
    "Create or open the monitor using its normal controls, inspect its stored condition and local notice/mute state, then reopen the monitor after save acknowledgement.",
    "No external alert delivery is implied. Missing data remains unavailable, mute is separate from condition resolution, and failed storage cannot produce a saved monitor."
  ],
  "F061": [
    "Choose a local schedule and inspect its exact target, cadence and recipient description.",
    "Use the ordinary schedule controls to create or revise a local row. Inspect the saved target binding and status; local execution evidence is separate from configuration.",
    "No external email or message is sent. An absent target or failed save stays unresolved; keep the draft and use explicit recovery rather than assuming delivery."
  ],
  "F063": [
    "Choose the exact authored data object in the static local Objects list.",
    "Open its name and inspect existing metadata and fields; use only the shown local inspection/export controls. There is no general field-type, aggregation or production-schema editor.",
    "Missing/removed objects are unavailable. Return to that exact named object after refresh; reading/export preparation is not a schema edit or remote connection."
  ],
  "F064": [
    "Open the intended object and inspect its static field metadata. The current Save synonyms control edits the authored OEE alias list only.",
    "Enter supported nonambiguous OEE aliases, use Save synonyms, and inspect the saved local alias revision and compiler behavior. This is not an arbitrary per-object or per-column alias editor.",
    "Reject duplicate/ambiguous aliases and preserve original definitions and draft. A local alias revision does not deploy a semantic model or grant warehouse access."
  ],
  "F067": [
    "Inspect the local alias definitions and their revision, source and supported context.",
    "Use Export alias definitions JSON to prepare an exact local packet. Review identifiers/units/aggregation/aliases before a separate explicit import and check the resulting local revision.",
    "Unsupported columns or ambiguous aliases are refused. The packet is not a full model or remote adapter; export preparation and native delivery remain separate outcomes."
  ],
  "F069": [
    "Inspect the plain local memory string list; it has Add and Remove, not provenance/versioned source editing.",
    "Enter a bounded nonduplicate local note and use Add, then inspect that exact saved string after acknowledgement. Use Remove only for the intended entry. These notes are unreviewed data, not model instructions or released evidence.",
    "Empty/duplicate/oversized/failed input must not count as addition. Preserve the draft and use explicit storage recovery; do not infer source version, provenance or controlled-knowledge release from a plain string."
  ],
  "F072": [
    "Inspect the currently configured local OEE synonyms and alias revision. Record sync has no package/version input.",
    "Use Record sync to reapply those current local aliases and record the resulting alias revision and dbtAt timestamp. Inspect the exact committed values after acknowledgement.",
    "Validation or storage failure has no sync receipt. This is local bookkeeping, not package import, dbt execution, warehouse deployment or released-definition conformance."
  ],
  "F073": [
    "Choose the exact local Board listed on Verification and inspect its query/source signature. This is a Board review page, not a performed-work verification queue.",
    "Use the normal capture-review control to inspect the saved reviewer/time and per-tile eligibility/result evidence. The separate local reviewed toggle does not create the capture. Review is explicitly not certified.",
    "Changed Board signatures make older reviews historical. Failed capture/flush gives no new review receipt; preserve the original Board and retry only the intended local review. No plant-safety or financial certification is granted."
  ],
  "F074": [
    "Choose the exact local embed-preview inputs and source capability limits.",
    "Use Copy preview payload or the normal local preview control, inspect its object/query/context fields, and compare the preview with the source description.",
    "Clipboard/preview failure keeps the inputs. No external runtime, token or permission is created; native delivery and Tom runtime conformance remain separate."
  ],
  "F075": [
    "Inspect the local request path, version, body and declared synthetic capability before execution.",
    "Use Run local request for the supported read-only/synthetic example, inspect response/error/status and source context, then compare with the displayed API contract.",
    "Unknown routes or invalid bodies are refused. No arbitrary host, credentials or production mutation is permitted; keep failed input and correct its exact field before an explicit retry."
  ],
  "F077": [
    "Custom actions are held for the explicit policy/authorization/security gate.",
    "Inspect the visible source description and blocked prerequisites only. Do not authorize, apply, purchase or dispatch a custom action through this Guide or model prose.",
    "Keep the held decision and source anchors. A local preview is not approval or execution; the pending authority must be resolved through its own approved process."
  ],
  "F078": [
    "Links/security/webhooks contain held authorization/security operations and possible external destinations.",
    "Inspect the visible local configuration and refusal messages without executing a held link, permission change or webhook operation. Identify the exact owner/contract required.",
    "Do not reroute a declined or held action through another host/tool. Preserve the current configuration and external gate; no connectivity, permission or dispatch is inferred."
  ],
  "F079": [
    "Choose the intended local synthetic user and its exact group/status before editing.",
    "Use the normal Users control for the intended local entry, inspect its saved status/group membership, and reopen Users after acknowledgement. This is not real identity administration.",
    "Invalid/duplicate inputs or failed persistence stay unresolved. No invitation is sent or real permission granted; keep the draft and recover local storage before a duplicate."
  ],
  "F082": [
    "Inspect local demo plan/usage labels and their explicit synthetic/accounting limitations.",
    "Open Pricing or Data usage to inspect the configured local tier and bounded retained counts. Use read-only inspection to identify what is measured and what is unconfigured.",
    "Do not purchase, claim a paid licence, infer tokens/costs from query counts or activate a key here. Current live pricing/budget/licence decisions require their separate authority."
  ],
  "F085": [
    "The human policy/authorization/security gate remains held and is not a normal plant-safety decision.",
    "Inspect the visible held state and exact missing authority; retain its source reference and candidate identity. No confirmation, approval or intervention is performed by the Guide.",
    "Do not substitute another workflow, host or tool for a declined gate. Preserve the current candidate and await its designated decision; reading/skip/focus cannot close it."
  ]
};
