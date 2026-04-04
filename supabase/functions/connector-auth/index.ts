// Edge function: connector-auth
// Stores Google OAuth tokens in user_connectors table.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }),
        { status: 500, headers },
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', detail: authError?.message }),
        { status: 401, headers },
      );
    }

    const body = await req.json();
    const { provider_refresh_token, provider, scopes, metadata } = body;

    if (!provider || !provider_refresh_token) {
      return new Response(
        JSON.stringify({ error: 'Missing provider or refresh_token', received: Object.keys(body) }),
        { status: 400, headers },
      );
    }

    const { error: upsertError } = await supabase
      .from('user_connectors')
      .upsert(
        {
          user_id: user.id,
          provider,
          status: 'connected',
          provider_refresh_token,
          scopes: scopes ?? [],
          metadata: metadata ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' },
      );

    if (upsertError) {
      return new Response(
        JSON.stringify({ error: 'Upsert failed', detail: upsertError.message }),
        { status: 500, headers },
      );
    }

    return new Response(JSON.stringify({ status: 'connected', provider }), { headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Unhandled', detail: String(err) }),
      { status: 500, headers },
    );
  }
});
