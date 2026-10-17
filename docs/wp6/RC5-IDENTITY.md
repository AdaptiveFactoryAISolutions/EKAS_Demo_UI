# EKAS DEMO RC5 identity

Status: **PENDING INDEPENDENT REVIEW**. RC5 is frozen. RC4 and RC3 stay byte-unchanged. RC4 is superseded by the two qualification defects in `RC4-SUPERSEDED.md`. This file, the ZIP, the member list, and the correction diff were added after the archive, so branch HEAD moves past the RC5 SHA. The ZIP bytes are the tree of `f513cd6` with the nested RC1, RC2, RC3, and RC4 zip binaries excluded.

RC5 FROZEN — READY FOR ADMIN PROVIDER TEST

Demo Complete is not claimed. Adapter Verified remains **NO**. Live Integration Verified remains **NO**. No API key was entered. No real provider call was made.

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC5 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `f513cd6e068c758d0443aeec8c3410f88a848d4b` |
| Git tree | `64438f893ec4d3d7bebb878bf839ad1e0a4274ea` |
| ZIP path | `docs/wp6/EKAS-DEMO-RC5.zip` |
| ZIP size | 36,962,811 bytes |
| ZIP SHA256 | `42d9cd0b1de878e68886e457dbe4f4fe4258711fdb7c043d9a9d00d96b023222` |
| ZIP comment | `f513cd6e068c758d0443aeec8c3410f88a848d4b` |
| ZIP members | 2,029 entries (1,969 files, 60 directories), 0 symlinks, 0 nested zips, no `evidence/` member |
| Member hashes | `docs/wp6/RC5-MEMBERS.sha256` |
| Correction diff | `docs/wp6/RC5-CORRECTION.diff` |
| Archive exclusions | `docs/wp6/EKAS-DEMO-RC1.zip`, `docs/wp6/EKAS-DEMO-RC2.zip`, `docs/wp6/EKAS-DEMO-RC3.zip`, `docs/wp6/EKAS-DEMO-RC4.zip` |
| Prior RC4 source | `38f73c3679eb173e6847a7569128793d97e42b5d` |
| Prior RC4 tree | `6ad243c949b6dd3ad23f5c644e6e40b125b2aa9c` |
| Prior RC4 ZIP SHA256 | `731974e63702a5f52f0943b0bc2a618e44e9f62afd679be3c5caf214945a94c4` (36,597,396 bytes) |
| Prior RC3 source | `45568c575a00a8810b661929624995ec24e6de1e` |
| Prior RC3 tree | `b32f8287ce6bcf18e494de27d4882ba4d01b91b2` |
| Prior RC3 ZIP SHA256 | `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` |
| App lockfile SHA256 | `e23f4b4ae4be95aa1df8e2f53c6f7d23039c920a93fa8de9f404e4fdb4bc0881` (`app/package-lock.json`, unchanged from RC4) |

## Authorized corrections

The product and harness diff versus RC4 source `38f73c3` is three files, 15 insertions and 9 deletions. The patch is `RC5-CORRECTION.diff`.

1. `app/src/investigation/CanonicalWorkspace.tsx` skips React setState from an in-flight send, acceptance, case advance, selection refresh, saved-operation reconcile, or Admin status refresh after the page unmounts or `window` is gone. The store still clears the draft. Mounted replies and manufacturing results stay the same. `Snapshot: Oct 6, 2026 · 2:45 PM · Synthetic` is unchanged.
2. `app/latestReplyModulePreflight.mjs` creates the gitignored `../evidence` directory when the Vitest setup loads. No empty `evidence/` directory is packaged.
3. `README.md` records both corrections and removes the manual `mkdir` precondition.

`git diff 38f73c3 f513cd6` also contains the already frozen RC4 evidence commit `c48001f`. Those files are not part of the correction: `docs/wp6/EKAS-DEMO-RC4.zip`, `docs/wp6/RC4-IDENTITY.md`, `docs/wp6/RC4-MEMBERS.sha256`, `docs/wp6/RC4-FRAMES.sha256`, `docs/wp6/screenshots/rc4-light-chat.png`, `docs/wp6/screenshots/rc4-dark-chat.png`, `docs/wp6/screenshots/rc4-new-conversation.png`, `docs/wp6/screenshots/rc4-390-chat.png`, `docs/wp6/screenshots/rc4-320-chat.png`.

## Complete RC4 product file list versus RC3

The earlier RC4 summary omitted `turnSemantics.ts` and `unified.ts`. Every RC4 product, test, lockfile, operator-doc, and e2e file versus RC3 source `45568c5` is:

