# MindRoot — Roadmap

**Versão:** 7.0
**Data:** 07 Abr 2026
**Último commit verificado:** 8e6a06a0
**Deploy:** mindroot.com.au (Vercel)
**Princípio:** Motor → Inteligência → Visualização → Reflexão

> **Nota v7.0:** Este roadmap substitui o anterior (MINDROOT-ROADMAP.md, que cobria apenas Espiral 1). Versões 1-6 existiam apenas no PENTAGON.md como referência cruzada. v7.0 é o primeiro ROADMAP.md canônico verificado contra o código real.

---

## Números reais (post Schema v2 migration)

| Métrica | Valor | Verificado |
|---------|-------|------------|
| Commits | 63 | `git log --oneline \| wc -l` |
| Arquivos TS/TSX | 156 | `find src -name "*.ts" -o -name "*.tsx" \| wc -l` |
| LOC (src/) | ~25.800 | `wc -l` total |
| Pages | 14 | `ls src/pages/` |
| Test suites | 24 | `npx vitest run` |
| Testes unitários | 462 | all passing |
| Edge functions | 3 | parse-input, send-push, triage-classify |
| Migrations | 6 | supabase/migrations/ |
| Build | ✓ | `npm run build` limpo |

---

## Espiral 1 — Corpo (COMPLETA ○)

**Status:** Completa. v1.0.0 lançada (alpha.22). Polida até alpha.25.2.
**Milestones:** M1 Sobrevivência ✅ | M2 Consistência ✅ | M3 Excelência ✅

Entregou: dashboard, inbox, pipeline UI, soul layer (aurora check-in, emoções), ritual, journal, analytics, calendar, projects, search, export, temas, sharing, onboarding, PWA, push notifications, offline queue.

**Schema v2 migration** (cf33d5a3): migração completa do codebase para Atom Engine Schema v2. Seguida de rebuild da UI em 5 fases (a2933291→784ee7f7): design system, home, pipeline+triage, wrap stepper, service layer+FSM, auto-triage engine.

---

## Espiral 2 — Vida / sistema operacional

**Versão:** 7.0
**Status:** F3 entregue, F4 parcial. F1, F2, F5 não iniciados.
**Último commit verificado:** 8e6a06a0
**Princípio:** Se existe no digital, tem como entrar.

```
     F1 · Raiz         F2 — Conectores
     ⚪ not started     ⚪ not started
          \                /
           \              /
     F5 ⬠ Companheiro   F3 △ Toque+alma
     ⚪ not started      ✅ done
              \          /
               \        /
          F4 □ Biblioteca+grafo
          ◐ partial
```

### ⚪ Fase 1 · Raiz (effort: 1)
**Status:** Não iniciada
**O que é:** 9 domínios Raiz (Genesis Part 9), routine builder, domain store
**Código existente:** Nenhum. Não existe `raiz.ts`, nem configuração de domínios, nem UI de builder.
**Entregáveis:**
- ⚪ Configuração dos 9 domínios (raiz.ts)
- ⚪ Domain builder UI
- ⚪ Domain store (Zustand)
- ⚪ Routine builder (ritual integration)
- ⚪ Onboarding Raiz flow

### ⚪ Fase 2 — Conectores (effort: 1)
**Status:** Não iniciada
**O que é:** Pontes com serviços externos — Gmail, Google Calendar, Atom Agent, AtomDrive
**Código existente:** Nenhum. OAuth do Google existe (Espiral 1, auth-service.ts) mas não há connectors dedicados. Edge functions atuais: parse-input, send-push, triage-classify — nenhuma de conector.
**Entregáveis:**
- ⚪ connector-auth edge function (OAuth token vault)
- ⚪ calendar-sync edge function
- ⚪ Gmail sync (leitura + criação de items)
- ⚪ atom-agent integration (CLI → MindRoot)
- ⚪ AtomDrive export
- ⚪ body.location nos items relevantes
- ⚪ watch mode (Haiku)

### ✅ Fase 3 △ Toque + alma (effort: 1)
**Status:** Entregue
**Commits:** a2933291 (design system), d8272148 (home), 65435355 (pipeline+triage), 8cf2204a (wrap stepper+FSM), 81efe8e7 (service layer+FSM), 784ee7f7 (auto-triage)
**Nota:** Componentes soul originam da Espiral 1, reconstruídos no Schema v2. Auto-triage engine é novo.
**Entregáveis:**
- ✅ Aurora check-in — CheckInPrompt.tsx, EmotionPicker.tsx, PostCheckIn.tsx
- ✅ SoulPulse — dashboard emotional pulse
- ✅ Soul engine — soul.ts (triggers, shift detection)
- ✅ useSoul hook + soul store
- ✅ Ritual page — aurora/zênite/crepúsculo
- ✅ Wrap stepper — 7-step guided wrap (Wrap.tsx)
- ✅ Wrap engine — wrap.ts (audit, payload builder)
- ✅ Pipeline page — 7-stage funnel com triage flow
- ✅ Triage service — classificação com confidence bands (auto/suggest/manual)
- ✅ Triage store + useTriage hook
- ✅ Auto-triage engine — confidence scoring heurístico

### ◐ Fase 4 □ Biblioteca + grafo (effort: 1)
**Status:** Parcial — library list entregue, graph e connections não construídos
**Commits:** incluído nas fases ui-v2
**Entregáveis:**
- ✅ Library page — Library.tsx (tabs: todos, reflexões, recomendações, conteúdo)
- ✅ Search engine — search.ts (full-text, filtros) — originário da Espiral 1
- ⚪ Graph view — NÃO existe. Sem D3. Sem dependência de visualização de grafo. Sem force-directed layout.
- ⚪ Connections CRUD — NÃO existe. Sem ConnectionEditor, sem connection prompt UI. ItemDetail.tsx tem stage progression mas não edição de connections.
- ⚪ Domain filter no grafo

### ⚪ Fase 5 ⬠ Companheiro (effort: 2)
**Status:** Não iniciada
**O que é:** Agente conversacional integrado — "o espelho"
**Código existente:** ai-service.ts (classificação), ai-suggestions.ts (sugestões). Sem interface conversacional.

---

### Problemas conhecidos

1. **OAuth callback instável** — fluxo Google PKCE ocasionalmente falha (reportado alpha.24, fix parcial)
2. **Edge functions limitadas** — apenas 3 (parse-input, send-push, triage-classify). PENTAGON v3.2 afirmava 6.
3. **Triage heurístico** — Pipeline.tsx usa classificação por keywords, não ML. Funcional mas limitado.
4. **MINDROOT-ROADMAP.md desatualizado** — cobre apenas Espiral 1 (alpha.25.2). Este ROADMAP.md é o canônico.

### Seeds — Espiral 3

Aspiracional. Nenhum código existe.

- **Escudo** — ações nos conectores, blocos rituais no Calendar (scope write)
- **Resiliência** — offline completo + Ollama (AI local)
- **Propagação** — estágio 6 real (atom_events cascade)
- **Atom Agent v2+** — watch mode, Haiku, Drive scan

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 7.0 | 07 Abr 2026 | Primeiro ROADMAP.md canônico. Verificado contra código real (HEAD 8e6a06a0). F1 Raiz e F2 Conectores: não existem (PENTAGON v3.2 inflava). F3 Toque+alma: confirmado no código. F4 Biblioteca: parcial (library sim, graph não). Métricas corrigidas (63 commits, 156 files, 25.8K LOC, 3 edge fns). |
