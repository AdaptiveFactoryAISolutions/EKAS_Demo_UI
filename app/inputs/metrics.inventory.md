# EKAS metric requirements inventory

Source: user-provided Pasted text.md, 729 lines. Every entry below is a target requirement. Recognition, execution and certification are NOT VERIFIED for the current product. The source’s statement about 59 API subjects has not been tested.

This inventory preserves repeated named entries and conditional aliases rather than collapsing distinct plant definitions. Formula text is retained as supplied; semantic review below takes precedence before activation.

## 1. OEE and equipment effectiveness

Source lines 7–26. Surface: Loss bridge; A/P/Q decomposition; timeline. Required inputs: PLC/MES counts, run-state intervals, governed ideal cycle and planned time.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-001 | OEE | metric | oee | 11–11 | Availability × Performance × Quality |
| KPI-002 | Availability | metric | availability | 12–12 | Run Time / Planned Production Time |
| KPI-003 | Run Time | metric | run_time | 13–13 | Planned Production Time − Downtime |
| KPI-004 | Performance | metric | performance | 14–14 | (Ideal Cycle Time × Total Count) / Run Time |
| KPI-005 | Quality | metric | quality | 15–15 | Good Count / Total Count |
| KPI-006 | Overall Utilization | metric | overall_utilization | 16–16 | Run Time / Calendar Time |
| KPI-007 | Asset Utilization | metric | asset_utilization | 17–17 | Actual Operating Time / Available Asset Time |
| KPI-008 | TEEP | metric | teep | 18–18 | OEE × Loading where Loading = Planned Production Time / Calendar Time |
| KPI-009 | Loading | metric | loading | 19–19 | Planned Production Time / Calendar Time |
| KPI-010 | OEE Gap to Target | metric | oee_gap_to_target | 20–20 | Target OEE − Actual OEE |
| KPI-011 | OEE Improvement | metric | oee_improvement | 21–21 | Current OEE − Baseline OEE |

Semantic review flags: pooled_aggregation, ideal_cycle_product_mix, planned_time_policy.

## 2. Production and output

Source lines 27–58. Surface: Plan versus actual by shift/product; output waterfall; constraint view. Required inputs: MES actuals, approved plan version, capacity calendar.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-012 | Production vs Plan | metric | production_vs_plan | 31–31 | Actual Production / Planned Production × 100 |
| KPI-013 | Production Attainment | metric | production_vs_plan | 32–32 | Actual Output / Target Output × 100 |
| KPI-014 | Production Variance | metric | production_variance | 33–33 | Actual Output − Planned Output |
| KPI-015 | Throughput | metric | net_throughput | 34–34 | Good Units Produced / Time Period |
| KPI-016 | Gross Throughput | metric | gross_throughput | 35–35 | Total Units Produced / Time Period |
| KPI-017 | Net Throughput | metric | net_throughput | 36–36 | Good Units Produced / Time Period |
| KPI-018 | Run Rate | metric | run_rate | 37–37 | Units Produced / Operating Time |
| KPI-019 | Target Run Rate | metric | target_run_rate | 38–38 | 1 / Ideal Cycle Time |
| KPI-020 | Run Rate Attainment | metric | run_rate_attainment | 39–39 | Actual Run Rate / Target Run Rate × 100 |
| KPI-021 | Capacity Utilization | metric | capacity_utilization | 40–40 | Actual Output / Rated Capacity × 100 |
| KPI-022 | Capacity Attainment | metric | capacity_attainment | 41–41 | Actual Output / Available Capacity × 100 |
| KPI-023 | Unused Capacity | metric | unused_capacity | 42–42 | Available Capacity − Actual Output |
| KPI-024 | Constraint Utilization | metric | constraint_utilization | 43–43 | Constraint Run Time / Constraint Available Time × 100 |
| KPI-025 | Bottleneck Throughput | metric | constraint_throughput | 44–44 | Good Units through Constraint / Time |

Semantic review flags: plan_not_capacity, capacity_units_and_period, mix_adjustment.

## 3. Schedule metrics

Source lines 59–74. Surface: Schedule ribbon; exception queue; order drill-down. Required inputs: Frozen schedule version, completion events, order/quantity basis.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-026 | Schedule Adherence | metric | schedule_adherence | 63–63 | Production completed as scheduled / Scheduled production × 100 |
| KPI-027 | Schedule Attainment | metric | schedule_attainment | 64–64 | Actual quantity completed / Scheduled quantity × 100 |
| KPI-028 | Plan Attainment | metric | production_vs_plan | 65–65 | Actual production / Planned production × 100 |
| KPI-029 | Schedule Variance | metric | schedule_variance | 66–66 | Actual Completion − Planned Completion |
| KPI-030 | Orders Completed to Schedule | metric | orders_completed_to_schedule | 67–67 | Orders completed on scheduled date / Total scheduled orders × 100 |

Semantic review flags: schedule_denominator, schedule_baseline_version.

## 4. Cycle time and takt

Source lines 75–97. Surface: Cycle distribution; route flow map; queue/touch breakdown. Required inputs: Timestamped unit/lot journeys, engineered standards, demand calendar.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-031 | Actual Cycle Time | metric | actual_cycle_time | 79–79 | Operating Time / Units Produced |
| KPI-032 | Ideal Cycle Time | metric | ideal_cycle_time | 80–80 | Best demonstrated or engineered cycle time per unit |
| KPI-033 | Cycle Time Variance | metric | cycle_time_variance | 81–81 | Actual Cycle Time − Standard Cycle Time |
| KPI-034 | Cycle Time Performance | metric | cycle_time_performance | 82–82 | Standard Cycle Time / Actual Cycle Time × 100 |
| KPI-035 | Takt Time | metric | takt_time | 83–83 | Available Production Time / Customer Demand |
| KPI-036 | Takt Attainment | metric | takt_attainment | 84–84 | Takt Time / Actual Cycle Time × 100 |
| KPI-037 | Cycle-to-Takt Ratio | metric | cycle_to_takt_ratio | 85–85 | Actual Cycle Time / Takt Time |
| KPI-038 | Lead Time | metric | lead_time | 86–86 | Completion Timestamp − Release/Order Timestamp |
| KPI-039 | Manufacturing Lead Time | metric | manufacturing_lead_time | 87–87 | Queue + Setup + Run + Move + Wait Time |
| KPI-040 | Touch Time | metric | touch_time | 88–88 | Actual processing time spent on product |
| KPI-041 | Flow Efficiency | metric | flow_efficiency | 89–89 | Value-Added Time / Total Lead Time × 100 |

