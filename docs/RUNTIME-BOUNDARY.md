# V9 current scope

Dark theme only; display-name and density changes are supported. V8 palette additions are removed, with its prior package preserved. See V9-SCOPE-ALIGNMENT.md. Native E2E acceptance remains pending.

# V8 runtime status

V8 is not deployed. Current served candidate remains V7. Native acceptance remains incomplete; reviewer tab1801475978 recovered, reset unverified. Captures115–162 are quarantined. V8 requires explicit semantic recovery for untagged older workspace state; it never silently migrates historical titles/queries/captures. See V8-REPAIR-HANDOFF.md.

# Executable local boundary and integration handoff

The browser runs an offline in-process mock transport, not a live backend. `EkasClient` records full typed request/response traces and timing. `MockService` owns exact resource/result IDs, timestamps, idempotency, optimistic versions and simulated scope. `TrainingTransport` adds context conversations and explicit arithmetic cohorts. UI workspace mutations use a separately documented synchronous atomic snapshot extension; this is not claimed to implement the pilot REST contract. Export API traces includes both transports.

| Operation | Implemented local behavior | Production handoff |
|---|---|---|
| POST /api/v1/query | Versioned metric, context, UTC window, pagination; persisted canonical result; finite seed joins; missing values distinct from zero | Engineer supplies approved operand policies and authenticated permitted source |
| GET /api/v1/results/:id | Exact historical snapshot, original timestamp/cutoff/units/source IDs | Persist server snapshots and enforce permissions |
| POST /api/v1/conversations | Validated saved initial context | Map explicitly to source-bound pilot client only after contract agreement |
| POST /api/v1/conversations/:id/messages | One to12 explicit questions, server context inheritance, idempotent turns, synthetic candidate without certification | Production interpretation/clarification, evidence authority and certification belong to service |
| POST /api/v1/arithmetic | Bounded edited assumptions, explicit independent cohort binding; 178 formulas | Arithmetic is not observed data or eligibility qualification |
| /api/v1/resources/:kind/:id | Owned/scoped CRUD, expectedVersion, exact identity, local audit semantics | Domain-specific production policy/authorization required |
| workspace.patch | Versioned local snapshot, validate before write; conflict refuses overwrite | Proposed extension; engineer should replace snapshot persistence with approved domain transactions |
| Native Board view save | Exact semantic query/cohort signature; layout plus Grid ordering only | Chart unit/range/source definitions remain governed |

Persisted UI clients share one repository. Another browser session changing its snapshot causes an explicit persistence failure rather than a silent overwrite. Corrupt service data remains exportable and blocks calculations/mutations until explicit recovery. Backup contains only training workspace/service/layout keys and is validated before restore; failed writes attempt rollback. Northworks storage is separate.

All accounts, invitations, shares, permissions, actions, monitors, schedules, webhooks and syncs are local simulations. Nothing is dispatched, granted, trained, booked or financially certified. Authorization records a decision; it does not prove an intervention. Local scope enforcement is presentation behavior, not security authority.

The v2 source adapter is read-only derived from fe2635cef64cf99eccad6c84df82bff466cb46df and is exercised with wire-shape fixtures. It is not used to claim production compatibility, authentication, signed evidence verification or GLiDE readiness. Source identities and mapping are in V2-SOURCE-IDENTITY.json and PILOT-ADAPTER-MAPPING.md. No legacy repository is required to launch this package.


Current v2 integration delta and measured boundaries supersede earlier unimplemented-caller statements: see API-ACCEPTANCE-DELTA.md and EXPANSION-STATUS.md. Pilot RFC3339 permits0–6fractional digits and UTC offsets with exact microsecond comparison; local stored DTO timestamps retain strict UTC millisecond admission. Positive178-definition API/React-control coverage and12refusal cases pass owner tests. No hands-on/native or production acceptance is inferred. Old pending request is unavailable/expired, not a confirmed grant.

## V4 provenance and V5 amendment

V4 provenance is retained below. V5 adds the captured-view correction and this supplemental handoff; its authoritative source/build hashes are in the packaged freeze-manifest.json. ZIP SHA256 `894eb7bebbafeb2c2bd05b108ae375497192b4c9d147630267aa0e6380806212`; source `e2f8ba4583288d22c50a50f2317bc87451efd31de9ea7d0ddb11e23649343786`; build `4eabfe43ab7c41023095e1b68b4b9e731546b3e924fe272f0208cba5789cd284`. Library `libfile_813fc8fc1dd88191b5d6c3e62d179b14`, version0. These edits leave the immutable V4 archive unchanged and are included in the new V5 package. Owner validation:270tests/60files,111 supplied integrity cases and178 positive baselines pass; independent V4 source review passed these checks and identified the captured-view defect corrected in V5. V5 owner validation is275tests/62files; independent V5 acceptance remains pending. Browser/native, offline exports, performance and two-hour rehearsal remain unaccepted.

