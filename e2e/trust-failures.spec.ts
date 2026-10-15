import { expect, test } from '@playwright/test';
import { ask, assetOrder, lastAnswer } from './helpers';

/**
 * Correct-behavior regressions for the release-blocking trust failures.
 * Each assertion is the behavior a plant leader can trust.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
});

test('yesterday offers the latest supplied day and answers only after acceptance', async ({ page }) => {
  await ask(page, 'Why did we miss production yesterday?');
  const offer = await lastAnswer(page);
  expect(offer, offer).not.toMatch(/TP-S\d: Good units|good units total|below the approved plan/i);
  expect(offer).toBe("I don't have data for yesterday. The latest available production day is 2026-10-06. Would you like me to use that?");
  await ask(page, 'Yes, use 2026-10-06');
  await page.screenshot({ path: 'docs/wp1/screenshots/production-yesterday.png', fullPage: true });
  const answer = await lastAnswer(page);
  expect(answer, answer).toMatch(/latest available day you accepted, 2026-10-06/);
  expect(answer).toMatch(/below the approved plan/);
  expect(answer).toMatch(/FEED-03/);
  expect(answer).toMatch(/JOB-8303/);
  expect(answer).toMatch(/I would start with the feeder-jam evidence/);
  await expect(page.getByRole('region', { name: 'Current investigation context' }).locator('strong').first()).not.toHaveText('Training');
});

test('March 2025 is not answered with March 2026 numbers', async ({ page }) => {
  await ask(page, 'OEE by machine in March 2025');
  await page.screenshot({ path: 'docs/wp1/screenshots/march-2025.png', fullPage: true });
  const answer = await lastAnswer(page);
  expect(answer, answer).not.toMatch(/2026/);
  expect(answer).toMatch(/unavailable|not supplied|no records|2025/i);
});

test('an invalid TP-S1 question does not refuse the next exact machine question', async ({ page }) => {
  await ask(page, 'What is quality on TP-S1?');
  await ask(page, 'Show quality for Machine 1');
  await page.screenshot({ path: 'docs/wp1/screenshots/tp-s1-poison.png', fullPage: true });
  const answer = await lastAnswer(page);
  expect(answer, answer).not.toMatch(/Requested: TP-S1/);
  expect(answer).toMatch(/Machine 1/);
});

test('worst first reorders the ranking ascending with asset-ID ties', async ({ page }) => {
  await ask(page, 'Please rank the machines by descending OEE');
  const first = assetOrder(await lastAnswer(page));
  await ask(page, 'Now put the worst first');
  await page.screenshot({ path: 'docs/wp1/screenshots/worst-first.png', fullPage: true });
  const second = assetOrder(await lastAnswer(page));
  expect(first, first.join(', ')).toEqual(['TP-A5', 'TP-A1', 'TP-A3', 'TP-A7']);
  expect(second, `first ${first.join(', ')}`).toEqual(['TP-A7', 'TP-A1', 'TP-A3', 'TP-A5']);
});

test('a production question does not leave the context bar on the training dataset', async ({ page }) => {
  await ask(page, 'Why did we miss production yesterday?');
  await page.screenshot({ path: 'docs/wp1/screenshots/context-bar.png', fullPage: true });
  const bar = page.getByRole('region', { name: 'Current investigation context' });
  expect(await bar.locator('strong').first().innerText()).not.toBe('Training');
  expect(await bar.innerText()).not.toContain('training-plant-v1');
});

test('typing during a save does not glue the sent command to the next draft', async ({ page }) => {
  const box = page.getByLabel('Ask EKAS');
  await box.fill('Show downtime by machine');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.waitForFunction(() => document.querySelector('button[aria-label="Send"]')?.getAttribute('aria-busy') === 'true');
  await page.evaluate(() => {
    const el = document.querySelector<HTMLTextAreaElement>('#ekas-canonical-question');
    if (!el) throw new Error('Composer missing');
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    setter?.call(el, `${el.value}\nShow quality for Machine 1`);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForFunction(() => document.querySelector('button[aria-label="Send"]')?.getAttribute('aria-busy') === 'false');
  await page.screenshot({ path: 'docs/wp1/screenshots/pending-draft.png', fullPage: true });
  const draft = await box.inputValue();
  expect(draft, draft).not.toContain('Show downtime by machine');
  expect(draft).toContain('Show quality for Machine 1');
});

test('Chat and Improvements show the same case action status', async ({ page }) => {
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  await expect(page.locator('article.ekas-captured-reply').last().locator('.ekas-question')).toHaveText('We missed our production goal.');
  const chatState = (await page.getByRole('region', { name: 'Current investigation context' }).locator('[data-case-state]').innerText()).replace(/\s+/g, ' ').trim();
  expect(chatState).toMatch(/Awaiting owner acceptance|Owner accepted/);
  await page.getByRole('button', { name: 'Improvements' }).click();
  await expect(page.getByRole('heading', { name: 'Current improvement' })).toBeVisible();
  await page.screenshot({ path: 'docs/wp1/screenshots/case-status-improvements.png', fullPage: true });
  const improvementsState = (await page.getByRole('region', { name: 'Current shared case' }).locator('[data-case-state]').innerText()).replace(/\s+/g, ' ').trim();
  expect(improvementsState, improvementsState).toBe(chatState);
});