Semantic review flags: time_boundary, matched_demand_calendar.

## 5. Downtime and loss

Source lines 98–120. Surface: Reason Pareto; event timeline; overlap-aware loss bridge. Required inputs: Machine events, reason taxonomy, expected run rate.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-042 | Total Downtime | metric | total_downtime | 102–102 | Σ downtime event durations |
| KPI-043 | Unplanned Downtime | metric | unplanned_downtime | 103–103 | Σ unplanned downtime event durations |
| KPI-044 | Planned Downtime | metric | planned_downtime | 104–104 | Σ planned downtime durations |
| KPI-045 | Downtime % | metric | downtime | 105–105 | Downtime / Planned Production Time × 100 |
| KPI-046 | Uptime % | metric | availability | 106–106 | Run Time / Planned Production Time × 100 |
| KPI-047 | Downtime Frequency | metric | downtime_frequency | 107–107 | Number of downtime events / Period |
| KPI-048 | Average Downtime Event | metric | average_downtime_event | 108–108 | Total Downtime / Number of Downtime Events |
| KPI-049 | Downtime by Reason | metric | downtime_by_reason | 109–109 | Σ duration for reason code |
| KPI-050 | Downtime Contribution | metric | downtime_contribution | 110–110 | Reason Downtime / Total Downtime × 100 |
| KPI-051 | Top Loss Contribution | metric | top_loss_contribution | 111–111 | Largest Loss / Total Loss × 100 |
| KPI-052 | Minor Stop Time | metric | minor_stop_time | 112–112 | Σ qualifying short-stop durations |
| KPI-053 | Speed Loss | metric | speed_loss | 113–113 | Potential Output at Ideal Rate − Actual Output during runtime |
| KPI-054 | Lost Production from Downtime | metric | lost_production_from_downtime | 114–114 | Downtime × Expected Run Rate |
| KPI-055 | Downtime Cost | metric | downtime_cost | 115–115 | Downtime × Governed Cost Rate |

Semantic review flags: event_overlap, speed_loss_units, cost_governance.

## 6. Changeover and setup

Source lines 121–134. Surface: Changeover comparison; internal/external setup timeline. Required inputs: Last-good/first-good events, product transitions, setup standard.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-056 | Changeover Time | metric | changeover_time | 125–125 | First Good Unit New Product − Last Good Unit Previous Product |
| KPI-057 | Average Changeover Time | metric | average_changeover_time | 126–126 | Σ Changeover Time / Number of Changeovers |
| KPI-058 | Changeover Variance | metric | changeover_variance | 127–127 | Actual Changeover − Standard Changeover |
| KPI-059 | Changeover Attainment | metric | changeover_attainment | 128–128 | Standard Changeover / Actual Changeover × 100 |
| KPI-060 | Setup Loss | metric | setup_loss | 129–129 | Actual Setup Time − Target Setup Time |
| KPI-189 | Internal Setup Time | concept | internal_setup_time | 121–134 | See source concept / governance requirement |
| KPI-190 | External Setup Time | concept | external_setup_time | 121–134 | See source concept / governance requirement |
| KPI-191 | SMED | concept | smed | 121–134 | See source concept / governance requirement |

Semantic review flags: timestamp_boundaries, setup_loss_signed.

## 7. Quality

Source lines 135–158. Surface: Quality funnel; defect Pareto; lot genealogy; dispositions. Required inputs: Inspection, unique units, defect opportunities, scrap/rework dispositions.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-061 | Quality Rate | metric | quality | 139–139 | Good Units / Total Units × 100 |
| KPI-062 | Yield | metric | quality | 140–140 | Good Units / Total Units × 100 |
| KPI-063 | FPY — First Pass Yield | metric | first_pass_yield | 141–141 | Units passing without rework / Units entering process × 100 |
| KPI-064 | First Time Through | metric | first_time_through | 142–142 | Good units requiring no repair/rework / Total units × 100 |
| KPI-065 | Scrap Rate | metric | scrap_rate | 143–143 | Scrap Units / Total Units Produced × 100 |
| KPI-066 | Reject Rate | metric | reject_rate | 144–144 | Rejected Units / Total Units Inspected × 100 |
| KPI-067 | Rework Rate | metric | rework_rate | 145–145 | Reworked Units / Total Units Produced × 100 |
| KPI-068 | Defect Rate | metric | defect_rate | 146–146 | Defective Units / Units Inspected × 100 |
| KPI-069 | Defects per Unit (DPU) | metric | defects_per_unit_dpu | 147–147 | Total Defects / Units Inspected |
| KPI-070 | DPMO | metric | dpmo | 148–148 | Defects / (Units × Opportunities per Unit) × 1,000,000 |
| KPI-071 | PPM Defective | metric | ppm_defective | 149–149 | Defective Units / Total Units × 1,000,000 |
| KPI-072 | Customer Reject Rate | metric | customer_reject_rate | 150–150 | Customer-Rejected Units / Units Shipped × 100 |
| KPI-073 | Customer PPM | metric | customer_ppm | 151–151 | Customer Defective Units / Units Shipped × 1,000,000 |
| KPI-074 | Quality Loss | metric | quality_loss | 152–152 | Nonconforming Units / Total Units × 100 |
| KPI-075 | Good Count | metric | good_count | 153–153 | Total Count − Scrap − rejected/rework as governed |

