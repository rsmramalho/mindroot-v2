# Atom HS — Roadmap

**Versão:** 4.1
**Data:** 02 Abr 2026
**Status:** active
**Princípio:** Motor → Inteligência → Visualização → Reflexão. Presença sobre produtividade.

---

## Visão geral

Atom HS (Human Systems) é o sistema operacional pessoal do Rick. Engine (cérebro) + MindRoot (corpo) = um produto. O Engine define as regras — Genesis v5, state machine, 7 estágios, FSM, auto-triage, wraps. O MindRoot implementa a experiência — captura, pipeline, visualização, rituais.

"Human Systems" porque o sistema organiza a vida de um humano, não de uma máquina. OS é emprestado da computação. HS é genuíno.

Repo: github.com/rsmramalho/mindroot-v2 (público)
Deploy: mindroot-v2.vercel.app
Supabase: avvwjkzkzklloyfugzer
Specs & design: github.com/rsmramalho/atom-engine-core

---

## Pentágono

| Vértice | Projeto | Status | Descrição |
|---------|---------|--------|-----------|
| **V1** (centro) | **Atom HS** | **active** | **Hub. Sistema humano pessoal. Foco atual.** |
| V2 | Constellation OS | paused | Infraestrutura operacional. Aguarda Atom HS. |
| V3 | Atlas Frames | active | Negócio físico. Monday.com. Operação independente. |
| V4 | Muda | concept | Comunidade. Nasce do Atom HS quando maduro. |
| V5 | Yugar Commons | concept | Mt Samson. Visão de longo prazo. |
| V6 | Atlas/Yugar Lab | concept | Playground. Experimentação, novos produtos, serviços. |

**← Este roadmap cobre V1 (centro).**

---

## As duas espirais

O Atom HS evolui em duas espirais PHI consecutivas:

**Espiral 1 — Corpo (app)**
O MindRoot nasce. De scaffold a produto usável. Captura, pipeline, wraps, triage, UI completa. Quando F7 fecha, o app funciona sozinho no dia a dia.

**Espiral 2 — Mente (organismo)**
O Atom HS ganha vida própria. IA local, feeds curados, email ingestion, captura por voz, Corp Shield. O sistema deixa de ser app e vira organismo que pensa, captura e organiza sem intervenção.

Cada espiral é um ciclo PHI completo (7 fases, Fibonacci 1-1-2-3-5-8-13). A segunda espiral nasce da completude da primeira — entropia vira seed. De dentro pra fora, duas vezes.

---

## Infraestrutura — estado atual

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
- Roadmap PHI Template v1.0 (molde dos roadmaps)
- type-schemas.json com 23 types + helper tipado
- 11 wireframes + 74 decisões UX (D0-D74)

### Deploy (live ✓)

- Vercel: mindroot-v2.vercel.app (auto-deploy from GitHub)
- PWA: manifest + service worker + icons raster

---

## Espiral 1 — Corpo (Fibonacci: 1-1-2-3-5-8-13)

```
         ·  (1)  Sementes — config, types, raiz
        —   (1)  Raízes — services, engines, Supabase
       △    (2)  Geometria — atoms, tokens, shell
      □     (3)  Fundação — pages, auth, onboarding
     ⬠      (5)  Conexão — pipeline, wrap, triage UI
    ⬡       (8)  Inteligência — AI triage, audit, testes
   ○        (13) Completude — export, dark mode, polish
```

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
- supabase-service (client singleton + auth helpers)
- item-service (CRUD + state transitions + validation)
- triage-service (classify + batch + confidence thresholds)
- wrap-service (compose + commit + soul + audit)
- soul-service (check-in + energy tracking)
- ai-service (Haiku integration + prompt templates)
- 6 engines: triage-engine, state-engine, connection-engine, wrap-engine, soul-engine, search-engine

### ✅ Fase 3 △ Geometria (effort: 2)
**Commit:** 2a7bc91
**Escopo:** Atoms, tokens, shell novo, Framer Motion

