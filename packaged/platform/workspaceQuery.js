import { evaluateMetric } from "./metricEngine.js";
import { providerFixture, selectedProvider, validProvider } from "./fixtureSelection.js";
import { acceptanceFacts } from "./uiAcceptanceProvider.js";
import { tables as tables$1 } from "../inputs/metric-oracle/training-relational-seed.js";
//#region app/src/platform/workspaceQuery.ts
const specs = [
	[
		"goodUnits",
		"Good units",
		"units",
		"sum",
		[
			"good units",
			"good output",
			"production"
		]
	],
	[
		"downtime",
		"Downtime",
		"min",
		"sum",
		["downtime", "stops"]
	],
	[
		"oee",
		"OEE",
		"%",
		"ratio",
		["oee", "effectiveness"]
	],
	[
		"laborHours",
		"Labor hours",
		"person-hours",
		"sum",
		["labor hours", "paid hours"]
	],
	[
		"scrapRate",
		"Scrap rate",
		"%",
		"ratio",
		["scrap rate", "scrap"]
	],
	[
		"fpy",
		"First-pass yield",
		"%",
		"ratio",
		[
			"fpy",
			"first pass",
			"first-pass"
		]
	],
	[
		"scheduleAttainment",
		"Production vs plan",
		"%",
		"ratio",
		["attainment", "production vs plan"]
	],
	[
		"energyIntensity",
		"Energy intensity",
		"kWh/good unit",
		"ratio",
		["energy intensity", "energy per unit"]
	]
];
const COLUMNS = [
	...specs.map(([id, name, unit, agg, synonyms]) => ({
		id,
		name,
		unit,
		agg,
		synonyms,
		kind: "measure",
		measure: id,
		popular: true,
		description: {
			goodUnits: "Sum of final good units. Rework is included only after acceptance.",
			downtime: "Sum of mutually exclusive observed stop minutes.",
			oee: "Sum(ideal cycle × good units) / sum(planned production minutes). Mixed revisions retain their exact ideal-cycle definition.",
			laborHours: "Sum of paid person-hours; no unique-person census claim.",
			scrapRate: "Scrap units / total units.",
			fpy: "First-pass good units / total units. Reworked units are not first-pass good.",
			scheduleAttainment: "Good units / released plan quantity.",
			energyIntensity: "Metered kWh / good units, including idle consumption."
		}[id]
	})),
	...[
		"site",
		"line",
		"asset",
		"part",
		"revision",
		"operation",
		"job"
	].map((id) => ({
		id,
		name: id[0].toUpperCase() + id.slice(1),
		kind: "attribute",
		dim: id,
		agg: "group",
		description: "Exact relational " + id + " identity.",
		synonyms: [id],
		popular: true
	})),
	{
		id: "date",
		name: "Date",
		kind: "date",
		dim: "month",
		agg: "bucket",
		description: "UTC chronological observation month.",
		synonyms: [
			"date",
			"month",
			"trend"
		],
		popular: true
	},
	{
		id: "date_raw",
		name: "Observation day",
		kind: "date",
		dim: "week",
		agg: "bucket",
		description: "UTC dated shift observation.",
		synonyms: [
			"day",
			"shift",
			"week"
		]
	}
];
const emptyQuery = () => ({
	...selectedProvider ? { provider: structuredClone(selectedProvider) } : {},
	title: "Untitled answer",
	description: "Independent " + providerFixture(selectedProvider) + "; synthetic. Mixed-cycle OEE uses proposed time-weighted quality. No financial certification.",
	columns: [],
	filters: [],
	chart: "column",
	bucket: "month",
	compare: false,
	decimals: 1,
	labels: true,
	asOf: "2026-09-29T00:00:00Z"
});
const tables = tables$1;
/** Exact projection of the independent finite seed, with no duplication of meter totals into jobs. */
const FACTS = tables.jobs.map((job) => {
	const c = tables.counts.find((c) => c.job_id === job.id), labor = tables.labor_shifts.find((l) => l.job_id === job.id), plan = tables.schedules.find((p) => p.job_id === job.id), standard = tables.standards.find((s) => s.operation_id === job.operation_id && s.valid_from <= job.start && (!s.valid_to_exclusive || job.end <= s.valid_to_exclusive)), line = tables.lines.find((l) => l.id === job.line_id), revision = tables.revisions.find((r) => r.id === job.revision_id);
	return {
		id: job.id,
		site: line.site_id,
		line: job.line_id,
		asset: job.asset_id,
		job: job.id,
		part: revision.product_id,
		revision: revision.id,
		operation: job.operation_id,
		month: job.end.slice(0, 7),
		week: "W" + Math.ceil(Number(job.end.slice(8, 10)) / 7),
		day: job.end.slice(0, 10),
		at: job.end,
		recordedAt: [
			job.known_at,
			c.known_at,
			labor.known_at,
			plan.known_at,
			standard.known_at
		].sort().at(-1),
		goodUnits: c.final_accepted_unique_units,
		downtime: job.down_min,
		total: c.produced_unique_units,
		firstPass: c.first_pass_good_units,
		scrap: c.terminal_scrap_unique_units,
		idealGoodMinutes: c.final_accepted_unique_units * standard.ideal_cycle_min,
		plannedMinutes: job.planned_min,
		laborHours: labor.paid_person_h,
		plan: plan.scheduled_qty,
		kWh: NaN,
		evidence: [
			job.id,
			c.id,
			labor.id,
			plan.id,
			standard.id
		]
	};
});
const computedColumns = /* @__PURE__ */ new Map();
const columnById = (id) => COLUMNS.find((c) => c.id === id) || computedColumns.get(id);
function valuesFor(id, provider = selectedProvider) {
	if (provider) {
		const facts = factsForQuery({ provider });
		return [...new Set(facts.map((f) => dimension(f, id, "month")))].filter(Boolean).sort();
	}
	const identities = {
		site: tables.sites.map((r) => r.id),
		line: tables.lines.map((r) => r.id),
		asset: tables.assets.map((r) => r.id),
		part: tables.products.map((r) => r.id),
		revision: tables.revisions.map((r) => r.id),
		operation: tables.operations.map((r) => r.id),
		job: tables.jobs.map((r) => r.id)
	};
	if (identities[id]) return identities[id];
	return [...new Set(FACTS.map((f) => dimension(f, id, "month")))].filter(Boolean).sort();
}
const activeMeasures = (q) => q.columns.filter((id) => columnById(id)?.kind === "measure" || id.startsWith("fx:"));
const activeGroup = (q) => q.columns.filter((id) => columnById(id)?.kind !== "measure" && !id.startsWith("fx:") && !!columnById(id));
function mondayWeek(day) {
	const d = /* @__PURE__ */ new Date(day + "T00:00:00Z");
	d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
	return d.toISOString().slice(0, 10);
}
function priorBucket(value, bucket, raw = false) {
	if (raw || bucket === "week") return (/* @__PURE__ */ new Date(Date.parse(value + "T00:00:00Z") - (raw ? 1 : 7) * 864e5)).toISOString().slice(0, 10);
	if (bucket === "year") return String(Number(value) - 1);
	if (bucket === "quarter") {
		const year = Number(value.slice(0, 4)), q = Number(value.at(-1));
		return (q === 1 ? year - 1 : year) + "-Q" + (q === 1 ? 4 : q - 1);
	}
	return new Date(Date.UTC(Number(value.slice(0, 4)), Number(value.slice(5)) - 2, 1)).toISOString().slice(0, 7);
}
const resultMeta = /* @__PURE__ */ new WeakMap();
function limitGroups(rows, limit = 80) {
	return {
		rows: rows.slice(0, limit),
		total: rows.length,
		returned: Math.min(rows.length, limit),
		truncated: rows.length > limit
	};
}
function dimension(f, id, bucket) {
	if (id === "date") return bucket === "year" ? f.month.slice(0, 4) : bucket === "quarter" ? f.month.slice(0, 4) + "-Q" + Math.ceil(Number(f.month.slice(5)) / 3) : bucket === "week" ? mondayWeek(f.day) : f.month;
	if (id === "date_raw") return f.day;
	return String(f[id] ?? "");
}
const ratio = (n, d) => d > 0 ? n / d : NaN;
function calculate(facts, id, formula, namespace = "training-plant-v1") {
	const sum = (key) => facts.reduce((a, f) => a + Number(f[key]), 0);
	if (id === "laborHours") return sum("laborHours");
	if (id === "rows") return facts.length;
	if (id.startsWith("fx:") && formula?.id === id) {
		const left = calculate(facts, formula.left, void 0, namespace), right = typeof formula.right === "number" ? formula.right : calculate(facts, formula.right, void 0, namespace);
		if (formula.op === "-" && typeof formula.right !== "number" && columnById(formula.left)?.unit !== columnById(formula.right)?.unit) return NaN;
		return formula.op === "-" ? left - right : ratio(left, right);
	}
	const metricId = {
		goodUnits: "ekas.good_count",
		downtime: "ekas.total_downtime",
		oee: "ekas.oee",
		scrapRate: "ekas.scrap_rate",
		fpy: "ekas.first_pass_yield",
		scheduleAttainment: "ekas.production_vs_plan",
		energyIntensity: "ekas.energy_per_unit"
	}[id];
	if (!metricId) return NaN;
	const inputs = {
		final_accepted_unique_units: sum("goodUnits"),
		downtime_union_min: sum("downtime"),
		ideal_good_min: sum("idealGoodMinutes"),
		planned_min: sum("plannedMinutes"),
		scrap_units: sum("scrap"),
		produced_units: sum("total"),
		first_pass_good_units: sum("firstPass"),
		entering_units: sum("total"),
		actual_output: sum("goodUnits"),
		plan_output: sum("plan"),
		good_units: sum("goodUnits"),
		energy_kwh: Number.isFinite(sum("kWh")) ? sum("kWh") : null
	};
	const result = evaluateMetric(metricId, inputs, {
		namespace,
		mode: "observed"
	});
	return typeof result.value === "number" ? result.value / ([
		"oee",
		"scrapRate",
		"fpy",
		"scheduleAttainment"
	].includes(id) ? 100 : 1) : NaN;
}
const queryCalls = [];
/** Shared client/service boundary: every answer, tile, watch card, chart and export uses this same query operation.
* Synchronous local extension; future HTTP adapter must preserve these result identities and semantics.
*/
const resultCache = /* @__PURE__ */ new Map();
function factsForQuery(q) {
	if (!q.provider) return FACTS;
	if (!validProvider(q.provider)) throw new Error("Unknown fixture context/version; original data not substituted.");
	return providerFixture(q.provider) === "training-plant-v1" ? FACTS : acceptanceFacts(q.provider);
}
const resultIdentity = /* @__PURE__ */ new WeakMap();
function excludedFact(f, q) {
	return (q.excludedScopes || []).some((scope) => Object.entries(scope.dimensions).every(([col, value]) => dimension(f, col, scope.bucket) === value));
}
function sourceRecords(q, ctx) {
	const asOf = q.asOf || emptyQuery().asOf;
	return factsForQuery(q).filter((f) => Date.parse(f.at) <= Date.parse(asOf) && Date.parse(f.recordedAt) <= Date.parse(asOf) && !excludedFact(f, q) && (!ctx.rls || f.site === ctx.site) && q.filters.every((filter) => {
		const match = filter.values.includes(dimension(f, filter.col, q.bucket));
		return filter.op === "not" ? !match : match;
	}));
}
function validQueryFormula(value, id) {
	if (!value || typeof value !== "object") return false;
	const f = value;
	return f.id === id && typeof f.name === "string" && !!f.name.trim() && specs.some((c) => c[0] === f.left) && ["-", "/"].includes(f.op) && (typeof f.right === "number" ? Number.isFinite(f.right) : specs.some((c) => c[0] === f.right));
}
function queryFormula(q, formula) {
	if (q.columns.filter((id) => id.startsWith("fx:")).length > 1) return void 0;
	const candidate = q.formulaSnapshot !== void 0 ? q.formulaSnapshot : formula;
	return validQueryFormula(candidate, q.formulaId) ? candidate : void 0;
}
function validQueryOrder(q) {
	const order = q.orderBy;
	if (order === void 0) return true;
	if (!order || typeof order !== "object" || Array.isArray(order)) return false;
	const v = order;
	return Object.keys(v).length === 2 && Object.hasOwn(v, "metricId") && Object.hasOwn(v, "direction") && typeof v.direction === "string" && typeof v.metricId === "string" && q.columns.includes(v.metricId) && COLUMNS.some((c) => c.id === v.metricId && c.kind === "measure") && ["asc", "desc"].includes(String(v.direction));
}
function runQuery(q, ctx, formula) {
	if (!validQueryOrder(q)) throw Error("Invalid numeric result order: select one governed metric and asc/desc direction.");
	formula = queryFormula(q, formula);
	if (q.formulaSnapshot === null && q.formulaId) computedColumns.delete(q.formulaId);
	if (formula) {
		const left = columnById(formula.left), right = typeof formula.right === "string" ? columnById(formula.right) : void 0;
		computedColumns.set(formula.id, {
			id: formula.id,
			name: formula.name,
			kind: "measure",
			agg: "formula",
			description: "Proposed local formula " + formula.left + " " + formula.op + " " + formula.right + "; input units and zero denominator governed.",
			synonyms: [],
			unit: formula.op === "-" ? left?.unit : left?.unit === right?.unit ? "ratio" : (left?.unit || "value") + "/" + (right?.unit || "constant")
		});
	}
	const start = performance.now(), fingerprint = JSON.stringify({
		provider: q.provider,
		columns: q.columns,
		filters: q.filters,
		excludedScopes: q.excludedScopes,
		bucket: q.bucket,
		compare: q.compare,
		asOf: q.asOf,
		orderBy: q.orderBy,
		formula,
		ctx
	}), cached = resultCache.get(fingerprint);
	if (cached) {
		queryCalls.push({
			operation: "query",
			contract: "ekas-workspace-extension-v1",
			query: structuredClone(q),
			formula: formula ? structuredClone(formula) : void 0,
			context: { ...ctx },
			resultId: cached.id,
			fixtureVersion: providerFixture(q.provider),
			rows: structuredClone(cached.rows),
			total: cached.total,
			truncated: cached.truncated,
			durationMs: performance.now() - start
		});
		resultMeta.set(cached.rows, {
			total: cached.total,
			returned: cached.rows.length,
			truncated: cached.truncated
		});
		return cached.rows;
	}
	const groups = activeGroup(q), measures = activeMeasures(q), asOf = q.asOf || "2026-09-29T00:00:00Z";
	if (!measures.length) return [];
	const admitted = factsForQuery(q).filter((f) => Date.parse(f.at) <= Date.parse(asOf) && Date.parse(f.recordedAt) <= Date.parse(asOf) && !excludedFact(f, q) && (!ctx.rls || f.site === ctx.site) && q.filters.every((filter) => {
		const match = filter.values.includes(dimension(f, filter.col, q.bucket));
		return filter.op === "not" ? !match : match;
	}));
	const slots = /* @__PURE__ */ new Map();
	for (const f of admitted) {
		const dims = Object.fromEntries(groups.map((g) => [g, dimension(f, g, q.bucket)])), key = groups.map((g) => dims[g]).join(" · ") || "All";
		const slot = slots.get(key) || {
			dims,
			facts: []
		};
		slot.facts.push(f);
		slots.set(key, slot);
	}
	let rows = [...slots].map(([key, slot]) => {
		const values = Object.fromEntries((measures.length ? measures : ["rows"]).map((m) => [m, ctx.maskDowntime && (m === "downtime" || m.startsWith("fx:")) ? NaN : calculate(slot.facts, m, formula, providerFixture(q.provider))]));
		return {
			key,
			dims: slot.dims,
			values,
			aggregation: { oee: {
				numerator: slot.facts.reduce((n, f) => n + f.idealGoodMinutes, 0),
				denominator: slot.facts.reduce((n, f) => n + f.plannedMinutes, 0),
				totalGroups: slots.size
			} },
			evidence: slot.facts.flatMap((f) => f.evidence),
			eligibility: Object.fromEntries(Object.entries(values).map(([m, v]) => [m, Number.isFinite(v) ? "eligible synthetic observation" : "unavailable or masked"]))
		};
	});
	rows.sort((a, b) => {
		const metric = q.orderBy?.metricId || measures[0] || "rows", x = a.values[metric], y = b.values[metric];
		return Number.isFinite(x) && Number.isFinite(y) ? (q.orderBy?.direction === "asc" ? x - y : y - x) || a.key.localeCompare(b.key) : Number.isFinite(x) ? -1 : Number.isFinite(y) ? 1 : a.key.localeCompare(b.key);
	});
	if (q.compare) {
		const dateGroup = groups.find((g) => g === "date" || g === "date_raw");
		if (dateGroup) for (const row of rows) {
			const date = row.dims[dateGroup];
			const prior = priorBucket(date, q.bucket, dateGroup === "date_raw");
			const match = rows.find((r) => groups.every((g) => r.dims[g] === (g === dateGroup ? prior : row.dims[g])));
			if (match) {
				row.prior = { ...match.values };
				const countDays = (key) => new Set(slots.get(key)?.facts.map((f) => f.day) || []).size, currentObservedDays = countDays(row.key), priorObservedDays = countDays(match.key);
				row.comparisonExposure = {
					currentObservedDays,
					priorObservedDays,
					qualification: (currentObservedDays !== priorObservedDays ? "Unequal observed-day exposure; " : "Observed-day counts match; ") + "observed totals are not normalized and do not establish requested-period or scheduled-day completeness."
				};
			}
		}
	}
	const bounded = limitGroups(rows);
	rows = bounded.rows;
	resultMeta.set(rows, {
		total: bounded.total,
		returned: bounded.returned,
		truncated: bounded.truncated
	});
	const resultId = "workspace-result-" + (queryCalls.length + 1);
	resultCache.set(fingerprint, {
		rows,
		id: resultId,
		total: bounded.total,
		truncated: bounded.truncated
	});
	resultIdentity.set(rows, resultId);
	queryCalls.push({
		operation: "query",
		contract: "ekas-workspace-extension-v1",
		query: structuredClone(q),
		formula: formula ? structuredClone(formula) : void 0,
		context: { ...ctx },
		resultId,
		fixtureVersion: providerFixture(q.provider),
		rows: structuredClone(rows),
		total: bounded.total,
		truncated: bounded.truncated,
		durationMs: performance.now() - start
	});
	return rows;
}
function formatValue(id, n, decimals, maskDowntime) {
	if (maskDowntime && (id === "downtime" || id.startsWith("fx:"))) return "masked";
	if (!Number.isFinite(n)) return "Unavailable";
	return columnById(id)?.unit === "%" ? (n * 100).toFixed(decimals) + "%" : n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}
