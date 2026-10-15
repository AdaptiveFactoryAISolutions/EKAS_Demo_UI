import fixture from '../../inputs/diagnostic-synthetic-v1.json';import type {Workflow} from './workflow';
export const diagnosticFixture=fixture;
export function diagnosticSource(w:Workflow){const base=fixture.cases[w.caseId];return w.cycle===2&&w.diagnosticSelection?.snapshotId===base.newCycle.snapshotId&&w.diagnosticSelection.cycleId===w.cycle?base.newCycle:base;}
export function diagnosticClock(w:Workflow){return w.diagnosticSelection?.cycleId===w.cycle?w.diagnosticSelection.asOf:w.asOf;}
export function diagnosticSourceCutoff(w:Workflow){const f=diagnosticSource(w);return w.cycle===1&&w.asOf>='2026-10-06T15:15:00Z'?f.laterSourceCutoff:f.sourceCutoff;}
export function selectDiagnosticSnapshot(w:Workflow,command:any){const f=fixture.cases[w.caseId].newCycle;if(w.cycle!==2||w.asOf!=='2026-11-03T14:00:00Z'||command.snapshotId!==f.snapshotId||command.confirmation!=='SELECT_SYNTHETIC_DIAGNOSTIC_SNAPSHOT')throw Error('Only explicit recurrence-cycle2 diagnostic simulation is supported; original case clock and physical acceptance remain unchanged.');w.diagnosticSelection={snapshotId:f.snapshotId,cycleId:2,asOf:f.sourceCutoff,synthetic:true};}
