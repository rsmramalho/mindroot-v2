# Continuação — UX Wireframes MindRoot
## Sessão anterior: 31 Mar 2026 (noite)

## Contexto
Sessão de wireframes mid-fi para o MindRoot. 3 telas entregues como HTML interativo. Próximo: telas restantes (Triage/Pipeline, Calendar, Analytics) + telas secundárias (Library, Settings, Reflexões).

## Arquivos entregues (no chat anterior)
1. `mindroot-wireframe-home.html` — Aurora + Crepúsculo lado a lado
2. `mindroot-wireframe-wrap.html` — Stepper interativo 7 passos com animação geométrica
3. `mindroot-wireframe-projects.html` — Lista com cards + Detalhe do Atom Engine

## Decisões de UX já definidas (39 originais + novas desta sessão)

### Princípios
- D0: Progressive disclosure como princípio universal (3 camadas)
- Formato: mid-fi com ícones e proporções reais
- Entrega: inline (Visualizer) + arquivo final HTML
- Wireframes = blueprint, não pixel final. Define estrutura, flow, hierarquia.

### Home (definida)
- Seções na ordem: Soul → Input → Items → Inbox (D18)
- Tom muda por período: aurora=dourado, zênite=neutro, crepúsculo=roxo (D17)
- Soul card: orbe de energia pulsante (gradiente radial), intenção como texto principal, emoção secundária com badge energy
- AtomInput: placeholder "o que está na cabeça?" (aurora) / "última captura antes do wrap..." (crepúsculo). Ícone ponto (·) = estágio 1
- Items ativos: barra de progresso colorida por type, deadline visível, módulo como cor na borda esquerda (azul=work, roxo=purpose)
- Inbox: contagem coral, preview 3 items, "triar →"
- Audit health bar mini (D19)
- Crepúsculo: banner wrap entre Soul e Input ("hora do wrap ○", contagem items, botão "iniciar")
- BottomNav: 4 tabs — Home, Projects, Calendar, Analytics (D29)

### Wrap stepper (definido)
- **7 passos = 7 estágios Genesis** (decisão nova: merged Created+Modified)
  1. Soul — texto livre + chips como sugestão, energy toggle, shift visual aurora→crepúsculo
  2. Items — criados + modificados em seções, checkboxes pra excluir
  3. Decided — decisões em linguagem natural, campo pra adicionar
  4. Connections — edges source→relation→target
  5. Seeds — entropia, botão sim/não por seed (opcional)
  6. Audit — health check automático com ✓ e ⚠
  7. Commit — **animação geométrica · → — → △ → □ → ⬠ → ⬡ → ○** (formas aparecem uma a uma, label acumula). Depois: stats + NEXT obrigatório. Botão verde "commitar ○"
- Pós-commit: tela "wrap commitado" com "boa noite, Rick. ○"
- Soul: linguagem livre como entrada principal (Marco Zero: "'meio bosta' é válido")
- Dominó commit (D10): um tap dispara Drive + Supabase + .md mirror

### Projects page (definida)
- Lista agrupada por módulo (mod-work, mod-purpose)
- Summary cards: total projetos, ativos, items
- Tabs filtro: todos, work, purpose, ativos
- Cards com: nome, status badge, **próxima milestone** (◆ next: ...), **última atividade** (tempo relativo), meta (items, conn, stage), barra progresso
- Below floor: ⚠ warning amber nos cards (Muda, Yugar)
- Módulo como cor na borda esquerda (mesmo padrão da Home)
- Detalhe do projeto: header grande, progresso 6px, items com geometria, links (roadmap, Drive, GitHub), #who tags, connections

### Decisões pendentes das 39 originais (ainda sem wireframe)
- D1-D3: Inbox/Triage — animação, chip inline, dashboard + page
- D4-D6: Pipeline visual — geometria + cor, below-floor badge, morph animation
- D27: Calendário — Google Calendar integration
- D28: Analytics — 3 tabs (Pipeline, Soul, Conexões)
- D23-D24: Reflexões — page dedicada, via menu
- D30-D32: Canais — AtomInput + share + email (3 fases) + voice
- D33-D36: Library via menu, lists independentes, body UI dedicada, cards com preview
- D37-D39: Search barra + Cmd+K, filtros progressivos, push rituais + wrap + stale

## Design system emergente
- Font: DM Sans (300/400/500)
- Cores módulo: work=#378ADD, purpose=#7F77DD, body=#D85A30, mind=#1D9E75
- Cores type: spec=#EEEDFE/#534AB7, task=#E6F1FB/#185FA5, note=#EAF3DE/#3B6D11, reflection=#FBEAF0/#993556, reco=#FAEEDA/#854F0B
- Geometrias: · — △ □ ⬠ ⬡ ○ (estágios 1-7)
- Períodos: aurora=ambar/dourado, zênite=neutro/azul, crepúsculo=roxo/índigo
- Orbe de energia: radial gradient pulsante, cor muda por período
- Progresso: gradiente por type (spec=roxo, task=azul, etc.)
- Cards: border-radius 14px, border .5px, padding 14-16px
- Mobile-first: 375x812 (iPhone frame)
- Dark mode: suportado via CSS vars e prefers-color-scheme

## Pedido
Continuar wireframes para as telas restantes. Sugestão de ordem:
1. Triage/Pipeline — onde a geometria Genesis ganha vida na UI
2. Calendar — integração Google Calendar
3. Analytics — 3 tabs (Pipeline health, Soul patterns, Connection graph)
4. Telas secundárias (Library, Reflexões, Settings)