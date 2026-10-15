import { expect, test, type Locator, type Page } from '@playwright/test';

const shots = 'docs/wp1/screenshots';

async function aboveComposer(page: Page, target: Locator) {
  const handle = await target.elementHandle();
  await page.evaluate(el => {
    if (!el) return;
    el.scrollIntoView({ block: 'end' });
    const form = document.querySelector('form.ekas-composer');
    if (!form) return;
    const overlap = el.getBoundingClientRect().bottom - form.getBoundingClientRect().top;
    if (overlap > 0) window.scrollBy(0, overlap + 16);
  }, handle);
  const content = await target.boundingBox();
  const composer = await page.locator('form.ekas-composer').boundingBox();
  expect(content, 'content box').toBeTruthy();
  expect(composer, 'composer box').toBeTruthy();
  expect(content!.y + content!.height).toBeLessThanOrEqual(composer!.y + 1);
}

test('plant shell walk-through of the six acceptance states', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Administration' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Advanced tools' })).toHaveCount(0);
  await expect(page.getByText('Local durability')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Original training/ })).toHaveCount(0);
  await expect(page.getByLabel('Fictional chat role')).not.toBeVisible();
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
  await page.screenshot({ path: `${shots}/01-first-load.png`, fullPage: true });

  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  const answer = page.locator('article.ekas-captured-reply').last();
  await expect(answer).toContainText(/below the approved plan/i);
  await expect(bar.locator('[data-case-state]')).toContainText('Awaiting owner acceptance');
  await expect(bar.locator('strong').first()).not.toHaveText('Training');
  await aboveComposer(page, answer.locator('.ekas-answer-actions'));
  await page.screenshot({ path: `${shots}/02-chat-answer.png`, fullPage: true });

  await page.getByRole('button', { name: 'Investigations', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Investigations' })).toBeVisible();
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  await expect(summary).toContainText(/good units below plan/);
  await expect(summary).toContainText('Next:');
  await expect(summary.getByRole('tab', { name: 'Evidence' })).toBeVisible();
  expect(await summary.innerText()).not.toContain('No chart was published');
  await page.screenshot({ path: `${shots}/04-investigation.png`, fullPage: true });

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(summary).toContainText(/good units below plan/);
  await page.screenshot({ path: `${shots}/04-investigation-320.png`, fullPage: true });
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
  expect(evidenceText.indexOf('Saved with this reply')).toBeGreaterThan(evidenceText.indexOf('Relevant evidence'));
  await page.screenshot({ path: `${shots}/05-evidence.png`, fullPage: true });
  await page.keyboard.press('Escape');

  await menu.getByRole('button', { name: 'New conversation' }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show the plant operating review.' }).click();
  const review = page.locator('article.ekas-captured-reply').last();
  const scorecard = review.getByRole('region', { name: 'Plant review scorecard' });
  await expect(scorecard).toBeVisible();
  const reviewText = await review.innerText();
  expect(reviewText).toMatch(/Priority:/);
  expect(reviewText).not.toContain('These are separate scopes');
  await aboveComposer(page, scorecard);
  await page.screenshot({ path: `${shots}/03-plant-review.png`, fullPage: true });
  await page.screenshot({ path: `${shots}/03-plant-review-composer.png`, fullPage: false });

  await page.evaluate(() => { document.documentElement.style.zoom = '1.5'; });
  await aboveComposer(page, scorecard);
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(bar).toContainText('Northworks');
  await expect(bar).toContainText('What do you want to know?');
  await expect(page.getByLabel('Fictional chat role')).not.toBeVisible();
  await expect(page.getByText('Local durability')).toHaveCount(0);
  await page.screenshot({ path: `${shots}/06-mobile.png`, fullPage: true });
});
