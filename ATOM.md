# Atom — O Método

**Versão:** 1.2
**Data:** 06 Abr 2026
**Princípio:** Este documento é a geometria do método. Cada estágio contém todos os anteriores. O triângulo não existe sem a linha. O círculo não existe sem cada estágio antes dele.

---

## · Ponto — O que é o Atom

O Atom é um sistema operacional pessoal construído sobre uma premissa: **emoção precede ação, e ação precede tempo.** Tudo que um humano faz na vida digital passa por esses três pilares — o que sente, o que faz, quando acontece. O sistema existe pra tornar esses três visíveis, organizados e honestos.

O Atom não quer tornar ninguém mais produtivo. Quer tornar alguém mais presente.

Todo item que entra no sistema nasce como um ponto — sem forma, sem classificação, sem julgamento. A partir daí, ele matura: ganha tipo, ganha estrutura, se conecta com outros, e eventualmente é commitado. Se perde relevância, decai — mas suas seeds alimentam novas gêneses. Nada se perde.

O Genesis define o contrato. Este documento define o método.

---

## — Linha — O contrato

O Atom Engine opera sob três leis:

1. **O schema é o contrato, não o código.** Se amanhã troca o Supabase por outro banco, o React por outro framework — o contrato é o mesmo.
2. **Documentar é executar.** Cada wrap, cada spec, cada decisão registrada — é trabalho real.
3. **Nada se perde.** Entropia é reciclagem, não destruição. O UUID é eterno.

### A quarta lei

4. **O sistema classifica a si mesmo.** Todo documento no ecossistema Atom e um AtomItem. Segue o Meta-Template. Tem envelope (type, module, state, stage, connections). Sem excecao. Os proprios docs-lei sao instancias. O roadmap e uma instancia. Cada feature spec e uma instancia. Se nao tem envelope, nao pertence ao sistema.

### Os dois trilhos

O Atom nao existe sozinho. Ele precisa de uma construcao pra se provar. E a construcao precisa do Atom pra ter fundacao.

**Trilho 1 — Atom (o universo).** O protocolo. O Genesis. Os 3 pilares. O Meta-Template. Universal. Qualquer pessoa pega e constroi o que quiser. O Engine e agnostico.

**Trilho 2 — O Pentagono (a construcao).** A implementacao de quem esta construindo. As escolhas. Os vertices. Cada escolha testa o Atom na pratica. Quando a construcao encontra algo que nao funciona, o Atom melhora. Quando o Atom evolui, a construcao se adapta.

Os dois andam lado a lado com perspectivas diferentes. O Atom sem construcao e teoria. A construcao sem Atom e improviso. Juntos, um prova que o outro funciona.

**ATOM.md** e o mapa do universo. **PENTAGON.md** e o mapa da construcao. Dois documentos mestres, duas perspectivas, validando um ao outro.

### O item

Tudo é um AtomItem. 23 tipos. 8 módulos. 8 estados. Um item nasce no inbox (estágio 1) e matura até o commit (estágio 7) ou decai pro arquivo. A state machine é sequencial — não pula estágio. Regressão é automática por perda de requisitos.

### Os 7 estágios

| # | Geometria | State | O que acontece |
|---|-----------|-------|----------------|
| 1 | · Ponto | `inbox` | Texto bruto entra. Sem tipo, sem forma. |
| 2 | — Linha | `classified` | Type + module definidos. Item ganha direção. |
| 3 | △ Triângulo | `structured` | Template aplicado. UUID gerado. Schema-compliant. |
| 4 | □ Quadrado | `validated` | 4 portões validados. Fundação sólida. |
| 5 | ⬠ Pentágono | `connected` | Connections tipadas. Item é parte do grafo. |
| 6 | ⬡ Hexágono | `propagated` | Efeito cascata registrado. (Opcional — 5→7 é válido.) |
| 7 | ○ Círculo | `committed` | Commit via wrap. Visível em todas as camadas. |

