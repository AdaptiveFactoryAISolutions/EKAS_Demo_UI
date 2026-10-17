import { createHash } from "node:crypto";
//#region app/src/server/localBudgetHistoryDigest.mjs
const localBudgetHistoryDigest = (raw) => createHash("sha256").update(raw).digest("hex");
//#endregion
export { localBudgetHistoryDigest };
