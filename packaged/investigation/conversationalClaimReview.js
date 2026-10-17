import { applicable, caseFixtures } from "./cases.js";
import "./governedRecords.js";
import { validReviewedClaimsCapture } from "./claimReadModel.js";
//#region app/src/investigation/conversationalClaimReview.ts
const bounded = (s) => typeof s === "string" && s.trim().length >= 10 && s.length <= 2e3;
const utc = (s) => typeof s === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().replace(".000Z", "Z") === s;
function validClaimReviewDraft(d) {
	try {
		const f = caseFixtures[d.caseId];
		return !!f && Object.keys(d).length === 10 && d.schemaVersion === 1 && Number.isSafeInteger(d.expectedVersion) && d.expectedVersion >= 0 && [
			"documentId",
			"documentVersion",
			"quote",
			"claimKind",
			"reviewer",
			"reason",
			"knownAt"
		].every((k) => Object.hasOwn(d, k)) && (d.documentId === null && d.documentVersion === null || f.documents.some((x) => x.id === d.documentId && x.version === d.documentVersion)) && (d.quote === null || bounded(d.quote)) && (d.claimKind === null || [
			"OBSERVATION",
			"HYPOTHESIS",
			"RECOMMENDATION"
		].includes(d.claimKind)) && (d.reviewer === null || bounded(d.reviewer)) && (d.reason === null || bounded(d.reason)) && (d.knownAt === null || utc(d.knownAt));
	} catch {
		return false;
	}
}
const isClaimReviewCancellation = (question) => /^cancel (?:the |this )?(?:reviewed )?claim(?: review)?[.]?$/i.test(question.trim());
function claimReviewStep(question, caseId, before, records) {
	const q = question.trim(), start = /^(?:record|review) (?:a |the )?(?:reviewed |controlled )?claim[.]?$/i.test(q), confirm = /^confirm (?:the |this )?reviewed claim[.]?$/i.test(q), cancel = isClaimReviewCancellation(q);
	const field = q.match(/^(document|quote|claim type|reviewer|reason|known at)\s*:?\s+([\s\S]+)$/i);
	if (!start && !confirm && !cancel && (!before || !field)) return null;
	if (!caseId) return {
		after: null,
		command: null,
		text: "Open an exact authored investigation before reviewing a claim; no case was selected."
	};
	const f = caseFixtures[caseId];
	let after = before ? structuredClone(before) : null, command = null, error = "";
	if (before && (!validClaimReviewDraft(before) || before.caseId !== caseId)) throw Error("Claim review draft requires recovery or exact scope restatement.");
	if (cancel) return {
		after: null,
		command: null,
		text: "Claim review canceled. No governed claim was saved."
	};
	if (start) after = {
		schemaVersion: 1,
		caseId,
		expectedVersion: records.filter((r) => r.content.kind === "record-reviewed-claim").length,
		documentId: null,
		documentVersion: null,
		quote: null,
		claimKind: null,
		reviewer: null,
		reason: null,
		knownAt: null
	};
	if (!after) return {
		after: null,
		command: null,
		text: "Start a reviewed claim and supply its exact controlled source before confirming. No claim was saved."
	};
	if (field) {
		const name = field[1].toLowerCase(), value = field[2];
		if (name === "document") {
			const m = value.match(/^(\S+) version (\S+?)[.]?$/i), d = m && f.documents.find((d) => d.id === m[1] && String(d.version) === m[2] && d.controlled && d.status === "approved");
			after.documentId = d?.id || null;
			after.documentVersion = d?.version || null;
			after.quote = null;
			if (!d) error = "That exact controlled document/version is unavailable. ";
		}
		if (name === "quote") {
			const d = f.documents.find((d) => d.id === after.documentId && d.version === after.documentVersion);
			after.quote = bounded(value) && d?.text.includes(value) ? value : null;
			if (!after.quote) error = "Supply an exact quote of at least ten characters from the selected document; no invented or altered quote is accepted. ";
		}
		if (name === "claim type") {
			after.claimKind = [
				"OBSERVATION",
				"HYPOTHESIS",
				"RECOMMENDATION"
			].includes(value.toUpperCase()) ? value.toUpperCase() : null;
			if (!after.claimKind) error = "Choose OBSERVATION, HYPOTHESIS or RECOMMENDATION; cause cannot be confirmed. ";
		}
		if (name === "reviewer" || name === "reason") {
			after[name] = bounded(value) ? value.trim() : null;
			if (!after[name]) error = "Supply a human " + name + " of ten to 2000 characters. ";
		}
		if (name === "known at") {
			const t = value.replace(/[.]$/, "");
			after.knownAt = utc(t) && Date.parse(t) >= Date.parse(f.current.knownAt) ? t : null;
			if (!after.knownAt) error = "Supply a valid exact UTC known time after the original source. ";
		}
	}
	const tuple = f.context.asset + " / " + f.context.job + " / " + f.context.part + " revision " + f.context.revision + " / " + f.context.operation;
	const missing = !after.documentId ? "document ID and exact version (Document ID version VERSION)" : !after.quote ? "exact quote (Quote: SOURCE TEXT)" : !after.claimKind ? "claim type (Claim type: OBSERVATION, HYPOTHESIS or RECOMMENDATION)" : !after.reviewer ? "human reviewer (Reviewer: NAME)" : !after.reason ? "human reason (Reason: SENTENCE)" : !after.knownAt ? "exact UTC known time (Known at YYYY-MM-DDTHH:MM:SSZ)" : null;
	if (missing) return {
		after,
		command: null,
		text: error + "Reviewing " + tuple + ". Supply the " + missing + ". Nothing is saved yet."
	};
	const doc = f.documents.find((d) => d.id === after.documentId && d.version === after.documentVersion);
	if (!applicable(doc, f.context, after.knownAt)) return {
		after,
		command: null,
		text: "That document is not applicable to this exact scope at " + after.knownAt + ". Restate the controlled document/version and quote. Nothing is saved."
	};
	const summary = tuple + ", " + doc.id + " / " + doc.version + ", " + after.claimKind + ": “" + after.quote + "”. Reviewer " + after.reviewer + ". Reason " + after.reason + ". Known " + after.knownAt + ". Stream version " + after.expectedVersion + ".";
	if (confirm) {
		command = {
			kind: "record-reviewed-claim",
			caseId,
			expectedVersion: after.expectedVersion,
			documentId: after.documentId,
			documentVersion: after.documentVersion,
			quote: after.quote,
			claimKind: after.claimKind,
			reviewer: after.reviewer,
			reason: after.reason,
			knownAt: after.knownAt,
			confirmation: "CONFIRM_REVIEWED_SYNTHETIC_CLAIM"
		};
		return {
			after: null,
			command,
			text: "The reviewed synthetic claim is saved: " + summary + " Cause remains unconfirmed; no work is authorized and historical answers remain unchanged."
		};
	}
	return {
		after,
		command: null,
		text: error + "Review " + summary + " Say “Confirm the reviewed claim” to append this human-reviewed synthetic claim, or “Cancel the claim review”. No claim has been saved."
	};
}
function claimReviewPresentation(c) {
	const step = claimReviewStep(c.question, c.caseId, c.before, c.sourceRecords);
	if (c.schemaVersion !== 1 || !step || JSON.stringify(step.after) !== JSON.stringify(c.after)) throw Error("Captured claim review requires recovery.");
	if (step.command) {
		if (!c.committedRecord || c.committedRecord.content.domain !== "manufacturing-governed-record-v1" || JSON.stringify(c.committedRecord.content.command) !== JSON.stringify(step.command) || !validReviewedClaimsCapture({
			schemaVersion: 1,
			caseId: c.caseId,
			asOf: c.committedRecord.createdAt,
			records: [...c.sourceRecords, c.committedRecord]
		})) throw Error("Captured claim lacks its exact governed proof.");
	} else if (c.committedRecord) throw Error("Incomplete claim review cannot have committed proof.");
	return {
		text: step.text,
		evidence: "documents",
		chart: false,
		metric: "oee",
		sourceIds: c.committedRecord ? [c.committedRecord.id] : [],
		qualification: "Human-reviewed synthetic source; no automatic extraction, causal promotion or real work authorization."
	};
}
//#endregion
export { claimReviewPresentation, claimReviewStep, isClaimReviewCancellation, validClaimReviewDraft };
