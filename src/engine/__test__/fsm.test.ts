// engine/__test__/fsm.test.ts
// Genesis FSM compliance suite — Genesis v5.0.4 Part 2 + Part 3.2.

import { describe, it, expect } from 'vitest';
import {
  STATE_TO_STAGE,
  STAGE_TO_STATE,
  BORN_COMMITTED_TYPES,
  FLOOR_BY_TYPE,
  isBornCommitted,
  getFloorStage,
  isBelowFloor,
  canAdvance,
  getNextState,
  canRegress,
  getOrphanDowngradeState,
  getMorphTargetState,
  isValidTransition,
} from '../fsm';
import type { AtomState, AtomType } from '@/types/item';

const ALL_TYPES: AtomType[] = [
  'note', 'reflection', 'recommendation', 'podcast', 'article',
  'resource', 'list', 'task', 'habit', 'recipe', 'workout',
  'spec', 'checkpoint', 'project', 'session-log', 'wrap',
  'ritual', 'review', 'log', 'doc', 'research', 'template', 'lib',
];

// ─── Bloco 1: Constantes ──────────────────────────────────

describe('FSM Constants', () => {
  it('STATE_TO_STAGE has 8 entries (incl. archived)', () => {
    expect(Object.keys(STATE_TO_STAGE)).toHaveLength(8);
    expect(STATE_TO_STAGE.inbox).toBe(1);
    expect(STATE_TO_STAGE.committed).toBe(7);
    expect(STATE_TO_STAGE.archived).toBe(7);
  });

  it('STAGE_TO_STATE has 7 entries (1-7)', () => {
    expect(Object.keys(STAGE_TO_STATE)).toHaveLength(7);
    expect(STAGE_TO_STATE[1]).toBe('inbox');
    expect(STAGE_TO_STATE[7]).toBe('committed');
  });

  it('BORN_COMMITTED_TYPES contains wrap and session-log', () => {
    expect(BORN_COMMITTED_TYPES).toContain('wrap');
    expect(BORN_COMMITTED_TYPES).toContain('session-log');
    expect(BORN_COMMITTED_TYPES).toHaveLength(2);
  });

  it('FLOOR_BY_TYPE covers all 23 types', () => {
    const mapped = Object.keys(FLOOR_BY_TYPE);
    expect(mapped).toHaveLength(23);
    for (const t of ALL_TYPES) {
      expect(FLOOR_BY_TYPE[t]).toBeDefined();
    }
  });

  it('floors match Genesis Part 2', () => {
    // Floor 2
    for (const t of ['note','reflection','recommendation','podcast','article','resource','list','log','doc','research','lib'] as AtomType[]) {
      expect(FLOOR_BY_TYPE[t]).toBe(2);
    }
    // Floor 3
    for (const t of ['task','habit','recipe','workout','checkpoint','ritual','review','template'] as AtomType[]) {
      expect(FLOOR_BY_TYPE[t]).toBe(3);
    }
    // Floor 5
    expect(FLOOR_BY_TYPE.spec).toBe(5);
    expect(FLOOR_BY_TYPE.project).toBe(5);
    // Floor 7 (born committed)
    expect(FLOOR_BY_TYPE['session-log']).toBe(7);
    expect(FLOOR_BY_TYPE.wrap).toBe(7);
  });
});

// ─── Bloco 2: Born Committed ──────────────────────────────

describe('Born Committed', () => {
  it('wrap is born committed', () => {
    expect(isBornCommitted('wrap')).toBe(true);
  });
  it('session-log is born committed', () => {
    expect(isBornCommitted('session-log')).toBe(true);
  });
  it('task is NOT born committed', () => {
    expect(isBornCommitted('task')).toBe(false);
  });
  it('note is NOT born committed', () => {
    expect(isBornCommitted('note')).toBe(false);
  });
});

// ─── Bloco 3: Floor Stage ─────────────────────────────────

