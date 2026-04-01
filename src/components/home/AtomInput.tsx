// home/AtomInput.tsx — Capture input bar
// Wireframe: rounded bar, placeholder, submit button

import { useState } from 'react';

interface AtomInputProps {
  placeholder?: string;
  onSubmit: (text: string) => void;
}

export function AtomInput({ placeholder = 'o que esta na cabeca?', onSubmit }: AtomInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2.5">
      {/* Point geometry */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 opacity-35">
        <circle cx="7" cy="7" r="2.5" fill="currentColor" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder={placeholder}
        className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#b4b2a9]"
      />

      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="w-7 h-7 rounded-full bg-text text-bg flex items-center justify-center shrink-0 disabled:opacity-30"
        aria-label="Capturar"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2v7M3 6l3-4 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
