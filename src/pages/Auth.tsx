// pages/Auth.tsx — Login / Signup
// Light-first, DM Sans. Email + Google OAuth via Supabase.

import { useState } from 'react';
import { authService } from '@/service/auth-service';

interface AuthPageProps {
  onBack?: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await authService.signInWithEmail(email, password);
      } else {
        await authService.signUp(email, password);
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

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl font-medium text-text-heading tracking-tight">MindRoot</div>
          <p className="text-sm text-text-muted mt-1 font-light">emocao precede acao</p>
        </div>

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
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#534AB7] placeholder:text-text-muted mb-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="senha"
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#534AB7] placeholder:text-text-muted mb-4"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p className="text-xs text-[#D85A30] mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full bg-[#534AB7] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {loading ? '...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-xs text-text-muted mt-4 py-2"
        >
          {mode === 'login' ? 'Criar conta nova' : 'Ja tenho conta'}
        </button>

        {onBack && (
          <button onClick={onBack} className="w-full text-center text-xs text-[#534AB7] mt-2 py-2">
            ← voltar
          </button>
        )}
      </div>
    </div>
  );
}
