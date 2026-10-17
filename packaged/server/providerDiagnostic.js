import { localBudgetHistoryDigest } from "./localBudgetHistoryDigest.js";
//#region app/src/server/providerDiagnostic.ts
const count = (x) => Number.isSafeInteger(x) && Number(x) >= 0 ? Number(x) : null;
const requestId = (x) => typeof x === "string" && /^req_[a-f0-9]{16,64}$/.test(x) ? x : null;
const responseId = (x) => typeof x === "string" && /^resp_[a-f0-9]{16,128}$/.test(x) ? x : null;
const terminals = [
	"not-streamed",
	"response.completed",
	"response.incomplete",
	"response.failed"
];
function providerDiagnostic(data, httpStatus, maxOutputTokens, reasoningEffort, usageRecorded, metadata) {
	const reason = data?.incomplete_details?.reason, shape = reason === void 0 || reason === null ? "absent" : Array.isArray(reason) ? "array" : typeof reason;
	let fingerprint = null;
	try {
		const raw = JSON.stringify(reason);
		if (raw && raw.length <= 512) fingerprint = localBudgetHistoryDigest(raw);
	} catch {}
	return {
		schemaVersion: 1,
		responseStatus: data ? [
			"completed",
			"incomplete",
			"failed",
			"cancelled"
		].includes(data.status) ? data.status : "unknown" : "not-received",
		incompleteReason: reason === void 0 || reason === null ? "not-provided" : ["max_output_tokens", "content_filter"].includes(reason) ? reason : "other",
		httpStatus,
		outputShape: data ? Array.isArray(data.output) ? "array" : "invalid" : "not-received",
		maxOutputTokens,
		reasoningEffort,
		usageRecorded,
		outputTokens: count(data?.usage?.output_tokens),
		reasoningTokens: count(data?.usage?.output_tokens_details?.reasoning_tokens),
		diagnosticVersion: 2,
		incompleteReasonShape: [
			"absent",
			"string",
			"object",
			"array",
			"number",
			"boolean"
		].includes(shape) ? shape : "object",
		incompleteReasonFingerprint: fingerprint,
		providerRequestId: requestId(metadata?.requestId),
		providerResponseId: responseId(data?.id),
		streamTerminalType: terminals.includes(String(metadata?.streamTerminalType)) ? metadata.streamTerminalType : "not-streamed"
	};
}
function validProviderDiagnostic(x) {
	const required = [
		"httpStatus",
		"incompleteReason",
		"maxOutputTokens",
		"outputShape",
		"outputTokens",
		"reasoningEffort",
		"reasoningTokens",
		"responseStatus",
		"schemaVersion",
		"usageRecorded"
	], extra = [
		"diagnosticVersion",
		"incompleteReasonShape",
		"incompleteReasonFingerprint",
		"providerRequestId",
		"providerResponseId",
		"streamTerminalType"
	];
	return !!x && typeof x === "object" && !Array.isArray(x) && required.every((k) => Object.hasOwn(x, k)) && Object.keys(x).every((k) => required.includes(k) || extra.includes(k)) && x.schemaVersion === 1 && [
		"completed",
		"incomplete",
		"failed",
		"cancelled",
		"unknown",
		"not-received"
	].includes(x.responseStatus) && [
		"max_output_tokens",
		"content_filter",
		"other",
		"not-provided"
	].includes(x.incompleteReason) && (x.httpStatus === null || Number.isSafeInteger(x.httpStatus) && x.httpStatus >= 100 && x.httpStatus <= 599) && [
		"array",
		"invalid",
		"not-received"
	].includes(x.outputShape) && Number.isSafeInteger(x.maxOutputTokens) && x.maxOutputTokens >= 1 && x.maxOutputTokens <= 4096 && ["low", "provider-default"].includes(x.reasoningEffort) && typeof x.usageRecorded === "boolean" && [x.outputTokens, x.reasoningTokens].every((v) => v === null || count(v) === v) && (x.diagnosticVersion === void 0 ? extra.every((k) => !Object.hasOwn(x, k)) : x.diagnosticVersion === 2 && extra.every((k) => Object.hasOwn(x, k)) && [
		"absent",
		"string",
		"object",
		"array",
		"number",
		"boolean"
	].includes(x.incompleteReasonShape) && (x.incompleteReasonFingerprint === null || typeof x.incompleteReasonFingerprint === "string" && /^[a-f0-9]{64}$/.test(x.incompleteReasonFingerprint)) && (x.providerRequestId === null || requestId(x.providerRequestId) === x.providerRequestId) && (x.providerResponseId === null || responseId(x.providerResponseId) === x.providerResponseId) && terminals.includes(x.streamTerminalType));
}
function safeProviderDiagnostic(error) {
	const d = error?.providerDiagnostic;
	return validProviderDiagnostic(d) ? structuredClone(d) : void 0;
}
var ProviderResponseFailure = class extends Error {
	providerDiagnostic;
	constructor(code, providerDiagnostic) {
		super(code);
		this.providerDiagnostic = providerDiagnostic;
	}
};
//#endregion
export { ProviderResponseFailure, providerDiagnostic, safeProviderDiagnostic, validProviderDiagnostic };
