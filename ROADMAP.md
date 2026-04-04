# Atom — Roadmap

**Versão:** 6.5
**Data:** 05 Abr 2026
**Status:** active
**Princípio:** Motor → Inteligência → Visualização → Reflexão. Presença sobre produtividade.

---

## Visão geral

Atom (Human Systems) é o sistema operacional pessoal do Rick. Engine (cérebro) + MindRoot (corpo) = um produto. O Engine define as regras — Genesis v5, state machine, 7 estágios, FSM, auto-triage, wraps. O MindRoot implementa a experiência — captura, pipeline, visualização, rituais.

"Human Systems" porque o sistema organiza a vida de um humano, não de uma máquina. OS é emprestado da computação. HS é genuíno.

Repo: github.com/rsmramalho/mindroot-v2 (público)
Deploy: mindroot-v2.vercel.app
Supabase: avvwjkzkzklloyfugzer
Specs & design: github.com/rsmramalho/atom-engine-core

---

## Pentágono

| Posicao | Projeto | Apelido | Status |
|---------|---------|---------|--------|
| Centro | Atom Engine | — | active |
| **V1** | **MindRoot** | **O Espelho** | **active** |
| V2 | Constellation | O Telescopio | paused |
| V3 | Lab | O Laboratorio | concept |
| V4 | Yugar Commons | A Raiz | concept |
| V5 | Muda | A Arvore | concept |
| ⬡ | Atlas Frames | A Bigorna (hexagono) | active |

**← Este roadmap cobre V1 (MindRoot).**

---

## As duas espirais

O Atom evolui em duas espirais PHI consecutivas:

**Espiral 1 — Corpo (app)**
O MindRoot nasce. De scaffold a produto usável. Captura, pipeline, wraps, triage, UI completa. Quando F7 fecha, o app funciona sozinho no dia a dia.

**Espiral 2 — Vida (sistema operacional)**
Se existe na vida digital do Rick, tem uma porta de entrada pro Atom. Emails, calendário, arquivos, fotos, contatos — tudo entra pelo inbox, tudo percorre o Genesis. A Espiral 1 deu corpo. A Espiral 2 conecta esse corpo à vida real. Raiz é a fundação, não uma feature. Conectores são a razão de existir, não um "nice to have."

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

## Espiral 2 — Vida / sistema operacional

**Status:** em andamento (F1 done, F2 parcial, F3 15/19, F4 7/9)
**Princípio:** Se existe no digital, tem como entrar. Raiz é a fundação. Conectores são a razão de existir.

```
     ✓   ·  (1)  F1 — Raiz
     ◐  —   (1)  F2 — Conectores (API + Agent Local)
     ◐  △   (2)  F3 — Toque + alma
     ◐  □   (3)  F4 — Biblioteca + grafo
        ⬠   (5)  F5 — Companheiro
```

### ✅ Fase 1 · Raiz (effort: 1)
**Status:** done
**Commits:** b64511b (F1 Raiz) + a53be24 (mobile fixes)
**Protocol:** foundation
**Escopo:** Mapear a vida digital inteira. 9 domínios como estrutura permanente — não onboarding que desaparece.

A primeira pergunta que o sistema faz não é "o que você quer fazer?". É "o que existe na sua vida?". Raiz mapeia os 9 domínios e cria o inventário base de onde tudo parte.

Entregáveis:
- [x] Raiz como page fixa no nav (sempre acessível, não só onboarding)
- [x] Primeiro acesso: gate via user_metadata — abre direto no Raiz
- [x] 3 portas de entrada: micro (3 domínios), standard (6), deep (9)
- [x] Inventário por domínio: captura de items com tag `#domain:[key]`
- [x] Panorama 3×3: grid dos 9 domínios com status (ok / stale / empty / connected)
- [x] Cada domínio mostra: quantos items, último update, health score
- [x] Tom gentil: "depois, talvez" em todo canto — pular é tão fácil quanto preencher
- [x] Hook `useRaiz`: query items por domínio, calcula health (count, oldest, status)
- [x] Retornantes: Raiz mostra estado real dos domínios, não repete onboarding
- [x] Domínio `communication`: já mapeia os emails existentes (6 → 2 target)
- [x] Domínio `time`: já mapeia estado do calendário (timezone, blocos)
- [x] Domínio `storage`: já mapeia onde as coisas vivem (Drive, Photos, local)

