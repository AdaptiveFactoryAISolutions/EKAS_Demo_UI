import { validConversationResult } from "../investigation/service.js";
import { validProviderDiagnostic } from "./providerDiagnostic.js";
//#region app/src/server/modelOperationStatus.ts
const knownNoCommitCodes = [
	"MODEL_CONTEXT_LIMIT",
	"MODEL_ROUND_LIMIT",
	"PROVIDER_BUSY",
	"PROVIDER_WIRE_INPUT_BOUND_REQUIRED"
];
const reviewFailureCodes = [
	"MODEL_UNAVAILABLE",
	"MODEL_RESPONSE_INCOMPLETE",
	"MODEL_PROTOCOL_ERROR",
	"MODEL_PROTOCOL_LIMIT",
	"MODEL_RATE_LIMIT",
	"MODEL_CANCELLED",
	"DEMO_USAGE_REVIEW_REQUIRED",
	"DEMO_BUDGET_RECOVERY_REQUIRED",
	"DEMO_BUDGET_EXHAUSTED",
	"DEMO_PRICE_REVIEW_REQUIRED",
	"DEMO_LEGACY_USAGE_REVIEW_REQUIRED",
	"ORIGINAL_BUDGET_HISTORY_REQUIRED",
	"UNSUPPORTED_CLAIM",
	"TOOL_REFUSED",
	"INVALID_RECEIPT",
	"INVALID_RESULT",
	"MODEL_OPERATION_FAILED"
];
function safeReviewFailureCode(error) {
	return error instanceof Error && reviewFailureCodes.includes(error.message) ? error.message : "MODEL_OPERATION_FAILED";
}
/** Read-only reconciliation: no generation, reset, refund or automatic retry. */
async function readModelOperationStatus(canonical, operationId, actor, assetIds, assertLease) {
	return canonical.repository.exclusive(async () => {
		await canonical.repository.ready;
		assertLease();
		if (["corrupt", "unavailable"].includes(canonical.repository.recovery)) throw Error("STORAGE_UNAVAILABLE");
		const state = canonical.repository.state, operation = state.resources.find((r) => r.content.domain === "manufacturing-model-operation-v1" && r.content.operationId === operationId && r.content.actor === actor), model = state.idempotency["model:" + actor + ":" + operationId], direct = state.idempotency["manufacturing:" + actor + ":" + operationId];
		if (operation) {
			if (!operation.assetIds.every((id) => assetIds.includes(id))) throw Error("FORBIDDEN");
			if (![
				"STARTED",
				"COMMITTED",
				"FAILED_NO_COMMIT"
			].includes(String(operation.content.status))) throw Error("INVALID_RESULT");
			if (operation.content.status === "COMMITTED") {
				if (!model || !validConversationResult(model.result) || model.result.id !== operation.content.conversationId || !model.result.assetIds.every((id) => assetIds.includes(id))) throw Error("INVALID_RESULT");
				const t = model.result.content.conversation.turns.at(-1);
				if ((t.modelCapture || t.providerInterpretationCapture)?.operationId !== operationId) throw Error("INVALID_RESULT");
				assertLease();
				return {
					schemaVersion: 1,
					synthetic: true,
					operationId,
					conversationId: model.result.id,
					status: "COMMITTED",
					generation: "provider",
					recordVersion: model.result.version
				};
			}
			if (model) throw Error("INVALID_RESULT");
			if (operation.content.status === "FAILED_NO_COMMIT") {
				const n = operation.content.completedProviderRounds;
				if (!knownNoCommitCodes.includes(operation.content.errorCode) || !Number.isInteger(n) || Number(n) < 0 || Number(n) > 4 || !Number.isSafeInteger(operation.content.expectedVersion)) throw Error("INVALID_RESULT");
				assertLease();
				return {
					schemaVersion: 1,
					synthetic: true,
					operationId,
					conversationId: String(operation.content.conversationId),
					status: "FAILED_NO_COMMIT",
					generation: "provider",
					recordVersion: null,
					errorCode: operation.content.errorCode,
					completedProviderRounds: Number(n)
				};
			}
			const failure = operation.content.failureSnapshot;
			if (failure !== void 0 && (!failure || Object.keys(failure).filter((k) => k !== "providerDiagnostic").sort().join(",") !== "at,code,completedProviderRounds,schemaVersion" || failure.providerDiagnostic !== void 0 && !validProviderDiagnostic(failure.providerDiagnostic) || failure.schemaVersion !== 1 || !reviewFailureCodes.includes(failure.code) || typeof failure.at !== "string" || !Number.isFinite(Date.parse(failure.at)) || !Number.isSafeInteger(failure.completedProviderRounds) || failure.completedProviderRounds < 0 || failure.completedProviderRounds > 4)) throw Error("INVALID_RESULT");
			assertLease();
			return {
				schemaVersion: 1,
				synthetic: true,
				operationId,
				conversationId: String(operation.content.conversationId),
				status: "STARTED",
				generation: "provider",
				recordVersion: null,
				...failure ? {
					reviewRequired: true,
					failureCode: failure.code,
					failureAt: failure.at,
					completedProviderRounds: failure.completedProviderRounds,
					retryAllowed: false,
					...failure.providerDiagnostic ? { providerDiagnostic: structuredClone(failure.providerDiagnostic) } : {}
				} : {}
			};
		}
		if (direct && validConversationResult(direct.result)) {
			if (!direct.result.assetIds.every((id) => assetIds.includes(id))) throw Error("FORBIDDEN");
			assertLease();
			return {
				schemaVersion: 1,
				synthetic: true,
				operationId,
				conversationId: direct.result.id,
				status: "COMMITTED",
				generation: "none",
				recordVersion: direct.result.version
			};
		}
		throw Error("OPERATION_NOT_FOUND");
	});
}
//#endregion
export { knownNoCommitCodes, readModelOperationStatus, reviewFailureCodes, safeReviewFailureCode };
