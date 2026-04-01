---
title: "ATOM ENVELOPE — RECOMMENDATION TEMPLATE v1.0"
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
  - recommendation
---


# ATOM ENVELOPE — RECOMMENDATION TEMPLATE v1.0


**Type:** recommendation
**Piso mínimo:** 2 (Referência / Conhecimento)
**Module default:** varies (mind | body | play | life — depende da categoria)
**Body schema:** SIM
**Extensions disponíveis:** nenhuma
**Born committed:** recomendado (recomendações são fatos já conhecidos)


---


## 1. Envelope Obrigatório


### 1.1 Campos Core


```yaml
id: ""                    # UUID v4 — gerado automaticamente
title: ""                 # Nome do item recomendado
type: "recommendation"
status: "committed"       # Recomendações normalmente nascem committed
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 2                   # Mínimo 2 — referência e conhecimento curado
module: ""                # Varia por categoria — ver seção 4
tags: []                  # ex: ["ramen", "tokyo", "restaurante"]
notes: ""                 # Observações pessoais, contexto adicional
```


### 1.2 Campos Opcionais Universais


```yaml
due_date: ""              # Raramente usado — talvez "visitar antes de"
priority: ""              # low | medium | high | critical
parent_id: ""             # UUID de lista ou coleção pai
linked_items: []          # UUIDs relacionados (ex: viagem onde descobriu)
morphed_from: ""          # UUID + type de origem (se morphed de note/idea)
born_committed: true      # Recomendado: true — é conhecimento já adquirido
```


---


## 2. Body Schema


### 2.1 Campos do Body


```yaml
body:
  category: ""            # Ver enum de categorias abaixo
  recommended_by: ""      # String — quem recomendou ("eu mesmo", nome de pessoa, publicação)
  source_url: ""          # String — URL da fonte, artigo, review (opcional)
  why: ""                 # String — por que vale a pena (o pitch)
  rating: 0               # Float 0.0–5.0 — nota pessoal (0 = não avaliado ainda)
```


### 2.2 Enum de Categorias


```
Comida & Bebida:
  restaurant, cafe, bar, food_item, drink, recipe_external


Entretenimento:
  book, movie, series, podcast, music, game, youtube_channel


Lugares & Experiências:
  place, hotel, activity, experience, travel_spot


Produtos & Ferramentas:
  product, app, tool, service, website


Saúde & Bem-estar:
  supplement, exercise_method, therapy, wellness_practice


Pessoas & Criadores:
  person, creator, brand, community
```


### 2.3 Regras de Validação


```
[ ] category não vazio e pertence ao enum
[ ] recommended_by não vazio (usar "eu mesmo" se descoberta própria)
[ ] source_url é URL válida ou string vazia (não null)
[ ] why não vazio — é o campo mais importante
[ ] rating é float entre 0.0 e 5.0 (usar 0 se ainda não avaliado)
```


### 2.4 Module por Categoria


```
mind:   book, podcast, youtube_channel, person, creator, community, website, tool, app
body:   restaurant, cafe, food_item, drink, supplement, exercise_method, therapy, wellness_practice
play:   movie, series, music, game, activity, experience
life:   product, service, hotel, travel_spot, place, bar
```


---


## 3. Exemplo Completo


### 3.1 Exemplo YAML — Restaurante de Ramen


```yaml
id: "c3d4e5f6-a7b8-9012-cdef-123456789012"
title: "Ichiran Ramen — Shibuya"
type: "recommendation"
status: "committed"
created_at: "2026-03-29T14:30:00+10:00"
updated_at: "2026-03-29T14:30:00+10:00"
piso: 2
module: "life"
tags:
  - ramen
  - tokyo
  - japão
  - restaurante
  - solo-dining
notes: "Fui em março de 2025. Cheguei às 11h e não tinha fila. O sistema de pedido na cabine é fascinante — você personaliza tudo no papel antes de sentar."
born_committed: true


body:
  category: "restaurant"
  recommended_by: "eu mesmo"
  source_url: "https://ichiran.com/shop/kanto/shibuya/"
  why: "Experiência de ramen solo única no mundo — cada cliente tem sua própria cabine individual com cortina. Caldo tonkotsu de porco fervido por 18h. Personalização total de firmeza do macarrão, intensidade do caldo, gordura e tempero. Indispensável em qualquer visita a Tokyo."
  rating: 4.8
```


### 3.2 Exemplo Google Doc


**Título do Doc:** RECOMMENDATION — Ichiran Ramen — Shibuya (2026-03-29)


**Body text:**


---
**Categoria:** Restaurante | **Nota:** 4.8/5.0
**Recomendado por:** Eu mesmo | **Fonte:** https://ichiran.com/shop/kanto/shibuya/


**Por que vale a pena:**
Experiência de ramen solo única no mundo — cada cliente tem sua própria cabine individual com cortina. Caldo tonkotsu de porco fervido por 18h. Personalização total de firmeza do macarrão, intensidade do caldo, gordura e tempero. Indispensável em qualquer visita a Tokyo.


**Notas pessoais:**
Fui em março de 2025. Cheguei às 11h e não havia fila. O sistema de pedido na cabine é fascinante — você personaliza tudo no papel antes de sentar.


---


---


## 4. Notas de Uso


- **Piso 2** é o mínimo porque recomendações são referências — conhecimento curado. Uma recomendação que ainda não foi testada pode ficar em `status: draft` com `born_committed: false`.
- **Module varia** por categoria — ver tabela na seção 2.4. Regra geral: se é comida/lugar físico → `life`; se é conteúdo/aprendizado → `mind`; se é entretenimento → `play`; se é saúde → `body`.
- **born_committed: true** é recomendado para recomendações de coisas já experimentadas.
- O campo `why` é o mais importante do schema — deve ser um pitch genuíno, não apenas uma descrição. "Por que eu deveria me importar?" deve ser respondido aqui.
- `rating: 0` significa "não avaliado ainda" — útil para wishlist de coisas ainda não experienciadas.
- `recommended_by` aceita nomes de pessoas ("Pedro", "The New York Times"), publicações, ou "eu mesmo".
- Para recomendações de livros, filmes e séries: usar os types específicos `book` e `movie` se o item merece body schema completo (autor, diretor, etc). `recommendation` é para curadoria rápida.
- Tags devem incluir localização geográfica quando relevante: `"tokyo"`, `"sydney"`, `"são-paulo"`.


---


*ATOM ENVELOPE — RECOMMENDATION TEMPLATE v1.0 — 29 Mar 2026 — tmpl_meta v1.0*