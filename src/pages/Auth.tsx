// pages/Auth.tsx — Login / Signup / Forgot Password / Reset Password
// Light-first, DM Sans. Email + Google OAuth via Supabase.

import { useState, useEffect } from 'react';
import { authService } from '@/service/auth-service';

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

interface AuthPageProps {
  onBack?: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Detect password reset callback
  useEffect(() => {
    if (window.location.pathname === '/auth/reset') {
      setMode('reset');
    }
  }, []);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError('');
    setSuccess('');
    setResetSent(false);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await authService.signInWithEmail(email, password);
      } else {
        await authService.signUp(email, password);
        setSuccess('Conta criada! Verifique seu email para confirmar.');
        switchMode('login');
      }
    } catch (err: any) {
      setError(err.message ?? 'Erro na autenticacao');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message ?? 'Erro com Google');
    }
  };

  const handleForgot = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (newPassword.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(newPassword);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message ?? 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot password ─────────────────────────────────
  if (mode === 'forgot') {
    return (
      <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6 w-full">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl font-medium text-text-heading tracking-tight">MindRoot</div>
            <p className="text-sm text-text-muted mt-1">recuperar senha</p>
          </div>

          {resetSent ? (
            <div className="text-center">
              <div className="text-3xl mb-3 text-success">✓</div>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                email enviado para <span className="font-medium text-text">{email}</span>.<br />
                verifique sua caixa de entrada e spam.
              </p>
              <button onClick={() => switchMode('login')} className="text-sm text-accent">
                voltar pro login
              </button>
            </div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu email"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent placeholder:text-text-muted mb-4"
              />

              {error && <p className="text-xs text-error mb-3">{error}</p>}

              <button
                onClick={handleForgot}
                disabled={loading || !email}
                className="w-full bg-accent text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50 mb-3"
              >
                {loading ? '...' : 'enviar link de recuperacao'}
              </button>

              <button onClick={() => switchMode('login')} className="w-full text-center text-xs text-text-muted py-2">
                ← voltar pro login
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Reset password (from email link) ─────────────────
  if (mode === 'reset') {
    return (
      <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6 w-full">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl font-medium text-text-heading tracking-tight">MindRoot</div>
            <p className="text-sm text-text-muted mt-1">nova senha</p>
          </div>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="nova senha (min 6 caracteres)"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent placeholder:text-text-muted mb-4"
            onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
          />

          {error && <p className="text-xs text-error mb-3">{error}</p>}

          <button
            onClick={handleResetPassword}
            disabled={loading || newPassword.length < 6}
            className="w-full bg-accent text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? '...' : 'atualizar senha'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Login / Signup ───────────────────────────────────
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl font-medium text-text-heading tracking-tight">MindRoot</div>
          <p className="text-sm text-text-muted mt-1 font-light">emocao precede acao</p>
        </div>

        {success && (
          <div className="bg-success-bg text-success-text text-xs rounded-xl px-4 py-2.5 mb-3 text-center">
            {success}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full bg-surface border border-border rounded-xl py-3 text-sm font-medium text-text-heading mb-4 hover:opacity-80 transition-colors"
        >
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email/password */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent placeholder:text-text-muted mb-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="senha"
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent placeholder:text-text-muted mb-4"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p className="text-xs text-error mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full bg-accent text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {loading ? '...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        {mode === 'login' && (
          <button onClick={() => switchMode('forgot')} className="w-full text-center text-xs text-text-muted mt-2 py-1">
            esqueceu a senha?
          </button>
        )}

        <button
          onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-xs text-text-muted mt-2 py-2"
        >
          {mode === 'login' ? 'Criar conta nova' : 'Ja tenho conta'}
        </button>

        {onBack && (
          <button onClick={onBack} className="w-full text-center text-xs text-accent mt-2 py-2">
            ← voltar
          </button>
        )}
      </div>
    </div>
  );
}
