// shell/AppShell.tsx — Responsive app layout
// Mobile (<768px): TopBar + content + BottomNav
// Desktop (≥768px): SidebarNav + TopBar + content (no BottomNav)

import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { SidebarNav } from './SidebarNav';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface AppShellProps {
  children: ReactNode;
  onOpenSettings?: () => void;
}

export function AppShell({ children, onOpenSettings }: AppShellProps) {
  const { isMobile } = useBreakpoint();

  return (
    <div className="min-h-dvh bg-bg text-text font-sans flex">
      {/* Sidebar — desktop only */}
      <SidebarNav />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-h-dvh relative">
        {isMobile && <TopBar onOpenSettings={onOpenSettings} />}

        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pb-16' : 'pb-4'}`}>
          <div className="mx-auto w-full max-w-3xl">
            {children}
          </div>
        </main>

        {isMobile && <BottomNav />}
      </div>
    </div>
  );
}
