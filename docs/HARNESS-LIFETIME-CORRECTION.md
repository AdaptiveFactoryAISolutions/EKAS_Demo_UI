# Compiled harness reliability correction — validation in progress

Application remains exact711b7027; served18352/data and live18329 were not edited. Original498pass3fail broad attempt, all focused retries and the failed e9b controlled-target attempt remain intact.

Confirmed harness defect: direct-helper registered no unconditional test-completion cleanup. Vitest deadline rejection did not stop its asynchronous body or close its server. Filesystem timestamps and the deterministic actual-deadline regression show the following case began while the preceding fixture still accepted and committed work.

Product characterization before correction: manually disconnecting the real compiled synthetic server cancelled delayed work with no late conversation commit. This distinguishes missing harness lifecycle ownership from a demonstrated product cancellation defect.

Isolated correction: direct-helper now registers onTestFinished before awaiting startup for test-owned fixtures; shared beforeAll fixtures retain their original afterAll ownership. It aborts fixture requests, refuses late calls, closes the listener, awaits tracked request-handler promises, and releases closed-server request-listener references. Lifecycle records contain only test ownership/time/count/memory metadata.

Additional confirmed harness resource problem: Vite was re-transforming the already-built33,199,105byte Node ESM server bundle. The controlled same7case diagnostic comparison changed only supported test.server.deps.external handling of that bundle. Existing helper/test/baseconfig/assertions/30second deadlines were unchanged. VM-loader target:5pass2fail,170.37seconds, about3.48GiBpeak childRSS. Native-Node loader:7pass0fail,63.09seconds, about1.46GiBpeak. The compiled artifact now runs through its intended Node ESM loader, not through a second Vite transform. No browser-policy bypass or native UI acceptance is involved.

Specific original slowdown/socket-reset causes are not uniquely reconstructed. The confirmed timeout-lifetime defect is fixed; loader resource amplification is measured. Do not claim every historical error has one proven cause or retrospectively mark the first broad run clean.

Files: evidence/lifetime-corrected-711b/direct-helper.ts; native-compiled-module.config.mts; generated native-*.config.mts execution overlays; owned-timeout-lifecycle.test.ts and its config; run-native-lifetime-validation.py. All original acceptance .test.ts and base .config bytes are preserved. No deadline/assertion/fixture/manufacturing-semantic change.

The separate metatest deliberately produces one timeout and requires both cleanup/cancellation checks to pass. It is excluded from the501acceptance cases. Current complete run executes all20groups afresh, with no isolated-retry substitution. Full terminal result remains pending.

Harness SHA256: 9deaefc4990f21907907f2cb9610bc93c1ab2aee4a03185430bcc7fe63bde580

No release freeze, packaging or final-ready claim. Native browser service remains policy-blocked; Patrick's independently initiated review may continue on unchanged18352.

The first native-loader full attempt (harness9deaefc4) completed19groups/140passes but skipped361assertions after a harness setup error: onTestFinished cannot be registered from beforeAll. This attempt is retained and is not a clean501pass. A separate lifetime-suite-corrected-711b harness checks getCurrentTest before registering per-test cleanup, preserving the original suite afterAll cleanup. A fresh full run is in progress; no retry union substitutes for it.

Terminal fresh full run: harness922124844bff1a3cd031eb33fa2b9fb65c5a43d59a8fe95e16097a4666dee2c8 completed20groups/all501identities,499passed/2failed/process1. Metric361/361passed. Speed and quality diagnostic recurrence exceeded original30s deadlines.82closedevents/0pendinghandlers/0cross-testoverlap. App711source unchanged. No acceptance retry union. Separate CPU profiling is diagnostic only; no release-ready claim.

Subsequent isolated product correction f2b1292c removes two redundant full-state staging clones, retaining full fingerprints/validation/durability. Measured evidence in RECURRENCE-RUNTIME-MEASUREMENTS.md. Fresh full501/501/process0/20groups passed2026-10-15 17:53UTC, all original assertions/deadlines preserved. Original711b499/2 remains retained and preview18352 remains unchanged. Candidate requires parent native review/promotion.
