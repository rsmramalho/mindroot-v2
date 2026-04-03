// features/raiz/components/BuilderMiniWrap.tsx — Review + commit to Supabase
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../builder-store';
import { toSupabasePayload } from '../builder-mapper';
import { itemService } from '@/service/item-service';
import { useAppStore } from '@/store/app-store';
import type { BuilderGeneratedItem } from '../builder-types';

const TYPE_LABELS: Record<string, string> = {
  ritual: 'Ritual', habit: 'Habito', task: 'Tarefa', note: 'Nota',
};

const SLOT_LABELS: Record<string, string> = {
  aurora: 'Aurora', zenite: 'Zenite', crepusculo: 'Crepusculo',
};

interface Props {
  onDone: () => void;
  onBack: () => void;
}

export function BuilderMiniWrap({ onDone, onBack }: Props) {
  const generatedItems = useBuilderStore((s) => s.generatedItems);
  const mindmateMode = useBuilderStore((s) => s.mindmateMode);
  const user = useAppStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleCommit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      for (const item of generatedItems) {
        const payload = toSupabasePayload(item, user.id);
        await itemService.create(payload);
      }
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (err) {
      console.error('Builder commit failed:', err);
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
          <span className="text-text-heading">✓</span>
        </div>
        <p className="text-base font-medium text-text-heading">Rotina criada</p>
        {mindmateMode && (
          <p className="text-xs text-text-muted italic">✦ onde tudo comecou.</p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-text-muted hover:text-text">
          <span className="text-sm">←</span>
        </button>
        <div>
          <h2 className="text-base font-medium text-text-heading">Sua rotina</h2>
          <p className="text-xs text-text-muted">
            {generatedItems.length} {generatedItems.length === 1 ? 'item' : 'itens'} prontos para commitar
          </p>
        </div>
      </div>

      {/* Item list */}
      <div className="space-y-2 mb-8">
        {generatedItems.map((item, i) => (
          <motion.div key={item.tempId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* Commit button */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleCommit}
        disabled={loading || generatedItems.length === 0}
        className="w-full py-4 rounded-2xl text-sm font-medium bg-text-heading text-bg disabled:opacity-40">
        {loading ? 'Salvando...' : 'Confirmar rotina'}
      </motion.button>

      {mindmateMode && (
        <p className="text-center text-xs text-text-muted mt-4 italic">✦ MindMate spirit — onde tudo comecou.</p>
      )}
    </div>
  );
}

function ItemCard({ item }: { item: BuilderGeneratedItem }) {
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const slotLabel = item.ritualSlot ? SLOT_LABELS[item.ritualSlot] : null;

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-border">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text-muted">{typeLabel}</span>
          {slotLabel && (
            <>
              <span className="text-text-muted">·</span>
              <span className="text-xs text-text-muted">{slotLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
