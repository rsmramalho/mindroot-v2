// store/soul-store.ts — Soul loop state (aurora check-in)
// auroraCheckedDate tracks the ISO date (YYYY-MM-DD) of last check-in.
// Consumers compare against today to auto-reset at midnight.
import { create } from 'zustand';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface SoulState {
  auroraCheckedDate: string | null;
  auroraCheckedToday: boolean;
  emotion: string | null;
  energy: 'high' | 'medium' | 'low' | null;
  intention: string | null;

  setAurora: (emotion: string, energy: 'high' | 'medium' | 'low', intention: string) => void;
  skipAurora: () => void;
  reset: () => void;
}

export const useSoulStore = create<SoulState>((set) => ({
  auroraCheckedDate: null,
  auroraCheckedToday: false,
  emotion: null,
  energy: null,
  intention: null,

  setAurora: (emotion, energy, intention) => set({
    auroraCheckedDate: todayKey(),
    auroraCheckedToday: true,
    emotion,
    energy,
    intention,
  }),

  skipAurora: () => set({ auroraCheckedDate: todayKey(), auroraCheckedToday: true }),

  reset: () => set({
    auroraCheckedDate: null,
    auroraCheckedToday: false,
    emotion: null,
    energy: null,
    intention: null,
  }),
}));

// Call on app mount to auto-reset if date changed (midnight rollover)
export function checkSoulMidnightReset() {
  const { auroraCheckedDate } = useSoulStore.getState();
  if (auroraCheckedDate && auroraCheckedDate !== todayKey()) {
    useSoulStore.getState().reset();
  }
}
