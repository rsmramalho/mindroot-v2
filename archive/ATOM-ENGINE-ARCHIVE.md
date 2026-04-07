# Atom Engine 4.0 — Archive

Data de arquivamento: 17/03/2026
Status: **Superseded pelo MindRoot v1.0.0**

---

## O que era

O Atom Engine 4.0 foi o projeto conceitual que precedeu o MindRoot. Desenvolvido como
sistema de documentação antes do código, consistia em dois corpos de trabalho paralelos:

**Série A — Narrativo (Google Drive)**
Documentos A.1 a A.13 descrevendo o comportamento de cada engine em linguagem natural.
Inclui: Parsing Engine, Ritual Engine, Calendar Engine, Habit Engine, Recurrence Engine,
Inbox Engine, Macro Picker, Project Engine, Dashboard Engine, Reflection Engine,
End-to-End Flow, e Project Sheet.

**Série B — Técnico (Google Drive)**
Documentos B.3 a B.13 com especificações técnicas correspondentes às narrativas da série A.

**Documento de controle:** AtomEngine_4.0_Arquivo (Google Drive) — índice com prompt
de contexto e lista de referências oficiais.

**Código:** Projeto MindMate (~Downloads/mindmate/) — alpha funcional com ~20-25%
da spec implementada ao momento do arquivamento.

---

## Por que foi arquivado

O MindRoot rebuild (iniciado 02/03/2026) implementou a spec completa do Atom Engine
e foi além. Correspondência direta:

| Atom Engine spec | MindRoot |
|---|---|
| Parsing Engine (A.7/B.7) | alpha.5 — Edge Function parse-input (Claude Haiku) |
| Ritual Engine (A.3) | alpha.3 + alpha.9 — recurrence, streak badges |
| Habit + Recurrence (A.5) | alpha.9 — virtual reset, RecurrencePicker |
| Inbox Engine (A.6/B.6) | alpha.2 — InboxPage, soul layer |
| Calendar Engine (A.4) | alpha.4 — CalendarView, MonthGrid |
| Project Engine (A.9) | alpha.4 — ProjectList, ProjectSheet |
| Reflection Engine (A.11/B.11) | alpha.3 — JournalView, JournalEntry |
| Dashboard Engine (A.10) | alpha.2 + alpha.15 — analytics v2, insights |
| Macro Picker (A.8/B.8) | alpha.16 — CommandPalette com filtros |
| End-to-End Flow (A.12/B.12) | alpha.12 — M1 estabilização completa |

Os gaps que existiam no MindMate (Edge Function não deployada, Google Auth,
seed de rituais) foram todos resolvidos no MindRoot até o alpha.6.

---

## Onde está a documentação

A documentação conceitual original permanece no Google Drive (série A e B).
Não foi migrada para o repo — não é necessário. Serve como referência histórica
de como o sistema foi pensado antes de ser construído.

Se necessário consultar: buscar "AtomEngine_4.0_Arquivo" no Google Drive —
esse doc contém o índice completo com links para todos os documentos da série.

---

## O que NÃO fazer

- Não implementar nada do Atom Engine separadamente — tudo já existe no MindRoot
- Não sincronizar a documentação do Drive com o código — está superseded
- Não reabrir o projeto MindMate — o repo pode ser descartado

---

## Referência

Projeto ativo: https://github.com/rsmramalho/mindroot
Deploy: https://mindroot.com.au
Versão atual: v1.0.0 (alpha.25.2)
