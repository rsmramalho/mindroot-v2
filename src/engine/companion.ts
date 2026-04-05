// engine/companion.ts — Companion context engine
// Pure logic: generates contextual suggestions based on system state.
// No Supabase, no React. Just patterns → suggestions.

import type { Emotion } from '@/types/item';
import { POSITIVE_EMOTIONS } from '@/types/item';

export interface CompanionContext {
  inboxCount: number;
  staleCount: number;
  totalItems: number;
  lastWrapDate: string | null;
  currentEmotion: Emotion | null;
  currentEnergy: 'high' | 'medium' | 'low' | null;
  emptyDomains: string[];
  daysSinceWrap: number;
}

export interface CompanionSuggestion {
  id: string;
  type: 'nudge' | 'observation' | 'action';
  text: string;
  action?: { label: string; page: string };
  priority: number; // 1 = highest
}

export function generateSuggestions(ctx: CompanionContext): CompanionSuggestion[] {
  const suggestions: CompanionSuggestion[] = [];

  // Nudge: days without wrap
  if (ctx.daysSinceWrap >= 3) {
    suggestions.push({
      id: 'wrap-overdue',
      type: 'nudge',
      text: `${ctx.daysSinceWrap} dias sem wrap. como foi a semana?`,
      action: { label: 'fazer wrap', page: 'wrap' },
      priority: 1,
    });
  }

  // Nudge: inbox overflow
  if (ctx.inboxCount >= 10) {
    suggestions.push({
      id: 'inbox-overflow',
      type: 'nudge',
      text: `${ctx.inboxCount} items no inbox. quer triar?`,
      action: { label: 'abrir triage', page: 'pipeline' },
      priority: 2,
    });
  } else if (ctx.inboxCount >= 5) {
    suggestions.push({
      id: 'inbox-growing',
      type: 'observation',
      text: `${ctx.inboxCount} items esperando no inbox`,
      action: { label: 'ver pipeline', page: 'pipeline' },
      priority: 4,
    });
  }

  // Nudge: stale items
  if (ctx.staleCount > 0) {
    suggestions.push({
      id: 'stale-items',
      type: 'nudge',
      text: `${ctx.staleCount} items stale. revisar ou arquivar?`,
      action: { label: 'ver raiz', page: 'raiz' },
      priority: 3,
    });
  }

  // Observation: empty domains
  if (ctx.emptyDomains.length >= 3) {
    suggestions.push({
      id: 'empty-domains',
      type: 'observation',
      text: `${ctx.emptyDomains.length} gavetas vazias na raiz. quer explorar?`,
      action: { label: 'abrir raiz', page: 'raiz' },
      priority: 5,
    });
  }

  // Observation: energy pattern
  if (ctx.currentEnergy === 'low') {
    suggestions.push({
      id: 'low-energy',
      type: 'observation',
      text: 'energia baixa hoje. talvez focar em uma coisa so.',
      priority: 6,
    });
  }

  // Observation: positive emotion
  if (ctx.currentEmotion && POSITIVE_EMOTIONS.includes(ctx.currentEmotion)) {
    suggestions.push({
      id: 'positive-state',
      type: 'observation',
      text: `${ctx.currentEmotion} — bom momento pra capturar ou conectar.`,
      priority: 7,
    });
  }

  // Silence: if nothing useful, return empty (silence is valid per spec)
  return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
}
