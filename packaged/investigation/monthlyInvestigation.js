import { absoluteDifferenceUnit } from "./quantitySemantics.js";
import { operatingReview } from "./operatingReview.js";
import { rows } from "../inputs/conversation-months-v1.js";
import { auditView, validAuditCapture } from "./auditRefresh.js";
//#region app/src/investigation/monthlyInvestigation.ts
function createMonthlyInvestigation(context) {
	const row = rows.find((r) => r.machine === context.machine && r.month === context.period);
	if (!row) throw Error("The exact monthly source row is unavailable.");
	return {
		schemaVersion: 1,
		family: "manufacturing-investigation",
		stage: "discovery",
		sourceKind: "monthly",
		sourceRowId: row.id,
		context: structuredClone(context),
		asOf: row.knownAt,
		goal: null,
		plan: null,
		action: { status: "draft" },
		owner: {
			requested: null,
			accepted: null
		},
		hypotheses: [],
		history: [],
		synthetic: true,
		notDispatched: true,
		notGranted: true
	};
}
function createAuditDiscovery(context, metricId, asOf = "2026-10-06T14:45:00Z", typedUnits = true, refreshedAudit) {
	if (refreshedAudit && (!validAuditCapture(refreshedAudit) || refreshedAudit.asOf !== asOf)) throw Error("Exact valid refreshed audit capture required.");
	const review = refreshedAudit ? auditView(refreshedAudit.records, asOf) : operatingReview(asOf), m = review.bundle.find((m) => m.id === metricId);
	if (!m || m.value === null || !m.targetApproval || m.target === null || m.deviation.value === null) throw Error("Exact effective metric target and complete source value are required.");
	return {
		schemaVersion: 1,
		family: "manufacturing-investigation",
		stage: "discovery",
		sourceKind: "operating-review",
		...refreshedAudit ? { refreshedAudit: structuredClone(refreshedAudit) } : {},
		auditOrigin: {
			metricId,
			source: m.source,
			approvalId: m.targetApproval.approvalId,
			targetVersion: m.targetApproval.version,
			context: m.context
		},
		sourceRowId: m.targetApproval.id,
		context: structuredClone(context),
		asOf: review.asOf,
		goal: {
			actual: m.value,
			target: m.target,
			gap: m.deviation.value,
			unit: m.unit,
			...typedUnits ? {
				gapUnit: absoluteDifferenceUnit(m.unit),
				gapKind: "absolute_difference"
			} : {}
		},
		plan: null,
		action: { status: "draft" },
		owner: {
			requested: null,
			accepted: null
		},
		hypotheses: [],
		history: [],
		synthetic: true,
		notDispatched: true,
		notGranted: true
	};
}
function executeMonthly(previous, command, key) {
	const m = structuredClone(previous), prior = m.history.find((h) => h.key === key);
	if (prior) {
		if (JSON.stringify(prior.command) !== JSON.stringify(command)) throw Error("Idempotency conflict");
		return m;
	}
	if (!key || key.length > 100 || m.history.length >= 200) throw Error("Invalid command identity.");
	if (command.kind === "add-hypothesis") {
		if (typeof command.description !== "string" || !command.description.trim() || command.description.length > 1e3 || Object.keys(command).some((k) => ![
			"kind",
			"description",
			"test"
		].includes(k))) throw Error("Supply a bounded speculative hypothesis.");
		if (command.test !== void 0 && (typeof command.test !== "string" || !command.test.trim() || command.test.length > 1e3)) throw Error("Invalid test description.");
		m.hypotheses.push({
			id: "monthly-H-" + (m.hypotheses.length + 1),
			description: command.description,
			test: typeof command.test === "string" ? command.test : null,
			status: "proposed",
			causalStatus: "unconfirmed"
		});
	} else if (command.kind === "plan-latest-test") {
		const h = m.hypotheses.at(-1);
		if (!h || h.status !== "proposed" || typeof command.test !== "string" || !command.test.trim() || command.test.length > 1e3 || Object.keys(command).some((k) => !["kind", "test"].includes(k))) throw Error("A proposed hypothesis and bounded test are required.");
		h.test = command.test;
		h.status = "test_planned";
	} else if (command.kind === "request-assignment") {
		if (!["maintenance", "maintenance-backup"].includes(String(command.owner)) || Object.keys(command).some((k) => !["kind", "owner"].includes(k))) throw Error("Select a fictional maintenance owner.");
		m.owner.requested = String(command.owner);
	} else throw Error("Matching approved goal, controlled documents, acceptance, work proof and eligible comparison records are missing in this monthly cohort; the requested transition is unavailable.");
	m.history.push({
		key,
		command: structuredClone(command)
	});
	return m;
}
function validateMonthly(value) {
	try {
		const m = value;
		let replay = m.sourceKind === "operating-review" ? createAuditDiscovery(m.context, m.auditOrigin.metricId, m.asOf, !!m.goal?.gapUnit, m.refreshedAudit) : createMonthlyInvestigation(m.context);
		for (const h of m.history) replay = executeMonthly(replay, h.command, h.key);
		return JSON.stringify(m) === JSON.stringify(replay);
	} catch {
		return false;
	}
}
function monthlySummary(m, legacyUnits = false) {
	const display = (n) => legacyUnits ? String(n) : n.toFixed(2);
	if (m.sourceKind === "operating-review") return {
		text: `A persistent Plant Review discovery investigation is open for ${m.auditOrigin.metricId}: ${display(m.goal.actual)} against the fictional approved target ${display(m.goal.target)} ${m.goal.unit}; unfavorable deviation ${display(m.goal.gap)} ${legacyUnits ? m.goal.unit : m.goal.gapUnit || absoluteDifferenceUnit(m.goal.unit)}. Approval ${m.auditOrigin.approvalId}, version ${m.auditOrigin.targetVersion}; exact reporting scope and horizon retained in evidence. ${m.hypotheses.length} speculative hypotheses recorded. Controlled operational documents, accepted owner, attributed work proof and comparison cohorts are unavailable; this does not authorize work or borrow another case’s repair.`,
		evidence: "audit",
		chart: false,
		metric: m.context.metric,
		sourceIds: [m.sourceRowId, m.auditOrigin.source],
		qualification: "Source-bound discovery only; additional same-scope operational evidence required."
	};
	return {
		text: `A persistent discovery investigation is open for ${m.context.machine}, ${m.context.period}, source ${m.sourceRowId}. The mechanical failure mode remains unconfirmed. Approved goal, effective controlled documents, complete event timing, performed-work proof and comparable verification cohorts are unavailable. The nominal cycle anomaly needs checking. ${m.hypotheses.length} speculative hypotheses recorded; owner ${m.owner.requested ? "requested, acceptance unavailable" : "not assigned"}. This cohort cannot borrow Northworks records or authorize repair.`,
		evidence: "events",
		chart: false,
		metric: m.context.metric,
		sourceIds: [m.sourceRowId],
		qualification: "Discovery only; operational readiness blocked by missing same-scope evidence."
	};
}
//#endregion
export { createAuditDiscovery, createMonthlyInvestigation, executeMonthly, monthlySummary, validateMonthly };
