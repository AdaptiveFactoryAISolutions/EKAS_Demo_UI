import { requestedScopeText } from "./requestOperands.js";
import { requestedScopeText as requestedScopeText$1 } from "./requestOperandsV81.js";
//#region app/src/investigation/metricPublication.ts
/** Version1 binds metric follow-ups to their exact selected current cohort.
* Applied only to newly captured replies. Older replies retain their rendering. */
function bindMetricPublication(question, context, view, answer) {
	if (!view || !/why|drop|lower|declin|what happened/i.test(question) || !["quality", "fpy"].includes(context.metric)) return answer;
	const metric = context.metric, label = metric === "fpy" ? "FPY (first-pass yield)" : "Quality (terminal good yield)", scope = view.context, scopeMatches = context.machine === scope.asset && (!context.part || context.part === scope.part) && (!context.revision || context.revision === scope.revision) && (!context.job || context.job === scope.job) && (!context.operation || context.operation === scope.operation) && (!context.plant || context.plant === scope.plant), selected = view.selected.metrics;
	const result = selected[metric], available = scopeMatches && view.eligibility.status === "ready" && result.value !== null;
	const qualification = !scopeMatches ? "Requested scope differs from the selected investigation. Correct the scope or explicitly open the matching case; no neighboring cohort substituted." : view.eligibility.status !== "ready" ? view.eligibility.reasons.join(" ") : result.value === null ? "Exact first-pass dispositions are unavailable for this selected cohort. Terminal good yield and OEE are not substitutes." : null;
	return {
		text: available ? `${label} is ${Number(result.value).toFixed(2)}% for ${scope.plant} / ${scope.asset} / ${scope.job}, ${scope.part} revision ${scope.revision}, ${scope.operation}, ${scope.from} to ${scope.to}, as of ${view.asOf}. ${metric === "quality" ? `${selected.good} terminal good units / ${selected.total} total units.` : "Only exact first-pass good units count; accepted rework is excluded."} A decline and its cause are not established by this current observation. The comparison must use an explicitly selected comparable period. Cause remains unconfirmed; downtime and OEE evidence were not substituted.` : `${label} is unavailable for the requested current cohort at ${view.asOf}. ${qualification} No decline, cause or alternate metric was calculated.`,
		evidence: available ? "metrics" : "none",
		chart: false,
		metric,
		sourceIds: available ? view.selected.sourceIds : [],
		qualification
	};
}
/** Shared semantic admission; presentation formatting cannot override finance. */
function isFinancialRequest(question) {
	return /\b(?:verified|realized|realised|actual)\s+(?:financial\s+)?savings\b|\bhow much\b.*\b(?:saved|save|saving)\b|\bfinancial savings\b/i.test(question);
}
/** Version2 adds explicit financial-unavailability publication. Version1 above
* remains unchanged for immutable M1/M2 history replay. */
function bindMetricPublicationV2(question, context, view, answer, previousContext) {
	const financial = isFinancialRequest(question), write = /\b(?:approve|authorize|record|request|assign|reopen|simulate|advance|create|adopt|reject|recommend)\b/i.test(question);
	const financialFollowup = previousContext?.lastIntent === "financial_unavailable" && /^(?:show(?: me)?|show (?:this|that)|graph (?:this|that)|visualize (?:this|that))[.!?]?$/i.test(question.trim());
	if ((financial || financialFollowup) && !write) return {
		text: "Verified financial savings are unavailable for this synthetic investigation. Observed operational gains, estimated capacity and contribution potential have distinct units and horizons; they do not establish realized savings or causal proof. Finance-approved definitions, incremental demand or verified avoided spend, intervention costs and a defensible counterfactual are not supplied. No operational chart or neighboring metric was substituted.",
		evidence: "none",
		chart: false,
		metric: "financial_savings",
		sourceIds: [],
		qualification: "Financial validation unavailable; no realized savings calculated."
	};
	return bindMetricPublication(question, context, view, answer);
}
/** Version3 binds generic FPY visual follow-ups; earlier captures keep policies1/2. */
function bindMetricPublicationV3(question, context, view, answer, previousContext) {
	const prior = bindMetricPublicationV2(question, context, view, answer, previousContext);
	if (context.metric !== "fpy" || !view || !/^show(?: me| (?:this|that))?[.!?]?$/i.test(question.trim())) return prior;
	const scope = view.context, m = view.selected.metrics.fpy;
	if (!(context.machine === scope.asset && context.part === scope.part && context.revision === scope.revision && context.job === scope.job) || view.eligibility.status !== "ready" || m.value === null) return {
		text: "FPY is unavailable for this exact selected cohort and cutoff. Exact eligible first-pass dispositions are required; no capacity bridge or alternate metric was substituted.",
		evidence: "none",
		chart: false,
		metric: "fpy",
		sourceIds: [],
		qualification: "FPY source eligibility unavailable."
	};
	const ids = view.selected.sourceIds;
	return {
		text: `Here is FPY for ${scope.plant} / ${scope.asset} / ${scope.part} ${scope.revision}, ${scope.from} to ${scope.to}, as of ${view.asOf}: ${Number(m.value).toFixed(2)}%. First-pass yield excludes accepted rework. This is a descriptive synthetic observation; cause remains unconfirmed.`,
		evidence: "metrics",
		chart: true,
		metric: "fpy",
		sourceIds: ids,
		qualification: null,
		visual: {
			title: scope.asset + " FPY · " + view.asOf,
			unit: "%",
			categories: ["First-pass yield"],
			values: [Number(m.value)],
			kind: "column",
			sourceIds: ids
		}
	};
}
/** Version4 treats authored workflow prose as payload, not a metric query. */
function bindMetricPublicationV4(question, context, view, answer, previousContext) {
	return bindMetricPublicationV3(requestedScopeText$1(question), context, view, answer, previousContext);
}
/** Version5 binds only newly captured current request operands. */
function bindMetricPublicationV5(question, context, view, answer, previousContext) {
	return bindMetricPublicationV3(requestedScopeText(question), context, view, answer, previousContext);
}
//#endregion
export { bindMetricPublication, bindMetricPublicationV2, bindMetricPublicationV3, bindMetricPublicationV4, bindMetricPublicationV5, isFinancialRequest };
