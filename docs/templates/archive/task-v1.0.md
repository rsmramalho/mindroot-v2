---
title: "ATOM ENVELOPE — TASK TEMPLATE v1.0"
version: "1.0"
date: "2026-03-29"
status: "definitive"
type: "meta"
module: "engine"
piso: 0
referencia: "Genesis v4.2 + AtomItem Schema v2 + tmpl_meta v1.0"
tags:
  - atom-engine
  - template
  - task
---


# ATOM ENVELOPE — TASK TEMPLATE v1.0


**Type:** task
**Piso mínimo:** 3 (Prática / Execução)
**Module default:** work
**Body schema:** NÃO — usa campo `notes` para conteúdo
**Extensions disponíveis:** Operations
**Born committed:** não recomendado (tasks têm ciclo de vida próprio)


---


## 1. Envelope Obrigatório


### 1.1 Campos Core


```yaml
id: ""                    # UUID v4 — gerado automaticamente
title: ""                 # Título da tarefa — ação clara e específica
type: "task"
status: "draft"           # draft | in_progress | committed | blocked | cancelled | archived
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 3                   # Mínimo 3 — tasks são execução
module: "work"            # work (default) | life | body | mind — depende do contexto
tags: []                  # ex: ["backend", "api", "sprint-12"]
notes: ""                 # Descrição detalhada, contexto, critérios de aceitação
```


### 1.2 Campos Opcionais Universais


```yaml
due_date: ""              # ISO date — prazo da tarefa (muito recomendado)
priority: ""              # low | medium | high | critical
parent_id: ""             # UUID de projeto ou epic pai
linked_items: []          # UUIDs relacionados (PRs, docs, outras tasks)
morphed_from: ""          # UUID + type de origem (ex: morphed de uma idea)
born_committed: false     # Quase sempre false para tasks
```


---


## 2. Body Schema


**Tasks NÃO têm body schema estruturado.**


O conteúdo da tarefa vai inteiramente no campo `notes`. Use Markdown para estruturar:


```markdown
# Notas da Task


## Contexto
Descrição do problema ou oportunidade que esta task resolve.


## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3


## Notas Técnicas
Detalhes de implementação, decisões tomadas, links relevantes.


## Subtasks
- [ ] Subtask A
- [ ] Subtask B
```


---


## 3. Extension: Operations


Use quando a task está dentro de um contexto de gestão de projeto/sprint.


```yaml
operations:
  assignee: ""            # Nome ou ID do responsável
  sprint: ""              # Nome ou ID do sprint (ex: "Sprint-12", "2026-Q1-W13")
  estimate_hours: 0.0     # Float — estimativa em horas
  actual_hours: 0.0       # Float — horas reais gastas (preencher ao fechar)
  blockers: []            # Lista de strings — o que está impedindo
  pr_url: ""              # URL do Pull Request quando aplicável
```


---


## 4. Exemplo Completo


### 4.1 Exemplo YAML — GitHub Repo Task


```yaml
id: "d4e5f6a7-b8c9-0123-defa-234567890123"
title: "Implementar endpoint GET /api/v2/items com paginação"
type: "task"
status: "in_progress"
created_at: "2026-03-29T09:00:00+10:00"
updated_at: "2026-03-29T15:30:00+10:00"
piso: 3
module: "work"
tags:
  - backend
  - api
  - paginação
  - sprint-12
  - atom-engine
due_date: "2026-04-04"
priority: "high"
parent_id: "e5f6a7b8-c9d0-1234-efab-345678901234"
linked_items:
  - "f6a7b8c9-d0e1-2345-fabc-456789012345"
notes: |
  ## Contexto
  O endpoint atual GET /api/v1/items retorna todos os itens sem paginação, causando timeouts para usuários com mais de 500 items. Precisamos de paginação cursor-based na v2.


  ## Critérios de Aceitação
  - [ ] Endpoint responde em < 200ms para qualquer tamanho de coleção
  - [ ] Suporte a parâmetros: limit (default 20, max 100), cursor
  - [ ] Response inclui next_cursor e total_count
  - [ ] Testes unitários com cobertura > 80%
  - [ ] Documentação OpenAPI atualizada


  ## Notas Técnicas
  Usar cursor-based pagination (não offset) para consistência em coleções que mudam frequentemente. Cursor = base64(last_item_id + timestamp).


  Referência: https://engineering.example.com/cursor-pagination


  ## Subtasks
  - [x] Definir schema da response
  - [ ] Implementar lógica de cursor
  - [ ] Escrever testes
  - [ ] Atualizar docs


operations:
  assignee: "Rafael"
  sprint: "Sprint-12"
  estimate_hours: 8.0
  actual_hours: 3.5
  blockers:
    - "Aguardando definição do schema de erro padrão da API v2 (issue #234)"
  pr_url: "https://github.com/org/atom-engine/pull/89"
```


### 4.2 Exemplo Google Doc


**Título do Doc:** TASK — Implementar endpoint GET /api/v2/items com paginação (2026-03-29)


**Body text:**


---
**Status:** In Progress | **Prioridade:** High | **Prazo:** 2026-04-04
**Responsável:** Rafael | **Sprint:** Sprint-12 | **Estimativa:** 8h | **Real:** 3.5h
**PR:** https://github.com/org/atom-engine/pull/89


**Contexto:**
O endpoint atual GET /api/v1/items retorna todos os itens sem paginação, causando timeouts para usuários com mais de 500 items. Precisamos de paginação cursor-based na v2.


**Critérios de Aceitação:**
- [ ] Endpoint responde em < 200ms
- [ ] Parâmetros: limit (default 20, max 100), cursor
- [ ] Response inclui next_cursor e total_count
- [ ] Testes unitários > 80% cobertura
- [ ] Documentação OpenAPI atualizada


**Bloqueadores:**
- Aguardando definição do schema de erro padrão da API v2 (issue #234)


**Subtasks:**
- [x] Definir schema da response
- [ ] Implementar lógica de cursor
- [ ] Escrever testes
- [ ] Atualizar docs


---


---


## 5. Notas de Uso


- **Piso 3** é o mínimo porque tasks são execução. Tasks estratégicas de alto impacto podem ir para piso 4 ou 5, mas a maioria das tasks operacionais fica em 3.
- **Module work** é o default, mas tasks pessoais (pagar uma conta, marcar consulta) usam `module: "life"`.
- **SEM body schema** — todo o conteúdo estruturado vai em `notes` como Markdown. Isso dá máxima flexibilidade.
- **Extension Operations** é fortemente recomendada para tasks de trabalho em equipe ou projetos. Para tasks pessoais, não é necessária.
- `status: "blocked"` deve sempre ter o campo `operations.blockers` preenchido com o motivo.
- `due_date` é altamente recomendado — tasks sem prazo tendem a nunca serem feitas.
- Para tasks grandes, considere usar type `project` em vez de task, e quebrar em tasks menores com `parent_id` apontando para o projeto.
- O título deve ser uma **ação clara**: começa com verbo. "Implementar X", "Revisar Y", "Decidir Z", não "X precisa ser feito".
- `actual_hours` deve ser preenchido ao mover para `status: committed` — útil para calibrar estimativas futuras.
- Links para PRs, issues, docs devem ir em `linked_items` (UUIDs de outros AtomItems) ou em `operations.pr_url` para PRs de código.


---


*ATOM ENVELOPE — TASK TEMPLATE v1.0 — 29 Mar 2026 — tmpl_meta v1.0*