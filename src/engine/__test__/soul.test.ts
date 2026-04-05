// engine/__test__/soul.test.ts — Soul engine tests
import { describe, it, expect } from 'vitest';
import { shouldTriggerCheckIn, detectShift, getRandomPrompt } from '../soul';
import type { AtomItem } from '@/types/item';

const baseItem: AtomItem = {
  id: 'test-1', user_id: 'u1', title: 'Test', type: 'task', module: 'work',
  tags: [], status: 'active', state: 'structured', genesis_stage: 3,
  project_id: null, naming_convention: null, notes: null,
  body: {}, source: 'mindroot', created_at: '2026-01-01', updated_at: '2026-01-01', created_by: null,
};

describe('shouldTriggerCheckIn', () => {
  it('returns null for non-completed items', () => {
    expect(shouldTriggerCheckIn({ ...baseItem, status: 'active' })).toBeNull();
  });

  it('triggers for completed chore', () => {
    const item = { ...baseItem, status: 'completed' as const, tags: ['#chore'] };
    const result = shouldTriggerCheckIn(item);
    expect(result).not.toBeNull();
    expect(result!.reason).toBe('chore_complete');
  });

  it('triggers for needs_checkin flag', () => {
    const item = { ...baseItem, status: 'completed' as const, body: { soul: { needs_checkin: true, energy_level: null, emotion_before: null, emotion_after: null, ritual_slot: null } } };
    const result = shouldTriggerCheckIn(item);
    expect(result).not.toBeNull();
    expect(result!.reason).toBe('task_complete');
  });

  it('triggers for item with emotion_before', () => {
    const item = { ...baseItem, status: 'completed' as const, body: { soul: { emotion_before: 'ansioso', emotion_after: null, energy_level: null, needs_checkin: false, ritual_slot: null } } };
    const result = shouldTriggerCheckIn(item);
    expect(result).not.toBeNull();
    expect(result!.emotion_before).toBe('ansioso');
  });

  it('triggers for ritual items', () => {
    const item = { ...baseItem, status: 'completed' as const, type: 'ritual' as const };
    const result = shouldTriggerCheckIn(item);
    expect(result).not.toBeNull();
  });

  it('returns null for plain completed task without triggers', () => {
    const item = { ...baseItem, status: 'completed' as const };
    expect(shouldTriggerCheckIn(item)).toBeNull();
  });
});

describe('detectShift', () => {
  it('returns unknown for null inputs', () => {
    expect(detectShift(null, null)).toBe('unknown');
    expect(detectShift('calmo', null)).toBe('unknown');
    expect(detectShift(null, 'focado')).toBe('unknown');
  });

  it('returns stable for same emotion', () => {
    expect(detectShift('calmo', 'calmo')).toBe('stable');
  });

  it('detects positive shift (challenging → positive)', () => {
    expect(detectShift('ansioso', 'calmo')).toBe('positive');
    expect(detectShift('cansado', 'focado')).toBe('positive');
  });

  it('detects negative shift (positive → challenging)', () => {
    expect(detectShift('calmo', 'ansioso')).toBe('negative');
    expect(detectShift('focado', 'cansado')).toBe('negative');
  });

  it('returns stable for same-category shift', () => {
    expect(detectShift('calmo', 'focado')).toBe('stable');
    expect(detectShift('ansioso', 'cansado')).toBe('stable');
  });
});

describe('getRandomPrompt', () => {
  it('returns string for aurora', () => {
    expect(typeof getRandomPrompt('aurora')).toBe('string');
  });
  it('returns string for crepusculo', () => {
    expect(typeof getRandomPrompt('crepusculo')).toBe('string');
  });
});