**Referência completa:** Genesis v5 (schema, SQL, RPCs, triggers, audit queries, serialização). Este documento não duplica o Genesis — aponta pra ele. O Genesis é o contrato detalhado. Aqui está o mapa.

---

## △ Triângulo — Os três pilares

Todo app do universo Atom implementa três pilares. Eles são universais — mudam as features, nunca os pilares.

### Pilar 1: Emotion — como você está

O sistema pergunta antes de agir. "Como você tá chegando hoje?" não é decoração — é o dado mais importante do dia.

**O que cobre:**
- Soul extension (energy_level, emotion_before, emotion_after, ritual_slot)
- Aurora check-in (emoção + energia + intenção do dia)
- Emoção após tasks significativas (peso > 1)
- Shift aurora→crepúsculo no wrap
- Padrões emocionais ao longo do tempo

**Regras:**
- Nunca forçar. Se o humano não quer registrar emoção, ok.
- Linguagem livre. "Meio bosta" é válido.
- Padrões, não julgamentos. O sistema observa. Nunca diz "você deveria estar mais calmo."

**Flow E2E:**
```
Aurora check-in → emotion + energy → soul-store
    ↓
Task significativa → "como foi?" → emotion_after
    ↓
Crepúsculo wrap → emotion + energy → shift calculado
    ↓
Analytics → padrões ao longo do tempo
```

**Connectors que alimentam esse pilar:** nenhum externo — Emotion é captura direta do humano.

### Pilar 2: Action — o que você faz

Tudo que o humano captura, classifica, estrutura, conecta e commita. O pipeline do Genesis.

**O que cobre:**
- Captura rápida (inbox → estágio 1)
- Auto-triage (AI classifica com 3 faixas de confiança)
- Pipeline de 7 estágios (state machine completa)
- Connections tipadas (8 tipos de relação)
- Morph (mutação de type), decay (entropia), propagation (cascata)
- Raiz como inventário da vida (9 domínios — o chão desse pilar)

**Flow E2E:**
```
Captura (texto bruto) → inbox
    ↓
Auto-triage (Haiku) → type + module sugeridos
    ↓
Humano confirma → structured (stage 3)
    ↓
4 portões → validated (stage 4)
    ↓
"Isso se conecta com algo?" → connected (stage 5)
    ↓
Wrap commita → committed (stage 7)
```

**Connectors que alimentam esse pilar:**
- Gmail → emails viram items no inbox com `#domain:communication`
- Atom Agent (filesystem) → arquivos classificados viram items
- Captura manual → sempre disponível

### Pilar 3: Time — quando acontece

O ritmo do dia. Aurora, zênite, crepúsculo. Wrap no fim. Calendar sync. Recurrence (hábitos, rituais).

**O que cobre:**
- Ritual slots (aurora 05h-08h, zênite 08h-17h, crepúsculo 17h+)
- Wrap como ritual de commit (body JSONB estruturado)
- Seeds extraídas no wrap (entropia → novos pontos)
- Recurrence extension (RRULE, streak, completion_log)
- Calendar sync (Google Calendar → items com `#domain:time`)

**Flow E2E:**
```
Aurora → "bom dia" → audit leve + foco do dia
    ↓
Zênite → trabalho + capturas
    ↓
Crepúsculo → wrap propõe commit
    ↓
Wrap → CREATED + MODIFIED + DECIDED + SOUL + AUDIT + NEXT
    ↓
Supabase commita → seeds geradas → amanhã começa de novo
```

**Connectors que alimentam esse pilar:**
- Google Calendar → eventos sincronizados, timezone corrigido
- Recurring items → push como eventos recorrentes no Calendar

### Cross-pillar: onde os pilares se encontram

| Intersecção | O que acontece | Spec vive em |
|-------------|----------------|-------------|
| Emotion × Time | Wrap inclui soul data (aurora→shift) | time.md com cross-ref a emotion.md |
| Emotion × Action | Triage pode considerar emoção futuramente. Hoje: emotion_after em tasks | action.md |
| Action × Time | Items com due_date aparecem no calendar. Wrap commita items. | time.md |
| Todos × Raiz | Raiz dá contexto a todos. 9 domínios são lentes sobre os mesmos items. | raiz.md (branch) |

