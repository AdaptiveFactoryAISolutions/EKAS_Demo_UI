import { object, validResource, validResult } from "./validation.js";
//#region app/src/platform/mockRepository.ts
var PersistenceFailure = class extends Error {};
function emptyRepository() {
	return {
		schemaVersion: 1,
		seedVersion: "ekas-platform-synthetic-v2",
		sequence: 0,
		resources: [],
		results: [],
		idempotency: {}
	};
}
function validateRepository(value) {
	if (!object(value) || value.schemaVersion !== 1 || value.seedVersion !== "ekas-platform-synthetic-v2" || !Number.isSafeInteger(value.sequence) || Number(value.sequence) < 0 || !Array.isArray(value.resources) || !Array.isArray(value.results) || !object(value.idempotency)) return false;
	const ids = /* @__PURE__ */ new Set();
	const allocation = (id) => {
		const n = id.match(/-(\d+)$/);
		return !!n && Number(n[1]) >= 1 && Number(n[1]) <= Number(value.sequence);
	};
	if (!value.resources.every((r) => validResource(r) && !ids.has(r.id) && !!ids.add(r.id) && allocation(r.id)) || !value.results.every((r) => validResult(r) && !ids.has(r.id) && !!ids.add(r.id) && allocation(r.id))) return false;
	return Object.values(value.idempotency).every((entry) => object(entry) && typeof entry.fingerprint === "string" && entry.fingerprint.length > 0 && entry.fingerprint.length < 1e6 && validResource(entry.result) && allocation(entry.result.id));
}
var MockRepository = class {
	storage;
	ready = Promise.resolve();
	mutations = Promise.resolve();
	exclusive(job) {
		const next = this.mutations.then(job);
		this.mutations = next.catch(() => {});
		return next;
	}
	state = emptyRepository();
	recovery = "clean";
	recoveryExport = null;
	constructor(storage) {
		this.storage = storage;
		if (storage) {
			let raw = null;
			try {
				raw = storage.read();
			} catch {
				this.recovery = "unavailable";
				return;
			}
			if (raw) {
				this.recoveryExport = raw;
				try {
					const value = JSON.parse(raw);
					if (validateRepository(value)) {
						this.state = value;
						this.recovery = "loaded";
					} else this.recovery = "corrupt";
				} catch {
					this.recovery = "corrupt";
				}
			}
		}
	}
	commit(next) {
		if (!validateRepository(next)) throw new Error("INVALID_REPOSITORY");
		if (this.storage) try {
			this.storage.write(JSON.stringify(next));
		} catch (e) {
			throw new PersistenceFailure(e instanceof Error ? e.message : "Local persistence unavailable");
		}
		this.state = next;
	}
	reset() {
		const commit = this.commit(emptyRepository());
		if (commit instanceof Promise) return commit.then(() => {
			this.recovery = "clean";
		});
		this.recovery = "clean";
	}
};
//#endregion
export { MockRepository, PersistenceFailure, emptyRepository, validateRepository };
