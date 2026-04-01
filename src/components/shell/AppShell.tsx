// shell/AppShell.tsx — App layout wrapper
// TopBar + content area + BottomNav. Light-first, responsive.

import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  onOpenSettings?: () => void;
}

export function AppShell({ children, onOpenSettings }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-bg text-text font-sans flex flex-col mx-auto w-full max-w-[430px] shadow-sm">
      <TopBar onOpenSettings={onOpenSettings} />

      <main className="flex-1 pb-16 overflow-y-auto">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
