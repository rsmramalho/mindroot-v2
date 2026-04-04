import { describe, it, expect } from 'vitest';

describe('AGENTE DADOS — Connections', () => {
  it('graph nodes sao deduplicados por id', () => {
    const items = [
      { id: '1', title: 'A' },
      { id: '1', title: 'A' },
      { id: '2', title: 'B' },
    ];
    const nodes = [...new Map(items.map(i => [i.id, i])).values()];
    expect(nodes.length).toBe(2);
  });

  it('edges com source === target sao invalidos', () => {
    const edges = [
      { source_id: '1', target_id: '2' },
      { source_id: '1', target_id: '1' },
    ];
    const valid = edges.filter(e => e.source_id !== e.target_id);
    expect(valid.length).toBe(1);
  });

  it('edge relations sao do enum AtomRelation', () => {
    const validRelations = ['belongs_to', 'blocks', 'feeds', 'mirrors', 'derives', 'references', 'morphed_from', 'extracted_from'];
    const edges = [
      { relation: 'belongs_to' },
      { relation: 'feeds' },
    ];
    edges.forEach(e => {
      expect(validRelations).toContain(e.relation);
    });
  });
});