---

## □ Quadrado — As quatro fundações

### Fundação 1: Design system

O Atom Engine define princípios visuais universais. Cada vertex implementa com suas escolhas de fonte, componentes e tokens.

**Cores por módulo (8 — universais):**
Cada módulo do Genesis tem uma cor fixa. A cor aparece como borda lateral em cards, chips de type, e filtros. Os 8 módulos: work, body, mind, family, purpose, bridge, finance, social.

**Cores por estágio (7 — universais):**
Cada estágio do Genesis tem uma cor. Stage bars mostram a distribuição de items por estágio. Os 7 estágios seguem a geometria: · — △ □ ⬠ ⬡ ○.

**Cores por ritual (3 — universais):**
Aurora (quente), zênite (neutro), crepúsculo (frio). Cada período do dia tem uma paleta visual que o usuário associa instintivamente.

**Superfícies (3 camadas — universais):**
- `bg` — fundo da página
- `card` — cards e containers
- `surface` — fundo secundário (inputs, chips, overlays)

**Princípios (universais):**
- Dark mode obrigatório. Toda cor tem variante escura.
- Mobile-first. 360×800 como viewport mínimo.
- Dois pesos tipográficos: regular (body) e medium (heading). Nunca bold pesado (600+).
- Cores de módulo e estágio nunca mudam entre vertices — um item do módulo `work` é da mesma cor no MindRoot e no Constellation.

**Implementação por vertex:**
Cada vertex define: fonte, hex values específicos, componentes (card, chip, input, button), spacing scale, border-radius, e qualquer token adicional. Vive em `[vertex]/design/design-system.md`.

Referência canônica do V1: `mindroot/design/design-system.md` + `src/index.css` (tokens CSS).

### Fundação 2: Error handling

**Filosofia:** falhar silenciosamente é pior que mostrar erro. O humano precisa saber o que aconteceu.

**Níveis:**
- **Triage falha:** item fica no inbox. Toast: "classificação automática indisponível." Non-blocking.
- **Supabase falha:** toast com erro legível. Retry automático 1x. Se falha de novo, toast persistente.
- **Captura falha:** NUNCA perder o texto. Salvar localmente. Retry quando voltar online.
- **Wrap falha:** NUNCA perder o wrap. Salvar draft no Zustand. Retry.
- **Edge function falha:** fallback para classificação manual. Toast: "modo offline."

**Regra:** texto do toast NUNCA sai do container. Toast tem max-width, word-break, padding.

### Fundação 3: Naming no código

**Arquivos:**
- Pages: `PascalCase.tsx` (Home.tsx, Pipeline.tsx, Raiz.tsx)
- Components: `PascalCase.tsx` em pasta por domínio (home/, shared/, shell/, atoms/)
- Hooks: `camelCase.ts` com prefixo `use` (useItems.ts, useRaiz.ts, usePipeline.ts)
- Services: `kebab-case.ts` com sufixo `-service` (item-service.ts, wrap-service.ts)
- Engines: `kebab-case.ts` (fsm.ts, parsing.ts, soul.ts, wrap.ts)
- Stores: `kebab-case.ts` com sufixo `-store` (app-store.ts, soul-store.ts)
- Config: `kebab-case.ts` (raiz.ts, types.ts)
- Types: `kebab-case.ts` (item.ts, ui.ts, engine.ts)

**Pastas:**
```
src/
├── pages/           ← 1 arquivo por tela
├── components/      ← agrupados por domínio
│   ├── atoms/       ← componentes base (chips, badges, icons)
│   ├── shared/      ← reutilizáveis (ItemCard, ErrorBanner)
│   ├── shell/       ← estrutura (BottomNav, TopBar, AppShell)
│   ├── home/        ← componentes da Home
│   └── audit/       ← componentes de audit
├── features/        ← features complexas com subpastas
│   └── raiz/        ← builder, components, store
├── hooks/           ← hooks reutilizáveis
├── service/         ← data access (Supabase)
├── engine/          ← lógica pura (sem React, sem Supabase)
├── store/           ← Zustand stores
├── config/          ← configurações (raiz domains, type schemas)
└── types/           ← TypeScript types
```

