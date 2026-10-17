//#region app/src/investigation/governedModelDraft.ts
function validGovernedModelDraft(x) {
	return !!x && [
		"turnId",
		"captureId",
		"operationId",
		"provider",
		"policyRevision",
		"sourceRevision",
		"capturedAt",
		"interpretation"
	].every((k) => typeof x[k] === "string" && x[k].trim().length > 0 && x[k].length <= (k === "interpretation" ? 2e3 : 64e3)) && [
		"manager",
		"maintenance",
		"supervisor",
		"safety",
		"viewer"
	].includes(x.authorRole) && (!x.operation || Object.keys(x.operation).length === 1 && x.operation.kind === "recommend-action") && x.unverified === true && x.synthetic === true;
}
/** Preparation is available only for the latest exact saved case snapshot, never a current reinterpretation of an older answer. */
function currentGovernedModelDraft(c, w) {
	const t = c.content.conversation.turns.at(-1), capture = t?.providerInterpretationCapture || t?.modelCapture;
	if (!t || !capture || !t.captureId || capture.conversationId !== c.id || capture.expectedVersion !== c.version - 1 || t.investigationId !== c.content.conversation.investigationId || t.asOf !== w.asOf || JSON.stringify(t.workflowSnapshot) !== JSON.stringify(w)) return null;
	const receipt = capture.receipts.find((r) => r.id === "preview:action" && r.status === "observed"), fact = receipt?.facts.find((f) => f.key === "reviewable_operation" && f.value === JSON.stringify({ kind: "recommend-action" }) && f.unit === "");
	const draft = {
		...fact && capture.response.claims.some((claim) => claim.receiptId === receipt.id && claim.key === fact.key && claim.value === fact.value && claim.unit === fact.unit) ? { operation: { kind: "recommend-action" } } : {},
		turnId: t.id,
		captureId: t.captureId,
		operationId: capture.operationId,
		provider: capture.provider,
		policyRevision: capture.policyRevision,
		sourceRevision: capture.sourceRevision,
		capturedAt: t.asOf,
		authorRole: t.actor,
		interpretation: capture.response.interpretation,
		unverified: true,
		synthetic: true
	};
	return validGovernedModelDraft(draft) ? draft : null;
}
//#endregion
export { currentGovernedModelDraft, validGovernedModelDraft };
