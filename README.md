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

- Node.js and npm, matching the lockfile in `app/` (the app was built with the Vite 8 / TypeScript toolchain pinned by `app/package-lock.json`).
- Google Chrome, if you run the browser checks.
- A clean working copy. Do not point the demo at a production database or a real provider key.

## Clone and install

```bash
git clone https://github.com/AdaptiveFactoryAISolutions/EKAS_Demo_UI.git
cd EKAS_Demo_UI
rm -f app/node_modules
cd app
npm ci
```

`npm ci` uses `app/package-lock.json`. If `app/node_modules` is a symlink left by an older checkout, remove that symlink first so the install can create a real directory.

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

`npm test` is `vitest run`. `npm run build` is `tsc --noEmit && vite build`. The RC3 extraction suite was 2,952 passed, 0 failed, 496 files. Historical writers expect a gitignored `evidence/` directory beside the app; create it before a full run if a proof file fails to open.

Browser checks live at the repository root and need Chrome plus a running app. They are not a substitute for `npm test`.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| `npm ci` refuses because `app/node_modules` is a symlink | `rm -f app/node_modules`, then `npm ci` again |
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
