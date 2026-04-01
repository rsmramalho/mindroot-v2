# Atom Genesis v4 + AtomItem Schema v2
## O Contrato Universal do Atom Engine

**Versão:** 5.0.1
**Data:** 01 Abr 2026
**Status:** Definitive Spec — Marco Zero
**Evolução:** Genesis v1→v2→v3→v4→v5 | Schema v1→v2
**Cross-check:** 2 rodadas Gemini (análise + BDD + framework) + fusão Claude + 17 gaps auditados e fechados (sessão 25 Mar) + revisão arquitetural v5 (sessão 01 Abr): 32 intactos, 8 reposicionados, 7 novos, 0 perdidos
**Princípio:** Este documento é a source of truth. Tudo que não está aqui não existe.

---

## Parte 1 — Filosofia

### O problema que resolve

A maioria dos sistemas de produtividade força estruturação prematura: ou o usuário classifica no momento da captura (criando fricção), ou captura sem estrutura (criando lixo). Não existe zona de maturação entre "tive uma ideia" e "isso é um item estruturado."

### A solução: Maturação Permissiva

O Atom Engine opera sob o princípio de que um item pode existir no sistema em diferentes níveis de maturidade, avançando apenas quando necessário, ou regredindo se perder seus requisitos de integridade. Cada type tem um piso mínimo — o estágio mais baixo em que pode repousar validamente. Abaixo do piso = alerta no audit. Acima do piso = maturação progressiva.

### Três leis

1. **O schema é o contrato, não o código.** Se amanhã troca o Supabase por Postgres puro, o Drive por Obsidian local, o Claude por outro LLM — o schema é o mesmo.
2. **Documentar é executar.** Cada wrap, checkpoint, spec — é trabalho real. Não é overhead.
3. **Nada se perde.** Entropia é reciclagem, não destruição. Mutação preserva identidade. O UUID é eterno.

### Arquitetura Cósmica

Os 7 estágios seguem a progressão da geometria sagrada — do ponto (potencial puro) ao círculo (completude). Cada forma contém todas as anteriores. O triângulo não existe sem a linha. O pentágono não existe sem o quadrado. A completude não existe sem cada estágio antes dela.

O ciclo de entropia (círculo → seed → novo ponto) é a espiral fibonacci: cada gênese nasce da completude anterior. Não é metáfora — é mecânica. O sistema de seeds extrai do que morre o que alimenta o que nasce. A proporção áurea não foi adicionada ao design — emergiu dele.

Os 3 documentos-lei, 7 estágios, 8 módulos ressoam com a sequência natural. O ritual do dia (aurora — zênite — crepúsculo) espelha o ciclo cósmico: nascer, sustentar, entregar. O wrap no crepúsculo é a entropia do dia — o que morre gera seeds pro amanhecer. O sistema foi desenhado pra ser verdadeiro, e a geometria emergiu sozinha.

---

## Parte 2 — Os 7 Estágios (State Machine)

### Pipeline de criação

| # | Geometria | Nome funcional | State (DB) | O que acontece | Gate de passagem |
|---|-----------|---------------|------------|----------------|-----------------|
| 1 | Ponto · | Captura | `inbox` | Texto bruto entra no sistema. Sem tipo, sem módulo, sem forma. | `title.length > 0` |
| 2 | Linha — | Intenção | `classified` | LLM infere type + module. Humano confirma. Item ganha direção. | `type` e `module` definidos |
| 3 | Triângulo △ | Estrutura | `structured` | Template aplicado. UUID gerado. Frontmatter core completo. Body tipado. | Schema-compliant. Campos core preenchidos |
| 4 | Quadrado □ | Fundação | `validated` | 4 portões validados. Naming convention. Prompt de conexão respondido. | Validação completa. Pode sustentar peso |
| 5 | Pentágono ⬠ | Conexão | `connected` | Connections tipadas inseridas. Item é parte do grafo. | ≥1 edge na tabela `item_connections` |
| 6 | Hexágono ⬡ | Ativação | `propagated` | Efeito registrado na fila de eventos. Cascata nos conectados. | ≥1 evento em `atom_events` |
| 7 | Círculo ○ | Completude | `committed` | Commit via wrap. Visível em todas as camadas. | Wrap commitado. Estado congelado |
| 7→ | Entropia | Decaimento | `archived` | Seeds extraídas. Item decompõe. Nó histórico no grafo. | Threshold de inatividade atingido (default: 30 dias) |

### Propriedades da state machine

- **Avanço:** sempre sequencial (1→2→3→4→5→6→7). Não pula estágio. **Exceção:** `wrap` e `session-log` nascem completos no estágio 7 ("born committed") — não passam pelo pipeline.
- **Regressão:** automática por perda de requisitos (ex: perde conexão → 5 volta pra 4).
- **Mutação:** morph() regride pro estágio 2 (re-classifica, re-estrutura, re-valida).
- **Entropia:** item inativo além do threshold (default: 30 dias) → seeds extraídas → `archived`. Nó permanece no grafo.
- **Estágio 6 opcional:** items podem ir do 5 direto pro 7 via wrap. Propagação só acontece quando a conexão gera efeito cascata real. Sem cascata = sem estágio 6.
- **Ciclo:** completude gera seeds. Seeds são novos pontos (estágio 1). Fibonacci: cada completude alimenta novas gêneses.
- **Inbox obrigatório:** a partir do go live, TODO item que não seja um documento-lei (Genesis, Marco Zero, Meta-Template) entra pelo inbox (estágio 1) e percorre o pipeline. Sem exceção. Sem atalho. Tudo na vida passa pelo Genesis.

### 4 Portões de integridade (estágio 4)

