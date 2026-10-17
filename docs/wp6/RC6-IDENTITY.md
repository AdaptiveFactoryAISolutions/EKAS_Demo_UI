# EKAS DEMO RC6 identity

Status: **NOT FROZEN**. RC6 is a packaging candidate. The freeze line is withheld because one of the six full suites exited 1. RC5, RC4, and RC3 stay byte-unchanged. RC5 is superseded by the launcher defect in `RC5-SUPERSEDED.md`. This file, the ZIP, the member list, the changed-file list, and the clean-extract screenshot were added after the archive, so branch HEAD moves past the RC6 SHA. The ZIP bytes are the tree of `17b19f5` with the nested RC1, RC2, RC3, RC4, and RC5 zip binaries excluded.

Demo Complete is not claimed. Adapter Verified remains **NO**. Live Integration Verified remains **NO**. No API key was entered. No real provider call was made.

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC6 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `17b19f555ad446d9f34e89289ef761c29d7aacf9` |
| Git tree | `de9f1f1c02839600e43ac3511ab7ec009332510e` |
| Parent | `f62344ac8fb3a36eec51e94019ec1b55cb729bb9` |
| ZIP path | `docs/wp6/EKAS-DEMO-RC6.zip` |
| ZIP size | 40,834,640 bytes |
| ZIP SHA256 | `74c0f5d721d36378888380aa1928e1377ab9a9f55bcc220437cbb37e35dd2976` |
| ZIP comment | `17b19f555ad446d9f34e89289ef761c29d7aacf9` |
| ZIP members | 2,288 entries (2,212 files, 76 directories), 0 symlinks, 0 nested zips, no `evidence/` member |
| Member hashes | `docs/wp6/RC6-MEMBERS.sha256` |
| Changed files versus RC5 source | `docs/wp6/RC6-FILES.txt` |
| Archive exclusions | `docs/wp6/EKAS-DEMO-RC1.zip`, `docs/wp6/EKAS-DEMO-RC2.zip`, `docs/wp6/EKAS-DEMO-RC3.zip`, `docs/wp6/EKAS-DEMO-RC4.zip`, `docs/wp6/EKAS-DEMO-RC5.zip` |
| Prior RC5 source | `f513cd6e068c758d0443aeec8c3410f88a848d4b` |
| Prior RC5 tree | `64438f893ec4d3d7bebb878bf839ad1e0a4274ea` |
| Prior RC5 ZIP SHA256 | `42d9cd0b1de878e68886e457dbe4f4fe4258711fdb7c043d9a9d00d96b023222` (36,962,811 bytes) |
| Prior RC4 ZIP SHA256 | `731974e63702a5f52f0943b0bc2a618e44e9f62afd679be3c5caf214945a94c4` |
| Prior RC3 ZIP SHA256 | `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` |
| App lockfile SHA256 | `e23f4b4ae4be95aa1df8e2f53c6f7d23039c920a93fa8de9f404e4fdb4bc0881` (`app/package-lock.json`, unchanged from RC5) |

## Root cause

`integration/local-demo/start.mjs` and `integration/local-demo/recover-conservative.mjs` imported `../../server/localDemoServer.js`. The launcher serves `static/`. The RC5 git archive ships `app/src/server/localDemoServer.ts` and does not ship `server/localDemoServer.js`, `packaged/`, `static/`, `node_modules/`, or `app/dist/`. A clean extract died with `ERR_MODULE_NOT_FOUND` before listen.

## Packaging correction

`app/` is unchanged from RC5 source `f513cd6`. `git diff f513cd6 17b19f5 -- app` is empty.

The packaging commit `17b19f5` is 241 files versus its parent `f62344a`. The only edits to existing launcher source are the import path:

- `integration/local-demo/start.mjs` imports `../../packaged/server/localDemoServer.js`
- `integration/local-demo/recover-conservative.mjs` imports the same module

The documented command string is unchanged. New maintainer files are `integration/local-demo/emit-server.mjs` and `integration/local-demo/server.rolldown.config.mjs`. An extract does not run them. `packaged/` is 152 compiled ESM files from a rolldown `preserveModules` emit of `app/src/server/localDemoServer.ts`, with `node:` left external. `static/` is 81 files, the RC5 production UI. `static/index.html` SHA256 is `e1d616038bae0d48e55fe3b73d6ef3f0b17281d757a1965c5a7abb47b35727df`. Operator text is `README.md`, `docs/LOCAL-ADMIN-RUNBOOK.md`, and `docs/wp6/RC6-STARTUP.md`. The workspace smoke frame is `docs/wp6/screenshots/rc6-admin-disabled.png`.

## Exact diff versus RC5 source

