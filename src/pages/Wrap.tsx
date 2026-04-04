// pages/Wrap.tsx — 7-step wrap stepper
// Wireframe: mindroot-wireframe-wrap.html
// Steps: soul → items → decided → connections → seeds → audit → commit

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWrap } from '@/hooks/useWrap';
import { useItems } from '@/hooks/useItems';
import { useFullAudit } from '@/hooks/useAudit';
import { useNav } from '@/hooks/useNav';
import { getCreatedToday, getModifiedToday, computeAudit } from '@/engine/wrap';
import { StageBadge } from '@/components/atoms/StageBadge';
import { EMOTIONS } from '@/types/item';
import type { Emotion, EnergyLevel, AtomItem, AtomRelation } from '@/types/item';
import { toast } from '@/store/toast-store';
import { usePipeline } from '@/hooks/usePipeline';
import { getTypeColor } from '@/components/atoms/tokens';

const STEPS = [
  { n: '01', name: 'soul', label: '' },
  { n: '02', name: 'items', label: '' },
  { n: '03', name: 'decided', label: '' },
  { n: '04', name: 'connections', label: '' },
  { n: '05', name: 'seeds', label: 'opcional' },
  { n: '06', name: 'audit', label: 'auto' },
  { n: '07', name: 'commit', label: '' },
];

