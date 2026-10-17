import "./model.js";
import { fixtureCase } from "./cases.js";
//#region app/src/investigation/plantPresentation.ts
const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function plantDayLabel(iso) {
	if (!iso) return "";
	const parsed = Date.parse(iso);
	const t = Number.isFinite(parsed) ? parsed : Date.parse(iso.slice(0, 10) + "T00:00:00Z");
	if (!Number.isFinite(t)) return "";
	const d = new Date(t);
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
/** Plant wording for authored phrases that would otherwise read as analyst notes. */
function plantPhrase(text) {
	return text.replace(/unique terminal disposition recorded/gi, "a final disposition was recorded for the part").replace(/a passing final count is not FPY/gi, "final good output and first-pass yield are different measures").replace(/\bPrimary endpoint\b/g, "Main measure").replace(/\bEC-003\b/g, "Engineering change 003");
}
/** Plant wording when a fresh conversation has no selected investigation. */
const NO_INVESTIGATION_YET = "I don't have an investigation selected yet. Tell me what you want to investigate, or run the plant review first.";
function roleName(role) {
	if (!role) return "";
	return role.split(/[-_]/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function suppliedCase(caseId) {
	if (caseId !== "downtime" && caseId !== "speed" && caseId !== "quality") return null;
	return fixtureCase(caseId);
}
function plantMoment(iso) {
	if (!iso) return "";
	const t = Date.parse(iso);
	if (!Number.isFinite(t)) return iso;
	const d = new Date(t);
	let hour = d.getUTCHours();
	const suffix = hour >= 12 ? "PM" : "AM";
	hour = hour % 12 || 12;
	const minute = String(d.getUTCMinutes()).padStart(2, "0");
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}, ${hour}:${minute} ${suffix}`;
}
function endpointName(endpoint) {
	if (endpoint === "jamMin") return "Feeder-jam minutes";
	if (endpoint === "speedLossMin") return "Speed-loss minutes";
	if (endpoint === "fpy") return "First-pass yield";
	return endpoint || "Main measure";
}
function amount(value, digits = 2) {
	if (typeof value !== "number" || !Number.isFinite(value)) return "unavailable";
	return Number(value).toLocaleString("en-US", {
		maximumFractionDigits: digits,
		minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : Math.min(digits, 2)
	});
}
/** Plant sentence after a demo follow-up. No raw clock and no simulation mechanics. */
function demoClockSentence(iso) {
	const day = plantDayLabel(iso);
	const stamp = iso || "";
	return `The demo is now at ${stamp.startsWith("2026-10-06") ? "the completed-repair check" : stamp.startsWith("2026-10-20") ? "the follow-up measurement period" : stamp.startsWith("2026-10-27") ? "the sustainment check" : stamp.startsWith("2026-11-03") ? "the later-shift check" : "the next measurement period"}${day ? ` on ${day}` : ""}. Only evidence known by then is available. Existing investigation history and performed-work records stay as recorded.`;
}
function evidenceSentence(documents, id) {
	for (const doc of documents || []) {
		const text = doc.text || "";
		const line = text.split("\n").find((part) => part.includes(id)) || (doc.id === id ? text.split("\n")[0] : "");
		if (!line) continue;
		const sentence = line.replace(id + ":", "").replace(id, "").trim();
		return sentence.length > 180 ? sentence.slice(0, 177) + "…" : sentence;
	}
	return "";
}
/** Why a hypothesis is plausible, using only authored support and the current controlled record. */
function plausibleLine(caseId, supportingIds) {
	const fixture = suppliedCase(caseId);
	if (!fixture) return "The current evidence does not yet establish why this is plausible.";
	const reasons = /* @__PURE__ */ new Map();
	for (const shift of [fixture.current, ...fixture.shifts]) {
		const evidence = shift.reasonEvidence;
		if (evidence?.id && evidence.text) reasons.set(evidence.id, evidence.text.trim());
	}
	const parts = [];
	let usedReason = false;
	for (const id of supportingIds || []) {
		const reason = reasons.get(id);
		if (reason) {
			usedReason = true;
			if (!parts.includes(reason)) parts.push(reason);
			continue;
		}
		const sentence = evidenceSentence(fixture.documents, id);
		if (sentence && !parts.includes(sentence)) parts.push(sentence);
	}
	if (usedReason) {
		const sentence = (fixture.documents.find((doc) => doc.controlled && doc.status === "approved" && doc.kind === "SW")?.text || "").split("\n").map((line) => line.trim()).filter(Boolean)[0] || "";
		const clipped = sentence.length > 180 ? sentence.slice(0, 177) + "…" : sentence;
		if (clipped && !parts.some((part) => part.includes(clipped.slice(0, 40)))) parts.push(`Current controlled record: ${clipped.replace(/\.+$/, "")}.`);
	}
	return plantPhrase(parts.length ? parts.join(" ") : "The current evidence does not yet establish why this is plausible.");
}
function spokenUnit(unit) {
	return (unit || "").replace(/^min\b/, "minutes").trim();
}
/** A governed number with its unit. Percents stay attached to the number. */
function measureAmount(value, unit, digits = 2) {
	const shown = amount(value, digits);
	if (unit?.startsWith("%")) return `${shown}%`;
	return spokenUnit(unit) ? `${shown} ${spokenUnit(unit)}` : shown;
}
function reopenSentence(endpoint, direction, value, unit, count) {
	const name = endpointName(endpoint).replace(/^Main measure$/, "the main measure").toLowerCase();
	const verb = direction === "higher" ? "falls below" : "goes above";
	const times = count === 2 ? "two" : count.toLocaleString("en-US");
	return `Reopen if ${name} ${verb} ${measureAmount(value, unit)} for ${times} consecutive eligible shifts.`;
}
//#endregion
export { NO_INVESTIGATION_YET, demoClockSentence, measureAmount, plantDayLabel, plantMoment, plantPhrase, plausibleLine, reopenSentence, roleName };
