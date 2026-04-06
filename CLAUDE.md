# MindRoot v2 — Claude Code Policy

**Versao:** 3.0
**Atualizado:** 06 Abr 2026
**Fonte do metodo:** atom-engine-core/ATOM.md
**Fonte do contrato:** atom-engine-core/law/genesis_v5-0-3.md
**Fonte do design:** atom-engine-core/mindroot/design/design-system.md

---

## O que e isto

MindRoot e V1 do Atom — o primeiro visualizador do Atom Engine. Este arquivo e a policy operacional pro Claude Code. Nao e documentacao — e instrucao executavel.

A lei vive no atom-engine-core (Genesis, Marco Zero, ATOM.md). Este repo e codigo. CLAUDE.md diz como construir, nao o que construir.

---

## Stack

React 19 · TypeScript 5.8 · Vite 6 · Tailwind 3.4 · Supabase · TanStack Query 5 · Zustand 5 · Framer Motion · date-fns

## Comandos

```bash
npm run dev            # Dev server (port 5173)
npm run build          # tsc -b && vite build
npx tsc -b             # Type check only
npm test               # vitest (467 tests, 24 suites)
npx playwright test    # E2E tests (69 tests, 10 specs)
bash scripts/audit.sh  # Full system audit (20 checks)
```

---

## Regras de construcao

### Antes de qualquer sessao (GUARDIAO)

Questionar:
1. Qual pilar essa task toca? (Emotion / Action / Time)
2. Isso nasce de dentro pra fora ou da periferia?
3. O pilar de origem tem flow E2E verificado?
4. O que eu NAO sei antes de comecar? (listar)

### 4 Protocolos (todo agente executa internamente)

**1. Proporcao Invertida** — "O que eu NAO sei ainda?" Listar incertezas antes de construir.
**2. Maturacao Permissiva** — "A camada anterior esta completa?" Se nao — parar. Reportar.
**3. Detector de Trava** — "Estou construindo da camada abaixo ou assumindo algo?" Se nao esta no spec, nao inventar.
**4. Tudo So E** — "Esta conexao existe no schema?" Nao forcar dependencias nao especificadas.

### Antes de qualquer commit (AUDITOR)

```bash
npx tsc -b              # zero type errors
npm test                 # zero test failures
npm run build            # build completa
```

Se qualquer passo falha → corrigir antes de commitar.

### Verificacao visual (pre-deploy)

- Viewport 360x800 testado
- Toast text nao sai do container
- Dark mode funcional
- Compare com wireframe correspondente (atom-engine-core/mindroot/design/wireframes/)

---

## Modo de trabalho

### Explore, Plan, Code
Nao pular direto pro codigo. Usar `/plan` (Shift+Tab 2x) pra pesquisar o codebase, definir boundaries, alinhar com wireframes.

### Chunk tasks
Quebrar flows complexos em 3-5 tasks focadas. Requests grandes causam drift.

### Verify own work
Incluir passos de verificacao: rodar testes, comparar com wireframe, explicar decisoes arquiteturais.

### Context fresh
Ao trocar de assunto, usar `/clear`. Conversas longas degradam performance.

### Figma MCP
Conectado. Usar pra comparar implementacao com design system e auditar componentes.

---

## Arquitetura

```
src/
  config/          # type-schemas.json, types.ts, raiz.ts
  types/           # item.ts (Schema v2), engine.ts, ui.ts
  engine/          # Pure logic (NUNCA importa de service/ ou hooks/)
  service/         # Supabase access (NUNCA importa de components/)
  hooks/           # React hooks (consomem services)
  store/           # Zustand stores
  components/
    atoms/         # Design system: tokens, GeometryIcon, TypeChip, StageBadge
    shell/         # AppShell, TopBar, BottomNav
    shared/        # CommandPalette, ErrorBoundary, ItemRow, etc
    dashboard/     # Home-specific components
    analytics/     # Analytics-specific
  pages/           # Route pages (named exports: export function HomePage)
```

**Dependencia flui de dentro pra fora:** types → engine → service → hooks → components → pages. Nunca na direcao contraria.

---

## Regras criticas