export function WrapPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [confirmCommit, setConfirmCommit] = useState(false);
  const { items } = useItems();
  const { startWrap, session, updateSession, commitWrap, loading } = useWrap();
  const { capture } = usePipeline();
  const { navigate } = useNav();

  // Local state for soul step
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [decisions, setDecisions] = useState<string[]>([]);
  const [newDecision, setNewDecision] = useState('');
  const [nextSteps, setNextSteps] = useState<string[]>(['']);

  const created = useMemo(() => getCreatedToday(items), [items]);
  const modified = useMemo(() => getModifiedToday(items), [items]);
  const audit = useMemo(() => computeAudit(items), [items]);
  const { data: fullAudit, isLoading: auditLoading } = useFullAudit();

  useEffect(() => { startWrap(); }, []);

  const goNext = () => {
    // Auto-flush pending decision input
    if (step === 2 && newDecision.trim()) {
      setDecisions([...decisions, newDecision.trim()]);
      setNewDecision('');
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleCommit();
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleCommit = async () => {
    const validNext = nextSteps.filter(Boolean);
    if (validNext.length === 0) {
      toast.error('Adicione pelo menos um proximo passo');
      return;
    }
    if (session) {
      updateSession({
        soul: {
          ...session.soul,
          crepusculo: { emotion: (selectedEmotions[0] ?? 'neutro') as Emotion, energy },
        },
        decided: decisions,
        next: validNext,
      });
    }
    await commitWrap();

    // Create inbox items from next steps
    for (const step of validNext) {
      try {
        await capture(step);
      } catch { /* non-blocking */ }
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="px-5 text-center py-16">
        <div className="text-5xl text-accent mb-4">
          <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
            <path d="M22 32l6 6 14-14" stroke="var(--color-accent)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-medium mb-1.5">wrap commitado</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {new Date().toLocaleDateString('pt-BR')} · crepusculo
        </p>
        <button
          onClick={() => navigate('home')}
          className="mt-8 text-[15px] text-accent font-medium"
        >
          boa noite ○
        </button>
      </div>
    );
  }

  const s = STEPS[step];

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)]">
      {/* Top */}
      <div className="px-5 pt-4 pb-3 border-b border-border flex justify-between items-end">
        <div>
          <h1 className="text-lg font-medium">wrap · {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</h1>
          <p className="text-xs text-text-muted">crepusculo</p>
        </div>
        <span className="text-xs text-text-muted">{step + 1}/7</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 px-5 py-3">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === step ? 'w-6 bg-accent-light' : i < step ? 'w-2 bg-accent-lighter' : 'w-2 bg-border'
            }`}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      {/* Step header */}
      <div className="px-5 pb-2 flex items-baseline gap-2">
        <span className="text-[11px] font-medium text-accent-lighter">{s.n}</span>
        <span className="text-[15px] font-medium">{s.name}</span>
        {s.label && <span className="text-[11px] text-text-muted ml-auto">{s.label}</span>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {step === 0 && <SoulStep emotions={selectedEmotions} setEmotions={setSelectedEmotions} energy={energy} setEnergy={setEnergy} />}
            {step === 1 && <ItemsStep created={created} modified={modified} />}
            {step === 2 && <DecidedStep decisions={decisions} setDecisions={setDecisions} newDecision={newDecision} setNewDecision={setNewDecision} />}
            {step === 3 && <ConnectionsStep items={items} createdToday={created} modifiedToday={modified} />}
            {step === 4 && <SeedsStep />}
            {step === 5 && <AuditStep audit={audit} fullAudit={fullAudit ?? null} auditLoading={auditLoading} />}
            {step === 6 && <CommitStep created={created} modified={modified} decisions={decisions} audit={audit} nextSteps={nextSteps} setNextSteps={setNextSteps} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="px-5 py-2.5 border-t border-border">
        {step === STEPS.length - 1 && confirmCommit ? (
          <div className="bg-accent-bg border border-accent/20 rounded-xl p-4 text-center">
            <p className="text-sm text-accent font-medium mb-2">commitar este wrap?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmCommit(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-text-muted">
                voltar
              </button>
              <button onClick={handleCommit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium disabled:opacity-50">
                {loading ? 'commitando...' : 'confirmar ○'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <button onClick={goBack} className={`text-sm text-accent ${step === 0 ? 'invisible' : ''}`}>
              voltar
            </button>
            <button
              onClick={step === STEPS.length - 1 ? () => setConfirmCommit(true) : goNext}
              disabled={loading}
              className={`rounded-xl px-7 py-3 text-sm font-medium text-white ${
                step === STEPS.length - 1 ? 'bg-success-text' : 'bg-accent'
              } disabled:opacity-50`}
            >
              {step === STEPS.length - 1 ? 'commitar ○' : 'proximo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────

function SoulStep({ emotions, setEmotions, energy, setEnergy }: {
  emotions: string[]; setEmotions: (e: string[]) => void;
  energy: EnergyLevel; setEnergy: (e: EnergyLevel) => void;
}) {
  const toggleEmotion = (e: string) => {
    setEmotions(emotions.includes(e) ? emotions.filter((x) => x !== e) : [...emotions, e]);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">como voce esta saindo hoje?</div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {EMOTIONS.map((e) => (
          <button
            key={e}
            onClick={() => toggleEmotion(e)}
            className={`px-3 py-1 rounded-2xl border text-xs transition-all ${
              emotions.includes(e) ? 'border-accent-light bg-accent-bg text-accent' : 'border-border bg-card text-text-muted'
            }`}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-text-muted w-12">energy</span>
        {(['high', 'medium', 'low'] as EnergyLevel[]).map((e) => (
          <button
            key={e}
            onClick={() => setEnergy(e)}
            className={`px-3 py-1 rounded-xl border text-xs transition-all ${
              energy === e ? 'border-accent-light bg-accent-bg text-accent' : 'border-border bg-card'
            }`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

function ItemsStep({ created, modified }: { created: any[]; modified: any[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-xs font-medium text-text-muted pb-1.5 border-b border-border mb-1">criados hoje</div>
      {created.length === 0 ? (
        <p className="text-xs text-text-muted py-2">nenhum item criado hoje</p>
      ) : (
        created.map((item) => <WrapItemRow key={item.id} item={item} />)
      )}
      <div className="text-xs font-medium text-text-muted pb-1.5 border-b border-border mb-1 mt-3">modificados</div>
      {modified.length === 0 ? (
        <p className="text-xs text-text-muted py-2">nenhum item modificado hoje</p>
      ) : (
        modified.map((item) => <WrapItemRow key={item.id} item={item} />)
      )}
    </div>
  );
}

function WrapItemRow({ item }: { item: any }) {
  return (
    <div className="py-2 border-b border-surface last:border-0 flex items-center gap-2.5">
      <span className="text-xs w-[18px] text-center">{item.genesis_stage <= 7 ? ['·', '—', '△', '□', '⬠', '⬡', '○'][item.genesis_stage - 1] : '·'}</span>
      <span className="text-[13px] flex-1 truncate">{item.title}</span>
      {item.type && (
        <span className="text-[9px] font-medium px-1.5 py-px rounded-lg bg-surface text-text-muted">{item.type}</span>
      )}
    </div>
  );
}

function DecidedStep({ decisions, setDecisions, newDecision, setNewDecision }: {
  decisions: string[]; setDecisions: (d: string[]) => void;
  newDecision: string; setNewDecision: (d: string) => void;
}) {
  const addDecision = () => {
    if (newDecision.trim()) {
      setDecisions([...decisions, newDecision.trim()]);
      setNewDecision('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">decisoes</div>
      {decisions.map((d, i) => (
        <div key={i} className="py-2 border-b border-surface last:border-0 flex items-center gap-2.5">
          <div className="w-[18px] h-[18px] rounded-md bg-accent-light text-white flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
          </div>
          <span className="text-[13px]">"{d}"</span>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border border-border rounded-lg px-3 py-2 text-[13px] bg-card text-text outline-none focus:border-accent-light"
          placeholder="+ adicionar decisao..."
          value={newDecision}
          onChange={(e) => setNewDecision(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDecision()}
        />
        {newDecision.trim() && (
          <button onClick={addDecision} className="px-3 py-2 bg-accent text-white rounded-lg text-sm shrink-0">
            +
          </button>
        )}
      </div>
    </div>
  );
}

function ConnectionsStep({ items, createdToday, modifiedToday }: {
  items: AtomItem[]; createdToday: AtomItem[]; modifiedToday: AtomItem[];
}) {
  const { connect } = usePipeline();
  const [connectingItem, setConnectingItem] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const todayItems = useMemo(() => {
    const ids = new Set([...createdToday.map((i) => i.id), ...modifiedToday.map((i) => i.id)]);
    return items.filter((i) => ids.has(i.id));
  }, [items, createdToday, modifiedToday]);

  const handleConnect = async (sourceId: string, targetId: string, relation: AtomRelation) => {
    const result = await connect(sourceId, targetId, relation);
    if (result) {
      setAdded((prev) => new Set(prev).add(sourceId));
      setConnectingItem(null);
    }
  };

  if (todayItems.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">connections</div>
        <p className="text-xs text-text-muted py-4 text-center">nenhum item criado ou modificado hoje</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">
        connections
        {added.size > 0 && (
          <span className="ml-1.5 text-[10px] px-1.5 py-px rounded-md bg-success-bg text-success-text font-medium">+{added.size}</span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-3">algum item de hoje se conecta com outro?</p>
      <div className="space-y-1.5">
        {todayItems.map((item) => {
          const isConnecting = connectingItem === item.id;
          const wasConnected = added.has(item.id);
          const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';
          return (
            <div key={item.id}>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="flex-1 truncate">{item.title}</span>
                {item.type && (
                  <span className="text-[9px] px-1.5 py-px rounded" style={{ background: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}>{item.type}</span>
                )}
                {wasConnected ? (
                  <span className="text-[10px] text-success-text">✓</span>
                ) : (
                  <button onClick={() => setConnectingItem(isConnecting ? null : item.id)} className="text-[10px] text-accent shrink-0">
                    {isConnecting ? 'cancelar' : 'conectar'}
                  </button>
                )}
              </div>
              {isConnecting && (
                <WrapConnectionPicker items={items} sourceId={item.id}
                  onSelect={(tid, rel) => handleConnect(item.id, tid, rel)}
                  onCancel={() => setConnectingItem(null)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WrapConnectionPicker({ items, sourceId, onSelect, onCancel }: {
  items: AtomItem[]; sourceId: string;
  onSelect: (targetId: string, relation: AtomRelation) => void; onCancel: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [relation, setRelation] = useState<AtomRelation>('references');

  const RELATIONS: { key: AtomRelation; label: string }[] = [
    { key: 'belongs_to', label: 'pertence a' },
    { key: 'references', label: 'referencia' },
    { key: 'feeds', label: 'alimenta' },
    { key: 'blocks', label: 'bloqueia' },
    { key: 'derives', label: 'deriva de' },
    { key: 'mirrors', label: 'espelha' },
  ];

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return items.filter((i) => i.id !== sourceId && i.title.toLowerCase().includes(q)).slice(0, 5);
  }, [items, search, sourceId]);

  const target = selectedTarget ? items.find((i) => i.id === selectedTarget) : null;

  return (
    <div className="bg-surface rounded-lg p-2.5 mt-1.5 mb-2">
      {!selectedTarget ? (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus placeholder="buscar item..."
            className="w-full text-[12px] bg-card border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-accent-light mb-1.5" />
          {filtered.map((item) => (
            <button key={item.id} onClick={() => { setSelectedTarget(item.id); setSearch(''); }}
              className="w-full text-left px-2 py-1.5 text-[11px] hover:bg-card rounded transition-colors truncate">
              {item.title}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="text-[11px] text-text-muted mb-2">→ <span className="font-medium text-text">{target?.title}</span></div>
          <div className="flex flex-wrap gap-1 mb-2">
            {RELATIONS.map((r) => (
              <button key={r.key} onClick={() => setRelation(r.key)}
                className={`text-[9px] px-2 py-0.5 rounded-md border ${relation === r.key ? 'border-accent bg-accent-bg text-accent' : 'border-border text-text-muted'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button onClick={onCancel} className="flex-1 py-1.5 text-[10px] border border-border rounded-lg text-text-muted">cancelar</button>
            <button onClick={() => onSelect(selectedTarget!, relation)} className="flex-1 py-1.5 text-[10px] bg-accent text-white rounded-lg">conectar</button>
          </div>
        </>
      )}
    </div>
  );
}

