# MindRoot — Roadmap

**Versão:** 7.0
**Data:** 08 Abr 2026
**Status:** active
**Princípio:** Motor → Bocas → Galhos → Frutos. Presença sobre produtividade.

---

## Visão geral

MindRoot é o primeiro visualizador (V1) do Atom Engine — o sistema operacional pessoal construído sobre três pilares: Emotion, Action, Time. O Engine define as regras (Genesis v5.0.4, state machine, 7 estágios). O MindRoot implementa a experiência — captura, pipeline, rituais, grafo.

Repo: github.com/rsmramalho/mindroot-v2 (público, branch ui-v2)
Deploy: mindroot-v2.vercel.app / mindroot.com.au
Supabase: avvwjkzkzklloyfugzer
Specs & design: github.com/rsmramalho/atom-engine-core

---

## Pentágono

| Posição | Projeto | Status |
|---------|---------|--------|
| Centro | Atom Engine | active |
| **V1** | **MindRoot** | **active** |
| V2 | Constellation | paused |
| V3 | Lab | concept |
| V4 | Yugar Commons | concept |
| V5 | Muda | concept |
| ⬡ | Atlas Frames | active |

**← Este roadmap cobre V1 (MindRoot).**

Referência completa: Identidade v1.2 + PENTAGON.md

---

## Infraestrutura — estado atual

### Supabase (deployed ✓)

- 3 tabelas: items, item_connections, atom_events
- Triggers: sync_genesis_stage, check_orphan_downgrade
- RPCs: morph_item, decay_item, propagate_effect, commit_item
- RLS: ativo (row-level security por user_id)
- Audit views: v_orphan_items, v_below_floor, v_inbox_stale
- Edge functions: parse-input, send-push, triage-classify, connector-auth, calendar-sync, gmail-sync (6 total)
- Auth: email + Google OAuth (migration 009: provider unificado 'google')

### Specs e design (completo ✓)

- Genesis v5.0.4 + Schema v2 (definitive)
- Marco Zero v3.1 (operacional)
- Meta-Template v1.2 (molde dos moldes)
- Identidade v1.2 (nomenclatura)
- ATOM.md v1.2 (método)
- Roadmap PHI Template v3.0 (molde dos roadmaps)
- type-schemas.json com 23 types + helper tipado
- 14 feature specs + feature registry (atom-engine-core)

### Deploy (live ✓)

- Vercel: mindroot-v2.vercel.app (auto-deploy from GitHub, branch ui-v2)
- PWA: manifest + service worker + icons raster

---

## As duas espirais

O MindRoot evolui em duas espirais PHI consecutivas. Cada espiral é um ciclo completo de 7 fases Fibonacci (1-1-2-3-5-8-13). A segunda nasce da completude da primeira — entropia vira seed. De dentro pra fora, duas vezes.

**Espiral 1 — Corpo (app).** O MindRoot nasce. De scaffold a produto usável. Captura, pipeline, wraps, triage, UI completa.

**Espiral 2 — Vida (sistema operacional).** Se existe na vida digital, tem porta de entrada pro Atom. Raiz é a fundação. Conectores são a razão de existir. Propagação é a geometria se completando.

---

## Espiral 1 — Corpo (app)

**Status:** completa ○
**Princípio:** De scaffold a produto funcional. O app existe.

```
     ✅  ·  (1)  F1 — Sementes
     ✅ —   (1)  F2 — Raízes
     ✅ △   (2)  F3 — Geometria
     ✅ □   (3)  F4 — Fundação
     ✅ ⬠   (5)  F5 — Conexão
     ✅ ⬡   (8)  F6 — Inteligência
     ✅ ○   (13) F7 — Completude
```

### ✅ Fase 1 · Sementes (effort: 1)
**Status:** done
**Protocol:** foundation
**Commit:** 1e019f5
**Escopo:** Scaffold, config, types, raiz domains

