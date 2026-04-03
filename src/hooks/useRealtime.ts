// hooks/useRealtime.ts — Supabase Realtime subscriptions
// Invalidates TanStack Query cache when items change in the database.

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToItems, unsubscribe } from '@/service/realtime-service';
import { useAppStore } from '@/store/app-store';

export function useRealtime() {
  const queryClient = useQueryClient();
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const channel = subscribeToItems(user.id, () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    });

    return () => {
      unsubscribe(channel);
    };
  }, [user, queryClient]);
}
