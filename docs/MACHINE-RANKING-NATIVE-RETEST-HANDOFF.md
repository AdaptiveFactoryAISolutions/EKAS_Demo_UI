# Priority machine ranking — isolated native retest

Ready URL: http://127.0.0.1:18348/?demonstration=ekas-machine-ranking-20261015

Exact identity:
{
  "sourceSha256": "b9510b363650da109ef4cc03bf1f9f9e902eb57e242290525fd06472d6a91f16",
  "staticSha256": "5464d85eef1f869da675a55ed68f3691caa8eed570e97632a9ba31cf9aef1844",
  "serverSha256": "fd21c1adc21a1394380d07b6d7f1624073dee2fc00da34c775721b16514447c1"
}

Plain root cause: the finite training parser recognized OEE but did not resolve “rank the machines” to Asset grouping. It inherited All/Site/Line from prior context. The query had no explicit numeric order directive. The chart rendered those wrong-grain canonical rows.

Correction: machine/machines resolves to exact Asset grouping and replaces inherited grouping while preserving applicable filters/provider/cutoff. Validated orderBy drives canonical post-aggregation numeric sorting, cache/capture metadata, layout identity and presentation data. Governed per-asset OEE remains ratio of summed ideal-good minutes to summed planned minutes. Ascending/descending, stable exact ties, missing/unobserved exposure and honest unsupported clarification are covered. No frontend-only manual sort. Old captures are not reinterpreted or rewritten.

Independent normal-UI retest:
1. Use the corrected isolated preview. In normal Chat Home submit exactly once: please rank the machines by decending OEE. No manual grouping/sorting/editing. With unfiltered training context expect four observed assets in order TP-A5,TP-A1,TP-A3,TP-A7; no All or Site grouping. Current training seed has eight inventory assets but observed jobs for only four. Absent-exposure assets remain unranked, never given invented OEE.
2. Raw percent values are approximately79.1666666667,79.0625,79.0625,78.90625. A1/A3 are equal and retain stable ID order; do not assert different ranks for a tie. Display follows selected decimal precision. Chart categories/values and Grid rows must match this canonical order. Read fixture/cutoff/source anchors from normal disclosures.
3. Follow with sort ascending. Expect TP-A7,TP-A1,TP-A3,TP-A5, same governed values and selected filters/cutoff. Verify the earlier descending capture keeps its original order/time/sources.
4. Test correct spelling please rank the machines by descending OEE, and inherited Site context (for example a preceding Good units by site query) through normal conversation controls. Explicit machines must replace Site grouping. Check normal New conversation too.
5. Scoped TP-S1 contains observed TP-A1/TP-A3 only, tied79.0625. Preserve exact selected filter; do not widen to the other site. Source observations are July, despite theSep29cutoff; use exact available YYYY-MM when testing period intent. Unsupported period/scope/metric clarifies without an unrelated aggregate. Missing energy-intensity data remains Unavailable/unranked, notzero.
6. Reload and inspect history/earlier captures; desktop/320px/keyboard paths. Preserve old18346 conversation7/v2 All and Site repro captures unchanged. This new preview does not retrocorrect those records. No paid or live-provider action is authorized by this handoff.

Evidence:70assertions/10testfiles serial clean process0; typecheck/browser/localserver builds0; exact compiled normal fictitious Responses/API proof (typo/corrected/ascending/scopedties/history/restart/idempotent replay), zero external/paidcalls;80servednon-indexassetsbyteexact. These prove deterministic/mock behavior, not actual live OpenAI interpretation or independent native acceptance.

Remaining batch: F016 Guide historical feedback receipt, F053 headline fixture/cutoff, F054 new-comment simulated attribution/legacyunknown are still open and not fixed in this ranking-only snapshot. Owner continues them in the editable app while this preview remains immutable. No full-suite restart before actual findings batch complete. Earlier4b63 fullrun terminal: source2875/482 passed; compiled17groups124pass3fail(longsessions),3groups/hostedproofs unrun; originals retained. Freeze hold remains true; no final ZIP/release claim.
