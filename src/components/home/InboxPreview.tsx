// home/InboxPreview.tsx — Inbox items preview with triage link
// Wireframe: count, "aguardando triage", list with orange dots, "triar →"

import type { AtomItem } from '@/types/item';
import { useNav } from '@/hooks/useNav';

interface InboxPreviewProps {
  items: AtomItem[];
}

export function InboxPreview({ items }: InboxPreviewProps) {
  const { navigate, selectItem } = useNav();
  const count = items.length;

  if (count === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-3 px-3.5">
      <div className="flex justify-between items-center">
        <div className="text-[13px] font-medium">
          <span className="text-error">{count}</span> aguardando triage
        </div>
        <button
          onClick={() => navigate('triage')}
          className="text-xs text-accent font-medium"
        >
          triar →
        </button>
      </div>

      <div className="mt-2">
        {items.slice(0, 5).map((item) => (
          <div
            key={item.id}
            onClick={() => selectItem(item.id)}
            className="text-[13px] py-1.5 border-b border-surface last:border-0 flex items-center gap-2 text-text-muted cursor-pointer"
          >
            <span className="w-[5px] h-[5px] rounded-full bg-error shrink-0" />
            <span className="truncate">"{item.title}"</span>
          </div>
        ))}
      </div>
    </div>
  );
}
