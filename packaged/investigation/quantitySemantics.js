//#region app/src/investigation/quantitySemantics.ts
const absoluteDifferenceUnit = (metricUnit) => metricUnit === "%" ? "percentage points" : metricUnit;
const absoluteDifference = (value, metricUnit) => ({
	kind: "absolute_difference",
	value,
	unit: absoluteDifferenceUnit(metricUnit),
	metricUnit
});
//#endregion
export { absoluteDifference, absoluteDifferenceUnit };
