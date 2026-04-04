// pages/Home.tsx — Home dashboard
// Wireframe: mindroot-wireframe-home.html
// Sections: greeting, soul, wrap banner (crepúsculo), capture, active items, inbox, audit

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import { usePipeline } from '@/hooks/usePipeline';
import { useTriage } from '@/hooks/useTriage';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { getCurrentPeriod } from '@/types/ui';
import { getCreatedToday, getModifiedToday } from '@/engine/wrap';
import { getConfidenceBand } from '@/service/triage-service';
import { motion } from 'framer-motion';
import { useRaiz } from '@/hooks/useRaiz';
import { SoulCard } from '@/components/home/SoulCard';
import { WrapBanner } from '@/components/home/WrapBanner';
import { AtomInput } from '@/components/home/AtomInput';
import { ItemCard } from '@/components/shared/ItemCard';
import { InboxPreview } from '@/components/home/InboxPreview';
import { HealthBar } from '@/components/audit/HealthBar';
import { SoulCardSkeleton, CardSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import type { AtomType, AtomModule } from '@/types/item';

export function HomePage() {
  const { items, isLoading: loading } = useItems();
  const { capture, classify } = usePipeline();
  const { classify: aiClassify } = useTriage();
  const user = useAppStore((s) => s.user);
  const { navigate, selectItem } = useNav();
  const currentEmotion = useAppStore((s) => s.currentEmotion);
  const period = getCurrentPeriod();
  const now = new Date();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? '';

  // Derived data
  const activeItems = useMemo(
    () => items.filter((i) => i.status !== 'completed' && i.status !== 'archived' && i.state !== 'inbox'),
    [items],
  );

  const inboxItems = useMemo(
    () => items.filter((i) => i.state === 'inbox'),
    [items],
  );

  const createdToday = useMemo(() => getCreatedToday(items), [items]);
  const modifiedToday = useMemo(() => getModifiedToday(items), [items]);

  // Use first active item title as intention proxy
  const intention = activeItems[0]?.title ?? null;

  const isCrepusculo = period.key === 'crepusculo';
  const { healthPct, staleCount, emptyCount } = useRaiz();

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
    <div className="px-5 pb-4">
      {/* Greeting */}
      <div className="pt-4 pb-2">
        <div className="text-[22px] font-medium tracking-tight text-text-heading flex items-center gap-2">
          {period.greeting}{firstName ? `, ${firstName}` : ''}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium ml-2" style={{ color: isCrepusculo ? 'var(--color-accent)' : 'var(--color-warning)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill={isCrepusculo ? 'var(--color-accent-lighter)' : 'var(--color-aurora)'} stroke={isCrepusculo ? 'var(--color-accent)' : 'var(--color-warning)'} strokeWidth=".5" />
            </svg>
            {period.key}
          </span>
        </div>
        <div className="text-[13px] text-text-muted mt-0.5">
          {format(now, "EEEE, d MMM", { locale: ptBR })}
          {isCrepusculo && ` · ${format(now, "HH:mm")}`}
        </div>
      </div>

      {/* Soul */}
      <div>
        <SectionLabel>soul</SectionLabel>
        <SoulCard
          period={period.key}
          intention={intention}
          emotions={currentEmotion ?? 'neutro'}
          energy={null}
        />
      </div>

      {/* Wrap banner (crepúsculo only) */}
      {isCrepusculo && (
        <WrapBanner
          createdCount={createdToday.length}
          modifiedCount={modifiedToday.length}
        />
      )}

      {/* Raiz health */}
      <button
        onClick={() => navigate('raiz')}
        className="w-full bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between text-left mt-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">○</span>
          <div>
            <div className="text-sm font-medium">raiz · {healthPct}%</div>
            <div className="text-xs text-text-muted">
              {staleCount > 0 ? `${staleCount} dominios stale` : emptyCount > 0 ? `${emptyCount} dominios vazios` : '9 dominios ativos'}
            </div>
          </div>
        </div>
        <span className="text-xs text-text-muted">→</span>
      </button>

      {/* Capture */}
      <div className="mt-3">
        <SectionLabel>captura</SectionLabel>
        <AtomInput
          placeholder={isCrepusculo ? 'ultima captura antes do wrap...' : 'o que esta na cabeca?'}
          onSubmit={async (text) => {
            const item = await capture(text);
            if (item) {
              // Auto-triage in background
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

      {/* Active items */}
      {activeItems.length > 0 ? (
        <div className="mt-3">
          <SectionLabel>items ativos</SectionLabel>
          <div className="space-y-1.5">
            {activeItems.slice(0, 5).map((item, i) => (
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
          {activeItems.length > 5 && (
            <button onClick={() => navigate('pipeline')} className="text-xs text-accent mt-1.5">
              ver todos ({activeItems.length}) →
            </button>
          )}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          geometry="·"
          title="Seu dia comeca aqui."
          subtitle="Capture algo no campo acima."
        />
      ) : null}

      {/* Created today */}
      {createdToday.length > 0 && (
        <div className="mt-3">
          <SectionLabel>
            criados hoje <span className="text-success text-[13px] normal-case tracking-normal font-medium">{createdToday.length}</span>
          </SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {createdToday.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => selectItem(item.id)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-success-bg text-success-text truncate max-w-[180px]"
              >
                · {item.title}
              </button>
            ))}
            {createdToday.length > 5 && (
              <span className="text-[11px] text-text-muted py-1">+{createdToday.length - 5}</span>
            )}
          </div>
        </div>
      )}

      {/* Inbox */}
      {inboxItems.length > 0 && (
        <div className="mt-3">
          <SectionLabel>
            inbox <span className="text-error font-medium text-[13px] normal-case tracking-normal">{inboxItems.length}</span>
          </SectionLabel>
          <InboxPreview items={inboxItems} />
        </div>
      )}

      {/* Audit */}
      <HealthBar />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium tracking-[1.2px] uppercase text-text-muted mb-1.5 mt-4 first:mt-0">
      {children}
    </div>
  );
}
