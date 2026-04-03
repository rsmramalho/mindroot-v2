// features/raiz/components/BuilderInputs.tsx — All 5 input types
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BuilderQuestion } from '../builder-types';
import { detectsMindmateTrigger } from '../mindmate';
import { useBuilderStore } from '../builder-store';

interface Props {
  question: BuilderQuestion;
  onAnswer: (value: string | boolean) => void;
}

export function BuilderInputs({ question, onAnswer }: Props) {
  switch (question.inputType) {
    case 'yesno':     return <YesNoInput onAnswer={onAnswer} />;
    case 'choice':    return <ChoiceInput question={question} onAnswer={onAnswer} />;
    case 'freetext':  return <FreetextInput question={question} onAnswer={onAnswer} />;
    case 'time':      return <TimeInput onAnswer={onAnswer} />;
    case 'frequency': return <FrequencyInput onAnswer={onAnswer} />;
    default:          return null;
  }
}

function YesNoInput({ onAnswer }: { onAnswer: (v: string | boolean) => void }) {
  return (
    <div className="flex gap-3 mt-2">
      <motion.button whileTap={{ scale: 0.96 }} onClick={() => onAnswer(true)}
        className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-text-heading text-bg">
        Sim
      </motion.button>
      <motion.button whileTap={{ scale: 0.96 }} onClick={() => onAnswer(false)}
        className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-surface text-text-muted border border-border">
        Nao
      </motion.button>
    </div>
  );
}

function ChoiceInput({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const choices = question.choices ?? [];

  const handleSelect = (value: string) => {
    setSelected(value);
    setTimeout(() => onAnswer(value), 150);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {choices.map((choice, i) => (
        <motion.button
          key={choice.value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(choice.value)}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-all ${
            selected === choice.value
              ? 'bg-text-heading text-bg'
              : 'bg-surface text-text border border-border'
          }`}
        >
          {choice.label}
        </motion.button>
      ))}
    </div>
  );
}

function FreetextInput({ question, onAnswer }: Props) {
  const [value, setValue] = useState('');
  const [showPulse, setShowPulse] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);
    if (detectsMindmateTrigger(v)) {
      useBuilderStore.getState().checkMindmateTrigger(v);
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }
  };

  return (
    <div className="mt-2">
      <div className={`relative rounded-xl border transition-all ${
        showPulse ? 'border-text-muted' : 'border-border focus-within:border-accent'
      }`}>
        <textarea
          autoFocus
          rows={3}
          value={value}
          onChange={handleChange}
          placeholder={`${question.text.split('?')[0].toLowerCase()}...`}
          className="w-full px-4 py-3 bg-transparent text-sm text-text placeholder:text-text-muted resize-none outline-none rounded-xl"
        />
        {showPulse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-2 right-3 text-xs text-text-muted">
            ✦
          </motion.div>
        )}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => value.trim() && onAnswer(value.trim())}
        disabled={!value.trim()}
        className="w-full mt-3 py-3.5 rounded-xl text-sm font-medium bg-text-heading text-bg disabled:opacity-30"
      >
        Continuar
      </motion.button>
    </div>
  );
}

function TimeInput({ onAnswer }: { onAnswer: (v: string) => void }) {
  const [wake, setWake] = useState('05:30');
  const [sleep, setSleep] = useState('22:00');

  return (
    <div className="mt-2 space-y-4">
      <div>
        <label className="text-xs text-text-muted mb-1.5 block">Acordar</label>
        <input type="time" value={wake} onChange={(e) => setWake(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text outline-none focus:border-accent" />
      </div>
      <div>
        <label className="text-xs text-text-muted mb-1.5 block">Dormir</label>
        <input type="time" value={sleep} onChange={(e) => setSleep(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text outline-none focus:border-accent" />
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => onAnswer(`${wake} acordar — ${sleep} dormir`)}
        className="w-full py-3.5 rounded-xl text-sm font-medium bg-text-heading text-bg">
        Continuar
      </motion.button>
    </div>
  );
}

function FrequencyInput({ onAnswer }: { onAnswer: (v: string) => void }) {
  const [days, setDays] = useState<number | null>(null);
  const labels = ['1x', '2x', '3x', '4x', '5x', '6x', 'todos'];

  return (
    <div className="mt-2">
      <p className="text-xs text-text-muted mb-3">Dias por semana</p>
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {labels.map((label, i) => {
          const val = i + 1;
          const isSelected = days === val;
          return (
            <motion.button key={val} whileTap={{ scale: 0.92 }} onClick={() => setDays(val)}
              className={`py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isSelected ? 'bg-text-heading text-bg' : 'bg-surface text-text-muted border border-border'
              }`}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => days !== null && onAnswer(String(days))}
        disabled={days === null}
        className="w-full py-3.5 rounded-xl text-sm font-medium bg-text-heading text-bg disabled:opacity-30">
        Continuar
      </motion.button>
    </div>
  );
}
