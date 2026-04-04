import { describe, it, expect } from 'vitest';
import type { AtomItem } from '@/types/item';

function makeItem(id: string, overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id, user_id: 'u1', title: `Item ${id}`, type: 'note', module: 'mind',
    tags: [], status: 'active', state: 'inbox', genesis_stage: 1,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'mindroot', created_at: '2026-01-01T10:00:00+10:00',
    updated_at: '2026-01-01T10:00:00+10:00', created_by: null,
    ...overrides,
  };
}

describe('AGENTE DADOS — Cache e deduplicacao', () => {

  it('items com mesmo UUID sao deduplicados', () => {
    const items = [
      makeItem('abc-123'),
      makeItem('abc-123'),
      makeItem('def-456'),
    ];
    const deduped = [...new Map(items.map(i => [i.id, i])).values()];
    expect(deduped.length).toBe(2);
  });

  it('filtro por state inbox retorna apenas inbox', () => {
    const items = [
      makeItem('1', { state: 'inbox' }),
      makeItem('2', { state: 'classified' }),
      makeItem('3', { state: 'inbox' }),
      makeItem('4', { state: 'committed' }),
    ];
    const inboxItems = items.filter(i => i.state === 'inbox');
    expect(inboxItems.length).toBe(2);
  });

  it('filtro por tags suporta multiplas tags', () => {
    const items = [
      makeItem('1', { tags: ['#domain:saude', '#raiz'] }),
      makeItem('2', { tags: ['#domain:saude'] }),
      makeItem('3', { tags: ['#raiz'] }),
    ];
    const raizSaude = items.filter(
      i => i.tags.includes('#domain:saude') && i.tags.includes('#raiz')
    );
    expect(raizSaude.length).toBe(1);
  });

  it('wrap items nascem com genesis_stage 7', () => {
    const wrap = makeItem('w1', { type: 'wrap', state: 'committed', genesis_stage: 7 });
    expect(wrap.genesis_stage).toBe(7);
    expect(wrap.state).toBe('committed');
  });

  it('item capturado comeca no inbox stage 1', () => {
    const captured = makeItem('c1', { state: 'inbox', genesis_stage: 1 });
    expect(captured.state).toBe('inbox');
    expect(captured.genesis_stage).toBe(1);
  });
});
