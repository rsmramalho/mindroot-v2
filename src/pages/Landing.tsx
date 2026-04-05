// pages/Landing.tsx — Public landing page
// Sells: "Organize sua vida de dentro pra fora"
// Responsive: mobile (single column) + desktop (side-by-side hero)

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-bg">
      {/* Hero */}
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 md:px-12 text-center">
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Raiz symbol */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-ai-blue), var(--color-success))' }}>
              <div className="w-8 h-8 rounded-full border-2 border-white/30" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-medium text-text-heading tracking-tight mb-4">MindRoot</h1>
          <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed mb-3">
            organize sua vida de dentro pra fora
          </p>
          <p className="text-[14px] text-text-muted/70 font-light leading-relaxed mb-8">
            capture o que pensa, organize no seu ritmo, reflita no final do dia. emocao precede acao.
          </p>

          <button
            onClick={onLogin}
            className="text-white rounded-xl px-10 py-4 text-[15px] font-medium shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-ai-blue))' }}
          >
            comecar
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-6 md:px-12 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard
            geometry="·"
            title="capture"
            description="texto, voz, email, calendario. tudo entra por um ponto e o sistema organiza."
          />
          <BenefitCard
            geometry="△"
            title="organize"
            description="7 estagios de maturacao. items avancam quando estao prontos. nada e forcado."
          />
          <BenefitCard
            geometry="○"
            title="reflita"
            description="aurora, zenite, crepusculo. o dia comeca com intencao e fecha com wrap."
          />
        </div>

        {/* Geometry sequence */}
        <div className="flex items-center justify-center gap-3 text-text-muted/40 text-sm mt-12 mb-6">
          {['·', '—', '△', '□', '⬠', '⬡', '○'].map((g, i) => (
            <span key={i} className={i === 6 ? 'text-accent/60' : ''}>{g}</span>
          ))}
        </div>

        <p className="text-center text-xs text-text-muted/40">
          Genesis v5 · do ponto ao circulo
        </p>
      </div>
    </div>
  );
}

function BenefitCard({ geometry, title, description }: { geometry: string; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-6 text-center">
      <div className="text-2xl text-accent mb-3">{geometry}</div>
      <h3 className="text-sm font-medium text-text-heading mb-2">{title}</h3>
      <p className="text-xs text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}
