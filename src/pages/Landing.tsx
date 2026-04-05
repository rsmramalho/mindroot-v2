// pages/Landing.tsx — Public landing page
// Minimal: logo, tagline, CTA

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-4" style={{ width: '100%' }}>
      <div className="text-center" style={{ width: '100%', maxWidth: '360px' }}>
        {/* Raiz symbol */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent-light to-accent flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/30" />
          </div>
        </div>

        <h1 className="text-4xl font-medium text-text-heading tracking-tight mb-3">MindRoot</h1>
        <p className="text-base text-text-muted font-light leading-relaxed mb-2">
          sistema operacional pessoal
        </p>
        <p className="text-[13px] text-text-muted font-light leading-relaxed mb-6">
          emocao precede acao, reflexao fecha o ciclo.
          capture, organize, conecte — do ponto ao circulo.
        </p>

        {/* Geometry sequence */}
        <div className="flex items-center justify-center gap-2 text-text-muted text-base mb-6 whitespace-nowrap">
          <span>·</span>
          <span className="text-[10px]">→</span>
          <span>—</span>
          <span className="text-[10px]">→</span>
          <span>△</span>
          <span className="text-[10px]">→</span>
          <span>□</span>
          <span className="text-[10px]">→</span>
          <span>⬠</span>
          <span className="text-[10px]">→</span>
          <span>⬡</span>
          <span className="text-[10px]">→</span>
          <span className="text-accent">○</span>
        </div>

        <button
          onClick={onLogin}
          className="bg-accent text-white rounded-xl px-8 py-3.5 text-sm font-medium"
        >
          comecar
        </button>
      </div>
    </div>
  );
}
