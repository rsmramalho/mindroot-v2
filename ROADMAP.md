# Atom HS — Roadmap

**Versão:** 5.0
**Data:** 03 Abr 2026
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

## Espiral 2 — Mente / organismo

**Status:** futuro
**Princípio:** De ferramenta estática a organismo vivo. Core loop: usar → sentir → organizar → ver → conversar.

```
         ·  (1)  F1 — Toque + alma
        —   (1)  F2 — Raiz
       △    (2)  F3 — Triage real
      □     (3)  F4 — Biblioteca + grafo
     ⬠      (5)  F5 — Companheiro
```

### ⚪ Fase 1 · Toque + alma (effort: 1)
**Status:** futuro
**Protocol:** surface
**Escopo:** Tornar o app usável no dia a dia E o soul loop real — não um, os dois.

Entregáveis:
- [ ] Item Detail: edição inline (título, notes, tags) + chips clicáveis (type, module, status)
- [ ] Item Detail: botão avançar estágio (classificar → estruturar → validar → conectar → commitar)
- [ ] Item Detail: borda de módulo com cor
- [ ] Pipeline: tap num estágio expande lista de items com cards clicáveis
- [ ] Bottom Nav: redesign — ícones maiores, área de toque 44px+, badge inbox
- [ ] Projects: botão "+ projeto" na page, cards com progress
- [ ] Home: seção "ativos" entre captura e inbox (status=active, stage≥3, max 3)
- [ ] Home: audit health bar (verde/amarelo/vermelho baseado em inbox count + orphans)
- [ ] Soul loop aurora: app pergunta "como você tá chegando hoje?" no primeiro acesso do dia
- [ ] Soul loop aurora: registra emotion_before + energy + intention no wrap store
- [ ] Soul loop task: após milestone/entrega, pergunta "como foi?" — registra emotion_after
- [ ] Soul loop crepúsculo: wrap pergunta "como você tá saindo?" — registra shift aurora→crepúsculo
- [ ] Wrap stepper: step 1 (soul) funcionando end-to-end com dados reais
- [ ] Wrap display: seção SOUL renderizada com shift visível

Notas: Soul loop segue regras do Marco Zero seção 5 — nunca forçar, linguagem livre, só em tasks peso > 1. Se Rick diz "bora trabalhar" sem emoção, ok. O sistema oferece, não insiste.

### ⚪ Fase 2 — Raiz (effort: 1)
**Status:** futuro
**Protocol:** full
**Escopo:** 9 domínios de vida como experiência unificada — porta de entrada e ferramenta permanente.

Entregáveis:
- [ ] Raiz como page no nav (sempre acessível, não só onboarding)
- [ ] Primeiro acesso: gate via user_metadata — abre direto no Raiz
- [ ] 3 portas de entrada: micro (3 domínios), standard (6), deep (9)
- [ ] Inventário por domínio: captura de items com tag #domain:[key]
- [ ] Panorama 3×3: grid dos 9 domínios com status (ok/stale/empty)
- [ ] Tom gentil: "depois, talvez" em todo canto — pular é tão fácil quanto preencher
- [ ] Dia 1: tudo vazio, gentil. Dia 100: domínios preenchidos, stale alerts, vida mapeada
- [ ] Hook useRaiz: query items por domínio, calcula health (count, oldest, status)
- [ ] Retornantes: Raiz mostra estado real dos domínios, não repete onboarding

Notas: Wireframes existem em docs/wireframes/ (telas 10 e 11). A decisão é: experiência unificada, não "onboarding que convida pro Raiz". Raiz É o onboarding. E depois fica.

### ⚪ Fase 3 △ Triage real (effort: 2)
**Status:** futuro
**Protocol:** logic
**Escopo:** Substituir classificação hardcoded por AI real com confidence bands.