Os 9 domínios:
| Domínio | Tag | O que mapeia |
|---------|-----|-------------|
| identity | `#domain:identity` | Documentos pessoais, passaporte, registros |
| documents | `#domain:documents` | Contratos, certidões, papéis importantes |
| health | `#domain:health` | Saúde física/mental, médicos, exames |
| finance | `#domain:finance` | Contas, investimentos, dívidas |
| storage | `#domain:storage` | Onde as coisas moram — Drive, Photos, local, cloud |
| memories | `#domain:memories` | Fotos, vídeos, legado |
| time | `#domain:time` | Calendário, compromissos, rotinas, timezone |
| communication | `#domain:communication` | Emails, contatos, canais |
| projects | `#domain:projects` | Trabalho, hobbies, criações |

- [x] **Routine Builder** (e36c271): question flow por módulo (5 módulos, ~35 perguntas), mini-wrap com commit no Supabase, overlay integrado na página Raiz. Novo diretório `src/features/raiz/` (11 arquivos, 1044 LOC).

Notas: Wireframes existem (telas 10 e 11). Raiz É o onboarding. E depois fica como painel de saúde da vida. Cada domínio é uma lente — os items são os mesmos do Supabase, filtrados por `#domain:*`. Zero schema novo.

### ◐ Fase 2 — Conectores (effort: 1)
**Status:** em progresso (edge functions + Gmail + Atom Agent)
**Commits:** cfc2eb2 (infra) + edc1f68 (fallback) + 978b24f (edge fix) + e26891a (F2 fix)
**Protocol:** full (GUARDIAO → ROOT → ESTRUTURA → INTERFACE → TEIA)
**Escopo:** Portas de entrada reais — API + filesystem. O que o Raiz mapeou agora tem caminho pra entrar no sistema. Tres bocas, uma esteira.

O Raiz diz "voce tem 6 emails." Os conectores fazem esses emails virarem items. O Raiz diz "seu calendario ta em UTC." Os conectores corrigem e sincronizam. O agent local organiza Downloads todo dia. A promessa do "Human Systems" se materializa aqui.

Entregaveis — Conectores API:
- [ ] **Gmail → Atom**: emails starred viram items no inbox automaticamente
- [ ] Gmail: contatos relevantes viram tags `#who:*` com dados reais
- [x] **Google Calendar → Atom**: OAuth conectado, refresh token salvo, UI de conectores
- [ ] Calendar: sync de eventos end-to-end (edge function fix pendente)
- [ ] Calendar: timezone corrigido (UTC → Australia/Brisbane)
- [ ] Calendar: blocos do ritual (aurora/zenite/crepusculo) como eventos recorrentes reais
- [x] Painel de conectores: status de cada integracao (conectado / desconectado / erro)
- [x] Pipeline de ingestao: conector → inbox (estagio 1) → Genesis pipeline normal
- [x] connector-service.ts + useConnectors hook
- [ ] Edge functions bulletproof: connector-auth (AUTH_xxx), calendar-sync (CAL_xxx), gmail-sync (GMAIL_xxx)

Entregaveis — Agent Local (Atom Agent):
- [ ] **Atom Agent v0.1**: Python CLI — scan, classify, rename, move, index no Supabase
- [ ] body.location extension (service, path, hash, mime, size) — zero migracao
- [ ] Scanner: SHA-256 hash, dedup, metadata
- [ ] Classifier: regras por nome + extensao + confidence bands
- [ ] Namer: naming convention Genesis §8.4 aplicada a filenames
- [ ] CLI: `atom-agent scan <path>` com aprovacao humana antes de mover
- [ ] AtomDrive: estrutura local espelhando modulos Genesis
- [ ] Agent: `atom-agent watch <path>` — daemon mode (v0.2)
- [ ] Agent: Haiku fallback pra classificacao ambigua (v0.2)

