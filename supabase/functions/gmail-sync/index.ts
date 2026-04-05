import { createClient } from "jsr:@supabase/supabase-js@2";

interface GmailMessage {
  id: string; thread_id: string; subject: string; from: string;
  date: string; snippet: string; labels: string[];
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
  console.error(`[gmail-sync] ${code}: ${msg}`, detail ?? ""); return json(p, status);
}
function log(step: string, data?: Record<string, unknown>): void {
  console.log(`[gmail-sync] ${step}`, data ? JSON.stringify(data) : "");
}

async function refreshToken(rt: string, ci: string, cs: string): Promise<{ token: string } | { error: Response }> {
  log("token-refresh");
  let r: globalThis.Response;
  try {
    r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: ci, client_secret: cs, refresh_token: rt, grant_type: "refresh_token" }),
    });
  } catch (e) { return { error: err("Network error", "GMAIL_100", 502, String(e)) }; }

  if (!r.ok) {
    const b = await r.text().catch(() => "");
    if (r.status === 400 && b.includes("invalid_grant")) return { error: err("Token revoked — reconnect", "GMAIL_101", 400) };
    return { error: err("Token refresh failed", "GMAIL_103", 502, `${r.status}: ${b.slice(0, 500)}`) };
  }

  const d = await r.json().catch(() => ({}));
  if (!d.access_token) return { error: err("No access_token", "GMAIL_105", 502) };
  log("token-ok");
  return { token: d.access_token };
}

async function fetchStarred(at: string): Promise<{ messages: GmailMessage[] } | { error: Response }> {
  log("list-messages");
  const after = Math.floor((Date.now() - 14 * 86400000) / 1000);
  const q = encodeURIComponent(`is:starred after:${after}`);

  let r: globalThis.Response;
  try {
    r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=20`,
      { headers: { Authorization: `Bearer ${at}` } });
  } catch (e) { return { error: err("Network error", "GMAIL_200", 502, String(e)) }; }

  if (!r.ok) {
    const b = await r.text().catch(() => "");
    if (r.status === 403) return { error: err("Gmail API denied — enable in Cloud Console", "GMAIL_202", 403, b.slice(0, 500)) };
    return { error: err("Gmail API error", "GMAIL_203", 502, `${r.status}: ${b.slice(0, 500)}`) };
  }

  const d = await r.json().catch(() => ({ messages: [] }));
  const ids: string[] = (d.messages ?? []).map((m: any) => m.id).filter(Boolean);
  log("listed", { count: ids.length });

  if (ids.length === 0) return { messages: [] };

  const messages: GmailMessage[] = [];
  for (const id of ids) {
    try {
      const mr = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${at}` } });
      if (!mr.ok) continue;
      const msg = await mr.json();
      const h: Array<{ name: string; value: string }> = msg.payload?.headers ?? [];
      const get = (n: string) => h.find((x) => x.name.toLowerCase() === n.toLowerCase())?.value ?? "";
      messages.push({
        id: msg.id, thread_id: msg.threadId ?? "", subject: get("Subject"),
        from: get("From"), date: get("Date"), snippet: msg.snippet ?? "", labels: msg.labelIds ?? [],
      });
    } catch { /* skip individual message errors */ }
  }

  log("fetched", { count: messages.length });
  return { messages };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return err("Method not allowed", "GMAIL_001", 405);

  try {
    log("start");
    const s = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
          ci = Deno.env.get("GOOGLE_CLIENT_ID"), cs = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!s || !k || !ci || !cs) return err("Missing env vars", "GMAIL_010", 500);

    let body: Record<string, unknown>;
    try { body = JSON.parse(await req.text() || "{}"); } catch (e) { return err("Invalid JSON", "GMAIL_021", 400, String(e)); }
    const userId = body.user_id;
    if (!userId || typeof userId !== "string") return err("Missing user_id", "GMAIL_022", 400);

    const sb = createClient(s, k);
    const { data: conn, error: ce } = await sb.from("user_connectors").select("provider_refresh_token")
      .eq("user_id", userId).eq("provider", "google").maybeSingle();
    if (ce) return err("DB error", "GMAIL_301", 500, ce.message);
    if (!conn?.provider_refresh_token) return err("Google not connected", "GMAIL_302", 400);

    const tr = await refreshToken(conn.provider_refresh_token, ci, cs);
    if ("error" in tr) return tr.error;

    const mr = await fetchStarred(tr.token);
    if ("error" in mr) return mr.error;

    const now = new Date().toISOString();
    await sb.from("user_connectors").update({ last_sync_at: now, updated_at: now }).eq("user_id", userId).eq("provider", "google");

    log("done", { messages: mr.messages.length });
    return json({ messages: mr.messages, synced_at: now, count: mr.messages.length });
  } catch (u) {
    return err("Unhandled", "GMAIL_999", 500, u instanceof Error ? `${u.name}: ${u.message}` : String(u));
  }
});
