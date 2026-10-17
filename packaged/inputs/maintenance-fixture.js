//#region app/inputs/maintenance-fixture.json
var maintenance_fixture_default = {
	asset_context: {
		"aliases": { "ASSET-L03-FDR01": "FEED-03" },
		"area_id": "assembly",
		"enterprise_id": "demo-enterprise",
		"functional_levels_note": "ISA-95 functional levels 0–4 describe activity categories, not enterprise/site/area/equipment positions.",
		"hierarchy_basis": "ISA-95-style application mapping; site terminology must be validated",
		"maintenance_spare": "SPARE-GUIDE-03",
		"product_part": {
			"display_name": "Housing A",
			"id": "NW-A",
			"revision": "P2"
		},
		"site_id": "northworks",
		"warning": "A manufactured part is not a maintenance spare; a production job is not a maintenance work order.",
		"work_center": {
			"id": "line-03",
			"type": "production_line"
		},
		"work_unit": {
			"id": "FEED-03",
			"type": "equipment_unit"
		}
	},
	case_id: "CASE-003",
	kind: "wholly synthetic design fixture; no CMMS connection or physical instructions",
	production_jobs: [
		{
			"asset_id": "FEED-03",
			"date": "2026-09-21",
			"entity_type": "production_job",
			"exposure_ref": "NW-L03-20260921-D",
			"id": "JOB-8301",
			"operation_id": "OP-030",
			"product_id": "NW-A",
			"product_revision": "P2"
		},
		{
			"asset_id": "FEED-03",
			"date": "2026-09-23",
			"entity_type": "production_job",
			"exposure_ref": "NW-L03-20260923-D",
			"id": "JOB-8302",
			"operation_id": "OP-030",
			"product_id": "NW-A",
			"product_revision": "P2"
		},
		{
			"asset_id": "FEED-03",
			"date": "2026-10-06",
			"entity_type": "production_job",
			"exposure_ref": null,
			"id": "JOB-8303",
			"operation_id": "OP-030",
			"product_id": "NW-A",
			"product_revision": "P2"
		}
	],
	schema_version: "maintenance-demo-v1",
	scope: {
		"area_id": "assembly",
		"asset_id": "FEED-03",
		"line_id": "line-03",
		"operation_id": "OP-030",
		"product_id": "NW-A",
		"product_revision": "P2",
		"site_id": "northworks"
	},
	source_notes: [
		{
			"author_role": "Demo maintenance technician",
			"available_from": "2026-09-21T10:10:00Z",
			"field": "technician_note",
			"id": "NOTE-2401",
			"known_at": "2026-09-21T10:10:00Z",
			"record_version": "FIC-1",
			"recorded_at": "2026-09-21T10:10:00Z",
			"sentences": [
				{
					"id": "NOTE-2401:s1",
					"ordinal": 1,
					"text": "Feeder stopped with housings backed up at the guide during JOB-8301."
				},
				{
					"id": "NOTE-2401:s2",
					"ordinal": 2,
					"text": "Guide wear may be contributing; no dimensional inspection was completed."
				},
				{
					"id": "NOTE-2401:s3",
					"ordinal": 3,
					"text": "No motor fault was observed on the available alarm display."
				},
				{
					"id": "NOTE-2401:s4",
					"ordinal": 4,
					"text": "Production resumed after the approved recovery procedure; cause remains unconfirmed."
				}
			],
			"synthetic": true,
			"text": "Feeder stopped with housings backed up at the guide during JOB-8301. Guide wear may be contributing; no dimensional inspection was completed. No motor fault was observed on the available alarm display. Production resumed after the approved recovery procedure; cause remains unconfirmed.",
			"work_order_id": "MAINT-WO-2401"
		},
		{
			"author_role": "Demo maintenance technician",
			"available_from": "2026-09-23T11:00:00Z",
			"field": "technician_note",
			"id": "NOTE-2402",
			"known_at": "2026-09-23T11:00:00Z",
			"record_version": "FIC-1",
			"recorded_at": "2026-09-23T11:00:00Z",
			"sentences": [
				{
					"id": "NOTE-2402:s1",
					"ordinal": 1,
					"text": "Feeder jam recurred during JOB-8302 with NW-A revision P2."
				},
				{
					"id": "NOTE-2402:s2",
					"ordinal": 2,
					"text": "Visual check found no obvious guide damage."
				},
				{
					"id": "NOTE-2402:s3",
					"ordinal": 3,
					"text": "Setup variation is suspected, but setup measurements were not recorded."
				},
				{
					"id": "NOTE-2402:s4",
					"ordinal": 4,
					"text": "No component was replaced; return to service was recorded by the shift lead."
				}
			],
			"synthetic": true,
			"text": "Feeder jam recurred during JOB-8302 with NW-A revision P2. Visual check found no obvious guide damage. Setup variation is suspected, but setup measurements were not recorded. No component was replaced; return to service was recorded by the shift lead.",
			"work_order_id": "MAINT-WO-2402"
		},
		{
			"author_role": "Demo maintenance technician",
			"available_from": "2026-09-23T14:00:00Z",
			"field": "handover_copy",
			"id": "NOTE-2402-COPY",
			"known_at": "2026-09-23T14:00:00Z",
			"record_version": "FIC-1",
			"recorded_at": "2026-09-23T14:00:00Z",
			"sentences": [{
				"id": "NOTE-2402-COPY:s1",
				"ordinal": 1,
				"text": "Feeder jam recurred during JOB-8302 with NW-A revision P2."
			}],
			"synthetic": true,
			"text": "Feeder jam recurred during JOB-8302 with NW-A revision P2.",
			"work_order_id": "MAINT-WO-2402"
		},
		{
			"author_role": "Demo maintenance technician",
			"available_from": "2026-10-06T15:10:00Z",
			"field": "inspection_and_repair_note",
			"id": "NOTE-003",
			"known_at": "2026-10-06T15:10:00Z",
			"record_version": "FIC-1",
			"recorded_at": "2026-10-06T15:10:00Z",
			"sentences": [
				{
					"id": "NOTE-003:s1",
					"ordinal": 1,
					"text": "Inspection record INSPECT-003 documents visible localized guide wear."
				},
				{
					"id": "NOTE-003:s2",
					"ordinal": 2,
					"text": "The worn guide is a probable contributor to repeat jams; a unique causal mechanism has not been demonstrated."
				},
				{
					"id": "NOTE-003:s3",
					"ordinal": 3,
					"text": "The guide component was replaced under the simulated approved work record."
				},
				{
					"id": "NOTE-003:s4",
					"ordinal": 4,
					"text": "No unauthorized recipe, setpoint, or released work-instruction change was made."
				},
				{
					"id": "NOTE-003:s5",
					"ordinal": 5,
					"text": "Return to service was recorded for the simulated intervention; repair completion is not proof of lasting effectiveness."
				}
			],
			"synthetic": true,
			"text": "Inspection record INSPECT-003 documents visible localized guide wear. The worn guide is a probable contributor to repeat jams; a unique causal mechanism has not been demonstrated. The guide component was replaced under the simulated approved work record. No unauthorized recipe, setpoint, or released work-instruction change was made. Return to service was recorded for the simulated intervention; repair completion is not proof of lasting effectiveness.",
			"work_order_id": "DEMO-WO-003"
		},
		{
			"author_role": "Demo maintenance technician",
			"available_from": "2026-10-20T15:15:00Z",
			"field": "verification_note",
			"id": "NOTE-VERIFY-003",
			"known_at": "2026-10-20T15:15:00Z",
			"record_version": "FIC-1",
			"recorded_at": "2026-10-20T15:15:00Z",
			"sentences": [
				{
					"id": "NOTE-VERIFY-003:s1",
					"ordinal": 1,
					"text": "Ten comparable post-action shifts averaged 30 feeder-jam minutes versus 60 in the baseline."
				},
				{
					"id": "NOTE-VERIFY-003:s2",
					"ordinal": 2,
					"text": "The observed reduction supports a beneficial change but does not isolate guide replacement from other influences."
				},
				{
					"id": "NOTE-VERIFY-003:s3",
					"ordinal": 3,
					"text": "Root cause remains unconfirmed; retain the sustain observation and the engineering-change release gates."
				}
			],
			"synthetic": true,
			"text": "Ten comparable post-action shifts averaged 30 feeder-jam minutes versus 60 in the baseline. The observed reduction supports a beneficial change but does not isolate guide replacement from other influences. Root cause remains unconfirmed; retain the sustain observation and the engineering-change release gates.",
			"work_order_id": "MAINT-WO-2404"
		},
		{
			"author_role": "Demo maintenance technician",
			"available_from": "2026-11-03T14:15:00Z",
			"field": "recurrence_note",
			"id": "NOTE-RECUR-003",
			"known_at": "2026-11-03T14:15:00Z",
			"record_version": "FIC-1",
			"recorded_at": "2026-11-03T14:15:00Z",
			"sentences": [{
				"id": "NOTE-RECUR-003:s1",
				"ordinal": 1,
				"text": "Two consecutive eligible shifts exceeded the 45-minute feeder-jam threshold."
			}, {
				"id": "NOTE-RECUR-003:s2",
				"ordinal": 2,
				"text": "Reopen CASE-003 for investigation; no new cause has been verified."
			}],
			"synthetic": true,
			"text": "Two consecutive eligible shifts exceeded the 45-minute feeder-jam threshold. Reopen CASE-003 for investigation; no new cause has been verified.",
			"work_order_id": "MAINT-WO-2405"
		}
	],
	work_orders: [
		{
			"available_from": "2026-09-21T10:10:00Z",
			"case_id": "CASE-003",
			"data_quality": ["Labor is person-minutes, not downtime or elapsed repair time.", "Null means unavailable; never impute zero."],
			"date": "2026-09-21",
			"entity_type": "maintenance_work_order",
			"failure_event_id": "MFAIL-2401",
			"field_provenance": {
				"downtime_minutes": {
					"exact_value": null,
					"field": "fields.downtime_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"exposure": {
					"exact_value": null,
					"field": "fields.exposure",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"failure_mode": {
					"exact_value": "FM-030-01",
					"field": "fields.failure_mode",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"labor_minutes": {
					"exact_value": 12,
					"field": "fields.labor_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"parts_replaced": {
					"exact_value": [],
					"field": "fields.parts_replaced",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"repair_elapsed_minutes": {
					"exact_value": null,
					"field": "fields.repair_elapsed_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"return_to_service_at": {
					"exact_value": null,
					"field": "fields.return_to_service_at",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.area_id": {
					"exact_value": "assembly",
					"field": "scope.area_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.asset_id": {
					"exact_value": "FEED-03",
					"field": "scope.asset_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.line_id": {
					"exact_value": "line-03",
					"field": "scope.line_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.operation_id": {
					"exact_value": "OP-030",
					"field": "scope.operation_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_id": {
					"exact_value": "NW-A",
					"field": "scope.product_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_revision": {
					"exact_value": "P2",
					"field": "scope.product_revision",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.site_id": {
					"exact_value": "northworks",
					"field": "scope.site_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"production_job_ids": {
					"exact_value": ["JOB-8301"],
					"field": "production_job_ids",
					"link_status": "synthetic_explicit_link",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2401",
					"source_type": "synthetic_CMMS_MES_link"
				}
			},
			"fields": {
				"downtime_minutes": null,
				"exposure": null,
				"failure_mode": "FM-030-01",
				"labor_minutes": 12,
				"parts_replaced": [],
				"repair_elapsed_minutes": null,
				"return_to_service_at": null
			},
			"id": "MAINT-WO-2401",
			"known_at": "2026-09-21T10:10:00Z",
			"production_job_ids": ["JOB-8301"],
			"recorded_at": "2026-09-21T10:10:00Z",
			"scope": {
				"area_id": "assembly",
				"asset_id": "FEED-03",
				"line_id": "line-03",
				"operation_id": "OP-030",
				"product_id": "NW-A",
				"product_revision": "P2",
				"site_id": "northworks"
			},
			"source_note_ids": ["NOTE-2401"],
			"state_as_of": "2026-09-21T10:10:00Z",
			"status": "completed_simulated",
			"type": "corrective"
		},
		{
			"available_from": "2026-09-23T14:00:00Z",
			"case_id": "CASE-003",
			"data_quality": ["Labor is person-minutes, not downtime or elapsed repair time.", "Null means unavailable; never impute zero."],
			"date": "2026-09-23",
			"entity_type": "maintenance_work_order",
			"failure_event_id": "MFAIL-2402",
			"field_provenance": {
				"downtime_minutes": {
					"exact_value": null,
					"field": "fields.downtime_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"exposure": {
					"exact_value": null,
					"field": "fields.exposure",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"failure_mode": {
					"exact_value": "FM-030-01",
					"field": "fields.failure_mode",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"labor_minutes": {
					"exact_value": 14,
					"field": "fields.labor_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"parts_replaced": {
					"exact_value": [],
					"field": "fields.parts_replaced",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"repair_elapsed_minutes": {
					"exact_value": null,
					"field": "fields.repair_elapsed_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"return_to_service_at": {
					"exact_value": null,
					"field": "fields.return_to_service_at",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.area_id": {
					"exact_value": "assembly",
					"field": "scope.area_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.asset_id": {
					"exact_value": "FEED-03",
					"field": "scope.asset_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.line_id": {
					"exact_value": "line-03",
					"field": "scope.line_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.operation_id": {
					"exact_value": "OP-030",
					"field": "scope.operation_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_id": {
					"exact_value": "NW-A",
					"field": "scope.product_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_revision": {
					"exact_value": "P2",
					"field": "scope.product_revision",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.site_id": {
					"exact_value": "northworks",
					"field": "scope.site_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"production_job_ids": {
					"exact_value": ["JOB-8302"],
					"field": "production_job_ids",
					"link_status": "synthetic_explicit_link",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2402",
					"source_type": "synthetic_CMMS_MES_link"
				}
			},
			"fields": {
				"downtime_minutes": null,
				"exposure": null,
				"failure_mode": "FM-030-01",
				"labor_minutes": 14,
				"parts_replaced": [],
				"repair_elapsed_minutes": null,
				"return_to_service_at": null
			},
			"id": "MAINT-WO-2402",
			"known_at": "2026-09-23T14:00:00Z",
			"production_job_ids": ["JOB-8302"],
			"recorded_at": "2026-09-23T14:00:00Z",
			"scope": {
				"area_id": "assembly",
				"asset_id": "FEED-03",
				"line_id": "line-03",
				"operation_id": "OP-030",
				"product_id": "NW-A",
				"product_revision": "P2",
				"site_id": "northworks"
			},
			"source_note_ids": ["NOTE-2402", "NOTE-2402-COPY"],
			"state_as_of": "2026-09-23T14:00:00Z",
			"status": "completed_simulated",
			"type": "corrective"
		},
		{
			"available_from": "2026-10-06T15:10:00Z",
			"case_id": "CASE-003",
			"data_quality": ["Labor is person-minutes, not downtime or elapsed repair time.", "Null means unavailable; never impute zero."],
			"date": "2026-10-06",
			"entity_type": "maintenance_work_order",
			"failure_event_id": null,
			"field_provenance": {
				"downtime_minutes": {
					"exact_value": null,
					"field": "fields.downtime_minutes",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"exposure": {
					"exact_value": null,
					"field": "fields.exposure",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"failure_mode": {
					"exact_value": null,
					"field": "fields.failure_mode",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"labor_minutes": {
					"exact_value": 30,
					"field": "fields.labor_minutes",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"parts_replaced": {
					"exact_value": [{
						"maintenance_spare_id": "SPARE-GUIDE-03",
						"provenance": {
							"exact_excerpt": "The guide component was replaced under the simulated approved work record.",
							"field": "inspection_and_repair_note",
							"record_version": "FIC-1",
							"sentence_id": "NOTE-003:s3",
							"sentence_ordinal": 3,
							"source_id": "NOTE-003"
						},
						"quantity": 1
					}],
					"field": "fields.parts_replaced",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"repair_elapsed_minutes": {
					"exact_value": null,
					"field": "fields.repair_elapsed_minutes",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"return_to_service_at": {
					"exact_value": "2026-10-06T15:10:00Z",
					"field": "fields.return_to_service_at",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.area_id": {
					"exact_value": "assembly",
					"field": "scope.area_id",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.asset_id": {
					"exact_value": "FEED-03",
					"field": "scope.asset_id",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.line_id": {
					"exact_value": "line-03",
					"field": "scope.line_id",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.operation_id": {
					"exact_value": "OP-030",
					"field": "scope.operation_id",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_id": {
					"exact_value": "NW-A",
					"field": "scope.product_id",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_revision": {
					"exact_value": "P2",
					"field": "scope.product_revision",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.site_id": {
					"exact_value": "northworks",
					"field": "scope.site_id",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"production_job_ids": {
					"exact_value": ["JOB-8303"],
					"field": "production_job_ids",
					"link_status": "synthetic_explicit_link",
					"record_version": "FIC-1",
					"source_id": "DEMO-WO-003",
					"source_type": "synthetic_CMMS_MES_link"
				}
			},
			"fields": {
				"downtime_minutes": null,
				"exposure": null,
				"failure_mode": null,
				"labor_minutes": 30,
				"parts_replaced": [{
					"maintenance_spare_id": "SPARE-GUIDE-03",
					"provenance": {
						"exact_excerpt": "The guide component was replaced under the simulated approved work record.",
						"field": "inspection_and_repair_note",
						"record_version": "FIC-1",
						"sentence_id": "NOTE-003:s3",
						"sentence_ordinal": 3,
						"source_id": "NOTE-003"
					},
					"quantity": 1
				}],
				"repair_elapsed_minutes": null,
				"return_to_service_at": "2026-10-06T15:10:00Z"
			},
			"id": "DEMO-WO-003",
			"known_at": "2026-10-06T15:10:00Z",
			"production_job_ids": ["JOB-8303"],
			"recorded_at": "2026-10-06T15:10:00Z",
			"scope": {
				"area_id": "assembly",
				"asset_id": "FEED-03",
				"line_id": "line-03",
				"operation_id": "OP-030",
				"product_id": "NW-A",
				"product_revision": "P2",
				"site_id": "northworks"
			},
			"source_note_ids": ["NOTE-003"],
			"state_as_of": "2026-10-06T15:10:00Z",
			"status": "completed_simulated",
			"type": "planned_corrective",
			"planned_record_ref": "scenario-fixture.json#/case/events",
			"visibility_rule": "This completed version is hidden before 15:10. The earlier approved action is represented by its separate case event, not this completed work record."
		},
		{
			"available_from": "2026-10-20T15:15:00Z",
			"case_id": "CASE-003",
			"data_quality": ["Labor is person-minutes, not downtime or elapsed repair time.", "Null means unavailable; never impute zero."],
			"date": "2026-10-20",
			"entity_type": "maintenance_work_order",
			"failure_event_id": null,
			"field_provenance": {
				"downtime_minutes": {
					"exact_value": null,
					"field": "fields.downtime_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"exposure": {
					"exact_value": null,
					"field": "fields.exposure",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"failure_mode": {
					"exact_value": null,
					"field": "fields.failure_mode",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"labor_minutes": {
					"exact_value": 20,
					"field": "fields.labor_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"parts_replaced": {
					"exact_value": [],
					"field": "fields.parts_replaced",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"repair_elapsed_minutes": {
					"exact_value": null,
					"field": "fields.repair_elapsed_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"return_to_service_at": {
					"exact_value": null,
					"field": "fields.return_to_service_at",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.area_id": {
					"exact_value": "assembly",
					"field": "scope.area_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.asset_id": {
					"exact_value": "FEED-03",
					"field": "scope.asset_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.line_id": {
					"exact_value": "line-03",
					"field": "scope.line_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.operation_id": {
					"exact_value": "OP-030",
					"field": "scope.operation_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_id": {
					"exact_value": "NW-A",
					"field": "scope.product_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_revision": {
					"exact_value": "P2",
					"field": "scope.product_revision",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.site_id": {
					"exact_value": "northworks",
					"field": "scope.site_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"production_job_ids": {
					"exact_value": [],
					"field": "production_job_ids",
					"link_status": "synthetic_explicit_link",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2404",
					"source_type": "synthetic_CMMS_MES_link"
				}
			},
			"fields": {
				"downtime_minutes": null,
				"exposure": null,
				"failure_mode": null,
				"labor_minutes": 20,
				"parts_replaced": [],
				"repair_elapsed_minutes": null,
				"return_to_service_at": null
			},
			"id": "MAINT-WO-2404",
			"known_at": "2026-10-20T15:15:00Z",
			"production_job_ids": [],
			"recorded_at": "2026-10-20T15:15:00Z",
			"scope": {
				"area_id": "assembly",
				"asset_id": "FEED-03",
				"line_id": "line-03",
				"operation_id": "OP-030",
				"product_id": "NW-A",
				"product_revision": "P2",
				"site_id": "northworks"
			},
			"source_note_ids": ["NOTE-VERIFY-003"],
			"state_as_of": "2026-10-20T15:15:00Z",
			"status": "completed_simulated",
			"type": "effectiveness_review"
		},
		{
			"available_from": "2026-11-03T14:15:00Z",
			"case_id": "CASE-003",
			"data_quality": ["Labor is person-minutes, not downtime or elapsed repair time.", "Null means unavailable; never impute zero."],
			"date": "2026-11-03",
			"entity_type": "maintenance_work_order",
			"failure_event_id": null,
			"field_provenance": {
				"downtime_minutes": {
					"exact_value": null,
					"field": "fields.downtime_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"exposure": {
					"exact_value": null,
					"field": "fields.exposure",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"failure_mode": {
					"exact_value": null,
					"field": "fields.failure_mode",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"labor_minutes": {
					"exact_value": null,
					"field": "fields.labor_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"parts_replaced": {
					"exact_value": [],
					"field": "fields.parts_replaced",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"repair_elapsed_minutes": {
					"exact_value": null,
					"field": "fields.repair_elapsed_minutes",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"return_to_service_at": {
					"exact_value": null,
					"field": "fields.return_to_service_at",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.area_id": {
					"exact_value": "assembly",
					"field": "scope.area_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.asset_id": {
					"exact_value": "FEED-03",
					"field": "scope.asset_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.line_id": {
					"exact_value": "line-03",
					"field": "scope.line_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.operation_id": {
					"exact_value": "OP-030",
					"field": "scope.operation_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_id": {
					"exact_value": "NW-A",
					"field": "scope.product_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.product_revision": {
					"exact_value": "P2",
					"field": "scope.product_revision",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"scope.site_id": {
					"exact_value": "northworks",
					"field": "scope.site_id",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_structured_CMMS_field"
				},
				"production_job_ids": {
					"exact_value": [],
					"field": "production_job_ids",
					"link_status": "synthetic_explicit_link",
					"record_version": "FIC-1",
					"source_id": "MAINT-WO-2405",
					"source_type": "synthetic_CMMS_MES_link"
				}
			},
			"fields": {
				"downtime_minutes": null,
				"exposure": null,
				"failure_mode": null,
				"labor_minutes": null,
				"parts_replaced": [],
				"repair_elapsed_minutes": null,
				"return_to_service_at": null
			},
			"id": "MAINT-WO-2405",
			"known_at": "2026-11-03T14:15:00Z",
			"production_job_ids": [],
			"recorded_at": "2026-11-03T14:15:00Z",
			"scope": {
				"area_id": "assembly",
				"asset_id": "FEED-03",
				"line_id": "line-03",
				"operation_id": "OP-030",
				"product_id": "NW-A",
				"product_revision": "P2",
				"site_id": "northworks"
			},
			"source_note_ids": ["NOTE-RECUR-003"],
			"state_as_of": "2026-11-03T14:15:00Z",
			"status": "open",
			"type": "investigation"
		}
	],
	adapter: {
		"controls": [
			"source ACL inheritance",
			"immutable source snapshots and stable source IDs",
			"UTC timestamps plus plant timezone",
			"explicit many-to-many WO/event/job links",
			"idempotent imports; preserve deleted/updated source tombstones",
			"no counts inferred from note frequency",
			"audit actor/time/before/after/reason",
			"human approval before any future external write"
		],
		"endpoints_proposed": [
			"GET /maintenance/work-orders?asset_id=&product_id=&revision=&job_id=",
			"GET /maintenance/work-orders/{id}/evidence",
			"GET /maintenance/recurrence?group_by=&definition_id=",
			"POST /maintenance/extractions/{id}/review (local demo draft only)",
			"POST /maintenance/pm-reviews (local demo draft only)"
		],
		"future_sources": [
			"CMMS work orders and notes",
			"asset/ISA-context master",
			"MES production jobs and stop events",
			"historian/runtime/cycle exposure",
			"controlled-document revisions",
			"PM plans/completion findings"
		],
		"mode": "read_only_fixture",
		"writeback_enabled": false
	},
	contradictions: [{
		"available_from": "2026-10-06T15:10:00Z",
		"claim_ids": ["MC-04", "MC-06"],
		"explanation": "Earlier visual check reported no obvious damage; later inspection documented wear. Different dates, methods, and sensitivity mean both records may be accurate. Do not overwrite either or infer when wear arose.",
		"id": "CONFLICT-003",
		"known_at": "2026-10-06T15:10:00Z",
		"next_evidence": "Review inspection scope, images and measurement traceability with authorized maintenance reviewer.",
		"status": "unresolved_apparent_disagreement"
	}],
	coverage: {
		"fixture_demonstrates": [
			"work-order/job distinction",
			"source sentence/field provenance",
			"negation and uncertainty",
			"apparent contradiction",
			"copied-note deduplication",
			"confirmed observation vs unconfirmed cause",
			"exposure-normalized duration comparison",
			"sustain recurrence reopen",
			"insufficient-evidence PM branch"
		],
		"target_not_implemented": [
			"live CMMS adapter",
			"automatic NLP extraction quality validation",
			"live interval optimization",
			"OEM constraint ingestion",
			"production writeback",
			"survival/recurrent-event statistical model"
		],
		"ui_status": "Design and fixture ready; only claim interactive coverage after implementation and click testing."
	},
	deduplication: [{
		"action": "Retain source; exclude copied statement from independent corroboration and failure counts",
		"duplicate_of": "NOTE-2402:s1",
		"same_failure_event_id": "MFAIL-2402",
		"source_id": "NOTE-2402-COPY"
	}],
	extracted_claims: [
		{
			"available_from": "2026-09-21T10:10:00Z",
			"evidence_status": "reported_observation",
			"field": "observed_symptom",
			"id": "MC-01",
			"known_at": "2026-09-21T10:10:00Z",
			"provenance": [{
				"exact_excerpt": "Feeder stopped with housings backed up at the guide during JOB-8301.",
				"field": "technician_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-2401:s1",
				"sentence_ordinal": 1,
				"source_id": "NOTE-2401"
			}],
			"value": "Feeder jam / housing backup"
		},
		{
			"available_from": "2026-09-21T10:10:00Z",
			"evidence_status": "technician_hypothesis",
			"field": "suspected_cause",
			"id": "MC-02",
			"known_at": "2026-09-21T10:10:00Z",
			"provenance": [{
				"exact_excerpt": "Guide wear may be contributing; no dimensional inspection was completed.",
				"field": "technician_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-2401:s2",
				"sentence_ordinal": 2,
				"source_id": "NOTE-2401"
			}],
			"value": "Guide wear",
			"negated": false,
			"uncertainty": "may"
		},
		{
			"available_from": "2026-09-21T10:10:00Z",
			"evidence_status": "not_observed_in_limited_check",
			"field": "failure_mode",
			"id": "MC-03",
			"known_at": "2026-09-21T10:10:00Z",
			"provenance": [{
				"exact_excerpt": "No motor fault was observed on the available alarm display.",
				"field": "technician_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-2401:s3",
				"sentence_ordinal": 3,
				"source_id": "NOTE-2401"
			}],
			"value": "Motor fault",
			"negated": true,
			"scope_limit": "Available alarm display only; does not rule out every motor condition"
		},
		{
			"available_from": "2026-09-23T11:00:00Z",
			"evidence_status": "not_observed_in_visual_check",
			"field": "observed_condition",
			"id": "MC-04",
			"known_at": "2026-09-23T11:00:00Z",
			"provenance": [{
				"exact_excerpt": "Visual check found no obvious guide damage.",
				"field": "technician_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-2402:s2",
				"sentence_ordinal": 2,
				"source_id": "NOTE-2402"
			}],
			"value": "Obvious guide damage",
			"negated": true
		},
		{
			"available_from": "2026-09-23T11:00:00Z",
			"evidence_status": "technician_hypothesis",
			"field": "suspected_cause",
			"id": "MC-05",
			"known_at": "2026-09-23T11:00:00Z",
			"provenance": [{
				"exact_excerpt": "Setup variation is suspected, but setup measurements were not recorded.",
				"field": "technician_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-2402:s3",
				"sentence_ordinal": 3,
				"source_id": "NOTE-2402"
			}],
			"value": "Setup variation",
			"uncertainty": "suspected; measurements absent"
		},
		{
			"available_from": "2026-10-06T15:10:00Z",
			"evidence_status": "inspection_documented",
			"field": "observed_condition",
			"id": "MC-06",
			"known_at": "2026-10-06T15:10:00Z",
			"provenance": [{
				"exact_excerpt": "Inspection record INSPECT-003 documents visible localized guide wear.",
				"field": "inspection_and_repair_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-003:s1",
				"sentence_ordinal": 1,
				"source_id": "NOTE-003"
			}],
			"value": "Localized guide wear",
			"attachment_ref": "INSPECT-003"
		},
		{
			"available_from": "2026-10-06T15:10:00Z",
			"evidence_status": "probable_contributor_not_root_cause",
			"field": "suspected_cause",
			"id": "MC-07",
			"known_at": "2026-10-06T15:10:00Z",
			"provenance": [{
				"exact_excerpt": "The worn guide is a probable contributor to repeat jams; a unique causal mechanism has not been demonstrated.",
				"field": "inspection_and_repair_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-003:s2",
				"sentence_ordinal": 2,
				"source_id": "NOTE-003"
			}],
			"value": "Guide wear contributes to repeat jams"
		},
		{
			"available_from": "2026-10-06T15:10:00Z",
			"evidence_status": "recorded_action",
			"field": "action",
			"id": "MC-08",
			"known_at": "2026-10-06T15:10:00Z",
			"provenance": [{
				"exact_excerpt": "The guide component was replaced under the simulated approved work record.",
				"field": "inspection_and_repair_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-003:s3",
				"sentence_ordinal": 3,
				"source_id": "NOTE-003"
			}],
			"value": "Guide component replacement"
		},
		{
			"available_from": "2026-10-20T15:15:00Z",
			"evidence_status": "unconfirmed",
			"field": "verified_root_cause",
			"id": "MC-09",
			"known_at": "2026-10-20T15:15:00Z",
			"provenance": [{
				"exact_excerpt": "Root cause remains unconfirmed; retain the sustain observation and the engineering-change release gates.",
				"field": "verification_note",
				"record_version": "FIC-1",
				"sentence_id": "NOTE-VERIFY-003:s3",
				"sentence_ordinal": 3,
				"source_id": "NOTE-VERIFY-003"
			}],
			"value": null
		}
	],
	inspection_records: [{
		"available_from": "2026-10-06T15:10:00Z",
		"finding": "Localized guide wear documented",
		"id": "INSPECT-003",
		"kind": "synthetic visual inspection record",
		"known_at": "2026-10-06T15:10:00Z",
		"limits": "No quantified measurement or controlled causal test supplied",
		"observed_at": "2026-10-06T15:00:00Z",
		"recorded_at": "2026-10-06T15:10:00Z",
		"root_cause_confirmed": false,
		"supports_claim": "MC-06"
	}],
	investigator_view: {
		"actions": [
			"Create local draft extraction correction",
			"Link evidence to CASE-003 hypothesis H-003-01",
			"Prepare local PM review draft",
			"Open blocked release-gate explanation"
		],
		"evidence_viewer": [
			"verbatim note with sentence highlight",
			"source record/version/field/sentence/author/time",
			"claim and negation scope",
			"conflicting and duplicate sources",
			"reviewer disposition and audit history"
		],
		"filters": [
			"site/area/line/equipment",
			"work order",
			"production job",
			"product part/revision",
			"operation",
			"date",
			"symptom/failure mode",
			"evidence status",
			"missing fields"
		],
		"tabs": [
			"Work orders",
			"Evidence and claims",
			"Recurrence and exposure",
			"Repair verification",
			"PM review"
		]
	},
	pm_review: {
		"available_from": "2026-10-06T15:15:00Z",
		"compliance": {
			"due_tasks": null,
			"on_time_completed_tasks": null,
			"status": "not_evaluable"
		},
		"current_interval": {
			"source": "illustrative existing PM master; not an OEM recommendation",
			"unit": "calendar_days",
			"value": 30
		},
		"id": "PM-REVIEW-003",
		"interval_optimization": {
			"approval_roles": [
				"Maintenance authority",
				"Reliability engineer",
				"Safety/quality/customer authority where applicable"
			],
			"decision": "Retain approved plan pending authorized review; do not shorten or lengthen automatically.",
			"missing": [
				"OEM applicable requirement and revision",
				"safety/regulatory/customer constraints",
				"task-completion and finding history",
				"component installation ages and operating cycles",
				"job/part/revision exposure and duty cycle",
				"right-censored surviving components and left-truncated observation history",
				"consistent failure-mode/event definitions and detection history"
			],
			"not_valid_methods": [
				"Set PM interval equal to MTBF",
				"Infer root cause from note frequency",
				"Fit a life distribution to two incomplete work orders",
				"Interpret zero observed post failures as zero risk"
			],
			"proposed_next_step": "Prepare a bounded evidence collection and task-content review for approval; interval proposal remains blank.",
			"recommended_interval": null,
			"status": "insufficient_evidence"
		},
		"known_at": "2026-10-06T15:15:00Z",
		"scheduling": {
			"next_due": null,
			"reason": "Last completion and authoritative PM master not connected"
		},
		"task_effectiveness": {
			"evidence": [
				"MC-04",
				"MC-06",
				"CONFLICT-003"
			],
			"question": "Does the existing inspection detect the relevant guide condition early enough under the actual duty cycle?",
			"status": "needs_review"
		},
		"task_id": "PM-FEED-INSPECT-003",
		"version": 2
	},
	pm_review_initial: {
		"available_from": "2026-10-06T14:25:00Z",
		"compliance": {
			"due_tasks": null,
			"on_time_completed_tasks": null,
			"status": "not_evaluable"
		},
		"current_interval": {
			"source": "illustrative existing PM master; not an OEM recommendation",
			"unit": "calendar_days",
			"value": 30
		},
		"id": "PM-REVIEW-003",
		"interval_optimization": {
			"approval_roles": [
				"Maintenance authority",
				"Reliability engineer",
				"Safety/quality/customer authority where applicable"
			],
			"decision": "Retain approved plan pending authorized review; do not shorten or lengthen automatically.",
			"missing": [
				"OEM applicable requirement and revision",
				"safety/regulatory/customer constraints",
				"task-completion and finding history",
				"component installation ages and operating cycles",
				"job/part/revision exposure and duty cycle",
				"right-censored surviving components and left-truncated observation history",
				"consistent failure-mode/event definitions and detection history"
			],
			"not_valid_methods": [
				"Set PM interval equal to MTBF",
				"Infer root cause from note frequency",
				"Fit a life distribution to two incomplete work orders",
				"Interpret zero observed post failures as zero risk"
			],
			"proposed_next_step": "Prepare a bounded evidence collection and task-content review for approval; interval proposal remains blank.",
			"recommended_interval": null,
			"status": "insufficient_evidence"
		},
		"known_at": "2026-10-06T14:25:00Z",
		"scheduling": {
			"next_due": null,
			"reason": "Last completion and authoritative PM master not connected"
		},
		"task_effectiveness": {
			"evidence": [
				"MC-02",
				"MC-04",
				"MC-05"
			],
			"question": "Do the incomplete historical visual checks provide adequate evidence of task effectiveness?",
			"status": "needs_review"
		},
		"task_id": "PM-FEED-INSPECT-003",
		"version": 1
	},
	recurrence: {
		"comparable_periods": [{
			"asset_id": "FEED-03",
			"available_from": "2026-10-02T14:00:00Z",
			"eligible_shifts": 10,
			"event_rate": null,
			"id": "baseline",
			"jam_minutes": 600,
			"jam_minutes_per_100_operating_hours": 923.076923076923,
			"json_pointer": "/case/baseline",
			"metric_label": "Feeder-jam duration burden, min / 100 operating h; not a failure frequency",
			"operation_id": "OP-030",
			"planned_minutes": 4800,
			"product_id": "NW-A",
			"revision": "P2",
			"run_minutes": 3900,
			"source": "scenario-fixture.json"
		}, {
			"asset_id": "FEED-03",
			"available_from": "2026-10-20T14:00:00Z",
			"eligible_shifts": 10,
			"event_rate": null,
			"id": "post",
			"jam_minutes": 300,
			"jam_minutes_per_100_operating_hours": 428.57142857142856,
			"json_pointer": "/case/post",
			"metric_label": "Feeder-jam duration burden, min / 100 operating h; not a failure frequency",
			"operation_id": "OP-030",
			"planned_minutes": 4800,
			"product_id": "NW-A",
			"revision": "P2",
			"run_minutes": 4200,
			"source": "scenario-fixture.json"
		}],
		"failure_definition": {
			"caveat": "Historical WO sample is incomplete; no population event frequency or MTBF from its two records.",
			"id": "FD-FEED-JAM-v1",
			"text": "Distinct feeder blockage interrupting expected flow and recorded as a stop; one event may have multiple notes/work orders."
		},
		"group_dimensions": [
			"asset_id",
			"product_id",
			"product_revision",
			"operation_id",
			"production_job_id",
			"failure_definition_version"
		],
		"historical_sample": {
			"copied_notes_excluded": 1,
			"event_rate": null,
			"exposure_coverage": "unknown",
			"independent_corrective_work_orders": 2,
			"rank_jobs_by_rate": false,
			"reason": "Job-specific event coverage and job runtime allocation are unavailable.",
			"unique_failure_events": 2
		}
	},
	sources: [
		{
			"title": "DOE O&M Best Practices Guide, Release 3.0, chapter 5",
			"url": "https://www.energy.gov/sites/prod/files/2020/04/f74/omguide_complete_w-eo-disclaimer.pdf"
		},
		{
			"title": "NASA Reliability-Centered Maintenance Guide, sections 2 and 5",
			"url": "https://www.nasa.gov/wp-content/uploads/2023/06/nasa-rcmguide.pdf"
		},
		{
			"title": "ISA-95 standard overview",
			"url": "https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard"
		},
		{
			"title": "OPC Foundation ISA-95 role-based equipment levels",
			"url": "https://reference.opcfoundation.org/specs/OPC-10030/7.4.1"
		}
	],
	technician_view: {
		"do_not": "No generated adjustment values, bypass steps, reset instructions or inferred authorization to operate.",
		"escalation": "Escalate recurrent symptoms, conflicting findings or uncertain safe operating condition to the maintenance lead and operations owner; use the site safe-state procedure.",
		"headline": "Repeated feeder symptoms; root cause not confirmed",
		"next_safe_action": "Review the current approved procedure and record the observed symptom, job/part revision, stop reference and what was checked. Only qualified personnel may perform work under site authorization."
	},
	temporal_rule: "Filter source records, claims, inspection, comparable periods, verification, recurrence and joined relationships by selected scenario as_of and known_at/available_from. Effective guidance additionally requires an effective applicability interval. Future plans may be shown as plans, never observed outcomes.",
	verification: {
		"available_from": "2026-10-20T14:00:00Z",
		"before_after_claim": "600 to 300 jam minutes across ten eligible shifts each; runtime 3900 to 4200 minutes. Observed association, not isolated causal proof.",
		"core_plan_ref": "scenario-fixture.json#/case/verification_plan",
		"effectiveness": "Post outcome improves; guardrail and sustain gates remain distinct.",
		"engineering_change_ref": "EC-003",
		"intervention_scope": "DEMO-WO-003 is simulated approved like-for-like guide replacement restoring existing design; not EC-003 implementation.",
		"recurrence_available_from": "2026-11-03T14:00:00Z",
		"recurrence_reopens": "2026-11-03",
		"release_state": "EC-003 is not released; proposed SW-030 FIC-E remains blocked.",
		"repair_completion": "Recorded action and return to service only.",
		"sustain_plan_ref": "scenario-fixture.json#/case/sustain_plan"
	}
};
//#endregion
export { maintenance_fixture_default as default };
