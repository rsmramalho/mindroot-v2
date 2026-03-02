# MindRoot — Fase 1: Core Loop

## Arquivos incluídos (13 arquivos)

### NOVOS
- `src/engine/dashboard-filters.ts` — Engine de filtros, agrupamento, sorting
- `src/components/shared/ModuleBadge.tsx` — Badge de módulo standalone
- `src/components/shared/PriorityDot.tsx` — Indicador de prioridade standalone
- `src/components/shared/TagChip.tsx` — Chip de tag standalone
- `src/components/inbox/InboxActions.tsx` — Ações do inbox (módulo, prioridade, arquivar, promover)
- `src/components/dashboard/DashboardView.tsx` — Dashboard com seções por módulo
- `src/components/dashboard/FocusBlock.tsx` — Bloco de itens urgentes/importantes
- `src/components/dashboard/OverdueAlert.tsx` — Alerta de itens atrasados

### SUBSTITUIR (overwrite)
- `src/components/shared/ItemRow.tsx` — Agora com expand, edit inline, archive, delete
- `src/components/shared/EmptyState.tsx` — Agora aceita message/submessage custom
- `src/hooks/useItemMutations.tsx` — Agora com optimistic updates + update mutation
- `src/pages/Home.tsx` — Usa DashboardView ao invés de lista manual
- `src/pages/Inbox.tsx` — Usa InboxActions, selecionar item pra classificar

## Como aplicar

1. Copiar todos os arquivos para `C:\Users\rsmra\Downloads\mindroot\src\`
2. Manter a estrutura de pastas (criar `dashboard/` e `inbox/` em components se não existem)
3. Rodar `npm run dev`

## O que funciona agora

**Fluxo completo:** input → parsing → inbox → classificar módulo/prioridade → dashboard

### Home (Dashboard)
- Alerta de overdue no topo (pulsando)
- Bloco de Foco (urgente + importante) com tipografia Cormorant
- Seção "Hoje" com itens do dia
- Seções por módulo (Trabalho, Família, Corpo, etc.)
- Seção "Sem módulo" para itens não classificados
- Cada item: expand → ver tags, emoção, botões de ação
- Edit inline, archive, delete por item

### Inbox
- Lista itens sem módulo (não classificados)
- Tap num item → aparece InboxActions:
  - Módulo: selecionar Purpose/Work/Family/Body/Mind/Soul/Home
  - Prioridade: Urgente/Importante/Manutenção/Futuro
  - Hoje: promove item pra hoje (set due_date)
  - Arquivar: remove do fluxo ativo

### Componentes standalone
- ModuleBadge: badge colorido com ícone tipográfico por módulo
- PriorityDot: dot colorido com pulse animation no urgente
- TagChip: chip mono com # prefix

## Notas técnicas
- Optimistic updates em todas as mutations (UX snappy)
- dashboard-filters.ts é lógica pura, zero React — testável
- Nenhuma dependência nova necessária
- Design system: Cormorant Garamond (títulos), Inter (UI), JetBrains Mono (tags/data)
- Paleta: bg #111318, surface #1a1d24, text #e8e0d4, cores dos módulos e prioridades
