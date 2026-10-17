# RC5 test-runner limit

RC5 product source and `docs/wp6/EKAS-DEMO-RC5.zip` stay frozen. This note is release documentation only. It does not change the candidate, and it is not a reason to cut RC6.

Independent qualification of RC5 passed: six fresh full-suite runs with `--maxWorkers=4` (three on npm 10, three on npm 11). Each run was 2,962 passed, 498 files, process exit 0. A fresh extract creates `evidence/` itself.

On a machine with about 15 GB of memory, an uncapped full-suite run may exhaust memory. That is a test-runner resource condition. It is not a product failure.

**MAXIMUM TEST WORKERS = 4** for full regression on similar hardware.

```bash
npm test -- --maxWorkers=4
```

Run that command from `app/` after `npm ci`. Do not run two full suites at the same time.
