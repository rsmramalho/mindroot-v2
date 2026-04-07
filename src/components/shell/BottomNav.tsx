// shell/BottomNav.tsx — Bottom navigation with active indicators
// 4 tabs: Home, Search, Calendar, Mail
// Purple accent for active state, icons 20px, labels 10px

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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-5h-6v5H5a1 1 0 01-1-1V10.5z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          fill={active ? 'currentColor' : 'none'} 
        />
      </svg>
    ),
  },
  {
    key: 'search',
    label: 'search',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'calendar',
    label: 'calendar',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'projects',
    label: 'mail',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 5h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="flex items-center h-13 pb-[max(0rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.key
            || (item.key === 'projects' && (currentPage === 'project-detail'))
            || (item.key === 'pipeline' && currentPage === 'triage')
            || (item.key === 'home' && currentPage === 'item-detail');

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[44px] transition-colors ${
                active ? 'text-accent' : 'text-text-muted'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              {item.icon(active)}
              <span className={`text-[10px] font-medium`}>
                {item.label}
              </span>
              {/* Inbox badge */}
              {item.key === 'home' && inboxCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-error text-white text-[8px] font-medium flex items-center justify-center min-w-[16px] min-h-[16px]">
                  {inboxCount > 9 ? '9' : inboxCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