1. **Path alias:** `@/` = `src/`. Sempre usar `@/` imports.
2. **Schema v2 only:** usar `item.state`, `item.body.soul`, `item.body.operations`. NUNCA campos v1.
3. **Service layer:** hooks → service → Supabase. Hooks nunca importam supabase.ts direto.
4. **Sem emoji na UI:** labels por extenso, geometry icons (· — △ □ ⬠ ⬡ ○).
5. **Idioma:** codigo/comentarios em ingles, UI strings em portugues.
6. **Named exports on pages:** `export function HomePage()` — App.tsx importa `{ HomePage }`.
7. **Wireframe e lei:** antes de implementar qualquer pagina, ler o wireframe correspondente em atom-engine-core/mindroot/design/wireframes/.
8. **Design system:** referencia canonica em atom-engine-core/mindroot/design/design-system.md. Tokens CSS em src/index.css.
9. **Build Protocol:** antes de implementar qualquer fase, ler ATOM.md (metodo) e o campo protocol: da fase no ROADMAP.md.

---

## Referencias (vivem no atom-engine-core, NAO neste repo)

| O que | Onde |
|-------|------|
| O metodo (pilares, matriz, enforcement) | atom-engine-core/ATOM.md |
| O contrato (schema, state machine, SQL) | atom-engine-core/law/genesis.md |
| Guia operacional | atom-engine-core/law/marco-zero.md |
| Design system V1 | atom-engine-core/mindroot/design/design-system.md |
| Wireframes (11 telas) | atom-engine-core/mindroot/design/wireframes/ |
| Feature specs (14) | atom-engine-core/mindroot/features/ |
| Master roadmap (Pentagono) | atom-engine-core/PENTAGON.md |

**Regra:** este repo NAO mantem copias de docs-lei. Se precisa ler o Genesis, vai no atom-engine-core.

---

## Supabase

Project: avvwjkzkzklloyfugzer
- 3 tables: items, item_connections, atom_events
- Enums: atom_state, atom_type, atom_module, atom_relation, atom_status
- Triggers: sync_genesis_stage, check_orphan_downgrade
- RPCs: morph_item, decay_item, propagate_effect, commit_item
- RLS: user isolation on all 3 tables
- Views: v_orphan_items, v_below_floor, v_inbox_stale
- Edge functions: parse-input, send-push

---

## Pages (10)

| Page | File | Description |
|------|------|-------------|
| Landing | pages/Landing.tsx | Public landing page (pre-auth) |
| Home | pages/Home.tsx | Dashboard with SoulPulse, AiSuggestions, FocusBlock |
| Inbox | pages/Inbox.tsx | Unclassified items with actions |
| Projects | pages/Projects.tsx | Project list + ProjectSheet |
| Calendar | pages/Calendar.tsx | MonthGrid + DayDetail |
| Ritual | pages/Ritual.tsx | Aurora/Zenite/Crepusculo + habits |
| Journal | pages/Journal.tsx | Date-grouped entries + tag filter |
| Analytics | pages/Analytics.tsx | Heatmap, emotional pulse, module breakdown |
| SharedContent | pages/SharedContent.tsx | Public shared reflections (no auth) |
| Auth | pages/Auth.tsx | Email/password + Google OAuth |

## Key Types (src/types/item.ts) — Schema v2

- `AtomItem` — core entity with body JSONB for extensions
- `AtomType`: 23 types | `AtomModule`: 8 modules | `AtomState`: 8 pipeline stages
- `AtomStatus`: 8 statuses | `AtomRelation`: 8 relation types
- Extensions: SoulExtension, OperationsExtension, RecurrenceExtension

## Environment Variables

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## Versionamento

| Versao | Data | Mudanca |
|--------|------|---------|
| 1.0 | Mar 2026 | Build Protocol v1 — 5 agentes |
| 2.0 | Abr 2026 | Stack, architecture, pages, components, tests documentados |
| 3.0 | 06 Abr 2026 | Reescrita completa. 4 Protocolos preservados. Praticas novas (plan mode, chunk tasks, Figma MCP, verify). Design system externalizado. Todas refs apontam pra atom-engine-core. |
