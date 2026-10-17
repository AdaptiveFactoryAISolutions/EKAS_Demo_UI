# Coordinator Phase 1 — diagnosis only

Independent Phase 1 review of frozen RC3. Identity was verified by the coordinator. Two install and test failures are diagnosed here. Neither fix is applied. Patrick decides whether to apply them. Product source `45568c575a00a8810b661929624995ec24e6de1e` is unchanged. The ZIP bytes are unchanged.

Status remains PENDING INDEPENDENT REVIEW. FIX count stays 0.

## 1. Identity

Accepted as verified: ZIP size and SHA256, comment `45568c5`, tree `b32f8287ce6bcf18e494de27d4882ba4d01b91b2`, 1,844 files match `RC3-MEMBERS.sha256`, dist manifest `b6fbf96c60ee3d1ccdb3eb8ffa4cd2e9bb664fcf9692c057a07f79e280652aaa`, no machine paths in `app/src`, e2e, or configs.

## 2. `npm ci` on npm 11.21.0

Reproduced outside the repo with `npx npm@11.21.0 ci --ignore-scripts` against copies of `app/package.json` and `app/package-lock.json`. Exit 1.

```
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
npm error Missing: lightningcss-android-arm64@1.33.0 from lock file
npm error Missing: lightningcss-darwin-arm64@1.33.0 from lock file
npm error Missing: lightningcss-darwin-x64@1.33.0 from lock file
npm error Missing: lightningcss-freebsd-x64@1.33.0 from lock file
npm error Missing: lightningcss-linux-arm-gnueabihf@1.33.0 from lock file
npm error Missing: lightningcss-linux-arm64-gnu@1.33.0 from lock file
npm error Missing: lightningcss-linux-arm64-musl@1.33.0 from lock file
npm error Missing: lightningcss-win32-arm64-msvc@1.33.0 from lock file
npm error Missing: lightningcss-win32-x64-msvc@1.33.0 from lock file
npm error Missing: @rolldown/binding-android-arm64@1.2.3 from lock file
npm error Missing: @rolldown/binding-darwin-arm64@1.2.3 from lock file
npm error Missing: @rolldown/binding-darwin-x64@1.2.3 from lock file
npm error Missing: @rolldown/binding-freebsd-x64@1.2.3 from lock file
npm error Missing: @rolldown/binding-linux-arm-gnueabihf@1.2.3 from lock file
npm error Missing: @rolldown/binding-linux-arm64-gnu@1.2.3 from lock file
npm error Missing: @rolldown/binding-linux-arm64-musl@1.2.3 from lock file
npm error Missing: @rolldown/binding-linux-ppc64-gnu@1.2.3 from lock file
npm error Missing: @rolldown/binding-linux-s390x-gnu@1.2.3 from lock file
npm error Missing: @rolldown/binding-openharmony-arm64@1.2.3 from lock file
npm error Missing: @rolldown/binding-win32-arm64-msvc@1.2.3 from lock file
npm error Missing: @rolldown/binding-win32-x64-msvc@1.2.3 from lock file
npm error Missing: fsevents@2.3.3 from lock file
```

The parent entries for `lightningcss@1.33.0`, `rolldown@1.2.3`, and Vite’s `fsevents` already list those optional dependencies. The lockfile only has `node_modules` entries for `lightningcss-linux-x64-gnu`, `lightningcss-linux-x64-musl`, `@rolldown/binding-linux-x64-gnu`, and `@rolldown/binding-linux-x64-musl`. npm 10 wrote the current platform. npm 11.21.0 requires every optional platform package to have a lock entry. npm 10.9.2 (coordinator) and npm 10.9.9 (this environment) both accept the current lockfile.

A blind `npm install --package-lock-only` on npm 11.21.0 is the wrong edit. A trial outside the repo added the 22 missing entries and deleted 75 existing optional-peer entries, including `jsdom@29.1.1` and `jspdf@4.2.1` and their trees. `package.json` did not change. Resolved versions of `vite@8.2.1`, `lightningcss@1.33.0`, `rolldown@1.2.3`, and `vitest@4.1.11` did not change. Those deletions are not part of the proposal.

### Proposed fix, not applied

Change only `app/package-lock.json`. Add the 22 missing `node_modules/<package>` entries, with the version, resolved URL, and integrity npm 11 already expects. Leave every existing entry as it is. Do not change `app/package.json`.

