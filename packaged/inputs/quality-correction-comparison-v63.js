//#region app/inputs/quality-correction-comparison-v63.json
var scenarioId = "quality-correction-comparison-v63";
var authorship = "Explicit separate fictional comparison experiment; not original October observations, causal proof, actual work or financial savings.";
var originPolicy = "Current Quality correction is contextual trigger only. No current-job delta is copied into these separate dated measurements. Exact comparison corrections require reviewed row/unit identity.";
var context = {
	"tenant": "synthetic-demo",
	"plant": "Synthetic Works",
	"line": "Quality line",
	"asset": "FORM-Q1",
	"job": "CMP-Q63-EXPERIMENT",
	"part": "QL-A",
	"revision": "Q1",
	"operation": "OP-Q10",
	"from": "2026-11-04T06:00:00Z",
	"to": "2026-12-02T14:00:00Z"
};
var snapshots = [
	"2026-11-18T14:45:00Z",
	"2026-11-18T15:15:00Z",
	"2026-12-03T15:15:00Z"
];
var plan = {
	"version": 1,
	"fixedAt": "2026-11-18T14:45:00Z",
	"endpoint": "fpy",
	"direction": "higher",
	"target": 95,
	"unit": "% first-pass accepted",
	"requiredShifts": 10,
	"qualityMaxWorseningPp": .2,
	"energyMaxWorseningPct": 2,
	"baselineIds": [
		"CMP-Q63-BASELINE-01",
		"CMP-Q63-BASELINE-02",
		"CMP-Q63-BASELINE-03",
		"CMP-Q63-BASELINE-04",
		"CMP-Q63-BASELINE-05",
		"CMP-Q63-BASELINE-06",
		"CMP-Q63-BASELINE-07",
		"CMP-Q63-BASELINE-08",
		"CMP-Q63-BASELINE-09",
		"CMP-Q63-BASELINE-10"
	],
	"postIds": [
		"CMP-Q63-POST-01",
		"CMP-Q63-POST-02",
		"CMP-Q63-POST-03",
		"CMP-Q63-POST-04",
		"CMP-Q63-POST-05",
		"CMP-Q63-POST-06",
		"CMP-Q63-POST-07",
		"CMP-Q63-POST-08",
		"CMP-Q63-POST-09",
		"CMP-Q63-POST-10"
	],
	"controlledDocumentId": "QUALITY-SW-01",
	"controlledDocumentVersion": 1,
	"source": "quality-correction-comparison-v63.json#/plan"
};
var rows = [
	{
		"id": "CMP-Q63-BASELINE-01",
		"period": "baseline",
		"date": "2026-11-04",
		"knownAt": "2026-11-04T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-01-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-02",
		"period": "baseline",
		"date": "2026-11-05",
		"knownAt": "2026-11-05T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-02-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-03",
		"period": "baseline",
		"date": "2026-11-06",
		"knownAt": "2026-11-06T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-03-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-04",
		"period": "baseline",
		"date": "2026-11-09",
		"knownAt": "2026-11-09T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-04-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-05",
		"period": "baseline",
		"date": "2026-11-10",
		"knownAt": "2026-11-10T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-05-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-06",
		"period": "baseline",
		"date": "2026-11-11",
		"knownAt": "2026-11-11T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-06-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-07",
		"period": "baseline",
		"date": "2026-11-12",
		"knownAt": "2026-11-12T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-07-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-08",
		"period": "baseline",
		"date": "2026-11-13",
		"knownAt": "2026-11-13T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-08-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-09",
		"period": "baseline",
		"date": "2026-11-16",
		"knownAt": "2026-11-16T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-09-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-BASELINE-10",
		"period": "baseline",
		"date": "2026-11-17",
		"knownAt": "2026-11-17T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 792,
		"firstPassGood": 748,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-BASELINE-10-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 748,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 749,
				"last": 792,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 793,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-01",
		"period": "post",
		"date": "2026-11-19",
		"knownAt": "2026-11-19T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-01-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-02",
		"period": "post",
		"date": "2026-11-20",
		"knownAt": "2026-11-20T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-02-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-03",
		"period": "post",
		"date": "2026-11-23",
		"knownAt": "2026-11-23T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-03-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-04",
		"period": "post",
		"date": "2026-11-24",
		"knownAt": "2026-11-24T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-04-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-05",
		"period": "post",
		"date": "2026-11-25",
		"knownAt": "2026-11-25T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-05-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-06",
		"period": "post",
		"date": "2026-11-26",
		"knownAt": "2026-11-26T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-06-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-07",
		"period": "post",
		"date": "2026-11-27",
		"knownAt": "2026-11-27T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-07-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-08",
		"period": "post",
		"date": "2026-11-30",
		"knownAt": "2026-11-30T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-08-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-09",
		"period": "post",
		"date": "2026-12-01",
		"knownAt": "2026-12-01T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-09-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	},
	{
		"id": "CMP-Q63-POST-10",
		"period": "post",
		"date": "2026-12-02",
		"knownAt": "2026-12-02T14:00:00Z",
		"assetId": "FORM-Q1",
		"jobId": "CMP-Q63-EXPERIMENT",
		"part": "QL-A",
		"revision": "Q1",
		"operation": "OP-Q10",
		"plannedMin": 480,
		"downMin": 20,
		"runMin": 460,
		"total": 880,
		"good": 860,
		"firstPassGood": 844,
		"idealCycleMin": .5,
		"energyKwh": 900,
		"coverage": 1,
		"eligible": true,
		"crew": "fictional-comparable-crew",
		"definitionVersion": "independent-metric-contract-1.0",
		"intervals": [{
			"id": "CMP-Q63-POST-10-STOP",
			"start": 0,
			"end": 20,
			"reason": "planned_check"
		}],
		"unitDispositionRanges": [
			{
				"first": 1,
				"last": 844,
				"disposition": "accepted_first_pass",
				"firstPassAccepted": true
			},
			{
				"first": 845,
				"last": 860,
				"disposition": "accepted_rework",
				"firstPassAccepted": false
			},
			{
				"first": 861,
				"last": 880,
				"disposition": "scrap",
				"firstPassAccepted": false
			}
		]
	}
];
var work = {
	"id": "CMP-Q63-WORK",
	"assetId": "FORM-Q1",
	"jobId": "CMP-Q63-EXPERIMENT",
	"part": "QL-A",
	"revision": "Q1",
	"operation": "OP-Q10",
	"performedAt": "2026-11-18T15:10:00Z",
	"knownAt": "2026-11-18T15:15:00Z",
	"performer": "Fictional comparison maintenance technician",
	"confirmation": "Fictional comparison operator return-to-service confirmation",
	"description": "Separate fictional bounded tool-edge restoration for the preregistered comparison experiment. No original work proof reused.",
	"source": "quality-correction-comparison-v63.json#/work"
};
var safety = {
	"id": "CMP-Q63-SAFETY",
	"workId": "CMP-Q63-WORK",
	"knownAt": "2026-12-03T15:15:00Z",
	"reviewer": "Fictional comparison safety reviewer",
	"status": "pass",
	"source": "quality-correction-comparison-v63.json#/safety"
};
var variants = {
	"complete": {
		"postCount": 10,
		"workAvailable": true,
		"revision": "Q1"
	},
	"no_improvement": {
		"postCount": 10,
		"workAvailable": true,
		"revision": "Q1",
		"postGood": 792,
		"postFirstPassGood": 748
	},
	"insufficient_post": {
		"postCount": 8,
		"workAvailable": true,
		"revision": "Q1"
	},
	"missing_work": {
		"postCount": 10,
		"workAvailable": false,
		"revision": "Q1"
	},
	"wrong_revision": {
		"postCount": 10,
		"workAvailable": true,
		"revision": "Q2"
	}
};
//#endregion
export { authorship, context, originPolicy, plan, rows, safety, scenarioId, snapshots, variants, work };
