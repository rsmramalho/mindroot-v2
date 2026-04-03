// hooks/useRaiz.ts — Raiz domain health hook
// Reusable across pages. Zero new schema — reads existing items + #domain:* tags.

import { useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import { RAIZ_DOMAINS } from '@/config/raiz';
import { differenceInDays, parseISO } from 'date-fns';

export interface DomainHealth {
  key: string;
  label: string;
  emoji: string;
  module: string;
  count: number;
  oldest: number; // days since last update
  status: 'active' | 'stale' | 'empty';
}

export function useRaiz() {
  const { items } = useItems();

  const domains = useMemo<DomainHealth[]>(() => {
    return RAIZ_DOMAINS.map((domain) => {
      const domainItems = items.filter(
        (i) =>
          i.status !== 'archived' &&
          (i.tags?.includes(`#domain:${domain.key}`) || i.module === domain.module),
      );
      const count = domainItems.length;
      const oldest = domainItems.reduce((max, i) => {
        const days = differenceInDays(new Date(), parseISO(i.updated_at));
        return days > max ? days : max;
      }, 0);

      let status: 'active' | 'stale' | 'empty' = 'active';
      if (count === 0) status = 'empty';
      else if (oldest > 30) status = 'stale';

      return { key: domain.key, label: domain.label, emoji: domain.emoji, module: domain.module, count, oldest, status };
    });
  }, [items]);

  const activeCount = domains.filter((d) => d.status === 'active').length;
  const staleCount = domains.filter((d) => d.status === 'stale').length;
  const emptyCount = domains.filter((d) => d.status === 'empty').length;
  const healthPct = Math.round((activeCount / 9) * 100);
  const totalItems = items.filter((i) => i.status !== 'archived').length;

  return { domains, activeCount, staleCount, emptyCount, healthPct, totalItems };
}
