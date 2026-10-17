import { tables } from "../inputs/metric-oracle/training-relational-seed.js";
import { caseFixtures } from "./cases.js";
import { requestedScopeText } from "./requestOperands.js";
import { isDowntimeMetricRequest } from "./conversation.js";
//#region app/src/investigation/assetScopeInterpretation.ts
/** Policies2/3 retain their original interpretation. Policy4 adds only lossless canonical formatting.
* SW-Q1 has no authored alias. Do not guess an asset from the requested metric. */
const cases = Object.entries(caseFixtures).map(([caseId, f]) => ({
	caseId,
	asset: f.context.asset
}));
const canonical = [
	...cases.map((c) => c.asset),
	...tables.assets.map((a) => a.id),
	"Machine 1",
	"Machine 2"
];
const source = "Authored case context / training-relational-seed assets / conversation-months-v1 and first/second-machine grammar";
const normalize = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
const ignored = /* @__PURE__ */ new Set([
	"it",
	"this",
	"that",
	"current",
	"same",
	"original",
	"each",
	"all",
	"baseline",
	"post",
	"comparison",
	"verification",
	"sustain",
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
	"day",
	"night",
	"oee",
	"fpy",
	"availability",
	"performance",
	"quality",
	"downtime",
	"speed"
]);
function resolveAssetScope(question, previous, policyVersion = 4) {
	const q = question.toLowerCase(), requested = [];
	if (/^(?:reason\s*:|because\b)/i.test(question)) {
		if (previous?.lastIntent === "asset-scope-clarify" && previous.clarification) return {
			kind: "clarify",
			reason: previous.clarification,
			requested: []
		};
		return { kind: "none" };
	}
	const add = (s) => {
		if (!(policyVersion >= 3 && /^(plant|site|facility)$/.test(normalize(s))) && !ignored.has(normalize(s)) && !requested.some((x) => normalize(x) === normalize(s))) requested.push(s);
	};
	const spans = [];
	const identifier = policyVersion === 4 ? /\b(?:FEED\s*-?\s*\d[A-Za-z0-9_]*|PRESS\s*-?\s*S\s*\d[A-Za-z0-9_]*|FORM\s*-?\s*Q\s*\d[A-Za-z0-9_]*|SW\s*-?\s*Q\s*\d[A-Za-z0-9_]*|TP\s*-?\s*A\s*\d[A-Za-z0-9_]*)\b/gi : /\b(?:FEED-\d+|PRESS-S\d+|FORM-Q\d+|SW-Q\d+|TP-A\d+)\b/gi;
	for (const m of question.matchAll(identifier)) if (question[(m.index || 0) - 1] !== "-") {
		add(m[0]);
		spans.push({
			from: m.index,
			to: m.index + m[0].length
		});
	}
	const addOperand = (m) => {
		const start = m.index + m[0].lastIndexOf(m[1]);
		if (policyVersion !== 4 || !spans.some((s) => start >= s.from && start < s.to)) add(m[1]);
	};
	for (const m of question.matchAll(/\b(?:machine\s*\d+|first machine|second machine)\b/gi)) add(m[0]);
	for (const m of question.matchAll(/\b(?:asset|equipment)\s+(?:(?:named|called|id)\s+)?([A-Za-z][A-Za-z0-9-]*|\d+)/gi)) addOperand(m);
	if (/\binvestigat|\bfocus on|\bswitch|\bwhat about|\b(?:oee|fpy|availability|performance)\b/.test(q)) for (const m of question.matchAll(/\b(?:on|for)\s+(?:the\s+)?(?:(?:asset|equipment)\s+)?(first machine|second machine|machine\s*\d+|[A-Za-z][A-Za-z0-9-]*|\d+)/gi)) addOperand(m);
	if (policyVersion === 4 && /\b(?:downtime|quality|speed)\b/.test(q)) for (const m of question.matchAll(/\b(?:on|for)\s+(?:the\s+)?([A-Za-z][A-Za-z0-9-]*\d[A-Za-z0-9-]*)\b/gi)) addOperand(m);
	if (!requested.length) {
		if (previous?.lastIntent === "asset-scope-clarify" && previous.clarification && !/^(?:return to|go back to|use|show) (?:the )?(?:original|previous|current) (?:investigation|case|snapshot)|return.*monthly (?:cohort|dataset)|(?:plant|daily|operating) review|plant audit/i.test(question)) return {
			kind: "clarify",
			reason: previous.clarification,
			requested: []
		};
		return { kind: "none" };
	}
	const resolutions = requested.map((raw) => {
		const n = normalize(raw), monthly = n === "first machine" ? "Machine 1" : n === "second machine" ? "Machine 2" : /^machine\s*[12]$/.test(n) ? "Machine " + n.slice(-1) : null;
		const syntax = (x) => {
			return x.toLowerCase().replace(/\s+/g, "").replace(/^(feed|press|form|sw|tp)-?/, (_, prefix) => prefix + "-");
		};
		const id = monthly || canonical.find((c) => policyVersion === 4 ? syntax(c) === syntax(raw) : normalize(c) === n);
		return id ? {
			requested: raw,
			canonical: id,
			source,
			disclose: raw !== id
		} : null;
	});
	const clarify = (why) => ({
		kind: "clarify",
		reason: why + " Requested: " + requested.join(", ") + ". Choose an exact authored asset or clarify the intended scope. No case was substituted; prior context is retained.",
		requested
	});
	if (resolutions.some((x) => !x)) return clarify("An explicitly requested asset is not supplied by the authored asset/alias map.");
	const resolved = resolutions, unique = [...new Set(resolved.map((x) => x.canonical))];
	const caseIntent = /investigate (?:the )?quality|quality (?:loss|case)|\bburr\b/.test(q) ? "quality" : /investigate (?:the )?speed|speed (?:loss|case)|pressure.recovery/.test(q) ? "speed" : /investigate (?:the )?downtime|downtime case|feeder.jam|northworks/.test(q) ? "downtime" : null;
	if (unique.length > 1 && !((unique.every((x) => /^Machine [12]$/.test(x)) || unique.every((x) => tables.assets.some((a) => a.id === x))) && /compar/.test(q) && !caseIntent)) return clarify("The request names multiple assets without one unambiguous investigation scope.");
	if (caseIntent && !unique.every((id) => cases.some((c) => c.caseId === caseIntent && c.asset === id))) return clarify("The explicit asset does not match the requested authored manufacturing case.");
	return {
		kind: "resolved",
		resolutions: resolved
	};
}
function assetScopeClarificationPresentation(c) {
	const r = resolveAssetScope(c.schemaVersion === 3 ? c.originQuestion : c.question, c.schemaVersion === 3 ? c.originRequestContext : c.previousContext, c.policyVersion);
	if (![
		1,
		2,
		3
	].includes(c.schemaVersion) || ![
		2,
		3,
		4
	].includes(c.policyVersion) || typeof c.clearedCorrectionReview !== "boolean" || r.kind !== "clarify" || typeof c.previousContext?.machine !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(c.asOf) || !Number.isFinite(Date.parse(c.asOf))) throw Error("Invalid exact asset-scope clarification capture.");
	return {
		text: r.reason + (c.clearedCorrectionReview ? " A pending correction review was cleared; restate the exact supported scope and proposal before confirming." : ""),
		evidence: "none",
		chart: false,
		metric: assetScopeClarificationContext(c).metric,
		sourceIds: [],
		qualification: "The requested asset is unavailable, ambiguous or conflicts with the declared case; no numeric result or case was substituted."
	};
}
function assetScopeClarificationContext(c) {
	const resolved = resolveAssetScope(c.schemaVersion === 3 ? c.originQuestion : c.question, c.schemaVersion === 3 ? c.originRequestContext : c.previousContext, c.policyVersion);
	if (resolved.kind !== "clarify" || ![
		1,
		2,
		3
	].includes(c.schemaVersion)) throw Error("Invalid asset clarification context.");
	const q = requestedScopeText(c.question).toLowerCase(), requested = isDowntimeMetricRequest(q) ? "downtime" : /\bfpy\b|first.pass|first pass/.test(q) ? "fpy" : /\boee\b/.test(q) ? "oee" : /availability/.test(q) ? "availability" : /performance/.test(q) ? "performance" : /quality/.test(q) && !/(investigat|case|loss)/.test(q) ? "quality" : null;
	return {
		...c.previousContext,
		metric: c.schemaVersion >= 2 && requested ? requested : c.previousContext.metric,
		lastIntent: "asset-scope-clarify",
		clarification: resolved.reason
	};
}
/** Normalizes only identifiers resolved by the authored map; unknown IDs stay unknown. */
function canonicalAssetSyntaxQuestion(question) {
	const resolution = resolveAssetScope(requestedScopeText(question), void 0, 4);
	if (resolution.kind !== "resolved") return question;
	let normalized = question;
	for (const r of resolution.resolutions) {
		const escaped = r.requested.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		normalized = normalized.replace(new RegExp(escaped, "gi"), r.canonical);
	}
	return normalized;
}
//#endregion
export { assetScopeClarificationContext, assetScopeClarificationPresentation, canonicalAssetSyntaxQuestion, resolveAssetScope };
