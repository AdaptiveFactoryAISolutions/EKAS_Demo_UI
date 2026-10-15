Yes. Below is the **canonical manufacturing metric/KPI catalog I would use for EKAS**.

One important distinction: this is the **target EKAS metric catalog and formula specification**, not a claim that every metric is already executable and certifiable in the current build. The current implementation is deliberately separating recognition, calculation availability, and certification authority, which is the correct approach.    Pasted text

I would put essentially this structure into the EKAS Metric Registry.

## 1. OEE and equipment effectiveness

| Metric                  | Formula                                                                   | Typical unit / interpretation |
| ----------------------- | ------------------------------------------------------------------------- | ----------------------------- |
| **OEE**                 | `Availability × Performance × Quality`                                    | %                             |
| **Availability**        | `Run Time / Planned Production Time`                                      | %                             |
| **Run Time**            | `Planned Production Time − Downtime`                                      | time                          |
| **Performance**         | `(Ideal Cycle Time × Total Count) / Run Time`                             | %                             |
| **Quality**             | `Good Count / Total Count`                                                | %                             |
| **Overall Utilization** | `Run Time / Calendar Time`                                                | %                             |
| **Asset Utilization**   | `Actual Operating Time / Available Asset Time`                            | %                             |
| **TEEP**                | `OEE × Loading` where `Loading = Planned Production Time / Calendar Time` | %                             |
| **Loading**             | `Planned Production Time / Calendar Time`                                 | %                             |
| **OEE Gap to Target**   | `Target OEE − Actual OEE`                                                 | percentage points             |
| **OEE Improvement**     | `Current OEE − Baseline OEE`                                              | percentage points             |

For EKAS, I would preserve OEE internally as the product of the underlying exact quantities but normally display percentages to sensible precision.

---

# 2. Production and output

| Metric                     | Formula                                                 | Unit            |
| -------------------------- | ------------------------------------------------------- | --------------- |
| **Production vs Plan**     | `Actual Production / Planned Production × 100`          | %               |
| **Production Attainment**  | `Actual Output / Target Output × 100`                   | %               |
| **Production Variance**    | `Actual Output − Planned Output`                        | units           |
| **Throughput**             | `Good Units Produced / Time Period`                     | units/hour      |
| **Gross Throughput**       | `Total Units Produced / Time Period`                    | units/hour      |
| **Net Throughput**         | `Good Units Produced / Time Period`                     | good units/hour |
| **Run Rate**               | `Units Produced / Operating Time`                       | units/hour      |
| **Target Run Rate**        | `1 / Ideal Cycle Time`                                  | units/time      |
| **Run Rate Attainment**    | `Actual Run Rate / Target Run Rate × 100`               | %               |
| **Capacity Utilization**   | `Actual Output / Rated Capacity × 100`                  | %               |
| **Capacity Attainment**    | `Actual Output / Available Capacity × 100`              | %               |
| **Unused Capacity**        | `Available Capacity − Actual Output`                    | units/time      |
| **Constraint Utilization** | `Constraint Run Time / Constraint Available Time × 100` | %               |
| **Bottleneck Throughput**  | `Good Units through Constraint / Time`                  | units/time      |

### Important distinction

Production vs Plan and Capacity Utilization are not interchangeable.

A plant could be:

- 100% to today's production plan;
- but only 70% utilized relative to theoretical capacity.

EKAS should understand that distinction.

---

# 3. Schedule metrics

| Metric                           | Formula                                                             | Unit          |
| -------------------------------- | ------------------------------------------------------------------- | ------------- |
| **Schedule Adherence**           | `Production completed as scheduled / Scheduled production × 100`    | %             |
| **Schedule Attainment**          | `Actual quantity completed / Scheduled quantity × 100`              | %             |
| **Plan Attainment**              | `Actual production / Planned production × 100`                      | %             |
| **Schedule Variance**            | `Actual Completion − Planned Completion`                            | time or units |
| **Orders Completed to Schedule** | `Orders completed on scheduled date / Total scheduled orders × 100` | %             |

