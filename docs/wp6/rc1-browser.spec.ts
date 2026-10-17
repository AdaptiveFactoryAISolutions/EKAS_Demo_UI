import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { chromium } from '@playwright/test';

const shots = '/workspace/docs/wp6/screenshots';
mkdirSync(shots, { recursive: true });

const observations: Record<string, unknown> = {};

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

async function lastAnswer(page: Page) {
  const article = page.locator('article.ekas-captured-reply').last();
  await expect(article).toBeVisible();
  const text = await article.innerText();
  return (text.split(/\nEKAS\n/)[1] ?? text).split(/\nSnapshot:/)[0].trim();
}

async function settledLabel(button: Locator, previous = '') {
  let current = '';
  await expect.poll(async () => {
    current = (await button.innerText()).trim();
    return !await button.isDisabled() && current !== previous ? current : '';
  }, { timeout: 20000 }).not.toBe('');
  return current;
}

test.beforeEach(async ({ page }) => {
  const databases = await page.evaluate(async () => {
    const anyIndexed = indexedDB as IDBFactory & { databases?: () => Promise<{ name?: string }[]> };
    if (!anyIndexed.databases) return [];
    return (await anyIndexed.databases()).map(item => item.name || '');
  }).catch(() => []);
  expect(databases, 'fresh profile has no leftover EKAS databases before navigation').toEqual([]);
});

