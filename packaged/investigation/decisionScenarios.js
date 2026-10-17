import { caseFixtures, checkShift } from "./cases.js";
//#region app/src/investigation/decisionScenarios.ts
const exact = (x, keys) => Object.keys(x).length === keys.length && Object.keys(x).every((k) => keys.includes(k));
const bounded = (n, max) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= max;
function recoveryScenario(caseId, asOf, p) {
	if (caseId !== "downtime" || !p || !exact(p, [
		"minutesPerShift",
		"eligibleShifts",
		"effectiveness",
		"constraintUnits",
		"demandUnits",
		"unitMarginUsd",
		"actionCostUsd"
	]) || !bounded(p.minutesPerShift, 60) || !Number.isSafeInteger(p.eligibleShifts) || p.eligibleShifts < 1 || p.eligibleShifts > 100 || !bounded(p.effectiveness, 1) || !bounded(p.constraintUnits, 1e6) || !bounded(p.demandUnits, 1e6) || !bounded(p.unitMarginUsd, 1e5) || !bounded(p.actionCostUsd, 1e6)) throw Error("Use explicit bounded downtime recovery assumptions; other endpoints require a separately governed scenario.");
	const f = caseFixtures.downtime, rows = f.shifts.filter((s) => s.period === "baseline" && f.verification.baselineIds.includes(s.id) && s.knownAt <= asOf && checkShift(s, f) === null), good = rows.reduce((n, r) => n + r.good, 0), run = rows.reduce((n, r) => n + r.plannedMin - r.downMin, 0);
	if (rows.length < f.verification.requiredShifts || run <= 0) throw Error("Exact eligible baseline exposure is incomplete.");
	const horizon = p.eligibleShifts + " eligible shifts", theoretical = p.minutesPerShift * p.eligibleShifts / f.current.idealCycleMin, gross = p.minutesPerShift * p.eligibleShifts * good / run, expected = gross * p.effectiveness, usable = Math.min(expected, p.constraintUnits), saleable = Math.min(usable, p.demandUnits);
	return {
		kind: "bounded_synthetic_recovery_scenario",
		assumptions: structuredClone(p),
		stages: [
			{
				id: "theoretical",
				value: theoretical,
				unit: "theoretical units",
				horizon
			},
			{
				id: "gross",
				value: gross,
				unit: "baseline-rate recoverable good units",
				horizon
			},
			{
				id: "expected",
				value: expected,
				unit: "expected good units",
				horizon
			},
			{
				id: "constrained",
				value: usable,
				unit: "potential usable good units",
				horizon
			},
			{
				id: "saleable",
				value: saleable,
				unit: "potential saleable good units",
				horizon
			},
			{
				id: "gross-opportunity",
				value: saleable * p.unitMarginUsd,
				unit: "USD gross opportunity",
				horizon
			}
		],
		actionCost: {
			value: p.actionCostUsd,
			unit: "USD assumed action cost",
			horizon
		},
		baseline: {
			goodUnits: good,
			operatingMinutes: run,
			sourceIds: rows.map((r) => r.source),
			rowIds: rows.map((r) => r.id)
		},
		realizedFinancialSavings: null,
		causalStatus: "unconfirmed",
		financiallyValidated: false,
		notDispatched: true,
		qualification: "Assumption-driven synthetic scenario. Observed baseline rate is not causal proof of future recovery or verified financial savings."
	};
}
function constrainedPortfolio(p) {
	if (!p || !exact(p, [
		"budgetUsd",
		"availableHours",
		"horizon",
		"candidates"
	]) || !bounded(p.budgetUsd, 1e6) || !bounded(p.availableHours, 1e3) || p.horizon !== "one synthetic planning cycle" || !Array.isArray(p.candidates) || p.candidates.length < 1 || p.candidates.length > 8 || new Set(p.candidates.map((c) => c?.investigationId)).size !== p.candidates.length || p.candidates.some((c) => !c || !exact(c, [
		"investigationId",
		"expectedVersion",
		"costUsd",
		"hours",
		"priorityScore"
	]) || typeof c.investigationId !== "string" || !Number.isSafeInteger(c.expectedVersion) || c.expectedVersion < 1 || !bounded(c.costUsd, 1e6) || !bounded(c.hours, 1e3) || c.hours <= 0 || !bounded(c.priorityScore, 100))) throw Error("Use distinct source-bound cases and explicit bounded budget/hours/dimensionless priorities.");
	let best = {
		selectedInvestigationIds: [],
		totalCostUsd: 0,
		totalHours: 0,
		priorityScore: 0
	};
	for (let mask = 1; mask < 2 ** p.candidates.length; mask++) {
		const selected = p.candidates.filter((_, i) => mask & 1 << i), cost = selected.reduce((n, c) => n + c.costUsd, 0), hours = selected.reduce((n, c) => n + c.hours, 0), score = selected.reduce((n, c) => n + c.priorityScore, 0), ids = selected.map((c) => c.investigationId).sort();
		if (cost <= p.budgetUsd && hours <= p.availableHours && (score > best.priorityScore || score === best.priorityScore && cost < best.totalCostUsd)) best = {
			selectedInvestigationIds: ids,
			totalCostUsd: cost,
			totalHours: hours,
			priorityScore: score
		};
	}
	return {
		kind: "constrained_synthetic_portfolio",
		...best,
		horizon: p.horizon,
		budgetUsd: p.budgetUsd,
		availableHours: p.availableHours,
		priorityUnit: "dimensionless reviewed assumption",
		endpointPooling: false,
		productionDispatched: false,
		financiallyValidated: false,
		causalStatus: "unconfirmed",
		qualification: "Maximizes explicitly reviewed priority assumptions under budget and hours; no numerical endpoint pooling, employee ranking, authorization, actual capacity or validated savings."
	};
}
//#endregion
export { constrainedPortfolio, recoveryScenario };