function SeedsStep() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">entropia</div>
      <p className="text-xs text-text-muted py-4 text-center">items inativos serao detectados na Fase 5</p>
    </div>
  );
}

function AuditStep({ audit, fullAudit, auditLoading }: {
  audit: any;
  fullAudit: import('@/service/audit-service').AuditReport | null;
  auditLoading: boolean;
}) {
  // Prefer real Supabase data, fall back to local computeAudit counts
  const inboxCount = fullAudit?.inbox_count ?? audit.inbox_count;
  const belowFloor = fullAudit?.below_floor ?? [];
  const orphans = fullAudit?.orphans ?? [];
  const stale = fullAudit?.stale ?? [];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">saude do sistema</div>
      {auditLoading && (
        <div className="space-y-2 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-surface rounded animate-pulse" />
          ))}
        </div>
      )}
      {!auditLoading && (
        <>
          <AuditRow label="inbox" value={inboxCount} ok={inboxCount === 0} />
          <AuditRow
            label="abaixo do piso"
            value={belowFloor.length}
            ok={belowFloor.length === 0}
            detail={belowFloor.map((i) => (
              <div key={i.id} className="flex items-center gap-1.5 text-[11px] text-text-muted py-0.5">
                <span className="truncate flex-1">{i.title}</span>
                <StageBadge stage={i.genesis_stage} />
                <span>→</span>
                <StageBadge stage={i.required_floor} />
              </div>
            ))}
          />
          <AuditRow label="orfaos" value={orphans.length} ok={orphans.length === 0} />
          <AuditRow
            label="stale"
            value={stale.length}
            ok={stale.length === 0}
            detail={stale.map((i) => (
              <div key={i.id} className="flex items-center gap-1.5 text-[11px] text-text-muted py-0.5">
                <span className="truncate flex-1">{i.title}</span>
                <span className="text-[10px] font-medium px-1 rounded bg-error-bg text-error-text">{i.days_in_inbox}d</span>
              </div>
            ))}
          />
        </>
      )}
    </div>
  );
}

