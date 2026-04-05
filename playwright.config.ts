import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/results',
  snapshotDir: './e2e/screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'e2e/report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'on',
    trace: 'retain-on-failure',
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  projects: [
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
        isMobile: false,
        hasTouch: false,
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
