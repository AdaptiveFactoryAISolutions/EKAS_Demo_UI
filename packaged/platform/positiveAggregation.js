import { intervalUnion } from "./metricEngine.js";
import { pilotInstantMicros } from "./pilotTime.js";
import { InvalidFact, checkedTables, numericSum } from "./rawFacts.js";
//#region app/src/platform/positiveAggregation.ts
const sum = numericSum;
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v) => Math.sqrt(v.reduce((n, x) => n + (x - mean(v)) ** 2, 0) / (v.length - 1));
const ms = (s) => {
	const instant = pilotInstantMicros(s);
	if (instant === null) throw new InvalidFact("unresolved raw timestamp " + String(s));
	return Number(instant) / 1e3;
};
const minutes = (a, b) => Number(pilotInstantMicros(b) - pilotInstantMicros(a)) / 6e7;
const intervalUnionMinutes = (rows) => {
	const origin = rows.length ? pilotInstantMicros(rows[0].start) : 0n;
	return intervalUnion(rows.map((r) => [Number(pilotInstantMicros(r.start) - origin) / 6e7, Number(pilotInstantMicros(r.end) - origin) / 6e7]), [-Infinity, Infinity]);
};
const duration = (rows) => intervalUnionMinutes(rows.map((r) => ({
	start: r.start,
	end: r.end
})));
const ids = (rows) => rows.map((r) => r.id);
const sameJob = (r, j) => r.job_ref?.id === j.id;
/** Reducers read domain records only; no expected values or supplied operand snapshots enter this function. */
function aggregatePositive(contextId, base, domain, requiredOperands) {
	const B = checkedTables(base, "base"), T = checkedTables(domain, "positive"), needs = (keys) => !requiredOperands || keys.some((key) => requiredOperands.includes(key));
	const input = {}, policy = {
		namespace: "training-positive-v2",
		mode: "observed",
		coverage: 1
	};
	let qualification = null;
	const assign = (values) => {
		for (const [key, get] of Object.entries(values)) if (!requiredOperands || requiredOperands.includes(key)) input[key] = get();
	};
	const jobs = B.jobs, counts = (j) => {
		const rows = B.counts.filter((c) => c.job_id === j.id);
		if (rows.length !== 1) throw new InvalidFact("base/counts/" + j.id + " exact count grain");
		return rows[0];
	}, standard = (j) => B.standards.find((s) => s.operation_id === j.operation_id && ms(s.valid_from) <= ms(j.start) && (!s.valid_to_exclusive || ms(j.end) <= ms(s.valid_to_exclusive)));
	const core = new Proxy({
		j: () => jobs.find((j) => j.id === "TP-J01"),
		c: () => counts(core.j),
		s: () => standard(core.j),
		stops: () => B.downtime_intervals.filter((r) => r.job_id === core.j.id),
		runs: () => B.run_intervals.filter((r) => r.job_id === core.j.id),
		elapsed: () => minutes(core.j.start, core.j.end),
		run: () => intervalUnionMinutes(core.runs.map((r) => ({
			start: r.start,
			end: r.end
		}))),
		down: () => intervalUnionMinutes(core.stops.map((r) => ({
			start: r.start,
			end: r.end
		}))),
		good: () => core.c.final_accepted_unique_units,
		qty: () => core.c.produced_unique_units,
		cycle: () => core.s.ideal_cycle_min
	}, { get: (target, key) => target[key]() });
	if (contextId === "production_job01") {
		if (needs([
			"planned_min",
			"run_min",
			"operating_min",
			"downtime_min",
			"ideal_total_min",
			"ideal_good_min",
			"total_units",
			"good_units",
			"produced_units",
			"entering_units",
			"first_pass_good_units",
			"scrap_units",
			"reworked_unique_units",
			"final_non_good_units",
			"final_accepted_unique_units",
			"actual_output",
			"elapsed_h",
			"operating_h",
			"ideal_cycle_min",
			"actual_cycle_min",
			"standard_cycle_min",
			"actual_rate",
			"target_rate",
			"expected_units_per_min",
			"expected_units"
		])) assign({
			planned_min: () => core.elapsed,
			run_min: () => core.run,
			operating_min: () => core.run,
			downtime_min: () => core.down,
			ideal_total_min: () => core.qty * core.cycle,
			ideal_good_min: () => core.good * core.cycle,
			total_units: () => core.qty,
			good_units: () => core.good,
			produced_units: () => core.qty,
			entering_units: () => core.qty,
			first_pass_good_units: () => core.c.first_pass_good_units,
			scrap_units: () => core.c.terminal_scrap_unique_units,
			reworked_unique_units: () => core.c.reworked_accepted_unique_units,
			final_non_good_units: () => core.qty - core.good,
			final_accepted_unique_units: () => core.good,
			actual_output: () => core.good,
			elapsed_h: () => core.elapsed / 60,
			operating_h: () => core.run / 60,
			ideal_cycle_min: () => core.cycle,
			actual_cycle_min: () => core.run / core.qty,
			standard_cycle_min: () => core.cycle,
			actual_rate: () => core.qty / (core.run / 60),
			target_rate: () => 60 / core.cycle,
			expected_units_per_min: () => 1 / core.cycle,
			expected_units: () => core.elapsed / core.cycle
		});
		if (needs([
			"calendar_min",
			"available_asset_min",
			"rated_capacity",
			"available_capacity",
			"constraint_run_min",
			"constraint_available_min",
			"constraint_productive_min",
			"constraint_good_units",
			"constraint_input_units",
			"available_production_min",
			"demand_units",
			"takt_min"
		])) {
			const cal = T.asset_calendar.find((r) => sameJob(r, core.j)), dem = T.demand_commitments.find((r) => sameJob(r, core.j)), cap = T.capacity_standards.find((r) => sameJob(r, core.j));
			assign({
				calendar_min: () => minutes(cal.start, cal.end),
				available_asset_min: () => minutes(cal.available_start, cal.available_end),
				rated_capacity: () => core.elapsed / cap.rated_cycle_min,
				available_capacity: () => core.elapsed / cap.rated_cycle_min,
				constraint_run_min: () => core.run,
				constraint_available_min: () => core.elapsed,
				constraint_productive_min: () => core.qty * core.cycle,
				constraint_good_units: () => core.good,
				constraint_input_units: () => core.qty,
				available_production_min: () => core.elapsed,
				demand_units: () => dem.quantity,
				takt_min: () => core.elapsed / dem.quantity
			});
		}
		if (needs([
			"plan_output",
			"scheduled_qty",
			"completed_qty",
			"as_scheduled_qty",
			"actual_completion_epoch_min",
			"planned_completion_epoch_min",
			"orders_on_scheduled_date",
			"scheduled_orders"
		])) {
			const schedule = B.schedules.find((r) => r.job_id === core.j.id);
			assign({
				plan_output: () => schedule.scheduled_qty,
				scheduled_qty: () => schedule.scheduled_qty,
				completed_qty: () => schedule.completed_qty,
				as_scheduled_qty: () => schedule.as_scheduled_qty,
				actual_completion_epoch_min: () => ms(schedule.actual_completion) / 6e4,
				planned_completion_epoch_min: () => ms(schedule.scheduled_end) / 6e4,
				orders_on_scheduled_date: () => Number(schedule.actual_completion.slice(0, 10) === schedule.scheduled_end.slice(0, 10)),
				scheduled_orders: () => 1
			});
		}
		if (needs([
			"downtime_union_min",
			"unplanned_union_min",
			"planned_union_min",
			"downtime_events",
			"reason_union_min",
			"reason_min",
			"total_loss_min",
			"largest_category_min",
			"minor_stop_union_min",
			"category_loss",
			"total_loss",
			"ranked_cumulative_loss",
			"maintenance_union_min",
			"loss_cost_per_min"
		])) {
			const reason = {};
			core.stops.forEach((r) => reason[r.reason] = (reason[r.reason] || 0) + minutes(r.start, r.end));
			const loss = T.loss_reason_policy[0], duration = (rows) => intervalUnionMinutes(rows.map((r) => ({
				start: r.start,
				end: r.end
			})));
			assign({
				downtime_union_min: () => core.down,
				unplanned_union_min: () => duration(core.stops.filter((r) => !r.planned)),
				planned_union_min: () => duration(core.stops.filter((r) => r.planned)),
				downtime_events: () => core.stops.length,
				reason_union_min: () => reason.jam,
				reason_min: () => reason.jam,
				total_loss_min: () => core.down,
				largest_category_min: () => Math.max(...Object.values(reason)),
				minor_stop_union_min: () => duration(core.stops.filter((r) => minutes(r.start, r.end) <= loss.minor_stop_max_min)),
				category_loss: () => reason.jam,
				total_loss: () => core.down,
				ranked_cumulative_loss: () => Object.values(reason).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a + b, 0),
				maintenance_union_min: () => duration(core.stops.filter((r) => loss.maintenance_reasons.includes(r.reason))),
				loss_cost_per_min: () => B.cost_rates[0].loss_usd_per_min
			});
		}
		if (needs([
			"release_epoch_min",
			"completion_epoch_min",
			"queue_min",
			"setup_min",
			"process_min",
			"move_min",
			"wait_min",
			"touch_union_min",
			"value_added_min",
			"lead_min"
		])) {
			const flow = T.lot_journey_intervals.filter((r) => sameJob(r, core.j)).sort((a, b) => ms(a.start) - ms(b.start)), ph = {};
			flow.forEach((r) => ph[r.phase] = (ph[r.phase] || 0) + minutes(r.start, r.end));
			assign({
				release_epoch_min: () => ms(flow[0].start) / 6e4,
				completion_epoch_min: () => ms(flow.at(-1).end) / 6e4,
				queue_min: () => ph.queue,
				setup_min: () => ph.setup,
				process_min: () => ph.process,
				move_min: () => ph.move,
				wait_min: () => ph.wait,
				touch_union_min: () => duration(flow.filter((r) => r.touch)),
				value_added_min: () => duration(flow.filter((r) => r.value_added)),
				lead_min: () => duration(flow)
			});
		}
		if (needs([
			"first_good_new_epoch_min",
			"last_good_old_epoch_min",
			"changeover_total_min",
			"changeovers",
			"changeover_actual_min",
			"changeover_standard_min",
			"setup_actual_min",
			"setup_target_min",
			"internal_setup_union_min",
			"external_setup_union_min"
		])) {
			const changes = T.changeovers.filter((r) => sameJob(r, core.j)), ch = changes[0], tasks = T.setup_tasks.filter((r) => ids(changes).includes(r.changeover_id)), chmins = changes.reduce((n, r) => n + minutes(r.last_good_old_at, r.first_good_new_at), 0);
			assign({
				first_good_new_epoch_min: () => ms(ch.first_good_new_at) / 6e4,
				last_good_old_epoch_min: () => ms(ch.last_good_old_at) / 6e4,
				changeover_total_min: () => chmins,
				changeovers: () => changes.length,
				changeover_actual_min: () => minutes(ch.last_good_old_at, ch.first_good_new_at),
				changeover_standard_min: () => ch.standard_elapsed_min,
				setup_actual_min: () => chmins,
				setup_target_min: () => sum(changes, "target_elapsed_min"),
				internal_setup_union_min: () => duration(tasks.filter((r) => r.mode === "internal")),
				external_setup_union_min: () => duration(tasks.filter((r) => r.mode === "external"))
			});
		}
		if (needs([
			"inspected_units",
			"defective_unique_units",
			"defects",
			"opportunity_count",
			"rejected_units",
			"stage_first_pass_yields"
		])) {
			const defect = B.defects.find((r) => r.lot_id === core.j.lot_id), reject = T.inspection_dispositions.filter((r) => sameJob(r, core.j)), stages = B.quality_stages.filter((r) => r.lot_id === core.j.lot_id).sort((a, b) => a.route_order - b.route_order);
			assign({
				inspected_units: () => defect.inspected_unique_units,
				defective_unique_units: () => defect.defective_unique_units,
				defects: () => defect.defect_count,
				opportunity_count: () => defect.inspected_unique_units * defect.opportunities_per_unit,
				rejected_units: () => {
					const tokens = reject.map((r) => r.unit_token);
					if (new Set(tokens).size !== tokens.length) throw new InvalidFact("positive/inspection_dispositions/" + core.j.id + ".duplicate unit_token");
					return tokens.length;
				},
				stage_first_pass_yields: () => {
					if (!stages.every((r, i) => !i || r.entering_units === stages[i - 1].first_pass_good_units)) throw new InvalidFact("base/quality_stages/" + core.j.lot_id + ".route exposure");
					return stages.map((r) => r.entering_units > 0 ? r.first_pass_good_units / r.entering_units : NaN);
				}
			});
		}
		if (needs([
			"labor_h",
			"paid_labor_h",
			"productive_labor_h",
			"direct_available_h",
			"direct_productive_h",
			"overtime_h",
			"scheduled_labor_h",
			"absent_scheduled_h",
			"employee_h",
			"earned_standard_h",
			"standard_labor_h_per_unit"
		])) {
			const lab = B.labor_shifts.find((r) => r.job_id === core.j.id);
			assign({
				labor_h: () => lab.paid_person_h,
				paid_labor_h: () => lab.paid_person_h,
				productive_labor_h: () => lab.productive_person_h,
				direct_available_h: () => lab.direct_available_person_h,
				direct_productive_h: () => lab.direct_productive_person_h,
				overtime_h: () => lab.overtime_person_h,
				scheduled_labor_h: () => lab.scheduled_person_h,
				absent_scheduled_h: () => lab.absent_scheduled_person_h,
				employee_h: () => lab.employee_person_h,
				earned_standard_h: () => core.good * core.s.standard_labor_h_per_unit,
				standard_labor_h_per_unit: () => core.s.standard_labor_h_per_unit
			});
		}
		if (needs([
			"direct_labor_cost",
			"overhead_cost",
			"manufacturing_cost",
			"scrap_unit_cost",
			"scrap_cost_amount",
			"rework_labor_cost",
			"rework_material_cost",
			"rework_overhead_cost",
			"actual_cost",
			"standard_cost",
			"actual_material_qty",
			"standard_material_qty",
			"standard_material_price",
			"actual_labor_h",
			"standard_labor_h",
			"standard_labor_rate"
		])) {
			const posts = T.job_cost_postings.filter((r) => sameJob(r, core.j)), std = T.job_cost_standards.find((r) => sameJob(r, core.j)) || T.job_cost_standards[0], mat = T.material_issues.find((r) => sameJob(r, core.j)), rw = T.rework_tasks.find((r) => sameJob(r, core.j)), amounts = {};
			posts.forEach((r) => amounts[r.category] = (amounts[r.category] || 0) + r.quantity * r.rate_usd);
			const manufacturing = Object.values(amounts).reduce((a, b) => a + b, 0), stdlabor = core.good * std.labor_h_per_good_piece, standardCost = core.qty * std.material_kg_per_piece * std.material_usd_per_kg + stdlabor * (std.labor_usd_per_h + std.overhead_usd_per_labor_h);
			assign({
				direct_labor_cost: () => amounts.direct_labor,
				overhead_cost: () => amounts.overhead,
				manufacturing_cost: () => manufacturing,
				scrap_unit_cost: () => std.scrap_material_usd_per_piece,
				scrap_cost_amount: () => core.c.terminal_scrap_unique_units * std.scrap_material_usd_per_piece,
				rework_labor_cost: () => rw.labor_person_h * rw.labor_usd_per_h,
				rework_material_cost: () => rw.material_kg * rw.material_usd_per_kg,
				rework_overhead_cost: () => rw.labor_person_h * rw.overhead_usd_per_h,
				actual_cost: () => manufacturing,
				standard_cost: () => standardCost,
				actual_material_qty: () => mat.quantity,
				standard_material_qty: () => core.qty * mat.standard_qty_per_produced_piece,
				standard_material_price: () => mat.standard_usd_per_kg,
				actual_labor_h: () => B.labor_shifts.find((r) => r.job_id === core.j.id).paid_person_h,
				standard_labor_h: () => stdlabor,
				standard_labor_rate: () => std.labor_usd_per_h
			});
		}
	}
	if (contextId === "production_comparison") {
		const seriesJobs = jobs.filter((r) => r.asset_id === "TP-A1").sort((a, b) => ms(a.start) - ms(b.start)), series = seriesJobs.map((r) => 100 * counts(r).final_accepted_unique_units * standard(r).ideal_cycle_min / r.planned_min), target = T.target_policies.find((r) => r.metric === "ekas.oee").target;
		assign({
			actual_pct: () => series.at(-1),
			target_pct: () => target,
			current_pct: () => series.at(-1),
			baseline_pct: () => series[0],
			actual_value: () => series.at(-1),
			target_value: () => target,
			current_value: () => series.at(-1),
			previous_value: () => series.at(-2),
			value_n_periods_ago: () => series.at(-3),
			last_n_values: () => series.slice(-3),
			time_offsets: () => seriesJobs.map((r) => minutes(seriesJobs[0].start, r.start) / 1440),
			ordered_values: () => series,
			values: () => series
		});
	}
	if (contextId === "lower_benefit_gap") assign({
		actual_value: () => 100 * core.down / core.elapsed,
		target_value: () => T.target_policies.find((r) => r.metric === "ekas.downtime").target
	});
	if (contextId === "maintenance") {
		const cohort = jobs.filter((r) => [
			"TP-A1",
			"TP-A3",
			"TP-A5"
		].includes(r.asset_id)), operating = () => sum(cohort, "run_min") / 60, wos = B.work_orders, ml = T.maintenance_labor_entries, plans = T.maintenance_assignments, pm = B.pm_tasks.filter((r) => ms(r.due_at) <= ms("2026-09-29T00:00:00Z"));
		assign({
			operating_h: () => operating(),
			failures: () => B.failures.length,
			active_repair_elapsed_h: () => sum(wos, "active_repair_elapsed_min") / 60,
			restoration_elapsed_h: () => sum(wos, "restoration_elapsed_min") / 60,
			repairs: () => wos.length,
			incidents: () => wos.length,
			failure_lambda_per_h: () => B.failures.length / operating(),
			horizon_h: () => T.reliability_model_policy[0].horizon_h,
			breakdowns: () => T.failure_classifications.filter((r) => r.breakdown).length,
			elapsed_days: () => 6,
			reactive_labor_h: () => sum(ml.filter((r) => r.work_type === "reactive"), "person_min") / 60,
			planned_labor_h: () => sum(ml.filter((r) => r.work_type === "planned"), "person_min") / 60,
			maintenance_labor_h: () => sum(ml, "person_min") / 60,
			emergency_labor_h: () => sum(ml.filter((r) => r.emergency), "person_min") / 60,
			maintenance_jobs_as_planned: () => plans.filter((r) => r.completed_as_planned).length,
			maintenance_jobs_scheduled: () => plans.length,
			backlog_labor_h: () => sum(T.maintenance_backlog_tasks, "remaining_person_h"),
			available_weekly_labor_h: () => sum(T.maintenance_roster, "available_person_h"),
			repeat_failures: () => T.failure_classifications.filter((r) => r.repeat_of_ref !== null).length,
			pm_due: () => pm.length,
			pm_on_time: () => pm.filter((r) => r.completed_at && ms(r.completed_at) <= ms(r.due_at)).length
		});
	}
	if (contextId === "nonrepairable_lifetime") assign({
		failed_complete_lifetime_h: () => sum(T.nonrepairable_components, "operating_exposure_h"),
		nonrepairable_failures: () => T.nonrepairable_components.length
	});
	if (contextId === "delivery") {
		let otif = 0, full = 0, onTime = 0, perfect = 0, late = 0, past = 0;
		const delays = [];
		for (const order of B.customer_orders) {
			const lines = B.order_lines.filter((r) => r.order_id === order.id), ships = lines.map((line) => B.shipments.filter((r) => r.order_line_id === line.id)), fulfilled = lines.every((l, i) => sum(ships[i], "quantity") >= l.ordered_qty), timely = lines.every((l, i) => sum(ships[i].filter((r) => ms(r.delivered_at) <= ms(l.promised_at)), "quantity") >= l.ordered_qty);
			full += Number(fulfilled);
			onTime += Number(timely);
			otif += Number(fulfilled && timely);
			perfect += Number(fulfilled && timely && ships.flat().every((r) => r.documentation_correct && r.damage_free));
			late += Number(!timely);
			lines.forEach((l, i) => past += Math.max(0, l.ordered_qty - sum(ships[i], "quantity")));
			if (fulfilled) {
				const delay = Math.max(0, (Math.max(...ships.flat().map((r) => ms(r.delivered_at))) - ms(order.promised_at)) / 864e5);
				if (delay > 0) delays.push(delay);
			}
		}
		assign({
			eligible_orders: () => B.customer_orders.length,
			orders_both_on_time_in_full: () => otif,
			complete_orders: () => full,
			delivered_on_time_orders: () => onTime,
			delivered_orders: () => B.customer_orders.length,
			perfect_orders: () => perfect,
			late_orders: () => late,
			ordered_units: () => sum(B.order_lines, "ordered_qty"),
			immediately_shipped_units: () => sum(T.fulfillment_allocations, "quantity"),
			shipped_units: () => sum(B.shipments, "quantity"),
			customer_rejected_units: () => T.shipment_quality.reduce((n, r) => n + r.rejected_unique_unit_tokens.length, 0),
			customer_defective_units: () => T.shipment_quality.reduce((n, r) => n + r.defective_unique_unit_tokens.length, 0),
			past_due_remaining_qty: () => past,
			late_days_sum: () => delays.reduce((a, b) => a + b, 0),
			late_deliveries: () => delays.length
		});
	}
	if (contextId === "immediate_fill") assign({
		immediately_shipped_units: () => sum(T.immediate_shipments.filter((r) => ms(r.shipped_at) === ms(T.immediate_orders.find((o) => o.id === r.order_id).ordered_at)), "quantity"),
		ordered_units: () => sum(T.immediate_orders, "ordered_qty")
	});
	const periodStart = ms("2026-07-01T00:00:00Z"), periodEnd = ms("2026-09-29T00:00:00Z"), periodDays = (periodEnd - periodStart) / 864e5;
	if (contextId === "annual_inventory_turns") {
		const start = ms("2026-01-01T00:00:00Z"), end = ms("2027-01-01T00:00:00Z");
		let area = 0;
		for (const item of B.inventory_items) {
			let balance = 0, cursor = start;
			for (const r of T.annual_inventory_transactions.filter((r) => r.item_ref.id === item.id).sort((a, b) => ms(a.at) - ms(b.at))) {
				const at = ms(r.at);
				area += balance * (at - cursor);
				balance += r.value_delta_usd;
				if (balance < 0) throw new Error("Negative annual inventory balance");
				cursor = at;
			}
			area += balance * (end - cursor);
		}
		assign({
			annual_cogs: () => sum(T.financial_postings.filter((r) => r.category === "cogs"), "amount_usd"),
			average_inventory_value: () => area / (end - start)
		});
	}
	if (contextId === "inventory_finance") {
		const averages = {}, qtyAverage = {}, snap = {};
		for (const item of B.inventory_items) {
			const transactions = [...B.inventory_transactions.filter((r) => r.item_id === item.id), ...T.warehouse_stock_movements.filter((r) => r.item_ref.id === item.id).map((r) => ({
				...r,
				value_delta: r.value_delta_usd
			}))].sort((a, b) => ms(a.at) - ms(b.at));
			let balance = 0, quantity = 0, area = 0, quantityArea = 0, cursor = periodStart;
			for (const r of transactions) {
				const at = ms(r.at);
				area += balance * (at - cursor);
				quantityArea += quantity * (at - cursor);
				balance += r.value_delta;
				quantity += r.quantity_delta;
				if (balance < -1e-9 || quantity < 0) throw new Error("Negative warehouse stock balance");
				cursor = at;
			}
			area += balance * (periodEnd - cursor);
			quantityArea += quantity * (periodEnd - cursor);
			averages[item.id] = area / (periodEnd - periodStart);
			qtyAverage[item.id] = quantityArea / (periodEnd - periodStart);
			snap[item.id] = {
				balance,
				quantity
			};
		}
		const amount = {};
		for (const r of T.financial_postings) {
			const a = ms(r.period_start), b = ms(r.period_end), overlap = Math.max(0, Math.min(periodEnd, b) - Math.max(periodStart, a));
			amount[r.category] = (amount[r.category] || 0) + r.amount_usd * overlap / (b - a);
		}
		const kind = (k) => B.inventory_items.filter((r) => r.kind === k).reduce((n, r) => n + averages[r.id], 0), checks = T.inventory_counts, classes = T.inventory_classifications, coq = Object.fromEntries(B.cost_ledger.map((r) => [r.category, r.amount_usd]));
		assign({
			annual_cogs: () => sum(T.financial_postings.filter((r) => r.category === "cogs"), "amount_usd"),
			period_cogs: () => amount.cogs,
			average_inventory_value: () => Object.values(averages).reduce((a, b) => a + b, 0),
			period_days: () => periodDays,
			average_rm_value: () => kind("raw"),
			period_material_usage_value: () => amount.material_usage,
			average_wip_value: () => kind("wip"),
			period_manufacturing_cost: () => amount.manufacturing,
			average_wip_units: () => B.inventory_items.filter((r) => r.kind === "wip").reduce((n, r) => n + qtyAverage[r.id], 0),
			throughput_units_per_day: () => sum(T.warehouse_dispatches, "quantity") / periodDays,
			average_fg_value: () => kind("finished"),
			snapshot_wip_units: () => B.inventory_items.filter((r) => r.kind === "wip").reduce((n, r) => n + snap[r.id].quantity, 0),
			inventory_correct_records: () => checks.filter((r) => r.book_quantity === r.counted_quantity).length,
			inventory_checked_records: () => checks.length,
			obsolete_value: () => classes.filter((r) => r.obsolete).reduce((n, r) => n + snap[r.item_ref.id].balance, 0),
			excess_value: () => classes.filter((r) => r.excess).reduce((n, r) => n + snap[r.item_ref.id].balance, 0),
			total_inventory_value: () => Object.values(snap).reduce((n, r) => n + r.balance, 0),
			prevention_cost: () => coq.prevention,
			appraisal_cost: () => coq.appraisal,
			internal_failure_cost: () => coq.internal_failure,
			external_failure_cost: () => coq.external_failure,
			copq_amount: () => coq.internal_failure + coq.external_failure,
			sales: () => amount.sales,
			warranty_cost_amount: () => amount.warranty,
			totally_variable_cost: () => amount.totally_variable
		});
	}
	if (contextId === "steady_wip_flow") {
		const area = T.wip_unit_journeys.reduce((n, r) => n + Math.max(0, Math.min(periodEnd, ms(r.completed_at)) - Math.max(periodStart, ms(r.entered_at))), 0), completed = T.wip_unit_journeys.filter((r) => periodStart <= ms(r.completed_at) && ms(r.completed_at) < periodEnd);
		assign({
			average_wip_units: () => area / (periodEnd - periodStart),
			throughput_units_per_day: () => completed.length / periodDays
		});
	}
	const siteJobs = jobs.filter((r) => ["TP-L1", "TP-L2"].includes(r.line_id));
	if (contextId === "resource_aligned_site1") {
		const energy = B.daily_energy.filter((r) => ms(r.end) <= ms("2026-07-07T00:00:00Z")), siteGood = siteJobs.reduce((n, r) => n + counts(r).final_accepted_unique_units, 0);
		assign({
			energy_kwh: () => sum(energy, "kwh"),
			idle_kwh: () => sum(energy, "idle_kwh"),
			water_m3: () => sum(energy, "water_m3"),
			waste_kg: () => sum(energy, "waste_kg"),
			good_units: () => siteGood,
			governed_production_measure: () => siteGood,
			co2e_kg: () => sum(energy, "kwh") * T.resource_scope_policy[0].emissions_factor_kg_per_kwh
		});
	}
	if (contextId === "peak_45min") input.interval_kw = B.demand_intervals.map((r) => r.average_kw);
	if (contextId === "safety_site1") {
		const events = B.safety_events.filter((r) => r.site_id === "TP-S1"), labor = B.labor_shifts.filter((r) => ids(siteJobs).includes(r.job_id)), worked = sum(labor, "employee_person_h");
		assign({
			recordable_cases: () => events.filter((r) => r.recordable).length,
			dart_cases: () => events.filter((r) => r.dart).length,
			lost_time_cases: () => events.filter((r) => r.lost_time).length,
			worked_h: () => worked,
			near_misses: () => T.near_miss_events.length,
			exposure_multiplier: () => T.safety_coverage[0].near_miss_multiplier,
			exposure_denominator: () => worked
		});
	}
	if (contextId === "verified_improvement") {
		const shifts = T.verification_shifts, events = T.verification_stop_events, phase = (name) => shifts.filter((r) => r.phase === name).map((r) => events.filter((e) => e.shift_id === r.id).reduce((n, e) => n + minutes(e.start, e.end), 0)), actions = T.improvement_actions, design = T.verified_case_design[0];
		assign({
			pre_value: () => mean(phase("baseline")),
			post_value: () => mean(phase("verification")),
			last_n_values: () => phase("sustain"),
			threshold: () => design.threshold_min_per_shift,
			direction: () => design.benefit_direction,
			repeated_events: () => events.filter((e) => e.same_mode_recurrence && shifts.find((s) => s.id === e.shift_id).phase === "sustain").length,
			relevant_events: () => phase("sustain").length,
			due_actions: () => actions.length,
			closed_due_actions: () => actions.filter((r) => r.closed_at !== null).length,
			on_time_closed_due_actions: () => actions.filter((r) => r.closed_at && ms(r.closed_at) <= ms(r.due_at)).length
		});
	}
	if (contextId === "qualified_capability") {
		const char = T.qualified_characteristics[0], protocol = T.capability_policy.find((r) => r.id === char.policy_id), gauge = T.gauges.find((r) => r.id === char.gauge_id), calibration = T.calibrations.find((r) => r.id === gauge.calibration_reference), groups = T.qualified_subgroups.filter((r) => r.cohort === "assessment" && r.characteristic_id === char.id), measurements = T.qualified_measurements.filter((r) => ids(groups).includes(r.subgroup_id)), values = measurements.map((r) => r.value), vectors = groups.map((g) => measurements.filter((m) => m.subgroup_id === g.id).map((r) => r.value));
		let ss = 0, dof = 0;
		vectors.forEach((v) => {
			ss += v.reduce((n, x) => n + (x - mean(v)) ** 2, 0);
			dof += v.length - 1;
		});
		assign({
			values: () => values,
			process_mean: () => mean(values),
			usl: () => char.usl,
			lsl: () => char.lsl,
			within_ss: () => ss,
			within_dof: () => dof,
			sigma_within: () => Math.sqrt(ss / dof),
			sigma_overall: () => sd(values)
		});
		const study = T.gauge_study_readings.filter((r) => r.gauge_id === gauge.id), cells = /* @__PURE__ */ new Map();
		study.forEach((r) => {
			const key = r.part_token + "|" + r.operator_token;
			cells.set(key, [...cells.get(key) || [], r.reading_mm]);
		});
		let repeatSS = 0, repeatDof = 0;
		for (const vector of cells.values()) {
			repeatSS += vector.reduce((n, x) => n + (x - mean(vector)) ** 2, 0);
			repeatDof += vector.length - 1;
		}
		const repeatSD = Math.sqrt(repeatSS / repeatDof), repeatPercent = 6 * repeatSD / (char.usl - char.lsl) * 100, bias = mean(study.map((r) => r.reading_mm - r.reference_mm)), operatorBias = [...new Set(study.map((r) => r.operator_token))].map((operator) => mean(study.filter((r) => r.operator_token === operator).map((r) => r.reading_mm - r.reference_mm))), calibrationError = Math.max(...calibration.reference_values_mm.map((v, i) => Math.abs(v - calibration.read_values_mm[i])));
		const baselineGroups = T.qualified_subgroups.filter((r) => r.cohort === "baseline" && r.characteristic_id === char.id), baseline = baselineGroups.map((g) => T.qualified_measurements.filter((m) => m.subgroup_id === g.id).map((m) => m.value)), baselineMean = mean(baseline.flat()), baselineS = mean(baseline.map(sd)), baselineSS = baseline.reduce((n, v) => n + v.reduce((a, x) => a + (x - mean(v)) ** 2, 0), 0), baselineDof = baseline.reduce((n, v) => n + v.length - 1, 0), baselineSigma = Math.sqrt(baselineSS / baselineDof), lcl = baselineMean - 3 * baselineSigma / Math.sqrt(protocol.subgroup_size), ucl = baselineMean + 3 * baselineSigma / Math.sqrt(protocol.subgroup_size), xbarOutside = vectors.filter((v) => mean(v) < lcl || mean(v) > ucl).length, sOutside = vectors.filter((v) => sd(v) < protocol.S_B3 * baselineS || sd(v) > protocol.S_B4 * baselineS).length;
		const matched = measurements.every((r) => r.characteristic_id === char.id && r.gauge_id === gauge.id && r.unit === char.unit && ms(r.at) >= ms(char.spec_effective_from) && ms(r.at) < ms(char.spec_effective_to_exclusive) && ms(r.at) >= ms(gauge.valid_from) && ms(r.at) < ms(gauge.valid_to_exclusive)), adequate = groups.length >= protocol.minimum_subgroups && vectors.every((v) => v.length === protocol.subgroup_size) && new Set(measurements.map((r) => r.piece_token)).size === values.length;
		const msa = repeatDof > 0 && cells.size === 30 && [...cells.values()].every((v) => v.length === 3) && repeatPercent <= protocol.msa_repeatability_max_percent_spec && Math.abs(bias) <= protocol.msa_bias_max_mm && operatorBias.every((b) => Math.abs(b) <= protocol.msa_bias_max_mm) && calibrationError <= calibration.tolerance_mm;
		const stable = baselineGroups.length >= 30 && baseline.every((v) => v.length === protocol.subgroup_size) && protocol.implemented_rules.includes("Xbar3sigma") && protocol.implemented_rules.includes("S_B3_B4") && xbarOutside === 0 && sOutside === 0;
		policy.sampleN = adequate && matched ? values.length : 0;
		policy.msaStatus = msa ? "qualified" : "unqualified";
		policy.stabilityStatus = stable ? "stable" : "unstable";
		policy.subgroupDesign = adequate ? "25×5 consecutive synthetic pieces; pooled within sample sigma; limited frozen Xbar/S protocol" : void 0;
		qualification = {
			protocolId: protocol.id,
			synthetic: true,
			productionCertified: false,
			adequate,
			matched,
			msa,
			stable,
			sampleN: values.length,
			subgroups: groups.length,
			repeatSD,
			repeatPercent,
			bias,
			operatorBias,
			calibrationError,
			baselineSubgroups: baselineGroups.length,
			xbarLimits: [lcl, ucl],
			sLimits: [protocol.S_B3 * baselineS, protocol.S_B4 * baselineS],
			xbarOutside,
			sOutside,
			runRules: protocol.run_rules,
			distribution: protocol.distribution,
			independence: protocol.independence,
			limits: "Limited declared demo protocol; not full AIAG ANOVA, normality/yield prediction or approved plant qualification."
		};
	}
	if (!Object.keys(input).length) throw new Error("No extraction path for exact positive context " + contextId);
	return {
		inputs: input,
		policy,
		qualification
	};
}
//#endregion
export { aggregatePositive };
