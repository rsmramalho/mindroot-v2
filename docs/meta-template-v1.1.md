# Atom Meta-Template v1.1
## O Molde dos Moldes

**Versão:** 1.1
**Data:** 01 Abr 2026
**Status:** Definitive
**Referência:** Genesis v5 + AtomItem Schema v2
**Princípio:** Se a geometria deste documento estiver perfeita, todo template que nascer dele herda essa geometria.

---

## 1 — O que é isto

Este documento define a ESTRUTURA EXATA que todo template de type segue. Não é um exemplo — é o contrato. Qualquer agente que receba este meta-template + Genesis v5 pode gerar o template de qualquer type automaticamente, sem intervenção humana.

**Nota Genesis v5:** os formatos definidos aqui (ATOM ENVELOPE e YAML frontmatter) são formatos de **serialização e export**. A fonte canônica de todo item é o Supabase. Estes formatos se aplicam quando um item é exportado pro Google Drive ou pro Obsidian. A estrutura, campos, e ordem são idênticos — o que muda é o papel: de "formato da fonte" para "formato de export."

**Duas categorias de types:**
- **Types COM body schema** (10): recipe, workout, ritual, review, spec, checkpoint, session-log, recommendation, podcast, article
- **Types SEM body schema** (13): project, task, habit, note, reflection, resource, list, log, doc, research, template, lib, wrap

A diferença entre as duas categorias é UMA seção: `## Body`. Todo o resto é idêntico.

---

## 2 — Formato Google Doc (ATOM ENVELOPE) — export

Todo Google Doc exportado pro Atom Drive começa com o ATOM ENVELOPE. Nada antes dele. O conteúdo vem depois.

### 2.1 Envelope — campos fixos (ordem obrigatória)

```
╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [UUID v4]                  ║
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
╚══════════════════════════════════════╝
```

### 2.2 Campos condicionais (aparecem ENTRE updated e connections, quando preenchidos)

```
║ project:  [título do projeto]        ║
║ naming:   [naming_convention]        ║
```

### 2.3 Regras do envelope

1. Ordem dos campos é FIXA — nunca reordena
2. Campos condicionais só aparecem quando preenchidos
3. `stage` usa formato: `[número] [nome da geometria]` (ex: `3 △ Triângulo`)
4. `connections` usa títulos legíveis, não UUIDs
5. Se não há connections: seção connections mostra `(nenhuma)`
6. Geometrias: `1 · Ponto` | `2 — Linha` | `3 △ Triângulo` | `4 □ Quadrado` | `5 ⬠ Pentágono` | `6 ⬡ Hexágono` | `7 ○ Círculo`

---

## 3 — Formato Obsidian (.md mirror) — export sob demanda

Todo item exportado pro Obsidian tem um .md file. Gerado a partir do Supabase por script ou botão no MindRoot.

### 3.1 Frontmatter — campos fixos (ordem obrigatória)

```yaml
---
id: [UUID v4]
title: "[título]"
type: [AtomType]
module: [AtomModule]
state: [AtomState]
status: [AtomStatus]
genesis_stage: [1-7]
tags: [tag1, tag2]
source: [AtomSource]
created_at: [ISO-8601 com timezone AEST]
updated_at: [ISO-8601 com timezone AEST]
connections:
  - target: [slug-do-target]
    relation: [AtomRelation]
---
```

### 3.2 Campos condicionais (aparecem ENTRE updated_at e connections, quando preenchidos)

```yaml
project_id: [UUID]
naming_convention: [string]
```

### 3.3 Corpo do .md (abaixo do frontmatter)

```markdown
[Conteúdo livre — notes, body renderizado, ou texto do documento]

## Connections
- [relation]:: [[slug-do-target]]
```

### 3.4 Regras do .md

