//#region app/src/investigation/workloadPlanning.ts
const roles = [
	"manager",
	"supervisor",
	"maintenance",
	"safety"
];
const kinds = [
	"repair-planning",
	"verification-measurement",
	"verification-review",
	"safety-review"
];
const utc = (x) => typeof x === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().replace(".000Z", "Z") === x;
function makeWorkloadPlan(input, asOf, basis) {
	if (![
		"normal",
		"absent-maintenance",
		"reduced-maintenance"
	].includes(input.profile) || !utc(input.deadline) || !Array.isArray(input.duties) || !input.duties.length || input.duties.length > 16 || new Set(input.duties.map((d) => d.id)).size !== input.duties.length) throw Error("Provide a bounded explicit profile, UTC deadline and unique named duties.");
	const duties = input.duties.map((d) => {
		if (!d || Object.keys(d).some((k) => ![
			"id",
			"role",
			"kind",
			"date",
			"hours"
		].includes(k)) || typeof d.id !== "string" || !d.id.trim() || d.id.length > 100 || !roles.includes(d.role) || !kinds.includes(d.kind) || typeof d.date !== "string" || !/^\d{4}-\d\d-\d\d$/.test(d.date) || !utc(d.date + "T15:00:00Z") || !Number.isFinite(d.hours) || d.hours <= 0 || d.hours > 8) throw Error("Use exact bounded duty IDs, fictional roles, supported planning kinds, UTC dates and person-hours.");
		return structuredClone(d);
	});
	const groups = [], reasons = [];
	if ("2026-10-06T13:00:00Z" > asOf) reasons.push("The declared planning calendar is not yet known at this cutoff.");
	for (const duty of duties) {
		let g = groups.find((g) => g.role === duty.role && g.date === duty.date);
		if (!g) {
			const start = duty.date + "T15:00:00Z", end = duty.date + "T17:00:00Z", nominal = duty.role === "maintenance" ? input.profile === "absent-maintenance" ? 0 : input.profile === "reduced-maintenance" ? 1 : 2 : 1, remaining = Math.max(0, (Date.parse(end) - Math.max(Date.parse(start), Date.parse(asOf))) / 36e5);
			g = {
				role: duty.role,
				date: duty.date,
				hours: 0,
				capacityHours: Math.min(nominal, remaining),
				unit: "planned person-hours",
				start,
				end
			};
			groups.push(g);
		}
		g.hours += duty.hours;
		if (g.end > input.deadline) reasons.push("A planned duty window ends after the proposed deadline.");
		if (g.end <= asOf) reasons.push("A planned duty window is already historical.");
	}
	for (const g of groups) if (g.hours > g.capacityHours) reasons.push("Planned " + g.role + " duties exceed the declared capacity on " + g.date + ".");
	return {
		profile: input.profile,
		deadline: input.deadline,
		duties,
		calendarVersion: "synthetic-role-planning-v1",
		knownAt: "2026-10-06T13:00:00Z",
		verificationBasis: structuredClone(basis),
		assessment: {
			constraintReasons: [...new Set(reasons)],
			groups
		},
		qualification: "Explicit synthetic planning assumptions: person-hours per declared UTC15:00–17:00 role window; not actual roster, attendance, work, measurement, financial benefit or dispatch. Case endpoint and required eligible shifts remain separate."
	};
}
function validWorkloadPlan(x) {
	return !!x && x.calendarVersion === "synthetic-role-planning-v1" && x.knownAt === "2026-10-06T13:00:00Z" && utc(x.deadline) && Array.isArray(x.duties) && x.duties.length > 0 && x.duties.length <= 16 && x.duties.every((d) => d && roles.includes(d.role) && kinds.includes(d.kind) && Number.isFinite(d.hours) && (!d.acceptance || d.acceptance.actor === d.role && utc(d.acceptance.knownAt))) && x.verificationBasis && typeof x.verificationBasis.endpoint === "string" && typeof x.verificationBasis.unit === "string" && Number.isInteger(x.verificationBasis.requiredShifts) && Array.isArray(x.assessment?.constraintReasons) && Array.isArray(x.assessment?.groups);
}
//#endregion
export { makeWorkloadPlan, validWorkloadPlan };
