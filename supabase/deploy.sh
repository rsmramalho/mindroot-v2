#!/bin/bash
set -euo pipefail
PROJECT_REF="avvwjkzkzklloyfugzer"

echo "═══ Atom — Edge Function Deploy ═══"

if [ -f "supabase/.env.supabase" ]; then
  source supabase/.env.supabase
  echo "→ .env.supabase loaded"
else
  echo "AVISO: supabase/.env.supabase não encontrado"
  echo "Secrets precisam estar configurados no dashboard"
fi

if [ -n "${GOOGLE_CLIENT_ID:-}" ] && [ -n "${GOOGLE_CLIENT_SECRET:-}" ] && [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  echo "→ Setando secrets..."
  npx supabase secrets set \
    GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
    GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
    ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
    --project-ref "$PROJECT_REF"
fi

FUNCTIONS=(connector-auth calendar-sync gmail-sync triage-classify parse-input send-push)
for fn in "${FUNCTIONS[@]}"; do
  echo "→ Deploying $fn..."
  npx supabase functions deploy "$fn" \
    --no-verify-jwt \
    --project-ref "$PROJECT_REF"
done

echo ""
echo "═══ Deploy completo. ${#FUNCTIONS[@]} functions. ═══"
