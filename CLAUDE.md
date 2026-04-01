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
