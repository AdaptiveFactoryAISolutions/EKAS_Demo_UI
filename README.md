# EKAS — start here

EKAS is a chat-first manufacturing decision-intelligence demo. A plant leader starts from a missed operating goal and moves through evidence, a governed decision, accountable action, verification, and sustained improvement. It is not a generic BI shell, and it does not replace a manufacturing execution system.

Short form: **From production miss to verified improvement.**

The authoritative reference is the Wiki under [docs/wiki/Home.md](docs/wiki/Home.md).

## Accepted release

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC3 |
| Source SHA | `45568c575a00a8810b661929624995ec24e6de1e` |
| Git tree of that source | `b32f8287ce6bcf18e494de27d4882ba4d01b91b2` |
| ZIP | [docs/wp6/EKAS-DEMO-RC3.zip](docs/wp6/EKAS-DEMO-RC3.zip) |
| ZIP size | 31,634,629 bytes |
| ZIP SHA256 | `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` |
| Status | PENDING independent review |

Later documentation commits sit on top of that source SHA. They do not change the ZIP bytes. RC2 and RC1 stay frozen. Identity detail is in [docs/wp6/RC3-IDENTITY.md](docs/wp6/RC3-IDENTITY.md).

This checkout is the RC4 release-maintenance candidate on top of that frozen RC3 source. RC4 is not a new product. It adds the reviewed gpt-6.1-sol rates and a server-enforced $40 cumulative provider-test authorization, the npm 11 lockfile entries with `jsdom@29.1.1` pinned as a devDependency, the v95 suite teardown, a new-conversation context reset, and dark-mode contrast for the starter suggestions and the active navigation item. RC4 is not frozen in the RC3 ZIP. No paid provider call is part of the candidate.

Demo Complete is not claimed. Adapter Verified is **NO**. Live Integration Verified is **NO**.

## Prerequisites

- Node.js and npm 10.9.x or npm 11.21.0. RC3 was installed with npm 10.9.9, and npm 11.21.0 rejected that lockfile. This checkout adds the missing optional platform entries and pins `jsdom@29.1.1` as a devDependency, so `npm ci` is required to succeed on both npm 10.9.9 and npm 11.21.0. The RC3 diagnosis remains in [docs/wp6/RC3-COORDINATOR-PHASE1.md](docs/wp6/RC3-COORDINATOR-PHASE1.md).
- Google Chrome, if you run the browser checks.
- A clean working copy. Do not point the demo at a production database or a real provider key.

## Clone and install

```bash
git clone https://github.com/AdaptiveFactoryAISolutions/EKAS_Demo_UI.git
cd EKAS_Demo_UI/app
npm ci
```

`npm ci` uses `app/package-lock.json`. This branch does not track `app/node_modules`. The README inside the frozen RC3 ZIP still says that path is a tracked symlink and that the suite was 2,896 passed and 13 failed. That is the README at source `45568c5`. It is not this page.

If an older local checkout left `app/node_modules` as a symlink, remove that local symlink before `npm ci`.

## Start Demo

From `app/` after `npm run build`:

```bash
npm run dev
```

The dev server listens at `http://127.0.0.1:18191/`. Chat opens first. The synthetic badge is visible. Light appearance is the default.

## Local owner server

A clean extract starts the documented Admin server with Node alone. No `npm ci`, no compile step, and no copied files are required for this command:

```bash
node integration/local-demo/start.mjs --port 18330 --state /absolute/private-demo/workspace.json --owner-code /absolute/private-demo/owner-code
```

The launcher imports `packaged/server/localDemoServer.js` and serves `static/`. Those are the compiled form of `app/src/server/localDemoServer.ts` and the production UI build. The private state and owner-code paths must be outside `static/`. The process creates the owner-code file, listens on `127.0.0.1`, and leaves the provider disabled. It does not read an API key. The procedure is [docs/LOCAL-ADMIN-RUNBOOK.md](docs/LOCAL-ADMIN-RUNBOOK.md) and [docs/wp6/RC6-STARTUP.md](docs/wp6/RC6-STARTUP.md).

The accepted journeys and the plant review run in this demo without a paid provider. Answers come from the governed local rules and the synthetic fixtures.

To serve the production build of this checkout instead:

