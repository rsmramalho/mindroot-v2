// pages/Analytics.tsx — Analytics with 3 tabs
// Wireframe: mindroot-wireframe-analytics.html
// Tabs: Pipeline / Soul / Connections

import { useState, useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import type { AtomItem } from '@/types/item';
import { GENESIS_STAGES, MODULES } from '@/types/item';
import { STAGE_COLORS, MODULE_COLORS } from '@/components/atoms/tokens';
import { computeAudit } from '@/engine/wrap';

type Tab = 'pipeline' | 'soul' | 'connections';

export function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('pipeline');
  const { items } = useItems();

  const active = useMemo(
    () => items.filter((i) => i.status !== 'completed' && i.status !== 'archived'),
    [items],
  );

  const audit = useMemo(() => computeAudit(items), [items]);

  const byStage = useMemo(() => {
    const counts: Record<number, number> = {};
    active.forEach((i) => { counts[i.genesis_stage] = (counts[i.genesis_stage] ?? 0) + 1; });
    return counts;
  }, [active]);

  const byModule = useMemo(() => {
    const counts: Record<string, number> = {};
    active.forEach((i) => { if (i.module) counts[i.module] = (counts[i.module] ?? 0) + 1; });
    return counts;
  }, [active]);

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4">
        <h1 className="text-2xl font-medium tracking-tight">analytics</h1>
      </div>

      {/* Tab bar */}
      <div className="flex bg-surface rounded-lg p-[3px] mb-4">
        {(['pipeline', 'soul', 'connections'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-center py-2 text-[13px] rounded-lg transition-all ${
              tab === t ? 'bg-white font-medium text-text-heading shadow-sm' : 'text-text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && (
        <div>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <MetricCard label="total ativos" value={String(active.length)} />
            <MetricCard label="inbox" value={String(audit.inbox_count)} highlight={audit.inbox_count > 0} />
            <MetricCard label="abaixo piso" value={String(audit.below_floor)} highlight={audit.below_floor > 0} />
            <MetricCard label="stale" value={String(audit.stale)} highlight={audit.stale > 0} />
          </div>

          {/* Stage distribution */}
          <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4">por estagio</div>
          <div className="space-y-1.5">
            {GENESIS_STAGES.map((s) => {
              const count = byStage[s.stage] ?? 0;
              const pct = active.length > 0 ? (count / active.length) * 100 : 0;
              return (
                <div key={s.stage} className="flex items-center gap-2">
                  <span className="w-4 text-xs text-center" style={{ color: STAGE_COLORS[s.stage] }}>{s.geometry}</span>
                  <div className="flex-1 h-2 rounded-sm bg-surface overflow-hidden">
                    <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, background: STAGE_COLORS[s.stage] }} />
                  </div>
                  <span className="text-xs text-text-muted w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Module distribution */}
          <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4">por modulo</div>
          <div className="space-y-1.5">
            {MODULES.map((m) => {
              const count = byModule[m.key] ?? 0;
              const pct = active.length > 0 ? (count / active.length) * 100 : 0;
              return (
                <div key={m.key} className="flex items-center gap-2">
                  <span className="w-12 text-[11px] text-text-muted truncate">{m.key}</span>
                  <div className="flex-1 h-2 rounded-sm bg-surface overflow-hidden">
                    <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, background: MODULE_COLORS[m.key] }} />
                  </div>
                  <span className="text-xs text-text-muted w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'soul' && (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted mb-3">◆</div>
          <p className="text-sm text-text-muted">soul patterns</p>
          <p className="text-xs text-text-muted mt-1">tendencias emocionais, energy, shifts — Fase 7</p>
        </div>
      )}

      {tab === 'connections' && (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted mb-3">⬡</div>
          <p className="text-sm text-text-muted">connection graph</p>
          <p className="text-xs text-text-muted mt-1">visualizacao do grafo — Fase 7</p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white border border-[#e8e6df] rounded-xl p-3 px-3.5">
      <div className={`text-2xl font-medium ${highlight ? 'text-[#D85A30]' : 'text-text-heading'}`}>{value}</div>
      <div className="text-[11px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}
