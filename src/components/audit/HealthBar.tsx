// audit/HealthBar.tsx — Mini system health indicator for Home
// 3-pill row: inbox / stale / orphans, colored by severity.
// Uses useLightAudit() for fast Supabase query.

import { useLightAudit } from '@/hooks/useAudit';
import { STATUS_COLORS } from '@/components/atoms/tokens';

function pillColor(value: number, thresholds?: { amber: number }) {
  if (value === 0) return STATUS_COLORS.green;
  if (thresholds && value <= thresholds.amber) return STATUS_COLORS.amber;
  return value > (thresholds?.amber ?? 0) ? STATUS_COLORS.red : STATUS_COLORS.amber;
}

export function HealthBar() {
  const { data, isLoading, isError } = useLightAudit();

  if (isLoading) {
    return (
      <div className="mt-3 mb-1.5">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-7 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mt-3 mb-1.5">
        <p className="text-[11px] text-text-muted">audit indisponivel</p>
      </div>
    );
  }

  const { inbox, stale, orphans } = data;
  const allGreen = inbox === 0 && stale === 0 && orphans === 0;

  if (allGreen) {
    return (
      <div className="mt-3 mb-1.5">
        <div
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium"
          style={{ background: STATUS_COLORS.green.bg, color: STATUS_COLORS.green.text }}
        >
          <span>✓</span>
          <span>sistema saudavel</span>
        </div>
      </div>
    );
  }

  const pills = [
    { label: 'inbox', value: inbox, color: pillColor(inbox, { amber: 5 }) },
    { label: 'stale', value: stale, color: pillColor(stale) },
    { label: 'orphans', value: orphans, color: pillColor(orphans) },
  ];

  return (
    <div className="mt-3 mb-1.5">
      <div className="flex gap-2">
        {pills.map((p) => (
          <div
            key={p.label}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium"
            style={{ background: p.color.bg, color: p.color.text }}
          >
            <span>{p.value}</span>
            <span className="opacity-70">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
