import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { chromium, expect, test, type Page } from '@playwright/test';

const profile = '/tmp/ekas-rc2-chrome-profile';
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

test('RC2 Investigate-it checkpoint on a clean Chrome profile', async () => {
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
    baseURL: 'http://127.0.0.1:18194',
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
    'rc2-checkpoint-1-plant-review',
    'rc2-checkpoint-2-focus-first',
    'rc2-checkpoint-3-investigate-it',
  ];
  for (let i = 0; i < phrases.length; i++) {
    const article = await ask(page, phrases[i]);
    const answer = await answerOf(article);
    turns.push({ question: phrases[i], answer });
    await article.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${shots}/${files[i]}.png` });
    await article.screenshot({ path: `${shots}/${files[i]}-reply.png` });
  }
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  const summaryText = (await summary.count()) ? (await summary.innerText()) : '';
  const contextText = await page.getByRole('region', { name: 'Current investigation context' }).innerText();
  writeFileSync('/tmp/ekas-rc2/checkpoint.json', JSON.stringify({ turns, summaryText, contextText }, null, 2));
  expect(turns[1].answer).toMatch(/feeder-jam/i);
  expect(turns[1].answer).toMatch(/150/);
  expect(turns[2].answer.length).toBeGreaterThan(20);
  await context.close();
});