1. Ordem dos campos YAML é FIXA — espelha o envelope
2. `title` sempre entre aspas no YAML (proteção contra caracteres especiais)
3. `tags` como array YAML inline: `[tag1, tag2]`
4. `connections` aparece DUAS VEZES: no frontmatter (pra queries) e no corpo (pra Graph View via `[[wikilinks]]`)
5. Timestamps usam timezone AEST (UTC+10): `2026-03-29T08:30:00+10:00`
6. Se não há connections: campo `connections` mostra `[]` no frontmatter, seção `## Connections` é omitida no corpo

---

## 4 — Campos Core (referência completa)

Extraído de Genesis v5, Parte 4.1.

| Campo | Tipo | Quando ativa | Obrigatório? | Default |
|-------|------|-------------|-------------|---------|
| `id` | UUID v4 | Estágio 3 | Sim (3+) | Gerado |
| `title` | string | Estágio 1 | Sim | Texto bruto da captura |
| `type` | AtomType | Estágio 2 | Sim (2+) | — |
| `module` | AtomModule | Estágio 2 | Sim (2+) | Varia por type (ver Type Registry) |
| `tags` | string[] | Qualquer | Não | `[]` |
| `status` | AtomStatus | Qualquer | Sim | `inbox` |
| `state` | AtomState | Estágio 1 | Sim | `inbox` |
| `genesis_stage` | 1-7 | Estágio 1 | Sim | `1` |
| `project_id` | UUID \| null | Estágio 4+ | Não | `null` |
| `naming_convention` | string \| null | Estágio 4+ | Não | `null` |
| `notes` | string \| null | Estágio 3+ | Não | `null` |
| `body` | JSON | Estágio 3+ | Não | `{}` |
| `source` | AtomSource | Criação | Sim | Onde foi criado |
| `created_at` | ISO-8601 | Criação | Sim | NOW() |
| `updated_at` | ISO-8601 | Criação | Sim | NOW() |
| `created_by` | string \| null | Criação | Não | Sessão/agente |

**Nota:** `user_id` existe no banco mas NÃO aparece no envelope nem no frontmatter (é implícito — o dono do Drive/vault).

---

## 5 — Extensions (opt-in, vivem no body)

Extensions são blocos JSON que vivem dentro do campo `body`. O template de cada type define QUAIS extensions fazem sentido. Não existe mapeamento universal — o primeiro item real de um type define quais extensions ele usa.

### 5.1 Extension: Soul

**Candidatos naturais:** reflection, ritual, wrap, log, note, session-log
**Quando usar:** item tem dimensão emocional ou pertence a um ritual

```json
{
  "soul": {
    "energy_level": "high | medium | low",
    "emotion_before": "string (linguagem livre)",
    "emotion_after": "string (linguagem livre)",
    "needs_checkin": true | false,
    "ritual_slot": "aurora | zenite | crepusculo | null"
  }
}
```

### 5.2 Extension: Operations

**Candidatos naturais:** task, project, spec, checkpoint, habit
**Quando usar:** item tem prazo, prioridade, ou progresso

```json
{
  "operations": {
    "priority": "high | medium | low",
    "deadline": "ISO-8601",
    "due_date": "YYYY-MM-DD",
    "project_status": "draft | active | paused | completed | archived",
    "progress_mode": "auto | milestone | manual",
    "progress": 0-100
  }
}
```

### 5.3 Extension: Recurrence

**Candidatos naturais:** habit, ritual, review
**Quando usar:** item se repete com frequência definida

```json
{
  "recurrence": {
    "rule": "RRULE string (iCalendar RFC 5545)",
    "last_completed": "ISO-8601",
    "streak_count": 0,
    "completion_log": []
  }
}
```

### 5.4 Regras de extensions

1. Extensions vivem DENTRO do `body` JSONB — são irmãos dos campos específicos do type
2. Campos de extension são TODOS opcionais — nenhum é obrigatório dentro do bloco
3. Um type pode usar 0, 1, 2 ou 3 extensions
4. A decisão de quais extensions um type usa é registrada no template desse type
5. Extensions NÃO aparecem no ATOM ENVELOPE (são internas ao body)
6. No .md mirror, extensions renderizam dentro do `body:` no frontmatter YAML

