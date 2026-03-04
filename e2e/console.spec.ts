import { test, expect } from './fixtures/auth';

test.describe('Console — Zero JS Errors', () => {
  test('Home page has no console errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Already on Home — wait for everything to settle
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('Projetos page has no console errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.getByText('Projetos', { exact: true }).click();
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('Agenda page has no console errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.getByText('Agenda', { exact: true }).click();
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('Ritual page has no console errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.getByText('Ritual', { exact: true }).click();
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('Journal page has no console errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.getByText('Journal', { exact: true }).click();
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('full navigation cycle produces no errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    const tabs = ['Projetos', 'Agenda', 'Ritual', 'Journal', 'Home'] as const;
    for (const tab of tabs) {
      await page.getByText(tab, { exact: true }).click();
      await page.waitForTimeout(500);
    }

    expect(errors).toEqual([]);
  });

  test('CommandPalette open/close produces no errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    expect(errors).toEqual([]);
  });

  test('SettingsDrawer open/close produces no errors', async ({ authedPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.locator('button[title="Ajustes"]').click();
    await page.waitForTimeout(400);
    // Close via X button
    await page.locator('button:has-text("x")').click();
    await page.waitForTimeout(400);

    expect(errors).toEqual([]);
  });

  test('auth page has no console errors', async ({ unauthPage: page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });
});
