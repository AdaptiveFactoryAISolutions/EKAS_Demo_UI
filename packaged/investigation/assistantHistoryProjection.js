import { capturedTrainingContext } from "../platform/trainingContext.js";
import { historicalCapturedScopeIssue } from "./conversationScopeEligibility.js";
//#region app/src/investigation/assistantHistoryProjection.ts
/** The public assistant text the user saw, qualified as an immutable capture.
* Never upgrades model commentary to evidence or rewrites stored originals. */
function assistantHistoryProjection(turn, { withheldReason = historicalCapturedScopeIssue(turn) } = {}) {
	const base = {
		asOf: turn.asOf,
		qualification: turn.answer.qualification,
		context: turn.training ? capturedTrainingContext(turn.training) : structuredClone(turn.trainingModelContext || turn.context)
	};
	if (withheldReason) return {
		...base,
		context: null,
		qualification: "Withheld under current scope/policy; not current evidence.",
		text: "Earlier captured assistant content is unavailable under the current scope/policy.",
		availability: "withheld",
		withheldReason,
		sourceIds: [],
		modelCommentary: null
	};
	const commentary = turn.providerInterpretationCapture?.response.interpretation || null;
	return {
		...base,
		text: turn.answer.text,
		availability: "as-captured",
		sourceIds: [...turn.answer.sourceIds],
		modelCommentary: commentary ? {
			text: commentary,
			qualification: "Unverified model interpretation; not a current measurement, performed intervention, causal proof or verified saving.",
			asOf: turn.asOf
		} : null
	};
}
//#endregion
export { assistantHistoryProjection };