I recommend EKAS make the exact definition of **Schedule Adherence** configurable because companies use different denominators.

The definition should be stored in the governed Metric Registry rather than assumed by the model.

---

# 4. Cycle time and takt

| Metric                      | Formula                                               | Unit      |
| --------------------------- | ----------------------------------------------------- | --------- |
| **Actual Cycle Time**       | `Operating Time / Units Produced`                     | sec/unit  |
| **Ideal Cycle Time**        | `Best demonstrated or engineered cycle time per unit` | sec/unit  |
| **Cycle Time Variance**     | `Actual Cycle Time − Standard Cycle Time`             | sec/unit  |
| **Cycle Time Performance**  | `Standard Cycle Time / Actual Cycle Time × 100`       | %         |
| **Takt Time**               | `Available Production Time / Customer Demand`         | time/unit |
| **Takt Attainment**         | `Takt Time / Actual Cycle Time × 100`                 | %         |
| **Cycle-to-Takt Ratio**     | `Actual Cycle Time / Takt Time`                       | ratio     |
| **Lead Time**               | `Completion Timestamp − Release/Order Timestamp`      | time      |
| **Manufacturing Lead Time** | `Queue + Setup + Run + Move + Wait Time`              | time      |
| **Touch Time**              | `Actual processing time spent on product`             | time      |
| **Flow Efficiency**         | `Value-Added Time / Total Lead Time × 100`            | %         |

For Cycle-to-Takt:

- `< 1` means production is theoretically ahead of demand;
- `> 1` means the process cannot sustain required demand.

---

# 5. Downtime and loss

| Metric                            | Formula                                                         | Unit        |
| --------------------------------- | --------------------------------------------------------------- | ----------- |
| **Total Downtime**                | `Σ downtime event durations`                                    | min/hr      |
| **Unplanned Downtime**            | `Σ unplanned downtime event durations`                          | min/hr      |
| **Planned Downtime**              | `Σ planned downtime durations`                                  | min/hr      |
| **Downtime %**                    | `Downtime / Planned Production Time × 100`                      | %           |
| **Uptime %**                      | `Run Time / Planned Production Time × 100`                      | %           |
| **Downtime Frequency**            | `Number of downtime events / Period`                            | events/time |
| **Average Downtime Event**        | `Total Downtime / Number of Downtime Events`                    | time/event  |
| **Downtime by Reason**            | `Σ duration for reason code`                                    | time        |
| **Downtime Contribution**         | `Reason Downtime / Total Downtime × 100`                        | %           |
| **Top Loss Contribution**         | `Largest Loss / Total Loss × 100`                               | %           |
| **Minor Stop Time**               | `Σ qualifying short-stop durations`                             | time        |
| **Speed Loss**                    | `Potential Output at Ideal Rate − Actual Output during runtime` | units/time  |
| **Lost Production from Downtime** | `Downtime × Expected Run Rate`                                  | units       |
| **Downtime Cost**                 | `Downtime × Governed Cost Rate`                                 | currency    |

Never estimate dollar loss unless the cost rate is governed.

---

# 6. Changeover and setup

| Metric                      | Formula                                                         | Unit |
| --------------------------- | --------------------------------------------------------------- | ---- |
| **Changeover Time**         | `First Good Unit New Product − Last Good Unit Previous Product` | time |
| **Average Changeover Time** | `Σ Changeover Time / Number of Changeovers`                     | time |
| **Changeover Variance**     | `Actual Changeover − Standard Changeover`                       | time |
| **Changeover Attainment**   | `Standard Changeover / Actual Changeover × 100`                 | %    |
| **Setup Loss**              | `Actual Setup Time − Target Setup Time`                         | time |

For SMED-style analysis, EKAS could later distinguish internal and external setup time.

---

# 7. Quality

