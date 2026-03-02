// App.tsx — Router + Providers (< 80 linhas)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/app-store';
import { AppShell } from '@/components/shell/AppShell';

// Pages
import { AuthPage } from '@/pages/Auth';
import { HomePage } from '@/pages/Home';
import { InboxPage } from '@/pages/Inbox';
import { RitualPage } from '@/pages/Ritual';
import { JournalPage } from '@/pages/Journal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageRouter() {
  const currentPage = useAppStore((s) => s.currentPage);

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'inbox':
      return <InboxPage />;
    case 'ritual':
      return <RitualPage />;
    case 'journal':
      return <JournalPage />;
    default:
      return <HomePage />;
  }
}

function AuthenticatedApp() {
  return (
    <AppShell>
      <PageRouter />
    </AppShell>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-light animate-pulse">MindRoot</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