test('clean Chat shell is light, keyboard-usable, and free of a prior conversation', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Current investigation context' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  const send = page.locator('form.ekas-composer').getByRole('button', { name: 'Send' });
  await expect(send).toBeDisabled();
  const box = page.getByLabel('Ask EKAS');
  await box.fill('   ');
  await expect(send).toBeDisabled();
  await box.fill('Shift enter stays in the composer');
  await box.press('Shift+Enter');
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await box.press('Enter');
  await expect(page.locator('.ekas-question').last()).toContainText('Shift enter stays in the composer');
  await page.locator('article.ekas-captured-reply').last().getByRole('button', { name: 'Evidence and investigation' }).click();
  const dialog = page.getByRole('dialog', { name: 'Captured evidence and investigation' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await shot(page, '01-chat-light-1366');

  for (const area of ['Dashboards', 'Investigations', 'Improvements', 'Knowledge'] as const) {
    await goArea(page, area);
    if (area === 'Dashboards') await expect(page.getByRole('region', { name: 'Plant dashboard' })).toBeVisible();
    if (area === 'Improvements') await expect(page.getByRole('heading', { name: 'Current improvement' })).toBeVisible();
    if (area === 'Knowledge') await expect(page.getByRole('heading', { name: 'Knowledge for the selected case' })).toBeVisible();
    await shot(page, `01-${area.toLowerCase()}-1366`);
  }
  await goArea(page, 'Chat');
  await page.getByRole('button', { name: 'New conversation', exact: true }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await shot(page, '01-new-conversation');
});

test('dark appearance is an option and light remains the default after a fresh load', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  await page.getByLabel('More workspace utilities').click();
  await page.getByRole('button', { name: 'Use dark appearance' }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await shot(page, '02-chat-dark-1366');
  const light = page.getByRole('button', { name: 'Use light appearance' });
  if (!(await light.isVisible())) await page.getByLabel('More workspace utilities').click();
  await light.click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
});

test('phone widths open the menu and keep the composer on screen', async ({ page }) => {
  for (const [width, height, name] of [[390, 844, '390'], [320, 844, '320']] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Dashboards', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    const field = await page.getByLabel('Ask EKAS').boundingBox();
    const send = await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).boundingBox();
    expect(field && send).toBeTruthy();
    expect(field!.x).toBeGreaterThanOrEqual(-1);
    expect(field!.x + field!.width).toBeLessThanOrEqual(width + 1);
    expect(send!.x + send!.width).toBeLessThanOrEqual(width + 1);
    await shot(page, `03-chat-${name}`);
  }
});

test('master conversational journey uses the exact phrases and does not silently substitute scope', async ({ page }) => {
  test.setTimeout(240000);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  const phrases = [
    'What was OEE in January?',
    'And March?',
    'What about Machine 2?',
    'No, I meant Machine 1.',
    'Why?',
    'Show me.',
    'Compare it with last month.',
    'Go back to the first machine.',
    'What was FPY?',
    'Run my plant review.',
    "What's off target?",
    'What should I focus on first?',
    'Investigate it.',
    'Where did we lose the most?',
    'Which line?',
    'Which machine?',
    'What job?',
    'What evidence do we have?',
    'How do you know that?',
    'Are you sure?',
    'What are the possible causes?',
    'What should we check first?',
    'Who owns it?',
    'Assign it.',
    'Did they accept it?',
    'What should we do?',
    'Request approval.',
    'Was it approved?',
    'What work was done?',
    'Did it work?',
    'What is still blocking acceptance?',
    'Did it hold?',
    'Why did it reopen?',
  ];
  const turns: { question: string; answer: string }[] = [];
  for (const phrase of phrases) {
    await ask(page, phrase);
    const answer = await lastAnswer(page);
    expect(answer, phrase).not.toMatch(/developer command|console\.|npm /i);
    turns.push({ question: phrase, answer });
  }
  writeFileSync('/workspace/docs/wp6/master-journey.json', JSON.stringify(turns, null, 2));
  observations.master = turns.map(turn => ({ question: turn.question, lead: turn.answer.split('\n')[0] }));
  const by = Object.fromEntries(turns.map(turn => [turn.question, turn.answer]));
  expect(by['What was OEE in January?']).toMatch(/OEE/i);
  expect(by['What was OEE in January?']).toMatch(/January/);
  expect(by['And March?']).toMatch(/March/);
  expect(by['What about Machine 2?']).toMatch(/Machine 2/);
  expect(by['No, I meant Machine 1.']).toMatch(/Machine 1/);
  expect(by['No, I meant Machine 1.']).not.toMatch(/substituted/);
  expect(by['What was FPY?']).toMatch(/FPY|first-pass|first pass/i);
  expect(by['Run my plant review.']).toMatch(/Northworks|Plant Review/i);
  expect(by['What should I focus on first?']).not.toMatch(/Requested: first/);
  expect(by['Investigate it.']).not.toMatch(/Machine 1 or Machine 2/);
  expect(by['Did they accept it?']).toMatch(/pending|not accepted|no owner|not recorded|unavailable/i);
  expect(by['Was it approved?']).toMatch(/not supplied|does not establish|no matching|unavailable|not recorded/i);
  expect(by['Was it approved?']).not.toMatch(/recorded as approved|approval is recorded/);
  await shot(page, '04-master-journey-end');
});

const journeys = [
  { id: 'downtime', prompt: 'We missed our production goal.' },
  { id: 'speed', prompt: 'Investigate speed.' },
  { id: 'quality', prompt: 'Investigate quality.' },
] as const;

async function advanceUntilReopen(page: Page, id: string, narrow = false) {
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  const button = summary.locator('[data-next-cta]');
  const labels: string[] = [];
  for (let step = 0; step < 24; step += 1) {
    const label = await settledLabel(button, labels.at(-1) || '');
    if (labels.at(-1) === label) throw new Error(`${id} repeated “${label}”`);
    labels.push(label);
    const named = ['Request an owner', 'Accept ownership', 'Record this hypothesis', 'Recommend this action', 'Authorize the action', 'Record performed work', 'Review safety', 'Review verification result', 'Record sustainment', 'Reopen the investigation'].includes(label);
    if (named) await shot(page, `${narrow ? id + '-320' : id}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`);
    await button.evaluate((el: HTMLButtonElement) => el.click());
    if (label === 'Reopen the investigation') {
      await settledLabel(button, label);
      await expect(summary).toContainText('Cycle 2: Open after recurrence');
      await expect(button).toHaveText('Record this hypothesis');
      await shot(page, `${narrow ? id + '-320' : id}-reopened`);
      return labels;
    }
  }
  throw new Error(`${id} did not reopen: ${labels.join(' | ')}`);
}

for (const journey of journeys) {
  test(`${journey.id} journey reaches reopen from a clean profile`, async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await page.getByRole('button', { name: journey.prompt }).click();
    const answer = page.locator('article.ekas-captured-reply').last();
    await expect(answer).toContainText(/below the approved plan/i);
    await shot(page, `${journey.id}-goal`);
    await goArea(page, 'Investigations');
    const labels = await advanceUntilReopen(page, journey.id);
    expect(labels).toEqual(expect.arrayContaining(['Request an owner', 'Accept ownership', 'Record this hypothesis', 'Recommend this action', 'Authorize the action', 'Record performed work', 'Review safety', 'Review verification result', 'Record sustainment', 'Reopen the investigation']));
  });
}