describe('Floor Stage', () => {
  it('floor 2 types', () => {
    for (const t of ['note','reflection','recommendation','podcast','article','resource','list','log','doc','research','lib'] as AtomType[]) {
      expect(getFloorStage(t)).toBe(2);
    }
  });
  it('floor 3 types', () => {
    for (const t of ['task','habit','recipe','workout','checkpoint','ritual','review','template'] as AtomType[]) {
      expect(getFloorStage(t)).toBe(3);
    }
  });
  it('floor 5 types', () => {
    expect(getFloorStage('spec')).toBe(5);
    expect(getFloorStage('project')).toBe(5);
  });
  it('floor 7 types', () => {
    expect(getFloorStage('session-log')).toBe(7);
    expect(getFloorStage('wrap')).toBe(7);
  });
  it('isBelowFloor: task at stage 2 → true', () => {
    expect(isBelowFloor('task', 2)).toBe(true);
  });
  it('isBelowFloor: task at stage 3 → false', () => {
    expect(isBelowFloor('task', 3)).toBe(false);
  });
  it('isBelowFloor: spec at stage 4 → true', () => {
    expect(isBelowFloor('spec', 4)).toBe(true);
  });
  it('isBelowFloor: note at stage 2 → false', () => {
    expect(isBelowFloor('note', 2)).toBe(false);
  });
});

// ─── Bloco 4: Avanço Sequencial ───────────────────────────

describe('Advance', () => {
  it('inbox → classified: valid', () => {
    expect(canAdvance('inbox', 'classified')).toBe(true);
  });
  it('classified → structured: valid', () => {
    expect(canAdvance('classified', 'structured')).toBe(true);
  });
  it('structured → validated: valid', () => {
    expect(canAdvance('structured', 'validated')).toBe(true);
  });
  it('validated → connected: valid', () => {
    expect(canAdvance('validated', 'connected')).toBe(true);
  });
  it('connected → propagated: valid', () => {
    expect(canAdvance('connected', 'propagated')).toBe(true);
  });
  it('propagated → committed: valid', () => {
    expect(canAdvance('propagated', 'committed')).toBe(true);
  });
  it('inbox → structured: INVALID (skip)', () => {
    expect(canAdvance('inbox', 'structured')).toBe(false);
  });
  it('inbox → committed: INVALID (skip)', () => {
    expect(canAdvance('inbox', 'committed')).toBe(false);
  });
  it('classified → validated: INVALID (skip)', () => {
    expect(canAdvance('classified', 'validated')).toBe(false);
  });
  it('committed → anything: INVALID (frozen)', () => {
    const targets: AtomState[] = ['inbox','classified','structured','validated','connected','propagated','committed','archived'];
    for (const t of targets) {
      expect(canAdvance('committed', t)).toBe(false);
    }
  });
  it('archived → anything: INVALID', () => {
    const targets: AtomState[] = ['inbox','classified','structured','validated','connected','propagated','committed','archived'];
    for (const t of targets) {
      expect(canAdvance('archived', t)).toBe(false);
    }
  });
});

// ─── Bloco 5: Stage 6 Opcional ────────────────────────────

describe('Stage 6 Optional', () => {
  it('connected → committed with skipPropagation=true: valid', () => {
    expect(canAdvance('connected', 'committed', { skipPropagation: true })).toBe(true);
  });
  it('connected → committed without flag: INVALID', () => {
    expect(canAdvance('connected', 'committed')).toBe(false);
  });
  it('getNextState(connected, skipPropagation) → committed', () => {
    expect(getNextState('connected', { skipPropagation: true })).toBe('committed');
  });
  it('getNextState(connected) → propagated', () => {
    expect(getNextState('connected')).toBe('propagated');
  });
  it('getNextState terminals → null', () => {
    expect(getNextState('committed')).toBe(null);
    expect(getNextState('archived')).toBe(null);
  });
});

// ─── Bloco 6: Regressão ───────────────────────────────────

describe('Regression', () => {
  it('connected → validated: valid (5→4)', () => {
    expect(canRegress('connected', 'validated')).toBe(true);
  });
  it('structured → classified: valid (3→2)', () => {
    expect(canRegress('structured', 'classified')).toBe(true);
  });
  it('committed → anything: INVALID (frozen)', () => {
    const targets: AtomState[] = ['inbox','classified','structured','validated','connected','propagated'];
    for (const t of targets) {
      expect(canRegress('committed', t)).toBe(false);
    }
  });
  it('archived → anything: INVALID', () => {
    const targets: AtomState[] = ['inbox','classified','structured','validated','connected','propagated'];
    for (const t of targets) {
      expect(canRegress('archived', t)).toBe(false);
    }
  });
  it('inbox → anything: INVALID (already at floor)', () => {
    const targets: AtomState[] = ['inbox','classified','structured','validated','connected','propagated','committed'];
    for (const t of targets) {
      expect(canRegress('inbox', t)).toBe(false);
    }
  });
  it('validated → connected: INVALID (regression goes backwards only)', () => {
    expect(canRegress('validated', 'connected')).toBe(false);
  });
});

// ─── Bloco 7: Orphan Downgrade ────────────────────────────

