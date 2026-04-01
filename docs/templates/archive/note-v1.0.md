---
title: "ATOM ENVELOPE — NOTE TEMPLATE v1.0"
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
  - note
---


# ATOM ENVELOPE — NOTE TEMPLATE v1.0


**Type:** note
**Piso mínimo:** 2 (Referência / Conhecimento)
**Module default:** mind
**Body schema:** NÃO — usa campo `notes` para conteúdo
**Extensions disponíveis:** nenhuma
**Born committed:** opcional (notas rápidas podem nascer committed)


---


## 1. Envelope Obrigatório


### 1.1 Campos Core


```yaml
id: ""                    # UUID v4 — gerado automaticamente
title: ""                 # Título da nota — descritivo e buscável
type: "note"
status: "draft"           # draft | committed | archived
created_at: ""            # ISO 8601, AEST UTC+10
updated_at: ""            # ISO 8601, AEST UTC+10
piso: 2                   # Mínimo 2 — notas são referência/conhecimento
module: "mind"            # mind (default) — conhecimento, pensamentos, referências
tags: []                  # ex: ["arquitetura", "sistema", "insight"]
notes: ""                 # O conteúdo da nota — Markdown completo permitido
```


### 1.2 Campos Opcionais Universais


```yaml
due_date: ""              # Raramente usado em notes
priority: ""              # low | medium | high | critical
parent_id: ""             # UUID de projeto, área ou nota pai
linked_items: []          # UUIDs de notas relacionadas, tasks, ideias
morphed_from: ""          # UUID + type de origem (ex: morphed de journal entry)
born_committed: false     # true para notas factuais ou referências fixas
```


---


## 2. Body Schema


**Notes NÃO têm body schema estruturado.**


O conteúdo completo da nota vai no campo `notes`. Use Markdown livremente:


```markdown
# Conteúdo da Nota


Texto livre, observações, fragmentos de conhecimento.


## Subseção
Mais conteúdo.


### Links e Referências
- [[wiki-link para outro item]]
- [Link externo](https://exemplo.com)


## Código
```python
# Fragmentos de código quando relevante
def exemplo():
    pass
```


## Checklist (se aplicável)
- [ ] Item 1
- [x] Item 2 (concluído)
```


---


## 3. Exemplo Completo


### 3.1 Exemplo YAML — Ideia de Sincronização


```yaml
id: "e5f6a7b8-c9d0-1234-efab-345678901234"
title: "Ideia: Sync Atom Engine via Google Drive API + webhook"
type: "note"
status: "committed"
created_at: "2026-03-29T11:45:00+10:00"
updated_at: "2026-03-29T12:00:00+10:00"
piso: 2
module: "mind"
tags:
  - atom-engine
  - sync
  - google-drive
  - arquitetura
  - insight
linked_items:
  - "d4e5f6a7-b8c9-0123-defa-234567890123"
born_committed: true
notes: |
  ## Ideia Central


  Em vez de fazer polling do Google Drive a cada X minutos, usar a **Google Drive Push Notifications API** (webhooks) para notificar o Atom Engine em tempo real quando um documento é criado ou modificado.


  Isso eliminaria:
  - Latência de sincronização (de minutos para segundos)
  - Consumo desnecessário de quota da API
  - Complexidade de gerenciar o estado do "último sync"


  ## Como Funcionaria


  1. Atom Engine registra um webhook via `channels.watch` para a pasta raiz do Drive
  2. Google Drive chama o endpoint `POST /atom/sync/notify` quando algo muda
  3. O Engine processa apenas o arquivo alterado (não a pasta inteira)
  4. Mirror .md é atualizado automaticamente


  ## Limitações Conhecidas
  - Webhooks do Drive expiram em 7 dias — precisaria de auto-renovação
  - Requer servidor publicamente acessível (ou ngrok em dev)
  - Quota: 100 push notification channels por usuário


  ## Próximos Passos
  - [ ] Ler documentação: https://developers.google.com/drive/api/guides/push
  - [ ] Prototipar endpoint de recebimento
  - [ ] Testar com documento de teste no Drive


  ## Referências
  - [[task_implementar-endpoint-get-api-v2-items_2026-03-29]] — task relacionada de API
  - [Drive Push Notifications](https://developers.google.com/drive/api/guides/push)
```


### 3.2 Exemplo Google Doc


**Título do Doc:** NOTE — Ideia: Sync Atom Engine via Google Drive API + webhook (2026-03-29)


**Body text:**


---
**Piso:** 2 | **Module:** Mind | **Tags:** atom-engine, sync, google-drive, arquitetura


## Ideia Central


Em vez de fazer polling do Google Drive a cada X minutos, usar a **Google Drive Push Notifications API** (webhooks) para notificar o Atom Engine em tempo real quando um documento é criado ou modificado.


Isso eliminaria:
- Latência de sincronização (de minutos para segundos)
- Consumo desnecessário de quota da API
- Complexidade de gerenciar o estado do "último sync"


## Como Funcionaria


1. Atom Engine registra um webhook via `channels.watch` para a pasta raiz do Drive
2. Google Drive chama o endpoint `POST /atom/sync/notify` quando algo muda
3. O Engine processa apenas o arquivo alterado
4. Mirror .md é atualizado automaticamente


## Limitações Conhecidas
- Webhooks expiram em 7 dias — precisaria de auto-renovação
- Requer servidor publicamente acessível
- Quota: 100 push notification channels por usuário


## Próximos Passos
- [ ] Ler documentação da Drive Push Notifications API
- [ ] Prototipar endpoint de recebimento
- [ ] Testar com documento de teste


---


---


## 4. Notas de Uso


- **Piso 2** é o mínimo porque notas são referência e conhecimento. Uma nota de observação rápida pode ser piso 2. Notas que sustentam decisões estratégicas podem subir para piso 4 ou 5.
- **Module mind** é o default porque notes são principalmente sobre conhecimento e pensamento. Notes sobre rotinas do corpo usam `body`; notes sobre projetos de trabalho podem usar `work`.
- **SEM body schema** — máxima liberdade no campo `notes`. Use todo o poder do Markdown.
- **Diferença entre note e idea:** `idea` é uma hipótese, possibilidade, "e se...". `note` é conhecimento, observação, referência já mais consolidada. A fronteira é tênue — use o type que sentir mais correto.
- **Diferença entre note e journal:** `journal` é temporal/reflexivo/pessoal (o que aconteceu, o que senti). `note` é atemporal/informacional (o que eu sei, o que descobri).
- `linked_items` é muito útil para notas — conectar ideias, tasks relacionadas, projetos que dependem desta nota.
- Wiki-links `[[slug-do-item]]` em `notes` são interpretados pelo Obsidian e por qualquer renderer compatível com wiki-links.
- `born_committed: true` é ideal para notas factuais, referências fixas, documentação de decisões já tomadas.
- Para notas longas com muitas subseções, considere se o conteúdo não seria melhor como um type mais específico (`decision`, `project`, `goal`).
- Tags devem facilitar busca futura — pense: "como eu pesquisaria por esta nota em 6 meses?"


---


*ATOM ENVELOPE — NOTE TEMPLATE v1.0 — 29 Mar 2026 — tmpl_meta v1.0*