test('downtime journey reaches reopen at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  await expect(page.locator('article.ekas-captured-reply').last()).toContainText(/below the approved plan/i);
  await shot(page, 'downtime-320-goal');
  await goArea(page, 'Investigations');
  const labels = await advanceUntilReopen(page, 'downtime', true);
  expect(labels).toContain('Reopen the investigation');
});

test('dashboards keep 150 distinct from 138 and share that case with Chat', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  await goArea(page, 'Dashboards');
  const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
  await expect(dashboard.getByRole('tab', { name: 'Plant operations' })).toHaveAttribute('aria-selected', 'true');
  await expect(dashboard.locator('.highcharts-container').first()).toBeVisible();
  await expect(dashboard).toContainText('Plant shortfall: 150 good units below plan');
  await expect(dashboard).toContainText("Line 03 contributed 138 units of the plant's 150-unit shortfall");
  await expect(dashboard).not.toContainText('Line 03, 150');
  const planValues = (await dashboard.locator('[data-chart-id="plan-versus-actual"]').getAttribute('data-values'))!.split(',').map(Number);
  expect(planValues).toEqual([2304, 2154, 150]);
  const bridgeValues = (await dashboard.locator('[data-chart-id="capacity-bridge"]').getAttribute('data-values'))!.split(',').map(Number);
  expect(bridgeValues[1]).not.toBe(150);
  await expect(dashboard.locator('[data-chart-id="capacity-bridge"]')).toContainText('Do not add');
  await expect(dashboard.locator('[data-chart-id="plan-versus-actual"] .ekas-dash-technical')).toContainText('northworks-investigation-v1#/goal');
  await shot(page, '05-dashboards-150-138');
  await dashboard.getByRole('button', { name: 'Northworks plant plan miss, 150 good units below plan' }).click();
  await expect(page.getByRole('region', { name: 'Current investigation context' })).toContainText('Line 03');
  await page.getByLabel('Ask EKAS').fill('Why?');
  await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).click();
  await goArea(page, 'Chat');
  const answer = page.locator('article.ekas-captured-reply').last();
  await expect(answer).toContainText(/150/);
  await expect(answer).not.toContainText('Machine 1');
  await goArea(page, 'Dashboards');
  await dashboard.getByRole('button', { name: 'Investigate' }).click();
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('Northworks feeder-jam plan miss');
  await expect(page.getByRole('region', { name: 'Investigation summary' })).toContainText('150 units below plan');
  await goArea(page, 'Dashboards');
  await page.getByRole('tab', { name: 'Production and OEE' }).click();
  await expect(page.locator('[data-chart-id="apq"] .highcharts-container')).toBeVisible();
  await shot(page, '05-production-oee');
});

test('copy and export stay on the reply, and plant chat does not offer print', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  const article = page.locator('article.ekas-captured-reply').last();
  await expect(article).toContainText(/below the approved plan/i);
  await expect(article.getByRole('button', { name: 'Print' })).toHaveCount(0);
  await article.getByRole('button', { name: 'Copy answer' }).click();
  await expect(article).toContainText(/Answer copied|Clipboard unavailable/);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    article.getByRole('button', { name: 'Export captured evidence' }).click(),
  ]);
  const saved = await download.path();
  expect(saved).toBeTruthy();
  const body = readFileSync(saved!, 'utf8');
  expect(body).toMatch(/synthetic/i);
  expect(body).not.toMatch(/sk-[A-Za-z0-9]{20,}|apiKey|bearer /i);
  writeFileSync('/workspace/docs/wp6/export-sample-name.txt', download.suggestedFilename());
  await shot(page, '06-copy-export');
});