Semantic review flags: disposition_overlap, unique_units_vs_defects, cohort_alignment.

## 8. Rolled yield

Source lines 159–180. Surface: Route yield waterfall; operation FPY drill-down. Required inputs: Aligned route cohorts and first-pass operation outcomes.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-076 | Rolled Throughput Yield | analytical_measure | rolled_throughput_yield | 163–178 | RTY = FPY₁ × FPY₂ × FPY₃ × ... × FPYₙ ; RTY = 0.98 × 0.97 × 0.99 = 94.1% |

Semantic review flags: route_cohort, unrounded_product, rty_example_rounding.

## 9. Process capability

Source lines 181–202. Surface: Control chart plus distribution/spec limits; capability trust panel. Required inputs: Raw measurements, rational subgroups, specification versions, measurement-system study.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-077 | Cp | metric | cp | 187–187 | (USL − LSL) / (6σ) |
| KPI-078 | Cpk | metric | cpk | 188–188 | min[(USL − μ)/(3σ), (μ − LSL)/(3σ)] |
| KPI-079 | Pp | metric | pp | 189–189 | (USL − LSL) / (6σoverall) |
| KPI-080 | Ppk | metric | ppk | 190–190 | min[(USL − μ)/(3σoverall), (μ − LSL)/(3σoverall)] |
| KPI-192 | USL | concept | usl | 181–202 | See source concept / governance requirement |
| KPI-193 | LSL | concept | lsl | 181–202 | See source concept / governance requirement |
| KPI-194 | Process Mean | concept | process_mean | 181–202 | See source concept / governance requirement |
| KPI-195 | Within-subgroup Sigma | concept | within_subgroup_sigma | 181–202 | See source concept / governance requirement |
| KPI-196 | Overall Sigma | concept | overall_sigma | 181–202 | See source concept / governance requirement |
| KPI-197 | Sample Adequacy | concept | sample_adequacy | 181–202 | See source concept / governance requirement |
| KPI-198 | Measurement-System Integrity | concept | measurement_system_integrity | 181–202 | See source concept / governance requirement |

Semantic review flags: sigma_estimator, stability_distribution_msa, no_naive_pooling.

## 10. Maintenance and reliability

Source lines 203–242. Surface: Failure/repair timeline; asset repeat-failure Pareto; PM backlog. Required inputs: CMMS work orders, repair/restore events, exposure, failure taxonomy.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-081 | MTBF | metric | mtbf | 207–207 | Total Operating Time / Number of Failures |
| KPI-082 | MTTR — Mean Time to Repair | metric | mttr_repair | 208–208 | Total Active Repair Time / Number of Repairs |
| KPI-083 | MTTR — Mean Time to Restore | metric | mttr_restore | 209–209 | Total Restoration Downtime / Number of Incidents |
| KPI-084 | MTTF | metric | mttf | 210–210 | Total Operating Life / Number of Nonrepairable Failures |
| KPI-085 | Failure Rate | metric | failure_rate | 211–211 | Number of Failures / Operating Time |
| KPI-086 | Reliability | metric | reliability | 212–212 | commonly e^(−λt) for constant failure rate |
| KPI-087 | Repair Rate | metric | repair_rate | 213–213 | Repairs Completed / Repair Time |
| KPI-088 | Maintenance Downtime % | metric | maintenance_downtime | 214–214 | Maintenance Downtime / Planned Production Time × 100 |
| KPI-089 | Breakdown Frequency | metric | breakdown_frequency | 215–215 | Breakdowns / Period |
| KPI-090 | Reactive Maintenance % | metric | reactive_maintenance | 216–216 | Reactive Maintenance Hours / Total Maintenance Hours × 100 |
| KPI-091 | Planned Maintenance % | metric | planned_maintenance | 217–217 | Planned Maintenance Hours / Total Maintenance Hours × 100 |
| KPI-092 | PM Compliance | metric | pm_compliance | 218–218 | PMs completed on time / PMs scheduled × 100 |
| KPI-093 | Schedule Compliance — Maintenance | metric | schedule_compliance_maintenance | 219–219 | Scheduled jobs completed as planned / Scheduled jobs × 100 |
| KPI-094 | Maintenance Backlog | metric | maintenance_backlog | 220–220 | Outstanding Maintenance Labor Hours / Available Weekly Maintenance Labor Hours |
| KPI-095 | Repeat Failure Rate | metric | repeat_failure_rate | 221–221 | Repeated failures / Total failures × 100 |
| KPI-096 | Emergency Work % | metric | emergency_work | 222–222 | Emergency work hours / Total maintenance hours × 100 |
| KPI-199 | MTTR clarification | concept | mttr_clarification | 203–242 | See source concept / governance requirement |

Semantic review flags: repair_vs_restore, zero_failures, censoring, constant_hazard.

## 11. Delivery and customer service

Source lines 243–259. Surface: Order risk queue; promise-to-delivery timeline; OTIF decomposition. Required inputs: Order lines, shipped/delivered quantity, original/revised promise timestamps.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-097 | OTIF | metric | otif | 247–247 | Orders delivered On Time AND In Full / Total Orders × 100 |
| KPI-098 | On-Time Delivery (OTD) | metric | on_time_delivery_otd | 248–248 | Orders delivered on/before promise date / Total Delivered Orders × 100 |
| KPI-099 | In-Full Delivery | metric | in_full_delivery | 249–249 | Orders delivered complete / Total Orders × 100 |
| KPI-100 | Fill Rate | metric | fill_rate | 250–250 | Units shipped immediately / Units ordered × 100 |
| KPI-101 | Perfect Order Rate | metric | perfect_order_rate | 251–251 | Perfect Orders / Total Orders × 100 |
| KPI-102 | Late Order Rate | metric | late_order_rate | 252–252 | Late Orders / Total Orders × 100 |
| KPI-103 | Past-Due Quantity | metric | past_due_quantity | 253–253 | Σ outstanding quantity past promised date |
| KPI-104 | Average Delivery Delay | metric | average_delivery_delay | 254–254 | Σ late days / Late Deliveries |

