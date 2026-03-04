import { test, expect } from './fixtures/auth';

test.describe('SettingsDrawer', () => {
  test('opens when clicking settings button in TopBar', async ({ authedPage: page }) => {
    // TopBar has a settings button with the ≡ icon
    const settingsBtn = page.locator('button[title="Ajustes"]');
    await expect(settingsBtn).toBeVisible();

    await settingsBtn.click();
    await page.waitForTimeout(400);

    // SettingsDrawer should be visible (it's a fixed overlay)
    const drawer = page.locator('.fixed.inset-0').last();
    await expect(drawer).toBeVisible();
  });

  test('shows user email in settings', async ({ authedPage: page }) => {
    const settingsBtn = page.locator('button[title="Ajustes"]');
    await settingsBtn.click();
    await page.waitForTimeout(400);

    // User email from mock: e2e@mindroot.test
    await expect(page.getByText('e2e@mindroot.test')).toBeVisible();
  });

  test('shows sign out button', async ({ authedPage: page }) => {
    const settingsBtn = page.locator('button[title="Ajustes"]');
    await settingsBtn.click();
    await page.waitForTimeout(400);

    // "Sair" button should be visible
    const signOutBtn = page.getByText('Sair');
    await expect(signOutBtn).toBeVisible();
  });

  test('closes when clicking outside (backdrop)', async ({ authedPage: page }) => {
    const settingsBtn = page.locator('button[title="Ajustes"]');
    await settingsBtn.click();
    await page.waitForTimeout(400);

    // Click on the backdrop area
    const backdrop = page.locator('.fixed.inset-0').last();
    await backdrop.click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(400);

    // Drawer content should no longer be visible
    // (The overlay should animate out)
    await expect(page.getByText('e2e@mindroot.test')).toBeHidden();
  });

  test('shows Analytics link', async ({ authedPage: page }) => {
    const settingsBtn = page.locator('button[title="Ajustes"]');
    await settingsBtn.click();
    await page.waitForTimeout(400);

    // Analytics button/link
    const analyticsBtn = page.getByText('Analytics');
    await expect(analyticsBtn).toBeVisible();
  });
});
