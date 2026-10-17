import "./model.js";
//#region app/src/decision.ts
const gaps = [
	"Outcome-led first use",
	"Data-readiness checklist per outcome",
	"Integration health with decision impact",
	"Identity mapping and reconciliation",
	"Goal → driver → guardrail chain",
	"Transparent priority and constrained portfolio",
	"ISA-95-aligned equipment navigation",
	"Problem jobs by part and revision",
	"Mixed-product comparisons and plan baselines",
	"Lot genealogy and bounded affected scope",
	"Containment versus corrective-action outcome",
	"Supplier/customer obligation exception review",
	"Measurement trust changes the decision",
	"Special characteristics and safety escalation",
	"Preserve controlled-document and EC separation",
	"Search beyond the happy-path phrase",
	"Learning capture after success or failure",
	"Technician evidence, diagnosis and work-order phases",
	"PM review and recurring failure feedback",
	"Critical spares, tooling life and availability constraints",
	"Assignment acceptance and accountable handover",
	"Reviews, decisions and escalation queues",
	"Comments, mentions and decision context",
	"Notification burden and acknowledgment",
	"Capability matrix instead of role theater",
	"Shared workstation and session handoff",
	"Personnel minimization and no worker ranking",
	"Actual data flow and deployment capability disclosure",
	"Offline read versus queued work",
	"Partial/truncated query results and scale",
	"Late data, corrections and restatement",
	"Mutation recovery and consequential boundary",
	"Comparable best-known run and cohort eligibility",
	"What-if trade-offs with feasible bounds",
	"Constraint, demand and sell-through bridge",
	"Finance signoff and benefit ownership",
	"Hypothesis discrimination and refutation",
	"Distinct uncertainty dimensions and negative results",
	"Evidence coverage at claim level",
	"Operator quick task and correction loop",
	"Workload-aware action and verification planning",
	"Accessibility and shopfloor acceptance beyond screenshots",
	"Time, units and language localization",
	"Adoption outcomes without surveillance",
	"Export an evidence-complete review packet",
	"Retention, archive and evidence deletion policy",
	"Sustain observer coverage and ownership changes",
	"Intervention overlap and verification plan changes",
	"Capability-to-experience negotiation",
	"Requirement disposition and change control",
	"Comparative task testing before leadership claim",
	"Customer operating-profile discovery",
	"Management review and audit finding follow-through",
	"Useful manual-data and low-maturity path",
	"Contingency and disruption context",
	"Actual Highcharts Dashboards and scientific chart choice"
];
const production = /* @__PURE__ */ new Set([
	14,
	20,
	23,
	25,
	26,
	27,
	36,
	46,
	49,
	54
]);
const customer = /* @__PURE__ */ new Set([
	28,
	44,
	51,
	52
]);
const preserve = /* @__PURE__ */ new Set([
	15,
	18,
	19,
	32,
	56
]);
const gapLedger = gaps.map((title, i) => ({
	id: "GAP-" + String(i + 1).padStart(3, "0"),
	title,
	disposition: production.has(i + 1) ? "contract_before_production" : customer.has(i + 1) ? "customer_decision" : preserve.has(i + 1) ? "preserve_and_test" : "demo_now",
	state: "Acceptance pending",
	owner: production.has(i + 1) ? "Engineer + customer authority" : customer.has(i + 1) ? "Customer + product research" : "Frontend + product",
	proof: "Frozen-build task acceptance not yet executed"
}));
//#endregion
export { gapLedger, gaps };
