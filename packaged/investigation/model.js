import production_jobs_fixture_default from "../inputs/production-jobs-fixture.js";
import scenario_fixture_default from "../inputs/scenario-fixture.js";
import northworks_investigation_v1_default from "../inputs/northworks-investigation-v1.js";
import maintenance_fixture_default from "../inputs/maintenance-fixture.js";
//#region app/src/investigation/model.ts
const FIXTURE = "northworks-investigation-v1";
const conditions = [
	"complete",
	"missing_target",
	"missing_good",
	"missing_events",
	"missing_quality",
	"missing_document",
	"stale",
	"overlapping_events",
	"unknown_speed",
	"zero_exposure",
	"zero_loss",
	"wrong_revision",
	"empty_scope",
	"late_correction",
	"no_improvement",
	"worse_outcome",
	"insufficient_sustain"
];
const startingRecords = [
	"draft",
	"rejected",
	"failed",
	"performed",
	"missing_proof",
	"conflicting_proof",
	"review_ready"
];
const clocks = [
	"2026-10-06T14:45:00Z",
	"2026-10-06T15:15:00Z",
	"2026-10-06T15:30:00Z",
	"2026-10-20T15:15:00Z",
	"2026-10-27T14:00:00Z",
	"2026-11-03T14:00:00Z"
];
const INITIAL = clocks[0];
const maintenanceData = maintenance_fixture_default;
function createInvestigation(condition = "complete", startingRecord = "draft") {
	if (!conditions.includes(condition) || !startingRecords.includes(startingRecord)) throw Error("Unsupported declared synthetic fixture");
	const c = {
		schemaVersion: 1,
		fixtureVersion: FIXTURE,
		condition,
		startingRecord,
		scope: {
			version: 1,
			plant: "Northworks",
			line: "Line 03",
			asset: "FEED-03",
			job: "JOB-8303",
			part: "NW-A",
			revision: condition === "wrong_revision" ? "P1" : "P2",
			operation: "OP-030",
			from: "2026-10-06T06:00:00Z",
			to: "2026-10-06T14:00:00Z"
		},
		asOf: INITIAL,
		goal: structuredClone(northworks_investigation_v1_default.goal),
		hypotheses: [],
		action: {
			id: "NW-ACT-003",
			owner: "Maya Chen",
			ownerAccepted: false,
			dueAt: "2026-10-06T16:00:00Z",
			status: "draft",
			reason: "",
			record: "",
			confirmation: "",
			performedAt: "",
			expectedMinutes: 30,
			expectedShifts: 10,
			effectiveness: .8,
			costUsd: 900,
			authorizationId: ""
		},
		safetyReviewed: false,
		operationalAccepted: false,
		sustain: [],
		history: [],
		captures: [],
		synthetic: true,
		notDispatched: true,
		notGranted: true,
		financiallyValidated: false
	};
	if (startingRecord !== "draft") {
		c.action.ownerAccepted = true;
		c.hypotheses = [{
			id: "H-1",
			text: "Guide wear or setup may contribute; inspect against applicable standard.",
			evidenceIds: ["NOTE-2401:s2"],
			status: "proposed",
			causalStatus: "unverified"
		}];
		c.action.status = startingRecord === "rejected" ? "rejected" : startingRecord === "failed" ? "failed" : startingRecord === "missing_proof" ? "authorized" : "performed";
		c.action.authorizationId = "DEMO-AUTH-003";
		c.action.reason = "Preseeded synthetic record; bounded like-for-like restoration only; EC-003 unreleased.";
		if ([
			"performed",
			"conflicting_proof",
			"review_ready"
		].includes(startingRecord)) {
			c.action.record = startingRecord === "conflicting_proof" ? "WRONG-ASSET-WO" : "DEMO-WO-003";
			c.action.confirmation = "Fixture operator confirmation · fictional performer";
			c.action.performedAt = "2026-10-06T15:10:00Z";
			c.asOf = startingRecord === "review_ready" ? clocks[3] : clocks[1];
		}
		c.history = [{
			key: "fixture-seed",
			fingerprint: JSON.stringify({
				condition,
				startingRecord
			}),
			kind: "fixture-seed",
			asOf: c.asOf,
			statement: "Explicit preseeded synthetic " + startingRecord + " record. No action dispatched or permission granted."
		}];
	}
	return c;
}
/** Half-open production-window union. Exact duplicate IDs deduplicate; contradictory reuse is invalid. */
function reconcileIntervals(intervals, window = [0, 480]) {
	const ids = /* @__PURE__ */ new Map(), spans = [];
	if (!window.every(Number.isFinite) || window[1] <= window[0]) throw Error("Invalid production window");
	for (const x of intervals) {
		if (!x.id || ![x.start, x.end].every(Number.isFinite) || x.end < x.start) throw Error("Invalid interval");
		const old = ids.get(x.id);
		if (old) {
			if (JSON.stringify(old) !== JSON.stringify(x)) throw Error("Conflicting event identity");
			continue;
		}
		ids.set(x.id, x);
		const start = Math.max(window[0], x.start), end = Math.min(window[1], x.end);
		if (end > start) spans.push({
			...x,
			start,
			end
		});
	}
	spans.sort((a, b) => a.start - b.start || a.end - b.end);
	let total = 0, start = 0, end = 0, active = false;
	for (const x of spans) if (!active) {
		start = x.start;
		end = x.end;
		active = true;
	} else if (x.start <= end) end = Math.max(end, x.end);
	else {
		total += end - start;
		start = x.start;
		end = x.end;
	}
	return total + (active ? end - start : 0);
}
function sourceEvents(c) {
	const base = Date.parse(c.scope.from), toMin = (s) => (Date.parse(s) - base) / 6e4;
	const e = scenario_fixture_default.line_03_stop_events.map((x) => ({
		id: x.id,
		start: toMin(x.start),
		end: toMin(x.end),
		reason: x.reason,
		sourceId: x.source,
		job: x.production_job_id,
		knownAt: "2026-10-06T14:00:00Z",
		observedStart: x.start,
		observedEnd: x.end
	}));
	if (c.condition === "overlapping_events") {
		e.push({ ...e[0] });
		e.push({
			...e[0],
			id: "DEMO-NESTED-STOP",
			start: e[0].start + 2,
			end: e[0].end - 2,
			observedStart: "2026-10-06T06:20:00Z",
			observedEnd: "2026-10-06T06:28:00Z"
		});
		e.push({
			...e[0],
			id: "DEMO-CLIPPED-STOP",
			start: -5,
			end: 0,
			observedStart: "2026-10-06T05:55:00Z",
			observedEnd: c.scope.from
		});
	}
	if (c.condition === "late_correction" && c.asOf >= "2026-10-06T15:20:00Z") e.push({
		id: "DEMO-LATE-STOP-1",
		start: 0,
		end: 6,
		reason: "other_stops",
		sourceId: "northworks-investigation-v1:late-event-v2",
		job: "JOB-8303",
		knownAt: "2026-10-06T15:20:00Z",
		observedStart: c.scope.from,
		observedEnd: "2026-10-06T06:06:00Z"
	});
	return c.condition === "zero_loss" || c.condition === "missing_events" ? [] : e;
}
function analyzeInvestigation(c) {
	const events = sourceEvents(c), reasons = [];
	let status = "observed";
	const rows = production_jobs_fixture_default.jobs.map((j) => ({ ...j }));
	if (c.condition === "zero_loss") for (const r of rows) {
		r.down_min = 0;
		r.run_min = r.planned_min;
		r.total_units = r.planned_min / .5;
		r.good_units = r.total_units;
	}
	if (c.condition === "late_correction" && c.asOf >= "2026-10-06T15:20:00Z") {
		rows[2].down_min += 6;
		rows[2].run_min -= 6;
	}
	const contributors = rows.map((j) => ({
		job: j.job_id,
		asset: j.asset_id,
		line: j.line_id.replace("line-", "Line "),
		part: j.product_id,
		revision: j.product_revision,
		operation: j.operation_id,
		plannedMin: j.planned_min,
		downMin: j.down_min,
		good: j.good_units,
		target: j.plan_good_units,
		gap: j.plan_good_units - j.good_units,
		downPct: 100 * j.down_min / j.planned_min,
		speedUnits: j.run_min / .5 - j.total_units,
		qualityUnits: j.total_units - j.good_units,
		sourceId: j.exposure_source
	})).sort((a, b) => b.gap - a.gap || a.job.localeCompare(b.job));
	const sum = (key) => rows.reduce((n, r) => n + Number(r[key]), 0), planned = sum("planned_min"), down = sum("down_min"), run = sum("run_min"), total = sum("total_units"), good = sum("good_units");
	const bridge = [
		planned / .5,
		-down / .5,
		-(run / .5 - total),
		-(total - good),
		good
	].map((v) => Object.is(v, -0) ? 0 : v);
	let goal = {
		actual: good,
		target: c.goal.value,
		gap: c.goal.value - good,
		attainment: 100 * good / c.goal.value
	};
	if (c.condition === "missing_target") {
		goal = null;
		status = "missing_input";
		reasons.push("Declared goal value/source missing; illustrative80% threshold is not substituted.");
	}
	if (["missing_good", "missing_quality"].includes(c.condition)) {
		goal = null;
		bridge[3] = null;
		bridge[4] = null;
		status = "missing_input";
		reasons.push("Accepted good-count / quality-disposition input missing; no zero fill.");
	}
	if (c.condition === "missing_events") {
		bridge[1] = null;
		status = "missing_input";
		reasons.push("Complete event feed missing; downtime is not assumed zero. Other supplied production totals remain readable.");
	}
	if (c.condition === "unknown_speed") {
		bridge[2] = null;
		status = "missing_input";
		reasons.push("Produced-count/ideal-cycle evidence for speed residual missing; no neighboring measure substituted.");
	}
	if (c.condition === "stale") {
		status = "stale";
		reasons.push("Event stream last known10:00UTC; selected cutoff14:00UTC. Frozen values are provisional historical inputs, not eligible for action or accepted result.");
	}
	if (c.condition === "zero_exposure") {
		status = "invalid";
		goal = null;
		bridge.fill(null);
		reasons.push("Zero planned exposure; rate and capacity unavailable, no division by zero.");
	}
	if (c.scope.revision !== "P2") {
		status = "invalid";
		goal = null;
		bridge.fill(null);
		reasons.push("No compatible NW-A P1 cohort or controlled documents. Correct explicitly to P2.");
	}
	if (c.condition === "empty_scope") {
		status = "no_data";
		goal = null;
		bridge.fill(null);
		reasons.push("No eligible production records in this declared empty cohort.");
	}
	if (c.condition === "missing_document") reasons.push("Applicable SW-030 unavailable; numeric observations can be inspected but action request is blocked.");
	const priority = [
		"feeder_jams",
		"changeover",
		"other_stops"
	];
	const stopReasons = {
		feeder_jams: 0,
		changeover: 0,
		other_stops: 0
	};
	for (let t = 0; t < 480; t++) {
		const matching = events.filter((e) => e.start <= t && e.end >= t + 1);
		const reason = priority.find((r) => matching.some((e) => e.reason === r || r === "other_stops" && e.reason === "other"));
		if (reason) stopReasons[reason]++;
	}
	const union = reconcileIntervals(events);
	if (events.length && union !== rows[2].down_min) {
		status = "invalid";
		reasons.push("Event union does not reconcile to selected job downtime; no accepted loss bridge.");
		bridge[1] = null;
	}
	return {
		status,
		reasons,
		goal,
		bridge,
		timeBridge: bridge.map((v) => v === null ? null : v * .5),
		contributors: status === "no_data" || c.scope.revision !== "P2" ? [] : contributors,
		stopReasons,
		events,
		cutoff: c.scope.to,
		sourceIds: [...rows.map((r) => r.exposure_source), ...new Set(events.map((e) => e.id))],
		intervalNotice: "Half-open intervals clipped to06:00–14:00; exact duplicate IDs count once; overlaps/nesting form a union. Reason allocation uses declared priority feeder jams→changeover→other stops. Other lines have supplied aggregate downtime, not interval-union proof."
	};
}
maintenanceData.source_notes;
//#endregion
export { FIXTURE, analyzeInvestigation, clocks, conditions, createInvestigation, reconcileIntervals, sourceEvents, startingRecords };
