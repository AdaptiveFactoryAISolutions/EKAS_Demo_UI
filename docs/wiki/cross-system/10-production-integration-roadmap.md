# 10 Production integration roadmap

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

This roadmap is the order a later production integration would have to follow. It is not a release. It does not create RC4. No step on this page is authorized against RC3 source. Implementation starts only under a separate authorization after RC3 final approval.

## Where this package sits

| Step | State |
| --- | --- |
| Doctrine, ownership, identity, lineage, relationships, adapter shapes, gaps, and acceptance tests | Documented in this section and in the API and gap contracts |
| Canonical entity store, alias map, and resolve operation | Not implemented |
| Evidence search by context and by canonical entity | Not implemented |
| Relationship store, including the ban on automatic `CAUSED_BY` | Not implemented |
| Adapter normalization of MES, CMMS, historian, PLM, and QMS | Not implemented |
| Chat answers that read those systems | Not implemented. RC3 chat behavior is unchanged |
| Evidence view grouped by source type | Not implemented. RC3 evidence presentation is unchanged |
| Acceptance tests in [page 8](08-integration-acceptance-tests.md) | Specified. Not in the RC3 suite. None passed |

## Implementation order, after separate authorization

The order is a dependency order. A later step that runs before the map exists would have nothing governed to join.

1. Governed identity map and resolve: external system plus external id to a canonical entity, and the reverse alias list. Unresolved and conflict states are part of this step, not a follow-up.
2. EvidenceReference on every record the adapter normalizes, including source version, `knownAt`, and effectivity.
3. Adapter normalization for the five shapes on [page 7](07-adapter-normalization.md), each still fail-closed until that system's read is actually present.
4. Descriptive relationships. `CAUSED_BY` stays unavailable to automatic correlation.
5. Evidence search by context and by canonical entity, plus historical, effectivity, and source-version lookup.
6. Chat and evidence presentation that follow pages 5 and 6. Dashboards consume the same context. They do not define a second map.
7. Run the acceptance tests. Adapter Verified and Live Integration Verified change only when those tests are independently accepted.

Until step 7, the adapter keeps refusing capabilities the backend does not implement, and the UI does not substitute synthetic records for a missing source.

## Mapping to the existing doctrine

### Claim to fame

[16 Claim to fame](../16-claim-to-fame.md) says EKAS takes a plant leader from a missed operating goal to evidence, a governed decision, accountable action, verification, and sustained improvement, in a conversation.

Cross-system work is how that conversation gets its evidence when the facts live in more than one system. The questions EKAS has to be able to answer, once this contract is implemented, are:

| Question | What has to be true |
| --- | --- |
| What happened? | MES and, where relevant, the historian, cited with source and time |
| What changed? | Revision, effectivity, and supersession from PLM or the controlling system, not a guessed diff |
| What evidence supports it? | EvidenceReference and lineage. Combined only after a governed map |
| What should we do? | A next step. Support is not proof, as in the feeder-jam example |
| Who owns it? | The EKAS decision workflow. A source system's assignee is not silently the EKAS owner |
| Did it work? | Verification against the same scope and identity |
| Did it hold? | Sustain, still on that identity |

Most manufacturing systems own one part of that story. MES knows production. The historian knows process conditions. CMMS knows maintenance. QMS knows defects. PLM knows product and revision. ERP knows business context. EKAS connects those parts into a governed decision. That connection is documented here and is not implemented.

### PLC to P&L

[17 PLC to P&L](../17-plc-to-pl-strategy.md) keeps three quantities distinct. The cross-system chain those quantities travel is:

PLC / sensors, then SCADA / historian, then MES, QMS, and CMMS, then ERP, then finance / P&L.

Governed identity and evidence lineage are the only join this package allows along that chain. Observed loss is not modeled opportunity. Modeled opportunity is not verified financial value. An ERP cost does not become verified financial value because it was retrieved next to an MES quantity.

### MES boundary

[18 MES boundary](../18-mes-boundary.md) stays in force. MES executes and records. EKAS interprets, connects evidence, governs decisions, and verifies outcomes. This roadmap does not move execution writes into EKAS. The new ownership sentence is the same boundary stated for every source system, not only MES:

SOURCE SYSTEMS OWN FACTS. EKAS OWNS THE GOVERNED DECISION CONTEXT THAT CONNECTS THEM.

## Deployment source expansion

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[23 Deployment and scale strategy](../23-deployment-and-scale-strategy.md) ties the addition of live sources to deployment stages. The recommended source order there is MES, then CMMS, then controlled documents and PLM, then QMS, then historian and SCADA, then ERP, then additional governed sources. That order is recommended, not mandatory. The pilot problem chooses the first integration.

This page's numbered list above is a different order. It is the dependency order for the software: identity map, evidence reference, adapter normalization, relationships, search, presentation, and acceptance tests. A plant that connects MES first still needs the map and the evidence reference before records are joined. The source order does not replace that dependency order.

[17 PLC to P&L](../17-plc-to-pl-strategy.md) is a third order: the chain of claims from the PLC to finance. It is not the order sources are turned on, and it is not the dependency order above. Current release status is tracked in the [release](../12-release-and-deployment.md) and [acceptance](../09-testing-and-acceptance.md) documentation. None of the live source connections is accepted.
