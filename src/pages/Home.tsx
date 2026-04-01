// pages/Home.tsx — Dashboard v2: Header → SoulCard → AtomInput → Active → Inbox → WrapBanner
import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useItemMutations } from '@/hooks/useItemMutations';
import { useSoul } from '@/hooks/useSoul';
import { useNotifications } from '@/hooks/useNotifications';
import { useAppStore } from '@/store/app-store';
import type { AtomItem, UpdateItemPayload } from '@/types/item';
import { getCurrentPeriod } from '@/types/ui';
import { triggerAutoBackup } from '@/engine/export';
import { ModuleBar } from '@/components/atoms/ModuleBar';
import { TypeChip } from '@/components/atoms/TypeChip';
import { AtomInput } from '@/components/input/AtomInput';
import SoulCard from '@/components/dashboard/SoulCard';
import WrapBanner from '@/components/dashboard/WrapBanner';
import DashboardView from '@/components/dashboard/DashboardView';
import CheckInPrompt from '@/components/soul/CheckInPrompt';
import EditSheet from '@/components/shared/EditSheet';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import NotificationPrompt from '@/components/shared/NotificationPrompt';
import AiSuggestions from '@/components/dashboard/AiSuggestions';
import { ListSkeleton } from '@/components/shared/Skeleton';

