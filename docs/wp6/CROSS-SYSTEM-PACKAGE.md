# EKAS cross-system context, identity, and lineage

Status: **DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION**.

This page records Patrick's cross-system package. It is documentation, an API contract, adapter expectations, a backend gap definition, and a future acceptance specification. It does not modify RC3 product code. It does not create RC4. It does not change Chat, the shell, dashboards, investigations, evidence presentation, calculations, context logic, the adapter runtime, or workflow state.

RC3 source remains `45568c575a00a8810b661929624995ec24e6de1e`. Implementation of this package requires a separate authorization after RC3 final approval.

This is not a dashboard project. It gives no permission to turn EKAS into an MES, ERP, CMMS, QMS, historian, or PLM.

## Doctrines

SOURCE SYSTEMS OWN FACTS. EKAS OWNS THE GOVERNED DECISION CONTEXT THAT CONNECTS THEM.

MES EXECUTES AND RECORDS. EKAS INTERPRETS, CONNECTS EVIDENCE, GOVERNS DECISIONS, AND VERIFIES OUTCOMES.

Chat remains the primary experience. A question such as "Why did Line 03 miss plan?" is answered by combining governed evidence from MES (production and job), Historian/SCADA (machine and process), CMMS (maintenance), QMS (defects, NCR, and corrective action), PLM (revision, change, and the controlled product), and ERP (inventory, order, and business context). The answer states what happened, what is known, what is not known, the supporting evidence, and the next step. Dashboards and evidence views support Chat.

## Research boundary

An external sketch of industrial data was supplied as research only. This package does not copy its artwork, layouts, wording, branding, diagrams, colors, or composition, and it does not use that document's proprietary wording as marketing. The engineering concepts retained are these: manufacturing data is spread across systems that do not share one record; PLM holds product, revision, and engineering change; ERP holds orders, inventory, suppliers, and cost; CMMS holds work orders, failure history, and technician notes; MES holds process steps, cycle time, production, scrap, and OEE; SCADA and the historian hold time-series, alarms, and setpoints; QMS holds NCR, 8D/CAPA, complaints, and corrective actions; verification and validation hold requirements, test cases, and results. The value is in the links. A common asset or part identity is the join point. The hard part is inconsistent identifiers, free text, sparse labels, and systems built to run the operation rather than to analyze it.

## Where the contract lives

| Deliverable | Path |
| --- | --- |
| Wiki section, 10 pages | [docs/wiki/cross-system/](../wiki/cross-system/01-cross-system-manufacturing-data.md) |
| UI API contract | [docs/wiki/06-api-and-backend-integration.md](../wiki/06-api-and-backend-integration.md) |
| Backend gap contract | [docs/wiki/14-production-backend-gaps.md](../wiki/14-production-backend-gaps.md) |
| Canonical identity model | [docs/wiki/cross-system/03-canonical-ekas-identity-model.md](../wiki/cross-system/03-canonical-ekas-identity-model.md) |
| EvidenceReference contract | [docs/wiki/cross-system/05-evidence-lineage.md](../wiki/cross-system/05-evidence-lineage.md) |
| Relationship model | [docs/wiki/cross-system/06-cross-system-correlation-rules.md](../wiki/cross-system/06-cross-system-correlation-rules.md) |
| System ownership matrix | [docs/wiki/cross-system/02-system-ownership-boundaries.md](../wiki/cross-system/02-system-ownership-boundaries.md) |
| Architecture diagram | Page 1 of the section |
| Entity-resolution diagram | Page 4 of the section |
| API and evidence sequence | Page 6 of the section |
| Acceptance-test specification | [docs/wiki/cross-system/08-integration-acceptance-tests.md](../wiki/cross-system/08-integration-acceptance-tests.md) |
| Production integration roadmap | [docs/wiki/cross-system/10-production-integration-roadmap.md](../wiki/cross-system/10-production-integration-roadmap.md) |
| Claim to fame, PLC to P&L, MES boundary | [16](../wiki/16-claim-to-fame.md), [17](../wiki/17-plc-to-pl-strategy.md), [18](../wiki/18-mes-boundary.md), and page 10 |

## Binding rules

- Never merge records because names look similar. Link only when a governed mapping or an authoritative key supports the link.
- If the mapping is uncertain, preserve both records, mark the mapping unresolved, do not combine the evidence, and ask for clarification where the user-facing behavior requires a single referent.
- Missing fields stay missing. Do not infer a plant, line, asset, revision, time, version, or relationship.
- `CAUSED_BY` is never created automatically from correlation. Most relationships start descriptive.
- `relationshipConfidence` is present only when a governed rule supplies it.
- Observed loss, modeled opportunity, and verified financial value stay distinct.
- "How was this data born?" is an internal engineering question. It is not a label in the plant UI.
- Documenting a capability does not mark it implemented. Adapter Verified stays NO. Live Integration Verified stays NO.
