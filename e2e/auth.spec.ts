import { test, expect } from './fixtures/auth';

test.describe('Auth', () => {
  test('renders login form with email and password fields', async ({ unauthPage: page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'Email');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Senha');
  });

  test('shows "Entrar" button for login mode', async ({ unauthPage: page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText('Entrar');
  });

  test('toggles between login and signup modes', async ({ unauthPage: page }) => {
    const toggleBtn = page.getByText('Não tem conta? Criar agora');
    await expect(toggleBtn).toBeVisible();

    await toggleBtn.click();

    // After toggle: submit says "Criar conta", toggle text changes
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toHaveText('Criar conta');
    await expect(page.getByText('Já tem conta? Fazer login')).toBeVisible();

    // Toggle back
    await page.getByText('Já tem conta? Fazer login').click();
    await expect(submitBtn).toHaveText('Entrar');
  });

  test('email and password are required fields', async ({ unauthPage: page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('minlength', '6');
  });

  test('shows Google sign-in button', async ({ unauthPage: page }) => {
    const googleBtn = page.getByText('Continuar com Google');
    await expect(googleBtn).toBeVisible();
  });

  test('shows MindRoot logo on auth page', async ({ unauthPage: page }) => {
    // LogoFull renders SVG (LogoMark) + wordmark text
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Wordmark contains "Mind" and "Root"
    await expect(page.getByText('Mind')).toBeVisible();
    await expect(page.getByText('Root')).toBeVisible();
  });

  test('shows tagline "Emoção + Ação + Tempo"', async ({ unauthPage: page }) => {
    await expect(page.getByText('Emoção + Ação + Tempo')).toBeVisible();
  });
});
