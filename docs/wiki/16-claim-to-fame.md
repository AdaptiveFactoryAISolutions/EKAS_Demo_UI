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

**DOCUMENTED NOW — NOT YET IMPLEMENTED IN PRODUCTION.** The cross-system connection named below is doctrine. RC3 chat remains the governed demo. The connection is not a running production capability.

Most manufacturing systems own one part of the story. EKAS connects those parts through governed context and evidence, then guides the user from operational loss to accountable action and verified improvement.

The model can change. The manufacturing truth, governance, evidence chain and user workflow must not.
