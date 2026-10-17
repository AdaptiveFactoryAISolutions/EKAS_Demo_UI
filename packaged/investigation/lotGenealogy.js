import { API_VERSION } from "../platform/contract.js";
import { records } from "../inputs/lot-genealogy-synthetic-v1.js";
import { fixtureCase } from "./cases.js";
//#region app/src/investigation/lotGenealogy.ts
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const compatible = (w, s) => s.caseId === w.caseId && s.cycleId === w.cycle && same(s.contextRef, w.context);
function selectGenealogySnapshot(w, c, actor) {
	if (![
		"manager",
		"supervisor",
		"maintenance"
	].includes(actor)) throw Error("This role cannot select a declared genealogy source.");
	if (typeof c.reason !== "string" || c.reason.trim().length < 10 || c.reason.length > 1e3 || c.confirmation !== "SELECT_SYNTHETIC_GENEALOGY_SNAPSHOT") throw Error("Review reason and explicit synthetic genealogy confirmation are required.");
	const s = records.find((s) => s.id === c.snapshotId);
	if (!s || s.sourceVersion !== c.sourceVersion || !compatible(w, s)) throw Error("Exact genealogy source/context/cycle is unavailable; no neighboring source selected.");
	if (s.knownAt > w.asOf || s.decisionEffectiveFrom > w.asOf || s.decisionEffectiveUntil <= w.asOf) throw Error("Genealogy source is future or historical at this current review clock.");
	if (typeof c.rootLotId !== "string" || !s.rootLotIds.includes(c.rootLotId)) throw Error("Exact declared root lot is unavailable; no neighboring lot selected.");
	if (w.genealogySelection && w.genealogySelection.sourceId === s.sourceId && w.genealogySelection.sourceVersion > s.sourceVersion) throw Error("Genealogy source rollback is refused.");
	w.genealogySelection = {
		policyVersion: 1,
		snapshotId: s.id,
		rootLotId: c.rootLotId,
		sourceId: s.sourceId,
		sourceVersion: s.sourceVersion,
		cycleId: w.cycle,
		knownAt: s.knownAt,
		selectedAt: w.asOf,
		actor,
		reason: c.reason.trim(),
		synthetic: true
	};
}
function genealogyStatus(w) {
	const selection = w.genealogySelection, s = selection ? records.find((r) => r.id === selection.snapshotId) : void 0;
	if (!selection) return {
		status: "unassessed",
		current: false,
		snapshot: null,
		reason: "No genealogy source/root is selected. No lot membership or inventory exposure is inferred."
	};
	if (!s || s.sourceId !== selection.sourceId || s.sourceVersion !== selection.sourceVersion || selection.cycleId !== w.cycle || !compatible(w, s) || !s.rootLotIds.includes(selection.rootLotId)) return {
		status: "scope-inapplicable",
		current: false,
		snapshot: null,
		reason: "Selected trace belongs to another context/cycle or invalid source. No substitution."
	};
	if (s.knownAt > w.asOf || s.decisionEffectiveFrom > w.asOf) return {
		status: "unavailable",
		current: false,
		snapshot: null,
		reason: "Declared trace is not known at this explicit clock."
	};
	if (s.decisionEffectiveUntil <= w.asOf) return {
		status: "historical",
		current: false,
		snapshot: structuredClone(s),
		reason: "This selected trace remains historical. Current scope review needs an explicitly selected newer compatible metadata source."
	};
	return {
		status: s.declaredStatus,
		current: true,
		snapshot: structuredClone(s),
		reason: "Current independently authored trace metadata; not production genealogy, physical hold/release or causal proof."
	};
}
function traceDeclaredGenealogy(s, root, knownAt) {
	const maxHops = 4, maxNodes = 32, maxEdges = 64;
	const roster = new Map(s.nodes.map((n) => [n.id, n]));
	if (!s.rootLotIds.includes(root) || !roster.has(root)) throw Error("Unknown declared root lot");
	if (roster.size !== s.nodes.length || s.links.some((l) => !roster.has(l.from) || !roster.has(l.to))) throw Error("Invalid declared graph identities/edges; no trace substituted.");
	const visited = /* @__PURE__ */ new Map([[root, 0]]), queue = [root], links = [], gaps = [...s.gaps];
	let truncated = false;
	for (let cursor = 0; cursor < queue.length; cursor++) {
		const id = queue[cursor], depth = visited.get(id);
		for (const link of s.links.filter((l) => l.from === id && l.knownAt <= knownAt)) {
			if (depth >= maxHops || links.length >= maxEdges) {
				truncated = true;
				continue;
			}
			if (!visited.has(link.to)) {
				if (visited.size >= maxNodes) {
					truncated = true;
					continue;
				}
				visited.set(link.to, depth + 1);
				queue.push(link.to);
			}
			if (!links.some((l) => l.id === link.id)) links.push(structuredClone(link));
		}
	}
	if (truncated) gaps.push({
		id: s.id + "-BUDGET",
		nodeId: root,
		kind: "bounded-traversal",
		description: "Traversal budget reached; undisclosed descendants are not proven unaffected."
	});
	return {
		nodes: s.nodes.filter((n) => visited.has(n.id)).map((n) => ({
			...structuredClone(n),
			hops: visited.get(n.id)
		})),
		links,
		gaps,
		traversal: {
			maxHops,
			maxNodes,
			maxEdges,
			truncated
		}
	};
}
function genealogyProjection(record) {
	const w = record.content.workflow, state = genealogyStatus(w), selected = state.snapshot, root = w.genealogySelection?.rootLotId || null;
	const graph = selected && root ? traceDeclaredGenealogy(selected, root, selected.knownAt) : {
		nodes: [],
		links: [],
		gaps: [],
		traversal: {
			maxHops: 4,
			maxNodes: 32,
			maxEdges: 64,
			truncated: false
		}
	};
	const f = fixtureCase(w.caseId, w.condition), shifts = [f.current, ...f.shifts], eligibleIds = new Set((f.units || []).filter((u) => {
		const shift = shifts.find((s) => s.id === u.shiftId);
		return shift && shift.knownAt <= (selected?.knownAt || w.asOf) && shift.assetId === w.context.asset && shift.jobId === w.context.job && shift.part === w.context.part && shift.revision === w.context.revision;
	}).map((u) => u.id));
	const disclosed = graph.nodes.flatMap((n) => n.unitIds).filter((id) => eligibleIds.has(id)), uniqueKnownUnitIds = [...new Set(disclosed)].sort();
	return {
		schemaVersion: 1,
		investigationId: record.id,
		investigationVersion: record.version,
		caseId: w.caseId,
		cycleId: w.cycle,
		contextRef: structuredClone(w.context),
		asOf: w.asOf,
		effectiveStatus: state.status,
		currentScopeReviewAllowed: state.current,
		selectedRootLotId: root,
		selectedSnapshot: selected,
		scopeReviews: structuredClone(w.genealogyReviews || []),
		availableSnapshots: records.filter((s) => compatible(w, s) && s.knownAt <= w.asOf && s.decisionEffectiveFrom <= w.asOf && s.decisionEffectiveUntil > w.asOf).map((s) => ({
			id: s.id,
			sourceId: s.sourceId,
			sourceVersion: s.sourceVersion,
			caseId: s.caseId,
			cycleId: s.cycleId,
			contextRef: structuredClone(s.contextRef),
			knownAt: s.knownAt,
			declaredStatus: s.declaredStatus,
			rootLotIds: [...s.rootLotIds]
		})),
		...graph,
		uniqueKnownUnitIds,
		unitReferenceOccurrences: disclosed.length,
		relatedJobIds: [...new Set(graph.nodes.map((n) => n.jobId).filter((x) => !!x))],
		unaffectedLotIds: [],
		scopeComplete: !!selected?.declaredScopeComplete && !graph.gaps.length && !graph.traversal.truncated,
		totalAffectedQuantity: null,
		unmappedQuantity: null,
		quantityCertified: false,
		allProductContained: false,
		actualHoldPerformed: false,
		actualReleasePerformed: false,
		productionConformance: false,
		causalStatus: "unconfirmed",
		financiallyValidated: false,
		synthetic: true,
		reasons: [
			state.reason,
			"Unique known unit IDs count disclosed eligible references, not total exposure. Split/rework repetitions count once; absent identities/quantity are not zero.",
			"Declared links do not certify defect propagation, containment, cause, financial savings or release. Unknown boundaries and historical jobs without exposure remain unranked/unbounded."
		]
	};
}
async function genealogyRequest(repo, q) {
	const reply = (status, data, code) => ({
		requestId: q.requestId,
		apiVersion: API_VERSION,
		status,
		synthetic: true,
		...code ? { error: {
			code,
			message: code,
			retryable: false
		} } : { data }
	});
	const match = q.path.match(/^\/api\/v1\/manufacturing\/genealogy\/([^/]+)$/);
	if (q.method !== "GET" || !match) return reply(404, void 0, "UNKNOWN_ENDPOINT");
	const record = repo.state.resources.find((r) => r.id === decodeURIComponent(match[1]) && r.content.domain === "manufacturing-investigation-v2");
	if (!record) return reply(404, void 0, "NOT_FOUND");
	if (record.assetIds.some((a) => !q.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
	return reply(200, genealogyProjection(record));
}
function recordGenealogyScopeReview(w, c, actor) {
	if (!["manager", "supervisor"].includes(actor)) throw Error("An authorized fictional scope reviewer is required.");
	const status = genealogyStatus(w), selection = w.genealogySelection;
	if (!status.current || !status.snapshot || !selection) throw Error("A current explicitly selected genealogy source/root is required; historical/unassessed trace cannot support current scope review.");
	if (typeof c.ownerName !== "string" || c.ownerName.trim().length < 2 || c.ownerName.length > 120 || ![
		"manager",
		"supervisor",
		"maintenance",
		"safety"
	].includes(String(c.ownerRole))) throw Error("An exact named fictional follow-through owner and role are required.");
	if (typeof c.reason !== "string" || c.reason.trim().length < 10 || c.reason.length > 1e3 || c.acknowledgeUnknownQuantity !== true || c.acknowledgeMissingLinks !== true || c.confirmation !== "REVIEW_SYNTHETIC_GENEALOGY_SCOPE") throw Error("Reason and explicit unknown quantity/link acknowledgments are required.");
	if (typeof c.dueAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(c.dueAt) || !Number.isFinite(Date.parse(c.dueAt)) || new Date(Date.parse(c.dueAt)).toISOString().replace(".000Z", "Z") !== c.dueAt || Date.parse(c.dueAt) <= Date.parse(w.asOf)) throw Error("A later valid UTC due time is required.");
	if ((w.genealogyReviews || []).length >= 20) throw Error("Bounded genealogy scope review history is full.");
	const p = genealogyProjection({
		id: "scope-current",
		version: 0,
		content: { workflow: w }
	});
	const review = {
		id: "GENEALOGY-REVIEW-" + w.caseId + "-C" + w.cycle + "-" + ((w.genealogyReviews || []).length + 1),
		status: "reviewed-open",
		snapshotId: selection.snapshotId,
		rootLotId: selection.rootLotId,
		sourceId: selection.sourceId,
		sourceVersion: selection.sourceVersion,
		caseId: w.caseId,
		cycleId: w.cycle,
		knownAt: selection.knownAt,
		reviewedAt: w.asOf,
		reviewer: actor,
		owner: {
			name: c.ownerName.trim(),
			role: c.ownerRole
		},
		dueAt: c.dueAt,
		reason: c.reason.trim(),
		nodeIds: p.nodes.map((n) => n.id),
		uniqueKnownUnitIds: [...p.uniqueKnownUnitIds],
		unmappedQuantity: null,
		quantityCertified: false,
		unknownQuantityAcknowledged: true,
		missingLinksAcknowledged: true,
		actualHoldPerformed: false,
		actualReleasePerformed: false,
		physicalInterventionPerformed: false,
		causalStatus: "unconfirmed",
		financiallyValidated: false,
		synthetic: true
	};
	w.genealogyReviews = [...w.genealogyReviews || [], review];
}
//#endregion
export { genealogyProjection, genealogyRequest, genealogyStatus, recordGenealogyScopeReview, selectGenealogySnapshot, traceDeclaredGenealogy };