| Metric                     | Formula                                                       | Unit                          |
| -------------------------- | ------------------------------------------------------------- | ----------------------------- |
| **Quality Rate**           | `Good Units / Total Units × 100`                              | %                             |
| **Yield**                  | `Good Units / Total Units × 100`                              | %                             |
| **FPY — First Pass Yield** | `Units passing without rework / Units entering process × 100` | %                             |
| **First Time Through**     | `Good units requiring no repair/rework / Total units × 100`   | %                             |
| **Scrap Rate**             | `Scrap Units / Total Units Produced × 100`                    | %                             |
| **Reject Rate**            | `Rejected Units / Total Units Inspected × 100`                | %                             |
| **Rework Rate**            | `Reworked Units / Total Units Produced × 100`                 | %                             |
| **Defect Rate**            | `Defective Units / Units Inspected × 100`                     | %                             |
| **Defects per Unit (DPU)** | `Total Defects / Units Inspected`                             | defects/unit                  |
| **DPMO**                   | `Defects / (Units × Opportunities per Unit) × 1,000,000`      | defects/million opportunities |
| **PPM Defective**          | `Defective Units / Total Units × 1,000,000`                   | ppm                           |
| **Customer Reject Rate**   | `Customer-Rejected Units / Units Shipped × 100`               | %                             |
| **Customer PPM**           | `Customer Defective Units / Units Shipped × 1,000,000`        | ppm                           |
| **Quality Loss**           | `Nonconforming Units / Total Units × 100`                     | %                             |
| **Good Count**             | `Total Count − Scrap − rejected/rework as governed`           | units                         |

EKAS must define exactly what constitutes **Good**, **Reject**, **Scrap**, and **Rework**, because those terms frequently differ among plants.

---

# 8. Rolled yield

For multiple operations:

### Rolled Throughput Yield

`RTY = FPY₁ × FPY₂ × FPY₃ × ... × FPYₙ`

Example:

- Op 10 FPY = 98%
- Op 20 FPY = 97%
- Op 30 FPY = 99%

Then:

`RTY = 0.98 × 0.97 × 0.99 = 94.1%`

This is much more revealing than looking only at final inspection yield.

---

# 9. Process capability

These belong in EKAS when valid statistical data exists.

| Metric  | Formula                                             |
| ------- | --------------------------------------------------- |
| **Cp**  | `(USL − LSL) / (6σ)`                                |
| **Cpk** | `min[(USL − μ)/(3σ), (μ − LSL)/(3σ)]`               |
| **Pp**  | `(USL − LSL) / (6σoverall)`                         |
| **Ppk** | `min[(USL − μ)/(3σoverall), (μ − LSL)/(3σoverall)]` |

Where:

- `USL` = upper specification limit
- `LSL` = lower specification limit
- `μ` = process mean
- `σ` = standard deviation

EKAS should never compute these without adequate sample and measurement-system integrity.

---

# 10. Maintenance and reliability

| Metric                                | Formula                                                                          | Unit          |
| ------------------------------------- | -------------------------------------------------------------------------------- | ------------- |
| **MTBF**                              | `Total Operating Time / Number of Failures`                                      | hours/failure |
| **MTTR — Mean Time to Repair**        | `Total Active Repair Time / Number of Repairs`                                   | time          |
| **MTTR — Mean Time to Restore**       | `Total Restoration Downtime / Number of Incidents`                               | time          |
| **MTTF**                              | `Total Operating Life / Number of Nonrepairable Failures`                        | time          |
| **Failure Rate**                      | `Number of Failures / Operating Time`                                            | failures/hour |
| **Reliability**                       | commonly `e^(−λt)` for constant failure rate                                     | probability   |
| **Repair Rate**                       | `Repairs Completed / Repair Time`                                                | repairs/time  |
| **Maintenance Downtime %**            | `Maintenance Downtime / Planned Production Time × 100`                           | %             |
| **Breakdown Frequency**               | `Breakdowns / Period`                                                            | count/time    |
| **Reactive Maintenance %**            | `Reactive Maintenance Hours / Total Maintenance Hours × 100`                     | %             |
| **Planned Maintenance %**             | `Planned Maintenance Hours / Total Maintenance Hours × 100`                      | %             |
| **PM Compliance**                     | `PMs completed on time / PMs scheduled × 100`                                    | %             |
| **Schedule Compliance — Maintenance** | `Scheduled jobs completed as planned / Scheduled jobs × 100`                     | %             |
| **Maintenance Backlog**               | `Outstanding Maintenance Labor Hours / Available Weekly Maintenance Labor Hours` | weeks         |
| **Repeat Failure Rate**               | `Repeated failures / Total failures × 100`                                       | %             |
| **Emergency Work %**                  | `Emergency work hours / Total maintenance hours × 100`                           | %             |

