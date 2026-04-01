---
title: "ATOM ENVELOPE — WRAP TEMPLATE v2.0"
version: "2.0"
date: "2026-03-29"
status: "definitive"
type: "meta"
module: "engine"
piso: 0
referencia: "Genesis v4.2 + AtomItem Schema v2 + tmpl_meta v1.0"
morphed_from: "wrap template v1.2 (Genesis 3.4)"
tags:
  - atom-engine
  - template
  - wrap
---


# ATOM ENVELOPE — WRAP TEMPLATE v2.0


**Type:** wrap
**Piso mínimo:** 7 — born committed (Ser / Transcendência)
**Module default:** bridge
**Body schema:** NÃO — formato fixo definido em Genesis 3.4 via campo `notes`
**Extensions disponíveis:** Soul
**Born committed:** SEMPRE — wraps nascem committed por definição
**Morphed from:** wrap template v1.2


---


## 1. Envelope Obrigatório


### 1.1 Campos Core


```yaml
id: ""                    # UUID v4 — gerado automaticamente
title: ""                 # "Wrap [per��odo] — [descrição breve]"
type: "wrap"
status: "committed"       # SEMPRE committed — wraps nascem committed
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 7                   # SEMPRE 7 — wraps são piso máximo
module: "bridge"          # SEMPRE bridge — wraps são pontes entre estados
tags: []                  # ex: ["daily", "weekly", "sprint", "2026-03"]
notes: ""                 # O conteúdo do wrap — formato fixo abaixo
born_committed: true      # SEMPRE true
```


### 1.2 Campos Opcionais Universais


```yaml
due_date: ""              # Não aplicável a wraps
priority: ""              # Não aplicável a wraps
parent_id: ""             # UUID de wrap maior (ex: daily dentro de weekly)
linked_items: []          # UUIDs dos items wrapeados neste período
morphed_from: ""          # Raramente usado em wraps (exceto migração de versão)
```


---


## 2. Body Schema


**Wraps NÃO têm body schema estruturado.**


O conteúdo segue o **Formato Fixo Wrap** definido no Genesis 3.4. Este formato é canônico e não deve ser alterado. Vai inteiramente no campo `notes`.


### 2.1 Formato Fixo Wrap


```markdown
## [PERÍODO] WRAP — [TÍTULO]
**Data:** [DD MMM YYYY] | **Piso:** 7 | **Module:** Bridge


---


### O que aconteceu
[Narração factual do período. O que foi feito, o que aconteceu, o que foi completado.
Sem julgamento ainda — apenas os fatos e eventos principais.]


---


### O que ficou
[O que não foi feito, o que foi adiado, o que ficou em aberto.
Tasks não completadas, intenções não realizadas, pendências.]


---


### O que aprendi
[Insights, aprendizados, padrões observados.
O que este período ensinou sobre sistemas, processos, sobre mim.]


---


### Como estou
[Estado atual. Energia, ânimo, clareza.
Breve e honesto — não precisa ser bonito.]


---


### Intenção para o próximo período
[Uma frase clara. O que importa agora? Qual é a direção?
Não uma lista de tasks — uma orientação, uma bússola.]


---
```


### 2.2 Tipos de Wrap


```
daily   — fechamento de um dia
weekly  — fechamento de uma semana
sprint  — fechamento de um sprint de trabalho
monthly — fechamento de um mês
yearly  — fechamento de um ano
adhoc   — fechamento de um projeto, fase ou ciclo específico
```


O tipo de wrap vai em `tags` (ex: `["daily", "2026-03-29"]`).


---


## 3. Extension: Soul


A extension Soul é **fortemente recomendada** para wraps — é o momento de registrar o estado interno ao fechar um período.


```yaml
soul:
  mood: ""                # calm | energized | reflective | anxious | grateful | neutral
  energy_level: 0         # Int 1–10 — estado de energia no fechamento
  intention: ""           # A intenção para o próximo período (resumo de 1 linha)
  reflection: ""          # Reflexão mais profunda (pode ser mais longa que o wrap)
```


---


## 4. Exemplo Completo


### 4.1 Exemplo YAML — Daily Wrap


