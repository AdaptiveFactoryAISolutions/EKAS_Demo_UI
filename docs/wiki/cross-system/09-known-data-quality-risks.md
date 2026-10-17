# 9 Known data quality risks

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

The source systems were built to run the operation. Their identifiers, labels, and clocks are good enough for that operation and still dangerous to join. This page lists the risks the contract already refuses to paper over. It does not implement a cleaner.

| Risk | What goes wrong | What the contract requires |
| --- | --- | --- |
| Inconsistent ids | One asset, many strings | Link only through a governed map or an authoritative key |
| Similar names | `FEEDER_03` and `FEEDER_3A` | Do not merge. Preserve both. Mark unresolved |
| Free text | Technician notes, defect descriptions | Keep the text as text. Do not extract a cause or a `CAUSED_BY` from it |
| Sparse labels | A tag with no equipment binding, a work order with no asset | Leave the entity unresolved. Do not borrow the asset from a nearby record |
| Revision drift | Same part id, different revision | Treat revision as identity. Do not share evidence across revisions |
| Effectivity | A document or BOM outside its effective window | Honor `effectiveFrom` and `effectiveTo`. A superseded status stays superseded |
| `knownAt` in the future | A record dated after the decision time | Do not use it as present evidence |
| Stale map | An alias that a later mapping version retired | New links use the current version. Old evidence keeps its `mappingVersion` |
| Duplicate fetch | The same source record retrieved twice | One evidence record. A duplicate is not extra proof |
| Partial outage | One system down, others up | Name the missing system. Do not backfill |
| Clock skew | Source timestamps that disagree | Keep each source timestamp. Do not average them into a new event time |
| Cost and quantity | An ERP cost next to an MES unit gap | Leave them as different facts. Do not compute verified financial value |
| Cross-system status copies | An EKAS copy of an MES status | The copy is a citation. MES remains the execution authority |

## What must never be inferred

- A canonical id from a similar string.
- A revision from the part id alone.
- A timestamp from the time EKAS received the row, presented as the source event time. `knownAt` and the source timestamp are different fields.
- A relationship from co-occurrence in a shift.
- A confidence number that no governed rule produced.
- A missing system recorded as "no problem found."
- A root cause from a note, an alarm count, or a standard-work step.

When one of these is tempting, the required engineering behavior is to stop and leave the field absent or the mapping unresolved.
