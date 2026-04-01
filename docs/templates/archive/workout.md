---
title: "ATOM ENVELOPE — WORKOUT TEMPLATE v1.0"
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
  - workout
---


# ATOM ENVELOPE — WORKOUT TEMPLATE v1.0


**Type:** workout
**Piso mínimo:** 3 (Prática / Execução)
**Module default:** body
**Body schema:** SIM
**Extensions disponíveis:** Recurrence, Soul
**Born committed:** opcional


---


## 1. Envelope Obrigatório


### 1.1 Campos Core


```yaml
id: ""                    # UUID v4 — gerado automaticamente
title: ""                 # Nome do treino
type: "workout"
status: "draft"           # draft | in_progress | committed | archived
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 3                   # Mínimo 3 — treinos são prática executável
module: "body"            # body — fitness, saúde física
tags: []                  # ex: ["calistenia", "força", "outdoor"]
notes: ""                 # Observações livres sobre o treino
```


### 1.2 Campos Opcionais Universais


```yaml
due_date: ""              # Opcional — data alvo para o treino
priority: ""              # low | medium | high | critical
parent_id: ""             # UUID de programa de treino pai
linked_items: []          # UUIDs relacionados (ex: log de sessão)
morphed_from: ""          # UUID + type de origem (se morphed)
born_committed: false     # true se treino já testado e validado
```


---


## 2. Body Schema


### 2.1 Campos do Body


```yaml
body:
  focus: ""               # String — foco principal (upper_body, lower_body, full_body, core, cardio, mobility, strength, hiit)
  frequency: 0            # Int — sessões por semana recomendadas
  level: ""               # beginner | intermediate | advanced
  duration: 0             # Int — minutos por sessão
  equipment:              # Lista de strings — equipamentos necessários
    - ""                  # "nenhum" se bodyweight puro
  exercises:              # Lista de objetos — cada exercício
    - name: ""            # Nome do exercício
      sets: 0             # Int — número de séries
      reps: ""            # String — "10", "8-12", "max", "30s"
      rest: ""            # String — "60s", "90s", "2min"
      notes: ""           # Opcional — forma, progressão, variação
```


### 2.2 Regras de Validação


```
[ ] focus é um dos valores: upper_body | lower_body | full_body | core | cardio | mobility | strength | hiit
[ ] frequency >= 1 e <= 7
[ ] level é um dos valores: beginner | intermediate | advanced
[ ] duration >= 1 (int, minutos)
[ ] equipment é lista (usar ["nenhum"] se bodyweight puro, nunca null)
[ ] exercises lista com pelo menos 1 exercício
[ ] Cada exercício tem pelo menos: name e sets (reps e rest recomendados)
[ ] reps pode ser string para flexibilidade ("max", "8-12", "30s")
[ ] rest sempre em formato legível: "60s", "90s", "2min"
```


---


## 3. Extensions


### 3.1 Extension: Recurrence


Use quando o treino tem frequência programada regular.


```yaml
recurrence:
  frequency: "weekly"     # daily | weekly | monthly | yearly
  interval: 1             # Int — a cada N semanas (1 = toda semana)
  days_of_week:           # Dias da semana para este treino
    - "mon"
    - "wed"
    - "fri"
  end_date: ""            # ISO date — quando termina o programa (opcional)
```


### 3.2 Extension: Soul


Use quando o treino tem intenção além do físico — mindfulness, estado mental, propósito.


```yaml
soul:
  mood: ""                # calm | energized | reflective | anxious | grateful | neutral
  energy_level: 0         # Int 1–10 — nível de energia ao iniciar
  intention: ""           # Intenção pré-treino (texto livre)
  reflection: ""          # Reflexão pós-treino (texto livre)
```


---


## 4. Exemplo Completo


### 4.1 Exemplo YAML — Treino Calistenia Full Body