Principio de ingestao: tudo que entra por conector (API ou agent) vai pro inbox como qualquer outro item. O triage classifica. O pipeline matura. O Genesis nao muda — o que muda e quantas coisas entram.

Notas: Gmail MCP e Google Calendar MCP ja estao conectados no Claude.ai. A integracao MindRoot usa as mesmas APIs (Supabase Edge Functions como proxy). Cada conector e independente — se Gmail falha, Calendar continua. Atom Agent e repo separado (`rsmramalho/atom-agent`), Python CLI, fala direto com Supabase via service key. Escopo F2 limitado a leitura + ingestao. Acoes (enviar email, criar evento) sao Espiral 3.

### ◐ Fase 3 △ Toque + alma (effort: 2)
**Status:** parcial (15/19 — toque 8/8, alma 3/6, triage 4/5)
**Commits:** 589c72e (soul loop) + c6ac59a (UI polish) + 51345e1 (library nav) + 970ed01 (triage edge fn)
**Protocol:** surface + logic
**Escopo:** Agora que dados fluem pra dentro, o app precisa ser usável de verdade no dia a dia. Toque (UI) + Alma (soul loop) + Triage real (IA).

A Espiral 1 construiu a interface. A F3 torna ela funcional sob carga real — items vindos de conectores, inventário do Raiz, captura manual. O soul loop fecha o ciclo presença.

Entregaveis — Toque:
- [x] Item Detail: edicao inline (titulo, notes) + botao avancar estagio com labels
- [x] Item Detail: borda de modulo com cor
- [x] Pipeline: tap num estagio expande lista de items com cards clicaveis
- [x] Bottom Nav: redesign — SVG icons, area de toque 48px, badge inbox
- [x] Projects: botao "+ criar projeto" na page, cards com progress
- [x] Home: secao "items ativos" entre captura e inbox
- [x] Home: HealthBar (verde/amarelo/vermelho — inbox count + stale + orphans)

Entregaveis — Alma:
- [x] Soul loop aurora: AuroraCheckin no primeiro acesso do dia (emotion + energy + intention)
- [x] Soul loop aurora: registra no soul-store (Zustand)
- [ ] Soul loop task: apos milestone/entrega, pergunta "como foi?" — registra emotion_after
- [x] Soul loop crepusculo: wrap SoulStep (step 1) com emotions + energy
- [ ] Wrap: aurora data (soul-store) nao flui pro wrap body → shift fica null
- [ ] Wrap display: secao SOUL renderizada com shift visivel (aurora → crepusculo)

Entregaveis — Triage real:
- [x] Edge function triage-classify com Claude Haiku (deployed, 135 LOC)
- [x] 3 faixas de confianca: auto (>=90/95%), sugere (60-89/94%), manual (<60%)
- [x] Threshold diferenciado + fallback (item fica no inbox se edge fn falha)
- [x] Triage roda automaticamente (via usePipeline)
- [ ] ItemDetail: chips clicaveis (type, module, status editaveis inline)

Notas: Soul loop segue Marco Zero seção 5 — nunca forçar, linguagem livre, só em tasks peso > 1. Triage segue Genesis v5 Parte 3.1. Esta fase é effort 2 porque combina UI + backend + IA — três camadas ao mesmo tempo. Mas o design de cada parte já existe.

### ◐ Fase 4 □ Biblioteca + grafo (effort: 3)
**Status:** parcial (7/9 — library + graph D3 + connections CRUD done)
**Commits:** 51345e1 (library nav) + db6d214 (graph D3)
**Protocol:** full
**Escopo:** Library page, connections UI, graph visualization. O Genesis estágio 5 (Pentágono) ganha corpo na interface. Com items fluindo dos conectores e classificados pelo triage, agora o sistema mostra as conexões.

