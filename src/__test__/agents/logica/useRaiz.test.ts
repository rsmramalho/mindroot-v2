import { describe, it, expect } from 'vitest';
import type { AtomItem } from '@/types/item';
import { RAIZ_DOMAINS } from '@/config/raiz';

function computeDomainHealth(items: AtomItem[]) {
  return RAIZ_DOMAINS.map((domain) => {
    const domainItems = items.filter(
      (i) => i.status !== 'archived' && i.tags?.includes(`#domain:${domain.key}`)
    );
    const count = domainItems.length;
    let status: 'active' | 'stale' | 'empty' = 'active';
    if (count === 0) status = 'empty';
    return { key: domain.key, count, status };
  });
}

function makeItem(overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id: 'test-' + Math.random().toString(36).slice(2, 8),
    user_id: 'u1',
    title: 'Test item',
    type: 'note',
    module: 'mind',
    tags: [],
    status: 'active',
    state: 'inbox',
    genesis_stage: 1,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: {},
    source: 'mindroot',
    created_at: '2026-01-01T10:00:00+10:00',
    updated_at: '2026-01-01T10:00:00+10:00',
    created_by: null,
    ...overrides,
  };
}

describe('AGENTE LOGICA — useRaiz domain health', () => {
  it('conta items por domain tag', () => {
    const items = [
      makeItem({ tags: ['#domain:health', '#raiz'] }),
      makeItem({ tags: ['#domain:health', '#raiz'] }),
      makeItem({ tags: ['#domain:finance', '#raiz'] }),
    ];
    const health = computeDomainHealth(items);
    expect(health.find(d => d.key === 'health')?.count).toBe(2);
    expect(health.find(d => d.key === 'finance')?.count).toBe(1);
    expect(health.find(d => d.key === 'documents')?.count).toBe(0);
  });

  it('ignora items archived', () => {
    const items = [
      makeItem({ tags: ['#domain:health'], status: 'archived' }),
      makeItem({ tags: ['#domain:health'], status: 'active' }),
    ];
    const health = computeDomainHealth(items);
    expect(health.find(d => d.key === 'health')?.count).toBe(1);
  });

  it('retorna empty quando domain sem items', () => {
    const health = computeDomainHealth([]);
    expect(health.every(d => d.status === 'empty')).toBe(true);
  });

  it('nao conta item sem tag #domain:*', () => {
    const items = [makeItem({ tags: ['#raiz'] })];
    const health = computeDomainHealth(items);
    expect(health.every(d => d.count === 0)).toBe(true);
  });

  it('cada domain e independente — saude nao contamina financas', () => {
    const items = [makeItem({ tags: ['#domain:health'] })];
    const health = computeDomainHealth(items);
    expect(health.find(d => d.key === 'health')?.count).toBe(1);
    expect(health.find(d => d.key === 'finance')?.count).toBe(0);
  });
});
