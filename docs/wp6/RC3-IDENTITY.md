# EKAS DEMO RC3 identity

Status: **PENDING INDEPENDENT REVIEW**. RC2 stays frozen. RC3 is a new source commit that corrects the Investigate-it referent and the plant-facing timestamp presentation. This file, the ZIP, the checkpoint frames, and the suite result were added after the archive, so branch HEAD moves past the RC3 SHA. The ZIP bytes are the tree of `45568c5` with the nested RC1 and RC2 zip binaries excluded. The register inside the ZIP does not yet name this ZIP hash.

RC1 is not mutated. RC2 is not mutated. RC1 Technical Gate: **PASS WITH ACCEPTED NON-BLOCKING RESIDUALS**. Human Gates: **OPEN**. Final Release: **NOT YET APPROVED**.

| Item | Value |
| --- | --- |
| Name | EKAS DEMO RC3 |
| Branch | `cursor/wp1-trust-baseline-32ee` |
| Source HEAD | `45568c575a00a8810b661929624995ec24e6de1e` |
| Git tree | `b32f8287ce6bcf18e494de27d4882ba4d01b91b2` |
| ZIP path | `docs/wp6/EKAS-DEMO-RC3.zip` |
| ZIP size | 31,634,629 bytes |
| ZIP SHA256 | `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` |
| ZIP members | 1,903 entries (1,844 files, 59 directories), 0 symlinks |
| Member hashes | `docs/wp6/RC3-MEMBERS.sha256` |
| Archive exclusions | `docs/wp6/EKAS-DEMO-RC1.zip`, `docs/wp6/EKAS-DEMO-RC2.zip` (both remain in git) |
| Prior RC2 source | `94517b4d43c04ea378ac71da1e141be4d0f0879e` |
| Prior RC2 ZIP SHA256 | `86b20e3d41ece17d1e7fe9f6e04c47f58b5a310a47cee00122e40e9dd862002e` |
| App lockfile SHA256 | `f2d7342d320774352d59aa913ee5aff01090cc5a8898e383f0451011bfa8cced` (`app/package-lock.json`, unchanged from RC1) |
| Root lockfile SHA256 | `0552c70c88efca5d9b1883ffa0f8040aa7963d66d13fef0d3b8da7edf61402cb` (`package-lock.json`, unchanged from RC1) |
| Server source tree SHA256 | `ac0386cb9c7ab462a154507b9f8d13331f0ceb50d3f849bac72732dc83442147` (unchanged: `git diff` of `app/src/server` from RC2 to RC3 is empty) |

Product files that differ from RC2 commit `94517b4` are only:

- `app/src/investigation/conversation.ts`
- `app/src/investigation/service.ts`
- `app/src/investigation/Replies.tsx`
- `app/src/investigation/plantPresentation.ts`

The directive is `docs/wp6/RC3-REFERENT.md`. The engineering page is `docs/wiki/build-method-engineering-quality-and-known-risks.md`.

## Built static files

Produced by `npm ci` then `npm run build` (`tsc --noEmit && vite build`) from the extracted RC3 archive. Exit 0. 81 files. The CSS bundles and `mockRepository` match the RC1/RC2 hashes. `index.html` and the three application JavaScript bundles differ because the referent and timestamp source changed. The sorted `sha256  size  path` manifest of all 81 dist files hashes to `b6fbf96c60ee3d1ccdb3eb8ffa4cd2e9bb664fcf9692c057a07f79e280652aaa`.

| File | Bytes | SHA256 |
| --- | --- | --- |
| `dist/index.html` | 501 | `3931cf62ab6ebcf1af983f5e5928294c6a5d9ec2210a7c65a510cdc88abc66fa` |
| `dist/assets/index-BPmGTAh0.js` | 27,586,522 | `9c4ef0610c6101ed59bb335076f28f274ed41cfbb1a0bdefbd5d0a5cb9df1135` |
| `dist/assets/index-I9r_3K0-.css` | 178,154 | `d2ec9a8061b7230d5b0ea8365a8696964badba33cc4bd831bb94eed37c20be2a` |
| `dist/assets/service-CKwwMSKS.js` | 2,026,975 | `894bb53a8d1d93edc7e6d24133a2425500f129f74a6490e0d03258fbb2acc58d` |
| `dist/assets/workspace-Y1UbySm3.js` | 1,396,435 | `722625978cde111ebd6525ca9c310c9da1a57f7cbe53ca5fb8fa5e1dc60fc9de` |
| `dist/assets/mockRepository-yQ6uoDDv.js` | 807,323 | `c286fbdcd432d525f3cd1ecc1ce19f45fdccceb3abc9d615d06bfaad497c6e48` |
| `dist/assets/workspace-v8yMY0RW.css` | 51,473 | `ac2740974ba1e0dd2085267f887d05115e1582c882a8b029bfd3f87c60a9669f` |

## Extraction suite

One run, after creating the gitignored `evidence/` directory. **2,952 passed, 0 failed, 496 files.** Exit code 0. Started 2026-10-17T00:15:18Z. Duration 467.90s. Details are in `REGRESSION.md`.

The eight referent tests in `rcReferent.test.ts` passed on that extraction, plus the policy-7 replay that still clarifies a bare pronoun.

## Checkpoint

Clean Chrome profile against this build at `http://127.0.0.1:18195`. “Investigate it.” opened the Northworks feeder-jam plan miss (150 good units, Line 03 contribution 138). Normal quality-gap text shows `Oct 6, 2026 · 2:45 PM`. Technical details keep `2026-10-06T14:45:00Z`. See `16-REHEARSAL-GUIDE.md`. This is not the unaided human rehearsal.

## Provider

Provider readiness: **NOT READY**. The real provider was not run. Saved pricing expires `2026-10-16T00:00:00Z` and the runtime refuses a live call with `AI_PRICING_EXPIRED`. The build can select only `gpt-6.1-sol`. The connected original budget history is not present, so the spend guard is not an authorized remaining test budget. Patrick refreshes model availability, current pricing, and the authorized test budget before any Admin Test connection.
