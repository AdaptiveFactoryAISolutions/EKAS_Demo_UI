import { expect, test } from '@playwright/test';

test('a plant leader can open a supplied goal and see the same case in Improvements', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat Home' })).toBeVisible();
  await page.screenshot({ path: 'docs/wp1/screenshots/journey-chat-home.png', fullPage: true });
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  const reply = page.locator('article.ekas-captured-reply').last();
  await expect(reply.locator('.ekas-question')).toHaveText('We missed our production goal.');
  await expect(reply).toContainText(/plan|goal|good units/i);
  await page.screenshot({ path: 'docs/wp1/screenshots/journey-goal.png', fullPage: true });
  await page.getByRole('button', { name: 'Improvements' }).click();
  await expect(page.getByRole('heading', { name: 'Current improvement' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Current shared case' })).toContainText(/Action/i);
  await page.screenshot({ path: 'docs/wp1/screenshots/journey-improvements.png', fullPage: true });
  await page.getByRole('button', { name: 'Chat Home' }).click();
  await expect(page.locator('article.ekas-captured-reply').last().locator('.ekas-question')).toHaveText('We missed our production goal.');
});
