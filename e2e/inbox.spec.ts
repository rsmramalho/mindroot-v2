import { test, expect } from './fixtures/auth';

test.describe('Inbox', () => {
  async function navigateToInbox(page: import('@playwright/test').Page) {
    // Inbox is not in BottomNav — navigate via CommandPalette
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await paletteInput.fill('inbox');
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  }

  test('navigates to Inbox via CommandPalette', async ({ authedPage: page }) => {
    await navigateToInbox(page);
    await expect(page.locator('h2:has-text("Inbox")')).toBeVisible();
  });

  test('shows empty state when no inbox items', async ({ authedPage: page }) => {
    await navigateToInbox(page);
    await expect(page.getByText('Inbox vazio')).toBeVisible();
    await expect(page.getByText('Itens sem módulo aparecem aqui')).toBeVisible();
  });

  test('shows item count as 0', async ({ authedPage: page }) => {
    await navigateToInbox(page);
    // The count span shows the number of inbox items
    const heading = page.locator('h2:has-text("Inbox")');
    await expect(heading).toBeVisible();
    // Count is rendered as a sibling span with font-mono
    await expect(page.locator('.font-mono:has-text("0")')).toBeVisible();
  });

  test('Inbox page has no console errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await navigateToInbox(page);
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });
});