Entregaveis:
- [x] Library page: tabs (Todos, Reflexoes) + domain filter Raiz + search
- [x] Library cards: titulo + type chip + preview notes + data + modulo cor
- [x] Item Detail: ConnectionsSection — adicionar/remover connections tipadas (8 AtomRelations)
- [x] Item Detail: ao adicionar connection, item avanca pro estagio 5 automaticamente (FSM)
- [ ] Prompt de conexao: no estagio 4, "isso se conecta com algo?" (Genesis Parte 2, portao 4)
- [x] Graph view: D3 force layout (/graph) — nos + edges interativos
- [x] Graph: nos coloridos por modulo, edges rotuladas por relation
- [ ] Graph: filtro por dominio Raiz (so tem module filter atualmente)
- [x] Search: filtros avancados por module, type, status, domain, tags

Notas: Wireframe Library existe (mindroot-wireframe-library-reflexoes.html). Graph usa D3 force layout. Connections usam tabela item_connections (deployed via migration 007). O grafo é o raio-x do Genesis — mostra a geometria real de tudo que entrou no sistema.

### ⚪ Fase 5 ⬠ Companheiro (effort: 5)
**Status:** futuro
**Protocol:** full
**Escopo:** AI companion dentro do MindRoot. O sistema deixa de ser passivo. Captura por voz. Nudges contextuais. O companion sabe o que existe (Raiz), o que entrou (conectores), o que foi classificado (triage), e o que está conectado (grafo).

Entregáveis:
- [ ] Companion page/panel: interface de conversa dentro do MindRoot
- [ ] Companion contextual: sabe o estado do sistema (inbox count, stale, soul patterns, domain health)
- [ ] Nudges: sugere ações baseadas em padrões (ex: "3 dias sem wrap", "domínio finance vazio", "12 items no inbox")
- [ ] Captura por voz: Web Speech API → texto → item no inbox → triage automático
- [ ] Companion no wrap: propõe wrap baseado nos items criados/modificados do dia
- [ ] Companion no aurora: puxa estado + último wrap + domain health, oferece contexto
- [ ] Integração com triage: companion pode classificar items via conversa
- [ ] Companion sugere connections: "esse item parece se conectar com [X]"

Notas: Wireframe tela 10 (mindroot-wireframe-ai-companion.html). O companion é o Claude operando dentro do MindRoot — Genesis como contrato, Marco Zero como contexto, Raiz como mapa, dados do usuário como memória. Não é chatbot genérico. É o sistema pensando.

---

## Seeds — Espiral 3

Nascem da completude da Espiral 2. Não detalhadas até lá.

- **Escudo:** Corp Shield avançado. Ações nos conectores (enviar email, criar evento, mover arquivo). O sistema passa de leitor pra agente.
- **Resiliência:** PWA offline completo + Ollama local como fallback do Claude + sync engine. O sistema funciona sem internet.
- **Propagação:** Estágio 6 do Genesis ganha mecânica real — cascata de eventos entre items conectados. Completar uma task atualiza o projeto. Projeto mudar de status notifica items dependentes.
- **Atom Agent v2+:** Evolucao do agent local (entregue em F2 como v0.1). Watch mode, Haiku classification, Google Drive scan, Photos migration, daemon diario. Repo: `rsmramalho/atom-agent`.

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

**Atom não depende de ninguém. Todos dependem dele.**

---

## Métricas atuais

| Métrica | Valor |
|---------|-------|
| Commits | 77 |
| Files | 109 (.ts/.tsx) |
| LOC | ~12,100 |
| Pages | 14 |
| Components | 26 |
| Services | 11 |
| Engines | 6 |
| Stores | 4 (app, wrap, toast, soul) |
| Hooks | 13 |
| Tests | 90+ (vitest) |
| Bundle (gzip) | ~83KB main |
| Edge functions | 5 (+ gmail-sync pendente) |
| Migrations | 8 (+ 009 pendente) |
| TS errors | 0 |

---

## Regras do roadmap

