// service/realtime-service.ts — Supabase Realtime channel management
// Encapsulates Supabase realtime access so hooks never import supabase directly.

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToItems(
  userId: string,
  onItemChange: () => void,
): RealtimeChannel {
  return supabase
    .channel('items-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'items', filter: `user_id=eq.${userId}` },
      onItemChange,
    )
    .subscribe();
}

export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
