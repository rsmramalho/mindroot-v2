// e2e/fixtures/auth.ts — Mock Supabase auth for visual testing
// Intercepts Supabase auth API calls so tests run without real credentials

import { test as base, type Page } from '@playwright/test';

const MOCK_USER = {
  id: 'e2e-test-user-0001',
  email: 'visual@mindroot.test',
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'Visual Tester', raiz_welcomed: true },
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
};

const MOCK_SESSION = {
  access_token: 'e2e-mock-access-token',
  refresh_token: 'e2e-mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: MOCK_USER,
};

async function mockSupabaseAuth(page: Page) {
  // Intercept Supabase auth endpoints
  await page.route('**/auth/v1/token*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SESSION),
    });
  });

  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_USER),
    });
  });

  // Intercept items query — return sample data
  await page.route('**/rest/v1/items*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(SAMPLE_ITEMS),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  // Intercept connections query
  await page.route('**/rest/v1/item_connections*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  // Intercept connectors query
  await page.route('**/rest/v1/user_connectors*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  // Intercept realtime websocket (noop)
  await page.route('**/realtime/v1/websocket*', async (route) => {
    await route.abort('connectionfailed');
  });

  // Intercept atom_events
  await page.route('**/rest/v1/atom_events*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  // Set auth token in localStorage before page loads
  await page.addInitScript((session) => {
    const key = Object.keys(localStorage).find((k) => k.startsWith('sb-')) || 'sb-avvwjkzkzklloyfugzer-auth-token';
    localStorage.setItem(key, JSON.stringify(session));
    localStorage.setItem('sb-avvwjkzkzklloyfugzer-auth-token', JSON.stringify(session));
  }, MOCK_SESSION);
}

const SAMPLE_ITEMS = [
  {
    id: 'e2e-item-001', title: 'Revisar relatorio mensal', type: 'task', module: 'work',
    tags: ['#report'], status: 'active', state: 'structured', genesis_stage: 3,
    source: 'mindroot', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-01T10:00:00Z',
    created_by: 'e2e-test-user-0001',
    body: { operations: { priority: 'high', deadline: '2026-04-10' }, soul: { energy_level: 'medium' } },
  },
  {
    id: 'e2e-item-002', title: 'Meditacao matinal', type: 'habit', module: 'mind',
    tags: ['#wellness'], status: 'active', state: 'committed', genesis_stage: 7,
    source: 'mindroot', created_at: '2026-03-15T06:00:00Z', updated_at: '2026-04-05T06:00:00Z',
    created_by: 'e2e-test-user-0001',
    body: { recurrence: { rule: 'FREQ=DAILY', streak_count: 21 }, soul: { energy_level: 'high', ritual_slot: 'aurora' } },
  },
  {
    id: 'e2e-item-003', title: 'Ideia de app para familia', type: 'note', module: 'family',
    tags: ['#idea'], status: 'inbox', state: 'inbox', genesis_stage: 1,
    source: 'mindroot', created_at: '2026-04-04T14:00:00Z', updated_at: '2026-04-04T14:00:00Z',
    created_by: 'e2e-test-user-0001',
    body: {},
  },
  {
    id: 'e2e-item-004', title: 'Projeto Genesis v6', type: 'project', module: 'work',
    tags: ['#genesis', '#architecture'], status: 'active', state: 'connected', genesis_stage: 5,
    source: 'mindroot', created_at: '2026-03-01T08:00:00Z', updated_at: '2026-04-03T18:00:00Z',
    created_by: 'e2e-test-user-0001',
    body: { operations: { priority: 'high', progress: 65 } },
  },
  {
    id: 'e2e-item-005', title: 'Correr 5km', type: 'task', module: 'body',
    tags: ['#fitness'], status: 'active', state: 'validated', genesis_stage: 4,
    source: 'mindroot', created_at: '2026-04-03T07:00:00Z', updated_at: '2026-04-03T07:00:00Z',
    created_by: 'e2e-test-user-0001',
    body: { operations: { priority: 'medium' }, soul: { energy_level: 'high', ritual_slot: 'aurora' } },
  },
  {
    id: 'e2e-item-006', title: 'Ler artigo sobre produtividade', type: 'article', module: 'mind',
    tags: ['#reading', '#productivity'], status: 'active', state: 'classified', genesis_stage: 2,
    source: 'mindroot', created_at: '2026-04-02T20:00:00Z', updated_at: '2026-04-02T20:00:00Z',
    created_by: 'e2e-test-user-0001',
    body: {},
  },
];

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await mockSupabaseAuth(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
