# EKAS DEMO RC2 identity

Status: **PENDING INDEPENDENT REVIEW**. RC2 is a test-only delta on frozen RC1. This file, the ZIP, the checkpoint frames, and the suite result were added after the archive, so branch HEAD moves past the RC2 SHA. The ZIP bytes stay the tree of `94517b4`. The register inside the ZIP does not yet name this ZIP hash.

RC1 is not mutated. RC1 Technical Gate: **PASS WITH ACCEPTED NON-BLOCKING RESIDUALS**. Human Gates: **OPEN**. Final Release: **NOT YET APPROVED**.

Patrick's decision, recorded verbatim:

"Residual regression disposition: 10 accepted as non-blocking for human acceptance. No P0/P1. Six are superseded historical-fixture expectations; two are superseded UI expectations; two are test-only machine-specific path defects. The machine-specific test dependencies must be removed before final release approval."

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC2 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `94517b4d43c04ea378ac71da1e141be4d0f0879e` |
| Git tree | `aa4438af4eff23ea4c10b701ad6d8934ff0f6c44` |
| ZIP path | `docs/wp6/EKAS-DEMO-RC2.zip` |
| ZIP size | 56,750,217 bytes |
| ZIP SHA256 | `86b20e3d41ece17d1e7fe9f6e04c47f58b5a310a47cee00122e40e9dd862002e` |
| ZIP members | 1,888 tracked entries, 0 symlinks |
| Member hashes | `docs/wp6/RC2-MEMBERS.sha256` |
| Prior RC1 source | `63ccec742c73b824c7c99c5ee1ba0a3e689801b6` |
| Prior RC1 ZIP SHA256 | `cf3ff8ce6bdda7068c21724761620a1e9245f315a1e285f6fadb649770d87e5a` |
| App lockfile SHA256 | `f2d7342d320774352d59aa913ee5aff01090cc5a8898e383f0451011bfa8cced` (`app/package-lock.json`, unchanged from RC1) |
| Root lockfile SHA256 | `0552c70c88efca5d9b1883ffa0f8040aa7963d66d13fef0d3b8da7edf61402cb` (`package-lock.json`, unchanged from RC1) |
| Server source tree SHA256 | `ac0386cb9c7ab462a154507b9f8d13331f0ceb50d3f849bac72732dc83442147` (unchanged: `git diff` of `app/src/server` from RC1 to RC2 is empty) |
| Build/static tree SHA256 | `e7a9f91fbeaa8d2910d6082e2d769a19a69f1e90cc5ff11566929494ece5391b` (unchanged: the rebuilt dist is byte-identical to the RC1 dist, 81 files, 0 mismatches) |
| Non-test product blob manifest | `e76bd60801cd17261979e3a75deca8f08ceb7b4b7fdd7c0a7611b83dcdc43a10` (635 blobs, identical at RC1 and RC2) |

The archive of `94517b4` includes `docs/wp6` because that evidence was already tracked. The product files that differ from RC1 commit `63ccec7` are the eight residual test files only.

## Built static files

Produced by `npm ci` then `npm run build` (`tsc --noEmit && vite build`) from the extracted RC2 archive. Each hash matches RC1.

| File | Bytes | SHA256 |
| --- | --- | --- |
| `dist/index.html` | 501 | `9ed8580011d00f551a2c6920346144efc4deeb563a7d63b10aab0d3857f45baa` |
| `dist/assets/index-CXppDvxO.js` | 27,583,255 | `ed8f64e4e0ff8d0e2fbbb2cb6dd4829dcf7e9a59edb16ea276c0784d16cac424` |
| `dist/assets/index-I9r_3K0-.css` | 178,154 | `d2ec9a8061b7230d5b0ea8365a8696964badba33cc4bd831bb94eed37c20be2a` |
| `dist/assets/service-DSP3pw8m.js` | 2,026,887 | `2c7f7ec4560e051fd97dba6dd3baf507f7819f894e218368369c8a2c163c77bf` |
| `dist/assets/workspace-C6-AwilM.js` | 1,396,356 | `47548990e7ae01714cbf02d43e6a0c61960c322bb84b98bc69a2d8984a16e974` |
| `dist/assets/mockRepository-yQ6uoDDv.js` | 807,323 | `c286fbdcd432d525f3cd1ecc1ce19f45fdccceb3abc9d615d06bfaad497c6e48` |
| `dist/assets/workspace-v8yMY0RW.css` | 51,473 | `ac2740974ba1e0dd2085267f887d05115e1582c882a8b029bfd3f87c60a9669f` |

## Extraction suite

One run, after creating the gitignored `evidence/` directory the historical proof writers expect. **2,943 passed, 0 failed.** Exit code 0. Details are in `REGRESSION.md`.

## Checkpoint

The mandatory rehearsal checkpoint was run on this build and was not corrected. See `16-REHEARSAL-GUIDE.md`.