## Deployment, reset and recovery procedure

Static launch: safely extract EKAS_INTEGRATION_REVIEW_V9.zip; verify freeze-manifest.json paths and SHA256s; from extracted root run `python3 serve.py --port 18201`. Package route `/ekas/` defaults to the retained template workspace with full header/sidebar. Northworks opens using the visible Northworks conversation button or `?suite=northworks`, inside the same template shell. `?suite=workspace` remains a compatible training link. Stop with Ctrl+C. Python3/modern browser suffice for the bundled build; no private repository, backend or npm installation is needed at runtime. Existing review staging remains `/ekas-review/` on localhost18191. Packaging instructions do not authorize a new origin/port/browser to bypass blocked browser checks. Keep accepted Main and all prior freezes unchanged.

Editable app source and package-lock.json are included. A future engineer rebuild uses locked public dependencies and `npm run build`/`npm test`; package licenses require separate entitlement assessment, with no paid entitlement asserted. Historical V4 portable extraction reproduced270tests using already-installed matching public packages; V5 portable extraction verified258manifest hashes, TypeScript and all five captured-view regressions without installation. No deployment to external hosting is authorized or performed. Bundled chart exporting is configured local with no export-server fallback; actual runtime/network/export behavior still needs permitted independent inspection.

Training UI: expand **Local backup and recovery**, select **Export training backup**, retain EKAS-training-backup.json and API traces, then **Backup and reset training** only for an intentionally disposable training workspace. Reset downloads a backup, removes only matching training workspace/service/layout keys and reloads. It does not reset Northworks. Browser download success and storage removal/reload require native verification; retain a separately verified export before reset. Do not manually clear all site data or use this as production deletion/recovery.

Restore using **Restore training backup** at the original origin and matching storage namespace/path. File≤20MB, schemaVersion1, fixtureVersion training-plant-v1, synthetic flag and every workspace/service/layout entry validate before write. Foreign keys/namespaces are refused. Layout signatures preserve cohort binding. Restore replaces only matching keys and reloads; write failure attempts rollback, and blocked rollback reports that explicitly. Retain backup and inspect state before further writes; do not claim recovery from a success toast alone. Different ports are separate browser origins; different review paths can carry different key prefixes. Automatic namespace migration is not implemented.

If another session changes persisted snapshot, stop conflicting edits, export both sessions' evidence and reload latest before retry; do not overwrite silently. Corrupt service records block calculations/mutations and remain exportable. Prefer validated same-namespace restore; use training-only reset only after retaining evidence. Storage-blocked writes/rollback cannot be repaired by this local service. Capture exact error and environment for engineer review. Schedules run only on explicit Run now, webhook events remain simulated_not_dispatched, security rules are local presentation simulation. Production deployment/recovery needs approved authentication, server transactions, retention, backups and GLiDE adapter; those are proposed integration work.

V5 correction: Open captured view is an explicitly read-only original snapshot, never a different-site requery. Current site restriction must authorize the original site-restricted scope; formerly broad aggregates are withheld under narrower access. Stricter current masking conservatively withholds the full snapshot and export (including derived values/evidence); relaxing controls never removes historical masking. Original query/site/result/time/rows remain intact. Edit local copy with current controls is explicitly a new working query. This is local simulated policy, not production authentication.

V6 entry correction: original template default rendered Console; V5 incorrectly required suite=workspace for that shell. V6 removes this gate. Original Insights/Data/Develop/Admin header, library search, actions, secondary links, grouped220px desktop sidebar and mobile Menu remain present around both template screens and explicit Northworks. Navigation exits Northworks to the selected functional template screen. Deep links and history restoration retain the shell. Original IBM Plex Sans/Mono fallback stacks and muted/info tokens restored; no font asset was supplied in original project, and no remote font URL is introduced. Exact rendered typography/mobile layout remains unverified. Accepted Main unchanged.

V6 served entry: bare http://localhost:18191/ opens /ekas-review/ with the retained template shell by default; protected /ekas/ remains accepted Main. Old bare-root Northworks entry preserved at /baseline/ with original index/assets. Explicit suite=northworks and legacy case deep links render Northworks inside the template shell. This is authorized default UI routing correction; no browser operation or permission bypass.


V7 font/CSS assets: IBM Plex Sans400/600/700 and Mono400 are bundled with official OFL licence and provenance hashes. Scoped Tailwind4.3.3 CSS is compiled into editable source; optional regeneration uses public compiler packages. Runtime requires no remote font or CSS service. Chrome access is approved; independent full native acceptance remains pending.