describe('Orphan Downgrade', () => {
  it('task connected losing connections → validated', () => {
    expect(getOrphanDowngradeState('task', 'connected')).toBe('validated');
  });
  it('note connected losing connections → validated', () => {
    expect(getOrphanDowngradeState('note', 'connected')).toBe('validated');
  });
  it('project connected losing connections → null (floor 5, audit alert)', () => {
    expect(getOrphanDowngradeState('project', 'connected')).toBe(null);
  });
  it('spec connected losing connections → null (floor 5, audit alert)', () => {
    expect(getOrphanDowngradeState('spec', 'connected')).toBe(null);
  });
  it('non-connected item → null (no effect)', () => {
    expect(getOrphanDowngradeState('task', 'validated')).toBe(null);
    expect(getOrphanDowngradeState('task', 'structured')).toBe(null);
    expect(getOrphanDowngradeState('task', 'inbox')).toBe(null);
  });
  it('committed → null (frozen)', () => {
    expect(getOrphanDowngradeState('task', 'committed')).toBe(null);
  });
});

// ─── Bloco 8: Morph ───────────────────────────────────────

describe('Morph', () => {
  it('validated → classified (morph regresses to stage 2)', () => {
    expect(getMorphTargetState('validated', 'task')).toBe('classified');
  });
  it('connected → classified', () => {
    expect(getMorphTargetState('connected', 'task')).toBe('classified');
  });
  it('structured → classified', () => {
    expect(getMorphTargetState('structured', 'task')).toBe('classified');
  });
  it('inbox → null (no type yet)', () => {
    expect(getMorphTargetState('inbox', null)).toBe(null);
    expect(getMorphTargetState('inbox', 'task')).toBe(null);
  });
  it('classified → classified (already at stage 2, ok)', () => {
    expect(getMorphTargetState('classified', 'task')).toBe('classified');
  });
  it('committed → null (frozen)', () => {
    expect(getMorphTargetState('committed', 'task')).toBe(null);
  });
  it('archived → null', () => {
    expect(getMorphTargetState('archived', 'task')).toBe(null);
  });
  it('born-committed type → null (wrap/session-log do not morph)', () => {
    expect(getMorphTargetState('connected', 'wrap')).toBe(null);
    expect(getMorphTargetState('validated', 'session-log')).toBe(null);
  });
});

// ─── Bloco 9: isValidTransition (integração) ──────────────

describe('isValidTransition', () => {
  it('normal advance: valid=true', () => {
    expect(isValidTransition('inbox', 'classified').valid).toBe(true);
    expect(isValidTransition('validated', 'connected').valid).toBe(true);
  });

  it('skipPropagation: connected → committed valid', () => {
    expect(isValidTransition('connected', 'committed', { skipPropagation: true }).valid).toBe(true);
  });

  it('skip stage: valid=false with reason', () => {
    const r = isValidTransition('inbox', 'structured');
    expect(r.valid).toBe(false);
    expect(r.reason).toBeDefined();
    expect(r.reason).toContain('inválida');
  });

  it('morph flag: valid=true for any → classified', () => {
    expect(isValidTransition('validated', 'classified', { isMorph: true }).valid).toBe(true);
    expect(isValidTransition('structured', 'classified', { isMorph: true }).valid).toBe(true);
    expect(isValidTransition('connected', 'classified', { isMorph: true }).valid).toBe(true);
  });

  it('morph flag: target must be classified', () => {
    const r = isValidTransition('validated', 'inbox', { isMorph: true });
    expect(r.valid).toBe(false);
  });

  it('morph flag from inbox: invalid', () => {
    const r = isValidTransition('inbox', 'classified', { isMorph: true });
    expect(r.valid).toBe(false);
  });

  it('orphan downgrade flag: connected → validated valid', () => {
    expect(isValidTransition('connected', 'validated', { isOrphanDowngrade: true }).valid).toBe(true);
  });

  it('orphan downgrade flag: from non-connected invalid', () => {
    const r = isValidTransition('validated', 'structured', { isOrphanDowngrade: true });
    expect(r.valid).toBe(false);
  });

  it('committed → anything: valid=false (always)', () => {
    expect(isValidTransition('committed', 'classified', { isMorph: true }).valid).toBe(false);
    expect(isValidTransition('committed', 'validated', { isOrphanDowngrade: true }).valid).toBe(false);
    expect(isValidTransition('committed', 'inbox').valid).toBe(false);
  });

  it('archived → anything: valid=false', () => {
    expect(isValidTransition('archived', 'classified').valid).toBe(false);
  });
});