1. **Atom sempre ativo** — item registrado no sistema, não descartado
2. **Template first** — body_schema existe pro type. Se não existe, criar antes. Templates nascem do uso: o primeiro item de um type cria o template ao vivo. Não é necessário definir templates abstratamente antes de ter items reais.
3. **Commit obrigatório** — item será incluído no próximo wrap. Wrap commita items no estágio 3+ (piso do type respeitado).
4. **Connections sugeridas** — no estágio 4, o agente pergunta "isso se conecta com algo?" (resposta pode ser "não"). O prompt acontece aqui, a conexão efetiva move pro estágio 5.

### Piso mínimo por type

| Type | Piso | Lógica |
|------|------|--------|
| note, reflection | 2 (Linha) | Precisa de type/module pra existir. Sem classificação = anônimo no inbox |
| recommendation, podcast, article | 2 (Linha) | "Vi, gostei" + saber o que é |
| resource, list | 2 (Linha) | Saber o que é basta |
| task, habit | 3 (Triângulo) | Precisa de template pra existir no backlog |
| recipe, workout | 3 (Triângulo) | Template completo. Connections são bônus |
| checkpoint | 3 (Triângulo) | Documento estruturado |
| spec | 5 (Pentágono) | Spec sem connections não especifica nada |
| project | 5 (Pentágono) | Sem connections = ideia, não projeto |
| session-log, wrap | 7 (Círculo) | Nasce completo por definição |

**Regra:** item abaixo do piso gera alerta no audit. Não é bloqueio — é nudge.

---

## Parte 3 — Motores de Automação

### 3.1 Auto-Triage Engine (Estágio 1→2→3)

Motor de IA que analisa texto bruto e aplica classificação com 3 faixas de confiança:

| Confiança | Ação | Tipos afetados |
|-----------|------|----------------|
| ≥ 90% (passivos) / ≥ 95% (acionáveis) | Auto-classifica. Pula pra estágio 3. | Todos |
| 60% — 89% / 94% | Sugere na UI. Humano confirma em 1 toque. | Todos |
| < 60% | Aguarda triagem manual do usuário. | Todos |

**Tipos acionáveis** (threshold 95%): task, project, spec, habit.
**Tipos passivos** (threshold 90%): note, reflection, recommendation, podcast, article, resource, list, recipe, workout.

**Princípio:** classificar errado uma nota é incômodo. Classificar errado uma task é esquecimento. O threshold reflete o risco.

### 3.2 FSM — Finite State Machine (Downgrades)

Triggers no PostgreSQL que mantêm integridade:

| Evento | Downgrade | Lógica |
|--------|-----------|--------|
| Item perde última connection | `connected` → `validated` (5→4) | Sem edges = não está no grafo |
| morph() executado | Volta pra `classified` (→2) | Novo type precisa re-estruturar e re-validar |
| Projeto pai deletado | Items filhos perdem `project_id` | `project_id = NULL`, flag no audit |

### 3.3 Atom Wrap (Controle de Entropia)

Ritual de encerramento de sessão:

1. O agente propõe wrap com todos os items criados/modificados
2. Varredura em items no estágio 7 que atingiram threshold de inatividade (default: 30 dias)
3. Extrai seeds (decisões, learnings, intenções pendentes) pra bandeja temporária
4. O usuário aprova quais seeds viram novos pontos (estágio 1). Seeds rejeitadas → `state: archived` com tag `#seed:rejected`. Nó permanece no grafo.
5. O agente executor commita no Drive + Supabase
6. Seção SOUL registra emoções (aurora → crepúsculo)
7. Seção AUDIT registra estado do sistema

**Princípio:** o usuário decide quais seeds vivem. Automação extrai, humano aprova.

### 3.4 Formato Estruturado do Wrap

O wrap é o ritual de commit. Toda sessão produtiva termina com um wrap. O wrap vive no Supabase como AtomItem com body JSONB estruturado. O formato texto é o template de display/export.

**Body JSONB do wrap:**

```json
{
  "created": [
    { "item_id": "uuid", "type": "task", "title": "...", "genesis_stage": 3, "destination": "mod-work/" }
  ],
  "modified": [
    { "item_id": "uuid", "field": "status", "from": "active", "to": "completed" }
  ],
  "decided": [
    "Decisão em linguagem natural"
  ],
  "connections": [
    { "source_id": "uuid", "target_id": "uuid", "relation": "belongs_to" }
  ],
  "seeds": [
    { "title": "seed extraída", "status": "approved | rejected", "new_item_id": "uuid | null" }
  ],
  "soul": {
    "aurora": { "emotion": "string", "energy": "high | medium | low" },
    "intention": "string",
    "tasks": [
      { "item_id": "uuid", "emotion_after": "string" }
    ],
    "crepusculo": { "emotion": "string", "energy": "high | medium | low" },
    "shift": "string"
  },
  "audit": {
    "inbox_count": 0,
    "below_floor": [],
    "orphans": [],
    "stale_count": 0
  },
  "next": [
    "próximo passo concreto"
  ]
}
```

**Formato de display/export (texto):**

```
——— ATOM WRAP — [DD Mon YYYY] ([ritual_slot]) ———

CREATED:
  - [genesis_stage] type:[type] "[título]" → [destino]

MODIFIED:
  - [item] → [campo]: [valor anterior] → [valor novo]

DECIDED:
  - "[decisão em linguagem natural]"

CONNECTIONS:
  - [item A] → [relation] → [item B]

SEEDS:
  - "[seed extraída de item em entropia]" → [aprovado | descartado]

SOUL:
  aurora: [emoção] | energy: [high|medium|low]
  intention: "[frase do foco do dia]"
  ---
  [task significativa] → [emoção depois]
  ---
  crepusculo: [emoção] | energy: [high|medium|low]
  shift: [emoção aurora] → [emoção crepúsculo]

AUDIT:
  inbox: [N items]
  below_floor: [N items] → [lista se > 0]
  orphans: [N items] → [lista se > 0]
  stale: [N items no inbox > 7 dias]

NEXT:
  - [ ] [próximo passo concreto]

———————————————————————————————————————————————
```

