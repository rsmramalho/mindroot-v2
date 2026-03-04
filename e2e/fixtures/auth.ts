/**
 * e2e/fixtures/auth.ts — Shared fixture for Supabase auth mocking
 *
 * Provides two page variants:
 *   - `authedPage`: intercepts Supabase auth + data, injects a fake session
 *   - `unauthPage`: intercepts Supabase auth, returns no session (shows AuthPage)
 */
import { test as base, type Page } from '@playwright/test';

// ─── Mock data ────────────────────────────────────────────
const MOCK_USER = {
  id: 'e2e-user-0000-0000-000000000001',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'e2e@mindroot.test',
  email_confirmed_at: '2025-01-01T00:00:00Z',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: 'E2E Tester' },
  identities: [],
};

const MOCK_SESSION = {
  access_token: 'e2e-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'e2e-refresh-token',
  user: MOCK_USER,
};

const MOCK_ITEMS: unknown[] = [];

// ─── Route interceptors ───────────────────────────────────
async function interceptSupabase(page: Page, authenticated: boolean) {
  const supabaseUrl = 'https://test-project.supabase.co';

  // Auth — getSession / token refresh
  await page.route(`${supabaseUrl}/auth/v1/token*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        authenticated
          ? { ...MOCK_SESSION }
          : { error: 'invalid_grant', error_description: 'Invalid credentials' }
      ),
    });
  });

  // Auth — getUser
  await page.route(`${supabaseUrl}/auth/v1/user`, (route) => {
    route.fulfill({
      status: authenticated ? 200 : 401,
      contentType: 'application/json',
      body: JSON.stringify(authenticated ? MOCK_USER : { message: 'not authenticated' }),
    });
  });

  // Auth — signup
  await page.route(`${supabaseUrl}/auth/v1/signup`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: MOCK_USER, session: MOCK_SESSION }),
    });
  });

  // Auth — signout
  await page.route(`${supabaseUrl}/auth/v1/logout`, (route) => {
    route.fulfill({ status: 204, body: '' });
  });

  // REST API — items table (GET, POST, PATCH, DELETE)
  await page.route(`${supabaseUrl}/rest/v1/items*`, (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ITEMS),
      });
    } else if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: `item-${Date.now()}`, ...MOCK_USER }]),
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
  });

  // REST API — any other table (rituals, journal_entries, etc.)
  await page.route(`${supabaseUrl}/rest/v1/**`, (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
  });

  // Realtime — websocket auth callback (just block it)
  await page.route(`${supabaseUrl}/realtime/**`, (route) => route.abort());
}

// Inject local storage session so Supabase client thinks user is logged in
// Supabase v2 stores the session object directly (not wrapped in { currentSession })
async function injectAuthSession(page: Page) {
  await page.addInitScript(
    (session) => {
      const storageKey = 'sb-test-project-auth-token';
      localStorage.setItem(storageKey, JSON.stringify(session));
    },
    MOCK_SESSION
  );
}

// ─── Extended test fixture ────────────────────────────────
type AuthFixtures = {
  authedPage: Page;
  unauthPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authedPage: async ({ page }, use) => {
    await interceptSupabase(page, true);
    await injectAuthSession(page);
    await page.goto('/');
    // Wait for auth loading to resolve and app shell to appear
    await page.waitForSelector('nav', { timeout: 15_000 });
    await use(page);
  },

  unauthPage: async ({ page }, use) => {
    await interceptSupabase(page, false);
    await page.goto('/');
    // Wait for auth page (login form) to appear
    await page.waitForSelector('form', { timeout: 15_000 });
    await use(page);
  },
});

export { expect } from '@playwright/test';
export { MOCK_USER, MOCK_SESSION };
