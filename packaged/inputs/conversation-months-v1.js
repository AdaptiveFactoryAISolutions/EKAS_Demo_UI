//#region app/inputs/conversation-months-v1.json
var fixtureVersion = "conversation-months-v1";
var rows = [
	{
		"id": "MONTH-January-1",
		"machine": "Machine 1",
		"month": "January",
		"year": 2026,
		"plannedMin": 480,
		"downMin": 80,
		"runMin": 400,
		"total": 769,
		"good": 740,
		"idealCycleMin": .5,
		"firstPassGood": null,
		"knownAt": "2026-04-01T00:00:00Z",
		"event": {
			"id": "MONTH-EVENT-January-1",
			"reason": "unplanned mechanical stop",
			"minutes": 80,
			"source": "conversation-months-v1#/rows"
		},
		"source": "conversation-months-v1#/rows/January/1"
	},
	{
		"id": "MONTH-January-2",
		"machine": "Machine 2",
		"month": "January",
		"year": 2026,
		"plannedMin": 480,
		"downMin": 90,
		"runMin": 390,
		"total": 748,
		"good": 720,
		"idealCycleMin": .5,
		"firstPassGood": null,
		"knownAt": "2026-04-01T00:00:00Z",
		"event": {
			"id": "MONTH-EVENT-January-2",
			"reason": "unplanned mechanical stop",
			"minutes": 90,
			"source": "conversation-months-v1#/rows"
		},
		"source": "conversation-months-v1#/rows/January/2"
	},
	{
		"id": "MONTH-February-1",
		"machine": "Machine 1",
		"month": "February",
		"year": 2026,
		"plannedMin": 480,
		"downMin": 80,
		"runMin": 400,
		"total": 790,
		"good": 760,
		"idealCycleMin": .5,
		"firstPassGood": null,
		"knownAt": "2026-04-01T00:00:00Z",
		"event": {
			"id": "MONTH-EVENT-February-1",
			"reason": "unplanned mechanical stop",
			"minutes": 80,
			"source": "conversation-months-v1#/rows"
		},
		"source": "conversation-months-v1#/rows/February/1"
	},
	{
		"id": "MONTH-February-2",
		"machine": "Machine 2",
		"month": "February",
		"year": 2026,
		"plannedMin": 480,
		"downMin": 90,
		"runMin": 390,
		"total": 780,
		"good": 750,
		"idealCycleMin": .5,
		"firstPassGood": null,
		"knownAt": "2026-04-01T00:00:00Z",
		"event": {
			"id": "MONTH-EVENT-February-2",
			"reason": "unplanned mechanical stop",
			"minutes": 90,
			"source": "conversation-months-v1#/rows"
		},
		"source": "conversation-months-v1#/rows/February/2"
	},
	{
		"id": "MONTH-March-1",
		"machine": "Machine 1",
		"month": "March",
		"year": 2026,
		"plannedMin": 480,
		"downMin": 80,
		"runMin": 400,
		"total": 832,
		"good": 800,
		"idealCycleMin": .5,
		"firstPassGood": null,
		"knownAt": "2026-04-01T00:00:00Z",
		"event": {
			"id": "MONTH-EVENT-March-1",
			"reason": "unplanned mechanical stop",
			"minutes": 80,
			"source": "conversation-months-v1#/rows"
		},
		"source": "conversation-months-v1#/rows/March/1"
	},
	{
		"id": "MONTH-March-2",
		"machine": "Machine 2",
		"month": "March",
		"year": 2026,
		"plannedMin": 480,
		"downMin": 90,
		"runMin": 390,
		"total": 811,
		"good": 780,
		"idealCycleMin": .5,
		"firstPassGood": null,
		"knownAt": "2026-04-01T00:00:00Z",
		"event": {
			"id": "MONTH-EVENT-March-2",
			"reason": "unplanned mechanical stop",
			"minutes": 90,
			"source": "conversation-months-v1#/rows"
		},
		"source": "conversation-months-v1#/rows/March/2"
	}
];
//#endregion
export { fixtureVersion, rows };
