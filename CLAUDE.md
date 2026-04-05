# Genesis Build Protocol v1.0
## Sistema de Agentes — Construcao de Dentro pra Fora

**Parent:** Genesis v5.0.1 + Meta-Template v1.1
**Principio:** Cada camada nasce da anterior. Nenhuma camada conhece o que esta acima dela.

---

### Filosofia

O problema padrao de AI gerando codigo: o agente ve tudo de uma vez, implementa pelo que e visivel (UI), e perde a geometria do schema ao longo do caminho.

Este protocolo inverte isso.

Cinco agentes. Cada um so conhece o que nasceu antes dele. O contexto cresce como Fibonacci — cada agente recebe a soma dos anteriores, nao o codebase inteiro. A geometria e preservada porque cada decisao de implementacao e tomada a partir do contrato, nao da suposicao.

```
· GUARDIAO  →  output G
— ROOT      →  output G + R
△ ESTRUTURA →  output G + R + E
□ INTERFACE →  output G + E + I   (recebe Estrutura, nao Root diretamente)
⬠ TEIA      →  output G + R + E + I + validacao
```

### Os 4 Protocolos

Todo agente, antes de gerar qualquer output, executa estes 4 protocolos internamente:

**1. Proporcao Invertida**
> "O que eu NAO sei ainda sobre esta camada?"
Listar incertezas antes de construir. Nao avancar onde ha duvida nao resolvida.

**2. Maturacao Permissiva**
> "A camada anterior esta completa o suficiente para esta nascer?"
Se nao esta — parar. Reportar o que falta. Nao construir em cima de fundacao incompleta.

**3. Detector de Trava**
> "Estou construindo a partir da camada abaixo ou estou assumindo algo que nao foi definido?"
Questionar o impulso automatico de implementar. Se a resposta nao esta na camada anterior, nao inventar.

**4. Tudo So E**
> "Esta conexao entre camadas existe no schema, ou estou criando uma dependencia que nao foi especificada?"
Nao forcar. Se a conexao nao esta no Genesis, nao criar.

### Agente 1 — GUARDIAO · Ponto

**Recebe:** Genesis v5 + Meta-Template v1.1 + spec/task da sessao atual
**Nunca recebe:** codigo, codebase existente, ou output de outros agentes
**Funcao:** autoridade do schema. Nao escreve codigo. So valida e define constraints.

**Output obrigatorio antes de passar pro proximo agente:**

```
GUARDIAO — CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━
AtomTypes envolvidos: [lista]
AtomModules: [lista]
State machine relevante: [estagios + gates]
Extensions que se aplicam: [soul / operations / recurrence]
Campos obrigatorios por type: [lista]
Enums validos em uso: [lista]
Pisos minimos: [type → piso]
Connections esperadas: [relation types]

⚠ INCERTEZAS (Proporcao Invertida):
[o que ainda nao esta claro no schema para esta task]

✓ APROVADO PARA: ROOT
```

Se houver incerteza nao resolvida → parar e perguntar. Nao passar pro Root com duvida aberta.

### Agente 2 — ROOT — Linha

**Recebe:** Genesis v5 + output do GUARDIAO
**Nunca recebe:** componentes UI, logica de negocio, ou output de outros agentes alem do Guardiao
**Funcao:** schema do banco de dados. Supabase: tabelas, colunas, tipos, enums, triggers, RLS, RPCs.

**Gate de entrada:**
- [ ] Output do Guardiao esta presente e aprovado?
- [ ] Todos os AtomTypes listados pelo Guardiao tem schema definido?

**Output obrigatorio:**

```
ROOT — SCHEMA
━━━━━━━━━━━━━
SQL: [tabelas + colunas + constraints]
TypeScript types: [interfaces derivadas do schema]
Enums: [valores validos conforme Genesis]
Triggers: [FSM downgrades se aplicavel]
RLS: [politicas de acesso]
RPCs: [funcoes Supabase se necessario]

Cross-check Guardiao:
[verificar cada constraint do Guardiao foi respeitada]

⚠ INCERTEZAS (Proporcao Invertida):
[o que ainda nao esta definido no schema]

✓ APROVADO PARA: ESTRUTURA
```

### Agente 3 — ESTRUTURA △ Triangulo

**Recebe:** Genesis v5 + output do GUARDIAO + output do ROOT
**Nunca recebe:** componentes UI ou CSS
**Funcao:** logica de negocio. Services, hooks React, mutations, queries. Toda funcao consome os tipos do Root — nunca acessa banco diretamente.

### Agente 4 — INTERFACE □ Quadrado

