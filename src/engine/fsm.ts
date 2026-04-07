// engine/fsm.ts — Genesis Finite State Machine (v5.0.4 compliance)
// Pure logic: no React, no Supabase, no async, no side effects.
// Only imports types. State-machine rules + floor metadata for the Atom pipeline.
//
// References:
//   - Genesis v5.0.4 Part 2 — state machine and born-committed exception
//   - Genesis v5.0.4 Part 3.2 — FSM downgrades (orphan, morph, decay)

import type { AtomItem, AtomState, AtomType } from '@/types/item';
import { GENESIS_STAGES } from '@/types/item';

// ─── State ↔ Stage maps ─────────────────────────────────

/**
 * Map from AtomState to its numeric Genesis stage (1-7).
 * Both `committed` and `archived` map to 7 — archived is a terminal status,
 * not a separate stage in the Genesis pipeline.
 */
export const STATE_TO_STAGE: Record<AtomState, number> = {
  inbox: 1,
  classified: 2,
  structured: 3,
  validated: 4,
  connected: 5,
  propagated: 6,
  committed: 7,
  archived: 7,
};

/**
 * Map from numeric Genesis stage (1-7) to its canonical AtomState.
 * `archived` is not represented here — it's a terminal status, not a stage.
 */
export const STAGE_TO_STATE: Record<number, AtomState> = {
  1: 'inbox',
  2: 'classified',
  3: 'structured',
  4: 'validated',
  5: 'connected',
  6: 'propagated',
  7: 'committed',
};

// ─── Born-committed types ───────────────────────────────

/**
 * Types that are born committed (stage 7 directly), bypassing the pipeline.
 * Genesis v5.0.4 Part 2: wrap and session-log are journal artifacts —
 * they capture an already-completed reality, so they have no inbox→committed walk.
 */
export const BORN_COMMITTED_TYPES: AtomType[] = ['wrap', 'session-log'];

// ─── Floor stages by type ───────────────────────────────

/**
 * Minimum Genesis stage each type must reach to be considered "complete enough".
 * Items below their floor generate audit nudges (yellow), not hard blocks.
 *
 * Defaults to 2 (type + module) when a type is unmapped.
 * Mirrors `config/type-schemas.json` floor_stage values.
 *
 * Genesis v5.0.4 Part 2:
 *   - capture types (note/log/etc.)        → 2
 *   - actionables (task/habit/ritual/etc.) → 3
 *   - structural (spec/project)            → 5
 *   - journal (wrap/session-log)           → 7 (born committed)
 */
export const FLOOR_BY_TYPE: Partial<Record<AtomType, number>> = {
  // Floor 2 — capture / library
  note: 2,
  reflection: 2,
  recommendation: 2,
  podcast: 2,
  article: 2,
  resource: 2,
  list: 2,
  log: 2,
  doc: 2,
  research: 2,
  lib: 2,
  // Floor 3 — actionables
  task: 3,
  habit: 3,
  recipe: 3,
  workout: 3,
  checkpoint: 3,
  ritual: 3,
  review: 3,
  template: 3,
  // Floor 5 — structural (must be connected)
  spec: 5,
  project: 5,
  // Floor 7 — born committed
  'session-log': 7,
  wrap: 7,
};

// ─── Type predicates ────────────────────────────────────

/**
 * True if the given type is born committed (skips the pipeline entirely).
 * Genesis Part 2 — born-committed exception.
 */
export function isBornCommitted(type: AtomType): boolean {
  return BORN_COMMITTED_TYPES.includes(type);
}

/**
 * Returns the Genesis floor stage for a type. Defaults to 2 when unmapped.
 * Genesis Part 2 — minimum-completeness piso.
 */
export function getFloorStage(type: AtomType): number {
  return FLOOR_BY_TYPE[type] ?? 2;
}

/**
 * True if `currentStage` is below the floor of `type`.
 * Used by the audit engine to surface nudges (not hard blocks).
 */
export function isBelowFloor(type: AtomType, currentStage: number): boolean {
  return currentStage < getFloorStage(type);
}

// ─── Advance (forward transitions) ──────────────────────

