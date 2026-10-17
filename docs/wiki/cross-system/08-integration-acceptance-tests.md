# 8 Integration acceptance tests

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

[Section index](01-cross-system-manufacturing-data.md)

These tests are the future acceptance specification. They are not in the RC3 suite. A passing RC3 run does not execute them. None of them is marked passed.

Adapter Verified stays NO until a later, separate authorization implements the contract and an independent test accepts it. Live Integration Verified stays NO on the same condition.

## Positive

| Id | Setup | Required result |
| --- | --- | --- |
| ID-POS-1 | Governed map sends MES `LINE03_FEEDER`, CMMS `ASSET-4712`, and Historian `PLC_FEED_03` to canonical `FEED-03` | Evidence from those three source ids is eligible to be read together as `FEED-03`. The answer cites each source. The source ids remain on the evidence references |

## Negative

| Id | Setup | Required result |
| --- | --- | --- |
| ID-NEG-1 | MES `FEEDER_03` and CMMS `FEEDER_3A` have no governed mapping | The records are not merged. Both stay unresolved. Evidence is not combined. The user-facing flow asks which one is meant when a single asset is required |
| REV-1 | Two records share a part id and carry different revisions | They stay separate. BOM, effectivity, and quality evidence do not cross the revision |
| TIME-1 | `knownAt` is in the future relative to the decision time | The record is not used as present evidence |
| DOC-1 | The controlled document is superseded | It is not presented as current. `CONTROLLED_BY` does not treat it as the current control. History can still show it |
| MAP-1 | The relationship's `mappingVersion` is older than the map version required for new links | New evidence is not attached through the stale row. Existing evidence keeps the version it was mapped with |
| MISS-1 | One system has no record for the asked scope | The answer says that system did not supply a record. No other system fills the field |
| CONF-1 | Two canonical entities claim the same source id | Both claims remain. The source id is in conflict. Evidence is not combined |
| DUP-1 | The same source system, source id, and source version are fetched twice | One evidence record. The duplicate is not a second independent proof |
| ASSET-1 | The asked asset is unknown to the map and to the source read | No canonical asset is created from the name. The answer says the asset is unknown |
| PART-1 | A similar part number is present at a different revision | The similar part is not selected. The revision in the question or the context is required |
| OUT-1 | A connected system is partially unavailable | Available governed records are returned. The unavailable system is named. No synthetic and no neighboring system is substituted |
| HIST-1 | The historian is unavailable | Machine and process history is absent. MES and CMMS records are not rewritten as if they were the time-series |
| CMMS-1 | CMMS is unavailable | Maintenance history is absent. A historian alarm is not turned into a work order |

## What a passing test must show

The test names the source ids, the map version, the evidence ids, and the sentence or the refusal the UI would show. A fixture that only shares the word "feeder" fails ID-NEG-1 if the implementation merges it. A test that invents `relationshipConfidence` from edit distance fails the lineage contract.

`CAUSED_BY` has no positive test that creates it from co-occurrence. A test that does so fails.

## Product and effectivity tests

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

Job, revision, serial, lot, deviation, superseded and obsolete documents, variant and alternate bills, where-used, a missing revision, a PLM/MES conflict, a future change, and an unavailable PLM are specified on [11 Product / part identity and PLM context](11-product-part-identity-and-plm-context.md). EFF-8303 is the anchor: JOB-8303, part 100-2045, on 2026-03-20, binds Rev B effective 2026-03-01. Rev C, effective 2026-05-01, must not be used. Those tests are not in the RC3 suite. None has been run.

## Relationship to the RC3 suite

The RC3 extraction count remains the count for RC3 product tests. These rows are additional future tests. They are specified here so a later implementation can be accepted or rejected without inventing the bar at the time.
