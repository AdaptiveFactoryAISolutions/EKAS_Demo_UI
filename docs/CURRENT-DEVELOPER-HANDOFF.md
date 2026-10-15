> Current authority: the approved 2026-10-15 goal authorizes bounded workspace consolidation and backend adapter verification. See [current goal plan](superpowers/plans/2026-10-15-unified-ekas-goal.md). Earlier statements that consolidation was not authorized are historical.

# EKAS — current developer handoff

## Artifact and evidence boundaries

The exact f2b source, static and server identities and file manifests are in `evidence/F2B-REVIEW-IDENTITY.json` and `evidence/recurrence-ownership-full-compiled/PINNED-MANIFEST.json`. The static roster has **81 members: index.html plus 80 other files**. An 80-assets count can exclude the entry HTML; state the counting basis rather than infer a missing file. Verify all 81 current members when a separate preview or package is eventually tested.

The editable candidate is `evidence/recurrence-ownership-candidate/app`; keep its supporting `docs/FEATURE-RETENTION.json` in the candidate's parent structure. That fixture is separately hashed in the review identity. Shared installed dependencies were used for local verification. Portable restoration must use the pinned manifests and must not require a private legacy repository or this machine's node_modules symlink.

| Artifact | Status |
| --- | --- |
| f2b isolated candidate | 2,910 source assertions / 492 files / 61 groups. Controlled resume: 54 exact passing group reports retained; all seven preflight-dependent groups rerun after an owned setup-path correction. Initial five setup failures remain preserved. All required selected group processes exit 0; prior 2,909 criteria and repeated-name counts preserved. |
| f2b compiled artifact | One clean serial 501-check, 20-group run; all processes exit 0. 82 tracked fixtures closed with zero pending handlers and no cross-test overlap. Typecheck and browser/server builds passed on the same source. |
| Independent f2b functional review | Bounded PASS: 14 fresh tests, including three reviewer-authored ownership/concurrency/durable-failure cases; 142 evidence checks. It audited the owner 501 run, did not independently rerun it, and did not provide native or whole-product approval. |
| 711b / 18352 | Current review preview, unchanged. Historical source 2,909/491 evidence exists. Its failed compiled attempts remain historical failures; f2b results do not retroactively make them clean. |
| cf296 / 18329 | Separate older live demonstration. Historical OpenAI activity and approved owner recovery belong to this identity. Its current private configuration has not been inspected. |

No candidate promotion, final ZIP, final package freeze, release approval or new security-review action is implied.

## Narrow product change

Only `src/investigation/service.ts` changed, plus the added `src/server/preparedOwnership.test.ts`. Preparation fingerprints the detached live snapshot before transferring it to its private staging repository, then transfers the discarded staging repository's final state. Commit still clones before mutation and retains full fingerprints, validation, history, idempotency and durable writes.

Measured seven-case clone time decreased about 25%; per-recurrence state sizes and write-byte totals were unchanged. The comparison retained 430 fsync calls. This removes demonstrated avoidable copying; it does not uniquely attribute historical deadline/socket failures or solve all long-history scaling. Do not weaken durability or discard historical receipts to improve timing.

Full source evidence: `evidence/f2b-full-source-relocated/SOURCE-COMPLETION.json`, `RESUME-PROVENANCE.json`, and `evidence/F2B-FULL-SOURCE-COVERAGE.json`. Compiled evidence: `evidence/recurrence-ownership-full-compiled/FULL-COMPLETION.json`. Initial failed runs remain alongside these records.

## OpenAI and Tom

Use [the local API handoff](../integration/LOCAL-DEMO-API-HANDOFF.md), [OpenAI requirement](../integration/OPENAI-AND-TOM-REQUIREMENT.md) and [Tom conformance handoff](../integration/TOM-CONFORMANCE-HANDOFF.md). OpenAI is the required server-side provider; no Ollama model or fallback is introduced.

The local canonical envelope, domain ports and Responses adapter are implemented. They are proposed integration boundaries, not proof of compatibility with Tom's unseen service. Production work requires the confirmed versioned specification/base URL, authenticated principal/tenant/asset scope, schema and error mapping, atomic version checks, durable idempotency/receipt recovery, paging/completeness and stream cancellation/reconciliation. The engineer owns mapping and authenticated end-to-end conformance. Existing simulated records and policy distinctions must survive that mapping.

Keys, owner codes, session tokens and budget journals are not source or export material. No key, paid call, provider configuration, live process or browser-policy change is needed for this documentation reconciliation.

## Next work

See [remaining closure work](REMAINING-CLOSURE-WORK.md) for the confirmed expired-owner UX defect, unresolved competing-workspaces concern, native checklist and user decisions. A further product fix would require a new isolated candidate and corresponding verification; do not silently edit f2b or replace Patrick's 711b review preview. Parent-coordinated native review and final package extraction/served-member checks remain unperformed for f2b. The existing register remains authoritative for every unclosed criterion.

## Isolated sign-in UX successor

The bounded sign-in/recovery fix is implemented in isolated d68f, with 63 related checks, three real loopback HTTP checks, typecheck and builds passing. It is not on the served 711b/CF previews. It preserves private one-use/two-hour policy and the existing reusable public rehearsal code; no issuance, renewal, restart or paid call is added. Native and independent acceptance remain pending. See [OWNER-SIGNIN-UX-HANDOFF.md](OWNER-SIGNIN-UX-HANDOFF.md) for exact identity and scope. The broader competing-workspaces concern is unchanged.