Entregáveis:
- [x] type-schemas.json (23 types), types.ts (registry), raiz.ts (9 domains)
- [x] item.ts (Schema v2), engine.ts, ui.ts
- [x] Tailwind 4 @theme com Genesis v5 tokens
- [x] Path alias @/ configurado

### ✅ Fase 2 — Raízes (effort: 1)
**Status:** done
**Protocol:** logic
**Commit:** f68ee25
**Escopo:** Services, engines, Supabase connection. Zero UI.

Entregáveis:
- [x] supabase-service, item-service, triage-service, wrap-service, soul-service, ai-service
- [x] 6 engines: triage, state, connection, wrap, soul, search

### ✅ Fase 3 △ Geometria (effort: 2)
**Status:** done
**Protocol:** surface
**Commit:** 2a7bc91
**Escopo:** Atoms, tokens, shell novo, Framer Motion

Entregáveis:
- [x] Atoms: Button, Input, Badge, Card, Modal, Tag, ProgressRing
- [x] AppShell + BottomNav (5 tabs) + TopBar
- [x] Framer Motion: page transitions, stagger lists
- [x] Lazy loading por rota

### ✅ Fase 4 □ Fundação (effort: 3)
**Status:** done
**Protocol:** full
**Commit:** 5d3e4f8
**Escopo:** Pages, Auth, Onboarding Raiz

Entregáveis:
- [x] 12 páginas scaffolded
- [x] Auth page (Supabase email + Google OAuth)
- [x] Onboarding Raiz (9 domínios)
- [x] Route guards (ProtectedRoute, AuthRedirect)

### ✅ Fase 5 ⬠ Conexão (effort: 5)
**Status:** done
**Protocol:** full
**Commit:** 784ee7f
**Escopo:** Pipeline, Wrap, Triage na UI

Entregáveis:
- [x] ItemList + ItemDetail (stage indicator, advance labels)
- [x] WrapComposer (created, modified, decided, connections, seeds, soul, audit, next)
- [x] TriggerBar (captura rápida com auto-triage inline)
- [x] SoulCard + WrapBanner
- [x] Zustand stores: item-store, triage-store, wrap-store
- [x] TanStack Query: useItems, useTriage, useWrap hooks

### ✅ Fase 6 ⬡ Inteligência (effort: 8)
**Status:** done
**Protocol:** full
**Commits:** ca71d53 + d9e711a
**Escopo:** AI triage real, audit views, testes

Entregáveis:
- [x] AI triage via edge function (triage-classify com Claude Haiku)
- [x] 3 faixas de confiança na UI (auto ≥90/95%, suggest 60-89/94%, manual <60%)
- [x] Audit views deployadas no Supabase
- [x] Vitest setup + 41 testes
- [x] PWA icons raster

### ✅ Fase 7 ○ Completude (effort: 13)
**Status:** done
**Commits:** 79380bd → c8dceb4 → 070bc5e
**Escopo:** Everything needed for daily use

Entregáveis:
- [x] Dark mode: CSS var migration (226 hex → 0) + manual toggle
- [x] Search: global search page with engine + filter chips
- [x] Analytics: soul tab + connections tab
- [x] Calendar ritual bands + today's wrap indicator
- [x] Export: ATOM ENVELOPE download, Obsidian .md, JSON backup
- [x] Offline lite: enhanced SW caching + offline banner
- [x] Polish: a11y (ARIA), responsive safety, loading/error states

---

### Espiral 1 — COMPLETA ○

33 commits → 76 files → ~7.8K LOC → 41 testes → Lighthouse 100/90/100/91.
Ponto → Círculo. O app funciona. A seed da Espiral 2 nasce aqui.

---

## Espiral 2 — Vida (sistema operacional)

**Status:** em andamento (F1 ✅, F2 ◐, F3 ✅, F4 ✅, F5-F7 ⚪)
**Princípio:** Se existe no digital, tem como entrar. Raiz é a fundação. Conectores são a razão de existir.

