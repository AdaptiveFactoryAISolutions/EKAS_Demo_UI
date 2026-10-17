import { API_VERSION } from "../platform/contract.js";
import { policy, records } from "../inputs/notification-synthetic-v1.js";
//#region app/src/investigation/notifications.ts
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const compatible = (w, s) => s.caseId === w.caseId && s.cycleId === w.cycle && same(s.contextRef, w.context);
function selectNotificationSnapshot(w, c, actor) {
	if (![
		"manager",
		"supervisor",
		"maintenance"
	].includes(actor)) throw Error("This role cannot select a current attention source.");
	if (typeof c.reason !== "string" || c.reason.trim().length < 10 || c.reason.length > 1e3 || c.confirmation !== "SELECT_SYNTHETIC_NOTIFICATION_SNAPSHOT") throw Error("Reason and explicit synthetic attention-source confirmation required.");
	const s = records.find((x) => x.id === c.snapshotId);
	if (!s || s.sourceVersion !== c.sourceVersion || !compatible(w, s)) throw Error("Exact attention source/context/cycle unavailable; no neighboring source selected.");
	if (s.knownAt > w.asOf || s.decisionEffectiveFrom > w.asOf || s.decisionEffectiveUntil <= w.asOf) throw Error("Attention source is future or historical at this explicit clock.");
	if (w.notificationSelection?.sourceId === s.sourceId && w.notificationSelection.sourceVersion > s.sourceVersion) throw Error("Attention source rollback refused.");
	w.notificationSelection = {
		policyVersion: 1,
		snapshotId: s.id,
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
function notificationStatus(w) {
	const selected = w.notificationSelection, s = selected ? records.find((x) => x.id === selected.snapshotId) : void 0;
	if (!selected) return {
		status: "unassessed",
		current: false,
		snapshot: null,
		reason: "No attention source reviewed. Empty selected metadata is not proof of no real alerts or verified safety delivery."
	};
	if (!s || s.sourceId !== selected.sourceId || s.sourceVersion !== selected.sourceVersion || selected.cycleId !== w.cycle || !compatible(w, s)) return {
		status: "scope-inapplicable",
		current: false,
		snapshot: null,
		reason: "Original attention source belongs to another source/context/cycle; no substitution."
	};
	if (s.knownAt > w.asOf || s.decisionEffectiveFrom > w.asOf) return {
		status: "unavailable",
		current: false,
		snapshot: null,
		reason: "This attention metadata is not known at the selected clock."
	};
	if (s.decisionEffectiveUntil <= w.asOf) return {
		status: "historical",
		current: false,
		snapshot: structuredClone(s),
		reason: "Original notice source retained historically; no current readiness inferred and a newer reviewed source is required for attention mutation."
	};
	return {
		status: s.declaredStatus,
		current: true,
		snapshot: structuredClone(s),
		reason: "Current authored local attention metadata. Read/acknowledgment never resolves an underlying exception or proves actual delivery/safety escalation."
	};
}
function groupNotificationEnvelopes(s) {
	const policy$1 = policy, ids = /* @__PURE__ */ new Set(), all = /* @__PURE__ */ new Map();
	for (const e of s.envelopes) {
		if (ids.has(e.id) || !e.eventIdentity || e.caseId !== s.caseId || e.cycleId !== s.cycleId || e.assetId !== s.contextRef.asset || !same(e.contextRef, s.contextRef) || e.sourceId !== s.sourceId || e.sourceVersion !== s.sourceVersion || e.generation !== s.generation || e.knownAt > s.knownAt || ![
			"critical",
			"escalation",
			"digest"
		].includes(e.priority) || !["failed", "unverified"].includes(e.deliveryStatus)) throw Error("Invalid attention envelope identity/context/generation/known-time/route source; no unsafe grouping or substitute.");
		ids.add(e.id);
		const key = "ATTENTION:" + e.caseId + ":C" + e.cycleId + ":" + e.assetId + ":" + e.eventIdentity;
		all.set(key, [...all.get(key) || [], e]);
	}
	const priority = (p) => p === "critical" ? 0 : p === "escalation" ? 1 : 2;
	const rows = [...all].map(([id, envelopes]) => {
		const members = envelopes.slice(0, policy$1.detailMemberCap).map((e) => structuredClone(e)), e = envelopes[0], rank = [...envelopes].sort((a, b) => priority(a.priority) - priority(b.priority))[0];
		return {
			id,
			eventIdentity: e.eventIdentity,
			caseId: e.caseId,
			cycleId: e.cycleId,
			assetId: e.assetId,
			generation: e.generation,
			sourceId: e.sourceId,
			sourceVersion: e.sourceVersion,
			title: e.title,
			priority: rank.priority,
			whyNotified: e.whyNotified,
			knownAt: e.knownAt,
			deliveryStatus: envelopes.some((e) => e.deliveryStatus === "failed") ? "failed" : "unverified",
			totalMembers: envelopes.length,
			returnedMembers: members.length,
			complete: members.length === envelopes.length,
			members,
			actualDispatched: false,
			actualDeliveryVerified: false,
			safetyEscalationDeliveryVerified: false,
			underlyingResolved: false,
			physicalRecurrenceObserved: false,
			synthetic: true
		};
	}).sort((a, b) => priority(a.priority) - priority(b.priority) || b.totalMembers - a.totalMembers || a.id.localeCompare(b.id));
	const budgetExceeded = s.envelopes.length > policy$1.envelopeBudget || rows.length > policy$1.groupBudget;
	return {
		groups: rows.slice(0, policy$1.groupBudget),
		totalGroups: rows.length,
		totalEnvelopes: s.envelopes.length,
		complete: !budgetExceeded,
		budgetExceeded,
		omittedGroups: Math.max(0, rows.length - policy$1.groupBudget),
		qualification: budgetExceeded ? "Source group/envelope budget exceeded. Omitted metadata is not safe/resolved; current mutation held." : "Declared envelopes/groups within explicit budgets; counts are synthetic metadata, not independent physical alarms."
	};
}
function notificationProjection(r) {
	const w = r.content.workflow, state = notificationStatus(w), s = state.snapshot, grouped = s ? groupNotificationEnvelopes(s) : {
		groups: [],
		totalGroups: 0,
		totalEnvelopes: 0,
		complete: false,
		budgetExceeded: false,
		omittedGroups: 0,
		qualification: "No selected source: physical alert exposure and delivery unknown."
	};
	const journal = structuredClone(w.notificationJournal || []), groups = grouped.groups.map((g) => {
		const current = journal.filter((j) => j.groupId === g.id && j.caseId === w.caseId && j.cycleId === w.cycle && j.generation === g.generation), prior = journal.filter((j) => j.groupId === g.id && j.caseId === w.caseId && j.cycleId === w.cycle && j.generation < g.generation), last = [...current].reverse().find((j) => [
			"snooze",
			"mute",
			"reopen"
		].includes(j.operation)), snoozed = last?.operation === "snooze" && !!last.untilUtc && last.untilUtc > w.asOf, muted = last?.operation === "mute" && g.priority === "digest", acknowledged = current.some((j) => j.operation === "ack"), read = current.some((j) => j.operation === "read"), resurfaced = prior.some((j) => j.operation === "snooze" && j.untilUtc !== null && j.untilUtc <= w.asOf), localState = snoozed ? "snoozed" : muted ? "muted" : last?.operation === "reopen" ? "attention-required" : acknowledged ? "acknowledged" : read ? "read" : "attention-required";
		return {
			...g,
			currentSourceQualified: state.current,
			read,
			acknowledged,
			localState,
			snoozeUntil: last?.operation === "snooze" ? last.untilUtc : null,
			snoozeExpired: last?.operation === "snooze" && !!last.untilUtc && last.untilUtc <= w.asOf,
			resurfaced,
			recurrenceKind: resurfaced ? "notice-policy-resurface" : "none",
			priorJournal: prior,
			currentJournal: current,
			deferredReason: ""
		};
	});
	const core = groups.filter((g) => g.priority !== "digest"), eligibleDigest = groups.filter((g) => g.priority === "digest").filter((g) => !["muted", "snoozed"].includes(g.localState)), limit = Math.max(0, Math.min(policy.digestCap, policy.visibleGroupCap - core.length)), visibleIds = new Set([...core, ...eligibleDigest.slice(0, limit)].map((g) => g.id));
	for (const g of groups) if (!visibleIds.has(g.id)) g.deferredReason = g.localState === "muted" ? "Local digest mute; underlying exception/delivery not resolved." : g.localState === "snoozed" ? "Permitted local digest snooze until " + g.snoozeUntil + "; no resolution or safety delivery inferred." : "Explicit digest/visible-group burden policy; retained in full metadata, not safe/resolved.";
	return {
		schemaVersion: 1,
		investigationId: r.id,
		investigationVersion: r.version,
		caseId: w.caseId,
		cycleId: w.cycle,
		contextRef: structuredClone(w.context),
		asOf: w.asOf,
		effectiveStatus: state.status,
		currentAttentionAllowed: state.current && grouped.complete,
		selectedSnapshot: s,
		groups,
		visibleGroups: groups.filter((g) => visibleIds.has(g.id)),
		deferredGroups: groups.filter((g) => !visibleIds.has(g.id)),
		journal,
		policy: structuredClone(policy),
		knownEnvelopeCount: grouped.totalEnvelopes,
		knownGroupCount: grouped.totalGroups,
		duplicateEnvelopeCount: grouped.totalEnvelopes - grouped.totalGroups,
		sourceComplete: grouped.complete,
		omittedGroups: grouped.omittedGroups,
		overloaded: grouped.totalGroups > policy.overloadThreshold,
		coreExceedsVisibleCap: core.length > policy.visibleGroupCap,
		availableSnapshots: records.filter((x) => compatible(w, x) && x.knownAt <= w.asOf && x.decisionEffectiveFrom <= w.asOf && x.decisionEffectiveUntil > w.asOf).map((x) => ({
			id: x.id,
			sourceId: x.sourceId,
			sourceVersion: x.sourceVersion,
			caseId: x.caseId,
			cycleId: x.cycleId,
			contextRef: structuredClone(x.contextRef),
			knownAt: x.knownAt,
			generation: x.generation,
			declaredStatus: x.declaredStatus
		})),
		actualDispatched: false,
		actualDeliveryVerified: false,
		safetyEscalationDeliveryVerified: false,
		underlyingResolved: false,
		physicalInterventionPerformed: false,
		physicalRecurrenceObserved: false,
		actualPhysicalAlarmCount: null,
		productionConformance: false,
		synthetic: true,
		reasons: [
			state.reason,
			grouped.qualification,
			"Ten duplicate envelopes share one canonical event/case group; envelope/group counts are separate from unknown physical alarm exposure.",
			"Synthetic critical/escalation categories remain visible, cannot mute/snooze and never rely on unverified delivery. Source-declared delivery failure remains visible after read or ack.",
			"Snooze expiry/new generation describes notice policy resurfacing, not a physical failure/feeder-jam recurrence; original manufacturing chronology/observations unchanged."
		]
	};
}
async function notificationRequest(repo, q) {
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
	const match = q.path.match(/^\/api\/v1\/manufacturing\/attention\/([^/]+)$/);
	if (q.method !== "GET" || !match) return reply(404, void 0, "UNKNOWN_ENDPOINT");
	const r = repo.state.resources.find((r) => r.id === decodeURIComponent(match[1]) && r.content.domain === "manufacturing-investigation-v2");
	if (!r) return reply(404, void 0, "NOT_FOUND");
	if (r.assetIds.some((a) => !q.session.allowedAssetIds.includes(a))) return reply(403, void 0, "FORBIDDEN");
	return reply(200, notificationProjection(r));
}
function recordNotificationAttention(w, c, actor) {
	const state = notificationStatus(w), selected = w.notificationSelection;
	if (!state.current || !state.snapshot || !selected) throw Error("Current selected attention source required; historical source cannot support a new attention record.");
	const grouped = groupNotificationEnvelopes(state.snapshot), g = grouped.groups.find((g) => g.id === c.groupId);
	if (!grouped.complete || !g || g.generation !== c.generation || g.sourceVersion !== c.sourceVersion) throw Error("Exact current group/generation/source required within complete policy budget.");
	const op = c.operation;
	if (typeof op !== "string" || ![
		"read",
		"ack",
		"snooze",
		"mute",
		"reopen"
	].includes(op)) throw Error("Valid attention operation required.");
	if (op !== "read" && ![
		"manager",
		"supervisor",
		"maintenance",
		"safety"
	].includes(actor)) throw Error("This role cannot acknowledge attention.");
	if ([
		"snooze",
		"mute",
		"reopen"
	].includes(op) && (![
		"manager",
		"supervisor",
		"maintenance"
	].includes(actor) || g.priority !== "digest")) throw Error("Only permitted digest attention can snooze/mute/reopen; critical/escalation policy remains visible.");
	if (typeof c.reason !== "string" || c.reason.trim().length < 10 || c.reason.length > 1e3 || c.acknowledgeAttentionOnly !== true || c.confirmation !== "RECORD_SYNTHETIC_NOTIFICATION_ATTENTION") throw Error("Reason and explicit local attention-only confirmation required.");
	let untilUtc = null;
	if (op === "snooze") {
		const d = typeof c.untilUtc === "string" ? Date.parse(c.untilUtc) : NaN;
		if (typeof c.untilUtc !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(c.untilUtc) || !Number.isFinite(d) || new Date(d).toISOString().replace(".000Z", "Z") !== c.untilUtc || d <= Date.parse(w.asOf) || d - Date.parse(w.asOf) > policy.snoozeMaxMinutes * 6e4) throw Error("Valid later exact UTC snooze within policy cap required.");
		untilUtc = c.untilUtc;
	} else if (c.untilUtc !== void 0) throw Error("Only snooze accepts an expiry.");
	const prior = w.notificationJournal || [];
	if (prior.length >= 40) throw Error("Bounded local attention journal is full.");
	if (op === "ack" && prior.some((j) => j.groupId === g.id && j.caseId === w.caseId && j.cycleId === w.cycle && j.generation === g.generation && j.operation === "ack")) throw Error("Canonical event generation already acknowledged; recover the original acknowledgement receipt.");
	const row = {
		id: "ATTENTION-JOURNAL-" + w.caseId + "-C" + w.cycle + "-" + (prior.length + 1),
		groupId: g.id,
		eventIdentity: g.eventIdentity,
		generation: g.generation,
		sourceId: g.sourceId,
		sourceVersion: g.sourceVersion,
		snapshotId: selected.snapshotId,
		caseId: w.caseId,
		cycleId: w.cycle,
		knownAt: selected.knownAt,
		at: w.asOf,
		actor,
		operation: op,
		untilUtc,
		reason: c.reason.trim(),
		policyVersion: 1,
		attentionOnlyAcknowledged: true,
		actualDispatched: false,
		actualDeliveryVerified: false,
		underlyingResolved: false,
		physicalInterventionPerformed: false,
		safetyEscalationDeliveryVerified: false,
		synthetic: true
	};
	w.notificationJournal = [...prior, row];
}
//#endregion
export { groupNotificationEnvelopes, notificationProjection, notificationRequest, notificationStatus, recordNotificationAttention, selectNotificationSnapshot };
