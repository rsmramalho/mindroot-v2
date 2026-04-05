// engine/__test__/companion.test.ts — Companion engine tests
import { describe, it, expect } from 'vitest';
import { generateSuggestions, type CompanionContext } from '../companion';

const baseCtx: CompanionContext = {
  inboxCount: 0,
  staleCount: 0,
  totalItems: 10,
  lastWrapDate: new Date().toISOString(),
  currentEmotion: null,
  currentEnergy: null,
  emptyDomains: [],
  daysSinceWrap: 0,
};

describe('generateSuggestions', () => {
  it('returns empty for healthy system (silence is valid)', () => {
    const s = generateSuggestions(baseCtx);
    expect(s.length).toBe(0);
  });

  it('nudges when wrap overdue (3+ days)', () => {
    const s = generateSuggestions({ ...baseCtx, daysSinceWrap: 5 });
    expect(s.some((x) => x.id === 'wrap-overdue')).toBe(true);
  });

  it('nudges when inbox overflow (10+)', () => {
    const s = generateSuggestions({ ...baseCtx, inboxCount: 12 });
    expect(s.some((x) => x.id === 'inbox-overflow')).toBe(true);
  });

  it('observes when inbox growing (5-9)', () => {
    const s = generateSuggestions({ ...baseCtx, inboxCount: 7 });
    expect(s.some((x) => x.id === 'inbox-growing')).toBe(true);
  });

  it('nudges stale items', () => {
    const s = generateSuggestions({ ...baseCtx, staleCount: 3 });
    expect(s.some((x) => x.id === 'stale-items')).toBe(true);
  });

  it('observes empty domains (3+)', () => {
    const s = generateSuggestions({ ...baseCtx, emptyDomains: ['a', 'b', 'c'] });
    expect(s.some((x) => x.id === 'empty-domains')).toBe(true);
  });

  it('observes low energy', () => {
    const s = generateSuggestions({ ...baseCtx, currentEnergy: 'low' });
    expect(s.some((x) => x.id === 'low-energy')).toBe(true);
  });

  it('observes positive emotion', () => {
    const s = generateSuggestions({ ...baseCtx, currentEmotion: 'calmo' });
    expect(s.some((x) => x.id === 'positive-state')).toBe(true);
  });

  it('limits to max 3 suggestions', () => {
    const s = generateSuggestions({
      ...baseCtx,
      daysSinceWrap: 5,
      inboxCount: 15,
      staleCount: 3,
      emptyDomains: ['a', 'b', 'c'],
      currentEnergy: 'low',
    });
    expect(s.length).toBeLessThanOrEqual(3);
  });

  it('sorts by priority', () => {
    const s = generateSuggestions({
      ...baseCtx,
      daysSinceWrap: 5,
      inboxCount: 12,
      staleCount: 2,
    });
    expect(s[0].priority).toBeLessThanOrEqual(s[1]?.priority ?? Infinity);
  });
});
