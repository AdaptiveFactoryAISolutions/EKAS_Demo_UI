# Phase 18 — final independent reviewer packet

Status: **PENDING**. This packet lists what the independent reviewer receives. It does not contain VERDICT: APPROVE. The authors of the build do not approve it.

## Artifact

| Item | Value |
| --- | --- |
| RC3 source | `45568c575a00a8810b661929624995ec24e6de1e` |
| Git tree | `b32f8287ce6bcf18e494de27d4882ba4d01b91b2` |
| ZIP | `docs/wp6/EKAS-DEMO-RC3.zip` |
| ZIP size | 31,634,629 bytes |
| ZIP SHA256 | `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` |
| Fresh extraction suite | 2,952 passed, 0 failed, 496 files |
| RC2 | Frozen at `94517b4d43c04ea378ac71da1e141be4d0f0879e` |
| RC1 | Frozen at `63ccec742c73b824c7c99c5ee1ba0a3e689801b6` |

## What the reviewer checks

- Regression result on a fresh extraction
- Browser frames for the referent, timestamps, shell, dashboards, and journeys
- Provider test, which is not run on RC3 because the $40 ceiling cannot be enforced without a source change
- Phase 8 rehearsal result
- Phase 9 engineering verdict
- Wiki completeness
- UI API contract
- Backend gap report
- Deferred list, including the production backend contract and the provider ceiling

## Required verdict

The reviewer writes **VERDICT: APPROVE** only if those inputs support it. Any other outcome stays pending. Self-approval is not a verdict.

Demo Complete is not claimed. Adapter Verified remains **NO**. Live Integration Verified remains **NO**.