**Recebe:** Genesis v5 + output do GUARDIAO + output da ESTRUTURA
**Nao recebe diretamente:** SQL do Root (acessa banco apenas via hooks da Estrutura)
**Funcao:** componentes React. Consome exclusivamente atraves dos hooks e services da Estrutura.

### Agente 5 — TEIA ⬠ Pentagono

**Recebe:** todos os outputs anteriores
**Funcao:** integracao e cross-check final. Valida que a geometria esta intacta do Ponto ao Quadrado. Corrige onde necessario.

### Como Invocar

**Task completa (nova feature ou modulo):**
1. GUARDIAO → 2. ROOT → 3. ESTRUTURA → 4. INTERFACE → 5. TEIA

**Quando o protocolo pode ser simplificado:**
Se a task for puramente de schema (nova tabela sem UI) → GUARDIAO + ROOT apenas.
Se a task for puramente visual (CSS, layout) → INTERFACE direto.
O protocolo escala pra baixo. Nunca pula para cima.

### Regra de Ouro

**Se qualquer agente nao tem resposta para uma pergunta do protocolo — para. Pergunta. Nao assume.**

---

# MindRoot v2

Emotional productivity system — the face of Atom OS. Emotion precedes action, reflection closes the loop.

## Version

v2.0.0-alpha.8 — PHI spiral. All 11 pages built from wireframes. Full auth flow.

## Stack

React 19 · TypeScript 5.9 · Vite 8 · Tailwind 4 · Supabase · TanStack Query 5 · Zustand 5 · Framer Motion · date-fns

## Commands

```bash
npm run dev      # Dev server (port 5173)
npm run build    # tsc -b && vite build
npx tsc -b       # Type check only
```

## Architecture

```
src/
  config/          # type-schemas.json, types.ts, raiz.ts
  types/           # item.ts (Schema v2), engine.ts, ui.ts
  service/         # Supabase access: items, fsm, pipeline, wrap, audit, auth
  engine/          # Pure logic: fsm, wrap, parsing, recurrence, soul, search
  store/           # Zustand: app-store, wrap-store, toast-store
  hooks/           # React hooks: useItems, usePipeline, useWrap, useAuth, etc
  components/
    atoms/         # Design system: GeometryIcon, TypeChip, StageBadge, etc
    shell/         # AppShell, TopBar, BottomNav
    pages/         # (Fase 4+)
  pages/           # (Fase 4+)
docs/
  wireframes/      # 11 HTML wireframes — open in browser to view
  specs/           # Phase specs + roadmap PHI
  genesis/         # Genesis v5.0.1 (reference — source of truth = KB)
  marco-zero/      # Marco Zero v2.0 (reference)
  sql/             # Schema migration reference
  templates/       # Historical templates
supabase/
  migrations/      # 001-006
  functions/       # parse-input, send-push, triage-classify
```

## Critical Rules

1. **Path alias**: `@/` = `src/`. Always use `@/` imports.
2. **AtomItem Schema v2**: Use `item.status`, `item.state`, `item.body.soul`, `item.body.operations`, `item.body.recurrence`. NEVER use v1 fields.
3. **Service layer**: hooks → service → Supabase. Hooks never import from `service/supabase.ts` directly.
4. **No emoji in UI**: use word-based labels, geometry icons.
5. **Language**: code/comments in English, UI strings in Brazilian Portuguese.
6. **Before delivering**: always run `npx tsc -b && npm run build`. Zero errors.
7. **Wireframe is law**: Before implementing any page, read the corresponding wireframe in `docs/wireframes/`.
8. **Light-first**: Background `#FDFCF9`, DM Sans (300/400/500). Dark mode via media query.
9. **Build Protocol obrigatorio.** Antes de implementar qualquer fase do roadmap, ler o campo `protocol:` da fase e rodar os agentes correspondentes. Registrar o output do GUARDIAO no commit message ou num comentario. Se o spec do Rick ja cobre os constraints — dizer "GUARDIAO: constraints cobertos pelo spec" e seguir. Nao pular silenciosamente.

## Documentacao

Tudo vive neste repo:

| O que | Onde |
|-------|------|
| Roadmap oficial | `ROADMAP.md` (raiz) |
| Wireframes (11 telas) | `docs/wireframes/` — abrir no browser pra ver |
| Specs de fase | `docs/specs/` |
| Genesis v5.0.1 | `docs/genesis/` (referencia — source of truth = KB do Project Atom) |
| Marco Zero v2.0 | `docs/marco-zero/` (referencia) |
| Templates historicos | `docs/templates/archive/` |

