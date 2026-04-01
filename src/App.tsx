// App.tsx — MindRoot v2
// Landing → Auth → Onboarding → Shell + pages

import { useState, useLayoutEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { useAppStore } from '@/store/app-store';
import { AppShell } from '@/components/shell/AppShell';

import { HomePage } from '@/pages/Home';
import { PipelinePage } from '@/pages/Pipeline';
import { WrapPage } from '@/pages/Wrap';
import { ProjectsPage } from '@/pages/Projects';
import { CalendarPage } from '@/pages/Calendar';
import { AnalyticsPage } from '@/pages/Analytics';
import { LibraryPage } from '@/pages/Library';
import { SettingsPage } from '@/pages/Settings';
import { RaizPage } from '@/pages/Raiz';
import { AuthPage } from '@/pages/Auth';
import { LandingPage } from '@/pages/Landing';
import { OnboardingPage } from '@/pages/Onboarding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

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
  const [showAuth, setShowAuth] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  // Reset showAuth when user logs out
  useLayoutEffect(() => {
    if (!user) setShowAuth(false);
  }, [user]);

  // Check localStorage for onboarding
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
