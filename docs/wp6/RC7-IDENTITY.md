# EKAS DEMO RC7 identity

Status: **RC7 FROZEN — READY FOR ADMIN PROVIDER TEST**. RC6 stays unfrozen and byte-unchanged. RC5 stays frozen. This file, the ZIP, the member list, the changed-file list, the supersession note, and the clean-extract screenshot were added after the archive, so branch HEAD moves past the RC7 SHA. The ZIP bytes are the tree of `b367dfd` with the nested RC1–RC6 zip binaries excluded.

Demo Complete is not claimed. Adapter Verified remains **NO**. Live Integration Verified remains **NO**. No API key was entered. No real provider call was made.

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC7 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `b367dfd4196733775f414ee6ea1bd6d7f7d5a1c5` |
| Git tree | `496d71e948ed4f9aee1e4bfee8fa7962d53cb9d3` |
| Lifecycle commit | `2b29297cdd9d81f51b02cf5011fa59fb1db3537d` |
| Suite commit | `9d8e8c888d01740bcdf046383935c8655f4a9b39` |
| ZIP path | `docs/wp6/EKAS-DEMO-RC7.zip` |
| ZIP size | 41,077,275 bytes |
| ZIP SHA256 | `18c9c7554a0ef1d775d4aa53b9e97c597db27d11e67e0dcb3cc4e6b41dbd5de8` |
| ZIP comment | `b367dfd4196733775f414ee6ea1bd6d7f7d5a1c5` |
| ZIP members | 2,296 entries (2,220 files, 76 directories), 0 symlinks, 0 nested zips, no `evidence/` member |
| Member hashes | `docs/wp6/RC7-MEMBERS.sha256` |
| Changed files versus RC6 source | `docs/wp6/RC7-FILES.txt` |
| Archive exclusions | `docs/wp6/EKAS-DEMO-RC1.zip` through `docs/wp6/EKAS-DEMO-RC6.zip` |
| Prior RC6 source | `17b19f555ad446d9f34e89289ef761c29d7aacf9` |
| Prior RC6 tree | `de9f1f1c02839600e43ac3511ab7ec009332510e` |
| Prior RC6 ZIP SHA256 | `74c0f5d721d36378888380aa1928e1377ab9a9f55bcc220437cbb37e35dd2976` (40,834,640 bytes) |
| Prior RC5 ZIP SHA256 | `42d9cd0b1de878e68886e457dbe4f4fe4258711fdb7c043d9a9d00d96b023222` |
| App lockfile SHA256 | `e23f4b4ae4be95aa1df8e2f53c6f7d23039c920a93fa8de9f404e4fdb4bc0881` (unchanged) |

## Root cause

Ask's click handler in `app/src/retained/screens.tsx` awaits `submitUnifiedConversation`. The promise belongs to the click, not to an effect. After the await, `finally` always called `setRunning(false)`. Vitest can remove the `window` binding after the page closes without that cleanup having cancelled the promise. React 19 `dispatchSetState` then reads `window.event` and throws `ReferenceError: window is not defined`. Every assertion can pass and the process still exits 1.

The same post-await React commit exists across the product UI. RC5 guarded CanonicalWorkspace only. RC6 did not patch `screens.tsx`.

## Shared correction

`app/src/retained/pageLifetime.ts` owns the check. `commitWhilePageLive` runs a React commit only while that component's lifetime ref is still set and `window` exists. A closed page is a no-op. An exception thrown by a live commit still propagates. `commitWhileDomOpen` lets a retained store update finish after unmount while the DOM is still there, and skips it when the DOM global is gone. Store listener notification, notice dispatch, and reply-follow timers use that same DOM check.

Mounted behavior is unchanged. A deferred Run still saves the 150-unit reply and returns the button to Run. The `conversationalCollectorsUi` test file was not patched.

## Static regeneration

The client source change moves the production bundle. `static/` was regenerated with `npm run build` from this source and copied from `app/dist`. `static/index.html` SHA256 is `951e4cbb56420094e9f65547380f8c59a8d6120411a93798f0ecd9e2980738e1`. `index-I9r_3K0-.css`, `workspace-bR6w9YYf.css`, and `mockRepository-yQ6uoDDv.js` match RC6. The index, workspace, and service scripts moved.

`packaged/` was not replaced. A fresh rolldown `preserveModules` emit of `app/src/server/localDemoServer.ts` produced 152 files with the same hashes as the shipped `packaged/` tree. The server entry graph does not import the changed client modules.

## Exact diff versus RC6 source

