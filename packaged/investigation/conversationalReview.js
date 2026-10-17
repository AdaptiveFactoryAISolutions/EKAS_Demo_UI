import { caseFixtures } from "./cases.js";
import { validCorrectionChain } from "./governedRecords.js";
//#region app/src/investigation/conversationalReview.ts
const exactTime = (s) => /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().replace(".000Z", "Z") === s;
function validCorrectionDraft(d) {
	const f = caseFixtures[d.caseId];
	return !!f && !Object.keys(d).some((k) => ![
		"schemaVersion",
		"interpretationVersion",
		"kind",
		"caseId",
		"sourceRowId",
		"expectedVersion",
		"previousGood",
		"good",
		"knownAt",
		"reason"
	].includes(k)) && d.schemaVersion === 1 && (d.interpretationVersion === void 0 || d.interpretationVersion === 2) && d.kind === "source-correction" && d.sourceRowId === f.current.id && Number.isSafeInteger(d.expectedVersion) && d.expectedVersion >= 0 && Number.isSafeInteger(d.previousGood) && Number.isSafeInteger(d.good) && d.good >= 0 && d.good <= f.current.total && d.good !== d.previousGood && (f.current.firstPassGood === null || d.good >= f.current.firstPassGood) && (d.knownAt === null || exactTime(d.knownAt)) && (d.reason === null || d.reason.trim().length >= 10 && d.reason.length <= 2e3);
}
function parseCountProposal(q, interpretationVersion) {
	if (interpretationVersion === 1) {
		const legacy = q.match(/^(?:(?:correct|change|revise) (?:the )?(?:final )?good (?:output|units|count) (?:to|from \d+ to)|(?:actually[, ]+)?(?:the )?(?:final )?good (?:output|count) (?:was|is))\s*(\d+)\b/i);
		return legacy ? {
			good: Number(legacy[1]),
			previousGood: null,
			invalid: false
		} : null;
	}
	const edited = q.match(/^(?:correct|change|revise) (?:the )?(?:current |final )?good (?:output|units|count) (to|from)\s*(.*)$/i), observed = q.match(/^(?:actually[, ]+)?(?:the )?(?:current |final )?good (?:output|count) (?:was|is)\s*(.*)$/i);
	if (!edited && !observed) return null;
	let newToken = edited?.[2] ?? observed[1], oldToken = null;
	if (edited?.[1].toLowerCase() === "from") {
		const pair = newToken.match(/^(.+?)\s+to\s+(.+)$/i);
		if (!pair) return {
			good: null,
			previousGood: null,
			invalid: true
		};
		oldToken = pair[1];
		newToken = pair[2];
	}
	const whole = (token) => {
		const m = token.trim().match(/^(\d+)(?:\s+(?:units|pieces))?\s*[.!?]?$/i);
		if (!m) return null;
		const n = Number(m[1]);
		return Number.isSafeInteger(n) ? n : null;
	};
	const good = whole(newToken), previousGood = oldToken === null ? null : whole(oldToken);
	return {
		good,
		previousGood,
		invalid: good === null || oldToken !== null && previousGood === null
	};
}
function correctionReviewStep(question, caseId, before, sourceRecords, interpretationVersion = 2) {
	const q = question.trim(), proposal = parseCountProposal(q, interpretationVersion), known = q.match(/^(?:known (?:at|time(?: is)?)\s*|as of\s*)?(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ)[.]?$/i), reason = q.match(/^(?:because|reason(?: is|:)?)\s+(.+)/i) || (interpretationVersion === 2 && before?.interpretationVersion === 2 && before.knownAt && !before.reason && !proposal && q.length >= 10 && !/[?]/.test(q) && !/^(?:who|what|why|how|when|where|show|list|tell|record|advance|simulate|open|start|return|go|investigate|correct|change|revise|cancel|confirm|accept|approve|authorize|measure|fix|refresh|known|as of)\b/i.test(q) ? [q, q] : null), confirm = /^confirm (?:the |that |this )?(?:reviewed )?(?:source )?correction[.]?$/i.test(q), cancel = /^cancel (?:the |that |this )?(?:source )?correction[.]?$/i.test(q);
	if (!proposal && !before && !confirm && !cancel || before && !proposal && !known && !reason && !confirm && !cancel) return null;
	let after = before ? structuredClone(before) : null, command = null, text = "";
	if (!caseId) {
		text = "Open one exact downtime, speed or quality investigation before reviewing a correction.";
		after = null;
	} else if (!validCorrectionChain(sourceRecords) || sourceRecords.some((r) => r.content.caseId !== caseId)) {
		text = "The exact source history requires recovery; no count or write substituted.";
		after = null;
	} else {
		const f = caseFixtures[caseId], last = sourceRecords.at(-1), current = (last?.content.response)?.projection.row || f.current, version = last?.version || 0;
		if (before && (!validCorrectionDraft(before) || before.caseId !== caseId)) {
			text = "The pending review belongs to a different exact case. Start a correction for this investigation; no write was made.";
			after = null;
		} else if (cancel) {
			after = null;
			text = "The pending correction is canceled. Original source records and captured answers are unchanged.";
		} else if (proposal) {
			if (proposal.invalid || proposal.good === null) {
				after = null;
				text = "Supply one unsigned whole-unit integer count without grouping, fractions, signs, exponents or alternatives. Unsupported count text is not rounded or partially interpreted; no correction was saved.";
			} else if (proposal.previousGood !== null && proposal.previousGood !== current.good) {
				after = null;
				text = "The stated previous count does not match this exact current source version. Review the current count and restate both integer counts; no correction was saved.";
			} else {
				const good = proposal.good;
				after = {
					schemaVersion: 1,
					...interpretationVersion === 2 ? { interpretationVersion: 2 } : {},
					kind: "source-correction",
					caseId,
					sourceRowId: f.current.id,
					expectedVersion: version,
					previousGood: current.good,
					good,
					knownAt: null,
					reason: null
				};
				if (!validCorrectionDraft(after)) {
					after = null;
					text = "That count is invalid for this exact row or unchanged. Supply an integer consistent with total units and known first-pass outcomes.";
				}
			}
		} else if (interpretationVersion === 2 && before?.interpretationVersion !== 2 && before) {
			after = null;
			text = "This pending review predates complete count-token validation. Restate the exact whole-unit integer count before a new confirmation; captured historical answers remain unchanged and no correction was saved.";
		} else if (!after) text = "There is no pending reviewed correction to confirm. State the exact proposed good count first.";
		else if (after.expectedVersion !== version || after.previousGood !== current.good) {
			after = null;
			text = "The source version changed during review. Reload and restate the proposed count against the new exact version; no stale correction was saved.";
		} else if (known) {
			if (!exactTime(known[1]) || known[1] < current.knownAt) text = "Supply an exact UTC known time at or after this row’s latest known time; no current time is inferred.";
			else after.knownAt = known[1];
		} else if (reason) {
			if (reason[1].trim().length < 10 || reason[1].length > 2e3) text = "Supply a bounded review reason of at least ten characters.";
			else after.reason = reason[1].trim();
		}
		if (after && !text) {
			const tuple = f.context.asset + "/" + f.context.job + "/" + f.context.part + " revision " + f.context.revision + "/" + f.context.operation;
			if (!after.knownAt) text = "I have the proposed good output " + after.good + " for " + tuple + "; current " + after.previousGood + ", source version " + after.expectedVersion + ". When was the corrected count known? Give the exact UTC timestamp. Nothing is saved yet.";
			else if (!after.reason) text = "Known time " + after.knownAt + " is retained. " + (interpretationVersion === 2 ? "Give the human review reason as a sentence, or use “Reason: …”, for changing" : "What is the human review reason for changing") + " " + after.previousGood + " to " + after.good + "? Nothing is saved yet.";
			else if (confirm) {
				command = {
					kind: "correct-current-source",
					caseId,
					sourceRowId: after.sourceRowId,
					scope: structuredClone(f.context),
					expectedVersion: after.expectedVersion,
					previousGood: after.previousGood,
					good: after.good,
					knownAt: after.knownAt,
					reason: after.reason,
					confirmation: "CONFIRM_SYNTHETIC_SOURCE_CORRECTION"
				};
				text = "The reviewed synthetic correction is saved for " + tuple + ": " + after.previousGood + " → " + after.good + ", known " + after.knownAt + ". Raw unit evidence still requires separate matching review. Historical answers, dated comparison cohorts, work proof and acceptance remain unchanged.";
				after = null;
			} else text = "Review " + tuple + ", exact row " + after.sourceRowId + ", source version " + after.expectedVersion + ": " + after.previousGood + " → " + after.good + ", known " + after.knownAt + ". Reason: " + after.reason + ". Say “Confirm the reviewed correction” to append this synthetic source version, or cancel. No write, raw reconciliation or verified improvement has occurred yet.";
		}
	}
	return {
		after,
		command,
		text
	};
}
function correctionReviewPresentation(c) {
	if (c.interpretationVersion !== void 0 && c.interpretationVersion !== 2) throw Error("Unsupported captured correction interpretation version.");
	const step = correctionReviewStep(c.question, c.caseId, c.before, c.sourceRecords, c.interpretationVersion === 2 ? 2 : 1);
	if (!step || JSON.stringify(step.after) !== JSON.stringify(c.after)) throw Error("Conversation review snapshot requires recovery.");
	if (step.command) {
		if (!c.committedRecord || JSON.stringify(c.committedRecord.content.command) !== JSON.stringify(step.command) || c.committedRecord.content.domain !== "manufacturing-governed-record-v1" || !validCorrectionChain([...c.sourceRecords, c.committedRecord])) throw Error("The captured correction lacks its exact committed source record.");
	} else if (c.committedRecord) throw Error("No committed record is allowed for an incomplete or canceled review.");
	return {
		text: step.text,
		evidence: "none",
		chart: false,
		metric: "oee",
		sourceIds: c.committedRecord ? [c.committedRecord.id] : [caseFixtures[c.caseId].current.source],
		qualification: "Explicit human-reviewed synthetic correction; not real dispatch, causal proof or financial savings."
	};
}
//#endregion
export { correctionReviewPresentation, correctionReviewStep, validCorrectionDraft };
