# EKAS DEMO RC1 identity

Status: **PENDING INDEPENDENT REVIEW**. This archive is frozen. A later correction is RC2. This file, the rest of `docs/wp6/`, and the later `reconciliation.wp6` note in `docs/FINAL-CLOSURE-REGISTER.json` were added after the archive, so branch HEAD moves past the RC1 SHA. The ZIP bytes stay the tree of the RC1 commit. The register inside the ZIP does not yet name this ZIP hash.

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC1 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `63ccec742c73b824c7c99c5ee1ba0a3e689801b6` |
| Git tree | `94ced2bbb22b2132c0a2811b584a952c4939fd98` |
| ZIP path | `docs/wp6/EKAS-DEMO-RC1.zip` |
| ZIP size | 26,443,698 bytes |
| ZIP SHA256 | `cf3ff8ce6bdda7068c21724761620a1e9245f315a1e285f6fadb649770d87e5a` |
| ZIP members | 1,798 tracked files, 0 symlinks |
| Member hashes | `docs/wp6/RC1-MEMBERS.sha256` |
| App lockfile SHA256 | `f2d7342d320774352d59aa913ee5aff01090cc5a8898e383f0451011bfa8cced` (`app/package-lock.json`, 43,610 bytes) |
| Root lockfile SHA256 | `0552c70c88efca5d9b1883ffa0f8040aa7963d66d13fef0d3b8da7edf61402cb` (`package-lock.json`, 2,192 bytes) |
| Server source tree SHA256 | `ac0386cb9c7ab462a154507b9f8d13331f0ceb50d3f849bac72732dc83442147` (99 files under `app/src/server`) |
| Build/static tree SHA256 | `e7a9f91fbeaa8d2910d6082e2d769a19a69f1e90cc5ff11566929494ece5391b` |

The demo server is TypeScript under `app/src/server`, started by `startLocalAiApplicationDemo`. There is no separate prebuilt server binary. The server-tree hash above is that source.

## Built static files

Produced by `npm ci` then `npm run build` (`tsc --noEmit && vite build`) from the extracted archive.

| File | Bytes | SHA256 |
| --- | --- | --- |
| `dist/index.html` | 501 | `9ed8580011d00f551a2c6920346144efc4deeb563a7d63b10aab0d3857f45baa` |
| `dist/assets/index-CXppDvxO.js` | 27,583,255 | `ed8f64e4e0ff8d0e2fbbb2cb6dd4829dcf7e9a59edb16ea276c0784d16cac424` |
| `dist/assets/index-I9r_3K0-.css` | 178,154 | `d2ec9a8061b7230d5b0ea8365a8696964badba33cc4bd831bb94eed37c20be2a` |
| `dist/assets/service-DSP3pw8m.js` | 2,026,887 | `2c7f7ec4560e051fd97dba6dd3baf507f7819f894e218368369c8a2c163c77bf` |
| `dist/assets/workspace-C6-AwilM.js` | 1,396,356 | `47548990e7ae01714cbf02d43e6a0c61960c322bb84b98bc69a2d8984a16e974` |
| `dist/assets/mockRepository-yQ6uoDDv.js` | 807,323 | `c286fbdcd432d525f3cd1ecc1ce19f45fdccceb3abc9d615d06bfaad497c6e48` |
| `dist/assets/workspace-v8yMY0RW.css` | 51,473 | `ac2740974ba1e0dd2085267f887d05115e1582c882a8b029bfd3f87c60a9669f` |

Vite reported large chunks and an ineffective dynamic import of `service.ts`. The build exited 0.

## What the archive excludes

`node_modules`, the gitignored `evidence/` directory, and the untracked `e2e/shell-case.spec.ts`. The extraction contained one hidden file, `.gitignore`, which is tracked. No machine-local symlink was in the archive.

## Evidence locations

Browser proof: `docs/wp6/screenshots/` and `docs/wp6/SCREENSHOT-CATALOG.md`.
Master phrases: `docs/wp6/master-journey.json`.
Zoom measurement: `docs/wp6/zoom-measurement.json`.
Regression: `docs/wp6/REGRESSION.md`.
