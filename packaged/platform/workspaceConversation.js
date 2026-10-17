import "./validation.js";
import { providerFixture } from "./fixtureSelection.js";
import { resultIdentity, resultMeta, runQuery, sourceRecords } from "./workspaceQuery.js";
import { buildTrainingSourceContext } from "./trainingContext.js";
import { boundedFollowup } from "./boundedFollowup.js";
import "../retained/stateValidation.js";
//#region app/src/platform/workspaceConversation.ts
/** Shared deterministic query port used by both retained and unified conversations. */
function evaluateWorkspaceConversation(body, context, allowedAssetIds, conversationId) {
	const questions = body.text.split(/\n+/).map((text) => text.trim()).filter(Boolean);
	if (questions.length > 12) throw Error("At most twelve explicit questions per turn.");
	let query = context;
	const ctx = body.presentationContext, at = (/* @__PURE__ */ new Date()).toISOString();
	const answers = questions.map((text) => {
		const intent = boundedFollowup(text, query);
		query = intent.query;
		if (sourceRecords(query, ctx).some((f) => !allowedAssetIds.includes(f.asset))) throw new Error("Dataset assets outside simulated session scope.");
		const rows = intent.kind === "query" ? runQuery(query, ctx) : [], observed = rows.some((row) => Object.values(row.values).some(Number.isFinite)), complete = rows.length > 0 && rows.every((row) => Object.values(row.values).every(Number.isFinite)), availability = observed ? complete ? "synthetic_observation" : "partial_coverage" : rows.length ? "missing_input" : "no_data", note = intent.kind !== "query" ? intent.note : observed ? complete ? "Descriptive synthetic observation; cause, intervention and financial realization remain unverified." : "Partial synthetic result: some requested measures are unavailable. Eligible observations retain their own units and scope; no zero or substitute supplied. Cause and financial realization are unverified." : "Requested measure unavailable for this exact context and cutoff; no zero or neighboring measure substituted.";
		const tokens = text.toLowerCase().match(/[a-z0-9]+/g)?.filter((t) => t.length > 2 && ![
			"the",
			"and",
			"for",
			"what",
			"why",
			"now",
			"same",
			"was",
			"with",
			"from",
			"this",
			"that",
			"site",
			"line",
			"asset"
		].includes(t)) || [];
		const contextSources = (body.memoryContext || []).filter((note) => tokens.some((t) => new RegExp("\\b" + t + "\\b", "i").test(note))).map((note) => ({
			sourceId: "local-memory:" + note,
			text: note,
			status: "unreviewed_local_note",
			authority: "Context only; cannot override governed facts, certify cause or authorize intervention.",
			capturedAt: at
		}));
		return {
			text,
			intent: intent.kind,
			intentNote: intent.note,
			contextSources,
			metadata: resultMeta.get(rows) || {
				total: 0,
				returned: 0,
				truncated: false
			},
			fixtureVersion: providerFixture(query.provider),
			queryContext: query,
			resultId: resultIdentity.get(rows) || null,
			rows: JSON.parse(JSON.stringify(rows)),
			availability,
			note: intent.kind === "query" && intent.note ? intent.note + " " + note : note,
			createdAt: at,
			asOf: query.asOf
		};
	});
	const rows = answers.at(-1).rows;
	return {
		sourceContext: buildTrainingSourceContext(query, rows, ctx, answers.at(-1).intent === "query" ? sourceRecords(query, ctx) : void 0, answers.at(-1).intent),
		answers,
		status: "SYNTHETIC_CANDIDATE",
		conversationId,
		turnId: "turn-" + crypto.randomUUID(),
		queryContext: query,
		resultId: answers.at(-1).resultId,
		rows,
		createdAt: at,
		asOf: query.asOf,
		note: answers.at(-1).note,
		synthetic: true,
		certified: false,
		fixtureVersion: providerFixture(query.provider)
	};
}
//#endregion
export { evaluateWorkspaceConversation };
