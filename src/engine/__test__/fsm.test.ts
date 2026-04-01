import { describe, it, expect } from 'vitest';
import { canAdvance, advance, getBelowFloor, getOrphans, checkFloor } from '../fsm';
import { getFloorStage } from '@/config/types';
import type { AtomItem } from '@/types/item';

function makeItem(overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id: 'test-1',
    user_id: 'u1',
    title: 'Test item',
    type: 'note',
    module: 'mind',
    tags: [],
    status: 'active',
    state: 'inbox',
    genesis_stage: 1,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: {},
    source: 'mindroot',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
    created_by: null,
    ...overrides,
  };
}

describe('canAdvance', () => {
  it('allows advancing from stage 1 to 2 when type + module set', () => {
    const item = makeItem({ genesis_stage: 1, type: 'note', module: 'mind' });
    const result = canAdvance(item, 2);
    expect(result.allowed).toBe(true);
  });

  it('blocks advancing to stage 2 without type', () => {
    const item = makeItem({ genesis_stage: 1, type: null, module: 'mind' });
    const result = canAdvance(item, 2);
    expect(result.allowed).toBe(false);
  });

  it('blocks advancing to stage 2 without module', () => {
    const item = makeItem({ genesis_stage: 1, type: 'note', module: null });
    const result = canAdvance(item, 2);
    expect(result.allowed).toBe(false);
  });

  it('blocks advancing to same stage', () => {
    const item = makeItem({ genesis_stage: 3 });
    const result = canAdvance(item, 3);
    expect(result.allowed).toBe(false);
  });

  it('blocks advancing beyond stage 7', () => {
    const item = makeItem({ genesis_stage: 7 });
    const result = canAdvance(item, 8);
    expect(result.allowed).toBe(false);
  });

  it('blocks advancing to stage 3 without notes or body', () => {
    const item = makeItem({ genesis_stage: 2, notes: null, body: {} });
    const result = canAdvance(item, 3);
    expect(result.allowed).toBe(false);
  });

  it('allows advancing to stage 3 with notes', () => {
    const item = makeItem({ genesis_stage: 2, notes: 'some notes' });
    const result = canAdvance(item, 3);
    expect(result.allowed).toBe(true);
  });
});

describe('advance', () => {
  it('returns new state and stage on valid advance', () => {
    const item = makeItem({ genesis_stage: 1 });
    const result = advance(item, 2);
    expect(result).toEqual({ genesis_stage: 2, state: 'classified' });
  });

  it('returns null when advance is blocked', () => {
    const item = makeItem({ genesis_stage: 1, type: null });
    const result = advance(item, 2);
    expect(result).toBeNull();
  });
});

describe('getFloorStage', () => {
  it('returns correct floor for task (should be >= 1)', () => {
    const floor = getFloorStage('task');
    expect(floor).toBeGreaterThanOrEqual(1);
    expect(floor).toBeLessThanOrEqual(7);
  });

  it('returns correct floor for spec', () => {
    const floor = getFloorStage('spec');
    expect(floor).toBeGreaterThanOrEqual(1);
  });
});

describe('getBelowFloor', () => {
  it('returns items below their type floor', () => {
    const floor = getFloorStage('task');
    const items = [
      makeItem({ id: 'a', type: 'task', genesis_stage: floor - 1 > 0 ? floor - 1 : 1 }),
      makeItem({ id: 'b', type: 'note', genesis_stage: 7 }),
    ];
    // If task floor > 1, item 'a' should be below floor
    const result = getBelowFloor(items);
    if (floor > 1) {
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('a');
    } else {
      expect(result.length).toBe(0);
    }
  });

  it('excludes completed items', () => {
    const items = [makeItem({ status: 'completed', type: 'task', genesis_stage: 1 })];
    expect(getBelowFloor(items)).toHaveLength(0);
  });

  it('excludes items without type', () => {
    const items = [makeItem({ type: null, genesis_stage: 1 })];
    expect(getBelowFloor(items)).toHaveLength(0);
  });
});

describe('getOrphans', () => {
  it('returns items at stage >= 5 with no connections', () => {
    const items = [
      makeItem({ id: 'a', genesis_stage: 5 }),
      makeItem({ id: 'b', genesis_stage: 3 }),
    ];
    const result = getOrphans(items, {});
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('a');
  });

  it('excludes items with connections', () => {
    const items = [makeItem({ id: 'a', genesis_stage: 5 })];
    const result = getOrphans(items, { a: ['b'] });
    expect(result).toHaveLength(0);
  });

  it('excludes completed items', () => {
    const items = [makeItem({ id: 'a', genesis_stage: 5, status: 'completed' })];
    const result = getOrphans(items, {});
    expect(result).toHaveLength(0);
  });
});

describe('checkFloor', () => {
  it('returns true when item meets floor', () => {
    const item = makeItem({ type: 'note', genesis_stage: 7 });
    expect(checkFloor(item)).toBe(true);
  });

  it('returns true when no type (no floor constraint)', () => {
    const item = makeItem({ type: null, genesis_stage: 1 });
    expect(checkFloor(item)).toBe(true);
  });
});
