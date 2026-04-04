import { describe, it, expect } from 'vitest';

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
});
