> Current authority: the approved 2026-10-15 goal authorizes bounded workspace consolidation and backend adapter verification. See [current goal plan](superpowers/plans/2026-10-15-unified-ekas-goal.md). Earlier statements that consolidation was not authorized are historical.

# EKAS demonstration — current user guide

This is synthetic manufacturing software. Its records describe fictional plant situations; a simulated action does not perform maintenance, release a document, notify a supplier, or authorize real work.

## Choose the right demonstration

| Identity | Purpose and current evidence |
| --- | --- |
| `711b7027`, review preview `http://127.0.0.1:18352/?demonstration=ekas-corrections-20261015` | Existing review session. Patrick may still be reviewing it. It has not been replaced by f2b. |
| `f2b1292c`, isolated candidate | Source verification: 2,910 passed across 492 files. Compiled verification: one clean 501-check run. Independent ordinary review: bounded 14-test/142-evidence-check PASS. Browser acceptance and promotion remain pending; no f2b preview URL has been assigned here. |
| `cf296231`, live demonstration `http://127.0.0.1:18329/?demonstration=ekas-normal-first-use-20261015&area=Brief` | Separate older artifact with historical user-authorized OpenAI activity. Its present private key, session and provider state have not been inspected for this guide. It does not contain all later corrections. |

The source and compiled counts establish automated behavior, not unaided usability or actual browser/file acceptance. See [the native retest handoff](F2B-NATIVE-RETEST-HANDOFF.md) for exact identities and limits. The V84 guide is historical.

## Work through a manufacturing question

1. Use the area and conversation controls actually visible in your presentation. The five areas are Brief, Explore, Improvements, Knowledge and Metrics; the embedded presentation also has retained chat/advanced tools. These surfaces can feel like competing workspaces. That concern remains unresolved. This guide does not imply a new navigation design or tell you to create another workspace to work around confusion.
2. Check the fictional actor, asset, part, revision, job, operation and data cutoff before acting on an answer. Ask a scoped question such as “Investigate downtime.”, “Investigate speed.” or “Investigate quality.” Read the answer's actual source and qualification, then ask follow-up questions in the same conversation.
3. Treat work-order notes, alarms and hypotheses as evidence with uncertainty. Examine alternatives before selecting an action. Approved work, performed work, independent verification, acceptance, sustainment and recurrence are separate states. A blocked EC or PM decision remains blocked until its stated prerequisite is satisfied.
4. In Knowledge, retain the distinction between current controlled PFMEA/control-plan/standard-work records, superseded records and unreleased proposals. In Improvements, inspect ownership, the action, its evidence and its verification horizon. A local preference or review checkbox does not prove physical work or effectiveness.
5. In Explore and Metrics, read the displayed units, source scope, denominator, completeness and time. A chart, Grid and captured answer should refer to the same result. Historical answers keep their original context; later edits and fresh data do not silently rewrite them. Missing or stale inputs can block or qualify a current conclusion.
6. Wait for a state-changing request to settle. If the outcome is uncertain, inspect the saved conversation, current state and original receipt before retrying. Reloading or starting a new conversation is not a substitute for resolving an unknown operation.

The simulated provider supports authored demonstration paths. Its successful answers do not establish unrestricted OpenAI conversation quality or integration with Tom's service. OpenAI is the required server-side provider; there is no Ollama fallback.

## Read the manufacturing quantities correctly

- Initial scenario: October 6, 2026, 14:45 UTC; data cutoff 14:00 UTC. Later repair/inspection, October 20 verification and November 3 recurrence require explicit later simulation snapshots.
- Capacity waterfall: `2880 − 480 − 198 − 48 = 2154`; plan `2304`, gap `150`. These are different quantities.
- Primary feeder-jam endpoint: `60 → 30 minutes per eligible shift`, target `≤30`. OEE is supporting evidence. Historical jobs without exposure remain unranked.
- Like-for-like repair is distinct from unreleased EC003. Observed improvement is not proof of cause or verified financial savings. Keep each value stage's units and horizon.

## Layouts, saved work and exports

Use supported layout and save controls and check the result after reopening. Actual Dashboards Board/DataPool/chart/Grid components are installed. Their presence and automated tests do not close all native layout, keyboard or rendering checks.

Keep local share, schedules, embed descriptions, draft files and simulated notifications within their disclosed scope. They do not create external access or delivery. Actual clipboard contents, downloaded files, receiving applications, responsive behavior and assistive-technology use still need the scoped native checks in the worksheet. Do not reset or remove existing review data to satisfy a test.

## Owner sign-in and live OpenAI

The local owner bootstrap code is one-use and the session has a two-hour maximum. Expired/consumed-code recovery explanations are a known unresolved UX defect; the reported silent login outcome has not been fully attributed. Do not repeatedly submit an old code or assume a silent screen means activation succeeded.

Keys are entered privately through the supported owner flow and remain server-side. Reading this guide does not authorize a restart, new code, key entry, paid Test, Enable, or provider call. A previously authorized same-artifact CF recovery preserved history and budget; that historical event does not authorize another recovery. The parent coordinates any further action. Never paste a key or owner code into chat.

## What remains unaccepted

Browser/native acceptance, the remaining Guide branches, actual export delivery, accessibility, unaided user tasks and final product approval remain open. The current source verification used a controlled resume after a setup-path error; initial failures were preserved. Production authentication and Tom's actual endpoint/schema/error/idempotency/streaming conformance are unverified. See [remaining work](REMAINING-CLOSURE-WORK.md) and the authoritative closure register rather than treating this guide as release approval.

## Isolated sign-in UX successor

The bounded sign-in/recovery fix is implemented in isolated d68f, with 63 related checks, three real loopback HTTP checks, typecheck and builds passing. It is not on the served 711b/CF previews. It preserves private one-use/two-hour policy and the existing reusable public rehearsal code; no issuance, renewal, restart or paid call is added. Native and independent acceptance remain pending. See [OWNER-SIGNIN-UX-HANDOFF.md](OWNER-SIGNIN-UX-HANDOFF.md) for exact identity and scope. The broader competing-workspaces concern is unchanged.