---

## 6 — Body Schema (campos específicos por type)

### 6.1 Types COM body schema

O `body` contém campos específicos do type + extensions aplicáveis. Estrutura:

```json
{
  // Campos específicos do type (definidos no Type Registry, Genesis Part 4.4)
  "campo1": "valor",
  "campo2": ["array"],

  // Extensions (quando aplicáveis)
  "soul": { ... },
  "operations": { ... },
  "recurrence": { ... }
}
```

**No Google Doc:** campos do body renderizam como conteúdo estruturado ABAIXO do envelope.
**No .md mirror:** campos do body vivem no frontmatter YAML dentro de `body:` E renderizam como conteúdo legível abaixo do frontmatter.

### 6.2 Types SEM body schema

O `body` contém APENAS extensions (se aplicáveis). Conteúdo vive em `notes`.

```json
{
  // Sem campos específicos — conteúdo vive em notes
  // Extensions quando aplicáveis:
  "operations": { ... }
}
```

**No Google Doc:** conteúdo é texto livre abaixo do envelope (campo `notes`).
**No .md mirror:** conteúdo é markdown livre abaixo do frontmatter.

---

## 7 — Layout do Conteúdo (abaixo do envelope/frontmatter)

A ordem do conteúdo abaixo do envelope é FIXA pra todo type:

### Google Doc:
```
[ATOM ENVELOPE]

## [Título do item]

[Conteúdo — notes e/ou body renderizado]

## Connections
→ [relation]: [título do target]
```

### .md mirror:
```
[YAML frontmatter]

[Conteúdo — notes e/ou body renderizado como markdown]

## Connections
- [relation]:: [[slug-do-target]]
```

### Regras de layout:
1. Título como H2 é a primeira coisa depois do envelope
2. Conteúdo segue — formato depende do type (texto livre, listas, tabelas)
3. `## Connections` é SEMPRE a última seção (quando existe)
4. Seções vazias são omitidas — não existe "## Connections" vazio

---

## 8 — Convenção de Nomes

**Formato:** `[prefixo]_[tipo]_[descrição-curta]_[versão-ou-data].ext`

### Prefixo:
- `mod-[módulo]` para items de módulos (ex: `mod-body`, `mod-work`, `mod-mind`)
- `system` para infraestrutura (wraps, logs, templates, schemas)

### Regras:
1. Tudo minúsculo
2. Hífens (`-`) entre palavras dentro de cada segmento
3. Underscores (`_`) separam segmentos (prefixo, tipo, descrição, versão/data)
4. Versão (`v1-0`) para documentos versionados (specs, schemas, templates)
5. Data (`2026-03-29`) para documentos datados (wraps, logs, checkpoints)
6. Sem versão/data para documentos atemporais (receitas, reflexões, notas)
7. `.md` para mirrors Obsidian. Google Docs sem extensão
8. O agente nomeia. O humano nunca pensa em nomes.

### Exemplos por type:
| Type | Nome | Destino |
|------|------|---------|
| recipe | `mod-body_recipe_carbonara-classica` | mod-body/library/ |
| workout | `mod-body_workout_calistenia-basica` | mod-body/library/ |
| spec | `mod-work_spec_atom-os-vision_v0-1` | mod-work/project-atom-engine/ |
| checkpoint | `mod-work_checkpoint_atom-engine_2026-03-29` | mod-work/project-atom-engine/ |
| wrap | `system_wrap_2026-03-29` | system/logs/ |
| session-log | `system_session-log_2026-03-29_contexto` | system/logs/ |
| template | `system_template_[type]_v1-0` | system/templates/ |
| note | `mod-mind_note_[descrição]` | mod-mind/logs/ |
| reflection | `mod-mind_reflection_[descrição]` | mod-mind/logs/ |
| task | `mod-work_task_[descrição]` | mod-work/ ou project-[x]/ |
| project | `mod-work_project_[nome]` | mod-work/project-[nome]/ |
| recommendation | `mod-[x]_recommendation_[descrição]` | mod-[x]/library/ |
| podcast | `mod-mind_podcast_[show]-[tema]` | mod-mind/library/ |
| article | `mod-mind_article_[autor]-[tema]` | mod-mind/library/ |
| ritual | `mod-purpose_ritual_[nome]` | mod-purpose/rituals/ |
| habit | `mod-[x]_habit_[descrição]` | mod-[x]/ |

