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
  orbInner: string;
  orbRing: string;
  energyClass: string;
}> = {
  aurora: {
    bg: 'bg-gradient-to-br from-[#FFF8F0] to-[#FFF4E8]',
    border: 'border-[#F0D8B8]',
    orbInner: 'bg-[radial-gradient(circle,#FAC775,#EF9F27_60%,#D85A30)]',
    orbRing: 'border-[#EF9F27]',
    energyClass: 'bg-[#EAF3DE] text-[#3B6D11]',
  },
  zenite: {
    bg: 'bg-gradient-to-br from-[#F5F3EE] to-[#EDEAE4]',
    border: 'border-[#D8D4CC]',
    orbInner: 'bg-[radial-gradient(circle,#E8E0D4,#C4BCB0_60%,#A89478)]',
    orbRing: 'border-[#C4BCB0]',
    energyClass: 'bg-[#F0EDE8] text-[#6B6560]',
  },
  crepusculo: {
    bg: 'bg-gradient-to-br from-[#F3F0FA] to-[#EDEBF8]',
    border: 'border-[#D0C8E8]',
    orbInner: 'bg-[radial-gradient(circle,#AFA9EC,#7F77DD_60%,#534AB7)]',
    orbRing: 'border-[#7F77DD]',
    energyClass: 'bg-[#EEEDFE] text-[#534AB7]',
  },
};

export function SoulCard({ period, intention, emotions, energy }: SoulCardProps) {
  const s = PERIOD_STYLES[period] ?? PERIOD_STYLES.aurora;

  return (
    <div className={`rounded-2xl p-3.5 px-4 flex items-center gap-3.5 border ${s.bg} ${s.border}`}>
      {/* Orb */}
      <div className="w-11 h-11 rounded-full relative flex items-center justify-center shrink-0">
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${s.orbRing} opacity-30`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: period === 'crepusculo' ? 3 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className={`w-7 h-7 rounded-full ${s.orbInner}`} />
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