export function HomePage() {
  const { items, isLoading, inboxItems } = useItems();
  const { completeMutation, uncompleteMutation, updateMutation, deleteMutation } = useItemMutations();
  const { checkIn, onItemComplete, startPicking, selectEmotion, skip, dismiss } = useSoul();
  const { updateItems } = useNotifications();
  const user = useAppStore((s) => s.user);
  const navigate = useAppStore((s) => s.navigate);

  // Feed items to notification system for overdue counting
  useEffect(() => {
    if (items.length > 0) updateItems(items);
  }, [items, updateItems]);

  // Auto-backup: weekly download if due
  useEffect(() => {
    if (items.length > 0) triggerAutoBackup(items);
  }, [items]);

  // Period greeting
  const period = getCurrentPeriod();
  const firstName = user?.user_metadata?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? '';
  const greeting = `${period.greeting}${firstName ? `, ${firstName}` : ''}`;
  const dateStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Active items (not inbox, not completed, not archived) — top 5
  const activeItems = useMemo(
    () => items
      .filter((i) => i.status === 'active' && i.module)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5),
    [items]
  );

  // Edit sheet state
  const [editingItem, setEditingItem] = useState<AtomItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deletingItem = deletingId ? items.find((i) => i.id === deletingId) : null;

  const handleComplete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      completeMutation.mutate(id);
      onItemComplete(item);
    }
  };

  const handleUncomplete = (id: string) => uncompleteMutation.mutate(id);

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id);
  }, []);

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
      setDeletingId(null);
    }
  };

  const handleArchive = (id: string) => {
    updateMutation.mutate({ id, updates: { status: 'archived' as const } });
  };

  const handleEdit = (id: string, updates: Partial<AtomItem>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleOpenSheet = useCallback((item: AtomItem) => {
    setEditingItem(item);
  }, []);

  const handleSheetSave = (id: string, updates: UpdateItemPayload) => {
    updateMutation.mutate({ id, updates });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-1">
        <div className="h-12 animate-pulse rounded-lg" style={{ backgroundColor: '#a8947808' }} />
        <ListSkeleton count={5} type="item" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-1" style={{ paddingBottom: '80px' }}>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-serif text-xl"
            style={{ color: '#e8e0d4', letterSpacing: '-0.02em' }}
          >
            {greeting}
          </h1>
          <span className="text-[12px] font-sans capitalize" style={{ color: '#a89478' }}>
            {dateStr}
          </span>
        </div>
      </div>

      {/* ─── Soul Card ─── */}
      <SoulCard items={items} />

      {/* ─── Atom Input ─── */}
      <AtomInput />

      {/* Notification permission prompt */}
      <NotificationPrompt />

      {/* AI contextual suggestions */}
      <AiSuggestions items={items} />

      {/* ─── Active Items (top 5) ─── */}
      {activeItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SectionHeader title="Ativos" count={activeItems.length} />
          <div className="flex flex-col gap-1">
            {activeItems.map((item) => (
              <ActiveItemCard
                key={item.id}
                item={item}
                onComplete={handleComplete}
                onOpenSheet={handleOpenSheet}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* ─── Inbox Preview ─── */}
      {inboxItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SectionHeader title="Inbox" count={inboxItems.length} />
              <span
                className="inline-flex items-center justify-center rounded-full text-[10px] font-mono"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#d4856a20',
                  color: '#d4856a',
                }}
              >
                {inboxItems.length}
              </span>
            </div>
            <button
              onClick={() => navigate('inbox')}
              className="text-[12px] font-sans font-medium"
              style={{ color: '#c4a882' }}
            >
              triar →
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {inboxItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: '#1a1d24' }}
              >
                <span className="text-sm font-sans" style={{ color: '#e8e0d4' }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ─── Wrap Banner (crepusculo only, 17h+) ─── */}
      <WrapBanner
        items={items}
        onStartWrap={() => navigate('ritual' as any)}
      />

      {/* ─── Full Dashboard (existing sections: overdue, focus, today, modules) ─── */}
      <DashboardView
        items={items}
        onComplete={handleComplete}
        onUncomplete={handleUncomplete}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onOpenSheet={handleOpenSheet}
      />

      {/* Overlays */}
      <CheckInPrompt
        state={checkIn}
        onStartPicking={startPicking}
        onSelectEmotion={selectEmotion}
        onSkip={skip}
        onDismiss={dismiss}
      />

      <EditSheet
        item={editingItem}
        onSave={handleSheetSave}
        onClose={() => setEditingItem(null)}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Excluir item"
        description={deletingItem ? `"${deletingItem.title}" sera removido permanentemente.` : ''}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        confirmColor="#e85d5d"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-2" style={{ padding: '0 4px' }}>
      <span
        className="text-[10px] font-sans font-semibold uppercase tracking-wider"
        style={{ color: '#a89478' }}
      >
        {title}
      </span>
      <span
        className="text-[10px] font-mono"
        style={{ color: '#a8947840' }}
      >
        {count}
      </span>
    </div>
  );
}

function ActiveItemCard({
  item,
  onComplete,
  onOpenSheet,
}: {
  item: AtomItem;
  onComplete: (id: string) => void;
  onOpenSheet: (item: AtomItem) => void;
}) {
  const progress = item.body.operations?.progress ?? null;
  const deadline = item.body.operations?.deadline ?? item.body.operations?.due_date ?? null;

  return (
    <ModuleBar module={item.module}>
      <div
        className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-surface/50 transition-colors"
        onClick={() => onOpenSheet(item)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(item.id); }}
              aria-label={`Completar: ${item.title}`}
              className="flex-shrink-0 w-4 h-4 rounded-full border"
              style={{ borderColor: '#a8947840' }}
            />
            <span className="text-sm font-sans truncate" style={{ color: '#e8e0d4' }}>
              {item.title}
            </span>
          </div>
          {item.type && <TypeChip type={item.type} />}
        </div>

        {/* Progress + deadline row */}
        {(progress !== null || deadline) && (
          <div className="flex items-center gap-3 mt-1.5 pl-6">
            {progress !== null && (
              <div className="flex items-center gap-1.5 flex-1">
                <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${progress}%`, backgroundColor: '#8a9e7a' }}
                  />
                </div>
                <span className="text-[10px] font-mono" style={{ color: '#a8947860' }}>
                  {progress}%
                </span>
              </div>
            )}
            {deadline && (
              <span className="text-[10px] font-mono" style={{ color: '#a8947860' }}>
                {new Date(deadline).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        )}
      </div>
    </ModuleBar>
  );
}
