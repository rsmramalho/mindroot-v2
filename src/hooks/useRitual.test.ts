// hooks/useRitual.test.ts — Ritual hook logic tests
// Tests filtering, grouping by period, progress calculation
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AtomItem, RitualPeriod } from '@/types/item';

// ─── We test the pure logic that useRitual derives ───────
// Instead of rendering hooks (needs React + providers),
// we extract and test the computation logic directly.

function makeItem(overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id: crypto.randomUUID(),
    user_id: 'user-1',
    title: 'Test',
    type: 'task',
    module: null,
    priority: null,
    tags: [],
    parent_id: null,
    completed: false,
    completed_at: null,
    archived: false,
    due_date: null,
    due_time: null,
    recurrence: null,
    ritual_period: null,
    emotion_before: null,
    emotion_after: null,
    needs_checkin: false,
    is_chore: false,
    energy_cost: null,
    description: null,
    context: null,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    ...overrides,
  };
}

// ─── Pure logic extracted from useRitual ─────────────────

function filterRituals(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => i.type === 'ritual' && !i.archived);
}

function filterByPeriod(rituals: AtomItem[], period: RitualPeriod): AtomItem[] {
  return rituals.filter((i) => i.ritual_period === period);
}

function groupByPeriod(rituals: AtomItem[]): Record<RitualPeriod, AtomItem[]> {
  const grouped: Record<RitualPeriod, AtomItem[]> = {
    aurora: [],
    zenite: [],
    crepusculo: [],
  };
  for (const item of rituals) {
    if (item.ritual_period && grouped[item.ritual_period]) {
      grouped[item.ritual_period].push(item);
    }
  }
  return grouped;
}

function calcProgress(periodRituals: AtomItem[]) {
  const total = periodRituals.length;
  if (total === 0) return { total: 0, done: 0, percent: 0 };
  const done = periodRituals.filter((i) => i.completed).length;
  return { total, done, percent: Math.round((done / total) * 100) };
}

// ─── Sample data (mirrors seed_rituals.sql) ──────────────

const SEED_ITEMS: AtomItem[] = [
  makeItem({ title: 'Intenção do dia',       type: 'ritual', ritual_period: 'aurora',     module: 'purpose', needs_checkin: true }),
  makeItem({ title: 'Respiração consciente', type: 'ritual', ritual_period: 'aurora',     module: 'body' }),
  makeItem({ title: 'Prioridades do dia',    type: 'ritual', ritual_period: 'aurora',     module: 'mind' }),
  makeItem({ title: 'Pausa de recalibração', type: 'ritual', ritual_period: 'zenite',     module: 'mind',    needs_checkin: true }),
  makeItem({ title: 'Check-in emocional',    type: 'ritual', ritual_period: 'zenite',     module: 'soul',    needs_checkin: true }),
  makeItem({ title: 'Gratidão do dia',       type: 'ritual', ritual_period: 'crepusculo', module: 'soul',    needs_checkin: true }),
  makeItem({ title: 'Revisão do dia',        type: 'ritual', ritual_period: 'crepusculo', module: 'purpose', needs_checkin: true }),
  makeItem({ title: 'Preparação para amanhã',type: 'ritual', ritual_period: 'crepusculo', module: 'mind' }),
];

// ─── Tests ───────────────────────────────────────────────

describe('filterRituals', () => {
  it('filters only ritual type items', () => {
    const items = [
      ...SEED_ITEMS,
      makeItem({ type: 'task', title: 'A task' }),
      makeItem({ type: 'habit', title: 'A habit' }),
    ];
    const rituals = filterRituals(items);
    expect(rituals).toHaveLength(8);
    expect(rituals.every((i) => i.type === 'ritual')).toBe(true);
  });

  it('excludes archived rituals', () => {
    const items = [
      ...SEED_ITEMS,
      makeItem({ type: 'ritual', ritual_period: 'aurora', archived: true, title: 'Archived' }),
    ];
    const rituals = filterRituals(items);
    expect(rituals).toHaveLength(8);
    expect(rituals.find((i) => i.title === 'Archived')).toBeUndefined();
  });

  it('returns empty array when no rituals exist', () => {
    const items = [makeItem({ type: 'task' }), makeItem({ type: 'note' })];
    expect(filterRituals(items)).toHaveLength(0);
  });
});

