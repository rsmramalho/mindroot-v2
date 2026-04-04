// service/connector-service.ts — Connector management
// Auth flow, token storage, sync triggers, status queries.
// Pattern: hooks → service → supabase (never import supabase in hooks)

import { supabase } from './supabase';
import { itemService } from './item-service';

export interface ConnectorStatus {
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt: string | null;
  metadata: Record<string, unknown>;
}

export interface CalendarEvent {
  google_id: string;
  title: string;
  start: string;
  end: string;
  calendar: string;
  recurring: boolean;
}

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
].join(' ');

export const connectorService = {
  async getConnectors(): Promise<ConnectorStatus[]> {
    const { data, error } = await supabase
      .from('user_connectors')
      .select('provider, status, last_sync_at, metadata');

    if (error) {
      console.warn('[connector] getConnectors error (table may not exist):', error.message);
      throw error;
    }

    return (data ?? []).map((row) => ({
      provider: row.provider,
      status: row.status as ConnectorStatus['status'],
      lastSyncAt: row.last_sync_at,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
    }));
  },

  async connectGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: GOOGLE_SCOPES,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
  },

  async storeTokens(
    providerRefreshToken: string,
    provider: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {

    // Try edge function first
    try {
      const resp = await supabase.functions.invoke('connector-auth', {
        body: {
          provider_refresh_token: providerRefreshToken,
          provider,
          scopes: GOOGLE_SCOPES.split(' '),
          metadata,
        },
      });

      if (resp.error) throw new Error(resp.error.message);
      return;
    } catch (edgeFnErr) {
      console.warn('[connector] edge function failed, falling back to direct insert:', edgeFnErr);
    }

    // Fallback: insert directly (works if table exists and RLS allows it)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session for fallback insert');
    const { error } = await supabase
      .from('user_connectors')
      .upsert(
        {
          user_id: session.user.id,
          provider,
          status: 'connected',
          provider_refresh_token: providerRefreshToken,
          scopes: GOOGLE_SCOPES.split(' '),
          metadata: metadata ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' },
      );

    if (error) throw new Error(`Direct insert failed: ${error.message}`);
  },

  async syncCalendar(): Promise<CalendarEvent[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const resp = await supabase.functions.invoke('calendar-sync', {
      body: { user_id: session.user.id },
    });

    if (resp.error) throw new Error(resp.error.message);

    const body = resp.data as { events: CalendarEvent[]; timezone: string; synced_at: string };
    return body.events;
  },

  async ingestCalendarEvents(events: CalendarEvent[], userId: string): Promise<number> {
    // Get existing items with google_id to avoid duplicates
    const { data: existingItems } = await supabase
      .from('items')
      .select('body')
      .eq('user_id', userId)
      .not('body', 'is', null);

    const existingGoogleIds = new Set(
      (existingItems ?? [])
        .map((i) => (i.body as Record<string, unknown>)?.google_id)
        .filter(Boolean),
    );

    let created = 0;
    for (const event of events) {
      if (existingGoogleIds.has(event.google_id)) continue;

      // Determine type based on event characteristics
      const type = event.recurring ? 'ritual' : 'task';

      await itemService.create({
        title: event.title,
        user_id: userId,
        type,
        module: 'bridge',
        tags: ['#domain:tempo', '#calendar', '#source:google-calendar'],
        status: 'inbox',
        state: 'inbox',
        genesis_stage: 1,
        source: 'atom-engine',
        body: {
          google_id: event.google_id,
          start: event.start,
          end: event.end,
          calendar: event.calendar,
          recurring: event.recurring,
        },
      });
      created++;
    }

    return created;
  },

  async disconnect(provider: string): Promise<void> {
    const { error } = await supabase
      .from('user_connectors')
      .update({ status: 'disconnected', provider_refresh_token: null, updated_at: new Date().toISOString() })
      .eq('provider', provider);

    if (error) throw error;
  },
};
