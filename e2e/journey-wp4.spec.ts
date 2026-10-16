import { expect, test, type Page } from '@playwright/test';

const shots = 'docs/wp4/screenshots';

const journeys = [
  { id: 'downtime', prompt: 'We missed our production goal.', asset: 'FEED-03', loss: /feeder-jam|unit loss/i, hypothesis: /Guide wear/, prove: /standard work/i, endpoint: /Feeder-jam time improved from 60 to 30 minutes per eligible shift/, work: /guide restoration/i },
  { id: 'speed', prompt: 'Investigate speed.', asset: 'PRESS-S1', loss: /speed-loss minutes/i, hypothesis: /Pressure recovery/, prove: /released setup|pressure/i, endpoint: /Speed-loss time improved from 90 to 30 minutes per eligible shift/, work: /pressure-recovery|released setting/i },
  { id: 'quality', prompt: 'Investigate quality.', asset: 'FORM-Q1', loss: /quality-loss minutes/i, hypothesis: /Tool edge|burr/i, prove: /0\.10 mm/, endpoint: /First-pass yield improved from/, work: /worn tool|first piece/i },
] as const;

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

async function shot(page: Page, file: string) {
  await page.screenshot({ path: `${shots}/${file}.png`, fullPage: false });
}

async function goArea(page: Page, name: string) {
  const nav = page.getByRole('complementary', { name: 'Template sidebar navigation' });
  const button = nav.getByRole('button', { name, exact: true });
  if (!(await button.isVisible())) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(button).toBeVisible();
  }
  await button.click();
}

async function settledLabel(button: ReturnType<Page['locator']>, previous = '') {
  let current = '';
  await expect.poll(async () => {
    current = (await button.innerText()).trim();
    return !await button.isDisabled() && current !== previous ? current : '';
  }, { timeout: 20000 }).not.toBe('');
  return current;
}

async function headingGap(page: Page) {
  return page.evaluate(() => {
    const bar = document.querySelector('[aria-label="Current investigation context"]');
    const heading = document.querySelector('[aria-label="Investigation summary"] > h1');
    if (!bar || !heading) return -1;
    return heading.getBoundingClientRect().top - bar.getBoundingClientRect().bottom;
  });
}

async function contentBeforeButton(page: Page, summary: ReturnType<Page['locator']>) {
  const button = summary.locator('[data-next-cta]');
  const record = summary.locator('.ekas-journey-record');
  if (!await record.count()) return;
  const buttonBox = await button.boundingBox();
  const recordBox = await record.boundingBox();
  expect(buttonBox, 'action button').toBeTruthy();
  expect(recordBox, 'step record').toBeTruthy();
  expect(recordBox!.y + Math.min(recordBox!.height, 8)).toBeLessThanOrEqual(buttonBox!.y + 1);
}