/**
 * Returns the next valid AtomState given the current state.
 * Sequential walk: inbox → classified → structured → validated → connected
 *                  → propagated → committed.
 *
 * If `skipPropagation` is true and current is `connected`, jumps straight to
 * `committed` (Stage 6 is optional per Genesis).
 *
 * Returns `null` for terminal states (`committed`, `archived`).
 */
export function getNextState(
  currentState: AtomState,
  options?: { skipPropagation?: boolean },
): AtomState | null {
  const skip = options?.skipPropagation === true;
  switch (currentState) {
    case 'inbox':       return 'classified';
    case 'classified':  return 'structured';
    case 'structured':  return 'validated';
    case 'validated':   return 'connected';
    case 'connected':   return skip ? 'committed' : 'propagated';
    case 'propagated':  return 'committed';
    case 'committed':   return null;
    case 'archived':    return null;
    default:            return null;
  }
}

/**
 * Validates a forward transition `currentState → targetState`.
 *
 * Rules:
 *   - Always sequential. No skipping (e.g. classified → validated is invalid).
 *   - Stage 6 is optional via `skipPropagation`: connected → committed is allowed.
 *   - `committed` and `archived` are terminal — no advance.
 *   - Born-committed types should never call this (they jump straight to stage 7);
 *     this check is enforced at creation, not here.
 *
 * Genesis Part 2 — sequential pipeline integrity.
 */
export function canAdvance(
  currentState: AtomState,
  targetState: AtomState,
  options?: { skipPropagation?: boolean },
): boolean {
  const next = getNextState(currentState, options);
  if (next === null) return false;
  return next === targetState;
}

// ─── Regression (backward transitions) ──────────────────

/**
 * True if `currentState` may regress to `targetState`.
 *
 * Rules:
 *   - Regression only goes backwards (target stage < current stage).
 *   - `committed` is frozen — no regression (use morph or decay instead).
 *   - `archived` is terminal — no regression.
 *   - `inbox` is the floor — nothing below it.
 *
 * Genesis Part 3.2 — controlled downgrades (orphan, content loss).
 */
export function canRegress(currentState: AtomState, targetState: AtomState): boolean {
  if (currentState === 'committed' || currentState === 'archived') return false;
  const currStage = STATE_TO_STAGE[currentState];
  const targetStage = STATE_TO_STAGE[targetState];
  if (targetStage >= currStage) return false;
  // target must be a real pipeline state (not archived)
  if (targetState === 'archived') return false;
  return true;
}

// ─── Orphan downgrade ───────────────────────────────────

/**
 * Returns the state an item should regress to when it loses all of its
 * outbound connections.
 *
 * Genesis Part 3.2:
 *   - A `connected` (stage 5) item that loses connections regresses to
 *     `validated` (stage 4).
 *   - Exception: types with floor 5 (spec, project) MUST stay connected — they
 *     remain at `connected` and the audit raises an alert. We return `null`
 *     to signal "no automatic downgrade; surface in audit instead".
 *   - Items not at `connected` are unaffected: returns `null`.
 *   - Terminal states (`committed`, `archived`) never downgrade.
 */
export function getOrphanDowngradeState(
  type: AtomType,
  currentState: AtomState,
): AtomState | null {
  if (currentState !== 'connected') return null;
  if (getFloorStage(type) >= 5) return null;
  return 'validated';
}

// ─── Morph ──────────────────────────────────────────────

/**
 * Returns the state an item should land in after a morph (type change).
 *
 * Genesis Part 3.2:
 *   - Morphing rewrites identity, so the item regresses to `classified`
 *     (stage 2) and re-walks structure/validation/connection under the new type.
 *   - `inbox` cannot morph (no type yet) → null.
 *   - `committed` and `archived` are frozen → null.
 *   - Born-committed types (wrap, session-log) cannot morph → null.
 *   - Items already at `classified` simply stay there.
 */
export function getMorphTargetState(
  currentState: AtomState,
  currentType: AtomType | null,
): AtomState | null {
  if (currentState === 'inbox') return null;
  if (currentState === 'committed' || currentState === 'archived') return null;
  if (currentType && isBornCommitted(currentType)) return null;
  return 'classified';
}