**Regras do wrap:**
- Seções vazias são omitidas (se não modificou nada, MODIFIED não aparece)
- SOUL é opcional — se o humano encerra sem registrar emoção, o agente não insiste
- AUDIT roda automaticamente (agente verifica inbox, pisos, órfãos, stale)
- SEEDS só aparece se houve entropia na sessão
- NEXT é obrigatório — sempre tem próximo passo
- O wrap é um AtomItem: type=wrap, state=committed, genesis_stage=7 (nasce completo)
- Body JSONB é a fonte canônica. Formato texto é gerado pra display/export.

---

## Parte 4 — AtomItem Schema v2

### 4.1 Core (obrigatório em todo item)

```typescript
interface AtomItemCore {
  // Identidade
  id: UUID;                        // Gerado no estágio 3. Eterno.
  user_id: UUID;                   // FK → auth.users

  // Classificação (estágio 2+)
  title: string;                   // Texto bruto no estágio 1, título limpo no 3+
  type: AtomType;                  // Atribuído no estágio 2
  module: AtomModule;              // Atribuído no estágio 2
  tags: string[];                  // Tags livres + semânticas
  status: AtomStatus;              // Ciclo de vida do item (active, paused, completed...)

  // State machine (estágio 1+)
  state: AtomState;                // Estágio atual no pipeline (inbox→committed→archived)
  genesis_stage: number;           // 1-7 (integer pra queries numéricas)

  // Hierarquia (estágio 4+)
  project_id: UUID | null;         // FK → items.id
  naming_convention: string | null; // mod-[x]_type_desc_version
  // Nota: `parent_id` (nesting hierárquico do Schema v1) foi removido por design.
  // Nesting usa connections com relation `belongs_to`. Simplicidade > flexibilidade.

  // Conteúdo (estágio 3+)
  notes: string | null;            // Texto livre
  body: Record<string, any>;       // JSON tipado por type + extensions

  // Meta
  source: AtomSource;              // Onde foi criado
  created_at: ISO_timestamp;
  updated_at: ISO_timestamp;
  created_by: string | null;       // Sessão ou agente
}
```

### 4.2 Enums

```typescript
type AtomState =
  | "inbox"       // Estágio 1 - Ponto
  | "classified"  // Estágio 2 - Linha
  | "structured"  // Estágio 3 - Triângulo
  | "validated"   // Estágio 4 - Quadrado
  | "connected"   // Estágio 5 - Pentágono
  | "propagated"  // Estágio 6 - Hexágono
  | "committed"   // Estágio 7 - Círculo
  | "archived"    // Entropia
  ;

type AtomType =
  | "note" | "reflection" | "recommendation" | "podcast" | "article"
  | "resource" | "list" | "task" | "habit" | "recipe" | "workout"
  | "spec" | "checkpoint" | "project" | "session-log" | "wrap"
  | "ritual" | "review" | "log" | "doc" | "research" | "template" | "lib"
  ;
// Nota: `session-log` (hífen) no TypeScript/UI, `session_log` (underscore) no SQL.
// O SQL não aceita hífen em enums. A conversão é automática na camada de serialização.

type AtomModule =
  | "work" | "body" | "mind" | "family"
  | "purpose" | "bridge" | "finance" | "social"
  ;

type AtomStatus =
  | "inbox" | "draft" | "active" | "paused"
  | "waiting" | "someday" | "completed" | "archived"
  ;

type AtomRelation =
  | "belongs_to" | "blocks" | "feeds" | "mirrors"
  | "derives" | "references" | "morphed_from" | "extracted_from"
  ;

type AtomSource =
  | "claude-project" | "claude-chat" | "claude-chrome" | "claude-code"
  | "mindroot" | "constellation" | "obsidian" | "drive"
  | "monday" | "manual" | "atom-engine"
  ;
// Nota: `source` é TEXT no SQL (permissivo — aceita valores novos sem migração).
// A spec TypeScript é a referência canônica dos valores válidos.
```

### 4.3 Extensions (opt-in, vivem no body JSONB)

**Princípio:** extensions são mapeadas por type quando o template é criado. Não existe mapeamento abstrato antecipado — o primeiro item real de um type define quais extensions fazem sentido.

**Campos migrados do Schema v1:** `weight`, `is_chore`, `needs_decision` não vivem no core. Se necessários, vivem como campos dentro da extension Operations (ou como tags: `#chore`, `#needs_decision`).

**Extension: Soul** — reflexões, rituais, logs pessoais
```json
{
  "soul": {
    "energy_level": "high | medium | low",
    "emotion_before": "string (linguagem livre)",
    "emotion_after": "string (linguagem livre)",
    "needs_checkin": "boolean",
    "ritual_slot": "aurora | zenite | crepusculo | null"
  }
}
```

**Extension: Operations** — tasks, projects, specs
```json
{
  "operations": {
    "priority": "high | medium | low",
    "deadline": "ISO-8601",
    "due_date": "YYYY-MM-DD",
    "project_status": "draft | active | paused | completed | archived",
    "progress_mode": "auto | milestone | manual",
    "progress": "0-100"
  }
}
```

**Extension: Recurrence** — habits, rituals, reviews
```json
{
  "recurrence": {
    "rule": "RRULE string (iCalendar RFC 5545)",
    "last_completed": "ISO-8601",
    "streak_count": "number",
    "completion_log": ["array of ISO timestamps"]
  }
}
```

### 4.4 Type Registry (body_schema por type)

