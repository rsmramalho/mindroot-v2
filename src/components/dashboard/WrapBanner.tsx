// components/dashboard/WrapBanner.tsx — Crepúsculo wrap CTA (17h+)
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { AtomItem } from '@/types/item';
import { isToday, parseISO } from 'date-fns';

interface WrapBannerProps {
  items: AtomItem[];
  onStartWrap: () => void;
}

export default function WrapBanner({ items, onStartWrap }: WrapBannerProps) {
  const hour = new Date().getHours();
  const isCrepusculo = hour >= 17 || hour < 5;

  const todayCount = useMemo(
    () => items.filter((i) => isToday(parseISO(i.created_at)) || isToday(parseISO(i.updated_at))).length,
    [items]
  );

  const alreadyWrapped = useMemo(
    () => items.some((i) => i.type === 'wrap' && isToday(parseISO(i.created_at))),
    [items]
  );

  if (!isCrepusculo || alreadyWrapped) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border"
      style={{
        background: 'linear-gradient(135deg, #8a6e5a20 0%, #5a3e2a20 100%)',
        borderColor: '#8a6e5a30',
        padding: '16px',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span
            className="block font-serif text-base"
            style={{ color: '#e8e0d4' }}
          >
            Hora do wrap ○
          </span>
          <span
            className="block text-[12px] font-sans mt-1"
            style={{ color: '#a89478' }}
          >
            {todayCount} {todayCount === 1 ? 'item' : 'itens'} hoje
          </span>
        </div>
        <button
          onClick={onStartWrap}
          className="px-4 py-2 rounded-lg font-sans text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#c4a882', color: '#111318' }}
        >
          Iniciar
        </button>
      </div>
    </motion.div>
  );
}