**Regra:** Antes de criar qualquer tela, le o wireframe correspondente em `docs/wireframes/`.

## Design System (Genesis v5.0.1)

- Font: DM Sans (weights: 300, 400, 500) — single font family
- Background: light-first `#FDFCF9` (dark via `prefers-color-scheme`)
- Ritual periods: `aurora`, `zenite`, `crepusculo`
- Module colors: work, body, mind, family, purpose, bridge, finance, social (in `index.css` @theme)
- Stage geometries: · — △ □ ⬠ ⬡ ○
- Style: minimal, no emoji, geometry-driven

## Key Types (src/types/item.ts)

- `AtomItem` — core entity with state machine (7 stages)
- `AtomType`: 23 types (note, task, habit, project, wrap, etc)
- `AtomModule`: 8 modules (work, body, mind, family, purpose, bridge, finance, social)
- `AtomState`: inbox → classified → structured → validated → connected → propagated → committed
- `AtomStatus`: inbox | draft | active | paused | waiting | someday | completed | archived
- Extensions (body JSONB): SoulExtension, OperationsExtension, RecurrenceExtension

## Services (7)

supabase, item-service (itemService + connectionService + eventService), auth-service, fsm-service, pipeline-service, wrap-service, audit-service

## Engines (6)

fsm (state machine), wrap (daily close), parsing (token parser), recurrence (RRULE), soul (check-in), search (fulltext + filters)

## Stores (3)

app-store (nav, filters, user), wrap-store (wrap session), toast-store (notifications)

## Hooks (7)

useAuth, useItems, useItemMutations, usePipeline, useWrap, useRealtime, useProject

## Supabase

Project: avvwjkzkzklloyfugzer
- 3 tables: items, item_connections, atom_events
- Triggers: sync_genesis_stage, check_orphan_downgrade
- RPCs: morph_item, decay_item, propagate_effect, commit_item
- RLS: user isolation
- Audit views: v_orphan_items, v_below_floor, v_inbox_stale
- Edge functions: parse-input, send-push, triage-classify

## Environment Variables

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Pages (12)

| Page | File | Wireframe |
|------|------|-----------|
| Landing | pages/Landing.tsx | — |
| Auth | pages/Auth.tsx | — |
| Onboarding | pages/Onboarding.tsx | mindroot-wireframe-raiz-onboarding.html |
| Home | pages/Home.tsx | mindroot-wireframe-home.html |
| Pipeline/Triage | pages/Pipeline.tsx | mindroot-wireframe-triage-pipeline-v2.html |
| Wrap | pages/Wrap.tsx | mindroot-wireframe-wrap.html |
| Projects | pages/Projects.tsx | mindroot-wireframe-projects.html |
| Calendar | pages/Calendar.tsx | mindroot-wireframe-calendar.html |
| Analytics | pages/Analytics.tsx | mindroot-wireframe-analytics.html |
| Library | pages/Library.tsx | mindroot-wireframe-library-reflexoes.html |
| Settings | pages/Settings.tsx | mindroot-wireframe-settings.html |
| Raiz | pages/Raiz.tsx | mindroot-wireframe-raiz-dashboard.html |

## Components

- atoms/ (8): tokens, GeometryIcon, TypeChip, StageBadge, ModuleBar, ConfidenceBar, FAB, index
- shell/ (3): AppShell, TopBar, BottomNav
- home/ (5): SoulCard, WrapBanner, AtomInput, InboxPreview, AuditBar
- shared/ (4): ItemCard, Skeleton, EmptyState, ErrorBanner
- companion/ (1): CompanionSheet

## Edge Functions

- **Deploy:** `./supabase/deploy.sh` (requer `supabase/.env.supabase`)
- **Import padrao:** `jsr:@supabase/supabase-js@2`
- **Auth padrao:** `--no-verify-jwt` + user_id no body + service role key
- **Secrets necessarios:** GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ANTHROPIC_API_KEY
- **6 functions:** connector-auth, calendar-sync, gmail-sync, triage-classify, parse-input, send-push

## PHI Phases

| Phase | Geometry | Status | Commit |
|-------|----------|--------|--------|
| · Sementes | · | done | 1e019f5 |
| — Raizes | — | done | f68ee25 |
| △ Geometria | △ | done | 16f4149 |
| □ Fundacao | □ | done | 775f8cc, dc48982 |
| ⬠ Conexao | ⬠ | done | 2cfc511 |
| ⬡ Ativacao | ⬡ | done | cf886ab |
| ○ Completude | ○ | in progress | 950c2e8, 756edc3 |
