import { notificationProjection } from "./notifications.js";
//#region app/src/investigation/notificationConversation.ts
function notificationQuestion(q) {
	return /^(?:show attention inbox|why was I notified|which notices failed delivery|what is deferred by attention policy|show notification acknowledgment history)[?.!]?$/i.test(q.trim());
}
function captureNotification(r, q) {
	return {
		schemaVersion: 1,
		question: q,
		projection: notificationProjection(r),
		synthetic: true,
		actualDispatched: false,
		actualDeliveryVerified: false,
		underlyingResolved: false
	};
}
function notificationPresentation(c) {
	const p = c.projection, s = p.selectedSnapshot;
	return {
		text: `Synthetic ${p.caseId} local attention inbox at ${p.asOf}: ${p.effectiveStatus}.\n\nCase ${p.investigationId} cycle ${p.cycleId}, job ${p.contextRef.job}, part ${p.contextRef.part} revision ${p.contextRef.revision}. ${s ? `Source ${s.sourceId} version ${s.sourceVersion}, known ${s.knownAt}, notice generation ${s.generation}.` : "No exact attention source selected; review one explicitly."} Authored envelope metadata is separate from manufacturing observations; physical alarm exposure remains unknown.\n\n${p.knownEnvelopeCount} envelopes, ${p.knownGroupCount} canonical event/case groups, ${p.duplicateEnvelopeCount} duplicate copies. ${p.visibleGroups.length} visible, ${p.deferredGroups.length} explicitly deferred; overload ${p.overloaded ? "declared" : "not declared"}. These counts do not measure independent physical alarms.\n\n${p.groups.map((g) => `${g.id}: ${g.priority}, ${g.totalMembers} envelopes; ${g.localState}; delivery ${g.deliveryStatus}. Why notified: ${g.whyNotified}. ${g.deferredReason} ${g.resurfaced ? "Notice-policy resurface after expiry; no physical recurrence inferred." : ""}`).join("\n")}\n\n${p.journal.length ? `Original local journal: ${p.journal.map((j) => j.operation + " by " + j.actor + " at " + j.at + " for generation " + j.generation).join("; ")}.` : "No local read or acknowledgment recorded."} Read/acknowledgment never resolves the underlying exception; failure remains visible. Critical/escalation cannot snooze or mute. Only permitted digest attention may defer within the explicit policy; no real channel is contacted.\n\n${p.reasons.join(" ")} Historical answers retain their original source, timestamps, notice status and unknown physical exposure.`,
		evidence: s ? "events" : "none",
		chart: false,
		metric: "attention_metadata",
		sourceIds: s ? [s.id, s.sourceId] : [],
		qualification: "Synthetic attention metadata; no actual dispatch, verified delivery, safety escalation, physical resolution or recurrence claim."
	};
}
//#endregion
export { captureNotification, notificationPresentation, notificationQuestion };
