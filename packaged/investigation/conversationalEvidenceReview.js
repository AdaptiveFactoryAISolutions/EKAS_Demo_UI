import { caseFixtures } from "./cases.js";
import "./governedRecords.js";
import { dependencyView, validDependencyRecords } from "./dependencies.js";
import { validReviewedClaimsCapture } from "./claimReadModel.js";
//#region app/src/investigation/conversationalEvidenceReview.ts
const positive = (s) => /^[1-9]\d*$/.test(s) && Number.isSafeInteger(Number(s));
const human = (s) => typeof s === "string" && s.trim().length >= 10 && s.length <= 2e3;
const utc = (s) => typeof s === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().replace(".000Z", "Z") === s;
const fields = [
	"schemaVersion",
	"kind",
	"caseId",
	"expectedVersion",
	"sourceRowId",
	"sourceVersion",
	"unitChanges",
	"fromClaimId",
	"fromClaimVersion",
	"toClaimId",
	"toClaimVersion",
	"relation",
	"reviewer",
	"reason",
	"knownAt"
];
function validEvidenceReviewDraft(d) {
	try {
		return Object.keys(d).length === fields.length && fields.every((k) => Object.hasOwn(d, k)) && d.schemaVersion === 1 && ["raw", "link"].includes(d.kind) && Object.hasOwn(caseFixtures, d.caseId) && Number.isSafeInteger(d.expectedVersion) && d.expectedVersion >= 0 && (d.sourceRowId === null || d.sourceRowId === caseFixtures[d.caseId].current.id) && (d.sourceVersion === null || Number.isSafeInteger(d.sourceVersion) && d.sourceVersion > 0) && Array.isArray(d.unitChanges) && d.unitChanges.length <= caseFixtures[d.caseId].current.total && new Set(d.unitChanges.map((u) => u.unitId)).size === d.unitChanges.length && d.unitChanges.every((u) => Object.keys(u).length === 3 && typeof u.unitId === "string" && typeof u.previousDisposition === "string" && typeof u.terminalDisposition === "string") && ["fromClaimId", "toClaimId"].every((k) => d[k] === null || /^governed-[1-9]\d*$/.test(d[k])) && ["fromClaimVersion", "toClaimVersion"].every((k) => d[k] === null || Number.isSafeInteger(d[k]) && d[k] > 0) && (d.relation === null || [
			"supports",
			"contradicts",
			"negates",
			"supersedes"
		].includes(d.relation)) && (d.reviewer === null || human(d.reviewer)) && (d.reason === null || human(d.reason)) && (d.knownAt === null || utc(d.knownAt)) && (d.kind === "raw" ? d.fromClaimId === null && d.fromClaimVersion === null && d.toClaimId === null && d.toClaimVersion === null && d.relation === null : d.sourceRowId === null && d.sourceVersion === null && d.unitChanges.length === 0);
	} catch {
		return false;
	}
}
const isEvidenceReviewCancellation = (question) => /^cancel (?:the )?(?:raw-unit review|claim relationship(?: review)?)[.]?$/i.test(question.trim());
function evidenceReviewStep(question, caseId, before, resources) {
	const q = question.trim(), rawStart = /^(?:review|record|reconcile) (?:the )?(?:exact )?raw (?:units|unit review|unit evidence)[.]?$/i.test(q), linkStart = /^(?:review|record) (?:a |the )?(?:reviewed )?claim (?:relationship|link)[.]?$/i.test(q), rawConfirm = /^confirm (?:the )?raw-unit review[.]?$/i.test(q), linkConfirm = /^confirm (?:the )?claim relationship[.]?$/i.test(q), cancel = isEvidenceReviewCancellation(q);
	const source = q.match(/^source row (\S+) version (\S+?)[.]?$/i), unit = q.match(/^unit (\S+) from (\S+) to (\S+?)[.]?$/i), claim = q.match(/^(from|to) claim (\S+) version (\S+?)[.]?$/i), field = q.match(/^(relation|reviewer|reason|known at)\s*:?\s+([\s\S]+)$/i), reset = /^clear (?:the )?unit changes[.]?$/i.test(q);
	if (!rawStart && !linkStart && !rawConfirm && !linkConfirm && !cancel && (!before || !source && !unit && !claim && !field && !reset)) return null;
	if (!caseId) return {
		after: null,
		command: null,
		text: "Open an exact authored investigation before reviewing raw units or a claim relationship. No case was selected."
	};
	if (before && (!validEvidenceReviewDraft(before) || before.caseId !== caseId)) throw Error("Evidence review draft needs exact scope restatement.");
	if (cancel) return {
		after: null,
		command: null,
		text: "Evidence review canceled. No raw units or claim relationship were saved."
	};
	let after = before ? structuredClone(before) : null, error = "";
	if (rawStart || linkStart) after = {
		schemaVersion: 1,
		kind: rawStart ? "raw" : "link",
		caseId,
		expectedVersion: rawStart ? 0 : resources.filter((r) => r.content.kind === "record-reviewed-claim-link" && r.content.caseId === caseId).length,
		sourceRowId: null,
		sourceVersion: null,
		unitChanges: [],
		fromClaimId: null,
		fromClaimVersion: null,
		toClaimId: null,
		toClaimVersion: null,
		relation: null,
		reviewer: null,
		reason: null,
		knownAt: null
	};
	if (!after) return {
		after: null,
		command: null,
		text: "Start the exact raw-unit review or claim relationship before confirming. Nothing was saved."
	};
	const f = caseFixtures[caseId], correction = resources.filter((r) => r.content.kind === "correct-current-source" && r.content.caseId === caseId).at(-1);
	if (source && after.kind === "raw") {
		const ok = source[1] === f.current.id && positive(source[2]) && correction?.version === Number(source[2]);
		after.sourceRowId = ok ? source[1] : null;
		after.sourceVersion = ok ? Number(source[2]) : null;
		after.unitChanges = [];
		after.expectedVersion = ok ? resources.filter((r) => r.content.kind === "record-raw-reconciliation" && r.content.caseId === caseId && r.content.command.sourceVersion === after.sourceVersion).length : 0;
		if (!ok) error = "Select the latest exact corrected source row/version; no other row or version is substituted. ";
	}
	if (reset && after.kind === "raw") after.unitChanges = [];
	if (unit && after.kind === "raw") {
		const at = after.knownAt || correction?.createdAt || f.current.knownAt, u = (after.sourceVersion ? dependencyView(resources, caseId, at, 2) : null)?.raw.units.find((u) => u.id === unit[1]);
		if (u && !u.firstPassAccepted && u.terminalDisposition === unit[2] && (u.firstPassAccepted === null ? ["scrap", "accepted_terminal"] : ["scrap", "accepted_rework"]).includes(unit[3]) && unit[3] !== unit[2] && !after.unitChanges.some((x) => x.unitId === unit[1])) after.unitChanges.push({
			unitId: unit[1],
			previousDisposition: unit[2],
			terminalDisposition: unit[3]
		});
		else {
			after.unitChanges = [];
			error = "That unit is unavailable, first-pass, duplicated or has an invalid previous/proposed disposition. Unit changes cleared; restate every exact unit. ";
		}
	}
	if (claim && after.kind === "link") {
		const r = positive(claim[3]) && resources.find((r) => r.content.kind === "record-reviewed-claim" && r.content.caseId === caseId && r.id === claim[2] && r.version === Number(claim[3]));
		if (claim[1].toLowerCase() === "from") {
			after.fromClaimId = r ? r.id : null;
			after.fromClaimVersion = r ? r.version : null;
		} else {
			after.toClaimId = r ? r.id : null;
			after.toClaimVersion = r ? r.version : null;
		}
		if (!r) error = "Supply an exact existing same-case governed claim ID/version. ";
	}
	if (field) {
		const name = field[1].toLowerCase(), value = field[2];
		if (name === "relation" && after.kind === "link") {
			after.relation = [
				"supports",
				"contradicts",
				"negates",
				"supersedes"
			].includes(value) ? value : null;
			if (!after.relation) error = "Choose an explicit supported relationship; no truth is inferred. ";
		}
		if (name === "reviewer" || name === "reason") {
			after[name] = human(value) ? value.trim() : null;
			if (!after[name]) error = "Supply a bounded human " + name + " of ten to2000characters. ";
		}
		if (name === "known at") {
			const t = value.replace(/[.]$/, "");
			after.knownAt = utc(t) && t >= f.current.knownAt ? t : null;
			if (!after.knownAt) error = "Supply exact canonical UTC known time after the original source. ";
		}
	}
	const tuple = f.context.asset + " / " + f.context.job + " / " + f.context.part + " revision " + f.context.revision + " / " + f.context.operation;
	const remaining = (after.kind === "raw" ? !after.sourceRowId ? "source row ID and latest corrected version (Source row ID version VERSION)" : !after.unitChanges.length ? "exact unit change (Unit ID from PREVIOUS_DISPOSITION to TERMINAL_DISPOSITION)" : null : !after.fromClaimId ? "from claim ID/version (From claim ID version VERSION)" : !after.toClaimId ? "to claim ID/version (To claim ID version VERSION)" : !after.relation ? "explicit relation (Relation: supports, contradicts, negates or supersedes)" : null) || (!after.reviewer ? "human reviewer (Reviewer: NAME)" : !after.reason ? "human reason (Reason: SENTENCE)" : !after.knownAt ? "known UTC time (Known at YYYY-MM-DDTHH:MM:SSZ)" : null);
	if (remaining) return {
		after,
		command: null,
		text: error + "Reviewing " + tuple + ". Supply the " + remaining + ". Nothing is saved yet."
	};
	const choice = after.kind === "raw" ? "source row " + after.sourceRowId + " / version " + after.sourceVersion + "; units " + after.unitChanges.map((x) => x.unitId + " " + x.previousDisposition + " → " + x.terminalDisposition).join("; ") : after.fromClaimId + " / version " + after.fromClaimVersion + " " + after.relation + " " + after.toClaimId + " / version " + after.toClaimVersion;
	const summary = tuple + "; " + choice + ". Reviewer " + after.reviewer + ". Reason " + after.reason + ". Known " + after.knownAt + ". Review stream version " + after.expectedVersion + ".";
	const confirm = after.kind === "raw" ? rawConfirm : linkConfirm, phrase = after.kind === "raw" ? "Confirm the raw-unit review" : "Confirm the claim relationship";
	if (confirm) {
		const common = {
			caseId,
			expectedVersion: after.expectedVersion,
			reviewer: after.reviewer,
			reason: after.reason,
			knownAt: after.knownAt
		};
		return {
			after: null,
			command: after.kind === "raw" ? {
				...common,
				kind: "record-raw-reconciliation",
				sourceVersion: after.sourceVersion,
				unitChanges: structuredClone(after.unitChanges),
				dependencyPolicyVersion: 2,
				confirmation: "CONFIRM_EXACT_RAW_RECONCILIATION"
			} : {
				...common,
				kind: "record-reviewed-claim-link",
				fromClaimId: after.fromClaimId,
				fromClaimVersion: after.fromClaimVersion,
				toClaimId: after.toClaimId,
				toClaimVersion: after.toClaimVersion,
				relation: after.relation,
				confirmation: "CONFIRM_REVIEWED_SYNTHETIC_CLAIM_LINK"
			},
			text: "The reviewed synthetic " + (after.kind === "raw" ? "raw-unit evidence" : "claim relationship") + " is saved: " + summary + " Historical answers and original claims remain unchanged. Cause remains unconfirmed; this is not verification acceptance or work authority."
		};
	}
	return {
		after,
		command: null,
		text: error + "Review " + summary + " Say “" + phrase + "” to submit the exact governed review, or cancel it. Nothing is saved yet."
	};
}
function evidenceReviewPresentation(c) {
	const step = evidenceReviewStep(c.question, c.caseId, c.before, c.sourceRecords);
	if (c.schemaVersion !== 1 || !step || JSON.stringify(step.after) !== JSON.stringify(c.after)) throw Error("Captured evidence review requires recovery.");
	if (step.command) {
		const r = c.committedRecord;
		if (!r || JSON.stringify(r.content.command) !== JSON.stringify(step.command) || r.content.caseId !== c.caseId || (step.command.kind === "record-raw-reconciliation" ? r.content.domain !== "manufacturing-source-dependencies-v1" || !validDependencyRecords([...c.sourceRecords, r]) : r.content.domain !== "manufacturing-governed-record-v1" || !validReviewedClaimsCapture({
			schemaVersion: 1,
			caseId: c.caseId,
			asOf: r.createdAt,
			records: [...c.sourceRecords.filter((x) => ["record-reviewed-claim", "record-reviewed-claim-link"].includes(String(x.content.kind))), r]
		}))) throw Error("Captured review lacks its exact governed proof.");
	} else if (c.committedRecord) throw Error("Incomplete evidence review cannot have committed proof.");
	return {
		text: step.text,
		evidence: "none",
		chart: false,
		metric: "oee",
		sourceIds: c.committedRecord ? [c.committedRecord.id] : [],
		qualification: "Exact human-reviewed synthetic source. No automatic inference, causal proof, work authority or verified savings."
	};
}
//#endregion
export { evidenceReviewPresentation, evidenceReviewStep, isEvidenceReviewCancellation, validEvidenceReviewDraft };
