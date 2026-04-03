// Edge function: calendar-sync
// Fetches Google Calendar events using stored refresh_token.
// Renews access_token server-side, returns events to frontend.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!;
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CalendarEvent {
  google_id: string;
  title: string;
  start: string;
  end: string;
  calendar: string;
  recurring: boolean;
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Token refresh failed: ${resp.status} ${body}`);
  }

  const data = await resp.json();
  return data.access_token;
}

async function fetchCalendarEvents(accessToken: string): Promise<{ events: CalendarEvent[]; timezone: string }> {
  const now = new Date();
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: twoWeeks.toISOString(),
    maxResults: '50',
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const resp = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Calendar API error: ${resp.status} ${body}`);
  }

  const data = await resp.json();
  const timezone = data.timeZone ?? 'UTC';

  const events: CalendarEvent[] = (data.items ?? [])
    .filter((e: any) => e.status !== 'cancelled' && e.summary)
    .map((e: any) => ({
      google_id: e.id,
      title: e.summary,
      start: e.start?.dateTime ?? e.start?.date ?? '',
      end: e.end?.dateTime ?? e.end?.date ?? '',
      calendar: e.organizer?.email ?? 'primary',
      recurring: !!e.recurringEventId,
    }));

  return { events, timezone };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Get stored refresh token
    const { data: connector, error: connError } = await supabase
      .from('user_connectors')
      .select('provider_refresh_token, sync_cursor')
      .eq('user_id', user.id)
      .eq('provider', 'google_calendar')
      .single();

    if (connError || !connector?.provider_refresh_token) {
      return new Response(
        JSON.stringify({ error: 'Google Calendar not connected. Please connect first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Refresh access token
    const accessToken = await refreshAccessToken(connector.provider_refresh_token);

    // Fetch events
    const { events, timezone } = await fetchCalendarEvents(accessToken);

    // Update last_sync_at
    await supabase
      .from('user_connectors')
      .update({ last_sync_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('provider', 'google_calendar');

    return new Response(
      JSON.stringify({
        events,
        timezone,
        synced_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
