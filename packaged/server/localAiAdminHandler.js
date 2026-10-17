import { localAiAdminMessages } from "../admin/localAiAdminMessages.js";
//#region app/src/server/localAiAdminHandler.ts
const same = (body, keys) => !!body && typeof body === "object" && !Array.isArray(body) && Object.keys(body).sort().join(",") === [...keys].sort().join(",");
/** Dedicated sensitive boundary: no generic request/body tracing or secret responses. */
function createLocalAiAdminHandler({ owner, runtime, audit }) {
	return async (request) => {
		const path = new URL(request.url).pathname, reply = (data, status = 200) => Response.json(data, {
			status,
			headers: { "Cache-Control": "no-store" }
		});
		if (path === "/api/v1/admin/owner/login") return owner.login(request);
		let subject = "unauthenticated";
		const record = (outcome) => audit?.({
			operation: path,
			subject,
			revision: runtime.status().revision,
			outcome,
			at: (/* @__PURE__ */ new Date()).toISOString()
		});
		try {
			const principal = owner.authorize(request);
			subject = principal.subject;
			if (principal.scope === "synthetic-rehearsal-ai" && !runtime.status().rehearsalOnly) throw Error("LOCAL_OWNER_REQUIRED");
			if (path === "/api/v1/admin/owner/session" && request.method === "GET") return reply({
				authenticated: true,
				subject,
				csrf: principal.csrf,
				expiresAt: principal.expiresAt
			});
			if (path === "/api/v1/admin/owner/logout" && request.method === "POST") return owner.logout(request);
			if (path === "/api/v1/admin/ai" && request.method === "GET") return reply(runtime.status());
			if (![
				"PUT",
				"POST",
				"DELETE"
			].includes(request.method)) return reply({ error: {
				code: "AI_REQUEST_REFUSED",
				message: localAiAdminMessages.AI_REQUEST_REFUSED
			} }, 404);
			if (request.headers.get("Content-Type")?.split(";")[0] !== "application/json") throw Error("AI_REQUEST_REFUSED");
			const raw = await request.text();
			if (raw.length > 8192) throw Error("AI_REQUEST_REFUSED");
			let body;
			try {
				body = JSON.parse(raw);
			} catch {
				throw Error("AI_REQUEST_REFUSED");
			}
			const header = request.headers.get("If-Match");
			if (!header || !/^\d+$/.test(header) || !Number.isSafeInteger(Number(header))) throw Error("CONFIGURATION_CONFLICT");
			const expected = Number(header);
			let result;
			if (path === "/api/v1/admin/ai/settings" && request.method === "PUT") result = runtime.saveSettings(body, expected);
			else if (path === "/api/v1/admin/ai/credential" && request.method === "PUT") {
				if (!same(body, ["apiKey", "credentialRevision"]) || typeof body.apiKey !== "string" || !Number.isSafeInteger(body.credentialRevision)) throw Error("AI_REQUEST_REFUSED");
				result = runtime.setCredential(body.apiKey, expected, body.credentialRevision);
			} else if (path === "/api/v1/admin/ai/credential" && request.method === "DELETE") {
				if (!same(body, ["credentialRevision", "confirmation"]) || !Number.isSafeInteger(body.credentialRevision)) throw Error("AI_REQUEST_REFUSED");
				result = runtime.removeCredential(expected, body.credentialRevision, body.confirmation);
			} else if (path === "/api/v1/admin/ai/test" && request.method === "POST") {
				if (!same(body, ["operationId", "acceptPotentialCost"]) || typeof body.operationId !== "string" || typeof body.acceptPotentialCost !== "boolean") throw Error("AI_REQUEST_REFUSED");
				result = await runtime.test({
					...body,
					expectedRevision: expected
				}, request.signal);
			} else if (path === "/api/v1/admin/ai/enable" && request.method === "POST") {
				if (!same(body, [])) throw Error("AI_REQUEST_REFUSED");
				result = runtime.enable(expected);
			} else if (path === "/api/v1/admin/ai/disable" && request.method === "POST") {
				if (!same(body, [])) throw Error("AI_REQUEST_REFUSED");
				result = runtime.disable(expected);
			} else throw Error("AI_REQUEST_REFUSED");
			record("success");
			return reply(result);
		} catch (error) {
			const candidate = error instanceof Error ? error.message : "", code = Object.hasOwn(localAiAdminMessages, candidate) ? candidate : "AI_REQUEST_REFUSED", status = code === "LOCAL_OWNER_REQUIRED" ? 401 : /ORIGIN|CSRF/.test(code) ? 403 : code === "CONFIGURATION_CONFLICT" ? 409 : /BUDGET|PRICING|TRANSPORT|BUSY|SAVE_FAILED/.test(code) ? 503 : 422;
			record(code);
			return reply({ error: {
				code,
				message: localAiAdminMessages[code]
			} }, status);
		}
	};
}
//#endregion
export { createLocalAiAdminHandler };