```yaml
id: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
title: "Calistenia Full Body — Nível Iniciante"
type: "workout"
status: "committed"
created_at: "2026-03-29T07:00:00+10:00"
updated_at: "2026-03-29T07:00:00+10:00"
piso: 3
module: "body"
tags:
  - calistenia
  - full-body
  - iniciante
  - bodyweight
  - outdoor
notes: "Treino desenhado para ser feito em parque ou casa. Zero equipamento. Progressão: quando conseguir todas as reps limpas por 3 semanas, avançar para versão intermediária."
born_committed: true


body:
  focus: "full_body"
  frequency: 3
  level: "beginner"
  duration: 45
  equipment:
    - "nenhum"
  exercises:
    - name: "Agachamento"
      sets: 3
      reps: "15"
      rest: "60s"
      notes: "Joelhos alinhados com pés, descer até coxa paralela ao chão"
    - name: "Flexão de braço"
      sets: 3
      reps: "8-10"
      rest: "90s"
      notes: "Se necessário, fazer na versão joelhada até ganhar força"
    - name: "Afundo alternado"
      sets: 3
      reps: "10 cada perna"
      rest: "60s"
      notes: "Manter tronco ereto, joelho da frente não ultrapassa o pé"
    - name: "Prancha frontal"
      sets: 3
      reps: "30s"
      rest: "45s"
      notes: "Corpo reto da cabeça ao calcanhar, não deixar quadril cair"
    - name: "Superman"
      sets: 3
      reps: "12"
      rest: "60s"
      notes: "Extensão de coluna no chão, segurar 2s no topo"
    - name: "Burpee (simplificado)"
      sets: 2
      reps: "8"
      rest: "90s"
      notes: "Sem o salto no início — adicionar progressivamente"


recurrence:
  frequency: "weekly"
  interval: 1
  days_of_week:
    - "mon"
    - "wed"
    - "fri"
  end_date: ""


soul:
  mood: "energized"
  energy_level: 7
  intention: "Construir consistência. Cada treino é um voto para a pessoa que quero ser."
  reflection: ""
```


### 4.2 Exemplo Google Doc


**Título do Doc:** WORKOUT — Calistenia Full Body — Nível Iniciante (2026-03-29)


**Body text:**


---
**Foco:** Full Body | **Nível:** Iniciante | **Duração:** 45min | **Frequência:** 3x semana (Seg/Qua/Sex)
**Equipamento:** Nenhum — bodyweight puro


**Exercícios:**


| Exercício | Séries | Reps | Descanso | Notas |
|---|---|---|---|---|
| Agachamento | 3 | 15 | 60s | Coxa paralela ao chão |
| Flexão de braço | 3 | 8-10 | 90s | Versão joelhada se necessário |
| Afundo alternado | 3 | 10 cada | 60s | Tronco ereto |
| Prancha frontal | 3 | 30s | 45s | Corpo reto, quadril firme |
| Superman | 3 | 12 | 60s | Segurar 2s no topo |
| Burpee simplificado | 2 | 8 | 90s | Sem salto inicial |


**Notas:** Zero equipamento. Progressão: 3 semanas limpas → avançar para intermediário.


**Intenção:** Construir consistência. Cada treino é um voto para a pessoa que quero ser.


---


---


## 5. Notas de Uso


- **Piso 3** é o mínimo porque workout é prática executável. Um treino "planejado mas nunca feito" ainda é piso 3 — é a intenção de prática.
- **Module body** porque workouts pertencem ao domínio de saúde e fitness físico.
- **Extension Recurrence** é recomendada para treinos programados. Treinos únicos (one-off) não precisam.
- **Extension Soul** é opcional mas fortemente recomendada — conecta o aspecto físico com o mental/emocional. Preencher `reflection` após cada sessão.
- `reps` é string (não int) para suportar formatos como "8-12", "max", "30s", "10 cada perna".
- `rest` é string para legibilidade: "60s", "2min", "90s".
- `equipment: ["nenhum"]` é o padrão para treinos bodyweight — nunca deixar lista vazia.
- Para registrar uma SESSÃO específica (o que foi feito hoje), usar type `log` linkado a este workout via `parent_id`.
- `frequency` no body schema é a recomendação do treino. A frequência REAL de execução fica nos logs.


---


*ATOM ENVELOPE — WORKOUT TEMPLATE v1.0 — 29 Mar 2026 — tmpl_meta v1.0*