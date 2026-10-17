import { genealogyProjection } from "./lotGenealogy.js";
//#region app/src/investigation/lotGenealogyConversation.ts
function genealogyQuestion(q) {
	return /^(?:show (?:lot )?genealogy|which lots could share the material|how many units could be affected|which links are still unknown|show lineage recovery evidence)[?.!]?$/i.test(q.trim());
}
function captureGenealogy(r, q) {
	return {
		schemaVersion: 1,
		question: q,
		projection: genealogyProjection(r),
		synthetic: true,
		physicalInterventionPerformed: false,
		causalStatus: "unconfirmed",
		financiallyValidated: false
	};
}
function genealogyPresentation(c) {
	const p = c.projection, s = p.selectedSnapshot;
	return {
		text: `Synthetic ${p.caseId} declared lot genealogy at ${p.asOf}: ${p.effectiveStatus}.\n\n${s ? `Selected root ${p.selectedRootLotId}; source ${s.sourceId} version ${s.sourceVersion}, known ${s.knownAt}. These are authored relationships, not new physical production, inventory or shipment observations.` : "No root/source is selected. Choose an exact available authored source and root through the review controls; no current lot membership is guessed."}\n\n${p.nodes.length} declared reachable node records and ${p.links.length} directed relationship records within ${p.traversal.maxHops} hops. Related declared jobs: ${p.relatedJobIds.join(", ") || "none disclosed"}. These jobs are not ranked as defects; no missing production denominator is supplied by a link.\n\n${p.uniqueKnownUnitIds.length} unique known existing unit references are disclosed (${p.unitReferenceOccurrences} appearances through split/rework); repeats are counted once. Total affected units and unmapped quantity are unknown, not zero. No all-product-contained or unaffected-outside-scope claim is admitted. ${p.gaps.map((g) => g.description).join(" ")}\n\n${p.reasons.join(" ")} ${p.scopeReviews.length ? `Owned scope reviews: ${p.scopeReviews.length}; they record local accountability, not containment activation or inventory release.` : "Owned scope follow-through can be reviewed explicitly; no task or physical hold is created by this read."} Trace recovery does not recover failed measurement assurance or perform work. Historical captured answers retain their original source, clock and status; cause and financial savings remain unverified.`,
		evidence: s ? "events" : "none",
		chart: false,
		metric: "lot_genealogy",
		sourceIds: s ? [s.id, ...p.links.map((l) => l.source)] : [],
		qualification: "Synthetic declared lineage, bounded source references and unknown exposure; no production conformance, containment, cause or verified financial savings."
	};
}
//#endregion
export { captureGenealogy, genealogyPresentation, genealogyQuestion };
