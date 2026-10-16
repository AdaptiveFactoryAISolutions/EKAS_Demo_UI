import { lines, metrics, pool } from '../model';
import { caseFixtures, northworksParentView, shiftMetrics, type CaseId } from './cases';
import { analyzeInvestigation, createInvestigation } from './model';
import { operatingReview } from './operatingReview';

export const dashboardFocusPrompt: Record<CaseId, string> = {
  downtime: 'Focus the dashboard on Line 03.',
  speed: 'Focus the dashboard on Speed line.',
  quality: 'Focus the dashboard on Quality line.',
};

export type DashboardFamilyId = 'operations' | 'production' | 'capacity' | 'maintenance' | 'quality' | 'flow' | 'safety';

export type DashboardMeasure = {
  id: string;
  label: string;
  display: string;
  numeric: number | null;
  unit: string;
  target: string;
  source: string;
};

export type DashboardBar = {
  id: string;
  label: string;
  display: string;
  numeric: number | null;
  /** Width share of the largest finite magnitude in this chart. Missing values are omitted. */
  share: number;
};

export type DashboardRank = {
  caseId: CaseId;
  line: string;
  plant: string;
  title: string;
  gap: number;
  actual: number;
  target: number;
  unit: string;
};

export type DashboardFamily = {
  id: DashboardFamilyId;
  title: string;
  context: string;
  kpis: DashboardMeasure[];
  decisionTitle: string;
  bars: DashboardBar[];
  breakdownTitle: string;
  rows: DashboardMeasure[];
  interpretation: string;
};

export type DashboardCatalog = {
  asOf: string;
  families: DashboardFamily[];
  ranks: DashboardRank[];
};

const AS_OF = '2026-10-06T14:45:00Z';

function quantity(value: number | null | undefined, digits = 2): { numeric: number | null; display: string } {
  if (typeof value !== 'number' || !Number.isFinite(value)) return { numeric: null, display: 'Unavailable' };
  return {
    numeric: value,
    display: value.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(2, digits) }),
  };
}

function withUnit(display: string, unit: string) {
  if (!unit) return display;
  return unit === '%' ? `${display}%` : `${display} ${unit}`;
}

function measure(id: string, label: string, value: number | null | undefined, unit: string, target: number | null | undefined, targetUnit: string, source: string, digits = 2): DashboardMeasure {
  const shown = quantity(value, digits);
  const goal = quantity(target, digits);
  return {
    id,
    label,
    display: shown.numeric === null ? 'Unavailable' : withUnit(shown.display, unit),
    numeric: shown.numeric,
    unit,
    target: goal.numeric === null ? 'Unavailable' : withUnit(goal.display, targetUnit),
    source,
  };
}

function barsFrom(rows: { id: string; label: string; numeric: number | null; display: string }[]): DashboardBar[] {
  const finite = rows.filter((row): row is typeof row & { numeric: number } => row.numeric !== null);
  const peak = finite.reduce((max, row) => Math.max(max, Math.abs(row.numeric)), 0);
  return finite.map(row => ({ id: row.id, label: row.label, display: row.display, numeric: row.numeric, share: peak > 0 ? Math.abs(row.numeric) / peak * 100 : 0 }));
}

function reasonLabel(reason: string) {
  if (reason === 'feeder_jams') return 'Feeder jams';
  if (reason === 'changeover') return 'Changeover';
  if (reason === 'other' || reason === 'other_stops') return 'Other stops';
  return reason.replace(/_/g, ' ');
}

