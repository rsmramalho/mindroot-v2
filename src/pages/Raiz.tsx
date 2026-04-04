// pages/Raiz.tsx — Raiz: the Genesis applied to life
// Two wireframes, ONE experience.
//
// First use: Welcome → Panorama (empty = possibility) → tap domain → inventory
// Every use after: Panorama (with data) → tap domain → inventory
// Always: "depois, talvez". Skip = easy. Pause = preserves. The geometry waits.

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipeline } from '@/hooks/usePipeline';
import { useRaiz } from '@/hooks/useRaiz';
import { useItems } from '@/hooks/useItems';
import { RoutineBuilder } from '@/features/raiz/components/RoutineBuilder';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { supabase } from '@/service/supabase';
import { RAIZ_DOMAINS, RAIZ_DOORS, type RaizDomain, type RaizDoorKey } from '@/config/raiz';
import { MODULE_COLORS } from '@/components/atoms/tokens';

const anim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };

type RaizMode = 'welcome' | 'panorama' | 'doors' | 'inventory';

export function RaizPage() {
  const { domains: domainHealthRaw, activeCount: healthyCount, healthPct, totalItems } = useRaiz();
  const { items: allItems } = useItems();
  const { captureWithModule } = usePipeline();
  const [builderOpen, setBuilderOpen] = useState(false);
  const { navigate } = useNav();
  const user = useAppStore((s) => s.user);

  const hasSeenWelcome = user?.user_metadata?.raiz_welcomed === true;
  const [mode, setMode] = useState<RaizMode>(hasSeenWelcome ? 'panorama' : 'welcome');
  const [activeDomainKey, setActiveDomainKey] = useState<string | null>(null);
  const [doorKey, setDoorKey] = useState<RaizDoorKey | null>(null);
  const [domainInputs, setDomainInputs] = useState<Record<string, string[]>>({});

  // Merge hook data with full domain config (prompt, examples)
  const domainHealth = useMemo(() => {
    return RAIZ_DOMAINS.map((domain) => {
      const health = domainHealthRaw.find((d) => d.key === domain.key);
      return { ...domain, count: health?.count ?? 0, oldest: health?.oldest ?? 0, status: health?.status ?? 'empty' as const };
    });
  }, [domainHealthRaw]);

  const sessionCount = Object.values(domainInputs).flat().length;
  const touchedDomains = Object.keys(domainInputs).filter((k) => (domainInputs[k]?.length ?? 0) > 0);

  const handleCapture = async (domainKey: string, text: string) => {
    if (!text.trim()) return;
    // Auto-save: persist to inbox immediately
    const domain = RAIZ_DOMAINS.find((d) => d.key === domainKey);
    const module = domain?.module ?? 'bridge';
    await captureWithModule(text.trim(), module, [`#domain:${domainKey}`, '#raiz']);
    // Track locally for session display
    setDomainInputs((prev) => ({
      ...prev,
      [domainKey]: [...(prev[domainKey] ?? []), text.trim()],
    }));
  };


  const markWelcomed = async () => {
    try {
      await supabase.auth.updateUser({ data: { raiz_welcomed: true } });
    } catch {
      // Non-blocking
    }
  };

  const enterPanorama = () => {
    markWelcomed();
    setMode('panorama');
  };

  const enterDomain = (key: string) => {
    setActiveDomainKey(key);
    setDoorKey(null);
    setMode('inventory');
  };

  const enterDoors = () => {
    setMode('doors');
  };

  const enterDoorSession = (key: RaizDoorKey) => {
    setDoorKey(key);
    const door = RAIZ_DOORS.find((d) => d.key === key)!;
    setActiveDomainKey(door.domainKeys[0]);
    setMode('inventory');
  };

  // Door session navigation
  const doorDomains = doorKey ? RAIZ_DOORS.find((d) => d.key === doorKey)?.domainKeys ?? [] : [];
  const currentDoorIdx = doorKey && activeDomainKey ? doorDomains.indexOf(activeDomainKey) : -1;

  const nextDomain = () => {
    if (doorKey && currentDoorIdx < doorDomains.length - 1) {
      setActiveDomainKey(doorDomains[currentDoorIdx + 1]);
    } else {
      setMode('panorama');
    }
  };

  const prevDomain = () => {
    if (doorKey && currentDoorIdx > 0) {
      setActiveDomainKey(doorDomains[currentDoorIdx - 1]);
    } else {
      setMode('panorama');
    }
  };

  const activeDomain = activeDomainKey ? RAIZ_DOMAINS.find((d) => d.key === activeDomainKey) : null;

  return (
    <div className="flex flex-col min-h-0">
      <AnimatePresence mode="wait">

        {/* ═══ WELCOME — first time only ═══ */}
        {mode === 'welcome' && (
          <motion.div key="welcome" {...anim}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center min-h-[calc(100dvh-120px)]"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border border-accent-light/15 animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-2 rounded-full border border-accent-light/25 animate-pulse" style={{ animationDuration: '3.5s' }} />
              <div className="absolute inset-4 rounded-full border border-accent-light/35 animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ai-purple to-ai-green flex items-center justify-center">
                  <span className="text-white text-lg">·</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-medium leading-snug mb-3">
              vamos organizar<br />sua vida, <span className="font-medium">uma<br />gaveta por vez.</span>
            </h1>
            <p className="text-sm text-text-muted leading-relaxed mb-10 max-w-[280px]">
              todo mundo tem gavetas. digitais, fisicas, mentais.<br />
              a gente comeca olhando o que existe — sem mover nada, sem julgar.
            </p>

            <button
              onClick={enterPanorama}
              className="bg-gradient-to-r from-accent-light to-accent text-white rounded-xl px-8 py-3.5 text-sm font-medium mb-3 w-full max-w-[240px]"
            >
              ver minhas gavetas
            </button>
            <button
              onClick={() => { markWelcomed(); navigate('home'); }}
              className="text-xs text-text-muted"
            >
              depois, talvez
            </button>
          </motion.div>
        )}

        {/* ═══ PANORAMA — the heart ═══ */}
        {mode === 'panorama' && (
          <motion.div key="panorama" {...anim} className="px-5 pb-6">
            <div className="pt-4 pb-3">
              <h1 className="text-2xl font-medium tracking-tight">raiz</h1>
              <p className="text-[13px] text-text-muted">sua vida · 9 gavetas</p>
            </div>

            {/* Health ring */}
            {healthyCount > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-border" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15.5" fill="none"
                      className="stroke-success"
                      strokeWidth="3" strokeLinecap="round"
                      initial={{ strokeDasharray: '0 100' }}
                      animate={{ strokeDasharray: `${healthPct} ${100 - healthPct}` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">{healthPct}%</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{healthyCount}/9 gavetas ativas</div>
                  <div className="text-xs text-text-muted mt-0.5">{totalItems} items total</div>
                </div>
              </div>
            )}

            {/* Stale alerts */}
            {domainHealth.filter((d) => d.status === 'stale').map((d) => (
              <button
                key={d.key}
                onClick={() => enterDomain(d.key)}
                className="w-full bg-warning-bg border border-warning/20 rounded-lg px-3.5 py-2.5 mb-1.5 flex items-center gap-2 text-xs text-warning-text text-left"
              >
                <span>{d.emoji}</span>
                <span><b>{d.label}</b> — {d.oldest}d sem atividade</span>
              </button>
            ))}

            {/* 3x3 Domain Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 mt-2">
              {domainHealth.map((domain) => {
                const sessionItems = domainInputs[domain.key]?.length ?? 0;
                const displayCount = Math.max(domain.count, sessionItems);
                const isEmpty = domain.status === 'empty' && sessionItems === 0;

                return (
                  <button
                    key={domain.key}
                    onClick={() => enterDomain(domain.key)}
                    className={`relative rounded-xl border p-3 text-left transition-all ${
                      isEmpty
                        ? 'bg-surface/50 border-border/30 opacity-50 hover:opacity-75'
                        : 'bg-card border-border hover:border-accent-light/50'
                    }`}
                  >
                    <div
                      className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl"
                      style={{
                        background: MODULE_COLORS[domain.module],
                        opacity: isEmpty ? 0.3 : 0.8,
                      }}
                    />
                    <div className="text-lg mb-0.5">{domain.emoji}</div>
                    <div className="text-[11px] font-medium truncate">{domain.label}</div>
                    {displayCount > 0 ? (
                      <>
                        <div className="text-xs font-medium mt-1">{displayCount}</div>
                        {domain.status === 'stale' && (
                          <div className="text-[9px] text-warning">{domain.oldest}d</div>
                        )}
                      </>
                    ) : (
                      <div className="text-[10px] text-text-muted/50 mt-1">—</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Guided session button */}
            <button
              onClick={enterDoors}
              className="w-full bg-card border border-border rounded-xl p-3.5 text-center text-sm text-text-muted hover:border-accent-light/50 transition-colors mb-3"
            >
              {healthyCount > 0 ? '○ sessao guiada — completar gavetas' : '○ sessao guiada — escolher por onde comecar'}
            </button>

            {/* Routine builder button */}
            <button
              onClick={() => setBuilderOpen(true)}
              className="w-full bg-accent-bg border border-accent/20 rounded-xl p-3.5 text-center text-sm text-accent hover:border-accent/40 transition-colors mb-3"
            >
              + construir minha rotina
            </button>

            {/* Session summary (items already saved — this is feedback) */}
            {sessionCount > 0 && (
              <div className="bg-success-bg border border-success/20 rounded-xl p-4 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-success-text">{sessionCount} items salvos no inbox</span>
                  <span className="text-success-text">{touchedDomains.length} gavetas</span>
                </div>
              </div>
            )}

            {/* Empty nudge */}
            {healthyCount === 0 && sessionCount === 0 && (
              <p className="text-center text-xs text-text-muted/40 mt-2 leading-relaxed">
                toca numa gaveta pra comecar.<br />sem pressa. a geometria espera.
              </p>
            )}
          </motion.div>
        )}

        {/* ═══ DOORS — guided session picker ═══ */}
        {mode === 'doors' && (
          <motion.div key="doors" {...anim} className="px-6 pt-14 pb-6">
            <div className="text-center mb-6">
              <div className="text-text-muted text-xl mb-1">○</div>
              <h2 className="text-xl font-medium">por onde voce quer comecar?</h2>
              <p className="text-sm text-text-muted mt-1">nao existe ordem certa.<br />escolha o que faz sentido agora.</p>
            </div>

            <div className="space-y-3 mb-6">
              {RAIZ_DOORS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => enterDoorSession(d.key)}
                  className={`w-full text-left bg-card border rounded-xl p-4 transition-all relative overflow-hidden ${
                    d.recommended ? 'border-accent shadow-sm shadow-accent/5' : 'border-border'
                  }`}
                >
                  {d.recommended && (
                    <span className="absolute top-2.5 right-3 text-[10px] bg-accent-bg text-accent px-2 py-0.5 rounded-full font-medium">
                      recomendado
                    </span>
                  )}
                  <div className="text-lg mb-0.5">{d.emoji}</div>
                  <div className="text-[15px] font-medium mb-0.5">{d.title}</div>
                  <div className="text-xs text-text-muted leading-relaxed">{d.description}</div>
                  <div className="text-[10px] text-text-muted/60 mt-2 italic">{d.tag}</div>
                </button>
              ))}
            </div>

            <button onClick={() => setMode('panorama')} className="w-full text-center text-sm text-text-muted py-2">
              voltar pro panorama
            </button>

            <p className="text-center text-[11px] text-text-muted/40 leading-relaxed px-4 mt-4">
              "voce nao esta atrasado. o caos nao eh culpa sua.<br />a vida foi acontecendo e ninguem ensinou a organizar."
            </p>
          </motion.div>
        )}

        {/* ═══ INVENTORY — domain capture ═══ */}
        {mode === 'inventory' && activeDomain && (
          <DomainInventory
            key={activeDomainKey}
            domain={activeDomain}
            inputs={domainInputs[activeDomain.key] ?? []}
            persistedItems={
              allItems
                .filter(i => i.tags?.includes(`#domain:${activeDomain.key}`) && i.status !== 'archived')
                .map(i => i.title)
            }
            onAdd={(text) => handleCapture(activeDomain.key, text)}
            onBack={prevDomain}
            onNext={nextDomain}
            onPanorama={() => setMode('panorama')}
            isDoorSession={!!doorKey}
            doorProgress={doorKey ? { current: currentDoorIdx + 1, total: doorDomains.length, keys: doorDomains, inputs: domainInputs } : undefined}
          />
        )}

      </AnimatePresence>

      {/* Routine Builder overlay */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-bg">
          <RoutineBuilder onClose={() => setBuilderOpen(false)} />
        </div>
      )}
    </div>
  );
}


