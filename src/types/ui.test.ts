// types/ui.test.ts — Period detection + config validation
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCurrentPeriod, RITUAL_PERIODS } from './ui';

// ─── Helper to mock time ─────────────────────────────────

function mockHour(hour: number) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2025, 5, 15, hour, 30, 0)); // June 15, 2025 at {hour}:30
}

afterEach(() => {
  vi.useRealTimers();
});

// ─── RITUAL_PERIODS config ───────────────────────────────

describe('RITUAL_PERIODS', () => {
  it('has exactly 3 periods', () => {
    expect(RITUAL_PERIODS).toHaveLength(3);
  });

  it('has unique keys', () => {
    const keys = RITUAL_PERIODS.map((p) => p.key);
    expect(new Set(keys).size).toBe(3);
  });

  it('contains aurora, zenite, crepusculo', () => {
    const keys = RITUAL_PERIODS.map((p) => p.key);
    expect(keys).toContain('aurora');
    expect(keys).toContain('zenite');
    expect(keys).toContain('crepusculo');
  });

  it('each period has required fields', () => {
    for (const p of RITUAL_PERIODS) {
      expect(p.key).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(p.greeting).toBeTruthy();
      expect(p.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(typeof p.hours.start).toBe('number');
      expect(typeof p.hours.end).toBe('number');
    }
  });

  it('aurora has warm color', () => {
    const aurora = RITUAL_PERIODS.find((p) => p.key === 'aurora');
    expect(aurora!.color).toBe('#f0c674');
  });
});

// ─── getCurrentPeriod ────────────────────────────────────

describe('getCurrentPeriod', () => {
  it('returns aurora at 5:30', () => {
    mockHour(5);
    expect(getCurrentPeriod().key).toBe('aurora');
  });

  it('returns aurora at 8:30 (mid morning)', () => {
    mockHour(8);
    expect(getCurrentPeriod().key).toBe('aurora');
  });

  it('returns aurora at 11:30', () => {
    mockHour(11);
    expect(getCurrentPeriod().key).toBe('aurora');
  });

  it('returns zenite at 12:30', () => {
    mockHour(12);
    expect(getCurrentPeriod().key).toBe('zenite');
  });

  it('returns zenite at 15:30 (mid afternoon)', () => {
    mockHour(15);
    expect(getCurrentPeriod().key).toBe('zenite');
  });

  it('returns zenite at 17:30', () => {
    mockHour(17);
    expect(getCurrentPeriod().key).toBe('zenite');
  });

  it('returns crepusculo at 18:30', () => {
    mockHour(18);
    expect(getCurrentPeriod().key).toBe('crepusculo');
  });

  it('returns crepusculo at 22:30 (night)', () => {
    mockHour(22);
    expect(getCurrentPeriod().key).toBe('crepusculo');
  });

  it('returns crepusculo at 0:30 (midnight)', () => {
    mockHour(0);
    expect(getCurrentPeriod().key).toBe('crepusculo');
  });

  it('returns crepusculo at 3:30 (late night)', () => {
    mockHour(3);
    expect(getCurrentPeriod().key).toBe('crepusculo');
  });

  it('returns crepusculo at 4:30 (pre-dawn)', () => {
    mockHour(4);
    expect(getCurrentPeriod().key).toBe('crepusculo');
  });

  it('returns correct greeting for each period', () => {
    mockHour(8);
    expect(getCurrentPeriod().greeting).toBe('Bom dia');

    vi.setSystemTime(new Date(2025, 5, 15, 14, 0, 0));
    expect(getCurrentPeriod().greeting).toBe('Boa tarde');

    vi.setSystemTime(new Date(2025, 5, 15, 20, 0, 0));
    expect(getCurrentPeriod().greeting).toBe('Boa noite');
  });

  it('returns color matching the period', () => {
    mockHour(8);
    const period = getCurrentPeriod();
    const config = RITUAL_PERIODS.find((p) => p.key === period.key);
    expect(period.color).toBe(config!.color);
  });
});