Semantic review flags: promise_date_version, due_cohort_vs_delivered_cohort, order_line_unit_basis.

## 12. Inventory

Source lines 260–275. Surface: Inventory composition; age distribution; stock-versus-flow detail. Required inputs: Inventory snapshots, valuation policy, COGS/consumption and periods.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-105 | Inventory Turns | metric | inventory_turns | 264–264 | Annual COGS / Average Inventory Value |
| KPI-106 | Inventory Days / DIO | metric | inventory_days_dio | 265–265 | Average Inventory / COGS × Days in Period |
| KPI-107 | Raw Material Days | metric | raw_material_days | 266–266 | Average Raw Material Inventory / Material Usage × Days |
| KPI-108 | WIP Days | metric | wip_days | 267–267 | Average WIP / Manufacturing Cost or Throughput × Days |
| KPI-109 | Finished Goods Days | metric | finished_goods_days | 268–268 | Average FG Inventory / COGS × Days |
| KPI-110 | WIP Units | metric | wip_units | 269–269 | Σ units currently inside production process |
| KPI-111 | Inventory Accuracy | metric | inventory_accuracy | 270–270 | Correct inventory records / Records checked × 100 |
| KPI-112 | Obsolete Inventory % | metric | obsolete_inventory | 271–271 | Obsolete Inventory Value / Total Inventory Value × 100 |
| KPI-113 | Excess Inventory % | metric | excess_inventory | 272–272 | Inventory Above Governed Maximum / Total Inventory × 100 |

Semantic review flags: valuation_and_period, wip_dimensions, time_weighted_inventory.

## 13. Little's Law / manufacturing flow

Source lines 276–299. Surface: Explicit what-if panel; baseline/assumption/result comparison. Required inputs: Matched time-average WIP, throughput and boundary-defined lead times.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-114 | Little's Law | model | little_s_law | 280–297 | WIP = Throughput × Lead Time ; Lead Time = WIP / Throughput ; Throughput = WIP / Lead Time |

Semantic review flags: steady_state_boundary, scenario_not_causal_prediction.

## 14. Labor and workforce productivity

Source lines 300–315. Surface: Product/mix-adjusted labor trends; hours composition. Required inputs: Approved labor hours, standard time versions, good output.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-115 | Labor Productivity | metric | labor_productivity | 304–304 | Good Units / Labor Hours |
| KPI-116 | Labor Efficiency | metric | labor_efficiency | 305–305 | Standard Hours Earned / Actual Labor Hours × 100 |
| KPI-117 | Standard Hours Earned | metric | standard_hours_earned | 306–306 | Good Quantity × Standard Labor Time per Unit |
| KPI-118 | Labor Utilization | metric | labor_utilization | 307–307 | Productive Labor Hours / Paid Labor Hours × 100 |
| KPI-119 | Direct Labor Utilization | metric | direct_labor_utilization | 308–308 | Direct Productive Hours / Direct Available Hours × 100 |
| KPI-120 | Overtime % | metric | overtime | 309–309 | Overtime Hours / Total Labor Hours × 100 |
| KPI-121 | Absenteeism Rate | metric | absenteeism_rate | 310–310 | Absent Scheduled Hours / Total Scheduled Hours × 100 |
| KPI-122 | Units per Employee Hour | metric | units_per_employee_hour | 311–311 | Good Units / Employee Hours |
| KPI-123 | Labor Cost per Unit | metric | labor_cost_per_unit | 312–312 | Direct Labor Cost / Good Units |

Semantic review flags: hour_categories, product_mix, privacy.

## 15. Cost

Source lines 316–333. Surface: Cost bridge; physical-loss to valuation detail; finance approval. Required inputs: Governed cost ledger/rates, quantity and allocation rules.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-124 | Manufacturing Cost per Unit | metric | manufacturing_cost_per_unit | 322–322 | Total Manufacturing Cost / Good Units Produced |
| KPI-125 | Conversion Cost per Unit | metric | conversion_cost_per_unit | 323–323 | (Direct Labor + Manufacturing Overhead) / Good Units |
| KPI-126 | Scrap Cost | metric | scrap_cost | 324–324 | Scrap Quantity × Governed Unit Cost |
| KPI-127 | Rework Cost | metric | rework_cost | 325–325 | Rework Labor + Material + Overhead |
| KPI-128 | Downtime Cost | metric | downtime_cost | 326–326 | Downtime Duration × Governed Loss/Cost Rate |
| KPI-129 | Cost Variance | metric | cost_variance | 327–327 | Actual Cost − Standard/Budget Cost |
| KPI-130 | Cost Variance % | metric | cost_variance | 328–328 | (Actual − Standard) / Standard × 100 |
| KPI-131 | Material Usage Variance | metric | material_usage_variance | 329–329 | (Actual Quantity − Standard Quantity) × Standard Price |
| KPI-132 | Labor Efficiency Variance | metric | labor_efficiency_variance | 330–330 | (Actual Hours − Standard Hours) × Standard Labor Rate |

Semantic review flags: cost_governance, double_counting, currency_period.

## 16. Cost of quality

