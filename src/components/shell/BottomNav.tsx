// shell/BottomNav.tsx — Bottom navigation
// 5 tabs: Home, Pipeline, Projects, Calendar, Raiz

import { useAppStore } from '@/store/app-store';
import type { AppPage } from '@/types/ui';

interface NavItem {
  key: AppPage;
  label: string;
  geometry: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', geometry: '·' },
  { key: 'pipeline', label: 'Pipeline', geometry: '△' },
  { key: 'projects', label: 'Projetos', geometry: '□' },
  { key: 'calendar', label: 'Agenda', geometry: '⬡' },
  { key: 'raiz', label: 'Raiz', geometry: '○' },
];

export function BottomNav() {
  const currentPage = useAppStore((s) => s.currentPage);
  const navigate = useAppStore((s) => s.navigate);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border"
      role="navigation"
      aria-label="Navegacao principal"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto py-2">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.key
            || (item.key === 'projects' && currentPage === 'project-detail');

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? 'text-text-heading' : 'text-text-muted'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <span className="text-lg leading-none font-light">{item.geometry}</span>
              <span className="text-[10px] font-normal">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
