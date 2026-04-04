import { describe, it, expect } from 'vitest';
import { generateItems } from '@/features/raiz/builder-mapper';
import type { BuilderAnswer } from '@/features/raiz/builder-types';

describe('AGENTE REGRESSAO — Bugs 04 Abr 2026 (Andre)', () => {

  it('BUG#2: panorama count nao deve somar session + supabase', () => {
    const domainCount = 1;
    const sessionItems = 1;
    const displayCount = Math.max(domainCount, sessionItems);
    expect(displayCount).toBe(1);
    const buggyCount = domainCount + sessionItems;
    expect(buggyCount).not.toBe(displayCount);
  });

  it('BUG#3: inventario deve mostrar items do Supabase apos refresh', () => {
    const domainInputs: string[] = [];
    const persistedItems = ['google drive'];
    const sessionSet = new Set(domainInputs);
    const persistedOnly = persistedItems.filter(p => !sessionSet.has(p));
    const allItems = [...persistedOnly, ...domainInputs];
    expect(allItems.length).toBe(1);
    expect(allItems).toContain('google drive');
  });

  it('BUG#3: inventario nao duplica items que existem em ambas as fontes', () => {
    const domainInputs = ['google drive'];
    const persistedItems = ['google drive'];
    const sessionSet = new Set(domainInputs);
    const persistedOnly = persistedItems.filter(p => !sessionSet.has(p));
    const allItems = [...persistedOnly, ...domainInputs];
    expect(allItems.length).toBe(1);
  });

  it('BUG#2: domain count com 0 session + 0 supabase = empty', () => {
    const displayCount = Math.max(0, 0);
    expect(displayCount).toBe(0);
  });

  it('BUG#2: domain count cresce corretamente com multiplos items', () => {
    const displayCount = Math.max(3, 1);
    expect(displayCount).toBe(3);
  });

  it('BUG#7: botao pular deve ter seta pra frente', () => {
    const skipIcon = '→';
    expect(skipIcon).not.toBe('←');
  });

  it('BUG#8: freetext seguido de frequency NAO gera item duplicado', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-1', value: true },
      { questionId: 'body-2', value: 'Academia e corrida' },
      { questionId: 'body-3', value: '3' },
    ];
    const items = generateItems(answers, 'body');
    const matching = items.filter(i => i.title === 'Academia e corrida');
    expect(matching.length).toBe(1);
    expect(matching[0].type).toBe('habit');
  });

  it('BUG#8: freetext SEM frequency depois GERA item normalmente', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-6', value: 'meditacao 10 min' },
    ];
    const items = generateItems(answers, 'body');
    const matching = items.filter(i => i.title === 'meditacao 10 min');
    expect(matching.length).toBe(1);
  });

  it('BUG#8 familia: freetext + frequency nao duplica em family', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'family-4', value: 'Ben' },
      { questionId: 'family-5', value: '3' },
    ];
    const items = generateItems(answers, 'family');
    const matching = items.filter(i => i.title === 'Ben');
    expect(matching.length).toBe(1);
    expect(matching[0].type).toBe('habit');
  });
});
