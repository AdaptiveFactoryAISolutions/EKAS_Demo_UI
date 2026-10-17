# 3 Canonical EKAS identity model

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

The same physical thing has a different identifier in each system. A feeder can be `LINE03_FEEDER` in MES, `ASSET-4712` in CMMS, `PLC_FEED_03` in the historian, and `WC-030` in ERP, and still be one canonical asset, `FEED-03`, once a governed map says so.

The canonical model is the governed list of entity kinds EKAS uses so those source identifiers can be attached to one decision. It is not a new master data product, and it is not a license to overwrite the source identifier.

## Entity kinds

| Kind | What it identifies | Typical source of the fact |
| --- | --- | --- |
| Enterprise | The company boundary | ERP or the enterprise directory |
| Site / plant | One operating site | ERP, MES |
| Area | A named area inside the plant | MES |
| Line | A production line | MES |
| Work center | Where an operation is scheduled or run | MES, ERP |
| Asset / machine | The physical equipment | CMMS, MES, historian |
| Operation | A step on a routing | MES, PLM |
| Job / work order | One execution instance | MES. A maintenance work order is a different type |
| Part | The product or component identity | PLM, ERP, MES |
| Part revision | The controlled revision of that part | PLM |
| Lot / batch | A material or production lot | MES, ERP, QMS |
| Serial | One serialized unit | MES, PLM, QMS |
| Shift | The crew and time window the plant uses | MES |
| Material | A consumed or produced material identity | ERP, MES |
| Supplier | The source of a material or component | ERP |
| Tool / fixture | Tooling, where a source system actually has it | MES, CMMS, PLM |

A kind that no connected system can supply is absent. The model does not invent a supplier, a serial, or a fixture to fill the shape.

## Identity rule

Never merge records because names look similar. Link only when a governed mapping or an authoritative key supports the link.

If the link is uncertain: preserve both records, mark the mapping unresolved, do not combine the evidence, and ask for clarification where the user-facing behavior requires one referent.

"Look similar" includes case, punctuation, a dropped character, a shared noun such as "feeder", and a shared number embedded in different identifier schemes. `FEEDER_03` and `FEEDER_3A` are two source identifiers until a governed map says otherwise. `NW-A` revision `P2` and `NW-A` revision `P3` are two revisions even when the part id matches.

## What a canonical entity records

| Field | Meaning |
| --- | --- |
| `canonicalEntityId` | The EKAS id, stable for the decision context. Example: `FEED-03` |
| `kind` | One row from the table above |
| `mappingVersion` | The version of the governed map that asserted the aliases |
| `aliases` | The source system and source id pairs the map currently allows. See [4 Entity resolution](04-entity-resolution.md) |
| `unresolvedCandidates` | Source ids that were seen and not linked. They stay visible as unresolved |

The canonical id is not more authoritative than the source record about the fact. It is the join key for the decision. MES still owns the execution id. CMMS still owns the asset id it issued. The map says they may be discussed together.