`README.md`, `app/package.json`, `app/package-lock.json`, `app/src/admin/AdminAiPage.tsx`, `app/src/investigation/CanonicalWorkspace.tsx`, `app/src/investigation/Replies.tsx`, `app/src/investigation/conversation.ts`, `app/src/investigation/plantPresentation.ts`, `app/src/investigation/rcNewConversationReset.test.tsx`, `app/src/investigation/rcReferent.test.ts`, `app/src/investigation/service.ts`, `app/src/investigation/turnSemantics.ts`, `app/src/investigation/unified.ts`, `app/src/retained/v17Sidebar.test.ts`, `app/src/server/localAiRuntime.ts`, `app/src/server/localDemoBudget.ts`, `app/src/server/providerTestBudget.ts`, `app/src/server/rc4ProviderTestBudget.test.ts`, `app/src/server/v95SameDraftRecovery.test.tsx`, `app/src/visual/presentation.css`, `docs/wp6/OPERATOR-RUNBOOK.md`, `docs/wp6/PHASE-2-PROVIDER-PREP.md`, `e2e/dashboard-wp5.spec.ts`, `e2e/shell-walkthrough.spec.ts`.

## Built static files

`npm ci` then `npm run build` on two fresh extracts of `f513cd6`. Both builds exited 0. The dist trees are byte-identical. 81 files. Manifest `c6ee9105f5e7bbd47bd0e7a3e38b0ddf16ee179c17b62bb309b92ff78ec935f0`. `index-I9r_3K0-.css`, `mockRepository-yQ6uoDDv.js`, and `workspace-bR6w9YYf.css` match RC4. The index script, service script, workspace script, and `index.html` moved because the lifecycle guard is in the client bundle.

| File | Bytes | SHA256 |
| --- | --- | --- |
| `dist/index.html` | 501 | `e1d616038bae0d48e55fe3b73d6ef3f0b17281d757a1965c5a7abb47b35727df` |
| `dist/assets/index-WTf_3r_j.js` | 27,587,645 | `066996035d691accca2787f6e3282598b912160e08d4f747419e89061c211a81` |
| `dist/assets/index-I9r_3K0-.css` | 178,154 | `d2ec9a8061b7230d5b0ea8365a8696964badba33cc4bd831bb94eed37c20be2a` |
| `dist/assets/service-CaQgF1R6.js` | 2,027,088 | `aded0bdedc0eb89e838776bfbbd317a95cf5921aa7891878ae079ad9ffa83fa2` |
| `dist/assets/workspace-CTJC34wO.js` | 1,397,553 | `b85826d70d95ea13465a5a542b97822398d5a8214fbc5979e4b02e0d57fb5651` |
| `dist/assets/mockRepository-yQ6uoDDv.js` | 807,323 | `c286fbdcd432d525f3cd1ecc1ce19f45fdccceb3abc9d615d06bfaad497c6e48` |
| `dist/assets/workspace-bR6w9YYf.css` | 52,993 | `76bee58ffa9e43f24c78e6782f956693a9eb6ea6705981582e5bcff01c86fd52` |

## Extraction suites

Two fresh archives of `f513cd6`, nested zips excluded. `evidence/` was absent before the first `npm test` on each extract. No manual `mkdir`. The suites ran one at a time. Every run reported 498 files, 2,962 passed, 0 failed, and process exit 0. No unhandled rejection was recorded.

| Run | npm | `npm ci` | build | `npm test` | Duration | Exit |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 10.9.9 | exit 0, added 144 | exit 0 | 2,962 passed | 438.13s | 0 |
| 2 | 10.9.9 | same tree | same build | 2,962 passed | 438.86s | 0 |
| 3 | 10.9.9 | same tree | same build | 2,962 passed | 444.63s | 0 |
| 4 | 11.21.0 | exit 0, added 107 | exit 0 | 2,962 passed | 439.43s | 0 |
| 5 | 11.21.0 | same tree | same build | 2,962 passed | 445.27s | 0 |
| 6 | 11.21.0 | same tree | same build | 2,962 passed | 433.81s | 0 |

The first npm 10 run and the first npm 11 run each created `evidence/` themselves. Writers that completed include `client-arithmetic-coverage.json`, `client-seed-coverage.json`, `client-positive-coverage.json`, `client-negative-gates.json`, `positive-integrity-diagnostics.json`, `reviewer-integrity-matrix.json`, `ui-negative-gates.json`, `ui-positive-coverage.json`, `workflow-navigation.json`, `all85-rendered-target-audit.json`, `decision-switch-source-evidence.json`, and the genealogy phase record.

## Protected rerun

Against `vite preview` of the npm 10 build at `http://127.0.0.1:18197`: trust failures 7 passed, WP4 journeys 7 passed, WP5A dashboards 2 passed, 16 passed, exit 0. Visual regression `handoffRegressions.test.tsx` and `v17Sidebar.test.ts`: 9 passed, exit 0.

Focused browser smoke, because the client bundle changed: a fresh Chat shows Northworks and “No investigation selected”. The production-goal reply contains 150, Line 03, 138, and `Snapshot: Oct 6, 2026 · 2:45 PM · Synthetic`. After New conversation, “Investigate it.” returns “I don't have an investigation selected yet. Tell me what you want to investigate, or run the plant review first.” Dark starter text is `rgb(243, 243, 241)` on `rgb(42, 42, 42)` (12.92:1). The active Chat nav computed fill is `rgb(58, 58, 58)` with text `rgb(243, 243, 241)`. At 390 and 320, document scroll width equals the viewport.

## Provider

No API key was requested, entered, logged, or written. No real provider call was made.
