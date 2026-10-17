import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 45_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: '/tmp/ekas-playwright',
  use: {
    baseURL: 'http://127.0.0.1:18191',
    channel: 'chrome',
    viewport: { width: 1440, height: 900 },
    trace: 'off',
  },
});