async function narrowStep(page: Page, summary: ReturnType<Page['locator']>) {
  const main = page.locator('[aria-label="Workspace content"]');
  await main.evaluate(el => { el.scrollTop = 0; });
  const overflow = await main.evaluate(el => ({ sw: el.scrollWidth, cw: el.clientWidth }));
  expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1);
  await expect(summary.locator('.ekas-case-title')).toBeVisible();
  await expect(summary.locator('[data-next-action]')).toBeVisible();
  const button = summary.locator('[data-next-cta]');
  await button.evaluate(el => {
    const host = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
    if (!host) return;
    const top = el.getBoundingClientRect().top - host.getBoundingClientRect().top + host.scrollTop;
    host.scrollTop = Math.max(0, top - 120);
  });
  await expect(button).toBeEnabled();
  const viewport = page.viewportSize()!;
  const buttonBox = await button.boundingBox();
  expect(buttonBox).toBeTruthy();
  expect(buttonBox!.x).toBeGreaterThanOrEqual(-1);
  expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(buttonBox!.y).toBeGreaterThanOrEqual(0);
  expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(viewport.height + 1);
  const field = page.getByLabel('Ask EKAS');
  await field.evaluate(el => {
    const host = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
    if (!host) return;
    const top = el.getBoundingClientRect().top - host.getBoundingClientRect().top + host.scrollTop;
    host.scrollTop = Math.max(0, top - 24);
  });
  const fieldBox = await field.boundingBox();
  const sendBox = await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).boundingBox();
  expect(fieldBox).toBeTruthy();
  expect(sendBox).toBeTruthy();
  expect(fieldBox!.width).toBeGreaterThan(140);
  expect(fieldBox!.x).toBeGreaterThanOrEqual(-1);
  expect(fieldBox!.x + fieldBox!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(sendBox!.x + sendBox!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(fieldBox!.y).toBeGreaterThanOrEqual(0);
  expect(sendBox!.y + sendBox!.height).toBeLessThanOrEqual(viewport.height + 1);
  const top = await main.evaluate(el => {
    el.scrollTop = 0;
    const button = document.querySelector('[data-next-cta]');
    if (!button) return false;
    const box = button.getBoundingClientRect();
    return box.top >= 0 && box.bottom <= window.innerHeight + 1;
  });
  return top;
}

async function advanceUntilReopen(page: Page, id: string, narrow = false) {
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  const button = summary.locator('[data-next-cta]');
  const labels: string[] = [];
  let sustainCount = 0;
  const files = new Set<string>();
  for (let step = 0; step < 24; step += 1) {
    const label = await settledLabel(button, labels.at(-1) || '');
    if (labels.at(-1) === label) throw new Error(`${id} repeated “${label}” before the case changed`);
    labels.push(label);
    expect(label, id).not.toMatch(/SAFETY-01|-H1|investigation-v1|snapshot|(?:^|\s)Open the /i);
    await expect(summary).not.toContainText('authored acceptance');
    await expect(summary).not.toContainText('Fictional maintenance technician');
    await expect(summary.locator('.ekas-invest-head')).not.toContainText(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    if (label === 'Request an owner') {
      await expect(summary).toContainText('Status: No owner requested');
      await expect(summary).toContainText('Owner: Not assigned');
      await expect(summary).toContainText('Next: Request an owner');
      await expect(summary).not.toContainText('Owner accepted');
    }
    if (label === 'Record this hypothesis') {
      await expect(summary).toContainText('Status: No owner requested');
      await expect(summary).toContainText('Owner: Not assigned');
      await expect(summary).not.toContainText('Owner accepted');
      await expect(summary).not.toContainText('Maintenance accepted');
      await expect(summary).not.toContainText(/Work performed|Observed result|Action authorized/);
      await expect(summary).toContainText(/Hypothesis:/);
      await expect(summary).toContainText(/Why this is plausible:/);
      await expect(summary).toContainText(/What would test it:/);
      if (id === 'downtime') await expect(summary).toContainText(/Guide wear/);
      if (id === 'speed') await expect(summary).toContainText(/Pressure recovery/);
      if (id === 'quality') {
        await expect(summary).toContainText(/Tool edge|burr/i);
        await expect(summary).toContainText(/0\.10 mm/);
        await expect(summary).toContainText(/controlled acceptance limit/);
        await expect(summary).toContainText('a final disposition was recorded for the part');
        await expect(summary).toContainText('final good output and first-pass yield are different measures');
        await expect(summary).not.toContainText('QUALITY-NOTE-01');
        await expect(summary).not.toContainText('unique terminal disposition');
        await expect(summary).not.toContainText('not FPY');
      }
    }
    if (label === 'Recommend this action') {
      await expect(summary).toContainText(/Recommended action:/);
      await expect(summary).toContainText(/not an engineering change/i);
    }
    if (label === 'Record performed work') await expect(summary).toContainText(/Work performed:/);
    if (label === 'Review safety') {
      await expect(summary).toContainText('Status: Measurement recorded');
      await expect(summary).toContainText('Safety: Pending review');
      await expect(summary).toContainText('Complete safety review');
      await expect(summary).toContainText(/Observed result:/);
      await expect(summary).toContainText(/Baseline was .+(?:minutes per eligible shift|%)/);
      await expect(summary).toContainText('Guardrail results');
      await expect(summary).toContainText('Main measure:');
      await expect(summary).toContainText('Quality:');
      await expect(summary).toContainText('Energy:');
      const visible = summary.locator('.ekas-invest-head');
      await expect(visible).not.toContainText('Primary endpoint');
      await expect(visible).not.toContainText(/\bPASS\b|\bPENDING\b|\bFAIL\b/);
      await expect(summary).not.toContainText('Status: Safety review required');
      await expect(page.locator('[data-case-state]').first()).not.toContainText('Safety review required');
      await expect(summary).not.toContainText(/\.00\b/);
    }
    if (label === 'Review verification result') await expect(summary).toContainText('Status: Verification ready for acceptance');
    if (label === 'Record sustainment') await expect(summary).toContainText(/Sustain check/);
    if (label === 'Reopen the investigation') {
      await expect(summary).toContainText('Cycle 1: Completed / historical');
      await expect(summary).toContainText('Cycle 2: Open after recurrence');
      await expect(summary).toContainText(/Reason: Reopen if /);
      await expect(summary).toContainText(id === 'quality' ? 'Reopen if first-pass yield falls below 92% for two consecutive eligible shifts.' : 'minutes per eligible shift');
      if (id === 'quality') await expect(summary).toContainText('Latest eligible shifts: 89% and 88%.');
      await expect(summary.locator('.ekas-invest-head')).not.toContainText(/\d\s+%/);
    }
    await expect(summary.locator('.ekas-invest-head')).not.toContainText(/\bUTC\b|\bEC-003\b|Primary endpoint|unique terminal disposition/);
    const overview = await summary.innerText();
    expect(overview.match(/units below plan/g)?.length || 0, `${id} duplicated impact`).toBe(1);
    await contentBeforeButton(page, summary);
    const alert = page.getByRole('alert');
    if (await alert.count()) throw new Error(`${id} at “${label}”: ${await alert.first().innerText()}`);
    const named = label === 'Request an owner' ? '08-owner-request'
      : label === 'Accept ownership' ? '09-owner-acceptance'
      : label === 'Record this hypothesis' ? '06-hypothesis'
      : label === 'Recommend this action' ? '07-action'
      : label === 'Authorize the action' ? '10-authorization'
      : label === 'Record performed work' ? '11-performed-work'
      : label === 'Review safety' ? '12-measurement'
      : label === 'Review verification result' ? '14-verification-decision'
      : label === 'Record sustainment' ? (sustainCount === 0 ? '15-sustain' : '16-recurrence')
      : label === 'Reopen the investigation' ? '17-reopen'
      : '';
    if (label === 'Record sustainment') sustainCount += 1;
    const prefix = narrow ? `${id}-320` : id;
    if (named && !files.has(named)) {
      files.add(named);
      const fits = narrow ? await narrowStep(page, summary) : true;
      if (!narrow) await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
      await shot(page, `${prefix}-${named}`);
      if (narrow && !fits) {
        await summary.locator('[data-next-cta]').evaluate(el => {
          const host = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
          if (!host) return;
          const top = el.getBoundingClientRect().top - host.getBoundingClientRect().top + host.scrollTop;
          host.scrollTop = Math.max(0, top - 120);
        });
        await shot(page, `${prefix}-${named}-action`);
        await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
      }
      if (named === '12-measurement') await shot(page, `${prefix}-13-guardrails`);
    } else if (!named) {
      await shot(page, `${prefix}-step-${slug(label)}`);
    }
    await button.evaluate((el: HTMLButtonElement) => el.click());
    if (label === 'Reopen the investigation') {
      await settledLabel(button, label);
      await expect(summary).toContainText('Status: No owner requested');
      await expect(summary).toContainText('Cycle 1: Completed / historical');
      await expect(summary).toContainText('Cycle 2: Open after recurrence');
      await expect(summary).toContainText(/Reason:/);
      await expect(summary).toContainText('Next: Record this hypothesis');
      await expect(button).toHaveText('Record this hypothesis');
      await expect(summary).toContainText('Owner: Not assigned');
      await expect(summary).not.toContainText('Owner accepted');
      await expect(summary.locator('.ekas-invest-head')).not.toContainText('simulation');
      if (narrow) await narrowStep(page, summary);
      await shot(page, `${prefix}-17-reopen`);
      return labels;
    }
  }
  throw new Error(`${id} did not reopen: ${labels.join(' | ')}`);
}

for (const journey of journeys) {
  test(`plant leader completes the ${journey.id} journey from the visible next step`, async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: journey.prompt }).click();
    const answer = page.locator('article.ekas-captured-reply').last();
    await expect(answer).toContainText(/below the approved plan/i);
    await expect(answer).toContainText(journey.loss);
    expect(await page.evaluate(() => {
      const bar = document.querySelector('[aria-label="Current investigation context"]');
      const heading = document.querySelector('#ekas-chat-main > h1');
      if (!bar || !heading) return -1;
      return heading.getBoundingClientRect().top - bar.getBoundingClientRect().bottom;
    }), `${journey.id} chat heading gap`).toBeGreaterThanOrEqual(16);
    if (journey.id !== 'downtime') await expect(answer).toContainText(/is the contributor/);
    await shot(page, `${journey.id}-01-goal`);
    await shot(page, `${journey.id}-02-gap`);
    await page.getByLabel('Ask EKAS').fill('Where is the loss?');
    await page.locator('form.ekas-composer').getByRole('button', { name: 'Send' }).click();
    await expect(answer).toContainText(/loss|minutes|contributor/i);
    await shot(page, `${journey.id}-03-loss`);
    await shot(page, `${journey.id}-04-contributor`);

    await page.locator('article.ekas-captured-reply').last().getByRole('button', { name: 'Evidence and investigation' }).click();
    const evidence = page.getByRole('dialog', { name: 'Captured evidence and investigation' });
    await expect(evidence).toContainText('What this evidence says');
    await shot(page, `${journey.id}-05-evidence`);
    await page.keyboard.press('Escape');

    await goArea(page, 'Dashboards');
    const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
    await expect(page.getByRole('region', { name: 'Current investigation context' })).toContainText(journey.asset);
    await expect(dashboard).toContainText(journey.id === 'downtime' ? 'Northworks' : 'Synthetic Works');
    await expect(dashboard).toContainText('What is happening');
    await expect(dashboard).toContainText('Where is the loss');
    await expect(dashboard).toContainText('What to investigate');
    const surface = page.locator('#ekas-chat-main');
    await expect(surface).not.toContainText('Explicit synthetic metric demonstration');
    await expect(surface).not.toContainText('training-positive');
    await expect(surface).not.toContainText('ekas.oee');
    await expect(surface).not.toContainText('No chart was published');
    await shot(page, `${journey.id}-dashboard`);

    await goArea(page, 'Investigations');
    const summary = page.getByRole('region', { name: 'Investigation summary' });
    await expect(summary).toContainText('Next: Record this hypothesis');
    await expect(summary).toContainText('Status: No owner requested');
    await expect(summary).not.toContainText('Owner accepted');
    await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
    expect(await headingGap(page), `${journey.id} heading gap`).toBeGreaterThanOrEqual(12);
    const labels = await advanceUntilReopen(page, journey.id);
    expect(labels).toEqual(expect.arrayContaining(['Request an owner', 'Accept ownership', 'Record this hypothesis', 'Recommend this action', 'Authorize the action', 'Check the completed repair', 'Record performed work', 'Check results after two weeks', 'Review safety', 'Review verification result', 'Record sustainment', 'Reopen the investigation']));
    expect(labels.join(' ')).not.toMatch(/(?:^|\s)Open the |snapshot/i);
  });
}

