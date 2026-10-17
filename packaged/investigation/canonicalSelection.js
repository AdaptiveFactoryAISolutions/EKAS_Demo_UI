import "../platform/trainingContext.js";
import { currentConversationScopeIssue } from "./conversationScopeEligibility.js";
import { collectorScopeMatches } from "./collectorScope.js";
//#region app/src/investigation/canonicalSelection.ts
/** A read projection only. No fixture seeding, legacy imports or client write authority. */
async function loadCanonicalSelection(client, id) {
	for (let attempt = 0; attempt < 3; attempt++) {
		const conversation = await client.readConversation(id), c = conversation.content.conversation;
		let aggregate = null, view = null, comparison = null;
		if (c.dataset === "manufacturing" && c.comparisonId) comparison = (await client.readComparisons()).find((r) => r.id === c.comparisonId) || null;
		else if (c.dataset === "manufacturing" && c.investigationId) {
			aggregate = await client.readAggregate(c.investigationId);
			if (aggregate.content.domain === "manufacturing-investigation-v2") view = await client.view(aggregate.id);
			if ((await client.readAggregate(aggregate.id)).version !== aggregate.version) continue;
		}
		if (c.dataset === "manufacturing" && c.comparisonId && !comparison) throw Error("Selected comparison is unavailable. No original investigation was substituted.");
		if ((await client.readConversation(id)).version !== conversation.version) continue;
		const scopeQualification = currentConversationScopeIssue(c) || (aggregate?.content.domain === "manufacturing-investigation-v2" && !collectorScopeMatches(c.context, aggregate.content.workflow) ? "Requested scope mismatch: " + [
			c.context.machine,
			c.context.part,
			c.context.revision,
			c.context.period
		].filter(Boolean).join(" / ") + " differs from the saved investigation. Current results and action readiness are withheld; original records remain saved." : null);
		return {
			conversation,
			aggregate,
			view: scopeQualification ? null : view,
			comparison,
			scopeQualification
		};
	}
	throw Error("The investigation changed while being read. Refresh before acting; no mixed-version result published.");
}
//#endregion
export { loadCanonicalSelection };
