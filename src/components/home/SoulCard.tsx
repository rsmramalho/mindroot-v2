// home/SoulCard.tsx — Soul state card with emotion check-in
// Signature component: how are you feeling before what you need to do

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EnergyLevel } from '@/types/item';

interface SoulCardProps {
  period: string;
  intention: string | null;
  emotions: string | null;
  energy: EnergyLevel | null;
  onEmotionChange?: (emotion: string, energy: EnergyLevel | null) => void;
}

const EMOTION_SUGGESTIONS = ['calmo', 'focado', 'ansioso', 'grato', 'cansado'];

export function SoulCard({ period, intention, emotions, energy, onEmotionChange }: SoulCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [emotionInput, setEmotionInput] = useState(emotions ?? '');
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(energy ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleEmotionSubmit = () => {
    if (emotionInput.trim()) {
      onEmotionChange?.(emotionInput.trim(), selectedEnergy);
    }
  };

  const handleChipClick = (chip: string) => {
    setEmotionInput(chip);
  };

  const handleEnergySelect = (level: EnergyLevel) => {
    setSelectedEnergy(level);
  };

  return (
    <motion.div
      layout
      className="rounded-[16px] p-4 bg-card border border-border overflow-hidden"
      style={{
        borderTopWidth: '3px',
        borderTopColor: 'var(--color-warning)',
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-[15px] font-medium text-text-heading">
          como você tá chegando hoje?
        </h3>
      </div>

      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={emotionInput}
        onChange={(e) => setEmotionInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleEmotionSubmit()}
        placeholder="em uma palavra ou frase..."
        className="w-full px-3 py-2.5 rounded-[12px] text-sm bg-surface text-text placeholder:text-text-muted border border-border outline-none focus:border-accent transition-colors mb-3"
      />

      {/* Emotion chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {EMOTION_SUGGESTIONS.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              handleChipClick(chip);
              setEmotionInput(chip);
            }}
            className="px-3 py-1.5 rounded-[10px] text-[12px] bg-surface text-mod-body border border-border hover:border-mod-body transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Energy scale */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
          energia:
        </span>
        <div className="flex gap-1.5">
          {(['low', 'med', 'high'] as const).map((level) => (
            <button
              key={level}
              onClick={() => handleEnergySelect(level)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                selectedEnergy === level
                  ? 'bg-warning text-text-heading'
                  : 'bg-surface text-text-muted'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Submit hint */}
      {emotionInput && (
        <div className="mt-3 text-[11px] text-text-muted">
          pressione enter para salvar →
        </div>
      )}
    </motion.div>
  );
}
