//#region app/src/server/syntheticSession.ts
const roles = [
	"manager",
	"supervisor",
	"maintenance",
	"safety",
	"viewer"
];
const validId = (id) => /^[A-Za-z0-9-]{1,128}$/.test(id);
/** Explicit role-play authority for synthetic previews only. This is not login,
* production authentication, or a grant to any real backend. */
function createSyntheticSessionAuthority({ assetIds, defaultRole, nextId, store, cookieName = "ekas-demo-session" }) {
	if (!/^[A-Za-z0-9-]{1,80}$/.test(cookieName)) throw Error("INVALID_SYNTHETIC_COOKIE_NAME");
	if (!roles.includes(defaultRole) || !Array.isArray(assetIds) || assetIds.some((x) => typeof x !== "string" || !x)) throw Error("INVALID_SYNTHETIC_SESSION_CONFIG");
	assetIds = [...new Set(assetIds)];
	let sessions = /* @__PURE__ */ new Map(), poisoned = false;
	const state = (values) => ({
		schemaVersion: 1,
		assetIds,
		defaultRole,
		sessions: Object.fromEntries(values)
	});
	if (store) try {
		const raw = store.read();
		if (raw !== null) {
			const s = JSON.parse(raw);
			if (!s || Object.keys(s).sort().join(",") !== "assetIds,defaultRole,schemaVersion,sessions" || s.schemaVersion !== 1 || JSON.stringify(s.assetIds) !== JSON.stringify(assetIds) || s.defaultRole !== defaultRole || !s.sessions || typeof s.sessions !== "object" || Array.isArray(s.sessions) || Object.entries(s.sessions).some(([id, value]) => {
				const v = value;
				return !validId(id) || !v || Object.keys(v).sort().join(",") !== "identity,role,version" || !roles.includes(v.role) || !Number.isSafeInteger(v.version) || v.version < 1 || !Number.isSafeInteger(v.identity) || v.identity < 1;
			})) throw Error();
			sessions = new Map(Object.entries(s.sessions));
			if (new Set([...sessions.values()].map((v) => v.identity)).size !== sessions.size) throw Error();
		}
	} catch {
		throw Error("SYNTHETIC_SESSION_RECOVERY_REQUIRED");
	}
	const persist = (next) => {
		if (poisoned) throw Error("SYNTHETIC_SESSION_RECOVERY_REQUIRED");
		try {
			store?.write(JSON.stringify(state(next)));
			sessions = next;
		} catch {
			poisoned = true;
			throw Error("SYNTHETIC_SESSION_RECOVERY_REQUIRED");
		}
	};
	const id = (request) => request.headers.get("Cookie")?.match(new RegExp("(?:^|;\\s*)" + cookieName + "=([A-Za-z0-9-]{1,128})(?:;|$)"))?.[1];
	const principal = (request) => {
		if (poisoned) return null;
		const s = sessions.get(id(request) || "");
		if (!s || request.headers.get("X-EKAS-Synthetic-Role") !== s.role) return null;
		return {
			actor: s.role,
			assetIds: [...assetIds],
			policyRevision: "synthetic-role-v1:" + s.identity + ":" + s.version + ":" + s.role,
			synthetic: true
		};
	};
	const reply = (s, headers) => Response.json({
		schemaVersion: 1,
		synthetic: true,
		role: s.role,
		policyRevision: "synthetic-role-v1:" + s.identity + ":" + s.version + ":" + s.role
	}, { headers: {
		"Cache-Control": "no-store",
		...headers
	} });
	return {
		principal,
		async handle(request) {
			if (poisoned) return new Response("Synthetic session recovery required.", { status: 503 });
			if (new URL(request.url).pathname !== "/api/v1/demo/session") return new Response("Not found", { status: 404 });
			const key = id(request), current = key ? sessions.get(key) : void 0;
			if (request.method === "GET") {
				if (key && !current) return new Response("Synthetic session restart requires explicit reload.", { status: 403 });
				if (current) return reply(current);
				const created = nextId();
				if (!validId(created) || sessions.has(created)) throw Error("INVALID_SYNTHETIC_SESSION_ID");
				const identity = [...sessions.values()].reduce((max, s) => Math.max(max, s.identity), 0) + 1;
				if (!Number.isSafeInteger(identity)) throw Error("SYNTHETIC_SESSION_RECOVERY_REQUIRED");
				const s = {
					role: defaultRole,
					version: 1,
					identity
				}, next = new Map(sessions);
				next.set(created, s);
				persist(next);
				return reply(s, { "Set-Cookie": cookieName + "=" + created + "; HttpOnly; SameSite=Strict; Path=/" });
			}
			if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
			if (!current) return new Response("Synthetic session required.", { status: 403 });
			const origin = request.headers.get("Origin");
			if (origin && origin !== new URL(request.url).origin) return new Response("Same-origin role simulation required.", { status: 403 });
			let body;
			try {
				const text = await request.text();
				if (text.length > 1024) throw Error();
				body = JSON.parse(text);
			} catch {
				return new Response("Invalid role selection.", { status: 400 });
			}
			if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length !== 1 || !roles.includes(body.role)) return new Response("Invalid role selection.", { status: 400 });
			let selected = current;
			if (current.role !== body.role) {
				selected = {
					role: body.role,
					version: current.version + 1,
					identity: current.identity
				};
				const next = new Map(sessions);
				next.set(key, selected);
				persist(next);
			}
			return reply(selected);
		}
	};
}
//#endregion
export { createSyntheticSessionAuthority };
