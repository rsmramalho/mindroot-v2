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

export interface GmailMessage {
  id: string;
  thread_id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labels: string[];
}

export const connectorService = {
  async getConnectors(): Promise<ConnectorStatus[]> {
    const { data, error } = await supabase
      .from('user_connectors')
      .select('provider, status, last_sync_at, metadata');

    if (error) {
      console.warn('[connector] getConnectors error:', error.message);
      throw error;
    }

    return (data ?? []).map((row) => ({
      provider: row.provider,
      status: row.status as ConnectorStatus['status'],
      lastSyncAt: row.last_sync_at,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
    }));
  },

  async storeTokens(
    providerRefreshToken: string,
    provider: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const resp = await supabase.functions.invoke('connector-auth', {
      body: {
        user_id: session.user.id,
        provider_refresh_token: providerRefreshToken,
        provider,
        scopes: [
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/gmail.readonly',
        ],
        metadata: metadata ?? {},
      },
    });

    if (resp.error) {
      console.warn('[connector] edge function failed, using fallback:', resp.error.message);
      const { error } = await supabase.from('user_connectors').upsert(
        {
          user_id: session.user.id,
          provider,
          status: 'connected',
          provider_refresh_token: providerRefreshToken,
          scopes: ['calendar.readonly', 'gmail.readonly'],
          metadata: metadata ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' },
      );
      if (error) throw new Error(`Direct insert failed: ${error.message}`);
    }
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

  async syncGmail(): Promise<GmailMessage[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const resp = await supabase.functions.invoke('gmail-sync', {
      body: { user_id: session.user.id },
    });
    if (resp.error) throw new Error(resp.error.message);
    return (resp.data as { messages: GmailMessage[] }).messages;
  },

  async ingestCalendarEvents(events: CalendarEvent[], userId: string): Promise<number> {
    const { data: existingItems } = await supabase
      .from('items').select('body').eq('user_id', userId).not('body', 'is', null);
    const existingGoogleIds = new Set(
      (existingItems ?? []).map((i) => (i.body as Record<string, unknown>)?.google_id).filter(Boolean),
    );

    let created = 0;
    for (const event of events) {
      if (existingGoogleIds.has(event.google_id)) continue;
      const type = event.recurring ? 'ritual' : 'task';
      await itemService.create({
        title: event.title, user_id: userId, type, module: 'bridge',
        tags: ['#domain:time', '#source:google-calendar', '#connector'],
        status: 'inbox', state: 'inbox', genesis_stage: 1, source: 'atom-engine',
        body: { google_id: event.google_id, start: event.start, end: event.end, calendar: event.calendar, recurring: event.recurring },
      });
      created++;
    }
    return created;
  },

  async ingestGmailMessages(messages: GmailMessage[], userId: string): Promise<number> {
    const { data: existingItems } = await supabase
      .from('items').select('body').eq('user_id', userId).not('body', 'is', null);
    const existingIds = new Set(
      (existingItems ?? []).map((i) => (i.body as any)?.gmail_id).filter(Boolean),
    );

    let created = 0;
    for (const msg of messages) {
      if (existingIds.has(msg.id)) continue;
      await itemService.create({
        title: msg.subject || '(sem assunto)', user_id: userId, type: 'note', module: 'bridge',
        tags: ['#domain:communication', '#source:gmail', '#connector'],
        status: 'inbox', state: 'inbox', genesis_stage: 1, source: 'atom-engine',
        body: { gmail_id: msg.id, from: msg.from, date: msg.date, snippet: msg.snippet, labels: msg.labels },
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