Source lines 334–345. Surface: Cost-of-quality partition; linked failure ledger. Required inputs: Finance-approved prevention/appraisal/internal/external cost categories.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-133 | COPQ — Cost of Poor Quality | metric | copq_cost_of_poor_quality | 338–338 | Internal Failure Cost + External Failure Cost |
| KPI-134 | Cost of Quality | metric | cost_of_quality | 339–339 | Prevention + Appraisal + Internal Failure + External Failure |
| KPI-135 | COPQ % Sales | metric | copq_sales | 340–340 | COPQ / Sales × 100 |
| KPI-136 | Scrap Cost % | metric | scrap_cost | 341–341 | Scrap Cost / Manufacturing Cost × 100 |
| KPI-137 | Warranty Cost % | metric | warranty_cost | 342–342 | Warranty Cost / Sales × 100 |

Semantic review flags: exclusive_cost_partition, double_counting.

## 17. Energy and sustainability

Source lines 346–362. Surface: Energy-versus-output trend; idle load; demand profile. Required inputs: Meter interval data, production denominator, emission factor versions.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-138 | Energy Consumption | metric | energy_consumption | 350–350 | Σ energy used |
| KPI-139 | Energy per Unit | metric | energy_per_unit | 351–351 | Total Energy / Good Units |
| KPI-140 | Energy Intensity | metric | energy_intensity | 352–352 | Energy / Production Measure |
| KPI-141 | Idle Energy % | metric | idle_energy | 353–353 | Energy During Nonproductive Time / Total Energy × 100 |
| KPI-142 | Peak Demand | metric | peak_demand | 354–354 | Maximum demand during period |
| KPI-143 | CO₂e per Unit | metric | co_e_per_unit | 355–355 | Total CO₂e / Good Units |
| KPI-144 | Waste per Unit | metric | waste_per_unit | 356–356 | Waste Generated / Good Units |
| KPI-145 | Water per Unit | metric | water_per_unit | 357–357 | Water Consumption / Good Units |

Semantic review flags: meter_coverage, factor_governance, energy_vs_power, mix_weather_normalization.

## 18. Constraint / Theory of Constraints measures

Source lines 363–376. Surface: Constraint flow and starvation/blockage timeline. Required inputs: Constraint calendar, throughput, yields, governed contribution model.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-146 | Constraint Utilization | metric | constraint_utilization | 369–369 | Constraint Productive Time / Constraint Available Time × 100 |
| KPI-147 | Constraint Throughput | metric | constraint_throughput | 370–370 | Good Units Through Constraint / Time |
| KPI-148 | Constraint Lost Time | metric | constraint_lost_time | 371–371 | Available Constraint Time − Productive Constraint Time |
| KPI-149 | Constraint Yield | metric | constraint_yield | 372–372 | Good Constraint Output / Constraint Input × 100 |
| KPI-150 | Throughput Contribution | metric | throughput_contribution | 373–373 | Sales − Totally Variable Cost where governed financial model supports it |

Semantic review flags: run_vs_productive_time, local_vs_system_optimum, financial_throughput_vs_physical.

## 19. Safety

Source lines 377–391. Surface: Restricted safety rate trend with exposure and case counts. Required inputs: Permissioned EHS case classifications and employee exposure.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-151 | TRIR | metric | trir | 383–383 | (Recordable Cases × 200,000) / Hours Worked |
| KPI-152 | DART Rate | metric | dart_rate | 384–384 | (DART Cases × 200,000) / Hours Worked |
| KPI-153 | Lost-Time Incident Rate | metric | lost_time_incident_rate | 385–385 | (Lost-Time Cases × 200,000) / Hours Worked |
| KPI-154 | Near-Miss Rate | metric | near_miss_rate | 386–386 | Near Misses / Governed exposure denominator |

Semantic review flags: restricted_access, jurisdiction_definition, exposure_denominator.

## 20. Plant Head Daily Operations Audit

Source lines 392–421. Surface: Seven-metric daily audit; ranked exceptions and actions. Required inputs: Governed primary metric bindings, target versions, status and coverage.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-155 | Production vs Plan | metric | production_vs_plan | 398–398 | Actual Production / Planned Production × 100 |
| KPI-156 | OEE | metric | oee | 399–399 | Availability × Performance × Quality |
| KPI-157 | Downtime | metric | total_downtime | 400–400 | Σ governed downtime duration |
| KPI-158 | Quality Loss | metric | quality_loss | 401–401 | Nonconforming Output / Total Output × 100 |
| KPI-159 | Schedule Adherence | metric | schedule_adherence | 402–402 | Production completed according to schedule / Scheduled production × 100 |
| KPI-160 | Inventory Days | metric | inventory_days_dio | 403–403 | Average Inventory / Consumption or COGS × Days |
| KPI-161 | OTIF | metric | otif | 404–404 | Orders on-time AND in-full / Total applicable orders × 100 |
| KPI-162 | Production vs Plan | reference_target | production_vs_plan | 410–410 | ≥ 100% |
| KPI-163 | OEE | reference_target | oee | 411–411 | ≥ 85% |
| KPI-164 | Downtime | reference_target | total_downtime | 412–412 | Minimize / plant target |
| KPI-165 | Quality Loss | reference_target | quality_loss | 413–413 | ≤ 2% |
| KPI-166 | Schedule Adherence | reference_target | schedule_adherence | 414–414 | ≥ 95% |
| KPI-167 | Inventory Days | reference_target | inventory_days_dio | 415–415 | Governed operating range |
| KPI-168 | OTIF | reference_target | otif | 416–416 | ≥ 95% |
| KPI-200 | Plant Head Daily Operations Audit | concept | plant_head_daily_operations_audit | 392–421 | See source concept / governance requirement |
| KPI-201 | Governed operating range | concept | governed_operating_range | 392–421 | See source concept / governance requirement |

Semantic review flags: governed_targets, no_universal_benchmarks.

## 21. Loss calculations EKAS should support

