// home/StageBar.tsx — Pipeline health indicator with 7 stages
// Animated bar showing item distribution across Genesis stages

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGE_GEOMETRIES, STAGE_COLORS } from '@/components/atoms/tokens';

interface StageCounts {
  [key: number]: number;
}

interface StageBarProps {
  counts?: StageCounts;
}

const STAGE_NAMES = {
  1: 'inbox',
  2: 'classified',
  3: 'structured',
  4: 'validated',
  5: 'connected',
  6: 'refined',
  7: 'committed',
};

export function StageBar({ counts = { 1: 3, 2: 2, 3: 5, 4: 2, 5: 1, 6: 0, 7: 8 } }: StageBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const widths = Object.entries(counts).reduce((acc, [stage, count]) => {
    acc[parseInt(stage)] = total > 0 ? (count / total) * 100 : 0;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-2">
      {/* Expandable bar */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full relative overflow-hidden rounded-[3px] bg-surface/50"
        layout
      >
        <motion.div
          className="flex gap-px"
          layout
          layoutDependency={isExpanded}
        >
          {(Object.keys(counts) as unknown as (1 | 2 | 3 | 4 | 5 | 6 | 7)[]).map((stage) => {
            const width = widths[stage];
            if (width === 0) return null;

            return (
              <motion.div
                key={stage}
                layoutId={`stage-${stage}`}
                className="h-1 transition-colors hover:opacity-80"
                style={{
                  width: `${width}%`,
                  backgroundColor: STAGE_COLORS[stage],
                  flex: `${width} 1 0%`,
                }}
              />
            );
          })}
        </motion.div>

        {/* Expanded state height */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2.5 bg-surface border-t border-border"
            >
              <div className="grid grid-cols-7 gap-1 text-center">
                {(Object.keys(counts) as unknown as (1 | 2 | 3 | 4 | 5 | 6 | 7)[]).map((stage) => (
                  <div key={stage} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: STAGE_COLORS[stage],
                        color: stage === 7 || stage === 4 ? '#18171a' : '#f0ece6',
                      }}
                    >
                      {STAGE_GEOMETRIES[stage]}
                    </div>
                    <div className="text-[10px] font-medium text-text-muted">
                      {counts[stage]}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Legend below bar */}
      <div className="flex items-center justify-between text-[9px] text-text-muted px-1">
        <div className="flex gap-2">
          {(Object.keys(counts) as unknown as (1 | 2 | 3 | 4 | 5 | 6 | 7)[]).map((stage) => (
            <span key={stage}>
              {STAGE_GEOMETRIES[stage]}{counts[stage]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
