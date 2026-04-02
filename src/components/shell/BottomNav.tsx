// shell/BottomNav.tsx — Bottom navigation
// 5 tabs: Home, Pipeline, Projects, Calendar, Raiz
// Inbox badge on Home when inbox > 0

import { useAppStore } from '@/store/app-store';
import { useNav } from '@/hooks/useNav';
import { useItems } from '@/hooks/useItems';
import type { AppPage } from '@/types/ui';

interface NavItem {
  key: AppPage;
  label: string;
  geometry: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'home', geometry: '·' },
  { key: 'pipeline', label: 'pipeline', geometry: '△' },
  { key: 'projects', label: 'projects', geometry: '□' },
  { key: 'calendar', label: 'calendar', geometry: '⬡' },
  { key: 'raiz', label: 'raiz', geometry: '○' },
];

export function BottomNav() {
  const currentPage = useAppStore((s) => s.currentPage);
  const { navigate } = useNav();
  const { items } = useItems();
  const inboxCount = items.filter((i) => i.state === 'inbox').length;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border z-20"
      role="navigation"
      aria-label="Navegacao principal"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.key
            || (item.key === 'projects' && currentPage === 'project-detail')
            || (item.key === 'pipeline' && currentPage === 'triage');

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? 'text-text-heading' : 'text-text-muted'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <span className="text-lg leading-none font-light">{item.geometry}</span>
              <span className="text-[10px] font-normal">{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-text-heading mt-px" />}
              {/* Inbox badge */}
              {item.key === 'home' && inboxCount > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-error text-white text-[9px] font-medium flex items-center justify-center">
                  {inboxCount > 9 ? '9+' : inboxCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
