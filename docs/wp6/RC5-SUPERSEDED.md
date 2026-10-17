# RC5 superseded

RC5 remains frozen and unchanged. Independent verification of the frozen ZIP found that the documented portable Admin launcher cannot start. RC6 supersedes RC5. This note does not edit `RC5-IDENTITY.md`, `EKAS-DEMO-RC5.zip`, or the RC5 member list.

| Item | Value |
| --- | --- |
| RC5 source | `f513cd6e068c758d0443aeec8c3410f88a848d4b` |
| RC5 tree | `64438f893ec4d3d7bebb878bf839ad1e0a4274ea` |
| RC5 ZIP | `docs/wp6/EKAS-DEMO-RC5.zip` |
| RC5 ZIP size | 36,962,811 bytes |
| RC5 ZIP SHA256 | `42d9cd0b1de878e68886e457dbe4f4fe4258711fdb7c043d9a9d00d96b023222` |
| Successor | RC6 source `17b19f555ad446d9f34e89289ef761c29d7aacf9` |

A clean extract of RC5 ran:

```bash
node integration/local-demo/start.mjs \
  --port 18330 \
  --state ~/EKAS-RC5-private/workspace.json \
  --owner-code ~/EKAS-RC5-private/owner-code
```

Node reported `ERR_MODULE_NOT_FOUND`. The launcher imports `server/localDemoServer.js`. The archive contains `app/src/server/localDemoServer.ts` and does not contain that compiled file, `static/`, `node_modules/`, or `app/dist/`. RC5 is not self-contained for the documented Admin/provider startup path.

RC4 ZIP `731974e63702a5f52f0943b0bc2a618e44e9f62afd679be3c5caf214945a94c4` and RC3 ZIP `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` stay unchanged.

RC6 is not frozen. One npm 10 full suite exited 1 after 2,962 passed tests. See `RC6-IDENTITY.md`.
