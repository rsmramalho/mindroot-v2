// store/wrap-store.ts — Wrap Session State
// Manages the multi-step wrap ritual flow.

import { create } from 'zustand';
import { wrapService, type WrapSession } from '@/service/wrap-service';
import { useSoulStore } from './soul-store';
import type { AtomItem, Emotion, EnergyLevel } from '@/types/item';

interface WrapState {
  session: WrapSession | null;
  step: number;
  loading: boolean;

  startWrap: () => Promise<void>;
  updateSession: (partial: Partial<WrapSession>) => void;
  setStep: (step: number) => void;
  commitWrap: (userId: string) => Promise<AtomItem>;
  reset: () => void;
}

const EMPTY_AUDIT = { inbox_count: 0, below_floor: [], orphans: [], stale_count: 0 };
// aurora is now read from soul-store in startWrap

export const useWrapStore = create<WrapState>((set, get) => ({
  session: null,
  step: 0,
  loading: false,

  startWrap: async () => {
    set({ loading: true });
    try {
      const data = await wrapService.collectWrapData();

      // Read aurora check-in from soul-store
      const soulState = useSoulStore.getState();
      const hasAurora = soulState.auroraCheckedToday && soulState.emotion && soulState.energy;
      const aurora = hasAurora
        ? { emotion: soulState.emotion as Emotion, energy: soulState.energy as EnergyLevel }
        : null;

      set({
        session: {
          created: data.created ?? [],
          modified: data.modified ?? [],
          decided: [],
          connections: [],
          seeds: [],
          soul: {
            aurora,
            intention: soulState.intention ?? null,
            tasks: [],
            crepusculo: null,
            shift: null,
          },
          audit: data.audit ?? EMPTY_AUDIT,
          next: [],
        },
        step: 0,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  updateSession: (partial) =>
    set((s) => ({
      session: s.session ? { ...s.session, ...partial } : null,
    })),

  setStep: (step) => set({ step }),

  commitWrap: async (userId: string) => {
    const { session } = get();
    if (!session) throw new Error('Nenhuma sessao ativa');
    set({ loading: true });
    try {
      const wrap = await wrapService.commitWrap(session, userId);
      set({ loading: false });
      return wrap;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  reset: () => set({ session: null, step: 0, loading: false }),
}));
