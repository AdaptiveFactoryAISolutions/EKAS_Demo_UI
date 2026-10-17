import { tables } from "../inputs/metric-oracle/training-relational-seed.js";
import { pilotTimestamp } from "./pilotTime.js";
import { tables as tables$1 } from "../inputs/metric-oracle/positive-extension-v2/additive-domain-records.js";
//#region app/src/platform/rawFacts.ts
const kind = (x) => x === null ? "null" : Array.isArray(x) ? "array" : typeof x;
const schema = (tables) => Object.fromEntries(Object.entries(tables).map(([table, records]) => {
	const fields = {};
	for (const record of records) for (const [field, value] of Object.entries(record)) (fields[field] ??= /* @__PURE__ */ new Set()).add(kind(value));
	return [table, fields];
}));
const baseSchema = schema(tables);
const sidecarSchema = schema(tables$1);
var MissingFact = class extends Error {
	locator;
	constructor(locator) {
		super("Required raw fact missing or invalid: " + locator);
		this.locator = locator;
	}
};
var InvalidFact = class extends Error {
	locator;
	constructor(locator) {
		super("Contradictory raw source: " + locator);
		this.locator = locator;
	}
};
function domainCheck(row, table, field, namespace) {
	const fail = (name = field) => {
		throw new InvalidFact(namespace + "/" + table + "/" + String(row.id) + "." + name);
	};
	const value = row[field];
	if ((field === "start" || field === "end" || field === "at" || field === "valid_from" || field === "valid_to_exclusive" || field.endsWith("_at") || field.endsWith("_start") || field.endsWith("_end")) && typeof value === "string" && !pilotTimestamp(value)) fail();
	if (typeof value === "number" && /(?:unique_units|first_pass_good_units|recovered_piece_count|entering_units|final_accepted_units|defect_count|opportunities_per_unit)$/.test(field) && (!Number.isSafeInteger(value) || value < 0)) fail();
	if (table === "counts" && [
		"produced_unique_units",
		"final_accepted_unique_units",
		"terminal_scrap_unique_units",
		"first_pass_good_units",
		"reworked_accepted_unique_units"
	].includes(field)) {
		const produced = row.produced_unique_units, good = row.final_accepted_unique_units, scrap = row.terminal_scrap_unique_units, first = row.first_pass_good_units, rework = row.reworked_accepted_unique_units;
		if (typeof produced === "number" && typeof value === "number" && value > produced) fail();
		if ([
			"produced_unique_units",
			"final_accepted_unique_units",
			"terminal_scrap_unique_units"
		].includes(field) && typeof produced === "number" && typeof good === "number" && typeof scrap === "number" && good + scrap !== produced) fail("final_accepted_unique_units+terminal_scrap_unique_units");
		if (["first_pass_good_units", "reworked_accepted_unique_units"].includes(field) && typeof first === "number" && typeof good === "number" && (first > good || typeof rework === "number" && first + rework !== good)) fail("first_pass_good_units+reworked_accepted_unique_units");
	}
	if (table === "quality_stages" && [
		"entering_units",
		"first_pass_good_units",
		"final_accepted_units"
	].includes(field) && typeof row.entering_units === "number" && typeof value === "number" && value > row.entering_units) fail();
	if (table === "defects" && field === "defective_unique_units" && typeof row.inspected_unique_units === "number" && value > row.inspected_unique_units) fail();
	if ({
		labor_shifts: [
			"paid_person_h",
			"productive_person_h",
			"direct_available_person_h",
			"direct_productive_person_h",
			"overtime_person_h",
			"scheduled_person_h",
			"absent_scheduled_person_h",
			"employee_person_h"
		],
		work_orders: [
			"active_repair_elapsed_min",
			"restoration_elapsed_min",
			"technician_person_min"
		],
		nonrepairable_components: ["operating_exposure_h"],
		demand_commitments: ["quantity"],
		maintenance_labor_entries: ["person_min"],
		immediate_shipments: ["quantity"],
		order_lines: ["ordered_qty"],
		shipments: ["quantity"],
		daily_energy: [
			"kwh",
			"idle_kwh",
			"water_m3",
			"waste_kg"
		],
		demand_intervals: ["average_kw"],
		material_issues: ["quantity", "standard_qty_per_produced_piece"],
		rework_tasks: ["labor_person_h", "material_kg"]
	}[table]?.includes(field) && typeof value === "number" && value < 0) fail();
	if ([
		"demand_commitments",
		"immediate_shipments",
		"order_lines",
		"shipments"
	].includes(table) && ["quantity", "ordered_qty"].includes(field) && typeof value === "number" && !Number.isSafeInteger(value)) fail();
	if (table === "job_cost_postings" && ["quantity", "rate_usd"].includes(field)) {
		if (row.currency !== "USD") fail("currency");
		const expected = {
			direct_labor: "person_h",
			overhead: "person_h",
			material: "kg"
		};
		if (!expected[row.category] || row.unit !== expected[row.category]) fail("unit");
		if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail();
	}
	if (field.includes("usd") && Object.hasOwn(row, "currency") && row.currency !== "USD") fail("currency");
	if (/(?:usd_per_|rate_usd$)/.test(field) && typeof value === "number" && value < 0) fail();
}
/** Validate fields when a reducer actually accesses them; unrelated operands are not admitted or evaluated. */
function checkedTables(tables, namespace) {
	const declared = namespace === "base" ? baseSchema : sidecarSchema;
	return new Proxy(tables, { get(target, table) {
		const rows = target[table];
		if (!rows) return [];
		if (!Array.isArray(rows)) throw new MissingFact(namespace + "/" + table + " register");
		return rows.map((record) => new Proxy(record, { get(row, field) {
			const value = row[field], types = declared[table]?.[field];
			if (types && (!Object.hasOwn(row, field) || !types.has(kind(value)) || typeof value === "number" && !Number.isFinite(value) || Array.isArray(value) && value.some((x) => typeof x === "number" && !Number.isFinite(x)))) throw new MissingFact(namespace + "/" + table + "/" + String(row.id) + "." + field);
			domainCheck(row, table, field, namespace);
			return value;
		} }));
	} });
}
function numericSum(rows, field) {
	return rows.reduce((sum, row) => {
		const value = row[field];
		if (typeof value !== "number" || !Number.isFinite(value)) throw new MissingFact(String(row.namespace || "source") + "/" + String(row.id) + "." + field);
		return sum + value;
	}, 0);
}
//#endregion
export { InvalidFact, MissingFact, checkedTables, numericSum };
