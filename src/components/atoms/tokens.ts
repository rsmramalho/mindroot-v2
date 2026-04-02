// atoms/tokens.ts — Design tokens for MindRoot UI v2
// CSS variables are defined in index.css @theme.
// This file provides JS access for dynamic inline styles.

import type { AtomModule, AtomType } from '@/types/item';

// ─── Module Colors ──────────────────────────────────────
// Tailwind classes: bg-mod-work, text-mod-work, etc.

export const MODULE_COLORS: Record<AtomModule, string> = {
  work: 'var(--color-mod-work)',
  body: 'var(--color-mod-body)',
  mind: 'var(--color-mod-mind)',
  family: 'var(--color-mod-family)',
  purpose: 'var(--color-mod-purpose)',
  bridge: 'var(--color-mod-bridge)',
  finance: 'var(--color-mod-finance)',
  social: 'var(--color-mod-social)',
};

// ─── Stage Colors (Genesis 1-7) ─────────────────────────
// Tailwind classes: bg-stage-1, text-stage-1, etc.

export const STAGE_COLORS: Record<number, string> = {
  1: 'var(--color-stage-1)',
  2: 'var(--color-stage-2)',
  3: 'var(--color-stage-3)',
  4: 'var(--color-stage-4)',
  5: 'var(--color-stage-5)',
  6: 'var(--color-stage-6)',
  7: 'var(--color-stage-7)',
};

export const STAGE_GEOMETRIES: Record<number, string> = {
  1: '\u00B7',  // ·
  2: '\u2014',  // —
  3: '\u25B3',  // △
  4: '\u25A1',  // □
  5: '\u2B20',  // ⬠
  6: '\u2B21',  // ⬡
  7: '\u25CB',  // ○
};

export const STAGE_NAMES: Record<number, string> = {
  1: 'Ponto',
  2: 'Linha',
  3: 'Triangulo',
  4: 'Quadrado',
  5: 'Pentagono',
  6: 'Hexagono',
  7: 'Circulo',
};

// ─── Type Chip Colors ───────────────────────────────────

export const TYPE_COLORS: Partial<Record<AtomType, string>> = {
  task: 'var(--color-stage-3)',
  spec: 'var(--color-stage-6)',
  note: 'var(--color-mod-work)',
  reflection: 'var(--color-mod-social)',
  recipe: 'var(--color-stage-7)',
  habit: 'var(--color-stage-5)',
  project: 'var(--color-mod-family)',
  wrap: 'var(--color-stage-7)',
  'session-log': 'var(--color-mod-bridge)',
  ritual: 'var(--color-mod-purpose)',
  workout: 'var(--color-mod-body)',
  checkpoint: 'var(--color-mod-finance)',
  review: 'var(--color-mod-social)',
  recommendation: 'var(--color-mod-mind)',
  podcast: 'var(--color-mod-finance)',
  article: 'var(--color-mod-finance)',
  resource: 'var(--color-mod-bridge)',
  list: 'var(--color-mod-mind)',
  log: 'var(--color-stage-1)',
  doc: 'var(--color-mod-finance)',
  research: 'var(--color-stage-3)',
  template: 'var(--color-mod-bridge)',
  lib: 'var(--color-mod-mind)',
};

export function getTypeColor(type: AtomType): string {
  return TYPE_COLORS[type] ?? 'var(--color-mod-bridge)';
}

// ─── Period Themes ──────────────────────────────────────

export const PERIOD_GRADIENTS = {
  aurora: 'linear-gradient(135deg, var(--color-aurora) 0%, var(--color-warning) 100%)',
  zenite: 'linear-gradient(135deg, var(--color-zenite) 0%, var(--color-mod-purpose) 100%)',
  crepusculo: 'linear-gradient(135deg, var(--color-crepusculo) 0%, var(--color-accent) 100%)',
} as const;

// ─── Status Colors (for inline styles) ──────────────────

export const STATUS_COLORS = {
  green: { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' },
  amber: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning-text)' },
  red:   { bg: 'var(--color-error-bg)',   text: 'var(--color-error-text)'   },
} as const;
