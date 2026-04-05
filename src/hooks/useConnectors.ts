// hooks/useConnectors.ts — Connector state and actions
// Pattern: hooks → service → supabase

import { useState, useEffect, useCallback } from 'react';
import { connectorService, type ConnectorStatus } from '@/service/connector-service';
import { useAppStore } from '@/store/app-store';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/store/toast-store';

type SyncState = 'idle' | 'syncing' | 'done' | 'error';

export function useConnectors() {
  const user = useAppStore((s) => s.user);
  const queryClient = useQueryClient();
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('idle');

  const refresh = useCallback(async () => {
    try {
      const data = await connectorService.getConnectors();
      setConnectors(data);
    } catch {
      setConnectors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const getStatus = (provider: string): ConnectorStatus | undefined =>
    connectors.find((c) => c.provider === provider);

  const syncCalendar = async () => {
    if (!user) return;
    setSyncState('syncing');
    try {
      const events = await connectorService.syncCalendar();
      const created = await connectorService.ingestCalendarEvents(events, user.id);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      await refresh();
      setSyncState('done');
      toast.success(created > 0 ? `${created} eventos importados pro inbox` : 'Calendar sincronizado');
    } catch (err: any) {
      setSyncState('error');
      toast.error(err.message ?? 'Erro ao sincronizar calendar');
    }
  };

  const syncGmail = async () => {
    if (!user) return;
    setSyncState('syncing');
    try {
      const messages = await connectorService.syncGmail();
      const created = await connectorService.ingestGmailMessages(messages, user.id);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      await refresh();
      setSyncState('done');
      toast.success(created > 0 ? `${created} emails importados pro inbox` : 'Gmail sincronizado');
    } catch (err: any) {
      setSyncState('error');
      toast.error(err.message ?? 'Erro ao sincronizar Gmail');
    }
  };

  const disconnect = async (provider: string) => {
    try {
      await connectorService.disconnect(provider);
      await refresh();
      toast.success('Conector desconectado');
    } catch {
      toast.error('Erro ao desconectar');
    }
  };

  return {
    connectors, loading, syncState,
    getStatus, syncCalendar, syncGmail, disconnect, refresh,
  };
}