### Critical EKAS requirement

The catalog has already exposed this issue: **MTTR is ambiguous**.

It may mean:

- Mean Time to Repair
- Mean Time to Restore/Restoration

Those must be **separate governed metrics**.

A bare:

> “What was MTTR?”

should trigger clarification where the plant has both definitions.

---

# 11. Delivery and customer service

| Metric                     | Formula                                                                  | Unit  |
| -------------------------- | ------------------------------------------------------------------------ | ----- |
| **OTIF**                   | `Orders delivered On Time AND In Full / Total Orders × 100`              | %     |
| **On-Time Delivery (OTD)** | `Orders delivered on/before promise date / Total Delivered Orders × 100` | %     |
| **In-Full Delivery**       | `Orders delivered complete / Total Orders × 100`                         | %     |
| **Fill Rate**              | `Units shipped immediately / Units ordered × 100`                        | %     |
| **Perfect Order Rate**     | `Perfect Orders / Total Orders × 100`                                    | %     |
| **Late Order Rate**        | `Late Orders / Total Orders × 100`                                       | %     |
| **Past-Due Quantity**      | `Σ outstanding quantity past promised date`                              | units |
| **Average Delivery Delay** | `Σ late days / Late Deliveries`                                          | days  |

Promise-date semantics must be governed: original promise date versus revised/customer-approved date makes a major difference.

---

# 12. Inventory

| Metric                   | Formula                                                    | Unit       |
| ------------------------ | ---------------------------------------------------------- | ---------- |
| **Inventory Turns**      | `Annual COGS / Average Inventory Value`                    | turns/year |
| **Inventory Days / DIO** | `Average Inventory / COGS × Days in Period`                | days       |
| **Raw Material Days**    | `Average Raw Material Inventory / Material Usage × Days`   | days       |
| **WIP Days**             | `Average WIP / Manufacturing Cost or Throughput × Days`    | days       |
| **Finished Goods Days**  | `Average FG Inventory / COGS × Days`                       | days       |
| **WIP Units**            | `Σ units currently inside production process`              | units      |
| **Inventory Accuracy**   | `Correct inventory records / Records checked × 100`        | %          |
| **Obsolete Inventory %** | `Obsolete Inventory Value / Total Inventory Value × 100`   | %          |
| **Excess Inventory %**   | `Inventory Above Governed Maximum / Total Inventory × 100` | %          |

---

# 13. Little's Law / manufacturing flow

Very useful for EKAS.

### Little's Law

`WIP = Throughput × Lead Time`

Therefore:

`Lead Time = WIP / Throughput`

and:

`Throughput = WIP / Lead Time`

This lets EKAS answer questions such as:

> “If we cut WIP by 25% but maintain throughput, what happens to lead time?”

provided the assumptions are valid.

---

# 14. Labor and workforce productivity