**Regra:** engine/ nunca importa de service/ ou hooks/. Service nunca importa de components/. A dependência flui de dentro pra fora: types → engine → service → hooks → components → pages.

### Fundação 4: Testing

**Princípio:** teste é parte do build, não afterthought.

**5 agentes de teste (espelham o build protocol):**

| Agente | Escopo | Quando roda |
|--------|--------|-------------|
| Lógica | Hooks, mappers, stores — funções puras | `vitest run` (CI) |
| Regressão | 1 test por bug histórico | `vitest run` (CI) |
| Dados | Cache, dedup, state machine | `vitest run` (CI) |
| Fluxo | Sequências multi-step | `vitest run` (CI) |
| Visual | Viewport, layout, toast | Manual ou Chrome MCP (pré-deploy) |

**Regra:** nenhum commit passa sem `vitest run` + `tsc --noEmit` + `npm run build`. Enforcement via hook (ver Hexágono).

---

## ⬠ Pentágono — A matriz de construção

### Os agentes do build protocol — centro duplo + 4 camadas

| # | Agente | Geometria | Papel | Nunca faz |
|---|--------|-----------|-------|-----------|
| · | **GUARDIÃO** | · (centro) | Interpreta o contrato. Mecanismos ativos. Questiona origem, detecta trava. | Construir |
| · | **AUDITOR** | · (centro) | Enforça o contrato. Determinístico. Retorna ✅/❌. | Interpretar |
| 1 | Root | — | Banco, schema, migrations | Interface |
| 2 | Estrutura | △ | Services, hooks, engines | UI |
| 3 | Interface | □ | Pages, components, UX | Lógica de negócio |
| 4 | Teia | ⬠ | Testes, cross-check, validação | Decidir |

**O centro duplo:**

```
                    · Ponto
                   /        \
          GUARDIÃO            AUDITOR
        interpreta            enforça
        mecanismos            binário
        questiona             verifica
        abre                  fecha
```

Não são sequenciais. Não são hierárquicos. São contrapesos.

GUARDIÃO interpreta primeiro. AUDITOR enforça depois. A ordem não inverte.

**Quando cada um opera:**

| Trigger | Quem |
|---------|------|
| Decisão arquitetural, spec nova, dúvida de origem | GUARDIÃO |
| Cross-check, audit, PENTAGON sync, validação de migration | AUDITOR |
| Fim de qualquer fase | AUDITOR (automático via TEIA) |
| Resultado ❌ do AUDITOR | GUARDIÃO (resolve o que falta) |

**Cada agente só conhece o output dos anteriores.** Interface não sabe como o banco funciona — sabe que `useItems()` retorna items. Estrutura não sabe como o banco armazena — sabe que `itemService.create()` persiste.

### A matriz (5 × 3)

Cada feature do Atom vive numa célula da matriz: coluna = pilar (Emotion, Action, Time), linha = agente (centro duplo → camadas).

**Como usar:** escolhe a coluna (pilar), desce as linhas (agentes), de dentro pra fora. Cada célula é um job autocontido.

| Agente | Emotion | Action | Time |
|--------|---------|--------|------|
| Guardião | Soul extension ok? | Types + FSM ok? | Wrap schema ok? |
| Auditor | Soul fields no DB? ✅/❌ | Migrations aligned? ✅/❌ | Wrap body valid? ✅/❌ |
| Root | Soul fields no DB | Items + triggers | Wrap body + events |
| Estrutura | soul-store, useSoul | pipeline-svc, useItems | wrap-svc, useWrap |
| Interface | SoulCard, AuroraUI | Home capture, Pipeline | Wrap page, steps |
| Teia | Shift renderiza? | Inbox→stage 7? | Commit persiste? |