Entregáveis:
- [ ] Edge function Supabase com Claude Haiku para auto-triage
- [ ] 3 faixas de confiança: auto (≥90/95%), sugere (60-89/94%), manual (<60%)
- [ ] Threshold diferenciado: 95% para tipos acionáveis (task, project, spec, habit), 90% para passivos
- [ ] UI triage: auto-classificados mostram ✓ + confidence, sugestões mostram confirm/change, manual mostra "aguardando"
- [ ] Fallback: se edge function falha, item fica no inbox com flag — nunca classificação errada silenciosa
- [ ] Triage roda automaticamente ao capturar item via AtomInput

Notas: Genesis v5 Parte 3.1 define as regras. session_log (SQL) vs session-log (TS) — conversão automática na serialização. A UI do triage já existe — esta fase é backend.

### ⚪ Fase 4 □ Biblioteca + grafo (effort: 3)
**Status:** futuro
**Protocol:** full
**Escopo:** Library page, connections UI, e graph visualization. Genesis estágio 5 (Pentágono) ganha corpo na interface.

Entregáveis:
- [ ] Library page: tabs (Todos, Reflexões, Recomendações, Conteúdo), filter chips por type
- [ ] Library cards: título + type chip + preview notes + data + módulo cor
- [ ] Item Detail: seção connections — adicionar/remover connections tipadas (8 AtomRelations)
- [ ] Item Detail: ao adicionar connection, item avança pro estágio 5 automaticamente
- [ ] Prompt de conexão: no estágio 4, "isso se conecta com algo?" (Genesis Parte 2, portão 4)
- [ ] Graph view: visualização de nós e edges (pode ser página separada ou modal)
- [ ] Graph: nós coloridos por módulo, edges rotuladas por relation
- [ ] Search: filtros por module, type, status, tags — chips clicáveis

Notas: Wireframe Library existe (mindroot-wireframe-library-reflexoes.html). Graph pode usar D3 force layout ou similar. Connections usam tabela item_connections no Supabase (já deployed via migration 007).

### ⚪ Fase 5 ⬠ Companheiro (effort: 5)
**Status:** futuro
**Protocol:** full
**Escopo:** AI companion dentro do MindRoot. Captura por voz. Nudges contextuais. O app deixa de ser passivo.

Entregáveis:
- [ ] Companion page/panel: interface de conversa dentro do MindRoot
- [ ] Companion contextual: sabe o estado do sistema (inbox count, stale items, soul patterns)
- [ ] Nudges: sugere ações baseadas em padrões (ex: "3 dias sem wrap", "inbox crescendo", "soul shift negativo recorrente")
- [ ] Captura por voz: Web Speech API → texto → item no inbox
- [ ] Companion no wrap: propõe wrap baseado nos items criados/modificados do dia
- [ ] Companion no aurora: puxa estado + último wrap, oferece contexto sem que Rick peça
- [ ] Integração com triage: companion pode classificar items via conversa

Notas: Wireframe tela 10 (mindroot-wireframe-ai-companion.html). O companion é o Claude operando dentro do MindRoot — não é chatbot genérico. Tem o Genesis como contrato, o Marco Zero como contexto, e os dados do usuário como memória.

---

## Seeds — Espiral 3

Nascem da completude da Espiral 2. Não detalhadas até lá.

- **Escudo:** Corp Shield + email ingestion + Gmail integration. Email → item no inbox automaticamente.
- **Resiliência:** PWA offline completo + Ollama local como fallback do Claude + sync engine.
- **Propagação:** Estágio 6 do Genesis ganha mecânica real — cascata de eventos entre items conectados.

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
| 5.0 | 03 Abr 2026 | Espiral 2 detalhada: 5 fases PHI (Toque+alma, Raiz, Triage real, Biblioteca+grafo, Companheiro). Seeds da Espiral 3 listadas. Protocol tag em cada fase. |

---

*Human Systems. Duas espirais. A primeira dá corpo. A segunda dá mente. De dentro pra fora, duas vezes.*
