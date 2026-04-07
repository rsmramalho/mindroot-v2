// pages/Home.tsx — Atom OS Home Screen (Aurora — morning state)
// Premium personal OS dashboard: presence over productivity
// Sections: greeting, soul card, capture, stage bar, hoje items, próximos events, audit

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import { usePipeline } from '@/hooks/usePipeline';
import { useTriage } from '@/hooks/useTriage';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { getCurrentPeriod } from '@/types/ui';
import { getConfidenceBand } from '@/service/triage-service';
import { motion } from 'framer-motion';
import { useSoulStore } from '@/store/soul-store';
import { SoulCard } from '@/components/home/SoulCard';
import { AtomInput } from '@/components/home/AtomInput';
import { ItemCard } from '@/components/shared/ItemCard';
import { StageBar } from '@/components/home/StageBar';
import { SoulCardSkeleton, CardSkeleton } from '@/components/shared/Skeleton';
import type { AtomType, AtomModule } from '@/types/item';

export function HomePage() {
  const { items, isLoading: loading } = useItems();
  const { capture, classify } = usePipeline();
  const { classify: aiClassify } = useTriage();
  const user = useAppStore((s) => s.user);
  const { selectItem } = useNav();
  const now = new Date();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'você';

  // Derived data
  const activeItems = useMemo(
    () => items.filter((i) => i.status !== 'completed' && i.status !== 'archived' && i.state !== 'inbox'),
    [items],
  );

  const { emotion: soulEmotion, energy: soulEnergy } = useSoulStore();

  // Calculate stage counts for stage bar
  const stageCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    items.forEach((item) => {
      const stage = item.stage ?? 1;
      if (stage in counts) counts[stage]++;
    });
    return counts;
  }, [items]);

  if (loading) {
    return (
      <div className="px-5 pt-6 space-y-3">
        <div className="h-8 bg-surface rounded w-48 animate-pulse mb-4" />
        <SoulCardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="px-5 pb-24">
      {/* HEADER: Greeting + Aurora indicator */}
      <div className="pt-16 pb-4">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-[28px] font-medium text-text-heading">
            bom dia{firstName ? `, ${firstName.split(' ')[0]}` : ''}.
          </h1>
          {/* Aurora glow indicator */}
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-warning)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-[14px] text-text-muted mt-0.5">
          {format(now, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* SOUL CARD: The signature component */}
      <div className="mb-4">
        <SoulCard
          period="aurora"
          intention={activeItems[0]?.title ?? null}
          emotions={soulEmotion ?? null}
          energy={soulEnergy ?? null}
          onEmotionChange={(emotion, energy) => {
            // TODO: Save to soul store
          }}
        />
      </div>

      {/* ATOM INPUT: Capture field */}
      <div className="mb-4">
        <AtomInput
          placeholder="capturar..."
          onSubmit={async (text) => {
            const item = await capture(text);
            if (item) {
              try {
                const result = await aiClassify({ input: text });
                const band = getConfidenceBand(result);
                if (band === 'auto') {
                  await classify(item.id, result.type as AtomType, result.module as AtomModule);
                }
              } catch { /* triage failure is non-blocking */ }
            }
          }}
        />
      </div>

      {/* STAGE BAR: Pipeline health */}
      <div className="mb-4">
        <StageBar counts={stageCounts} />
      </div>

      {/* HOJE SECTION: Today's items */}
      {activeItems.length > 0 ? (
        <div className="mb-4">
          <SectionLabel>hoje</SectionLabel>
          <div className="space-y-2">
            {activeItems.slice(0, 3).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <ItemCard item={item} onClick={() => selectItem(item.id)} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {/* PRÓXIMOS SECTION: Upcoming events/rituals */}
      <div className="mb-4">
        <SectionLabel>próximos</SectionLabel>
        <div className="space-y-2">
          {/* Event 1: Midday ritual */}
          <div
            className="rounded-[12px] bg-card border border-border p-3 flex items-center gap-3 h-11"
            style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--color-zenite)' }}
          >
            <time className="text-[12px] font-medium" style={{ color: 'var(--color-zenite)' }}>
              09:00
            </time>
            <span className="text-[13px] text-text-heading">Call fornecedor</span>
          </div>

          {/* Event 2: Evening ritual */}
          <div
            className="rounded-[12px] bg-card border border-border p-3 flex items-center gap-3 h-11"
            style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--color-crepusculo)' }}
          >
            <time className="text-[12px] font-medium" style={{ color: 'var(--color-crepusculo)' }}>
              17:00
            </time>
            <span className="text-[13px] text-text-heading">Wrap do dia</span>
          </div>
        </div>
      </div>

      {/* AUDIT SUMMARY: System health stats */}
      <div className="mb-4">
        <div
          className="rounded-[12px] bg-surface border border-border p-3.5"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: stageCounts[1], label: 'inbox', color: 'var(--color-accent)' },
              { value: 1, label: 'floor', color: 'var(--color-error)' },
              { value: 0, label: 'stale', color: 'var(--color-success)' },
              { value: 0, label: 'orphans', color: 'var(--color-success)' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-base font-medium mb-0.5"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-medium tracking-[2px] uppercase text-text-muted mb-3 mt-4 first:mt-0">
      {children}
    </div>
  );
}