```
     ✅  ·  (1)  F1 — Raiz
     ◐  —   (1)  F2 — Conectores
     ✅  △   (2)  F3 — Toque + alma
     ✅  □   (3)  F4 — Biblioteca + grafo
     ⚪  ⬠   (5)  F5 — Companheiro
     ⚪  ⬡   (8)  F6 — Escudo + propagação
     ⚪  ○   (13) F7 — Completude viva
```

### ✅ Fase 1 · Raiz (effort: 1)
**Status:** done
**Protocol:** foundation
**Commits:** b64511b + a53be24
**Escopo:** Mapear a vida digital inteira. 9 domínios como estrutura permanente.

A primeira pergunta que o sistema faz não é "o que você quer fazer?" — é "o que existe na sua vida?". Raiz mapeia os 9 domínios e cria o inventário base de onde tudo parte.

Entregáveis:
- [x] Raiz como page fixa no nav (sempre acessível, não só onboarding)
- [x] Primeiro acesso: gate via user_metadata — abre direto no Raiz
- [x] 3 portas de entrada: micro (3), standard (6), deep (9)
- [x] Inventário por domínio: captura com tag `#domain:[key]`
- [x] Panorama 3×3: grid dos 9 domínios com health score
- [x] Hook useRaiz: query items por domínio, calcula health
- [x] Routine Builder: question flow por módulo, mini-wrap com commit (e36c271)

### ◐ Fase 2 — Conectores (effort: 1)
**Status:** em progresso (14/19)
**Protocol:** full
**Commits:** cfc2eb2 + edc1f68 + 978b24f + e26891a
**Escopo:** Portas de entrada reais — API + filesystem. O que o Raiz mapeou agora tem caminho pra entrar.

O Raiz diz "você tem 6 emails." Os conectores fazem esses emails virarem items. Três bocas, uma esteira.

Entregáveis — Conectores API:
- [x] Gmail → Atom: emails starred viram items no inbox (edge fn + sync button)
- [x] Gmail: contatos extraídos como tags `#who:*`
- [x] Google Calendar → Atom: OAuth conectado, refresh token salvo
- [x] Calendar: sync end-to-end (edge fn deployed, timezone corrigido)
- [x] Painel de conectores: status por integração
- [x] Pipeline de ingestão: conector → inbox → Genesis pipeline
- [x] connector-service.ts + useConnectors hook
- [x] Edge functions bulletproof: connector-auth, calendar-sync, gmail-sync

Entregáveis — Agent Local (Atom Agent):
- [x] Atom Agent v0.1: Python CLI — scan, classify, rename, move (17 files, 678 LOC)
- [x] Scanner: SHA-256 hash, dedup, metadata
- [x] Classifier: regras por nome + extensão + confidence bands
- [x] Namer: naming convention Genesis §8.4
- [x] CLI: `atom-agent scan <path>` com aprovação humana
- [ ] body.location extension (service, path, hash, mime, size)
- [ ] AtomDrive: estrutura local espelhando módulos Genesis
- [ ] Agent: `atom-agent watch <path>` — daemon mode (v0.2)
- [ ] Agent: Haiku fallback pra classificação ambígua (v0.2)

Notas: Código F2 perdido no revert (HEAD cf4bc37). Spec completa existe no chat. Migration 008 (user_connectors) provavelmente ainda existe no Supabase. Decisão: reconstruir limpo via build protocol. Atom Agent é repo separado (`rsmramalho/atom-agent`).

### ✅ Fase 3 △ Toque + alma (effort: 2)
**Status:** done (19/19)
**Protocol:** surface + logic
**Commits:** 589c72e + c6ac59a + 51345e1 + 970ed01
**Escopo:** UI usável sob carga real + soul loop fechado + triage IA.

