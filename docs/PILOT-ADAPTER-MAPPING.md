# Engineer adapter specification — V4

Read-only v2 baseline HEAD `fe2635cef64cf99eccad6c84df82bff466cb46df`; consulted hashes in V2-SOURCE-IDENTITY.json. No legacy code execution, default HTTP transport, bearer issuance, signed evidence verification or live GLiDE connection is implemented. The standalone package needs no legacy repository.

| Existing v2 route | Implemented source-derived adapter contract | Engineer responsibility |
|---|---|---|
| POST /v1/conversations | No message body; validates conversation_id and created_at | Inject authenticated approved wire; bind tenant/principal server-side |
| GET /v1/conversations | Validates conversations and identities/timestamps | Authorization, pagination and retention contract |
| GET /v1/conversations/:id/turns | Exact encoded conversation ID; validates stored turn fields and nonnull payloads | Enforce current ownership/scope and deleted/revoked evidence behavior |
| POST /v1/conversations/:id/messages | Exactly one text (≤4000), structured_request(metric,machine,window), or clarification_answer(exact ID,value); preserves Idempotency-Key | Durable replay/conflict policy, context inheritance, clarification and interpretation authority |
| GET /v1/evidence/sha256:… | Exact64hex identity; checks certification ID/verdict/time, refs/hashes/lineage arrays | Cryptographic verification, accessible source versions and certification authority |

See app/src/platform/pilotAdapter.ts for authoritative DTOs. CLARIFICATION_REQUIRED preserves exact clarification identity and unique choices; COMPLETED checks required certified result, nonnegative exact fraction syntax, machine/context binding, ordered window and evidence reference. RFC3339 accepts0–6fractional digits and offsets; comparisons retain microseconds. Narrative is forbidden. Optional additive blocks are retained, not fully validated. Typed error envelope requires error_class/error_code/message; optional retryable must be boolean. Production enum completeness, optional-block validation and cryptographic trust are outstanding. Transport traces may contain source content: engineer must define redaction/retention before production.

The installed frontend instead uses injected in-process `EkasClient`/`TrainingTransport` and `ekas-proposed-v1` /api/v1 extensions (RUNTIME-BOUNDARY.md). Do not rename these routes to /v1 or treat proposed metric/resource/arithmetic/workspace DTOs as existing v2 compatibility. Pilot wire fixtures prove normalization only. No synthetic persona is a bearer credential.

Integration sequence: pin approved backend revision/schema; agree metric, units, half-open windows, ISA95/site/line/part/revision/job and cohort mapping; implement authenticated wire and server policy; validate optional domain blocks; compare exact baseline known answers and refusal/error envelopes; replay same idempotency key after uncertain response only after state inspection; test permissions/revocation/context/revision conflicts; then independently accept native UI and deployment. Controlled document release, EC/PM/CMMS dispatch, performed-work evidence, safety approval and finance validation need explicit domain transactions, not generic CRUD. Engineer owns GLiDE integration and production policies.

Fifteen metric convention policies remain proposed. Neither production compatibility nor readiness follows from local270-test success.

## V4 provenance and V5 amendment

V4 provenance is retained below. V5 adds the captured-view correction and this supplemental handoff; its authoritative source/build hashes are in the packaged freeze-manifest.json. ZIP SHA256 `894eb7bebbafeb2c2bd05b108ae375497192b4c9d147630267aa0e6380806212`; source `e2f8ba4583288d22c50a50f2317bc87451efd31de9ea7d0ddb11e23649343786`; build `4eabfe43ab7c41023095e1b68b4b9e731546b3e924fe272f0208cba5789cd284`. Library `libfile_813fc8fc1dd88191b5d6c3e62d179b14`, version0. These edits leave the immutable V4 archive unchanged and are included in the new V5 package. Owner validation:270tests/60files,111 supplied integrity cases and178 positive baselines pass; independent V4 source review passed these checks and identified the captured-view defect corrected in V5. V5 owner validation is275tests/62files; independent V5 acceptance remains pending. Browser/native, offline exports, performance and two-hour rehearsal remain unaccepted.
