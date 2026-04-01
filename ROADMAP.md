# Atom OS — Roadmap Oficial

**Versão:** 3.0
**Data:** 02 Abr 2026
**Status:** active
**Princípio:** Motor → Inteligência → Visualização → Reflexão

---

## Visão geral

O Atom OS é o produto completo: **Atom Engine** (cérebro) + **MindRoot** (corpo).
O Engine define as regras (Genesis v5). O MindRoot implementa a experiência.

Repo único: `mindroot-v2` (github.com/rsmramalho/mindroot-v2)
Deploy: mindroot-v2.vercel.app
Supabase: avvwjkzkzklloyfugzer

---

## Pentágono — Ecossistema

| # | Projeto | Status | Descrição |
|---|---------|--------|-----------|
| V1 | **Atom OS** (Engine + MindRoot) | active | Sistema operacional pessoal. Foco atual. |
| V2 | **Constellation OS** | paused | Infraestrutura operacional. Aguarda Atom OS. |
| V3 | **Atlas Frames** | active | Negócio físico. Monday.com. Operação independente. |
| V4 | **Muda** | concept | Comunidade. Nasce do Atom OS quando maduro. |
| V5 | **Yugar Commons** | concept | Mt Samson. Visão de longo prazo. |

**Regra:** MindRoot primeiro. O resto nasce dele.

---

## Infraestrutura — Estado atual

### Supabase (deployed ✓)

- 3 tabelas: items, item_connections, atom_events
- Triggers: sync_genesis_stage, check_orphan_downgrade
- RPCs: morph_item, decay_item, propagate_effect, commit_item
- RLS: ativo (row-level security por user_id)
- Audit views: v_orphan_items, v_below_floor, v_inbox_stale
- Edge functions: parse-input, send-push, triage-classify
- Auth: email + Google OAuth

### Specs e design (completo ✓)

- Genesis v5.0.1 + Schema v2 (definitive)
- Marco Zero v2.0 (operacional)
- Meta-Template v1.1 (molde dos moldes)
- type-schemas.json com 23 types + helper tipado
- 11 wireframes + 74 decisões UX (D0-D74)

### Deploy

- Vercel: mindroot-v2.vercel.app (auto-deploy from GitHub)
- PWA: manifest + service worker (falta icons raster)

---

## Fases PHI (espiral Fibonacci: 1-1-2-3-5-8-13)

### ✅ Fase 1 · Sementes (effort: 1)
**Commit:** 1e019f5
**Escopo:** Scaffold, config, types, raiz domains

