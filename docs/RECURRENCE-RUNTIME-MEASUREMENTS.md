# Recurrence runtime investigation — isolated candidate, full validation passed

Original preview711b7027/18352 and live18329 are unchanged. No paid calls or provider architecture change. Original full failures remain preserved:498/3 initially, then499/2 after harness lifecycle/native-loader corrections. Neither focused passes nor CPU characterization substitutes for broad acceptance.

## Confirmed costs and correction

Per-handler monotonic wall time, processCPU, heap, clone/JSON counters, durable write bytes, fsync time, state size and operation times were measured without recording request bodies or credentials. Baseline source711b was tested as isolated speed, isolated quality, then the unchanged seven-case diagnostic sequence. All focused cases passed, so the earlier broad timing failures were not reproduced in that measured sequential context.

Baseline seven-case recurrence durations: downtime14.126s, speed12.442s, quality13.523s. Speed retained19,941,120bytes and wrote327,364,757bytes across its flow; quality retained20,135,740bytes and wrote330,363,341bytes. Preparation cost increased with accumulated historical/idempotent results: first speed preparation19ms versus final624ms. No cross-fixture state reuse was found. Each fixture has its own fresh file path; full-suite groups are separate worker processes.

Two redundant full-state copies were identified in prepareConversationTurn. The live repository is first detached under its exclusive lock. That detached snapshot can transfer to the private staging repository after computing the base fingerprint. The staging repository is discarded when preparation returns, so its state can transfer into the prepared result. commitPreparedConversationTurn still clones prepared state before modifying it. Live-state isolation, full-state fingerprint conflict checks, result isolation, validation, historical/idempotent payloads and durable writes remain intact.

Candidate only changes src/investigation/service.ts and adds src/server/preparedOwnership.test.ts. Eleven focused safety assertions pass, including detached staging/persisted history, concurrent conversation creation refusal, exact restart/retry, unsupported claim refusal, provider boundary and durable storage. Initial candidate typecheck failed only because its copy lacked the required FEATURE-RETENTION.json documentation fixture; after copying that unchanged fixture, typecheck exits0. Clean server and browser builds exit0.

Measured candidate seven-case durations: downtime12.209s, speed11.148s, quality11.945s. Clone time dropped from20.916s to15.696s across the group;174fewer clone calls. Speed clone time5.769s→4.280s;quality5.785s→4.345s. Each recurrence final state size and durable write-byte total is identical between baseline/candidate. Both groups perform239write calls and430fsync calls. No fsync, validation, assertions, policy or deadlines were removed. These are serial comparisons, not randomized benchmarks; timing variation remains possible.

## Lifecycle and load

The lifecycle helper calls a request listener once, tracks its returned promise, and closes idempotently. Each created fixture has one closing/closed event,0pendinghandlers and no cross-test overlap. Cleanup does not commit repository state. Instrumentation does not indicate duplicate lifecycle commits.

Aggregate host CPU/memory/I/O pressure is sampled in the candidate and complete run without enumerating unrelated processes. Earlier broad failures lack equivalent contemporaneous samples, so their precise external-load contribution cannot be reconstructed. A prior CPU profile identified fsync, garbage collection, cloning, serialization and validation but is diagnostic only. This correction removes demonstrated avoidable cost; it does not prove a unique cause for every prior timeout/socket reset.

## Full run configuration and terminal result

Clean candidate source f2b1292c975203593e64b9320d86edaba566710b739da45059b1f7a556b91978; clean server file710763924f253801eb2025e3fbc05e8e8b5a2b57129ebc840e57adb30cb1aced. Full20group/501assertion suite runs serially in evidence/recurrence-ownership-full-compiled with original acceptance tests/baseconfigs/deadlines. Only diagnostic execution enables primitive timing counters and per-handler measurements; it executes the clean server artifact, with no extra export instrumentation. No retry union is used. Full terminal result:501passed/0failed/all20processes0, all501identities exact;82fixtureclosures0pending/0overlap. No release/native acceptance or preview swap.

Broad-position diagnostic group completed7/7/process0: downtime12.183s,speed10.776s,quality12.152s. Speed clone4.158s/fsync0.416s/write327,364,757bytes;qualityclone4.339s/fsync0.576s/write330,363,341bytes. These match focused corrected costs and preserve baseline durable write bytes. At that interim checkpoint the remaining groups were still active; the terminal section below records the subsequent501/501pass.

## Terminal verification

2026-10-15 17:53:13UTC: complete clean candidate run501/501/process0,20/20group processes0; no retry union. Source, clean server, static bundle, harness and original711bsource bytes verified unchanged after the run. RunnerSHA256ba3480b314dc6dffc673eb8f6b0c87dcba5161f6f9b3d92cbdba309ca12bbeb0. Clean server fileSHA256710763924f253801eb2025e3fbc05e8e8b5a2b57129ebc840e57adb30cb1aced. Native review and candidate promotion remain parent-owned.

Independent ordinary functional review: boundedPASS, fresh14/14tests including3reviewer-authored ownership/concurrency/durable-failure cases;142/142evidence checks. It independently reconciles the owner501run and exact two-file delta; it did not rerun501 or perform native acceptance. Source verification subsequently completed; see final verification below. Report: /home/pat/Documents/Codex/2026-10-11/task-3/review-f2b1292c/REPORT.md.

## Final source verification — 2026-10-15 18:43 UTC

Exact f2b source verification is terminal: **2,910 passed, zero failed, 492 test files, 61 required groups with process-0 evidence**. All 2,909 prior criteria and repeated reporter-name counts are preserved, plus the new ownership regression. No required test files or criteria are missing.

This is a controlled resume, not one clean fresh source attempt. We retained 54 unchanged passing reports with exact source/config/report/exit provenance and reran all seven preflight-dependent groups in full after correcting their setupFiles path to the owned, byte-identical preflight module. Those seven groups passed 262/262. The initial attempt remains preserved: 2,824 passed assertions, zero failed assertions, five setup-failed groups and 86 missing criteria. Candidate code, preflight content, assertions and deadlines did not change.

Compiled verification remains a separate clean 501/501 run with all 20 processes exiting 0. Independent ordinary functional review remains a bounded PASS: 14/14 fresh tests and 142/142 evidence checks. Browser/native acceptance and parent-coordinated promotion remain pending. Source, static, server and harness bytes, and original 711b source, were reverified unchanged after testing. All validation processes ended. Preview 18352 and live 18329 were not accessed or changed. No paid calls, browser actions, final ZIP or release-ready claim.

Terminal evidence: evidence/f2b-full-source-relocated/SOURCE-COMPLETION.json. Consolidated coverage: evidence/F2B-FULL-SOURCE-COVERAGE.json. Exact build identity: evidence/F2B-REVIEW-IDENTITY.json.
