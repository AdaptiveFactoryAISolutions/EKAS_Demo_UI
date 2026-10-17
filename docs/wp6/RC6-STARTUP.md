# RC6 startup path

RC5's frozen ZIP contains `integration/local-demo/start.mjs` and `app/src/server/localDemoServer.ts`. The launcher imported `server/localDemoServer.js`, and that compiled file was not in the archive. A clean extract failed with `ERR_MODULE_NOT_FOUND` before the server listened. RC5 is not edited. RC6 ships the compiled module the launcher loads, and the static UI that module serves.

## Command

From the extracted candidate, with the state and owner-code paths outside the extract:

```bash
node integration/local-demo/start.mjs \
  --port 18330 \
  --state /absolute/private-demo/workspace.json \
  --owner-code /absolute/private-demo/owner-code
```

No `npm ci`, no `npm run build`, and no manual file copy is required for this command. The ready line is `Local synthetic demo ready at http://127.0.0.1:18330/; AI disabled.`

| Piece | Role |
| --- | --- |
| `integration/local-demo/start.mjs` | Reads the four explicit arguments and starts the server. It does not read an environment key. |
| `packaged/server/localDemoServer.js` | Compiled entry imported by the launcher. Sibling files under `packaged/` are the same compilation. |
| `app/src/server/localDemoServer.ts` | Editable source of that entry. |
| `static/` | Production UI. The server injects `localAdmin: true` and `mode: server-disabled` into `index.html`. |
| `integration/local-demo/emit-server.mjs` | Maintainer command that regenerates `packaged/` with the app's rolldown after `npm ci`. An extract does not run it. |
| `integration/local-demo/recover-conservative.mjs` | Imports the same compiled entry. It is not part of normal startup. |

`static/` matches the RC5 production build: `index.html` SHA256 `e1d616038bae0d48e55fe3b73d6ef3f0b17281d757a1965c5a7abb47b35727df`. The UI source is unchanged.

## What startup does

The process binds `127.0.0.1` only. It creates the owner-code file with mode `0600`. That code is a one-time local owner sign-in, not an API key. The public page bootstrap is `server-disabled` with `localAdmin: true`. Admin AI is the header button. After sign-in, AI is disabled, the model is `gpt-6.1-sol`, the endpoint is not editable, and the key field is an empty password input. Startup makes no provider call.

Without `--original-budget-history`, paid reservation stays blocked (`ORIGINAL_BUDGET_HISTORY_REQUIRED`). Passing the provider-test history file loads the $40 ceiling, 40,000,000 micro-USD, and still leaves AI disabled and the credential unset.

## Other documented commands

`README.md` also documents `npm ci`, `npm test`, `npm run build`, `npm run dev`, and `npx vite preview`. Those are developer commands. `node_modules/` and `app/dist/` are not in the ZIP. `npm ci` installs the first, and `npm run build` creates the second. They do not name `server/localDemoServer.js`.

`docs/wp6/OPERATOR-RUNBOOK.md` describes later Admin clicks. It does not name a launcher file.

`docs/LOCAL-ADMIN-RUNBOOK.md` is the operator command above. Its historical USD20 paragraph describes the older certificate. The provider-test history file for this candidate is the $40 certificate, and it counts only when the owner passes it on the command.

Full regression on similar hardware stays `npm test -- --maxWorkers=4` from `app/` after `npm ci`.
