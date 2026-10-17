# 2 System ownership boundaries

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

SOURCE SYSTEMS OWN FACTS. EKAS OWNS THE GOVERNED DECISION CONTEXT THAT CONNECTS THEM.

MES EXECUTES AND RECORDS. EKAS INTERPRETS, CONNECTS EVIDENCE, GOVERNS DECISIONS, AND VERIFIES OUTCOMES.

## System ownership matrix

| Concern | Owner of the fact | What EKAS may hold |
| --- | --- | --- |
| Part, BOM, revision, ECO, effectivity | PLM | A governed link to the controlled record, with version and effectivity as PLM stated them |
| Production order, inventory, supplier, material, cost | ERP | A governed link to the business context. Cost is not restated as verified financial value |
| Work order, operation, work center, actual quantity, scrap, routing, execution status | MES | A read of the execution record inside a decision. EKAS does not become the execution writer |
| Tag values, alarms, parameters, setpoints, time-series | SCADA / Historian | A governed citation of the series or event, with the source timestamp |
| Asset, maintenance work order, failure history, PM, technician notes | CMMS | A governed link to the maintenance record. Notes stay notes |
| Inspection, NCR, 8D, CAPA, complaint, disposition | QMS | A governed link to the quality record. A disposition is not a root cause |
| Requirement, test case, result, failed validation, traceability | Requirements / V&V | A governed link to the verification record |
| Conversational context, evidence linking, investigation, authorization, performed-work decision, verification of the decision, sustain, reopen | EKAS | The decision aggregate. It cites source records. It does not replace them |

## Boundary rules

Each source system remains authoritative for the fact it created. EKAS is authoritative for the decision context that cites those facts: which records were used, which canonical entities they were mapped to, which relationship was asserted, who is accountable, and whether the decision's outcome was verified.

A copy of an MES status inside an EKAS investigation is a citation. The MES record remains the execution status. A copied quantity is not a new actual. A copied NCR is not a new disposition.

EKAS does not post inventory, release a revision, close a maintenance work order, disposition an NCR, or write a historian sample. Those writes stay in the system that owns them.

Observed loss is a governed actual-versus-plan or actual-versus-standard gap with a source and a time. Modeled opportunity is a scenario. Verified financial value is a finance-accepted figure. The three stay separate across every system in this matrix. A unit gap in MES is not a P&L entry.

## Chat, then the other views

The plant leader asks in Chat. The answer names the source system for each fact it uses. Investigation holds the decision workflow that follows from that answer. Dashboards show the same governed context. They do not invent a parallel identity or a parallel evidence set.
