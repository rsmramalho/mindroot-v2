// components/shell/BottomNav.tsx — ⌂ ▦ ◎ ○
import { useAppStore } from '@/store/app-store';
import type { AppPage } from '@/types/ui';

interface NavItem {
  page: AppPage;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { page: 'home',      icon: '⌂', label: 'Home' },
  { page: 'projects',  icon: '▧', label: 'Projetos' },
  { page: 'calendar',  icon: '▦', label: 'Agenda' },
  { page: 'ritual',    icon: '◎', label: 'Ritual' },
  { page: 'journal',   icon: '○', label: 'Journal' },
];

export function BottomNav() {
  const { currentPage, navigate } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-bg/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {NAV_ITEMS.map(({ page, icon, label }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-colors ${
                active ? 'text-mind' : 'text-muted hover:text-light'
              }`}
            >
              <span className="text-lg font-mono leading-none">{icon}</span>
              <span className="text-[10px] font-sans">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
