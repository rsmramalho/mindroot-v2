// components/dashboard/SoulCard.tsx — Gradient card with animated orb, emotion, energy
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { AtomItem, Emotion } from '@/types/item';
import { POSITIVE_EMOTIONS } from '@/types/item';
import { getCurrentPeriod } from '@/types/ui';
import { PERIOD_GRADIENTS } from '@/components/atoms/tokens';

interface SoulCardProps {
  items: AtomItem[];
}

function getLatestWrapSoul(items: AtomItem[]): {
  emotion: Emotion | null;
  energy: string | null;
  intention: string | null;
} {
  const wraps = items
    .filter((i) => i.type === 'wrap')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const latest = wraps[0];
  if (!latest) return { emotion: null, energy: null, intention: null };

  return {
    emotion: (latest.body.soul?.emotion_after ?? latest.body.soul?.emotion_before ?? null) as Emotion | null,
    energy: latest.body.soul?.energy_level ?? null,
    intention: latest.notes ?? null,
  };
}

function getRecentEmotion(items: AtomItem[]): Emotion | null {
  for (const item of items.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())) {
    if (item.body.soul?.emotion_after) return item.body.soul.emotion_after as Emotion;
    if (item.body.soul?.emotion_before) return item.body.soul.emotion_before as Emotion;
  }
  return null;
}

export default function SoulCard({ items }: SoulCardProps) {
  const period = getCurrentPeriod();
  const gradient = PERIOD_GRADIENTS[period.key];

  const soul = useMemo(() => getLatestWrapSoul(items), [items]);
  const recentEmotion = useMemo(() => soul.emotion ?? getRecentEmotion(items), [items, soul.emotion]);

  const isPositive = recentEmotion ? POSITIVE_EMOTIONS.includes(recentEmotion) : true;
  const orbColor = isPositive ? '#8a9e7a' : '#d4856a';

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ background: gradient, padding: '20px' }}
    >
      {/* Animated orb */}
      <motion.div
        className="absolute top-3 right-4"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="rounded-full"
          style={{
            width: 40,
            height: 40,
            backgroundColor: orbColor,
            filter: 'blur(8px)',
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        {recentEmotion && (
          <span
            className="block font-sans text-sm font-medium mb-1"
            style={{ color: '#111318' }}
          >
            {recentEmotion}
          </span>
        )}

        {soul.intention && (
          <p
            className="font-serif text-base leading-snug"
            style={{ color: '#111318cc', maxWidth: '80%' }}
          >
            {soul.intention}
          </p>
        )}

        {soul.energy && (
          <span
            className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-mono"
            style={{ backgroundColor: '#11131820', color: '#111318' }}
          >
            energia {soul.energy}
          </span>
        )}

        {!recentEmotion && !soul.intention && (
          <p
            className="font-serif text-base"
            style={{ color: '#111318cc' }}
          >
            Como voce esta?
          </p>
        )}
      </div>
    </div>
  );
}
