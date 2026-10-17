# 7 Adapter normalization

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

The adapter's future job is to present source records in one shape without changing the fact. Normalization names fields. It does not convert a missing field into a value, and it does not merge two records.

RC3's adapter runtime is unchanged. Live mode still fails closed for capabilities the current backend does not implement. The shapes below are the contract a later adapter would have to meet before any refusal for that capability could be removed.

## MES production run

| Field | Source meaning |
| --- | --- |
| `workOrder` | MES work order / job id |
| `operation` | Operation on the routing |
| `workCenter` | Work center as MES names it |
| `asset` | Asset as MES names it, before canonical resolution |
| `part` | Part id |
| `revision` | Part revision as MES recorded it |
| `plannedQty` | Planned quantity |
| `actualQty` | Actual quantity |
| `scrapQty` | Scrap quantity |
| `startTime` | Start timestamp from MES |
| `endTime` | End timestamp from MES |
| `shift` | Shift from MES |

## CMMS work order

| Field | Source meaning |
| --- | --- |
| `asset` | Asset as CMMS names it |
| `workOrder` | CMMS work order id |
| `failureCode` | Failure code, when the CMMS has one |
| `technicianNotes` | Notes as written. They are not a cause |
| `openedAt` | Open time |
| `closedAt` | Close time, when closed |
| `maintenanceType` | The CMMS type, such as corrective or preventive |
| `performedWork` | Work the CMMS says was performed. This is not the EKAS performed-work decision |

## Historian process event or time-series

| Field | Source meaning |
| --- | --- |
| `asset` | Asset or equipment the tag is bound to, if the historian says so |
| `tag` | Tag id |
| `value` | Sample or event value |
| `unit` | Engineering unit |
| `timestamp` | Source timestamp of the sample or event |
| `alarm` | Alarm identity or state, when the record is an alarm |
| `setpoint` | Setpoint, when the record carries one |

A tag is not an asset until the governed map says that tag's equipment alias resolves.

## PLM controlled product record

| Field | Source meaning |
| --- | --- |
| `part` | Part id |
| `revision` | Revision |
| `BOM` | The bill the source attaches to that revision |
| `engineeringChange` | ECO or equivalent change id |
| `effectiveFrom` | Effectivity start |
| `effectiveTo` | Effectivity end |
| `controlledStatus` | Current, superseded, draft, or the source's own status |

A superseded document remains available as history. It is not normalized into `controlledStatus: current`.

## QMS quality record

| Field | Source meaning |
| --- | --- |
| `part` | Part id |
| `revision` | Revision the quality record names |
| `operation` | Operation, when the record names one |
| `defect` | Defect as the QMS coded or described it |
| `disposition` | Disposition |
| `NCR` | Nonconformance id |
| `correctiveAction` | Corrective-action id |
| `inspectionResult` | Inspection result |

## Rules for every shape

- Field names in these tables are the adapter contract. Source payloads may use other names. The adapter maps names. It does not map meaning that the source did not state.
- Quantities, times, revisions, and statuses are copied from the source field that owns them.
- An empty source field stays empty on the normalized record.
- The normalized record still carries an [EvidenceReference](05-evidence-lineage.md) so the original system, id, type, and version remain attached.
- Canonical ids are applied only after [entity resolution](04-entity-resolution.md). The source id remains on the evidence reference either way.