test('the downtime journey stays usable from start to reopen at 320px', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  const answer = page.locator('article.ekas-captured-reply').last();
  await expect(answer).toContainText(/below the approved plan/i);
  await shot(page, 'downtime-320-01-goal');
  await shot(page, 'downtime-320-02-gap');
  const box = page.getByLabel('Ask EKAS');
  const send = page.locator('form.ekas-composer').getByRole('button', { name: 'Send' });
  await box.fill('Where is the loss?');
  await expect(send).toBeEnabled();
  await send.click();
  await expect(answer).toContainText(/loss|feeder-jam|minutes/i);
  await shot(page, 'downtime-320-03-loss');
  await shot(page, 'downtime-320-04-contributor');
  await page.locator('article.ekas-captured-reply').last().getByRole('button', { name: 'Evidence and investigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Captured evidence and investigation' })).toContainText('What this evidence says');
  await shot(page, 'downtime-320-05-evidence');
  await page.keyboard.press('Escape');
  await goArea(page, 'Investigations');
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  await expect(summary).toContainText('Next: Record this hypothesis');
  await page.locator('[aria-label="Workspace content"]').evaluate(el => { el.scrollTop = 0; });
  expect(await headingGap(page), '320 heading gap').toBeGreaterThanOrEqual(1);
  await expect(page.getByLabel('Investigation section', { exact: true })).toBeVisible();
  await expect(summary.getByRole('tab')).toHaveCount(0);
  const labels = await advanceUntilReopen(page, 'downtime', true);
  expect(labels).toContain('Reopen the investigation');
  expect(labels[0]).toBe('Record this hypothesis');
});

