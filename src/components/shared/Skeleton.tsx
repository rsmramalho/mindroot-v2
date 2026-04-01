// shared/Skeleton.tsx — Loading skeleton components
// Pulse animation, no text — purely visual.

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 animate-pulse">
      <div className="h-4 bg-surface rounded w-3/4 mb-2" />
      <div className="h-3 bg-surface rounded w-1/2" />
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SoulCardSkeleton() {
  return (
    <div className="rounded-2xl p-3.5 px-4 flex items-center gap-3.5 border border-border bg-surface animate-pulse">
      <div className="w-11 h-11 rounded-full bg-border" />
      <div className="flex-1">
        <div className="h-4 bg-border rounded w-2/3 mb-2" />
        <div className="h-3 bg-border rounded w-1/3" />
      </div>
    </div>
  );
}

export function RingSkeleton() {
  return (
    <div className="w-16 h-16 rounded-full border-4 border-surface animate-pulse" />
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex items-end gap-[3px] h-12 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-surface rounded-t"
          style={{ height: `${12 + Math.random() * 36}px` }}
        />
      ))}
    </div>
  );
}
