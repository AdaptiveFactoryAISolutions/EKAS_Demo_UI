# V42 isolated QA plan and test scope

Candidate from frozenV41; no deployment until parent safe-boundary authorization. New owned root /ekas-qa-v42/ with dedicated QA prefix and IndexedDB database. Bare entry loads the existing training shell plus a clearly labeled QA definition fixture; Main/review/default routes retain their namespaces and behavior. No copied existing browser state or Dot files.

Definition fixture QA-RATE:600goodunits,60runminutes,90plannedminutes. Version1 denominator runminutes =>600units/hour. Explicit stageversion2 denominator plannedminutes =>400units/hour only after Refresh and capture. Previous capture keeps definitionversion, operands, sourceIDs, unit, result and recorded timestamp. Stage/change does not rewrite a capture or present it as current. Missing denominator =>Unavailable; no substitute, zero or production approval.

Recovery checks ownQA DocumentStore and real workspace save/rehydration/backup validator/restore only. Exercise saved draft/captures, export metadata, reload, normal restore, malformed snapshot rejection and foreign namespace refusal without reset/deletion. Tests use fakeIndexedDB and synthetic storage; not original-route/native browser acceptance. Ordinary recovery UI remains available in the same shell. No destructive fixture corruptor or automatic restore/reset in startup.

Targeted module tests: route namespace isolation, formula/units/versions, missing operands, immutable capture. UI tests: explicitstage/refresh, pending qualification, durable save/reload. Recovery contract tests: roundtripincludingcapture, invalid/foreignrefusal and previousbytesretained. Fullsuite/build/freshextractiononce after targetedpass; source/build/archivehash before any coordinateddeployment.

No existing calculationengine, registry definition, metric arithmetic, semanticapproval, policy/securitybranch, budgetjournal, modelserver, externalcall, protectedclock or originalpaused/default state change. This synthetic rate transition is an equivalent workflow test, not acceptance of protected A03/A32/A28 original-state routes.
