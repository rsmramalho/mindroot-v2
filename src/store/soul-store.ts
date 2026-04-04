// store/soul-store.ts — Soul loop state (aurora check-in)
import { create } from 'zustand';

interface SoulState {
  auroraCheckedToday: boolean;
  emotion: string | null;
  energy: 'high' | 'medium' | 'low' | null;
  intention: string | null;

  setAurora: (emotion: string, energy: 'high' | 'medium' | 'low', intention: string) => void;
  skipAurora: () => void;
  reset: () => void;
}

export const useSoulStore = create<SoulState>((set) => ({
  auroraCheckedToday: false,
  emotion: null,
  energy: null,
  intention: null,

  setAurora: (emotion, energy, intention) => set({
    auroraCheckedToday: true,
    emotion,
    energy,
    intention,
  }),

  skipAurora: () => set({ auroraCheckedToday: true }),

  reset: () => set({
    auroraCheckedToday: false,
    emotion: null,
    energy: null,
    intention: null,
  }),
}));
