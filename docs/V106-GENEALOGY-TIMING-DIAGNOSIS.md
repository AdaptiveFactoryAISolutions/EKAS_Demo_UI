# Retained genealogy timing diagnosis

Exact case: v103GenealogyRoot.test.tsx public Explore genealogy requires exact source/root review, records owned bounded scope and preserves physical/verification state. Test body and 15000ms timeout remain byte-exact against frozen V105. No timeout inflation or assertion change.

| Execution | Duration ms | Outcome | Credit |
|---|---:|---|---|
| V105 owner full V103 group |10795.977|pass|preserved predecessor evidence|
| V105 independent retained group |16460.415|timeout|preserved original failure|
| V105 independent unchanged isolated repeat |10184|pass|same case, no additional distinct credit|
| V106 exact independent retained group copy (56 cases) |11066.736|pass|fresh group repeat, not isolated closure|
| V106 full V103 group (25 cases) |9998.923|pass|fresh candidate group evidence|

Current group repeats do not reproduce the timeout. They establish bounded reproducibility under the observed runs, not a diagnosed infrastructure or product cause. External load/CPU scheduling/GC sensitivity were not measured in the original failure, so causal attribution to resource contention is unsupported. The source change to attention connector mapping applies when that Board is mounted; the retained genealogy test does not open that panel. Opt-in Guide trace is disabled by default. These observations do not prove the edits caused the timing change.

The initial successor timing setup used a symlinked app root; Vitest failed module resolution before the genealogy callback ran. It is retained/uncredited. A complete copied public app root then completed56/56 with exact unchanged independent config/test bodies and source hashes matching current920files. Original V105 reports/logs remain separately preserved by hashes; wrong V72 review has no V105 credit.

Acceptance limit: original V105 PARTIAL and its timeout remain historical truth. Fresh independent successor timing/native review remains required. No automatic broad acceptance follows from these group passes.