// ─── Unified validator ──────────────────────────────────

export interface TransitionResult {
  valid: boolean;
  reason?: string;
}

/**
 * Unified gate for any state transition. Covers forward advance, regression,
 * morph, and orphan-downgrade flows.
 *
 * Pass exactly one (or zero) of the option flags:
 *   - none           → standard sequential advance
 *   - skipPropagation → advance with stage 6 skip
 *   - isMorph        → morph regression to `classified`
 *   - isOrphanDowngrade → orphan regression `connected → validated`
 *
 * Returns `{ valid, reason }` so callers can surface useful error messages.
 */
export function isValidTransition(
  currentState: AtomState,
  targetState: AtomState,
  options?: {
    skipPropagation?: boolean;
    isMorph?: boolean;
    isOrphanDowngrade?: boolean;
  },
): TransitionResult {
  // Terminal states never transition (except orphan downgrade is blocked too —
  // committed is frozen).
  if (currentState === 'committed') {
    return { valid: false, reason: 'committed é congelado — use morph ou decay' };
  }
  if (currentState === 'archived') {
    return { valid: false, reason: 'archived é terminal — não transita' };
  }

  if (options?.isMorph) {
    if (targetState !== 'classified') {
      return { valid: false, reason: 'morph sempre regride para classified (stage 2)' };
    }
    if (currentState === 'inbox') {
      return { valid: false, reason: 'inbox ainda não tem type — morph inválido' };
    }
    return { valid: true };
  }

  if (options?.isOrphanDowngrade) {
    if (currentState !== 'connected') {
      return { valid: false, reason: 'orphan downgrade só se aplica a connected' };
    }
    if (targetState !== 'validated') {
      return { valid: false, reason: 'orphan downgrade vai de connected para validated' };
    }
    return { valid: true };
  }

  // Default: forward sequential advance
  if (canAdvance(currentState, targetState, { skipPropagation: options?.skipPropagation })) {
    return { valid: true };
  }

  const expected = getNextState(currentState, { skipPropagation: options?.skipPropagation });
  if (expected === null) {
    return { valid: false, reason: `${currentState} é terminal — não avança` };
  }
  return {
    valid: false,
    reason: `transição inválida: ${currentState} → ${targetState} (esperado: ${expected})`,
  };
}

// ─── Backward-compat helpers (consumed by wrap.ts and other modules) ──

/**
 * Returns the AtomState for a given numeric stage (1-7).
 * Defaults to `inbox` for out-of-range values.
 */
export function getItemState(stage: number): AtomState {
  return STAGE_TO_STATE[stage] ?? 'inbox';
}

/**
 * Returns the numeric stage for a given AtomState. Defaults to 1.
 */
export function getItemStage(state: AtomState): number {
  return STATE_TO_STAGE[state] ?? 1;
}

/**
 * Returns the GENESIS_STAGES descriptor for a numeric stage.
 */
export function getStageInfo(stage: number) {
  return GENESIS_STAGES.find((s) => s.stage === stage) ?? GENESIS_STAGES[0];
}

/**
 * True if an item is at or above its type's floor stage.
 * Items without a type have no floor → always true.
 */
export function checkFloor(item: AtomItem): boolean {
  if (!item.type) return true;
  return !isBelowFloor(item.type, item.genesis_stage);
}

/**
 * Returns the subset of items that are below their type's floor and
 * still active (not completed/archived). Used by the audit engine.
 */
export function getBelowFloor(items: AtomItem[]): AtomItem[] {
  return items.filter((item) => {
    if (!item.type) return false;
    if (item.status === 'completed' || item.status === 'archived') return false;
    return isBelowFloor(item.type, item.genesis_stage);
  });
}

/**
 * Returns active items at stage ≥ 5 with zero outbound connections.
 * Used by the audit engine to surface orphans.
 */
export function getOrphans(
  items: AtomItem[],
  connectionMap: Record<string, string[]>,
): AtomItem[] {
  return items.filter((item) => {
    if (item.status === 'completed' || item.status === 'archived') return false;
    if (item.genesis_stage < 5) return false;
    const connections = connectionMap[item.id] ?? [];
    return connections.length === 0;
  });
}
