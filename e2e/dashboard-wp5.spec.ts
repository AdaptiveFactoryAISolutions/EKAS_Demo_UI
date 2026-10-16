import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const shots = 'docs/wp5/screenshots';
mkdirSync(shots, { recursive: true });

async function shot(page: Page, file: string) {
  await page.screenshot({ path: `${shots}/${file}.png`, fullPage: false });
}

async function goArea(page: Page, name: string) {
  const button = page.getByRole('complementary', { name: 'Template sidebar navigation' }).getByRole('button', { name, exact: true });
  await expect(page.locator('[aria-label="Workspace content"]')).toBeVisible();
  if (!(await button.isVisible())) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(button).toBeVisible();
  }
  await button.click();
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.locator('[aria-label="Workspace content"]').evaluate(el => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectNoEmptyHeading(region: Locator) {
  const blanks = await region.locator('h2').evaluateAll(nodes => nodes.filter(node => {
    const next = node.nextElementSibling;
    return !next || /^H[1-6]$/.test(next.tagName);
  }).map(node => node.textContent));
  expect(blanks).toEqual([]);
}

async function expectSeriesMatchesTable(figure: Locator) {
  const labels = (await figure.locator('.highcharts-data-label').allTextContents()).map(text => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const shown = await figure.locator('tbody tr').evaluateAll(rows => rows.map(row => row.querySelector('td')?.textContent?.replace(/\s+/g, ' ').trim() || ''));
  expect(labels).toEqual(shown);
  expect(labels.length).toBeGreaterThan(0);
}

async function scrollTop(page: Page) {
  await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
}

async function expectTopInView(locator: Locator, viewportHeight: number) {
  const box = await locator.boundingBox();
  expect(box, 'expected an on-screen box').toBeTruthy();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeLessThan(viewportHeight);
}

async function expectTooltipInFrame(page: Page) {
  const tip = page.locator('.highcharts-tooltip-container, .highcharts-tooltip').last();
  await expect(tip).toBeVisible();
  const box = await tip.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  expect(box!.width).toBeGreaterThan(20);
  expect(box!.height).toBeGreaterThan(20);
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.y).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1);
}