function AuditRow({ label, value, ok, detail }: { label: string; value: number; ok: boolean; detail?: React.ReactNode }) {
  return (
    <div className="border-b border-surface last:border-0">
      <div className="flex justify-between py-1.5 text-[13px]">
        <span>{label}</span>
        <span className={`font-medium ${ok ? 'text-success-text' : 'text-warning'}`}>
          {value} {ok ? '✓' : '!'}
        </span>
      </div>
      {!ok && detail && <div className="pb-1.5">{detail}</div>}
    </div>
  );
}

function CommitStep({ created, modified, decisions, audit, nextSteps, setNextSteps }: {
  created: any[]; modified: any[]; decisions: string[]; audit: any;
  nextSteps: string[]; setNextSteps: (s: string[]) => void;
}) {
  const updateStep = (i: number, val: string) => {
    const copy = [...nextSteps];
    copy[i] = val;
    setNextSteps(copy);
  };
  const addStep = () => setNextSteps([...nextSteps, '']);

  return (
    <>
      <div className="bg-accent-bg border border-border rounded-xl p-6 text-center">
        <div className="text-[10px] text-text-muted tracking-wider mb-4">
          · → — → △ → □ → ⬠ → ⬡ → ○
        </div>
        <h2 className="text-xl font-medium mb-1.5">wrap completo</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {created.length} criados · {modified.length} modificados · {decisions.length} decisoes
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-xl font-medium text-accent">○</div>
            <div className="text-[10px] text-text-muted mt-0.5">completude</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium text-accent">{created.length + modified.length}</div>
            <div className="text-[10px] text-text-muted mt-0.5">items</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium text-accent">
              {audit.total_active > 0 ? Math.round(((audit.total_active - audit.inbox_count - audit.below_floor) / audit.total_active) * 100) : 100}%
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">saude</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">proximos passos</div>
        {nextSteps.map((s, i) => (
          <input
            key={i}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] bg-card text-text outline-none focus:border-accent-light mb-1.5"
            value={s}
            onChange={(e) => updateStep(i, e.target.value)}
            placeholder="+ adicionar..."
          />
        ))}
        <button onClick={addStep} className="text-xs text-accent mt-1">+ adicionar</button>
      </div>
    </>
  );
}
