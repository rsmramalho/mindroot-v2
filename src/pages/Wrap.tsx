// pages/Wrap.tsx — 7-step wrap stepper
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useItemMutations } from '@/hooks/useItemMutations';
import { useAppStore } from '@/store/app-store';
import type { AtomItem, Emotion, EnergyLevel } from '@/types/item';
import { EMOTIONS, POSITIVE_EMOTIONS, CHALLENGING_EMOTIONS } from '@/types/item';
import {
  getCreatedToday,
  getModifiedToday,
  getStaleItems,
  computeAudit,
  getAuditSeverity,
  getAuditColor,
  buildWrapPayload,
} from '@/engine/wrap';
import type { WrapData, WrapAudit } from '@/engine/wrap';
import { GeometryIcon } from '@/components/atoms/GeometryIcon';
import { STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { ListSkeleton } from '@/components/shared/Skeleton';

const STEPS = [
  { label: 'Soul', icon: '·' },
  { label: 'Items', icon: '—' },
  { label: 'Decidido', icon: '△' },
  { label: 'Conexoes', icon: '□' },
  { label: 'Seeds', icon: '⬠' },
  { label: 'Audit', icon: '⬡' },
  { label: 'Proximo', icon: '○' },
] as const;

export function WrapPage() {
  const { items, isLoading } = useItems();
  const { createItem } = useItemMutations();
  const user = useAppStore((s) => s.user);
  const navigate = useAppStore((s) => s.navigate);

  const [step, setStep] = useState(0);
  const [committed, setCommitted] = useState(false);

  // Step 1 — Soul
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);

  // Step 2 — Items
  const created = useMemo(() => getCreatedToday(items), [items]);
  const modified = useMemo(() => getModifiedToday(items), [items]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Step 3 — Decisions
  const [decisions, setDecisions] = useState<string[]>([]);
  const [newDecision, setNewDecision] = useState('');

  // Step 4 — Connections
  const [connections, setConnections] = useState<string[]>([]);
  const [newConnection, setNewConnection] = useState('');

  // Step 5 — Seeds
  const stale = useMemo(() => getStaleItems(items), [items]);
  const [checkedSeeds, setCheckedSeeds] = useState<Set<string>>(new Set());

  // Step 6 — Audit
  const audit: WrapAudit = useMemo(() => computeAudit(items), [items]);
  const severity = getAuditSeverity(audit);
  const auditColor = getAuditColor(severity);

  // Step 7 — Next
  const [next, setNext] = useState('');

  const canAdvance = useMemo(() => {
    if (step === 0) return emotion !== null && energy !== null;
    if (step === 6) return next.trim().length > 0;
    return true;
  }, [step, emotion, energy, next]);

  const handleCommit = useCallback(async () => {
    if (!user || !emotion || !energy) return;

    const wrapData: WrapData = {
      emotion,
      energy,
      items_created: Array.from(checkedItems),
      items_modified: Array.from(checkedItems),
      decisions,
      connections,
      seeds: Array.from(checkedSeeds),
      audit,
      next: next.trim(),
    };

    const payload = buildWrapPayload(wrapData);

    createItem.mutate({
      ...payload,
      user_id: user.id,
      tags: payload.tags,
      body: payload.body as any,
    });

    setCommitted(true);
  }, [user, emotion, energy, checkedItems, decisions, connections, checkedSeeds, audit, next, createItem]);

  const toggleItem = (id: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setter(next);
  };

  if (isLoading) return <ListSkeleton count={5} type="item" />;

  // ─── Committed state ───
  if (committed) {
    const firstName = user?.user_metadata?.name?.split(' ')[0] ?? '';
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <CommitAnimation />
        <h1 className="font-serif text-2xl" style={{ color: '#e8e0d4' }}>
          Boa noite{firstName ? `, ${firstName}` : ''}. ○
        </h1>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-2 rounded-lg font-sans text-sm"
          style={{ backgroundColor: '#c4a88220', color: '#c4a882' }}
        >
          Voltar ao inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-1" style={{ paddingBottom: '100px' }}>
      {/* ─── Stepper ─── */}
      <div className="flex items-center gap-1 px-2 py-3 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <button
              onClick={() => i <= step ? setStep(i) : undefined}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
              style={{
                backgroundColor: i === step ? '#c4a88220' : 'transparent',
                color: i <= step ? '#e8e0d4' : '#a8947840',
                cursor: i <= step ? 'pointer' : 'default',
              }}
            >
              <span className="text-[12px] font-mono">{s.icon}</span>
              <span className="text-[10px] font-sans hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="text-[8px]" style={{ color: '#a8947830' }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* ─── Step content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          className="px-2"
        >
          {step === 0 && (
            <StepSoul
              emotion={emotion}
              energy={energy}
              onEmotion={setEmotion}
              onEnergy={setEnergy}
            />
          )}
          {step === 1 && (
            <StepItems
              created={created}
              modified={modified}
              checked={checkedItems}
              onToggle={(id) => toggleItem(id, checkedItems, setCheckedItems)}
            />
          )}
          {step === 2 && (
            <StepDecisions
              decisions={decisions}
              newDecision={newDecision}
              onAdd={() => { if (newDecision.trim()) { setDecisions([...decisions, newDecision.trim()]); setNewDecision(''); } }}
              onNewChange={setNewDecision}
              onRemove={(i) => setDecisions(decisions.filter((_, idx) => idx !== i))}
            />
          )}
          {step === 3 && (
            <StepConnections
              connections={connections}
              newConnection={newConnection}
              onAdd={() => { if (newConnection.trim()) { setConnections([...connections, newConnection.trim()]); setNewConnection(''); } }}
              onNewChange={setNewConnection}
              onRemove={(i) => setConnections(connections.filter((_, idx) => idx !== i))}
            />
          )}
          {step === 4 && (
            <StepSeeds
              stale={stale}
              checked={checkedSeeds}
              onToggle={(id) => toggleItem(id, checkedSeeds, setCheckedSeeds)}
            />
          )}
          {step === 5 && (
            <StepAudit audit={audit} severity={severity} auditColor={auditColor} />
          )}
          {step === 6 && (
            <StepNext next={next} onChange={setNext} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Navigation ─── */}
      <div className="flex items-center gap-3 px-2">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-lg text-sm font-sans"
            style={{ backgroundColor: '#a8947810', color: '#a89478' }}
          >
            Voltar
          </button>
        )}
        <div className="flex-1" />
        {step < 6 ? (
          <button
            onClick={() => canAdvance && setStep(step + 1)}
            disabled={!canAdvance}
            className="px-6 py-2.5 rounded-lg text-sm font-sans font-medium transition-opacity"
            style={{
              backgroundColor: canAdvance ? '#c4a882' : '#a8947820',
              color: canAdvance ? '#111318' : '#a8947850',
            }}
          >
            Proximo
          </button>
        ) : (
          <button
            onClick={handleCommit}
            disabled={!canAdvance}
            className="px-6 py-2.5 rounded-lg text-sm font-sans font-medium transition-opacity"
            style={{
              backgroundColor: canAdvance ? '#d4b872' : '#a8947820',
              color: canAdvance ? '#111318' : '#a8947850',
            }}
          >
            Commitar ○
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Step Components
// ═══════════════════════════════════════════════════════

function StepSoul({
  emotion, energy, onEmotion, onEnergy,
}: {
  emotion: Emotion | null;
  energy: EnergyLevel | null;
  onEmotion: (e: Emotion) => void;
  onEnergy: (e: EnergyLevel) => void;
}) {
  const energyLevels: EnergyLevel[] = ['low', 'medium', 'high'];

  return (
    <div>
      <h2 className="font-serif text-base mb-4" style={{ color: '#e8e0d4' }}>
        Como voce esta?
      </h2>

      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#a89478' }}>
        Emocao
      </span>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {EMOTIONS.map((e) => {
          const isPositive = POSITIVE_EMOTIONS.includes(e);
          const isChallenging = CHALLENGING_EMOTIONS.includes(e);
          const selected = emotion === e;
          return (
            <button
              key={e}
              onClick={() => onEmotion(e)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-sans transition-all"
              style={{
                backgroundColor: selected
                  ? (isPositive ? '#8a9e7a30' : isChallenging ? '#d4856a30' : '#a8947830')
                  : '#a8947810',
                color: selected
                  ? (isPositive ? '#8a9e7a' : isChallenging ? '#d4856a' : '#a89478')
                  : '#a89478',
                border: selected ? '1px solid currentColor' : '1px solid transparent',
              }}
            >
              {e}
            </button>
          );
        })}
      </div>

      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#a89478' }}>
        Energia
      </span>
      <div className="flex gap-2">
        {energyLevels.map((level) => (
          <button
            key={level}
            onClick={() => onEnergy(level)}
            className="flex-1 py-2 rounded-lg text-[12px] font-sans transition-all"
            style={{
              backgroundColor: energy === level ? '#c4a88230' : '#a8947810',
              color: energy === level ? '#c4a882' : '#a89478',
              border: energy === level ? '1px solid #c4a88240' : '1px solid transparent',
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepItems({
  created, modified, checked, onToggle,
}: {
  created: AtomItem[];
  modified: AtomItem[];
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  const all = useMemo(() => {
    const ids = new Set<string>();
    const result: AtomItem[] = [];
    for (const item of [...created, ...modified]) {
      if (!ids.has(item.id)) { ids.add(item.id); result.push(item); }
    }
    return result;
  }, [created, modified]);

  return (
    <div>
      <h2 className="font-serif text-base mb-1" style={{ color: '#e8e0d4' }}>
        Items do dia
      </h2>
      <span className="text-[11px] font-sans mb-3 block" style={{ color: '#a89478' }}>
        {created.length} criados, {modified.length} modificados
      </span>

      <div className="flex flex-col gap-1">
        {all.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer"
            style={{ backgroundColor: checked.has(item.id) ? '#1a1d24' : 'transparent' }}
          >
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => onToggle(item.id)}
              className="sr-only"
            />
            <span
              className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px]"
              style={{
                borderColor: checked.has(item.id) ? '#8a9e7a' : '#a8947840',
                backgroundColor: checked.has(item.id) ? '#8a9e7a20' : 'transparent',
                color: checked.has(item.id) ? '#8a9e7a' : 'transparent',
              }}
            >
              {checked.has(item.id) && '\u2713'}
            </span>
            <span className="text-sm font-sans truncate" style={{ color: '#e8e0d4' }}>
              {item.title}
            </span>
          </label>
        ))}
        {all.length === 0 && (
          <span className="text-[12px] font-sans py-4 text-center" style={{ color: '#a8947850' }}>
            Nenhum item hoje
          </span>
        )}
      </div>
    </div>
  );
}

function StepDecisions({
  decisions, newDecision, onAdd, onNewChange, onRemove,
}: {
  decisions: string[];
  newDecision: string;
  onAdd: () => void;
  onNewChange: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-base mb-3" style={{ color: '#e8e0d4' }}>
        O que voce decidiu hoje?
      </h2>
      <div className="flex flex-col gap-1 mb-3">
        {decisions.map((d, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#1a1d24' }}>
            <span className="flex-1 text-sm font-sans" style={{ color: '#e8e0d4' }}>{d}</span>
            <button onClick={() => onRemove(i)} className="text-[12px]" style={{ color: '#a8947850' }}>x</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newDecision}
          onChange={(e) => onNewChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          placeholder="Uma decisao..."
          className="flex-1 bg-transparent rounded-lg px-3 py-2 text-sm font-sans outline-none"
          style={{ border: '1px solid #2a2d34', color: '#e8e0d4' }}
        />
        <button
          onClick={onAdd}
          className="px-3 py-2 rounded-lg text-sm font-sans"
          style={{ backgroundColor: '#c4a88220', color: '#c4a882' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function StepConnections({
  connections, newConnection, onAdd, onNewChange, onRemove,
}: {
  connections: string[];
  newConnection: string;
  onAdd: () => void;
  onNewChange: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-base mb-3" style={{ color: '#e8e0d4' }}>
        Conexoes do dia
      </h2>
      <div className="flex flex-col gap-1 mb-3">
        {connections.map((c, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#1a1d24' }}>
            <span className="flex-1 text-sm font-sans" style={{ color: '#e8e0d4' }}>{c}</span>
            <button onClick={() => onRemove(i)} className="text-[12px]" style={{ color: '#a8947850' }}>x</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newConnection}
          onChange={(e) => onNewChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          placeholder="Uma conexao que voce fez..."
          className="flex-1 bg-transparent rounded-lg px-3 py-2 text-sm font-sans outline-none"
          style={{ border: '1px solid #2a2d34', color: '#e8e0d4' }}
        />
        <button
          onClick={onAdd}
          className="px-3 py-2 rounded-lg text-sm font-sans"
          style={{ backgroundColor: '#c4a88220', color: '#c4a882' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function StepSeeds({
  stale, checked, onToggle,
}: {
  stale: AtomItem[];
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-base mb-1" style={{ color: '#e8e0d4' }}>
        Seeds
      </h2>
      <span className="text-[11px] font-sans mb-3 block" style={{ color: '#a89478' }}>
        Items sem update ha mais de 30 dias
      </span>

      <div className="flex flex-col gap-1">
        {stale.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer"
            style={{ backgroundColor: checked.has(item.id) ? '#1a1d24' : 'transparent' }}
          >
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => onToggle(item.id)}
              className="sr-only"
            />
            <span
              className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px]"
              style={{
                borderColor: checked.has(item.id) ? '#c4a882' : '#a8947840',
                backgroundColor: checked.has(item.id) ? '#c4a88220' : 'transparent',
                color: checked.has(item.id) ? '#c4a882' : 'transparent',
              }}
            >
              {checked.has(item.id) && '\u2713'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-sans truncate block" style={{ color: '#e8e0d4' }}>
                {item.title}
              </span>
              <span className="text-[10px] font-mono" style={{ color: '#a8947850' }}>
                ultimo update: {new Date(item.updated_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </label>
        ))}
        {stale.length === 0 && (
          <span className="text-[12px] font-sans py-4 text-center" style={{ color: '#8a9e7a' }}>
            Nenhum item stale — tudo em dia
          </span>
        )}
      </div>
    </div>
  );
}

function StepAudit({ audit, severity, auditColor }: { audit: WrapAudit; severity: string; auditColor: string }) {
  const rows = [
    { label: 'Inbox', value: audit.inbox_count },
    { label: 'Below floor', value: audit.below_floor },
    { label: 'Orfaos (stage 5+ sem conexao)', value: audit.orphans },
    { label: 'Stale (30+ dias)', value: audit.stale },
    { label: 'Total ativos', value: audit.total_active },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-serif text-base" style={{ color: '#e8e0d4' }}>
          Audit
        </h2>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
          style={{ backgroundColor: `${auditColor}20`, color: auditColor }}
        >
          {severity}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: '#1a1d24' }}>
            <span className="text-[12px] font-sans" style={{ color: '#a89478' }}>{label}</span>
            <span
              className="text-[13px] font-mono font-medium"
              style={{ color: value === 0 ? '#8a9e7a' : value <= 3 ? '#c4a872' : '#d4856a' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepNext({ next, onChange }: { next: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="font-serif text-base mb-1" style={{ color: '#e8e0d4' }}>
        Proximo
      </h2>
      <span className="text-[11px] font-sans mb-3 block" style={{ color: '#a89478' }}>
        O que voce leva para amanha? (obrigatorio)
      </span>
      <textarea
        value={next}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Minha intencao para amanha..."
        rows={3}
        className="w-full bg-transparent rounded-lg px-3 py-2 text-sm font-sans outline-none resize-none"
        style={{ border: '1px solid #2a2d34', color: '#e8e0d4' }}
      />
    </div>
  );
}

// ─── Commit animation: · → — → △ → □ → ⬠ → ⬡ → ○ ────

function CommitAnimation() {
  const stages = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex items-center gap-3">
      {stages.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.3, duration: 0.4, ease: 'easeOut' }}
        >
          <GeometryIcon stage={s} size={28} />
        </motion.div>
      ))}
    </div>
  );
}
