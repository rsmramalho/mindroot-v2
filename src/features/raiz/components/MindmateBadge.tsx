// features/raiz/components/MindmateBadge.tsx
import { motion } from 'framer-motion';
import { MINDMATE_ACTIVATION } from '../mindmate';

export function MindmateBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border"
    >
      <span className="text-xs text-text-muted">{MINDMATE_ACTIVATION.badge}</span>
    </motion.div>
  );
}
