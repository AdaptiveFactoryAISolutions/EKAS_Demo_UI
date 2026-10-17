import { recordNotificationAttention, selectNotificationSnapshot } from "./notifications.js";
import { recordObligationReview, selectObligationSnapshot } from "./obligations.js";
import { analyzeInvestigation, clocks, createInvestigation } from "./model.js";
import { applicable, checkShift, fixtureCase, northworksParentView, shiftMetrics } from "./cases.js";
import { recordGenealogyScopeReview, selectGenealogySnapshot } from "./lotGenealogy.js";
import { integrationHealthStatus, selectIntegrationHealthSnapshot } from "./integrationHealth.js";
import { selectDiagnosticSnapshot } from "./diagnosticSource.js";
import { applyDiagnosticCheck } from "./diagnosticChecks.js";
import { records } from "../inputs/sustain-monitoring-v65.js";
import { assessSustain } from "./sustainPolicy.js";
import { draftPlan, sourcePlan } from "./planGovernance.js";
import { variants } from "../inputs/investigation-negative-variants-v1.js";
import { measurementTrustStatus, selectMeasurementTrustRecord } from "./measurementTrust.js";
//#region app/src/investigation/workflow.ts
const workflowConditions = [
	"complete",
	"missing_goal",
	"missing_target",
	"missing_source",
	"missing_events",
	"missing_exposure",
	"stale",
	"wrong_revision",
	"missing_document",
	"empty_scope",
	"no_improvement",
	"worse_outcome",
	"failed_quality_guardrail",
	"failed_safety",
	"missing_work_proof",
	"conflicting_work_proof",
	"insufficient_post",
	"insufficient_sustain"
];
const emptyAction = () => ({
	status: "draft",
	description: "",
	authorizationId: null,
	authorizedAt: null,
	performedId: null,
	performedAt: null,
	performer: null,
	confirmation: null,
	reason: "",
	expectedBenefit: null
});
function createWorkflow(caseId, condition = "complete", policy = 2) {
	const f = fixtureCase(caseId, condition);
	if (!workflowConditions.includes(condition)) throw Error("Unknown declared scenario");
	return {
		schemaVersion: 2,
		...policy === 2 ? {
			sustainPolicyVersion: 2,
			testPolicyVersion: 2
		} : {},
		origin: {
			resultId: f.fixtureVersion + "-current-result",
			resultVersion: 1,
			goalId: f.goal.id,
			fixtureVersion: f.fixtureVersion,
			asOf: clocks[0],
			context: structuredClone(f.context)
		},
		fixtureVersion: f.fixtureVersion,
		caseId,
		condition,
		context: {
			...f.context,
			revision: condition === "wrong_revision" ? "UNSUPPORTED" : f.context.revision
		},
		asOf: clocks[0],
		cycle: 1,
		openedAt: clocks[0],
		owner: {
			requested: null,
			accepted: null,
			requestedAt: null,
			acceptedAt: null
		},
		hypotheses: [],
		action: emptyAction(),
		plan: structuredClone(f.verification),
		planVersions: [sourcePlan(f)],
		planDraft: null,
		verificationRecorded: false,
		safetyEvidence: null,
		accepted: false,
		resultRejectedReason: null,
		sustainIds: [],
		priorCycles: [],
		captures: [],
		history: [],
		synthetic: true,
		notDispatched: true,
		notGranted: true,
		financiallyValidated: false
	};
}
function eligibleRows(w, f, period) {
	let rows = f.shifts.filter((s) => s.period === period && (period === "baseline" ? w.plan.baselineIds : w.plan.postIds).includes(s.id) && s.knownAt <= w.asOf && (period !== "post" || s.knownAt > (w.planVersions.at(-1)?.fixedAt || "")) && checkShift(s, f) === null);
	if (w.cycle > 1 && period === "post") rows = rows.filter((s) => s.knownAt > w.openedAt);
	if (w.condition === "insufficient_post" && period === "post") rows = rows.slice(0, 2);
	return rows;
}
const endpoint = (f, m, n) => f.verification.endpoint === "jamMin" ? m.jamMean : f.verification.endpoint === "fpy" ? m.fpy.value === null ? null : Number(m.fpy.value) : n ? Number(m.speedLoss.value) / n : null;
function evaluateVerificationGuardrails(plan, post, baseline) {
	const check = (value, limit, unit) => ({
		status: value === null || limit === void 0 || !Number.isFinite(value) ? "unavailable" : value <= limit ? "pass" : "fail",
		value,
		limit: limit ?? null,
		unit,
		source: plan.source
	});
	return {
		quality: plan.qualityMaxPct !== void 0 ? check(post.qualityLossPct, plan.qualityMaxPct, "percent final quality loss") : check(post.qualityLossPct === null || baseline.qualityLossPct === null ? null : post.qualityLossPct - baseline.qualityLossPct, plan.qualityMaxWorseningPp, "percentage points worsening"),
		energy: plan.energyMaxKwhPerGood !== void 0 ? check(post.energyPerGood, plan.energyMaxKwhPerGood, "kWh/good unit") : check(post.energyPerGood === null || baseline.energyPerGood === null || baseline.energyPerGood <= 0 ? null : 100 * (post.energyPerGood - baseline.energyPerGood) / baseline.energyPerGood, plan.energyMaxWorseningPct, "percent worsening")
	};
}
function workflowView(w, includeSemantics = false) {
	const f = fixtureCase(w.caseId, w.condition), reasons = [];
	if (["missing_goal", "missing_target"].includes(w.condition)) reasons.push("The approved goal or target is missing. Supply the effective goal before progressing.");
	if ([
		"missing_source",
		"missing_events",
		"missing_exposure"
	].includes(w.condition)) reasons.push("Required source records or complete exposure are missing. Unavailable is not zero.");
	if (w.condition === "stale") reasons.push("The observation feed is stale at this cutoff. Historical values are provisional and cannot authorize progression.");
	if (w.context.revision !== f.context.revision) reasons.push("No compatible part-revision cohort exists. Correct the revision explicitly.");
	if (w.condition === "empty_scope") reasons.push("No records match the selected cohort.");
	const trust = measurementTrustStatus(w), measurementBlocked = trust.policyApplied && !trust.ready;
	if (measurementBlocked) reasons.push(...trust.reasons);
	const health = integrationHealthStatus(w);
	if (health.policyApplied && !health.ready) reasons.push(...health.reasons);
	const currentError = checkShift(f.current, f);
	if (currentError) reasons.push(currentError);
	const docs = f.documents.map((d) => ({
		...d,
		eligible: applicable(d, w.context, w.asOf) && !(w.condition === "missing_document" && d.kind === "SW")
	})).filter((d) => d.knownAt <= w.asOf);
	if (!docs.some((d) => d.kind === "SW" && d.eligible)) reasons.push("Applicable controlled standard work is missing; superseded, wrong-revision or unreleased instructions cannot replace it.");
	const usable = !reasons.length, metrics = shiftMetrics(w.condition === "empty_scope" ? [] : [f.current]);
	const unavailable = (key, reason) => {
		const metric = metrics[key];
		if (metric && typeof metric === "object" && "availability" in metric) metrics[key] = {
			...metric,
			value: null,
			availability: "missing_input",
			reason
		};
	};
	if (measurementBlocked || health.policyApplied && !health.ready || [
		"missing_source",
		"missing_exposure",
		"stale",
		"empty_scope"
	].includes(w.condition) || w.context.revision !== f.context.revision) for (const key of [
		"oee",
		"availability",
		"performance",
		"quality",
		"fpy",
		"qualityLoss",
		"speedLoss",
		"qualityLossMin"
	]) unavailable(key, reasons.join(" "));
	if (w.condition === "missing_events") unavailable("availability", "Complete event coverage is unavailable.");
	const plant = w.caseId === "downtime" ? analyzeInvestigation({
		...createInvestigation(w.condition === "wrong_revision" ? "wrong_revision" : w.condition === "stale" ? "stale" : w.condition === "missing_target" ? "missing_target" : "complete"),
		asOf: w.asOf,
		scope: {
			...createInvestigation().scope,
			revision: w.context.revision === "P2" ? "P2" : "P1"
		}
	}) : null;
	const parent = w.caseId === "downtime" ? northworksParentView() : null;
	const goal = measurementBlocked || health.policyApplied && !health.ready ? null : [
		"missing_target",
		"missing_goal",
		"missing_source",
		"missing_exposure",
		"stale",
		"empty_scope"
	].includes(w.condition) ? null : w.caseId === "downtime" ? parent?.goal || null : {
		actual: metrics.good,
		target: f.goal.value,
		gap: f.goal.value - metrics.good,
		attainment: 100 * metrics.good / f.goal.value
	};
	let bridge = parent?.bridge || [
		f.current.plannedMin / f.current.idealCycleMin,
		-f.current.downMin / f.current.idealCycleMin,
		-Number(metrics.speedLoss.value) / f.current.idealCycleMin,
		-(f.current.total - f.current.good),
		f.current.good
	];
	if (measurementBlocked || health.policyApplied && !health.ready || [
		"missing_source",
		"missing_exposure",
		"stale",
		"empty_scope"
	].includes(w.condition) || w.context.revision !== f.context.revision) bridge = bridge.map(() => null);
	else if (w.condition === "missing_events") bridge = bridge.map((v, i) => i === 1 ? null : v);
	const before = eligibleRows(w, f, "baseline");
	let after = eligibleRows(w, f, "post");
	const work = f.work, proof = w.action.status === "performed" && w.action.performedId === work.id && w.action.performedAt === work.performedAt && work.knownAt <= w.asOf && work.performedAt >= w.openedAt && work.performedAt >= (w.planVersions.at(-1)?.fixedAt || "") && w.cycle === 1 && !["missing_work_proof", "conflicting_work_proof"].includes(w.condition);
	if (!proof) after = [];
	const b = shiftMetrics(before), p = shiftMetrics(after), required = w.plan.requiredShifts, complete = before.length >= required && after.length >= required;
	if (measurementBlocked) for (const cohort of [b, p]) {
		for (const [name, value] of Object.entries(cohort)) if (value && typeof value === "object" && "availability" in value) cohort[name] = {
			...value,
			value: null,
			availability: "missing_input",
			reason: trust.reasons.join(" ")
		};
		cohort.jamMean = null;
		cohort.energyPerGood = null;
	}
	const bv = !measurementBlocked && before.length >= required ? endpoint(f, b, before.length) : null, pv = !measurementBlocked && after.length >= required ? endpoint(f, p, after.length) : null;
	const improved = bv !== null && pv !== null && (w.plan.direction === "lower" ? pv < bv && pv <= w.plan.target : pv > bv && pv >= w.plan.target);
	const computedGuardrails = evaluateVerificationGuardrails(w.plan, {
		qualityLossPct: p.qualityLoss.value === null ? null : Number(p.qualityLoss.value),
		energyPerGood: p.energyPerGood
	}, {
		qualityLossPct: b.qualityLoss.value === null ? null : Number(b.qualityLoss.value),
		energyPerGood: b.energyPerGood
	});
	const guardrails = measurementBlocked ? {
		quality: {
			...computedGuardrails.quality,
			status: "unavailable",
			value: null
		},
		energy: {
			...computedGuardrails.energy,
			status: "unavailable",
			value: null
		}
	} : computedGuardrails;
	const qualityPass = complete && guardrails.quality.status === "pass" && w.condition !== "failed_quality_guardrail";
	const energyPass = complete && guardrails.energy.status === "pass";
	const safetyPass = !!w.safetyEvidence && w.condition !== "failed_safety";
	const status = !proof ? "awaiting_work" : !usable ? "ineligible" : !complete ? "measuring" : !improved ? "no_improvement" : !qualityPass || !energyPass ? "guardrail_failed" : !safetyPass ? "safety_review_required" : !w.accepted ? "awaiting_acceptance" : "accepted";
	const observations = f.sustain.observations.filter((s) => w.sustainIds.includes(s.id) && s.at <= w.asOf && s.eligible);
	const outside = (v) => w.plan.direction === "lower" ? v > f.sustain.threshold : v < f.sustain.threshold;
	const recurrence = observations.length >= f.sustain.consecutiveRecurrence && observations.slice(-f.sustain.consecutiveRecurrence).every((s) => outside(s.value));
	const sustained = w.accepted && observations.length >= f.sustain.required && observations.slice(0, f.sustain.required).every((s) => !outside(s.value));
	const policyResult = w.sustainPolicyVersion === 2 ? assessSustain(f.sustain.observations.filter((s) => w.sustainIds.includes(s.id)).map((s) => {
		const metadata = records.find((r) => r.id === s.id && r.caseId === w.caseId);
		return {
			...s,
			knownAt: metadata?.knownAt || "",
			coverage: metadata?.coverage ?? 0,
			observerHealth: metadata?.observerHealth || "unknown",
			sourceVersion: metadata?.sourceVersion ?? 0,
			source: "sustain-monitoring-v65.json#/records/" + s.id,
			scope: metadata?.scope || "",
			definitionVersion: metadata?.definitionVersion || ""
		};
	}), {
		target: w.plan.target,
		alarm: f.sustain.threshold,
		direction: w.plan.direction,
		required: f.sustain.required,
		consecutiveRecurrence: f.sustain.consecutiveRecurrence,
		scope: w.caseId,
		definitionVersion: "independent-metric-contract-1.0",
		maxAgeHours: 24
	}, w.asOf, w.accepted && usable) : null;
	return {
		challenge: {
			...variants[w.condition],
			source: "investigation-negative-variants-v1.json#/variants/" + w.condition
		},
		fixtureVersion: w.fixtureVersion,
		caseId: w.caseId,
		context: structuredClone(w.context),
		selected: {
			context: structuredClone(w.context),
			metrics,
			sourceIds: [f.current.source, ...f.current.intervals.map((e) => e.id)]
		},
		parent: parent ? {
			...parent,
			goal,
			bridge,
			eligibility: {
				status: usable ? "ready" : w.condition === "stale" || health.effectiveStatus === "stale" ? "stale" : "blocked",
				reasons
			},
			metricsQualification: usable ? "observed synthetic operands" : "historical operands; " + reasons.join(" ")
		} : null,
		goalContext: parent?.context || w.context,
		bridgeContext: parent?.context || w.context,
		asOf: w.asOf,
		cycle: w.cycle,
		title: f.title,
		eligibility: {
			status: usable ? "ready" : w.condition === "stale" || health.effectiveStatus === "stale" ? "stale" : "blocked",
			reasons
		},
		goal,
		goalSource: f.goal,
		bridge,
		metrics,
		contributors: w.condition === "missing_exposure" || w.condition === "empty_scope" ? [] : plant?.contributors || [{
			job: f.context.job,
			asset: f.context.asset,
			line: f.context.line,
			part: f.context.part,
			revision: f.context.revision,
			operation: f.context.operation,
			gap: goal?.gap ?? null,
			sourceId: f.current.source
		}],
		events: w.condition === "missing_events" ? [] : f.current.intervals,
		reasonMinutes: plant?.stopReasons || { planned_check: f.current.downMin },
		reasonEvidence: f.current.reasonEvidence || null,
		documents: docs,
		sourceIds: parent?.sourceIds || [f.current.source, ...f.current.intervals.map((e) => e.id)],
		availableHypotheses: f.hypotheses,
		availableTests: f.tests.filter((t) => t.knownAt <= w.asOf),
		availableWork: w.condition === "missing_work_proof" ? null : work.knownAt <= w.asOf ? w.condition === "conflicting_work_proof" ? {
			...work,
			revision: "UNSUPPORTED",
			description: "Declared conflicting part-revision proof; cannot support completion.",
			source: "investigation-negative-variants-v1.json#/variants/conflicting_work_proof"
		} : work : null,
		owner: structuredClone(w.owner),
		action: {
			...structuredClone(w.action),
			...includeSemantics ? {
				lifecycleState: w.accepted && status === "accepted" && proof ? "VERIFIED" : w.action.status.toUpperCase(),
				verified: w.accepted && status === "accepted" && proof
			} : {}
		},
		hypotheses: structuredClone(w.hypotheses),
		plan: structuredClone(w.plan),
		planGovernance: {
			active: structuredClone(w.planVersions.at(-1)),
			draft: w.planDraft ? structuredClone(w.planDraft.plan) : null,
			versions: structuredClone(w.planVersions),
			draftDoesNotChangeMeasurements: true
		},
		verification: {
			status,
			proof,
			baselineCount: before.length,
			postCount: after.length,
			before: bv,
			after: pv,
			absoluteChange: bv === null || pv === null ? null : pv - bv,
			relativeChange: bv === null || pv === null || bv === 0 ? null : 100 * (pv - bv) / bv,
			outputGain: complete && !measurementBlocked ? p.good - b.good : null,
			oeeGain: complete && !measurementBlocked ? Number(p.oee.value) - Number(b.oee.value) : null,
			beforeMetrics: b,
			afterMetrics: p,
			beforeSources: before.map((s) => s.source),
			afterSources: after.map((s) => s.source),
			guardrails,
			qualityPass,
			energyPass,
			safetyPass,
			causalStatus: "unconfirmed",
			financiallyValidated: false
		},
		sustain: {
			status: measurementBlocked ? "unavailable" : policyResult?.status || (recurrence ? "recurrence" : sustained ? "sustained" : "insufficient"),
			threshold: f.sustain.threshold,
			required: f.sustain.required,
			observations: measurementBlocked ? [] : observations,
			...policyResult || {},
			...measurementBlocked ? {
				status: "unavailable",
				observations: [],
				qualification: trust.reasons.join(" ")
			} : {}
		},
		resultRejectedReason: w.resultRejectedReason,
		synthetic: true,
		notDispatched: true,
		notGranted: true
	};
}
const workflowCommandFields = {
	"record-notification-attention": [
		"groupId",
		"generation",
		"sourceVersion",
		"operation",
		"untilUtc",
		"reason",
		"acknowledgeAttentionOnly",
		"confirmation"
	],
	"select-notification-snapshot": [
		"snapshotId",
		"sourceVersion",
		"reason",
		"confirmation"
	],
	"record-obligation-review": [
		"obligationId",
		"stage",
		"ownerName",
		"ownerRole",
		"dueAt",
		"reason",
		"acknowledgeExternalPending",
		"confirmation"
	],
	"select-obligation-snapshot": [
		"snapshotId",
		"sourceVersion",
		"programId",
		"reason",
		"confirmation"
	],
	"record-genealogy-scope-review": [
		"ownerName",
		"ownerRole",
		"dueAt",
		"reason",
		"acknowledgeUnknownQuantity",
		"acknowledgeMissingLinks",
		"confirmation"
	],
	"select-genealogy-snapshot": [
		"snapshotId",
		"sourceVersion",
		"rootLotId",
		"reason",
		"confirmation"
	],
	"select-measurement-trust-record": [
		"recordId",
		"sourceVersion",
		"reason",
		"confirmation"
	],
	"select-integration-health-snapshot": [
		"snapshotId",
		"sourceVersion",
		"reason",
		"confirmation"
	],
	"select-diagnostic-snapshot": ["snapshotId", "confirmation"],
	"record-diagnostic-check": [
		"hypothesisRef",
		"checkType",
		"outcome",
		"evidenceIds",
		"knownAt",
		"reason",
		"sourceVersion",
		"confirmation"
	],
	"capture-result": [],
	"correct-revision": ["revision"],
	"advance-time": ["asOf"],
	"add-hypothesis": [
		"hypothesisId",
		"description",
		"test"
	],
	"plan-test": ["hypothesisId"],
	"plan-latest-test": ["test"],
	"adopt-verification-plan": [],
	"create-verification-plan": [
		"target",
		"requiredShifts",
		"endpoint"
	],
	"revise-verification-plan": [
		"target",
		"requiredShifts",
		"reason",
		"endpoint"
	],
	"record-test-evidence": ["testId"],
	"dispose-tested-hypothesis": ["hypothesisId"],
	"set-action-due-date": ["dueAt"],
	"record-test": ["testId"],
	"request-assignment": ["owner"],
	"accept-assignment": [],
	"record-assignment-acceptance": [],
	"recommend-action": [],
	"request-authorization": [],
	"authorize-action": [],
	"reject-action": ["reason"],
	"record-failure": ["reason"],
	"record-performed-work": ["workId"],
	"define-verification-plan": ["plan"],
	"record-verification": [],
	"review-safety": ["evidenceId"],
	"accept-result": [],
	"reject-result": ["reason"],
	"record-sustain": [],
	"reopen": [],
	"request-engineering-change": ["changeId"]
};
function executeWorkflow(previous, command, actor, key) {
	if (![
		"supervisor",
		"maintenance",
		"manager",
		"safety",
		"viewer"
	].includes(actor) || actor === "viewer" && !(command?.kind === "record-notification-attention" && command.operation === "read")) throw Error("This fictional role cannot change the investigation.");
	if (!key || key.length > 100 || previous.history.length >= 200) throw Error("Invalid command identity or history limit");
	const fields = workflowCommandFields;
	if (!command || typeof command.kind !== "string" || !Object.hasOwn(fields, command.kind)) throw Error("Unsupported workflow command.");
	if (Object.keys(command).some((k) => k !== "kind" && !fields[command.kind].includes(k))) throw Error("Unknown fields in typed workflow command; no substituted action was made.");
	const old = previous.history.find((e) => e.key === key);
	if (old) {
		if (JSON.stringify(old.command) !== JSON.stringify(command) || old.actor !== actor) throw Error("Idempotency conflict");
		return structuredClone(previous);
	}
	const w = structuredClone(previous), f = fixtureCase(w.caseId, w.condition), view = workflowView(w), manager = () => {
		if (actor !== "manager") throw Error("A fictional authorized manager is required.");
	}, ready = () => {
		if (view.eligibility.status !== "ready") throw Error(view.eligibility.reasons.join(" "));
	}, reason = () => {
		if (typeof command.reason !== "string" || !command.reason.trim() || command.reason.length > 1e3) throw Error("A bounded reason is required.");
		return command.reason;
	};
	switch (command.kind) {
		case "record-notification-attention":
			recordNotificationAttention(w, command, actor);
			break;
		case "select-notification-snapshot":
			selectNotificationSnapshot(w, command, actor);
			break;
		case "record-obligation-review":
			recordObligationReview(w, command, actor);
			break;
		case "select-obligation-snapshot":
			selectObligationSnapshot(w, command, actor);
			break;
		case "record-genealogy-scope-review":
			recordGenealogyScopeReview(w, command, actor);
			break;
		case "select-genealogy-snapshot":
			selectGenealogySnapshot(w, command, actor);
			break;
		case "select-measurement-trust-record":
			selectMeasurementTrustRecord(w, command, actor);
			break;
		case "select-integration-health-snapshot":
			selectIntegrationHealthSnapshot(w, command, actor);
			break;
		case "select-diagnostic-snapshot":
			ready();
			selectDiagnosticSnapshot(w, command);
			break;
		case "record-diagnostic-check":
			ready();
			applyDiagnosticCheck(w, command, actor, key);
			break;
		case "request-engineering-change": throw Error("The engineering change is unreleased. It cannot become a production instruction or a like-for-like restoration.");
		case "capture-result":
			w.captures.push({
				id: "capture-" + (w.captures.length + 1),
				asOf: w.asOf,
				cycle: w.cycle,
				result: view
			});
			break;
		case "correct-revision":
			if (w.action.status !== "draft" || command.revision !== f.context.revision) throw Error("Correct explicitly to the declared revision before planning work.");
			w.context.revision = f.context.revision;
			break;
		case "advance-time":
			if (!clocks.includes(command.asOf) || String(command.asOf) < w.asOf) throw Error("Choose an explicit supported later simulation snapshot.");
			w.asOf = String(command.asOf);
			break;
		case "add-hypothesis": {
			const h = typeof command.description === "string" && command.description.trim() && command.description.length <= 1e3 && (!command.test || typeof command.test === "string" && command.test.trim() && command.test.length <= 1e3) ? {
				id: w.caseId + "-H-custom-" + (w.hypotheses.length + 1),
				description: String(command.description),
				test: command.test ? String(command.test) : "Test not yet planned.",
				supportingEvidenceIds: [],
				contradictingEvidenceIds: []
			} : f.hypotheses.find((h) => h.id === command.hypothesisId);
			if (!h) throw Error("Select a traceable hypothesis or supply a bounded speculative description and test.");
			if (w.hypotheses.some((x) => x.id === h.id)) throw Error("Hypothesis already recorded.");
			w.hypotheses.push({
				...h,
				status: "proposed",
				testResultId: null,
				createdAt: w.asOf,
				version: 1,
				causalStatus: "unconfirmed"
			});
			break;
		}
		case "plan-latest-test":
		case "plan-test": {
			const h = command.kind === "plan-latest-test" ? w.hypotheses.at(-1) : w.hypotheses.find((h) => h.id === command.hypothesisId);
			if (!h || h.status !== "proposed") throw Error("A proposed hypothesis is required before planning its test.");
			if (command.test !== void 0) {
				if (typeof command.test !== "string" || !command.test.trim() || command.test.length > 1e3) throw Error("A bounded test description is required.");
				h.test = command.test;
			}
			if (h.test === "Test not yet planned.") throw Error("Describe the proposed test before planning it.");
			h.status = "test_planned";
			h.version++;
			break;
		}
		case "record-test-evidence": {
			ready();
			const t = f.tests.find((t) => t.id === command.testId), h = w.hypotheses.find((h) => h.id === t?.hypothesisId);
			if (!t || !h || h.status !== "test_planned" || t.knownAt > w.asOf || w.cycle > 1) throw Error("Exact same-case planned test and known current-cycle result are required.");
			h.status = "tested";
			h.testResultId = t.id;
			h.version++;
			break;
		}
		case "dispose-tested-hypothesis": {
			ready();
			const tested = w.hypotheses.filter((h) => h.status === "tested"), h = command.hypothesisId ? tested.find((h) => h.id === command.hypothesisId) : tested.length === 1 ? tested[0] : void 0, t = f.tests.find((t) => t.id === h?.testResultId);
			if (!h || !t || t.hypothesisId !== h.id || t.knownAt > w.asOf || w.cycle > 1 || ![
				"supported",
				"refuted",
				"inconclusive"
			].includes(t.result)) throw Error("Identify one recorded TESTED hypothesis and its same-case source disposition; ambiguous tests are not selected automatically.");
			h.status = t.result;
			if (t.result === "supported" && !h.supportingEvidenceIds.includes(t.id)) h.supportingEvidenceIds.push(t.id);
			if (t.result === "refuted" && !h.contradictingEvidenceIds.includes(t.id)) h.contradictingEvidenceIds.push(t.id);
			h.version++;
			break;
		}
		case "set-action-due-date":
			if (typeof command.dueAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(command.dueAt) || !Number.isFinite(Date.parse(command.dueAt)) || new Date(command.dueAt).toISOString().replace(".000Z", "Z") !== command.dueAt || Date.parse(command.dueAt) < Date.parse(w.asOf) || w.action.status === "performed") throw Error("Provide an explicit future UTC due date before performed work; this changes planning metadata only.");
			w.action.dueAt = command.dueAt;
			break;
		case "record-test": {
			if (w.healthSelection || w.measurementSelection) ready();
			const t = f.tests.find((t) => t.id === command.testId), h = w.hypotheses.find((h) => h.id === t?.hypothesisId);
			if (!t || !h || h.status !== "test_planned") throw Error("A planned test and source-bound result are required.");
			if (t.knownAt > w.asOf || w.cycle > 1) throw Error("Future or prior-cycle test evidence cannot establish this cycle.");
			h.status = t.result;
			h.testResultId = t.id;
			h.version++;
			break;
		}
		case "request-assignment":
			if (actor !== "supervisor" && actor !== "manager") throw Error("A fictional supervisor must request assignment.");
			if (!["maintenance", "maintenance-backup"].includes(String(command.owner)) || w.action.status === "performed") throw Error("Select the fictional maintenance owner before work is performed.");
			w.owner = {
				requested: String(command.owner),
				accepted: null,
				requestedAt: w.asOf,
				acceptedAt: null
			};
			if (w.action.status === "requested" || w.action.status === "authorized") {
				w.action.status = "recommended";
				w.action.authorizationId = null;
				w.action.authorizedAt = null;
			}
			break;
		case "accept-assignment":
			if (actor !== w.owner.requested || actor !== "maintenance") throw Error("The requested fictional owner must accept the assignment.");
			w.owner.accepted = actor;
			w.owner.acceptedAt = w.asOf;
			break;
		case "record-assignment-acceptance": {
			const proof = f.assignmentAcceptances.find((p) => p.owner === w.owner.requested);
			if (!proof) throw Error("No source-bound acceptance for this requested owner.");
			if (actor !== "manager" || w.owner.requested !== proof.owner || proof.knownAt > w.asOf || proof.acceptedAt < (w.owner.requestedAt || w.asOf) || proof.cycle !== w.cycle) throw Error("Exact known current-cycle maintenance acceptance artifact is required; a user statement is not acceptance evidence.");
			w.owner.accepted = proof.owner;
			w.owner.acceptedAt = proof.acceptedAt;
			break;
		}
		case "recommend-action":
			ready();
			if (!w.hypotheses.length || w.hypotheses.every((h) => h.status === "refuted") || !["maintenance", "maintenance-backup"].includes(w.owner.accepted || "") || ![
				"draft",
				"rejected",
				"failed"
			].includes(w.action.status)) throw Error("A traceable hypothesis and accepted owner are required before recommending bounded work.");
			w.action = {
				...emptyAction(),
				...w.action.dueAt ? { dueAt: w.action.dueAt } : {}
			};
			w.action.status = "recommended";
			w.action.description = f.work.description;
			w.action.expectedBenefit = {
				value: w.caseId === "downtime" ? 2058e3 / 3900 * .8 : Number(f.costAssumptions.recoverableUnitsEstimate) * f.costAssumptions.effectiveness,
				unit: "estimated good units",
				horizon: f.costAssumptions.horizon,
				costUsd: f.costAssumptions.costUsd,
				financiallyValidated: false
			};
			break;
		case "request-authorization":
			ready();
			if (w.action.status !== "recommended" || !["maintenance", "maintenance-backup"].includes(w.owner.accepted || "")) throw Error("A recommended bounded action and accepted owner are required.");
			w.action.status = "requested";
			break;
		case "authorize-action":
			ready();
			manager();
			if (w.action.status !== "requested" || !["maintenance", "maintenance-backup"].includes(w.owner.accepted || "")) throw Error("Requested work with unchanged accepted owner is required.");
			w.action.status = "authorized";
			w.action.authorizedAt = w.asOf;
			w.action.authorizationId = f.fixtureVersion + "-synthetic-authorization-cycle-" + w.cycle;
			break;
		case "reject-action":
			manager();
			if (!["requested", "authorized"].includes(w.action.status)) throw Error("Pending action required.");
			w.action.status = "rejected";
			w.action.reason = reason();
			break;
		case "record-failure":
			if (actor !== "maintenance" || w.action.status !== "authorized") throw Error("Authorized work and the fictional assigned maintenance owner are required.");
			w.action.status = "failed";
			w.action.reason = reason();
			break;
		case "record-performed-work": {
			if (w.measurementSelection) {
				const base = workflowView({
					...w,
					measurementSelection: void 0
				});
				if (base.eligibility.status !== "ready") throw Error(base.eligibility.reasons.join(" "));
			} else ready();
			const proof = f.work;
			if (!["maintenance", "manager"].includes(actor) || !["maintenance", "maintenance-backup"].includes(w.owner.accepted || "") || w.action.status !== "authorized") throw Error("Separately authorized work and accepted maintenance owner are required.");
			if (command.workId !== proof.id || !w.action.authorizedAt || w.action.authorizedAt > proof.performedAt || proof.knownAt > w.asOf || proof.performedAt < w.openedAt || w.cycle > 1 || ["missing_work_proof", "conflicting_work_proof"].includes(w.condition)) throw Error("Exact current-cycle known work proof, performer and operator confirmation are required.");
			w.action = {
				...w.action,
				status: "performed",
				performedId: proof.id,
				performedAt: proof.performedAt,
				performer: proof.performer,
				confirmation: proof.confirmation
			};
			break;
		}
		case "create-verification-plan":
		case "revise-verification-plan": {
			ready();
			if (command.endpoint !== void 0 && command.endpoint !== f.verification.endpoint) throw Error("Named endpoint does not match this case. No substituted plan was created.");
			if (command.kind === "create-verification-plan" && (w.action.status === "performed" || w.verificationRecorded)) throw Error("Use an explicit reasoned plan revision after work or measurement.");
			const explanation = command.kind === "revise-verification-plan" ? reason() : "Explicit chat-created prospective plan; fictional governance only.";
			w.planDraft = draftPlan(f, command.target, command.requiredShifts, w.planVersions.at(-1).plan.version + 1, w.asOf, explanation);
			break;
		}
		case "adopt-verification-plan":
			if (w.planDraft) {
				manager();
				ready();
				const record = structuredClone(w.planDraft);
				record.fixedAt = w.asOf;
				record.status = "fixed";
				record.approval = {
					id: "FICTIONAL-PLAN-" + w.caseId + "-v" + record.plan.version + "-cycle" + w.cycle,
					actor,
					at: w.asOf,
					synthetic: true,
					notGranted: true
				};
				w.plan = record.plan;
				w.planVersions.push(record);
				w.planDraft = null;
				w.verificationRecorded = false;
				w.accepted = false;
				w.safetyEvidence = null;
				w.sustainIds = [];
				w.resultRejectedReason = "Plan version changed; previous evidence and acceptance retained only in history. New compatible work/cohorts required.";
				break;
			}
			if (w.action.status === "performed" || w.verificationRecorded) throw Error("Verification plan is locked after performed work.");
			w.plan = structuredClone(f.verification);
			break;
		case "define-verification-plan":
			if (w.action.status === "performed" || w.verificationRecorded) throw Error("Verification plan is locked after performed work.");
			if (JSON.stringify(command.plan) !== JSON.stringify(f.verification)) throw Error("Only the source-bound preregistered plan is available; use the explicit draft/revision protocol for changes.");
			w.plan = structuredClone(f.verification);
			break;
		case "record-verification":
			ready();
			if (!view.verification.proof || view.verification.baselineCount < w.plan.requiredShifts || view.verification.postCount < w.plan.requiredShifts) throw Error("Current-cycle work proof and complete eligible before/after cohorts are required.");
			w.verificationRecorded = true;
			break;
		case "review-safety":
			if (!f.safetyReviews.some((s) => s.id === command.evidenceId && s.knownAt <= w.asOf && s.status === "pass" && s.workId === w.action.performedId) || !["safety", "manager"].includes(actor) || command.evidenceId !== w.caseId + "-SAFETY-01" || !w.verificationRecorded || w.asOf < clocks[3] || w.condition === "failed_safety") throw Error("Separate fictional safety reviewer and known current-cycle safety record are required.");
			w.safetyEvidence = String(command.evidenceId);
			break;
		case "accept-result":
			ready();
			manager();
			if (!w.verificationRecorded || !["awaiting_acceptance", "accepted"].includes(view.verification.status)) throw Error("Measured improvement, eligible cohort, passing quality/energy and separate safety review are required.");
			w.accepted = true;
			w.resultRejectedReason = null;
			break;
		case "reject-result":
			manager();
			if (!w.verificationRecorded) throw Error("A measured result is required before rejection.");
			w.accepted = false;
			w.resultRejectedReason = reason();
			break;
		case "record-sustain":
			ready();
			if (!w.accepted) throw Error("Accepted result required before sustain monitoring.");
			w.sustainIds = f.sustain.observations.filter((o) => o.at <= w.asOf && (w.sustainPolicyVersion === 2 || o.eligible) && (w.condition !== "insufficient_sustain" || f.sustain.observations.indexOf(o) < 2)).map((o) => o.id);
			break;
		case "reopen":
			if (view.sustain.status !== "recurrence") throw Error("Known recurrence is required to open a new cycle.");
			w.priorCycles.push({
				cycle: w.cycle,
				openedAt: w.openedAt,
				owner: structuredClone(w.owner),
				action: structuredClone(w.action),
				hypotheses: structuredClone(w.hypotheses),
				verificationRecorded: w.verificationRecorded,
				accepted: w.accepted,
				safetyEvidence: w.safetyEvidence,
				sustainIds: [...w.sustainIds]
			});
			w.cycle++;
			w.openedAt = w.asOf;
			w.owner = {
				requested: null,
				accepted: null,
				requestedAt: null,
				acceptedAt: null
			};
			w.hypotheses = [];
			w.action = emptyAction();
			w.verificationRecorded = false;
			w.safetyEvidence = null;
			w.accepted = false;
			w.resultRejectedReason = null;
			w.sustainIds = [];
			break;
		default: throw Error("Unsupported workflow command; confirmed cause, real dispatch and financial realization are unavailable.");
	}
	w.history.push({
		key,
		actor,
		command: structuredClone(command),
		at: w.asOf,
		cycle: w.cycle
	});
	return w;
}
function validateWorkflow(value) {
	try {
		const w = value;
		if (w.schemaVersion !== 2 || !Array.isArray(w.history) || w.history.length > 200 || !workflowConditions.includes(w.condition)) return false;
		if (w.sustainPolicyVersion !== void 0 && w.sustainPolicyVersion !== 2 || w.testPolicyVersion !== void 0 && w.testPolicyVersion !== 2 || w.sustainPolicyVersion !== w.testPolicyVersion) return false;
		let replay = createWorkflow(w.caseId, w.condition, w.sustainPolicyVersion === 2 ? 2 : 1);
		for (const e of w.history) replay = executeWorkflow(replay, e.command, e.actor, e.key);
		return JSON.stringify(replay) === JSON.stringify(w);
	} catch {
		return false;
	}
}
//#endregion
export { createWorkflow, evaluateVerificationGuardrails, executeWorkflow, validateWorkflow, workflowCommandFields, workflowConditions, workflowView };
