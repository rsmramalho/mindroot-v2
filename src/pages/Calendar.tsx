// pages/Calendar.tsx — Week strip + day detail with ritual blocks
// Wireframe: mindroot-wireframe-calendar.html
// Week strip with day dots, ritual blocks (aurora/zenite/crepúsculo), items by period

import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday as isDateToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import type { AtomItem, SoulExtension } from '@/types/item';
import { MODULE_COLORS, STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';

const DAY_NAMES = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export function CalendarPage() {
  const { items } = useItems();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const prevWeek = () => setSelectedDate(addDays(selectedDate, -7));
  const nextWeek = () => setSelectedDate(addDays(selectedDate, 7));

  // Items with due dates
  const itemsByDate = useMemo(() => {
    const map: Record<string, AtomItem[]> = {};
    items.forEach((item) => {
      const due = item.body?.operations?.due_date;
      if (due) {
        const key = due.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(item);
      }
    });
    return map;
  }, [items]);

  // Habits for the selected day
  const habits = useMemo(
    () => items.filter((i) => i.type === 'habit' && i.status !== 'archived'),
    [items],
  );

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const dayItems = itemsByDate[selectedKey] ?? [];

  // Group items by ritual slot
  const { aurora, zenite, crepusculo: crepItems } = useMemo(() => {
    const a: AtomItem[] = [];
    const z: AtomItem[] = [];
    const c: AtomItem[] = [];
    const unslotted: AtomItem[] = [];

    dayItems.forEach((item) => {
      const slot = (item.body?.soul as SoulExtension | undefined)?.ritual_slot;
      if (slot === 'aurora') a.push(item);
      else if (slot === 'zenite') z.push(item);
      else if (slot === 'crepusculo') c.push(item);
      else unslotted.push(item);
    });

    // Unslotted items go to aurora by default
    return { aurora: [...a, ...unslotted], zenite: z, crepusculo: c };
  }, [dayItems]);

  const today = isDateToday(selectedDate);
  const todayWrap = useMemo(
    () => items.find((i) => i.type === 'wrap' && isDateToday(parseISO(i.created_at))),
    [items],
  );

  return (
    <div className="px-5 pb-4">
      {/* Header */}
      <div className="pt-4 pb-2 flex items-baseline justify-between">
        <h1 className="text-2xl font-medium tracking-tight">agenda</h1>
        <span className="text-[13px] text-text-muted">{format(selectedDate, 'MMMM yyyy', { locale: ptBR })}</span>
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between py-3">
        <button onClick={prevWeek} className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-xs text-text-muted">←</button>
        <div className="text-[13px] font-medium">
          {format(weekStart, "d", { locale: ptBR })} – {format(addDays(weekStart, 6), "d MMM", { locale: ptBR })}
        </div>
        <button onClick={nextWeek} className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-xs text-text-muted">→</button>
      </div>

      {/* Week strip */}
      <div className="flex gap-0.5 mb-4">
        {weekDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isDateToday(day);
          const dayItemCount = (itemsByDate[key] ?? []).length;

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className={`flex-1 text-center py-2 rounded-xl transition-all ${
                isSelected ? 'bg-card shadow-sm' : 'hover:bg-surface'
              }`}
            >
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                {DAY_NAMES[day.getDay()]}
              </div>
              <div className={`text-lg font-medium leading-none mb-1.5 ${
                isToday ? 'bg-text text-bg w-7 h-7 rounded-full inline-flex items-center justify-center text-sm mx-auto' : ''
              }`}>
                {format(day, 'd')}
              </div>
              <div className="flex justify-center gap-[3px] min-h-[6px]">
                {dayItemCount > 0 && Array.from({ length: Math.min(dayItemCount, 3) }).map((_, i) => (
                  <div key={i} className="w-[5px] h-[5px] rounded-full bg-ai-blue" />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="text-[15px] font-medium">
            {format(selectedDate, "d MMM", { locale: ptBR })} <span className="font-normal text-text-muted">{format(selectedDate, "EEEE", { locale: ptBR })}</span>
          </div>
          <span className="text-xs text-text-muted">{dayItems.length + habits.length} items</span>
        </div>

        {/* Aurora block */}
        <RitualBlock period="aurora" color="var(--color-warning)" bgClass="bg-warning/5 border-warning/15" items={aurora} habits={habits.slice(0, 2)} />

        {/* Zenite block */}
        <RitualBlock period="zenite" color="var(--color-ai-blue)" bgClass="bg-ai-blue/4 border-ai-blue/10" items={zenite} habits={[]} />

        {/* Crepúsculo block */}
        <RitualBlock period="crepusculo" color="var(--color-accent-light)" bgClass="bg-accent-light/5 border-accent-light/15" items={crepItems} habits={[]} showWrap={today && !!todayWrap} wrapItem={todayWrap} />

        {dayItems.length === 0 && habits.length === 0 && (
          <>
            <div className="space-y-1.5 mb-4">
              <GhostRitualBlock period="aurora" hours="05h-12h" color="var(--color-warning)" />
              <GhostRitualBlock period="zenite" hours="12h-18h" color="var(--color-ai-blue)" />
              <GhostRitualBlock period="crepusculo" hours="18h-05h" color="var(--color-accent-light)" />
            </div>
            <div className="text-center py-4">
              <div className="text-2xl text-text-muted/30 mb-2">·</div>
              <p className="text-xs text-text-muted">dia livre</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RitualBlock({ period, color, bgClass, items, habits, showWrap, wrapItem }: {
  period: string; color: string; bgClass: string; items: AtomItem[]; habits: AtomItem[]; showWrap?: boolean; wrapItem?: AtomItem | null;
}) {
  const { selectItem } = useNav();
  const hours = period === 'aurora' ? '05h–12h' : period === 'zenite' ? '12h–18h' : '18h–05h';

  if (items.length === 0 && habits.length === 0 && !showWrap) return null;

  return (
    <div className={`rounded-xl p-2.5 px-3.5 mb-1.5 border ${bgClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style={{ background: color }}>
          {period === 'aurora' ? '☀' : period === 'zenite' ? '◆' : '☽'}
        </div>
        <span className="text-xs font-medium" style={{ color }}>{period}</span>
        <span className="text-[10px] text-text-muted ml-auto">{hours}</span>
      </div>

      {items.map((item) => <CalendarItem key={item.id} item={item} />)}
      {habits.map((item) => <CalendarItem key={item.id} item={item} />)}
      {showWrap && (
        <div
          onClick={() => wrapItem && selectItem(wrapItem.id)}
          className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg bg-accent-light/8 border border-accent-light/15 text-[13px] text-accent cursor-pointer"
        >
          <span>○</span> wrap
        </div>
      )}
    </div>
  );
}

function CalendarItem({ item }: { item: AtomItem }) {
  const { selectItem } = useNav();
  const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';
  const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
  const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';

  return (
    <div onClick={() => selectItem(item.id)} className="flex items-center gap-2 p-1.5 px-2.5 mb-[3px] rounded-lg bg-card border border-border text-[13px] cursor-pointer hover:border-accent-light/30 transition-colors">
      <div className="w-[3px] h-[22px] rounded-sm shrink-0" style={{ background: moduleColor }} />
      <span className="flex-1 truncate">{item.title}</span>
      <span className="text-[10px] text-text-muted">{geo}</span>
      {item.type && (
        <span className="text-[9px] font-medium px-1.5 py-px rounded" style={{ background: `${typeColor}18`, color: typeColor }}>
          {item.type}
        </span>
      )}
    </div>
  );
}

function GhostRitualBlock({ period, hours, color }: { period: string; hours: string; color: string }) {
  return (
    <div className="rounded-xl p-2.5 px-3.5 border border-border/30 opacity-40">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ color }}>
          {period === 'aurora' ? '☀' : period === 'zenite' ? '◆' : '☽'}
        </div>
        <span className="text-xs" style={{ color }}>{period}</span>
        <span className="text-[10px] text-text-muted ml-auto">{hours}</span>
      </div>
    </div>
  );
}
