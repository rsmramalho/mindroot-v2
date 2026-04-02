// pages/Analytics.tsx — Analytics with 3 tabs
// Wireframe: mindroot-wireframe-analytics.html
// Tabs: Pipeline / Soul / Connections

import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { AuditPanel } from '@/components/audit/AuditPanel';
import { SoulPanel } from '@/components/analytics/SoulPanel';
import { ConnectionsPanel } from '@/components/analytics/ConnectionsPanel';

type Tab = 'pipeline' | 'soul' | 'connections';

export function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('pipeline');
  const { items } = useItems();

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4">
        <h1 className="text-2xl font-medium tracking-tight">analytics</h1>
      </div>

      {/* Tab bar */}
      <div className="flex bg-surface rounded-lg p-[3px] mb-4" role="tablist" aria-label="Analytics tabs">
        {(['pipeline', 'soul', 'connections'] as Tab[]).map((t) => (
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
    </div>
  );
}
