import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { chromium, expect, test, type Page } from '@playwright/test';

const profile = '/tmp/ekas-rc3-chrome-profile';
const shots = '/workspace/docs/wp6/screenshots';
rmSync(profile, { recursive: true, force: true });
mkdirSync(profile, { recursive: true });
mkdirSync(shots, { recursive: true });

async function ask(page: Page, text: string) {
  const box = page.getByLabel('Ask EKAS');
  await box.fill(text);
  await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('button', { name: 'Saving…' })).toHaveCount(0);
  const article = page.locator('article.ekas-captured-reply').last();
  await expect(article.locator('.ekas-question')).toHaveText(text);
  return article;
}

async function answerOf(article: ReturnType<Page['locator']>) {
  const text = await article.innerText();
  return (text.split(/\nEKAS\n/)[1] ?? text).split(/\nSnapshot:/)[0].trim();
}

test('RC3 referent and timestamp checkpoint on a clean Chrome profile', async () => {
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
    baseURL: 'http://127.0.0.1:18195',
  });
  const page = context.pages()[0] || await context.newPage();
  const databases = await page.evaluate(async () => {
    const anyIndexed = indexedDB as IDBFactory & { databases?: () => Promise<{ name?: string }[]> };
    if (!anyIndexed.databases) return [];
    return (await anyIndexed.databases()).map(item => item.name || '');
  }).catch(() => [] as string[]);
  expect(databases).toEqual([]);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);

  const phrases = [
    'Run my plant review.',
    'What should I focus on first?',
    'Investigate it.',
  ] as const;
  const turns: { question: string; answer: string }[] = [];
  const files = [
    'rc3-checkpoint-1-plant-review',
    'rc3-checkpoint-2-focus-first',
    'rc3-checkpoint-3-investigate-it',
  ];
  for (let i = 0; i < phrases.length; i++) {
    const article = await ask(page, phrases[i]);
    const answer = await answerOf(article);
    turns.push({ question: phrases[i], answer });
    await article.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${shots}/${files[i]}.png`, fullPage: false });
    await article.screenshot({ path: `${shots}/${files[i]}-reply.png` });
  }
  expect(turns[0].answer).toMatch(/Northworks feeder-jam plan miss/);
  expect(turns[0].answer).toMatch(/150/);
  expect(turns[0].answer).toMatch(/2,154|2154/);
  expect(turns[1].answer).toMatch(/Northworks feeder-jam plan miss/);
  expect(turns[1].answer).toMatch(/150/);
  expect(turns[2].answer).toMatch(/150 good units/);
  expect(turns[2].answer).toMatch(/138/);
  expect(turns[2].answer).not.toMatch(/Quality loss: observed/);

  const quality = await ask(page, 'Investigate the quality audit gap.');
  const qualityText = await answerOf(quality);
  expect(qualityText).toMatch(/Oct 6, 2026 · 2:45 PM/);
  expect(qualityText).not.toMatch(/2026-10-06T14:45:00Z/);
  await quality.scrollIntoViewIfNeeded();
  await quality.screenshot({ path: `${shots}/rc3-timestamp-normal.png` });
  await quality.getByRole('button', { name: 'Evidence and investigation' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('Technical details', { exact: true }).click();
  const recorded = dialog.getByText('Saved with this reply at 2026-10-06T14:45:00Z');
  await expect(recorded).toBeVisible();
  await recorded.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${shots}/rc3-timestamp-technical.png` });
  writeFileSync('/workspace/docs/wp6/rc3-checkpoint.json', JSON.stringify({ turns, qualityText }, null, 2));
  await context.close();
});
