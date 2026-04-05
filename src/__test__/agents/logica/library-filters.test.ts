import { describe, it, expect } from 'vitest';
import type { AtomItem } from '@/types/item';

function makeItem(overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id: 'test-' + Math.random().toString(36).slice(2, 8),
    user_id: 'u1', title: 'Test', type: 'note', module: 'mind',
    tags: [], status: 'active', state: 'inbox', genesis_stage: 1,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'mindroot', created_at: '2026-01-01T10:00:00+10:00',
    updated_at: '2026-01-01T10:00:00+10:00', created_by: null,
    ...overrides,
  };
}

const LIBRARY_TYPES = ['recipe', 'workout', 'article', 'podcast', 'recommendation', 'resource'];

describe('AGENTE LOGICA — Library filters', () => {
  it('filtro library retorna apenas types de biblioteca', () => {
    const items = [
      makeItem({ type: 'recipe' }),
      makeItem({ type: 'task' }),
      makeItem({ type: 'article' }),
    ];
    const library = items.filter(i => i.type && LIBRARY_TYPES.includes(i.type));
    expect(library.length).toBe(2);
  });

  it('filtro por domain funciona com tag', () => {
    const items = [
      makeItem({ tags: ['#domain:health'], type: 'recipe' }),
      makeItem({ tags: ['#domain:finance'], type: 'article' }),
    ];
    const saude = items.filter(i => i.tags.includes('#domain:health'));
    expect(saude.length).toBe(1);
  });

  it('filtro reflections retorna reflection e checkpoint', () => {
    const items = [
      makeItem({ type: 'reflection' }),
      makeItem({ type: 'checkpoint' }),
      makeItem({ type: 'note' }),
    ];
    const reflections = items.filter(i => i.type === 'reflection' || i.type === 'checkpoint');
    expect(reflections.length).toBe(2);
  });
});