**Cross-pillar:** quando uma célula precisa de dados de outro pilar, a referência é explícita. Wrap (Time/Interface) consome soul data (Emotion/Estrutura) → a spec do Wrap documenta que `useSoulStore()` fornece aurora emotion, e o wrap step 1 renderiza com base nesses dados.

### Branches (galhos que crescem dos pilares)

| Branch | Pilar de origem | Status |
|--------|----------------|--------|
| Raiz | Action (inventário) | Implementado |
| Search | Action (filtrar items) | Implementado |
| Library | Action (navegar items por type) | Implementado, fora do nav |
| Graph | Action (visualizar connections) | Implementado |
| Analytics | Emotion + Time (padrões) | Básico |
| Companion | Todos (AI contextual) | Futuro |
| Connectors | Cada um alimenta seu pilar | Parcial |
| Atom Agent | Action (filesystem → inbox) | CLI pronto, integração pendente |

**Regra dos galhos:** galho só cresce quando o tronco (pilar) funciona perfeitamente. Nenhum galho entra no BottomNav até o pilar de origem estar verificado end-to-end.

---

## ⬡ Hexágono — Enforcement

O build protocol sem enforcement é sugestão. Sugestão não previne deslize. Gates previnem.

### Hook 1: Pre-task — centro duplo

**GUARDIÃO (interpreta):**
```
Antes de qualquer sessão, questionar:
1. Qual pilar essa task toca? (coluna da matriz)
2. Isso nasce de dentro pra fora ou da periferia?
3. O pilar de origem tem flow E2E verificado?
4. O que não sei antes de começar? (listar — proporção invertida)
```

**AUDITOR (enforça):**
```
Verificar binário antes de construir:
[ ] Genesis schema alinhado com DB?
[ ] type-schemas.json consistente com o código?
[ ] Feature tem spec antes de ter código?
[ ] Spec tem connection no Genesis?
[ ] PENTAGON.md reflete estado atual?
```

Se qualquer ❌ → Claude Code para e reporta. GUARDIÃO decide como resolver.

### Hook 2: Post-edit (Teia automática)

Depois de qualquer mudança de código:

```
Executar:
1. npx tsc --noEmit (zero erros de tipo)
2. npx vitest run (zero testes falhando)
3. npm run build (build completa)
```

Se qualquer passo falha → Claude Code corrige antes de continuar.

### Hook 3: Pre-commit (Mobile gate)

Antes de qualquer commit:

```
Verificar:
1. Build passou? (hook 2 garante)
2. Viewport 360×800 testado? (checklist visual ou Chrome MCP)
3. Toast text overflow? (grep por toast calls, verificar max-width)
```

Se mobile não foi verificado → commit bloqueado.

### Implementação

No `.claude/settings.json` ou no CLAUDE.md como policy explícita:

```
REGRA: Nenhuma sessão do Claude Code começa sem:
- GUARDIÃO identificar: pilar, linha da matriz, flow E2E afetado
- AUDITOR verificar: schema, type-schemas, spec exists, PENTAGON sync

REGRA: Nenhum commit sem:
- tsc --noEmit (zero errors)
- vitest run (zero failures)
- npm run build (success)

REGRA: Nenhum deploy sem:
- Teste visual em viewport 360×800
- Flow E2E do pilar verificado
```

**Nota:** `CLAUDE.md` permanece na raiz dos repos como instrução executável para o Claude Code — não é documentação, é policy operacional. Referencia o ATOM.md como fonte. Não é absorvido.

---

## ○ Círculo — Operação e replicação

### O ritual do dia

| Período | Hora | O que acontece |
|---------|------|----------------|
| Aurora | 05h-08h | Check-in emocional. Foco do dia. Deep work. |
| Zênite | 08h-17h | Trabalho. Capturas rápidas. Email 08h (15 min). |
| Crepúsculo | 17h+ | Wrap. Commit. Família. |

**Regra de ouro:** não abrir email nem WhatsApp antes das 08h.

