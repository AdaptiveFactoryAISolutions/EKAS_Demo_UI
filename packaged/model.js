import { scenario } from "./fixtures.js";
//#region app/src/model.ts
const lines = scenario.lines.map((l) => ({
	id: l.id.replace("line-", "Line "),
	planned: l.planned_min,
	down: l.down_min,
	run: l.run_min,
	total: l.total_units,
	good: l.good_units,
	plan: l.plan_good_units
}));
const pool = (rows) => rows.reduce((a, b) => ({
	id: "Plant",
	planned: a.planned + b.planned,
	down: a.down + b.down,
	run: a.run + b.run,
	total: a.total + b.total,
	good: a.good + b.good,
	plan: a.plan + b.plan
}), {
	id: "Plant",
	planned: 0,
	down: 0,
	run: 0,
	total: 0,
	good: 0,
	plan: 0
});
const metrics = (p) => ({
	production: p.good / p.plan * 100,
	oee: p.good * .5 / p.planned * 100,
	downtime: p.down,
	qualityLoss: (p.total - p.good) / p.total * 100,
	schedule: 18 / 21 * 100,
	inventory: 14400 / 3e3,
	otif: 42 / 46 * 100,
	energy: 2585 / 2154,
	cost: 6,
	mtbf: 300,
	mttr: 45,
	availability: p.run / p.planned * 100,
	performance: p.total * .5 / p.run * 100,
	quality: p.good / p.total * 100
});
//#endregion
export { lines, metrics, pool };
