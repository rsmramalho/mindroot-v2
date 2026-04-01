# Atom Meta-Template v1.0
## O Molde dos Moldes


**Versão:** 1.0
**Data:** 29 Mar 2026
**Status:** Definitive
**Referência:** Genesis v4.2 + AtomItem Schema v2
**Princípio:** Se a geometria deste documento estiver perfeita, todo template que nascer dele herda essa geometria.


---


## 1 — O que é isto


Este documento define a ESTRUTURA EXATA que todo template de type segue. Qualquer agente que receba este meta-template + Genesis v4.2 pode gerar o template de qualquer type automaticamente.


Duas categorias: Types COM body schema (10) e Types SEM body schema (13). A diferença é UMA seção: Body.


---


## 2 — Formato Google Doc


Todo Google Doc de template segue esta estrutura de seções (headings H1/H2/H3):


```
H1: ATOM ENVELOPE — [TYPE] TEMPLATE v[X.Y]


H2: 1. Envelope Obrigatório
  H3: 1.1 Campos Core
  H3: 1.2 Extensions Disponíveis


H2: 2. Body Schema          ← APENAS para types COM body schema
  H3: 2.1 Campos do Body
  H3: 2.2 Regras de Validação


H2: 3. Exemplo Completo
  H3: 3.1 Exemplo YAML
  H3: 3.2 Exemplo Google Doc


H2: 4. Notas de Uso
```


Regra: H1 identifica o template. H2 são seções principais. H3 são subsecções.


---


## 3 — Formato Obsidian (.md mirror)


Todo template tem um espelho `.md` em `C:\Users\rsmra\.config\atom-engine\` com o nome `tmpl_[type].md`.


Estrutura do frontmatter YAML obrigatório:


```yaml
---
title: "ATOM ENVELOPE — [TYPE] TEMPLATE v[X.Y]"
version: "[X.Y]"
date: "[YYYY-MM-DD]"
status: "definitive"
type: "meta"
module: "engine"
piso: 0
referencia: "Genesis v4.2 + AtomItem Schema v2"
tags:
  - atom-engine
  - template
  - [type]
---
```


---


## 4 — Campos Core


Todo AtomItem — independente de type — tem estes campos core obrigatórios:


```yaml
# CAMPOS CORE — presentes em TODOS os types
id: ""                    # UUID v4 gerado automaticamente
title: ""                 # Título do item
type: ""                  # Ver enum Types abaixo
status: ""                # Ver enum Status abaixo
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 0                   # Int 1–7, ver enum Pisos abaixo
module: ""                # Ver enum Modules abaixo
tags: []                  # Lista de strings
notes: ""                 # Texto livre, Markdown permitido
```


**Campos opcionais universais:**


```yaml
due_date: ""              # ISO 8601 date (sem hora)
priority: ""              # low | medium | high | critical
parent_id: ""             # UUID do item pai
linked_items: []          # Lista de UUIDs relacionados
morphed_from: ""          # UUID + type de origem (se morphed)
born_committed: false     # Boolean — ver seção 10
```


---


## 5 — Extensions


Extensions são blocos YAML opcionais que se adicionam ao envelope quando o type precisa de capacidades específicas. Cada extension tem um nome e um schema definido.


**Lista de Extensions disponíveis:**


```yaml
# EXTENSION: Recurrence
recurrence:
  frequency: ""           # daily | weekly | monthly | yearly
  interval: 1             # Int — a cada N frequências
  days_of_week: []        # [mon, tue, wed, thu, fri, sat, sun]
  end_date: ""            # ISO date, opcional


# EXTENSION: Soul
soul:
  mood: ""                # calm | energized | reflective | anxious | grateful | neutral
  energy_level: 0         # Int 1–10
  intention: ""           # Texto livre
  reflection: ""          # Texto livre (post-item)


# EXTENSION: Operations
operations:
  assignee: ""            # Nome ou ID do responsável
  sprint: ""              # Nome ou ID do sprint
  estimate_hours: 0.0     # Float
  actual_hours: 0.0       # Float
  blockers: []            # Lista de strings
  pr_url: ""              # URL do Pull Request


# EXTENSION: Location
location:
  name: ""                # Nome do lugar
  address: ""             # Endereço completo
  coordinates:
    lat: 0.0
    lng: 0.0
  maps_url: ""            # URL do Google Maps


# EXTENSION: Participants
participants:
  - name: ""
    role: ""              # host | guest | organizer | observer
    contact: ""           # email ou handle
```


---


## 6 — Body Schema


Esta seção existe APENAS nos 10 types que têm body schema estruturado. Os outros 13 types usam apenas `notes` (texto livre).


**Types COM body schema:**
recipe, workout, recommendation, book, movie, travel, finance, health, project, habit


**Types SEM body schema:**
task, note, wrap, idea, goal, decision, event, meeting, log, journal, contact, asset, ritual


**Regra de ouro:** Se o type tem body schema, o campo `notes` continua existindo (para observações livres) mas o conteúdo estruturado vai em `body:`.


Formato padrão do bloco body:


```yaml
body:
  # campos específicos do type aqui
  campo_1: ""
  campo_2: 0
  campo_lista: []
