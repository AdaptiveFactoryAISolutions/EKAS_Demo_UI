import { tables } from "../inputs/metric-oracle/ui-acceptance-fixtures-v1/raw-records.js";
import { validProvider } from "./fixtureSelection.js";
//#region app/src/platform/uiAcceptanceProvider.ts
const finite = (n) => typeof n === "number" && Number.isFinite(n) ? n : NaN;
/** Raw relational joins. Expected answers are deliberately absent from this provider. */
function acceptanceFacts(p) {
	if (!validProvider(p) || p.contextId === "ownership-all-yours") throw new Error("Acceptance observation context required");
	const t = tables;
	return t.jobs.filter((j) => j.fixture_context === p.contextId).map((job) => {
		const c = t.counts.find((c) => c.job_id === job.id && c.lot_id === job.lot_id && c.operation_id === job.operation_id), labor = t.labor_shifts.find((l) => l.job_id === job.id), plan = t.schedules.find((s) => s.job_id === job.id), line = t.lines.find((l) => l.id === job.line_id), revision = t.revisions.find((r) => r.id === job.revision_id && r.valid_from <= job.start && job.end <= r.valid_to_exclusive), standard = t.standards.find((s) => s.operation_id === job.operation_id && s.valid_from <= job.start && job.end <= s.valid_to_exclusive), coverage = t.equipment_observation_coverage.find((o) => o.job_id === job.id && o.asset_id === job.asset_id && o.window_start === job.start && o.window_end === job.end), stops = t.downtime_intervals.filter((s) => s.job_id === job.id && s.asset_id === job.asset_id), runs = t.run_intervals.filter((s) => s.job_id === job.id && s.asset_id === job.asset_id), unknown = t.unknown_equipment_intervals.filter((s) => s.job_id === job.id), timeline = [...stops, ...runs].sort((a, b) => a.start.localeCompare(b.start)), complete = coverage?.complete_primary_state_partition === true && coverage.unclassified_elapsed_min === 0 && unknown.length === 0 && coverage.classified_elapsed_min === job.planned_min && timeline.length > 0 && timeline[0].start === job.start && timeline.at(-1).end === job.end && timeline.every((s, i) => s.start < s.end && (!i || timeline[i - 1].end === s.start));
		const minutes = stops.reduce((n, s) => n + (Date.parse(s.end) - Date.parse(s.start)) / 6e4, 0), quality = c?.quality_disposition_coverage === 1, good = quality ? finite(c?.final_accepted_unique_units) : NaN, records = [
			job,
			c,
			labor,
			plan,
			line,
			revision,
			standard,
			coverage,
			...stops,
			...runs,
			...unknown
		].filter((r) => !!r);
		return {
			id: job.id,
			site: line?.site_id || "",
			line: job.line_id,
			asset: job.asset_id,
			job: job.id,
			part: revision?.product_id || "",
			revision: job.revision_id,
			operation: job.operation_id,
			month: job.end.slice(0, 7),
			week: "W" + Math.ceil(Number(job.end.slice(8, 10)) / 7),
			day: job.end.slice(0, 10),
			at: job.end,
			recordedAt: records.map((r) => r.known_at).sort().at(-1),
			goodUnits: good,
			downtime: complete && (minutes !== 0 || coverage?.zero_stop_assertion === true) ? minutes : NaN,
			total: finite(c?.produced_unique_units),
			firstPass: quality ? finite(c?.first_pass_good_units) : NaN,
			scrap: quality ? finite(c?.terminal_scrap_unique_units) : NaN,
			idealGoodMinutes: good * finite(standard?.ideal_cycle_min),
			plannedMinutes: finite(job.planned_min),
			laborHours: finite(labor?.paid_person_h),
			plan: finite(plan?.scheduled_qty),
			kWh: NaN,
			evidence: records.map((r) => r.id)
		};
	});
}
//#endregion
export { acceptanceFacts };