test('plant operations selects Line 03, explains the 150-unit gap, and opens the downtime case', async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
  await goArea(page, 'Dashboards');
  const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
  const context = page.getByRole('region', { name: 'Current investigation context' });
  const operations = dashboard.getByRole('tab', { name: 'Plant operations' });
  await expect(operations).toHaveAttribute('aria-selected', 'true');
  await expect(dashboard.getByRole('tab', { selected: true })).toHaveCount(1);
  await expect(dashboard.getByLabel('Dashboard family')).toBeHidden();
  const activeStyle = await operations.evaluate(el => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, color: style.color };
  });
  expect(activeStyle).toEqual({ background: 'rgb(236, 236, 234)', color: 'rgb(28, 28, 26)' });
  await operations.focus();
  await page.keyboard.press('ArrowRight');
  const productionTab = dashboard.getByRole('tab', { name: 'Production and OEE' });
  await expect(productionTab).toHaveAttribute('aria-selected', 'true');
  await expect(operations).toHaveAttribute('aria-selected', 'false');
  await expect(dashboard.getByRole('tab', { selected: true })).toHaveCount(1);
  const productionStyle = await productionTab.evaluate(el => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, color: style.color };
  });
  expect(productionStyle).toEqual({ background: 'rgb(236, 236, 234)', color: 'rgb(28, 28, 26)' });
  await expect(dashboard.locator('[data-chart-id="apq"] .highcharts-container')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(operations).toHaveAttribute('aria-selected', 'true');

  await expect(dashboard).toContainText('What is happening');
  await expect(dashboard).toContainText('Where is the loss');
  await expect(dashboard).toContainText('What to investigate');
  await expect(dashboard).toContainText('Production versus plan');
  await expect(dashboard).toContainText('93.5%');
  await expect(dashboard).toContainText('Target ≥100%');
  await expect(dashboard).toContainText('Below target');
  await expect(dashboard).toContainText('240 min');
  await expect(dashboard).toContainText('Target ≤180 min');
  await expect(dashboard).toContainText('Above target');
  await expect(dashboard).toContainText('4.8 days');
  await expect(dashboard).toContainText('91.3%');
  await expect(dashboard).toContainText('Plant shortfall: 150 good units below plan');
  await expect(dashboard).toContainText("Line 03 contributed 138 units of the plant's 150-unit shortfall");
  await expect(dashboard).not.toContainText('Line 03, 150');
  const kpiValue = dashboard.locator('.ekas-dash-kpis p').nth(1);
  const kpiSize = await kpiValue.evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize));
  const kpiCard = await dashboard.locator('.ekas-dash-kpis li').first().boundingBox();
  expect(kpiSize).toBeGreaterThanOrEqual(16);
  expect(kpiCard && kpiCard.width).toBeGreaterThanOrEqual(180);
  await expect(dashboard).not.toContainText('4.80 day');
  await expect(dashboard).not.toContainText('91.30%');
  await expect(dashboard.locator('.highcharts-container').first()).toBeVisible();
  await expect(dashboard.locator('.highcharts-legend')).toHaveCount(0);
  const planFigure = dashboard.locator('[data-chart-id="plan-versus-actual"]');
  const planValues = (await planFigure.getAttribute('data-values'))!.split(',').map(Number);
  expect(planValues).toEqual([2304, 2154, 150]);
  await expectSeriesMatchesTable(planFigure);
  const bridgeFigure = dashboard.locator('[data-chart-id="capacity-bridge"]');
  const bridgeValues = (await bridgeFigure.getAttribute('data-values'))!.split(',').map(Number);
  expect(bridgeValues[1]).not.toBe(150);
  await expectSeriesMatchesTable(bridgeFigure);
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"]')).toContainText('2,304 good units');
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"]')).toContainText('2,154 good units');
  await expect(dashboard.locator('[data-chart-id="capacity-bridge"]')).toContainText('Do not add');
  await expectNoEmptyHeading(dashboard);
  await expect(dashboard.locator('.ekas-dash-table').first()).toBeVisible();
  await expect(dashboard.locator('.ekas-dash-cards').first()).toBeHidden();
  await expect(context).toContainText('FEED-03');
  const sourceCells = await dashboard.locator('.ekas-dash-table tbody td:last-child').allTextContents();
  expect(sourceCells.some(text => text.includes('Approved production plan'))).toBeTruthy();
  for (const text of sourceCells) expect(text).not.toMatch(/\.json|#\//);
  const scopeCells = await dashboard.locator('.ekas-dash-table tbody td:nth-child(3)').allTextContents();
  for (const text of scopeCells) expect(text).toMatch(/Plant scope|Line scope|Case scope|Separate case scopes/);
  await expect(planFigure.locator('.ekas-dash-technical')).toContainText('northworks-investigation-v1#/goal');
  expect(await planFigure.locator('.ekas-dash-technical').evaluate(el => (el as HTMLDetailsElement).open)).toBe(false);
  await expect(dashboard).toContainText('Plant-wide plan vs actual');
  await expect(dashboard).toContainText('Plant scope · Northworks · Oct 6 Day Shift');
  await scrollTop(page);
  await expectTopInView(dashboard.getByRole('tab', { name: 'Plant operations' }), 768);
  await expectTopInView(dashboard.getByRole('heading', { name: 'What is happening' }), 768);
  await expectTopInView(dashboard.getByRole('heading', { name: 'KPI status' }), 768);
  await expectTopInView(planFigure.locator('.highcharts-container'), 768);
  const planBox = await planFigure.locator('.highcharts-container').boundingBox();
  expect(planBox && planBox.y + 60 < 768).toBeTruthy();
  const kpiBottom = await dashboard.locator('.ekas-dash-kpis').boundingBox();
  expect(kpiBottom && kpiBottom.y + kpiBottom.height < 768).toBeTruthy();
  await expectNoOverflow(page);
  await shot(page, 'A-plant-operations-top');

  await planFigure.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'nearest' }));
  await dashboard.locator('[data-chart-id="plan-versus-actual"] .highcharts-point').nth(1).hover({ force: true });
  const tooltip = page.locator('.highcharts-tooltip').last();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText(/2,154|2154/);
  await expect(tooltip).toContainText('Plant scope');
  await expectTooltipInFrame(page);
  await expectNoOverflow(page);
  await shot(page, 'D-plan-tooltip');
  await page.mouse.move(40, 300);
  await page.evaluate(() => {
    document.querySelectorAll('.highcharts-tooltip-container').forEach(node => node.remove());
  });

  const lossTable = dashboard.locator('[data-chart-id="line-contribution"] .ekas-dash-table');
  const ask = dashboard.getByRole('button', { name: 'Ask about this' });
  await page.locator('[aria-label="Workspace content"]').evaluate(el => {
    const actions = el.querySelector('.ekas-dash .ekas-answer-actions');
    const table = el.querySelector('[data-chart-id="line-contribution"] .ekas-dash-table');
    const sticky = document.querySelector('.ekas-context')?.getBoundingClientRect().bottom ?? 0;
    if (!actions || !table) return;
    el.scrollTop += actions.getBoundingClientRect().bottom - window.innerHeight + 8;
    const covered = sticky + 4 - table.getBoundingClientRect().top;
    if (covered > 0) el.scrollTop -= covered;
  });
  const stickyBottom = await page.locator('.ekas-context').evaluate(el => el.getBoundingClientRect().bottom);
  const lossBox = await lossTable.boundingBox();
  expect(lossBox && lossBox.y >= stickyBottom - 1 && lossBox.y + lossBox.height <= 768).toBeTruthy();
  await expectTopInView(ask, 768);
  await expectTopInView(dashboard.getByRole('button', { name: 'Investigate' }), 768);
  await expectTopInView(dashboard.getByRole('button', { name: 'Show evidence' }), 768);
  await expect(lossTable).toContainText('138 good units below plan');
  await expect(lossTable).toContainText('Production plan and actuals');
  await expect(lossTable).not.toContainText('Case measurement record');
  await expect(dashboard.getByRole('button', { name: 'Northworks plant plan miss, 150 good units below plan' })).toBeVisible();
  await shot(page, 'C-plant-operations-lower');
  await scrollTop(page);

  await dashboard.getByRole('button', { name: 'Northworks plant plan miss, 150 good units below plan' }).click();
  await expect(context).toContainText('Northworks');
  await expect(context).toContainText('Line 03');
  await expect(context).not.toContainText('FEED-03');
  await expect(dashboard).toContainText('Northworks › Line 03');
  await shot(page, '02-line-03-context');

  await page.getByLabel('Ask EKAS').fill('Why?');
  await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).click();
  await goArea(page, 'Chat');
  const answer = page.locator('article.ekas-captured-reply').last();
  await expect(answer).toContainText('Production finished');
  await expect(answer).toContainText(/150/);
  await expect(answer).toContainText(/2,154|2154/);
  await expect(answer).toContainText(/2,304|2304/);
  await expect(answer).not.toContainText('Machine 1');
  await expect(answer).not.toContainText('training-positive');
  await answer.scrollIntoViewIfNeeded();
  await shot(page, '03-why');
  await shot(page, 'G-line-03-why');

  await goArea(page, 'Dashboards');
  await dashboard.getByRole('button', { name: 'Investigate' }).click();
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Northworks feeder-jam plan miss');
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Next: Record this hypothesis');
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Status: No owner requested');
  await shot(page, '04-investigate');
  await shot(page, 'H-line-03-investigate');

  await goArea(page, 'Dashboards');
  await dashboard.getByRole('tab', { name: 'Production and OEE' }).click();
  await expect(dashboard.getByRole('tab', { selected: true })).toHaveText('Production and OEE');
  await expect(dashboard.getByRole('tab', { name: 'Plant operations' })).toHaveAttribute('aria-selected', 'false');
  const selected = await dashboard.locator('.ekas-dash-family').evaluateAll(nodes => nodes.filter(node => getComputedStyle(node).backgroundColor === 'rgb(236, 236, 234)').map(node => node.textContent?.trim()));
  expect(selected).toEqual(['Production and OEE']);
  await expect(dashboard.locator('[data-chart-id="apq"] .highcharts-container')).toBeVisible();
  await expect(dashboard).toContainText('No time series is supplied');
  await expect(dashboard).toContainText('Availability');
  await expect(dashboard).toContainText('83.3%');
  await expect(dashboard).toContainText('No governed target');
  await expect(dashboard).toContainText('Not evaluated');
  await expect(dashboard).not.toContainText('Target Unavailable');
  await expect(dashboard.locator('[data-chart-id="apq"]')).toContainText('Plant scope · Northworks · Oct 6 Day Shift');
  await expect(dashboard.locator('[data-chart-id="feed-stops"]')).toContainText('Line scope · Northworks · Line 03 · FEED-03 · Oct 6 Day Shift');
  await expect(dashboard.locator('[data-chart-id="feed-stops"] .ekas-dash-table td:last-child').first()).toHaveText('Recorded stop events');
  await expectSeriesMatchesTable(dashboard.locator('[data-chart-id="apq"]'));
  await expectNoEmptyHeading(dashboard);
  await scrollTop(page);
  await expectTopInView(dashboard.getByRole('tab', { name: 'Production and OEE' }), 768);
  await expectTopInView(dashboard.getByRole('heading', { name: 'KPI status' }), 768);
  const productionKpis = await dashboard.locator('.ekas-dash-kpis').boundingBox();
  expect(productionKpis && productionKpis.y + productionKpis.height < 768).toBeTruthy();
  await expect(dashboard.locator('.ekas-dash-kpis')).toContainText('No governed target');
  await expect(dashboard.locator('.ekas-dash-kpis')).toContainText('Not evaluated');
  await expectNoOverflow(page);
  await shot(page, 'B-production-oee-kpis');
  await dashboard.getByRole('tab', { name: 'Capacity and constraints' }).click();
  await expect(dashboard.getByRole('tab', { selected: true })).toHaveText('Capacity and constraints');
  await expect(dashboard).toContainText('Do not add');
  await shot(page, '06-capacity');
  await dashboard.getByRole('tab', { name: 'Maintenance and reliability' }).click();
  await expect(dashboard).toContainText('MTBF');
  await expect(dashboard.getByText('Unavailable').first()).toBeVisible();
  await shot(page, '07-maintenance');
  await dashboard.getByRole('tab', { name: 'Quality and corrective action' }).click();
  await expect(dashboard).toContainText('First-pass yield');
  await expect(dashboard).toContainText('PPM');
  await shot(page, '08-quality');
  await dashboard.getByRole('tab', { name: 'Flow, delivery, and inventory' }).click();
  await expect(dashboard).toContainText('WIP');
  await expect(dashboard).toContainText('Unavailable');
  await shot(page, '09-flow');
  await dashboard.getByRole('tab', { name: 'Safety and compliance' }).click();
  await expect(dashboard).toContainText('Incidents');
  await expect(dashboard).toContainText('does not infer a safety result');
  await expectNoEmptyHeading(dashboard);
  await shot(page, '10-safety');
});

