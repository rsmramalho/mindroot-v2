// types/item.ts — AtomItem + Soul Layer
// Zero imports. Tipos puros.

export type Emotion =
  | 'calmo' | 'focado' | 'grato' | 'animado' | 'confiante'
  | 'ansioso' | 'cansado' | 'frustrado' | 'triste' | 'perdido'
  | 'neutro';

export type ItemType =
  | 'task' | 'habit' | 'ritual' | 'chore'
  | 'project' | 'note' | 'reflection' | 'journal';

export type ItemModule =
  | 'purpose' | 'work' | 'family' | 'body' | 'mind' | 'soul';

export type ItemPriority =
  | 'urgente' | 'importante' | 'manutencao' | 'futuro';

export type RitualPeriod = 'aurora' | 'zenite' | 'crepusculo';

export interface AtomItem {
  id: string;
  user_id: string;
  title: string;
  type: ItemType;
  module: ItemModule | null;
  priority: ItemPriority | null;
  tags: string[];

  // Hierarchy
  parent_id: string | null;

  // Status
  completed: boolean;
  completed_at: string | null;
  archived: boolean;

  // Temporal
  due_date: string | null;
  due_time: string | null;
  recurrence: string | null; // 'daily' | 'weekly' | 'monthly' | cron

  // Ritual
  ritual_period: RitualPeriod | null;

  // ★ Soul Layer
  emotion_before: Emotion | null;
  emotion_after: Emotion | null;
  needs_checkin: boolean;
  is_chore: boolean;
  energy_cost: number | null; // 1-5

  // Content
  description: string | null;
  context: string | null; // raw input preservado

  // Meta
  created_at: string;
  updated_at: string;
}

// Payload para criar item (campos opcionais preenchidos pelo engine)
export type CreateItemPayload = Pick<AtomItem, 'title' | 'type' | 'user_id'> &
  Partial<Omit<AtomItem, 'id' | 'created_at' | 'updated_at' | 'title' | 'type' | 'user_id'>>;

export type UpdateItemPayload = Partial<Omit<AtomItem, 'id' | 'user_id' | 'created_at'>>;

// Constantes
export const EMOTIONS: Emotion[] = [
  'calmo', 'focado', 'grato', 'animado', 'confiante',
  'ansioso', 'cansado', 'frustrado', 'triste', 'perdido',
  'neutro',
];

export const POSITIVE_EMOTIONS: Emotion[] = ['calmo', 'focado', 'grato', 'animado', 'confiante'];
export const CHALLENGING_EMOTIONS: Emotion[] = ['ansioso', 'cansado', 'frustrado', 'triste', 'perdido'];

export const MODULES: { key: ItemModule; label: string; color: string }[] = [
  { key: 'purpose', label: 'Propósito', color: '#c4a882' },
  { key: 'work',    label: 'Trabalho',  color: '#8a9e7a' },
  { key: 'family',  label: 'Família',   color: '#d4856a' },
  { key: 'body',    label: 'Corpo',     color: '#b8c4a8' },
  { key: 'mind',    label: 'Mente',     color: '#a89478' },
  { key: 'soul',    label: 'Alma',      color: '#8a6e5a' },
];

export const PRIORITIES: { key: ItemPriority; label: string; color: string }[] = [
  { key: 'urgente',     label: 'Urgente',     color: '#d4856a' },
  { key: 'importante',  label: 'Importante',  color: '#c4a882' },
  { key: 'manutencao',  label: 'Manutenção',  color: '#a89478' },
  { key: 'futuro',      label: 'Futuro',      color: '#8a9e7a' },
];
