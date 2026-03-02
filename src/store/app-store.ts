// store/app-store.ts — Zustand global UI state
import { create } from 'zustand';
import type { AppPage, AppFilters } from '@/types/ui';
import { DEFAULT_FILTERS } from '@/types/ui';
import type { Emotion } from '@/types/item';
import type { User } from '@supabase/supabase-js';

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

  // UI
  isInputFocused: false,
  setInputFocused: (focused) => set({ isInputFocused: focused }),
}));
