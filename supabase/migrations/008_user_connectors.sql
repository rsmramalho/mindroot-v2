-- 008_user_connectors.sql
-- Connector infrastructure for Google Calendar, Gmail, Drive integration.
-- Genesis v5.0.1 — Espiral 2 F2 Conectores

CREATE TABLE IF NOT EXISTS user_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  provider TEXT NOT NULL, -- 'google_calendar', 'google_gmail', 'google_drive'
  status TEXT NOT NULL DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  provider_refresh_token TEXT, -- encrypted at rest by Supabase
  scopes TEXT[], -- granted scopes
  last_sync_at TIMESTAMPTZ,
  sync_cursor TEXT, -- page token or sync token for incremental sync
  metadata JSONB DEFAULT '{}', -- provider-specific data (email, calendar id, etc)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

ALTER TABLE user_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "connectors_isolation" ON user_connectors
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_connectors_user ON user_connectors(user_id);