| Type | Body schema | Module default |
|------|-------------|----------------|
| recipe | `{ cuisine, serves, prep_time, cook_time, difficulty, ingredients[], steps[] }` | body |
| workout | `{ focus, frequency, level, duration, equipment[], exercises[] }` | body |
| ritual | `{ intention, anchors[], time_window, duration }` | purpose |
| review | `{ period, checklist_items[], reflection, adjustments }` | bridge |
| spec | `{ overview, architecture, data_model, implementation, open_questions[] }` | work |
| checkpoint | `{ done[], pending[], decisions[], next_steps[] }` | work |
| session-log | `{ summary, files_created[], decisions[], pending[], continuation_prompt }` | bridge |
| recommendation | `{ category, recommended_by, source_url, why, rating }` | varies |
| podcast | `{ show_name, episode, topic, key_takeaways[], source_url }` | mind |
| article | `{ author, publication, topic, key_points[], source_url }` | mind |

Types sem body (usam notes + tags): project, task, habit, note, reflection, resource, list, log, doc, research, template, lib, wrap

---

## Parte 5 — Schema SQL (Supabase)

### 5.1 Enums

```sql
CREATE TYPE atom_state AS ENUM (
  'inbox', 'classified', 'structured', 'validated',
  'connected', 'propagated', 'committed', 'archived'
);

CREATE TYPE atom_type AS ENUM (
  'note', 'reflection', 'recommendation', 'podcast', 'article',
  'resource', 'list', 'task', 'habit', 'recipe', 'workout',
  'spec', 'checkpoint', 'project', 'session_log', 'wrap',
  'ritual', 'review', 'log', 'doc', 'research', 'template', 'lib'
);

CREATE TYPE atom_module AS ENUM (
  'work', 'body', 'mind', 'family',
  'purpose', 'bridge', 'finance', 'social'
);

CREATE TYPE atom_relation AS ENUM (
  'belongs_to', 'blocks', 'feeds', 'mirrors',
  'derives', 'references', 'morphed_from', 'extracted_from'
);

CREATE TYPE atom_status AS ENUM (
  'inbox', 'draft', 'active', 'paused',
  'waiting', 'someday', 'completed', 'archived'
);
```

### 5.2 Tabelas

```sql
-- Nodes
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,

  -- Core
  title TEXT NOT NULL,
  type atom_type,
  module atom_module,
  tags TEXT[] DEFAULT '{}',
  status atom_status DEFAULT 'inbox',

  -- State machine
  state atom_state DEFAULT 'inbox',
  genesis_stage SMALLINT DEFAULT 1 CHECK (genesis_stage BETWEEN 1 AND 7),

  -- Hierarchy
  project_id UUID REFERENCES items(id) ON DELETE SET NULL,
  naming_convention TEXT,

  -- Content
  notes TEXT,
  body JSONB DEFAULT '{}'::jsonb,

  -- Meta
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- Edges (connections)
CREATE TABLE item_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,

  source_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  relation atom_relation NOT NULL,
  note TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(source_id, target_id, relation),
  CHECK (source_id != target_id)
);

-- Events (propagação + audit trail)
CREATE TABLE atom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,

  source_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  target_id UUID REFERENCES items(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.3 Índices

```sql
CREATE INDEX idx_items_user ON items(user_id);
CREATE INDEX idx_items_state ON items(state);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_module ON items(module);
CREATE INDEX idx_items_genesis ON items(genesis_stage);
CREATE INDEX idx_items_project ON items(project_id);

CREATE INDEX idx_connections_user ON item_connections(user_id);
CREATE INDEX idx_connections_source ON item_connections(source_id);
CREATE INDEX idx_connections_target ON item_connections(target_id);

CREATE INDEX idx_events_user ON atom_events(user_id);
CREATE INDEX idx_events_source ON atom_events(source_id);
CREATE INDEX idx_events_created ON atom_events(created_at);
```

### 5.4 Row Level Security

```sql
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "items_isolation" ON items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "connections_isolation" ON item_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "events_isolation" ON atom_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### 5.5 Trigger: sync genesis_stage ↔ state

```sql
CREATE OR REPLACE FUNCTION sync_genesis_stage()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.genesis_stage := CASE NEW.state
    WHEN 'inbox' THEN 1
    WHEN 'classified' THEN 2
    WHEN 'structured' THEN 3
    WHEN 'validated' THEN 4
    WHEN 'connected' THEN 5
    WHEN 'propagated' THEN 6
    WHEN 'committed' THEN 7
    WHEN 'archived' THEN 7
    ELSE NEW.genesis_stage
  END;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_genesis
  BEFORE UPDATE OF state ON items
  FOR EACH ROW EXECUTE FUNCTION sync_genesis_stage();
```

### 5.6 Trigger: downgrade automático (orfanato)

```sql
CREATE OR REPLACE FUNCTION check_orphan_downgrade()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_remaining INT;
  v_type atom_type;
  v_floor INT;
BEGIN
  SELECT COUNT(*) INTO v_remaining
  FROM item_connections
  WHERE source_id = OLD.source_id OR target_id = OLD.source_id;

  IF v_remaining = 0 THEN
    -- Busca o type do item pra checar o piso
    SELECT type INTO v_type FROM items WHERE id = OLD.source_id;

    v_floor := CASE v_type
      WHEN 'project' THEN 5 WHEN 'spec' THEN 5
      WHEN 'task' THEN 3 WHEN 'habit' THEN 3
      WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
      WHEN 'checkpoint' THEN 3
      WHEN 'session_log' THEN 7 WHEN 'wrap' THEN 7
      ELSE 2
    END;

    -- Só faz downgrade se o estágio 4 (validated) não viola o piso.
    -- Items com piso 5 (project, spec) permanecem em 'connected'
    -- e geram alerta no audit em vez de downgrade silencioso.
    IF v_floor <= 4 THEN
      UPDATE items
      SET state = 'validated', updated_at = NOW()
      WHERE id = OLD.source_id AND state = 'connected';
    END IF;
    -- Items com piso 5+ que perdem todas as connections:
    -- permanecem em 'connected' mas aparecem em v_orphan_items (audit).
    -- O humano decide: reconectar ou aceitar o downgrade manualmente.
  END IF;

  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_orphan_check
  AFTER DELETE ON item_connections
  FOR EACH ROW EXECUTE FUNCTION check_orphan_downgrade();
```

