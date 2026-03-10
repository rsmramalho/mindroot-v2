// store/onboarding-store.ts — Persisted flags for onboarding + first-use hints
// Per-user: keyed by userId so different Google accounts each see the wizard
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  // Per-user completion: { [userId]: true }
  onboardingDoneFor: Record<string, boolean>;
  setOnboardingDone: (userId?: string) => void;
  isOnboardingDone: (userId: string | null | undefined) => boolean;

  // AtomInput tooltip shown once (global is fine — UI hint, not per-user)
  inputTooltipShown: boolean;
  setInputTooltipShown: () => void;

  // Reset (for testing) — pass userId to reset just one user, or omit to reset all
  resetOnboarding: (userId?: string) => void;

  // Legacy compat: flat onboardingDone flag for existing users (pre-alpha.24)
  onboardingDone: boolean;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      onboardingDoneFor: {},
      onboardingDone: false, // legacy — kept so old localStorage data isn't lost

      setOnboardingDone: (userId?: string) => {
        const update: Partial<OnboardingState> = { onboardingDone: true };
        if (userId) {
          update.onboardingDoneFor = { ...get().onboardingDoneFor, [userId]: true };
        }
        set(update);
      },

      isOnboardingDone: (userId) => {
        if (!userId) return false;
        const s = get();
        // Check per-user first, then fall back to legacy global flag for existing users
        if (s.onboardingDoneFor[userId] !== undefined) {
          return s.onboardingDoneFor[userId];
        }
        return s.onboardingDone;
      },

      inputTooltipShown: false,
      setInputTooltipShown: () => set({ inputTooltipShown: true }),

      resetOnboarding: (userId?: string) => {
        if (userId) {
          set((s) => ({
            onboardingDoneFor: { ...s.onboardingDoneFor, [userId]: false },
          }));
        } else {
          set({ onboardingDoneFor: {}, onboardingDone: false, inputTooltipShown: false });
        }
      },
    }),
    {
      name: 'mindroot-onboarding',
    }
  )
);

