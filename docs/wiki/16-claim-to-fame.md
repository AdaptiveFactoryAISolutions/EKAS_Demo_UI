# 16 Claim to fame / product doctrine

EKAS is a manufacturing decision-intelligence system that takes a plant leader from a missed operating goal to evidence, a governed decision, accountable action, verification, and sustained improvement — through a conversation simple enough to use without an analyst.

Short form: **From production miss to verified improvement.**

EKAS helps manufacturing teams understand what happened, prove what they know, decide what to do, and verify whether it worked.

## Doctrine

MES executes and records. EKAS interprets, connects evidence, governs decisions, and verifies outcomes.

EKAS sits across the execution stack as the governed decision-intelligence layer. It does not replace MES, and it does not replace ERP, QMS, CMMS, SCADA, or the PLC.

## What the conversation has to carry

The leader can ask what happened, which asset, what the evidence is, who owns the next step, whether the action was authorized, what work was done, whether it worked, and whether it held. Each answer uses the governed record. A missing record stays missing.

## Cross-system reading

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

Most manufacturing systems own one part of the story. MES knows production. The historian knows process conditions. CMMS knows maintenance. QMS knows defects. PLM knows product and revision. ERP knows business context. EKAS answers, once that evidence is governed and linked: What happened? What changed? What evidence supports it? What should we do? Who owns it? Did it work? Did it hold?

That link is specified in [Cross-system context, identity, and lineage](cross-system/01-cross-system-manufacturing-data.md). RC3 does not implement it. The conversation on RC3 remains the governed demo already accepted for this source.

SOURCE SYSTEMS OWN FACTS. EKAS OWNS THE GOVERNED DECISION CONTEXT THAT CONNECTS THEM.

## What EKAS will not say

- It will not call a modeled opportunity “savings.”
- It will not add unlike gaps into one plant total.
- It will not substitute a neighboring metric, machine, or case.
- It will not present a synthetic fixture as a live plant while live mode is on.

## What stays when the model changes

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.** The cross-system connection named below is doctrine. Current release status is tracked in the [release](12-release-and-deployment.md) and [acceptance](09-testing-and-acceptance.md) documentation. The connection is not a running production capability.

Most manufacturing systems own one part of the story. EKAS connects those parts through governed context and evidence, then guides the user from operational loss to accountable action and verified improvement.

The model can change. The manufacturing truth, governance, evidence chain and user workflow must not.

## Product definition at the time of the event

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

EKAS can be designed to understand which product, revision, controlled definition, engineering change, and process conditions were in force at the time of the event. The contract is [Product / part identity and PLM context](cross-system/11-product-part-identity-and-plm-context.md). The running conversation does not yet read PLM.

Most systems own one piece of the story. EKAS connects those pieces into governed manufacturing context.

## Maturity and the claim

The claim is a governed path from a missed goal to verified improvement. [22 EKAS Manufacturing AI Maturity Model](22-manufacturing-ai-maturity-model.md) says that path is earned one layer at a time. A conversation can explain and propose. The manufacturing truth, the evidence, the authorization, and the verification stay outside the model. Governed autonomy is not required for the claim, and it is not claimed here.

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.** Cross-system evidence for that path, predictive optimization, orchestration into source systems, and any governed-autonomy action are not running capabilities.

## Start with one problem

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.**

EKAS can start with one bounded manufacturing problem and expand across systems, lines, and sites without changing its core governed decision architecture. The value of EKAS is not that it replaces plant systems. The value is that it connects their evidence into one governed decision workflow.

The deployment doctrine is [23 Deployment and scale strategy](23-deployment-and-scale-strategy.md). A live multi-site expansion is not a running capability. Current release status is tracked in the [release](12-release-and-deployment.md) and [acceptance](09-testing-and-acceptance.md) documentation.
