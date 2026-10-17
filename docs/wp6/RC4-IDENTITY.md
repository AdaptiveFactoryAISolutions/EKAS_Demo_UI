# EKAS DEMO RC4 identity

Status: **PENDING INDEPENDENT REVIEW**. RC4 is frozen. RC3 `45568c575a00a8810b661929624995ec24e6de1e` and RC2 stay immutable. This file, the ZIP, the member list, and the `rc4-*` frames were added after the archive, so branch HEAD moves past the RC4 SHA. The ZIP bytes are the tree of `38f73c3` with the nested RC1, RC2, and RC3 zip binaries excluded.

RC4 FROZEN — READY FOR ADMIN PROVIDER TEST

Demo Complete is not claimed. Adapter Verified remains **NO**. Live Integration Verified remains **NO**. No paid provider call has been made.

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC4 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `38f73c3679eb173e6847a7569128793d97e42b5d` |
| Git tree | `6ad243c949b6dd3ad23f5c644e6e40b125b2aa9c` |
| Prior suite commit | `cecb9f9fc55b7983f97f2d14846a22ae900970fb` (app tree identical; the following commit only aligns two browser assertions) |
| ZIP path | `docs/wp6/EKAS-DEMO-RC4.zip` |
| ZIP size | 36,597,396 bytes |
| ZIP SHA256 | `731974e63702a5f52f0943b0bc2a618e44e9f62afd679be3c5caf214945a94c4` |
| ZIP comment | `38f73c3679eb173e6847a7569128793d97e42b5d` |
| ZIP members | 2,021 entries (1,961 files, 60 directories), 0 symlinks, 0 nested zips |
| Member hashes | `docs/wp6/RC4-MEMBERS.sha256` |
| Archive exclusions | `docs/wp6/EKAS-DEMO-RC1.zip`, `docs/wp6/EKAS-DEMO-RC2.zip`, `docs/wp6/EKAS-DEMO-RC3.zip` |
| Prior RC3 source | `45568c575a00a8810b661929624995ec24e6de1e` |
| Prior RC3 tree | `b32f8287ce6bcf18e494de27d4882ba4d01b91b2` |
| Prior RC3 ZIP SHA256 | `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` |
| App lockfile SHA256 | `e23f4b4ae4be95aa1df8e2f53c6f7d23039c920a93fa8de9f404e4fdb4bc0881` (`app/package-lock.json`, 56,108 bytes) |

## What the archive contains

The product diff versus RC3 is the five authorized areas below. Documentation commits already on the branch after the RC3 source (RC3 evidence, final completion, coordinator Phase 1, and the cross-system package) are in the tree and are not new manufacturing behavior.

1. Pricing and the $40 cap: `providerTestBudget.ts`, `rc4ProviderTestBudget.test.ts`, `localDemoBudget.ts`, `localAiRuntime.ts`, `AdminAiPage.tsx`.
2. npm 11 lockfile and `jsdom@29.1.1`: `app/package.json`, `app/package-lock.json`.
3. v95 teardown only: `v95SameDraftRecovery.test.tsx`. `CanonicalWorkspace.tsx` line 58 `setPending(false)` is unchanged.
4. New-conversation reset: `conversation.ts`, `service.ts`, `turnSemantics.ts`, `unified.ts`, `plantPresentation.ts`, the unselected header in `CanonicalWorkspace.tsx`, `Replies.tsx`, `rcNewConversationReset.test.tsx`, `rcReferent.test.ts`, and the first-load assertions in `e2e/dashboard-wp5.spec.ts` and `e2e/shell-walkthrough.spec.ts`.
5. Dark contrast: `presentation.css` and `v17Sidebar.test.ts`.

RC4 operator notes are `README.md`, `docs/wp6/PHASE-2-PROVIDER-PREP.md`, and `docs/wp6/OPERATOR-RUNBOOK.md`.

## Built static files

`npm ci` then `npm run build` on the extracted archive of `cecb9f9`. Exit 0 on npm 10.9.9 and npm 11.21.0. The two dist trees are byte-identical. 81 files. Manifest `1420cedf74e991e6adad3a1fec8b09631c7d86711f2cef3fc0c601d8215c5dc7`. `index-I9r_3K0-.css` and `mockRepository-yQ6uoDDv.js` match RC3. `index.html`, the index script, the service script, the workspace script, and the workspace CSS moved because the Admin sentence, the header reset, and the dark rules are in the client bundles.

