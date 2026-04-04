// App.tsx — MindRoot v2
// BrowserRouter + lazy pages + auth gate

import { useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { useAppStore, applyTheme } from '@/store/app-store';
import type { ThemeMode } from '@/store/app-store';
import { AppShell } from '@/components/shell/AppShell';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { ToastContainer } from '@/components/shared/ToastContainer';
import type { AppPage } from '@/types/ui';

// Static pages (pre-auth)
import { LandingPage } from '@/pages/Landing';
import { AuthPage } from '@/pages/Auth';
import { CockpitPage as CockpitPreview } from '@/pages/Cockpit';

// Lazy-loaded pages (post-auth)
const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })));
const PipelinePage = lazy(() => import('@/pages/Pipeline').then((m) => ({ default: m.PipelinePage })));
const WrapPage = lazy(() => import('@/pages/Wrap').then((m) => ({ default: m.WrapPage })));
const ProjectsPage = lazy(() => import('@/pages/Projects').then((m) => ({ default: m.ProjectsPage })));
const CalendarPage = lazy(() => import('@/pages/Calendar').then((m) => ({ default: m.CalendarPage })));
const AnalyticsPage = lazy(() => import('@/pages/Analytics').then((m) => ({ default: m.AnalyticsPage })));
const LibraryPage = lazy(() => import('@/pages/Library').then((m) => ({ default: m.LibraryPage })));
const GraphPage = lazy(() => import('@/pages/Graph').then((m) => ({ default: m.GraphPage })));
const SettingsPage = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.SettingsPage })));
const RaizPage = lazy(() => import('@/pages/Raiz').then((m) => ({ default: m.RaizPage })));
const SearchPage = lazy(() => import('@/pages/Search').then((m) => ({ default: m.SearchPage })));
const ItemDetailPage = lazy(() => import('@/pages/ItemDetail').then((m) => ({ default: m.ItemDetailPage })));
const CockpitPage = lazy(() => import('@/pages/Cockpit').then((m) => ({ default: m.CockpitPage })));

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

// ─── Route → Zustand sync ─────────────────────────────

const PATH_TO_PAGE: Record<string, AppPage> = {
  '/': 'home',
  '/home': 'home',
  '/inbox': 'inbox',
  '/pipeline': 'pipeline',
  '/wrap': 'wrap',
  '/projects': 'projects',
  '/calendar': 'calendar',
  '/raiz': 'raiz',
  '/analytics': 'analytics',
  '/library': 'library',
  '/search': 'search',
  '/settings': 'settings',
  '/graph': 'graph',
  '/cockpit': 'home',
};

function RouteSync() {
  const location = useLocation();
  const setPage = useAppStore((s) => s.navigate);

  useLayoutEffect(() => {
    const path = location.pathname;
    const page = PATH_TO_PAGE[path];
    if (page) {
      setPage(page);
    } else if (path.startsWith('/item/')) {
      setPage('item-detail');
    }
  }, [location.pathname, setPage]);

  return null;
}

// ─── Animated Routes ──────────────────────────────────

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      >
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/wrap" element={<WrapPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/raiz" element={<RaizPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            <Route path="/cockpit" element={<CockpitPage />} />
            <Route path="/auth/callback" element={<HomePage />} />
            <Route path="/auth/reset" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Authenticated App ────────────────────────────────

// First-time redirect to Raiz (non-blocking)
function FirstTimeRaizRedirect() {
  const user = useAppStore((s) => s.user);
  const routerNavigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !user.user_metadata?.raiz_welcomed && location.pathname === '/') {
      routerNavigate('/raiz', { replace: true });
    }
  }, [user, routerNavigate, location.pathname]);

  return null;
}

function AuthenticatedApp() {
  useRealtime();
  const routerNavigate = useNavigate();

  return (
    <>
      <ToastContainer />
      <AppShell onOpenSettings={() => routerNavigate('/settings')}>
        <OfflineBanner />
        <RouteSync />
        <FirstTimeRaizRedirect />
        <AnimatedRoutes />
      </AppShell>
    </>
  );
}

// ─── Auth Gate ────────────────────────────────────────

function AppContent() {
  // Apply saved theme on mount
  useLayoutEffect(() => {
    const saved = localStorage.getItem('mindroot-theme') as ThemeMode | null;
    applyTheme(saved ?? 'system');
  }, []);
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useLayoutEffect(() => {
    if (!user) setShowAuth(false);
  }, [user]);

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

  // Password reset callback — render AuthPage regardless of auth state
  if (window.location.pathname === '/auth/reset') {
    return <AuthPage />;
  }

  // Cockpit preview — accessible without auth for testing
  if (window.location.pathname === '/preview/cockpit') {
    return <CockpitPreview />;
  }

  if (!user) {
    if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
    return <LandingPage onLogin={() => setShowAuth(true)} />;
  }

  return <AuthenticatedApp />;
}

// ─── Root ─────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
