import { contexts } from "../inputs/metric-oracle/ui-acceptance-fixtures-v1/selectable-contexts.js";
import "../inputs/metric-oracle/ui-acceptance-fixtures-v1/ownership-metadata.js";
//#region app/src/platform/fixtureSelection.ts
function validProvider(value) {
	const p = value;
	return !!p && typeof p === "object" && p.fixtureVersion === "training-ui-acceptance-v1" && p.version === "1.0.0" && Object.hasOwn(contexts, p.contextId);
}
function selectionFromSearch(search) {
	const params = new URLSearchParams(search), contextId = params.get("context");
	const p = {
		fixtureVersion: params.get("fixture"),
		version: "1.0.0",
		contextId
	};
	return validProvider(p) ? p : void 0;
}
const selectedProvider = selectionFromSearch(typeof window === "undefined" ? "" : window.location.search);
function providerFixture(p) {
	return p && p.contextId !== "ownership-all-yours" ? "training-ui-acceptance-v1" : "training-plant-v1";
}
function providerSites(p) {
	return providerFixture(p) === "training-ui-acceptance-v1" ? ["UIA-S1"] : ["TP-S1", "TP-S2"];
}
//#endregion
export { providerFixture, providerSites, selectedProvider, selectionFromSearch, validProvider };
