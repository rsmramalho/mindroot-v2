// pages/Wrap.tsx — 7-step wrap stepper
// Wireframe: mindroot-wireframe-wrap.html
// Steps: soul → items → decided → connections → seeds → audit → commit

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWrap } from '@/hooks/useWrap';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { getCreatedToday, getModifiedToday, computeAudit } from '@/engine/wrap';
import { EMOTIONS } from '@/types/item';
import type { Emotion, EnergyLevel } from '@/types/item';

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
  const { items } = useItems();
  const { startWrap, session, updateSession, commitWrap, loading } = useWrap();
  const navigate = useAppStore((s) => s.navigate);

  // Local state for soul step
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [decisions, setDecisions] = useState<string[]>([]);
  const [newDecision, setNewDecision] = useState('');
  const [nextSteps, setNextSteps] = useState<string[]>(['']);

  const created = useMemo(() => getCreatedToday(items), [items]);
  const modified = useMemo(() => getModifiedToday(items), [items]);
  const audit = useMemo(() => computeAudit(items), [items]);

  useEffect(() => { startWrap(); }, []);

  const goNext = () => {
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
    if (session) {
      updateSession({
        soul: {
          ...session.soul,
          crepusculo: { emotion: (selectedEmotions[0] ?? 'neutro') as Emotion, energy },
        },
        decided: decisions,
        next: nextSteps.filter(Boolean),
      });
    }
    await commitWrap();
    setDone(true);
  };

  if (done) {
    return (
      <div className="px-5 text-center py-16">
        <div className="text-5xl text-[#534AB7] mb-4">
          <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#534AB7" strokeWidth="3" />
            <path d="M22 32l6 6 14-14" stroke="#534AB7" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-medium mb-1.5">wrap commitado</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {new Date().toLocaleDateString('pt-BR')} · crepusculo
        </p>
        <button
          onClick={() => navigate('home')}
          className="mt-8 text-[15px] text-[#534AB7] font-medium"
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
              i === step ? 'w-6 bg-[#7F77DD]' : i < step ? 'w-2 bg-[#AFA9EC]' : 'w-2 bg-border'
            }`}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      {/* Step header */}
      <div className="px-5 pb-2 flex items-baseline gap-2">
        <span className="text-[11px] font-medium text-[#AFA9EC]">{s.n}</span>
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
            {step === 3 && <ConnectionsStep />}
            {step === 4 && <SeedsStep />}
            {step === 5 && <AuditStep audit={audit} />}
            {step === 6 && <CommitStep created={created} modified={modified} decisions={decisions} audit={audit} nextSteps={nextSteps} setNextSteps={setNextSteps} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="px-5 py-2.5 border-t border-border flex justify-between items-center">
        <button
          onClick={goBack}
          className={`text-sm text-[#534AB7] ${step === 0 ? 'invisible' : ''}`}
        >
          voltar
        </button>
        <button
          onClick={goNext}
          disabled={loading}
          className={`rounded-xl px-7 py-3 text-sm font-medium text-white ${
            step === STEPS.length - 1 ? 'bg-[#639922]' : 'bg-[#534AB7]'
          } disabled:opacity-50`}
        >
          {step === STEPS.length - 1 ? 'commitar ○' : 'proximo'}
        </button>
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
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">como voce esta saindo hoje?</div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {EMOTIONS.map((e) => (
          <button
            key={e}
            onClick={() => toggleEmotion(e)}
            className={`px-3 py-1 rounded-2xl border text-xs transition-all ${
              emotions.includes(e) ? 'border-[#7F77DD] bg-[#EEEDFE] text-[#534AB7]' : 'border-border bg-white text-text-muted'
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
              energy === e ? 'border-[#7F77DD] bg-[#EEEDFE] text-[#534AB7]' : 'border-border bg-white'
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
    <div className="bg-white border border-border rounded-xl p-4">
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
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">decisoes</div>
      {decisions.map((d, i) => (
        <div key={i} className="py-2 border-b border-surface last:border-0 flex items-center gap-2.5">
          <div className="w-[18px] h-[18px] rounded-md bg-[#7F77DD] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
          </div>
          <span className="text-[13px]">"{d}"</span>
        </div>
      ))}
      <input
        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-[#7F77DD] mt-2"
        placeholder="+ adicionar decisao..."
        value={newDecision}
        onChange={(e) => setNewDecision(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addDecision()}
      />
    </div>
  );
}

function ConnectionsStep() {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">connections</div>
      <p className="text-xs text-text-muted py-4 text-center">conexoes serao sugeridas pelo agente na Fase 5</p>
    </div>
  );
}

function SeedsStep() {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">entropia</div>
      <p className="text-xs text-text-muted py-4 text-center">items inativos serao detectados na Fase 5</p>
    </div>
  );
}

function AuditStep({ audit }: { audit: any }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">saude do sistema</div>
      <AuditRow label="inbox" value={audit.inbox_count} ok={audit.inbox_count === 0} />
      <AuditRow label="abaixo do piso" value={audit.below_floor} ok={audit.below_floor === 0} />
      <AuditRow label="orfaos" value={audit.orphans} ok={audit.orphans === 0} />
      <AuditRow label="stale" value={audit.stale} ok={audit.stale === 0} />
    </div>
  );
}

function AuditRow({ label, value, ok }: { label: string; value: number; ok: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-surface last:border-0 text-[13px]">
      <span>{label}</span>
      <span className={`font-medium ${ok ? 'text-[#639922]' : 'text-[#EF9F27]'}`}>
        {value} {ok ? '✓' : '!'}
      </span>
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
      <div className="bg-[#EEEDFE] border border-border rounded-xl p-6 text-center">
        <div className="text-[10px] text-text-muted tracking-wider mb-4">
          · → — → △ → □ → ⬠ → ⬡ → ○
        </div>
        <h2 className="text-xl font-medium mb-1.5">wrap completo</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {created.length} criados · {modified.length} modificados · {decisions.length} decisoes
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-xl font-medium text-[#534AB7]">○</div>
            <div className="text-[10px] text-text-muted mt-0.5">completude</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium text-[#534AB7]">{created.length + modified.length}</div>
            <div className="text-[10px] text-text-muted mt-0.5">items</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium text-[#534AB7]">
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
            className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] bg-white outline-none focus:border-[#7F77DD] mb-1.5"
            value={s}
            onChange={(e) => updateStep(i, e.target.value)}
            placeholder="+ adicionar..."
          />
        ))}
        <button onClick={addStep} className="text-xs text-[#534AB7] mt-1">+ adicionar</button>
      </div>
    </>
  );
}