Source lines 422–461. Surface: Non-overlapping loss bridge and opportunity ledger. Required inputs: Underlying event/count/time inputs and governed expectation.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-169 | Availability Loss Time | analytical_measure | availability_loss_time | 426–429 | Availability Loss Time = Planned Production Time − Run Time |
| KPI-170 | Performance Loss Time | analytical_measure | performance_loss_time | 430–435 | Performance Loss Time = Run Time − (Ideal Cycle Time × Total Count) |
| KPI-171 | Quality Loss Units and Quality Loss Time | analytical_measure | quality_loss_units_and_quality_loss_time | 436–443 | Quality Loss Units = Total Count − Good Count ; Quality Loss Time = Defective Count × Ideal Cycle Time |
| KPI-172 | Lost Units | analytical_measure | lost_units | 444–447 | Lost Units = Expected Units − Actual Good Units |
| KPI-173 | Unfavorable Gap to Target | analytical_measure | unfavorable_gap_to_target | 448–459 | Gap = Target − Actual ; Gap = Actual − Target |
| KPI-202 | Higher-is-better gap | concept | higher_is_better_gap | 422–461 | See source concept / governance requirement |
| KPI-203 | Lower-is-better gap | concept | lower_is_better_gap | 422–461 | See source concept / governance requirement |
| KPI-204 | Positive unfavorable gap ranking | concept | positive_unfavorable_gap_ranking | 422–461 | See source concept / governance requirement |

Semantic review flags: mutually_exclusive_losses, governed_expected_output, negative_loss_validation.

## 22. Comparison calculations

Source lines 462–498. Surface: Baseline chips; absolute/relative toggle; target variance. Required inputs: Matched definitions, comparable windows, baseline and target.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-174 | Absolute change | analytical_measure | absolute_change | 466–473 | Current − Previous ; 83.3% − 87.5% = −4.2 percentage points |
| KPI-175 | Relative percentage change | analytical_measure | relative_percentage_change | 474–486 | (Current − Previous) / Previous × 100 |
| KPI-176 | Target variance | analytical_measure | target_variance | 487–496 | Actual − Target ; (Actual − Target) / Target × 100 |
| KPI-205 | Percentage Points | concept | percentage_points | 462–498 | See source concept / governance requirement |
| KPI-206 | Relative Percent Change | concept | relative_percent_change | 462–498 | See source concept / governance requirement |
| KPI-207 | Normalized Target Variance | concept | normalized_target_variance | 462–498 | See source concept / governance requirement |

Semantic review flags: percentage_points, zero_baseline, matched_comparators.

## 23. Trend metrics

Source lines 499–524. Surface: Run/control chart with analytical overlay. Required inputs: Ordered observations, time spacing, missing-data policy.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-177 | Moving average | analytical_measure | moving_average | 503–506 | MAₙ = Σ(last n values) / n |
| KPI-178 | Rolling change | analytical_measure | rolling_change | 507–510 | Current − Value N periods ago |
| KPI-179 | Trend slope | analytical_measure | trend_slope | 511–514 | Regression slope across ordered period/value observations. |
| KPI-180 | Volatility | analytical_measure | volatility | 515–522 | CV = σ / μ × 100 |
| KPI-208 | Standard Deviation | concept | standard_deviation | 499–524 | See source concept / governance requirement |
| KPI-209 | Coefficient of Variation | concept | coefficient_of_variation | 499–524 | See source concept / governance requirement |

Semantic review flags: pooled_vs_mean, cv_zero_mean, irregular_sampling.

## 24. Pareto calculations

Source lines 525–544. Surface: Sorted Pareto plus cumulative curve and Other category. Required inputs: Exclusive loss categories with same unit and boundary.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-181 | Category contribution | analytical_measure | category_contribution | 529–532 | Category Loss / Total Loss × 100 |
| KPI-182 | Cumulative contribution | analytical_measure | cumulative_contribution | 533–542 | Σ ranked category contributions |
| KPI-210 | Loss Pareto | concept | loss_pareto | 525–544 | See source concept / governance requirement |

Semantic review flags: same_loss_unit, exclusive_categories, missing_reason_coverage.

## 25. Action / sustain metrics

Source lines 545–582. Surface: Action board; baseline/post-action chart; verification window. Required inputs: Action, owner, due date, completion proof, metric observations.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-183 | Improvement | analytical_measure | improvement | 549–554 | Post-Action KPI − Pre-Action KPI |
| KPI-184 | Improvement % | analytical_measure | improvement | 555–558 | (Post − Pre) / Pre × 100 |
| KPI-185 | Sustained Improvement | analytical_measure | sustained_improvement | 559–564 | KPI meets improvement threshold for N consecutive periods |
| KPI-186 | Recurrence Rate | analytical_measure | recurrence_rate | 565–568 | Repeated Events / Total Relevant Events × 100 |
| KPI-187 | Action Closure Rate | analytical_measure | action_closure_rate | 569–572 | Completed Actions / Actions Due × 100 |
| KPI-188 | On-Time Action Closure | analytical_measure | on_time_action_closure | 573–580 | Actions Closed by Due Date / Actions Due × 100 |
| KPI-211 | Find → Quantify → Act → Sustain | concept | find_quantify_act_sustain | 545–582 | See source concept / governance requirement |
| KPI-212 | Action completion evidence | concept | action_completion_evidence | 545–582 | See source concept / governance requirement |
| KPI-213 | Verification window | concept | verification_window | 545–582 | See source concept / governance requirement |

Semantic review flags: closure_not_effectiveness, attribution_confounding, sustain_window.

## 26. Metric Registry fields I recommend

