import { expect, type Page } from '@playwright/test';

export async function ask(page: Page, text: string) {
  const box = page.getByLabel('Ask EKAS');
  await box.fill(text);
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('button', { name: 'Saving…' })).toHaveCount(0);
  await expect(page.locator('article.ekas-captured-reply').last().locator('.ekas-question')).toHaveText(text);
}

export async function lastAnswer(page: Page) {
  const article = page.locator('article.ekas-captured-reply').last();
  await expect(article).toBeVisible();
  const text = await article.innerText();
  const afterSpeaker = text.split(/\nEKAS\n/)[1] ?? text;
  return afterSpeaker.split(/\nSnapshot:/)[0].trim();
}

export function assetOrder(text: string) {
  const body = text.split('Dataset:')[0];
  const found = [...body.matchAll(/\b(?:TP-[A-Z]\d+|Machine \d+|FEED-\d+|PRESS-S\d+|FORM-Q\d+)\b/g)].map(match => match[0]);
  return [...new Set(found)];
}