Entregáveis:
- Atoms: Button, Input, Badge, Card, Modal, Tag, ProgressRing
- tokens.ts com cores Genesis v5 (module colors, stage colors)
- AppShell + BottomNav (5 tabs) + TopBar (context-aware)
- Framer Motion: page transitions, stagger lists, orbe pulsante
- Lazy loading por rota

### ✅ Fase 4 □ Fundação (effort: 3)
**Commit:** 5d3e4f8
**Escopo:** Pages, Auth, Onboarding Raiz

Entregáveis:
- 12 páginas scaffolded (Home, Pipeline, Wrap, Projects, Triage, Calendar, Analytics, Library, Reflexões, Settings, AI Companion, Raiz)
- Auth page (Supabase email + Google OAuth)
- Onboarding Raiz (9 domínios: identidade, documentos, saúde, finanças, armazenamento, memórias, tempo, comunicação, projetos)
- Route guards (ProtectedRoute, AuthRedirect)

### ✅ Fase 5 ⬠ Conexão (effort: 5)
**Commit:** 784ee7f
**Escopo:** Pipeline, Wrap, Triage na UI

Entregáveis:
- ItemList (filtros por state, type, module) + ItemDetail (com stage indicator)
- WrapComposer (created, modified, decided, connections, seeds, soul, audit, next)
- TriggerBar (captura rápida com auto-triage inline)
- SoulCard (aurora/crepúsculo com energy + emotion)
- WrapBanner (último wrap no dashboard)
- Zustand stores: item-store, triage-store, wrap-store
- TanStack Query: useItems, useTriage, useWrap hooks

### ✅ Fase 6 ⬡ Inteligência (effort: 8)
**Commit:** ca71d53 (triage) + d9e711a (audit views)
**Escopo:** AI triage real, audit views, testes, polish técnico

Entregáveis:
- AI triage via edge function (triage-classify com Claude Haiku)
- 3 faixas de confiança na UI (auto ≥90/95%, suggest 60-89/94%, manual <60%)
- Audit views deployadas no Supabase (v_below_floor, v_orphan_items, v_inbox_stale)
- Auth.tsx refactor (usa auth-service em vez de Supabase direto)
- Onboarding fix (domain→module mapping correto)
- PWA icons raster (192x192, 512x512)
- Vitest setup + 41 testes dos fluxos críticos
- Export stub (botão presente, funcionalidade na F7)

**Debt:** 136 hex hardcoded em 27 files → dark mode blocker

### ✅ Fase 7 ○ Completude (effort: 13)
**Commits:** 79380bd (dark mode) → c8dceb4 (search, analytics) → 070bc5e (export, toggle) → this commit (offline, polish)
**Escopo:** Everything needed for daily use

Entregáveis:
- Dark mode: CSS var migration (226 hex → 0) + manual toggle (system/light/dark)
- Search: global search page with engine + filter chips (prefix syntax)
- Analytics soul tab: energy trends (14d), emotion frequency, shift history
- Analytics connections tab: stats, most connected items, relation breakdown
- Calendar ritual bands: real ritual slot grouping + today's wrap indicator
- Export: ATOM ENVELOPE download (.txt), Obsidian .md download (YAML + wikilinks), JSON backup
- Offline lite: enhanced SW caching (cache-first assets, network-first HTML) + offline banner
- Polish: a11y (ARIA roles on tabs, aria-current on nav), responsive safety, loading/error states

---

### Espiral 1 — Corpo — COMPLETA ○

F1 Sementes → F2 Raízes → F3 Geometria → F4 Fundação → F5 Conexão → F6 Inteligência → F7 Completude.
De dentro pra fora. Ponto → Círculo. O app funciona.

A seed da Espiral 2 nasce aqui.

---

## Espiral 2 — Mente (planejada, não iniciada)

A segunda espiral transforma o Atom HS de app em organismo. Nasce da completude da Espiral 1.

