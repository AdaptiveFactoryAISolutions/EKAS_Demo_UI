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

export type DashboardDirection = 'higher' | 'lower' | null;

/** Governed reading of a target. Improving or worsening is omitted: this cutoff has no comparison series. */
export type DashboardStatus = 'On target' | 'Below target' | 'Above target' | 'Not evaluated' | 'Unknown' | 'Unavailable';

export type DashboardMeasure = {
  id: string;
  label: string;
  display: string;
  numeric: number | null;
  unit: string;
  target: string;
  targetNumeric: number | null;
  direction: DashboardDirection;
  status: DashboardStatus;
  /** Exact provenance key. Shown only inside Technical details. */
  source: string;
  /** Plain description for the plant-facing source column. */
  sourceLabel: string;
  cutoff: string;
  scope: string;
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

export type DashboardPoint = {
  id: string;
  label: string;
  display: string;
  numeric: number;
  unit: string;
  /** Exact provenance key. Shown only inside Technical details. */
  source: string;
  /** Plain description for the plant-facing source column. */
  sourceLabel: string;
  cutoff: string;
  /** Shared chart scope. Every point in one chart uses the same sentence. */
  scope: string;
  /** Row scope when one chart holds separate cases. Equals scope when the row is the chart scope. */
  scopeDetail: string;
};

export type DashboardChart = {
  id: string;
  title: string;
  description: string;
  note: string;
  place: 'primary' | 'loss';
  unit: string;
  source: string;
  cutoff: string;
  scope: string;
  /** Visual series. The supporting table is this same array. */
  points: DashboardPoint[];
  table: DashboardPoint[];
};

export type DashboardFamily = {
  id: DashboardFamilyId;
  title: string;
  context: string;
  kpis: DashboardMeasure[];
  decisionTitle: string;
  bars: DashboardBar[];
  charts: DashboardChart[];
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

/** One display rule for tiles, chart labels, and tables. Percents keep a tenth only when the rounded value is not whole. Days keep one tenth and a plural. Minutes and counts stay whole. */
export function formatQuantity(value: number, unit: string): string {
  if (unit === '%') {
    const rounded = Math.round(value * 10) / 10;
    const text = Number.isInteger(rounded)
      ? rounded.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : rounded.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `${text}%`;
  }
  if (unit === 'day') {
    const rounded = Math.round(value * 10) / 10;
    const text = rounded.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `${text} ${rounded === 1 ? 'day' : 'days'}`;
  }
  if (unit === 'min' || unit === 'minutes') return `${Math.round(value).toLocaleString('en-US')} min`;
  const whole = Math.round(value).toLocaleString('en-US');
  return unit ? `${whole} ${unit}` : whole;
}

export function measureStatus(value: number | null, target: number | null, direction: DashboardDirection): DashboardStatus {
  if (value === null) return 'Unavailable';
  if (target === null) return 'Not evaluated';
  if (!direction) return 'Unknown';
  if (direction === 'higher') return value >= target ? 'On target' : 'Below target';
  return value <= target ? 'On target' : 'Above target';
}

function targetLabel(value: number | null, target: number | null, unit: string, direction: DashboardDirection) {
  if (value === null) return 'Unavailable';
  if (target === null) return 'No governed target';
  const shown = formatQuantity(target, unit);
  if (direction === 'higher') return `≥${shown}`;
  if (direction === 'lower') return `≤${shown}`;
  return shown;
}

/** Plant-facing source name. The raw key stays on `source` for Technical details. */
export function plainSource(source: string): string {
  if (/^No governed\b/i.test(source) || /^Approved plan minus\b/.test(source) || /^No unit dispositions\b/.test(source)) return source;
  const lower = source.toLowerCase();
  if (lower.includes('stop_event')) return 'Recorded stop events';
  if (lower.includes('quality-investigation')) return 'Quality measurement record';
  if (lower.includes('speed-investigation')) return 'Speed measurement record';
  if (lower.includes('#/goal')) return 'Approved production plan';
  if (lower.includes('production-jobs') || lower.includes('operatingreview gaps')) return 'Case measurement record';
  if (lower.includes('parentview') || lower.includes('bridge') || lower.includes('run minutes')) return 'Plant capacity record';
  if (lower.includes('reporting_contexts/schedule')) return 'Schedule record';
  if (lower.includes('reporting_contexts/inventory')) return 'Inventory record';
  if (lower.includes('reporting_contexts/delivery')) return 'Delivery record';
  if (lower.includes('#/lines') || lower.includes('scenario-fixture')) return 'Line production results';
  return source;
}

function measure(id: string, label: string, value: number | null | undefined, unit: string, target: number | null | undefined, source: string, direction: DashboardDirection | string | null = null, cutoff = AS_OF, scope = 'Plant scope · Northworks · Oct 6 Day Shift'): DashboardMeasure {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : null;
  const targetNumeric = typeof target === 'number' && Number.isFinite(target) ? target : null;
  const governed: DashboardDirection = direction === 'higher' || direction === 'lower' ? direction : null;
  return {
    id,
    label,
    display: numeric === null ? 'Unavailable' : formatQuantity(numeric, unit),
    numeric,
    unit,
    target: targetLabel(numeric, targetNumeric, unit, governed),
    targetNumeric,
    direction: governed,
    status: measureStatus(numeric, targetNumeric, governed),
    source,
    sourceLabel: plainSource(source),
    cutoff,
    scope,
  };
}

function barsFrom(rows: { id: string; label: string; numeric: number | null; display: string }[]): DashboardBar[] {
  const finite = rows.filter((row): row is typeof row & { numeric: number } => row.numeric !== null);
  const peak = finite.reduce((max, row) => Math.max(max, Math.abs(row.numeric)), 0);
  return finite.map(row => ({ id: row.id, label: row.label, display: row.display, numeric: row.numeric, share: peak > 0 ? Math.abs(row.numeric) / peak * 100 : 0 }));
}

function point(id: string, label: string, value: number, unit: string, source: string, scope: string, cutoff: string, display?: string, scopeDetail?: string): DashboardPoint {
  return { id, label, numeric: value, unit, source, sourceLabel: plainSource(source), cutoff, scope, scopeDetail: scopeDetail || scope, display: display || formatQuantity(value, unit) };
}

function chart(id: string, title: string, description: string, note: string, place: 'primary' | 'loss', points: DashboardPoint[]): DashboardChart {
  const [first] = points;
  if (!first) throw Error('A chart requires governed points: ' + id);
  for (const item of points) {
    if (item.unit !== first.unit || item.source !== first.source || item.scope !== first.scope || item.cutoff !== first.cutoff) {
      throw Error('Chart points must share unit, source, scope, and cutoff: ' + id);
    }
  }
  return { id, title, description, note, place, unit: first.unit, source: first.source, cutoff: first.cutoff, scope: first.scope, points, table: points };
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
  const plantScope = 'Plant scope · Northworks · Oct 6 Day Shift';
  const separateCaseScope = 'Separate case scopes · not the current line or job';
  const feedScope = 'Line scope · Northworks · Line 03 · FEED-03 · Oct 6 Day Shift';
  const qualityScope = 'Case scope · Synthetic Works · Quality line · FORM-Q1 · QUALITY-JOB-01 · Oct 6 Day Shift';
  const speedScope = 'Case scope · Synthetic Works · Speed line · PRESS-S1 · SPEED-JOB-01 · Oct 6 Day Shift';
  const bridgeScope = plantScope;
  const bridgeSource = 'northworksParentView bridge';
  const bridgeNames = ['Theoretical capacity', 'Downtime loss', 'Speed loss', 'Quality loss', 'Good output'] as const;
  const bridgePoints = bridgeNames.flatMap((label, index) => {
    const raw = parent.bridge[index];
    if (typeof raw !== 'number' || !Number.isFinite(raw)) return [];
    return [point('bridge-' + index, label, Math.abs(raw), 'good-equivalent units', bridgeSource, bridgeScope, asOf)];
  });
  const planScope = plantScope;
  const planSource = 'northworks-investigation-v1#/goal';
  const planPoints = [
    point('approved-plan', 'Approved plan', parent.goal.target, 'good units', planSource, planScope, asOf),
    point('actual-good', 'Actual good output', parent.goal.actual, 'good units', planSource, planScope, asOf),
    point('plan-shortfall', 'Plan shortfall', parent.goal.gap, 'good units', planSource, planScope, asOf),
  ];
  const rankSource = 'operatingReview gaps';
  const rankPoints = review.gaps.filter(gap => gap.gap !== null && gap.gap > 0).map(gap => point(
    gap.caseId,
    gap.context.line,
    gap.gap as number,
    'good units',
    rankSource,
    separateCaseScope,
    asOf,
    undefined,
    gap.caseId === 'downtime'
      ? plantScope
      : ['Case scope', gap.context.plant, gap.context.line, gap.context.asset, gap.context.job, 'Oct 6 Day Shift'].filter(Boolean).join(' · '),
  ));
  const lineScope = plantScope;
  const lineSource = 'production-jobs-fixture.json · line plan inside the Northworks plant goal';
  const linePoints = (analysis.contributors || []).map(row => {
    const amount = Math.abs(row.gap).toLocaleString('en-US');
    const direction = row.gap > 0 ? 'below plan' : row.gap < 0 ? 'above plan' : 'on plan';
    return point('line-' + row.line, row.line, row.gap, 'good units', lineSource, lineScope, asOf, `${amount} good units ${direction}`);
  });
  const operationsKpis = [
    measure('production', 'Production versus plan', production?.value ?? null, production?.unit || '%', production?.target ?? null, production?.source || 'operating review', production?.deviation.direction ?? null, production?.sourceCutoff || asOf, plantScope),
    measure('oee', 'OEE', oee?.value ?? null, oee?.unit || '%', oee?.target ?? null, oee?.source || 'operating review', oee?.deviation.direction ?? null, oee?.sourceCutoff || asOf, plantScope),
    measure('downtime', 'Downtime', downtime?.value ?? null, downtime?.unit || 'min', downtime?.target ?? null, downtime?.source || 'operating review', downtime?.deviation.direction ?? null, downtime?.sourceCutoff || asOf, plantScope),
    measure('qualityLoss', 'Quality loss', qualityLoss?.value ?? null, qualityLoss?.unit || '%', qualityLoss?.target ?? null, qualityLoss?.source || 'operating review', qualityLoss?.deviation.direction ?? null, qualityLoss?.sourceCutoff || asOf, plantScope),
    measure('schedule', 'Schedule adherence', schedule?.value ?? null, schedule?.unit || '%', schedule?.target ?? null, schedule?.source || 'operating review', schedule?.deviation.direction ?? null, schedule?.sourceCutoff || asOf, plantScope),
    measure('inventory', 'Inventory days', inventory?.value ?? null, inventory?.unit || 'day', inventory?.target ?? null, inventory?.source || 'operating review', inventory?.deviation.direction ?? null, inventory?.sourceCutoff || asOf, plantScope),
    measure('otif', 'OTIF', otif?.value ?? null, otif?.unit || '%', otif?.target ?? null, otif?.source || 'operating review', otif?.deviation.direction ?? null, otif?.sourceCutoff || asOf, plantScope),
  ];
  const linePool = 'scenario-fixture.json#/lines';
  const lineScopeText = plantScope;
  const apqPoints = [
    point('availability', 'Availability', plant.availability, '%', linePool, lineScopeText, asOf),
    point('performance', 'Performance', plant.performance, '%', linePool, lineScopeText, asOf),
    point('quality-yield', 'Quality', plant.quality, '%', linePool, lineScopeText, asOf),
  ];
  const apq = [
    measure('availability', 'Availability', plant.availability, '%', null, linePool, null, asOf, lineScopeText),
    measure('performance', 'Performance', plant.performance, '%', null, linePool, null, asOf, lineScopeText),
    measure('quality-yield', 'Quality', plant.quality, '%', null, linePool, null, asOf, lineScopeText),
    measure('good-units', 'Good units', totals.good, 'good units', null, linePool, null, asOf, lineScopeText),
    measure('plan-attainment', 'Plan attainment', production?.value ?? null, '%', production?.target ?? null, production?.source || 'operating review', production?.deviation.direction ?? null, production?.sourceCutoff || asOf, plantScope),
    measure('oee-production', 'OEE', oee?.value ?? null, '%', oee?.target ?? null, oee?.source || 'operating review', oee?.deviation.direction ?? null, oee?.sourceCutoff || asOf, plantScope),
  ];
  const stopSource = 'scenario-fixture.json#/line_03_stop_events';
  const stopScope = feedScope;
  const stopPoints = [...downtimeReasons.entries()].map(([reason, minutes]) => point(reason, reasonLabel(reason), minutes, 'min', stopSource, stopScope, asOf));
  const planChart = chart(
    'plan-versus-actual',
    'Plant-wide plan vs actual',
    `Plant-wide plan vs actual. Approved plan ${formatQuantity(parent.goal.target, 'good units')}, actual good output ${formatQuantity(parent.goal.actual, 'good units')}, plan shortfall ${formatQuantity(parent.goal.gap, 'good units')}. This is the approved-plan baseline and is not filtered to the current line or job.`,
    'Plant-wide plan vs actual. This shortfall is separate from theoretical capacity loss and is not filtered to the current line or job.',
    'primary',
    planPoints,
  );
  const capacityChart = chart(
    'capacity-bridge',
    'Plant-wide theoretical capacity, shown separately',
    `Plant-wide theoretical capacity and downtime, speed, and quality losses. Good output is ${formatQuantity(parent.goal.actual, 'good-equivalent units')}. These amounts are not the approved-plan shortfall and are not filtered to the current line or job.`,
    'Plant-wide theoretical-capacity baseline. Do not add these losses to the approved-plan shortfall.',
    'primary',
    bridgePoints,
  );
  const lossChart = chart(
    'case-shortfall',
    'Approved plan shortfall by supplied case',
    ranks.map(rank => `${rank.line} ${rank.gap.toLocaleString('en-US')} good units below the approved plan`).join('. ') + '. These case scopes are not additive and are not the current line or job filter.',
    'Separate case scopes. Each case keeps its own plan. Do not add these shortfalls together or read them as the current line filter.',
    'loss',
    rankPoints,
  );
  const contributionChart = chart(
    'line-contribution',
    'Plant-wide line contribution inside the Northworks plan',
    linePoints.map(item => `${item.label} ${item.display}`).join('. ') + '. Plant-wide contributions inside the Northworks plan. Not filtered to the current line or job.',
    'Plant-wide line contributions sit inside the Northworks plan. They are not filtered to the current line or job and are not added to the case shortfall again.',
    'loss',
    linePoints,
  );
  const families: DashboardFamily[] = [
    {
      id: 'operations',
      title: 'Plant operations',
      context: 'Plant scope · Northworks · Oct 6 Day Shift · Synthetic',
      kpis: operationsKpis,
      decisionTitle: planChart.title,
      bars: barsFrom(rankPoints),
      charts: [planChart, capacityChart, lossChart, contributionChart],
      breakdownTitle: lossChart.title,
      rows: linePoints.map(item => ({ ...measure(item.id, item.label, item.numeric, item.unit, null, item.source, null, item.cutoff, item.scope), display: item.display })),
      interpretation: top
        ? `${top.line} carries the largest approved-plan shortfall: ${top.gap.toLocaleString('en-US')} ${top.unit}, ${top.actual.toLocaleString('en-US')} against ${top.target.toLocaleString('en-US')}. These case scopes are not additive. Line contributions sit inside that plant plan and are not added to it again. A metric without an approved target stays an observation and does not create an actionable gap.`
        : 'No eligible case shortfall is available at this cutoff.',
    },
    {
      id: 'production',
      title: 'Production and OEE',
      context: 'Plant scope · Northworks · Oct 6 Day Shift · Synthetic',
      kpis: apq,
      decisionTitle: 'Availability, performance, and quality',
      bars: barsFrom(apqPoints),
      charts: [
        chart('apq', 'Plant-wide availability, performance, and quality', `Plant-wide availability ${formatQuantity(plant.availability, '%')}, performance ${formatQuantity(plant.performance, '%')}, quality ${formatQuantity(plant.quality, '%')}. Not filtered to the current line or job. No OEE trend is drawn because no time series is supplied.`, 'Plant-wide synthetic line pool. Not filtered to the current line or job. No time series is supplied, so this is not an OEE trend.', 'primary', apqPoints),
        chart('feed-stops', 'FEED-03 selected-shift stops', stopPoints.map(item => `${item.label} ${item.display}`).join('. ') + '. Line scope for FEED-03. This is that asset’s selected shift, not a plant failure-mode system.', 'Line scope · Northworks · Line 03 · FEED-03. Not a plant speed-loss or quality-loss Pareto.', 'primary', stopPoints),
      ],
      breakdownTitle: 'FEED-03 selected-shift stop minutes',
      rows: stopPoints.map(item => measure(item.id, item.label, item.numeric, 'min', null, item.source, null, item.cutoff, item.scope)),
      interpretation: `Availability, performance, and quality use the same synthetic line pool as the operating review. OEE has an approved synthetic target of ${formatQuantity(oee?.target ?? 80, '%')}. No time series is supplied, so a trend against that target is not drawn. A speed-loss Pareto, a quality-loss Pareto, and a shift comparison are not supplied at plant scope.`,
    },
    {
      id: 'capacity',
      title: 'Capacity and constraints',
      context: 'Plant scope · Northworks · Oct 6 Day Shift · Synthetic',
      kpis: [
        measure('constraint', 'Active constraint', null, '', null, 'No governed constraint record is supplied', null, asOf, plantScope),
        measure('utilization', 'Utilization', parent.metrics.planned > 0 ? parent.metrics.run / parent.metrics.planned * 100 : null, '%', null, 'northworks plant run minutes / planned minutes', null, asOf, plantScope),
        measure('planned-runtime', 'Planned runtime', parent.metrics.planned, 'min', null, 'northworksParentView', null, asOf, plantScope),
        measure('actual-runtime', 'Actual runtime', parent.metrics.run, 'min', null, 'northworksParentView', null, asOf, plantScope),
        measure('good-output', 'Actual good output', parent.goal.actual, 'good units', null, 'northworksParentView', null, asOf, planScope),
        measure('approved-plan', 'Approved plan', parent.goal.target, 'good units', parent.goal.target, 'northworks-investigation-v1#/goal', 'higher', asOf, planScope),
        measure('plan-gap', 'Plan gap', parent.goal.gap, 'good units', null, 'Approved plan minus actual good output', null, asOf, planScope),
        measure('recoverable', 'Recoverable opportunity', caseFixtures.downtime.costAssumptions.recoverableUnitsEstimate ?? null, 'good units', null, 'No governed recoverable-opportunity record is supplied', null, asOf, plantScope),
      ],
      decisionTitle: capacityChart.title,
      bars: barsFrom(bridgePoints),
      charts: [capacityChart],
      breakdownTitle: 'Approved plan shortfall, kept separate',
      rows: [measure('plan-gap-row', 'Approved plan shortfall', parent.goal.gap, 'good units', parent.goal.target, planSource, null, asOf, planScope)],
      interpretation: `Theoretical capacity loss and the approved plan shortfall are different baselines. The bridge ends at ${formatQuantity(parent.goal.actual, 'good units')}. The approved plan shortfall is ${formatQuantity(parent.goal.gap, 'good units')}. Do not add those figures together.`,
    },
    {
      id: 'maintenance',
      title: 'Maintenance and reliability',
      context: 'No CMMS is connected · Synthetic',
      kpis: [
        measure('mtbf', 'MTBF', null, 'min', null, 'No governed MTBF record is supplied'),
        measure('mttr-repair', 'MTTR repair', null, 'min', null, 'No governed MTTR repair record is supplied'),
        measure('mttr-restore', 'MTTR restore', null, 'min', null, 'No governed MTTR restore record is supplied'),
        measure('planned-maintenance', 'Planned maintenance', null, '', null, 'No governed planned-maintenance record is supplied'),
        measure('unplanned-maintenance', 'Unplanned maintenance', null, '', null, 'No governed unplanned-maintenance record is supplied'),
        measure('pm-compliance', 'PM compliance', null, '%', null, 'No governed PM compliance record is supplied'),
        measure('backlog', 'Backlog', null, '', null, 'No governed backlog record is supplied'),
        measure('repeat-failures', 'Repeat failures', null, '', null, 'No governed repeat-failure record is supplied'),
        measure('wo-aging', 'Work-order aging', null, '', null, 'No governed work-order aging record is supplied'),
      ],
      decisionTitle: 'Recorded downtime minutes by line',
      bars: barsFrom(lines.map(line => ({ id: line.id, label: line.id, numeric: line.down, display: formatQuantity(line.down, 'min') }))),
      charts: [chart('line-downtime', 'Plant-wide recorded downtime minutes by line', lines.map(line => `${line.id} ${formatQuantity(line.down, 'min')}`).join('. ') + '. Plant-wide production downtime minutes, not mean time between failures, and not filtered to the current line or job.', 'Plant-wide recorded production downtime. Not filtered to the current line or job. Not MTBF, and not the approved-plan shortfall.', 'primary', lines.map(line => point(line.id, line.id, line.down, 'min', 'scenario-fixture.json#/lines', plantScope, asOf)))],
      breakdownTitle: 'FEED-03 selected-shift stop reasons',
      rows: stopPoints.map(item => measure(item.id, item.label, item.numeric, 'min', null, item.source, null, item.cutoff, item.scope)),
      interpretation: 'Line downtime minutes come from the synthetic production lines. They are not mean time between failures, repair time, or a maintenance backlog. PM compliance, work-order aging, and repeat failures are unavailable. The maintenance fixture is a design fixture with no CMMS.',
    },
    {
      id: 'quality',
      title: 'Quality and corrective action',
      context: `${qualityScope} · Synthetic`,
      kpis: [
        measure('fpy', 'First-pass yield', typeof qualityShift.fpy.value === 'number' ? qualityShift.fpy.value : null, '%', null, 'quality-investigation-v1 current shift', null, asOf, qualityScope),
        measure('final-yield', 'Final yield', typeof qualityShift.quality.value === 'number' ? qualityShift.quality.value : null, '%', null, 'quality-investigation-v1 current shift', null, asOf, qualityScope),
        measure('scrap', 'Scrap', currentUnits.length ? scrap : null, 'units', null, currentUnits.length ? 'quality-investigation-v1 current shift dispositions' : 'No unit dispositions are supplied', null, asOf, qualityScope),
        measure('rework', 'Rework', currentUnits.length ? rework : null, 'units', null, currentUnits.length ? 'quality-investigation-v1 current shift dispositions' : 'No unit dispositions are supplied', null, asOf, qualityScope),
        measure('ppm', 'PPM', null, 'PPM', null, 'No governed PPM record is supplied', null, asOf, qualityScope),
      ],
      decisionTitle: 'Defect modes on the quality selected shift',
      bars: barsFrom([...defectCounts.entries()].map(([mode, count]) => ({ id: mode, label: mode, numeric: count, display: formatQuantity(count, 'units') }))),
      charts: defectCounts.size ? [chart('defect-modes', 'Defect modes on the quality selected shift', [...defectCounts.entries()].map(([mode, count]) => `${mode} ${formatQuantity(count, 'units')}`).join('. ') + '. Case scope for the quality selected shift. Not a plant-wide Pareto.', 'Case scope · Synthetic Works · Quality line · FORM-Q1 · QUALITY-JOB-01. Not a plant-wide Pareto.', 'primary', [...defectCounts.entries()].map(([mode, count]) => point(mode, mode, count, 'units', 'quality-investigation-v1 current shift', qualityScope, asOf)))] : [],
      breakdownTitle: 'Controlled quality records',
      rows: [
        measure('speed-loss-note', 'PRESS-S1 speed-loss time', typeof speedShift.speedLoss.value === 'number' ? speedShift.speedLoss.value : null, 'min', null, 'speed-investigation-v1 current shift · not a quality defect', null, asOf, speedScope),
      ],
      interpretation: `First-pass yield is available only for the quality fixture, where first-pass dispositions exist. Final yield counts terminal good units and is a different measure. PPM, NCR, and a document count used as a defect rate are unavailable. ${typeof speedShift.speedLoss.value === 'number' ? `PRESS-S1 speed-loss time is ${formatQuantity(speedShift.speedLoss.value, 'min')} and is not a quality defect. ` : ''}The effective PFMEA, control plan, and standard work are read from the open quality investigation. Hypotheses, actions, verification, and sustainment appear only from that investigation.`,
    },
    {
      id: 'flow',
      title: 'Flow, delivery, and inventory',
      context: 'Separate reporting windows · Synthetic',
      kpis: [
        measure('otif-flow', 'OTIF', otif?.value ?? null, '%', otif?.target ?? null, otif?.source || 'operating review', otif?.deviation.direction ?? null, otif?.sourceCutoff || asOf, 'Plant scope · Northworks · orders due'),
        measure('otd', 'OTD', null, '%', null, 'No governed OTD record is supplied'),
        measure('fill-rate', 'Fill rate', null, '%', null, 'No governed fill-rate record is supplied'),
        measure('schedule-flow', 'Schedule adherence', schedule?.value ?? null, '%', schedule?.target ?? null, schedule?.source || 'operating review', schedule?.deviation.direction ?? null, schedule?.sourceCutoff || asOf, 'Plant scope · Northworks · shift schedule'),
        measure('wip', 'WIP', null, 'units', null, 'No governed WIP record is supplied'),
        measure('inventory-flow', 'Inventory days', inventory?.value ?? null, 'day', inventory?.target ?? null, inventory?.source || 'operating review', inventory?.deviation.direction ?? null, inventory?.sourceCutoff || asOf, 'Plant scope · Northworks · unit-basis inventory'),
        measure('turns', 'Inventory turns', null, '', null, 'No governed inventory-turns record is supplied'),
        measure('shortage', 'Shortage or excess', null, '', null, 'No governed shortage or excess record is supplied'),
        measure('lead-time', 'Lead time', null, '', null, 'No governed lead-time record is supplied'),
        measure('queue', 'Queue', null, '', null, 'No governed queue record is supplied'),
        measure('starvation', 'Starvation or blocking', null, '', null, 'No governed starvation or blocking record is supplied'),
      ],
      decisionTitle: 'Supplied delivery and inventory observations',
      bars: [],
      charts: [],
      breakdownTitle: 'Not supplied for this cutoff',
      rows: [],
      interpretation: 'OTIF, schedule adherence, and inventory days keep separate operating-review windows and units. They are not drawn as one chart and are not added together. OTD, fill rate, WIP, turns, shortage, lead time, queue, and starvation or blocking are unavailable.',
    },
    {
      id: 'safety',
      title: 'Safety and compliance',
      context: 'No incident system is connected · Synthetic',
      kpis: [
        measure('incidents', 'Incidents', null, '', null, 'No governed incident record is supplied'),
        measure('near-misses', 'Near misses', null, '', null, 'No governed near-miss record is supplied'),
        measure('open-actions', 'Open safety actions', null, '', null, 'No governed safety-action record is supplied'),
        measure('audits', 'Audit findings', null, '', null, 'No governed audit-finding record is supplied'),
        measure('closure-aging', 'Closure aging', null, '', null, 'No governed closure-aging record is supplied'),
        measure('repeat-conditions', 'Repeat conditions', null, '', null, 'No governed repeat-condition record is supplied'),
      ],
      decisionTitle: 'No incident chart is available',
      bars: [],
      charts: [],
      breakdownTitle: 'Improvement guardrails',
      rows: [],
      interpretation: 'Loss detail is unavailable for this scope. Select a line or investigation to continue. Incidents, near misses, audit findings, and closure aging are unavailable. This view does not infer a safety result from production loss. When an investigation is open, its guardrail status is the investigation status.',
    },
  ];
  return { asOf, families, ranks };
}
