// pages/Raiz.tsx — Raiz Dashboard (9 domains health)
// Wireframe: mindroot-wireframe-raiz-dashboard.html
// Domain matrix, health score, regression alerts

import { useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import { RAIZ_DOMAINS } from '@/config/raiz';
import { MODULE_COLORS } from '@/components/atoms/tokens';
import { differenceInDays, parseISO } from 'date-fns';

export function RaizPage() {
  const { items } = useItems();

  const domainHealth = useMemo(() => {
    return RAIZ_DOMAINS.map((domain) => {
      const domainItems = items.filter(
        (i) => i.module === domain.module && i.status !== 'archived',
      );
      const count = domainItems.length;
      const oldest = domainItems.reduce((min, i) => {
        const days = differenceInDays(new Date(), parseISO(i.updated_at));
        return days > min ? days : min;
      }, 0);

      let status: 'ok' | 'stale' | 'empty' = 'ok';
      if (count === 0) status = 'empty';
      else if (oldest > 30) status = 'stale';

      return { ...domain, count, oldest, status };
    });
  }, [items]);

  const totalActive = items.filter((i) => i.status !== 'archived' && i.status !== 'completed').length;
  const healthyDomains = domainHealth.filter((d) => d.status === 'ok').length;
  const healthPct = domainHealth.length > 0 ? Math.round((healthyDomains / domainHealth.length) * 100) : 0;

  const regressions = domainHealth.filter((d) => d.status === 'stale');

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4">
        <h1 className="text-2xl font-medium tracking-tight">raiz</h1>
        <p className="text-[13px] text-text-muted">saude da sua vida · 9 dominios</p>
      </div>

      {/* Health score */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e8e6df" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke={healthPct >= 70 ? '#639922' : healthPct >= 40 ? '#EF9F27' : '#D85A30'}
              strokeWidth="3"
              strokeDasharray={`${healthPct} ${100 - healthPct}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-medium">{healthPct}%</span>
        </div>
        <div>
          <div className="text-sm font-medium">{healthyDomains}/{domainHealth.length} dominios saudaveis</div>
          <div className="text-xs text-text-muted mt-0.5">{totalActive} items ativos total</div>
        </div>
      </div>

      {/* Regression alerts */}
      {regressions.length > 0 && (
        <div className="mb-4">
          {regressions.map((d) => (
            <div key={d.key} className="bg-[#FCEBEB] border border-[#f0c0c0] rounded-lg px-3.5 py-2.5 mb-1.5 flex items-center gap-2 text-xs text-[#A32D2D]">
              <span>!</span>
              <span><b>{d.label}</b> — {d.oldest}d sem atividade</span>
            </div>
          ))}
        </div>
      )}

      {/* Domain matrix */}
      <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2">dominios</div>
      <div className="space-y-1.5">
        {domainHealth.map((d) => {
          const color = MODULE_COLORS[d.module];
          const statusColor = d.status === 'ok' ? '#639922' : d.status === 'stale' ? '#EF9F27' : '#b4b2a9';

          return (
            <div key={d.key} className="bg-card border border-border rounded-xl p-3 px-3.5 flex items-center gap-3">
              <div className="w-3 h-8 rounded-sm" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium">{d.label}</div>
                <div className="text-[11px] text-text-muted">{d.count} items · mod-{d.module}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                <span className="text-xs text-text-muted">
                  {d.status === 'empty' ? 'vazio' : d.status === 'stale' ? `${d.oldest}d` : 'ok'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
