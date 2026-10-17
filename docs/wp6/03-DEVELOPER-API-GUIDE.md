# Developer and API guide — EKAS DEMO RC1

RC1 is the app in `app/`. Install with `npm ci` from `app/package-lock.json`. Check types and build with `npm run build` (`tsc --noEmit && vite build`). Unit tests are `npm test` (Vitest). Browser tests at the repo root use Playwright against a running app.

## Local synthetic path

With no `__EKAS_APPLICATION__` bootstrap, Chat uses the in-browser manufacturing service and IndexedDB. That is the path the plant-leader journeys use. Answers come from governed local rules. They are synthetic.

## Local demo server

`startLocalAiApplicationDemo` in `app/src/server/localDemoServer.ts` serves the built `dist` and the `/api/` routes. Rehearsal mode must not be pointed at a real budget history. Owner code, settings, and audit files stay outside the static directory.

The browser bootstrap accepts only `version`, `mode`, `synthetic`, `conversationId`, `localAdmin`, and `localAdminRehearsal`. A credential in that object is rejected.

## Conversation API

The running UI calls `/api/v1/manufacturing/...` on the proposed contract when a server transport is installed. Live mode, in `app/src/platform/backendMode.ts`, allows documented conversation and evidence paths and refuses investigation, ownership, opportunity, kernel, and metric routes with an explicit sentence. It does not fall back to the synthetic service.

Pilot `/v1` remains a separate adapter surface. It is not what the plant shell calls.

## What not to change for a demo gap

Do not loosen `validConversation` to load frozen historical bytes that fail the current check. Do not put the metric lab back on the plant dashboard. Do not retarget the UI lifecycle to the missing backend contract. A product correction after this archive is RC2.
