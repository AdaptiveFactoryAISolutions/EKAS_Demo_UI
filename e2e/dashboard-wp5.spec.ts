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

async function chartValues(page: Page, id: string) {
  return page.evaluate(chartId => {
    const host = document.querySelector(`[data-chart-id="${chartId}"] .ekas-dash-chart`);
    const charts = ((window as unknown as { Highcharts?: { charts?: { renderTo?: Element; series?: { points?: { y?: number }[] }[] }[] } }).Highcharts?.charts || []).filter(Boolean);
    const chart = charts.find(item => item.renderTo === host || (host ? host.contains(item.renderTo as Node) : false));
    return chart?.series?.[0]?.points?.map(point => point.y) || [];
  }, id);
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
  const activeStyle = await operations.evaluate(el => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, color: style.color };
  });
  expect(activeStyle).toEqual({ background: 'rgb(43, 182, 163)', color: 'rgb(6, 34, 28)' });
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
  expect(productionStyle).toEqual({ background: 'rgb(43, 182, 163)', color: 'rgb(6, 34, 28)' });
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
  await expect(dashboard).not.toContainText('4.80 day');
  await expect(dashboard).not.toContainText('91.30%');
  await expect(dashboard.locator('.highcharts-container').first()).toBeVisible();
  await expect(dashboard.locator('.highcharts-legend')).toHaveCount(0);
  const planValues = (await dashboard.locator('[data-chart-id="plan-versus-actual"]').getAttribute('data-values'))!.split(',').map(Number);
  expect(await chartValues(page, 'plan-versus-actual')).toEqual(planValues);
  expect(planValues).toEqual([2304, 2154, 150]);
  const bridgeValues = (await dashboard.locator('[data-chart-id="capacity-bridge"]').getAttribute('data-values'))!.split(',').map(Number);
  expect(await chartValues(page, 'capacity-bridge')).toEqual(bridgeValues);
  expect(bridgeValues[1]).not.toBe(150);
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"]')).toContainText('2,304 good units');
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"]')).toContainText('2,154 good units');
  await expect(dashboard.locator('[data-chart-id="capacity-bridge"]')).toContainText('Do not add');
  await expectNoEmptyHeading(dashboard);
  await expect(dashboard.locator('.ekas-dash-table').first()).toBeVisible();
  await expect(dashboard.locator('.ekas-dash-cards').first()).toBeHidden();
  await expect(context).toContainText('FEED-03');
  await dashboard.locator('[data-chart-id="plan-versus-actual"]').scrollIntoViewIfNeeded();
  const point = dashboard.locator('[data-chart-id="plan-versus-actual"] .highcharts-point').first();
  await point.hover({ force: true });
  await expect(dashboard.locator('.highcharts-tooltip').last()).toBeVisible();
  await expect(dashboard.locator('.highcharts-tooltip').last()).toContainText(/2,304|2304/);
  await expectNoOverflow(page);
  await shot(page, '01-plant-operations');
  await shot(page, '17-plan-tooltip');

  await dashboard.getByRole('button', { name: /Line 03, 150 good units/ }).click();
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
  await shot(page, '03-why');

  await goArea(page, 'Dashboards');
  await dashboard.getByRole('button', { name: 'Investigate' }).click();
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Northworks feeder-jam plan miss');
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Next: Record this hypothesis');
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Status: No owner requested');
  await shot(page, '04-investigate');

  await goArea(page, 'Dashboards');
  await dashboard.getByRole('tab', { name: 'Production and OEE' }).click();
  await expect(dashboard.getByRole('tab', { selected: true })).toHaveText('Production and OEE');
  await expect(dashboard.getByRole('tab', { name: 'Plant operations' })).toHaveAttribute('aria-selected', 'false');
  const teal = await dashboard.locator('.ekas-dash-family').evaluateAll(nodes => nodes.filter(node => getComputedStyle(node).backgroundColor === 'rgb(43, 182, 163)').map(node => node.textContent?.trim()));
  expect(teal).toEqual(['Production and OEE']);
  await expect(dashboard.locator('[data-chart-id="apq"] .highcharts-container')).toBeVisible();
  await expect(dashboard).toContainText('No time series is supplied');
  await expect(dashboard).toContainText('Availability');
  const apqValues = (await dashboard.locator('[data-chart-id="apq"]').getAttribute('data-values'))!.split(',').map(Number);
  expect(await chartValues(page, 'apq')).toEqual(apqValues);
  await expectNoEmptyHeading(dashboard);
  await dashboard.locator('[data-chart-id="apq"]').scrollIntoViewIfNeeded();
  await expectNoOverflow(page);
  await shot(page, '05-production-oee');
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
  await expectNoOverflow(page);
  await shot(page, width === 320 ? '14-plant-320' : '13-plant-390');
  await dashboard.locator('[data-chart-id="plan-versus-actual"]').scrollIntoViewIfNeeded();
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"] .highcharts-container')).toBeVisible();
  await dashboard.locator('[data-chart-id="plan-versus-actual"] .highcharts-point').first().hover({ force: true });
  await expect(dashboard.locator('.highcharts-tooltip').last()).toBeVisible();
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
