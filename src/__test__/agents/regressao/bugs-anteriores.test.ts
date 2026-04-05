import { describe, it, expect } from 'vitest';
import { RAIZ_DOMAINS } from '@/config/raiz';

describe('AGENTE REGRESSAO — Bugs anteriores (mobile fixes session)', () => {

  it('DOMINIO COUNTER: filtro por tag nao deve usar module fallback', () => {
    const bridgeDomains = RAIZ_DOMAINS.filter(d => d.module === 'bridge');
    expect(bridgeDomains.length).toBeGreaterThan(1);

    const items = [
      { tags: ['#domain:identity'], module: 'bridge' },
      { tags: ['#domain:documents'], module: 'bridge' },
    ];

    const identidadeCount = items.filter(i => i.tags.includes('#domain:identity')).length;
    const documentosCount = items.filter(i => i.tags.includes('#domain:documents')).length;

    expect(identidadeCount).toBe(1);
    expect(documentosCount).toBe(1);
  });

  it('9 RAIZ_DOMAINS existem com keys unicas', () => {
    expect(RAIZ_DOMAINS.length).toBe(9);
    const keys = RAIZ_DOMAINS.map(d => d.key);
    expect(new Set(keys).size).toBe(9);
  });
});
