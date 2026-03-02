// pages/Ritual.tsx — Placeholder (Fase 3)
import { EmptyState } from '@/components/shared/EmptyState';
import { useRitualStore } from '@/store/ritual-store';

export function RitualPage() {
  const { currentPeriod, periodGreeting } = useRitualStore();

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="font-serif text-2xl text-light">{periodGreeting}</h2>
        <p className="text-xs font-mono text-muted mt-1">{currentPeriod}</p>
      </div>
      <EmptyState
        icon="◎"
        title="Ritual — em breve"
        description="Aurora / Zênite / Crepúsculo virão na Fase 3"
      />
    </div>
  );
}