A Espiral 1 construiu a interface. F3 torna ela funcional — items vindos de conectores, inventário do Raiz, captura manual. O soul loop fecha o ciclo presença.

Entregáveis — Toque:
- [x] Item Detail: edição inline + borda módulo + avançar estágio
- [x] Pipeline: tap num estágio expande lista
- [x] Bottom Nav: SVG icons, 48px touch, badge inbox
- [x] Home: seção items ativos + HealthBar
- [x] Projects: criar projeto + cards com progress

Entregáveis — Alma:
- [x] Soul loop aurora: AuroraCheckin (emotion + energy + intention)
- [x] Soul loop task: após milestone, "como foi?" → emotion_after
- [x] Soul loop crepúsculo: wrap SoulStep com shift calculado
- [x] Wrap display: seção SOUL renderizada

Entregáveis — Triage real:
- [x] Edge function triage-classify (Claude Haiku, 135 LOC)
- [x] 3 faixas + threshold diferenciado + fallback
- [x] Triage automático via usePipeline
- [x] ItemDetail: chips clicáveis (type, module, status). Morph RPC em stage 3+

### ✅ Fase 4 □ Biblioteca + grafo (effort: 3)
**Status:** done (9/9)
**Protocol:** full
**Commits:** 51345e1 + db6d214
**Escopo:** Library, connections UI, graph visualization. Estágio 5 (Pentágono) ganha corpo na interface.

Entregáveis:
- [x] Library page: tabs + domain filter Raiz + search
- [x] Library cards: título + type chip + preview + módulo cor
- [x] ConnectionsSection: adicionar/remover connections tipadas (8 relations)
- [x] FSM: connection avança item pro estágio 5 automaticamente
- [x] Prompt de conexão no estágio 4: "isso se conecta com algo?"
- [x] Graph view: D3 force layout com nós por módulo + edges por relation
- [x] Graph: filtro por domínio Raiz + module filter
- [x] Search: filtros avançados por module, type, status, domain, tags

### ⚪ Fase 5 ⬠ Companheiro (effort: 5)
**Status:** futuro (UI oculta, código preservado)
**Protocol:** full
**Escopo:** AI companion dentro do MindRoot. O sistema deixa de ser passivo.

O companion sabe o que existe (Raiz), o que entrou (conectores), o que foi classificado (triage), e o que está conectado (grafo). Não é chatbot genérico — é o sistema pensando.

Entregáveis:
- [ ] Companion page/panel: interface de conversa
- [ ] Companion contextual: sabe estado do sistema (inbox, stale, soul patterns, domain health)
- [ ] Nudges: sugere ações baseadas em padrões
- [ ] Captura por voz: Web Speech API → texto → inbox → triage
- [ ] Companion no wrap: propõe wrap baseado no dia
- [ ] Companion no aurora: puxa estado + último wrap + domain health
- [ ] Sugere connections: "esse item parece se conectar com [X]"

### ⚪ Fase 6 ⬡ Escudo + propagação (effort: 8)
**Status:** futuro
**Protocol:** full
**Escopo:** Ações nos conectores (write scope) + estágio 6 do Genesis ganha mecânica real.

O sistema passa de leitor a agente. E a cascata de eventos entre items conectados — a propagação — se materializa.

Entregáveis:
- [ ] Ações Gmail: enviar email, responder, arquivar — de dentro do MindRoot
- [ ] Ações Calendar: criar evento, mover, blocos rituais recorrentes (scope write)
- [ ] Ações Agent: mover arquivos, renomear, organizar AtomDrive
- [ ] Propagação real: completar task atualiza projeto. Projeto muda status → items dependentes notificados
- [ ] atom_events como fila de cascata: event_type → handler → efeito no target
- [ ] Stage 6 automático: item que gera efeito cascata avança pra `propagated`
- [ ] Corp Shield: rate limiting, confirmação antes de ações destrutivas