/** Exact entity spans are resolved before natural-language intent. Namespace-shaped unknown
* identifiers are also opaque: their embedded words cannot become replacement metrics. */
function phraseEntities(source, provider) {
	const fields = [
		"site",
		"line",
		"asset",
		"part",
		"revision",
		"operation",
		"job"
	];
	const values = /* @__PURE__ */ new Map(), spans = [], namespaces = /* @__PURE__ */ new Set();
	const candidates = fields.flatMap((field) => valuesFor(field, provider).map((value) => ({
		field,
		value
	}))).sort((a, b) => b.value.length - a.value.length);
	const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	for (const { field, value } of candidates) {
		if (value.includes("-")) namespaces.add(value.split("-")[0].toLowerCase());
		const regex = new RegExp("(?<![a-z0-9_-])" + escaped(value.toLowerCase()) + "(?![a-z0-9_-])", "g");
		for (const match of source.matchAll(regex)) {
			const start = match.index, end = start + match[0].length;
			if (spans.some((s) => start < s.end && end > s.start)) continue;
			spans.push({
				start,
				end
			});
			values.set(field, [...values.get(field) || [], value]);
		}
	}
	for (const match of source.matchAll(/[a-z0-9]+(?:-[a-z0-9]+)+/g)) if (namespaces.has(match[0].split("-")[0])) spans.push({
		start: match.index,
		end: match.index + match[0].length
	});
	const chars = source.split("");
	for (const span of spans) for (let i = span.start; i < span.end; i++) chars[i] = " ";
	for (const field of fields) if (values.has(field)) values.set(field, valuesFor(field, provider).filter((value) => values.get(field).includes(value)));
	return {
		intent: chars.join(""),
		values
	};
}
/** Explicit target clauses must resolve entirely to exact source identities. */
function requestedScopeIssue(text, previous) {
	const source = text.toLowerCase().replace(/[’]/g, "'");
	const clause = source.match(/\b(?:for|on)\s+(.+)/)?.[1] || source.match(/\b(?:asset|machine)\s+(.+)/)?.[1];
	if (!clause) return null;
	const target = clause.split(/\b(?:by|compare|compared|with|as a|as an)\b/)[0];
	const resolved = phraseEntities(target, previous?.provider);
	let remainder = target;
	for (const values of resolved.values.values()) for (const value of values) remainder = remainder.replaceAll(value.toLowerCase(), " ");
	remainder = remainder.replace(/\b(?:and|or|the|site|line|asset|part|revision|operation|job|machine)\b/g, " ").replace(/[\s,'"?.!]/g, "");
	return resolved.values.size && !remainder ? null : "Requested scope is unresolved or ambiguous. Choose exact source identities for every requested target; no broad numeric answer was calculated.";
}
function compileBasePhrase(text, previous) {
	const source = text.toLowerCase(), entities = phraseEntities(source, previous?.provider), t = entities.intent, q = emptyQuery();
	q.title = text.trim() || "Untitled answer";
	q.columns = COLUMNS.filter((c) => c.kind === "measure" && c.synonyms.some((s) => new RegExp("\\b" + s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(t))).map((c) => c.id);
	if (!q.columns.length && previous && /^(now\b|same\b|by\b|for\b|compare\b|why\b|what changed\b|trend\b)/.test(t.trim())) q.columns = activeMeasures(previous);
	if (previous?.formulaId && q.columns.includes(previous.formulaId)) {
		q.formulaId = previous.formulaId;
		if (previous.formulaSnapshot !== void 0) q.formulaSnapshot = structuredClone(previous.formulaSnapshot);
	}
	for (const c of COLUMNS.filter((c) => c.kind !== "measure")) if (t.includes("by " + c.id) || c.id === "asset" && /\bby\s+(?:the\s+)?(?:machines?|assets?)\b/.test(t) || t.includes(c.name.toLowerCase()) && c.id === "date") q.columns.push(c.id);
	if (previous) {
		q.provider = previous.provider ? structuredClone(previous.provider) : void 0;
		q.filters = structuredClone(previous.filters);
		if (previous.excludedScopes) q.excludedScopes = structuredClone(previous.excludedScopes);
		q.asOf = previous.asOf;
		if (previous.orderBy && activeMeasures(q).includes(previous.orderBy.metricId)) q.orderBy = structuredClone(previous.orderBy);
		if (!activeGroup(q).length) q.columns.push(...activeGroup(previous));
	}
	for (const id of [
		"site",
		"line",
		"asset",
		"part",
		"revision",
		"operation",
		"job"
	]) {
		const values = entities.values.get(id) || [];
		if (values.length) q.filters = [...q.filters.filter((f) => f.col !== id), {
			col: id,
			op: "in",
			values
		}];
	}
	const identifiers = source.match(/tp-(?:s\d+|l\d+|a\d+|p\d+(?:-r\d+)?(?:-op\d+)?|j\d+)/g) || [];
	for (const identifier of identifiers) {
		const id = identifier.toUpperCase(), field = /^TP-S/.test(id) ? "site" : /^TP-L/.test(id) ? "line" : /^TP-A/.test(id) ? "asset" : /^TP-J/.test(id) ? "job" : id.includes("-OP") ? "operation" : id.includes("-R") ? "revision" : "part";
		if (!valuesFor(field, previous?.provider).includes(id)) q.filters = [...q.filters.filter((f) => f.col !== field), {
			col: field,
			op: "in",
			values: [id]
		}];
	}
	if (t.includes("trend") && !q.columns.includes("date_raw")) q.columns.push("date_raw");
	q.compare = /compare|change|why|drop|prior/.test(t);
	q.chart = t.includes("trend") ? "line" : "column";
	return q;
}
function compileRankingRequest(text, previous) {
	const prior = previous || emptyQuery(), raw = text.trim().toLowerCase().replace(/[’]/g, "'").replace(/[?.!]$/, ""), intent = phraseEntities(raw, prior.provider).intent;
	const directional = raw.match(/^(?:now\s+)?put the (worst|best) first$/) || raw.match(/^(worst|best) first$/);
	if (directional) {
		const refuse = (note) => ({
			kind: "clarification",
			query: structuredClone(prior),
			note
		});
		const direction = directional[1] === "worst" ? "asc" : "desc";
		if (!(activeGroup(prior).includes("asset") && activeMeasures(prior).length === 1)) return refuse("Keep the current one-measure asset ranking before asking for worst-first or best-first order. No new aggregate was calculated.");
		const metricId = activeMeasures(prior)[0], q = structuredClone(prior);
		q.title = text.trim();
		q.orderBy = {
			metricId,
			direction
		};
		return {
			kind: "query",
			query: q,
			note: "Machines grouped by exact Asset IDs; ordered " + (columnById(metricId)?.name || metricId) + " " + (direction === "asc" ? "ascending" : "descending") + " within the selected source scope and cutoff. Equal values remain ties in exact asset-ID order. Unavailable results are shown last and unranked; assets without matching observed exposure are not ranked. This descriptive order establishes no root cause or intervention priority."
		};
	}
	if (!/\b(?:rank|sort|order)\b/.test(intent)) return null;
	const refuse = (note) => ({
		kind: "clarification",
		query: structuredClone(prior),
		note
	});
	const machine = /\b(?:rank|sort|order)\s+(?:(?:the|these|all)\s+)?(?:machines?|assets?)\b/.test(intent), simple = /^(?:sort|order)(?:\s+(?:it|them|this|these))?\s+(?:ascending|descending|decending|asc|desc)$/.test(intent.trim());
	if (!machine && !(simple && activeGroup(prior).includes("asset"))) return refuse("Specify machines/assets and one supported metric for a descriptive ranking, or sort the current asset result. No unrelated aggregate was calculated.");
	const ascending = /\b(?:ascending|asc|lowest)\b|\blow\s+to\s+high\b/.test(intent), descending = /\b(?:descending|decending|desc|highest)\b|\bhigh\s+to\s+low\b/.test(intent);
	if (ascending && descending) return refuse("Choose one numeric order: ascending or descending. No ranking was calculated.");
	if (/\b(?:as of|cutoff|january|february|march|april|may|june|july|august|september|october|november|december|today|yesterday|last month|this month)\b/.test(intent) || /\b\d{4}-\d{2}-\d{2}\b/.test(intent)) return refuse("Use one exact available YYYY-MM observation month, or keep the selected scope and cutoff. No ambiguous period or cutoff was substituted.");
	const periods = [...new Set([...intent.matchAll(/\b(\d{4}-\d{2})(?!-\d)/g)].map((m) => m[1]))];
	if (periods.length > 1 || periods.some((period) => !valuesFor("date", prior.provider).includes(period))) return refuse("Choose one exact available YYYY-MM observation month. No other period or aggregate was substituted.");
	let scopeText = raw.replace(/\b(?:rank|sort|order)\s+(?:(?:the|these|all)\s+)?(?:machines?|assets?)\b/, " ").replace(/\s+(?:ascending|descending|decending|asc|desc)(?=\s|$)/g, " ");
	for (const period of periods) scopeText = scopeText.replace(new RegExp("\\b(?:for|in|during)\\s+" + period + "\\b", "g"), " ");
	const issue = requestedScopeIssue(scopeText, prior);
	if (issue) return refuse(issue);
	const q = simple ? {
		...structuredClone(prior),
		title: text.trim()
	} : compileBasePhrase(text, previous), metrics = activeMeasures(q);
	if (metrics.length !== 1 || !COLUMNS.some((c) => c.id === metrics[0] && c.kind === "measure")) return refuse("Choose one supported governed measure to rank machines. No replacement metric or unrelated aggregate was calculated.");
	if (machine) q.columns = [metrics[0], "asset"];
	if (periods.length) {
		q.bucket = "month";
		q.filters = [...q.filters.filter((f) => f.col !== "date" && f.col !== "date_raw"), {
			col: "date",
			op: "in",
			values: periods
		}];
	}
	q.orderBy = {
		metricId: metrics[0],
		direction: ascending ? "asc" : "desc"
	};
	return {
		kind: "query",
		query: q,
		note: "Machines grouped by exact Asset IDs; ordered " + (columnById(metrics[0])?.name || metrics[0]) + " " + (ascending ? "ascending" : "descending") + " within the selected source scope and cutoff. Equal values remain ties in exact asset-ID order. Unavailable results are shown last and unranked; assets without matching observed exposure are not ranked. This descriptive order establishes no root cause or intervention priority."
	};
}
function compilePhrase(text, previous) {
	const ranking = compileRankingRequest(text, previous);
	if (ranking) return ranking.kind === "query" ? ranking.query : {
		...ranking.query,
		title: text.trim(),
		columns: [],
		orderBy: void 0,
		description: ranking.note
	};
	return compileBasePhrase(text, previous);
}
Object.fromEntries(COLUMNS.map((c) => [c.id, c.description]));
//#endregion
export { COLUMNS, FACTS, activeGroup, activeMeasures, columnById, compilePhrase, compileRankingRequest, emptyQuery, factsForQuery, formatValue, limitGroups, mondayWeek, priorBucket, queryCalls, queryFormula, requestedScopeIssue, resultIdentity, resultMeta, runQuery, sourceRecords, validQueryFormula, validQueryOrder, valuesFor };
