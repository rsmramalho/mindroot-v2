// companion/CompanionSheet.tsx — Contextual AI companion
// Wireframe: mindroot-wireframe-ai-companion.html
// Bottom sheet (mobile) / side panel (desktop). Ephemeral — no persistent chat.
// Silence is valid: if no suggestions, shows minimal state.

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useRaiz } from '@/hooks/useRaiz';
import { useNav } from '@/hooks/useNav';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useSoulStore } from '@/store/soul-store';
import { generateSuggestions, type CompanionContext } from '@/engine/companion';
import { differenceInDays, parseISO } from 'date-fns';
import type { Emotion } from '@/types/item';

interface CompanionSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CompanionSheet({ open, onClose }: CompanionSheetProps) {
  const { items } = useItems();
  const { staleCount, domains } = useRaiz();
  const { navigate } = useNav();
  const { isDesktop } = useBreakpoint();
  const soulEmotion = useSoulStore((s) => s.emotion);
  const soulEnergy = useSoulStore((s) => s.energy);

  const context = useMemo<CompanionContext>(() => {
    const inboxItems = items.filter((i) => i.state === 'inbox');
    const lastWrap = items
      .filter((i) => i.type === 'wrap')
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

    const daysSinceWrap = lastWrap
      ? differenceInDays(new Date(), parseISO(lastWrap.created_at))
      : 999;

    const emptyDomains = domains.filter((d) => d.status === 'empty').map((d) => d.label);

    return {
      inboxCount: inboxItems.length,
      staleCount,
      totalItems: items.length,
      lastWrapDate: lastWrap?.created_at ?? null,
      currentEmotion: (soulEmotion as Emotion) ?? null,
      currentEnergy: soulEnergy,
      emptyDomains,
      daysSinceWrap,
    };
  }, [items, staleCount, domains, soulEmotion, soulEnergy]);

  const suggestions = useMemo(() => generateSuggestions(context), [context]);

  const handleAction = (page: string) => {
    navigate(page as any);
    onClose();
  };

  if (!open) return null;

  // Desktop: side panel
  if (isDesktop) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          className="fixed top-0 right-0 w-80 h-dvh bg-bg border-l border-border z-40 flex flex-col"
        >
          <CompanionContent
            context={context}
            suggestions={suggestions}
            onAction={handleAction}
            onClose={onClose}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Mobile: bottom sheet
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-bg/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-bg border-t border-border rounded-t-2xl max-h-[80dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>
          <CompanionContent
            context={context}
            suggestions={suggestions}
            onAction={handleAction}
            onClose={onClose}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CompanionContent({ context, suggestions, onAction, onClose }: {
  context: CompanionContext;
  suggestions: ReturnType<typeof generateSuggestions>;
  onAction: (page: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          {/* Companion avatar — gradient orb */}
          <div className="w-10 h-10 rounded-full relative flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-ai-blue), var(--color-success))' }} />
            <div className="w-6 h-6 rounded-full"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-ai-blue), var(--color-success))' }} />
          </div>
          <div>
            <div className="text-sm font-medium">companheiro</div>
            <div className="text-[11px] text-text-muted">
              {suggestions.length > 0 ? `${suggestions.length} observacoes` : 'tudo tranquilo'}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-xs text-text-muted">fechar</button>
      </div>

      {/* Context pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <ContextPill label={`${context.inboxCount} inbox`} warn={context.inboxCount >= 5} />
        <ContextPill label={`${context.totalItems} items`} />
        {context.currentEmotion && <ContextPill label={context.currentEmotion} />}
        {context.daysSinceWrap < 999 && <ContextPill label={`wrap ${context.daysSinceWrap}d`} warn={context.daysSinceWrap >= 3} />}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 ? (
        <div className="space-y-2.5">
          {suggestions.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-[14px] p-4">
              <div className="flex items-start gap-2.5">
                <span className="text-accent text-xs mt-0.5">
                  {s.type === 'nudge' ? '◆' : s.type === 'action' ? '▸' : '·'}
                </span>
                <div className="flex-1">
                  <p className="text-[13px] text-text leading-relaxed">{s.text}</p>
                  {s.action && (
                    <button
                      onClick={() => onAction(s.action!.page)}
                      className="mt-2 text-xs text-accent font-medium"
                    >
                      {s.action.label} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-2xl text-text-muted/30 mb-2">○</div>
          <p className="text-xs text-text-muted">sistema saudavel. nada pra sugerir.</p>
        </div>
      )}
    </div>
  );
}

function ContextPill({ label, warn }: { label: string; warn?: boolean }) {
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-medium ${
      warn ? 'bg-warning-bg text-warning-text' : 'bg-surface text-text-muted'
    }`}>
      {label}
    </span>
  );
}
