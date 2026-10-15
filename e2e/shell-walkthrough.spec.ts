import { expect, test } from '@playwright/test';

const shots = 'docs/wp1/screenshots';

test('plant shell walk-through of the six acceptance states', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Administration' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Advanced tools' })).toHaveCount(0);
  const menu = page.getByRole('navigation', { name: 'Template sidebar navigation' });
  for (const area of ['Chat', 'Dashboards', 'Investigations', 'Improvements', 'Knowledge']) {
    await expect(menu.getByRole('button', { name: area, exact: true })).toBeVisible();
  }
  const bar = page.getByRole('region', { name: 'Current investigation context' });
  await expect(bar).toContainText('Synthetic manufacturing demo');
  await expect(bar).toContainText('Next: ask a question or choose a starter.');
  await expect(page.getByRole('region', { name: 'Manufacturing conversation context' })).toHaveCount(1);
  await page.screenshot({ path: `${shots}/01-first-load.png`, fullPage: true });

  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  const answer = page.locator('article.ekas-captured-reply').last();
  await expect(answer).toContainText(/below the approved plan/i);
  await expect(bar).toContainText('Northworks');
  await expect(bar).toContainText('FEED-03');
  await expect(bar).toContainText('JOB-8303');
  await expect(bar.locator('strong').first()).not.toHaveText('Training');
  await page.screenshot({ path: `${shots}/02-chat-answer.png`, fullPage: true });

  await page.getByRole('button', { name: 'Investigations', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Investigations' })).toBeVisible();
  await expect(bar).toContainText('Northworks');
  await expect(bar).toContainText('FEED-03');
  await page.screenshot({ path: `${shots}/04-investigation.png`, fullPage: true });

  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await page.getByRole('button', { name: 'Evidence and investigation' }).click();
  const evidence = page.getByRole('dialog', { name: 'Captured evidence and investigation' });
  await expect(evidence.getByRole('region', { name: 'Plain-language evidence' })).toBeVisible();
  await expect(evidence.getByText('Technical record')).toBeVisible();
  const evidenceText = await evidence.innerText();
  expect(evidenceText).toContain('What this evidence says');
  expect(evidenceText).toContain('FEED-03');
  expect(evidenceText).not.toContain('Exact source IDs');
  await page.screenshot({ path: `${shots}/05-evidence.png`, fullPage: true });
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'New conversation' }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show the plant operating review.' }).click();
  const review = page.locator('article.ekas-captured-reply').last();
  await expect(review.getByRole('region', { name: 'Plant review scorecard' })).toBeVisible();
  await expect(review.getByText('Priority:', { exact: false })).toBeVisible();
  const reviewText = await review.innerText();
  expect(reviewText).toMatch(/Priority:/);
  expect(reviewText).not.toContain('These are separate scopes');
  await page.screenshot({ path: `${shots}/03-plant-review.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(menu.getByRole('button', { name: 'Chat', exact: true })).toBeVisible();
  await page.screenshot({ path: `${shots}/06-mobile.png`, fullPage: true });
});
