// components/shell/TopBar.tsx — Período + greeting
import { useRitualStore } from '@/store/ritual-store';

export function TopBar() {
  const { periodGreeting, currentPeriod, periodColor } = useRitualStore();

  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-wide text-light">
            MindRoot
          </h1>
          <p className="text-xs font-sans text-muted mt-0.5">
            <span style={{ color: periodColor }}>●</span>{' '}
            {periodGreeting} — {currentPeriod}
          </p>
        </div>
      </div>
    </header>
  );
}
