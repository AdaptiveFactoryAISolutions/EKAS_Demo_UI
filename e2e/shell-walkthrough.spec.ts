import { expect, test, type Locator, type Page } from '@playwright/test';

const shots = 'docs/wp1/screenshots';

async function aboveComposer(page: Page, target: Locator) {
  const handle = await target.elementHandle();
  await page.evaluate(el => {
    if (!el) return;
    const main = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
    el.scrollIntoView({ block: 'end' });
    const form = document.querySelector('form.ekas-composer');
    if (!form) return;
    const overlap = el.getBoundingClientRect().bottom - form.getBoundingClientRect().top;
    if (overlap > 0) (main || window).scrollBy?.(0, overlap + 16);
    if (overlap > 0 && main) main.scrollTop += overlap + 16;
  }, handle);
  const content = await target.boundingBox();
  const composer = await page.locator('form.ekas-composer').boundingBox();
  expect(content, 'content box').toBeTruthy();
  expect(composer, 'composer box').toBeTruthy();
  expect(content!.y + content!.height).toBeLessThanOrEqual(composer!.y + 1);
}

async function contextUnderHeader(page: Page) {
  const bar = page.getByRole('region', { name: 'Current investigation context' });
  await expect(bar).toBeVisible();
  const barBox = await bar.boundingBox();
  const headerBox = await page.locator('header.retained-header').boundingBox();
  expect(barBox, 'context box').toBeTruthy();
  expect(headerBox, 'header box').toBeTruthy();
  const gap = barBox!.y - (headerBox!.y + headerBox!.height);
  expect(gap, `context gap ${gap}`).toBeLessThanOrEqual(28);
  expect(gap).toBeGreaterThanOrEqual(-2);
  const viewport = page.viewportSize();
  expect(barBox!.y).toBeLessThan((viewport?.height || 900) / 2);
  expect(barBox!.height).toBeGreaterThan(8);
}

