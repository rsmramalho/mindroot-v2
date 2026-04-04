# Atom — Roadmap

**Versão:** 6.3
**Data:** 04 Abr 2026
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

**Status:** em andamento (F1 done, F2 parcial)
**Princípio:** Se existe no digital, tem como entrar. Raiz é a fundação. Conectores são a razão de existir.

```
     ✓   ·  (1)  F1 — Raiz
     ◐  —   (1)  F2 — Conectores
       △    (2)  F3 — Toque + alma
      □     (3)  F4 — Biblioteca + grafo
     ⬠      (5)  F5 — Companheiro
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
**Status:** parcial (OAuth + UI done, edge functions bloqueadas)
**Commits:** cfc2eb2 (infra) + edc1f68 (fallback) + 978b24f (edge fix)
**Protocol:** full
**Escopo:** Portas de entrada reais. O que o Raiz mapeou agora tem caminho pra entrar no sistema.

O Raiz diz "você tem 6 emails." Os conectores fazem esses emails virarem items. O Raiz diz "seu calendário tá em UTC." Os conectores corrigem e sincronizam. A promessa do "Human Systems" se materializa aqui.

Entregáveis:
- [ ] **Gmail → Atom**: emails marcados/starred viram items no inbox automaticamente
- [ ] Gmail: consolidação assistida (6 → 2 emails) — o sistema propõe, Rick executa
- [ ] Gmail: contatos relevantes viram tags `#who:*` com dados reais
- [x] **Google Calendar → Atom**: OAuth conectado, refresh token salvo, UI de conectores
- [ ] Calendar: sync de eventos (bloqueado — edge function non-2xx)
- [ ] Calendar: timezone corrigido (UTC → Australia/Brisbane)
- [ ] Calendar: blocos do ritual (aurora/zênite/crepúsculo) como eventos recorrentes reais
- [ ] **Google Drive → Atom**: scan de arquivos existentes, classificação por domínio
- [ ] Drive: Google Photos no `r.r@saystay.com` → plano de migração pro `r@ramalho.au`
- [x] Painel de conectores: status de cada integração (conectado / desconectado / erro)
- [x] Pipeline de ingestão: conector → inbox (estágio 1) → Genesis pipeline normal

Princípio de ingestão: tudo que entra por conector vai pro inbox como qualquer outro item. O triage classifica. O pipeline matura. O Genesis não muda — o que muda é quantas coisas entram.

Notas: Gmail MCP e Google Calendar MCP já estão conectados no Claude.ai. A integração MindRoot usa as mesmas APIs (Supabase Edge Functions como proxy). Drive usa Google Drive API. Cada conector é independente — se Gmail falha, Calendar continua. Escopo limitado a leitura + ingestão. Ações (enviar email, criar evento) são Espiral 3.

### ⚪ Fase 3 △ Toque + alma (effort: 2)
**Status:** futuro
**Protocol:** surface + logic
**Escopo:** Agora que dados fluem pra dentro, o app precisa ser usável de verdade no dia a dia. Toque (UI) + Alma (soul loop) + Triage real (IA).

A Espiral 1 construiu a interface. A F3 torna ela funcional sob carga real — items vindos de conectores, inventário do Raiz, captura manual. O soul loop fecha o ciclo presença.

Entregáveis — Toque:
- [ ] Item Detail: edição inline (título, notes, tags) + chips clicáveis (type, module, status)
- [ ] Item Detail: botão avançar estágio (classificar → estruturar → validar → conectar → commitar)
- [ ] Item Detail: borda de módulo com cor
- [ ] Pipeline: tap num estágio expande lista de items com cards clicáveis
- [ ] Bottom Nav: redesign — ícones maiores, área de toque 44px+, badge inbox
- [ ] Projects: botão "+ projeto" na page, cards com progress
- [ ] Home: seção "ativos" entre captura e inbox (status=active, stage≥3, max 3)
- [ ] Home: audit health bar (verde/amarelo/vermelho baseado em inbox count + orphans)

Entregáveis — Alma:
- [ ] Soul loop aurora: app pergunta "como você tá chegando hoje?" no primeiro acesso do dia
- [ ] Soul loop aurora: registra emotion_before + energy + intention no wrap store
- [ ] Soul loop task: após milestone/entrega, pergunta "como foi?" — registra emotion_after
- [ ] Soul loop crepúsculo: wrap pergunta "como você tá saindo?" — registra shift aurora→crepúsculo
- [ ] Wrap stepper: step 1 (soul) funcionando end-to-end com dados reais
- [ ] Wrap display: seção SOUL renderizada com shift visível

Entregáveis — Triage real:
- [ ] Edge function com Claude Haiku para auto-triage (substituir classificação hardcoded)
- [ ] 3 faixas de confiança: auto (≥90/95%), sugere (60-89/94%), manual (<60%)
- [ ] Threshold diferenciado: 95% acionáveis (task, project, spec, habit), 90% passivos
- [ ] Fallback: se edge function falha, item fica no inbox com flag
- [ ] Triage roda automaticamente — tanto captura manual quanto items de conectores

Notas: Soul loop segue Marco Zero seção 5 — nunca forçar, linguagem livre, só em tasks peso > 1. Triage segue Genesis v5 Parte 3.1. Esta fase é effort 2 porque combina UI + backend + IA — três camadas ao mesmo tempo. Mas o design de cada parte já existe.

### ⚪ Fase 4 □ Biblioteca + grafo (effort: 3)
**Status:** futuro
**Protocol:** full
**Escopo:** Library page, connections UI, graph visualization. O Genesis estágio 5 (Pentágono) ganha corpo na interface. Com items fluindo dos conectores e classificados pelo triage, agora o sistema mostra as conexões.

Entregáveis:
- [ ] Library page: tabs (Todos, Reflexões, Recomendações, Conteúdo), filter chips por type
- [ ] Library cards: título + type chip + preview notes + data + módulo cor
- [ ] Item Detail: seção connections — adicionar/remover connections tipadas (8 AtomRelations)
- [ ] Item Detail: ao adicionar connection, item avança pro estágio 5 automaticamente
- [ ] Prompt de conexão: no estágio 4, "isso se conecta com algo?" (Genesis Parte 2, portão 4)
- [ ] Graph view: visualização de nós e edges (pode ser página separada ou modal)
- [ ] Graph: nós coloridos por módulo, edges rotuladas por relation, tamanho por connections
- [ ] Graph: filtro por domínio Raiz — ver grafo de um domínio isolado
- [ ] Search: filtros avançados por module, type, status, domain, tags

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
- **Atom Agent:** Braço físico do Atom. Python CLI que escaneia filesystem, Gmail, Photos, Calendar, Drive. Move, renomeia, deduplica, indexa no Supabase. 6 spirais próprias (motor → sentinela → faxineiro → guardião → consolidador → superfície). Spec v1.0 em atom-engine-core. Repo planejado: `rsmramalho/atom-agent`.

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
| Commits | 60 |
| Files | 97 (.ts/.tsx) |
| LOC | ~11,000 |
| Pages | 13 |
| Components | 25 |
| Services | 11 |
| Engines | 6 |
| Stores | 3 |
| Hooks | 12 |
| Tests | 41 (vitest) |
| Bundle (gzip) | ~83KB main |
| Edge functions | 5 |
| Migrations | 8 |
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

---

*Atom. Duas espirais. A primeira da corpo. A segunda conecta a vida. De dentro pra fora, duas vezes.*
