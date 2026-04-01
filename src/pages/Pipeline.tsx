// pages/Pipeline.tsx — Pipeline + Triage page
// Wireframe: mindroot-wireframe-triage-pipeline-v2.html
// Two tabs: Pipeline (funnel + stage rows) and Triage (swipe cards)

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { usePipeline } from '@/hooks/usePipeline';
import { GENESIS_STAGES } from '@/types/item';
import type { AtomItem } from '@/types/item';
import { STAGE_COLORS, MODULE_COLORS } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';
import { getBelowFloor } from '@/engine/fsm';

type Tab = 'pipeline' | 'triage';

export function PipelinePage() {
  const [tab, setTab] = useState<Tab>('pipeline');

  return (
    <div className="px-5 pb-4">
      {/* Header */}
      <div className="pt-4 pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-text-heading">Pipeline</h1>
        <div className="text-[13px] text-text-muted mt-0.5">7 estagios · Genesis v5</div>
      </div>

      {/* Tab bar */}
      <div className="flex bg-surface rounded-lg p-[3px] mb-4">
        <TabButton active={tab === 'pipeline'} onClick={() => setTab('pipeline')}>Pipeline</TabButton>
        <TabButton active={tab === 'triage'} onClick={() => setTab('triage')}>Triage</TabButton>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'pipeline' ? (
          <motion.div key="pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PipelineView />
          </motion.div>
        ) : (
          <motion.div key="triage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TriageView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-center py-2 text-[13px] rounded-lg transition-all ${
        active ? 'bg-card font-medium text-text-heading shadow-sm' : 'text-text-muted'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Pipeline View ─────────────────────────────────────

function PipelineView() {
  const { items } = useItems();
  const [expanded, setExpanded] = useState<number | null>(null);

  const activeItems = useMemo(
    () => items.filter((i) => i.status !== 'completed' && i.status !== 'archived'),
    [items],
  );

  const byStage = useMemo(() => {
    const grouped: Record<number, AtomItem[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    activeItems.forEach((i) => {
      if (grouped[i.genesis_stage]) grouped[i.genesis_stage].push(i);
    });
    return grouped;
  }, [activeItems]);

  const belowFloor = useMemo(() => getBelowFloor(activeItems), [activeItems]);
  const maxCount = Math.max(1, ...Object.values(byStage).map((arr) => arr.length));

  return (
    <div>
      {/* Funnel */}
      <div className="flex items-end gap-[3px] h-12 px-1 mb-8">
        {GENESIS_STAGES.map((s) => {
          const count = byStage[s.stage]?.length ?? 0;
          const height = maxCount > 0 ? Math.max(4, (count / maxCount) * 48) : 4;
          return (
            <div key={s.stage} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-text-muted">{count}</span>
              <div
                className="w-full rounded-t"
                style={{ height: `${height}px`, background: STAGE_COLORS[s.stage] }}
              />
              <span className="text-[9px] text-text-muted">{s.geometry}</span>
            </div>
          );
        })}
      </div>

      {/* Below floor banner */}
      {belowFloor.length > 0 && (
        <div className="bg-[#FAEEDA] rounded-lg px-3.5 py-2.5 mb-3 flex items-center gap-2 text-xs text-[#854F0B] font-medium">
          <span>⚠</span>
          <span>{belowFloor.length} items abaixo do floor</span>
        </div>
      )}

      {/* Stage rows */}
      <div className="space-y-0.5">
        {GENESIS_STAGES.map((s) => {
          const stageItems = byStage[s.stage] ?? [];
          const isExpanded = expanded === s.stage;

          return (
            <div key={s.stage}>
              <button
                onClick={() => setExpanded(isExpanded ? null : s.stage)}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl hover:bg-surface transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base"
                  style={{ background: STAGE_COLORS[s.stage] }}
                >
                  {s.geometry}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[11px] text-text-muted">{s.label}</div>
                </div>
                <span className={`text-lg font-medium ${stageItems.length === 0 ? 'text-text-muted font-light' : ''}`}>
                  {stageItems.length}
                </span>
              </button>

              {/* Expanded items */}
              <AnimatePresence>
                {isExpanded && stageItems.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-3 pb-2"
                  >
                    {stageItems.map((item) => (
                      <StageItem key={item.id} item={item} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageItem({ item }: { item: AtomItem }) {
  const moduleColor = item.module ? MODULE_COLORS[item.module] : '#8a8a8a';
  const typeColor = item.type ? getTypeColor(item.type) : '#8a8a8a';

  return (
    <div className="flex items-center gap-2 p-2 px-2.5 mt-1 rounded-lg bg-card border border-border text-[13px]">
      <div className="w-[3px] h-6 rounded-sm shrink-0" style={{ background: moduleColor }} />
      <span className="flex-1 truncate">{item.title}</span>
      {item.type && (
        <span
          className="text-[10px] font-medium px-2 py-px rounded-md shrink-0"
          style={{ background: `${typeColor}18`, color: typeColor }}
        >
          {item.type}
        </span>
      )}
    </div>
  );
}

// ─── Triage View ───────────────────────────────────────

function TriageView() {
  const { items } = useItems();
  const { classify } = usePipeline();
  const [currentIdx, setCurrentIdx] = useState(0);

  const inboxItems = useMemo(
    () => items.filter((i) => i.state === 'inbox'),
    [items],
  );

  const current = inboxItems[currentIdx];
  const total = inboxItems.length;

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl text-[#1D9E75] mb-3">○</div>
        <h3 className="text-lg font-medium mb-1.5">Inbox limpo</h3>
        <p className="text-[13px] text-text-muted">Todos os items foram triados</p>
      </div>
    );
  }

  const handleConfirm = () => {
    if (current) {
      // Quick classify with suggested type/module (placeholder — real AI triage in Fase 5)
      classify(current.id, 'note', 'mind');
    }
    next();
  };

  const handleSkip = () => next();

  const next = () => {
    if (currentIdx < total - 1) setCurrentIdx((i) => i + 1);
    else setCurrentIdx(0);
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-text-muted text-[13px]">
          <span className="text-xl font-medium text-text-heading">{currentIdx + 1}</span>
          <span>/</span>
          <span>{total}</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-5">
        {inboxItems.slice(0, 10).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentIdx ? 'w-5 bg-text-heading' : i < currentIdx ? 'w-2 bg-[#1D9E75]' : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>

      {/* Swipe card */}
      {current && (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="bg-card border border-border rounded-2xl p-5 mb-4"
          >
            {/* Module bar */}
            <div
              className="w-full h-[3px] rounded-sm mb-4"
              style={{ background: current.module ? MODULE_COLORS[current.module] : '#9C9A92' }}
            />

            {/* Raw text */}
            <div className="text-lg leading-relaxed mb-5">
              <span className="text-sm text-text-muted mr-1.5">·</span>
              {current.title}
            </div>

            {/* AI suggestion placeholder */}
            <div className="bg-surface rounded-xl p-3.5 mb-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7F77DD] to-[#378ADD] flex items-center justify-center text-[10px] text-white font-medium">
                  A
                </div>
                <span className="text-xs text-text-muted">sugestao do triage</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                  task
                </span>
                <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg bg-[#EEEDFE] text-[#534AB7]">
                  work
                </span>
              </div>
            </div>

            {/* Notes */}
            {current.notes && (
              <p className="text-xs text-text-muted mb-2">{current.notes}</p>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 py-2">
        <button
          onClick={handleSkip}
          className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted text-lg"
          aria-label="Pular"
        >
          ←
        </button>
        <button
          onClick={handleConfirm}
          className="w-14 h-14 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-xl shadow-lg shadow-[#1D9E75]/25"
          aria-label="Confirmar"
        >
          ✓
        </button>
      </div>
      <div className="flex justify-center gap-9 text-[10px] text-text-muted mt-1.5">
        <span>pular</span>
        <span>confirmar</span>
      </div>
    </div>
  );
}
