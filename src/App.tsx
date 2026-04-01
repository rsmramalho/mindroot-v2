// App.tsx — MindRoot v2
// Shell + auth + page router. Fase 3: Geometria.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { useAppStore } from '@/store/app-store';
import { AppShell } from '@/components/shell/AppShell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// ─── Placeholder pages ────────────────────────────────

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-text-heading mb-2">{name}</h2>
      <p className="text-sm text-text-muted">Em construcao — Fase 4+</p>
    </div>
  );
}

// ─── Page Router ──────────────────────────────────────

function PageRouter() {
  const currentPage = useAppStore((s) => s.currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <PlaceholderPage name="Home" />;
      case 'pipeline': return <PlaceholderPage name="Pipeline" />;
      case 'triage': return <PlaceholderPage name="Triage" />;
      case 'wrap': return <PlaceholderPage name="Wrap" />;
      case 'projects': return <PlaceholderPage name="Projetos" />;
      case 'project-detail': return <PlaceholderPage name="Projeto" />;
      case 'calendar': return <PlaceholderPage name="Agenda" />;
      case 'raiz': return <PlaceholderPage name="Raiz" />;
      case 'analytics': return <PlaceholderPage name="Analytics" />;
      case 'library': return <PlaceholderPage name="Library" />;
      case 'settings': return <PlaceholderPage name="Settings" />;
      default: return <PlaceholderPage name="Home" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Authenticated App ────────────────────────────────

function AuthenticatedApp() {
  useRealtime();

  return (
    <AppShell>
      <PageRouter />
    </AppShell>
  );
}

// ─── Auth Gate ────────────────────────────────────────

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <p className="text-sm text-text-muted font-light">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-text-heading">MindRoot</h1>
          <p className="text-sm text-text-muted">Auth page — Fase 4</p>
        </div>
      </div>
    );
  }

  return <AuthenticatedApp />;
}

// ─── Root ─────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
