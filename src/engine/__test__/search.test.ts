// engine/__test__/search.test.ts — Search engine tests
import { describe, it, expect } from 'vitest';
import { parseSearchQuery, searchItems, hasActiveFilters, getFilterLabels, normalize } from '../search';
import type { AtomItem } from '@/types/item';

const makeItem = (overrides: Partial<AtomItem>): AtomItem => ({
  id: 'test-1', user_id: 'u1', title: 'Default Title', type: 'task', module: 'work',
  tags: [], status: 'active', state: 'structured', genesis_stage: 3,
  project_id: null, naming_convention: null, notes: null,
  body: {}, source: 'mindroot', created_at: '2026-01-01', updated_at: '2026-01-01', created_by: null,
  ...overrides,
});

describe('normalize', () => {
  it('lowercases and removes accents', () => {
    expect(normalize('Família')).toBe('familia');
    expect(normalize('Trabalho')).toBe('trabalho');
  });
});

describe('parseSearchQuery', () => {
  it('parses plain text', () => {
    const f = parseSearchQuery('hello world');
    expect(f.text).toBe('hello world');
    expect(f.module).toBeNull();
  });

  it('parses mod: prefix', () => {
    const f = parseSearchQuery('mod:work task');
    expect(f.module).toBe('work');
    expect(f.text).toBe('task');
  });

  it('parses prio: prefix', () => {
    const f = parseSearchQuery('prio:high');
    expect(f.priority).toBe('high');
  });

  it('parses tipo: prefix', () => {
    const f = parseSearchQuery('tipo:note');
    expect(f.type).toBe('note');
  });

  it('parses tag: prefix', () => {
    const f = parseSearchQuery('tag:fitness');
    expect(f.tag).toBe('fitness');
  });
});

describe('searchItems', () => {
  const items = [
    makeItem({ id: '1', title: 'Correr 5km', module: 'body', tags: ['#fitness'] }),
    makeItem({ id: '2', title: 'Revisar relatorio', module: 'work' }),
    makeItem({ id: '3', title: 'Meditacao', module: 'mind', type: 'habit' }),
  ];

  it('filters by text', () => {
    const results = searchItems(items, { ...parseSearchQuery('correr') });
    expect(results.length).toBe(1);
    expect(results[0].item.id).toBe('1');
  });

  it('filters by module', () => {
    const results = searchItems(items, { ...parseSearchQuery('mod:body') });
    expect(results.length).toBe(1);
    expect(results[0].item.module).toBe('body');
  });

  it('returns all when no filters', () => {
    const results = searchItems(items, { ...parseSearchQuery('') });
    expect(results.length).toBe(3);
  });
});

describe('hasActiveFilters', () => {
  it('returns false for empty', () => {
    expect(hasActiveFilters(parseSearchQuery(''))).toBe(false);
  });
  it('returns false for text-only (text is not a structured filter)', () => {
    expect(hasActiveFilters(parseSearchQuery('hello'))).toBe(false);
  });
  it('returns true for module filter', () => {
    expect(hasActiveFilters(parseSearchQuery('mod:work'))).toBe(true);
  });
});

describe('getFilterLabels', () => {
  it('returns labels for active filters', () => {
    const labels = getFilterLabels(parseSearchQuery('mod:work prio:high'));
    expect(labels.length).toBeGreaterThan(0);
  });
});
