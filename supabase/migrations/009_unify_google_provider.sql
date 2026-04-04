-- 009_unify_google_provider.sql
-- Unify google_calendar/google_gmail/google_drive → single 'google' provider.
-- One OAuth token, all scopes. Genesis v5 Espiral 2 F2.

-- Safety: remove records without tokens
DELETE FROM user_connectors
WHERE provider_refresh_token IS NULL
AND provider IN ('google_calendar', 'google_gmail', 'google_drive');

-- Unify to single provider
UPDATE user_connectors
SET provider = 'google',
    updated_at = NOW()
WHERE provider IN ('google_calendar', 'google_gmail', 'google_drive');
