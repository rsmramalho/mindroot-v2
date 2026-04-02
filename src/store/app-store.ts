// store/app-store.ts — Zustand global UI state
import { create } from 'zustand';
import { supabase } from '@/service/supabase';
import type { AppPage, AppFilters } from '@/types/ui';
import { DEFAULT_FILTERS } from '@/types/ui';
import type { Emotion } from '@/types/item';
import type { User } from '@supabase/supabase-js';

export type ThemeMode = 'system' | 'light' | 'dark';

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  if (theme === 'system') {
    root.style.colorScheme = '';
  } else {
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }
}

interface AppState {
  // Navigation
  currentPage: AppPage;
  navigate: (page: AppPage) => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Filters
  filters: AppFilters;
  setFilter: <K extends keyof AppFilters>(key: K, value: AppFilters[K]) => void;
  resetFilters: () => void;

  // Soul state
  currentEmotion: Emotion | null;
  setCurrentEmotion: (emotion: Emotion | null) => void;

  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Item detail
  selectedItemId: string | null;
  selectItem: (id: string) => void;

  // UI
  isInputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentPage: 'home',
  navigate: (page) => set({ currentPage: page }),

  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Filters
  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Soul
  currentEmotion: null,
  setCurrentEmotion: (emotion) => set({ currentEmotion: emotion }),

  // Theme
  theme: (localStorage.getItem('mindroot-theme') as ThemeMode) ?? 'system',
  setTheme: (theme) => {
    localStorage.setItem('mindroot-theme', theme);
    set({ theme });
    applyTheme(theme);
    // Persist to Supabase (fire and forget)
    supabase.auth.updateUser({ data: { theme } }).catch(() => {});
  },

  // Item detail
  selectedItemId: null,
  selectItem: (id) => set({ selectedItemId: id, currentPage: 'item-detail' }),

  // UI
  isInputFocused: false,
  setInputFocused: (focused) => set({ isInputFocused: focused }),
}));
