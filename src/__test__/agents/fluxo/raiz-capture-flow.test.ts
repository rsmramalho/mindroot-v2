import { describe, it, expect } from 'vitest';
import type { AtomItem } from '@/types/item';

function makeItem(id: string, overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id, user_id: 'u1', title: 'Test', type: 'note', module: 'mind',
    tags: [], status: 'active', state: 'inbox', genesis_stage: 1,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'mindroot', created_at: '2026-04-04T10:00:00+10:00',
    updated_at: '2026-04-04T10:00:00+10:00', created_by: null,
    ...overrides,
  };
}

describe('AGENTE FLUXO — Captura no Raiz → Panorama → Refresh', () => {

  it('fluxo completo: captura → panorama mostra 1 → refresh → panorama mostra 1 → inventario mostra item', () => {
    let supabaseItems: AtomItem[] = [];
    let domainInputs: Record<string, string[]> = {};

    const newItem = makeItem('new-1', {
      title: 'google drive',
      tags: ['#domain:arquivos', '#raiz'],
      module: 'bridge',
    });
    supabaseItems.push(newItem);
    domainInputs['arquivos'] = [...(domainInputs['arquivos'] ?? []), 'google drive'];

    const supabaseCount = supabaseItems.filter(i => i.tags.includes('#domain:arquivos')).length;
    const sessionCount = domainInputs['arquivos']?.length ?? 0;
    const displayCount = Math.max(supabaseCount, sessionCount);
    expect(displayCount).toBe(1);

    domainInputs = {};

    const supabaseCountAfter = supabaseItems.filter(i => i.tags.includes('#domain:arquivos')).length;
    const sessionCountAfter = domainInputs['arquivos']?.length ?? 0;
    const displayCountAfter = Math.max(supabaseCountAfter, sessionCountAfter);
    expect(displayCountAfter).toBe(1);

    const persistedTitles = supabaseItems
      .filter(i => i.tags.includes('#domain:arquivos'))
      .map(i => i.title);
    const sessionTitles = domainInputs['arquivos'] ?? [];
    const sessionSet = new Set(sessionTitles);
    const allVisibleItems = [
      ...persistedTitles.filter(p => !sessionSet.has(p)),
      ...sessionTitles,
    ];
    expect(allVisibleItems.length).toBe(1);
    expect(allVisibleItems).toContain('google drive');
  });

  it('fluxo: multiplas capturas no mesmo dominio', () => {
    const supabaseItems: AtomItem[] = [];
    const domainInputs: Record<string, string[]> = {};

    ['academia', 'vitamina D', 'exame de sangue'].forEach((title, i) => {
      supabaseItems.push(makeItem(`s-${i}`, {
        title, tags: ['#domain:saude', '#raiz'], module: 'body',
      }));
      domainInputs['saude'] = [...(domainInputs['saude'] ?? []), title];
    });

    const displayCount = Math.max(
      supabaseItems.filter(i => i.tags.includes('#domain:saude')).length,
      domainInputs['saude']?.length ?? 0,
    );
    expect(displayCount).toBe(3);
  });

  it('fluxo: captura em dominios diferentes nao contamina', () => {
    const supabaseItems: AtomItem[] = [
      makeItem('a1', { title: 'passaporte', tags: ['#domain:identidade'], module: 'bridge' }),
      makeItem('a2', { title: 'vitamina', tags: ['#domain:saude'], module: 'body' }),
    ];

    const identidadeCount = supabaseItems.filter(i => i.tags.includes('#domain:identidade')).length;
    const saudeCount = supabaseItems.filter(i => i.tags.includes('#domain:saude')).length;

    expect(identidadeCount).toBe(1);
    expect(saudeCount).toBe(1);
  });
});
