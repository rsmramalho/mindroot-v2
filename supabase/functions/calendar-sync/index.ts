import { createClient } from "jsr:@supabase/supabase-js@2";

interface CalendarEvent {
  google_id: string; title: string; start: string; end: string;
  calendar: string; recurring: boolean; all_day: boolean;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
function err(msg: string, code: string, status: number, detail?: string): Response {
  const p: Record<string, string> = { error: msg, code }; if (detail) p.detail = detail;
  console.error(`[calendar-sync] ${code}: ${msg}`, detail ?? ""); return json(p, status);
}
function log(step: string, data?: Record<string, unknown>): void {
  console.log(`[calendar-sync] ${step}`, data ? JSON.stringify(data) : "");
}

async function refreshToken(rt: string, ci: string, cs: string): Promise<{ token: string } | { error: Response }> {
  log("token-refresh");
  let r: globalThis.Response;
  try {
    r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: ci, client_secret: cs, refresh_token: rt, grant_type: "refresh_token" }),
    });
  } catch (e) { return { error: err("Network error", "CAL_100", 502, String(e)) }; }

  if (!r.ok) {
    const b = await r.text().catch(() => "");
    if (r.status === 400 && b.includes("invalid_grant")) return { error: err("Token revoked — reconnect", "CAL_101", 400) };
    return { error: err("Token refresh failed", "CAL_103", 502, `${r.status}: ${b.slice(0, 500)}`) };
  }

  const d = await r.json().catch(() => ({}));
  if (!d.access_token) return { error: err("No access_token", "CAL_105", 502) };
  log("token-ok");
  return { token: d.access_token };
}

async function fetchEvents(at: string): Promise<{ events: CalendarEvent[]; tz: string } | { error: Response }> {
  log("fetch-events");
  const now = new Date(), end = new Date(now.getTime() + 14 * 86400000);
  const p = new URLSearchParams({ timeMin: now.toISOString(), timeMax: end.toISOString(), maxResults: "50", singleEvents: "true", orderBy: "startTime" });

  let r: globalThis.Response;
  try { r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${p}`, { headers: { Authorization: `Bearer ${at}` } }); }
  catch (e) { return { error: err("Network error", "CAL_200", 502, String(e)) }; }

  if (!r.ok) {
    const b = await r.text().catch(() => "");
    return { error: err("Calendar API error", "CAL_204", 502, `${r.status}: ${b.slice(0, 500)}`) };
  }

  const d = await r.json().catch(() => ({ items: [] }));
  const events: CalendarEvent[] = (d.items ?? [])
    .filter((e: any) => e.status !== "cancelled" && e.summary)
    .map((e: any) => ({
      google_id: String(e.id ?? ""), title: String(e.summary ?? ""),
      start: e.start?.dateTime ?? e.start?.date ?? "", end: e.end?.dateTime ?? e.end?.date ?? "",
      calendar: e.organizer?.email ?? "primary", recurring: !!e.recurringEventId, all_day: !e.start?.dateTime,
    })).filter((e: CalendarEvent) => e.google_id && e.title && e.start);

  log("events-ok", { count: events.length });
  return { events, tz: d.timeZone ?? "UTC" };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return err("Method not allowed", "CAL_001", 405);

  try {
    log("start");
    const s = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
          ci = Deno.env.get("GOOGLE_CLIENT_ID"), cs = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!s || !k || !ci || !cs) return err("Missing env vars", "CAL_010", 500);

    let body: Record<string, unknown>;
    try { body = JSON.parse(await req.text() || "{}"); } catch (e) { return err("Invalid JSON", "CAL_021", 400, String(e)); }
    const userId = body.user_id;
    if (!userId || typeof userId !== "string") return err("Missing user_id", "CAL_022", 400);

    const sb = createClient(s, k);
    const { data: conn, error: ce } = await sb.from("user_connectors").select("provider_refresh_token")
      .eq("user_id", userId).eq("provider", "google").maybeSingle();
    if (ce) return err("DB error", "CAL_301", 500, ce.message);
    if (!conn?.provider_refresh_token) return err("Google not connected", "CAL_302", 400);

    const tr = await refreshToken(conn.provider_refresh_token, ci, cs);
    if ("error" in tr) return tr.error;

    const er = await fetchEvents(tr.token);
    if ("error" in er) return er.error;

    const now = new Date().toISOString();
    await sb.from("user_connectors").update({ last_sync_at: now, updated_at: now }).eq("user_id", userId).eq("provider", "google");

    log("done", { events: er.events.length });
    return json({ events: er.events, timezone: er.tz, synced_at: now, count: er.events.length });
  } catch (u) {
    return err("Unhandled", "CAL_999", 500, u instanceof Error ? `${u.name}: ${u.message}` : String(u));
  }
});
