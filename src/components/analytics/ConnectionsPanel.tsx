// analytics/ConnectionsPanel.tsx — Connection graph stats
// Stats, most connected items, connections by relation type

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/service/supabase';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { STAGE_GEOMETRIES, MODULE_COLORS } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';
import { ListSkeleton } from '@/components/shared/Skeleton';
import type { AtomRelation } from '@/types/item';

interface Connection {
  source_id: string;
  target_id: string;
  relation: AtomRelation;
  note: string | null;
}

const RELATION_LABELS: Record<string, string> = {
  belongs_to: 'pertence a',
  blocks: 'bloqueia',
  feeds: 'alimenta',
  mirrors: 'espelha',
  derives: 'deriva de',
  references: 'referencia',
  morphed_from: 'transformou de',
  extracted_from: 'extraido de',
};

export function ConnectionsPanel() {
  const user = useAppStore((s) => s.user);
  const { items } = useItems();

  const { data: connections, isLoading } = useQuery<Connection[]>({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('item_connections')
        .select('source_id, target_id, relation, note')
        .order('created_at', { ascending: false });
      return (data ?? []) as Connection[];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  if (isLoading) return <ListSkeleton count={4} />;

  if (!connections || connections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl text-text-muted/40 mb-3">⬡</div>
        <p className="text-sm text-text-muted">nenhuma conexao ainda</p>
        <p className="text-xs text-text-muted mt-1">conexoes aparecem conforme items avancem no pipeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StatsRow connections={connections} />
      <MostConnected connections={connections} items={items} />
      <ByRelation connections={connections} />
    </div>
  );
}

// ─── Stats Row ───────────────────────────────────────

function StatsRow({ connections }: { connections: Connection[] }) {
  const totalConnections = connections.length;

  const uniqueItems = useMemo(() => {
    const ids = new Set<string>();
    connections.forEach((c) => { ids.add(c.source_id); ids.add(c.target_id); });
    return ids.size;
  }, [connections]);

  const mostCommonRelation = useMemo(() => {
    const counts: Record<string, number> = {};
    connections.forEach((c) => { counts[c.relation] = (counts[c.relation] ?? 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? '—';
  }, [connections]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <MetricCard label="conexoes" value={String(totalConnections)} />
      <MetricCard label="items" value={String(uniqueItems)} />
      <MetricCard label="tipo comum" value={RELATION_LABELS[mostCommonRelation] ?? mostCommonRelation} small />
    </div>
  );
}

function MetricCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className={`font-medium text-text-heading ${small ? 'text-sm' : 'text-xl'}`}>{value}</div>
      <div className="text-[10px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

// ─── Most Connected Items ────────────────────────────

function MostConnected({ connections, items }: { connections: Connection[]; items: any[] }) {
  const ranked = useMemo(() => {
    const counts: Record<string, number> = {};
    connections.forEach((c) => {
      counts[c.source_id] = (counts[c.source_id] ?? 0) + 1;
      counts[c.target_id] = (counts[c.target_id] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => {
        const item = items.find((i: any) => i.id === id);
        return { id, count, title: item?.title ?? id.slice(0, 8), type: item?.type, module: item?.module, stage: item?.genesis_stage };
      });
  }, [connections, items]);

  return (
    <section>
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">mais conectados</div>
      <div className="bg-card border border-border rounded-xl p-3 space-y-0.5">
        {ranked.map((r) => {
          const moduleColor = r.module ? (MODULE_COLORS[r.module as keyof typeof MODULE_COLORS] ?? 'var(--color-mod-bridge)') : 'var(--color-mod-bridge)';
          const geo = r.stage ? (STAGE_GEOMETRIES[r.stage] ?? '·') : '·';
          const typeColor = r.type ? getTypeColor(r.type) : 'var(--color-mod-bridge)';

          return (
            <div key={r.id} className="flex items-center gap-2 py-1.5 border-b border-surface last:border-0">
              <div className="w-[3px] h-5 rounded-sm shrink-0" style={{ background: moduleColor }} />
              <span className="text-[11px] text-text-muted">{geo}</span>
              <span className="text-[13px] flex-1 truncate">{r.title}</span>
              {r.type && (
                <span
                  className="text-[9px] font-medium px-1.5 py-px rounded shrink-0"
                  style={{ background: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}
                >
                  {r.type}
                </span>
              )}
              <span className="text-xs font-medium text-accent w-5 text-right">{r.count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Connections by Relation ─────────────────────────

function ByRelation({ connections }: { connections: Connection[] }) {
  const grouped = useMemo(() => {
    const counts: Record<string, number> = {};
    connections.forEach((c) => { counts[c.relation] = (counts[c.relation] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [connections]);

  const max = grouped[0]?.[1] ?? 1;

  return (
    <section>
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">por tipo de relacao</div>
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {grouped.map(([relation, count]) => (
          <div key={relation} className="flex items-center gap-2.5">
            <span className="w-20 text-[11px] text-text-muted truncate">
              {RELATION_LABELS[relation] ?? relation}
            </span>
            <div className="flex-1 h-2 rounded-sm bg-surface overflow-hidden">
              <div
                className="h-full rounded-sm bg-accent-light transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-muted w-5 text-right font-medium">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
