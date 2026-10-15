import { expect, test } from '@playwright/test';
import { ask, assetOrder, lastAnswer } from './helpers';

/**
 * Correct-behavior regressions for the release-blocking trust failures.
 * They are red on this candidate: each assertion is the behavior a plant
 * leader can trust, and the current local demo does not do that yet.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat Home' })).toBeVisible();
});

test('a natural production question states the plan gap or that the period is unavailable', async ({ page }) => {
  await ask(page, 'Why did we miss production yesterday?');
  await page.screenshot({ path: 'docs/wp1/screenshots/production-yesterday.png', fullPage: true });
  const answer = await lastAnswer(page);
  expect(answer, answer).not.toMatch(/TP-S\d: Good units|good units total/i);
  expect(answer).toMatch(/approved plan|plan miss|approved target is unavailable/i);
  await expect(page.getByRole('region', { name: 'Current investigation context' }).locator('strong')).not.toHaveText('Training');
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

test('worst first reverses the previous machine ranking', async ({ page }) => {
  await ask(page, 'Please rank the machines by descending OEE');
  const first = assetOrder(await lastAnswer(page));
  await ask(page, 'Now put the worst first');
  await page.screenshot({ path: 'docs/wp1/screenshots/worst-first.png', fullPage: true });
  const second = assetOrder(await lastAnswer(page));
  expect(first.length, first.join(', ')).toBeGreaterThan(1);
  expect(second, `first ${first.join(', ')}`).toEqual([...first].reverse());
});

test('a production question does not leave the context bar on the training dataset', async ({ page }) => {
  await ask(page, 'Why did we miss production yesterday?');
  await page.screenshot({ path: 'docs/wp1/screenshots/context-bar.png', fullPage: true });
  const bar = page.getByRole('region', { name: 'Current investigation context' });
  expect(await bar.locator('strong').innerText()).not.toBe('Training');
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
  const chat = await page.getByRole('region', { name: 'Current investigation context' }).innerText();
  const chatAction = chat.match(/Action\s+([a-z-]+)/i)?.[1];
  await page.getByRole('button', { name: 'Improvements' }).click();
  await expect(page.getByRole('heading', { name: 'Current improvement' })).toBeVisible();
  await page.screenshot({ path: 'docs/wp1/screenshots/case-status-improvements.png', fullPage: true });
  const improvements = await page.getByRole('region', { name: 'Current shared case' }).innerText();
  const improvementsAction = improvements.match(/Action\s+([a-z-]+)/i)?.[1];
  expect(chatAction, chat).toBeTruthy();
  expect(improvementsAction, improvements).toBe(chatAction);
});
