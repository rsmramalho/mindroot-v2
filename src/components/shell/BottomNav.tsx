// shell/BottomNav.tsx — Bottom navigation
// 5 tabs: Home, Pipeline, Raiz (center), Projects, Calendar
// SVG icons 24px, labels 11px, touch area 48px, height 56px

import { useAppStore } from '@/store/app-store';
import { useNav } from '@/hooks/useNav';
import { useItems } from '@/hooks/useItems';
import type { AppPage } from '@/types/ui';

interface NavItem {
  key: AppPage;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'home',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-5h-6v5H5a1 1 0 01-1-1V10.5z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    key: 'pipeline',
    label: 'pipeline',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M6 10h12M8 14h8M10 18h4"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          opacity={active ? 1 : 0.8}
        />
      </svg>
    ),
  },
  {
    key: 'raiz',
    label: 'raiz',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8"
          stroke="currentColor" strokeWidth="1.5"
          fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'projects',
    label: 'projects',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2"
          stroke="currentColor" strokeWidth="1.5"
          fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}
        />
        <path d="M9 9h6M9 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'library',
    label: 'library',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
          stroke="currentColor" strokeWidth={active ? '1.8' : '1.3'} fill="none" />
        <path d="M9 4h2a1 1 0 011 1v14a1 1 0 01-1 1H9"
          stroke="currentColor" strokeWidth={active ? '1.8' : '1.3'} fill="none" />
        <path d="M13 5l5-1.5v14.3L13 19.5V5z"
          stroke="currentColor" strokeWidth={active ? '1.8' : '1.3'} fill="none" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const currentPage = useAppStore((s) => s.currentPage);
  const { navigate } = useNav();
  const { items } = useItems();
  const inboxCount = items.filter((i) => i.state === 'inbox').length;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full bg-bg border-t border-border z-20"
      role="navigation"
      aria-label="Navegacao principal"
    >
      <div className="flex items-center h-14 pb-[max(0rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.key
            || (item.key === 'projects' && (currentPage === 'project-detail'))
            || (item.key === 'pipeline' && currentPage === 'triage')
            || (item.key === 'home' && currentPage === 'item-detail');

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[48px] transition-colors ${
                active ? 'text-text-heading' : 'text-text-muted'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              {item.icon(active)}
              <span className={`text-[10px] ${active ? 'font-medium' : 'font-normal'}`}>
                {item.label}
              </span>
              {active && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />}
              {/* Inbox badge */}
              {item.key === 'home' && inboxCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-error text-white text-[9px] font-medium flex items-center justify-center min-w-[18px] min-h-[18px]">
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
