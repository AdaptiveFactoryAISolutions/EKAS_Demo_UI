# EKAS_Demo_UI
UI source for EKAS demo

## Run this checkout

The app lives in `app/`. `app/node_modules` is a tracked symlink to a machine-local path. `npm ci` will not replace that symlink, so a clean checkout removes it before installing.

```bash
rm -f app/node_modules
cd app
npm ci
npm run build
npm test
npm run dev
```

`npm run dev` serves the local demo at `http://127.0.0.1:18191/`.

Recorded on this checkout after that install, on 2026-10-15:

- `npm run build` completes (`tsc --noEmit` and `vite build`).
- `npm test` (`vitest run`): 491 files, 2896 passed, 13 failed. The failures are existing platform and investigation regressions (`v91DecisionSwitch`, `clientCoverage`, `independentIntegrityMatrix`, `negativeGates`, `positiveCoverage`, `positiveIntegrityDiagnostics`, retained `negativeUi` / `positiveUi` / `workflowActions`, `v102HealthCaseTransitionRegression`, `v102MeasurementCaseTransitionRegression`, `v103GenealogyRoot`). They are not a development gate. Targeted tests are used while fixing; one full regression runs at release-candidate freeze.

Browser regressions use the installed Google Chrome and the already running dev server:

```bash
npm ci
npx playwright test
```

`e2e/trust-failures.spec.ts` asserts the trust behavior and is red on this candidate. `e2e/journey-smoke.spec.ts` is the lightweight manufacturing journey.
