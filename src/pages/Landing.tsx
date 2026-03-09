// pages/Landing.tsx — Public landing page (pre-auth)
// Mobile-first, standalone (no AppShell)

import { motion } from 'framer-motion';
import { LogoFull } from '@/components/shared/Logo';

interface LandingPageProps {
  onLogin: () => void;
}

const BENEFITS = [
  {
    title: 'Clareza Emocional',
    description: 'Registre como voce se sente antes e depois de cada acao. Descubra padroes que transformam sua rotina.',
    color: '#8a9e7a',
  },
  {
    title: 'Rituais com Proposito',
    description: 'Organize seu dia em Aurora, Zenite e Crepusculo. Cada periodo tem seu ritmo e intencao.',
    color: '#c4a882',
  },
  {
    title: 'Insights Profundos',
    description: 'Analise emocional, streaks, correlacoes e sugestoes inteligentes para evoluir com consciencia.',
    color: '#d4856a',
  },
] as const;

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: '#111318' }}
    >
      {/* Hero */}
      <motion.section
        className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <LogoFull
          iconSize={32}
          wordmarkSize="xl"
          variant="duo"
          layout="vertical"
        />

        <p
          className="mt-8 text-center max-w-sm"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '18px',
            fontWeight: 300,
            color: '#a89478',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}
        >
          Emocao precede acao, reflexao fecha o ciclo
        </p>

        <button
          onClick={onLogin}
          className="mt-10 transition-all duration-200 hover:opacity-90"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            color: '#111318',
            backgroundColor: '#c4a882',
            borderRadius: '10px',
            padding: '14px 40px',
            letterSpacing: '0.02em',
          }}
        >
          Comecar agora
        </button>
      </motion.section>

      {/* Benefits */}
      <section className="px-6 pb-16">
        <div className="max-w-sm mx-auto flex flex-col gap-4">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
              className="rounded-xl"
              style={{
                backgroundColor: '#1a1d24',
                border: `1px solid ${benefit.color}20`,
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: benefit.color,
                  marginBottom: '8px',
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#a8947890',
                  lineHeight: 1.55,
                }}
              >
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8 flex flex-col items-center gap-4">
        <button
          onClick={onLogin}
          className="transition-colors hover:text-light"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#a89478',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Ja tem conta? Entrar
        </button>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: '#a8947830',
          }}
        >
          MindRoot v1.0.0
        </span>
      </footer>
    </div>
  );
}
