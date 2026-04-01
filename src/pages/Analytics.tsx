// pages/Analytics.tsx — Analytics with 3 tabs
// Wireframe: mindroot-wireframe-analytics.html
// Tabs: Pipeline / Soul / Connections

import { useState } from 'react';
import { AuditPanel } from '@/components/audit/AuditPanel';

type Tab = 'pipeline' | 'soul' | 'connections';

export function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('pipeline');

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
              tab === t ? 'bg-card font-medium text-text-heading shadow-sm' : 'text-text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && <AuditPanel />}

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
