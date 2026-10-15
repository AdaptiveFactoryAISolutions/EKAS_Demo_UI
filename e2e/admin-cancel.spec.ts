import { expect, test } from '@playwright/test';

const ready = {
  revision: 0,
  generation: 0,
  settings: { mode: 'openai', model: 'gpt-6.1-sol', maxOutputTokens: 1200, inputByteBound: 60000 },
  enabled: false,
  effectiveMode: 'disabled',
  credential: { configured: false, revision: 0, persistence: 'server-session-only' },
  tested: null,
  budget: { available: false, synthetic: false, ceilingMicroUsd: 20000000, usableMicroUsd: 18000000, remainingMicroUsd: 0, confirmedSpendMicroUsd: null, inFlightMicroUsd: 0, unknownMicroUsd: 0, halted: false },
  readiness: { testAllowed: true, enableAllowed: true, blockedReasons: [] },
  limits: { models: ['gpt-6.1-sol'], maxOutputTokens: 1200, maxInputBytes: 60000, providerRounds: 4 },
  pricing: { reviewedAt: '2026-10-14', expiresAt: '2026-10-16T00:00:00Z' },
  transport: 'Loopback HTTP is not encryption.',
};

test('canceling an uncertain settings save holds Test connection and Enable until status succeeds', async ({ page }) => {
  let statusCalls = 0;
  let releaseStatus!: () => void;
  const held = new Promise<void>(resolve => { releaseStatus = resolve; });
  await page.addInitScript(() => {
    (window as any).__EKAS_APPLICATION__ = { version: 1, mode: 'server-disabled', synthetic: true, conversationId: 'conversation-1', localAdmin: true };
  });
  await page.route('**/api/v1/**', async route => {
    const url = route.request().url();
    const method = route.request().method();
    if (url.endsWith('/api/v1/demo/session')) return route.fulfill({ json: { schemaVersion: 1, synthetic: true, role: 'manager', policyRevision: 'p1' } });
    if (url.endsWith('/api/v1/demo/ai-status')) return route.fulfill({ json: { version: 1, synthetic: true, mode: 'server-disabled', localAdmin: true } });
    if (url.endsWith('/api/v1/admin/owner/session')) return route.fulfill({ json: { authenticated: true, csrf: 'csrf-demo' } });
    if (url.endsWith('/api/v1/admin/ai/settings') && method === 'PUT') {
      await new Promise(resolve => setTimeout(resolve, 4000));
      try { await route.fulfill({ json: ready }); } catch { /* The page already aborted this save. */ }
      return;
    }
    if (url.endsWith('/api/v1/admin/ai') && method === 'GET') {
      statusCalls += 1;
      if (statusCalls > 1) await held;
      return route.fulfill({ json: ready });
    }
    if (url.endsWith('/api/v1/application')) {
      const body = route.request().postDataJSON() as { requestId: string; apiVersion: string };
      return route.fulfill({ status: 404, json: { requestId: body.requestId, apiVersion: body.apiVersion, status: 404, synthetic: true, error: { code: 'NOT_FOUND', message: 'No conversation.', retryable: false } } });
    }
    return route.fulfill({ status: 404, json: { error: 'unmocked' } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Admin AI' }).click();
  await expect(page.getByRole('region', { name: 'Admin AI configuration' })).toBeVisible();
  const testConnection = page.getByRole('button', { name: 'Test connection' });
  const enable = page.getByRole('button', { name: 'Enable AI' });
  await page.getByLabel('Confirm potential test cost').check();
  await expect(testConnection).toBeEnabled();
  await expect(enable).toBeEnabled();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await page.getByRole('button', { name: 'Cancel waiting' }).click();
  await expect(page.getByText('Cancel deferred Save settings; Test connection and Enable remain held until fresh authoritative status succeeds.')).toBeVisible();
  await expect(testConnection).toBeDisabled();
  await expect(enable).toBeDisabled();
  await page.screenshot({ path: 'docs/wp1/screenshots/admin-cancel-held.png', fullPage: true });
  releaseStatus();
  await expect(enable).toBeEnabled();
  await expect(testConnection).toBeEnabled();
  await page.screenshot({ path: 'docs/wp1/screenshots/admin-cancel-released.png', fullPage: true });
});
