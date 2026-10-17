# 21 Decision execution model

The decision execution model is the governed sequence from a recognized loss to a verified outcome, and then to sustain or reopen. This wiki already walks that sequence in [03 Using EKAS](03-using-ekas.md), [04 Journeys](04-journeys.md), and the investigation state diagram in [05 Frontend architecture](05-frontend-architecture.md). This page names the model in one place. It does not add a stage.

`docs/integration/BACKEND-CONTRACT.md` records the same separation for the local demo: goal, loss, evidence, hypothesis, action, owner acceptance, authorization, performed work, verification, sustainment, and reopen. Approval is not performed work. Performed work is not verification.

## Stages

| Stage | What becomes true | Where the demo already says it |
| --- | --- | --- |
| Recognize the loss | A missed goal is stated as a gap, with its scope and its measure | [04 Journeys](04-journeys.md): goal, gap, loss, contributor |
| Bind context | Plant, line, machine, job, period, and case are the conversation context | [05 Frontend architecture](05-frontend-architecture.md): one context object |
| Cite evidence | The answer carries source ids, the as-of instant, and the qualification. A missing record stays missing | [05 Frontend architecture](05-frontend-architecture.md): evidence model |
| Recommend | A hypothesis and a bounded action are recorded as a recommendation | [04 Journeys](04-journeys.md): hypothesis, action |
| Authorize | A named authority approves or withholds the bounded action | [04 Journeys](04-journeys.md): authorization. No recorded approval means the work is not treated as authorized |
| Record performed work | Work that was actually done is a separate record from the recommendation | [05 Frontend architecture](05-frontend-architecture.md): Performed |
| Verify | The governed measure is compared with the target after the work. A missing result blocks acceptance | [04 Journeys](04-journeys.md): verification |
| Sustain or reopen | The result held under the sustain rule, or a new cycle opens. Cycle 1 proof is not cycle 2 proof | [04 Journeys](04-journeys.md): sustain, reopen |

The state machine on the running shell is Open, Owned, Hypothesis, Recommended, Authorized, Performed, Verified, Sustained, and Reopened. Reopened returns to a new hypothesis.

## What the demo executes

The synthetic investigation lifecycle is implemented for the supplied cases. The downtime case is the Northworks feeder-jam plan miss. Speed and quality keep their own cases. `docs/integration/BACKEND-CONTRACT.md` records that implementation under workflow transitions, and records that decision-support writes do not release production or dispatch work.

## What stays in the source system

MES executes and records. CMMS records the maintenance work it owns. QMS records the disposition it owns. EKAS holds the decision context that cites those records. See [18 MES boundary](18-mes-boundary.md).

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.** Coordinating this model across live MES, CMMS, QMS, ERP, PLM, SCADA, or the historian is not implemented. [14 Production backend gaps](14-production-backend-gaps.md) marks the investigation aggregate and its commands MISSING on the inspected backend. Orchestration in [22 EKAS Manufacturing AI Maturity Model](22-manufacturing-ai-maturity-model.md) means coordinating these stages. It does not mean replacing the system that owns the work.

## How a later layer may use the model

A recommendation can exist before authorization. Authorization can exist before performed work. Verification can exist only after a result is recorded. No stage skips backward to invent a missing record. Governed autonomy, if it is ever authorized for a bounded class of action, still has to pass authorization, source-system confirmation, and verification. The maturity rules for that are on [page 22](22-manufacturing-ai-maturity-model.md).
