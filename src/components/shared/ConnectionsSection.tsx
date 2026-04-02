// shared/ConnectionsSection.tsx — View/create/delete connections on any item
import { useState, useEffect, useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { usePipeline } from '@/hooks/usePipeline';
import { connectionService } from '@/service/item-service';
import type { ItemConnection, AtomRelation, AtomItem } from '@/types/item';
import { getTypeColor } from '@/components/atoms/tokens';
import { toast } from '@/store/toast-store';

const RELATION_OPTIONS: { key: AtomRelation; label: string }[] = [
  { key: 'belongs_to', label: 'pertence a' },
  { key: 'references', label: 'referencia' },
  { key: 'feeds', label: 'alimenta' },
  { key: 'blocks', label: 'bloqueia' },
  { key: 'derives', label: 'deriva de' },
  { key: 'mirrors', label: 'espelha' },
  { key: 'extracted_from', label: 'extraido de' },
  { key: 'morphed_from', label: 'transformado de' },
];

interface ConnectionsSectionProps {
  itemId: string;
}

export function ConnectionsSection({ itemId }: ConnectionsSectionProps) {
  const { items } = useItems();
  const { connect } = usePipeline();
  const { selectItem } = useNav();
  const [connections, setConnections] = useState<ItemConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchConnections = async () => {
    try {
      const conns = await connectionService.getForItem(itemId);
      setConnections(conns);
    } catch { /* non-critical */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchConnections(); }, [itemId]);

  const resolved = useMemo(() => {
    return connections.map((c) => {
      const isSource = c.source_id === itemId;
      const otherId = isSource ? c.target_id : c.source_id;
      const other = items.find((i) => i.id === otherId);
      return {
        ...c,
        otherId,
        otherTitle: other?.title ?? 'item desconhecido',
        otherType: other?.type ?? null,
        direction: isSource ? '→' : '←',
      };
    });
  }, [connections, items, itemId]);

  const handleDelete = async (conn: ItemConnection) => {
    try {
      await connectionService.delete(conn.source_id, conn.target_id, conn.relation);
      setConnections((prev) => prev.filter((c) => c.id !== conn.id));
      toast.success('Conexao removida');
    } catch { toast.error('Erro ao remover conexao'); }
  };

  const handleAdd = async (targetId: string, relation: AtomRelation) => {
    const result = await connect(itemId, targetId, relation);
    if (result) {
      await fetchConnections();
      setAdding(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted">
          connections
          {resolved.length > 0 && (
            <span className="ml-1.5 text-[10px] px-1.5 py-px rounded-md bg-surface font-medium">{resolved.length}</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-1.5 mb-3">
          {[1, 2].map((i) => <div key={i} className="h-10 bg-surface rounded-lg animate-pulse" />)}
        </div>
      ) : resolved.length > 0 ? (
        <div className="space-y-1 mb-3">
          {resolved.map((c) => {
            const label = RELATION_OPTIONS.find((r) => r.key === c.relation)?.label ?? c.relation;
            const typeColor = c.otherType ? getTypeColor(c.otherType as import('@/types/item').AtomType) : 'var(--color-mod-bridge)';
            return (
              <div key={c.id} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-[12px]">
                <span className="text-text-muted text-[10px] shrink-0">{c.direction}</span>
                <span className="text-text-muted text-[10px] shrink-0">{label}</span>
                <button onClick={() => selectItem(c.otherId)} className="flex-1 truncate text-left text-[12px] hover:text-accent transition-colors">
                  {c.otherTitle}
                </button>
                {c.otherType && (
                  <span className="text-[9px] px-1.5 py-px rounded shrink-0" style={{ background: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}>
                    {c.otherType}
                  </span>
                )}
                <button onClick={() => handleDelete(c)} className="text-text-muted hover:text-error text-xs shrink-0 ml-1" aria-label="Remover conexao">×</button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-text-muted mb-3">nenhuma conexao</p>
      )}

      {adding ? (
        <ConnectionPicker items={items} excludeId={itemId} onSelect={handleAdd} onCancel={() => setAdding(false)} />
      ) : (
        <button onClick={() => setAdding(true)} className="text-xs text-accent mb-4">+ conectar</button>
      )}
    </>
  );
}

// ─── Connection Picker ───────────────────────────────

function ConnectionPicker({ items, excludeId, onSelect, onCancel }: {
  items: AtomItem[]; excludeId: string;
  onSelect: (targetId: string, relation: AtomRelation) => void; onCancel: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [relation, setRelation] = useState<AtomRelation>('references');

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return items.filter((i) => i.id !== excludeId && i.title.toLowerCase().includes(q)).slice(0, 6);
  }, [items, search, excludeId]);

  const target = selectedTarget ? items.find((i) => i.id === selectedTarget) : null;

  return (
    <div className="bg-surface border border-border rounded-xl p-3 mb-4">
      {!selectedTarget ? (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus placeholder="buscar item..."
            className="w-full text-sm bg-card border border-border rounded-lg px-3 py-2 outline-none focus:border-accent-light mb-2" />
          {filtered.length > 0 && (
            <div className="space-y-0.5 max-h-40 overflow-y-auto">
              {filtered.map((item) => {
                const tc = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';
                return (
                  <button key={item.id} onClick={() => { setSelectedTarget(item.id); setSearch(''); }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[12px] hover:bg-card transition-colors">
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.type && <span className="text-[9px] px-1.5 py-px rounded" style={{ background: `color-mix(in srgb, ${tc} 12%, transparent)`, color: tc }}>{item.type}</span>}
                  </button>
                );
              })}
            </div>
          )}
          {search.trim() && filtered.length === 0 && <p className="text-[11px] text-text-muted text-center py-2">nenhum resultado</p>}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-text-muted">conectar com:</span>
            <span className="text-[12px] font-medium flex-1 truncate">{target?.title}</span>
            <button onClick={() => setSelectedTarget(null)} className="text-xs text-text-muted">×</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {RELATION_OPTIONS.map((r) => (
              <button key={r.key} onClick={() => setRelation(r.key)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${relation === r.key ? 'border-accent bg-accent-bg text-accent font-medium' : 'border-border text-text-muted'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="flex-1 py-2 text-center text-xs border border-border rounded-lg text-text-muted">cancelar</button>
            <button onClick={() => onSelect(selectedTarget!, relation)} className="flex-1 py-2 text-center text-xs bg-accent text-white rounded-lg font-medium">conectar</button>
          </div>
        </>
      )}
    </div>
  );
}
