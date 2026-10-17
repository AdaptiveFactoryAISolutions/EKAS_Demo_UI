//#region app/inputs/diagnostic-synthetic-v1.json
var diagnostic_synthetic_v1_default = {
	schemaVersion: 1,
	fixtureVersion: "ekas-diagnostic-synthetic-v1",
	synthetic: true,
	authorship: "Independent EKAS synthetic diagnostic examples; no plant alarm/historian/topology integration, copied templates, metric recalculation or verified cause.",
	qualification: "Illustrative auxiliary episodes bound to the same fictional case; they do not replace its original aggregate stop records or primary endpoint sources.",
	cases: {
		"downtime": {
			"sourceCutoff": "2026-10-06T14:00:00Z",
			"completeness": "complete",
			"coverageFrom": "2026-10-06T13:00:00Z",
			"coverageTo": "2026-10-06T14:00:00Z",
			"illustrativeStopAt": "2026-10-06T13:20:00Z",
			"records": [
				{
					"id": "DIAG-DOWNTIME-M1",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:05:00Z",
					"knownAt": "2026-10-06T13:05:00Z",
					"unit": "A",
					"value": 4.2,
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-M2",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:15:00Z",
					"knownAt": "2026-10-06T13:15:00Z",
					"unit": "A",
					"value": 7.8,
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-M3",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:25:00Z",
					"knownAt": "2026-10-06T13:25:00Z",
					"unit": "A",
					"value": 0,
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-A1",
					"kind": "alarm-activation",
					"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:16:00Z",
					"knownAt": "2026-10-06T13:16:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-A2",
					"kind": "alarm-acknowledgement",
					"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:18:00Z",
					"knownAt": "2026-10-06T13:18:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-A3",
					"kind": "alarm-clearance",
					"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:26:00Z",
					"knownAt": "2026-10-06T13:26:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-CONTROL-1",
					"kind": "controller-response",
					"eventTime": "2026-10-06T13:21:00Z",
					"knownAt": "2026-10-06T13:21:00Z",
					"unit": "controller state",
					"value": "protective-response",
					"sensorOriginId": "DIAG-DOWNTIME-CONTROL",
					"independenceGroupId": "DIAG-DOWNTIME-CONTROL",
					"sourceId": "DIAG-DOWNTIME-CONTROL-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Authored controller response follows the illustrative disturbance; sequence alone is not cause.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-HUMAN-1",
					"kind": "human-observation",
					"eventTime": "2026-10-06T13:22:00Z",
					"knownAt": "2026-10-06T13:24:00Z",
					"unit": "observation",
					"value": "independent observation recorded",
					"sensorOriginId": "DIAG-DOWNTIME-HUMAN",
					"independenceGroupId": "DIAG-DOWNTIME-HUMAN",
					"sourceId": "DIAG-DOWNTIME-OBS-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-LATE-1",
					"kind": "late-ingested-observation",
					"eventTime": "2026-10-06T13:12:00Z",
					"knownAt": "2026-10-06T15:05:00Z",
					"unit": "observation",
					"value": "independent observation recorded",
					"sensorOriginId": "DIAG-DOWNTIME-OBSERVER-LATE",
					"independenceGroupId": "DIAG-DOWNTIME-LATE-CHAIN",
					"sourceId": "independently-authored-late-observation",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-ALARM-A2",
					"kind": "alarm-activation",
					"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-2",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:27:00Z",
					"knownAt": "2026-10-06T13:27:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-DOWNTIME-M-TIE",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:27:00Z",
					"knownAt": "2026-10-06T13:27:00Z",
					"unit": "A",
					"value": 4.2,
					"sensorOriginId": "DIAG-DOWNTIME-AUX-SENSOR",
					"independenceGroupId": "DIAG-DOWNTIME-AUX-SENSOR",
					"sourceId": "DIAG-DOWNTIME-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				}
			],
			"topology": {
				"version": 1,
				"knownAt": "2026-10-06T12:00:00Z",
				"effectiveFrom": "2026-10-01T00:00:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-DOWNTIME-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-DOWNTIME-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-DOWNTIME-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-DOWNTIME-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-DOWNTIME-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-DOWNTIME-E1",
						"from": "DIAG-DOWNTIME-UPSTREAM",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-E2",
						"from": "DIAG-DOWNTIME-CONTROL",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-E3",
						"from": "DIAG-DOWNTIME-ASSOC",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-EDGE-U2",
						"from": "DIAG-DOWNTIME-UPSTREAM-2",
						"to": "DIAG-DOWNTIME-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-EDGE-CYCLE",
						"from": "DIAG-DOWNTIME-UPSTREAM",
						"to": "DIAG-DOWNTIME-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					}
				]
			},
			"laterSourceCutoff": "2026-10-06T15:15:00Z",
			"topologyVersions": [{
				"version": 1,
				"knownAt": "2026-10-06T12:00:00Z",
				"effectiveFrom": "2026-10-01T00:00:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-DOWNTIME-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-DOWNTIME-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-DOWNTIME-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-DOWNTIME-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-DOWNTIME-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-DOWNTIME-E1",
						"from": "DIAG-DOWNTIME-UPSTREAM",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-E2",
						"from": "DIAG-DOWNTIME-CONTROL",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-E3",
						"from": "DIAG-DOWNTIME-ASSOC",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-EDGE-U2",
						"from": "DIAG-DOWNTIME-UPSTREAM-2",
						"to": "DIAG-DOWNTIME-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-EDGE-CYCLE",
						"from": "DIAG-DOWNTIME-UPSTREAM",
						"to": "DIAG-DOWNTIME-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					}
				]
			}, {
				"version": 2,
				"knownAt": "2026-10-06T15:05:00Z",
				"effectiveFrom": "2026-10-06T13:10:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-DOWNTIME-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-DOWNTIME-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-DOWNTIME-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-DOWNTIME-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-DOWNTIME-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-DOWNTIME-E1",
						"from": "DIAG-DOWNTIME-UPSTREAM",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-E2",
						"from": "DIAG-DOWNTIME-CONTROL",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-E3",
						"from": "DIAG-DOWNTIME-ASSOC",
						"to": "DIAG-DOWNTIME-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-EDGE-U2",
						"from": "DIAG-DOWNTIME-UPSTREAM-2",
						"to": "DIAG-DOWNTIME-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-DOWNTIME-EDGE-CYCLE",
						"from": "DIAG-DOWNTIME-UPSTREAM",
						"to": "DIAG-DOWNTIME-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
					}
				]
			}],
			"newCycle": {
				"sourceCutoff": "2026-11-03T15:00:00Z",
				"completeness": "complete",
				"coverageFrom": "2026-11-03T14:05:00Z",
				"coverageTo": "2026-11-03T14:50:00Z",
				"illustrativeStopAt": "2026-11-03T14:20:00Z",
				"records": [
					{
						"id": "DIAG-DOWNTIME-C2-1",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:06:00Z",
						"knownAt": "2026-11-03T14:07:00Z",
						"unit": "A",
						"value": 4.2,
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-2",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:11:00Z",
						"knownAt": "2026-11-03T14:12:00Z",
						"unit": "A",
						"value": 7.8,
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-3",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:16:00Z",
						"knownAt": "2026-11-03T14:17:00Z",
						"unit": "A",
						"value": 0,
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-4",
						"kind": "alarm-activation",
						"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:21:00Z",
						"knownAt": "2026-11-03T14:22:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-5",
						"kind": "alarm-acknowledgement",
						"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:26:00Z",
						"knownAt": "2026-11-03T14:27:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-6",
						"kind": "alarm-clearance",
						"alarmInstanceId": "DIAG-DOWNTIME-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:31:00Z",
						"knownAt": "2026-11-03T14:32:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-7",
						"kind": "controller-response",
						"eventTime": "2026-11-03T14:36:00Z",
						"knownAt": "2026-11-03T14:37:00Z",
						"unit": "controller state",
						"value": "protective-response",
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-CONTROL",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-CONTROL",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Authored controller response follows the illustrative disturbance; sequence alone is not cause.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-DOWNTIME-C2-8",
						"kind": "human-observation",
						"eventTime": "2026-11-03T14:41:00Z",
						"knownAt": "2026-11-03T14:42:00Z",
						"unit": "observation",
						"value": "independent observation recorded",
						"sensorOriginId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-HUMAN",
						"independenceGroupId": "DIAG-DOWNTIME-C2-DIAG-DOWNTIME-HUMAN",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					}
				],
				"topology": {
					"version": 3,
					"knownAt": "2026-11-03T14:00:00Z",
					"effectiveFrom": "2026-11-03T14:00:00Z",
					"effectiveTo": null,
					"nodes": [
						{
							"id": "DIAG-DOWNTIME-UPSTREAM",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy."
						},
						{
							"id": "DIAG-DOWNTIME-ROOT",
							"kind": "case-asset",
							"description": "Exact canonical case asset."
						},
						{
							"id": "DIAG-DOWNTIME-CONTROL",
							"kind": "controller",
							"description": "Declared synthetic control influence."
						},
						{
							"id": "DIAG-DOWNTIME-ASSOC",
							"kind": "association",
							"description": "Declared shared operational context, not causal direction."
						},
						{
							"id": "DIAG-DOWNTIME-UPSTREAM-2",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy.",
							"label": "Illustrative preceding process"
						}
					],
					"edges": [
						{
							"id": "DIAG-DOWNTIME-E1",
							"from": "DIAG-DOWNTIME-UPSTREAM",
							"to": "DIAG-DOWNTIME-ROOT",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-E2",
							"from": "DIAG-DOWNTIME-CONTROL",
							"to": "DIAG-DOWNTIME-ROOT",
							"relationship": "control-influence",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-E3",
							"from": "DIAG-DOWNTIME-ASSOC",
							"to": "DIAG-DOWNTIME-ROOT",
							"relationship": "association",
							"direction": "undirected",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-EDGE-U2",
							"from": "DIAG-DOWNTIME-UPSTREAM-2",
							"to": "DIAG-DOWNTIME-UPSTREAM",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-EDGE-CYCLE",
							"from": "DIAG-DOWNTIME-UPSTREAM",
							"to": "DIAG-DOWNTIME-UPSTREAM-2",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						}
					]
				},
				"laterSourceCutoff": "2026-11-03T15:00:00Z",
				"topologyVersions": [{
					"version": 3,
					"knownAt": "2026-11-03T14:00:00Z",
					"effectiveFrom": "2026-11-03T14:00:00Z",
					"effectiveTo": null,
					"nodes": [
						{
							"id": "DIAG-DOWNTIME-UPSTREAM",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy."
						},
						{
							"id": "DIAG-DOWNTIME-ROOT",
							"kind": "case-asset",
							"description": "Exact canonical case asset."
						},
						{
							"id": "DIAG-DOWNTIME-CONTROL",
							"kind": "controller",
							"description": "Declared synthetic control influence."
						},
						{
							"id": "DIAG-DOWNTIME-ASSOC",
							"kind": "association",
							"description": "Declared shared operational context, not causal direction."
						},
						{
							"id": "DIAG-DOWNTIME-UPSTREAM-2",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy.",
							"label": "Illustrative preceding process"
						}
					],
					"edges": [
						{
							"id": "DIAG-DOWNTIME-E1",
							"from": "DIAG-DOWNTIME-UPSTREAM",
							"to": "DIAG-DOWNTIME-ROOT",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-E2",
							"from": "DIAG-DOWNTIME-CONTROL",
							"to": "DIAG-DOWNTIME-ROOT",
							"relationship": "control-influence",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-E3",
							"from": "DIAG-DOWNTIME-ASSOC",
							"to": "DIAG-DOWNTIME-ROOT",
							"relationship": "association",
							"direction": "undirected",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-EDGE-U2",
							"from": "DIAG-DOWNTIME-UPSTREAM-2",
							"to": "DIAG-DOWNTIME-UPSTREAM",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-DOWNTIME-EDGE-CYCLE",
							"from": "DIAG-DOWNTIME-UPSTREAM",
							"to": "DIAG-DOWNTIME-UPSTREAM-2",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-DOWNTIME-TOPOLOGY-V1"
						}
					]
				}],
				"snapshotId": "diagnostic-cycle2-nov3-1500",
				"cycle": 2
			}
		},
		"speed": {
			"sourceCutoff": "2026-10-06T14:00:00Z",
			"completeness": "complete",
			"coverageFrom": "2026-10-06T13:00:00Z",
			"coverageTo": "2026-10-06T14:00:00Z",
			"illustrativeStopAt": "2026-10-06T13:20:00Z",
			"records": [
				{
					"id": "DIAG-SPEED-M1",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:05:00Z",
					"knownAt": "2026-10-06T13:05:00Z",
					"unit": "kPa",
					"value": 420,
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-M2",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:15:00Z",
					"knownAt": "2026-10-06T13:15:00Z",
					"unit": "kPa",
					"value": 360,
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-M3",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:25:00Z",
					"knownAt": "2026-10-06T13:25:00Z",
					"unit": "kPa",
					"value": 355,
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-A1",
					"kind": "alarm-activation",
					"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:16:00Z",
					"knownAt": "2026-10-06T13:16:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-A2",
					"kind": "alarm-acknowledgement",
					"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:18:00Z",
					"knownAt": "2026-10-06T13:18:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-A3",
					"kind": "alarm-clearance",
					"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:26:00Z",
					"knownAt": "2026-10-06T13:26:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-CONTROL-1",
					"kind": "controller-response",
					"eventTime": "2026-10-06T13:21:00Z",
					"knownAt": "2026-10-06T13:21:00Z",
					"unit": "controller state",
					"value": "protective-response",
					"sensorOriginId": "DIAG-SPEED-CONTROL",
					"independenceGroupId": "DIAG-SPEED-CONTROL",
					"sourceId": "DIAG-SPEED-CONTROL-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Authored controller response follows the illustrative disturbance; sequence alone is not cause.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-HUMAN-1",
					"kind": "human-observation",
					"eventTime": "2026-10-06T13:22:00Z",
					"knownAt": "2026-10-06T13:24:00Z",
					"unit": "observation",
					"value": "independent observation recorded",
					"sensorOriginId": "DIAG-SPEED-HUMAN",
					"independenceGroupId": "DIAG-SPEED-HUMAN",
					"sourceId": "DIAG-SPEED-OBS-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-LATE-1",
					"kind": "late-ingested-observation",
					"eventTime": "2026-10-06T13:12:00Z",
					"knownAt": "2026-10-06T15:05:00Z",
					"unit": "observation",
					"value": "independent observation recorded",
					"sensorOriginId": "DIAG-SPEED-OBSERVER-LATE",
					"independenceGroupId": "DIAG-SPEED-LATE-CHAIN",
					"sourceId": "independently-authored-late-observation",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-ALARM-A2",
					"kind": "alarm-activation",
					"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-2",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:27:00Z",
					"knownAt": "2026-10-06T13:27:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-SPEED-M-TIE",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:27:00Z",
					"knownAt": "2026-10-06T13:27:00Z",
					"unit": "kPa",
					"value": 420,
					"sensorOriginId": "DIAG-SPEED-AUX-SENSOR",
					"independenceGroupId": "DIAG-SPEED-AUX-SENSOR",
					"sourceId": "DIAG-SPEED-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				}
			],
			"topology": {
				"version": 1,
				"knownAt": "2026-10-06T12:00:00Z",
				"effectiveFrom": "2026-10-01T00:00:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-SPEED-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-SPEED-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-SPEED-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-SPEED-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-SPEED-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-SPEED-E1",
						"from": "DIAG-SPEED-UPSTREAM",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-E2",
						"from": "DIAG-SPEED-CONTROL",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-E3",
						"from": "DIAG-SPEED-ASSOC",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-EDGE-U2",
						"from": "DIAG-SPEED-UPSTREAM-2",
						"to": "DIAG-SPEED-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-EDGE-CYCLE",
						"from": "DIAG-SPEED-UPSTREAM",
						"to": "DIAG-SPEED-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					}
				]
			},
			"laterSourceCutoff": "2026-10-06T15:15:00Z",
			"topologyVersions": [{
				"version": 1,
				"knownAt": "2026-10-06T12:00:00Z",
				"effectiveFrom": "2026-10-01T00:00:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-SPEED-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-SPEED-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-SPEED-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-SPEED-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-SPEED-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-SPEED-E1",
						"from": "DIAG-SPEED-UPSTREAM",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-E2",
						"from": "DIAG-SPEED-CONTROL",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-E3",
						"from": "DIAG-SPEED-ASSOC",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-EDGE-U2",
						"from": "DIAG-SPEED-UPSTREAM-2",
						"to": "DIAG-SPEED-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-EDGE-CYCLE",
						"from": "DIAG-SPEED-UPSTREAM",
						"to": "DIAG-SPEED-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					}
				]
			}, {
				"version": 2,
				"knownAt": "2026-10-06T15:05:00Z",
				"effectiveFrom": "2026-10-06T13:10:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-SPEED-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-SPEED-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-SPEED-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-SPEED-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-SPEED-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-SPEED-E1",
						"from": "DIAG-SPEED-UPSTREAM",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-E2",
						"from": "DIAG-SPEED-CONTROL",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-E3",
						"from": "DIAG-SPEED-ASSOC",
						"to": "DIAG-SPEED-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-EDGE-U2",
						"from": "DIAG-SPEED-UPSTREAM-2",
						"to": "DIAG-SPEED-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-SPEED-EDGE-CYCLE",
						"from": "DIAG-SPEED-UPSTREAM",
						"to": "DIAG-SPEED-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
					}
				]
			}],
			"newCycle": {
				"sourceCutoff": "2026-11-03T15:00:00Z",
				"completeness": "complete",
				"coverageFrom": "2026-11-03T14:05:00Z",
				"coverageTo": "2026-11-03T14:50:00Z",
				"illustrativeStopAt": "2026-11-03T14:20:00Z",
				"records": [
					{
						"id": "DIAG-SPEED-C2-1",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:06:00Z",
						"knownAt": "2026-11-03T14:07:00Z",
						"unit": "kPa",
						"value": 420,
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-2",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:11:00Z",
						"knownAt": "2026-11-03T14:12:00Z",
						"unit": "kPa",
						"value": 360,
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-3",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:16:00Z",
						"knownAt": "2026-11-03T14:17:00Z",
						"unit": "kPa",
						"value": 355,
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-4",
						"kind": "alarm-activation",
						"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:21:00Z",
						"knownAt": "2026-11-03T14:22:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-5",
						"kind": "alarm-acknowledgement",
						"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:26:00Z",
						"knownAt": "2026-11-03T14:27:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-6",
						"kind": "alarm-clearance",
						"alarmInstanceId": "DIAG-SPEED-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:31:00Z",
						"knownAt": "2026-11-03T14:32:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-7",
						"kind": "controller-response",
						"eventTime": "2026-11-03T14:36:00Z",
						"knownAt": "2026-11-03T14:37:00Z",
						"unit": "controller state",
						"value": "protective-response",
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-CONTROL",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-CONTROL",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Authored controller response follows the illustrative disturbance; sequence alone is not cause.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-SPEED-C2-8",
						"kind": "human-observation",
						"eventTime": "2026-11-03T14:41:00Z",
						"knownAt": "2026-11-03T14:42:00Z",
						"unit": "observation",
						"value": "independent observation recorded",
						"sensorOriginId": "DIAG-SPEED-C2-DIAG-SPEED-HUMAN",
						"independenceGroupId": "DIAG-SPEED-C2-DIAG-SPEED-HUMAN",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					}
				],
				"topology": {
					"version": 3,
					"knownAt": "2026-11-03T14:00:00Z",
					"effectiveFrom": "2026-11-03T14:00:00Z",
					"effectiveTo": null,
					"nodes": [
						{
							"id": "DIAG-SPEED-UPSTREAM",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy."
						},
						{
							"id": "DIAG-SPEED-ROOT",
							"kind": "case-asset",
							"description": "Exact canonical case asset."
						},
						{
							"id": "DIAG-SPEED-CONTROL",
							"kind": "controller",
							"description": "Declared synthetic control influence."
						},
						{
							"id": "DIAG-SPEED-ASSOC",
							"kind": "association",
							"description": "Declared shared operational context, not causal direction."
						},
						{
							"id": "DIAG-SPEED-UPSTREAM-2",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy.",
							"label": "Illustrative preceding process"
						}
					],
					"edges": [
						{
							"id": "DIAG-SPEED-E1",
							"from": "DIAG-SPEED-UPSTREAM",
							"to": "DIAG-SPEED-ROOT",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-E2",
							"from": "DIAG-SPEED-CONTROL",
							"to": "DIAG-SPEED-ROOT",
							"relationship": "control-influence",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-E3",
							"from": "DIAG-SPEED-ASSOC",
							"to": "DIAG-SPEED-ROOT",
							"relationship": "association",
							"direction": "undirected",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-EDGE-U2",
							"from": "DIAG-SPEED-UPSTREAM-2",
							"to": "DIAG-SPEED-UPSTREAM",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-EDGE-CYCLE",
							"from": "DIAG-SPEED-UPSTREAM",
							"to": "DIAG-SPEED-UPSTREAM-2",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						}
					]
				},
				"laterSourceCutoff": "2026-11-03T15:00:00Z",
				"topologyVersions": [{
					"version": 3,
					"knownAt": "2026-11-03T14:00:00Z",
					"effectiveFrom": "2026-11-03T14:00:00Z",
					"effectiveTo": null,
					"nodes": [
						{
							"id": "DIAG-SPEED-UPSTREAM",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy."
						},
						{
							"id": "DIAG-SPEED-ROOT",
							"kind": "case-asset",
							"description": "Exact canonical case asset."
						},
						{
							"id": "DIAG-SPEED-CONTROL",
							"kind": "controller",
							"description": "Declared synthetic control influence."
						},
						{
							"id": "DIAG-SPEED-ASSOC",
							"kind": "association",
							"description": "Declared shared operational context, not causal direction."
						},
						{
							"id": "DIAG-SPEED-UPSTREAM-2",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy.",
							"label": "Illustrative preceding process"
						}
					],
					"edges": [
						{
							"id": "DIAG-SPEED-E1",
							"from": "DIAG-SPEED-UPSTREAM",
							"to": "DIAG-SPEED-ROOT",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-E2",
							"from": "DIAG-SPEED-CONTROL",
							"to": "DIAG-SPEED-ROOT",
							"relationship": "control-influence",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-E3",
							"from": "DIAG-SPEED-ASSOC",
							"to": "DIAG-SPEED-ROOT",
							"relationship": "association",
							"direction": "undirected",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-EDGE-U2",
							"from": "DIAG-SPEED-UPSTREAM-2",
							"to": "DIAG-SPEED-UPSTREAM",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-SPEED-EDGE-CYCLE",
							"from": "DIAG-SPEED-UPSTREAM",
							"to": "DIAG-SPEED-UPSTREAM-2",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-SPEED-TOPOLOGY-V1"
						}
					]
				}],
				"snapshotId": "diagnostic-cycle2-nov3-1500",
				"cycle": 2
			}
		},
		"quality": {
			"sourceCutoff": "2026-10-06T14:00:00Z",
			"completeness": "complete",
			"coverageFrom": "2026-10-06T13:00:00Z",
			"coverageTo": "2026-10-06T14:00:00Z",
			"illustrativeStopAt": "2026-10-06T13:20:00Z",
			"records": [
				{
					"id": "DIAG-QUALITY-M1",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:05:00Z",
					"knownAt": "2026-10-06T13:05:00Z",
					"unit": "°C",
					"value": 180,
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-M2",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:15:00Z",
					"knownAt": "2026-10-06T13:15:00Z",
					"unit": "°C",
					"value": 192,
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-M3",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:25:00Z",
					"knownAt": "2026-10-06T13:25:00Z",
					"unit": "°C",
					"value": 193,
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-A1",
					"kind": "alarm-activation",
					"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:16:00Z",
					"knownAt": "2026-10-06T13:16:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-A2",
					"kind": "alarm-acknowledgement",
					"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:18:00Z",
					"knownAt": "2026-10-06T13:18:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-A3",
					"kind": "alarm-clearance",
					"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-1",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:26:00Z",
					"knownAt": "2026-10-06T13:26:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-CONTROL-1",
					"kind": "controller-response",
					"eventTime": "2026-10-06T13:21:00Z",
					"knownAt": "2026-10-06T13:21:00Z",
					"unit": "controller state",
					"value": "protective-response",
					"sensorOriginId": "DIAG-QUALITY-CONTROL",
					"independenceGroupId": "DIAG-QUALITY-CONTROL",
					"sourceId": "DIAG-QUALITY-CONTROL-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Authored controller response follows the illustrative disturbance; sequence alone is not cause.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-HUMAN-1",
					"kind": "human-observation",
					"eventTime": "2026-10-06T13:22:00Z",
					"knownAt": "2026-10-06T13:24:00Z",
					"unit": "observation",
					"value": "independent observation recorded",
					"sensorOriginId": "DIAG-QUALITY-HUMAN",
					"independenceGroupId": "DIAG-QUALITY-HUMAN",
					"sourceId": "DIAG-QUALITY-OBS-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-LATE-1",
					"kind": "late-ingested-observation",
					"eventTime": "2026-10-06T13:12:00Z",
					"knownAt": "2026-10-06T15:05:00Z",
					"unit": "observation",
					"value": "independent observation recorded",
					"sensorOriginId": "DIAG-QUALITY-OBSERVER-LATE",
					"independenceGroupId": "DIAG-QUALITY-LATE-CHAIN",
					"sourceId": "independently-authored-late-observation",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-ALARM-A2",
					"kind": "alarm-activation",
					"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-2",
					"configurationVersion": 1,
					"eventTime": "2026-10-06T13:27:00Z",
					"knownAt": "2026-10-06T13:27:00Z",
					"unit": "alarm lifecycle event",
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-ALARM-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				},
				{
					"id": "DIAG-QUALITY-M-TIE",
					"kind": "measurement",
					"eventTime": "2026-10-06T13:27:00Z",
					"knownAt": "2026-10-06T13:27:00Z",
					"unit": "°C",
					"value": 180,
					"sensorOriginId": "DIAG-QUALITY-AUX-SENSOR",
					"independenceGroupId": "DIAG-QUALITY-AUX-SENSOR",
					"sourceId": "DIAG-QUALITY-HIST-V1",
					"sourceVersion": 1,
					"quality": "synthetic-illustrative",
					"cycle": 1,
					"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
					"sampleFrequency": "sparse authored samples; no continuous historian coverage",
					"clockUncertaintyMs": 1e3
				}
			],
			"topology": {
				"version": 1,
				"knownAt": "2026-10-06T12:00:00Z",
				"effectiveFrom": "2026-10-01T00:00:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-QUALITY-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-QUALITY-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-QUALITY-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-QUALITY-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-QUALITY-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-QUALITY-E1",
						"from": "DIAG-QUALITY-UPSTREAM",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-E2",
						"from": "DIAG-QUALITY-CONTROL",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-E3",
						"from": "DIAG-QUALITY-ASSOC",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-EDGE-U2",
						"from": "DIAG-QUALITY-UPSTREAM-2",
						"to": "DIAG-QUALITY-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-EDGE-CYCLE",
						"from": "DIAG-QUALITY-UPSTREAM",
						"to": "DIAG-QUALITY-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					}
				]
			},
			"laterSourceCutoff": "2026-10-06T15:15:00Z",
			"topologyVersions": [{
				"version": 1,
				"knownAt": "2026-10-06T12:00:00Z",
				"effectiveFrom": "2026-10-01T00:00:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-QUALITY-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-QUALITY-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-QUALITY-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-QUALITY-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-QUALITY-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-QUALITY-E1",
						"from": "DIAG-QUALITY-UPSTREAM",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-E2",
						"from": "DIAG-QUALITY-CONTROL",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-E3",
						"from": "DIAG-QUALITY-ASSOC",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-EDGE-U2",
						"from": "DIAG-QUALITY-UPSTREAM-2",
						"to": "DIAG-QUALITY-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-EDGE-CYCLE",
						"from": "DIAG-QUALITY-UPSTREAM",
						"to": "DIAG-QUALITY-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					}
				]
			}, {
				"version": 2,
				"knownAt": "2026-10-06T15:05:00Z",
				"effectiveFrom": "2026-10-06T13:10:00Z",
				"effectiveTo": null,
				"nodes": [
					{
						"id": "DIAG-QUALITY-UPSTREAM",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy."
					},
					{
						"id": "DIAG-QUALITY-ROOT",
						"kind": "case-asset",
						"description": "Exact canonical case asset."
					},
					{
						"id": "DIAG-QUALITY-CONTROL",
						"kind": "controller",
						"description": "Declared synthetic control influence."
					},
					{
						"id": "DIAG-QUALITY-ASSOC",
						"kind": "association",
						"description": "Declared shared operational context, not causal direction."
					},
					{
						"id": "DIAG-QUALITY-UPSTREAM-2",
						"kind": "process-node",
						"description": "Declared synthetic upstream process relationship, not lot genealogy.",
						"label": "Illustrative preceding process"
					}
				],
				"edges": [
					{
						"id": "DIAG-QUALITY-E1",
						"from": "DIAG-QUALITY-UPSTREAM",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-E2",
						"from": "DIAG-QUALITY-CONTROL",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "control-influence",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-E3",
						"from": "DIAG-QUALITY-ASSOC",
						"to": "DIAG-QUALITY-ROOT",
						"relationship": "association",
						"direction": "undirected",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-EDGE-U2",
						"from": "DIAG-QUALITY-UPSTREAM-2",
						"to": "DIAG-QUALITY-UPSTREAM",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					},
					{
						"id": "DIAG-QUALITY-EDGE-CYCLE",
						"from": "DIAG-QUALITY-UPSTREAM",
						"to": "DIAG-QUALITY-UPSTREAM-2",
						"relationship": "physical-flow",
						"direction": "directed",
						"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
					}
				]
			}],
			"newCycle": {
				"sourceCutoff": "2026-11-03T15:00:00Z",
				"completeness": "complete",
				"coverageFrom": "2026-11-03T14:05:00Z",
				"coverageTo": "2026-11-03T14:50:00Z",
				"illustrativeStopAt": "2026-11-03T14:20:00Z",
				"records": [
					{
						"id": "DIAG-QUALITY-C2-1",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:06:00Z",
						"knownAt": "2026-11-03T14:07:00Z",
						"unit": "°C",
						"value": 180,
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-2",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:11:00Z",
						"knownAt": "2026-11-03T14:12:00Z",
						"unit": "°C",
						"value": 192,
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-3",
						"kind": "measurement",
						"eventTime": "2026-11-03T14:16:00Z",
						"knownAt": "2026-11-03T14:17:00Z",
						"unit": "°C",
						"value": 193,
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Independently authored synthetic auxiliary observation; not the primary endpoint.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-4",
						"kind": "alarm-activation",
						"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:21:00Z",
						"knownAt": "2026-11-03T14:22:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-5",
						"kind": "alarm-acknowledgement",
						"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:26:00Z",
						"knownAt": "2026-11-03T14:27:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-6",
						"kind": "alarm-clearance",
						"alarmInstanceId": "DIAG-QUALITY-ALARM-INSTANCE-1",
						"configurationVersion": 1,
						"eventTime": "2026-11-03T14:31:00Z",
						"knownAt": "2026-11-03T14:32:00Z",
						"unit": "alarm lifecycle event",
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-AUX-SENSOR",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Synthetic alarm lifecycle generated from the same auxiliary sensor origin; no actual alarm command.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-7",
						"kind": "controller-response",
						"eventTime": "2026-11-03T14:36:00Z",
						"knownAt": "2026-11-03T14:37:00Z",
						"unit": "controller state",
						"value": "protective-response",
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-CONTROL",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-CONTROL",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Authored controller response follows the illustrative disturbance; sequence alone is not cause.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					},
					{
						"id": "DIAG-QUALITY-C2-8",
						"kind": "human-observation",
						"eventTime": "2026-11-03T14:41:00Z",
						"knownAt": "2026-11-03T14:42:00Z",
						"unit": "observation",
						"value": "independent observation recorded",
						"sensorOriginId": "DIAG-QUALITY-C2-DIAG-QUALITY-HUMAN",
						"independenceGroupId": "DIAG-QUALITY-C2-DIAG-QUALITY-HUMAN",
						"sourceId": "independently-authored-recurrence-episode-v1",
						"sourceVersion": 1,
						"quality": "synthetic-illustrative",
						"cycle": 2,
						"text": "Separate synthetic observation source; still not empirical physical causal qualification.",
						"sampleFrequency": "sparse authored samples; no continuous historian coverage",
						"clockUncertaintyMs": 1e3
					}
				],
				"topology": {
					"version": 3,
					"knownAt": "2026-11-03T14:00:00Z",
					"effectiveFrom": "2026-11-03T14:00:00Z",
					"effectiveTo": null,
					"nodes": [
						{
							"id": "DIAG-QUALITY-UPSTREAM",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy."
						},
						{
							"id": "DIAG-QUALITY-ROOT",
							"kind": "case-asset",
							"description": "Exact canonical case asset."
						},
						{
							"id": "DIAG-QUALITY-CONTROL",
							"kind": "controller",
							"description": "Declared synthetic control influence."
						},
						{
							"id": "DIAG-QUALITY-ASSOC",
							"kind": "association",
							"description": "Declared shared operational context, not causal direction."
						},
						{
							"id": "DIAG-QUALITY-UPSTREAM-2",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy.",
							"label": "Illustrative preceding process"
						}
					],
					"edges": [
						{
							"id": "DIAG-QUALITY-E1",
							"from": "DIAG-QUALITY-UPSTREAM",
							"to": "DIAG-QUALITY-ROOT",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-E2",
							"from": "DIAG-QUALITY-CONTROL",
							"to": "DIAG-QUALITY-ROOT",
							"relationship": "control-influence",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-E3",
							"from": "DIAG-QUALITY-ASSOC",
							"to": "DIAG-QUALITY-ROOT",
							"relationship": "association",
							"direction": "undirected",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-EDGE-U2",
							"from": "DIAG-QUALITY-UPSTREAM-2",
							"to": "DIAG-QUALITY-UPSTREAM",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-EDGE-CYCLE",
							"from": "DIAG-QUALITY-UPSTREAM",
							"to": "DIAG-QUALITY-UPSTREAM-2",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						}
					]
				},
				"laterSourceCutoff": "2026-11-03T15:00:00Z",
				"topologyVersions": [{
					"version": 3,
					"knownAt": "2026-11-03T14:00:00Z",
					"effectiveFrom": "2026-11-03T14:00:00Z",
					"effectiveTo": null,
					"nodes": [
						{
							"id": "DIAG-QUALITY-UPSTREAM",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy."
						},
						{
							"id": "DIAG-QUALITY-ROOT",
							"kind": "case-asset",
							"description": "Exact canonical case asset."
						},
						{
							"id": "DIAG-QUALITY-CONTROL",
							"kind": "controller",
							"description": "Declared synthetic control influence."
						},
						{
							"id": "DIAG-QUALITY-ASSOC",
							"kind": "association",
							"description": "Declared shared operational context, not causal direction."
						},
						{
							"id": "DIAG-QUALITY-UPSTREAM-2",
							"kind": "process-node",
							"description": "Declared synthetic upstream process relationship, not lot genealogy.",
							"label": "Illustrative preceding process"
						}
					],
					"edges": [
						{
							"id": "DIAG-QUALITY-E1",
							"from": "DIAG-QUALITY-UPSTREAM",
							"to": "DIAG-QUALITY-ROOT",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-E2",
							"from": "DIAG-QUALITY-CONTROL",
							"to": "DIAG-QUALITY-ROOT",
							"relationship": "control-influence",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-E3",
							"from": "DIAG-QUALITY-ASSOC",
							"to": "DIAG-QUALITY-ROOT",
							"relationship": "association",
							"direction": "undirected",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-EDGE-U2",
							"from": "DIAG-QUALITY-UPSTREAM-2",
							"to": "DIAG-QUALITY-UPSTREAM",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						},
						{
							"id": "DIAG-QUALITY-EDGE-CYCLE",
							"from": "DIAG-QUALITY-UPSTREAM",
							"to": "DIAG-QUALITY-UPSTREAM-2",
							"relationship": "physical-flow",
							"direction": "directed",
							"sourceId": "DIAG-QUALITY-TOPOLOGY-V1"
						}
					]
				}],
				"snapshotId": "diagnostic-cycle2-nov3-1500",
				"cycle": 2
			}
		}
	}
};
//#endregion
export { diagnostic_synthetic_v1_default as default };