Entregáveis:
- type-schemas.json (23 types), types.ts (registry), raiz.ts (9 domains)
- item.ts (Schema v2), engine.ts, ui.ts
- Tailwind 4 @theme com Genesis v5 tokens (light-first #FDFCF9, DM Sans)
- Path alias @/ configurado

### ✅ Fase 2 — Raízes (effort: 1)
**Commit:** f68ee25
**Escopo:** Services, engines, Supabase connection. Zero UI.

Entregáveis:
- 7 services: supabase, item-service, auth-service, fsm-service, pipeline-service, wrap-service, audit-service
- 6 engines: fsm, wrap, parsing, recurrence, soul, search
- 6 migrations (001-006)
- 3 edge functions (parse-input, send-push, triage-classify)

### ✅ Fase 3 △ Geometria (effort: 2)
**Commit:** 16f4149
**Escopo:** Atoms, shell, stores, hooks

Entregáveis:
- 7 atoms: GeometryIcon, TypeChip, StageBadge, ModuleBar, ConfidenceBar, FAB, tokens
- App shell: router, layout, BottomNav, auth guard
- 3 stores: app-store, wrap-store, toast-store
- 7 hooks: useAuth, useItems, useItemMutations, usePipeline, useRealtime, useWrap, useProject

### ✅ Fase 4 □ Fundação (effort: 3)
**Commits:** 775f8cc → cf886ab → dc48982 → 950c2e8
**Escopo:** Todas as páginas construídas dos wireframes

Entregáveis (10 páginas):
- Landing, Auth, Onboarding (Raiz 4-step)
- Home (SoulCard, WrapBanner, AtomInput, ItemCards, InboxPreview, AuditBar)
- Pipeline/Triage (funnel, stage rows, swipe cards)
- Wrap (7-step stepper)
- Projects (list + detail)
- Calendar (week strip + ritual blocks)
- Analytics (pipeline/soul/connections tabs)
- Library (search + filter + cards)
- Settings (profile, rituals, modules)
- Raiz Dashboard (health ring, 9 domains)
- AI Companion (bottom sheet, contextual chat)
- Lazy loading (44% bundle reduction)
- PWA (manifest, service worker, standalone)
- Vercel deploy config

### ✅ Fase 5 ⬠ Polish (effort: 5)
**Commits:** 1407d37 → 756edc3 → 0e69af8
**Escopo:** Visual consistency, animations, states

Entregáveis:
- Framer Motion: page transitions, item stagger, funnel bars, health ring, FAB bounce, WrapBanner slide
- Empty states com geometria Genesis em Home, Analytics, Projects
- Loading skeletons: SoulCard, Card, List, Ring, Chart
- Error banner component
- Micro-interações: inbox badge, active page dot, period-aware placeholder
- bg-card token (dark mode prep)
- Deploy live + auth configurado

### 🔵 Fase 6 ⬡ Inteligência (effort: 8) — PRÓXIMO
**Status:** próximo
**Escopo:** AI triage + audit views reais + testes

Entregáveis pendentes:
- AI triage integration (edge function triage-classify com Claude Haiku)
- Triage na UI com 3 faixas de confiança (auto/suggest/manual)
- Fix onboarding domain→module mapping
- Deploy audit views no Supabase (v_below_floor, v_orphan_items, v_inbox_stale)
- Verificar commit_item RPC deployed
- PWA icons raster (192x192, 512x512)
- Vitest setup + testes dos fluxos críticos
- Auth.tsx refactor (usar auth-service em vez de Supabase direto)

### ⚪ Fase 7 ○ Completude (effort: 13)
**Status:** futuro
**Escopo:** Export, dark mode, refinements, desacoplamento

Entregáveis planejados:
- Export to Drive (botão manual)
- Obsidian vault generation
- Dark mode toggle
- Analytics soul + connections tabs (real data)
- Search global
- Notifications
- Offline mode (service worker cache)

---

## Métricas atuais

| Métrica | Valor |
|---------|-------|
| Commits | 13 |
| Files | 63 .ts/.tsx |
| LOC | 6,200 |
| Pages | 10 |
| Components | 16 |
| Services | 7 |
| Engines | 6 |
| Stores | 3 |
| Hooks | 7 |
| Bundle (gzip) | 71KB main |
| Build time | 224ms (Vercel) |
| TS errors | 0 |

---

## Regras do roadmap

1. **Uma fase por vez.** Não começar a próxima sem terminar a atual.
2. **Spec antes de código.** Cada fase ganha spec antes de ir pro Claude Code.
3. **Build from the inside out.** Motor → Inteligência → Visualização → Reflexão.
4. **Critério de done explícito.** Se não dá pra demonstrar, não tá pronto.
5. **Este documento é a referência.** Se não está aqui, não está planejado.
6. **Wireframe é lei.** Toda página segue o wireframe antes de inventar.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 31 Mar 2026 | MINDROOT-ROADMAP.md — fases 0-5 originais |
| 2.0 | 01 Abr 2026 | Roadmap unificado Atom OS. Reordenado: motor → inteligência → visualização → reflexão. |
| 3.0 | 02 Abr 2026 | Fases PHI (espiral Fibonacci). Rebuild do zero (mindroot-v2). Fases 1-5 DONE. Deploy live. Métricas reais. |
