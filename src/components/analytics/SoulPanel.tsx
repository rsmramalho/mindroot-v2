// analytics/SoulPanel.tsx — Emotional patterns from wraps
// Energy trend, emotion frequency, shifts

import { useMemo } from 'react';
import { format, subDays, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AtomItem, EnergyLevel } from '@/types/item';
import { POSITIVE_EMOTIONS } from '@/types/item';

interface SoulPanelProps {
  items: AtomItem[];
}

interface WrapSoul {
  date: string;
  aurora?: { emotion: string; energy: EnergyLevel };
  crepusculo?: { emotion: string; energy: EnergyLevel };
  shift?: string;
}

function extractWrapSouls(items: AtomItem[]): WrapSoul[] {
  return items
    .filter((i) => i.type === 'wrap' && i.body?.soul)
    .map((i) => ({
      date: i.created_at,
      aurora: (i.body.soul as any)?.aurora ?? undefined,
      crepusculo: (i.body.soul as any)?.crepusculo ?? undefined,
      shift: (i.body.soul as any)?.shift ?? undefined,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function SoulPanel({ items }: SoulPanelProps) {
  const wraps = useMemo(() => extractWrapSouls(items), [items]);

  if (wraps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl text-text-muted/40 mb-3">◆</div>
        <p className="text-sm text-text-muted">dados aparecem depois do primeiro wrap</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SoulStreak wraps={wraps} />
      <EnergyTrend wraps={wraps} />
      <EmotionFrequency wraps={wraps} />
      <ShiftHistory wraps={wraps} />
    </div>
  );
}

// ─── Soul Streak ────────────────────────────────────

function SoulStreak({ wraps }: { wraps: WrapSoul[] }) {
  const today = new Date();
  const wrapDates = new Set(wraps.map((w) => w.date.substring(0, 10)));

  // Best streak
  const sorted = [...wraps].sort((a, b) => a.date.localeCompare(b.date));
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: string | null = null;

  sorted.forEach((w) => {
    const dateStr = w.date.substring(0, 10);
    if (prevDate) {
      const diffDays = Math.round((new Date(dateStr).getTime() - new Date(prevDate).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    prevDate = dateStr;
  });
  bestStreak = Math.max(bestStreak, tempStreak);

  // Current streak (count backwards from today)
  let currentStreak = 0;
  for (let i = 0; i <= 30; i++) {
    const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
    if (wrapDates.has(checkDate)) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  // Last 7 days as dots
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(today, 6 - i), 'yyyy-MM-dd');
    return wrapDates.has(d);
  });

  return (
    <section>
      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-medium text-accent">{currentStreak}</div>
          <div className="text-[10px] text-text-muted leading-tight">dias com<br />soul registrado</div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-text-muted mb-1.5">melhor streak: {bestStreak} dias</div>
          <div className="flex gap-1.5">
            {last7.map((has, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${has ? 'bg-accent' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Energy Trend (last 14 days) ─────────────────────

function EnergyTrend({ wraps }: { wraps: WrapSoul[] }) {
  const cutoff = subDays(new Date(), 14);
  const recent = wraps.filter((w) => isAfter(parseISO(w.date), cutoff));

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dayStr = format(date, 'yyyy-MM-dd');
    const wrap = recent.find((w) => w.date.startsWith(dayStr));
    const energy = wrap?.crepusculo?.energy ?? wrap?.aurora?.energy ?? null;
    return { date, dayStr, energy };
  });

  const heightMap: Record<string, number> = { high: 48, medium: 24, low: 12 };
  const colorMap: Record<string, string> = {
    high: 'bg-success',
    medium: 'bg-warning',
    low: 'bg-error',
  };

  return (
    <section>
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">energia · 14 dias</div>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-end gap-[3px] h-14">
          {days.map((d) => (
            <div key={d.dayStr} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {d.energy ? (
                <div
                  className={`w-full rounded-t transition-all ${colorMap[d.energy]}`}
                  style={{ height: `${heightMap[d.energy]}px` }}
                />
              ) : (
                <div className="w-full h-1 rounded bg-border" />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-[3px] mt-1.5">
          {days.map((d) => (
            <div key={d.dayStr} className="flex-1 text-center text-[8px] text-text-muted">
              {format(d.date, 'd')}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Emotion Frequency ───────────────────────────────

function EmotionFrequency({ wraps }: { wraps: WrapSoul[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    wraps.forEach((w) => {
      if (w.aurora?.emotion) map[w.aurora.emotion] = (map[w.aurora.emotion] ?? 0) + 1;
      if (w.crepusculo?.emotion) map[w.crepusculo.emotion] = (map[w.crepusculo.emotion] ?? 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [wraps]);

  const max = counts[0]?.[1] ?? 1;

  return (
    <section>
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">emocoes frequentes</div>
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {counts.map(([emotion, count]) => (
          <div key={emotion} className="flex items-center gap-2.5">
            <span className="w-16 text-[11px] text-text-muted truncate">{emotion}</span>
            <div className="flex-1 h-2 rounded-sm bg-surface overflow-hidden">
              <div
                className="h-full rounded-sm bg-accent-bg transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-accent w-5 text-right font-medium">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Shift History ───────────────────────────────────

function ShiftHistory({ wraps }: { wraps: WrapSoul[] }) {
  const shifts = wraps
    .filter((w) => w.shift || (w.aurora?.emotion && w.crepusculo?.emotion))
    .slice(0, 7)
    .map((w) => {
      const from = w.aurora?.emotion ?? '?';
      const to = w.crepusculo?.emotion ?? '?';
      const isPositive = POSITIVE_EMOTIONS.includes(to as any) && !POSITIVE_EMOTIONS.includes(from as any);
      const isNegative = !POSITIVE_EMOTIONS.includes(to as any) && POSITIVE_EMOTIONS.includes(from as any);
      return {
        date: w.date,
        from,
        to,
        display: w.shift ?? `${from} → ${to}`,
        color: isPositive ? 'text-success' : isNegative ? 'text-warning' : 'text-text-muted',
      };
    });

  if (shifts.length === 0) return null;

  return (
    <section>
      <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">shifts recentes</div>
      <div className="bg-card border border-border rounded-xl p-4 space-y-0.5">
        {shifts.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-surface last:border-0">
            <span className="text-[11px] text-text-muted w-12 shrink-0">
              {format(parseISO(s.date), 'dd MMM', { locale: ptBR })}
            </span>
            <span className={`text-[12px] ${s.color}`}>{s.display}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