**Escopo macro (a ser detalhado em fases PHI quando Espiral 1 fechar):**
- Abstração de IA (interface AtomAI: Claude + Ollama, fallback automático)
- IA local (Mac Mini M4, Ollama, modelos open-source)
- Email ingestion (Gmail → IA → classify → Supabase)
- Library Feed (RSS, TMDB, curadoria sem algoritmo de engajamento)
- Captura por voz (Whisper local)
- Corp Shield (filosofia de escudo descartável documentada e operacional)
- Soberania de atenção (feed finito, protegido, curado)

**Origem:** decomposição do Yugar Vision Doc (system_spec_yugar-vision_v0-1.md no atom-engine-core). Features que são do Engine/MindRoot, não do espaço físico.

**Não detalhar agora.** As fases PHI da Espiral 2 nascem quando a Espiral 1 fechar — com inventário real, dependências reais, métricas reais.

---

## Dependências

| Este projeto precisa de | Projeto | Status |
|------------------------|---------|--------|
| Nenhuma | — | — |

| Outros projetos dependem de | Para quê |
|-----------------------------|----------|
| V2 Constellation OS | Patterns de UI, service layer, auth |
| V4 Muda | Prova de que Human Systems funciona |
| V5 Yugar Commons | Dados, reflexões, padrões de longo prazo |
| V6 Atlas/Yugar Lab | Sistema pra organizar experimentos |

**Atom HS não depende de ninguém. Todos dependem dele.**

---

## Métricas atuais

| Métrica | Valor |
|---------|-------|
| Commits | 30 |
| Files | 76 (.ts/.tsx) |
| LOC | ~7,800 |
| Pages | 13 |
| Components | 23 |
| Services | 9 |
| Engines | 6 |
| Stores | 3 |
| Hooks | 9 |
| Tests | 41 (vitest) |
| Bundle (gzip) | ~71KB main |
| TS errors | 0 |

---

## Regras do roadmap

1. **Uma fase por vez.** Não começar a próxima sem terminar a atual.
2. **De dentro pra fora.** Cada camada contém todas as anteriores.
3. **Mexeu aqui → cross-check no master.** PENTAGON.md reflete toda mudança.
4. **Este documento é a referência.** Se não está aqui, não está planejado.
5. **Spec antes de código.** Cada fase ganha spec antes de ir pro Claude Code.
6. **Wireframe é lei.** Toda página segue o wireframe antes de inventar.
7. **Espiral 2 não começa antes da Espiral 1 fechar.**

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 31 Mar 2026 | MINDROOT-ROADMAP.md — fases 0-5 originais |
| 2.0 | 01 Abr 2026 | Roadmap unificado Atom OS. Reordenado: motor → inteligência → visualização → reflexão. |
| 3.0 | 02 Abr 2026 | Fases PHI (espiral Fibonacci). Rebuild do zero (mindroot-v2). Fases 1-5 DONE. Deploy live. |
| 3.1 | 02 Abr 2026 | F6 Inteligência DONE. Métricas atualizadas. Dark mode debt documentado. |
| 4.0 | 02 Abr 2026 | Atom OS → Atom HS (Human Systems). V1 no centro do Pentágono. V6 Lab adicionado. Formato PHI template. Cross-check com PENTAGON.md. |
| 4.1 | 02 Abr 2026 | Duas espirais: Corpo (app, F1-F7) + Mente (organismo, planejada). Yugar Vision Doc decomposto — features de Engine/MindRoot mapeadas pra Espiral 2. F7 mantém escopo limpo. |
| 4.2 | 03 Abr 2026 | F7 Completude DONE. Espiral 1 completa. Dark mode toggle, search, analytics soul/connections, export download, calendar ritual bands, offline lite, polish. 30 commits, 76 files, ~7.8K LOC. |

---

*Human Systems. Duas espirais. A primeira dá corpo. A segunda dá mente. De dentro pra fora, duas vezes.*
