// pages/Onboarding.tsx — Raiz Onboarding (5 steps)
// Wireframe: mindroot-wireframe-raiz-onboarding.html
// Steps: Welcome → Doors (entry mode) → Domain inventory → Ritual setup → Done

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipeline } from '@/hooks/usePipeline';
import { RAIZ_DOMAINS, RAIZ_ENTRY_MODES, type RaizEntryMode } from '@/config/raiz';

interface OnboardingProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [entryMode, setEntryMode] = useState<RaizEntryMode>('padrao');
  const [domainInputs, setDomainInputs] = useState<Record<string, string[]>>({});
  const [currentDomain, setCurrentDomain] = useState(0);
  const { capture } = usePipeline();

  const mode = RAIZ_ENTRY_MODES.find((m) => m.key === entryMode)!;
  const activeDomains = RAIZ_DOMAINS.slice(0, mode.domains);

  const handleCaptureDomain = (domain: string, text: string) => {
    if (!text.trim()) return;
    setDomainInputs((prev) => ({
      ...prev,
      [domain]: [...(prev[domain] ?? []), text.trim()],
    }));
  };

  const handleFinish = async () => {
    // Capture all items
    for (const [, texts] of Object.entries(domainInputs)) {
      for (const text of texts) {
        await capture(text);
      }
    }
    onComplete();
  };

  return (
    <div className="min-h-dvh bg-[#FDFBF6] text-[#2C2618] flex flex-col">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Raiz symbol */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7F77DD] to-[#1D9E75] flex items-center justify-center mb-6 relative">
              <div className="w-10 h-10 rounded-full border-2 border-white/40" />
              <div className="absolute inset-0 rounded-full border border-[#7F77DD]/20 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-2xl font-medium mb-2">raiz</h1>
            <p className="text-sm text-[#8C7E5E] leading-relaxed mb-8 max-w-[280px]">
              antes de organizar, precisa ver.<br />
              vamos mapear onde voce esta agora.
            </p>
            <button onClick={() => setStep(1)} className="bg-gradient-to-r from-[#7F77DD] to-[#534AB7] text-white rounded-xl px-8 py-3.5 text-sm font-medium mb-3">
              comecar
            </button>
            <button onClick={onComplete} className="text-xs text-[#8C7E5E]">depois, talvez</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="doors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 pt-16"
          >
            <div className="text-center mb-6">
              <div className="text-2xl mb-1">por onde quer comecar?</div>
              <p className="text-sm text-[#8C7E5E]">escolha o nivel de profundidade</p>
            </div>
            <div className="space-y-3">
              {RAIZ_ENTRY_MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => { setEntryMode(m.key); setStep(2); }}
                  className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${
                    entryMode === m.key ? 'border-[#534AB7]' : 'border-[#e8e6df]'
                  }`}
                >
                  <div className="text-[15px] font-medium mb-0.5">{m.label}</div>
                  <div className="text-xs text-[#8C7E5E]">{m.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <DomainStep
            key={`domain-${currentDomain}`}
            domain={activeDomains[currentDomain]}
            inputs={domainInputs[activeDomains[currentDomain]?.key] ?? []}
            onAdd={(text) => handleCaptureDomain(activeDomains[currentDomain].key, text)}
            onNext={() => {
              if (currentDomain < activeDomains.length - 1) setCurrentDomain((i) => i + 1);
              else setStep(3);
            }}
            onBack={() => {
              if (currentDomain > 0) setCurrentDomain((i) => i - 1);
              else setStep(1);
            }}
            current={currentDomain + 1}
            total={activeDomains.length}
          />
        )}

        {step === 3 && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="text-5xl mb-4 text-[#1D9E75]">○</div>
            <h2 className="text-xl font-medium mb-2">raiz mapeada</h2>
            <p className="text-sm text-[#8C7E5E] leading-relaxed mb-2">
              {Object.values(domainInputs).flat().length} items capturados em {Object.keys(domainInputs).length} dominios
            </p>
            <p className="text-xs text-[#8C7E5E] mb-8">
              todos entraram como pontos · no inbox — o triage vai classifica-los
            </p>
            <button onClick={handleFinish} className="bg-[#1D9E75] text-white rounded-xl px-8 py-3.5 text-sm font-medium">
              ir pro MindRoot
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DomainStep({ domain, inputs, onAdd, onNext, onBack, current, total }: {
  domain: { key: string; label: string; prompt: string; examples: string[] };
  inputs: string[];
  onAdd: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  current: number;
  total: number;
}) {
  const [text, setText] = useState('');

  const add = () => {
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col px-6 pt-12 pb-6"
    >
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full ${i < current ? 'bg-[#7F77DD]' : 'bg-[#e8e6df]'}`} />
        ))}
      </div>

      <div className="text-[11px] text-[#8C7E5E] tracking-wider uppercase mb-1">{current}/{total} · {domain.label}</div>
      <h2 className="text-lg font-medium mb-2">{domain.prompt}</h2>

      {/* Examples */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {domain.examples.map((ex) => (
          <button
            key={ex}
            onClick={() => { onAdd(ex); }}
            className="text-xs px-3 py-1.5 rounded-xl border border-[#e8e6df] bg-white text-[#8C7E5E] hover:border-[#7F77DD] transition-colors"
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
          placeholder="escreva algo..."
          className="flex-1 border border-[#e8e6df] rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-[#7F77DD]"
        />
        <button onClick={add} disabled={!text.trim()} className="px-4 py-3 bg-[#534AB7] text-white rounded-xl text-sm disabled:opacity-30">+</button>
      </div>

      {/* Captured items */}
      {inputs.length > 0 && (
        <div className="space-y-1 mb-4">
          {inputs.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] py-1.5 px-3 bg-white border border-[#e8e6df] rounded-lg">
              <span className="text-[#7F77DD]">·</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto flex justify-between pt-4">
        <button onClick={onBack} className="text-sm text-[#534AB7]">voltar</button>
        <button onClick={onNext} className="bg-[#534AB7] text-white rounded-xl px-6 py-2.5 text-sm font-medium">
          {current === total ? 'finalizar' : 'proximo'}
        </button>
      </div>
    </motion.div>
  );
}
