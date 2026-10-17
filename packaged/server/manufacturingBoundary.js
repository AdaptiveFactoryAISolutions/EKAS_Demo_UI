import { API_VERSION } from "../platform/contract.js";
import { currentTrainingContext } from "../platform/trainingContext.js";
import { resolveAssetScope } from "../investigation/assetScopeInterpretation.js";
import { canonicalReadonlyReceipt } from "./readonlyReceipts.js";
import { publicationScopeIssue, publicationScopeIssueV11 } from "../investigation/publicationScope.js";
import { createManufacturingClient } from "../investigation/clientPort.js";
import { validConversationResult } from "../investigation/service.js";
import { safeProviderDiagnostic } from "./providerDiagnostic.js";
import { assistantHistoryProjection } from "../investigation/assistantHistoryProjection.js";
import { knownNoCommitCodes, readModelOperationStatus, safeReviewFailureCode } from "./modelOperationStatus.js";
import { loadCanonicalSelection } from "../investigation/canonicalSelection.js";
import { createConversationBoundary } from "./conversationBoundary.js";
//#region app/src/server/manufacturingBoundary.ts
/** Synthetic server boundary delegates every read/control to one canonical service.
* Listener must replace caller session with its injected trusted principal. */
function createManufacturingModelTransport({ canonical, provider, policyRevision }) {
	async function run(request, signal, onProgress) {
		signal?.throwIfAborted();
		const requestPolicy = policyRevision(), assertPolicy = () => {
			signal?.throwIfAborted();
			if (policyRevision() !== requestPolicy) throw Error("POLICY_CHANGED");
		};
		const operationRead = request.path.match(/^\/api\/v1\/manufacturing\/model-operations\/([^/]+)$/);
		if (operationRead && request.method === "GET") {
			const actor = request.session.id.replace(/^manufacturing-/, "");
			if (![
				"manager",
				"maintenance",
				"supervisor",
				"safety",
				"viewer"
			].includes(actor)) throw Error("FORBIDDEN");
			const data = await readModelOperationStatus(canonical, decodeURIComponent(operationRead[1]), actor, request.session.allowedAssetIds, assertPolicy);
			return {
				requestId: request.requestId,
				apiVersion: API_VERSION,
				status: 200,
				synthetic: true,
				data
			};
		}
		const match = request.path.match(/^\/api\/v1\/manufacturing\/conversations\/([^/]+)\/messages$/);
		if (request.method !== "POST" || !match) return canonical.send(request, assertPolicy);
		const actor = request.session.id.replace(/^manufacturing-/, "");
		if (![
			"manager",
			"maintenance",
			"supervisor",
			"safety",
			"viewer"
		].includes(actor)) throw Error("FORBIDDEN");
		const body = request.body;
		if (!body || Object.keys(body).some((k) => !["expectedVersion", "text"].includes(k)) || typeof body.text !== "string" || !Number.isSafeInteger(body.expectedVersion) || !request.idempotencyKey) throw Error("INVALID_REQUEST");
		const id = decodeURIComponent(match[1]), fingerprint = JSON.stringify({
			path: request.path,
			text: body.text,
			expectedVersion: body.expectedVersion
		}), slot = "model:" + actor + ":" + request.idempotencyKey, prior = canonical.repository.state.idempotency[slot];
		if (prior) {
			if (prior.fingerprint !== fingerprint) throw Error("IDEMPOTENCY_CONFLICT");
			if (!validConversationResult(prior.result, id) || prior.result.version !== body.expectedVersion + 1 || !prior.result.assetIds.every((a) => request.session.allowedAssetIds.includes(a))) throw Error("INVALID_RESULT");
			const saved = prior.result.content.conversation.turns.at(-1);
			if ((saved.modelCapture || saved.providerInterpretationCapture).policyRevision !== policyRevision()) throw Error("POLICY_CHANGED");
			return {
				requestId: request.requestId,
				apiVersion: API_VERSION,
				status: 200,
				synthetic: true,
				data: structuredClone(prior.result)
			};
		}
		if (canonical.repository.state.idempotency["manufacturing:" + actor + ":" + request.idempotencyKey]) return canonical.send(request, assertPolicy);
		const client = createManufacturingClient({ send(r) {
			return canonical.send({
				...r,
				session: request.session
			}, assertPolicy);
		} }, actor);
		const admission = await client.readConversation(id);
		if (admission.version !== body.expectedVersion) throw Error("CONTEXT_CONFLICT");
		if (admission.content.conversation.archived) throw Error("CONVERSATION_ARCHIVED");
		const admissionQuestion = provider?.id === "openai" ? body.text.replace(/\bat\s+(?=(?:tomorrow|today|yesterday)[’']s\s+meeting\b)/gi, "during ") : body.text;
		if (provider?.id === "openai" ? resolveAssetScope(admissionQuestion, admission.content.conversation.context).kind === "clarify" || publicationScopeIssueV11(admissionQuestion, admission.content.conversation.context) : publicationScopeIssue(admissionQuestion, admission.content.conversation.context)) return canonical.send(request, assertPolicy);
		if (!provider) throw Error("PROVIDER_DISABLED");
		await canonical.repository.exclusive(async () => {
			await canonical.repository.ready;
			assertPolicy();
			const priorOperation = canonical.repository.state.resources.find((r) => r.content.domain === "manufacturing-model-operation-v1" && r.content.operationId === request.idempotencyKey && r.content.actor === actor);
			if (priorOperation) {
				if (priorOperation.content.fingerprint !== fingerprint) throw Error("IDEMPOTENCY_CONFLICT");
				throw Error(priorOperation.content.status === "FAILED_NO_COMMIT" ? "OPERATION_FAILED_NO_COMMIT" : "OPERATION_RECONCILIATION_REQUIRED");
			}
			const next = structuredClone(canonical.repository.state), at = (/* @__PURE__ */ new Date()).toISOString();
			next.resources.push({
				id: "sync-" + ++next.sequence,
				kind: "sync",
				version: 1,
				content: {
					domain: "manufacturing-model-operation-v1",
					operationId: request.idempotencyKey,
					conversationId: id,
					actor,
					fingerprint,
					status: "STARTED",
					usage: "unknown-until-provider-completion",
					provider: provider.id
				},
				createdAt: at,
				updatedAt: at,
				synthetic: true,
				notDispatched: true,
				notGranted: true,
				ownerSessionId: "manufacturing-demo",
				assetIds: [...admission.assetIds]
			});
			await canonical.repository.commit(next);
		});
		const selection = () => loadCanonicalSelection(client, id);
		const revision = () => JSON.stringify(canonical.repository.state.resources.filter((r) => r.kind !== "conversation" && r.content.domain !== "manufacturing-model-operation-v1").map((r) => [r.id, r.version]));
		let prepared, committed, usedOtherTool = false;
		const startingRevision = revision();
		let completedProviderRounds = 0;
		const boundary = createConversationBoundary({
			provider: {
				id: provider.id,
				finishTurn: (key) => provider.finishTurn?.(key),
				async respond(input) {
					const result = await provider.respond(input);
					completedProviderRounds++;
					return result;
				}
			},
			authority: {
				async snapshot() {
					const c = await client.readConversation(id);
					return {
						conversationId: id,
						version: c.version,
						policyRevision: policyRevision(),
						sourceRevision: revision(),
						synthetic: true,
						history: c.content.conversation.turns.flatMap((t) => [{
							role: "user",
							content: t.question
						}, {
							role: "assistant",
							content: JSON.stringify(assistantHistoryProjection(t))
						}])
					};
				},
				async tool(name, args, snapshot) {
					if (name === "canonical_turn") {
						if (prepared || usedOtherTool || Object.keys(args).length !== 1 || args.question !== body.text) throw Error("TOOL_REFUSED");
						prepared = await canonical.prepareConversationTurn(request, assertPolicy);
						return structuredClone(prepared.receipt);
					}
					if (prepared) throw Error("TOOL_REFUSED");
					usedOtherTool = true;
					const s = await selection(), c = s.conversation.content.conversation, v = s.view, asOf = v?.asOf || c.turns.at(-1)?.asOf || "2026-10-06T14:45:00Z";
					if (name === "context_read" && Object.keys(args).length === 0) return {
						id: "context",
						sourceIds: [id],
						asOf,
						status: "observed",
						facts: [{
							key: "context",
							value: JSON.stringify(c.dataset === "training" ? currentTrainingContext(c) : c.context),
							unit: ""
						}]
					};
					if ((name === "view_propose" || name === "action_draft") && Object.keys(args).length === 0) return canonicalReadonlyReceipt(name === "view_propose" ? "preview:view" : "preview:action", v, c.context, asOf);
					if (name === "evidence_read" && Object.keys(args).length === 0) return canonicalReadonlyReceipt("evidence:documents", v, c.context, asOf);
					if (name === "definition_read" && Object.keys(args).length === 1 && [
						"oee",
						"availability",
						"performance",
						"quality",
						"fpy"
					].includes(String(args.metric))) return canonicalReadonlyReceipt("definition:" + args.metric, v, c.context, asOf);
					if (name === "metric_query" && Object.keys(args).length === 1 && [
						"oee",
						"availability",
						"performance",
						"quality",
						"fpy"
					].includes(String(args.metric))) {
						const metric = String(args.metric), m = v?.selected.metrics[metric], available = !!v && v.eligibility.status === "ready" && typeof m?.value === "number";
						return {
							id: "metric:" + metric,
							sourceIds: available ? v.selected.sourceIds : [],
							asOf,
							status: available ? "observed" : "unavailable",
							facts: available ? [{
								key: metric,
								value: m.value,
								unit: "%"
							}] : []
						};
					}
					throw Error("TOOL_REFUSED");
				},
				async commit(capture, signal) {
					const lease = () => {
						assertPolicy();
						signal?.throwIfAborted();
						if (capture.sourceRevision !== revision() || capture.policyRevision !== policyRevision()) throw Error("CONTEXT_CONFLICT");
					};
					lease();
					if (prepared) {
						committed = await canonical.commitPreparedConversationTurn(prepared, capture, actor, fingerprint, lease);
						return capture;
					}
					const s = await selection(), w = s.view && s.aggregate?.content.domain === "manufacturing-investigation-v2" ? s.aggregate.content.workflow : null;
					committed = await canonical.commitModelTurn(capture, actor, s.view, w, s.view?.asOf || s.conversation.content.conversation.turns.at(-1)?.asOf || "2026-10-06T14:45:00Z", fingerprint, lease);
					return capture;
				}
			}
		});
		try {
			await boundary.turn({
				schemaVersion: 1,
				conversationId: id,
				operationId: request.idempotencyKey,
				expectedVersion: body.expectedVersion,
				text: body.text
			}, signal, onProgress);
		} catch (error) {
			if (error instanceof Error && knownNoCommitCodes.includes(error.message) && !committed) await canonical.repository.exclusive(async () => {
				await canonical.repository.ready;
				assertPolicy();
				if (revision() !== startingRevision) throw Error("CONTEXT_CONFLICT");
				if (canonical.repository.state.resources.find((r) => r.id === id)?.version !== body.expectedVersion || canonical.repository.state.idempotency[slot]) throw Error("CONTEXT_CONFLICT");
				const next = structuredClone(canonical.repository.state), op = next.resources.find((r) => r.content.domain === "manufacturing-model-operation-v1" && r.content.operationId === request.idempotencyKey && r.content.actor === actor);
				if (!op || op.content.status !== "STARTED") throw Error("INVALID_RESULT");
				op.version++;
				op.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
				op.content = {
					...op.content,
					status: "FAILED_NO_COMMIT",
					errorCode: error.message,
					expectedVersion: body.expectedVersion,
					completedProviderRounds,
					usage: "completed-rounds-only"
				};
				await canonical.repository.commit(next);
			});
			else if (!committed && !signal?.aborted && policyRevision() === requestPolicy) try {
				await canonical.repository.exclusive(async () => {
					await canonical.repository.ready;
					assertPolicy();
					if (revision() !== startingRevision) return;
					if (canonical.repository.state.resources.find((r) => r.id === id)?.version !== body.expectedVersion || canonical.repository.state.idempotency[slot]) return;
					const next = structuredClone(canonical.repository.state), op = next.resources.find((r) => r.content.domain === "manufacturing-model-operation-v1" && r.content.operationId === request.idempotencyKey && r.content.actor === actor);
					if (!op || op.content.status !== "STARTED") return;
					const at = (/* @__PURE__ */ new Date()).toISOString();
					op.version++;
					op.updatedAt = at;
					op.content = {
						...op.content,
						failureSnapshot: {
							schemaVersion: 1,
							code: safeReviewFailureCode(error),
							at,
							completedProviderRounds,
							...safeProviderDiagnostic(error) ? { providerDiagnostic: safeProviderDiagnostic(error) } : {}
						}
					};
					await canonical.repository.commit(next);
				});
			} catch {}
			throw error;
		}
		if (!committed) throw Error("INVALID_RESULT");
		return {
			requestId: request.requestId,
			apiVersion: API_VERSION,
			status: 200,
			synthetic: true,
			data: committed
		};
	}
	const pending = /* @__PURE__ */ new Map();
	const dispatch = async (request, signal, onProgress) => {
		if (!request.idempotencyKey || !request.path.endsWith("/messages")) return run(request, signal, onProgress);
		const key = request.session.id + "\0" + request.path + "\0" + request.idempotencyKey, fingerprint = JSON.stringify(request.body), old = pending.get(key);
		if (old) {
			if (old.fingerprint !== fingerprint) throw Error("IDEMPOTENCY_CONFLICT");
			return {
				...await old.promise,
				requestId: request.requestId
			};
		}
		const promise = run(request, signal, onProgress);
		pending.set(key, {
			fingerprint,
			promise
		});
		try {
			return await promise;
		} finally {
			pending.delete(key);
		}
	};
	return {
		send: dispatch,
		sendWithSignal: dispatch
	};
}
//#endregion
export { createManufacturingModelTransport };
