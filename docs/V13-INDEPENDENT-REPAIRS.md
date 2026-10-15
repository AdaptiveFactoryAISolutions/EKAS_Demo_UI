# V13 continuing review repairs

Candidate only. Served V12, reviewer Chrome and user storage remain unchanged.

Presentation: moved the slide into the shared bounded accessible Dialog, with a wide panel and a dedicated footer outside the scrollable content. Back/Next/Close remain 44px controls; Escape and focus return use the existing Dialog behavior. Long chart content no longer pushes controls below the viewport. Pointer actions pass the DOM regression; actual desktop/mobile visible geometry remains for independent acceptance. Presenting a custom-formula tile uses its selected definition just as the working view does.

Synonyms: the editor reads saved OEE aliases from persisted workspace state at mount and updates when that metadata changes. A literal default previously hid saved values despite a preserved revision. This changes the editor, not immutable metric formulas.

Scenario: unmatched observer clocks get an explicit Current simulated clock option with their exact timestamp. Preset snapshots and explicit rehearsal keep their own selection semantics. The selector no longer calls an arbitrary Nov3 clock Initial review or silently loads a snapshot.

Manufacturing comment: corrected new seed wording to feeder-jam evidence and uncertain cause. Only the exact original c1/board-revision seed comment gets a presentation correction for existing sessions, with its original finance text retained under Historical seed correction; stored comments are unchanged. User-authored comments and historical audit/screenshot evidence are preserved.

Financial verification assessment: src/model.ts caseMath sets financialValidated=false; CycleEvidence has financialValidation=Unavailable; src/conversationModel.ts explains missing finance-approved costs, demand/sell-through, avoided spend, constraint/displacement checks, intervention costs and counterfactual. The six-stage UI ledger also states unavailable. This is an intended evidence refusal in the self-contained synthetic demo, not a broken financial-certification button. The fixture does not supply a valid finance-approved realized-savings record. A production finance-evidence intake/review/authorization workflow remains future engineer-owned integration, outside this repair; no certification or savings is fabricated. Operational acceptance is separate.

Five tests were observed failing before fixes, then pass: footer outside long-slide content and pointer transitions; saved alias editor and external metadata updates; corrected historical seed without storage mutation; unmatched clock and exact preset/rehearsal semantics. Test-only literal typing was fixed before final build. Existing navigation/layout, dark palette, V11 wording/icons, V10 recovery and V12 math/capture fixes remain. Native editing-toolbar visual debt remains separately tracked.
