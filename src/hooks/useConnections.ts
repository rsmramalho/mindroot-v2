// hooks/useConnections.ts — Query all item_connections for current user
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/service/supabase';
import { useAppStore } from '@/store/app-store';
import type { ItemConnection } from '@/types/item';

export function useConnections() {
  const user = useAppStore((s) => s.user);

  const { data: connections = [] } = useQuery<ItemConnection[]>({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('item_connections')
        .select('*');
      if (error) throw error;
      return (data ?? []) as ItemConnection[];
    },
    enabled: !!user,
  });

  return { connections };
}
