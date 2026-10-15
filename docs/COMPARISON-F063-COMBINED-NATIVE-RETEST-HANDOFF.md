# Combined comparison provenance and F063 pagination — native retest

**New isolated mock:** http://127.0.0.1:18344/?demonstration=ekas-review-batch-20261015 . Separate DUMMYrehearsal/profile/journal,enabledmock,realtransportrefused. Public fixture ownercode onlyifneeded:DUMMY_REHEARSAL_OWNER_CODE;neverenterrealkey. Existinglive18329 andmock18339/18340/18342 remainunchanged. No newpaidcalls/restartauthorizedbythishandoff.

- staticSha256: `6694f96ea4d8e1efe8d820ee0e1da79859b829fcb32943c69e6fef5159c30289`
- serverSha256: `070ebff90bfa438ff054cc77365cb8c1090da4b3c1da83a57f8e87edf42a5694`
- sourceSha256: `7e26e7074e14e739f71079f81a6cb19b8ef5d08cf2df5d4d471c12d976c00ae7`

## 1. Monthly comparison exact sources

Fresh mock conversation: **What was OEE in March?** then **Compare it with last month.** ExpectedMarch83.33%,February79.17%,signedprimaryminuscomparison+4.17percentagepointsfromunroundedvalues. Marchremainsprimary/Machine1.

Open ordinary **Evidence and investigation** andexpandexact-sourcepanel. Both **MONTH-March-1 / conversation-months-v1#/rows/March/1** and **MONTH-February-1 / conversation-months-v1#/rows/February/1** mustbevisible. New distinct **monthlyComparison** containsbothmachine/period/value/unit/knownAt/sourceIDs andoperands:primarygood800,total832;comparisongood760,total790;planned480min/each. Bothknown2026-04-01. Comparison/differenceclaims citeapplicableactualsources. No source mapping invented or accessgate bypassed.

**separateComparison** maystillbenull:thatfieldis the separate controlled operational experiment,not the monthly pair. The newmonthlyComparisonfield explicitly identifies thispair. Reload/historyretainscapture. AskFPY:unavailablewithoutfirstpassdispositions,noQuality/OEEsubstitution. UnsupportedcomparisonmonthsremainunavailablewithoutinventedIDs. OldCF/oldpolicy0–6capturesarenotrewritten;theiroriginalsourceomissionremains historical.

Rootcause:presentercomputedcomparisonbutleftsourceIDsinitializedtotheprimaryrow;semanticmonthlyclaimsalsousedonlyprimary. Exactpanelrenderedthatincompletecaptureaccurately. Policy7addsderivedcanonicalpairprovenanceandclaims;thepanelnowrendersit. Source/readpermissionchecksremainunchanged.

## 2. F063 Objects page/filter

Normalretained **Objects**,All,emptySearch. Click **Next** tosee dim_site/dim_date. Enter **Manufacturing**:matchingModel/Worksheetrowsmustappearimmediately,withoutanotherNext. ClearSearch:firstpageModel/Worksheet/fact_jobs. Reenterpage2;choose **Yours**:bothownedmanufacturingrowsappear. **All** returnsfirstpage. Checka no-matchSearch/Next/clearrecovery;emptyresultmustnotstrandthecursororhide latermatches. Exercise normalobjectmetadata/readbackandtheexactkeyboard/narrow/reloadchecksstillrequiredforthisID;recordlimitsratherthanassumingcompletion.

Rootcause:unfilteredpageindex1survivedfiltering;rows.slice(3,6)over2matchingrowsreturnedempty. FixresetscursoronSearch/Yourschangeandclampsslice/Nexttofilteredbounds. Objectrecords,metadata,alias/sync/Studio/APIbehaviorareunchanged. WithdrawnStudio/API/accessible-nameobservationsarenotdefectsandwerenotfixed.

## Evidence / source disposition

Stablecombinedsource:typecheck0,80relatedtests/11files0fail,browser/localserverbuild0. Actualmountednormaldialogandfiltercontrolsregressionspass. CompilednormalDUMMYproofverifiesbothperiodIDsinthevalidatedproviderreceipt,oldpolicy6comparisoncaptureunchangedacrossrestart,replaywithnonewsynthetichold,andFPYrefusal;0externalcalls.80HTTPstaticassetsbyte-exacttonewcandidate.

Earlier5161d735fullrunintentionallyinterruptedforactualnewcomparisonfixafter789completedpasses/0failures;33d866runpreviouslyinterrupted277/0. Allreportsretained;neitherisfullcoverage,nooldpassescreditedto7e26e707. CF2859/501successfulunionsremainhistoricalCF-only. Newfullsuitehasnotstartedwhilecurrentnativefindingsarebeingbatched;expectednewinventory2873assertions/480filesmustbeobserved/reconciledlater. No finalfreeze/ZIP/releaseapproval.

Live7reconciliation:../evidence/LIVE-CF296231-NEXT-SEVEN-RECONCILIATION.json confirmsall9savedOpenAIcommits/conversation11v10andunchangedJan/Marchhashes. Safe10:38snapshot:5.810904USDheld,12.189096USDguardremaining,nothalted,0inflight/0unresolved,1reviewedunknownholdretained;noinvoicespendclaim/ownermodelcalls.

Guideconsolidation:0fullycomplete/68partial/9prerequisite-only/7blocked/1historicalF063failbeforethisfix. NewsourcecorrectiononlyVERIFYpendingnativeretest,notworkflowDONE. See GUIDE-LOCAL-ACCEPTANCE-SCOPE.md forlocalversusproductionboundaries. Permittedfile/actionholdsremainbinding;realTom/warehouse/SSOare notnewlocalcompletiongates.

Evidence:../evidence/REVIEW-BATCH-VALIDATION-COMPLETION.json,rc-review-batch-final-green.json,REVIEW-BATCH-COMPILED-HTTP-PROOF.json,REVIEW-BATCH-PREVIEW-READINESS.json,MONTHLY-COMPARISON-ROOT-CAUSE.json,native-guide-F063-before-fix/REPORT.md,GUIDE-HELP-FULL-INTERRUPTED-FOR-COMPARISON.json. Parentcoordinatesindependentnativeacceptance.
