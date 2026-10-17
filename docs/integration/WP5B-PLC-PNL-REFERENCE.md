# PLC-to-P&L / downtime profit leak — future reference

Status: **FUTURE PRODUCT / COMMERCIAL / DASHBOARD REFERENCE**. Not implemented. Not a WP5B acceptance artifact. Not a backend contract. No reference image was supplied. This note records the concept from the directive text only.

EKAS connects operational loss to business impact and guides action. That claim is the idea to keep. It does not add financial, predictive-maintenance, vision, ERP, or P&L behavior to the current demo or to the current adapter.

## Concept

Downtime is a profit leak when, and only when, governed business data supports the chain from lost time to lost output, to delivery or service impact, to cost or margin impact. Unproven financial realization is not claimed.

Ideas retained for a later package, using EKAS wording and the EKAS design system:

1. Downtime framed as a profit leak, not only a maintenance metric.
2. An executive strip of hours lost, downtime cost, and stoppage events, only from governed sources. Downtime cost is not fabricated.
3. A loss chain: production issue, loss category, operational effect, delivery or business effect, and financial impact where that last step is governed.
4. Top repeat offenders as an EKAS Pareto: repeated assets, recurring failure modes, repeat jobs or processes, and downtime contribution.
5. Where the money escapes, with three separate figures: observed operational loss, modeled opportunity, and verified financial value. A modeled opportunity is not labeled savings.
6. A recurrence-by-impact matrix using governed thresholds only. No invented risk score.
7. A plant-head decision strip in original EKAS wording: Fix first, Protect next, Prove impact. Fix first is the highest supported actionable loss. Protect next covers recurrence, constraints, and guardrails. Prove impact covers verification, sustain, and business value.
8. Operator and supervisor questions through Chat first: which stop repeats most; what one hour of this loss costs; who owns the recurring issue; what to check tomorrow; whether the corrective action reduced recurrence.

## Where a later package would put it

Maintenance and Reliability, Plant Operations, the investigation view, the improvement workflow, a plant-head operating review, an executive summary, a business-value view, and the PLC-to-P&L architecture story. Dashboards stay in support of Chat. This is not a new standalone BI page.

For the question "What is downtime costing us?", a later Chat answer would establish the exact scope, say whether cost inputs are governed, explain the operational loss, show a chart or table when that helps, keep actual cost separate from modeled opportunity, and offer the next investigation or action.

## Required governed inputs

A later implementation needs contracts for:

- Downtime intervals with asset, start, end, reason, scope, and period, from a governed source.
- A governed production rate before any operational-consequence figure, such as estimated recoverable units.
- An explicit assumption set, with owner and approval, before any modeled opportunity.
- Authorized finance or cost data, plus the evidence the finance contract requires, before any verified financial figure.
- A governed recurrence definition and threshold.
- The accepted investigation lifecycle: owner, hypothesis, bounded action, authorization, performed work, verification, and sustain. Those operations are not on current backend main. See `docs/integration/WP5B-GAP-CONTRACT.md`. They are not implemented by this note.

## What current main already contains, and what it is not

These artifacts were read at `473bdc0d2458fcffdbe516d220d4f88bcb2f1916`. They are not this reference, and they are not implemented in the demo UI.

- `schemas.ts` `observed.downtime_events` is an observed fact on a completed turn: `fact_id`, `start`, `end`, `seconds`, `reason_code`, label `OBSERVED_FACT`. It is not a cost.
- Kernel compute v1 `downtime_intervals` are an input to an uncertified candidate calculation for a synthetic tenant. The tool is not mounted. The schema's downtime reason in that bounded contract is `unplanned.mechanical`. It is not an executive KPI.
- `schemas.ts` opportunity value may carry an amount and a currency, and `financial_assumption` may carry `approval_status`, `rate_per_hour`, `currency`, `source`, and `owner`. That is the opportunity value schema. It is not verified financial value, not a downtime-cost metric read, and not a P&L.

## Financial integrity

Three layers stay separate.

- Observed loss. Example used only as a rule: 240 downtime minutes. That number is not a measurement from this repo.
- Operational consequence. Estimated recoverable units come from a governed production rate. They are not savings.
- Modeled opportunity. Possible gross contribution uses explicit assumptions and stays labeled as a model.
- Verified financial impact. Only after authorized finance or cost data and the required evidence exist.

An operational estimate is never converted directly into savings. A modeled opportunity is never labeled savings.

## PLC-to-P&L doctrine

EKAS sits across PLC, sensors, and vision; SCADA and historian; MES, QMS, and CMMS; ERP; and finance and P&L. It connects them as Understand, Investigate, Decide, Act, Verify, Sustain. It does not replace those specialist systems. It is the governed manufacturing decision-intelligence layer above them. None of that layer is built by this note.

## Clean-room rule

No reference image was part of this round. If one is used later, it is research inspiration only. Do not copy its image, layout, visual hierarchy, colors, wording, logos, icons, chart arrangement, titles, or branded terminology. Rebuild with the EKAS design system, light and dark theme, Lucide icons, Highcharts, governed metrics, the shared context contract, evidence, and the accepted investigation lifecycle.

## Implementation credit

None. No screen, calculation, fixture, or route was added for this reference.
