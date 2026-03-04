import { test, expect } from './fixtures/auth';

test.describe('CommandPalette', () => {
  test('opens with Ctrl+K', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    // Palette overlay should be visible
    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await expect(paletteInput).toBeVisible();
  });

  test('closes with Escape', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await expect(paletteInput).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await expect(paletteInput).toBeHidden();
  });

  test('closes when clicking backdrop', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    // Click on the backdrop (outer overlay)
    const backdrop = page.locator('.fixed.inset-0').last();
    await backdrop.click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(300);

    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await expect(paletteInput).toBeHidden();
  });

  test('shows navigation commands by default', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    // "Navegação" category label should be visible
    await expect(page.getByText('Navegação')).toBeVisible();

    // Nav items should be listed (scoped to palette to avoid BottomNav duplicates)
    const palette = page.locator('.max-w-md');
    await expect(palette.locator('button:has-text("Início")')).toBeVisible();
    await expect(palette.locator('button:has-text("Projetos")')).toBeVisible();
    await expect(palette.locator('button:has-text("Inbox")')).toBeVisible();
  });

  test('filters commands by search query', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await paletteInput.fill('ritual');
    await page.waitForTimeout(200);

    // Should show Ritual navigation command (scoped to palette)
    const palette = page.locator('.max-w-md');
    await expect(palette.locator('button:has-text("Ritual")')).toBeVisible();
    // Should NOT show unrelated commands in the palette
    await expect(palette.locator('button:has-text("Projetos")')).toBeHidden();
  });

  test('shows "Nenhum resultado" for no match', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await paletteInput.fill('xyznonexistent');
    await page.waitForTimeout(200);

    await expect(page.getByText('Nenhum resultado')).toBeVisible();
  });

  test('navigates to a page via Enter key', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await paletteInput.fill('inbox');
    await page.waitForTimeout(200);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);

    // Palette should close
    await expect(paletteInput).toBeHidden();

    // Should now be on Inbox page
    await expect(page.locator('h2:has-text("Inbox")')).toBeVisible();
  });

  test('supports arrow key navigation', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    // First item is selected by default (Início)
    // Press down to go to second item
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);

    // Press Enter to select
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);

    // Palette should have closed after selection
    const paletteInput = page.locator('input[placeholder="Buscar..."]');
    await expect(paletteInput).toBeHidden();
  });

  test('shows footer with keyboard hints', async ({ authedPage: page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);

    await expect(page.getByText('↑↓ navegar')).toBeVisible();
    await expect(page.getByText('↵ selecionar')).toBeVisible();
  });

  test('toggles open/closed with repeated Ctrl+K', async ({ authedPage: page }) => {
    // Open
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    await expect(page.locator('input[placeholder="Buscar..."]')).toBeVisible();

    // Close by pressing Ctrl+K again
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    await expect(page.locator('input[placeholder="Buscar..."]')).toBeHidden();
  });
});
