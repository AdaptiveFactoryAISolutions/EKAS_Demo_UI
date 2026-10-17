# RC3 package size

RC1 `EKAS-DEMO-RC1.zip` is 26,443,698 bytes. RC2 `EKAS-DEMO-RC2.zip` is 56,750,217 bytes. The growth is the previous release archive nested inside the next git archive, not `node_modules`, a Playwright report, or a second build.

## What is inside the RC2 archive

Uncompressed members, largest first:

| Uncompressed | Member |
|---:|---|
| 26.44 MB | `docs/wp6/EKAS-DEMO-RC1.zip` |
| 10.53 MB | `app/inputs/negative-outcomes-v56.json` |
| 7.41 MB | `app/inputs/speed-investigation-v1.json` |
| 5.85 MB | `app/inputs/quality-investigation-v1.json` |
| 2.64 MB | `docs/capability-audit/METRIC-CAPABILITY-AUDIT.json` |
| 2.52 MB | `docs/working-drafts/ORIGINAL-351-BYTE-EXACT.json` |
| 2.52 MB | `docs/V65-ORIGINAL-351-HISTORICAL-REGISTER.json` |

The rest of the tracked tree is source, fixtures, and evidence. `node_modules`, `app/dist`, Playwright HTML reports, and temporary profiles are not tracked and were not in the archive. `docs/wp6/screenshots` is about 5.27 MB across 70 files. Those frames are the browser evidence for RC1 and RC2. They stay.

RC1 itself did not contain `docs/wp6`, so it did not contain a previous zip. RC2 was a git archive of a commit that already tracked `EKAS-DEMO-RC1.zip`. A compressed zip does not compress again, so the package grew by about the full RC1 file plus the new `docs/wp6` evidence.

## What RC3 packaging leaves out

The RC3 archive is a git archive of the RC3 source commit with two path exclusions:

- `docs/wp6/EKAS-DEMO-RC1.zip`
- `docs/wp6/EKAS-DEMO-RC2.zip`

Those files stay in git history and in the repository. They are the frozen RC1 and RC2 packages. Nesting them again would make RC3 carry both previous packages and grow by another ~57 MB. No source fixture, screenshot, or closure record is removed to make the package smaller.

Required fixture JSON files above remain in the archive. They are inputs the product and the suite read.

## Measured RC3 archive

`docs/wp6/EKAS-DEMO-RC3.zip` is a git archive of `45568c575a00a8810b661929624995ec24e6de1e` with the two exclusions above. It is 31,634,629 bytes. SHA256 `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14`. 1,903 entries (1,844 files and 59 directories), 0 symlinks, 0 nested `.zip` members, no `node_modules`, and no `app/dist`. Member hashes are `docs/wp6/RC3-MEMBERS.sha256`.

Largest uncompressed members are the same required fixtures: `app/inputs/negative-outcomes-v56.json` (10.53 MB), `app/inputs/speed-investigation-v1.json` (7.41 MB), `app/inputs/quality-investigation-v1.json` (5.85 MB), then the capability-audit and historical census JSON. `docs/wp6/screenshots` is about 5.27 MB across 70 files in this archive (the RC3 frames were added after the archive). Those screenshots stay.