// ─── Domain Inventory Component ──────────────────────────

interface DoorProgress {
  current: number;
  total: number;
  keys: string[];
  inputs: Record<string, string[]>;
}

function DomainInventory({
  domain,
  inputs,
  persistedItems,
  onAdd,
  onBack,
  onNext,
  onPanorama,
  isDoorSession,
  doorProgress,
}: {
  domain: RaizDomain;
  inputs: string[];
  persistedItems: string[];
  onAdd: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
  onPanorama: () => void;
  isDoorSession: boolean;
  doorProgress?: DoorProgress;
}) {
  const [text, setText] = useState('');

  const add = () => {
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <motion.div {...anim} className="flex flex-col px-6 pt-10 pb-6 min-h-[calc(100dvh-120px)]">

      {/* Door progress dots */}
      {isDoorSession && doorProgress && (
        <div className="flex gap-1.5 mb-5 justify-center">
          {doorProgress.keys.map((dk, i) => {
            const hasCaptured = (doorProgress.inputs[dk]?.length ?? 0) > 0;
            return (
              <div
                key={dk}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < doorProgress.current
                    ? hasCaptured ? 'bg-accent' : 'bg-accent/40'
                    : i === doorProgress.current - 1
                      ? 'bg-accent scale-125'
                      : 'bg-border'
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Domain header */}
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-l-[3px]"
          style={{
            background: `color-mix(in srgb, ${MODULE_COLORS[domain.module]} 20%, transparent)`,
            borderLeftColor: MODULE_COLORS[domain.module],
          }}
        >
          {domain.emoji}
        </div>
        <div>
          {isDoorSession && doorProgress && (
            <div className="text-[11px] text-text-muted tracking-wider uppercase">
              {doorProgress.current}/{doorProgress.total}
            </div>
          )}
          <h2 className="text-lg font-medium">{domain.prompt}</h2>
        </div>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-1.5 mb-4 mt-3">
        {domain.examples.map((ex) => (
          <button
            key={ex}
            onClick={() => onAdd(ex)}
            className="text-xs px-3 py-1.5 rounded-xl border border-border bg-card text-text-muted hover:border-accent-light transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="despejar mais..."
          className="flex-1 border border-border rounded-xl px-4 py-3 text-sm bg-card text-text outline-none focus:border-accent-light transition-colors"
          autoFocus
        />
        <button onClick={add} disabled={!text.trim()} className="px-4 py-3 bg-accent text-white rounded-xl text-sm disabled:opacity-30">
          +
        </button>
      </div>

      {/* Captured items (persisted from Supabase + session inputs, deduplicated) */}
      {(() => {
        const sessionSet = new Set(inputs);
        const persistedOnly = persistedItems.filter(p => !sessionSet.has(p));
        const allDisplayItems = [...persistedOnly, ...inputs];
        return allDisplayItems.length > 0 ? (
        <div className="space-y-1 mb-4 flex-1 overflow-y-auto">
          {allDisplayItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] py-2 px-3 bg-card border border-border rounded-lg">
              <span style={{ color: 'var(--color-stage-1)' }}>·</span>
              <span className="flex-1 truncate">{item}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: `color-mix(in srgb, ${MODULE_COLORS[domain.module]} 12%, transparent)`,
                  color: MODULE_COLORS[domain.module],
                }}
              >
                {domain.label}
              </span>
            </div>
          ))}
        </div>
        ) : null;
      })()}

      {/* Navigation */}
      <div className="mt-auto flex justify-between items-center pt-4">
        <button onClick={onBack} className="text-sm text-accent">
          {isDoorSession ? 'anterior' : 'voltar'}
        </button>
        <button onClick={onPanorama} className="text-xs text-text-muted">
          ver panorama
        </button>
        <div className="flex gap-2">
          {isDoorSession && inputs.length === 0 && (
            <button onClick={onNext} className="text-sm text-text-muted">pular</button>
          )}
          <button onClick={onNext} className="bg-accent text-white rounded-xl px-5 py-2.5 text-sm font-medium">
            {isDoorSession ? (doorProgress?.current === doorProgress?.total ? 'ver panorama' : 'proximo') : 'pronto'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