`git diff --name-status 17b19f5 b367dfd` is in `RC7-FILES.txt` (65 paths). Six of those paths are the RC6 evidence commit `837c971` and are not the teardown fix: `docs/wp6/EKAS-DEMO-RC6.zip`, `RC5-SUPERSEDED.md`, `RC6-FILES.txt`, `RC6-IDENTITY.md`, `RC6-MEMBERS.sha256`, and `docs/wp6/screenshots/rc6-clean-extract-admin.png`.

The product delta versus RC6 evidence `837c971` is the page-lifetime helper, the post-await guards, two teardown tests, the ComparisonFlow 30-second budget, and the regenerated `static/` files.

## Extraction suites

Fresh extracts of the lifecycle source received `npm ci` (`npm` 10.9.9 added 144; `npm` 11.21.0 added 107). Both exited 0. `evidence/` is not in the archive. The Vitest preflight creates `<extract>/evidence` beside `app/`. No manual `mkdir`. Suites then ran one at a time with `npm test -- --maxWorkers=4`.

Two earlier npm 11 runs exited 1 on `ComparisonFlow.test.tsx`: the three-reload navigation test exceeded Vitest's 5-second default, and the next test in that file saw the interrupted page. That test now uses the 30-second budget the file already gives its setup. Assertions are unchanged. The ten runs below are that suite commit, copied onto the same installs. They are 500 files and 2,966 passed: the previous 2,962 plus 2 page-lifetime tests and 2 Ask teardown tests. No unhandled error, no teardown exception, no OOM kill, and no `window is not defined`.

| Run | npm | Result | Duration | Exit |
| --- | --- | --- | --- | --- |
| 1 | 10.9.9 | 500 files, 2,966 passed | 369.25s | 0 |
| 2 | 10.9.9 | 500 files, 2,966 passed | 370.23s | 0 |
| 3 | 10.9.9 | 500 files, 2,966 passed | 371.57s | 0 |
| 4 | 10.9.9 | 500 files, 2,966 passed | 369.90s | 0 |
| 5 | 10.9.9 | 500 files, 2,966 passed | 373.34s | 0 |
| 6 | 11.21.0 | 500 files, 2,966 passed | 378.55s | 0 |
| 7 | 11.21.0 | 500 files, 2,966 passed | 376.02s | 0 |
| 8 | 11.21.0 | 500 files, 2,966 passed | 376.84s | 0 |
| 9 | 11.21.0 | 500 files, 2,966 passed | 368.24s | 0 |
| 10 | 11.21.0 | 500 files, 2,966 passed | 372.06s | 0 |

## Protected browser smoke

Against Vite preview of this production build, port 18217, from a copy so `docs/wp1`, `docs/wp4`, and `docs/wp5` screenshots were not rewritten: trust 7, WP4 7, WP5A 2, shell walk-through 1, 17 passed, exit 0. A focused Chrome pass confirmed the four starters, the exact footer `Snapshot: Oct 6, 2026 · 2:45 PM · Synthetic`, the fresh “Investigate it.” clarification, dark starter contrast 12.92:1, and no horizontal overflow at 390 or 320.

## Clean-extract startup

A new directory received only `unzip` of `EKAS-DEMO-RC7.zip`. It had no `node_modules` and no `server/localDemoServer.js`. It had `packaged/server/localDemoServer.js` and `static/index.html`. No file was copied or compiled into it.

```bash
node integration/local-demo/start.mjs \
  --port 18347 \
  --state /tmp/private-demo/workspace.json \
  --owner-code /tmp/private-demo/owner-code
```

The process printed `Local synthetic demo ready at http://127.0.0.1:18347/; AI disabled. Open Admin AI and privately use the owner-code file you selected.` The owner-code file was created mode `0600`, 43 bytes. The injected page bootstrap was `{"version":1,"mode":"server-disabled","synthetic":true,"conversationId":"conversation-1","localAdmin":true}`.

Chrome on that server opened Admin AI. `POST /api/v1/admin/owner/login` was followed by `GET /api/v1/admin/ai` 200. Status fields were `enabled: false`, `effectiveMode: "disabled"`, `settings.mode: "disabled"`, `credential.configured: false`, and `budget.halted: true`. The key control was `type="password"` and empty. The owner code was not in the page text, the status JSON, or the server log. Requests to any origin other than `http://127.0.0.1:18347` were 0. The frame is `docs/wp6/screenshots/rc7-clean-extract-admin.png`.

## Provider

No API key was requested, entered, logged, or written. No real provider call was made.

RC7 FROZEN — READY FOR ADMIN PROVIDER TEST
