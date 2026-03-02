// hooks/useJournal.test.ts — Journal hook logic tests
// Tests filtering, date grouping, stats calculation
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { AtomItem } from '@/types/item';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── Factory ─────────────────────────────────────────────

function makeItem(overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id: crypto.randomUUID(),
    user_id: 'user-1',
    title: 'Test entry',
    type: 'journal',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// ─── Pure logic extracted from useJournal ────────────────

function filterJournalItems(items: AtomItem[]): AtomItem[] {
  return items
    .filter(
      (i) =>
        (i.type === 'reflection' || i.type === 'journal') && !i.archived
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

interface JournalGroup {
  label: string;
  date: string;
  entries: AtomItem[];
}

function groupByDate(journalItems: AtomItem[]): JournalGroup[] {
  const groups: Map<string, AtomItem[]> = new Map();

  for (const item of journalItems) {
    const dateKey = format(new Date(item.created_at), 'yyyy-MM-dd');
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(item);
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const result: JournalGroup[] = [];
  for (const [dateKey, entries] of groups) {
    let label: string;
    if (dateKey === today) {
      label = 'Hoje';
    } else if (dateKey === yesterday) {
      label = 'Ontem';
    } else {
      label = format(new Date(dateKey + 'T12:00:00'), "d 'de' MMMM", { locale: ptBR });
    }
    result.push({ label, date: dateKey, entries });
  }

  return result;
}

function calcStats(journalItems: AtomItem[]) {
  const total = journalItems.length;
  const today = format(new Date(), 'yyyy-MM-dd');
  const withEmotion = journalItems.filter(
    (i) => i.emotion_before || i.emotion_after
  ).length;
  const todayCount = journalItems.filter(
    (i) => format(new Date(i.created_at), 'yyyy-MM-dd') === today
  ).length;
  return { total, withEmotion, todayCount };
}

// ─── Tests: filterJournalItems ───────────────────────────

describe('filterJournalItems', () => {
  it('includes type: journal', () => {
    const items = [makeItem({ type: 'journal' })];
    expect(filterJournalItems(items)).toHaveLength(1);
  });

  it('includes type: reflection', () => {
    const items = [makeItem({ type: 'reflection' })];
    expect(filterJournalItems(items)).toHaveLength(1);
  });

  it('excludes type: task', () => {
    const items = [makeItem({ type: 'task' })];
    expect(filterJournalItems(items)).toHaveLength(0);
  });

  it('excludes type: habit', () => {
    const items = [makeItem({ type: 'habit' })];
    expect(filterJournalItems(items)).toHaveLength(0);
  });

  it('excludes type: ritual', () => {
    const items = [makeItem({ type: 'ritual' })];
    expect(filterJournalItems(items)).toHaveLength(0);
  });

  it('excludes type: chore', () => {
    const items = [makeItem({ type: 'chore' })];
    expect(filterJournalItems(items)).toHaveLength(0);
  });

  it('excludes archived items', () => {
    const items = [
      makeItem({ type: 'journal', archived: false }),
      makeItem({ type: 'journal', archived: true }),
      makeItem({ type: 'reflection', archived: true }),
    ];
    expect(filterJournalItems(items)).toHaveLength(1);
  });

  it('sorts newest first', () => {
    const older = makeItem({
      type: 'journal',
      title: 'older',
      created_at: '2025-01-01T10:00:00Z',
    });
    const newer = makeItem({
      type: 'journal',
      title: 'newer',
      created_at: '2025-06-15T10:00:00Z',
    });
    const result = filterJournalItems([older, newer]);
    expect(result[0].title).toBe('newer');
    expect(result[1].title).toBe('older');
  });

  it('handles mixed types correctly', () => {
    const items = [
      makeItem({ type: 'journal' }),
      makeItem({ type: 'reflection' }),
      makeItem({ type: 'task' }),
      makeItem({ type: 'ritual' }),
      makeItem({ type: 'note' }),
      makeItem({ type: 'journal', archived: true }),
    ];
    expect(filterJournalItems(items)).toHaveLength(2);
  });
});

// ─── Tests: groupByDate ──────────────────────────────────

describe('groupByDate', () => {
  it('groups items by date', () => {
    const items = [
      makeItem({ type: 'journal', created_at: '2025-06-15T02:00:00Z' }),
      makeItem({ type: 'journal', created_at: '2025-06-15T06:00:00Z' }),
      makeItem({ type: 'journal', created_at: '2025-06-14T02:00:00Z' }),
    ];
    const groups = groupByDate(items);
    expect(groups).toHaveLength(2);
  });

  it('labels today as "Hoje"', () => {
    const items = [makeItem({ type: 'journal', created_at: new Date().toISOString() })];
    const groups = groupByDate(items);
    expect(groups[0].label).toBe('Hoje');
  });

  it('labels yesterday as "Ontem"', () => {
    const yesterday = subDays(new Date(), 1);
    const items = [makeItem({ type: 'journal', created_at: yesterday.toISOString() })];
    const groups = groupByDate(items);
    expect(groups[0].label).toBe('Ontem');
  });

  it('labels older dates with "d de MMMM" format', () => {
    const items = [
      makeItem({ type: 'journal', created_at: '2025-01-10T10:00:00Z' }),
    ];
    const groups = groupByDate(items);
    expect(groups[0].label).toBe('10 de janeiro');
  });

  it('returns empty array for no items', () => {
    expect(groupByDate([])).toHaveLength(0);
  });

  it('multiple items on same day are in same group', () => {
    const items = [
      makeItem({ type: 'journal', title: 'A', created_at: '2025-03-01T01:00:00Z' }),
      makeItem({ type: 'journal', title: 'B', created_at: '2025-03-01T05:00:00Z' }),
    ];
    const groups = groupByDate(items);
    expect(groups).toHaveLength(1);
    expect(groups[0].entries).toHaveLength(2);
  });
});

// ─── Tests: calcStats ────────────────────────────────────

describe('calcStats', () => {
  it('counts total correctly', () => {
    const items = [
      makeItem({ type: 'journal' }),
      makeItem({ type: 'journal' }),
      makeItem({ type: 'reflection' }),
    ];
    expect(calcStats(items).total).toBe(3);
  });

  it('counts today items', () => {
    const items = [
      makeItem({ type: 'journal', created_at: new Date().toISOString() }),
      makeItem({ type: 'journal', created_at: '2025-01-01T10:00:00Z' }),
    ];
    expect(calcStats(items).todayCount).toBe(1);
  });

  it('counts items with emotion_before', () => {
    const items = [
      makeItem({ type: 'journal', emotion_before: 'calmo' }),
      makeItem({ type: 'journal' }),
    ];
    expect(calcStats(items).withEmotion).toBe(1);
  });

  it('counts items with emotion_after', () => {
    const items = [
      makeItem({ type: 'journal', emotion_after: 'grato' }),
      makeItem({ type: 'journal' }),
    ];
    expect(calcStats(items).withEmotion).toBe(1);
  });

  it('counts item with both emotions only once', () => {
    const items = [
      makeItem({ type: 'journal', emotion_before: 'ansioso', emotion_after: 'calmo' }),
    ];
    expect(calcStats(items).withEmotion).toBe(1);
  });

  it('returns zeros for empty array', () => {
    const stats = calcStats([]);
    expect(stats).toEqual({ total: 0, withEmotion: 0, todayCount: 0 });
  });
});