| File | Bytes | SHA256 |
| --- | --- | --- |
| `dist/index.html` | 501 | `58632e852f63687c1ea2c44e41bc4f49e29d5eb60850fbef00321a0bc0b0e10a` |
| `dist/assets/index-PY6HRMUl.js` | 27,587,645 | `c049bd16451889ebb4eadea602386e98926afe5032b4a2bb00cc03dbd50064cb` |
| `dist/assets/index-I9r_3K0-.css` | 178,154 | `d2ec9a8061b7230d5b0ea8365a8696964badba33cc4bd831bb94eed37c20be2a` |
| `dist/assets/service-D13k0wrA.js` | 2,027,088 | `3c95580d67506e502260e1fb1ae8b94a8a9d6bf4d67e19cff04af70007482f38` |
| `dist/assets/workspace-UKJPWMlC.js` | 1,397,263 | `12e189a1a3762b6b0224de5bcf54ff909835c3b5f95e4d89720abed778562cdc` |
| `dist/assets/mockRepository-yQ6uoDDv.js` | 807,323 | `c286fbdcd432d525f3cd1ecc1ce19f45fdccceb3abc9d615d06bfaad497c6e48` |
| `dist/assets/workspace-bR6w9YYf.css` | 52,993 | `76bee58ffa9e43f24c78e6782f956693a9eb6ea6705981582e5bcff01c86fd52` |

## Extraction suites

Fresh extracts of `cecb9f9`, nested zips excluded, `evidence/` created. `git diff cecb9f9 38f73c3 -- app` is empty.

| npm | `npm ci` | build | `npm test` | Files | Tests | Duration |
| --- | --- | --- | --- | --- | --- | --- |
| 10.9.9 | exit 0, added 144 | exit 0 | exit 0 | 498 | 2,962 passed, 0 failed | 424.31s |
| 11.21.0 | exit 0, added 107, jsdom 29.1.1 installed | exit 0 | exit 0 | 498 | 2,962 passed, 0 failed | 426.42s |

A simultaneous pair of those suites contended for the machine and is not the proof. Rerun one at a time, both exited 0.

Provider budget tests, the dark AA contrast check, and the handoff regressions passed together: 15 passed, exit 0. The six budget tests cover the readable $20 history, a reservation that reaches and crosses the $40 cap, expired pricing before any call, no duplicate charge, an interrupted call left unknown, and unloaded Fast, Batch, regional, and over-272K usage. The expiry test records zero fetch calls. The key string used is `DUMMY_NO_REAL_KEY`.

Protected browser rerun against `vite preview` of that build at `http://127.0.0.1:18196`: trust failures 7 passed, WP4 journeys 6 passed, WP5A dashboards 2 passed, shell walk-through 1 passed. The first dashboard run failed because it still expected FEED-03 in an unselected header. That assertion, and the same first-load assertion in the shell walk-through, now require “No investigation selected”. The rerun exited 0. Selecting the plant plan miss still shows Line 03, and Investigate still opens the feeder-jam case.

## Frames

Clean Chrome profile, production preview, menus closed. Hashes: `docs/wp6/RC4-FRAMES.sha256`.

| Frame | What it shows |
| --- | --- |
| `screenshots/rc4-light-chat.png` | Light Chat. Northworks, no investigation selected, starter suggestions readable |
| `screenshots/rc4-dark-chat.png` | Dark Chat. Starter text `#f3f3f1` on `#2a2a2a` (12.92:1). Active Chat nav `#f3f3f1` on `#3a3a3a` (10.24:1) |
| `screenshots/rc4-new-conversation.png` | After a feeder-jam case, New conversation, then “Investigate it.” Header is Northworks and “No investigation selected”. Reply is the plant-facing clarification. No FEED-03, JOB-8303, finite training grammar, or training-plant-v1 |
| `screenshots/rc4-390-chat.png` | 390×844. One production-goal reply, 150 and Line 03 missed by 138. Menu closed. Composer visible. No saving banner |
| `screenshots/rc4-320-chat.png` | 320×844. The same reply, wrapped. Document scroll width equals 320. Composer visible. No saving banner |

The only element past the viewport edge is the skip link, which is positioned off-canvas. No other horizontal clipping was measured. No layout defect was found that this freeze is leaving unfixed.

## Provider

No real API call was made. The key was not entered, logged, fixture-written, or captured. Admin still takes the key only after this freeze. Confirm the screen shows pricing reviewed 2026-10-17, expiry `2026-11-16T00:00:00Z`, input $2, cached input $0.10, cache writes $2.50, output $10 per 1M tokens, and the cumulative $40 cap before any Test connection.
