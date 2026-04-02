// shell/TopBar.tsx — Minimal top bar
// Wireframe: search + menu icons on right. Greeting is on the page, not here.

import { useNav } from '@/hooks/useNav';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export function TopBar({ onOpenSettings }: TopBarProps) {
  const { navigate } = useNav();

  return (
    <header className="flex items-center justify-between px-5 pt-3 pb-2 bg-bg">
      <button
        onClick={() => navigate('home')}
        className="text-base font-medium tracking-tight text-text-heading"
      >
        MindRoot
      </button>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <button
          onClick={() => navigate('search')}
          className="w-11 h-11 rounded-full bg-surface flex items-center justify-center"
          aria-label="Buscar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Menu */}
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 rounded-full bg-surface flex items-center justify-center"
          aria-label="Menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="2" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
