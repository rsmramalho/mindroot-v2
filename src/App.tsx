// App.tsx — MindRoot v2
// Landing → Auth → Onboarding → Shell + pages + companion

import { useState, useLayoutEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { useAppStore } from '@/store/app-store';
import { AppShell } from '@/components/shell/AppShell';
import { CompanionSheet } from '@/components/companion/CompanionSheet';

// Static pages (pre-auth)
import { LandingPage } from '@/pages/Landing';
import { AuthPage } from '@/pages/Auth';
import { OnboardingPage } from '@/pages/Onboarding';

// Lazy-loaded pages (post-auth)
const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })));
const PipelinePage = lazy(() => import('@/pages/Pipeline').then((m) => ({ default: m.PipelinePage })));
const WrapPage = lazy(() => import('@/pages/Wrap').then((m) => ({ default: m.WrapPage })));
const ProjectsPage = lazy(() => import('@/pages/Projects').then((m) => ({ default: m.ProjectsPage })));
const CalendarPage = lazy(() => import('@/pages/Calendar').then((m) => ({ default: m.CalendarPage })));
const AnalyticsPage = lazy(() => import('@/pages/Analytics').then((m) => ({ default: m.AnalyticsPage })));
const LibraryPage = lazy(() => import('@/pages/Library').then((m) => ({ default: m.LibraryPage })));
const SettingsPage = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.SettingsPage })));
const RaizPage = lazy(() => import('@/pages/Raiz').then((m) => ({ default: m.RaizPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// ─── Loading fallback ─────────────────────────────────

function PageSkeleton() {
  return (
    <div className="p-5 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 bg-surface rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

// ─── Page Router ──────────────────────────────────────

function PageRouter() {
  const currentPage = useAppStore((s) => s.currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'pipeline': return <PipelinePage />;
      case 'triage': return <PipelinePage />;
      case 'wrap': return <WrapPage />;
      case 'projects': return <ProjectsPage />;
      case 'project-detail': return <ProjectsPage />;
      case 'calendar': return <CalendarPage />;
      case 'raiz': return <RaizPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'library': return <LibraryPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage />;
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
        <Suspense fallback={<PageSkeleton />}>
          {renderPage()}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Authenticated App ────────────────────────────────

function AuthenticatedApp() {
  useRealtime();
  const [companionOpen, setCompanionOpen] = useState(false);

  return (
    <AppShell onOpenSettings={() => useAppStore.getState().navigate('settings')}>
      <PageRouter />
      {/* FAB for companion */}
      <motion.button
        onClick={() => setCompanionOpen(true)}
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full bg-gradient-to-br from-ai-purple via-ai-blue to-ai-green text-white flex items-center justify-center text-lg font-light shadow-lg shadow-accent/20 z-30"
        aria-label="Abrir companion"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
        whileTap={{ scale: 0.9 }}
      >
        ○
      </motion.button>
      <CompanionSheet open={companionOpen} onClose={() => setCompanionOpen(false)} />
    </AppShell>
  );
}

// ─── Auth Gate ────────────────────────────────────────

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useLayoutEffect(() => {
    if (!user) setShowAuth(false);
  }, [user]);

  useLayoutEffect(() => {
    if (user) {
      const key = `mindroot_onboarding_${user.id}`;
      setOnboardingDone(localStorage.getItem(key) === 'done');
    }
  }, [user]);

  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`mindroot_onboarding_${user.id}`, 'done');
    }
    setOnboardingDone(true);
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="text-2xl font-medium text-text-heading tracking-tight">MindRoot</div>
          <div className="mt-4 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
    return <LandingPage onLogin={() => setShowAuth(true)} />;
  }

  if (!onboardingDone) {
    return <OnboardingPage onComplete={completeOnboarding} />;
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
