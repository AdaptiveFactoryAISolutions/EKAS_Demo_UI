import diagnostic_synthetic_v1_default from "../inputs/diagnostic-synthetic-v1.js";
//#region app/src/investigation/diagnosticSource.ts
const diagnosticFixture = diagnostic_synthetic_v1_default;
function diagnosticSource(w) {
	const base = diagnostic_synthetic_v1_default.cases[w.caseId];
	return w.cycle === 2 && w.diagnosticSelection?.snapshotId === base.newCycle.snapshotId && w.diagnosticSelection.cycleId === w.cycle ? base.newCycle : base;
}
function diagnosticClock(w) {
	return w.diagnosticSelection?.cycleId === w.cycle ? w.diagnosticSelection.asOf : w.asOf;
}
function diagnosticSourceCutoff(w) {
	const f = diagnosticSource(w);
	return w.cycle === 1 && w.asOf >= "2026-10-06T15:15:00Z" ? f.laterSourceCutoff : f.sourceCutoff;
}
function selectDiagnosticSnapshot(w, command) {
	const f = diagnostic_synthetic_v1_default.cases[w.caseId].newCycle;
	if (w.cycle !== 2 || w.asOf !== "2026-11-03T14:00:00Z" || command.snapshotId !== f.snapshotId || command.confirmation !== "SELECT_SYNTHETIC_DIAGNOSTIC_SNAPSHOT") throw Error("Only explicit recurrence-cycle2 diagnostic simulation is supported; original case clock and physical acceptance remain unchanged.");
	w.diagnosticSelection = {
		snapshotId: f.snapshotId,
		cycleId: 2,
		asOf: f.sourceCutoff,
		synthetic: true
	};
}
//#endregion
export { diagnosticClock, diagnosticFixture, diagnosticSource, diagnosticSourceCutoff, selectDiagnosticSnapshot };
