//#region app/inputs/metric-oracle/metric-contract.json
var definitions = [
	{
		"id": "ekas.oee",
		"expression": "100 * ideal_good_min / planned_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-001",
			"OCC-156",
			"OCC-163",
			"OCC-254"
		],
		"sourceFormulas": [
			"Availability × Performance × Quality",
			"See source concept / governance requirement",
			"≥ 85%"
		],
		"aliases": ["OEE"],
		"families": [
			"OEE and equipment effectiveness",
			"Plant Head Daily Operations Audit",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			1,
			20,
			28
		],
		"requiredOperands": ["ideal_good_min", "planned_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source A*P*Q with count Quality cannot generally equal sum(ideal good time)/planned across different cycle times. Homogeneous definition accepted; mixed-product time-weighted OEE proposed, keep count-quality separate."],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.availability",
		"expression": "100 * run_min / planned_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-002",
			"OCC-046",
			"OCC-255"
		],
		"sourceFormulas": [
			"Run Time / Planned Production Time",
			"Run Time / Planned Production Time × 100",
			"See source concept / governance requirement"
		],
		"aliases": ["Availability", "Uptime %"],
		"families": [
			"Downtime and loss",
			"OEE and equipment effectiveness",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			1,
			5,
			28
		],
		"requiredOperands": ["planned_min", "run_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee", "loss"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}, {
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.run_time",
		"expression": "planned_min - downtime_min",
		"unit": "min",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-003"],
		"sourceFormulas": ["Planned Production Time − Downtime"],
		"aliases": ["Run Time"],
		"families": ["OEE and equipment effectiveness"],
		"sections": [1],
		"requiredOperands": ["downtime_min", "planned_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.performance",
		"expression": "100 * ideal_total_min / run_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-004", "OCC-256"],
		"sourceFormulas": ["(Ideal Cycle Time × Total Count) / Run Time", "See source concept / governance requirement"],
		"aliases": ["Performance"],
		"families": ["OEE and equipment effectiveness", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [1, 28],
		"requiredOperands": ["ideal_total_min", "run_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.quality",
		"expression": "100 * good_units / total_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-005",
			"OCC-061",
			"OCC-062",
			"OCC-257",
			"OCC-274"
		],
		"sourceFormulas": [
			"Good Count / Total Count",
			"Good Units / Total Units × 100",
			"See source concept / governance requirement"
		],
		"aliases": [
			"Quality",
			"Quality Rate",
			"Yield",
			"yield"
		],
		"families": [
			"OEE and equipment effectiveness",
			"Quality",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			1,
			7,
			28
		],
		"requiredOperands": ["good_units", "total_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Final accepted unique-unit ratio includes accepted rework under approved disposition; FPY excludes rework. For mixed cycles time-weighted OEE quality is a distinct metric, not this count ratio."],
		"familyPolicyIDs": ["production_oee", "quality"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}, {
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.overall_utilization",
		"expression": "100 * run_min / calendar_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-006",
			"OCC-259",
			"OCC-306"
		],
		"sourceFormulas": ["Run Time / Calendar Time", "See source concept / governance requirement"],
		"aliases": ["Overall Utilization", "utilization"],
		"families": ["OEE and equipment effectiveness", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [1, 28],
		"requiredOperands": ["calendar_min", "run_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.asset_utilization",
		"expression": "100 * operating_min / available_asset_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-007",
			"OCC-259",
			"OCC-306"
		],
		"sourceFormulas": ["Actual Operating Time / Available Asset Time", "See source concept / governance requirement"],
		"aliases": ["Asset Utilization", "utilization"],
		"families": ["OEE and equipment effectiveness", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [1, 28],
		"requiredOperands": ["available_asset_min", "operating_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.teep",
		"expression": "100 * ideal_good_min / calendar_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-008", "OCC-258"],
		"sourceFormulas": ["OEE × Loading where Loading = Planned Production Time / Calendar Time", "See source concept / governance requirement"],
		"aliases": ["TEEP"],
		"families": ["OEE and equipment effectiveness", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [1, 28],
		"requiredOperands": ["calendar_min", "ideal_good_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.loading",
		"expression": "100 * planned_min / calendar_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-009"],
		"sourceFormulas": ["Planned Production Time / Calendar Time"],
		"aliases": ["Loading"],
		"families": ["OEE and equipment effectiveness"],
		"sections": [1],
		"requiredOperands": ["calendar_min", "planned_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.oee_gap_to_target",
		"expression": "target_pct - actual_pct",
		"unit": "percentage_point",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-010"],
		"sourceFormulas": ["Target OEE − Actual OEE"],
		"aliases": ["OEE Gap to Target"],
		"families": ["OEE and equipment effectiveness"],
		"sections": [1],
		"requiredOperands": ["actual_pct", "target_pct"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.oee_improvement",
		"expression": "current_pct - baseline_pct",
		"unit": "percentage_point",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-011"],
		"sourceFormulas": ["Current OEE − Baseline OEE"],
		"aliases": ["OEE Improvement"],
		"families": ["OEE and equipment effectiveness"],
		"sections": [1],
		"requiredOperands": ["baseline_pct", "current_pct"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_oee"],
		"grainPolicies": [{
			"familyID": "production_oee",
			"grain": "job/operation/part-revision planned asset-time segment",
			"recordBindings": "counts + jobs + standards + disjoint run/downtime intervals",
			"validScopes": [
				"site",
				"line",
				"asset",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Pool planned/run/ideal-total/ideal-good times. Count-quality pools unique counts. Homogeneous A*P*countQ matches ideal-good/planned; mixed cycle scope requires declared time-weightedQ as separate definition."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.production_vs_plan",
		"expression": "100 * actual_output / plan_output",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-012",
			"OCC-013",
			"OCC-028",
			"OCC-155",
			"OCC-162",
			"OCC-260",
			"OCC-262"
		],
		"sourceFormulas": [
			"Actual Output / Target Output × 100",
			"Actual Production / Planned Production × 100",
			"Actual production / Planned production × 100",
			"See source concept / governance requirement",
			"≥ 100%"
		],
		"aliases": [
			"Plan Attainment",
			"Production Attainment",
			"Production vs Plan",
			"attainment",
			"production vs plan"
		],
		"families": [
			"Plant Head Daily Operations Audit",
			"Production and output",
			"Schedule metrics",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			2,
			3,
			20,
			28
		],
		"requiredOperands": ["actual_output", "plan_output"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity", "schedule"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}, {
			"familyID": "schedule",
			"grain": "frozen scheduled order/job/version",
			"recordBindings": "schedules + job completion events",
			"validScopes": [
				"site",
				"line",
				"job",
				"day"
			],
			"aggregation": "Quantity-attainment and scheduled-date order count are separate. Scope due cohort at as_of; preserve original plan version and defined tolerance."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.production_variance",
		"expression": "actual_output - plan_output",
		"unit": "good_unit",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-014"],
		"sourceFormulas": ["Actual Output − Planned Output"],
		"aliases": ["Production Variance"],
		"families": ["Production and output"],
		"sections": [2],
		"requiredOperands": ["actual_output", "plan_output"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.net_throughput",
		"expression": "good_units / elapsed_h",
		"unit": "good_unit/h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-015",
			"OCC-017",
			"OCC-261"
		],
		"sourceFormulas": ["Good Units Produced / Time Period", "See source concept / governance requirement"],
		"aliases": [
			"Net Throughput",
			"Throughput",
			"throughput"
		],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["elapsed_h", "good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.gross_throughput",
		"expression": "total_units / elapsed_h",
		"unit": "unit/h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-016", "OCC-261"],
		"sourceFormulas": ["See source concept / governance requirement", "Total Units Produced / Time Period"],
		"aliases": ["Gross Throughput", "throughput"],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["elapsed_h", "total_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.run_rate",
		"expression": "total_units / operating_h",
		"unit": "unit/h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-018",
			"OCC-261",
			"OCC-263"
		],
		"sourceFormulas": ["See source concept / governance requirement", "Units Produced / Operating Time"],
		"aliases": [
			"Run Rate",
			"run rate",
			"throughput"
		],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["operating_h", "total_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.target_run_rate",
		"expression": "60 / ideal_cycle_min",
		"unit": "unit/h",
		"aggregation": "lookup_single_standard",
		"sourceOccurrences": ["OCC-019"],
		"sourceFormulas": ["1 / Ideal Cycle Time"],
		"aliases": ["Target Run Rate"],
		"families": ["Production and output"],
		"sections": [2],
		"requiredOperands": ["ideal_cycle_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.run_rate_attainment",
		"expression": "100 * actual_rate / target_rate",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-020", "OCC-262"],
		"sourceFormulas": ["Actual Run Rate / Target Run Rate × 100", "See source concept / governance requirement"],
		"aliases": ["Run Rate Attainment", "attainment"],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["actual_rate", "target_rate"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.capacity_utilization",
		"expression": "100 * actual_output / rated_capacity",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-021",
			"OCC-259",
			"OCC-264",
			"OCC-306"
		],
		"sourceFormulas": ["Actual Output / Rated Capacity × 100", "See source concept / governance requirement"],
		"aliases": [
			"Capacity Utilization",
			"capacity utilization",
			"utilization"
		],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["actual_output", "rated_capacity"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.capacity_attainment",
		"expression": "100 * actual_output / available_capacity",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-022", "OCC-262"],
		"sourceFormulas": ["Actual Output / Available Capacity × 100", "See source concept / governance requirement"],
		"aliases": ["Capacity Attainment", "attainment"],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["actual_output", "available_capacity"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.unused_capacity",
		"expression": "available_capacity - actual_output",
		"unit": "good_unit",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-023"],
		"sourceFormulas": ["Available Capacity − Actual Output"],
		"aliases": ["Unused Capacity"],
		"families": ["Production and output"],
		"sections": [2],
		"requiredOperands": ["actual_output", "available_capacity"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.constraint_utilization",
		"expression": "100 * constraint_run_min / constraint_available_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-024",
			"OCC-259",
			"OCC-306"
		],
		"sourceFormulas": ["Constraint Run Time / Constraint Available Time × 100", "See source concept / governance requirement"],
		"aliases": ["Constraint Utilization", "utilization"],
		"families": ["Production and output", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [2, 28],
		"requiredOperands": ["constraint_available_min", "constraint_run_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["KPI024 uses run time; KPI146 uses productive time. Preserve separate metric IDs unless plant defines them equal."],
		"familyPolicyIDs": ["production_capacity"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.constraint_productive_utilization",
		"expression": "100 * constraint_productive_min / constraint_available_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-146"],
		"sourceFormulas": ["Constraint Productive Time / Constraint Available Time × 100"],
		"aliases": ["Constraint Utilization"],
		"families": ["Constraint / Theory of Constraints measures"],
		"sections": [18],
		"requiredOperands": ["constraint_available_min", "constraint_productive_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["KPI024 uses run time; KPI146 uses productive time. Preserve separate metric IDs unless plant defines them equal."],
		"familyPolicyIDs": ["constraint"],
		"grainPolicies": [{
			"familyID": "constraint",
			"grain": "effective dated actual constraint operation",
			"recordBindings": "jobs + counts + constraint assignments + standards",
			"validScopes": [
				"constraint",
				"line",
				"operation",
				"window"
			],
			"aggregation": "Run utilization distinct from productive utilization. Units/time good output; throughput-contribution financial model not operational quantity."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.constraint_throughput",
		"expression": "constraint_good_units / elapsed_h",
		"unit": "good_unit/h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-025",
			"OCC-147",
			"OCC-261"
		],
		"sourceFormulas": [
			"Good Units Through Constraint / Time",
			"Good Units through Constraint / Time",
			"See source concept / governance requirement"
		],
		"aliases": [
			"Bottleneck Throughput",
			"Constraint Throughput",
			"throughput"
		],
		"families": [
			"Constraint / Theory of Constraints measures",
			"Production and output",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			2,
			18,
			28
		],
		"requiredOperands": ["constraint_good_units", "elapsed_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["production_capacity", "constraint"],
		"grainPolicies": [{
			"familyID": "production_capacity",
			"grain": "job output matched to frozen plan/capacity segment",
			"recordBindings": "counts + jobs + schedules + governed capacity calendar",
			"validScopes": [
				"site",
				"line",
				"job",
				"operation",
				"part-revision",
				"shift",
				"day"
			],
			"aggregation": "Sum nonduplicated compatible quantities; rates sum eligible output/exposure. Plant exposure is asset-time for operating rates; calendar throughput denominator must be explicitly plant elapsed vs asset-hour, not interchanged."
		}, {
			"familyID": "constraint",
			"grain": "effective dated actual constraint operation",
			"recordBindings": "jobs + counts + constraint assignments + standards",
			"validScopes": [
				"constraint",
				"line",
				"operation",
				"window"
			],
			"aggregation": "Run utilization distinct from productive utilization. Units/time good output; throughput-contribution financial model not operational quantity."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.schedule_adherence",
		"expression": "100 * as_scheduled_qty / scheduled_qty",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-026",
			"OCC-159",
			"OCC-166",
			"OCC-291"
		],
		"sourceFormulas": [
			"Production completed according to schedule / Scheduled production × 100",
			"Production completed as scheduled / Scheduled production × 100",
			"See source concept / governance requirement",
			"≥ 95%"
		],
		"aliases": ["Schedule Adherence", "schedule adherence"],
		"families": [
			"Plant Head Daily Operations Audit",
			"Schedule metrics",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			3,
			20,
			28
		],
		"requiredOperands": ["as_scheduled_qty", "scheduled_qty"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source does not settle quantity/order/job grain or time tolerance. Proposed training convention: completed quantity by frozen scheduled deadline, no substitution for order-count compliance."],
		"familyPolicyIDs": ["schedule"],
		"grainPolicies": [{
			"familyID": "schedule",
			"grain": "frozen scheduled order/job/version",
			"recordBindings": "schedules + job completion events",
			"validScopes": [
				"site",
				"line",
				"job",
				"day"
			],
			"aggregation": "Quantity-attainment and scheduled-date order count are separate. Scope due cohort at as_of; preserve original plan version and defined tolerance."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.schedule_attainment",
		"expression": "100 * completed_qty / scheduled_qty",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-027", "OCC-262"],
		"sourceFormulas": ["Actual quantity completed / Scheduled quantity × 100", "See source concept / governance requirement"],
		"aliases": ["Schedule Attainment", "attainment"],
		"families": ["Schedule metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [3, 28],
		"requiredOperands": ["completed_qty", "scheduled_qty"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["schedule"],
		"grainPolicies": [{
			"familyID": "schedule",
			"grain": "frozen scheduled order/job/version",
			"recordBindings": "schedules + job completion events",
			"validScopes": [
				"site",
				"line",
				"job",
				"day"
			],
			"aggregation": "Quantity-attainment and scheduled-date order count are separate. Scope due cohort at as_of; preserve original plan version and defined tolerance."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.schedule_variance",
		"expression": "actual_completion_epoch_min - planned_completion_epoch_min",
		"unit": "min",
		"aggregation": "per_object_distribution",
		"sourceOccurrences": ["OCC-029"],
		"sourceFormulas": ["Actual Completion − Planned Completion"],
		"aliases": ["Schedule Variance"],
		"families": ["Schedule metrics"],
		"sections": [3],
		"requiredOperands": ["actual_completion_epoch_min", "planned_completion_epoch_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["schedule"],
		"grainPolicies": [{
			"familyID": "schedule",
			"grain": "frozen scheduled order/job/version",
			"recordBindings": "schedules + job completion events",
			"validScopes": [
				"site",
				"line",
				"job",
				"day"
			],
			"aggregation": "Quantity-attainment and scheduled-date order count are separate. Scope due cohort at as_of; preserve original plan version and defined tolerance."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.orders_completed_to_schedule",
		"expression": "100 * orders_on_scheduled_date / scheduled_orders",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-030"],
		"sourceFormulas": ["Orders completed on scheduled date / Total scheduled orders × 100"],
		"aliases": ["Orders Completed to Schedule"],
		"families": ["Schedule metrics"],
		"sections": [3],
		"requiredOperands": ["orders_on_scheduled_date", "scheduled_orders"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["schedule"],
		"grainPolicies": [{
			"familyID": "schedule",
			"grain": "frozen scheduled order/job/version",
			"recordBindings": "schedules + job completion events",
			"validScopes": [
				"site",
				"line",
				"job",
				"day"
			],
			"aggregation": "Quantity-attainment and scheduled-date order count are separate. Scope due cohort at as_of; preserve original plan version and defined tolerance."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.actual_cycle_time",
		"expression": "operating_min / total_units",
		"unit": "min/unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-031", "OCC-265"],
		"sourceFormulas": ["Operating Time / Units Produced", "See source concept / governance requirement"],
		"aliases": ["Actual Cycle Time", "cycle time"],
		"families": ["Cycle time and takt", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [4, 28],
		"requiredOperands": ["operating_min", "total_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.ideal_cycle_time",
		"expression": "ideal_cycle_min",
		"unit": "min/unit",
		"aggregation": "lookup_single_standard",
		"sourceOccurrences": ["OCC-032"],
		"sourceFormulas": ["Best demonstrated or engineered cycle time per unit"],
		"aliases": ["Ideal Cycle Time"],
		"families": ["Cycle time and takt"],
		"sections": [4],
		"requiredOperands": ["ideal_cycle_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cycle_time_variance",
		"expression": "actual_cycle_min - standard_cycle_min",
		"unit": "min/unit",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-033"],
		"sourceFormulas": ["Actual Cycle Time − Standard Cycle Time"],
		"aliases": ["Cycle Time Variance"],
		"families": ["Cycle time and takt"],
		"sections": [4],
		"requiredOperands": ["actual_cycle_min", "standard_cycle_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cycle_time_performance",
		"expression": "100 * standard_cycle_min / actual_cycle_min",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-034"],
		"sourceFormulas": ["Standard Cycle Time / Actual Cycle Time × 100"],
		"aliases": ["Cycle Time Performance"],
		"families": ["Cycle time and takt"],
		"sections": [4],
		"requiredOperands": ["actual_cycle_min", "standard_cycle_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.takt_time",
		"expression": "available_production_min / demand_units",
		"unit": "min/unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-035", "OCC-266"],
		"sourceFormulas": ["Available Production Time / Customer Demand", "See source concept / governance requirement"],
		"aliases": ["Takt Time", "takt"],
		"families": ["Cycle time and takt", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [4, 28],
		"requiredOperands": ["available_production_min", "demand_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.takt_attainment",
		"expression": "100 * takt_min / actual_cycle_min",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-036", "OCC-262"],
		"sourceFormulas": ["See source concept / governance requirement", "Takt Time / Actual Cycle Time × 100"],
		"aliases": ["Takt Attainment", "attainment"],
		"families": ["Cycle time and takt", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [4, 28],
		"requiredOperands": ["actual_cycle_min", "takt_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cycle_to_takt_ratio",
		"expression": "actual_cycle_min / takt_min",
		"unit": "ratio",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-037"],
		"sourceFormulas": ["Actual Cycle Time / Takt Time"],
		"aliases": ["Cycle-to-Takt Ratio"],
		"families": ["Cycle time and takt"],
		"sections": [4],
		"requiredOperands": ["actual_cycle_min", "takt_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.lead_time",
		"expression": "completion_epoch_min - release_epoch_min",
		"unit": "min",
		"aggregation": "per_object_distribution",
		"sourceOccurrences": ["OCC-038", "OCC-303"],
		"sourceFormulas": ["Completion Timestamp − Release/Order Timestamp", "See source concept / governance requirement"],
		"aliases": ["Lead Time", "lead time"],
		"families": ["Cycle time and takt", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [4, 28],
		"requiredOperands": ["completion_epoch_min", "release_epoch_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.manufacturing_lead_time",
		"expression": "queue_min + setup_min + process_min + move_min + wait_min",
		"unit": "min",
		"aggregation": "per_object_distribution",
		"sourceOccurrences": ["OCC-039"],
		"sourceFormulas": ["Queue + Setup + Run + Move + Wait Time"],
		"aliases": ["Manufacturing Lead Time"],
		"families": ["Cycle time and takt"],
		"sections": [4],
		"requiredOperands": [
			"move_min",
			"process_min",
			"queue_min",
			"setup_min",
			"wait_min"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.touch_time",
		"expression": "touch_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": ["OCC-040"],
		"sourceFormulas": ["Actual processing time spent on product"],
		"aliases": ["Touch Time"],
		"families": ["Cycle time and takt"],
		"sections": [4],
		"requiredOperands": ["touch_union_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.flow_efficiency",
		"expression": "100 * value_added_min / lead_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-041", "OCC-302"],
		"sourceFormulas": ["See source concept / governance requirement", "Value-Added Time / Total Lead Time × 100"],
		"aliases": ["Flow Efficiency", "flow efficiency"],
		"families": ["Cycle time and takt", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [4, 28],
		"requiredOperands": ["lead_min", "value_added_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["flow"],
		"grainPolicies": [{
			"familyID": "flow",
			"grain": "unique unit/lot route boundary and operation segment",
			"recordBindings": "lots + quality_stages + standards + jobs + explicit queue/setup/move timestamps",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision"
			],
			"aggregation": "Elapsed lead time as distribution; mean across completed eligible lots with stated weighting. Touch is interval union, not parallel person-hours."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.total_downtime",
		"expression": "downtime_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": [
			"OCC-042",
			"OCC-157",
			"OCC-164"
		],
		"sourceFormulas": [
			"Minimize / plant target",
			"Σ downtime event durations",
			"Σ governed downtime duration"
		],
		"aliases": ["Downtime", "Total Downtime"],
		"families": ["Downtime and loss", "Plant Head Daily Operations Audit"],
		"sections": [5, 20],
		"requiredOperands": ["downtime_union_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.unplanned_downtime",
		"expression": "unplanned_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": ["OCC-043", "OCC-268"],
		"sourceFormulas": ["See source concept / governance requirement", "Σ unplanned downtime event durations"],
		"aliases": ["Unplanned Downtime", "unplanned downtime"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": ["unplanned_union_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.planned_downtime",
		"expression": "planned_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": ["OCC-044", "OCC-269"],
		"sourceFormulas": ["See source concept / governance requirement", "Σ planned downtime durations"],
		"aliases": ["Planned Downtime", "planned downtime"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": ["planned_union_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.downtime",
		"expression": "100 * downtime_min / planned_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-045", "OCC-267"],
		"sourceFormulas": ["Downtime / Planned Production Time × 100", "See source concept / governance requirement"],
		"aliases": ["Downtime %", "downtime"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": ["downtime_min", "planned_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.downtime_frequency",
		"expression": "downtime_events / elapsed_h",
		"unit": "event/h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-047"],
		"sourceFormulas": ["Number of downtime events / Period"],
		"aliases": ["Downtime Frequency"],
		"families": ["Downtime and loss"],
		"sections": [5],
		"requiredOperands": ["downtime_events", "elapsed_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.average_downtime_event",
		"expression": "downtime_min / downtime_events",
		"unit": "min/event",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-048"],
		"sourceFormulas": ["Total Downtime / Number of Downtime Events"],
		"aliases": ["Average Downtime Event"],
		"families": ["Downtime and loss"],
		"sections": [5],
		"requiredOperands": ["downtime_events", "downtime_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.downtime_by_reason",
		"expression": "reason_union_min",
		"unit": "min",
		"aggregation": "sum_partitioned_intervals",
		"sourceOccurrences": ["OCC-049", "OCC-319"],
		"sourceFormulas": ["See source concept / governance requirement", "Σ duration for reason code"],
		"aliases": ["Downtime by Reason", "top loss"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": ["reason_union_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.downtime_contribution",
		"expression": "100 * reason_min / total_loss_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-050"],
		"sourceFormulas": ["Reason Downtime / Total Downtime × 100"],
		"aliases": ["Downtime Contribution"],
		"families": ["Downtime and loss"],
		"sections": [5],
		"requiredOperands": ["reason_min", "total_loss_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.top_loss_contribution",
		"expression": "100 * largest_category_min / total_loss_min",
		"unit": "%",
		"aggregation": "recompute_rank",
		"sourceOccurrences": ["OCC-051", "OCC-319"],
		"sourceFormulas": ["Largest Loss / Total Loss × 100", "See source concept / governance requirement"],
		"aliases": ["Top Loss Contribution", "top loss"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": ["largest_category_min", "total_loss_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.minor_stop_time",
		"expression": "minor_stop_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": ["OCC-052", "OCC-270"],
		"sourceFormulas": ["See source concept / governance requirement", "Σ qualifying short-stop durations"],
		"aliases": ["Minor Stop Time", "minor stops"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": ["minor_stop_union_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.speed_loss",
		"expression": "run_min / ideal_cycle_min - total_units",
		"unit": "unit",
		"aggregation": "sum_homogeneous_or_by_segment",
		"sourceOccurrences": ["OCC-053", "OCC-271"],
		"sourceFormulas": ["Potential Output at Ideal Rate − Actual Output during runtime", "See source concept / governance requirement"],
		"aliases": ["Speed Loss", "speed loss"],
		"families": ["Downtime and loss", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [5, 28],
		"requiredOperands": [
			"ideal_cycle_min",
			"run_min",
			"total_units"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source quantity formula conflicts with missing-rows unit units/time. Formula yields units, not rate; do not alias performance loss minutes."],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.lost_production_from_downtime",
		"expression": "downtime_min * expected_units_per_min",
		"unit": "unit_estimate",
		"aggregation": "sum_by_effective_rate",
		"sourceOccurrences": ["OCC-054"],
		"sourceFormulas": ["Downtime × Expected Run Rate"],
		"aliases": ["Lost Production from Downtime"],
		"families": ["Downtime and loss"],
		"sections": [5],
		"requiredOperands": ["downtime_min", "expected_units_per_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.downtime_cost",
		"expression": "downtime_min * loss_cost_per_min",
		"unit": "USD_estimate",
		"aggregation": "sum_by_effective_rate",
		"sourceOccurrences": [
			"OCC-055",
			"OCC-128",
			"OCC-311"
		],
		"sourceFormulas": [
			"Downtime Duration × Governed Loss/Cost Rate",
			"Downtime × Governed Cost Rate",
			"See source concept / governance requirement"
		],
		"aliases": ["Downtime Cost", "downtime cost"],
		"families": [
			"Cost",
			"Downtime and loss",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			5,
			15,
			28
		],
		"requiredOperands": ["downtime_min", "loss_cost_per_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss", "manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "loss",
			"grain": "asset stop interval clipped to included planned time",
			"recordBindings": "downtime_intervals + jobs + standards + cost_rates",
			"validScopes": [
				"asset",
				"line",
				"job",
				"reason",
				"shift",
				"day"
			],
			"aggregation": "Union overlapping same-asset intervals; assign one governed reason per segment; simultaneous independent assets pool asset-minutes. Never sum line and machine copies."
		}, {
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.changeover_time",
		"expression": "first_good_new_epoch_min - last_good_old_epoch_min",
		"unit": "min",
		"aggregation": "per_object_distribution",
		"sourceOccurrences": ["OCC-056", "OCC-272"],
		"sourceFormulas": ["First Good Unit New Product − Last Good Unit Previous Product", "See source concept / governance requirement"],
		"aliases": ["Changeover Time", "changeover"],
		"families": ["Changeover and setup", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [6, 28],
		"requiredOperands": ["first_good_new_epoch_min", "last_good_old_epoch_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Last good old to first good new includes waiting; setup-task duration is distinct. Aggregate average weighted by number of changes, not line averages."],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.average_changeover_time",
		"expression": "changeover_total_min / changeovers",
		"unit": "min/changeover",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-057"],
		"sourceFormulas": ["Σ Changeover Time / Number of Changeovers"],
		"aliases": ["Average Changeover Time"],
		"families": ["Changeover and setup"],
		"sections": [6],
		"requiredOperands": ["changeover_total_min", "changeovers"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.changeover_variance",
		"expression": "changeover_actual_min - changeover_standard_min",
		"unit": "min",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-058"],
		"sourceFormulas": ["Actual Changeover − Standard Changeover"],
		"aliases": ["Changeover Variance"],
		"families": ["Changeover and setup"],
		"sections": [6],
		"requiredOperands": ["changeover_actual_min", "changeover_standard_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.changeover_attainment",
		"expression": "100 * changeover_standard_min / changeover_actual_min",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-059"],
		"sourceFormulas": ["Standard Changeover / Actual Changeover × 100"],
		"aliases": ["Changeover Attainment"],
		"families": ["Changeover and setup"],
		"sections": [6],
		"requiredOperands": ["changeover_actual_min", "changeover_standard_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.setup_loss",
		"expression": "setup_actual_min - setup_target_min",
		"unit": "min",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-060"],
		"sourceFormulas": ["Actual Setup Time − Target Setup Time"],
		"aliases": ["Setup Loss"],
		"families": ["Changeover and setup"],
		"sections": [6],
		"requiredOperands": ["setup_actual_min", "setup_target_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.first_pass_yield",
		"expression": "100 * first_pass_good_units / entering_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-063",
			"OCC-273",
			"OCC-274"
		],
		"sourceFormulas": ["See source concept / governance requirement", "Units passing without rework / Units entering process × 100"],
		"aliases": [
			"FPY",
			"FPY — First Pass Yield",
			"yield"
		],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["entering_units", "first_pass_good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.first_time_through",
		"expression": "100 * first_pass_good_units / entering_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-064"],
		"sourceFormulas": ["Good units requiring no repair/rework / Total units × 100"],
		"aliases": ["First Time Through"],
		"families": ["Quality"],
		"sections": [7],
		"requiredOperands": ["entering_units", "first_pass_good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.scrap_rate",
		"expression": "100 * scrap_units / produced_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-065", "OCC-276"],
		"sourceFormulas": ["Scrap Units / Total Units Produced × 100", "See source concept / governance requirement"],
		"aliases": ["Scrap Rate", "scrap"],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["produced_units", "scrap_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.reject_rate",
		"expression": "100 * rejected_units / inspected_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-066", "OCC-277"],
		"sourceFormulas": ["Rejected Units / Total Units Inspected × 100", "See source concept / governance requirement"],
		"aliases": ["Reject Rate", "rejects"],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["inspected_units", "rejected_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.rework_rate",
		"expression": "100 * reworked_unique_units / produced_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-067", "OCC-278"],
		"sourceFormulas": ["Reworked Units / Total Units Produced × 100", "See source concept / governance requirement"],
		"aliases": ["Rework Rate", "rework"],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["produced_units", "reworked_unique_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.defect_rate",
		"expression": "100 * defective_unique_units / inspected_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-068"],
		"sourceFormulas": ["Defective Units / Units Inspected × 100"],
		"aliases": ["Defect Rate"],
		"families": ["Quality"],
		"sections": [7],
		"requiredOperands": ["defective_unique_units", "inspected_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.defects_per_unit_dpu",
		"expression": "defects / inspected_units",
		"unit": "defect/unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-069"],
		"sourceFormulas": ["Total Defects / Units Inspected"],
		"aliases": ["Defects per Unit (DPU)"],
		"families": ["Quality"],
		"sections": [7],
		"requiredOperands": ["defects", "inspected_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.dpmo",
		"expression": "1000000 * defects / opportunity_count",
		"unit": "defect_per_million_opportunity",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-070", "OCC-280"],
		"sourceFormulas": ["Defects / (Units × Opportunities per Unit) × 1,000,000", "See source concept / governance requirement"],
		"aliases": ["DPMO"],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["defects", "opportunity_count"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.ppm_defective",
		"expression": "1000000 * defective_unique_units / inspected_units",
		"unit": "defective_per_million_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-071", "OCC-279"],
		"sourceFormulas": ["Defective Units / Total Units × 1,000,000", "See source concept / governance requirement"],
		"aliases": ["PPM", "PPM Defective"],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["defective_unique_units", "inspected_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.customer_reject_rate",
		"expression": "100 * customer_rejected_units / shipped_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-072"],
		"sourceFormulas": ["Customer-Rejected Units / Units Shipped × 100"],
		"aliases": ["Customer Reject Rate"],
		"families": ["Quality"],
		"sections": [7],
		"requiredOperands": ["customer_rejected_units", "shipped_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.customer_ppm",
		"expression": "1000000 * customer_defective_units / shipped_units",
		"unit": "defective_per_million_shipped_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-073", "OCC-279"],
		"sourceFormulas": ["Customer Defective Units / Units Shipped × 1,000,000", "See source concept / governance requirement"],
		"aliases": ["Customer PPM", "PPM"],
		"families": ["Quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [7, 28],
		"requiredOperands": ["customer_defective_units", "shipped_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.quality_loss",
		"expression": "100 * final_non_good_units / total_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-074",
			"OCC-158",
			"OCC-165",
			"OCC-281"
		],
		"sourceFormulas": [
			"Nonconforming Output / Total Output × 100",
			"Nonconforming Units / Total Units × 100",
			"See source concept / governance requirement",
			"≤ 2%"
		],
		"aliases": ["Quality Loss", "quality loss"],
		"families": [
			"Plant Head Daily Operations Audit",
			"Quality",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			7,
			20,
			28
		],
		"requiredOperands": ["final_non_good_units", "total_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.good_count",
		"expression": "final_accepted_unique_units",
		"unit": "good_unit",
		"aggregation": "sum_exclusive_cohorts",
		"sourceOccurrences": ["OCC-075"],
		"sourceFormulas": ["Total Count − Scrap − rejected/rework as governed"],
		"aliases": ["Good Count"],
		"families": ["Quality"],
		"sections": [7],
		"requiredOperands": ["final_accepted_unique_units"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Total-minus-scrap-minus-reject-minus-rework can double count overlapping dispositions. Use terminal unique accepted units; source policy must approve handling of recovered units."],
		"familyPolicyIDs": ["quality"],
		"grainPolicies": [{
			"familyID": "quality",
			"grain": "unique inspected/produced/shipped unit cohort with terminal disposition",
			"recordBindings": "counts + defects + quality_stages + shipments",
			"validScopes": [
				"lot",
				"job",
				"operation",
				"part-revision",
				"shift"
			],
			"aggregation": "Defective unit once, defects can exceed units; final good and FPY distinct; rework remains excluded from firstpass numerator; source specimen/inspection sampling cannot silently become produced-unit denominator."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.rolled_throughput_yield",
		"expression": "product(stage_first_pass_yields)",
		"unit": "%",
		"aggregation": "product_matched_route",
		"sourceOccurrences": [
			"OCC-076",
			"OCC-274",
			"OCC-275"
		],
		"sourceFormulas": ["RTY = FPY₁ × FPY₂ × FPY₃ × ... × FPYₙ ; RTY = 0.98 × 0.97 × 0.99 = 94.1%", "See source concept / governance requirement"],
		"aliases": [
			"RTY",
			"Rolled Throughput Yield",
			"yield"
		],
		"families": ["Rolled yield", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [8, 28],
		"requiredOperands": ["stage_first_pass_yields"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["0.98*0.97*0.99=0.941094=94.1094%, rounds94.1%; no defect or rework double counting."],
		"familyPolicyIDs": ["rty"],
		"grainPolicies": [{
			"familyID": "rty",
			"grain": "same initial route cohort and ordered stage",
			"recordBindings": "quality_stages + lot genealogy",
			"validScopes": [
				"lot",
				"route",
				"part-revision"
			],
			"aggregation": "Product eligible stage firstpass yields at full precision; pool stage numerators/denominators across eligible comparable lots before product, not average lot RTY."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cp",
		"expression": "(usl - lsl) / (6 * sigma_within)",
		"unit": "dimensionless",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-077", "OCC-282"],
		"sourceFormulas": ["(USL − LSL) / (6σ)", "See source concept / governance requirement"],
		"aliases": ["Cp", "Cp/Cpk where appropriate"],
		"families": ["Process capability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [9, 28],
		"requiredOperands": [
			"lsl",
			"sigma_within",
			"usl"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"valid ordered LSL/USL, positive sigma, declared estimator, stable qualified process, adequate sample and MSA status; raw deterministic algebra case is NOT capability certification"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cpk",
		"expression": "min((usl - process_mean) / (3 * sigma_within), (process_mean - lsl) / (3 * sigma_within))",
		"unit": "dimensionless",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-078", "OCC-282"],
		"sourceFormulas": ["See source concept / governance requirement", "min[(USL − μ)/(3σ), (μ − LSL)/(3σ)]"],
		"aliases": ["Cp/Cpk where appropriate", "Cpk"],
		"families": ["Process capability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [9, 28],
		"requiredOperands": [
			"lsl",
			"process_mean",
			"sigma_within",
			"usl"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"valid ordered LSL/USL, positive sigma, declared estimator, stable qualified process, adequate sample and MSA status; raw deterministic algebra case is NOT capability certification"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.pp",
		"expression": "(usl - lsl) / (6 * sigma_overall)",
		"unit": "dimensionless",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-079"],
		"sourceFormulas": ["(USL − LSL) / (6σoverall)"],
		"aliases": ["Pp"],
		"families": ["Process capability"],
		"sections": [9],
		"requiredOperands": [
			"lsl",
			"sigma_overall",
			"usl"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"valid ordered LSL/USL, positive sigma, declared estimator, stable qualified process, adequate sample and MSA status; raw deterministic algebra case is NOT capability certification"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.ppk",
		"expression": "min((usl - process_mean) / (3 * sigma_overall), (process_mean - lsl) / (3 * sigma_overall))",
		"unit": "dimensionless",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-080"],
		"sourceFormulas": ["min[(USL − μ)/(3σoverall), (μ − LSL)/(3σoverall)]"],
		"aliases": ["Ppk"],
		"families": ["Process capability"],
		"sections": [9],
		"requiredOperands": [
			"lsl",
			"process_mean",
			"sigma_overall",
			"usl"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"valid ordered LSL/USL, positive sigma, declared estimator, stable qualified process, adequate sample and MSA status; raw deterministic algebra case is NOT capability certification"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.mtbf",
		"expression": "operating_h / failures",
		"unit": "h/failure",
		"aggregation": "pooled_exposure",
		"sourceOccurrences": ["OCC-081", "OCC-283"],
		"sourceFormulas": ["See source concept / governance requirement", "Total Operating Time / Number of Failures"],
		"aliases": ["MTBF"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["failures", "operating_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"declare failure boundary, operating exposure/censoring, repairable vs nonrepairable population; no preventive task counts as failure"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.mttr_repair",
		"expression": "active_repair_elapsed_h / repairs",
		"unit": "h/repair",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-082", "OCC-284"],
		"sourceFormulas": ["See source concept / governance requirement", "Total Active Repair Time / Number of Repairs"],
		"aliases": ["MTTR — Mean Time to Repair", "MTTR-Repair"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["active_repair_elapsed_h", "repairs"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.mttr_restore",
		"expression": "restoration_elapsed_h / incidents",
		"unit": "h/incident",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-083", "OCC-285"],
		"sourceFormulas": ["See source concept / governance requirement", "Total Restoration Downtime / Number of Incidents"],
		"aliases": ["MTTR — Mean Time to Restore", "MTTR-Restore"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["incidents", "restoration_elapsed_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.mttf",
		"expression": "failed_complete_lifetime_h / nonrepairable_failures",
		"unit": "h/failure",
		"aggregation": "complete_case_demo_only",
		"sourceOccurrences": ["OCC-084"],
		"sourceFormulas": ["Total Operating Life / Number of Nonrepairable Failures"],
		"aliases": ["MTTF"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["failed_complete_lifetime_h", "nonrepairable_failures"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"declare failure boundary, operating exposure/censoring, repairable vs nonrepairable population; no preventive task counts as failure"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Complete failed-life average excludes right censoring; cannot infer population MTTF from repairable WOs. Survival model and observation age required for inferential MTTF."],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.failure_rate",
		"expression": "failures / operating_h",
		"unit": "failure/h",
		"aggregation": "pooled_exposure",
		"sourceOccurrences": ["OCC-085", "OCC-286"],
		"sourceFormulas": ["Number of Failures / Operating Time", "See source concept / governance requirement"],
		"aliases": ["Failure Rate", "failure rate"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["failures", "operating_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"declare failure boundary, operating exposure/censoring, repairable vs nonrepairable population; no preventive task counts as failure"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.reliability",
		"expression": "exp(-failure_lambda_per_h * horizon_h)",
		"unit": "probability",
		"aggregation": "model_not_average",
		"sourceOccurrences": ["OCC-086"],
		"sourceFormulas": ["commonly e^(−λt) for constant failure rate"],
		"aliases": ["Reliability"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["failure_lambda_per_h", "horizon_h"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"declare failure boundary, operating exposure/censoring, repairable vs nonrepairable population; no preventive task counts as failure"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source commonly exp(-lambda*t) is a conditional constant-hazard model, not empirical universal reliability; Weibull requires fit, censoring and uncertainty."],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.repair_rate",
		"expression": "repairs / active_repair_elapsed_h",
		"unit": "repair/h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-087"],
		"sourceFormulas": ["Repairs Completed / Repair Time"],
		"aliases": ["Repair Rate"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["active_repair_elapsed_h", "repairs"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.maintenance_downtime",
		"expression": "100 * maintenance_union_min / planned_min",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-088"],
		"sourceFormulas": ["Maintenance Downtime / Planned Production Time × 100"],
		"aliases": ["Maintenance Downtime %"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["maintenance_union_min", "planned_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.breakdown_frequency",
		"expression": "breakdowns / elapsed_days",
		"unit": "breakdown/day",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-089", "OCC-287"],
		"sourceFormulas": ["Breakdowns / Period", "See source concept / governance requirement"],
		"aliases": ["Breakdown Frequency", "breakdown frequency"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["breakdowns", "elapsed_days"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.reactive_maintenance",
		"expression": "100 * reactive_labor_h / maintenance_labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-090", "OCC-289"],
		"sourceFormulas": ["Reactive Maintenance Hours / Total Maintenance Hours × 100", "See source concept / governance requirement"],
		"aliases": ["Reactive Maintenance %", "reactive maintenance %"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["maintenance_labor_h", "reactive_labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.planned_maintenance",
		"expression": "100 * planned_labor_h / maintenance_labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-091"],
		"sourceFormulas": ["Planned Maintenance Hours / Total Maintenance Hours × 100"],
		"aliases": ["Planned Maintenance %"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["maintenance_labor_h", "planned_labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.pm_compliance",
		"expression": "100 * pm_on_time / pm_due",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-092", "OCC-288"],
		"sourceFormulas": ["PMs completed on time / PMs scheduled × 100", "See source concept / governance requirement"],
		"aliases": ["PM Compliance", "PM compliance"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["pm_due", "pm_on_time"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.schedule_compliance_maintenance",
		"expression": "100 * maintenance_jobs_as_planned / maintenance_jobs_scheduled",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-093"],
		"sourceFormulas": ["Scheduled jobs completed as planned / Scheduled jobs × 100"],
		"aliases": ["Schedule Compliance — Maintenance"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["maintenance_jobs_as_planned", "maintenance_jobs_scheduled"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.maintenance_backlog",
		"expression": "backlog_labor_h / available_weekly_labor_h",
		"unit": "week",
		"aggregation": "snapshot_ratio",
		"sourceOccurrences": ["OCC-094", "OCC-290"],
		"sourceFormulas": ["Outstanding Maintenance Labor Hours / Available Weekly Maintenance Labor Hours", "See source concept / governance requirement"],
		"aliases": ["Maintenance Backlog", "maintenance backlog"],
		"families": ["Maintenance and reliability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [10, 28],
		"requiredOperands": ["available_weekly_labor_h", "backlog_labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.repeat_failure_rate",
		"expression": "100 * repeat_failures / failures",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-095"],
		"sourceFormulas": ["Repeated failures / Total failures × 100"],
		"aliases": ["Repeat Failure Rate"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["failures", "repeat_failures"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.emergency_work",
		"expression": "100 * emergency_labor_h / maintenance_labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-096"],
		"sourceFormulas": ["Emergency work hours / Total maintenance hours × 100"],
		"aliases": ["Emergency Work %"],
		"families": ["Maintenance and reliability"],
		"sections": [10],
		"requiredOperands": ["emergency_labor_h", "maintenance_labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["maintenance_reliability"],
		"grainPolicies": [{
			"familyID": "maintenance_reliability",
			"grain": "functional failure incident and operating exposure/repair segment",
			"recordBindings": "failures + work_orders + reliability_observations + pm_tasks",
			"validScopes": [
				"asset",
				"failure-mode",
				"maintenance population",
				"window"
			],
			"aggregation": "Operating-hours/failures ratio for descriptive MTBF; active repair elapsed distinct from restore elapsed and person-hours. Include right-censored exposure. Inferential lifetime models need separate fit and uncertainty; no average asset MTBF."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.otif",
		"expression": "100 * orders_both_on_time_in_full / eligible_orders",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-097",
			"OCC-161",
			"OCC-168",
			"OCC-292"
		],
		"sourceFormulas": [
			"Orders delivered On Time AND In Full / Total Orders × 100",
			"Orders on-time AND in-full / Total applicable orders × 100",
			"See source concept / governance requirement",
			"≥ 95%"
		],
		"aliases": ["OTIF"],
		"families": [
			"Delivery and customer service",
			"Plant Head Daily Operations Audit",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			11,
			20,
			28
		],
		"requiredOperands": ["eligible_orders", "orders_both_on_time_in_full"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.on_time_delivery_otd",
		"expression": "100 * delivered_on_time_orders / delivered_orders",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-098", "OCC-293"],
		"sourceFormulas": ["Orders delivered on/before promise date / Total Delivered Orders × 100", "See source concept / governance requirement"],
		"aliases": ["OTD", "On-Time Delivery (OTD)"],
		"families": ["Delivery and customer service", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [11, 28],
		"requiredOperands": ["delivered_on_time_orders", "delivered_orders"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.in_full_delivery",
		"expression": "100 * complete_orders / eligible_orders",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-099"],
		"sourceFormulas": ["Orders delivered complete / Total Orders × 100"],
		"aliases": ["In-Full Delivery"],
		"families": ["Delivery and customer service"],
		"sections": [11],
		"requiredOperands": ["complete_orders", "eligible_orders"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.fill_rate",
		"expression": "100 * immediately_shipped_units / ordered_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-100", "OCC-294"],
		"sourceFormulas": ["See source concept / governance requirement", "Units shipped immediately / Units ordered × 100"],
		"aliases": ["Fill Rate", "fill rate"],
		"families": ["Delivery and customer service", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [11, 28],
		"requiredOperands": ["immediately_shipped_units", "ordered_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.perfect_order_rate",
		"expression": "100 * perfect_orders / eligible_orders",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-101"],
		"sourceFormulas": ["Perfect Orders / Total Orders × 100"],
		"aliases": ["Perfect Order Rate"],
		"families": ["Delivery and customer service"],
		"sections": [11],
		"requiredOperands": ["eligible_orders", "perfect_orders"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.late_order_rate",
		"expression": "100 * late_orders / eligible_orders",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-102"],
		"sourceFormulas": ["Late Orders / Total Orders × 100"],
		"aliases": ["Late Order Rate"],
		"families": ["Delivery and customer service"],
		"sections": [11],
		"requiredOperands": ["eligible_orders", "late_orders"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.past_due_quantity",
		"expression": "past_due_remaining_qty",
		"unit": "unit",
		"aggregation": "snapshot_sum",
		"sourceOccurrences": ["OCC-103"],
		"sourceFormulas": ["Σ outstanding quantity past promised date"],
		"aliases": ["Past-Due Quantity"],
		"families": ["Delivery and customer service"],
		"sections": [11],
		"requiredOperands": ["past_due_remaining_qty"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.average_delivery_delay",
		"expression": "late_days_sum / late_deliveries",
		"unit": "day/delivery",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-104"],
		"sourceFormulas": ["Σ late days / Late Deliveries"],
		"aliases": ["Average Delivery Delay"],
		"families": ["Delivery and customer service"],
		"sections": [11],
		"requiredOperands": ["late_days_sum", "late_deliveries"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["delivery"],
		"grainPolicies": [{
			"familyID": "delivery",
			"grain": "customer order, explicitly order-line if selected",
			"recordBindings": "customer_orders + order_lines + shipments + promise version",
			"validScopes": [
				"customer",
				"order",
				"order-line",
				"due period"
			],
			"aggregation": "Order OTIF conjunct over ALL its eligible lines; join shipments aggregate quantities before counting each order. Due cohort includes open orders, OTD delivered cohort distinct."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.inventory_turns",
		"expression": "annual_cogs / average_inventory_value",
		"unit": "turn/year",
		"aggregation": "period_ratio",
		"sourceOccurrences": ["OCC-105", "OCC-297"],
		"sourceFormulas": ["Annual COGS / Average Inventory Value", "See source concept / governance requirement"],
		"aliases": ["Inventory Turns", "inventory turns"],
		"families": ["Inventory", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [12, 28],
		"requiredOperands": ["annual_cogs", "average_inventory_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source annual COGS; acceptance D07 uses period COGS. Keep annual and period turns separate, with explicit annualization policy."],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.inventory_turns_period",
		"expression": "period_cogs / average_inventory_value",
		"unit": "turn/period",
		"aggregation": "period_ratio",
		"sourceOccurrences": [],
		"sourceFormulas": [],
		"aliases": [],
		"families": [],
		"sections": [],
		"requiredOperands": ["average_inventory_value", "period_cogs"],
		"status": "proposed_demo_extension",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["comparison"],
		"grainPolicies": [{
			"familyID": "comparison",
			"grain": "matched current/prior metric-definition/scope/window",
			"recordBindings": "canonical results + eligibility",
			"validScopes": [
				"metric",
				"scope",
				"comparison"
			],
			"aggregation": "Recompute both operands; percent ratios retain fraction internally and pp display; relative needs nonzero prior; target version frozen."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.inventory_days_dio",
		"expression": "average_inventory_value * period_days / period_cogs",
		"unit": "day",
		"aggregation": "period_ratio",
		"sourceOccurrences": [
			"OCC-106",
			"OCC-160",
			"OCC-167",
			"OCC-296"
		],
		"sourceFormulas": [
			"Average Inventory / COGS × Days in Period",
			"Average Inventory / Consumption or COGS × Days",
			"Governed operating range",
			"See source concept / governance requirement"
		],
		"aliases": [
			"Inventory Days",
			"Inventory Days / DIO",
			"inventory days"
		],
		"families": [
			"Inventory",
			"Plant Head Daily Operations Audit",
			"What I would consider the core EKAS manufacturing KPI library"
		],
		"sections": [
			12,
			20,
			28
		],
		"requiredOperands": [
			"average_inventory_value",
			"period_cogs",
			"period_days"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.raw_material_days",
		"expression": "average_rm_value * period_days / period_material_usage_value",
		"unit": "day",
		"aggregation": "period_ratio",
		"sourceOccurrences": ["OCC-107", "OCC-300"],
		"sourceFormulas": ["Average Raw Material Inventory / Material Usage × Days", "See source concept / governance requirement"],
		"aliases": ["RM days", "Raw Material Days"],
		"families": ["Inventory", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [12, 28],
		"requiredOperands": [
			"average_rm_value",
			"period_days",
			"period_material_usage_value"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.wip_days_value",
		"expression": "average_wip_value * period_days / period_manufacturing_cost",
		"unit": "day",
		"aggregation": "period_ratio",
		"sourceOccurrences": [
			"OCC-108",
			"OCC-298",
			"OCC-299"
		],
		"sourceFormulas": ["Average WIP / Manufacturing Cost or Throughput × Days", "See source concept / governance requirement"],
		"aliases": [
			"WIP",
			"WIP Days",
			"WIP days"
		],
		"families": ["Inventory", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [12, 28],
		"requiredOperands": [
			"average_wip_value",
			"period_days",
			"period_manufacturing_cost"
		],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source combines cost valuation and physical throughput denominator. Split value-based days and unit-based residence time; never divide money by units/day."],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.wip_days_units",
		"expression": "average_wip_units / throughput_units_per_day",
		"unit": "day",
		"aggregation": "pooled_matching_boundary",
		"sourceOccurrences": [
			"OCC-108",
			"OCC-298",
			"OCC-299"
		],
		"sourceFormulas": ["Average WIP / Manufacturing Cost or Throughput × Days", "See source concept / governance requirement"],
		"aliases": [
			"WIP",
			"WIP Days",
			"WIP days"
		],
		"families": ["Inventory", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [12, 28],
		"requiredOperands": ["average_wip_units", "throughput_units_per_day"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source combines cost valuation and physical throughput denominator. Split value-based days and unit-based residence time; never divide money by units/day."],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.finished_goods_days",
		"expression": "average_fg_value * period_days / period_cogs",
		"unit": "day",
		"aggregation": "period_ratio",
		"sourceOccurrences": ["OCC-109", "OCC-301"],
		"sourceFormulas": ["Average FG Inventory / COGS × Days", "See source concept / governance requirement"],
		"aliases": ["FG days", "Finished Goods Days"],
		"families": ["Inventory", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [12, 28],
		"requiredOperands": [
			"average_fg_value",
			"period_cogs",
			"period_days"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.wip_units",
		"expression": "snapshot_wip_units",
		"unit": "unit",
		"aggregation": "snapshot_sum",
		"sourceOccurrences": ["OCC-110", "OCC-298"],
		"sourceFormulas": ["See source concept / governance requirement", "Σ units currently inside production process"],
		"aliases": ["WIP", "WIP Units"],
		"families": ["Inventory", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [12, 28],
		"requiredOperands": ["snapshot_wip_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.inventory_accuracy",
		"expression": "100 * inventory_correct_records / inventory_checked_records",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-111"],
		"sourceFormulas": ["Correct inventory records / Records checked × 100"],
		"aliases": ["Inventory Accuracy"],
		"families": ["Inventory"],
		"sections": [12],
		"requiredOperands": ["inventory_checked_records", "inventory_correct_records"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.obsolete_inventory",
		"expression": "100 * obsolete_value / total_inventory_value",
		"unit": "%",
		"aggregation": "snapshot_ratio",
		"sourceOccurrences": ["OCC-112"],
		"sourceFormulas": ["Obsolete Inventory Value / Total Inventory Value × 100"],
		"aliases": ["Obsolete Inventory %"],
		"families": ["Inventory"],
		"sections": [12],
		"requiredOperands": ["obsolete_value", "total_inventory_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.excess_inventory",
		"expression": "100 * excess_value / total_inventory_value",
		"unit": "%",
		"aggregation": "snapshot_ratio",
		"sourceOccurrences": ["OCC-113"],
		"sourceFormulas": ["Inventory Above Governed Maximum / Total Inventory × 100"],
		"aliases": ["Excess Inventory %"],
		"families": ["Inventory"],
		"sections": [12],
		"requiredOperands": ["excess_value", "total_inventory_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["inventory"],
		"grainPolicies": [{
			"familyID": "inventory",
			"grain": "item-location balance interval and matching consumption ledger period",
			"recordBindings": "inventory_transactions + inventory_items + consumption/COGS ledger",
			"validScopes": [
				"item",
				"kind",
				"site",
				"period"
			],
			"aggregation": "Balances snapshot or time-weighted integral; never sum day snapshots. Opening/closing average only named demo convention. Same currency/unit/window. Annual turns distinct from period turns."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.little_s_law",
		"expression": "average_wip_units / throughput_units_per_day",
		"unit": "day",
		"aggregation": "model_boundary_identity",
		"sourceOccurrences": ["OCC-114"],
		"sourceFormulas": ["WIP = Throughput × Lead Time ; Lead Time = WIP / Throughput ; Throughput = WIP / Lead Time"],
		"aliases": ["Little's Law"],
		"families": ["Little's Law / manufacturing flow"],
		"sections": [13],
		"requiredOperands": ["average_wip_units", "throughput_units_per_day"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["littles_law"],
		"grainPolicies": [{
			"familyID": "littles_law",
			"grain": "stable flow-system boundary and window",
			"recordBindings": "time-weighted WIP + throughput exit events + lead-time cohort",
			"validScopes": [
				"flow system",
				"route",
				"window"
			],
			"aggregation": "A dimensional identity under stable boundary/steady state; not causal model. WIP units / units-per-day yields days. Do not divide inventory currency by throughput units."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.labor_productivity",
		"expression": "good_units / labor_h",
		"unit": "good_unit/person_h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-115", "OCC-304"],
		"sourceFormulas": ["Good Units / Labor Hours", "See source concept / governance requirement"],
		"aliases": ["Labor Productivity", "labor productivity"],
		"families": ["Labor and workforce productivity", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [14, 28],
		"requiredOperands": ["good_units", "labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.labor_efficiency",
		"expression": "100 * earned_standard_h / labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-116", "OCC-305"],
		"sourceFormulas": ["See source concept / governance requirement", "Standard Hours Earned / Actual Labor Hours × 100"],
		"aliases": ["Labor Efficiency", "labor efficiency"],
		"families": ["Labor and workforce productivity", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [14, 28],
		"requiredOperands": ["earned_standard_h", "labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.standard_hours_earned",
		"expression": "good_units * standard_labor_h_per_unit",
		"unit": "person_h",
		"aggregation": "sum_by_effective_standard",
		"sourceOccurrences": ["OCC-117"],
		"sourceFormulas": ["Good Quantity × Standard Labor Time per Unit"],
		"aliases": ["Standard Hours Earned"],
		"families": ["Labor and workforce productivity"],
		"sections": [14],
		"requiredOperands": ["good_units", "standard_labor_h_per_unit"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.labor_utilization",
		"expression": "100 * productive_labor_h / paid_labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-118",
			"OCC-259",
			"OCC-306"
		],
		"sourceFormulas": ["Productive Labor Hours / Paid Labor Hours × 100", "See source concept / governance requirement"],
		"aliases": ["Labor Utilization", "utilization"],
		"families": ["Labor and workforce productivity", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [14, 28],
		"requiredOperands": ["paid_labor_h", "productive_labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.direct_labor_utilization",
		"expression": "100 * direct_productive_h / direct_available_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-119",
			"OCC-259",
			"OCC-306"
		],
		"sourceFormulas": ["Direct Productive Hours / Direct Available Hours × 100", "See source concept / governance requirement"],
		"aliases": ["Direct Labor Utilization", "utilization"],
		"families": ["Labor and workforce productivity", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [14, 28],
		"requiredOperands": ["direct_available_h", "direct_productive_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.overtime",
		"expression": "100 * overtime_h / labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-120", "OCC-307"],
		"sourceFormulas": ["Overtime Hours / Total Labor Hours × 100", "See source concept / governance requirement"],
		"aliases": ["Overtime %", "overtime"],
		"families": ["Labor and workforce productivity", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [14, 28],
		"requiredOperands": ["labor_h", "overtime_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.absenteeism_rate",
		"expression": "100 * absent_scheduled_h / scheduled_labor_h",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-121"],
		"sourceFormulas": ["Absent Scheduled Hours / Total Scheduled Hours × 100"],
		"aliases": ["Absenteeism Rate"],
		"families": ["Labor and workforce productivity"],
		"sections": [14],
		"requiredOperands": ["absent_scheduled_h", "scheduled_labor_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.units_per_employee_hour",
		"expression": "good_units / employee_h",
		"unit": "good_unit/person_h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-122"],
		"sourceFormulas": ["Good Units / Employee Hours"],
		"aliases": ["Units per Employee Hour"],
		"families": ["Labor and workforce productivity"],
		"sections": [14],
		"requiredOperands": ["employee_h", "good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.labor_cost_per_unit",
		"expression": "direct_labor_cost / good_units",
		"unit": "USD/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-123", "OCC-308"],
		"sourceFormulas": ["Direct Labor Cost / Good Units", "See source concept / governance requirement"],
		"aliases": ["Labor Cost per Unit", "cost/unit"],
		"families": ["Labor and workforce productivity", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [14, 28],
		"requiredOperands": ["direct_labor_cost", "good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["labor"],
		"grainPolicies": [{
			"familyID": "labor",
			"grain": "person-job/time segment with payroll boundary",
			"recordBindings": "labor_shifts + counts + effective labor standards/rates",
			"validScopes": [
				"site",
				"line",
				"job",
				"shift"
			],
			"aggregation": "Sum person-hours, not elapsed asset-hours; same good-output cohort. Product standards contribute sum(qty*standard hours), no averaging product standards."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.manufacturing_cost_per_unit",
		"expression": "manufacturing_cost / good_units",
		"unit": "USD/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-124", "OCC-308"],
		"sourceFormulas": ["See source concept / governance requirement", "Total Manufacturing Cost / Good Units Produced"],
		"aliases": ["Manufacturing Cost per Unit", "cost/unit"],
		"families": ["Cost", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [15, 28],
		"requiredOperands": ["good_units", "manufacturing_cost"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.conversion_cost_per_unit",
		"expression": "(direct_labor_cost + overhead_cost) / good_units",
		"unit": "USD/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-125", "OCC-308"],
		"sourceFormulas": ["(Direct Labor + Manufacturing Overhead) / Good Units", "See source concept / governance requirement"],
		"aliases": ["Conversion Cost per Unit", "cost/unit"],
		"families": ["Cost", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [15, 28],
		"requiredOperands": [
			"direct_labor_cost",
			"good_units",
			"overhead_cost"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.scrap_cost",
		"expression": "scrap_units * scrap_unit_cost",
		"unit": "USD_estimate",
		"aggregation": "sum_by_effective_rate",
		"sourceOccurrences": [
			"OCC-126",
			"OCC-276",
			"OCC-309"
		],
		"sourceFormulas": ["Scrap Quantity × Governed Unit Cost", "See source concept / governance requirement"],
		"aliases": [
			"Scrap Cost",
			"scrap",
			"scrap cost"
		],
		"families": ["Cost", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [15, 28],
		"requiredOperands": ["scrap_unit_cost", "scrap_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Cost amount and share of manufacturing cost source occurrences require separate IDs."],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.scrap_cost_share",
		"expression": "100 * scrap_cost_amount / manufacturing_cost",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-136", "OCC-276"],
		"sourceFormulas": ["Scrap Cost / Manufacturing Cost × 100", "See source concept / governance requirement"],
		"aliases": ["Scrap Cost %", "scrap"],
		"families": ["Cost of quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [16, 28],
		"requiredOperands": ["manufacturing_cost", "scrap_cost_amount"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Cost amount and share of manufacturing cost source occurrences require separate IDs."],
		"familyPolicyIDs": ["coq"],
		"grainPolicies": [{
			"familyID": "coq",
			"grain": "exclusive prevention/appraisal/internal/external categories",
			"recordBindings": "cost_ledger + governed sales/period",
			"validScopes": [
				"currency",
				"site",
				"period"
			],
			"aggregation": "Scrap/rework detail included in internal failure total, not added twice; warranty subset external. Currency comparisons cannot infer realized savings."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.rework_cost",
		"expression": "rework_labor_cost + rework_material_cost + rework_overhead_cost",
		"unit": "USD_estimate",
		"aggregation": "sum",
		"sourceOccurrences": [
			"OCC-127",
			"OCC-278",
			"OCC-310"
		],
		"sourceFormulas": ["Rework Labor + Material + Overhead", "See source concept / governance requirement"],
		"aliases": [
			"Rework Cost",
			"rework",
			"rework cost"
		],
		"families": ["Cost", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [15, 28],
		"requiredOperands": [
			"rework_labor_cost",
			"rework_material_cost",
			"rework_overhead_cost"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cost_variance",
		"expression": "actual_cost - standard_cost",
		"unit": "USD",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-129"],
		"sourceFormulas": ["Actual Cost − Standard/Budget Cost"],
		"aliases": ["Cost Variance"],
		"families": ["Cost"],
		"sections": [15],
		"requiredOperands": ["actual_cost", "standard_cost"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Absolute currency and normalized percent source occurrences require separate IDs."],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cost_variance_percent",
		"expression": "100 * (actual_cost - standard_cost) / standard_cost",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-130"],
		"sourceFormulas": ["(Actual − Standard) / Standard × 100"],
		"aliases": ["Cost Variance %"],
		"families": ["Cost"],
		"sections": [15],
		"requiredOperands": ["actual_cost", "standard_cost"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Absolute currency and normalized percent source occurrences require separate IDs."],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.material_usage_variance",
		"expression": "(actual_material_qty - standard_material_qty) * standard_material_price",
		"unit": "USD",
		"aggregation": "sum_by_effective_rate",
		"sourceOccurrences": ["OCC-131"],
		"sourceFormulas": ["(Actual Quantity − Standard Quantity) × Standard Price"],
		"aliases": ["Material Usage Variance"],
		"families": ["Cost"],
		"sections": [15],
		"requiredOperands": [
			"actual_material_qty",
			"standard_material_price",
			"standard_material_qty"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.labor_efficiency_variance",
		"expression": "(actual_labor_h - standard_labor_h) * standard_labor_rate",
		"unit": "USD",
		"aggregation": "sum_by_effective_rate",
		"sourceOccurrences": ["OCC-132"],
		"sourceFormulas": ["(Actual Hours − Standard Hours) × Standard Labor Rate"],
		"aliases": ["Labor Efficiency Variance"],
		"families": ["Cost"],
		"sections": [15],
		"requiredOperands": [
			"actual_labor_h",
			"standard_labor_h",
			"standard_labor_rate"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["manufacturing_cost"],
		"grainPolicies": [{
			"familyID": "manufacturing_cost",
			"grain": "exclusive cost transaction/version by period and accepted output",
			"recordBindings": "cost_rates + cost ledger + counts + labor/material events",
			"validScopes": [
				"currency",
				"site",
				"job",
				"part-revision",
				"period"
			],
			"aggregation": "Sum costs one currency and basis; per-unit pool cost/output. Absolute vs normalized variance separate. Downtime estimate not additive to ledger actuals without approved valuation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.copq_cost_of_poor_quality",
		"expression": "internal_failure_cost + external_failure_cost",
		"unit": "USD",
		"aggregation": "sum_exclusive_categories",
		"sourceOccurrences": ["OCC-133", "OCC-312"],
		"sourceFormulas": ["Internal Failure Cost + External Failure Cost", "See source concept / governance requirement"],
		"aliases": ["COPQ", "COPQ — Cost of Poor Quality"],
		"families": ["Cost of quality", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [16, 28],
		"requiredOperands": ["external_failure_cost", "internal_failure_cost"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["coq"],
		"grainPolicies": [{
			"familyID": "coq",
			"grain": "exclusive prevention/appraisal/internal/external categories",
			"recordBindings": "cost_ledger + governed sales/period",
			"validScopes": [
				"currency",
				"site",
				"period"
			],
			"aggregation": "Scrap/rework detail included in internal failure total, not added twice; warranty subset external. Currency comparisons cannot infer realized savings."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cost_of_quality",
		"expression": "prevention_cost + appraisal_cost + internal_failure_cost + external_failure_cost",
		"unit": "USD",
		"aggregation": "sum_exclusive_categories",
		"sourceOccurrences": ["OCC-134"],
		"sourceFormulas": ["Prevention + Appraisal + Internal Failure + External Failure"],
		"aliases": ["Cost of Quality"],
		"families": ["Cost of quality"],
		"sections": [16],
		"requiredOperands": [
			"appraisal_cost",
			"external_failure_cost",
			"internal_failure_cost",
			"prevention_cost"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["coq"],
		"grainPolicies": [{
			"familyID": "coq",
			"grain": "exclusive prevention/appraisal/internal/external categories",
			"recordBindings": "cost_ledger + governed sales/period",
			"validScopes": [
				"currency",
				"site",
				"period"
			],
			"aggregation": "Scrap/rework detail included in internal failure total, not added twice; warranty subset external. Currency comparisons cannot infer realized savings."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.copq_sales",
		"expression": "100 * copq_amount / sales",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-135"],
		"sourceFormulas": ["COPQ / Sales × 100"],
		"aliases": ["COPQ % Sales"],
		"families": ["Cost of quality"],
		"sections": [16],
		"requiredOperands": ["copq_amount", "sales"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["coq"],
		"grainPolicies": [{
			"familyID": "coq",
			"grain": "exclusive prevention/appraisal/internal/external categories",
			"recordBindings": "cost_ledger + governed sales/period",
			"validScopes": [
				"currency",
				"site",
				"period"
			],
			"aggregation": "Scrap/rework detail included in internal failure total, not added twice; warranty subset external. Currency comparisons cannot infer realized savings."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.warranty_cost",
		"expression": "100 * warranty_cost_amount / sales",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-137"],
		"sourceFormulas": ["Warranty Cost / Sales × 100"],
		"aliases": ["Warranty Cost %"],
		"families": ["Cost of quality"],
		"sections": [16],
		"requiredOperands": ["sales", "warranty_cost_amount"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["coq"],
		"grainPolicies": [{
			"familyID": "coq",
			"grain": "exclusive prevention/appraisal/internal/external categories",
			"recordBindings": "cost_ledger + governed sales/period",
			"validScopes": [
				"currency",
				"site",
				"period"
			],
			"aggregation": "Scrap/rework detail included in internal failure total, not added twice; warranty subset external. Currency comparisons cannot infer realized savings."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.energy_consumption",
		"expression": "energy_kwh",
		"unit": "kWh",
		"aggregation": "sum_valid_meter_deltas",
		"sourceOccurrences": ["OCC-138"],
		"sourceFormulas": ["Σ energy used"],
		"aliases": ["Energy Consumption"],
		"families": ["Energy and sustainability"],
		"sections": [17],
		"requiredOperands": ["energy_kwh"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.energy_per_unit",
		"expression": "energy_kwh / good_units",
		"unit": "kWh/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-139", "OCC-313"],
		"sourceFormulas": ["See source concept / governance requirement", "Total Energy / Good Units"],
		"aliases": ["Energy per Unit", "energy/unit"],
		"families": ["Energy and sustainability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [17, 28],
		"requiredOperands": ["energy_kwh", "good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.energy_intensity",
		"expression": "energy_kwh / governed_production_measure",
		"unit": "kWh/governed_output_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-140"],
		"sourceFormulas": ["Energy / Production Measure"],
		"aliases": ["Energy Intensity"],
		"families": ["Energy and sustainability"],
		"sections": [17],
		"requiredOperands": ["energy_kwh", "governed_production_measure"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.idle_energy",
		"expression": "100 * idle_kwh / energy_kwh",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-141", "OCC-314"],
		"sourceFormulas": ["Energy During Nonproductive Time / Total Energy × 100", "See source concept / governance requirement"],
		"aliases": ["Idle Energy %", "idle-energy %"],
		"families": ["Energy and sustainability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [17, 28],
		"requiredOperands": ["energy_kwh", "idle_kwh"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.peak_demand",
		"expression": "max(interval_kw)",
		"unit": "kW",
		"aggregation": "max",
		"sourceOccurrences": ["OCC-142", "OCC-315"],
		"sourceFormulas": ["Maximum demand during period", "See source concept / governance requirement"],
		"aliases": ["Peak Demand", "peak demand"],
		"families": ["Energy and sustainability", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [17, 28],
		"requiredOperands": ["interval_kw"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.co_e_per_unit",
		"expression": "co2e_kg / good_units",
		"unit": "kgCO2e/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-143"],
		"sourceFormulas": ["Total CO₂e / Good Units"],
		"aliases": ["CO₂e per Unit"],
		"families": ["Energy and sustainability"],
		"sections": [17],
		"requiredOperands": ["co2e_kg", "good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.waste_per_unit",
		"expression": "waste_kg / good_units",
		"unit": "kg/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-144"],
		"sourceFormulas": ["Waste Generated / Good Units"],
		"aliases": ["Waste per Unit"],
		"families": ["Energy and sustainability"],
		"sections": [17],
		"requiredOperands": ["good_units", "waste_kg"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.water_per_unit",
		"expression": "water_m3 / good_units",
		"unit": "m3/good_unit",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-145"],
		"sourceFormulas": ["Water Consumption / Good Units"],
		"aliases": ["Water per Unit"],
		"families": ["Energy and sustainability"],
		"sections": [17],
		"requiredOperands": ["good_units", "water_m3"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["energy_environment"],
		"grainPolicies": [{
			"familyID": "energy_environment",
			"grain": "meter boundary and reading/interval duration",
			"recordBindings": "meter_readings + daily_energy + demand_intervals + output + versioned factor",
			"validScopes": [
				"meter",
				"site",
				"period"
			],
			"aggregation": "Energy from non-reset meter deltas. kW interval max distinct from kWh. Scope output to same meter boundary; idle classification defined, factor kgCO2e/kWh version. Gaps/resets withheld."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.constraint_lost_time",
		"expression": "constraint_available_min - constraint_productive_min",
		"unit": "min",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-148"],
		"sourceFormulas": ["Available Constraint Time − Productive Constraint Time"],
		"aliases": ["Constraint Lost Time"],
		"families": ["Constraint / Theory of Constraints measures"],
		"sections": [18],
		"requiredOperands": ["constraint_available_min", "constraint_productive_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["constraint"],
		"grainPolicies": [{
			"familyID": "constraint",
			"grain": "effective dated actual constraint operation",
			"recordBindings": "jobs + counts + constraint assignments + standards",
			"validScopes": [
				"constraint",
				"line",
				"operation",
				"window"
			],
			"aggregation": "Run utilization distinct from productive utilization. Units/time good output; throughput-contribution financial model not operational quantity."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.constraint_yield",
		"expression": "100 * constraint_good_units / constraint_input_units",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-149"],
		"sourceFormulas": ["Good Constraint Output / Constraint Input × 100"],
		"aliases": ["Constraint Yield"],
		"families": ["Constraint / Theory of Constraints measures"],
		"sections": [18],
		"requiredOperands": ["constraint_good_units", "constraint_input_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["constraint"],
		"grainPolicies": [{
			"familyID": "constraint",
			"grain": "effective dated actual constraint operation",
			"recordBindings": "jobs + counts + constraint assignments + standards",
			"validScopes": [
				"constraint",
				"line",
				"operation",
				"window"
			],
			"aggregation": "Run utilization distinct from productive utilization. Units/time good output; throughput-contribution financial model not operational quantity."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.throughput_contribution",
		"expression": "sales - totally_variable_cost",
		"unit": "USD",
		"aggregation": "governed_financial_model",
		"sourceOccurrences": ["OCC-150"],
		"sourceFormulas": ["Sales − Totally Variable Cost where governed financial model supports it"],
		"aliases": ["Throughput Contribution"],
		"families": ["Constraint / Theory of Constraints measures"],
		"sections": [18],
		"requiredOperands": ["sales", "totally_variable_cost"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"one currency and effective cost basis, exclusive ledger categories; estimate not realized benefit"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["constraint"],
		"grainPolicies": [{
			"familyID": "constraint",
			"grain": "effective dated actual constraint operation",
			"recordBindings": "jobs + counts + constraint assignments + standards",
			"validScopes": [
				"constraint",
				"line",
				"operation",
				"window"
			],
			"aggregation": "Run utilization distinct from productive utilization. Units/time good output; throughput-contribution financial model not operational quantity."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.trir",
		"expression": "recordable_cases * 200000 / worked_h",
		"unit": "case_per_200000_person_h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-151"],
		"sourceFormulas": ["(Recordable Cases × 200,000) / Hours Worked"],
		"aliases": ["TRIR"],
		"families": ["Safety"],
		"sections": [19],
		"requiredOperands": ["recordable_cases", "worked_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["safety"],
		"grainPolicies": [{
			"familyID": "safety",
			"grain": "classified incident and eligible worker exposure period",
			"recordBindings": "safety_events + labor exposures",
			"validScopes": ["site", "window"],
			"aggregation": "Recordable/DART/lost-time case IDs deduplicated; multiplier200000 matches worked personhours; no inference zero risk from zero observed incidents."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.dart_rate",
		"expression": "dart_cases * 200000 / worked_h",
		"unit": "case_per_200000_person_h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-152"],
		"sourceFormulas": ["(DART Cases × 200,000) / Hours Worked"],
		"aliases": ["DART Rate"],
		"families": ["Safety"],
		"sections": [19],
		"requiredOperands": ["dart_cases", "worked_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["safety"],
		"grainPolicies": [{
			"familyID": "safety",
			"grain": "classified incident and eligible worker exposure period",
			"recordBindings": "safety_events + labor exposures",
			"validScopes": ["site", "window"],
			"aggregation": "Recordable/DART/lost-time case IDs deduplicated; multiplier200000 matches worked personhours; no inference zero risk from zero observed incidents."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.lost_time_incident_rate",
		"expression": "lost_time_cases * 200000 / worked_h",
		"unit": "case_per_200000_person_h",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-153"],
		"sourceFormulas": ["(Lost-Time Cases × 200,000) / Hours Worked"],
		"aliases": ["Lost-Time Incident Rate"],
		"families": ["Safety"],
		"sections": [19],
		"requiredOperands": ["lost_time_cases", "worked_h"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["safety"],
		"grainPolicies": [{
			"familyID": "safety",
			"grain": "classified incident and eligible worker exposure period",
			"recordBindings": "safety_events + labor exposures",
			"validScopes": ["site", "window"],
			"aggregation": "Recordable/DART/lost-time case IDs deduplicated; multiplier200000 matches worked personhours; no inference zero risk from zero observed incidents."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.near_miss_rate",
		"expression": "near_misses * exposure_multiplier / exposure_denominator",
		"unit": "case_per_governed_exposure",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-154"],
		"sourceFormulas": ["Near Misses / Governed exposure denominator"],
		"aliases": ["Near-Miss Rate"],
		"families": ["Safety"],
		"sections": [19],
		"requiredOperands": [
			"exposure_denominator",
			"exposure_multiplier",
			"near_misses"
		],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Exposure denominator and multiplier unspecified. No canonical numeric rate without supplied versioned policy."],
		"familyPolicyIDs": ["safety"],
		"grainPolicies": [{
			"familyID": "safety",
			"grain": "classified incident and eligible worker exposure period",
			"recordBindings": "safety_events + labor exposures",
			"validScopes": ["site", "window"],
			"aggregation": "Recordable/DART/lost-time case IDs deduplicated; multiplier200000 matches worked personhours; no inference zero risk from zero observed incidents."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.availability_loss_time",
		"expression": "planned_min - run_min",
		"unit": "min",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-169"],
		"sourceFormulas": ["Availability Loss Time = Planned Production Time − Run Time"],
		"aliases": ["Availability Loss Time"],
		"families": ["Loss calculations EKAS should support"],
		"sections": [21],
		"requiredOperands": ["planned_min", "run_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.performance_loss_time",
		"expression": "run_min - ideal_total_min",
		"unit": "min",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-170"],
		"sourceFormulas": ["Performance Loss Time = Run Time − (Ideal Cycle Time × Total Count)"],
		"aliases": ["Performance Loss Time"],
		"families": ["Loss calculations EKAS should support"],
		"sections": [21],
		"requiredOperands": ["ideal_total_min", "run_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.quality_loss_units",
		"expression": "total_units - good_units",
		"unit": "unit",
		"aggregation": "sum_exclusive_cohorts",
		"sourceOccurrences": ["OCC-171"],
		"sourceFormulas": ["Quality Loss Units = Total Count − Good Count ; Quality Loss Time = Defective Count × Ideal Cycle Time"],
		"aliases": ["Quality Loss Units and Quality Loss Time"],
		"families": ["Loss calculations EKAS should support"],
		"sections": [21],
		"requiredOperands": ["good_units", "total_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["One occurrence contains two quantities with different units; bind a bundle, not scalar."],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.quality_loss_time",
		"expression": "ideal_total_min - ideal_good_min",
		"unit": "min",
		"aggregation": "sum",
		"sourceOccurrences": ["OCC-171"],
		"sourceFormulas": ["Quality Loss Units = Total Count − Good Count ; Quality Loss Time = Defective Count × Ideal Cycle Time"],
		"aliases": ["Quality Loss Units and Quality Loss Time"],
		"families": ["Loss calculations EKAS should support"],
		"sections": [21],
		"requiredOperands": ["ideal_good_min", "ideal_total_min"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["One occurrence contains two quantities with different units; bind a bundle, not scalar."],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.lost_units",
		"expression": "expected_units - good_units",
		"unit": "unit_estimate",
		"aggregation": "sum_homogeneous_or_by_segment",
		"sourceOccurrences": ["OCC-172"],
		"sourceFormulas": ["Lost Units = Expected Units − Actual Good Units"],
		"aliases": ["Lost Units"],
		"families": ["Loss calculations EKAS should support"],
		"sections": [21],
		"requiredOperands": ["expected_units", "good_units"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.unfavorable_gap_higher",
		"expression": "target_value - actual_value",
		"unit": "metric_unit",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": [
			"OCC-173",
			"OCC-202",
			"OCC-316"
		],
		"sourceFormulas": ["Gap = Target − Actual ; Gap = Actual − Target", "See source concept / governance requirement"],
		"aliases": [
			"Higher-is-better gap",
			"Unfavorable Gap to Target",
			"gap to target"
		],
		"families": ["Loss calculations EKAS should support", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [21, 28],
		"requiredOperands": ["actual_value", "target_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Higher/lower direction mandatory. Positive-only ranking uses max(0,gap) for ranking only, retains signed gap."],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.unfavorable_gap_lower",
		"expression": "actual_value - target_value",
		"unit": "metric_unit",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": [
			"OCC-173",
			"OCC-203",
			"OCC-316"
		],
		"sourceFormulas": ["Gap = Target − Actual ; Gap = Actual − Target", "See source concept / governance requirement"],
		"aliases": [
			"Lower-is-better gap",
			"Unfavorable Gap to Target",
			"gap to target"
		],
		"families": ["Loss calculations EKAS should support", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [21, 28],
		"requiredOperands": ["actual_value", "target_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Higher/lower direction mandatory. Positive-only ranking uses max(0,gap) for ranking only, retains signed gap."],
		"familyPolicyIDs": ["loss_bridge"],
		"grainPolicies": [{
			"familyID": "loss_bridge",
			"grain": "planned/run/ideal total/ideal good sufficient statistics",
			"recordBindings": "production quantities and governed targets",
			"validScopes": [
				"site",
				"line",
				"job",
				"window"
			],
			"aggregation": "Additive time waterfall planned-run-(ideal total loss)-(ideal good loss)=ideal good; unit bridge separately uses compatible rates. Favorable signed gaps retained, positive-only ranking presentation."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.absolute_change",
		"expression": "current_value - previous_value",
		"unit": "metric_unit_or_percentage_point",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-174", "OCC-205"],
		"sourceFormulas": ["Current − Previous ; 83.3% − 87.5% = −4.2 percentage points", "See source concept / governance requirement"],
		"aliases": ["Absolute change", "Percentage Points"],
		"families": ["Comparison calculations"],
		"sections": [22],
		"requiredOperands": ["current_value", "previous_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["comparison"],
		"grainPolicies": [{
			"familyID": "comparison",
			"grain": "matched current/prior metric-definition/scope/window",
			"recordBindings": "canonical results + eligibility",
			"validScopes": [
				"metric",
				"scope",
				"comparison"
			],
			"aggregation": "Recompute both operands; percent ratios retain fraction internally and pp display; relative needs nonzero prior; target version frozen."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.relative_percentage_change",
		"expression": "100 * (current_value - previous_value) / previous_value",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-175", "OCC-206"],
		"sourceFormulas": ["(Current − Previous) / Previous × 100", "See source concept / governance requirement"],
		"aliases": ["Relative Percent Change", "Relative percentage change"],
		"families": ["Comparison calculations"],
		"sections": [22],
		"requiredOperands": ["current_value", "previous_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["comparison"],
		"grainPolicies": [{
			"familyID": "comparison",
			"grain": "matched current/prior metric-definition/scope/window",
			"recordBindings": "canonical results + eligibility",
			"validScopes": [
				"metric",
				"scope",
				"comparison"
			],
			"aggregation": "Recompute both operands; percent ratios retain fraction internally and pp display; relative needs nonzero prior; target version frozen."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.target_variance_absolute",
		"expression": "actual_value - target_value",
		"unit": "metric_unit",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-176"],
		"sourceFormulas": ["Actual − Target ; (Actual − Target) / Target × 100"],
		"aliases": ["Target variance"],
		"families": ["Comparison calculations"],
		"sections": [22],
		"requiredOperands": ["actual_value", "target_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source provides absolute and relative variants in one occurrence. Preserve both."],
		"familyPolicyIDs": ["comparison"],
		"grainPolicies": [{
			"familyID": "comparison",
			"grain": "matched current/prior metric-definition/scope/window",
			"recordBindings": "canonical results + eligibility",
			"validScopes": [
				"metric",
				"scope",
				"comparison"
			],
			"aggregation": "Recompute both operands; percent ratios retain fraction internally and pp display; relative needs nonzero prior; target version frozen."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.target_variance_relative",
		"expression": "100 * (actual_value - target_value) / target_value",
		"unit": "%",
		"aggregation": "recompute_comparison",
		"sourceOccurrences": ["OCC-176", "OCC-207"],
		"sourceFormulas": ["Actual − Target ; (Actual − Target) / Target × 100", "See source concept / governance requirement"],
		"aliases": ["Normalized Target Variance", "Target variance"],
		"families": ["Comparison calculations"],
		"sections": [22],
		"requiredOperands": ["actual_value", "target_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Source provides absolute and relative variants in one occurrence. Preserve both."],
		"familyPolicyIDs": ["comparison"],
		"grainPolicies": [{
			"familyID": "comparison",
			"grain": "matched current/prior metric-definition/scope/window",
			"recordBindings": "canonical results + eligibility",
			"validScopes": [
				"metric",
				"scope",
				"comparison"
			],
			"aggregation": "Recompute both operands; percent ratios retain fraction internally and pp display; relative needs nonzero prior; target version frozen."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.moving_average",
		"expression": "mean(last_n_values)",
		"unit": "metric_unit",
		"aggregation": "chronological_equal_periods",
		"sourceOccurrences": ["OCC-177", "OCC-317"],
		"sourceFormulas": ["MAₙ = Σ(last n values) / n", "See source concept / governance requirement"],
		"aliases": ["Moving average", "trend"],
		"families": ["Trend metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [23, 28],
		"requiredOperands": ["last_n_values"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"chronological observations, equal or explicitly weighted periods, missing-period policy; no future/interpolated points silently inserted"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["trend"],
		"grainPolicies": [{
			"familyID": "trend",
			"grain": "chronological equal-period canonical observations",
			"recordBindings": "canonical results ordered by timestamp",
			"validScopes": [
				"metric",
				"scope",
				"window"
			],
			"aggregation": "Moving-average length/grain explicit; OLS uses numeric time offsets, sample SD n>=2 proposed; missing/stale points not silently interpolated. Temporal leakage prohibited."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.rolling_change",
		"expression": "current_value - value_n_periods_ago",
		"unit": "metric_unit",
		"aggregation": "chronological_comparison",
		"sourceOccurrences": ["OCC-178", "OCC-317"],
		"sourceFormulas": ["Current − Value N periods ago", "See source concept / governance requirement"],
		"aliases": ["Rolling change", "trend"],
		"families": ["Trend metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [23, 28],
		"requiredOperands": ["current_value", "value_n_periods_ago"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"chronological observations, equal or explicitly weighted periods, missing-period policy; no future/interpolated points silently inserted"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["trend"],
		"grainPolicies": [{
			"familyID": "trend",
			"grain": "chronological equal-period canonical observations",
			"recordBindings": "canonical results ordered by timestamp",
			"validScopes": [
				"metric",
				"scope",
				"window"
			],
			"aggregation": "Moving-average length/grain explicit; OLS uses numeric time offsets, sample SD n>=2 proposed; missing/stale points not silently interpolated. Temporal leakage prohibited."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.trend_slope",
		"expression": "ols_slope(time_offsets, ordered_values)",
		"unit": "metric_unit/time_unit",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-179", "OCC-317"],
		"sourceFormulas": ["Regression slope across ordered period/value observations.", "See source concept / governance requirement"],
		"aliases": ["Trend slope", "trend"],
		"families": ["Trend metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [23, 28],
		"requiredOperands": ["ordered_values", "time_offsets"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"chronological observations, equal or explicitly weighted periods, missing-period policy; no future/interpolated points silently inserted"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["trend"],
		"grainPolicies": [{
			"familyID": "trend",
			"grain": "chronological equal-period canonical observations",
			"recordBindings": "canonical results ordered by timestamp",
			"validScopes": [
				"metric",
				"scope",
				"window"
			],
			"aggregation": "Moving-average length/grain explicit; OLS uses numeric time offsets, sample SD n>=2 proposed; missing/stale points not silently interpolated. Temporal leakage prohibited."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.volatility",
		"expression": "100 * sample_sd(values) / mean(values)",
		"unit": "%",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-180", "OCC-317"],
		"sourceFormulas": ["CV = σ / μ × 100", "See source concept / governance requirement"],
		"aliases": ["Volatility", "trend"],
		"families": ["Trend metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [23, 28],
		"requiredOperands": ["values"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"chronological observations, equal or explicitly weighted periods, missing-period policy; no future/interpolated points silently inserted"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Sigma estimator/population vs sample not settled; sample SD proposed training convention, n>=2 and positive mean required."],
		"familyPolicyIDs": ["trend"],
		"grainPolicies": [{
			"familyID": "trend",
			"grain": "chronological equal-period canonical observations",
			"recordBindings": "canonical results ordered by timestamp",
			"validScopes": [
				"metric",
				"scope",
				"window"
			],
			"aggregation": "Moving-average length/grain explicit; OLS uses numeric time offsets, sample SD n>=2 proposed; missing/stale points not silently interpolated. Temporal leakage prohibited."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.category_contribution",
		"expression": "100 * category_loss / total_loss",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": [
			"OCC-181",
			"OCC-210",
			"OCC-318"
		],
		"sourceFormulas": ["Category Loss / Total Loss × 100", "See source concept / governance requirement"],
		"aliases": [
			"Category contribution",
			"Loss Pareto",
			"Pareto contribution"
		],
		"families": ["Pareto calculations", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [24, 28],
		"requiredOperands": ["category_loss", "total_loss"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["pareto"],
		"grainPolicies": [{
			"familyID": "pareto",
			"grain": "exclusive eligible loss categories",
			"recordBindings": "loss/cost facts in one unit",
			"validScopes": [
				"scope",
				"category",
				"window"
			],
			"aggregation": "Rank by value descending then stable categoryID tie; cumulative numerator/uncapped total. Nine categories retained; topN plus Other explicit."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.cumulative_contribution",
		"expression": "100 * ranked_cumulative_loss / total_loss",
		"unit": "%",
		"aggregation": "rank_then_cumulate",
		"sourceOccurrences": ["OCC-182"],
		"sourceFormulas": ["Σ ranked category contributions"],
		"aliases": ["Cumulative contribution"],
		"families": ["Pareto calculations"],
		"sections": [24],
		"requiredOperands": ["ranked_cumulative_loss", "total_loss"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["pareto"],
		"grainPolicies": [{
			"familyID": "pareto",
			"grain": "exclusive eligible loss categories",
			"recordBindings": "loss/cost facts in one unit",
			"validScopes": [
				"scope",
				"category",
				"window"
			],
			"aggregation": "Rank by value descending then stable categoryID tie; cumulative numerator/uncapped total. Nine categories retained; topN plus Other explicit."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.improvement_absolute",
		"expression": "post_value - pre_value",
		"unit": "metric_unit_or_percentage_point",
		"aggregation": "matched_comparison",
		"sourceOccurrences": ["OCC-183", "OCC-320"],
		"sourceFormulas": ["Post-Action KPI − Pre-Action KPI", "See source concept / governance requirement"],
		"aliases": ["Improvement", "improvement"],
		"families": ["Action / sustain metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [25, 28],
		"requiredOperands": ["post_value", "pre_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Absolute and relative changes require separate IDs. Positive signed post-minus-pre is not automatically favorable for lower-is-better losses."],
		"familyPolicyIDs": ["improvement"],
		"grainPolicies": [{
			"familyID": "improvement",
			"grain": "case baseline/post eligible windows and due-action cohort",
			"recordBindings": "improvement_cases + action_records + verification/guardrail evidence",
			"validScopes": [
				"case",
				"measure",
				"window"
			],
			"aggregation": "Signed change not favorable direction; before/after matching and coverage; due-action numerator must be subset due denominator. Closure never proves performed/verified. Missing breaks sustain streak."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.improvement_relative",
		"expression": "100 * (post_value - pre_value) / pre_value",
		"unit": "%",
		"aggregation": "matched_comparison",
		"sourceOccurrences": ["OCC-184"],
		"sourceFormulas": ["(Post − Pre) / Pre × 100"],
		"aliases": ["Improvement %"],
		"families": ["Action / sustain metrics"],
		"sections": [25],
		"requiredOperands": ["post_value", "pre_value"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Absolute and relative changes require separate IDs. Positive signed post-minus-pre is not automatically favorable for lower-is-better losses."],
		"familyPolicyIDs": ["improvement"],
		"grainPolicies": [{
			"familyID": "improvement",
			"grain": "case baseline/post eligible windows and due-action cohort",
			"recordBindings": "improvement_cases + action_records + verification/guardrail evidence",
			"validScopes": [
				"case",
				"measure",
				"window"
			],
			"aggregation": "Signed change not favorable direction; before/after matching and coverage; due-action numerator must be subset due denominator. Closure never proves performed/verified. Missing breaks sustain streak."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.sustained_improvement",
		"expression": "all_threshold(last_n_values, threshold, direction)",
		"unit": "boolean",
		"aggregation": "chronological_eligible_streak",
		"sourceOccurrences": ["OCC-185", "OCC-322"],
		"sourceFormulas": ["KPI meets improvement threshold for N consecutive periods", "See source concept / governance requirement"],
		"aliases": ["Sustained Improvement", "action closure and sustain metrics"],
		"families": ["Action / sustain metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [25, 28],
		"requiredOperands": [
			"direction",
			"last_n_values",
			"threshold"
		],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training",
			"chronological observations, equal or explicitly weighted periods, missing-period policy; no future/interpolated points silently inserted"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["improvement"],
		"grainPolicies": [{
			"familyID": "improvement",
			"grain": "case baseline/post eligible windows and due-action cohort",
			"recordBindings": "improvement_cases + action_records + verification/guardrail evidence",
			"validScopes": [
				"case",
				"measure",
				"window"
			],
			"aggregation": "Signed change not favorable direction; before/after matching and coverage; due-action numerator must be subset due denominator. Closure never proves performed/verified. Missing breaks sustain streak."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.recurrence_rate",
		"expression": "100 * repeated_events / relevant_events",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-186", "OCC-321"],
		"sourceFormulas": ["Repeated Events / Total Relevant Events × 100", "See source concept / governance requirement"],
		"aliases": ["Recurrence Rate", "recurrence"],
		"families": ["Action / sustain metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [25, 28],
		"requiredOperands": ["relevant_events", "repeated_events"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["improvement"],
		"grainPolicies": [{
			"familyID": "improvement",
			"grain": "case baseline/post eligible windows and due-action cohort",
			"recordBindings": "improvement_cases + action_records + verification/guardrail evidence",
			"validScopes": [
				"case",
				"measure",
				"window"
			],
			"aggregation": "Signed change not favorable direction; before/after matching and coverage; due-action numerator must be subset due denominator. Closure never proves performed/verified. Missing breaks sustain streak."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.action_closure_rate",
		"expression": "100 * closed_due_actions / due_actions",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-187", "OCC-322"],
		"sourceFormulas": ["Completed Actions / Actions Due × 100", "See source concept / governance requirement"],
		"aliases": ["Action Closure Rate", "action closure and sustain metrics"],
		"families": ["Action / sustain metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [25, 28],
		"requiredOperands": ["closed_due_actions", "due_actions"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["improvement"],
		"grainPolicies": [{
			"familyID": "improvement",
			"grain": "case baseline/post eligible windows and due-action cohort",
			"recordBindings": "improvement_cases + action_records + verification/guardrail evidence",
			"validScopes": [
				"case",
				"measure",
				"window"
			],
			"aggregation": "Signed change not favorable direction; before/after matching and coverage; due-action numerator must be subset due denominator. Closure never proves performed/verified. Missing breaks sustain streak."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.on_time_action_closure",
		"expression": "100 * on_time_closed_due_actions / due_actions",
		"unit": "%",
		"aggregation": "pooled_ratio",
		"sourceOccurrences": ["OCC-188", "OCC-322"],
		"sourceFormulas": ["Actions Closed by Due Date / Actions Due × 100", "See source concept / governance requirement"],
		"aliases": ["On-Time Action Closure", "action closure and sustain metrics"],
		"families": ["Action / sustain metrics", "What I would consider the core EKAS manufacturing KPI library"],
		"sections": [25, 28],
		"requiredOperands": ["due_actions", "on_time_closed_due_actions"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["improvement"],
		"grainPolicies": [{
			"familyID": "improvement",
			"grain": "case baseline/post eligible windows and due-action cohort",
			"recordBindings": "improvement_cases + action_records + verification/guardrail evidence",
			"validScopes": [
				"case",
				"measure",
				"window"
			],
			"aggregation": "Signed change not favorable direction; before/after matching and coverage; due-action numerator must be subset due denominator. Closure never proves performed/verified. Missing breaks sustain streak."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.internal_setup_time",
		"expression": "internal_setup_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": ["OCC-189"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["Internal Setup Time"],
		"families": ["Changeover and setup"],
		"sections": [6],
		"requiredOperands": ["internal_setup_union_min"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.external_setup_time",
		"expression": "external_setup_union_min",
		"unit": "min",
		"aggregation": "sum_union_intervals",
		"sourceOccurrences": ["OCC-190"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["External Setup Time"],
		"families": ["Changeover and setup"],
		"sections": [6],
		"requiredOperands": ["external_setup_union_min"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["setup"],
		"grainPolicies": [{
			"familyID": "setup",
			"grain": "old/new product transition last-good->first-good",
			"recordBindings": "setup transitions and tasks + standards",
			"validScopes": [
				"asset",
				"line",
				"transition",
				"shift"
			],
			"aggregation": "Transition elapsed durations pooled by transition count; internal/external task union independently, no parallel labor double count."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.process_mean",
		"expression": "mean(values)",
		"unit": "measurement_unit",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-194"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["Process Mean"],
		"families": ["Process capability"],
		"sections": [9],
		"requiredOperands": ["values"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.overall_sigma",
		"expression": "sample_sd(values)",
		"unit": "measurement_unit",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-196"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["Overall Sigma"],
		"families": ["Process capability"],
		"sections": [9],
		"requiredOperands": ["values"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.within_subgroup_sigma",
		"expression": "sqrt(within_ss / within_dof)",
		"unit": "measurement_unit",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-195"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["Within-subgroup Sigma"],
		"families": ["Process capability"],
		"sections": [9],
		"requiredOperands": ["within_dof", "within_ss"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": ["Estimator not provided. Proposed pooled within sample variance with degrees-of-freedom weighting; not interchangeable with Rbar/d2."],
		"familyPolicyIDs": ["capability_spc"],
		"grainPolicies": [{
			"familyID": "capability_spc",
			"grain": "characteristic/spec revision rational subgroup and raw measurements",
			"recordBindings": "measurements + subgroups + measurement_characteristics + MSA/stability records",
			"validScopes": [
				"characteristic",
				"operation",
				"part-revision",
				"window"
			],
			"aggregation": "Reestimate mean,within/overall sigma from raw data; no averaging Cp/Cpk. Approved estimator and rational subgroup required. Measurement units converted consistently before limit comparisons."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.standard_deviation",
		"expression": "sample_sd(values)",
		"unit": "metric_unit",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-208"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["Standard Deviation"],
		"families": ["Trend metrics"],
		"sections": [23],
		"requiredOperands": ["values"],
		"status": "proposed_demo_convention_requires_governance",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["trend"],
		"grainPolicies": [{
			"familyID": "trend",
			"grain": "chronological equal-period canonical observations",
			"recordBindings": "canonical results ordered by timestamp",
			"validScopes": [
				"metric",
				"scope",
				"window"
			],
			"aggregation": "Moving-average length/grain explicit; OLS uses numeric time offsets, sample SD n>=2 proposed; missing/stale points not silently interpolated. Temporal leakage prohibited."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	},
	{
		"id": "ekas.coefficient_of_variation",
		"expression": "100 * sample_sd(values) / mean(values)",
		"unit": "%",
		"aggregation": "reestimate_from_raw",
		"sourceOccurrences": ["OCC-209"],
		"sourceFormulas": ["See source concept / governance requirement"],
		"aliases": ["Coefficient of Variation"],
		"families": ["Trend metrics"],
		"sections": [23],
		"requiredOperands": ["values"],
		"status": "source_formula_with_governed_bindings_required",
		"decisionAuthority": "source-specific mathematical shape; operand policy below is proposed demo convention unless frozen Northworks",
		"grain": "eligible source entity/window; group only disjoint facts; reference relational-spec.json family policies",
		"prerequisites": [
			"explicit fixture namespace, effective definition, matching unit basis and scope",
			"known_at<=as_of and observation_end<=as_of",
			"complete eligible coverage or unavailable reason",
			"all denominator operands strictly positive where division applies",
			"referenced policy dimensions resolved; never fill missing Northworks facts from training"
		],
		"boundaryCases": [
			"no_data",
			"missing_input",
			"zero_denominator",
			"masked",
			"unsupported_scope",
			"incompatible_units",
			"future_record",
			"partial_coverage",
			"nonfinite_result"
		],
		"aggregationRules": [
			"aggregate sufficient statistics then evaluate; never average rendered percentages",
			"distinct unit/event/order IDs before sums; prevent join multiplication",
			"time intervals clipped and partitioned; snapshot balances not summed across dates"
		],
		"conflicts": [],
		"familyPolicyIDs": ["trend"],
		"grainPolicies": [{
			"familyID": "trend",
			"grain": "chronological equal-period canonical observations",
			"recordBindings": "canonical results ordered by timestamp",
			"validScopes": [
				"metric",
				"scope",
				"window"
			],
			"aggregation": "Moving-average length/grain explicit; OLS uses numeric time offsets, sample SD n>=2 proposed; missing/stale points not silently interpolated. Temporal leakage prohibited."
		}],
		"activation": "Requires source operand policies and eligibility; test algebra alone is not an accepted production definition"
	}
];
//#endregion
export { definitions };
