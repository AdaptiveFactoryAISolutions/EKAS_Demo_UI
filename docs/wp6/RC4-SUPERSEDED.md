# RC4 superseded

RC4 remains frozen and unchanged. Qualification found two release-engineering defects. RC5 supersedes RC4. This note does not edit `RC4-IDENTITY.md`, `EKAS-DEMO-RC4.zip`, or the RC4 member list.

| Item | Value |
| --- | --- |
| RC4 source | `38f73c3679eb173e6847a7569128793d97e42b5d` |
| RC4 tree | `6ad243c949b6dd3ad23f5c644e6e40b125b2aa9c` |
| RC4 ZIP | `docs/wp6/EKAS-DEMO-RC4.zip` |
| RC4 ZIP size | 36,597,396 bytes |
| RC4 ZIP SHA256 | `731974e63702a5f52f0943b0bc2a618e44e9f62afd679be3c5caf214945a94c4` |
| Successor | RC5 source `f513cd6e068c758d0443aeec8c3410f88a848d4b` |

1. A fresh npm 11.21.0 extraction passed 2,962/2,962 tests and the process exited 1. The unhandled rejection was `ReferenceError: window is not defined` from `CanonicalWorkspace.tsx:58` `setPending`, attributed to `normalOuterGuideRevision.test.tsx`. RC4 only drained that update inside `v95SameDraftRecovery.test.tsx`.
2. A fresh ZIP extraction failed 11 proof tests because they write `../evidence/`, and that directory is not shipped.

RC3 source `45568c575a00a8810b661929624995ec24e6de1e` and ZIP `aa80bc8e551c68b4b7b897b87f72b0d56004a2203f388005cfe5ffc03e839b14` stay unchanged.
