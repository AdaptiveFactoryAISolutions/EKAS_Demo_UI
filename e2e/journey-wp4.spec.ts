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
    expect(label, id).not.toMatch(/SAFETY-01|-H1|investigation-v1/);
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
    if (label === 'Open a new cycle') {
      await settledLabel(button, label);
      await expect(summary).toContainText('Status: No owner requested');
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
    await expect(page.getByRole('region', { name: 'Current investigation context' })).toContainText(journey.asset);
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
    expect(labels).toEqual(expect.arrayContaining(['Request an owner', 'Accept ownership', 'Record a hypothesis', 'Authorize the action', 'Record performed work', 'Record verification', 'Review safety', 'Accept the measured result', 'Record sustainment', 'Open a new cycle']));
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
