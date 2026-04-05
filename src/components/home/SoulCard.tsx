// home/SoulCard.tsx — Soul state card (aurora/crepúsculo)
// Wireframe: orb with pulsing ring, intention (italic), emotion + energy badge

import { motion } from 'framer-motion';
import type { EnergyLevel, RitualSlot } from '@/types/item';

interface SoulCardProps {
  period: RitualSlot;
  intention: string | null;
  emotions: string | null;
  energy: EnergyLevel | null;
}

const PERIOD_STYLES: Record<string, {
  bg: string;
  border: string;
  orbInnerStyle: React.CSSProperties;
  orbRing: string;
  energyClass: string;
}> = {
  aurora: {
    bg: 'bg-gradient-to-br from-aurora-bg-from to-aurora-bg-to',
    border: 'border-aurora-border',
    orbInnerStyle: { background: 'radial-gradient(circle, var(--color-aurora), var(--color-warning) 60%, var(--color-error))' },
    orbRing: 'border-warning',
    energyClass: 'bg-success-bg text-success-text',
  },
  zenite: {
    bg: 'bg-gradient-to-br from-surface to-zenite-bg-to',
    border: 'border-border',
    orbInnerStyle: { background: 'radial-gradient(circle, var(--color-zenite), var(--color-zenite-mid) 60%, var(--color-mod-mind))' },
    orbRing: 'border-zenite-mid',
    energyClass: 'bg-surface text-text-muted',
  },
  crepusculo: {
    bg: 'bg-gradient-to-br from-crepusculo-bg-from to-crepusculo-bg-to',
    border: 'border-crepusculo-border',
    orbInnerStyle: { background: 'radial-gradient(circle, var(--color-accent-lighter), var(--color-accent-light) 60%, var(--color-accent))' },
    orbRing: 'border-accent-light',
    energyClass: 'bg-accent-bg text-accent',
  },
};

export function SoulCard({ period, intention, emotions, energy }: SoulCardProps) {
  const s = PERIOD_STYLES[period] ?? PERIOD_STYLES.aurora;

  return (
    <div className={`rounded-[14px] p-4 flex items-center gap-3.5 border ${s.bg} ${s.border}`}>
      {/* Orb */}
      <div className="w-11 h-11 rounded-full relative flex items-center justify-center shrink-0">
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${s.orbRing} opacity-30`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: period === 'crepusculo' ? 3 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-7 h-7 rounded-full" style={s.orbInnerStyle} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium italic truncate">
          {intention ? `"${intention}"` : 'sem intencao definida'}
        </div>
        <div className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
          <span>{emotions ?? 'neutro'}</span>
          {energy && (
            <span className={`text-[10px] px-2 py-0.5 rounded-xl font-medium ${s.energyClass}`}>
              {energy}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
