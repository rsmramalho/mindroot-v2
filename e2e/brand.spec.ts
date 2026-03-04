import { test, expect } from './fixtures/auth';

test.describe('Brand', () => {
  test('page title is "MindRoot"', async ({ authedPage: page }) => {
    await expect(page).toHaveTitle('MindRoot');
  });

  test('favicon is linked as SVG', async ({ authedPage: page }) => {
    const favicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
  });

  test('LogoMark SVG is visible in TopBar', async ({ authedPage: page }) => {
    // TopBar renders LogoMark (an SVG with viewBox="0 0 160 200")
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const logoSvg = header.locator('svg').first();
    await expect(logoSvg).toBeVisible();
  });

  test('LogoWordmark shows "Mind" and "Root" in TopBar', async ({ authedPage: page }) => {
    const header = page.locator('header');
    // Wordmark has two spans: "Mind" + "Root"
    await expect(header.getByText('Mind')).toBeVisible();
    await expect(header.getByText('Root')).toBeVisible();
  });

  test('period greeting is shown in TopBar', async ({ authedPage: page }) => {
    const header = page.locator('header');
    // One of the three period greetings should be visible
    const greeting = header.locator('p');
    await expect(greeting).toBeVisible();
    const text = await greeting.textContent();
    // Should contain one of: "Bom dia", "Boa tarde", "Boa noite"
    expect(
      text?.includes('Bom dia') ||
      text?.includes('Boa tarde') ||
      text?.includes('Boa noite')
    ).toBe(true);
  });

  test('OG meta tags are present', async ({ authedPage: page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', 'MindRoot');

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', '/og-image.png');
  });

  test('theme-color meta is set', async ({ authedPage: page }) => {
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#0f0e0c');
  });

  test('manifest is linked', async ({ authedPage: page }) => {
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');
  });

  test('auth page shows full logo with tagline', async ({ unauthPage: page }) => {
    // Auth page renders LogoFull (vertical layout)
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();

    await expect(page.getByText('Mind')).toBeVisible();
    await expect(page.getByText('Root')).toBeVisible();
    await expect(page.getByText('Emoção + Ação + Tempo')).toBeVisible();
  });
});