---

## Parte 6 — Operações (RPCs)

### 6.1 morph_item — Mutação de type

```sql
CREATE OR REPLACE FUNCTION morph_item(p_item_id UUID, p_new_type atom_type)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current RECORD;
  v_fossil_id UUID;
BEGIN
  SELECT * INTO v_current FROM items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Item não encontrado.'; END IF;
  IF v_current.user_id != auth.uid() THEN RAISE EXCEPTION 'Acesso negado.'; END IF;
  IF v_current.state = 'archived' THEN RAISE EXCEPTION 'Item arquivado.'; END IF;

  -- Cria fóssil (snapshot do estado anterior)
  INSERT INTO items (user_id, title, type, module, tags, body, notes, state, genesis_stage, source, created_at)
  VALUES (
    v_current.user_id,
    v_current.title || ' [fóssil]',
    v_current.type, v_current.module, v_current.tags,
    v_current.body, v_current.notes,
    'archived', 7, v_current.source, v_current.created_at
  ) RETURNING id INTO v_fossil_id;

  -- Conecta fóssil ao item original
  INSERT INTO item_connections (user_id, source_id, target_id, relation)
  VALUES (v_current.user_id, p_item_id, v_fossil_id, 'morphed_from');

  -- Muta: novo type, regride pro estágio 2, body legado preservado
  UPDATE items SET
    type = p_new_type,
    body = jsonb_build_object('legacy_body', v_current.body, 'morph_date', NOW()),
    state = 'classified',
    genesis_stage = 2,
    updated_at = NOW()
  WHERE id = p_item_id;

  -- Registra evento
  INSERT INTO atom_events (user_id, source_id, target_id, event_type, payload)
  VALUES (v_current.user_id, p_item_id, v_fossil_id, 'morph',
    jsonb_build_object('from_type', v_current.type, 'to_type', p_new_type));

  RETURN v_fossil_id;
END;
$$;
```

### 6.2 decay_item — Entropia

```sql
CREATE OR REPLACE FUNCTION decay_item(p_item_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_item RECORD;
  v_seed_id UUID;
BEGIN
  SELECT * INTO v_item FROM items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Item não encontrado.'; END IF;
  IF v_item.user_id != auth.uid() THEN RAISE EXCEPTION 'Acesso negado.'; END IF;
  IF v_item.state = 'archived' THEN RAISE EXCEPTION 'Item já decaiu.'; END IF;

  -- Cria seed no inbox (estágio 1)
  INSERT INTO items (user_id, title, state, genesis_stage, body, source)
  VALUES (
    v_item.user_id,
    'Seed: ' || v_item.title,
    'inbox', 1,
    jsonb_build_object('origin_type', v_item.type, 'origin_id', v_item.id, 'status', 'awaiting_triage'),
    'atom-engine'
  ) RETURNING id INTO v_seed_id;

  -- Conecta seed ao item original
  INSERT INTO item_connections (user_id, source_id, target_id, relation)
  VALUES (v_item.user_id, v_seed_id, p_item_id, 'extracted_from');

  -- Arquiva o original
  UPDATE items SET state = 'archived', genesis_stage = 7, updated_at = NOW()
  WHERE id = p_item_id;

  -- Registra evento
  INSERT INTO atom_events (user_id, source_id, target_id, event_type, payload)
  VALUES (v_item.user_id, p_item_id, v_seed_id, 'decay',
    jsonb_build_object('seed_title', 'Seed: ' || v_item.title));

  RETURN v_seed_id;
END;
$$;
```

### 6.3 propagate_effect — Ativação (estágio 6)

```sql
CREATE OR REPLACE FUNCTION propagate_effect(
  p_source_id UUID, p_target_id UUID, p_effect_type TEXT, p_payload JSONB DEFAULT '{}'
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_source RECORD;
  v_event_id UUID;
BEGIN
  SELECT * INTO v_source FROM items WHERE id = p_source_id FOR UPDATE;
  IF v_source.user_id != auth.uid() THEN RAISE EXCEPTION 'Acesso negado.'; END IF;

  -- Verifica que a edge existe
  IF NOT EXISTS (
    SELECT 1 FROM item_connections
    WHERE source_id = p_source_id AND target_id = p_target_id AND user_id = auth.uid()
  ) THEN RAISE EXCEPTION 'Conexão não encontrada.'; END IF;

  -- Registra evento na fila
  INSERT INTO atom_events (user_id, source_id, target_id, event_type, payload)
  VALUES (v_source.user_id, p_source_id, p_target_id, p_effect_type, p_payload)
  RETURNING id INTO v_event_id;

  -- Avança source pro estágio 6 se ainda não está
  IF v_source.state = 'connected' THEN
    UPDATE items SET state = 'propagated', updated_at = NOW() WHERE id = p_source_id;
  END IF;

  RETURN v_event_id;
END;
$$;
```

### 6.4 commit_item — Completude (estágio 7)

```sql
CREATE OR REPLACE FUNCTION commit_item(p_item_id UUID)
RETURNS TIMESTAMPTZ LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_item RECORD;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  SELECT * INTO v_item FROM items WHERE id = p_item_id FOR UPDATE;
  IF v_item.user_id != auth.uid() THEN RAISE EXCEPTION 'Acesso negado.'; END IF;
  IF v_item.state = 'committed' THEN RETURN v_item.updated_at; END IF;

  UPDATE items SET
    state = 'committed',
    body = jsonb_set(COALESCE(body, '{}'::jsonb), '{committed_at}', to_jsonb(v_now)),
    updated_at = v_now
  WHERE id = p_item_id;

  INSERT INTO atom_events (user_id, source_id, event_type, payload)
  VALUES (v_item.user_id, p_item_id, 'commit', jsonb_build_object('committed_at', v_now));

  RETURN v_now;
END;
$$;
```

