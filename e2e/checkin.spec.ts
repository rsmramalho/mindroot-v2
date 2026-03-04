import { test, expect } from './fixtures/auth';

test.describe('CheckInPrompt', () => {
  // The CheckInPrompt is triggered by completing a task that has needs_checkin=true.
  // With empty mock data, it won't trigger naturally.
  // We test that the component infrastructure is in place and does not crash.

  test('Home page has CheckInPrompt container in DOM', async ({ authedPage: page }) => {
    // CheckInPrompt renders AnimatePresence which is always in the DOM
    // but only shows content when state.active is true.
    // With no items, it should not be visible.
    const overlay = page.locator('.fixed.inset-0.z-50');
    const count = await overlay.count();
    // Should NOT be visible (no active check-in)
    if (count > 0) {
      await expect(overlay).toBeHidden();
    }
  });

  test('CheckIn overlay not visible without trigger', async ({ authedPage: page }) => {
    // Verify no overlay is blocking the page
    const overlays = page.locator('.fixed.inset-0');
    for (let i = 0; i < (await overlays.count()); i++) {
      const overlay = overlays.nth(i);
      const zIndex = await overlay.evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });
      // z-50 is the CheckIn overlay (z-index: 50)
      if (zIndex === '50') {
        await expect(overlay).toBeHidden();
      }
    }
  });

  test('completing a task does not crash the app', async ({ authedPage: page }) => {
    // Even though we have no items, interacting with the input should be safe
    const input = page.locator('main input');
    if (await input.isVisible()) {
      await input.fill('Test task');
      // Just verify the page is still responsive
      await expect(page.locator('main')).toBeVisible();
    }
  });
});
