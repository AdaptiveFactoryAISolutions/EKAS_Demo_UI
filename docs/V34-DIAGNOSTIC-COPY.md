# V34 missing-formula copy candidate

Separate undeployed UI-only candidate based on frozen V33. It does not include/deploy the R5 server or reopen the declined independent policy review. Frozen R5 and served V33 remain unchanged.

When an explicit saved query has formulaSnapshot:null, Search, headline and native Grid presentation explain that its saved custom formula definition and units are missing, the result is withheld, and the user should choose a formula and run again. Grid display heading becomes Custom formula unavailable (units unknown); exact fx identifiers remain in series/query/evidence. Defined measures retain their names, units and values. Source/eligibility diagnostic strings and every platform calculation module are unchanged. No numeric fallback, definition substitution, new metadata, zero or neighboring context is introduced.

This is presentation-only. Source fixtures, captured query/snapshot data, provenance IDs, diagnostic reasons and frozen formula guards remain unchanged. Existing missing-query/global-substitution regression checks and the new Grid presentation check verify null output and original evidence preservation. Full-suite local tests and build precede freeze. The independent V33 batch4 report is the motivation; this candidate has no native browser acceptance.

Catalog empty feedback and recovered source-unit metadata are already in separate R4/R5 source candidates but are not brought into this copy-only V33 branch. Do not claim this package resolves those V33 deployment gaps. Native print and remaining ordinary acceptance criteria are separate. No browser/storage/route/backend/key action occurred.