Source lines 583–651. Surface: Metric definition drawer; catalog readiness matrix; version history. Required inputs: Registry metadata, approvals and evidence links.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-219 | metric_id | registry_field | metric_id | 588–588 | See source concept / governance requirement |
| KPI-220 | canonical_name | registry_field | canonical_name | 589–589 | See source concept / governance requirement |
| KPI-221 | display_name | registry_field | display_name | 590–590 | See source concept / governance requirement |
| KPI-222 | aliases | registry_field | aliases | 591–591 | See source concept / governance requirement |
| KPI-223 | domain | registry_field | domain | 592–592 | See source concept / governance requirement |
| KPI-224 | definition | registry_field | definition | 593–593 | See source concept / governance requirement |
| KPI-225 | formula | registry_field | formula | 594–594 | See source concept / governance requirement |
| KPI-226 | formula_version | registry_field | formula_version | 595–595 | See source concept / governance requirement |
| KPI-227 | calculation_owner | registry_field | calculation_owner | 596–596 | See source concept / governance requirement |
| KPI-228 | numerator | registry_field | numerator | 597–597 | See source concept / governance requirement |
| KPI-229 | denominator | registry_field | denominator | 598–598 | See source concept / governance requirement |
| KPI-230 | units | registry_field | units | 599–599 | See source concept / governance requirement |
| KPI-231 | display_units | registry_field | display_units | 600–600 | See source concept / governance requirement |
| KPI-232 | precision | registry_field | precision | 601–601 | See source concept / governance requirement |
| KPI-233 | aggregation_method | registry_field | aggregation_method | 602–602 | See source concept / governance requirement |
| KPI-234 | valid_entity_scopes | registry_field | valid_entity_scopes | 603–603 | See source concept / governance requirement |
| KPI-235 | valid_time_grains | registry_field | valid_time_grains | 604–604 | See source concept / governance requirement |
| KPI-236 | good_direction | registry_field | good_direction | 605–605 | See source concept / governance requirement |
| KPI-237 | target_source | registry_field | target_source | 606–606 | See source concept / governance requirement |
| KPI-238 | target | registry_field | target | 607–607 | See source concept / governance requirement |
| KPI-239 | warning_threshold | registry_field | warning_threshold | 608–608 | See source concept / governance requirement |
| KPI-240 | critical_threshold | registry_field | critical_threshold | 609–609 | See source concept / governance requirement |
| KPI-241 | required_sources | registry_field | required_sources | 610–610 | See source concept / governance requirement |
| KPI-242 | required_data_coverage | registry_field | required_data_coverage | 611–611 | See source concept / governance requirement |
| KPI-243 | evidence_requirements | registry_field | evidence_requirements | 612–612 | See source concept / governance requirement |
| KPI-244 | certification_owner | registry_field | certification_owner | 613–613 | See source concept / governance requirement |
| KPI-245 | comparison_semantics | registry_field | comparison_semantics | 614–614 | See source concept / governance requirement |
| KPI-246 | chart_semantics | registry_field | chart_semantics | 615–615 | See source concept / governance requirement |
| KPI-247 | clarification_rules | registry_field | clarification_rules | 616–616 | See source concept / governance requirement |
| KPI-248 | effectivity | registry_field | effectivity | 617–617 | See source concept / governance requirement |
| KPI-249 | version | registry_field | version | 618–618 | See source concept / governance requirement |
| KPI-250 | status | registry_field | status | 619–619 | See source concept / governance requirement |
| KPI-251 | recognition_status | registry_field | recognition_status | 625–625 | See source concept / governance requirement |
| KPI-252 | execution_status | registry_field | execution_status | 626–626 | See source concept / governance requirement |
| KPI-253 | certification_status | registry_field | certification_status | 627–627 | See source concept / governance requirement |

Semantic review flags: three_status_axes, effectivity, owner_authority.

## 27. The critical distinction: metric vs derived insight

Source lines 652–685. Surface: Fact/inference/hypothesis labels and evidence graph. Required inputs: Measurement lineage, observation derivation and investigation evidence.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-214 | Deterministic Metric | concept | deterministic_metric | 652–685 | See source concept / governance requirement |
| KPI-215 | Derived Observation | concept | derived_observation | 652–685 | See source concept / governance requirement |
| KPI-216 | Reasoning / Investigation | concept | reasoning_investigation | 652–685 | See source concept / governance requirement |
| KPI-217 | Root Cause | concept | root_cause | 652–685 | See source concept / governance requirement |

Semantic review flags: no_causal_overclaim, evidence_vs_hypothesis.

## 28. What I would consider the core EKAS manufacturing KPI library

Source lines 686–729. Surface: Searchable cross-domain library with aliases and availability. Required inputs: All catalog registrations with governed alias resolution.