test('plant shell walk-through of the closure screens', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Administration' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Advanced tools' })).toHaveCount(0);
  await expect(page.getByText('Local durability')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Original training/ })).toHaveCount(0);
  await expect(page.getByLabel('Fictional chat role')).not.toBeVisible();
  await expect(page.getByText('bounded improvement')).toHaveCount(0);
  await expect(page.getByLabel('Ask EKAS')).toHaveValue('');
  const menu = page.getByRole('complementary', { name: 'Template sidebar navigation' });
  for (const area of ['Chat', 'Dashboards', 'Investigations', 'Improvements', 'Knowledge']) {
    await expect(menu.getByRole('button', { name: area, exact: true })).toBeVisible();
  }
  await expect(menu.getByRole('button', { name: 'New conversation' })).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Create', exact: true })).toHaveCount(0);
  const bar = page.getByRole('region', { name: 'Current investigation context' });
  await expect(bar).toContainText('Northworks');
  await expect(bar).toContainText('Line 03');
  await expect(bar).toContainText('FEED-03');
  await expect(bar).toContainText('JOB-8303');
  await expect(bar).toContainText(/Oct 6/);
  await expect(bar).toContainText('Day Shift');
  await expect(bar).toContainText('Synthetic');
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/01-first-load.png`, fullPage: false });

  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  const answer = page.locator('article.ekas-captured-reply').last();
  await expect(answer).toContainText(/below the approved plan/i);
  await expect(answer).toContainText('EKAS');
  await expect(answer).not.toContainText('Synthetic captured answer');
  await expect(answer).toContainText(/Snapshot: .+ UTC · Synthetic/);
  await expect(page.getByText('Reply saved.')).toHaveCount(0);
  await expect(bar.locator('[data-case-state]')).toContainText('No owner requested');
  await expect(bar.locator('strong').first()).not.toHaveText('Training');
  await page.evaluate(() => {
    const main = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
    if (main) main.scrollTop = 420;
  });
  await contextUnderHeader(page);
  await aboveComposer(page, answer.locator('.ekas-answer-actions'));
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/02-chat-answer.png`, fullPage: false });

  await page.getByRole('button', { name: 'Investigations', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Investigations' })).toBeVisible();
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  await expect(summary).toContainText('150 units below plan');
  await expect(summary).toContainText('Status: No owner requested');
  await expect(summary).toContainText('Owner: Not assigned');
  await expect(summary).toContainText('Next: Request an owner');
  await expect(summary).not.toContainText('Start with the feeder-jam');
  await expect(summary.getByRole('tab', { name: 'Evidence' })).toBeVisible();
  const summaryText = await summary.innerText();
  expect(summaryText.split('Northworks feeder-jam plan miss').length - 1).toBe(1);
  expect(summaryText).not.toContain('No chart was published');
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/04-investigation.png`, fullPage: false });

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  await expect(menu).toBeHidden();
  await expect(page.getByLabel('Investigation section', { exact: true })).toBeVisible();
  await expect(summary).toContainText('Next: Request an owner');
  const field = page.getByLabel('Ask EKAS');
  const send = page.getByRole('button', { name: 'Send' });
  await field.scrollIntoViewIfNeeded();
  await expect(send).toBeVisible();
  const fieldBox = await field.boundingBox();
  const sendBox = await send.boundingBox();
  expect(fieldBox, 'composer field').toBeTruthy();
  expect(sendBox, 'send button').toBeTruthy();
  expect(fieldBox!.width).toBeGreaterThan(140);
  expect(sendBox!.x).toBeGreaterThanOrEqual(0);
  expect(sendBox!.x + sendBox!.width).toBeLessThanOrEqual(322);
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/04-investigation-320.png`, fullPage: false });
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await page.getByRole('button', { name: 'Evidence and investigation' }).click();
  const evidence = page.getByRole('dialog', { name: 'Captured evidence and investigation' });
  const evidenceText = await evidence.innerText();
  const order = ['What this evidence says', 'Current case state', 'Next action', 'Scope', 'Relevant evidence', 'Technical record'];
  let cursor = -1;
  for (const label of order) {
    const at = evidenceText.indexOf(label);
    expect(at, label).toBeGreaterThan(cursor);
    cursor = at;
  }
  expect(evidenceText).toContain('Standard Work 030 — Current / Feeder setup reference and evidence record');
  expect(evidenceText).toContain('Standard Work 030 — Superseded /');
  expect(evidenceText.split('Standard Work 030 — Current').length - 1).toBe(1);
  expect(evidenceText).toContain('Technician note — Uncontrolled /');
  expect(evidenceText).toContain('Stop event 01 — Feeder jams / 12 minutes · FEED-03 · Oct 6');
  expect(evidenceText).not.toMatch(/SW-030 ·/);
  expect(evidenceText).not.toContain('Saved with this reply');
  expect(evidenceText).toContain('Request an owner');
  await page.screenshot({ path: `${shots}/05-evidence.png`, fullPage: false });
  await page.keyboard.press('Escape');

  await menu.getByRole('button', { name: 'New conversation' }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await expect(page.getByLabel('Ask EKAS')).toHaveValue('');
  await page.getByRole('button', { name: 'Show the plant operating review.' }).click();
  const review = page.locator('article.ekas-captured-reply').last();
  const scorecard = review.getByRole('region', { name: 'Plant review scorecard' });
  await expect(scorecard).toBeVisible();
  const reviewText = await review.innerText();
  expect(reviewText).toMatch(/Priority:/);
  expect(reviewText).not.toContain('These are separate scopes');
  expect(reviewText).not.toContain('Synthetic captured answer');
  await aboveComposer(page, scorecard);
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/03-plant-review.png`, fullPage: false });

  await page.evaluate(() => { document.documentElement.style.zoom = '1.5'; });
  await aboveComposer(page, scorecard);
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(bar).toContainText('Northworks');
  await expect(bar).toContainText('Synthetic');
  await expect(page.getByLabel('Fictional chat role')).not.toBeVisible();
  await expect(page.getByText('Local durability')).toHaveCount(0);
  await expect(scorecard.locator('.ekas-scorecard-cards')).toBeVisible();
  await expect(scorecard.locator('table')).toBeHidden();
  await expect(scorecard).toContainText('Actual 2,154');
  await expect(scorecard).toContainText('Goal 2,304');
  await expect(scorecard).toContainText('Shortfall 150 good units');
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/06-mobile.png`, fullPage: false });

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(scorecard.locator('.ekas-scorecard-cards')).toBeVisible();
  await expect(scorecard).toContainText('Shortfall 150 good units');
  await field.scrollIntoViewIfNeeded();
  await expect(send).toBeVisible();
  const narrowSend = await send.boundingBox();
  expect(narrowSend!.x + narrowSend!.width).toBeLessThanOrEqual(322);
  await contextUnderHeader(page);
  await page.screenshot({ path: `${shots}/06-plant-review-320.png`, fullPage: false });
});
