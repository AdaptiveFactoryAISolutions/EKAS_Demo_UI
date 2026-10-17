import scenario_fixture_default from "./inputs/scenario-fixture.js";
import "./inputs/sme-change-fixture.js";
//#region app/src/fixtures.ts
const scenario = scenario_fixture_default;
scenario.scenario_policy.initial_as_of, scenario.scenario_policy.intervention_snapshot_as_of, scenario.scenario_policy.verification_pending_review_as_of, scenario.scenario_policy.operational_accepted_as_of, scenario.scenario_policy.sustained_as_of, scenario.scenario_policy.reopened_as_of;
//#endregion
export { scenario };
