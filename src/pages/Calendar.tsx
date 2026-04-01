// pages/Calendar.tsx — Week strip + day detail with ritual blocks
// Wireframe: mindroot-wireframe-calendar.html
// Week strip with day dots, ritual blocks (aurora/zenite/crepúsculo), items by period

import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday as isDateToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import type { AtomItem } from '@/types/item';
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

  // Split by ritual period
  const aurora = dayItems.filter(() => true); // All items shown under aurora for now
  const today = isDateToday(selectedDate);

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
                  <div key={i} className="w-[5px] h-[5px] rounded-full bg-[#378ADD]" />
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
        <RitualBlock period="aurora" color="#EF9F27" bgClass="bg-[rgba(239,159,39,0.06)] border-[rgba(239,159,39,0.15)]" items={aurora} habits={habits.slice(0, 2)} />

        {/* Zenite block */}
        <RitualBlock period="zenite" color="#378ADD" bgClass="bg-[rgba(55,138,221,0.04)] border-[rgba(55,138,221,0.1)]" items={[]} habits={[]} />

        {/* Crepúsculo block */}
        <RitualBlock period="crepusculo" color="#7F77DD" bgClass="bg-[rgba(127,119,221,0.06)] border-[rgba(127,119,221,0.15)]" items={[]} habits={[]} showWrap={today} />

        {dayItems.length === 0 && habits.length === 0 && (
          <p className="text-xs text-text-muted text-center py-6">nenhum item para este dia</p>
        )}
      </div>
    </div>
  );
}

function RitualBlock({ period, color, bgClass, items, habits, showWrap }: {
  period: string; color: string; bgClass: string; items: AtomItem[]; habits: AtomItem[]; showWrap?: boolean;
}) {
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
        <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg bg-[rgba(127,119,221,0.08)] border border-[rgba(127,119,221,0.15)] text-[13px] text-[#534AB7]">
          <span>○</span> wrap
        </div>
      )}
    </div>
  );
}

function CalendarItem({ item }: { item: AtomItem }) {
  const moduleColor = item.module ? MODULE_COLORS[item.module] : '#8a8a8a';
  const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
  const typeColor = item.type ? getTypeColor(item.type) : '#8a8a8a';

  return (
    <div className="flex items-center gap-2 p-1.5 px-2.5 mb-[3px] rounded-lg bg-card border border-border text-[13px]">
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
