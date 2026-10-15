# V10 recovery confirmation candidate

Provisional; independent browser acceptance pending. V9 remains served and immutable. No browser or storage operation was performed by this builder.

The only active native window.confirm call was recovery reset. It is replaced by an in-app alertdialog with Cancel, Escape, initial Cancel focus, focus return and explicit backup acknowledgement. Reset stays disabled until a backup download request succeeds and the user acknowledges retaining it. The current training snapshot must match that backup before reset. Namespace-scoped removal uses the existing rollback helper. Export errors, changed data and removal errors preserve data or roll back; no silent deletion.

V9 independent blocker: native prompt handling timed out; first reset incomplete, second outcome unknown. Parent is coordinating manual prompt dismissal. Backup task3/evidence/v9/V9-before-deliberate-recovery-backup.json is retained: 91862 bytes, SHA256 006e01d252b3e4e3062d3a7636d458a0631b822c94d6664407cd6a091ccf7158.

326 tests across 72 files pass; production build passes. Seven added tests cover cancellation, focus, export/ack gating, exact backup contents, namespace isolation, export failure, changed data and removal rollback. These are automated source checks, not native browser acceptance. Fixed Dark theme, manufacturing truth, fixtures and integration boundaries remain unchanged.
