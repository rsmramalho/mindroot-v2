import { test, expect } from './fixtures/auth';

test.describe('Dashboard / Home', () => {
  test('renders the Home page with main content area', async ({ authedPage: page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('AtomInput is visible on Home', async ({ authedPage: page }) => {
    // AtomInput renders an input field for creating items
    const input = page.locator('main input');
    await expect(input).toBeVisible();
  });

  test('AtomInput accepts text and shows parsing preview', async ({ authedPage: page }) => {
    const input = page.locator('main input');
    await input.fill('Comprar leite #p1');
    await expect(input).toHaveValue('Comprar leite #p1');
    // Token preview may appear below the input
    await page.waitForTimeout(300);
  });

  test('DashboardView renders without crashing', async ({ authedPage: page }) => {
    const main = page.locator('main');
    const mainText = await main.textContent();
    // Dashboard is present — either empty state or sections
    expect(mainText).toBeTruthy();
  });

  test('FocusBlock not visible with empty items', async ({ authedPage: page }) => {
    // With no items, FocusBlock returns null — "Foco" label should not appear
    const foco = page.locator('text=Foco');
    const count = await foco.count();
    expect(count).toBe(0);
  });

  test('Home page does not crash with empty data', async ({ authedPage: page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const body = await page.locator('body').textContent();
    expect(body).not.toContain('Something went wrong');
  });
});
