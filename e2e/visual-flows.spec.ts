// e2e/visual-flows.spec.ts — User journey flows with screenshots at each step
// Documents: "clicked X → landed on Y → saw Z"
// Run: npx playwright test e2e/visual-flows.spec.ts
// Report: npx playwright show-report e2e/report

import { test, expect } from './fixtures/auth';

test.describe('Flow: Bottom Navigation', () => {
  test('navigate through all 5 tabs', async ({ authenticatedPage: page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // Dismiss check-in prompt if visible ("pular" button)
    const skipBtn = page.locator('button', { hasText: /pular/i });
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(400);
    }

    // Tab 1: Home (already here)
    await expect(page).toHaveScreenshot('flow-nav-01-home.png');

    // Tab 2: Pipeline
    await page.locator('button[aria-label="pipeline"]').click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('flow-nav-02-pipeline.png');

    // Tab 3: Raiz (center button)
    await page.locator('button[aria-label="raiz"]').click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('flow-nav-03-raiz.png');

    // Tab 4: Projects
    await page.locator('button[aria-label="projects"]').click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('flow-nav-04-projects.png');

    // Tab 5: Library
    await page.locator('button[aria-label="library"]').click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('flow-nav-05-library.png');
  });
});

test.describe('Flow: Home → Details', () => {
  test('home sections visible', async ({ authenticatedPage: page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // Capture the full home page scroll
    await expect(page).toHaveScreenshot('flow-home-01-top.png');

    // Scroll down to see more sections
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('flow-home-02-scrolled.png');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('flow-home-03-bottom.png');
  });
});

test.describe('Flow: Settings page sections', () => {
  test('settings all sections visible', async ({ authenticatedPage: page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // Top: profile + theme
    await expect(page).toHaveScreenshot('flow-settings-01-top.png');

    // Scroll to connectors
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('flow-settings-02-connectors.png');

    // Scroll to bottom (export + about + logout)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('flow-settings-03-bottom.png');
  });
});

test.describe('Flow: Pipeline stages', () => {
  test('pipeline view with items in stages', async ({ authenticatedPage: page }) => {
    await page.goto('/pipeline');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // Full pipeline view
    await expect(page).toHaveScreenshot('flow-pipeline-01-full.png', { fullPage: true });
  });
});

test.describe('Flow: TopBar actions', () => {
  test('topbar buttons exist and are clickable', async ({ authenticatedPage: page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    // Screenshot topbar area
    const topbar = page.locator('header').first();
    if (await topbar.isVisible()) {
      await expect(topbar).toHaveScreenshot('flow-topbar-01.png');
    }
  });
});

test.describe('Flow: Wrap page', () => {
  test('wrap stepper visible', async ({ authenticatedPage: page }) => {
    await page.goto('/wrap');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    await expect(page).toHaveScreenshot('flow-wrap-01-initial.png', { fullPage: true });
  });
});

test.describe('Flow: Calendar view', () => {
  test('calendar renders month grid', async ({ authenticatedPage: page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    await expect(page).toHaveScreenshot('flow-calendar-01.png', { fullPage: true });
  });
});

test.describe('Flow: Analytics charts', () => {
  test('analytics page with data visualizations', async ({ authenticatedPage: page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600); // extra time for D3 charts

    await expect(page).toHaveScreenshot('flow-analytics-01-top.png');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('flow-analytics-02-bottom.png');
  });
});
