import { createClient } from "jsr:@supabase/supabase-js@2";

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
  console.error(`[connector-auth] ${code}: ${msg}`, detail ?? ""); return json(p, status);
}
function log(step: string, data?: Record<string, unknown>): void {
  console.log(`[connector-auth] ${step}`, data ? JSON.stringify(data) : "");
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return err("Method not allowed", "AUTH_001", 405);

  try {
    log("start");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl) return err("Server misconfigured", "AUTH_010", 500, "SUPABASE_URL not set");
    if (!serviceRoleKey) return err("Server misconfigured", "AUTH_011", 500, "SUPABASE_SERVICE_ROLE_KEY not set");

    let body: Record<string, unknown>;
    try { body = JSON.parse(await req.text() || "{}"); }
    catch (e) { return err("Invalid JSON", "AUTH_031", 400, String(e)); }

    const { user_id, provider_refresh_token, provider, scopes, metadata } = body;
    if (!user_id || typeof user_id !== "string") return err("Missing user_id", "AUTH_032", 400);
    if (!provider || typeof provider !== "string") return err("Missing provider", "AUTH_033", 400);
    if (!provider_refresh_token || typeof provider_refresh_token !== "string")
      return err("Missing refresh_token", "AUTH_034", 400);

    log("env-ok", { user_id, provider });
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error: upsertError } = await supabase.from("user_connectors").upsert({
      user_id: String(user_id),
      provider: String(provider),
      status: "connected",
      provider_refresh_token: String(provider_refresh_token),
      scopes: Array.isArray(scopes) ? scopes : [],
      metadata: (metadata && typeof metadata === "object") ? metadata : {},
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,provider" });

    if (upsertError) return err("Upsert failed", "AUTH_041", 500, upsertError.message);
    log("done", { provider, user_id });
    return json({ status: "connected", provider: String(provider), user_id });
  } catch (u) {
    return err("Unhandled", "AUTH_999", 500, u instanceof Error ? `${u.name}: ${u.message}` : String(u));
  }
});
