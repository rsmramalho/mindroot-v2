// components/input/AtomInput.tsx — ★ O input central
import { useState, useCallback, useRef } from 'react';
import { parseInput } from '@/engine/parsing';
import { useAppStore } from '@/store/app-store';
import { useItemMutations } from '@/hooks/useItemMutations';
import { TokenPreview } from './TokenPreview';
import type { ParsedInput } from '@/types/engine';

export function AtomInput() {
  const [value, setValue] = useState('');
  const [parsed, setParsed] = useState<ParsedInput | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useAppStore((s) => s.user);
  const { setInputFocused } = useAppStore();
  const { createItem } = useItemMutations();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);
    if (text.trim().length > 0) {
      setParsed(parseInput(text));
    } else {
      setParsed(null);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!value.trim() || !user || !parsed) return;

    await createItem.mutateAsync({
      user_id: user.id,
      title: parsed.title || value.trim(),
      type: parsed.type,
      module: parsed.module,
      priority: parsed.priority,
      emotion_before: parsed.emotion_before,
      emotion_after: parsed.emotion_after,
      needs_checkin: parsed.needs_checkin,
      is_chore: parsed.is_chore,
      due_date: parsed.due_date,
      due_time: parsed.due_time,
      ritual_period: parsed.ritual_period,
      tags: parsed.tags,
      context: parsed.context,
    });

    setValue('');
    setParsed(null);
    inputRef.current?.focus();
  }, [value, user, parsed, createItem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="O que está na sua mente?"
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm font-sans text-light placeholder:text-muted/50 focus:outline-none focus:border-mind/50 focus:ring-1 focus:ring-mind/20 transition-colors"
          autoComplete="off"
        />
        {value.trim() && (
          <button
            onClick={handleSubmit}
            disabled={createItem.isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-mind hover:text-light text-sm font-mono px-2 py-1 transition-colors disabled:opacity-50"
          >
            {createItem.isPending ? '...' : '↵'}
          </button>
        )}
      </div>

      {parsed && parsed.tokens.length > 0 && (
        <TokenPreview tokens={parsed.tokens} />
      )}
    </div>
  );
}