---

## Parte 7 — Audit Queries

### Órfãos (items connected sem edges)
```sql
CREATE VIEW v_orphan_items AS
SELECT i.id, i.title, i.type, i.state
FROM items i
WHERE i.state = 'connected'
AND NOT EXISTS (
  SELECT 1 FROM item_connections ic
  WHERE ic.source_id = i.id OR ic.target_id = i.id
);
```

### Items abaixo do piso
```sql
CREATE VIEW v_below_floor AS
SELECT i.id, i.title, i.type, i.genesis_stage,
  CASE i.type
    WHEN 'project' THEN 5
    WHEN 'spec' THEN 5
    WHEN 'task' THEN 3 WHEN 'habit' THEN 3
    WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
    WHEN 'checkpoint' THEN 3
    WHEN 'session_log' THEN 7 WHEN 'wrap' THEN 7
    ELSE 2
  END AS required_floor
FROM items i
WHERE i.state != 'archived'
AND i.genesis_stage < CASE i.type
    WHEN 'project' THEN 5 WHEN 'spec' THEN 5
    WHEN 'task' THEN 3 WHEN 'habit' THEN 3
    WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
    WHEN 'checkpoint' THEN 3
    WHEN 'session_log' THEN 7 WHEN 'wrap' THEN 7
    ELSE 2
  END;
```

### Inbox stale (items no estágio 1 há mais de 7 dias)
```sql
CREATE VIEW v_inbox_stale AS
SELECT id, title, created_at,
  EXTRACT(DAY FROM NOW() - created_at) AS days_in_inbox
FROM items
WHERE state = 'inbox'
AND created_at < NOW() - INTERVAL '7 days';
```

---

## Parte 8 — Arquitetura de Sistemas

### 8.1 Source of truth

| Camada | Sistema | Papel |
|--------|---------|-------|
| **Casa** | Supabase | Source of truth. Onde o item nasce, vive, matura, conecta, morre. |
| **Porta da frente** | MindRoot | Interface primária. Captura, visualização, pipeline, wraps, graph. |
| **Impressora** | Google Drive | Export sob demanda. Gera docs com ATOM ENVELOPE quando faz sentido. |
| **Raio-x** | Obsidian | Visualização de grafo sob demanda. Gerado do Supabase, não mantido em sync. |
| **Conversa** | Claude Project | Interface do criador. Planejamento, análise, sessões profundas. |

### 8.2 Separação de responsabilidades

| Ator | Papel | Nunca faz |
|------|-------|-----------|
| Humano | Despeja, decide, autoriza | Organizar, classificar, nomear |
| Agente (planejador) | Planeja, propõe, analisa | Executar no sistema, decidir sem autorização |
| Agente executor | Executa no Supabase/Drive (API/MCP) | Planejar, decidir |
| Supabase | Source of truth, RPCs, events, FSM | Apresentar UI |
| MindRoot | UI primária, captura, pipeline, wraps, audit, graph | Ser source of truth (é consumidor) |
| Drive | Recebe exports (docs com ATOM ENVELOPE) | Processar, validar, ser fonte |
| Obsidian | Graph View sob demanda (vault gerado) | Criar items, validar, sync contínuo |

### 8.3 Flow de dados no commit (estágio 7)

```
Humano autoriza wrap
  → Agente propõe wrap estruturado (body JSONB)
    → Agente executor:
      1. INSERT/UPDATE no Supabase (items + edges + events)
      2. Wrap commitado com body JSONB estruturado
      3. [Se export ativo] Gera Google Doc no Drive (mod-[x]/...)
      4. [Se export ativo] Gera .md mirror no Drive (mesmo folder)
    → MindRoot renderiza resultado
```