| ID | Named metric / concept | Kind | Canonical key | Source lines | Source formula / rule |
|---|---|---|---|---|---|
| KPI-218 | Governed metric identity | concept | governed_metric_identity | 686–729 | See source concept / governance requirement |
| KPI-254 | OEE | library_alias | oee | 691–691 | See source concept / governance requirement |
| KPI-255 | Availability | library_alias | availability | 691–691 | See source concept / governance requirement |
| KPI-256 | Performance | library_alias | performance | 691–691 | See source concept / governance requirement |
| KPI-257 | Quality | library_alias | quality | 691–691 | See source concept / governance requirement |
| KPI-258 | TEEP | library_alias | teep | 691–691 | See source concept / governance requirement |
| KPI-259 | utilization | library_alias | utilization | 691–691 | See source concept / governance requirement |
| KPI-260 | production vs plan | library_alias | production_vs_plan | 694–694 | See source concept / governance requirement |
| KPI-261 | throughput | library_alias | throughput | 694–694 | See source concept / governance requirement |
| KPI-262 | attainment | library_alias | attainment | 694–694 | See source concept / governance requirement |
| KPI-263 | run rate | library_alias | run_rate | 694–694 | See source concept / governance requirement |
| KPI-264 | capacity utilization | library_alias | capacity_utilization | 694–694 | See source concept / governance requirement |
| KPI-265 | cycle time | library_alias | cycle_time | 694–694 | See source concept / governance requirement |
| KPI-266 | takt | library_alias | takt | 694–694 | See source concept / governance requirement |
| KPI-267 | downtime | library_alias | downtime | 697–697 | See source concept / governance requirement |
| KPI-268 | unplanned downtime | library_alias | unplanned_downtime | 697–697 | See source concept / governance requirement |
| KPI-269 | planned downtime | library_alias | planned_downtime | 697–697 | See source concept / governance requirement |
| KPI-270 | minor stops | library_alias | minor_stops | 697–697 | See source concept / governance requirement |
| KPI-271 | speed loss | library_alias | speed_loss | 697–697 | See source concept / governance requirement |
| KPI-272 | changeover | library_alias | changeover | 697–697 | See source concept / governance requirement |
| KPI-273 | FPY | library_alias | fpy | 700–700 | See source concept / governance requirement |
| KPI-274 | yield | library_alias | yield | 700–700 | See source concept / governance requirement |
| KPI-275 | RTY | library_alias | rty | 700–700 | See source concept / governance requirement |
| KPI-276 | scrap | library_alias | scrap | 700–700 | See source concept / governance requirement |
| KPI-277 | rejects | library_alias | rejects | 700–700 | See source concept / governance requirement |
| KPI-278 | rework | library_alias | rework | 700–700 | See source concept / governance requirement |
| KPI-279 | PPM | library_alias | ppm | 700–700 | See source concept / governance requirement |
| KPI-280 | DPMO | library_alias | dpmo | 700–700 | See source concept / governance requirement |
| KPI-281 | quality loss | library_alias | quality_loss | 700–700 | See source concept / governance requirement |
| KPI-282 | Cp/Cpk where appropriate | library_alias | cp_cpk_where_appropriate | 700–700 | See source concept / governance requirement |
| KPI-283 | MTBF | library_alias | mtbf | 703–703 | See source concept / governance requirement |
| KPI-284 | MTTR-Repair | library_alias | mttr_repair | 703–703 | See source concept / governance requirement |
| KPI-285 | MTTR-Restore | library_alias | mttr_restore | 703–703 | See source concept / governance requirement |
| KPI-286 | failure rate | library_alias | failure_rate | 703–703 | See source concept / governance requirement |
| KPI-287 | breakdown frequency | library_alias | breakdown_frequency | 703–703 | See source concept / governance requirement |
| KPI-288 | PM compliance | library_alias | pm_compliance | 703–703 | See source concept / governance requirement |
| KPI-289 | reactive maintenance % | library_alias | reactive_maintenance | 703–703 | See source concept / governance requirement |
| KPI-290 | maintenance backlog | library_alias | maintenance_backlog | 703–703 | See source concept / governance requirement |
| KPI-291 | schedule adherence | library_alias | schedule_adherence | 706–706 | See source concept / governance requirement |
| KPI-292 | OTIF | library_alias | otif | 706–706 | See source concept / governance requirement |
| KPI-293 | OTD | library_alias | otd | 706–706 | See source concept / governance requirement |
| KPI-294 | fill rate | library_alias | fill_rate | 706–706 | See source concept / governance requirement |
| KPI-295 | late orders | library_alias | late_orders | 706–706 | See source concept / governance requirement |
| KPI-296 | inventory days | library_alias | inventory_days | 709–709 | See source concept / governance requirement |
| KPI-297 | inventory turns | library_alias | inventory_turns | 709–709 | See source concept / governance requirement |
| KPI-298 | WIP | library_alias | wip | 709–709 | See source concept / governance requirement |
| KPI-299 | WIP days | library_alias | wip_days | 709–709 | See source concept / governance requirement |
| KPI-300 | RM days | library_alias | rm_days | 709–709 | See source concept / governance requirement |
| KPI-301 | FG days | library_alias | fg_days | 709–709 | See source concept / governance requirement |
| KPI-302 | flow efficiency | library_alias | flow_efficiency | 709–709 | See source concept / governance requirement |
| KPI-303 | lead time | library_alias | lead_time | 709–709 | See source concept / governance requirement |
| KPI-304 | labor productivity | library_alias | labor_productivity | 712–712 | See source concept / governance requirement |
| KPI-305 | labor efficiency | library_alias | labor_efficiency | 712–712 | See source concept / governance requirement |
| KPI-306 | utilization | library_alias | utilization | 712–712 | See source concept / governance requirement |
| KPI-307 | overtime | library_alias | overtime | 712–712 | See source concept / governance requirement |
| KPI-308 | cost/unit | library_alias | cost_unit | 715–715 | See source concept / governance requirement |
| KPI-309 | scrap cost | library_alias | scrap_cost | 715–715 | See source concept / governance requirement |
| KPI-310 | rework cost | library_alias | rework_cost | 715–715 | See source concept / governance requirement |
| KPI-311 | downtime cost | library_alias | downtime_cost | 715–715 | See source concept / governance requirement |
| KPI-312 | COPQ | library_alias | copq | 715–715 | See source concept / governance requirement |
| KPI-313 | energy/unit | library_alias | energy_unit | 718–718 | See source concept / governance requirement |
| KPI-314 | idle-energy % | library_alias | idle_energy | 718–718 | See source concept / governance requirement |
| KPI-315 | peak demand | library_alias | peak_demand | 718–718 | See source concept / governance requirement |
| KPI-316 | gap to target | library_alias | gap_to_target | 721–721 | See source concept / governance requirement |
| KPI-317 | trend | library_alias | trend | 721–721 | See source concept / governance requirement |
| KPI-318 | Pareto contribution | library_alias | pareto_contribution | 721–721 | See source concept / governance requirement |
| KPI-319 | top loss | library_alias | top_loss | 721–721 | See source concept / governance requirement |
| KPI-320 | improvement | library_alias | improvement | 721–721 | See source concept / governance requirement |
| KPI-321 | recurrence | library_alias | recurrence | 721–721 | See source concept / governance requirement |
| KPI-322 | action closure and sustain metrics | library_alias | action_closure_and_sustain_metrics | 721–721 | See source concept / governance requirement |

Semantic review flags: alias_clarification, full_library_scope.

