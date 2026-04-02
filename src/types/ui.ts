// types/ui.ts — UI state types
import type { AtomModule, Priority, AtomType, RitualSlot } from './item';

export type AppPage =
  | 'home'
  | 'inbox'
  | 'pipeline'
  | 'triage'
  | 'wrap'
  | 'projects'
  | 'project-detail'
  | 'calendar'
  | 'raiz'
  | 'analytics'
  | 'library'
  | 'search'
  | 'settings'
  | 'item-detail';

export interface AppFilters {
  module: AtomModule | null;
  priority: Priority | null;
  type: AtomType | null;
  search: string;
  showCompleted: boolean;
  dateRange: { start: string; end: string } | null;
}

export const DEFAULT_FILTERS: AppFilters = {
  module: null,
  priority: null,
  type: null,
  search: '',
  showCompleted: false,
  dateRange: null,
};

export interface RitualPeriodConfig {
  key: RitualSlot;
  label: string;
  greeting: string;
  hours: { start: number; end: number };
  color: string;
}

export const RITUAL_PERIODS: RitualPeriodConfig[] = [
  {
    key: 'aurora',
    label: 'Aurora',
    greeting: 'Bom dia',
    hours: { start: 5, end: 12 },
    color: 'var(--color-aurora)',
  },
  {
    key: 'zenite',
    label: 'Zenite',
    greeting: 'Boa tarde',
    hours: { start: 12, end: 18 },
    color: 'var(--color-zenite)',
  },
  {
    key: 'crepusculo',
    label: 'Crepusculo',
    greeting: 'Boa noite',
    hours: { start: 18, end: 5 },
    color: 'var(--color-crepusculo)',
  },
];

export function getCurrentPeriod(): RitualPeriodConfig {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return RITUAL_PERIODS[0];
  if (hour >= 12 && hour < 18) return RITUAL_PERIODS[1];
  return RITUAL_PERIODS[2];
}
