//#region app/inputs/metric-oracle/positive-extension-v2/policy-decisions.json
var productionPolicyDecisions = [
	{
		"id": "mixed_oee",
		"metricIds": [
			"ekas.oee",
			"ekas.performance",
			"ekas.quality"
		],
		"decision": "Pooled mixed-cycle OEE requires time-weighted good time; count-quality remains separate. New homogeneous job avoids this collision; original pooled79.049479% unchanged.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "capacity",
		"metricIds": [
			"ekas.capacity_utilization",
			"ekas.capacity_attainment",
			"ekas.unused_capacity"
		],
		"decision": "Demo ideal gross capacity uses included available480min / .5min perpiece, compared to finalgood units. Confirm rated/available capacity exclusions and units in production.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "constraint",
		"metricIds": [
			"ekas.constraint_productive_utilization",
			"ekas.constraint_lost_time",
			"ekas.constraint_yield"
		],
		"decision": "Productive constraint time means ideal-total time under prior designation. Engineering must choose rate/capacity/route definition; do not label designation empirically proven.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "schedule",
		"metricIds": ["ekas.orders_completed_to_schedule", "ekas.schedule_variance"],
		"decision": "One manufacturing order, UTC same calendar day or raw timestamp difference; confirm local calendar, grace tolerance and order/job identity.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "loss",
		"metricIds": [
			"ekas.minor_stop_time",
			"ekas.maintenance_downtime",
			"ekas.downtime_contribution",
			"ekas.top_loss_contribution",
			"ekas.category_contribution",
			"ekas.cumulative_contribution"
		],
		"decision": "Minor <=2min, maintenance reasons jam/sensor, Pareto denominator included downtime only, stable alphabetic tie-break. Existing10min stops correctly yield zero minor time.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "flow",
		"metricIds": [
			"ekas.lead_time",
			"ekas.manufacturing_lead_time",
			"ekas.touch_time",
			"ekas.flow_efficiency"
		],
		"decision": "Lot release begins120min before machine allocation. Process430min is value-added demo assumption; touch setup/process/move. Business time/cutoffs require customer policy.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "repairability",
		"metricIds": ["ekas.mttf", "ekas.reliability"],
		"decision": "MTTF is complete failed nonrepairable components only, not censored population expectation. Reliability is conditional constant-hazard exponential estimate with8h horizon; no fit certification.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "delivery",
		"metricIds": [
			"ekas.on_time_delivery_otd",
			"ekas.late_order_rate",
			"ekas.average_delivery_delay",
			"ekas.fill_rate"
		],
		"decision": "Legacy OTD preserves all due orders denominator. Delay uses only complete late due orders. Fill new cohort uses actual dispatch at exact order-entry timestamp; reservation records are not shipped units. Confirm production meaning of immediate.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "inventory",
		"metricIds": [
			"ekas.inventory_turns",
			"ekas.inventory_turns_period",
			"ekas.inventory_days_dio",
			"ekas.raw_material_days",
			"ekas.wip_days_value",
			"ekas.finished_goods_days"
		],
		"decision": "Full-year numerator and full-year inventory denominator are separate annual scenario; Jul-Sep period integrates transaction balances, including replenishment/dispatch. Uniform daily accrual supports partial September postings; approve accrual/window method.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "little_law",
		"metricIds": ["ekas.wip_days_units", "ekas.little_s_law"],
		"decision": "Separate closed WIP cohort with20units and5completed/day,4day residence supplies both operands. Do not combine original monetary WIP with unrelated customer shipments.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "cost",
		"metricIds": [
			"ekas.scrap_cost",
			"ekas.scrap_cost_share",
			"ekas.cost_variance",
			"ekas.cost_variance_percent",
			"ekas.material_usage_variance",
			"ekas.labor_efficiency_variance",
			"ekas.throughput_contribution"
		],
		"decision": "Job incurred estimates use gross-piece material and finalgood standard labor, scrap values material only. Finance/Warehouse and job accounting cohorts are distinct. Contribution uses declared totally-variable category. No realized savings.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "capability",
		"metricIds": [
			"ekas.cp",
			"ekas.cpk",
			"ekas.pp",
			"ekas.ppk"
		],
		"decision": "New125piece25subgroup cohort passes explicit limited synthetic protocol: crossed10part×3operator×3trial repeatability/bias, calibration, frozen30subgroup baseline Xbar3sigma/S chart rules. This is not full AIAG ANOVA approval; normality/independence and extra run rules require production policy. Do not upgrade original unqualified characteristic.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "safety",
		"metricIds": [
			"ekas.trir",
			"ekas.dart_rate",
			"ekas.lost_time_incident_rate",
			"ekas.near_miss_rate"
		],
		"decision": "Same site/time exposure192personh. Near misses per1000workedh is proposed convention. Short-window standardized rates are illustrative, not risk estimates or regulatory report certification.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "improvement",
		"metricIds": [
			"ekas.improvement_absolute",
			"ekas.improvement_relative",
			"ekas.sustained_improvement",
			"ekas.recurrence_rate",
			"ekas.action_closure_rate",
			"ekas.on_time_action_closure"
		],
		"decision": "Matched tenbaseline/tenverification shifts, lastfive sustain with lower<=30. Signed change remains negative; benefit reduction positive only separately described. Recurrence denominator five observed sustain stop opportunities; closed actions do not certify verification success.",
		"status": "explicit demo convention; production decision required"
	},
	{
		"id": "energy",
		"metricIds": [
			"ekas.energy_intensity",
			"ekas.co_e_per_unit",
			"ekas.peak_demand"
		],
		"decision": "Electricity scope2 factor synthetic. Energy intensity denominator same-site same6day finalgood pieces. Peak only complete45min threeinterval register; whole90day peak remains missing.",
		"status": "explicit demo convention; production decision required"
	}
];
//#endregion
export { productionPolicyDecisions };
