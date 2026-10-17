# 5 Evidence lineage

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

Every important result has to be able to answer five questions: where did this come from, what does it refer to, when was it true, which version is it, and how does it connect to other evidence.

The internal engineering question for that set is "How was this data born?" That sentence is for engineers reading this contract. It is not a label in the plant UI.

## EvidenceReference

Not every system supplies every field. A missing field is missing. Do not infer it from a neighbor, a file name, or a clock on the EKAS server.

| Field | Meaning |
| --- | --- |
| `sourceSystem` | The system that owns the fact: `MES`, `ERP`, `PLM`, `CMMS`, `QMS`, `HISTORIAN`, `SCADA`, `VV`, or another named system of record |
| `sourceRecordId` | The identifier in that system |
| `sourceRecordType` | The record type in that system, such as production run, work order, alarm, NCR, or controlled document |
| `sourceVersion` | The version or revision the source system assigned |
| `knownAt` | When EKAS, or the integration, first knew this record. A future `knownAt` is not usable as present evidence |
| `effectiveFrom` | When the source says the fact became effective |
| `effectiveTo` | When the source says the fact stopped being effective. Empty means the source did not give an end |
| `controlledStatus` | The source's control state, such as current, superseded, or draft. EKAS does not invent this status |

## Context

Context says what the record refers to, using canonical ids when a governed map has resolved them, and source ids when it has not.

| Field | Refers to |
| --- | --- |
| `plantId` | Site / plant |
| `lineId` | Line |
| `assetId` | Asset / machine |
| `workCenterId` | Work center |
| `jobId` | Job or execution work order |
| `operationId` | Operation |
| `partId` | Part |
| `revision` | Part revision |
| `lotId` | Lot or batch |
| `serialId` | Serial |
| `shift` | Shift |
| `period` | The time window the answer is about |

An unresolved asset stays as the source id on the evidence reference. It is not written into `assetId` as if it were canonical.

## Lineage

| Field | Meaning |
| --- | --- |
| `canonicalEntityId` | The canonical entity this evidence is about, when the map resolved it |
| `relatedEvidenceIds` | Other evidence records the relationship points at |
| `relationshipType` | One type from [6 Correlation](06-cross-system-correlation-rules.md) |
| `relationshipAuthority` | Who or what authorized the relationship: a governed map, a source foreign key, or an explicit human assertion |
| `relationshipConfidence` | Present only when a governed rule supplies it. Absent means no governed confidence. It is not a similarity score |
| `mappingVersion` | The identity-map version used when the link was made |

## Data birth

For any important result the lineage has to carry:

- the source system that created the fact
- the entity it refers to
- when it became known (`knownAt`)
- the revision or source version
- the source record that supports it

If one of those is absent, the result says so. The answer does not fill the gap with a likely value.

## Evidence view

The evidence view groups by source type. It does not group by the API route that happened to return the row.

| Group | Example the normal view may show |
| --- | --- |
| Production | MES, JOB-8303 |
| Machine / process history | Historian, 12 feeder-jam events |
| Maintenance | CMMS, 3 related work orders |
| Controlled documents | PLM/QMS, Standard Work 030 · Current |
| Quality | QMS, 1 related NCR |

The normal view uses the source type, a short identifier a plant leader already uses, and the count or the document title. Technical details may show the raw source id, the API route, the exact timestamp, the source version, and the canonical mapping. The normal view must not show those.

This grouping is the contract for a future evidence view. RC3's evidence presentation is unchanged.