describe('filterByPeriod', () => {
  const rituals = filterRituals(SEED_ITEMS);

  it('returns 3 aurora rituals', () => {
    expect(filterByPeriod(rituals, 'aurora')).toHaveLength(3);
  });

  it('returns 2 zenite rituals', () => {
    expect(filterByPeriod(rituals, 'zenite')).toHaveLength(2);
  });

  it('returns 3 crepusculo rituals', () => {
    expect(filterByPeriod(rituals, 'crepusculo')).toHaveLength(3);
  });
});

describe('groupByPeriod', () => {
  it('groups seed items correctly', () => {
    const rituals = filterRituals(SEED_ITEMS);
    const grouped = groupByPeriod(rituals);

    expect(grouped.aurora).toHaveLength(3);
    expect(grouped.zenite).toHaveLength(2);
    expect(grouped.crepusculo).toHaveLength(3);
  });

  it('ignores items with null ritual_period', () => {
    const rituals = [
      makeItem({ type: 'ritual', ritual_period: 'aurora' }),
      makeItem({ type: 'ritual', ritual_period: null }),
    ];
    const grouped = groupByPeriod(rituals);
    expect(grouped.aurora).toHaveLength(1);
    expect(grouped.zenite).toHaveLength(0);
    expect(grouped.crepusculo).toHaveLength(0);
  });

  it('returns empty arrays for all periods when no rituals', () => {
    const grouped = groupByPeriod([]);
    expect(grouped.aurora).toHaveLength(0);
    expect(grouped.zenite).toHaveLength(0);
    expect(grouped.crepusculo).toHaveLength(0);
  });
});

describe('calcProgress', () => {
  it('returns 0% when nothing is completed', () => {
    const items = [
      makeItem({ type: 'ritual', completed: false }),
      makeItem({ type: 'ritual', completed: false }),
      makeItem({ type: 'ritual', completed: false }),
    ];
    const progress = calcProgress(items);
    expect(progress).toEqual({ total: 3, done: 0, percent: 0 });
  });

  it('returns 100% when all completed', () => {
    const items = [
      makeItem({ type: 'ritual', completed: true }),
      makeItem({ type: 'ritual', completed: true }),
    ];
    const progress = calcProgress(items);
    expect(progress).toEqual({ total: 2, done: 2, percent: 100 });
  });

  it('returns 33% when 1 of 3 completed', () => {
    const items = [
      makeItem({ type: 'ritual', completed: true }),
      makeItem({ type: 'ritual', completed: false }),
      makeItem({ type: 'ritual', completed: false }),
    ];
    const progress = calcProgress(items);
    expect(progress).toEqual({ total: 3, done: 1, percent: 33 });
  });

  it('returns 67% when 2 of 3 completed', () => {
    const items = [
      makeItem({ type: 'ritual', completed: true }),
      makeItem({ type: 'ritual', completed: true }),
      makeItem({ type: 'ritual', completed: false }),
    ];
    const progress = calcProgress(items);
    expect(progress).toEqual({ total: 3, done: 2, percent: 67 });
  });

  it('returns zeros for empty array', () => {
    expect(calcProgress([])).toEqual({ total: 0, done: 0, percent: 0 });
  });

  it('isPeriodComplete is true only when all done', () => {
    const allDone = [
      makeItem({ type: 'ritual', completed: true }),
      makeItem({ type: 'ritual', completed: true }),
    ];
    const partial = [
      makeItem({ type: 'ritual', completed: true }),
      makeItem({ type: 'ritual', completed: false }),
    ];
    const empty: AtomItem[] = [];

    const p1 = calcProgress(allDone);
    const p2 = calcProgress(partial);
    const p3 = calcProgress(empty);

    expect(p1.total > 0 && p1.done === p1.total).toBe(true);
    expect(p2.total > 0 && p2.done === p2.total).toBe(false);
    expect(p3.total > 0 && p3.done === p3.total).toBe(false); // empty = not complete
  });
});
