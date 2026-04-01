// home/WrapBanner.tsx — Wrap call-to-action banner (crepúsculo)
// Wireframe: purple gradient, "hora do wrap ○", stats, "iniciar" button

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';

interface WrapBannerProps {
  createdCount: number;
  modifiedCount: number;
}

export function WrapBanner({ createdCount, modifiedCount }: WrapBannerProps) {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <motion.div
      className="bg-gradient-to-br from-[#7F77DD] to-[#534AB7] rounded-xl p-3.5 px-4 mt-3 flex items-center justify-between"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div>
        <div className="text-white text-sm font-medium">hora do wrap ○</div>
        <div className="text-white/70 text-xs mt-0.5">
          {createdCount} items criados · {modifiedCount} modificados
        </div>
      </div>
      <button
        onClick={() => navigate('wrap')}
        className="bg-white/20 text-white border-none rounded-lg px-4 py-2 text-[13px] font-medium"
      >
        iniciar
      </button>
    </motion.div>
  );
}