test('reload keeps the conversation and saved history can reopen it', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await ask(page, 'What was OEE in January?');
  await page.reload();
  await expect(page.locator('.ekas-question').last()).toHaveText('What was OEE in January?');
  await page.getByRole('button', { name: 'New conversation', exact: true }).click();
  await expect(page.locator('article.ekas-captured-reply')).toHaveCount(0);
  await page.getByText('Details', { exact: true }).click();
  await page.getByRole('button', { name: 'Saved conversation history' }).click();
  const history = page.getByRole('dialog', { name: 'Saved conversation history' });
  await expect(history).toContainText('What was OEE in January?');
  await history.getByRole('button', { name: /What was OEE in January/ }).click();
  await expect(page.locator('.ekas-question').last()).toHaveText('What was OEE in January?');
  await shot(page, '07-reopen-history');
});

test('rehearsal admin rejects a typed dummy key without leaving it on screen', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://127.0.0.1:18193/');
  await expect(page.getByRole('button', { name: 'Admin AI' })).toBeVisible();
  await page.getByRole('button', { name: 'Admin AI' }).click();
  const region = page.getByRole('region', { name: 'Admin AI configuration' });
  await expect(region).toContainText('Public synthetic rehearsal owner');
  await expect(region).toContainText('DUMMY_REHEARSAL_OWNER_CODE');
  await page.getByLabel(/owner code/i).fill('DUMMY_REHEARSAL_OWNER_CODE');
  await page.getByRole('button', { name: /session|sign|enter|continue/i }).click();
  await expect(region.getByLabel('OpenAI API key')).toBeVisible();
  const marker = 'DUMMY_BROWSER_MARKER_NOT_A_KEY';
  await region.getByLabel('OpenAI API key').fill(marker);
  await page.getByRole('button', { name: 'Clear entry' }).click();
  await expect(region.getByLabel('OpenAI API key')).toHaveValue('');
  const stored = await page.evaluate(() => JSON.stringify({ local: localStorage.getItem.length ? Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])) : {}, session: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])) }));
  expect(stored).not.toContain(marker);
  expect(await region.innerText()).not.toContain(marker);
  await shot(page, '08-admin-dummy-cleared');
});

test('chrome zoom measurement at the desktop shell', async () => {
  const dir = '/tmp/ekas-rc1-zoom-profile';
  mkdirSync(`${dir}/Default`, { recursive: true });
  writeFileSync(`${dir}/Default/Preferences`, JSON.stringify({ partition: { default_zoom_level: { x: Math.log(2) / Math.log(1.2) } } }));
  const context = await chromium.launchPersistentContext(dir, {
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
  });
  const page = context.pages()[0] || await context.newPage();
  await page.goto('http://127.0.0.1:18192/');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  for (let i = 0; i < 4; i += 1) await page.keyboard.press('Control+Equal');
  const before = await page.evaluate(() => ({ visualViewport: window.visualViewport?.scale ?? null, devicePixelRatio: window.devicePixelRatio }));
  let pageScale: string | null = null;
  try {
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
    pageScale = 'set';
  } catch (error) {
    pageScale = error instanceof Error ? error.message : String(error);
  }
  const after = await page.evaluate(() => ({ visualViewport: window.visualViewport?.scale ?? null, devicePixelRatio: window.devicePixelRatio, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
  writeFileSync('/workspace/docs/wp6/zoom-measurement.json', JSON.stringify({ before, pageScale, after }, null, 2));
  await page.screenshot({ path: `${shots}/09-zoom-attempt.png`, fullPage: false });
  await context.close();
});

test.afterAll(() => {
  writeFileSync('/workspace/docs/wp6/browser-observations.json', JSON.stringify(observations, null, 2));
});