/** Governed dashboard facts. A missing measure stays unavailable; it is never drawn as zero. */
export function dashboardCatalog(asOf = AS_OF): DashboardCatalog {
  const review = operatingReview(asOf);
  const plant = metrics(pool(lines));
  const totals = pool(lines);
  const parent = northworksParentView();
  const analysis = analyzeInvestigation(createInvestigation());
  const bundle = (id: string) => review.bundle.find(metric => metric.id === id);
  const production = bundle('production');
  const oee = bundle('oee');
  const downtime = bundle('downtime');
  const qualityLoss = bundle('qualityLoss');
  const schedule = bundle('schedule');
  const inventory = bundle('inventory');
  const otif = bundle('otif');
  const ranks: DashboardRank[] = review.gaps.map(gap => ({
    caseId: gap.caseId,
    line: gap.context.line,
    plant: gap.context.plant,
    title: gap.title,
    gap: gap.gap,
    actual: gap.actual,
    target: gap.target,
    unit: gap.unit,
  }));
  const top = ranks[0];
  const qualityShift = shiftMetrics([caseFixtures.quality.current]);
  const speedShift = shiftMetrics([caseFixtures.speed.current]);
  const downtimeReasons = new Map<string, number>();
  for (const interval of caseFixtures.downtime.current.intervals) {
    const minutes = interval.end - interval.start;
    if (!Number.isFinite(minutes) || minutes <= 0) continue;
    downtimeReasons.set(interval.reason, (downtimeReasons.get(interval.reason) || 0) + minutes);
  }
  const currentUnits = (caseFixtures.quality.units || []).filter(unit => unit.shiftId === caseFixtures.quality.current.id);
  const defectCounts = new Map<string, number>();
  for (const unit of currentUnits) {
    if (!unit.defectMode) continue;
    const mode = unit.defectMode.charAt(0).toUpperCase() + unit.defectMode.slice(1);
    defectCounts.set(mode, (defectCounts.get(mode) || 0) + 1);
  }
  const scrap = currentUnits.filter(unit => unit.terminalDisposition === 'scrap').length;
  const rework = currentUnits.filter(unit => unit.terminalDisposition === 'accepted_rework').length;
  const bridgeNames = ['Theoretical capacity', 'Downtime loss', 'Speed residual', 'Final non-good', 'Good output'];
  const bridgeRows = bridgeNames.map((label, index) => {
    const shown = quantity(parent.bridge[index], 0);
    return { id: 'bridge-' + index, label, numeric: shown.numeric, display: shown.numeric === null ? 'Unavailable' : `${shown.display} good-equivalent units` };
  });
  const planGap = quantity(parent.goal.gap, 0);
  const lineRows = (analysis.contributors || []).map(row => {
    const built = measure('line-' + row.line, row.line + ' contribution', row.gap, 'good units', row.target, 'good units planned', 'production-jobs-fixture.json · line plan inside the Northworks plant goal', 0);
    if (built.numeric === null) return built;
    const amount = Math.abs(built.numeric).toLocaleString('en-US');
    const direction = built.numeric > 0 ? 'below plan' : built.numeric < 0 ? 'above plan' : 'on plan';
    return { ...built, display: `${amount} good units ${direction}` };
  });
  const operationsKpis = [
    measure('production', 'Production versus plan', production?.value ?? null, production?.unit || '%', production?.target ?? null, production?.unit || '%', production?.source || 'operating review', 2),
    measure('oee', 'OEE', oee?.value ?? null, oee?.unit || '%', oee?.target ?? null, '%', oee?.source || 'operating review', 2),
    measure('downtime', 'Downtime', downtime?.value ?? null, downtime?.unit || 'min', downtime?.target ?? null, 'min', downtime?.source || 'operating review', 0),
    measure('qualityLoss', 'Quality loss', qualityLoss?.value ?? null, qualityLoss?.unit || '%', qualityLoss?.target ?? null, '%', qualityLoss?.source || 'operating review', 2),
    measure('schedule', 'Schedule adherence', schedule?.value ?? null, schedule?.unit || '%', schedule?.target ?? null, '%', schedule?.source || 'operating review', 2),
    measure('inventory', 'Inventory days', inventory?.value ?? null, inventory?.unit || 'day', inventory?.target ?? null, 'day', inventory?.source || 'operating review', 2),
    measure('otif', 'OTIF', otif?.value ?? null, otif?.unit || '%', otif?.target ?? null, '%', otif?.source || 'operating review', 2),
  ];
  const rankBars = barsFrom(ranks.map(rank => ({
    id: rank.caseId,
    label: rank.line,
    numeric: rank.gap,
    display: `${rank.gap.toLocaleString('en-US')} ${rank.unit} below the approved plan`,
  })));
  const reasonBars = barsFrom([...downtimeReasons.entries()].map(([reason, minutes]) => {
    const shown = quantity(minutes, 0);
    return { id: reason, label: reasonLabel(reason), numeric: shown.numeric, display: shown.numeric === null ? 'Unavailable' : `${shown.display} minutes` };
  }));
  const apq = [
    measure('availability', 'Availability', plant.availability, '%', null, '%', 'scenario-fixture.json#/lines', 2),
    measure('performance', 'Performance', plant.performance, '%', null, '%', 'scenario-fixture.json#/lines', 2),
    measure('quality-yield', 'Quality', plant.quality, '%', null, '%', 'scenario-fixture.json#/lines', 2),
    measure('good-units', 'Good units', totals.good, 'good units', null, 'good units', 'scenario-fixture.json#/lines', 0),
    measure('plan-attainment', 'Plan attainment', production?.value ?? null, '%', production?.target ?? null, '%', production?.source || 'operating review', 2),
    measure('oee-production', 'OEE', oee?.value ?? null, '%', oee?.target ?? null, '%', oee?.source || 'operating review', 2),
  ];
  const families: DashboardFamily[] = [
    {
      id: 'operations',
      title: 'Plant operations',
      context: 'Northworks · plant operating review · Oct 6 · Day Shift · Synthetic',
      kpis: operationsKpis,
      decisionTitle: 'Approved plan shortfall by supplied case',
      bars: rankBars,
      breakdownTitle: 'Line contribution inside the Northworks plan',
      rows: lineRows,
      interpretation: top
        ? `${top.line} carries the largest approved-plan shortfall: ${top.gap.toLocaleString('en-US')} ${top.unit}, ${top.actual.toLocaleString('en-US')} against ${top.target.toLocaleString('en-US')}. These case scopes are not additive. Line contributions sit inside that plant plan and are not added to it again. A metric without an approved target is shown as an observation and does not create an actionable gap.`
        : 'No eligible case shortfall is available at this cutoff.',
    },
    {
      id: 'production',
      title: 'Production and OEE',
      context: 'Northworks synthetic lines · Oct 6 · Day Shift · Synthetic',
      kpis: apq,
      decisionTitle: 'Availability, performance, and quality',
      bars: barsFrom(apq.filter(row => row.id === 'availability' || row.id === 'performance' || row.id === 'quality-yield').map(row => ({ id: row.id, label: row.label, numeric: row.numeric, display: row.display }))),
      breakdownTitle: 'FEED-03 selected-shift stop minutes',
      rows: [...reasonBars.map(bar => measure(bar.id, bar.label, bar.numeric, 'minutes', null, 'minutes', 'scenario-fixture.json#/line_03_stop_events · FEED-03 selected shift', 0)), measure('speed-pareto', 'Speed-loss Pareto', null, 'minutes', null, 'minutes', 'No plant-wide speed-loss modes are supplied'), measure('quality-pareto', 'Quality-loss Pareto', null, 'units', null, 'units', 'No plant-wide defect modes are supplied'), measure('shift-comparison', 'Shift comparison', null, '', null, '', 'Only the day shift is supplied'), measure('oee-trend', 'OEE trend versus an approved target', null, '%', null, '%', oee?.targetAuthority || 'No approved OEE target supplied')],
      interpretation: `Availability, performance, and quality use the same synthetic line pool as the operating review. ${oee?.target == null ? 'OEE has no approved target, so no trend against a target is drawn.' : `OEE has an approved synthetic target of ${quantity(oee.target, 0).display}%. No time series is supplied, so a trend against that target is not drawn.`} FEED-03 stop minutes are that asset’s selected shift, not a plant failure-mode system. A speed-loss Pareto and a quality-loss Pareto are unavailable at plant scope.`,
    },
    {
      id: 'capacity',
      title: 'Capacity and constraints',
      context: 'Northworks plant · Oct 6 · Day Shift · Synthetic',
      kpis: [
        measure('constraint', 'Active constraint', null, '', null, '', 'No governed constraint record is supplied'),
        measure('utilization', 'Utilization', parent.metrics.planned > 0 ? parent.metrics.run / parent.metrics.planned * 100 : null, '%', null, '%', 'northworks plant run minutes / planned minutes', 2),
        measure('planned-runtime', 'Planned runtime', parent.metrics.planned, 'minutes', null, 'minutes', 'northworksParentView', 0),
        measure('actual-runtime', 'Actual runtime', parent.metrics.run, 'minutes', null, 'minutes', 'northworksParentView', 0),
        measure('good-output', 'Actual good output', parent.goal.actual, 'good units', null, 'good units', 'northworksParentView', 0),
        measure('approved-plan', 'Approved plan', parent.goal.target, 'good units', parent.goal.target, 'good units', 'northworks-investigation-v1#/goal', 0),
        measure('plan-gap', 'Plan gap', parent.goal.gap, 'good units', null, 'good units', 'Approved plan minus actual good output', 0),
        measure('recoverable', 'Recoverable opportunity', caseFixtures.downtime.costAssumptions.recoverableUnitsEstimate ?? null, 'good units', null, 'good units', 'No governed recoverable-opportunity record is supplied'),
      ],
      decisionTitle: 'Theoretical capacity bridge',
      bars: barsFrom(bridgeRows),
      breakdownTitle: 'Approved plan shortfall, kept separate',
      rows: [
        ...bridgeRows.map(row => measure(row.id, row.label, row.numeric, 'good-equivalent units', null, '', 'northworksParentView bridge', 0)),
        measure('plan-gap-row', 'Approved plan shortfall', planGap.numeric, 'good units', parent.goal.target, 'good units', 'northworks plant goal', 0),
      ],
      interpretation: `Theoretical capacity loss and the approved plan shortfall are different baselines. The bridge ends at ${quantity(parent.goal.actual, 0).display} good units. The approved plan shortfall is ${planGap.display} good units. Do not add those figures together.`,
    },
    {
      id: 'maintenance',
      title: 'Maintenance and reliability',
      context: 'No CMMS is connected · Synthetic',
      kpis: [
        measure('mtbf', 'MTBF', null, 'minutes', null, 'minutes', 'No governed MTBF record is supplied'),
        measure('mttr-repair', 'MTTR repair', null, 'minutes', null, 'minutes', 'No governed MTTR repair record is supplied'),
        measure('mttr-restore', 'MTTR restore', null, 'minutes', null, 'minutes', 'No governed MTTR restore record is supplied'),
        measure('planned-maintenance', 'Planned maintenance', null, '', null, '', 'No governed planned-maintenance record is supplied'),
        measure('unplanned-maintenance', 'Unplanned maintenance', null, '', null, '', 'No governed unplanned-maintenance record is supplied'),
        measure('pm-compliance', 'PM compliance', null, '%', null, '%', 'No governed PM compliance record is supplied'),
        measure('backlog', 'Backlog', null, '', null, '', 'No governed backlog record is supplied'),
        measure('repeat-failures', 'Repeat failures', null, '', null, '', 'No governed repeat-failure record is supplied'),
        measure('wo-aging', 'Work-order aging', null, '', null, '', 'No governed work-order aging record is supplied'),
      ],
      decisionTitle: 'Recorded downtime minutes by line',
      bars: barsFrom(lines.map(line => ({ id: line.id, label: line.id, numeric: line.down, display: `${line.down.toLocaleString('en-US')} minutes` }))),
      breakdownTitle: 'FEED-03 selected-shift stop reasons',
      rows: reasonBars.map(bar => measure(bar.id, bar.label, bar.numeric, 'minutes', null, 'minutes', 'FEED-03 selected shift · not a failure-mode system', 0)),
      interpretation: 'Line downtime minutes come from the synthetic production lines. They are not mean time between failures, repair time, or a maintenance backlog. PM compliance, work-order aging, and repeat failures are unavailable. The maintenance fixture is a design fixture with no CMMS.',
    },
    {
      id: 'quality',
      title: 'Quality and corrective action',
      context: 'Quality line · FORM-Q1 · selected shift · Synthetic',
      kpis: [
        measure('fpy', 'First-pass yield', typeof qualityShift.fpy.value === 'number' ? qualityShift.fpy.value : null, '%', null, '%', 'quality-investigation-v1 current shift', 2),
        measure('final-yield', 'Final yield', typeof qualityShift.quality.value === 'number' ? qualityShift.quality.value : null, '%', null, '%', 'quality-investigation-v1 current shift', 2),
        measure('scrap', 'Scrap', currentUnits.length ? scrap : null, 'units', null, 'units', currentUnits.length ? 'quality-investigation-v1 current shift dispositions' : 'No unit dispositions are supplied'),
        measure('rework', 'Rework', currentUnits.length ? rework : null, 'units', null, 'units', currentUnits.length ? 'quality-investigation-v1 current shift dispositions' : 'No unit dispositions are supplied'),
        measure('ppm', 'PPM', null, 'PPM', null, 'PPM', 'No governed PPM record is supplied'),
      ],
      decisionTitle: 'Defect modes on the quality selected shift',
      bars: barsFrom([...defectCounts.entries()].map(([mode, count]) => ({ id: mode, label: mode, numeric: count, display: `${count.toLocaleString('en-US')} units` }))),
      breakdownTitle: 'Controlled quality records',
      rows: [
        measure('pfmea', 'PFMEA', null, '', null, '', 'Open the quality investigation to read the effective PFMEA. A document count is not a defect rate.'),
        measure('control-plan', 'Control plan', null, '', null, '', 'Open the quality investigation to read the effective control plan.'),
        measure('standard-work', 'Standard work', null, '', null, '', 'Open the quality investigation to read applicable standard work.'),
        measure('ncr', 'NCR', null, '', null, '', 'No governed NCR record is supplied'),
        measure('speed-loss-note', 'PRESS-S1 speed-loss time', typeof speedShift.speedLoss.value === 'number' ? speedShift.speedLoss.value : null, 'minutes', null, 'minutes', 'speed-investigation-v1 current shift · not a quality defect', 2),
      ],
      interpretation: 'First-pass yield is available only for the quality fixture, where first-pass dispositions exist. Final yield counts terminal good units and is a different measure. PPM is unavailable. Hypotheses, actions, verification, and sustainment appear only from the open investigation, not from this view.',
    },
    {
      id: 'flow',
      title: 'Flow, delivery, and inventory',
      context: 'Separate reporting windows · Synthetic',
      kpis: [
        measure('otif-flow', 'OTIF', otif?.value ?? null, '%', otif?.target ?? null, '%', otif?.source || 'operating review', 2),
        measure('otd', 'OTD', null, '%', null, '%', 'No governed OTD record is supplied'),
        measure('fill-rate', 'Fill rate', null, '%', null, '%', 'No governed fill-rate record is supplied'),
        measure('schedule-flow', 'Schedule adherence', schedule?.value ?? null, '%', schedule?.target ?? null, '%', schedule?.source || 'operating review', 2),
        measure('wip', 'WIP', null, 'units', null, 'units', 'No governed WIP record is supplied'),
        measure('inventory-flow', 'Inventory days', inventory?.value ?? null, 'day', inventory?.target ?? null, 'day', inventory?.source || 'operating review', 2),
        measure('turns', 'Inventory turns', null, '', null, '', 'No governed inventory-turns record is supplied'),
        measure('shortage', 'Shortage or excess', null, '', null, '', 'No governed shortage or excess record is supplied'),
        measure('lead-time', 'Lead time', null, '', null, '', 'No governed lead-time record is supplied'),
        measure('queue', 'Queue', null, '', null, '', 'No governed queue record is supplied'),
        measure('starvation', 'Starvation or blocking', null, '', null, '', 'No governed starvation or blocking record is supplied'),
      ],
      decisionTitle: 'Supplied delivery and inventory observations',
      bars: barsFrom([
        { id: 'otif', label: 'OTIF', numeric: otif?.value ?? null, display: otif?.value == null ? 'Unavailable' : `${quantity(otif.value).display}%` },
        { id: 'schedule', label: 'Schedule adherence', numeric: schedule?.value ?? null, display: schedule?.value == null ? 'Unavailable' : `${quantity(schedule.value).display}%` },
      ]),
      breakdownTitle: 'Not supplied for this cutoff',
      rows: [
        measure('wip-row', 'WIP', null, 'units', null, 'units', 'Unavailable'),
        measure('lead-row', 'Lead time', null, '', null, '', 'Unavailable'),
        measure('queue-row', 'Queue', null, '', null, '', 'Unavailable'),
      ],
      interpretation: 'OTIF, schedule adherence, and inventory days keep the operating-review windows and units. They are not added together. OTD, fill rate, WIP, turns, shortage, lead time, queue, and starvation or blocking are unavailable.',
    },
    {
      id: 'safety',
      title: 'Safety and compliance',
      context: 'No incident system is connected · Synthetic',
      kpis: [
        measure('incidents', 'Incidents', null, '', null, '', 'No governed incident record is supplied'),
        measure('near-misses', 'Near misses', null, '', null, '', 'No governed near-miss record is supplied'),
        measure('open-actions', 'Open safety actions', null, '', null, '', 'No governed safety-action record is supplied'),
        measure('audits', 'Audit findings', null, '', null, '', 'No governed audit-finding record is supplied'),
        measure('closure-aging', 'Closure aging', null, '', null, '', 'No governed closure-aging record is supplied'),
        measure('repeat-conditions', 'Repeat conditions', null, '', null, '', 'No governed repeat-condition record is supplied'),
      ],
      decisionTitle: 'No incident chart is available',
      bars: [],
      breakdownTitle: 'Improvement guardrails',
      rows: [measure('guardrails', 'Safety guardrail result', null, '', null, '', 'A safety conclusion is available only from the open investigation’s recorded review')],
      interpretation: 'Incidents, near misses, audit findings, and closure aging are unavailable. This view does not infer a safety result from production loss. When an investigation is open, its guardrail status is the investigation status.',
    },
  ];
  return { asOf, families, ranks };
}
