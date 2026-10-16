import { expect, test, type Page } from '@playwright/test';
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

test('plant operations selects Line 03, explains the 150-unit gap, and opens the downtime case', async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
  await goArea(page, 'Dashboards');
  const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
  const context = page.getByRole('region', { name: 'Current investigation context' });
  await expect(dashboard.getByRole('button', { name: 'Plant operations', pressed: true })).toBeVisible();
  await expect(dashboard).toContainText('What is happening');
  await expect(dashboard).toContainText('Production versus plan');
  await expect(dashboard).toContainText('93.49%');
  await expect(dashboard).toContainText('150 good units');
  await expect(dashboard.locator('.ekas-dash-table').first()).toBeVisible();
  await expect(dashboard.locator('.ekas-dash-cards').first()).toBeHidden();
  await expect(context).toContainText('FEED-03');
  await shot(page, '01-plant-operations');

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
  await dashboard.getByRole('button', { name: 'Production and OEE' }).click();
  await expect(dashboard).toContainText('Availability');
  await expect(dashboard).toContainText('OEE trend versus an approved target');
  await expect(dashboard).toContainText('Unavailable');
  await shot(page, '05-production-oee');
  await dashboard.getByRole('button', { name: 'Capacity and constraints' }).click();
  await expect(dashboard).toContainText('Do not add');
  await shot(page, '06-capacity');
  await dashboard.getByRole('button', { name: 'Maintenance and reliability' }).click();
  await expect(dashboard).toContainText('MTBF');
  await expect(dashboard.getByText('Unavailable').first()).toBeVisible();
  await shot(page, '07-maintenance');
  await dashboard.getByRole('button', { name: 'Quality and corrective action' }).click();
  await expect(dashboard).toContainText('First-pass yield');
  await expect(dashboard).toContainText('PPM');
  await shot(page, '08-quality');
  await dashboard.getByRole('button', { name: 'Flow, delivery, and inventory' }).click();
  await expect(dashboard).toContainText('WIP');
  await expect(dashboard).toContainText('Unavailable');
  await shot(page, '09-flow');
  await dashboard.getByRole('button', { name: 'Safety and compliance' }).click();
  await expect(dashboard).toContainText('Incidents');
  await expect(dashboard).toContainText('does not infer a safety result');
  await shot(page, '10-safety');
});

async function expectStackedActions(page: Page, width: number) {
  await page.setViewportSize({ width, height: 800 });
  await goArea(page, 'Dashboards');
  const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
  await dashboard.getByRole('button', { name: 'Plant operations', pressed: true }).click();
  const cards = dashboard.locator('.ekas-dash-kpis li');
  await expect(cards.first()).toBeVisible();
  await expect(dashboard.locator('.ekas-dash-table').first()).toBeHidden();
  await expect(dashboard.locator('.ekas-dash-cards').first()).toBeVisible();
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first && second && second.y >= first.y + first.height - 2).toBeTruthy();
  await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
  await shot(page, `12-mobile-${width}-top`);
  const ask = dashboard.getByRole('button', { name: 'Ask about this' });
  const investigate = dashboard.getByRole('button', { name: 'Investigate' });
  const evidence = dashboard.getByRole('button', { name: 'Show evidence' });
  await ask.scrollIntoViewIfNeeded();
  for (const button of [ask, investigate, evidence]) {
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box && box.height).toBeGreaterThanOrEqual(44);
  }
  await shot(page, `11-mobile-${width}`);
}

test('dashboard cards stack at 390 and 320', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/');
  await expectStackedActions(page, 390);
  await expectStackedActions(page, 320);
});
