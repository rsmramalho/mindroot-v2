// shared/ItemCard.tsx — Item card with module bar, stage badge, type chip, progress
// Wireframe: left module accent bar, stage geometry in box, title, type+stage+due, progress bar

import type { AtomItem } from '@/types/item';
import { MODULE_COLORS, STAGE_COLORS, STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ItemCardProps {
  item: AtomItem;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const moduleColor = item.module ? MODULE_COLORS[item.module] : '#8a8a8a';
  const stageColor = STAGE_COLORS[item.genesis_stage] ?? '#6b6b6b';
  const geometry = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
  const typeColor = item.type ? getTypeColor(item.type) : '#8a8a8a';
  const progress = item.body?.operations?.progress ?? null;
  const dueDate = item.body?.operations?.due_date;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e8e6df] rounded-xl py-2.5 px-3.5 flex items-center gap-3 relative overflow-hidden cursor-pointer hover:border-border transition-colors"
    >
      {/* Module accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: moduleColor }}
      />

      {/* Stage badge */}
      <div
        className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-sm shrink-0"
        style={{ color: stageColor }}
      >
        {geometry}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.title}</div>
        <div className="flex items-center gap-1.5 mt-1">
          {item.type && (
            <span
              className="text-[10px] px-2 py-px rounded-xl font-medium"
              style={{ background: `${typeColor}18`, color: typeColor }}
            >
              {item.type}
            </span>
          )}
          <span className="text-[11px] text-text-muted">stage {item.genesis_stage}</span>
          {dueDate && (
            <span className="text-[10px] text-[#b4b2a9] ml-auto shrink-0">
              {formatDue(dueDate)}
            </span>
          )}
        </div>
        {progress !== null && progress > 0 && (
          <div className="h-[3px] rounded-sm bg-surface mt-1.5 overflow-hidden">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${stageColor}, ${stageColor}88)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function formatDue(date: string): string {
  try {
    const d = parseISO(date);
    const now = new Date();
    const diffDays = Math.round((d.getTime() - now.getTime()) / 86400000);
    if (diffDays === 0) return 'hoje';
    if (diffDays === 1) return 'amanha';
    if (diffDays < 7) return format(d, "EEEE", { locale: ptBR });
    return format(d, "d MMM", { locale: ptBR });
  } catch {
    return date;
  }
}
