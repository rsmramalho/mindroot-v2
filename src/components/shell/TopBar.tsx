// shell/TopBar.tsx — Minimal top bar
// Settings access + wrap trigger. Light-first, DM Sans.

import { useAppStore } from '@/store/app-store';
import { getCurrentPeriod } from '@/types/ui';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export function TopBar({ onOpenSettings }: TopBarProps) {
  const navigate = useAppStore((s) => s.navigate);
  const period = getCurrentPeriod();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg">
      <button
        onClick={() => navigate('home')}
        className="text-lg font-medium tracking-tight text-text-heading"
      >
        MindRoot
      </button>

      <div className="flex items-center gap-3">
        <span
          className="text-xs font-light text-text-muted"
          style={{ color: period.color }}
        >
          {period.label}
        </span>

        <button
          onClick={() => navigate('wrap')}
          className="text-xs font-normal text-text-muted hover:text-text transition-colors"
          aria-label="Abrir wrap"
        >
          Wrap
        </button>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-xs font-normal text-text-muted hover:text-text transition-colors"
            aria-label="Configuracoes"
          >
            Config
          </button>
        )}
      </div>
    </header>
  );
}
