// hooks/useAuth.ts — Auth state management
import { useEffect, useState, useRef } from 'react';
import { authService } from '@/service/auth-service';
import { connectorService } from '@/service/connector-service';
import { useAppStore } from '@/store/app-store';
import type { ThemeMode } from '@/store/app-store';

export function useAuth() {
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const tokenStored = useRef(false);

  useEffect(() => {
    // On the OAuth callback URL, Supabase needs to read ?code from the URL
    // before we clear it. Keep loading=true until onAuthStateChange fires.
    const isOAuthCallback = window.location.pathname === '/auth/callback';

    if (!isOAuthCallback) {
      // Normal flow: resolve loading from existing session
      authService.getSession().then((session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }
    // On callback URL: skip getSession — the code exchange is async and hasn't
    // completed yet. onAuthStateChange(SIGNED_IN) will fire once it's done.

    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      // On the callback URL, Supabase fires INITIAL_SESSION (null) before the
      // code exchange completes. Ignore that event to keep the loading screen.
      if (isOAuthCallback && event === 'INITIAL_SESSION' && !session) {
        return;
      }

      setUser(session?.user ?? null);
      setLoading(false);

      // Restore theme from user_metadata
      if (session?.user?.user_metadata?.theme) {
        const saved = session.user.user_metadata.theme as ThemeMode;
        useAppStore.getState().setTheme(saved);
      }

      // Capture Google OAuth tokens for connectors (non-blocking, once per session)
      if (session?.provider_refresh_token && !tokenStored.current) {
        tokenStored.current = true;
        console.log('[connector] refresh_token detected, storing...');
        connectorService.storeTokens(
          session.provider_refresh_token,
          'google',
          { email: session.user?.email },
        ).then(async () => {
          console.log('[connector] tokens stored successfully');
          // Auto-sync Calendar + Gmail on first connect
          try {
            await connectorService.syncCalendar();
            console.log('[connector] calendar auto-synced');
          } catch { /* non-blocking */ }
          try {
            await connectorService.syncGmail();
            console.log('[connector] gmail auto-synced');
          } catch { /* non-blocking */ }
        }).catch((err) => {
          tokenStored.current = false; // allow retry on failure
          console.warn('[connector] failed to store tokens:', err);
        });
      }

      // Clean OAuth callback URL after successful exchange
      if (window.location.pathname === '/auth/callback') {
        window.history.replaceState(null, '', '/');
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const signIn = async (email: string, password: string) => {
    const { user } = await authService.signInWithEmail(email, password);
    setUser(user);
  };

  const signUp = async (email: string, password: string) => {
    const { user } = await authService.signUp(email, password);
    setUser(user ?? null);
  };

  const signOut = async () => {
    await authService.signOut();
    tokenStored.current = false;
    setUser(null);
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  return { user, loading, signIn, signUp, signOut, signInWithGoogle };
}
