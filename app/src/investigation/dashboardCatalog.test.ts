import { expect, it } from 'vitest';
import { dashboardCatalog } from './dashboardCatalog';
import { emptyConversationContext, presentTurn, routeConversation } from './conversation';
import { createWorkflow, workflowView } from './workflow';
import { MockRepository } from '../platform/mockRepository';
import { ManufacturingService, createManufacturingClient } from './service';

it('ranks Line 03 by the 150 good-unit plan gap and keeps missing measures unavailable', () => {
  const catalog = dashboardCatalog();
  const line = catalog.ranks.find(rank => rank.caseId === 'downtime');
  expect(line).toMatchObject({ line: 'Line 03', gap: 150, actual: 2154, target: 2304, unit: 'good units' });
  expect(catalog.ranks.map(rank => rank.gap)).toEqual([150, 114, 58]);
  const operations = catalog.families.find(family => family.id === 'operations')!;
  const production = operations.kpis.find(row => row.id === 'production')!;
  const oee = operations.kpis.find(row => row.id === 'oee')!;
  const downtime = operations.kpis.find(row => row.id === 'downtime')!;
  const inventory = operations.kpis.find(row => row.id === 'inventory')!;
  const otif = operations.kpis.find(row => row.id === 'otif')!;
  expect(production.display).toBe('93.5%');
  expect(production.target).toBe('≥100%');
  expect(production.status).toBe('Below target');
  expect(oee.display).toBe('74.8%');
  expect(oee.target).toBe('≥80%');
  expect(oee.status).toBe('Below target');
  expect(downtime.display).toBe('240 min');
  expect(downtime.target).toBe('≤180 min');
  expect(downtime.status).toBe('Above target');
  expect(inventory.display).toBe('4.8 days');
  expect(inventory.target).toBe('≤4.5 days');
  expect(inventory.status).toBe('Above target');
  expect(otif.display).toBe('91.3%');
  expect(otif.status).toBe('Below target');
  const availability = catalog.families.find(family => family.id === 'production')!.kpis.find(row => row.id === 'availability')!;
  expect(availability.display).toBe('83.3%');
  expect(availability.status).toBe('Not evaluated');
  expect(availability.target).toBe('No governed target');
  expect(availability.sourceLabel).toBe('Line production results');
  expect(availability.scope).toBe('Plant scope · Northworks · Oct 6 Day Shift');
  const plan = operations.charts.find(item => item.id === 'plan-versus-actual')!;
  const bridge = operations.charts.find(item => item.id === 'capacity-bridge')!;
  expect(plan.points.map(item => item.numeric)).toEqual([2304, 2154, 150]);
  expect(plan.table).toBe(plan.points);
  expect(plan.title).toMatch(/Plant-wide plan vs actual/);
  expect(plan.scope).toBe('Plant scope · Northworks · Oct 6 Day Shift');
  expect(plan.points.every(item => item.sourceLabel === 'Approved production plan' && item.scopeDetail === plan.scope)).toBe(true);
  expect(plan.points.every(item => /\.json|#\//.test(item.source) && !/\.json|#\//.test(item.sourceLabel))).toBe(true);
  const shortfall = operations.charts.find(item => item.id === 'case-shortfall')!;
  expect(shortfall.scope).toMatch(/Separate case scopes/);
  expect(shortfall.points.map(item => item.scopeDetail)).toEqual([
    'Plant scope · Northworks · Oct 6 Day Shift',
    'Case scope · Synthetic Works · Speed line · PRESS-S1 · SPEED-JOB-01 · Oct 6 Day Shift',
    'Case scope · Synthetic Works · Quality line · FORM-Q1 · QUALITY-JOB-01 · Oct 6 Day Shift',
  ]);
  expect(shortfall.points.every(item => item.sourceLabel === 'Case measurement record')).toBe(true);
  expect(bridge.points.map(item => item.label)).toEqual(['Theoretical capacity', 'Downtime loss', 'Speed loss', 'Quality loss', 'Good output']);
  expect(bridge.points.find(item => item.label === 'Downtime loss')!.numeric).not.toBe(150);
  expect(bridge.table.map(item => item.numeric)).toEqual(bridge.points.map(item => item.numeric));
  expect(operations.charts.find(item => item.id === 'case-shortfall')!.points.map(item => item.numeric)).toEqual([150, 114, 58]);
  const produced = catalog.families.find(family => family.id === 'production')!;
  expect(produced.charts.find(item => item.id === 'apq')!.points.map(item => item.id)).toEqual(['availability', 'performance', 'quality-yield']);
  for (const family of catalog.families) {
    for (const item of family.charts) {
      expect(item.table).toEqual(item.points);
      expect(item.points.length).toBeGreaterThan(0);
      expect(new Set(item.points.map(point => point.unit)).size).toBe(1);
      expect(item.points.every(point => point.source === item.source && point.scope === item.scope && point.cutoff === item.cutoff && point.numeric !== null)).toBe(true);
    }
  }
  const capacity = catalog.families.find(family => family.id === 'capacity')!;
  const bridgeGood = capacity.charts.find(item => item.id === 'capacity-bridge')!.points.find(item => item.label === 'Good output')!.numeric;
  const planGap = capacity.rows.find(row => row.id === 'plan-gap-row')!.numeric;
  expect(planGap).toBe(150);
  expect(bridgeGood).not.toBe(planGap);
  expect(capacity.interpretation).toMatch(/Do not add/);
  for (const family of catalog.families) {
    for (const row of [...family.kpis, ...family.rows]) {
      if (row.display === 'Unavailable' || row.target === 'Unavailable') {
        if (row.display === 'Unavailable') expect(row.numeric).toBeNull();
      }
    }
    expect(family.bars.every(bar => bar.numeric !== null)).toBe(true);
  }
  for (const id of ['mtbf', 'incidents', 'wip'] as const) {
    const row = catalog.families.flatMap(family => family.kpis).find(item => item.id === id);
    expect(row?.display).toBe('Unavailable');
    expect(row?.status).toBe('Unavailable');
    expect(row?.target).toBe('Unavailable');
    expect(row?.numeric).toBeNull();
  }
});

it('focuses Line 03 without opening a case, then Why explains the same plan gap', () => {
  const focused = routeConversation('Focus the dashboard on Line 03.', emptyConversationContext());
  expect(focused.intent).toBe('dashboard-focus');
  expect(focused.createCase).toBeNull();
  expect(focused.context).toMatchObject({ plant: 'Northworks', line: 'Line 03', machine: '', caseFocus: null, dashboardCase: 'downtime' });
  expect(presentTurn(focused, null).text).toMatch(/150 good units/);
  expect(presentTurn(focused, null).text).toMatch(/2154 against 2304/);
  const why = routeConversation('Why?', focused.context);
  expect(why.intent).toBe('goal');
  expect(why.createCase).toBe('downtime');
  expect(why.context.dashboardCase).toBeUndefined();
  expect(why.context.machine).toBe('FEED-03');
  const answer = presentTurn(why, workflowView(createWorkflow('downtime')));
  expect(answer.text).toMatch(/150 good units/);
  expect(answer.text).toMatch(/2154 against 2304/);
  expect(routeConversation('Investigate it.', why.context).intent).toBe('hypotheses');
  expect(routeConversation('Why?', emptyConversationContext()).intent).not.toBe('goal');
});

it('keeps a dashboard focus on the manufacturing dataset and out of the monthly cohort', async () => {
  const client = createManufacturingClient(new ManufacturingService(new MockRepository()));
  let first = await client.createConversation('dashboard-first');
  first = await client.turn(first.id, first.version, 'Focus the dashboard on Line 03.', 'dashboard-first-line');
  expect(first.content.conversation.dataset).toBe('manufacturing');
  expect(first.content.conversation.turns.at(-1)!.asOf.startsWith('2026-10-06')).toBe(true);
  expect(first.content.conversation.turns.at(-1)!.answer.text).toMatch(/Northworks › Line 03/);
  expect(first.content.conversation.turns.at(-1)!.answer.text).not.toMatch(/training-positive|Machine 1/);
  let record = await client.createConversation('dashboard-focus');
  record = await client.turn(record.id, record.version, 'What was OEE in January?', 'dashboard-monthly');
  const monthly = structuredClone(record.content.conversation.monthlyContext);
  record = await client.turn(record.id, record.version, 'Focus the dashboard on Line 03.', 'dashboard-line');
  const focused = record.content.conversation;
  expect(focused.dataset).toBe('manufacturing');
  expect(focused.investigationId).toBeNull();
  expect(focused.context.machine).toBe('');
  expect(focused.context.line).toBe('Line 03');
  expect(focused.monthlyContext).toEqual(monthly);
  expect(focused.turns.at(-1)!.answer.text).not.toMatch(/Machine 1|training-positive/);
  record = await client.turn(record.id, record.version, 'Why?', 'dashboard-why');
  const answer = record.content.conversation.turns.at(-1)!.answer.text;
  expect(record.content.conversation.context.caseFocus).toBe('downtime');
  expect(answer).toMatch(/150/);
  expect(answer).toMatch(/2154/);
  expect(answer).not.toMatch(/Machine 1/);
});
