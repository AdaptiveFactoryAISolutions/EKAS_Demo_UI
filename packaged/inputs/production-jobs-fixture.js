//#region app/inputs/production-jobs-fixture.json
var production_jobs_fixture_default = {
	schema_version: "1.0",
	dataset_id: "northworks-current-jobs-v1",
	kind: "synthetic",
	as_of: "2026-10-06T14:00:00Z",
	notice: "Three fictional production jobs, each covering one line's complete frozen day shift; totals reconcile to scenario-fixture.json. Historical maintenance-note job links do not imply job-level exposure.",
	scope: {
		"site_id": "northworks",
		"area_id": "assembly",
		"product_id": "NW-A",
		"product_revision": "P2",
		"operation_id": "OP-030",
		"timezone": "UTC"
	},
	jobs: [
		{
			"job_id": "JOB-8401",
			"record_version": 1,
			"line_id": "line-01",
			"asset_id": "FEED-01",
			"product_id": "NW-A",
			"product_revision": "P2",
			"operation_id": "OP-030",
			"start": "2026-10-06T06:00:00Z",
			"end": "2026-10-06T14:00:00Z",
			"planned_min": 480,
			"down_min": 48,
			"run_min": 432,
			"total_units": 810,
			"good_units": 794,
			"plan_good_units": 768,
			"ideal_cycle_min": .5,
			"coverage": 1,
			"eligible": true,
			"exposure_source": "DEMO-MES-JOB-8401-v1",
			"maintenance_wo_ids": [],
			"event_detail": "aggregate fixture only"
		},
		{
			"job_id": "JOB-8402",
			"record_version": 1,
			"line_id": "line-02",
			"asset_id": "FEED-02",
			"product_id": "NW-A",
			"product_revision": "P2",
			"operation_id": "OP-030",
			"start": "2026-10-06T06:00:00Z",
			"end": "2026-10-06T14:00:00Z",
			"planned_min": 480,
			"down_min": 72,
			"run_min": 408,
			"total_units": 744,
			"good_units": 730,
			"plan_good_units": 768,
			"ideal_cycle_min": .5,
			"coverage": 1,
			"eligible": true,
			"exposure_source": "DEMO-MES-JOB-8402-v1",
			"maintenance_wo_ids": [],
			"event_detail": "aggregate fixture only"
		},
		{
			"job_id": "JOB-8303",
			"record_version": 1,
			"line_id": "line-03",
			"asset_id": "FEED-03",
			"product_id": "NW-A",
			"product_revision": "P2",
			"operation_id": "OP-030",
			"start": "2026-10-06T06:00:00Z",
			"end": "2026-10-06T14:00:00Z",
			"planned_min": 480,
			"down_min": 120,
			"run_min": 360,
			"total_units": 648,
			"good_units": 630,
			"plan_good_units": 768,
			"ideal_cycle_min": .5,
			"coverage": 1,
			"eligible": true,
			"exposure_source": "DEMO-MES-JOB-8303-v1",
			"maintenance_wo_ids": ["DEMO-WO-003"],
			"event_ids": [
				"stop-01",
				"stop-02",
				"stop-03",
				"stop-04",
				"stop-05",
				"stop-06",
				"stop-07",
				"stop-08",
				"stop-09",
				"stop-10",
				"stop-11",
				"stop-12"
			]
		}
	],
	historical_insufficient_exposure: [{
		"job_id": "JOB-8301",
		"date": "2026-09-21",
		"source": "maintenance-fixture.json",
		"job_exposure_status": "missing",
		"shift_exposure_is_not_job_exposure": true,
		"rate_rank_eligible": false
	}, {
		"job_id": "JOB-8302",
		"date": "2026-09-23",
		"source": "maintenance-fixture.json",
		"job_exposure_status": "missing",
		"shift_exposure_is_not_job_exposure": true,
		"rate_rank_eligible": false
	}],
	ranking_contract: {
		"default_criterion": "downtime_burden",
		"label": "Downtime minutes per 100 planned asset-minutes",
		"formula": "100 * down_min / planned_min",
		"order": "descending",
		"expected_order": [
			"JOB-8303",
			"JOB-8402",
			"JOB-8401"
		],
		"expected_values": [
			25,
			15,
			10
		],
		"alternative_criterion": "production_gap_good_units = good_units - plan_good_units",
		"expected_gap_by_job": {
			"JOB-8303": -138,
			"JOB-8402": -38,
			"JOB-8401": 26
		},
		"caveat": "This is observed downtime burden and plan gap in one matched shift, not failure probability, root cause, or long-run job risk. Missing historical exposure remains unranked."
	},
	acceptance: [
		"Query problem jobs for part NW-A revision P2 at OP-030 on 06 Oct; show all three jobs with source exposure and explicit ranking criterion.",
		"Sort downtime burden descending; JOB-8303=25, JOB-8402=15, JOB-8401=10; sum raw job fields matches the three-line plant fixture.",
		"Open JOB-8303; preserve part/revision/operation/job/line/time/snapshot and show its twelve nonoverlapping stop events plus distinct maintenance WO DEMO-WO-003.",
		"Switch to historical jobs; JOB-8301/8302 remain not rankable by rate. Their related shift exposure cannot be silently allocated to jobs.",
		"Changing product revision to unknown produces applicability clarification rather than including all revisions silently."
	]
};
//#endregion
export { production_jobs_fixture_default as default };
