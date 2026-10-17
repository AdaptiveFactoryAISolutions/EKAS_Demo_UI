import { mkdirSync, rmSync } from 'node:fs';
import { chromium, expect, test, type Locator, type Page } from '@playwright/test';

const profileRoot = '/tmp/ekas-rc3-frames-profile';
const shots = '/workspace/docs/wp6/screenshots';
mkdirSync(shots, { recursive: true });

async function openClean(name: string) {
  const profile = `${profileRoot}-${name}`;
  rmSync(profile, { recursive: true, force: true });
  mkdirSync(profile, { recursive: true });
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
    baseURL: 'http://127.0.0.1:18195',
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  return { context, page };
}

async function shot(page: Page, file: string) {
  await page.screenshot({ path: `${shots}/${file}.png`, fullPage: false });
}

async function goArea(page: Page, name: string) {
  const button = page.getByRole('complementary', { name: 'Template sidebar navigation' }).getByRole('button', { name, exact: true });
  if (!(await button.isVisible())) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(button).toBeVisible();
  }
  await button.click();
}

async function ask(page: Page, text: string) {
  const box = page.getByLabel('Ask EKAS');
  await box.fill(text);
  await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('button', { name: 'Saving…' })).toHaveCount(0);
  await expect(page.locator('article.ekas-captured-reply').last().locator('.ekas-question')).toHaveText(text);
}

async function settledLabel(button: Locator, previous = '') {
  let current = '';
  await expect.poll(async () => {
    current = (await button.innerText()).trim();
    return !await button.isDisabled() && current !== previous ? current : '';
  }, { timeout: 20_000 }).not.toBe('');
  return current;
}

async function advanceUntilReopen(page: Page, id: string) {
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  const button = summary.locator('[data-next-cta]');
  const labels: string[] = [];
  for (let step = 0; step < 24; step += 1) {
    const label = await settledLabel(button, labels.at(-1) || '');
    if (labels.at(-1) === label) throw new Error(`${id} repeated “${label}”`);
    labels.push(label);
    const named = ['Request an owner', 'Accept ownership', 'Record this hypothesis', 'Recommend this action', 'Authorize the action', 'Record performed work', 'Review safety', 'Review verification result', 'Record sustainment', 'Reopen the investigation'].includes(label);
    if (named) await shot(page, `rc3-${id}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`);
    await button.evaluate((el: HTMLButtonElement) => el.click());
    if (label === 'Reopen the investigation') {
      await settledLabel(button, label);
      await expect(summary).toContainText('Cycle 2: Open after recurrence');
      await shot(page, `rc3-${id}-reopened`);
      return;
    }
  }
  throw new Error(`${id} did not reopen: ${labels.join(' | ')}`);
}

test('RC3 shell, dashboard, mobile, and tooltip frames', async () => {
  const { context, page } = await openClean('shell');
  await shot(page, 'rc3-light-chat');
  await shot(page, 'rc3-chat');
  await page.locator('form.ekas-composer').screenshot({ path: `${shots}/rc3-composer.png` });
  await page.getByLabel('More workspace utilities').click();
  await page.getByRole('button', { name: 'Use dark appearance' }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await shot(page, 'rc3-dark-chat');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Dashboards', exact: true })).toBeVisible();
  await shot(page, 'rc3-390');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 320, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Chat', exact: true })).toBeVisible();
  await shot(page, 'rc3-320');
  await page.setViewportSize({ width: 1366, height: 768 });
  await goArea(page, 'Dashboards');
  const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
  await expect(dashboard.getByRole('button', { name: 'Northworks plant plan miss, 150 good units below plan' })).toBeVisible();
  await shot(page, 'rc3-dashboard');
  const point = page.locator('.highcharts-point').first();
  await expect(point).toBeVisible();
  await point.hover();
  await expect(page.locator('.highcharts-tooltip')).toBeVisible();
  await shot(page, 'rc3-tooltip');
  await context.close();
});

test('RC3 ambiguous referent, new conversation, investigation, and evidence frames', async () => {
  const { context, page } = await openClean('referent');
  await ask(page, 'Run my plant review.');
  const review = page.locator('article.ekas-captured-reply').last();
  await expect(review).toContainText(/150 good units/);
  await shot(page, 'rc3-plant-review');
  await ask(page, 'Compare the speed loss and the quality loss.');
  await ask(page, 'Investigate it.');
  const ambiguous = page.locator('article.ekas-captured-reply').last();
  await expect(ambiguous).toContainText(/more than one case/i);
  await expect(ambiguous).not.toContainText(/150 good units/);
  await ambiguous.scrollIntoViewIfNeeded();
  await shot(page, 'rc3-ambiguous-referent');
  await page.getByRole('button', { name: 'New conversation', exact: true }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await ask(page, 'Investigate it.');
  const cleared = page.locator('article.ekas-captured-reply').last();
  await expect(cleared).not.toContainText(/Line 03 missed by 138/);
  await shot(page, 'rc3-new-conversation');
  await page.getByRole('button', { name: 'New conversation', exact: true }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await ask(page, 'Run my plant review.');
  await ask(page, 'What should I focus on first?');
  await ask(page, 'Investigate it.');
  const opened = page.locator('article.ekas-captured-reply').last();
  await expect(opened).toContainText(/150 good units/);
  await expect(opened).toContainText(/138/);
  await goArea(page, 'Investigations');
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toBeVisible();
  await shot(page, 'rc3-investigation');
  await goArea(page, 'Chat');
  await opened.getByRole('button', { name: 'Evidence and investigation' }).click();
  const dialog = page.getByRole('dialog', { name: 'Captured evidence and investigation' });
  await expect(dialog).toContainText(/150 good units|feeder/i);
  await shot(page, 'rc3-evidence');
  await context.close();
});

for (const journey of [
  { id: 'downtime', prompt: 'We missed our production goal.' },
  { id: 'speed', prompt: 'Investigate speed.' },
  { id: 'quality', prompt: 'Investigate quality.' },
] as const) {
  test(`RC3 ${journey.id} journey frames`, async () => {
    const { context, page } = await openClean(journey.id);
    await page.getByRole('button', { name: journey.prompt }).click();
    const answer = page.locator('article.ekas-captured-reply').last();
    await expect(answer).toContainText(/below the approved plan/i);
    await shot(page, `rc3-${journey.id}-goal`);
    await goArea(page, 'Investigations');
    await advanceUntilReopen(page, journey.id);
    await context.close();
  });
}

test('RC3 downtime journey frames at 320px', async () => {
  const { context, page } = await openClean('downtime-320');
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  await expect(page.locator('article.ekas-captured-reply').last()).toContainText(/below the approved plan/i);
  await shot(page, 'rc3-downtime-320-goal');
  await goArea(page, 'Investigations');
  await advanceUntilReopen(page, 'downtime-320');
  await context.close();
});
