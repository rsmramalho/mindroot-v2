// shared/EmptyState.tsx — Empty state for pages with no data
// Geometry icon + message + optional action hint

interface EmptyStateProps {
  geometry?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ geometry = '·', title, subtitle }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-4xl text-text-muted/40 mb-4">{geometry}</div>
      <div className="text-sm text-text-muted font-medium">{title}</div>
      {subtitle && (
        <div className="text-xs text-text-muted/70 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
          {subtitle}
        </div>
      )}
    </div>
  );
}