| Metric                       | Formula                                                  | Unit             |
| ---------------------------- | -------------------------------------------------------- | ---------------- |
| **Labor Productivity**       | `Good Units / Labor Hours`                               | units/labor-hour |
| **Labor Efficiency**         | `Standard Hours Earned / Actual Labor Hours × 100`       | %                |
| **Standard Hours Earned**    | `Good Quantity × Standard Labor Time per Unit`           | hours            |
| **Labor Utilization**        | `Productive Labor Hours / Paid Labor Hours × 100`        | %                |
| **Direct Labor Utilization** | `Direct Productive Hours / Direct Available Hours × 100` | %                |
| **Overtime %**               | `Overtime Hours / Total Labor Hours × 100`               | %                |
| **Absenteeism Rate**         | `Absent Scheduled Hours / Total Scheduled Hours × 100`   | %                |
| **Units per Employee Hour**  | `Good Units / Employee Hours`                            | units/hour       |
| **Labor Cost per Unit**      | `Direct Labor Cost / Good Units`                         | currency/unit    |

---

# 15. Cost

These should only activate when governed financial inputs are available.

| Metric                          | Formula                                                  |
| ------------------------------- | -------------------------------------------------------- |
| **Manufacturing Cost per Unit** | `Total Manufacturing Cost / Good Units Produced`         |
| **Conversion Cost per Unit**    | `(Direct Labor + Manufacturing Overhead) / Good Units`   |
| **Scrap Cost**                  | `Scrap Quantity × Governed Unit Cost`                    |
| **Rework Cost**                 | `Rework Labor + Material + Overhead`                     |
| **Downtime Cost**               | `Downtime Duration × Governed Loss/Cost Rate`            |
| **Cost Variance**               | `Actual Cost − Standard/Budget Cost`                     |
| **Cost Variance %**             | `(Actual − Standard) / Standard × 100`                   |
| **Material Usage Variance**     | `(Actual Quantity − Standard Quantity) × Standard Price` |
| **Labor Efficiency Variance**   | `(Actual Hours − Standard Hours) × Standard Labor Rate`  |

---

# 16. Cost of quality

| Metric                          | Formula                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| **COPQ — Cost of Poor Quality** | `Internal Failure Cost + External Failure Cost`                |
| **Cost of Quality**             | `Prevention + Appraisal + Internal Failure + External Failure` |
| **COPQ % Sales**                | `COPQ / Sales × 100`                                           |
| **Scrap Cost %**                | `Scrap Cost / Manufacturing Cost × 100`                        |
| **Warranty Cost %**             | `Warranty Cost / Sales × 100`                                  |

---

# 17. Energy and sustainability

| Metric                 | Formula                                                 | Unit                   |
| ---------------------- | ------------------------------------------------------- | ---------------------- |
| **Energy Consumption** | `Σ energy used`                                         | kWh                    |
| **Energy per Unit**    | `Total Energy / Good Units`                             | kWh/unit               |
| **Energy Intensity**   | `Energy / Production Measure`                           | kWh/unit, kWh/lb, etc. |
| **Idle Energy %**      | `Energy During Nonproductive Time / Total Energy × 100` | %                      |
| **Peak Demand**        | `Maximum demand during period`                          | kW                     |
| **CO₂e per Unit**      | `Total CO₂e / Good Units`                               | kg CO₂e/unit           |
| **Waste per Unit**     | `Waste Generated / Good Units`                          | mass/unit              |
| **Water per Unit**     | `Water Consumption / Good Units`                        | volume/unit            |

Emission factors should come from governed reference data, not the LLM.

---

# 18. Constraint / Theory of Constraints measures

These would be valuable in EKAS.

| Metric                      | Formula                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| **Constraint Utilization**  | `Constraint Productive Time / Constraint Available Time × 100`             |
| **Constraint Throughput**   | `Good Units Through Constraint / Time`                                     |
| **Constraint Lost Time**    | `Available Constraint Time − Productive Constraint Time`                   |
| **Constraint Yield**        | `Good Constraint Output / Constraint Input × 100`                          |
| **Throughput Contribution** | `Sales − Totally Variable Cost` where governed financial model supports it |

---

# 19. Safety

If EKAS is eventually connected to EHS data:

| Metric                      | Formula                                       |
| --------------------------- | --------------------------------------------- |
| **TRIR**                    | `(Recordable Cases × 200,000) / Hours Worked` |
| **DART Rate**               | `(DART Cases × 200,000) / Hours Worked`       |
| **Lost-Time Incident Rate** | `(Lost-Time Cases × 200,000) / Hours Worked`  |
| **Near-Miss Rate**          | `Near Misses / Governed exposure denominator` |

Safety data should remain strongly access-controlled.

---

# 20. Plant Head Daily Operations Audit

For the specific feature we discussed, I would make these the **seven primary operating metrics**:

| KPI                    | Formula / rule                                                            |
| ---------------------- | ------------------------------------------------------------------------- |
| **Production vs Plan** | `Actual Production / Planned Production × 100`                            |
| **OEE**                | `Availability × Performance × Quality`                                    |
| **Downtime**           | `Σ governed downtime duration`                                            |
| **Quality Loss**       | `Nonconforming Output / Total Output × 100`                               |
| **Schedule Adherence** | `Production completed according to schedule / Scheduled production × 100` |
| **Inventory Days**     | `Average Inventory / Consumption or COGS × Days`                          |
| **OTIF**               | `Orders on-time AND in-full / Total applicable orders × 100`              |

Recommended initial reference targets:

| KPI                | Reference target         |
| ------------------ | ------------------------ |
| Production vs Plan | ≥ 100%                   |
| OEE                | ≥ 85%                    |
| Downtime           | Minimize / plant target  |
| Quality Loss       | ≤ 2%                     |
| Schedule Adherence | ≥ 95%                    |
| Inventory Days     | Governed operating range |
| OTIF               | ≥ 95%                    |

But plant-specific governed targets must override these references.

---

# 21. Loss calculations EKAS should support

These are particularly valuable because they move EKAS beyond merely reporting KPIs.

### Availability loss

`Availability Loss Time = Planned Production Time − Run Time`

### Performance loss

One useful representation:

`Performance Loss Time = Run Time − (Ideal Cycle Time × Total Count)`

### Quality loss

`Quality Loss Units = Total Count − Good Count`

Equivalent productive-time representation:

`Quality Loss Time = Defective Count × Ideal Cycle Time`

### Production opportunity

`Lost Units = Expected Units − Actual Good Units`

### Gap to target

For higher-is-better KPI:

`Gap = Target − Actual`

For lower-is-better KPI:

`Gap = Actual − Target`

Only positive unfavorable gaps should generally rank as problems.

---

# 22. Comparison calculations

Every EKAS metric should share generic comparison semantics.

### Absolute change

`Current − Previous`

Example:

`83.3% − 87.5% = −4.2 percentage points`

### Relative percentage change

`(Current − Previous) / Previous × 100`

These are different.

Going from 87.5% to 83.3% is:

- **−4.2 percentage points**
- approximately **−4.8% relative change**

EKAS should use **percentage points** when comparing percentages unless the user explicitly asks for relative percent change.

### Target variance

`Actual − Target`

or normalized:

`(Actual − Target) / Target × 100`

with direction interpreted according to the metric.

---

# 23. Trend metrics

Useful generic calculations:

### Moving average

`MAₙ = Σ(last n values) / n`

### Rolling change

`Current − Value N periods ago`

### Trend slope

Regression slope across ordered period/value observations.

### Volatility

Standard deviation or coefficient of variation:

`CV = σ / μ × 100`

These should be considered derived analytical measures, not raw plant KPIs.

---

# 24. Pareto calculations

For downtime, scrap, defect and other loss analysis:

### Category contribution

`Category Loss / Total Loss × 100`

### Cumulative contribution

`Σ ranked category contributions`

EKAS can then naturally say:

> “The top three downtime reasons account for 71% of total downtime.”

provided the data supports it.

---

# 25. Action / sustain metrics

For the **Find → Quantify → Act → Sustain** architecture:

### Improvement

`Post-Action KPI − Pre-Action KPI`