async function expectStackedActions(page: Page, width: number) {
  await page.setViewportSize({ width, height: 844 });
  await goArea(page, 'Dashboards');
  const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
  const family = dashboard.getByLabel('Dashboard family');
  await expect(family).toBeVisible();
  await family.selectOption('operations');
  await expect(dashboard.locator('.ekas-dash-tabs')).toBeHidden();
  await expect(dashboard.getByRole('tab', { name: 'Safety and compliance' })).toBeHidden();
  const cards = dashboard.locator('.ekas-dash-kpis li');
  await expect(cards.first()).toBeVisible();
  await expect(dashboard.locator('.ekas-dash-table').first()).toBeHidden();
  await expect(dashboard.locator('.ekas-dash-cards').first()).toBeVisible();
  await expect(dashboard).toContainText('Below target');
  await expect(dashboard).toContainText('4.8 days');
  await expectNoEmptyHeading(dashboard);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first && second && second.y >= first.y + first.height - 2).toBeTruthy();
  await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
  const kpi = await cards.first().boundingBox();
  const menu = await family.boundingBox();
  expect(menu && kpi && menu.y < kpi.y && kpi.y < 844).toBeTruthy();
  await expect(dashboard.locator('.highcharts-container').first()).toBeAttached();
  await expect(dashboard).toContainText('Plant scope');
  await expectNoOverflow(page);
  await shot(page, width === 320 ? 'F-plant-320' : 'E-plant-390');
  await dashboard.locator('[data-chart-id="plan-versus-actual"]').scrollIntoViewIfNeeded();
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"] .highcharts-container')).toBeVisible();
  await dashboard.locator('[data-chart-id="plan-versus-actual"] .highcharts-point').first().hover({ force: true });
  await expect(page.locator('.highcharts-tooltip').last()).toBeVisible();
  await expectNoOverflow(page);
  const ask = dashboard.getByRole('button', { name: 'Ask about this' });
  const investigate = dashboard.getByRole('button', { name: 'Investigate' });
  const evidence = dashboard.getByRole('button', { name: 'Show evidence' });
  await ask.scrollIntoViewIfNeeded();
  for (const button of [ask, investigate, evidence]) {
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box && box.height).toBeGreaterThanOrEqual(44);
  }
  await family.selectOption('production');
  await expect(dashboard.locator('[data-chart-id="apq"]')).toBeAttached();
  await expect(dashboard).toContainText('Availability');
  await family.selectOption('operations');
  await shot(page, `11-mobile-${width}`);
}

test('dashboard cards stack at 390 and 320', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/');
  await expectStackedActions(page, 390);
  await expectStackedActions(page, 320);
});
