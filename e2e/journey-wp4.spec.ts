import { expect, test, type Page } from '@playwright/test';

const shots = 'docs/wp4/screenshots';

const journeys = [
  { id: 'downtime', prompt: 'We missed our production goal.', asset: 'FEED-03', loss: /feeder-jam|unit loss/i },
  { id: 'speed', prompt: 'Investigate speed.', asset: 'PRESS-S1', loss: /speed-loss minutes/i },
  { id: 'quality', prompt: 'Investigate quality.', asset: 'FORM-Q1', loss: /quality-loss minutes/i },
] as const;

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

async function settledLabel(button: ReturnType<Page['locator']>, previous = '') {
  let current = '';
  await expect.poll(async () => {
    current = (await button.innerText()).trim();
    return !await button.isDisabled() && current !== previous ? current : '';
  }, { timeout: 20000 }).not.toBe('');
  return current;
}

async function advanceUntilReopen(page: Page, id: string) {
  const summary = page.getByRole('region', { name: 'Investigation summary' });
  const button = summary.locator('[data-next-cta]');
  const labels: string[] = [];
  for (let step = 0; step < 24; step += 1) {
    const label = await settledLabel(button, labels.at(-1) || '');
    if (labels.at(-1) === label) throw new Error(`${id} repeated “${label}” before the case changed`);
    labels.push(label);
    expect(label, id).not.toMatch(/SAFETY-01|-H1|investigation-v1|snapshot|(?:^|\s)Open the /i);
    if (label === 'Record this hypothesis') {
      await expect(summary).toContainText(/Hypothesis:/);
      await expect(summary).toContainText(/What would test it:/);
      if (id === 'downtime') await expect(summary).toContainText(/Guide wear/);
      if (id === 'speed') await expect(summary).toContainText(/Pressure recovery/);
      if (id === 'quality') await expect(summary).toContainText(/Tool edge|burr/i);
    }
    if (label === 'Recommend this action') {
      await expect(summary).toContainText(/Recommended action:/);
      await expect(summary).toContainText(/not an engineering change/i);
    }
    if (label === 'Record performed work') await expect(summary).toContainText(/Work performed:/);
    if (label === 'Review safety') {
      await expect(summary).toContainText('Status: Measurement recorded');
      await expect(summary).toContainText('Complete safety review');
      await expect(summary).toContainText(/Observed result:/);
      await expect(summary).not.toContainText('Status: Safety review required');
    }
    if (label === 'Review verification result') await expect(summary).toContainText('Status: Verification ready for acceptance');
    if (label === 'Record sustainment') await expect(summary).toContainText(/Sustain check/);
    if (label === 'Reopen the investigation') await expect(summary).toContainText(/Recurrence/);
    const alert = page.getByRole('alert');
    if (await alert.count()) throw new Error(`${id} at “${label}”: ${await alert.first().innerText()}`);
    if (id === 'downtime' && label === 'Review safety') {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.evaluate(() => {
        const main = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
        if (main) main.scrollTop = 0;
      });
      await page.screenshot({ path: `${shots}/downtime-320-review-safety.png`, fullPage: false });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    await page.screenshot({ path: `${shots}/${id}-${String(step).padStart(2, '0')}-${slug(label)}.png`, fullPage: false });
    await button.evaluate((el: HTMLButtonElement) => el.click());
    if (label === 'Reopen the investigation') {
      await settledLabel(button, label);
      await expect(summary).toContainText('Status: No owner requested');
      await expect(summary).toContainText('Previous cycle: Completed / historical');
      await expect(summary).toContainText(/New cycle: Cycle 2/);
      await expect(button).toHaveText('Request an owner');
      await page.screenshot({ path: `${shots}/${id}-reopened.png`, fullPage: false });
      return labels;
    }
  }
  throw new Error(`${id} did not reopen: ${labels.join(' | ')}`);
}

for (const journey of journeys) {
  test(`plant leader completes the ${journey.id} journey from the visible next step`, async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/');
    await page.getByRole('button', { name: journey.prompt }).click();
    const answer = page.locator('article.ekas-captured-reply').last();
    await expect(answer).toContainText(/below the approved plan/i);
    await expect(answer).toContainText(journey.loss);
    if (journey.id !== 'downtime') await expect(answer).toContainText(/is the contributor/);
    await page.screenshot({ path: `${shots}/${journey.id}-goal.png`, fullPage: false });

    await page.getByRole('button', { name: 'Evidence and investigation' }).click();
    const evidence = page.getByRole('dialog', { name: 'Captured evidence and investigation' });
    await expect(evidence).toContainText('What this evidence says');
    await page.screenshot({ path: `${shots}/${journey.id}-evidence.png`, fullPage: false });
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Dashboards', exact: true }).click();
    const dashboard = page.getByRole('region', { name: 'Plant dashboard' });
    await expect(page.getByRole('region', { name: 'Current investigation context' })).toContainText(journey.asset);
    await expect(dashboard).toContainText(journey.id === 'downtime' ? 'Northworks' : 'Synthetic Works');
    await expect(dashboard).toContainText('What is happening');
    await expect(dashboard).toContainText('Where is the loss');
    await expect(dashboard).toContainText('What to investigate');
    await expect(page.locator('main')).not.toContainText('Explicit synthetic metric demonstration');
    await expect(page.locator('main')).not.toContainText('training-positive');
    await expect(page.locator('main')).not.toContainText('ekas.oee');
    await expect(page.locator('main')).not.toContainText('No chart was published');
    await page.screenshot({ path: `${shots}/${journey.id}-dashboard.png`, fullPage: false });

    await page.getByRole('button', { name: 'Investigations', exact: true }).click();
    const summary = page.getByRole('region', { name: 'Investigation summary' });
    await expect(summary).toContainText('Next: Request an owner');
    if (journey.id === 'downtime') {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.evaluate(() => {
        const main = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
        if (main) main.scrollTop = 0;
      });
      await expect(summary.locator('.ekas-case-title')).toBeVisible();
      await expect(summary.locator('[data-next-cta]')).toBeVisible();
      await expect(page.getByLabel('Investigation section', { exact: true })).toBeVisible();
      await expect(summary.getByRole('tab')).toHaveCount(0);
      const send = await page.getByRole('button', { name: 'Send' }).boundingBox();
      expect(send!.x + send!.width).toBeLessThanOrEqual(322);
      await page.screenshot({ path: `${shots}/downtime-320-request-owner.png`, fullPage: false });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    const labels = await advanceUntilReopen(page, journey.id);
    expect(labels).toEqual(expect.arrayContaining(['Request an owner', 'Accept ownership', 'Record this hypothesis', 'Recommend this action', 'Authorize the action', 'Check the completed repair', 'Record performed work', 'Check results after two weeks', 'Review safety', 'Review verification result', 'Record sustainment', 'Reopen the investigation']));
    expect(labels.join(' ')).not.toMatch(/(?:^|\s)Open the |snapshot/i);
    if (journey.id === 'downtime') {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.evaluate(() => {
        const main = document.querySelector<HTMLElement>('[aria-label="Workspace content"]');
        if (main) main.scrollTop = 0;
      });
      await expect(summary).toContainText('No owner requested');
      await expect(summary.locator('.ekas-case-title')).toBeVisible();
      await page.screenshot({ path: `${shots}/downtime-320-reopened.png`, fullPage: false });
    }
  });
}

test('a plant leader can drive the downtime journey in ordinary language', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('/');
  const turns: { ask: string; expect: RegExp | string; file: string }[] = [
    { ask: 'What happened?', expect: /feeder-jam|plan miss|below/i, file: 'chat-01-what-happened' },
    { ask: 'What evidence do we have?', expect: /evidence|standard work|PFMEA/i, file: 'chat-02-evidence' },
    { ask: 'What are the possible causes?', expect: /Guide wear/, file: 'chat-03-causes' },
    { ask: 'How would we test that?', expect: /What would test it/i, file: 'chat-04-test' },
    { ask: 'Record that hypothesis.', expect: /Guide wear/, file: 'chat-05-record-hypothesis' },
    { ask: 'What should we do?', expect: /hypothesis|owner|standard/i, file: 'chat-06-what-next' },
    { ask: 'Who should own this?', expect: /maintenance/i, file: 'chat-07-who-owns' },
    { ask: 'Assign it to maintenance.', expect: /requested|acceptance is still pending/i, file: 'chat-08-assign' },
    { ask: 'Did they accept it?', expect: /not yet been accepted/i, file: 'chat-09-not-accepted' },
    { ask: 'Record their acceptance.', expect: /acceptance is recorded/i, file: 'chat-10-accepted' },
    { ask: 'Recommend this action.', expect: /guide restoration|standard work/i, file: 'chat-11-recommend' },
    { ask: 'Request approval.', expect: /Authorization has been requested/i, file: 'chat-12-request-approval' },
    { ask: 'Was it approved?', expect: /requested/i, file: 'chat-13-not-approved-yet' },
    { ask: 'Approve the action.', expect: /authorized/i, file: 'chat-14-approved' },
    { ask: 'Check the completed repair.', expect: /follow-up period/i, file: 'chat-15-completed-repair' },
    { ask: 'What work was done?', expect: /not recorded as approved or performed|action is authorized/i, file: 'chat-16-work-not-yet' },
    { ask: 'Record the performed work.', expect: /Work performed/i, file: 'chat-17-work-recorded' },
    { ask: 'Check results after two weeks.', expect: /follow-up period/i, file: 'chat-18-two-weeks' },
    { ask: 'Did it work?', expect: /safety review is complete|Causality is not isolated/i, file: 'chat-19-did-it-work' },
    { ask: 'Did we pass the safety check?', expect: /pending|safety/i, file: 'chat-20-safety-pending' },
    { ask: 'Review safety.', expect: /safety review is recorded/i, file: 'chat-21-safety-reviewed' },
    { ask: 'Review the verification result.', expect: /accepted/i, file: 'chat-22-result-accepted' },
    { ask: 'Check whether the result held.', expect: /follow-up period/i, file: 'chat-23-held-window' },
    { ask: 'Record the sustainment.', expect: /sustain/i, file: 'chat-24-sustain-recorded' },
    { ask: 'Did it hold?', expect: /sustain/i, file: 'chat-25-did-it-hold' },
    { ask: 'Check the later shifts.', expect: /follow-up period/i, file: 'chat-26-later-shifts' },
    { ask: 'Record the sustainment.', expect: /sustain/i, file: 'chat-27-recurrence-recorded' },
    { ask: 'Why did it reopen?', expect: /recur/i, file: 'chat-28-why-reopen' },
    { ask: 'Reopen the investigation.', expect: /next investigation cycle/i, file: 'chat-29-reopened' },
  ];
  await page.getByRole('button', { name: 'We missed our production goal.' }).click();
  await expect(page.locator('article.ekas-captured-reply').last()).toContainText(/below the approved plan/i);
  for (const [index, turn] of turns.entries()) {
    const box = page.getByLabel('Ask EKAS');
    await expect(page.getByRole('button', { name: 'Send' })).toBeEnabled();
    await box.fill(turn.ask);
    await page.getByRole('button', { name: 'Send' }).click();
    const answer = page.locator('article.ekas-captured-reply').last();
    await expect(answer, turn.ask).toContainText(turn.expect);
    await page.screenshot({ path: `${shots}/${turn.file}.png`, fullPage: false });
    expect(index).toBeGreaterThanOrEqual(0);
  }
});
