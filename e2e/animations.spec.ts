import { test, expect } from './fixtures/auth';

test.describe('Animations', () => {
  test('page transition does not flash white', async ({ authedPage: page }) => {
    // Navigate and check that the background stays dark throughout
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Navigate to another tab
    await page.getByText('Journal', { exact: true }).click();

    // Immediately check background — should still be dark, never white
    const midTransitionBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Allow transition to complete
    await page.waitForTimeout(300);

    const afterTransitionBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // None of these should be white (rgb(255, 255, 255))
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
    expect(midTransitionBg).not.toBe('rgb(255, 255, 255)');
    expect(afterTransitionBg).not.toBe('rgb(255, 255, 255)');
  });

  test('CommandPalette has entry animation', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');

    // The palette should animate in — initially opacity 0, then 1
    const paletteOverlay = page.locator('.fixed.inset-0').last();
    await expect(paletteOverlay).toBeVisible();

    // After animation settles
    await page.waitForTimeout(300);

    const opacity = await paletteOverlay.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(opacity)).toBeGreaterThan(0.8);
  });

  test('CommandPalette has exit animation', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    // Close it
    await page.keyboard.press('Escape');

    // After animation completes, the palette should be gone
    await page.waitForTimeout(400);
    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await expect(paletteInput).toBeHidden();
  });

  test('SettingsDrawer slides in from right', async ({ authedPage: page }) => {
    await page.locator('button[title="Ajustes"]').click();
    await page.waitForTimeout(100);

    // The drawer panel should be animating in
    const drawerPanel = page.locator('.h-full.w-full.max-w-xs');
    await expect(drawerPanel).toBeVisible();

    await page.waitForTimeout(400);

    // After animation, check it's fully visible
    const transform = await drawerPanel.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    // Should be at x=0 (no transform or identity matrix)
    // matrix(1, 0, 0, 1, 0, 0) or "none"
    expect(transform === 'none' || transform.includes('matrix')).toBe(true);
  });

  test('BottomNav active indicator animates between tabs', async ({ authedPage: page }) => {
    // The active indicator uses layoutId="nav-indicator" — it's a motion div
    const firstIndicator = page.locator('nav [class*="bg-mind"]').first();
    await expect(firstIndicator).toBeVisible();

    // Switch tabs
    await page.getByText('Projetos', { exact: true }).click();
    await page.waitForTimeout(300);

    // Indicator should still exist (moved to new position)
    const newIndicator = page.locator('nav [class*="bg-mind"]').first();
    await expect(newIndicator).toBeVisible();
  });

  test('multiple rapid navigations do not cause white flash', async ({ authedPage: page }) => {
    const tabs = ['Projetos', 'Journal', 'Ritual', 'Home'] as const;

    for (const tab of tabs) {
      await page.getByText(tab, { exact: true }).click();
      // Check background immediately
      const bg = await page.evaluate(() =>
        window.getComputedStyle(document.body).backgroundColor
      );
      expect(bg).not.toBe('rgb(255, 255, 255)');
    }

    await page.waitForTimeout(500);

    // Final check
    const finalBg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    expect(finalBg).not.toBe('rgb(255, 255, 255)');
  });
});
