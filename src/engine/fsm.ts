// engine/fsm.ts — Genesis Finite State Machine
// Pure logic: no React, no Supabase imports. Works with AtomItem data.

import type { AtomItem, AtomState } from '@/types/item';
import { GENESIS_STAGES } from '@/types/item';
import { getFloorStage } from '@/config/types';
import type { AtomType } from '@/config/types';

// ─── State-Stage mapping ────────────────────────────────

const STATE_TO_STAGE: Record<AtomState, number> = {
  inbox: 1,
  classified: 2,
  structured: 3,
  validated: 4,
  connected: 5,
  propagated: 6,
  committed: 7,
  archived: 8,
};

const STAGE_TO_STATE: Record<number, AtomState> = {
  1: 'inbox',
  2: 'classified',
  3: 'structured',
  4: 'validated',
  5: 'connected',
  6: 'propagated',
  7: 'committed',
};

// ─── Gate checks ────────────────────────────────────────

interface GateResult {
  allowed: boolean;
  reason?: string;
}

function checkGates(item: AtomItem, targetStage: number): GateResult {
  // Stage 2 (classified): needs type + module
  if (targetStage >= 2 && (!item.type || !item.module)) {
    return { allowed: false, reason: 'Precisa de tipo e modulo para avancar para Linha (stage 2)' };
  }

  // Stage 3 (structured): needs notes or body content
  if (targetStage >= 3 && !item.notes && Object.keys(item.body).length <= 0) {
    return { allowed: false, reason: 'Precisa de notas ou conteudo para Triangulo (stage 3)' };
  }

  // Stage 4 (validated): needs to be reviewed (has updated_at > created_at by some margin)
  if (targetStage >= 4) {
    const created = new Date(item.created_at).getTime();
    const updated = new Date(item.updated_at).getTime();
    if (updated - created < 60_000) {
      return { allowed: false, reason: 'Item precisa ser revisado antes de Quadrado (stage 4)' };
    }
  }

  // Stage 5 (connected): needs connections (checked by caller since we don't have connection data here)
  // Stage 6 (propagated): needs to have generated events
  // Stage 7 (committed): wrap-level items only

  return { allowed: true };
}

// ─── Public API ─────────────────────────────────────────

export function canAdvance(item: AtomItem, targetStage: number): GateResult {
  if (targetStage <= item.genesis_stage) {
    return { allowed: false, reason: 'Ja esta neste estagio ou acima' };
  }
  if (targetStage > 7) {
    return { allowed: false, reason: 'Estagio maximo e 7 (Circulo)' };
  }
  return checkGates(item, targetStage);
}

export interface AdvanceResult {
  genesis_stage: number;
  state: AtomState;
}

export function advance(item: AtomItem, targetStage: number): AdvanceResult | null {
  const gate = canAdvance(item, targetStage);
  if (!gate.allowed) return null;

  return {
    genesis_stage: targetStage,
    state: STAGE_TO_STATE[targetStage] ?? 'committed',
  };
}

export function checkFloor(item: AtomItem): boolean {
  if (!item.type) return true; // no type = no floor to check
  const floor = getFloorStage(item.type as AtomType);
  return item.genesis_stage >= floor;
}

export function getBelowFloor(items: AtomItem[]): AtomItem[] {
  return items.filter((item) => {
    if (!item.type) return false;
    if (item.status === 'completed' || item.status === 'archived') return false;
    const floor = getFloorStage(item.type as AtomType);
    return item.genesis_stage < floor;
  });
}

export function getOrphans(items: AtomItem[], connectionMap: Record<string, string[]>): AtomItem[] {
  return items.filter((item) => {
    if (item.status === 'completed' || item.status === 'archived') return false;
    if (item.genesis_stage < 5) return false;
    const connections = connectionMap[item.id] ?? [];
    return connections.length === 0;
  });
}

export function getStageInfo(stage: number) {
  return GENESIS_STAGES.find((s) => s.stage === stage) ?? GENESIS_STAGES[0];
}

export function getItemState(stage: number): AtomState {
  return STAGE_TO_STATE[stage] ?? 'inbox';
}

export function getItemStage(state: AtomState): number {
  return STATE_TO_STAGE[state] ?? 1;
}
