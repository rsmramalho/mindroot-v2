---
title: "ATOM ENVELOPE — RECIPE TEMPLATE v1.0"
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
  - recipe
---


# ATOM ENVELOPE — RECIPE TEMPLATE v1.0


**Type:** recipe
**Piso mínimo:** 3 (Prática / Execução)
**Module default:** body
**Body schema:** SIM
**Extensions disponíveis:** nenhuma (recipe é autossuficiente)
**Born committed:** opcional


---


## 1. Envelope Obrigatório


### 1.1 Campos Core


```yaml
id: ""                    # UUID v4 — gerado automaticamente
title: ""                 # Nome da receita
type: "recipe"
status: "draft"           # draft | in_progress | committed | archived
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 3                   # Mínimo 3 — receitas são prática
module: "body"            # body — alimentação, nutrição
tags: []                  # ex: ["italiana", "massa", "rápida"]
notes: ""                 # Observações livres sobre a receita
```


### 1.2 Campos Opcionais Universais


```yaml
due_date: ""              # Opcional — para planejar quando fazer
priority: ""              # low | medium | high | critical
parent_id: ""             # UUID de meal_plan ou projeto culinário
linked_items: []          # UUIDs relacionados (ex: lista de compras)
morphed_from: ""          # UUID + type de origem (se morphed)
born_committed: false     # true se receita já testada e aprovada
```


---


## 2. Body Schema


### 2.1 Campos do Body


```yaml
body:
  cuisine: ""             # String — tipo de cozinha (italiana, japonesa, brasileira...)
  serves: 0               # Int — número de porções
  prep_time: 0            # Int — minutos de preparo
  cook_time: 0            # Int — minutos de cozimento
  difficulty: ""          # easy | medium | hard
  ingredients:            # Lista de strings — formato "quantidade unidade ingrediente"
    - ""
  steps:                  # Lista de strings — cada item é um passo numerado
    - ""
```


### 2.2 Regras de Validação


```
[ ] cuisine não vazio
[ ] serves >= 1
[ ] prep_time >= 0 (int, minutos)
[ ] cook_time >= 0 (int, minutos)
[ ] difficulty é um dos valores: easy | medium | hard
[ ] ingredients lista com pelo menos 1 item
[ ] steps lista com pelo menos 1 passo
[ ] Ingredientes no formato: "quantidade unidade ingrediente"
    Ex: "200g massa espaguete", "2 dentes alho", "a gosto sal"
```


---


## 3. Exemplo Completo


### 3.1 Exemplo YAML — Carbonara Clássica


```yaml
id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
title: "Carbonara Clássica"
type: "recipe"
status: "committed"
created_at: "2026-03-29T10:00:00+10:00"
updated_at: "2026-03-29T10:00:00+10:00"
piso: 3
module: "body"
tags:
  - italiana
  - massa
  - clássica
  - sem-creme
notes: "Receita original sem creme de leite. O segredo é a temperatura — ovos não podem cozinhar demais."
born_committed: true


body:
  cuisine: "italiana"
  serves: 2
  prep_time: 10
  cook_time: 15
  difficulty: "medium"
  ingredients:
    - "200g espaguete (ou rigatoni)"
    - "150g guanciale (ou pancetta)"
    - "3 gemas de ovo"
    - "1 ovo inteiro"
    - "80g Pecorino Romano ralado"
    - "40g Parmigiano Reggiano ralado"
    - "a gosto pimenta-do-reino moída na hora"
    - "a gosto sal (para a água do macarrão)"
  steps:
    - "Cozinhe o espaguete em água bem salgada até al dente. Reserve 1 xícara da água do cozimento."
    - "Corte o guanciale em cubos ou tiras. Refogue em frigideira fria (sem óleo) em fogo médio até dourar e soltar a gordura. Reserve."
    - "Em uma tigela, misture as gemas, o ovo inteiro, o Pecorino e o Parmigiano. Tempere com pimenta generosa. NÃO adicione sal ainda."
    - "Escorra o macarrão e adicione direto na frigideira com o guanciale (fogo apagado). Misture bem."
    - "Adicione a mistura de ovos e queijo. Mexa rapidamente adicionando água do cozimento aos poucos para criar cremosidade sem cozinhar o ovo."
    - "Sirva imediatamente com pimenta extra e queijo ralado."
```


### 3.2 Exemplo Google Doc


**Título do Doc:** RECIPE — Carbonara Clássica (2026-03-29)


**Body text:**


---
**Cozinha:** Italiana | **Porções:** 2 | **Preparo:** 10min | **Cozimento:** 15min | **Dificuldade:** Média


**Ingredientes:**
- 200g espaguete (ou rigatoni)
- 150g guanciale (ou pancetta)
- 3 gemas de ovo + 1 ovo inteiro
- 80g Pecorino Romano ralado
- 40g Parmigiano Reggiano ralado
- Pimenta-do-reino moída na hora, sal


**Modo de Preparo:**
1. Cozinhe o espaguete em água bem salgada até al dente. Reserve 1 xícara da água.
2. Refogue o guanciale em frigideira fria até dourar. Reserve.
3. Misture gemas, ovo, queijos e pimenta generosa em tigela.
4. Escorra o macarrão, adicione na frigideira (fogo apagado). Misture.
5. Adicione a mistura de ovos mexendo rápido com água do cozimento aos poucos.
6. Sirva com pimenta extra e queijo.


**Notas:** Receita original sem creme de leite. Temperatura é o segredo.


---


---


## 4. Notas de Uso


- **Piso 3** é o mínimo porque receita é conhecimento prático executável. Uma receita "sonhada" mas nunca tentada pode ser piso 2, mas o default é 3.
- **Module body** porque receitas pertencem ao domínio de saúde, alimentação e nutrição.
- **born_committed: true** é recomendado quando a receita foi testada e aprovada. Receitas em teste ficam em `status: in_progress`.
- O campo `notes` é ideal para dicas de chef, variações, substituições, ou observações pessoais que não cabem no schema.
- `prep_time` e `cook_time` são sempre em **minutos** (inteiros).
- `serves` é o número de **porções** (pessoas), não de unidades.
- Para receitas de confeitaria com muitos itens, `tags` pode incluir: `"confeitaria"`, `"sem-gluten"`, `"vegano"`, etc.
- Ingredientes no formato recomendado: `"quantidade unidade ingrediente"`. Para itens sem quantidade exata: `"a gosto sal"`, `"q.b. farinha"`.


---


*ATOM ENVELOPE — RECIPE TEMPLATE v1.0 — 29 Mar 2026 — tmpl_meta v1.0*