**Export to Drive:** manual — botão "Export to Drive" em qualquer item estágio 3+. Wraps NÃO geram export automático (decisão v5 #2). O Drive é impressora, não destino obrigatório.

### 8.4 Convenção de Nomes

**Escopo:** formato de display e de exportação. No Supabase, os campos `type`, `module`, `title` são separados. A naming convention se aplica quando um item é exportado pro Drive ou referenciado em contexto técnico.

**Formato:** `[prefixo]_[tipo]_[descrição-curta]_[versão-ou-data].ext`

**Exemplos:**

| Item | Nome no export |
|------|---------------|
| Schema v2 | `system_spec_atom-genesis-v4-schema-v2_2026-03-25.md` |
| Checkpoint de projeto | `mod-work_checkpoint_[projeto]_2026-03-21` |
| Receita carbonara | `mod-body_recipe_carbonara-classica` |
| Reflexão pessoal | `mod-mind_reflection_[descrição-curta]` |
| Wrap do dia | `system_wrap_2026-03-25` |
| Session log | `system_session-log_2026-03-25_[contexto]` |
| Podcast capturado | `mod-mind_podcast_[show]-[episodio-ou-tema]` |

**Regras:**
1. Tudo minúsculo
2. Hífens entre palavras dentro de cada segmento
3. Underscores separam os segmentos (módulo, tipo, descrição, versão/data)
4. Versão só quando o documento é versionado (specs, schemas). Docs datados usam data
5. Extensão `.md` pros exports Obsidian. Google Docs não têm extensão no Drive
6. `system_` substitui `mod-[x]_` pra documentos de infraestrutura (schemas, wraps, logs, templates)
7. O humano nunca precisa pensar em nomes. O agente nomeia. O sistema aplica automaticamente nos exports.

### 8.5 Estrutura de pastas (destino de exports)

```
Atom Drive/
├── inbox/
├── mod-work/
│   ├── project-[nome]/
│   ├── library/
│   └── logs/
├── mod-body/
│   ├── library/
│   └── logs/
├── mod-mind/
│   ├── library/
│   └── logs/
├── mod-family/ ...
├── mod-purpose/ ...
├── mod-bridge/ ...
├── mod-finance/ ...
├── mod-social/ ...
└── system/
    ├── templates/
    ├── prompts/
    └── logs/
```

**Regra de crescimento:** pastas só são criadas quando o primeiro export vai pra lá. Estrutura vazia não existe.

### 8.6 Templates como dados (type_schemas)

Templates deixam de ser documentos no Drive e passam a ser configuração centralizada. O MindRoot e o triage engine consultam diretamente — sem parsing de documento, sem risco de desalinhamento.

**Implementação (decisão v5 #1):** `type-schemas.json` no repo (`src/config/type-schemas.json`), carregado pelo MindRoot no build. Helper tipado em `src/config/types.ts` exporta funções `getTypeSchema()`, `getFloorStage()`, `getDefaultModule()`, `hasBodySchema()`, `getExtensions()`.

**Estrutura por type:**
```json
{
  "floor_stage": 3,
  "default_module": "body",
  "has_body_schema": true,
  "body_schema": { "campo": { "type": "string", "description": "..." } },
  "extensions": ["recurrence"],
  "naming": "mod-body_workout_[description]",
  "drive_dest": "mod-body/library/",
  "usage_notes": "Orientações pro agente/UI"
}
```

23 types cobertos. Migra pra tabela SQL (`type_schemas`) se/quando precisar de types dinâmicos (ex: usuário criando types customizados). Esse futuro não é agora.

Os templates existentes no Drive viram referência histórica. O conteúdo já migrou pro `type-schemas.json`.

---

## Parte 9 — Serialização por Sistema

O item vive no Supabase. Quando exportado, pode ser representado em dois formatos adicionais:
- **Supabase:** rows + JSONB (fonte canônica)
- **Google Docs:** ATOM ENVELOPE (formato de export — tabela visual no topo, legível por humanos)
- **Obsidian .md:** YAML frontmatter + `[[wikilinks]]` (formato de export — legível por Obsidian Graph View)

O UUID é o elo. Mesmo id no Supabase, no ATOM ENVELOPE, e no YAML.

### 9.1 Supabase (fonte canônica)
→ Row na tabela `items`. Extensions no `body` JSONB. Connections na tabela `item_connections`. Eventos na tabela `atom_events`. Esta é a representação autoritativa — todas as outras são derivadas.

### 9.2 Google Drive — ATOM ENVELOPE (formato de export)

O ATOM ENVELOPE é uma tabela no topo de um Google Doc que serializa os campos core do schema de forma legível. Gerado sob demanda quando um item é exportado pro Drive.

**Formato:**

```
╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [UUID]                     ║
║ type:     [AtomType]                 ║
║ module:   [AtomModule]               ║
║ state:    [AtomState]                ║
║ status:   [AtomStatus]               ║
║ stage:    [1-7] [geometria]          ║
║ tags:     [tag1, tag2, ...]          ║
║ source:   [AtomSource]               ║
║ created:  [YYYY-MM-DD]              ║
║ updated:  [YYYY-MM-DD]              ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → [relation]: [título do target]   ║
║   → [relation]: [título do target]   ║
╚══════════════════════════════════════╝
```

**Regras:**
- O envelope é a primeira coisa no documento exportado, antes de qualquer conteúdo
- Campos opcionais (project_id, naming_convention, extensions) só aparecem quando preenchidos
- Connections usam título legível, não UUID (UUID vive no Supabase)
- Se o doc exportado for re-importado, o UUID garante a reconciliação

**Mínimo operável (9 campos):**
`id`, `type`, `module`, `state`, `status`, `tags`, `source`, `created`, `updated`

### 9.3 Obsidian (formato de export sob demanda)
→ Arquivo .md com YAML frontmatter + corpo. Gerado a partir do Supabase por script ou botão no MindRoot. Não há sync contínuo — é geração explícita.

Connections renderizam como `[[links]]`:
```markdown
## Connections
- belongs_to:: [[project-name]]
- feeds:: [[related-item]]
```

---

## Parte 10 — Tags Semânticas Reservadas

| Prefixo | Exemplo | Significado |
|---------|---------|-------------|
| `#mod_*` | `#mod_work` | Módulo (parsing) |
| `#focus` | `#focus` | Focus block do dashboard |
| `#milestone` | `#milestone` | Milestone de projeto |
| `#chore` | `#chore` | Trabalho invisível |
| `#who:*` | `#who:flora` | Pessoa envolvida |
| `#mood:*` | `#mood:calmo` | Estado emocional |
| `#ritual:*` | `#ritual:aurora` | Vinculado a ritual |
| `#project:*` | `#project:atlas` | Contexto de projeto |
| `#seed` | `#seed` | Item gerado por entropia |
| `#seed:rejected` | `#seed:rejected` | Seed rejeitada pelo humano → archived, preservada no grafo |

---

## Parte 11 — Exemplo: Do Ponto ao Círculo

Um item real passando pelos 7 estágios em tempo real.

### Contexto
O usuário tá no meio de uma sessão de deep work e lembra: "quero experimentar aquele ramen do centro."

### Estágio 1 — Ponto · (Captura)
O usuário digita:
> "experimentar aquele ramen do centro"

O agente cria item:
```
title: "experimentar aquele ramen do centro"
state: inbox
genesis_stage: 1
source: claude-project
```
**Tempo: 2 segundos.**

### Estágio 2 — Linha — (Intenção)
Auto-triage classifica com 94% de confiança (tipo passivo → threshold 90%):
```
type: recommendation
module: body
tags: [#mod_body]
state: classified
genesis_stage: 2
```
**Auto-classificado. Sem interrupção.**

### Estágio 3 — Triângulo △ (Estrutura)
Template de recommendation aplicado. UUID gerado. Body preenchido:
```
id: a1b2c3d4-...
body: {
  "category": "restaurante",
  "recommended_by": "self",
  "source_url": null,
  "why": "curiosidade",
  "rating": null
}
naming_convention: "mod-body_recommendation_ramen-centro"
state: structured
genesis_stage: 3
```
**Automático. O usuário nem percebe.**

### Estágio 4 — Quadrado □ (Fundação)
4 portões validados:
1. ✓ Item registrado (ativo)
2. ✓ Template de recommendation existe
3. ✓ Item será incluído no próximo wrap
4. ✓ Prompt de conexão respondido (ver estágio 5)

```
state: validated
genesis_stage: 4
```

### Estágio 5 — Pentágono ⬠ (Conexão)
O agente pergunta: "isso se conecta com algo?"

Usuário: "é pra experimentar no sábado, adiciona no plano da semana."
```
item_connections: {
  source: "ramen-centro",
  target: "meal-plan-semana",
  relation: "belongs_to"
}
state: connected
genesis_stage: 5
```

### Estágio 6 — Hexágono ⬡ (Ativação)
Evento registrado: a adição do ramen ao meal plan dispara atualização na lista de compras conectada.
```
atom_events: {
  source: "ramen-centro",
  target: "meal-plan-semana",
  event_type: "item_added",
  payload: { "note": "sábado" }
}
state: propagated
genesis_stage: 6
```

### Estágio 7 — Círculo ○ (Completude)
No wrap do dia:
```
CREATED:
  - ○ type:recommendation "experimentar aquele ramen do centro" → mod-body/library/

CONNECTIONS:
  - ramen-centro → belongs_to → meal-plan-semana
```

O agente executor commita:
1. INSERT no Supabase
2. Google Doc criado em mod-body/library/ com ATOM ENVELOPE
3. .md mirror criado no mesmo folder
4. Obsidian sincroniza → nó visível no Graph View

```
state: committed
genesis_stage: 7
```

**Tempo total: ~30 segundos de conversa + commit automático no wrap.**

### O ciclo continua
Semanas depois, o item permanece inativo. Threshold de inatividade atinge. No wrap:

```
SEEDS:
  - "ramen do centro nunca visitado — ainda quer ir?" → [usuário decide]
```

Se "não": item decai. `state: archived`. Nó permanece no grafo como histórico.
Se "sim, sábado que vem": seed vira novo ponto. Ciclo reinicia.

**Nada se perde. Entropia é reciclagem, não destruição.**

---

## Parte 12 — Fronteira Genesis vs Marco Zero

O Genesis define O QUE (schema, state machine, motores, serialização). O Marco Zero define COMO e QUANDO (ritual diário, cockpit, audit ritual, regras Claude). Separação de responsabilidades:

| Assunto | Vive no | Motivo |
|---------|---------|--------|
| 7 estágios, pisos, FSM | Genesis | É schema |
| Audit queries (SQL) | Genesis | É schema |
| Audit ritual (aurora/crepúsculo, quando rodar) | Marco Zero | É operacional |
| Cockpit modes (Construir, Planejar, Operar, Captura) | Marco Zero | É operacional |
| Soul Layer (campos, extensions) | Genesis | É schema |
| Soul Layer (quando perguntar, linguagem) | Marco Zero | É operacional |
| Serialização (ATOM ENVELOPE, YAML, SQL) | Genesis | É schema |
| Convenção de nomes | Genesis | É schema |
| Ritual do dia (Aurora, Zênite, Crepúsculo) | Marco Zero | É operacional |
| DAG cycle detection | Futuro (Supabase RPC) | Não implementado ainda |

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| Genesis 1.0 | 25 Mar 2026 | 7 estágios iniciais |
| Genesis 2.0 | 25 Mar 2026 | Propagação substitui review |
| Genesis 3.0 | 25 Mar 2026 | Entropia, pisos, morph, LLM-assist |
| Genesis 4.0 + Schema 2.0 | 25 Mar 2026 | Consolidação definitiva. Fusão Genesis + Schema + Gemini BDD + Framework. Tabela edges, atom_events, FSM downgrades, fóssil, 3-tier auto-triage, extensions JSONB |
| Genesis 4.1 + Schema 2.0 | 25 Mar 2026 | Gaps fechados: formato wrap, ATOM ENVELOPE, convenção de nomes, exemplo completo. Personalização removida — documento é protocolo puro |
| Genesis 4.2 + Schema 2.0 | 27 Mar 2026 | 17 gaps auditados e incorporados: born-committed exception, estágio 6 opcional, threshold 30d, template from use, connection prompt no estágio 4, seeds rejeitadas archived, session_log naming, source TEXT/enum split, parent_id removido, extensions mapeadas por uso, fronteira Genesis/Marco Zero definida. Fix Gemini: trigger de órfão agora checa piso mínimo antes de downgrade |
| Genesis 4.2.1 + Schema 2.0 | 31 Mar 2026 | Arquitetura Cósmica nomeada (Part 1.4) — revela PHI e geometria sagrada já presentes no design. Regra inbox obrigatório. Zero mudanças estruturais. |
| Genesis 5.0 + Schema 2.0 | 01 Abr 2026 | Revisão arquitetural: Supabase é source of truth (ponte eliminada). Drive→export sob demanda. Obsidian→export sob demanda. MindRoot→porta da frente. Wrap→body JSONB estruturado. Templates→type_schemas centralizados. Naming→display/export format. Raiz integrado (seção 4): 9 domínios × 7 estágios, onboarding + feature permanente. Parts 1-7, 10-12 intactas. |
| Genesis 5.0.1 + Schema 2.0 | 01 Abr 2026 | 5 decisões fechadas: §8.6 type_schemas=JSON config no repo (não SQL), §8.3 export Drive=manual só (não automático), Obsidian=export sob demanda (mantém), migração=recriar no MindRoot, timeline=implementar enquanto documenta. type-schemas.json criado com 23 types. |

---

*Este documento é o Marco Zero do Atom Engine.*
*O schema é o contrato. Os sistemas são consumidores.*
*Se não está aqui, não existe.*
