import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '/workspace/docs/wp6',
  testMatch: 'rc1-browser.spec.ts',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: '/tmp/ekas-playwright-wp6',
  use: {
    baseURL: 'http://127.0.0.1:18192',
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
    trace: 'off',
  },
});