1. **Uma fase por vez.** Não começar a próxima sem terminar a atual.
2. **De dentro pra fora.** Cada camada contém todas as anteriores.
3. **Mexeu aqui → cross-check no master.** PENTAGON.md reflete toda mudança.
4. **Este documento é a referência.** Se não está aqui, não está planejado.
5. **Spec antes de código.** Cada fase ganha spec antes de ir pro Claude Code.
6. **Wireframe é lei.** Toda página segue o wireframe antes de inventar.
7. **Espiral 2 segue o Genesis Build Protocol.** Cada fase declara protocol:. Claude Code executa.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 31 Mar 2026 | MINDROOT-ROADMAP.md — fases 0-5 originais |
| 2.0 | 01 Abr 2026 | Roadmap unificado Atom OS. Reordenado: motor → inteligência → visualização → reflexão. |
| 3.0 | 02 Abr 2026 | Fases PHI (espiral Fibonacci). Rebuild do zero (mindroot-v2). Fases 1-5 DONE. Deploy live. |
| 3.1 | 02 Abr 2026 | F6 Inteligência DONE. Métricas atualizadas. Dark mode debt documentado. |
| 4.0 | 02 Abr 2026 | Atom OS → Atom (Human Systems). V1 no centro do Pentágono. V6 Lab adicionado. Formato PHI template. Cross-check com PENTAGON.md. |
| 4.1 | 02 Abr 2026 | Duas espirais: Corpo (app, F1-F7) + Mente (organismo, planejada). Yugar Vision Doc decomposto — features de Engine/MindRoot mapeadas pra Espiral 2. F7 mantém escopo limpo. |
| 4.2 | 03 Abr 2026 | F7 Completude DONE. Espiral 1 completa. Dark mode toggle, search, analytics soul/connections, export download, calendar ritual bands, offline lite, polish. 30 commits, 76 files, ~7.8K LOC. |
| 5.0 | 03 Abr 2026 | Espiral 2 detalhada: 5 fases PHI (Toque+alma, Raiz, Triage real, Biblioteca+grafo, Companheiro). Seeds da Espiral 3 listadas. Protocol tag em cada fase. |
| 6.0 | 03 Abr 2026 | Espiral 2 redesenhada: Raiz como F1 (fundação, não feature). Conectores como F2 (Gmail, Calendar, Drive — portas de entrada reais). Toque+Alma+Triage unificados em F3. "Se existe no digital, tem como entrar." Seeds da Espiral 3 atualizadas. |
| 6.1 | 04 Abr 2026 | Sync: F1 Raiz DONE (b64511b), F2 Conectores PARCIAL (OAuth+UI done, edge functions blocked). Metricas atualizadas: 57 commits, 86 files, ~10K LOC. |
| 6.2 | 04 Abr 2026 | F1 Raiz: Routine Builder registrado como entregavel (e36c271, 11 files, 1044 LOC). Seeds: Atom Agent adicionado. Metricas: 60 commits, 97 files, ~11K LOC. |
| 6.3 | 04 Abr 2026 | Naming: Atom HS→Atom. Pentagono: V3=Lab, V4=Yugar, V5=Muda. Atlas→hexagono. Identity spec v1.0 (atom-engine-core). |
| 6.4 | 05 Abr 2026 | F3 Toque+Alma + F4 Biblioteca: Soul loop aurora (AuroraCheckin + soul-store), Library no BottomNav (calendar removido), domain filter Raiz, Graph view (D3 force layout, /graph), Home polish (search→capture, ver todos link), ItemDetail advance labels. 14 pages, 109 files, ~6.7K LOC, 90 tests. |
| 6.5 | 05 Abr 2026 | Roadmap sync: F3 15/19 (toque 8/8, alma 3/6, triage 4/5), F4 7/9 (library+graph+connections done). F2 expandido: Atom Agent v0.1 movido de Seeds pra F2, protocol:full marcado. Metricas: 77 commits, 109 files, ~12.1K LOC. |

---

*Atom. Duas espirais. A primeira da corpo. A segunda conecta a vida. De dentro pra fora, duas vezes.*
