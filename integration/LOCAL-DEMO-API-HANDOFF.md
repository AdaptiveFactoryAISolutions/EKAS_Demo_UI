# Local demo API and Tom handoff

> Current artifact and verification scope: [CURRENT-DEVELOPER-HANDOFF.md](../docs/CURRENT-DEVELOPER-HANDOFF.md). Local proposed contracts and synthetic tests do not certify Tom's actual service.

The current implementation is self-contained synthetic manufacturing software. OpenAI is the intended server provider; there is no Ollama dependency. Actual Tom endpoint/authentication conformance remains deferred production work owned by the engineer. No unseen backend has been called or certified.

`app/src/server/localDemoServer.ts` composes the real canonical service, private local-owner authority, write-only server-session credential store, cumulative budget, same-origin application gateway and static UI. The legacy governed operator entry is preserved separately; its project signing choices are not a local-demo prerequisite.

| Boundary | Current contract |
| --- | --- |
| `/api/v1/admin/owner/login` | POST one-time local owner code; opaque HttpOnly SameSite session and CSRF returned |
| `/api/v1/admin/owner/session` | GET current owner session/CSRF metadata |
| `/api/v1/admin/owner/logout` | POST with exact origin/session/CSRF; revokes that session |
| `/api/v1/admin/ai` | GET non-secret current settings, historical/current test status, limits and qualified budget |
| `/api/v1/admin/ai/settings` | PUT strict supported settings with `If-Match` configuration revision; no provider call |
| `/api/v1/admin/ai/credential` | PUT write-only key + key revision; DELETE explicit removal; configuration/key CAS guards |
| `/api/v1/admin/ai/test` | POST unique operation ID + explicit cost consent; current revision required; idempotent bounded inference |
| `/api/v1/admin/ai/enable`, `/disable` | Separate POST actions; Enable requires current tested settings/key, pricing and budget |
| `/api/v1/demo/ai-status` | GET public non-secret synthetic mode disclosure |
| `/api/v1/application` | Existing strict `ekas-proposed-v1` versioned application envelope; authoritative session replaces browser role claims |

Admin bodies use a dedicated handler/client, outside generic workspace tracing. Only sanitized metadata enters the local audit. Real OpenAI conversation calls require current local-owner authority in addition to the fictional business principal. Policy is rechecked after awaited work and before commit; changed role, scope, source, key/configuration or cancellation cannot publish an obsolete result. Mock chat remains explicitly unpaid/synthetic and cannot fall through to the real transport.

Messages support application SSE progress and one authoritative committed envelope. The Responses adapter requests actual streaming in the local composition. Tool/prose deltas are not public factual claims; only non-content receiving/checking status is emitted before canonical validation and commit. Existing four-round, tool, context, output and idempotency guards remain. Captured replies preserve original sources, units, cutoff, qualification and displayed commentary.

Tom should implement/confirm the existing manufacturing, decision-support, diagnostics, health, measurement, genealogy, obligations and attention contracts in this directory, including exact denominators, optimistic versions, idempotency, source/case/cycle/cutoff policy and genuine role authorization. Replace the synthetic repository/principal with an adapter behind those contracts; keep provider credentials and spending authority server-side. Do not infer Tom routes, authentication or production mutation permission from the prototype. Controlled approvals, performed work, verification, sustainment and causal/financial claims remain distinct.

Real CMMS dispatch, controlled document release, live plant reads/writes, enterprise identity, production secrets infrastructure and external notification delivery are not performed by this demo. User-directed deferral of those production facets does not close local synthetic behavior or acceptance obligations.

The corrected candidate explicitly selects supported `low` reasoning for normal local-demo tool requests, retaining the 1,200-output-token, four-round and existing cumulative-budget limits. Safe read-only operation diagnostics distinguish HTTP/response status, documented incomplete reason or unknown reason, output shape, configured effort/cap and usage-token metadata. They do not retain provider output, reasoning content, headers or raw error text. An incomplete response is not published or automatically continued. The earlier live4520 failure only recorded the generic incomplete code, so its exact reason remains unknown; this new diagnostic does not rewrite that history.

## CF guided provider flow and evidence boundary

The normal local composition selects canonical_turn first, then publish_response after its matching validated canonical receipt. Tool schemas, factual claim/receipt checks,canonical commit,1200output cap/four-round guard and cumulative authority remain enforced. The actual OpenAI model generates the interpretation; rehearsal uses explicit fictitious Responses with no external fallback. Do not translate guided orchestration into a scripted answer or claim that it resolves the unknown reason of a historical incomplete response.

Independent ordinary review is PARTIAL/not release approved:255/255evidence checks,9/9freshfocusedbehavior,no newfunctionaldefect. Owner2859source/501compiled totals are successful same-source partitioned/resumed unions with initial failures retained.501inheritedcompiled cases use demoServer.ts;normalAdmin composition has separatelocal hosted/master/history proofs.34questions validate context/refusal/replay,not completed three-case lifecycles. Actualconversation11January/Marchcommits are two scoped OpenAI outcomes,not wholeintegration acceptance.

