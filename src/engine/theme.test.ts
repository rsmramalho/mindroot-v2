// engine/theme.test.ts — Theme engine tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getThemeColors,
  generateCssVariables,
  loadThemeConfig,
  saveThemeConfig,
  moveSectionUp,
  moveSectionDown,
  isValidModuleColor,
  DEFAULT_MODULE_COLORS,
  DEFAULT_DASHBOARD_ORDER,
  DEFAULT_THEME_CONFIG,
  SECTION_LABELS,
} from './theme';
import type { ThemeConfig, DashboardSection } from './theme';

// Mock localStorage
const store = new Map<string, string>();
const mockStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
  get length() { return store.size; },
  key: () => null,
} as Storage;

beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', mockStorage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── getThemeColors ─────────────────────────────────────────

describe('getThemeColors', () => {
  it('returns dark colors', () => {
    const colors = getThemeColors('dark');
    expect(colors.bg).toBe('#111318');
    expect(colors.surface).toBe('#1a1d24');
    expect(colors.textPrimary).toBe('#e8e0d4');
  });

  it('returns light colors', () => {
    const colors = getThemeColors('light');
    expect(colors.bg).toBe('#f5f2ed');
    expect(colors.surface).toBe('#ffffff');
    expect(colors.textPrimary).toBe('#2a2520');
  });
});

// ─── generateCssVariables ───────────────────────────────────

describe('generateCssVariables', () => {
  it('generates theme color variables', () => {
    const vars = generateCssVariables(DEFAULT_THEME_CONFIG);
    expect(vars['--mr-bg']).toBe('#111318');
    expect(vars['--mr-surface']).toBe('#1a1d24');
  });

  it('generates module color variables', () => {
    const vars = generateCssVariables(DEFAULT_THEME_CONFIG);
    expect(vars['--mr-mod-purpose']).toBe('#c4a882');
    expect(vars['--mr-mod-work']).toBe('#8a9e7a');
    expect(vars['--mr-mod-family']).toBe('#d4856a');
  });

  it('uses custom module colors', () => {
    const config: ThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      moduleColors: { ...DEFAULT_MODULE_COLORS, work: '#ff0000' },
    };
    const vars = generateCssVariables(config);
    expect(vars['--mr-mod-work']).toBe('#ff0000');
  });

  it('uses light colors when mode is light', () => {
    const config: ThemeConfig = { ...DEFAULT_THEME_CONFIG, mode: 'light' };
    const vars = generateCssVariables(config);
    expect(vars['--mr-bg']).toBe('#f5f2ed');
  });
});

// ─── loadThemeConfig / saveThemeConfig ───────────────────────

describe('theme persistence', () => {
  it('returns defaults when no saved config', () => {
    const config = loadThemeConfig();
    expect(config.mode).toBe('dark');
    expect(config.moduleColors).toEqual(DEFAULT_MODULE_COLORS);
    expect(config.dashboardOrder).toEqual(DEFAULT_DASHBOARD_ORDER);
  });

  it('saves and loads config', () => {
    const config: ThemeConfig = {
      mode: 'light',
      moduleColors: { ...DEFAULT_MODULE_COLORS, work: '#ff0000' },
      dashboardOrder: ['focus', 'overdue', 'today', 'modules', 'unclassified'],
    };
    saveThemeConfig(config);
    const loaded = loadThemeConfig();
    expect(loaded.mode).toBe('light');
    expect(loaded.moduleColors.work).toBe('#ff0000');
    expect(loaded.dashboardOrder[0]).toBe('focus');
  });

  it('handles invalid JSON gracefully', () => {
    store.set('mindroot:theme', '{invalid}');
    const config = loadThemeConfig();
    expect(config).toEqual(DEFAULT_THEME_CONFIG);
  });

  it('handles invalid mode gracefully', () => {
    store.set('mindroot:theme', JSON.stringify({ mode: 'neon' }));
    const config = loadThemeConfig();
    expect(config.mode).toBe('dark');
  });

  it('handles invalid dashboardOrder gracefully', () => {
    store.set('mindroot:theme', JSON.stringify({ dashboardOrder: ['a', 'b'] }));
    const config = loadThemeConfig();
    expect(config.dashboardOrder).toEqual(DEFAULT_DASHBOARD_ORDER);
  });

  it('merges partial module colors with defaults', () => {
    store.set('mindroot:theme', JSON.stringify({ moduleColors: { work: '#123456' } }));
    const config = loadThemeConfig();
    expect(config.moduleColors.work).toBe('#123456');
    expect(config.moduleColors.purpose).toBe(DEFAULT_MODULE_COLORS.purpose);
  });
});

// ─── moveSectionUp / moveSectionDown ────────────────────────

describe('section ordering', () => {
  const order: DashboardSection[] = ['overdue', 'focus', 'today', 'modules', 'unclassified'];

  it('moves section up', () => {
    const result = moveSectionUp(order, 'today');
    expect(result).toEqual(['overdue', 'today', 'focus', 'modules', 'unclassified']);
  });

  it('does not move first section up', () => {
    const result = moveSectionUp(order, 'overdue');
    expect(result).toEqual(order);
  });

  it('moves section down', () => {
    const result = moveSectionDown(order, 'focus');
    expect(result).toEqual(['overdue', 'today', 'focus', 'modules', 'unclassified']);
  });

  it('does not move last section down', () => {
    const result = moveSectionDown(order, 'unclassified');
    expect(result).toEqual(order);
  });

  it('returns same array for non-existent section', () => {
    const result = moveSectionUp(order, 'nonexistent' as DashboardSection);
    expect(result).toEqual(order);
  });
});

// ─── isValidModuleColor ─────────────────────────────────────

describe('isValidModuleColor', () => {
  it('accepts valid hex colors', () => {
    expect(isValidModuleColor('#c4a882')).toBe(true);
    expect(isValidModuleColor('#FF0000')).toBe(true);
    expect(isValidModuleColor('#123abc')).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(isValidModuleColor('c4a882')).toBe(false);
    expect(isValidModuleColor('#fff')).toBe(false);
    expect(isValidModuleColor('#c4a88')).toBe(false);
    expect(isValidModuleColor('red')).toBe(false);
    expect(isValidModuleColor('')).toBe(false);
    expect(isValidModuleColor('#gggggg')).toBe(false);
  });
});

// ─── Constants ──────────────────────────────────────────────

describe('theme constants', () => {
  it('DEFAULT_MODULE_COLORS has all 6 modules', () => {
    const keys = Object.keys(DEFAULT_MODULE_COLORS);
    expect(keys).toHaveLength(6);
    expect(keys).toContain('purpose');
    expect(keys).toContain('work');
    expect(keys).toContain('family');
    expect(keys).toContain('body');
    expect(keys).toContain('mind');
    expect(keys).toContain('soul');
  });

  it('DEFAULT_DASHBOARD_ORDER has all 5 sections', () => {
    expect(DEFAULT_DASHBOARD_ORDER).toHaveLength(5);
  });

  it('SECTION_LABELS has labels for all sections', () => {
    for (const section of DEFAULT_DASHBOARD_ORDER) {
      expect(SECTION_LABELS[section]).toBeDefined();
      expect(typeof SECTION_LABELS[section]).toBe('string');
    }
  });
});