---

## 9 — Protocolo de Auto-Geração de Templates

Quando o PRIMEIRO item de um type novo aparece e não existe template pra esse type, o agente segue este protocolo:

### Passo 1 — Identificar categoria
O type tem body schema definido no Genesis v5, Part 4.4?
- **SIM:** usar os campos listados no Type Registry como base
- **NÃO:** template usa apenas notes + tags (sem body específico)

### Passo 2 — Mapear extensions
Perguntar (internamente, sem interromper o humano):
- Este type tem dimensão emocional ou ritual? → Soul
- Este type tem prazo, prioridade ou progresso? → Operations
- Este type se repete com frequência? → Recurrence

### Passo 3 — Criar template seguindo este meta-template
O template é um AtomItem de type `template`:
- Tem ATOM ENVELOPE
- Tem .md mirror
- `type: template`
- `module: bridge`
- `tags: [#template, #type:[nome-do-type]]`
- Vive em `system/templates/`
- Nome: `system_template_[type]_v1-0`

### Passo 4 — Conteúdo do template
O template documenta:

```markdown
## [Type Name] Template

### Piso mínimo
[Estágio] — [lógica do Genesis Part 2]

### Module default
[AtomModule] — pode ser overridden

### Body schema
[campos com tipos — ou "Sem body schema. Usa notes + tags."]

### Extensions
[quais extensions este type usa e por quê]

### Exemplo de ATOM ENVELOPE
[envelope preenchido com dados fictícios]

### Exemplo de YAML frontmatter
[frontmatter preenchido com dados fictícios]

### Exemplo de conteúdo
[conteúdo abaixo do envelope com dados fictícios]

### Notas de uso
[orientações específicas para o agente — quando usar este type, nuances]
```

### Passo 5 — Validar via checklist (Seção 10)

### Passo 6 — Commitar
Template entra no wrap como CREATED. Claude Code commita no Drive + .md mirror.

---

## 10 — Checklist de Validação (Cross-Check)

Todo template, antes de ser commitado, passa por esta checklist. Se qualquer item falhar, o template não está pronto.

### 10.1 Integridade estrutural
- [ ] ATOM ENVELOPE tem TODOS os 9 campos mínimos na ordem correta?
- [ ] YAML frontmatter espelha o envelope campo por campo?
- [ ] Ordem dos campos é idêntica ao meta-template?
- [ ] Campos condicionais estão no lugar correto (entre `updated` e `connections`)?
- [ ] Connections aparecem duas vezes no .md (frontmatter + corpo)?

### 10.2 Consistência com Genesis v5
- [ ] `type` é um valor válido do enum AtomType?
- [ ] `module` default bate com o Type Registry (Part 4.4)?
- [ ] Piso mínimo bate com a tabela de pisos (Part 2)?
- [ ] Body schema bate com o Type Registry (Part 4.4)?
- [ ] Extensions listadas fazem sentido para este type?

### 10.3 Geometria cross-template
- [ ] Sobrepondo este template com qualquer outro, as ÚNICAS diferenças são: type, body fields, extensions, module default?
- [ ] Layout do conteúdo segue a mesma ordem (título → conteúdo → connections)?
- [ ] Naming convention segue o formato exato?
- [ ] Destino no Drive segue o mapeamento correto?

