# Fase 5 — Auto-Triage Engine Spec

**Data:** 01 Abr 2026
**Status:** spec ready
**Dependência:** Fase 4 (service layer + FSM runtime)
**Referência:** Genesis v5.0.1, Part 3.1

---

## Visão geral

Motor de IA que analisa texto bruto do inbox e classifica com 3 faixas de confiança.
Transforma o sistema de "lista bonita" em "organismo vivo".

---

## Arquitetura

```
User input (Portuguese text)
  → Edge Function (triage-classify)
    → Claude Haiku 4.5 (classification)
      → TriageResult { type, module, confidence, tags, emotion }
        → Confidence Band (auto / suggest / manual)
          → auto: persist immediately (stage 1→3)
          → suggest: show in UI, user confirms in 1 tap
          → manual: user classifies manually
```

---

## Confidence Bands

| Band | Passive types (threshold) | Actionable types (threshold) | Action |
|------|--------------------------|------------------------------|--------|
| Auto | ≥ 90% | ≥ 95% | Auto-classify, skip to stage 3 |
| Suggest | 60-89% | 60-94% | Show suggestion, 1-tap confirm |
| Manual | < 60% | < 60% | User classifies manually |

**Actionable types** (higher threshold — misclassification = forgotten work):
task, project, spec, habit

**Passive types** (lower threshold — misclassification = minor inconvenience):
note, reflection, recommendation, podcast, article, resource, list, recipe, workout, etc.

---

## Edge Function: triage-classify

- **Runtime:** Deno (Supabase Edge Functions)
- **Model:** claude-haiku-4-5-20251001
- **Input:** `{ input: string, context?: string }`
- **Output:** `{ title, type, module, confidence, reasoning, tags, due_date, emotion }`
- **System prompt:** Genesis v5 types/modules, confidence rules, Portuguese-aware
- **Fallback:** On parse error → `{ type: 'note', module: 'bridge', confidence: 20 }`

---

## Service Layer

### ai-service.ts (rewritten)
- `classify(input, context?)` → TriageResult | null
- `classifyBatch(inputs[])` → Map<id, TriageResult> (5 concurrent max)
- `getBand(result)` → { action, threshold }
- `isActionableType(type)` → boolean

### triage-service.ts (new)
- `triageItem(item)` → TriagedItem (single item triage)
- `triageInbox()` → TriagedItem[] (batch inbox triage)
- `confirmSuggestion(itemId, result)` → AtomItem (accept AI suggestion)
- `overrideSuggestion(itemId, type, module)` → AtomItem (user override)

### triage-store.ts (new, Zustand)
- `queue` — pending items needing user decision
- `autoProcessed` — count of auto-classified items
- `runTriage()` — process entire inbox
- `confirmItem()` / `overrideItem()` / `skipItem()`

---

## Files to create/modify

| File | Action |
|------|--------|
| `supabase/functions/triage-classify/index.ts` | CREATE |
| `src/service/ai-service.ts` | REWRITE |
| `src/service/triage-service.ts` | CREATE |
| `src/store/triage-store.ts` | CREATE |
| `src/hooks/useTriage.ts` | CREATE |
| `supabase/functions/parse-input/` | KEEP (backward compat) |

---

## Critério de done

- Item capturado no inbox é classificado automaticamente ou apresentado com sugestão
- Usuário confirma em 1 toque, item avança pro estágio 3 (structured)
- Batch triage processa inbox inteiro
- FSM impede transições inválidas
- Fallback gracioso quando AI indisponível

---

## Deploy (manual)

```bash
supabase functions deploy triage-classify
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```