```


---


## 7 — Layout do Conteúdo


### 7.1 Ordem dos blocos no YAML


A ordem CANÔNICA dos blocos em qualquer AtomItem YAML é:


```
1. Campos Core (id, title, type, status, created_at, updated_at, piso, module, tags, notes)
2. Campos opcionais universais (due_date, priority, parent_id, linked_items, morphed_from, born_committed)
3. Body (se type tem body schema)
4. Extensions (na ordem: recurrence → soul → operations → location → participants)
```


### 7.2 Layout do Google Doc (body text)


Para types COM body schema, o conteúdo do Google Doc espelha o body YAML em formato legível humano.


Para types SEM body schema, o conteúdo do Google Doc é o campo `notes` formatado em Markdown.


---


## 8 — Convenção de Nomes


```
Google Doc título:    [TYPE] — [TITLE] ([YYYY-MM-DD])
Obsidian filename:    [type]_[slug-do-title]_[YYYY-MM-DD].md
Template filename:    tmpl_[type].md
ID format:            UUID v4 (ex: f47ac10b-58cc-4372-a567-0e02b2c3d479)
```


**Slugificação:** lowercase, espaços → hífens, remover acentos e caracteres especiais.


Exemplos:
- "Carbonara Clássica" → `mod-body_recipe_carbonara-classica.md`
- "GitHub Repo Task" → `mod-work_task_github-repo.md`
- "Checkpoint Atom Engine" → `mod-work_checkpoint_atom-engine_2026-03-29.md`

> ⚠️ REGRA CRÍTICA — versão só em docs que evoluem:
> - CORRETO: `mod-body_recommendation_izakaya-brisbane.md` (sem versão — item atemporal)
> - CORRETO: `mod-body_recipe_carbonara-classica.md` (sem versão)
> - CORRETO: `mod-mind_reflection_cansaco-construir.md` (sem versão)
> - ERRADO: `mod-body_recommendation_izakaya_v1-0.md` (versão em item atemporal)
> - CORRETO: `mod-work_spec_cockpit-modos_v1-0.md` (versão em spec — evolui)
> - CORRETO: `system_template_checkpoint_v1-0.md` (versão em template — evolui)
>
> Receitas, reflexões, notas, tasks, recommendations = sem versão/data.
> Specs, schemas, templates = com versão. Wraps, logs, checkpoints = com data.


---


## 9 — Protocolo de Auto-Geração


Quando um agente recebe instrução para criar um AtomItem, segue este protocolo:


```
1. Identificar o type do item
2. Carregar tmpl_[type].md
3. Preencher campos core (gerar UUID, timestamp AEST)
4. Determinar piso (default do template, ajustar se necessário)
5. Determinar module (default do template, ajustar se necessário)
6. Se type tem body schema → preencher body
7. Aplicar extensions necessárias
8. Validar contra checklist (seção 9 deste documento)
9. Se born_committed: true → commitar diretamente
10. Gerar Google Doc + .md mirror
```


---


## 10 — Born Committed


`born_committed: true` significa que o item nasce já em status `committed` (sem passar por `draft`).


**Quando usar:**
- Wraps (sempre)
- Logs de sistema
- Items gerados automaticamente por triggers
- Items com dados factuais já confirmados


**Efeito:** O campo `status` é automaticamente definido como `committed` na criação. O campo `born_committed: true` fica registrado no envelope para rastreabilidade.


---


## 11 — Location e Participants


Estas duas extensions merecem nota especial porque são usadas em conjunto nos types `event` e `meeting`.


Para `event` e `meeting`, ambas as extensions são RECOMENDADAS (não obrigatórias, mas esperadas).


```yaml
# Exemplo combinado para event/meeting
location:
  name: "Escritório Central"
  address: "Rua Example, 123, São Paulo"
  coordinates:
    lat: -23.5505
    lng: -46.6333
  maps_url: "https://maps.google.com/?q=-23.5505,-46.6333"


participants:
  - name: "Rafael"
    role: "host"
    contact: "rafael@example.com"
  - name: "Ana"
    role: "guest"
    contact: "ana@example.com"
```


---


## 12 — Checklist de Validação


Antes de finalizar qualquer AtomItem, validar:


```
CAMPOS CORE
[ ] id presente e formato UUID v4 válido
[ ] title não vazio
[ ] type é um valor válido do enum Types
[ ] status é um valor válido do enum Status
[ ] created_at formato ISO 8601, timezone AEST
[ ] updated_at formato ISO 8601, timezone AEST
[ ] piso é int entre 1 e 7
[ ] module é um valor válido do enum Modules
[ ] tags é lista (pode ser vazia)
[ ] notes é string (pode ser vazia)


BODY (se aplicável)
[ ] Todos os campos obrigatórios do body preenchidos
[ ] Tipos de dados corretos (string, int, float, list)
[ ] Listas não são null (usar [] se vazio)


EXTENSIONS (se presentes)
[ ] Campos obrigatórios da extension preenchidos
[ ] Valores dentro dos enums definidos


ARQUIVO
[ ] Nome do arquivo segue convenção
[ ] Frontmatter YAML válido (sem erros de sintaxe)
[ ] Mirror .md existe se Google Doc existe
```


---


## 13 — Referência Rápida Enums


### Types (23 total)
```
Com body schema (10):
  recipe, workout, recommendation, book, movie,
  travel, finance, health, project, habit


Sem body schema (13):
  task, note, wrap, idea, goal, decision, event,
  meeting, log, journal, contact, asset, ritual
```


### Status
```
draft → in_progress → committed → archived
             ↓
          blocked
             ↓
         cancelled
```


### Pisos (1–7)
```
1 — Sobrevivência / Urgente
2 — Referência / Conhecimento
3 — Prática / Execução
4 — Projeto / Estrutura
5 — Visão / Estratégia
6 — Identidade / Valores
7 — Ser / Transcendência
```


### Modules
```
work      — profissional, carreira, projetos
mind      — conhecimento, aprendizado, ideias
body      — saúde, fitness, alimentação
bridge    — reflexão, wraps, transições
soul      — valores, identidade, propósito
life      — cotidiano, logística, finanças
play      — hobbies, lazer, criatividade
```


---


*Atom Meta-Template v1.0 — 29 Mar 2026 — Genesis v4.2 + AtomItem Schema v2*