### 10.4 Operabilidade
- [ ] Um Claude limpo, lendo APENAS este template + Genesis, consegue criar um item válido?
- [ ] Os exemplos fictícios são realistas o suficiente para servir de guia?
- [ ] As notas de uso cobrem edge cases comuns?

---

## 11 — Born Committed (exceções ao pipeline)

Dois types nascem completos no estágio 7, sem passar pelo pipeline:

| Type | Comportamento |
|------|--------------|
| `wrap` | Nasce no estágio 7. Formato fixo (Genesis Part 3.4). Template é o formato do wrap. |
| `session-log` | Nasce no estágio 7. Body schema definido. Template segue o meta-template normal. |

Estes types NÃO precisam de auto-triage, validação, ou prompt de conexão. O agente os cria já completos.

---

## 12 — Location e Participants (decisão 29 Mar 2026)

**Decisão:** location e participants NÃO entram no core. Resolvidos via tags semânticas.

| Conceito | Tag | Exemplo | Uso |
|----------|-----|---------|-----|
| Participante | `#who:*` | `#who:de`, `#who:flora` | Pessoa envolvida no item |
| Localização | `#location:*` | `#location:fazendinha`, `#location:brendale` | Onde acontece/aconteceu |

**Motivos:**
- Core continua enxuto (princípio Genesis: "o schema é o contrato")
- `#who:*` já existia como tag semântica reservada (Genesis Part 10)
- `#location:*` segue o mesmo padrão
- Location só faz sentido pra tipos específicos — não pra spec, wrap, ou note
- Se no futuro precisar de localização estruturada (lat/long, endereço), vira extension nova — mas esse futuro não é agora

**No body schema de types específicos:** workout e recommendation PODEM ter campos de location no body (ex: `"location": "Fazendinha Mt Samson"`) quando o template desse type definir. A tag `#location:*` é pra queries cross-type. Ambos coexistem.

---

## 13 — Espaços Protegidos

Nem tudo no Atom Drive é um AtomItem. Alguns espaços existem fora da geometria por design.

| Espaço | Regra |
|--------|-------|
| `O Espaço Entre` | Protegido. Sem naming, sem pipeline, sem audit. O agente nunca toca, nunca organiza, nunca questiona. |
| `.obsidian/` | Config do Obsidian. Não é conteúdo. |

**Princípio:** O sistema serve a pessoa, não o contrário. Se algo precisa existir fora do sistema, o sistema respeita.

---

## 14 — Referência Rápida: Enums Válidos

### AtomType (23 valores)
`note` `reflection` `recommendation` `podcast` `article` `resource` `list` `task` `habit` `recipe` `workout` `spec` `checkpoint` `project` `session-log` `wrap` `ritual` `review` `log` `doc` `research` `template` `lib`

### AtomModule (8 valores)
`work` `body` `mind` `family` `purpose` `bridge` `finance` `social`

### AtomState (8 valores)
`inbox` `classified` `structured` `validated` `connected` `propagated` `committed` `archived`

### AtomStatus (8 valores)
`inbox` `draft` `active` `paused` `waiting` `someday` `completed` `archived`

### AtomRelation (8 valores)
`belongs_to` `blocks` `feeds` `mirrors` `derives` `references` `morphed_from` `extracted_from`

### AtomSource (11 valores)
`claude-project` `claude-chat` `claude-chrome` `claude-code` `mindroot` `constellation` `obsidian` `drive` `monday` `manual` `atom-engine`

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 29 Mar 2026 | Documento inicial — meta-template completo + decisão location/participants via tags |
| 1.1 | 01 Abr 2026 | Genesis v5: ATOM ENVELOPE e YAML redefinidos como formatos de export (fonte canônica = Supabase). Seções 2 e 3 anotadas. Referências atualizadas. |

---

*Este é o molde dos moldes. Se a geometria aqui estiver perfeita, todo template que nascer herda essa perfeição. Se estiver quebrada, o sistema inteiro contamina.*