### ⚪ Fase 7 ○ Completude viva (effort: 13)
**Status:** futuro
**Protocol:** full
**Escopo:** O sistema funciona como organismo. Offline real. Local-first. Dados fluindo sem intervenção.

Entregáveis:
- [ ] PWA offline completo: IndexedDB sync engine, conflict resolution
- [ ] Ollama local como fallback do Claude (triage offline)
- [ ] Atom Agent v2: watch mode, daemon diário, Google Drive scan, Photos migration
- [ ] Analytics avançado: padrões emocionais cross-module, domain health trends
- [ ] Onboarding universal: qualquer pessoa instala e usa sem conhecer o Atom
- [ ] Performance: bundle < 60KB gzip, < 1s first meaningful paint
- [ ] Documentação user-facing: como usar, por que existe, princípios

---

## Seeds — Espiral 3

Nascem da completude da Espiral 2. Não detalhadas até lá.

- **Constellation:** V2 herda pilares + engine. Diagnóstico pra PMEs.
- **Multi-user:** Atom serve mais de uma pessoa. Sharing, permissões, família.
- **Marketplace de connectors:** Terceiros criam conectores pro Atom Engine.
- **Graph intelligence:** O grafo sugere connections, detecta padrões, identifica clusters.

---

## Dependências

| Este projeto precisa de | Projeto | Status |
|------------------------|---------|--------|
| Nenhuma | — | — |

| Outros projetos dependem deste | Para quê |
|-------------------------------|----------|
| V2 Constellation OS | Patterns de UI, service layer, auth |
| V4 Muda | Prova de que Human Systems funciona |
| V5 Yugar Commons | Dados, reflexões, padrões de longo prazo |

**Atom não depende de ninguém. Todos dependem dele.**

---

## Métricas atuais

| Métrica | Valor |
|---------|-------|
| Commits | 80 |
| Files | 109 (.ts/.tsx) |
| LOC | ~12,200 |
| Pages | 14 |
| Components | 26 |
| Services | 11 |
| Engines | 6 |
| Stores | 4 |
| Hooks | 13 |
| Tests | 14 files (vitest) |
| Bundle (gzip) | ~83KB main |
| Edge functions | 6 |
| Migrations | 9 |

---

## Regras do roadmap

1. **Uma fase por vez.** Não começar a próxima sem terminar a atual.
2. **De dentro pra fora.** Protocol declara. Build Protocol executa.
3. **Mexeu aqui → cross-check no PENTAGON.md.** Mesma commit.
4. **Este documento é a referência.** Se não está aqui, não está planejado.
5. **Spec antes de código.** Cada fase ganha spec antes de ir pro Claude Code.
6. **Wireframe é lei.** Toda página segue o wireframe antes de inventar.
7. **7 fases por espiral.** Geometria completa ou não é espiral.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 31 Mar 2026 | Documento inicial — fases 0-5 |
| 2.0 | 01 Abr 2026 | Roadmap unificado. Motor → inteligência → visualização → reflexão. |
| 3.0 | 02 Abr 2026 | Fases PHI (espiral Fibonacci). Rebuild mindroot-v2. Espiral 1 F1-F7. |
| 4.0 | 02 Abr 2026 | Duas espirais: Corpo + Mente. Pentágono. Formato PHI template. |
| 5.0 | 03 Abr 2026 | Espiral 2 detalhada: 5 fases. Seeds listadas. |
| 6.0 | 03 Abr 2026 | Espiral 2 redesenhada: Raiz F1, Conectores F2. |
| 7.0 | 08 Abr 2026 | Reescrita PHI v3.0: Espiral 2 completa com 7 fases (F6 Escudo+propagação, F7 Completude viva). Seeds viram Espiral 3. Versionamento limpo. Nomenclatura Identidade v1.2. |

---

*MindRoot. Duas espirais. A primeira dá corpo. A segunda conecta à vida. De dentro pra fora, duas vezes.*
