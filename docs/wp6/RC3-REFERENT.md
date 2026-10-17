RC3 — REFERENT / INVESTIGATE-IT CORRECTION
NO NEW FEATURES · PRESERVE RC2 FUNCTIONALITY

RC2 is technically clean (2,943 PASS / 0 FAIL, clean extraction PASS, product files unchanged from RC1, build reproducible, laptop-specific test paths removed). However, RC2 fails one required human-meaningful conversational behavior.

DEFECT
Plant Review identifies: Northworks feeder-jam plan miss, 150 good units below approved plan, 2,154 actual vs 2,304 plan. "What should I focus on first?" also identifies the feeder-jam plan miss. The next user message "Investigate it." incorrectly opens Quality Loss. This is a release-blocking conversational/context defect.

REQUIRED BEHAVIOR
The pronoun/referent "it" must resolve to the most recent explicit recommended/current focus from the conversation. Plant Review → recommended focus = Northworks feeder-jam plan miss → "Investigate it." → open that exact feeder-jam investigation (plant gap 150 units; largest contributor Line 03, 138 units).
Do NOT: use a hard-coded feeder-jam special case; default "it" to Quality; choose the first available case; infer from dashboard order; silently switch metric/case. Use the existing authoritative conversation/context model.

REFERENT PRECEDENCE
For commands such as Investigate it / Show me / Why? / Open it / What caused it? / Who owns it? resolve against the most recent compatible conversational referent:
1. explicit current/recommended focus from the immediately preceding answer;
2. explicitly selected case/investigation;
3. active entity/metric referenced in the prior turn;
4. clarification if more than one valid referent remains.
Never guess across incompatible cases.

REGRESSION TESTS
1. Plant Review → Investigate it: feeder-jam plan-miss case.
2. What should I focus on first? → Investigate it: same recommended case.
3. Explicit Quality question → Investigate it: Quality case.
4. Explicit speed-loss question → Investigate it: speed case.
5. Ambiguous multi-case response → Investigate it: clarification, not silent selection.
6. Reload/history preservation of current referent where conversation semantics require it.
7. New conversation clears old referent.
8. Explicit new topic overrides prior referent.

PRESERVE (no regression): 150 plant shortfall / 138 Line 03 contribution; WP4 journeys; dashboards; evidence; verification/sustain; theme; mobile; backend adapter behavior; persistence/history; trust tests.

SECONDARY PRESENTATION CLEANUP
Where the normal plant-facing answer shows raw timestamps such as 2026-10-06T14:45:00Z, present them in normal UI as human-readable time, e.g. "Oct 6, 2026 · 2:45 PM". Keep the exact UTC/ISO value under Technical details/provenance. Do not change temporal semantics.

ZIP SIZE INVESTIGATION
RC2 ZIP grew from ~26 MB to ~57 MB. Before RC3 freeze, identify why. Check for accidental inclusion of test artifacts, screenshots, Playwright reports, node_modules, duplicate build outputs, downloaded artifacts, temporary files, historical RC packages. Do not remove required source/evidence blindly. Report exact size contributors and reduce packaging only where safe.

PROVIDER
Do NOT run the real provider yet. Pricing authority is expired. Refresh: currently available model(s); current pricing; authorized test budget. Only after RC3 technical acceptance should Patrick perform the bounded Admin Test connection.

RC3 ACCEPTANCE
Full suite 0 failures; clean extraction; "Investigate it." opens the exact recommended case; referent tests pass; no regression in WP4/WP5A/visual system; human-readable normal timestamps; ZIP contents understood and unnecessary packaging removed if present. Then freeze RC3 and move to human gates.

WIKI — ENGINEERING PAGE: "Build Method, Engineering Quality, and Known Risks"
Explain candidly:
- EKAS UI was developed through an AI-assisted iterative process using ChatGPT/Cursor/other coding agents;
- the product goal was chat-first governed manufacturing decision intelligence, not generic BI;
- the build used repeated browser acceptance, trust tests, journey tests, release candidates, independent review, and regression closure;
- AI-generated code has known historical risks: over-complexity, duplicated logic, incorrect workflows, stale assumptions, overfitting to tests, and weak maintainability;
- passing functional tests does not by itself prove production-quality architecture;
- before production adoption, the exact frontend should receive an experienced senior frontend/software-engineering review;
- any recommended refactoring must preserve all accepted features, workflows, calculations, evidence rules, security boundaries, and user behavior.
Protected engineering principles:
"Improve the implementation without losing the product."
"Refactoring is allowed; feature or governance regression is not."
The Wiki should preserve both (1) what we built and why, and (2) how an experienced engineering team can improve the internals safely without changing EKAS behavior.

PATH: RC3 narrow referent fix → full clean technical pass → provider check → unaided human rehearsal → senior engineering review → final independent approval → Wiki/handoff locked to that exact build.
