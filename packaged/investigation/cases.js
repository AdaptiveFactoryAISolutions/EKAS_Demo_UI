import { evaluateMetric } from "../platform/metricEngine.js";
import production_jobs_fixture_default from "../inputs/production-jobs-fixture.js";
import { cases } from "../inputs/negative-outcomes-v56.js";
import scenario_temporal_policy_default from "../inputs/scenario-temporal-policy.js";
import speed_investigation_v1_default from "../inputs/speed-investigation-v1.js";
import quality_investigation_v1_default from "../inputs/quality-investigation-v1.js";
import scenario_fixture_default from "../inputs/scenario-fixture.js";
import northworks_investigation_v1_default from "../inputs/northworks-investigation-v1.js";
import knowledge_fixtures_default from "../inputs/knowledge-fixtures.js";
import maintenance_fixture_default from "../inputs/maintenance-fixture.js";
import { reconcileIntervals } from "./model.js";
//#region app/src/investigation/cases.ts
const makeShift = (s, period) => ({
	id: s.shift_id,
	period,
	date: s.date,
	assetId: s.asset_id,
	jobId: "JOB-8303",
	part: s.product_id,
	revision: s.product_revision,
	operation: s.operation_id,
	plannedMin: s.planned_min,
	downMin: s.down_min,
	runMin: s.run_min,
	total: s.total_units,
	good: s.good_units,
	firstPassGood: null,
	idealCycleMin: s.ideal_cycle_min,
	coverage: s.coverage,
	eligible: s.eligible,
	crew: s.crew_id,
	energyKwh: s.electricity_kwh,
	definitionVersion: "independent-metric-contract-1.0",
	knownAt: s.known_at,
	source: "scenario-fixture.json#/case/" + period + "/shifts/" + s.shift_id,
	jamMin: s.feeder_jam_min,
	intervals: northworks_investigation_v1_default.comparisonIntervals.filter((x) => x.shiftId === s.shift_id).map((x) => ({
		id: x.id,
		start: (Date.parse(x.start) - Date.parse(s.start)) / 6e4,
		end: (Date.parse(x.end) - Date.parse(s.start)) / 6e4,
		reason: x.reason
	}))
});
const job = production_jobs_fixture_default.jobs.find((x) => x.job_id === "JOB-8303");
const downtime = {
	schemaVersion: 1,
	fixtureVersion: "northworks-investigation-v1",
	synthetic: true,
	authorship: northworks_investigation_v1_default.kind,
	caseId: "downtime",
	title: "Northworks feeder-jam plan miss",
	domain: "downtime",
	context: {
		tenant: "synthetic-demo",
		plant: "Northworks",
		line: "Line 03",
		asset: "FEED-03",
		job: "JOB-8303",
		part: "NW-A",
		revision: "P2",
		operation: "OP-030",
		from: "2026-10-06T06:00:00Z",
		to: "2026-10-06T14:00:00Z"
	},
	goal: { ...northworks_investigation_v1_default.goal },
	current: {
		id: "NW-CURRENT-003",
		period: "current",
		date: "2026-10-06",
		assetId: job.asset_id,
		jobId: job.job_id,
		part: job.product_id,
		revision: job.product_revision,
		operation: job.operation_id,
		plannedMin: job.planned_min,
		downMin: job.down_min,
		runMin: job.run_min,
		total: job.total_units,
		good: job.good_units,
		firstPassGood: null,
		idealCycleMin: .5,
		coverage: 1,
		eligible: true,
		crew: "current crew",
		energyKwh: null,
		definitionVersion: "independent-metric-contract-1.0",
		knownAt: "2026-10-06T14:00:00Z",
		source: "production-jobs-fixture.json#/jobs/JOB-8303",
		jamMin: 72,
		intervals: scenario_fixture_default.line_03_stop_events.map((x) => ({
			id: x.id,
			start: (Date.parse(x.start) - Date.parse("2026-10-06T06:00:00Z")) / 6e4,
			end: (Date.parse(x.end) - Date.parse("2026-10-06T06:00:00Z")) / 6e4,
			reason: x.reason,
			startAt: x.start,
			endAt: x.end,
			knownAt: scenario_temporal_policy_default.record_availability.find((r) => r.id === x.id)?.known_at || null,
			recordedAt: null,
			source: "scenario-fixture.json#/line_03_stop_events/" + x.id
		}))
	},
	shifts: [...scenario_fixture_default.case.baseline.shifts.map((s) => makeShift(s, "baseline")), ...scenario_fixture_default.case.post.shifts.map((s) => makeShift(s, "post"))],
	documents: knowledge_fixtures_default.documents.map((d) => ({
		id: d.document_id,
		version: d.revision_id,
		kind: d.document_class === "standard_work" ? "SW" : d.document_class === "control_plan" ? "CP" : d.document_class,
		controlled: d.lifecycle !== "uncontrolled",
		status: d.lifecycle,
		effectiveFrom: d.effectivity?.from || "",
		effectiveTo: d.effectivity?.to_exclusive || null,
		knownAt: d.known_at || d.available_from,
		part: d.scope?.product_id,
		revision: d.scope?.product_revision,
		assetId: d.scope?.asset_id,
		operation: d.scope?.process_step_id,
		text: d.sections.map((s) => s.text || JSON.stringify(s.columns || {})).join("\n"),
		source: d.source.uri
	})).concat(maintenance_fixture_default.source_notes.map((n) => ({
		id: n.note_id || n.id,
		version: 1,
		kind: "note",
		controlled: false,
		status: "uncontrolled",
		effectiveFrom: "",
		effectiveTo: null,
		knownAt: n.known_at || n.available_from,
		part: "NW-A",
		revision: "P2",
		assetId: "FEED-03",
		operation: "OP-030",
		text: n.sentences.map((s) => s.id + ": " + s.text).join("\n"),
		source: n.source?.uri || "maintenance-fixture.json"
	}))),
	hypotheses: [{
		id: "downtime-H1",
		description: "Guide wear or feeder setup may contribute to jams.",
		supportingEvidenceIds: ["NOTE-2401:s2"],
		contradictingEvidenceIds: [],
		test: "Inspect guide wear and setup against applicable standard work."
	}, {
		id: "downtime-H2",
		description: "Material or crew variation may contribute; present records do not establish either.",
		supportingEvidenceIds: ["PFMEA-030"],
		contradictingEvidenceIds: [],
		test: "Compare material and setup observations while preserving product and exposure."
	}],
	tests: [northworks_investigation_v1_default.authoredInspection, northworks_investigation_v1_default.materialTest],
	work: {
		id: "DEMO-WO-003",
		performedAt: "2026-10-06T15:10:00Z",
		knownAt: "2026-10-06T15:15:00Z",
		assetId: "FEED-03",
		jobId: "JOB-8303",
		part: "NW-A",
		revision: "P2",
		operation: "OP-030",
		performer: "Fictional maintenance technician",
		confirmation: "Fictional operator return-to-service confirmation",
		description: "Bounded like-for-like guide restoration. EC-003 remains unreleased.",
		source: "northworks-investigation-v1#/workProof"
	},
	verification: {
		version: 1,
		endpoint: "jamMin",
		direction: "lower",
		target: 30,
		unit: "min per eligible shift",
		requiredShifts: 10,
		qualityMaxPct: scenario_fixture_default.case.verification_plan.guardrails[0].threshold_max * 100,
		energyMaxKwhPerGood: scenario_fixture_default.case.verification_plan.guardrails[1].threshold_max,
		baselineIds: scenario_fixture_default.case.baseline.shifts.filter((s) => s.eligible).map((s) => s.shift_id),
		postIds: scenario_fixture_default.case.post.shifts.filter((s) => s.eligible).map((s) => s.shift_id),
		source: "scenario-fixture.json#/case/verification_plan"
	},
	sustain: {
		threshold: 45,
		required: 5,
		consecutiveRecurrence: 2,
		observations: [
			"2026-10-21",
			"2026-10-22",
			"2026-10-23",
			"2026-10-26",
			"2026-10-27",
			"2026-10-28",
			"2026-10-29",
			"2026-10-30",
			"2026-11-02",
			"2026-11-03"
		].map((d, i) => ({
			id: "NW-SUSTAIN-" + d,
			at: d + "T14:00:00Z",
			value: [
				28,
				26,
				30,
				25,
				27,
				25,
				30,
				29,
				55,
				58
			][i],
			eligible: true
		}))
	},
	assignmentAcceptances: northworks_investigation_v1_default.assignmentAcceptances,
	assignmentAcceptance: northworks_investigation_v1_default.assignmentAcceptance,
	safetyReviews: northworks_investigation_v1_default.safetyReviews,
	costAssumptions: {
		costUsd: 900,
		contributionPerUnit: 12,
		effectiveness: .8,
		horizon: "10 eligible shifts",
		financiallyValidated: false
	}
};
const caseFixtures = {
	downtime,
	speed: speed_investigation_v1_default,
	quality: quality_investigation_v1_default
};
const negativeFixtureCache = /* @__PURE__ */ new Map();
function fixtureCase(id, condition = "complete") {
	if (!Object.hasOwn(caseFixtures, id)) throw Error("Unknown case; select a declared fixture.");
	const original = caseFixtures[id];
	if (condition !== "no_improvement" && condition !== "worse_outcome") return original;
	const key = id + ":" + condition;
	let fixture = negativeFixtureCache.get(key);
	if (fixture) return fixture;
	const overlay = cases[id][condition];
	const retained = new Set(original.shifts.filter((s) => s.period !== "post").map((s) => s.id));
	retained.add(original.current.id);
	fixture = {
		...original,
		shifts: [...original.shifts.filter((s) => s.period !== "post"), ...overlay.shifts],
		verification: {
			...original.verification,
			postIds: overlay.shifts.map((s) => s.id),
			source: original.verification.source + "; explicit synthetic negative cohort: negative-outcomes-v56.json#/cases/" + id + "/" + condition
		},
		cycleRecords: [...(original.cycleRecords || []).filter((c) => retained.has(c.shiftId)), ...overlay.cycleRecords],
		units: [...(original.units || []).filter((u) => retained.has(u.shiftId)), ...overlay.units]
	};
	negativeFixtureCache.set(key, fixture);
	return fixture;
}
function northworksParentView() {
	const records = production_jobs_fixture_default.jobs.filter((j) => [
		"JOB-8401",
		"JOB-8402",
		"JOB-8303"
	].includes(j.job_id));
	const rows = records.map((j) => ({
		...downtime.current,
		id: j.job_id,
		assetId: j.asset_id,
		jobId: j.job_id,
		plannedMin: j.planned_min,
		downMin: j.down_min,
		runMin: j.run_min,
		total: j.total_units,
		good: j.good_units,
		source: "production-jobs-fixture.json#/jobs/" + j.job_id
	}));
	const eventReconciliation = records.map((j) => {
		const events = j.job_id === "JOB-8303" ? downtime.current.intervals : northworks_investigation_v1_default.extraShiftIntervals.filter((e) => e.jobId === j.job_id).map((e) => ({
			id: e.id,
			start: (Date.parse(e.start) - Date.parse(downtime.context.from)) / 6e4,
			end: (Date.parse(e.end) - Date.parse(downtime.context.from)) / 6e4,
			reason: e.reason
		}));
		return {
			jobId: j.job_id,
			unionMin: reconcileIntervals(events, [0, 480]),
			sourceIds: events.map((e) => e.id)
		};
	});
	const metrics = shiftMetrics(rows), rawDowntimeMin = eventReconciliation.reduce((n, e) => n + e.unionMin, 0);
	return {
		context: {
			kind: "plant",
			tenant: downtime.context.tenant,
			plant: downtime.context.plant,
			from: downtime.context.from,
			to: downtime.context.to,
			jobIds: records.map((j) => j.job_id)
		},
		metrics,
		rawDowntimeMin,
		eventReconciliation,
		goal: {
			actual: metrics.good,
			target: downtime.goal.value,
			gap: downtime.goal.value - metrics.good,
			attainment: 100 * metrics.good / downtime.goal.value
		},
		bridge: [
			metrics.planned / .5,
			-rawDowntimeMin / .5,
			-Number(metrics.speedLoss.value) / .5,
			-(metrics.total - metrics.good),
			metrics.good
		],
		sourceIds: [
			...rows.map((s) => s.source),
			...eventReconciliation.flatMap((e) => e.sourceIds),
			"northworks-investigation-v1.json#/extraShiftIntervals"
		]
	};
}
function applicable(doc, context, asOf) {
	return doc.controlled && doc.status === "approved" && doc.knownAt <= asOf && !!doc.effectiveFrom && doc.effectiveFrom <= asOf && (!doc.effectiveTo || asOf < doc.effectiveTo) && doc.part === context.part && doc.revision === context.revision && doc.assetId === context.asset && doc.operation === context.operation;
}
function shiftMetrics(rows) {
	const sum = (k) => rows.reduce((n, s) => n + Number(s[k]), 0), planned = sum("plannedMin"), run = sum("runMin"), total = sum("total"), good = sum("good"), idealTotal = rows.reduce((n, s) => n + s.total * s.idealCycleMin, 0), idealGood = rows.reduce((n, s) => n + s.good * s.idealCycleMin, 0);
	const policy = {
		namespace: "investigation-service",
		mode: "observed",
		coverage: rows.length ? 1 : 0
	};
	const evaluate = (id, inputs) => evaluateMetric(id, inputs, policy);
	const firstPass = rows.every((s) => s.firstPassGood !== null) ? sum("firstPassGood") : null;
	return {
		planned,
		run,
		total,
		good,
		down: sum("downMin"),
		idealTotal,
		idealGood,
		oee: evaluate("ekas.oee", {
			ideal_good_min: idealGood,
			planned_min: planned
		}),
		availability: evaluate("ekas.availability", {
			run_min: run,
			planned_min: planned
		}),
		performance: evaluate("ekas.performance", {
			ideal_total_min: idealTotal,
			run_min: run
		}),
		quality: evaluate("ekas.quality", {
			good_units: good,
			total_units: total
		}),
		fpy: evaluate("ekas.first_pass_yield", {
			first_pass_good_units: firstPass,
			entering_units: total
		}),
		qualityLoss: evaluate("ekas.quality_loss", {
			final_non_good_units: total - good,
			total_units: total
		}),
		speedLoss: evaluate("ekas.performance_loss_time", {
			run_min: run,
			ideal_total_min: idealTotal
		}),
		qualityLossMin: evaluate("ekas.quality_loss_time", {
			ideal_total_min: idealTotal,
			ideal_good_min: idealGood
		}),
		jamMean: rows.length && rows.every((s) => s.jamMin !== void 0) ? sum("jamMin") / rows.length : null,
		energyPerGood: good > 0 && rows.every((s) => typeof s.energyKwh === "number" && Number.isFinite(s.energyKwh)) ? sum("energyKwh") / good : null
	};
}
const cycleIndexes = /* @__PURE__ */ new WeakMap();
function cycleIndex(f) {
	let index = cycleIndexes.get(f);
	if (!index) {
		index = /* @__PURE__ */ new Map();
		for (const c of f.cycleRecords || []) {
			const rows = index.get(c.shiftId) || [];
			rows.push(c);
			index.set(c.shiftId, rows);
		}
		cycleIndexes.set(f, index);
	}
	return index;
}
const unitIndexes = /* @__PURE__ */ new WeakMap();
const invalidUnitFixtures = /* @__PURE__ */ new WeakSet();
function unitIndex(f) {
	let index = unitIndexes.get(f);
	if (!index) {
		index = new Map((f.units || []).map((u) => [u.id, u]));
		if (index.size !== (f.units || []).length || (f.units || []).some((u) => ![
			"accepted_first_pass",
			"accepted_rework",
			"scrap"
		].includes(u.terminalDisposition) || u.firstPassAccepted !== (u.terminalDisposition === "accepted_first_pass"))) invalidUnitFixtures.add(f);
		unitIndexes.set(f, index);
	}
	return index;
}
function checkShift(s, fixture) {
	if (s.coverage < .95 || !s.eligible || s.jobId !== fixture.context.job || s.part !== fixture.context.part || s.revision !== fixture.context.revision || s.assetId !== fixture.context.asset || s.operation !== fixture.context.operation || s.plannedMin !== 480 || s.idealCycleMin !== .5 || s.definitionVersion !== "independent-metric-contract-1.0") return "Incompatible or incomplete shift exposure";
	if (![
		s.plannedMin,
		s.downMin,
		s.runMin,
		s.total,
		s.good
	].every(Number.isFinite) || s.good < 0 || s.good > s.total || s.total < 0 || s.downMin < 0 || s.downMin > s.plannedMin || s.runMin !== s.plannedMin - s.downMin || s.runMin < s.total * s.idealCycleMin) return "Invalid exclusive loss operands";
	if (reconcileIntervals(s.intervals, [0, s.plannedMin]) !== s.downMin) return "Raw event union does not reconcile to downtime";
	if (fixture.domain === "speed") {
		const cycles = cycleIndex(fixture).get(s.id) || [];
		if (cycles.length !== s.total || new Set(cycles.map((c) => c.id)).size !== cycles.length || cycles.some((c) => c.knownAt > s.knownAt || c.endMinute <= c.startMinute || c.pressureRecoveryMin < 0 || Math.abs(c.endMinute - c.startMinute - c.productiveMin - c.pressureRecoveryMin) > 1e-8) || Math.abs(cycles.reduce((n, c) => n + c.pressureRecoveryMin, 0) - (s.runMin - s.total * s.idealCycleMin)) > 1e-8) return "Complete cycle timing evidence does not reconcile to speed loss";
	}
	if (fixture.domain === "quality") {
		const unitIds = s.unitIds || [], index = unitIndex(fixture), units = unitIds.map((id) => index.get(id)).filter((u) => !!u);
		if (invalidUnitFixtures.has(fixture) || units.some((u) => u.shiftId !== s.id) || new Set(unitIds).size !== s.total || units.length !== s.total || units.filter((u) => u.firstPassAccepted).length !== s.firstPassGood || units.filter((u) => u.terminalDisposition !== "scrap").length !== s.good) return "Unique terminal dispositions do not reconcile";
	}
	return null;
}
//#endregion
export { applicable, caseFixtures, checkShift, fixtureCase, northworksParentView, shiftMetrics };
