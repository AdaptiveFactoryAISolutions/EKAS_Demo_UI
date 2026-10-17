import { randomUUID } from "node:crypto";
//#region app/src/server/sessionCredentialStore.mjs
/** Volatile server memory only. Restart loses the credential, never budget history.
* No file/environment/browser storage, encryption-at-rest or memory-erasure claim. */
function createSessionCredentialStore({ beforeReplace } = {}) {
	let key = null, revision = 0, reference = null;
	return {
		status: () => ({
			configured: key !== null,
			revision,
			reference,
			persistence: "server-session-only"
		}),
		replace(candidate, expectedRevision) {
			if (expectedRevision !== revision) throw Error("CONFIGURATION_CONFLICT");
			if (typeof candidate !== "string" || !candidate.trim() || candidate.length > 512 || /[\x00-\x1f\x7f]/.test(candidate)) throw Error("CREDENTIAL_REQUIRED");
			const next = candidate.trim();
			try {
				beforeReplace?.(next);
			} catch {
				throw Error("CREDENTIAL_REPLACEMENT_FAILED");
			}
			const nextReference = randomUUID();
			key = next;
			reference = nextReference;
			revision++;
			return this.status();
		},
		remove(expectedRevision) {
			if (expectedRevision !== revision) throw Error("CONFIGURATION_CONFLICT");
			key = null;
			reference = null;
			revision++;
			return this.status();
		},
		withCredential(use) {
			if (!key) throw Error("CREDENTIAL_REQUIRED");
			return use(key);
		}
	};
}
//#endregion
export { createSessionCredentialStore };