for (const journey of journeys) {
  test(`a plant leader can ask ordinary questions through the ${journey.id} journey`, async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const turns: { ask: string; expect: RegExp; file: string; forbid?: RegExp }[] = [
      { ask: journey.prompt, expect: /below the approved plan/i, file: `chat-${journey.id}-open` },
      { ask: 'What happened?', expect: /plan miss|loss|minutes|contributor|units/i, file: `chat-${journey.id}-01-what-happened` },
      { ask: 'Why do you think that?', expect: journey.hypothesis, file: `chat-${journey.id}-02-why` },
      { ask: 'What would prove it?', expect: /What would test it/i, file: `chat-${journey.id}-03-prove` },
      { ask: 'Record that hypothesis.', expect: journey.hypothesis, file: `chat-${journey.id}-record-hypothesis` },
      { ask: 'What are we going to do?', expect: /owner|hypothesis/i, file: `chat-${journey.id}-04-going-to-do` },
      { ask: 'Who owns it?', expect: /Not assigned|No owner has been requested/i, file: `chat-${journey.id}-05-who-owns` },
      { ask: 'Assign it to maintenance.', expect: /requested|acceptance is still pending/i, file: `chat-${journey.id}-assign` },
      { ask: 'Record their acceptance.', expect: /acceptance is recorded/i, file: `chat-${journey.id}-accepted` },
      { ask: 'Who owns it?', expect: /Maintenance has accepted/i, file: `chat-${journey.id}-05-who-owns-accepted` },
      { ask: 'Recommend this action.', expect: journey.work, file: `chat-${journey.id}-recommend` },
      { ask: 'Request approval.', expect: /Authorization has been requested/i, file: `chat-${journey.id}-request-approval` },
      { ask: 'Approve the action.', expect: /authorized/i, file: `chat-${journey.id}-approved` },
      { ask: 'Check the completed repair.', expect: /completed-repair check on Oct 6/i, file: `chat-${journey.id}-completed-repair`, forbid: /\d{4}-\d{2}-\d{2}T/ },
      { ask: 'What work was done?', expect: /authorized|not recorded as approved or performed/i, file: `chat-${journey.id}-06-work-before` },
      { ask: 'Record the performed work.', expect: /Work performed/i, file: `chat-${journey.id}-06-work-done` },
      { ask: 'What work was done?', expect: /Work performed/i, file: `chat-${journey.id}-06-work-done-after` },
      { ask: 'Check results after two weeks.', expect: /follow-up measurement period on Oct 20/i, file: `chat-${journey.id}-two-weeks`, forbid: /\d{4}-\d{2}-\d{2}T|simulation clock|UTC/i },
      { ask: 'Did it work?', expect: journey.endpoint, file: `chat-${journey.id}-07-did-it-work`, forbid: /\.00\b|\d{4}-\d{2}-\d{2}T|\bUTC\b/ },
      { ask: 'What is still blocking acceptance?', expect: /safety review is complete|Safety: pending/i, file: `chat-${journey.id}-08-blocking` },
      { ask: 'Review safety.', expect: /safety review is recorded/i, file: `chat-${journey.id}-safety` },
      { ask: 'Review the verification result.', expect: /accepted/i, file: `chat-${journey.id}-verification` },
      { ask: 'Check whether the result held.', expect: /sustainment check on Oct 27/i, file: `chat-${journey.id}-held-window`, forbid: /\d{4}-\d{2}-\d{2}T/ },
      { ask: 'Record the sustainment.', expect: /sustain/i, file: `chat-${journey.id}-sustain` },
      { ask: 'Did it hold?', expect: /sustain/i, file: `chat-${journey.id}-09-did-it-hold` },
      { ask: 'Check the later shifts.', expect: /later-shift check on Nov 3/i, file: `chat-${journey.id}-later-shifts`, forbid: /\d{4}-\d{2}-\d{2}T/ },
      { ask: 'Record the sustainment.', expect: /sustain/i, file: `chat-${journey.id}-recurrence` },
      { ask: 'Why did it reopen?', expect: /recur/i, file: `chat-${journey.id}-10-why-reopen` },
      { ask: 'Reopen the investigation.', expect: /Cycle 2 is open after recurrence/i, file: `chat-${journey.id}-reopened` },
    ];
    for (const turn of turns) {
      if (turn.ask === journey.prompt) {
        await page.getByRole('button', { name: journey.prompt }).click();
      } else {
        const field = page.getByLabel('Ask EKAS');
        const send = page.locator('form.ekas-composer').getByRole('button', { name: 'Send' });
        await field.fill(turn.ask);
        await expect(send).toBeEnabled();
        await send.click();
      }
      const answer = page.locator('article.ekas-captured-reply').last();
      await expect(answer, turn.ask).toContainText(turn.expect);
      if (turn.forbid) await expect(answer, turn.ask).not.toContainText(turn.forbid);
      await expect(answer, turn.ask).not.toContainText('simulation clock');
      await expect(answer, turn.ask).not.toContainText(/\d+\.00 to \d+\.00/);
      if (journey.id === 'quality' && turn.ask === 'Why do you think that?') {
        await expect(answer).toContainText(/0\.10 mm/);
        await expect(answer).toContainText(/Why this is plausible/i);
        await expect(answer).toContainText('a final disposition was recorded for the part');
        await expect(answer).not.toContainText('unique terminal disposition');
        await expect(answer).not.toContainText('not FPY');
      }
      if (turn.ask === 'Check results after two weeks.') {
        const context = page.getByRole('region', { name: 'Current investigation context' });
        await expect(context).toContainText('Follow-up measurement period');
        await expect(context).toContainText('Oct 20');
        await expect(context).not.toContainText('Oct 6 · Day Shift');
        await expect(page.locator('article.ekas-captured-reply').first()).toContainText('Oct 6');
      }
      if (turn.ask === 'Why did it reopen?') await expect(answer).toContainText(journey.id === 'quality' ? /92%/ : /minutes per eligible shift/);
      if (journey.id === 'quality' && turn.ask === 'What would prove it?') await expect(answer).toContainText(journey.prove);
      if (turn.ask === 'Did it work?') {
        await page.evaluate(() => window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1 })));
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.evaluate(() => {
          const scroller = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
          const replies = document.querySelectorAll('article.ekas-captured-reply');
          const reply = replies[replies.length - 1];
          const context = document.querySelector('.ekas-context');
          if (!scroller || !reply || !context) return;
          scroller.scrollTop += reply.getBoundingClientRect().top - (context.getBoundingClientRect().bottom + 16);
        });
        const question = await answer.locator('.ekas-question').boundingBox();
        expect(question!.y).toBeGreaterThan(40);
        expect(question!.y).toBeLessThan(420);
        await expect(answer).toContainText('Guardrail results');
        await expect(answer).toContainText(/Causality is not isolated|safety review is complete|cannot be accepted/i);
      }
      await shot(page, turn.file);
    }
  });
}
