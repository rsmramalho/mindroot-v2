import { describe, it, expect, vi } from 'vitest';
import { getCreatedToday, getModifiedToday, computeAudit, getAuditSeverity } from '../wrap';
import type { AtomItem } from '@/types/item';

const TODAY = new Date().toISOString();
const YESTERDAY = new Date(Date.now() - 86400000).toISOString();

function makeItem(overrides: Partial<AtomItem> = {}): AtomItem {
  return {
    id: 'test-1',
    user_id: 'u1',
    title: 'Test item',
    type: 'note',
    module: 'mind',
    tags: [],
    status: 'active',
    state: 'classified',
    genesis_stage: 2,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: {},
    source: 'mindroot',
    created_at: TODAY,
    updated_at: TODAY,
    created_by: null,
    ...overrides,
  };
}

describe('getCreatedToday', () => {
  it('filters items created today', () => {
    const items = [
      makeItem({ id: 'a', created_at: TODAY }),
      makeItem({ id: 'b', created_at: YESTERDAY }),
    ];
    const result = getCreatedToday(items);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('a');
  });

  it('returns empty for no items created today', () => {
    const items = [makeItem({ created_at: YESTERDAY })];
    expect(getCreatedToday(items)).toHaveLength(0);
  });
});

describe('getModifiedToday', () => {
  it('returns items modified today (updated != created)', () => {
    const items = [
      makeItem({ id: 'a', created_at: YESTERDAY, updated_at: TODAY }),
      makeItem({ id: 'b', created_at: TODAY, updated_at: TODAY }), // created = updated, excluded
    ];
    const result = getModifiedToday(items);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('a');
  });
});

describe('computeAudit', () => {
  it('counts inbox items', () => {
    const items = [
      makeItem({ state: 'inbox' }),
      makeItem({ state: 'classified' }),
    ];
    const audit = computeAudit(items);
    expect(audit.inbox_count).toBe(1);
  });

  it('counts total active (excludes completed/archived)', () => {
    const items = [
      makeItem({ status: 'active' }),
      makeItem({ status: 'completed' }),
      makeItem({ status: 'archived' }),
    ];
    const audit = computeAudit(items);
    expect(audit.total_active).toBe(1);
  });

  it('returns zero counts for empty array', () => {
    const audit = computeAudit([]);
    expect(audit.inbox_count).toBe(0);
    expect(audit.total_active).toBe(0);
    expect(audit.below_floor).toBe(0);
    expect(audit.orphans).toBe(0);
  });
});

describe('getAuditSeverity', () => {
  it('returns green when all counts are zero', () => {
    expect(getAuditSeverity({ inbox_count: 0, below_floor: 0, orphans: 0, stale: 0, total_active: 10 })).toBe('green');
  });

  it('returns yellow when total issues <= 5', () => {
    expect(getAuditSeverity({ inbox_count: 2, below_floor: 1, orphans: 0, stale: 0, total_active: 10 })).toBe('yellow');
  });

  it('returns red when total issues > 5', () => {
    expect(getAuditSeverity({ inbox_count: 3, below_floor: 2, orphans: 1, stale: 1, total_active: 10 })).toBe('red');
  });
});
