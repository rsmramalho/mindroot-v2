// home/AuditBar.tsx — System health bar
// Wireframe: "saúde do sistema" label + percentage + progress bar

interface AuditBarProps {
  totalItems: number;
  healthyItems: number;
}

export function AuditBar({ totalItems, healthyItems }: AuditBarProps) {
  const pct = totalItems > 0 ? Math.round((healthyItems / totalItems) * 100) : 100;
  const color = pct >= 70 ? '#639922' : pct >= 40 ? '#BA7517' : '#D85A30';

  return (
    <div className="mt-3 mb-1.5">
      <div className="text-[11px] text-text-muted mb-1 flex justify-between">
        <span>saude do sistema</span>
        <span className="font-medium" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-[3px] rounded-sm bg-surface overflow-hidden">
        <div
          className="h-full rounded-sm transition-all"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
          }}
        />
      </div>
    </div>
  );
}