with direction interpreted according to KPI.

### Improvement %

`(Post − Pre) / Pre × 100`

### Sustained Improvement

Configurable rule such as:

`KPI meets improvement threshold for N consecutive periods`

### Recurrence Rate

`Repeated Events / Total Relevant Events × 100`

### Action Closure Rate

`Completed Actions / Actions Due × 100`

### On-Time Action Closure

`Actions Closed by Due Date / Actions Due × 100`

These are critical if EKAS is eventually going to answer:

> “Did the improvement hold?”

---

# 26. Metric Registry fields I recommend

Every metric should ultimately be represented something like:

```
metric_id
canonical_name
display_name
aliases
domain
definition
formula
formula_version
calculation_owner
numerator
denominator
units
display_units
precision
aggregation_method
valid_entity_scopes
valid_time_grains
good_direction
target_source
target
warning_threshold
critical_threshold
required_sources
required_data_coverage
evidence_requirements
certification_owner
comparison_semantics
chart_semantics
clarification_rules
effectivity
version
status
```

And critically:

```
recognition_status
execution_status
certification_status
```

Those are separate.

For example:

```
FPY

recognition_status = ACTIVE
execution_status = UNAVAILABLE
certification_status = UNAVAILABLE
```

EKAS can therefore understand:

> “What was FPY?”

without pretending it can calculate FPY.

That is exactly the direction the current registry implementation is taking: the current API checks cover all 59 catalog subjects while unavailable measures return prerequisite/clarification responses rather than silently executing OEE.    Pasted text

---

# 27. The critical distinction: metric vs derived insight

I would keep these separate in EKAS.

**Metrics** are deterministic measurements:

- OEE
- FPY
- MTBF
- downtime
- throughput
- scrap
- OTIF

**Derived observations** are deterministic interpretations of those measurements:

> “Availability is the largest OEE loss.”

> “Machine 2 has the lowest OEE.”

> “Mechanical stops account for 63% of downtime.”

**Reasoning/investigation** goes another level:

> “The strongest evidence points to the recurring mechanical stop as the documented contributor.”

And **root cause** is stronger still:

> “The bearing failed because lubrication pressure fell below specification.”

EKAS should only make that final statement when actual evidence establishes it.

---

# 28. What I would consider the core EKAS manufacturing KPI library

If I were defining the commercial product today, I would make these the primary library:

**Equipment**\
OEE, Availability, Performance, Quality, TEEP, utilization.

**Production**\
production vs plan, throughput, attainment, run rate, capacity utilization, cycle time, takt.

**Loss**\
downtime, unplanned downtime, planned downtime, minor stops, speed loss, changeover.

**Quality**\
FPY, yield, RTY, scrap, rejects, rework, PPM, DPMO, quality loss, Cp/Cpk where appropriate.

**Maintenance**\
MTBF, MTTR-Repair, MTTR-Restore, failure rate, breakdown frequency, PM compliance, reactive maintenance %, maintenance backlog.

**Delivery**\
schedule adherence, OTIF, OTD, fill rate, late orders.

**Inventory/flow**\
inventory days, inventory turns, WIP, WIP days, RM days, FG days, flow efficiency, lead time.

**People**\
labor productivity, labor efficiency, utilization, overtime.

**Cost**\
cost/unit, scrap cost, rework cost, downtime cost, COPQ.

**Energy**\
energy/unit, idle-energy %, peak demand.

**Operations intelligence**\
gap to target, trend, Pareto contribution, top loss, improvement, recurrence, action closure and sustain metrics.

That is broad enough for EKAS to become a true **manufacturing intelligence platform**, rather than an OEE application.

The design rule I would lock into the architecture is:

> **A metric is never just a number. It has a governed definition, formula, scope, source, unit, target semantics, evidence requirement and certification authority.**

That is what prevents “OEE,” “yield,” “availability,” “MTTR,” or any other KPI from quietly changing meaning from one plant or conversation to another.