## Engineer confirmation worksheet — pending Tom backend

| Contract facet | Prototype behavior to preserve | Tom confirmation/conformance still required |
|---|---|---|
| Endpoint/version | Strict ekas-proposed-v1 request/result envelope through local gateway; explicit proposed contracts in this directory | Actual baseURL,route mapping,backend revision and schema version; no invented route |
| Principal/authorization | Local owner authority for paid calls plus separately fictional business actor/scope | Actual tenant/principal/session/token mapping and genuine backend role admission |
| Writes/concurrency | expectedVersion/If-Match,operation identity/idempotency,atomic commit and stale rejection | Actual CAS/version format,retry/replay/conflict/transaction semantics and durable adapter tests |
| Streaming/cancellation | Non-content progress,one authoritative saved envelope;uncertain outcome read-only reconciliation | Actual SSE framing,terminal/error/cancellation semantics,disconnect reconciliation;never resend an uncertain mutation automatically |
| Manufacturing truth | Exact source IDs,units,denominators,known-time/cutoff/case/cycle;separateapproval/performed/verification | Actual data/document/work-order mappings and fixtures;prove source applicability/authorization before real read/write |
| Model configuration | Server-held OpenAI credentials,explicitTest/Enable,current cost authority;noOllama dependency | Engineer-controlled provider/config boundary compatible with backend;real credential never enters browser/export/repo |
| Failure/history | Original captures/statuses retained;closed safe diagnostics;no causal or savings claim from gains | Actual typed errors,timeout/recovery/history/migration and observability schemas with redaction |

Do not mark a row conformant until tested against Tom's confirmed backend. Production integration,enterprise identity/vault/trust,realCMMS/QMS dispatch or document release remain separately engineer-owned/deferred; they are not new prerequisites for completing the self-contained synthetic local acceptance. No actual backend call or mutation was made to prepare this handoff.

## Current additive monthly evidence binding (policy7)

NewPresentedTurn.monthlyComparison has schemaVersion1 and canonical primary/comparison operand descriptors,sourceIDs/paths,knownAt,units,unrounded values and signedpercentage-point difference. It is not the separate governed operational-comparison resource. Bothperiod IDs enter the saved answer and validated canonical receipt claims;unavailable/non-numeric/unknownperiod operands do not acquire invented IDs. Source/case access still uses existing resourceassetadmission. Capturepolicy0–6history is not rewritten;engineer adapters must retain the versioned turn policy and optional evidence field so read/replay does not reinterpret oldcaptures. The outer prototype ekas-proposed-v1 envelope is unchanged;this is a documented prototype read-model addition,not certifiedTom schema compatibility.

ActualCF live monthlysequence:9savedOpenAIturns/conversation11v10,including7additionalexplicitlyauthorizedturns;firstJan/Marchhashes retained. CFcomparison panelomittedFebruarycitation,nowcorrectedonlyin7e26mockandnative-retested there. No livebackend/key/restart mutation was made to apply thiscode. Currentfull7e26suite isrunning;earlierCF successful unions arehistorical. Tom mustconfirm/test endpoint/auth/schema/version/idempotency/SSE mappings separately without making productionfacetsnewlocaldemo prerequisites.

## Optional numeric result order — machine ranking correction
Query.orderBy is optional {metricId,direction:asc|desc}; it selects an included governed metric and sorts canonical aggregated rows, with unavailable last and stable exact-scope ties. Machine aliases resolve to Asset and override inherited grouping while applicable filters/provider/cutoff remain. The field participates in validation, cache/capture/layout semantics and proposed-query metadata; adapters must preserve it rather than sort a frontend alone. OEE remains ratio of summed ideal-good minutes to summed planned minutes. Older captures without orderBy retain original data/time/source. b9510b36 has70relatedpasses and normal compiled fictitious Responses proof; actualOpenAI interpretation and Tom endpointconformance are not newly verified. Tomactualintegration remainsengineer-owned production dependency, not a localdemo prerequisite.

## Training capture context (current correction, not yet released)

New training captures carry optional schemaVersion1 sourceContext bound to the exact saved query, source record IDs, metric grain, fixture, observed period and independent data cutoff. New training model turns retain trainingModelContext from the preceding saved capture. Canonical context_read receipts, UI evidence and assistant history use that captured frame; the monthly routing cursor is not training evidence. Legacy captures without the marker retain their original canonical receipt and history semantics. Adapters must preserve this optional versioned read model; it is not a claim of Tom endpoint conformance. OpenAI remains server-side, with no local Ollama dependency. Actual Tom endpoint/auth/schema/version/SSE/CAS mapping remains pending engineer confirmation.
