import { chronologyProjection, diagnosticProjection, neighborhoodProjection } from "./diagnostics.js";
//#region app/src/investigation/diagnosticConversation.ts
function diagnosticQuestion(q) {
	if (/^help with diagnostics[?.]?$/i.test(q.trim())) return "diagnostic-guide";
	if (/^(?:why did (?:this|the) machine stop|what explains (?:this|the) stop)[?.]?$/i.test(q.trim())) return "diagnostic-why";
	if (/alternative explanations|what else could.*(?:cause|explain)/i.test(q)) return "diagnostic-alternatives";
	if (/symptom rather than.*cause|cause or.*symptom|could.*(?:be a symptom|controller response)/i.test(q)) return "diagnostic-symptom";
	if (/(?:alarms|events).*before.*stop|what happened immediately before.*stop/i.test(q)) return "diagnostic-chronology";
	if (/upstream.*(?:process|connect|relation)|process.*upstream/i.test(q)) return "diagnostic-upstream";
	return null;
}
function captureDiagnostic(record, question, intent, context) {
	return {
		schemaVersion: 1,
		question,
		intent,
		metric: context.metric,
		investigationId: record.id,
		investigationVersion: record.version,
		asOf: record.content.workflow.asOf,
		context: structuredClone(context),
		projection: diagnosticProjection(record),
		chronology: chronologyProjection(record.content.workflow),
		neighborhood: neighborhoodProjection(record.content.workflow)
	};
}
function diagnosticPresentation(c) {
	const p = c.projection, r = c.chronology, g = c.neighborhood, h = p.hypotheses, scope = p.contextRef, eligible = c.context.machine === scope.asset && c.context.job === scope.job && c.context.part === scope.part && c.context.revision === scope.revision && c.context.operation === scope.operation && c.context.plant === scope.plant && c.context.line === scope.line && c.context.period === scope.from.slice(0, 10) + " day shift" && c.context.shift === "day" && p.evidenceEligibility.status === "ready" && p.chronologyCompleteness !== "unavailable", beforeRecords = r.records.filter((e) => Date.parse(e.eventTime) + (e.clockUncertaintyMs || 0) < Date.parse(r.illustrativeStopAt) && (!/alarms?/i.test(c.question) || e.kind.startsWith("alarm-")));
	let text;
	const statuses = h.length ? h.map((x) => x.id + " version " + x.version + ": " + x.status + "; " + x.description).join("\n") : "No hypothesis has been recorded. Suggested explanations remain separate from source-backed test dispositions.";
	if (!eligible) text = "Diagnostic evidence is unavailable for the requested current tuple. " + p.evidenceEligibility.reasons.join(" ") + " Current-cycle diagnostic source coverage must also be available; select the explicit later diagnostic simulation after recurrence. Return to the exact original investigation or refresh its qualified source.";
	else if (c.intent === "diagnostic-guide") text = "Open Explore in this existing conversation to read the paged auxiliary chronology and effective process relationships. To save an unverified assessment, select an exact recorded hypothesis and its current version, check type, qualified outcome, eligible evidence IDs and reason, then explicitly confirm. Propose a hypothesis and plan its source-backed test through chat first. Inconclusive means unresolved evidence; no physical cause is verified. After recurrence reopen, explicitly select the separate later diagnostic snapshot; prior-cycle evidence cannot certify the new cycle. Failed or conflicting writes retain the assessment fields; reload the canonical case and review its current version before another attempt. These reads do not acknowledge alarms, approve work, release containment or complete a business step.";
	else if (c.intent === "diagnostic-chronology") text = beforeRecords.length ? "Known before-stop " + (/alarms?/i.test(c.question) ? "alarm lifecycle records" : "observations") + " in the supplied illustrative episode:\n" + beforeRecords.map((e) => e.eventTime + " · " + e.kind + " · " + e.id + " · known " + e.knownAt + " · " + e.sourceId).join("\n") + "\nCoverage " + r.completeness + ". Only records before the illustrative stop at " + r.illustrativeStopAt + " and known at this cutoff are published here. The full surrounding episode remains in captured evidence. Sparse samples and clock uncertainty do not establish an immediate or first cause; these auxiliary records do not explain the original aggregate stop population." : "No eligible before-stop " + (/alarms?/i.test(c.question) ? "alarm records" : "observations") + " are supplied for this exact illustrative episode/window and knowledge cutoff. This does not establish no prior alarm outside coverage or a first event; inspect the full captured episode and missing evidence.";
	else if (c.intent === "diagnostic-upstream") text = g.edges.length ? g.edges.map((e) => e.from + " → " + e.to + " · " + e.relationship + " · " + e.direction + " · topology version " + e.topologyVersion).join("\n") + "\nA declared upstream relationship is not causal evidence; collect matching process observations before choosing a cause." : "Applicable topology is unavailable; no current graph was substituted.";
	else if (c.intent === "diagnostic-symptom") text = "A controller response after a stop is consistent with a protective symptom. It does not establish the initiating cause. Check sensor trust, the applicable control logic and independently sourced upstream evidence.\n" + statuses;
	else if (c.intent === "diagnostic-alternatives") text = "Retain competing equipment, material, measurement and upstream explanations until eligible tests distinguish them. An inconclusive assessment states what is still missing.\n" + statuses;
	else text = "The recorded arithmetic and stop descriptions do not establish a qualified physical cause. Separate the observed symptom from competing explanations, then record an eligible source-backed test.\n" + statuses;
	text += "\n\nCause remains unconfirmed. " + p.missingEvidence.join(" ") + " Check " + p.primaryEndpoint.name + " in " + p.primaryEndpoint.unit + " against " + p.primaryEndpoint.target + "; supporting OEE does not replace this endpoint. No work, alarm acknowledgement, containment release or financial savings is certified by this read.";
	const qualification = "Independently authored synthetic diagnostic evidence · case " + p.investigationId + " version " + p.investigationVersion + " cycle " + p.cycleId + " · diagnostic as of " + p.asOf + " · case clock " + p.caseAsOf + ". " + r.qualifications.join(" ");
	return {
		text,
		evidence: eligible ? "events" : "none",
		chart: false,
		metric: c.metric,
		sourceIds: eligible ? [...new Set(c.intent === "diagnostic-chronology" ? beforeRecords.map((e) => e.id) : c.intent === "diagnostic-upstream" ? g.edges.map((e) => e.sourceId) : p.evidenceRefs.map((e) => e.id))] : [],
		qualification
	};
}
//#endregion
export { captureDiagnostic, diagnosticPresentation, diagnosticQuestion };
