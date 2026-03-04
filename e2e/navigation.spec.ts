import { test, expect } from './fixtures/auth';

test.describe('Navigation — BottomNav', () => {
  test('renders all 5 nav items', async ({ authedPage: page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    const navButtons = nav.locator('button');
    await expect(navButtons).toHaveCount(5);

    // Check labels
    await expect(page.getByText('Home', { exact: true })).toBeVisible();
    await expect(page.getByText('Projetos', { exact: true })).toBeVisible();
    await expect(page.getByText('Agenda', { exact: true })).toBeVisible();
    await expect(page.getByText('Ritual', { exact: true })).toBeVisible();
    await expect(page.getByText('Journal', { exact: true })).toBeVisible();
  });

  test('Home tab is active by default', async ({ authedPage: page }) => {
    // Home button should have the active color class (text-mind)
    const homeBtn = page.locator('nav button').first();
    await expect(homeBtn).toHaveClass(/text-mind/);

    // Active indicator bar exists under home
    const indicator = homeBtn.locator('[style*="nav-indicator"], div');
    await expect(homeBtn.locator('div.bg-mind, [class*="bg-mind"]')).toBeVisible();
  });

  test('navigates to Projetos tab', async ({ authedPage: page }) => {
    await page.getByText('Projetos', { exact: true }).click();
    // Wait for page transition
    await page.waitForTimeout(300);
    // ProjectsPage shows heading "Projetos"
    await expect(page.locator('h2:has-text("Projetos")')).toBeVisible();
  });

  test('navigates to Agenda tab', async ({ authedPage: page }) => {
    await page.getByText('Agenda', { exact: true }).click();
    await page.waitForTimeout(300);
    // CalendarView renders — check for the month grid or heading
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('navigates to Ritual tab', async ({ authedPage: page }) => {
    await page.getByText('Ritual', { exact: true }).click();
    await page.waitForTimeout(300);
    // RitualView renders
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('navigates to Journal tab', async ({ authedPage: page }) => {
    await page.getByText('Journal', { exact: true }).click();
    await page.waitForTimeout(300);
    // JournalView renders
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('navigates back to Home from Journal', async ({ authedPage: page }) => {
    // Go to Journal first
    await page.getByText('Journal', { exact: true }).click();
    await page.waitForTimeout(300);

    // Now go back to Home
    await page.getByText('Home', { exact: true }).click();
    await page.waitForTimeout(300);

    // Home button should be active
    const homeBtn = page.locator('nav button').first();
    await expect(homeBtn).toHaveClass(/text-mind/);
  });

  test('cycles through all tabs and returns to Home', async ({ authedPage: page }) => {
    const tabs = ['Projetos', 'Agenda', 'Ritual', 'Journal', 'Home'] as const;

    for (const tab of tabs) {
      const navBtn = page.locator(`nav button:has-text("${tab}")`);
      await navBtn.click();
      await page.waitForTimeout(250);
      // The clicked button should become active
      await expect(navBtn).toHaveClass(/text-mind/);
    }
  });

  test('[BUG] BottomNav Home click switches content away from Journal', async ({
    authedPage: page,
  }) => {
    // Reproduce reported bug: clicking Home while on Journal doesn't switch
    // Step 1: Navigate to Journal
    await page.getByText('Journal', { exact: true }).click();
    await page.waitForTimeout(400);

    // Confirm we are on Journal — JournalView should be in DOM
    const journalBtn = page.locator('nav button:has-text("Journal")');
    await expect(journalBtn).toHaveClass(/text-mind/);

    // Step 2: Click Home
    const homeBtn = page.locator('nav button:has-text("Home")');
    await homeBtn.click();
    await page.waitForTimeout(400);

    // Step 3: Verify Home is now active (not Journal)
    await expect(homeBtn).toHaveClass(/text-mind/);
    await expect(journalBtn).not.toHaveClass(/text-mind/);

    // Step 4: Verify the Zustand store actually changed
    // We can check by evaluating the store state in the browser
    const currentPage = await page.evaluate(() => {
      // Access Zustand store — it's bound to the module scope
      // We check via the DOM: Home page renders AtomInput
      const mainContent = document.querySelector('main')?.innerHTML || '';
      return {
        hasInput: mainContent.includes('placeholder') || !!document.querySelector('main input'),
        homeActive: !!document.querySelector('nav button.text-mind'),
      };
    });

    // Home page should have the AtomInput (an <input> element)
    expect(currentPage.hasInput).toBe(true);
  });

  test('rapid navigation clicks do not break state', async ({ authedPage: page }) => {
    // Rapid click sequence
    await page.getByText('Journal', { exact: true }).click();
    await page.getByText('Ritual', { exact: true }).click();
    await page.getByText('Projetos', { exact: true }).click();
    await page.getByText('Home', { exact: true }).click();

    // Wait for animations to settle
    await page.waitForTimeout(500);

    // Home should be active
    const homeBtn = page.locator('nav button:has-text("Home")');
    await expect(homeBtn).toHaveClass(/text-mind/);
  });
});
