// shell/SidebarNav.tsx — Desktop sidebar navigation
// Visible on ≥768px. Logo top, nav links, user bottom.

import { useAppStore } from '@/store/app-store';
import { useNav } from '@/hooks/useNav';
import type { AppPage } from '@/types/ui';

interface NavItem {
  key: AppPage;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-5h-6v5H5a1 1 0 01-1-1V10.5z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'pipeline',
    label: 'pipeline',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M6 10h12M8 14h8M10 18h4"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'raiz',
    label: 'raiz',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'projects',
    label: 'projects',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9h6M9 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'library',
    label: 'library',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
          stroke="currentColor" strokeWidth="1.3" fill="none" />
        <path d="M9 4h2a1 1 0 011 1v14a1 1 0 01-1 1H9" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <path d="M13 5l5-1.5v14.3L13 19.5V5z" stroke="currentColor" strokeWidth="1.3" fill="none" />
      </svg>
    ),
  },
];

const SECONDARY_ITEMS: NavItem[] = [
  {
    key: 'calendar',
    label: 'calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'analytics',
    label: 'analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V10M9 20V4M14 20v-8M19 20v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'graph',
    label: 'graph',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="18" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="10" cy="18" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8.5 7.5L15.5 9M12 16L16.5 11.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    key: 'search',
    label: 'search',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M15 15l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function SidebarNav() {
  const currentPage = useAppStore((s) => s.currentPage);
  const user = useAppStore((s) => s.user);
  const { navigate } = useNav();

  const name = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? '';

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-bg h-dvh shrink-0">
      {/* Logo */}
      <div className="px-5 pt-5 pb-6">
        <button onClick={() => navigate('home')} className="text-[15px] font-medium tracking-tight text-text-heading">
          MindRoot
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.key
            || (item.key === 'projects' && currentPage === 'project-detail')
            || (item.key === 'pipeline' && currentPage === 'triage')
            || (item.key === 'home' && currentPage === 'item-detail');

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                active
                  ? 'bg-accent-bg text-accent font-medium'
                  : 'text-text-muted hover:bg-surface hover:text-text'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="h-px bg-border my-3" />

        {SECONDARY_ITEMS.map((item) => {
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                active
                  ? 'bg-accent-bg text-accent font-medium'
                  : 'text-text-muted hover:bg-surface hover:text-text'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User + Settings */}
      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={() => navigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
            currentPage === 'settings'
              ? 'bg-accent-bg text-accent font-medium'
              : 'text-text-muted hover:bg-surface hover:text-text'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span>settings</span>
        </button>

        {name && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-accent-bg flex items-center justify-center text-xs text-accent font-medium shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[12px] text-text-muted truncate">{name}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
