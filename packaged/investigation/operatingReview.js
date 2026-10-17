import scenario_temporal_policy_default from "../inputs/scenario-temporal-policy.js";
import scenario_fixture_default from "../inputs/scenario-fixture.js";
import { analyzeInvestigation, createInvestigation } from "./model.js";
import { caseFixtures, shiftMetrics } from "./cases.js";
import { absoluteDifferenceUnit } from "./quantitySemantics.js";
import { rankingPolicy, records } from "../inputs/plant-target-approvals-v57.js";
import { lines, metrics, pool } from "../model.js";
//#region app/src/investigation/operatingReview.ts
/** Source/event end and known time both bound complete observations. */
function observationEligible(asOf, ...times) {
	return Number.isFinite(Date.parse(asOf)) && times.every((t) => Number.isFinite(Date.parse(t)) && Date.parse(t) <= Date.parse(asOf));
}
function projectCaseReadiness(asOf, fixtures = caseFixtures) {
	return Object.values(fixtures).map((f) => {
		const eligible = observationEligible(asOf, scenario_temporal_policy_default.source_cutoff, f.context.to, f.current.knownAt, ...f.current.intervals.flatMap((e) => e.knownAt ? [e.knownAt] : []));
		const goalKnown = observationEligible(asOf, f.goal.approvedAt, f.goal.effectiveFrom) && f.goal.effectiveFrom <= f.context.from && f.context.to <= f.goal.effectiveTo;
		const a = eligible && f.caseId === "downtime" ? analyzeInvestigation(createInvestigation()).goal : null;
		const actual = eligible ? a?.actual ?? shiftMetrics([f.current]).good : null, target = goalKnown ? a?.target ?? f.goal.value : null;
		return {
			caseId: f.caseId,
			title: f.title,
			actual,
			target,
			gap: actual === null || target === null ? null : target - actual,
			unit: "good units",
			scope: f.caseId === "downtime" ? "Northworks plant" : f.context.job,
			fixtureVersion: f.fixtureVersion,
			source: f.goal.source,
			context: f.context,
			observationReadiness: eligible ? "observed" : "future_record",
			targetReadiness: goalKnown ? "ready" : "unavailable"
		};
	});
}
/** Reuses the accepted Northworks calculations and reporting contexts. Targets
* absent from controlled records stay absent; illustrative80% is not a goal. */
function operatingReview(asOf = "2026-10-06T14:45:00Z") {
	const values = metrics(pool(lines)), contexts = scenario_fixture_default.reporting_contexts;
	const governedBundle = [
		{
			id: "production",
			name: "Production versus plan",
			value: values.production,
			unit: "%",
			context: contexts.production,
			target: 100,
			targetAuthority: "Explicit synthetic approved production plan",
			source: "scenario-fixture.json#/lines + northworks-investigation-v1#/goal"
		},
		{
			id: "oee",
			name: "OEE",
			value: values.oee,
			unit: "%",
			context: contexts.production,
			target: null,
			targetAuthority: "No approved OEE target supplied",
			source: "scenario-fixture.json#/lines"
		},
		{
			id: "downtime",
			name: "Downtime",
			value: values.downtime,
			unit: "min",
			context: contexts.production,
			target: null,
			targetAuthority: "No approved plant downtime target supplied",
			source: "scenario-fixture.json#/lines"
		},
		{
			id: "qualityLoss",
			name: "Quality loss",
			value: values.qualityLoss,
			unit: "%",
			context: contexts.production,
			target: null,
			targetAuthority: "No approved plant quality-loss target supplied",
			source: "scenario-fixture.json#/lines"
		},
		{
			id: "schedule",
			name: "Schedule adherence",
			value: values.schedule,
			unit: "%",
			context: contexts.schedule,
			target: null,
			targetAuthority: "No approved target supplied",
			source: "scenario-fixture.json#/reporting_contexts/schedule"
		},
		{
			id: "inventory",
			name: "Inventory days · unit basis",
			value: values.inventory,
			unit: "day",
			context: contexts.inventory,
			target: null,
			targetAuthority: "Unit-basis variant; no approved target or monetary DIO supplied",
			source: "scenario-fixture.json#/reporting_contexts/inventory"
		},
		{
			id: "otif",
			name: "OTIF",
			value: values.otif,
			unit: "%",
			context: contexts.delivery,
			target: null,
			targetAuthority: "No approved target supplied",
			source: "scenario-fixture.json#/reporting_contexts/delivery"
		}
	].map((m) => {
		const approval = records.find((a) => a.metricId === m.id && a.status === "approved" && a.unit === m.unit && JSON.stringify(a.context) === JSON.stringify(m.context) && observationEligible(asOf, a.approvedAt, a.knownAt, a.effectiveFrom) && Date.parse(asOf) < Date.parse(a.effectiveTo));
		const value = observationEligible(asOf, scenario_temporal_policy_default.source_cutoff) ? m.value : null;
		const target = approval?.value ?? null, difference = target === null || value === null ? null : approval.direction === "higher" ? target - value : value - target;
		return {
			...m,
			value,
			sourceCutoff: scenario_temporal_policy_default.source_cutoff,
			observationReadiness: value === null ? "future_record" : "observed",
			target,
			targetReadiness: approval ? "ready" : "unavailable",
			targetAuthority: approval ? "Explicit fictional versioned Plant Head approval; not real plant approval" : "No effective same-scope synthetic approval at this cutoff",
			targetApproval: approval || null,
			targetSource: approval?.source || null,
			deviation: {
				value: difference,
				unit: absoluteDifferenceUnit(m.unit),
				direction: approval?.direction || null
			},
			priorityScore: difference === null || target === null || target === 0 ? null : Math.max(0, difference) / Math.abs(target),
			actionReadiness: value === null ? "blocked by observation eligibility" : approval ? "discovery; additional operational evidence required" : "blocked by target governance"
		};
	});
	const metricGaps = governedBundle.filter((m) => m.deviation.value !== null && m.deviation.value > 0 && m.priorityScore !== null).sort((a, b) => b.priorityScore - a.priorityScore || a.id.localeCompare(b.id));
	const caseReadiness = projectCaseReadiness(asOf), gaps = caseReadiness.filter((g) => g.gap !== null && g.gap > 0).sort((a, b) => b.gap - a.gap || a.caseId.localeCompare(b.caseId));
	return {
		fixtureVersion: "operating-review-v1",
		synthetic: true,
		asOf,
		bundle: governedBundle,
		metricGaps,
		gaps,
		caseReadiness,
		investigationLinks: [...gaps.map((g) => ({
			kind: "case",
			id: g.caseId
		})), ...metricGaps.map((m) => ({
			kind: "metric",
			id: m.id
		}))],
		metricRankingPolicy: rankingPolicy,
		rankingPolicy: "Absolute good-unit goal shortfall across separately declared cases. These scopes are not additive. Seven metric deviations have their own units/horizons and dimensionless priority policy; they are not unit-summed or automatically causal. Missing governed targets cannot create actionable gaps."
	};
}
//#endregion
export { observationEligible, operatingReview, projectCaseReadiness };
