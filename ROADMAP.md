# Atom OS — Roadmap Oficial

**Versão:** 2.0
**Data:** 01 Abr 2026
**Status:** active
**Princípio:** Motor → Inteligência → Visualização → Reflexão

---

## Visão geral

O Atom OS é o produto completo: **Atom Engine** (cérebro) + **MindRoot** (corpo).
O Engine define as regras (Genesis v5). O MindRoot implementa a experiência.

Este é o roadmap único e oficial. Vive no GitHub (atom-engine-core/).
Se não está aqui, não está planejado.

---

## Pentágono — Ecossistema

| # | Projeto | Status | Descrição |
|---|---------|--------|-----------|
| V1 | **Atom OS** (Engine + MindRoot) | active | Sistema operacional pessoal. Foco atual. |
| V2 | **Constellation OS** | paused | Infraestrutura operacional. Landing page entregue. Aguarda Atom OS. |
| V3 | **Atlas Frames** | active | Negócio físico. Estruturas de aço. Monday.com. Operação independente. |
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

### Specs e design (completo ✓)

- Genesis v5.0.1 + Schema v2 (definitive)
- Marco Zero v2.0 (operacional)
- Meta-Template v1.1 (molde dos moldes)
- type-schemas.json com 23 types + helper tipado
- 11 wireframes + 74 decisões UX (D0-D74)

### MindRoot repo — branch ui-v2

- Stack: React 19 + Vite 6 + TypeScript + Supabase + Zustand + Tailwind
- Data layer existente do alpha.26 (services, engines, hooks)
- type-schemas.json + types.ts commitados

---

## Fases de implementação

### ✅ Fase 0 — Foundation (UI)
**Status:** implementada (commit a293329)
**Escopo:** Design tokens + component library base

Entregáveis:
- tokens.ts — cores (8 módulos + 7 estágios), tipografia (DM Sans), espaçamento
- GeometryIcon — 7 geometrias SVG (· — △ □ ⬠ ⬡ ○)
- TypeChip — pill com cor do módulo
- ModuleBar — indicador lateral de módulo
- StageBadge — badge com geometria + label
- ConfidenceBar — barra de confiança do triage (3 faixas)
- FAB — floating action button de captura rápida

### ✅ Fase 1 — Home (UI)
**Status:** implementada (commit d827214)
**Escopo:** Tela principal com estado do dia

Entregáveis:
- SoulCard — aurora/crepúsculo emocional
- WrapBanner — resumo do último wrap
- Home reestruturada com cards de estado

### ✅ Fase 2 — Pipeline / Triage (UI)
**Status:** implementada (commit 6543535)
**Escopo:** Visualização do pipeline e fluxo de triagem

Entregáveis:
- Funnel visual dos 7 estágios
- Triage flow (3 faixas de confiança)
- FAB integrado com captura → inbox

### ✅ Fase 3 — Wrap + FSM (UI)
**Status:** implementada (commit 8cf2204)
**Escopo:** Ritual de wrap e state machine visual

Entregáveis:
- fsm.ts — lógica de transição de estágios
- wrap.ts — estrutura JSONB do wrap
- WrapStepper — wizard de 7 passos (created → soul → audit → next)

---

### 🔵 Fase 4 — Service Layer + FSM Runtime
**Status:** próximo (spec abaixo)
**Escopo:** O sistema nervoso — conectar a UI ao Supabase
**Princípio:** Sem esta fase, a UI é casca e o banco é motor parado.

Entregáveis:
- **Supabase client service** — CRUD tipado pra items, item_connections, atom_events
- **FSM runtime** — invocar RPCs reais (morph, decay, propagate, commit) a partir da UI
- **Pipeline service** — avançar/regredir items pelos 7 estágios com validação de gates
- **Connection service** — criar/deletar edges tipadas com downgrade automático
- **Wrap service** — gerar body JSONB estruturado, INSERT como AtomItem type=wrap
- **Audit service** — queries reais contra views (orphans, below_floor, stale)
- **Real-time subscriptions** — Supabase Realtime pra atualizar a UI quando dados mudam

Critério de done:
- Um item pode ser criado, classificado, estruturado, validado, conectado, e commitado via wrap — tudo pelo MindRoot, tudo persistido no Supabase.
- Audit roda com dados reais.
- FSM impede transições inválidas.

### 🔵 Fase 5 — Auto-Triage Engine
**Status:** aguardando Fase 4

### 🟡 Fase 6 — Projects + Calendar + Raiz Onboarding
**Status:** aguardando Fase 5

### 🟡 Fase 7 — Analytics + Library + Reflexões + Settings
**Status:** aguardando Fase 6

### ⚪ Fase 8 — Export + Desacoplamento
**Status:** futuro

---

## Regras do roadmap

1. **Uma fase por vez.** Não começar a próxima sem terminar a atual.
2. **Spec antes de código.** Cada fase ganha spec completo aqui antes de ir pro Claude Code.
3. **Build from the inside out.** Motor → Inteligência → Visualização → Reflexão.
4. **Critério de done explícito.** Se não dá pra demonstrar, não tá pronto.
5. **Este documento é a referência.** Se não está aqui, não está planejado.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 31 Mar 2026 | MINDROOT-ROADMAP.md — fases 0-5 originais |
| 2.0 | 01 Abr 2026 | Roadmap unificado Atom OS. Reordenado: motor → inteligência → visualização → reflexão. Service layer e FSM runtime como Fase 4. Auto-triage como Fase 5. Export como Fase 8. Pentágono mapeado. |
