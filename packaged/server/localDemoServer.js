import { acquireLocalDemoProfile, assertLocalDemoPaths, assertOriginalBudgetIsolation, assertOriginalBudgetUnchanged, ownedFileStorage, staticApplicationHandler, syntheticSessionCookieName, syntheticSessionId, writePrivateLocalOwnerCode } from "./demoRuntime.js";
import { createLocalDemoBudget } from "./localDemoBudget.js";
import { recoverConservativeBudgetFile } from "./conservativeRecoveryFile.js";
import { REHEARSAL_OWNER_CODE } from "../admin/rehearsalIdentity.js";
import { MockRepository } from "../platform/mockRepository.js";
import { createManufacturingClient } from "../investigation/clientPort.js";
import { ManufacturingService, syntheticManufacturingAssets } from "../investigation/service.js";
import { createLocalApplicationHandler } from "./localApplication.js";
import { createLocalAiRuntime } from "./localAiRuntime.js";
import { createLocalOwnerAuthority } from "./localOwnerAuthority.js";
import { createSessionCredentialStore } from "./sessionCredentialStore.js";
import { createSyntheticSessionAuthority } from "./syntheticSession.js";
import { createNodeApplicationListener } from "./nodeListener.js";
import { createLocalMockBudget } from "./localMockBudget.js";
import { createLocalMockResponsesFetch } from "./localMockProvider.js";
//#region app/src/server/localDemoServer.ts
/** New explicit local demo launch. Import is inert; old demo launch/routes stay untouched.
* originalBudgetRaw is an explicit owner handoff, never discovered or read here.
* Missing original history disables paid use; key and enabled state never survive restart. */
async function startLocalAiApplicationDemo(options) {
	if (!Number.isSafeInteger(options.port) || options.port < 1024 || options.port > 65535) throw Error("LOCAL_PORT_REQUIRED");
	if (options.rehearsal && (options.originalBudgetRaw !== void 0 || options.originalBudgetPath !== void 0)) throw Error("REHEARSAL_MUST_NOT_USE_REAL_HISTORY");
	if (options.originalBudgetRaw === void 0 !== (options.originalBudgetPath === void 0)) throw Error("CANONICAL_BUDGET_SOURCE_REQUIRED");
	assertLocalDemoPaths(options);
	const journalPath = options.originalBudgetPath ? assertOriginalBudgetIsolation(options, options.originalBudgetPath) : options.statePath + ".ai-budget.json", releaseProfile = acquireLocalDemoProfile(options.statePath);
	let releaseBudget = () => {};
	const release = () => {
		try {
			releaseBudget();
		} finally {
			releaseProfile();
		}
	};
	try {
		if (options.originalBudgetPath) releaseBudget = acquireLocalDemoProfile(journalPath);
		const origin = "http://127.0.0.1:" + options.port, now = () => /* @__PURE__ */ new Date(), canonical = new ManufacturingService(new MockRepository(ownedFileStorage(options.statePath))), local = createManufacturingClient(canonical);
		let conversation = (await local.listConversations()).find((c) => !c.content.conversation.archived);
		if (!conversation) conversation = await local.createConversation("local-bootstrap");
		const baseBudget = createLocalDemoBudget({
			originalRaw: options.originalBudgetRaw || null,
			store: ownedFileStorage(journalPath),
			now,
			nextId: syntheticSessionId
		}), assertBudgetSource = () => {
			if (options.originalBudgetPath) assertOriginalBudgetUnchanged(options.originalBudgetPath, options.originalBudgetRaw);
		}, budget = {
			...baseBudget,
			status() {
				try {
					assertBudgetSource();
					return baseBudget.status();
				} catch {
					return {
						available: false,
						synthetic: false,
						ceilingMicroUsd: 2e7,
						usableMicroUsd: 18e6,
						remainingMicroUsd: 0,
						confirmedSpendMicroUsd: null,
						inFlightMicroUsd: 0,
						unknownMicroUsd: 0,
						halted: true
					};
				}
			},
			reserve: (input) => {
				assertBudgetSource();
				return baseBudget.reserve(input);
			},
			beforeRequest: (id) => {
				assertBudgetSource();
				return baseBudget.beforeRequest(id);
			}
		};
		const owner = createLocalOwnerAuthority({
			origin,
			bootstrapCode: options.rehearsal ? REHEARSAL_OWNER_CODE : writePrivateLocalOwnerCode(options.ownerCodePath),
			rehearsalOnly: !!options.rehearsal
		}), settingsStore = ownedFileStorage(options.statePath + ".ai-settings.json"), runtime = createLocalAiRuntime({
			rehearsalOnly: !!options.rehearsal,
			credentialStore: createSessionCredentialStore(),
			budget,
			mockBudget: createLocalMockBudget({
				store: ownedFileStorage(options.statePath + ".mock-budget-v2.json"),
				now,
				nextId: syntheticSessionId
			}),
			fetchImpl: options.fetchImpl || fetch,
			mockFetchImpl: createLocalMockResponsesFetch(),
			persistSettings: (value) => settingsStore.write(JSON.stringify(value))
		});
		const saved = settingsStore.read();
		if (saved !== null) {
			let config;
			try {
				config = JSON.parse(saved);
				if (!config || Object.keys(config).sort().join(",") !== "revision,settings" || !Number.isSafeInteger(config.revision) || config.revision < 1) throw Error();
			} catch {
				throw Error("AI_SETTINGS_RECOVERY_REQUIRED");
			}
			runtime.saveSettings(config.settings, 0);
		}
		if (options.rehearsal) {
			runtime.saveSettings({
				mode: "mock",
				model: "gpt-6.1-sol",
				maxOutputTokens: 1200,
				inputByteBound: 6e4
			}, runtime.status().revision);
			runtime.setCredential("DUMMY_LOCAL_WORKING_PREVIEW", runtime.status().revision, 0);
			await runtime.test({
				operationId: "explicit-synthetic-working-preview",
				expectedRevision: runtime.status().revision,
				acceptPotentialCost: true
			});
			runtime.enable(runtime.status().revision);
		}
		const sessions = createSyntheticSessionAuthority({
			assetIds: [...syntheticManufacturingAssets],
			defaultRole: "manager",
			nextId: syntheticSessionId,
			cookieName: syntheticSessionCookieName(options.statePath),
			store: ownedFileStorage(options.statePath + ".roles.json")
		}), auditStore = ownedFileStorage(options.statePath + ".ai-audit.json"), application = createLocalApplicationHandler({
			canonical,
			runtime,
			owner,
			principal: sessions.principal,
			audit: (record) => {
				let records = [];
				const raw = auditStore.read();
				if (raw !== null) {
					const saved = JSON.parse(raw);
					if (saved.schemaVersion !== 1 || !Array.isArray(saved.records)) throw Error("AI_AUDIT_RECOVERY_REQUIRED");
					records = saved.records;
				}
				auditStore.write(JSON.stringify({
					schemaVersion: 1,
					records: [...records, record]
				}));
			}
		}), handler = staticApplicationHandler((request) => new URL(request.url).pathname === "/api/v1/demo/session" ? sessions.handle(request) : application(request), options.directory, () => ({
			version: 1,
			mode: runtime.status().effectiveMode === "openai" ? "server-openai" : runtime.status().effectiveMode === "mock" ? "server-openai-mock" : "server-disabled",
			synthetic: true,
			conversationId: conversation.id,
			localAdmin: true,
			...options.rehearsal ? { localAdminRehearsal: true } : {}
		})), server = createNodeApplicationListener({ handler });
		server.once("close", release);
		await new Promise((resolve, reject) => {
			server.once("error", reject);
			server.listen(options.port, "127.0.0.1", resolve);
		});
		return server;
	} catch (e) {
		release();
		throw e;
	}
}
//#endregion
export { recoverConservativeBudgetFile, startLocalAiApplicationDemo };
