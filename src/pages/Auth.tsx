// pages/Auth.tsx — Login + Sign Up
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-light tracking-wider">
          MindRoot
        </h1>
        <p className="font-sans text-xs text-muted mt-2 tracking-widest uppercase">
          Emoção + Ação + Tempo
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm font-sans text-light placeholder:text-muted/50 focus:outline-none focus:border-mind/50 transition-colors"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          minLength={6}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm font-sans text-light placeholder:text-muted/50 focus:outline-none focus:border-mind/50 transition-colors"
        />

        {error && (
          <p className="text-xs text-heart text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mind text-bg font-sans text-sm font-medium rounded-lg py-3 hover:bg-mind/90 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : isLogin ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      {/* Toggle */}
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
        }}
        className="mt-6 text-xs font-sans text-muted hover:text-light transition-colors"
      >
        {isLogin ? 'Não tem conta? Criar agora' : 'Já tem conta? Fazer login'}
      </button>
    </div>
  );
}