### O wrap (ritual de commit)

```
═══ ATOM WRAP — [DD Mon YYYY] ([ritual_slot]) ═══
CREATED:
MODIFIED:
DECIDED:
CONNECTIONS:
SEEDS:
SOUL:
AUDIT:
NEXT:
═══════════════════════════════════════════════════
```

Seções vazias omitidas. SOUL opcional. AUDIT automático. NEXT obrigatório.
Wrap é AtomItem type=wrap, state=committed, genesis_stage=7 (born committed).
Body JSONB é a fonte canônica. Formato texto é display.

### Connectors como bocas do sistema

Cada connector alimenta um pilar. Não são features — são bocas do sistema operacional.

| Connector | Pilar | O que faz |
|-----------|-------|-----------|
| Google Calendar | Time | Eventos → items com `#domain:time`. Timezone sync. |
| Gmail | Action | Emails → items com `#domain:communication`. Tags `#who:`. |
| Atom Agent | Action | Filesystem → items classificados por pattern. |
| Manual capture | Action | Humano digita → item no inbox. Sempre disponível. |
| Aurora check-in | Emotion | Humano registra → soul-store. |

**Regra:** três bocas, uma esteira. Tudo entra pelo inbox, tudo percorre o Genesis.

### Replicação pros vértices

O Pentágono do Atom:
- **V1 MindRoot** — espelho pessoal (este app)
- **V2 Constellation** — diagnóstico pra empresas
- **V3 Lab** — experimentação
- **V4 Yugar** — comunidade
- **V5 Muda** — impacto social

Cada vértice herda os 3 pilares, adaptando o conteúdo:

| Pilar | MindRoot (V1) | Constellation (V2) |
|-------|--------------|---------------------|
| Emotion | Como o usuario está | Como a empresa está (health score) |
| Action | O que o usuario faz | O que a empresa precisa fazer (diagnóstico) |
| Time | Quando acontece | Timeline do projeto (roadmap) |

**A matriz replica.** Centro duplo + 4 camadas × 3 pilares = estrutura de build pra qualquer vértice. Muda a implementação, nunca o contrato.

### Árvore de documentos

```
atom-engine-core/
├── ATOM.md                    ← o metodo (raiz)
├── PENTAGON.md                ← master roadmap do ecossistema
│
├── law/                       ← a semente (sagrada)
│   ├── genesis.md
│   ├── marco-zero.md
│   ├── meta-template.md
│   └── identidade.md
│
├── mindroot/                  ← V1 (o visualizador)
│   ├── roadmap.md
│   ├── features/              ← 14 feature specs
│   └── design/                ← wireframes + design system
│
├── specs/                     ← specs cross-vertex
├── sql/                       ← schema de referencia
├── wraps/                     ← historico de sessoes
└── archive/                   ← morto
```

Regra: cada vertex ganha sua pasta. mindroot/ e V1. constellation/ sera V2. A semente (law/) nao muda. O metodo (ATOM.md) nao muda. So cresce um novo galho.

---

## Versionamento

| Versão | Data | O que mudou |
|--------|------|-------------|
| 1.0 | 06 Abr 2026 | Documento inicial. Nasceu de sessão de recapitulação após 8 sprints revertidos. Formaliza pilares, matriz, fundações, enforcement. |
| 1.1 | 06 Abr 2026 | Centro duplo adicionado ao Pentágono (GUARDIÃO + AUDITOR). Hook 1 do Hexágono atualizado com dois níveis. genesis-build-protocol absorvido em operations/build-protocol.md. |
| 1.2 | 06 Abr 2026 | Quarta lei adicionada: "o sistema classifica a si mesmo" — todo documento segue Meta-Template. Dois trilhos documentados: Atom (universo) e Pentagono (construcao) andam lado a lado validando um ao outro. Arvore de documentos alinhada com estrutura real do repo. |

---

*A geometria deste documento espelha a geometria do sistema que ele descreve.*
*Cada estágio contém todos os anteriores.*
*De dentro pra fora. Duas vezes.*