`git diff --name-status f513cd6 17b19f5` is 244 added and 4 modified, 248 paths, listed in `RC6-FILES.txt`. The 4 modified paths are `README.md`, `docs/LOCAL-ADMIN-RUNBOOK.md`, `integration/local-demo/recover-conservative.mjs`, and `integration/local-demo/start.mjs`.

Seven of the added paths are RC5 evidence recorded after the RC5 archive and are not the packaging correction: `docs/wp6/EKAS-DEMO-RC5.zip`, `docs/wp6/RC4-SUPERSEDED.md`, `docs/wp6/RC5-CORRECTION.diff`, `docs/wp6/RC5-IDENTITY.md`, `docs/wp6/RC5-MEMBERS.sha256`, `docs/wp6/RC5-PROVIDER-POLICY.md`, `docs/wp6/RC5-TEST-RUNNER.md`.

## Clean-extract startup

A new directory received only `unzip` of `EKAS-DEMO-RC6.zip` (`74c0f5d7…`). That tree had no `node_modules`, no `app/dist`, and no `server/localDemoServer.js`. It did contain `packaged/server/localDemoServer.js` and `static/index.html`. No file was copied or compiled into it.

Command, from that extract:

```bash
node integration/local-demo/start.mjs \
  --port 18333 \
  --state /tmp/ekas-rc6-clean-private/workspace.json \
  --owner-code /tmp/ekas-rc6-clean-private/owner-code
```

The process printed `Local synthetic demo ready at http://127.0.0.1:18333/; AI disabled. Open Admin AI and privately use the owner-code file you selected.` The owner-code file was created mode `0600`, 43 bytes. The page bootstrap was `{"version":1,"mode":"server-disabled","synthetic":true,"conversationId":"conversation-1","localAdmin":true}`. `GET /api/v1/demo/ai-status` returned the same public mode. No `--original-budget-history` was passed.

Chrome on that server: Admin AI opened, `POST /api/v1/admin/owner/login` returned 200, and `GET /api/v1/admin/ai` returned 200. After sign-in the status fields were `enabled: false`, `effectiveMode: "disabled"`, `settings.mode: "disabled"`, `credential.configured: false`, and `budget.halted: true`. The key control was `type="password"` and empty. The owner code was not in the page text or the status JSON. Requests to any origin other than `http://127.0.0.1:18333` were 0. The server log is that one ready line and contains no key. The frame is `docs/wp6/screenshots/rc6-clean-extract-admin.png`.

## Extraction suites

Two fresh extracts of this ZIP. Suites ran one at a time with `npm test -- --maxWorkers=4`. The first run on each extract had no `evidence/` directory beforehand. No manual `mkdir`.

| Run | npm | `evidence/` before | Result | Duration | Exit |
| --- | --- | --- | --- | --- | --- |
| 1 | 10.9.9 | no (`npm ci` added 144, exit 0) | 498 files, 2,962 passed, 1 unhandled error | 368.11s | 1 |
| 2 | 10.9.9 | yes | 498 files, 2,962 passed | 356.53s | 0 |
| 3 | 10.9.9 | yes | 498 files, 2,962 passed | 354.12s | 0 |
| 4 | 11.21.0 | no (`npm ci` added 107, exit 0) | 498 files, 2,962 passed | 355.89s | 0 |
| 5 | 11.21.0 | yes | 498 files, 2,962 passed | 356.97s | 0 |
| 6 | 11.21.0 | yes | 498 files, 2,962 passed | 354.89s | 0 |

Run 1 exited 1 after every test passed. Vitest reported an unhandled rejection, `ReferenceError: window is not defined`, at `dispatchSetState` from `src/retained/screens.tsx:291:353`, attributed to `src/investigation/conversationalCollectorsUi.test.tsx`. `app/` is the RC5 source, so this is the pre-existing teardown class at a call site RC5 did not guard. It was not patched in RC6. Five later runs of the same 2,962 tests exited 0.

## Other documented commands

`README.md` developer commands `npm ci`, `npm test`, `npm run build`, `npm run dev`, and `npx vite preview` need `node_modules/` and, for preview, `app/dist/`. Those directories are not in the ZIP. Those commands do not name `server/localDemoServer.js`.

`docs/wp6/OPERATOR-RUNBOOK.md` describes later Admin clicks. It does not name a launcher file.

`docs/LOCAL-ADMIN-RUNBOOK.md` is the operator command, and it now names `packaged/server/localDemoServer.js` and `static/`.

`integration/local-demo/recover-conservative.mjs` was the other in-tree command that imported the missing file. It now imports the shipped module. It is not normal startup.

`verify-final-node-smoke.mjs` still imports `./fresh-extracted-rc1/server/localDemoServer.js`. That is a historical harness path, not an operator command, and that file is not in the ZIP.

## Provider

No API key was requested, entered, logged, or written. No real provider call was made. The clean-extract browser made no request outside `127.0.0.1:18333`.