```yaml
id: "f6a7b8c9-d0e1-2345-fabc-456789012345"
title: "Wrap Daily — 29 Mar 2026"
type: "wrap"
status: "committed"
created_at: "2026-03-29T22:00:00+10:00"
updated_at: "2026-03-29T22:00:00+10:00"
piso: 7
module: "bridge"
tags:
  - daily
  - 2026-03-29
  - wrap
linked_items:
  - "d4e5f6a7-b8c9-0123-defa-234567890123"
  - "e5f6a7b8-c9d0-1234-efab-345678901234"
born_committed: true


notes: |
  ## DAILY WRAP — 29 Mar 2026
  **Data:** 29 Mar 2026 | **Piso:** 7 | **Module:** Bridge


  ---


  ### O que aconteceu
  Dia de trabalho focado no Atom Engine. Completei os templates meta, recipe, workout, recommendation, task e note. Cada template ficou mais rico do que o anterior — o processo de escrever um template me ensina sobre o type.


  Tive uma conversa importante sobre a arquitetura de sync com Google Drive — a ideia de usar webhooks em vez de polling parece promissora. Registrei como nota para não perder.


  Almocei bem. Saí para caminhar 20 minutos às 15h — isso salvou o restante da tarde.


  ---


  ### O que ficou
  - Template `wrap` ainda em rascunho ao fechar o dia (irônico)
  - Não comecei a implementação do endpoint de paginação (estava bloqueado pela definição de schema)
  - Leitura do capítulo 3 do livro adiada para amanhã


  ---


  ### O que aprendi
  A caminhada no meio da tarde é mais eficaz do que café para retomar o foco. Sistemas precisam de ritmo, não apenas de energia.


  Escrever templates forçou clareza — se não consigo descrever o template, não entendo o type.


  ---


  ### Como estou
  Satisfeito com o output do dia. Um pouco cansado — boa fadiga, não ansiedade. Pronto para desligar.


  ---


  ### Intenção para o próximo período
  Amanhã: completar a implementação do endpoint e dar o primeiro commit real no Atom Engine. Menos planejamento, mais código.


  ---


soul:
  mood: "reflective"
  energy_level: 6
  intention: "Completar implementação do endpoint e dar o primeiro commit real."
  reflection: "Dias assim — onde o trabalho tem forma e o corpo foi respeitado — são o padrão para buscar, não a exceção."
```


### 4.2 Exemplo Google Doc


**Título do Doc:** WRAP — Wrap Daily — 29 Mar 2026 (2026-03-29)


**Body text:**


---
**Tipo:** Daily | **Status:** Committed | **Piso:** 7 | **Module:** Bridge
**Mood:** Reflective | **Energia:** 6/10


## DAILY WRAP — 29 Mar 2026


### O que aconteceu
Dia de trabalho focado no Atom Engine. Completei os templates meta, recipe, workout, recommendation, task e note. Tive uma conversa importante sobre arquitetura de sync com Google Drive. Caminhada de 20min às 15h que salvou a tarde.


### O que ficou
- Template wrap ainda em rascunho ao fechar o dia
- Implementação do endpoint de paginação bloqueada por definição de schema
- Leitura do capítulo 3 adiada para amanhã


### O que aprendi
Caminhada é mais eficaz que café. Escrever templates forçou clareza — se não consigo descrever, não entendo.


### Como estou
Satisfeito. Cansaço bom. Pronto para desligar.


### Intenção para amanhã
Completar implementação do endpoint e dar o primeiro commit real. Menos planejamento, mais código.


---


---


## 5. Notas de Uso


- **Piso 7 sempre** — não negociável. Wraps são o ato de consciência máxima sobre um período. Eles vivem no piso mais alto porque integram tudo que aconteceu abaixo.
- **Module bridge sempre** — wraps são pontes. Ponte entre o que foi e o que será.
- **born_committed: true sempre** — um wrap que não está committed não é um wrap. É um rascunho de reflexão. Apenas escreva o wrap quando estiver pronto para fechar o período.
- **status: committed sempre** — pela mesma razão que born_committed. Um wrap aberto é uma contradição.
- **Formato fixo** — as 5 seções (O que aconteceu / O que ficou / O que aprendi / Como estou / Intenção) são canônicas. Não adicione, não remova. A disciplina do formato é o que torna os wraps comparáveis ao longo do tempo.
- **Extension Soul** é fortemente recomendada — o campo `soul.mood` e `soul.energy_level` criam um histórico do estado interno ao longo do tempo. Em 6 meses, você vai querer esses dados.
- `linked_items` deve conter os UUIDs dos items mais significativos do período — tasks completadas, notas criadas, decisões tomadas.
- **Hierarquia de wraps:** daily → weekly → monthly → yearly. Um wrap mensal deve referenciar (via `parent_id`) os wraps semanais que o compõem.
- Para sprints: o wrap de sprint é um `adhoc` com tags `["sprint", "sprint-12"]` e `parent_id` do projeto.
- **v2.0 vs v1.2:** A principal diferença é a adição da extension Soul e a formalização do piso 7 como obrigatório (v1.2 permitia piso 5+).


---


*ATOM ENVELOPE — WRAP TEMPLATE v2.0 — 29 Mar 2026 — tmpl_meta v1.0 — morphed from wrap v1.2*