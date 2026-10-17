//#region app/inputs/scenario-temporal-policy.json
var scenario_temporal_policy_default = {
	default_as_of: "2026-10-06T14:45:00Z",
	kind: "synthetic_temporal_policy",
	record_availability: [
		{
			"id": "NOTE-2401",
			"kind": "maintenance_note",
			"known_at": "2026-09-21T10:10:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "NOTE-2402",
			"kind": "maintenance_note",
			"known_at": "2026-09-23T11:00:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "NOTE-2402-COPY",
			"kind": "maintenance_note",
			"known_at": "2026-09-23T14:00:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "NOTE-003",
			"kind": "maintenance_note",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "NOTE-VERIFY-003",
			"kind": "maintenance_note",
			"known_at": "2026-10-20T15:15:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "NOTE-RECUR-003",
			"kind": "maintenance_note",
			"known_at": "2026-11-03T14:15:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "MAINT-WO-2401",
			"kind": "maintenance_work_order_version",
			"known_at": "2026-09-21T10:10:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "MAINT-WO-2402",
			"kind": "maintenance_work_order_version",
			"known_at": "2026-09-23T14:00:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "DEMO-WO-003",
			"kind": "maintenance_work_order_version",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "MAINT-WO-2404",
			"kind": "maintenance_work_order_version",
			"known_at": "2026-10-20T15:15:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "MAINT-WO-2405",
			"kind": "maintenance_work_order_version",
			"known_at": "2026-11-03T14:15:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "MC-01",
			"kind": "extracted_claim",
			"known_at": "2026-09-21T10:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-2401"]
		},
		{
			"id": "MC-02",
			"kind": "extracted_claim",
			"known_at": "2026-09-21T10:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-2401"]
		},
		{
			"id": "MC-03",
			"kind": "extracted_claim",
			"known_at": "2026-09-21T10:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-2401"]
		},
		{
			"id": "MC-04",
			"kind": "extracted_claim",
			"known_at": "2026-09-23T11:00:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-2402"]
		},
		{
			"id": "MC-05",
			"kind": "extracted_claim",
			"known_at": "2026-09-23T11:00:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-2402"]
		},
		{
			"id": "MC-06",
			"kind": "extracted_claim",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-003"]
		},
		{
			"id": "MC-07",
			"kind": "extracted_claim",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-003"]
		},
		{
			"id": "MC-08",
			"kind": "extracted_claim",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-003"]
		},
		{
			"id": "MC-09",
			"kind": "extracted_claim",
			"known_at": "2026-10-20T15:15:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["NOTE-VERIFY-003"]
		},
		{
			"id": "INSPECT-003",
			"kind": "inspection",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "PFMEA-030@FIC-C",
			"kind": "document_revision",
			"known_at": "2026-09-14T12:00:00Z",
			"source_file": "knowledge-fixtures.json",
			"effectivity": {
				"from": "2026-09-15T00:00:00Z",
				"rule": "date_and_scope",
				"timezone": "UTC",
				"to_exclusive": null,
				"unknown_fields": []
			}
		},
		{
			"id": "CP-030@FIC-B",
			"kind": "document_revision",
			"known_at": "2026-09-14T12:00:00Z",
			"source_file": "knowledge-fixtures.json",
			"effectivity": {
				"from": "2026-09-15T00:00:00Z",
				"rule": "date_and_scope",
				"timezone": "UTC",
				"to_exclusive": null,
				"unknown_fields": []
			}
		},
		{
			"id": "SW-030@FIC-D",
			"kind": "document_revision",
			"known_at": "2026-09-14T12:00:00Z",
			"source_file": "knowledge-fixtures.json",
			"effectivity": {
				"from": "2026-09-15T00:00:00Z",
				"rule": "date_and_scope",
				"timezone": "UTC",
				"to_exclusive": null,
				"unknown_fields": []
			}
		},
		{
			"id": "SW-030@FIC-C",
			"kind": "document_revision",
			"known_at": "2026-07-31T12:00:00Z",
			"source_file": "knowledge-fixtures.json",
			"effectivity": {
				"from": "2026-08-01T00:00:00Z",
				"rule": "date_and_scope",
				"timezone": "UTC",
				"to_exclusive": "2026-09-15T00:00:00Z",
				"unknown_fields": []
			}
		},
		{
			"id": "NCR-003@FIC-A",
			"kind": "document_revision",
			"known_at": "2026-10-06T14:35:00Z",
			"source_file": "knowledge-fixtures.json",
			"effectivity": {
				"from": null,
				"record_as_of": "2026-10-06T14:35:00Z",
				"rule": "not_applicable_to_retained_incident_record",
				"timezone": "UTC",
				"to_exclusive": null,
				"unknown_fields": []
			}
		},
		{
			"id": "NOTE-030@FIC-1",
			"kind": "document_revision",
			"known_at": "2026-10-06T14:00:00Z",
			"source_file": "knowledge-fixtures.json",
			"effectivity": {
				"from": null,
				"rule": "date_and_scope",
				"timezone": "UTC",
				"to_exclusive": null,
				"unknown_fields": ["from", "product_revision"]
			}
		},
		{
			"id": "EC-003",
			"kind": "engineering_change",
			"known_at": "2026-10-06T14:35:00Z",
			"source_file": "sme-change-fixture.json"
		},
		{
			"id": "NW-L03-20260921-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-21T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260922-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-22T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260923-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-23T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260924-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-24T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260925-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-25T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260928-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-28T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260929-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-29T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20260930-D",
			"kind": "eligible_shift",
			"known_at": "2026-09-30T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261001-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-01T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261002-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-02T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261007-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-07T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261008-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-08T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261009-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-09T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261012-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-12T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261013-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-13T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261014-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-14T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261015-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-15T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261016-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-16T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261019-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-19T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "NW-L03-20261020-D",
			"kind": "eligible_shift",
			"known_at": "2026-10-20T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-01",
			"kind": "case_event",
			"known_at": "2026-10-06T14:05:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-02",
			"kind": "case_event",
			"known_at": "2026-10-06T14:15:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-03",
			"kind": "case_event",
			"known_at": "2026-10-06T14:30:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-04",
			"kind": "case_event",
			"known_at": "2026-10-06T14:40:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-05",
			"kind": "case_event",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-06",
			"kind": "case_event",
			"known_at": "2026-10-07T06:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-07",
			"kind": "case_event",
			"known_at": "2026-10-20T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-08",
			"kind": "case_event",
			"known_at": "2026-10-20T15:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-09",
			"kind": "case_event",
			"known_at": "2026-10-20T15:15:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-10",
			"kind": "case_event",
			"known_at": "2026-10-27T14:30:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "evt-11",
			"kind": "case_event",
			"known_at": "2026-11-03T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-21",
			"kind": "sustain_observation",
			"known_at": "2026-10-21T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-22",
			"kind": "sustain_observation",
			"known_at": "2026-10-22T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-23",
			"kind": "sustain_observation",
			"known_at": "2026-10-23T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-26",
			"kind": "sustain_observation",
			"known_at": "2026-10-26T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-27",
			"kind": "sustain_observation",
			"known_at": "2026-10-27T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-28",
			"kind": "sustain_observation",
			"known_at": "2026-10-28T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-29",
			"kind": "sustain_observation",
			"known_at": "2026-10-29T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-10-30",
			"kind": "sustain_observation",
			"known_at": "2026-10-30T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-11-02",
			"kind": "sustain_observation",
			"known_at": "2026-11-02T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "sustain-2026-11-03",
			"kind": "sustain_observation",
			"known_at": "2026-11-03T14:00:00Z",
			"source_file": "scenario-fixture.json"
		},
		{
			"id": "CONFLICT-003",
			"kind": "derived_conflict",
			"known_at": "2026-10-06T15:10:00Z",
			"source_file": "maintenance-fixture.json",
			"depends_on": ["MC-04", "MC-06"]
		},
		{
			"id": "PM-REVIEW-003@v1",
			"kind": "pm_review",
			"known_at": "2026-10-06T14:25:00Z",
			"source_file": "maintenance-fixture.json"
		},
		{
			"id": "PM-REVIEW-003@v2",
			"kind": "pm_review",
			"known_at": "2026-10-06T15:15:00Z",
			"source_file": "maintenance-fixture.json"
		}
	],
	rules: [
		"Require record.known_at <= selected as_of; require all source dependencies known as well.",
		"Observed duration/window data requires end <= as_of; an incomplete window remains Measuring.",
		"Guidance requires both known-at and authority/applicability/effectivity; future-approved versions remain not yet effective.",
		"Plans and expected measurements can be shown early only as planned, without future values or completed claims.",
		"Search counts, snippets, ranking, summaries, chart points, case stages, related evidence and exports use the same temporal filter.",
		"Scenario picker announces synthetic later snapshot; local mutations record the scenario clock and do not change source truth."
	],
	schema_version: "1.0",
	snapshots: {
		"future_rule": "Later snapshots are prebuilt simulation states, never current observations at an earlier as-of clock.",
		"initial_as_of": "2026-10-06T14:45:00Z",
		"initial_data_cutoff": "2026-10-06T14:00:00Z",
		"intervention_snapshot_as_of": "2026-10-06T15:15:00Z",
		"operational_accepted_as_of": "2026-10-20T15:15:00Z",
		"reopened_as_of": "2026-11-03T14:20:00Z",
		"sustained_as_of": "2026-10-27T14:30:00Z",
		"verification_pending_review_as_of": "2026-10-20T14:30:00Z"
	},
	source_cutoff: "2026-10-06T14:00:00Z",
	tests: [
		{
			"as_of": "2026-10-06T14:45:00Z",
			"id": "TIME-01",
			"must_exclude": [
				"DEMO-WO-003",
				"NOTE-003",
				"INSPECT-003",
				"MC-06",
				"MC-07",
				"MC-08",
				"NOTE-VERIFY-003",
				"NOTE-RECUR-003",
				"CONFLICT-003",
				"PM-REVIEW-003@v2"
			],
			"must_include": [
				"NOTE-2401",
				"NOTE-2402",
				"NCR-003@FIC-A",
				"EC-003",
				"PM-REVIEW-003@v1"
			]
		},
		{
			"as_of": "2026-10-06T15:15:00Z",
			"id": "TIME-02",
			"must_exclude": ["NOTE-VERIFY-003", "NOTE-RECUR-003"],
			"must_include": [
				"DEMO-WO-003",
				"NOTE-003",
				"INSPECT-003",
				"MC-06"
			]
		},
		{
			"as_of": "2026-10-20T15:15:00Z",
			"id": "TIME-03",
			"must_exclude": ["NOTE-RECUR-003"],
			"must_include": ["NOTE-VERIFY-003"]
		},
		{
			"as_of": "2026-11-03T14:20:00Z",
			"id": "TIME-04",
			"must_exclude": [],
			"must_include": ["NOTE-RECUR-003"]
		}
	]
};
//#endregion
export { scenario_temporal_policy_default as default };
