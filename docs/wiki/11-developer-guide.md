# 11 Developer guide

## Layout

- `app/` is the UI and the local demo server.
- `app/src/investigation` holds Chat, the router, replies, and the case model.
- `app/src/server` holds the local owner, the provider runtime, and the demo listener.
- `app/src/platform/backendMode.ts` is the live fail-closed adapter behavior.
- `docs/wiki` is this reference.
- `docs/wp6` is the release record. Do not edit the RC1 or RC2 zip bytes.

## Commands

From `app/`:

```bash
npm ci
npm test
npm run build
npm run dev
```

`npm run build` is `tsc --noEmit && vite build`. The dev server is `http://127.0.0.1:18191/`.

## Changing behavior

A change to a plant answer, a ranking, a referent, or a refusal needs a regression test that names the behavior. Do not weaken `validConversation` to accept a frozen capture that is invalid. Do not special-case one fixture phrase when the context model already has a referent.

Refactoring is allowed when the accepted behavior stays. The list of what must stay is on [19 Build method](19-build-method-engineering-quality-and-known-risks.md).

## What not to commit

Provider keys, private owner codes, `node_modules`, `app/dist`, Playwright HTML reports, and machine-local absolute paths. Historical proof files that already contain a reviewed path stay as history; new tests use `os.tmpdir()`.

## Where the rules live

- Referent precedence: `app/src/investigation/conversation.ts`, policy 8.
- Timestamp presentation: `app/src/investigation/plantPresentation.ts` and `Replies.tsx`.
- Budget and pricing gate: `app/src/server/localAiRuntime.ts` and `localDemoBudget.ts`.
- Live refusals: `app/src/platform/backendMode.ts`.