```bash
npm run build
npx vite preview --host 127.0.0.1 --port 18195 --strictPort
```

## Reset Demo

Use **New conversation** in the sidebar. That starts a conversation with no selected investigation. The header keeps the synthetic plant and says no investigation is selected. It does not keep the previous line, asset, job, or case. A bare “Investigate it.” asks what to investigate. Saved history of earlier conversations stays available. To wipe local demo state, close the app and remove the browser profile or the demo state directory the local server was given. Do not delete source fixtures to reset a session.

## Tests and build

From `app/`:

```bash
npm test
npm run build
```

 `npm test` is `vitest run`. `npm run build` is `tsc --noEmit && vite build`. The RC3 extraction counted 2,952 passed, 0 failed, 496 files, and that process exited 0. An independent rerun of the same 2,952 passed tests exited 1. Vitest reported an unhandled rejection, `ReferenceError: window is not defined` at `app/src/investigation/CanonicalWorkspace.tsx:58`, while `app/src/server/v95SameDraftRecovery.test.tsx` was running. RC4 drained that update only inside that test file. An independent RC4 extraction still exited 1 after 2,962 passed tests, with the same rejection attributed to a different file. RC5 skips React state updates from an in-flight CanonicalWorkspace send, acceptance, or case advance after the page unmounts or the DOM environment is gone. Replies, draft clearing, and manufacturing results stay the same while the page is mounted. Historical proof writers still record under a gitignored `evidence/` directory beside the app. The Vitest setup creates that directory, so a fresh extraction does not need `mkdir` before `npm test`.

Browser frames from the RC3 production preview are [docs/wp6/screenshots](docs/wp6/screenshots) files named `rc3-*`. The catalog is [docs/wp6/RC3-FRAME-INDEX.md](docs/wp6/RC3-FRAME-INDEX.md). Other filenames in that folder are the RC1 set from `63ccec7`. The frozen ZIP does not contain the `rc3-*` frames. Browser checks need Chrome plus a running app. They are not a substitute for `npm test`.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| npm 11 `npm ci` says the lock file is out of sync | That is the frozen RC3 lockfile. This checkout's lockfile is required to install on npm 11.21.0. Do not regenerate it with `npm install --package-lock-only`; that drops jsdom |
| A local `app/node_modules` symlink from an older checkout | Remove that local symlink, then `npm ci`. This branch does not track `app/node_modules` |
 | A proof test cannot write `../evidence` | Run `npm test` from `app/`. The Vitest setup creates the gitignored `evidence/` directory beside the app |
| Chat says the provider is not connected | That is Demo mode. Governed local answers continue. Do not paste a key into Chat |
| Admin says pricing has expired | RC3 expired `2026-10-16T00:00:00Z`. RC4 reviews the official gpt-6.1-sol rates on 2026-10-17 and expires `2026-11-16T00:00:00Z`, with a server-enforced $40 cumulative cap. Do not type a key until RC4 is frozen. See [docs/wp6/PHASE-2-PROVIDER-PREP.md](docs/wp6/PHASE-2-PROVIDER-PREP.md) |
| Port already in use | Stop the other preview or pick another port. RC evidence used 18192 (RC1), 18194 (RC2), and 18195 (RC3) |
| Live mode shows a missing-capability sentence | The adapter failed closed. It did not substitute synthetic data. Adapter Verified remains NO |

## Switching to Production

Production is not this demo. Read [docs/wiki/07-demo-vs-production.md](docs/wiki/07-demo-vs-production.md) and [docs/wiki/14-production-backend-gaps.md](docs/wiki/14-production-backend-gaps.md) before changing any URL.

Current production and backend status:

- The UI adapter fails closed.
- Current EKAS backend main does not implement the investigation, case, and metric contract this UI needs.
- No live integration test has been accepted.
- The paid provider test is not run on RC3. RC4 source enforces the current rates and the $40 cumulative ceiling on the server. The key is entered only in Admin after RC4 is frozen. No paid call has been made.

## Wiki

Start at [docs/wiki/Home.md](docs/wiki/Home.md). Cross-system context, identity, and lineage is documented under [docs/wiki/cross-system/](docs/wiki/cross-system/01-cross-system-manufacturing-data.md) and is not implemented in RC3.
