// pages/Analytics.tsx — Analytics with 4 tabs
// Wireframe: mindroot-wireframe-analytics.html
// Tabs: Pipeline / Soul / Connections / Raiz

import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { useRaiz } from '@/hooks/useRaiz';
import { AuditPanel } from '@/components/audit/AuditPanel';
import { SoulPanel } from '@/components/analytics/SoulPanel';
import { ConnectionsPanel } from '@/components/analytics/ConnectionsPanel';
import { MODULE_COLORS, STAGE_COLORS } from '@/components/atoms/tokens';
import { RAIZ_DOMAINS } from '@/config/raiz';

type Tab = 'pipeline' | 'soul' | 'connections' | 'raiz';

export function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('pipeline');
  const { items } = useItems();

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4">
        <h1 className="text-[24px] font-medium tracking-tight">analytics</h1>
      </div>

      {/* Tab bar */}
      <div className="flex bg-surface rounded-lg p-[3px] mb-4" role="tablist" aria-label="Analytics tabs">
        {(['pipeline', 'soul', 'connections', 'raiz'] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`flex-1 text-center py-2 text-[13px] rounded-lg transition-all ${
              tab === t ? 'bg-card font-medium text-text-heading shadow-sm' : 'text-text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && <AuditPanel />}
      {tab === 'soul' && <SoulPanel items={items} />}
      {tab === 'connections' && <ConnectionsPanel />}
      {tab === 'raiz' && <RaizPanel items={items} />}
    </div>
  );
}

// ─── Raiz Panel ──────────────────────────────────────

function RaizPanel({ items }: { items: ReturnType<typeof useItems>['items'] }) {
  const { domains, healthPct, activeCount, staleCount, emptyCount } = useRaiz();

  return (
    <div className="space-y-4">
      {/* Health summary */}
      <div className="bg-card border border-border rounded-[14px] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted">saude geral</div>
          <span className="text-lg font-medium text-accent">{healthPct}%</span>
        </div>
        <div className="flex gap-3 text-center">
          <div className="flex-1 py-2 rounded-lg bg-success-bg">
            <div className="text-base font-medium text-success-text">{activeCount}</div>
            <div className="text-[10px] text-success-text/70">ativos</div>
          </div>
          <div className="flex-1 py-2 rounded-lg bg-warning-bg">
            <div className="text-base font-medium text-warning-text">{staleCount}</div>
            <div className="text-[10px] text-warning-text/70">stale</div>
          </div>
          <div className="flex-1 py-2 rounded-lg bg-surface">
            <div className="text-base font-medium text-text-muted">{emptyCount}</div>
            <div className="text-[10px] text-text-muted/70">vazios</div>
          </div>
        </div>
      </div>

      {/* Domain rows */}
      <div className="bg-card border border-border rounded-[14px] p-4">
        <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-3">dominios</div>
        <div className="space-y-1">
          {domains.map((d) => {
            const domain = RAIZ_DOMAINS.find((r) => r.key === d.key);
            const moduleColor = MODULE_COLORS[d.module as keyof typeof MODULE_COLORS] ?? 'var(--color-mod-bridge)';
            // Stage distribution for this domain
            const stages = [0, 0, 0, 0, 0, 0, 0];
            items.filter((i) => i.status !== 'archived' && i.tags?.includes(`#domain:${d.key}`))
              .forEach((i) => { if (i.genesis_stage >= 1 && i.genesis_stage <= 7) stages[i.genesis_stage - 1]++; });

            return (
              <div key={d.key} className="flex items-center gap-3 py-2 border-b border-surface last:border-0">
                <div className="w-[3px] h-6 rounded-sm shrink-0" style={{ background: moduleColor }} />
                <span className="text-sm w-5">{domain?.emoji}</span>
                <span className="text-[13px] flex-1">{d.label}</span>
                {/* Mini stage bar */}
                <div className="flex gap-px w-20">
                  {stages.map((count, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-sm"
                      style={{
                        background: count > 0 ? STAGE_COLORS[i + 1] : 'var(--color-border)',
                        opacity: count > 0 ? 0.8 : 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className={`text-xs w-6 text-right font-medium ${
                  d.status === 'stale' ? 'text-warning' : d.status === 'empty' ? 'text-text-muted/40' : ''
                }`}>
                  {d.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