A trial lock with those 22 entries inserted, and nothing else changed, made `npm ci` on npm 11.21.0 exit 0. Current lock SHA256 is `f2d7342d320774352d59aa913ee5aff01090cc5a8898e383f0451011bfa8cced` (43,610 bytes). That hash would change. The trial serialization was 56,081 bytes, SHA256 `d519f5ee404350ed8cf099700fbf67d977e04c979abcf75e84b2101a5be30fb0`; the committed bytes still depend on the exact edit.

`vite build` of extracted `45568c5` against that npm 11 install produced the same 81-file dist manifest, `b6fbf96c60ee3d1ccdb3eb8ffa4cd2e9bb664fcf9692c057a07f79e280652aaa`, content diff 0. Product source hashes would not change. The server source tree `ac0386cb9c7ab462a154507b9f8d13331f0ceb50d3f849bac72732dc83442147` would not change. The frozen ZIP would not change, because it is not rebuilt.

Follow-on, also not applied: npm 11.21.0 `npm ci` still does not install optional peers that npm 10 installs from the same lock. `jsdom@29.1.1` is the one the suite needs (`@vitest-environment jsdom`). The production bundle did not need it to match the dist hash. If `npm test` must succeed on npm 11, pin `jsdom@29.1.1` as a devDependency. That would change `app/package.json` and the lockfile. It is a separate decision from clearing EUSAGE.

## 3. Vitest exit 1 with 2,952 passed

The extraction log recorded 2,952 passed, 0 failed, 496 files, process exit 0. A later full run on the same tests recorded the same counts and process exit 1. Both happened. The pass count is not a stable exit code.

The rejection:

```
ReferenceError: window is not defined
 ❯ resolveUpdatePriority node_modules/react-dom/cjs/react-dom-client.development.js:1308:7
 ❯ requestUpdateLane node_modules/react-dom/cjs/react-dom-client.development.js:16345:11
 ❯ dispatchSetState node_modules/react-dom/cjs/react-dom-client.development.js:9126:14
 ❯ send src/investigation/CanonicalWorkspace.tsx:58:709
```

Vitest attributes it to `src/server/v95SameDraftRecovery.test.tsx` because the promise was started while that file was the current test. Column 709 of line 58 is `setPending(false)` in the `finally` of `send`. React 19’s `resolveUpdatePriority` reads `window.event`. After the jsdom environment is gone, that read throws, and the throw is an unhandled rejection. Vitest 4 fails the process for that even when every assertion passed.

The test’s own `finally` is `await act(async () => root.unmount())`, then `host.remove()`, then `delete window.__EKAS_APPLICATION__`, then `vi.unstubAllGlobals()`. `vi.unstubAllGlobals()` only restores globals this process stubbed (`indexedDB` and `fetch` in this test). It does not remove `window`. `window` disappears when Vitest tears the jsdom environment down after the test returns, while `send` can still be settling. Run alone, the promise settles first and the process exits 0. Under a full-suite load it can settle after teardown.

### Proposed fix, not applied

Change only `app/src/server/v95SameDraftRecovery.test.tsx`. Drain the in-flight `send` while `window` still exists, then unmount, and return from the test only after that. Do not edit `CanonicalWorkspace.tsx`. A `typeof window` guard in the product component would change the production bundle. This proposal does not.

```javascript
} finally {
  await act(async () => {
    for (let n = 0; n < 20; n += 1) await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  });
  host.remove();
  delete (window as any).__EKAS_APPLICATION__;
  vi.unstubAllGlobals();
}
```

That file is one of the 99 files in the server source tree, so `ac0386cb9c7ab462a154507b9f8d13331f0ceb50d3f849bac72732dc83442147` would change. The git tree would change. Product investigation files would not change. Dist hashes would not change: the test is not in the production bundle. The frozen ZIP would not change.

## 4. README

The ZIP README at `45568c5` says `app/node_modules` is a tracked symlink and that the suite was 2,896 passed and 13 failed. The branch README no longer says 2,896 / 13. This docs pass removes the current-checkout symlink instruction, records the npm 10 pass and the npm 11 EUSAGE failure, and records that 2,952 / 2,952 is not a stable process exit of 0.

## 5. Frames

Recaptured on the production preview above. Catalog: `RC3-FRAME-INDEX.md`. Hashes: `RC3-FRAMES.sha256` (69 files). The ZIP still has zero `rc3-` frames.
