import { closeSync, fsyncSync, mkdirSync, openSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { dirname, resolve, sep } from "node:path";
//#region app/src/server/demoRuntime.mjs
function ownedFileStorage(path) {
	let poisoned = false;
	return {
		read() {
			if (poisoned) throw Error("STORAGE_UNAVAILABLE");
			try {
				return readFileSync(path, "utf8");
			} catch (e) {
				if (e.code === "ENOENT") return null;
				throw e;
			}
		},
		write(value) {
			if (poisoned) throw Error("STORAGE_UNAVAILABLE");
			mkdirSync(dirname(path), { recursive: true });
			const tmp = path + "." + randomUUID() + ".tmp";
			let renamed = false;
			try {
				const fd = openSync(tmp, "wx", 384);
				try {
					writeFileSync(fd, value, "utf8");
					fsyncSync(fd);
				} finally {
					closeSync(fd);
				}
				renameSync(tmp, path);
				renamed = true;
				const directory = openSync(dirname(path), "r");
				try {
					fsyncSync(directory);
				} finally {
					closeSync(directory);
				}
			} catch {
				poisoned = true;
				if (!renamed) try {
					unlinkSync(tmp);
				} catch {}
				throw Error("STORAGE_UNAVAILABLE");
			}
		}
	};
}
function staticApplicationHandler(application, directory, bootstrap) {
	const base = resolve(directory);
	return async (request) => {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) return application(request);
		if (request.method !== "GET") return new Response("Not found", { status: 404 });
		const path = resolve(base, "." + (url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname)));
		if (!path.startsWith(base + sep)) return new Response("Not found", { status: 404 });
		try {
			let data = readFileSync(path);
			const ext = path.split(".").pop(), types = {
				html: "text/html",
				js: "text/javascript",
				css: "text/css",
				svg: "image/svg+xml",
				json: "application/json",
				woff2: "font/woff2",
				png: "image/png"
			};
			if (ext === "html") data = Buffer.from(data.toString().replace("<head>", "<head><script>window.__EKAS_APPLICATION__=" + JSON.stringify(typeof bootstrap === "function" ? bootstrap() : bootstrap).replaceAll("<", "\\u003c") + ";<\/script>"));
			return new Response(data, { headers: { "Content-Type": types[ext] || "application/octet-stream" } });
		} catch {
			return new Response("Not found", { status: 404 });
		}
	};
}
function syntheticSessionId() {
	return randomUUID();
}
function syntheticSessionCookieName(path) {
	return "ekas-demo-" + createHash("sha256").update(resolve(path)).digest("hex").slice(0, 16) + "-session";
}
/** Creates a fresh private owner bootstrap code; never a provider credential. */
function writePrivateLocalOwnerCode(path) {
	const code = randomBytes(32).toString("base64url");
	ownedFileStorage(path).write(code);
	return code;
}
/** One local process owns this synthetic profile and its non-refundable journal. */
function acquireLocalDemoProfile(statePath) {
	mkdirSync(dirname(statePath), {
		recursive: true,
		mode: 448
	});
	const lock = statePath + ".local-owner.lock";
	let fd;
	try {
		fd = openSync(lock, "wx", 384);
	} catch {
		throw Error("LOCAL_PROFILE_ALREADY_OPEN");
	}
	try {
		writeFileSync(fd, JSON.stringify({
			pid: process.pid,
			profile: resolve(statePath),
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		}));
		fsyncSync(fd);
	} catch {
		closeSync(fd);
		try {
			unlinkSync(lock);
		} catch {}
		throw Error("LOCAL_PROFILE_LOCK_FAILED");
	}
	let closed = false;
	return () => {
		if (closed) return;
		closed = true;
		closeSync(fd);
		unlinkSync(lock);
	};
}
function assertLocalDemoPaths({ directory, statePath, ownerCodePath }) {
	const base = resolve(directory), state = resolve(statePath), code = resolve(ownerCodePath), inside = (p) => p === base || p.startsWith(base + sep);
	if (inside(state) || inside(code) || code === state || [
		".roles.json",
		".ai-settings.json",
		".ai-audit.json",
		".ai-budget.json",
		".mock-budget.json",
		".local-owner.lock"
	].some((suffix) => code === state + suffix)) throw Error("PRIVATE_PROFILE_PATH_REQUIRED");
}
/** A normal budget journal, not a signing sidecar. Its canonical source binding
* remains shared when the editable demo's synthetic workspace/profile moves. */
function canonicalLocalBudgetJournalPath(originalPath) {
	return realpathSync(originalPath) + ".ekas-local-cumulative.json";
}
function assertOriginalBudgetIsolation(options, originalPath) {
	const source = realpathSync(originalPath), journal = canonicalLocalBudgetJournalPath(source), state = resolve(options.statePath);
	if ([
		state,
		resolve(options.ownerCodePath),
		...[
			".roles.json",
			".ai-settings.json",
			".ai-audit.json",
			".ai-budget.json",
			".mock-budget.json",
			".local-owner.lock"
		].map((s) => state + s)
	].some((p) => p === source || p === journal)) throw Error("ORIGINAL_HISTORY_MUST_REMAIN_READ_ONLY");
	assertLocalDemoPaths({
		...options,
		statePath: journal
	});
	return journal;
}
function assertOriginalBudgetUnchanged(path, expected) {
	if (readFileSync(path, "utf8") !== expected) throw Error("ORIGINAL_BUDGET_HISTORY_CHANGED");
}
//#endregion
export { acquireLocalDemoProfile, assertLocalDemoPaths, assertOriginalBudgetIsolation, assertOriginalBudgetUnchanged, canonicalLocalBudgetJournalPath, ownedFileStorage, staticApplicationHandler, syntheticSessionCookieName, syntheticSessionId, writePrivateLocalOwnerCode };
