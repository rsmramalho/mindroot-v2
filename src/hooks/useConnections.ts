// hooks/useConnections.ts — Query all item_connections for current user
// Pattern: hook → connectionService → supabase
import { useQuery } from '@tanstack/react-query';
import { connectionService } from '@/service/item-service';
import { useAppStore } from '@/store/app-store';
import type { ItemConnection } from '@/types/item';

export function useConnections() {
  const user = useAppStore((s) => s.user);

  const { data: connections = [] } = useQuery<ItemConnection[]>({
    queryKey: ['connections', user?.id],
    queryFn: () => connectionService.list(),
    enabled: !!user,
  });

  return { connections };
}
