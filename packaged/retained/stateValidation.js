import { validProvider } from "../platform/fixtureSelection.js";
import { COLUMNS, validQueryFormula, validQueryOrder } from "../platform/workspaceQuery.js";
import "./model.js";
import "./boardSchedule.js";
//#region app/src/retained/stateValidation.ts
const object = (x) => !!x && typeof x === "object" && !Array.isArray(x);
const strings = (x) => Array.isArray(x) && x.every((v) => typeof v === "string");
function validWorkspaceQuery(value) {
	if (!object(value) || value.provider !== void 0 && !validProvider(value.provider) || typeof value.title !== "string" || !strings(value.columns) || ![
		"column",
		"bar",
		"line",
		"area",
		"pie",
		"table",
		"headline",
		"pivot",
		"waterfall"
	].includes(String(value.chart)) || ![
		"month",
		"quarter",
		"year",
		"week"
	].includes(String(value.bucket)) || typeof value.compare !== "boolean" || typeof value.labels !== "boolean" || !Number.isInteger(value.decimals) || Number(value.decimals) < 0 || Number(value.decimals) > 6 || !Array.isArray(value.filters)) return false;
	if (value.formulaSnapshot !== void 0 && value.formulaSnapshot !== null && !validQueryFormula(value.formulaSnapshot, typeof value.formulaId === "string" ? value.formulaId : void 0)) return false;
	if (value.excludedScopes !== void 0 && (!Array.isArray(value.excludedScopes) || value.excludedScopes.length > 100 || value.excludedScopes.some((scope) => !object(scope) || !object(scope.dimensions) || !Object.keys(scope.dimensions).length || ![
		"month",
		"quarter",
		"year",
		"week"
	].includes(String(scope.bucket)) || Object.entries(scope.dimensions).some(([key, v]) => !COLUMNS.some((c) => c.id === key && c.kind !== "measure") || typeof v !== "string" || !v || v.length > 200)))) return false;
	const columns = value.columns;
	if (columns.some((id) => !COLUMNS.some((c) => c.id === id) && !id.startsWith("fx:"))) return false;
	if (!validQueryOrder({
		columns,
		orderBy: value.orderBy
	})) return false;
	return value.filters.every((f) => object(f) && COLUMNS.some((c) => c.id === f.col) && ["in", "not"].includes(String(f.op)) && strings(f.values));
}
//#endregion
export { validWorkspaceQuery };
