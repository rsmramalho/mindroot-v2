// engine/wrap.ts — Wrap Engine
// Pure logic for wrap (daily close) operations.

import { isToday, parseISO, differenceInDays } from 'date-fns';
import type { AtomItem, Emotion, EnergyLevel } from '@/types/item';
import { getBelowFloor, getOrphans } from './fsm';

// ─── Query helpers ──────────────────────────────────────

export function getCreatedToday(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => isToday(parseISO(i.created_at)));
}

export function getModifiedToday(items: AtomItem[]): AtomItem[] {
  return items.filter((i) =>
    isToday(parseISO(i.updated_at)) && i.updated_at !== i.created_at
  );
}

export function getStaleItems(items: AtomItem[], days = 30): AtomItem[] {
  const now = new Date();
  return items.filter((i) => {
    if (i.status === 'completed' || i.status === 'archived') return false;
    const updated = parseISO(i.updated_at);
    return differenceInDays(now, updated) >= days;
  });
}

// ─── Audit ──────────────────────────────────────────────

export interface WrapAudit {
  inbox_count: number;
  below_floor: number;
  orphans: number;
  stale: number;
  total_active: number;
}

export type AuditSeverity = 'green' | 'yellow' | 'red';

export function computeAudit(
  items: AtomItem[],
  connectionMap: Record<string, string[]> = {},
): WrapAudit {
  const active = items.filter((i) => i.status !== 'completed' && i.status !== 'archived');
  return {
    inbox_count: active.filter((i) => i.state === 'inbox').length,
    below_floor: getBelowFloor(active).length,
    orphans: getOrphans(active, connectionMap).length,
    stale: getStaleItems(active).length,
    total_active: active.length,
  };
}

export function getAuditSeverity(audit: WrapAudit): AuditSeverity {
  const total = audit.inbox_count + audit.below_floor + audit.orphans + audit.stale;
  if (total === 0) return 'green';
  if (total <= 5) return 'yellow';
  return 'red';
}

const SEVERITY_COLORS: Record<AuditSeverity, string> = {
  green: 'var(--color-mod-work)',
  yellow: 'var(--color-stage-7)',
  red: 'var(--color-mod-family)',
};

export function getAuditColor(severity: AuditSeverity): string {
  return SEVERITY_COLORS[severity];
}

// ─── Wrap data shape ────────────────────────────────────

export interface WrapData {
  emotion: Emotion;
  energy: EnergyLevel;
  items_created: string[];   // item IDs
  items_modified: string[];  // item IDs
  decisions: string[];       // free-text decisions
  connections: string[];     // connection descriptions
  seeds: string[];           // stale item IDs revisited
  audit: WrapAudit;
  next: string;              // mandatory next intention
}

export interface WrapPayload {
  title: string;
  type: 'wrap';
  module: 'bridge';
  status: 'completed';
  state: 'committed';
  genesis_stage: 7;
  notes: string;
  body: {
    soul: {
      energy_level: EnergyLevel;
      emotion_before: null;
      emotion_after: Emotion;
      needs_checkin: false;
      ritual_slot: 'crepusculo';
    };
    wrap: WrapData;
  };
  tags: string[];
}

export function buildWrapPayload(data: WrapData): Omit<WrapPayload, 'title'> & { title: string } {
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const severity = getAuditSeverity(data.audit);

  return {
    title: `Wrap ${dateStr}`,
    type: 'wrap',
    module: 'bridge',
    status: 'completed',
    state: 'committed',
    genesis_stage: 7,
    notes: `Proximo: ${data.next}`,
    body: {
      soul: {
        energy_level: data.energy,
        emotion_before: null,
        emotion_after: data.emotion,
        needs_checkin: false,
        ritual_slot: 'crepusculo',
      },
      wrap: data,
    },
    tags: ['wrap', `audit-${severity}`],
  };
}
