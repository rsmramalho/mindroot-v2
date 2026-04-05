// e2e/visual-pages.spec.ts — Screenshot every page
// Run: npx playwright test e2e/visual-pages.spec.ts
// Report: npx playwright show-report e2e/report
//
// First run creates baseline screenshots.
// Subsequent runs compare pixel-by-pixel and FAIL on visual diff.
// To update baselines: npx playwright test --update-snapshots

import { test, expect } from './fixtures/auth';

// ─── Landing (pre-auth) ─────────────────────────────────

test.describe('Pre-Auth Pages', () => {
  test('Landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('landing-hero.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });

  test('Auth page', async ({ page }) => {
    // Click login to get to auth page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loginButton = page.locator('button', { hasText: /entrar|login|comecar/i }).first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForTimeout(500);
    }
    await expect(page).toHaveScreenshot('auth-page.png', { maxDiffPixelRatio: 0.01 });
  });
});

// ─── Authenticated pages ─────────────────────────────────

const AUTHENTICATED_PAGES = [
  { path: '/home', name: 'home', waitFor: 'networkidle' as const },
  { path: '/pipeline', name: 'pipeline', waitFor: 'networkidle' as const },
  { path: '/wrap', name: 'wrap', waitFor: 'networkidle' as const },
  { path: '/projects', name: 'projects', waitFor: 'networkidle' as const },
  { path: '/calendar', name: 'calendar', waitFor: 'networkidle' as const },
  { path: '/raiz', name: 'raiz', waitFor: 'networkidle' as const },
  { path: '/analytics', name: 'analytics', waitFor: 'networkidle' as const },
  { path: '/library', name: 'library', waitFor: 'networkidle' as const },
  { path: '/graph', name: 'graph', waitFor: 'networkidle' as const },
  { path: '/search', name: 'search', waitFor: 'networkidle' as const },
  { path: '/settings', name: 'settings', waitFor: 'networkidle' as const },
] as const;

test.describe('Authenticated Pages — Full Screenshot', () => {
  for (const pg of AUTHENTICATED_PAGES) {
    test(`${pg.name} page`, async ({ authenticatedPage: page }) => {
      await page.goto(pg.path);
      await page.waitForLoadState(pg.waitFor);
      // Wait for animations to settle
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot(`page-${pg.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
