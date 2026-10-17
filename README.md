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

Demo Complete is not claimed. Adapter Verified is **NO**. Live Integration Verified is **NO**.

## Prerequisites

- Node.js and npm 10.9.x. RC3 was installed with npm 10.9.9. npm 10.9.2 also accepts `app/package-lock.json`. npm 11.21.0 does not: `npm ci` exits with EUSAGE because that lockfile is missing the non-Linux optional packages. The regeneration is proposed in [docs/wp6/RC3-COORDINATOR-PHASE1.md](docs/wp6/RC3-COORDINATOR-PHASE1.md) and is not applied.
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

The accepted journeys and the plant review run in this demo without a paid provider. Answers come from the governed local rules and the synthetic fixtures.

To serve the production build of this checkout instead:

```bash
npm run build
npx vite preview --host 127.0.0.1 --port 18195 --strictPort
```

## Reset Demo

Use **New conversation** in the sidebar. That clears the current thread and the current referent. It does not delete the browser history of earlier conversations. To wipe local demo state, close the app and remove the browser profile or the demo state directory the local server was given. Do not delete source fixtures to reset a session.

## Tests and build

From `app/`:

```bash
npm test
npm run build
```

`npm test` is `vitest run`. `npm run build` is `tsc --noEmit && vite build`. The RC3 extraction counted 2,952 passed, 0 failed, 496 files, and that process exited 0. An independent rerun of the same 2,952 passed tests exited 1. Vitest reported an unhandled rejection, `ReferenceError: window is not defined` at `app/src/investigation/CanonicalWorkspace.tsx:58`, while `app/src/server/v95SameDraftRecovery.test.tsx` was running. That file passes alone. The process exit is timing-dependent. The proposed teardown guard is in [docs/wp6/RC3-COORDINATOR-PHASE1.md](docs/wp6/RC3-COORDINATOR-PHASE1.md) and is not applied. Historical writers expect a gitignored `evidence/` directory beside the app; create it before a full run if a proof file fails to open.

Browser frames from the RC3 production preview are [docs/wp6/screenshots](docs/wp6/screenshots) files named `rc3-*`. The catalog is [docs/wp6/RC3-FRAME-INDEX.md](docs/wp6/RC3-FRAME-INDEX.md). Other filenames in that folder are the RC1 set from `63ccec7`. The frozen ZIP does not contain the `rc3-*` frames. Browser checks need Chrome plus a running app. They are not a substitute for `npm test`.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| npm 11 `npm ci` says the lock file is out of sync | Expected on this lockfile. npm 10.9.x installs it. The npm 11 regeneration is proposed and not applied |
| A local `app/node_modules` symlink from an older checkout | Remove that local symlink, then `npm ci`. This branch does not track `app/node_modules` |
| A proof test cannot write `../evidence` | `mkdir -p evidence` from the repository root and rerun |
| Chat says the provider is not connected | That is Demo mode. Governed local answers continue. Do not paste a key into Chat |
| Admin says pricing has expired | The saved price expired `2026-10-16T00:00:00Z`. RC3 will not take a new price or a $40 ceiling from the Admin screen. See [docs/wp6/PHASE-2-PROVIDER-PREP.md](docs/wp6/PHASE-2-PROVIDER-PREP.md) |
| Port already in use | Stop the other preview or pick another port. RC evidence used 18192 (RC1), 18194 (RC2), and 18195 (RC3) |
| Live mode shows a missing-capability sentence | The adapter failed closed. It did not substitute synthetic data. Adapter Verified remains NO |

## Switching to Production

Production is not this demo. Read [docs/wiki/07-demo-vs-production.md](docs/wiki/07-demo-vs-production.md) and [docs/wiki/14-production-backend-gaps.md](docs/wiki/14-production-backend-gaps.md) before changing any URL.

Current production and backend status:

- The UI adapter fails closed.
- Current EKAS backend main does not implement the investigation, case, and metric contract this UI needs.
- No live integration test has been accepted.
- The paid provider test is not authorized on RC3 until a reviewed source change can enforce current pricing and the $40 cumulative ceiling.

## Wiki

Start at [docs/wiki/Home.md](docs/wiki/Home.md).
