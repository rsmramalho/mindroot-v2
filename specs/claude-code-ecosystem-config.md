╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     spec                       ║
║ module:   bridge                     ║
║ state:    structured                 ║
║ status:   active                     ║
║ stage:    3 △ Triangulo              ║
║ tags:     [#system, #claude-code,    ║
║            #skills, #hooks, #agents] ║
║ source:   claude-project             ║
║ created:  2026-04-07                 ║
║ updated:  2026-04-07                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → references: Genesis v5.0.3       ║
║   → references: ATOM.md v1.2        ║
║   → references: dev-workflow v1.0    ║
║   → feeds: CLAUDE.md (todos repos)  ║
╚══════════════════════════════════════╝

# Claude Code — Configuração do Ecossistema Atom

**Versão:** 1.0
**Data:** 07 Abr 2026
**Status:** Active
**Princípio:** O Claude Code opera dentro das leis do Atom. Skills são rituais. Hooks são enforcement. Agents são papéis. Commands são atalhos.

---

## 1 — Estrutura de diretórios

Esta estrutura vive em `atom-engine-core/.claude/` e é referenciada (symlink ou cópia) pelos repos de vértices.

```
atom-engine-core/
├── CLAUDE.md                          ← policy master (raiz)
│
└── .claude/
    ├── settings.json                  ← configuração global
    │
    ├── skills/                        ← conhecimento reutilizável
    │   ├── atom-genesis.md            ← regras da state machine
    │   ├── atom-wrap.md               ← como gerar wraps
    │   ├── atom-audit.md              ← como auditar items
    │   ├── atom-spec.md               ← como escrever specs
    │   ├── atom-triage.md             ← como classificar items
    │   ├── coding-standards.md        ← padrões de código do ecossistema
    │   └── testing-standards.md       ← o que e como testar
    │
    ├── agents/                        ← subagentes especializados
    │   ├── guardian.md                ← interpreta contexto
    │   ├── auditor.md                 ← verifica compliance
    │   └── reviewer.md               ← review de PR
    │
    ├── hooks/                         ← automação em eventos
    │   ├── pre-session.sh             ← roda antes de cada sessão
    │   ├── post-edit.sh               ← roda após edits
    │   ├── pre-commit.sh              ← roda antes de commit
    │   └── session-log.sh             ← força log de sessão
    │
    └── commands/                      ← slash commands customizados
        ├── wrap.md                    ← /wrap
        ├── audit.md                   ← /audit
        ├── plan.md                    ← /plan
        ├── genesis-check.md           ← /genesis-check
        └── spec.md                    ← /spec
```

---

## 2 — Settings

```json
// .claude/settings.json
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(src/**)",
      "Write(supabase/**)",
      "Write(docs/**)",
      "Bash(pnpm tsc --noEmit)",
      "Bash(pnpm vitest run)",
      "Bash(pnpm build)",
      "Bash(pnpm lint)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log*)"
    ],
    "deny": [
      "Write(.env*)",
      "Write(CLAUDE.md)",
      "Bash(rm -rf*)",
      "Bash(git push --force*)",
      "Bash(git checkout main)",
      "Bash(docker*)"
    ]
  },
  "model": "claude-sonnet-4-20250514"
}
```

---

## 3 — Skills

### 3.1 atom-genesis.md

```markdown
---
name: atom-genesis
description: Regras da state machine do Atom Engine
autoload: true
---

# Atom Genesis — State Machine

Quando classificar, estruturar, ou validar items:

## 7 Estágios
1. · Ponto (inbox) — texto bruto, sem tipo
2. — Linha (classified) — type + module definidos
3. △ Triângulo (structured) — template aplicado, schema-compliant
4. □ Quadrado (validated) — 4 portões validados
5. ⬠ Pentágono (connected) — ≥1 connection tipada
6. ⬡ Hexágono (propagated) — efeito cascata registrado (opcional)
7. ○ Círculo (committed) — commit via wrap

## Regras
- Avanço: sempre sequencial. Não pula estágio.
- Exceção: wrap e session-log nascem no estágio 7 (born committed).
- Regressão: automática por perda de requisitos.
- Estágio 6 é opcional: 5→7 é válido se não houver cascata.
- Inbox obrigatório: tudo entra pelo ponto.

## 23 Types
note, reflection, task, habit, recipe, workout, ritual, review, spec,
checkpoint, session-log, recommendation, podcast, article, resource,
list, log, doc, research, template, lib, wrap, project

## 8 Módulos
work, body, mind, family, purpose, bridge, finance, social

## 8 Connections
references, feeds, blocks, triggers, spawns, mutates, archives, relates
```

### 3.2 atom-wrap.md

```markdown
---
name: atom-wrap
description: Como gerar wraps no formato Atom
autoload: false
trigger: "wrap|crepúsculo|fechar o dia|session wrap"
---

# Atom Wrap

Formato obrigatório:

═══ ATOM WRAP — [DD Mon YYYY] ([ritual_slot]) ═══
CREATED:    items criados nesta sessão
MODIFIED:   items editados
DECIDED:    decisões tomadas (com contexto)
CONNECTIONS: connections criadas/modificadas
SEEDS:      ideias que nasceram mas não foram executadas
SOUL:       aurora emotion → crepúsculo emotion + shift
AUDIT:      resultado do audit (naming, orphans, inbox count)
NEXT:       próximos passos concretos
═══════════════════════════════════════════════════

Regras:
- Seções vazias: omitir (não incluir com "nada")
- SOUL: opcional. Nunca forçar.
- NEXT: obrigatório. Sempre ter próximo passo.
- Wrap é AtomItem type=wrap, state=committed, genesis_stage=7
- Body JSONB é a fonte canônica. Texto é display.
- Nunca editar wrap depois de commitado.
```

### 3.3 atom-audit.md

```markdown
---
name: atom-audit
description: Como auditar items e compliance
autoload: false
trigger: "audit|verificar|check compliance"
---

# Atom Audit

## Aurora (leve)
- Último wrap commitado?
- Inbox vazio ou sob controle (< 10 items)?
- Docs misplaced?

## Crepúsculo (completo)
Aurora +
- Naming conventions corretas?
- Connections orphans (items sem nenhuma connection)?
- Folder growth rule (pastas só criadas quando usadas)?
- Duplicatas?
- Items abaixo do piso mínimo do type?

## Piso mínimo por type
- note, reflection, recommendation, podcast, article, resource, list → 2 (Linha)
- task, habit, recipe, workout, checkpoint → 3 (Triângulo)
- spec, project → 4 (Quadrado)
- wrap, session-log → 7 (born committed)

## Output
Resultado vive na seção AUDIT do wrap.
```

### 3.4 atom-spec.md

```markdown
---
name: atom-spec
description: Como escrever specs no formato Atom
autoload: false
trigger: "spec|especificação|feature spec"
---

# Atom Spec

Toda feature começa com spec. Documentar é executar.

## Formato
1. Atom Envelope (id, type=spec, module, state, stage, tags, connections)
2. Contexto: por que essa feature existe
3. Requisitos: o que deve fazer (não como)
4. Não-requisitos: o que explicitamente NÃO faz
5. Design: wireframe ou descrição visual
6. Implementação: como construir (componentes, hooks, stores)
7. Testes: o que testar
8. Connections: como se conecta com o resto do sistema

## Regras
- Spec ANTES de código. Sempre.
- Spec é AtomItem type=spec, stage mínimo 4 (validated).
- Spec precisa de pelo menos 1 connection com o Genesis ou outro spec.
- Se a feature muda, o spec atualiza primeiro.
```

### 3.5 atom-triage.md

```markdown
---
name: atom-triage
description: Como classificar items no inbox
autoload: false
trigger: "triage|classificar|inbox"
---

# Atom Triage

Quando um item está no inbox (estágio 1), classificar:

## Passo 1: Type
Qual dos 23 types melhor descreve? Se incerto, usar 'note'.

## Passo 2: Module
Qual dos 8 módulos? Se incerto, usar 'bridge'.

## Passo 3: Confiança
- Alta (>80%): aplicar direto, humano confirma depois
- Média (50-80%): sugerir com explicação
- Baixa (<50%): perguntar ao humano

## Passo 4: Tags
Adicionar tags relevantes. Formato: #dominio:valor
Exemplos: #domain:time, #who:flora, #project:mindroot

## Regra
Nunca pular da classificação pra structured sem humano confirmar.
O humano sempre confirma type + module antes do estágio 3.
```

### 3.6 coding-standards.md

```markdown
---
name: coding-standards
description: Padrões de código do ecossistema Atom
autoload: true
---

# Coding Standards

## TypeScript
- Strict mode sempre. Zero `any`.
- Preferir interfaces sobre types para objetos.
- Enums: usar `as const` em vez de enum keyword.
- Null checks: optional chaining (?.) + nullish coalescing (??)

## React
- Functional components only. Nunca class components.
- Hooks no topo do componente.
- useCallback/useMemo: só quando necessário (profiling primeiro).
- Props: desestruturar na assinatura.

## Tailwind
- Mobile-first: começar sem prefix, adicionar sm: md: lg: pra maior
- Nunca usar !important
- Extrair componentes quando um padrão de classes se repete 3+ vezes
- Dark mode: usar dark: prefix

## Supabase
- Toda query tipada com generics do supabase-js
- RLS policies testadas para cada role
- Migrations: uma migration por mudança lógica
- Nunca usar service key no frontend

## Naming
- Componentes: PascalCase (CaptureSheet.tsx)
- Hooks: camelCase com use prefix (useSoulStore.ts)
- Utils: camelCase (formatDate.ts)
- Types: PascalCase (AtomItem, SoulExtension)
- Constants: UPPER_SNAKE (MAX_INBOX_SIZE)
- Database: snake_case (item_connections, atom_events)
```

### 3.7 testing-standards.md

```markdown
---
name: testing-standards
description: O que e como testar no ecossistema Atom
autoload: true
---

# Testing Standards

## Prioridade de testes
1. State machine (genesis-engine) — 90%+ cobertura
2. RLS policies — 100% (cada policy tem teste)
3. Hooks e utils — 80%+
4. Componentes interativos — 50%+

## Convenção
- Testes co-locados: `useSoulStore.test.ts` ao lado de `useSoulStore.ts`
- Testes de integração: `__tests__/` separado
- Naming: `describe('NomeDoMódulo')` + `it('should + comportamento')`

## O que sempre testar
- Transições de estágio (1→2→3...→7)
- Regressão automática
- Morph (mutação de type)
- Wrap commit (items commitados corretamente?)
- Seeds extraídas no wrap
- RLS: cada role vê só o que deve
- Validação de envelope (campos obrigatórios)

## O que nunca testar
- Implementação interna (testar comportamento, não implementação)
- Estilo CSS (visual testing é futuro)
- Third-party libraries
```

---

## 4 — Agents (subagentes)

### 4.1 guardian.md

```markdown
---
name: guardian
description: Interpreta contexto antes de executar. Nunca edita código.
model: claude-sonnet-4-20250514
tools:
  - Read
  - Bash(git log)
  - Bash(git diff)
---

# Guardian — O Guardião

Tu és o Guardião do ecossistema Atom. Teu papel é INTERPRETAR, nunca executar.

Antes de qualquer task, responde:
1. Qual pilar essa task toca? (Emotion / Action / Time)
2. Qual camada da matriz? (Estrutura / Interface / Dados / Infra)
3. Isso nasce de dentro pra fora?
4. O pilar de origem tem flow E2E verificado?
5. O que não sabemos antes de começar?

Se qualquer resposta levantar dúvida, PARA e reporta ao humano.
Nunca assume. Nunca edita. Nunca implementa. Só interpreta.

Output: um bloco GUARDIAN com as 5 respostas + recomendação.
```

### 4.2 auditor.md

```markdown
---
name: auditor
description: Verifica compliance com Genesis e padrões. Read-only.
model: claude-sonnet-4-20250514
tools:
  - Read
  - Bash(pnpm tsc --noEmit)
  - Bash(pnpm vitest run)
  - Bash(pnpm lint)
---

# Auditor — O Verificador

Tu és o Auditor do ecossistema Atom. Teu papel é VERIFICAR, nunca corrigir.

Checklist binário:
[ ] Genesis schema alinhado com DB?
[ ] type-schemas.json consistente com o código?
[ ] Feature tem spec antes de ter código?
[ ] Spec tem connection no Genesis?
[ ] PENTAGON.md reflete estado atual?
[ ] tsc --noEmit: zero erros?
[ ] vitest run: zero falhas?
[ ] Build passa?

Output: um bloco AUDIT com cada item ✅ ou ❌ + detalhes dos que falharam.
Se qualquer ❌ → bloqueia o commit. O humano decide como resolver.
```

### 4.3 reviewer.md

```markdown
---
name: reviewer
description: Review de PR focado em bugs e segurança.
model: claude-sonnet-4-20250514
tools:
  - Read
  - Bash(git diff)
---

# Reviewer — O Revisor

Tu és o Revisor de PRs do ecossistema Atom.

Foco EXCLUSIVO em:
1. Bugs lógicos
2. Vulnerabilidades de segurança (RLS bypass, secrets expostos, injection)
3. Violação de Genesis (state machine, types inválidos, connections erradas)
4. Performance óbvia (N+1 queries, re-renders desnecessários)

NÃO comentar sobre:
- Estilo de código (Prettier cuida)
- Naming preferences
- Organização de imports
- "Eu faria diferente"

Ser conciso. Só reportar o que importa.
Output: lista de findings com severidade (critical / warning / info).
```

---

## 5 — Hooks

### 5.1 pre-session.sh

```bash
#!/bin/bash
# Hook: roda antes de cada sessão do Claude Code
# Propósito: verificar saúde do ambiente

echo "=== ATOM PRE-SESSION CHECK ==="

# Verifica se está no branch certo
BRANCH=$(git branch --show-current)
if [ "$BRANCH" = "main" ]; then
    echo "⚠️  ATENÇÃO: Tu estás na branch main. Cria uma feature branch primeiro."
    echo "   git checkout -b feature/nome-da-feature"
fi

# Verifica se tem mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Mudanças não commitadas detectadas:"
    git status --short
fi

# Verifica TypeScript
echo "--- TypeScript check ---"
pnpm tsc --noEmit 2>&1 | tail -3

# Conta items no inbox (se tiver acesso ao Supabase)
# echo "--- Inbox count ---"
# Futuro: query no Supabase pra contar items no inbox

echo "=== PRE-SESSION COMPLETE ==="
```

### 5.2 post-edit.sh

```bash
#!/bin/bash
# Hook: roda após edits no código
# Propósito: enforcement do Hook 2 do ATOM.md §Hexágono

echo "=== ATOM POST-EDIT CHECK ==="

ERRORS=0

# TypeScript
echo "--- tsc --noEmit ---"
if ! pnpm tsc --noEmit 2>/dev/null; then
    echo "❌ TypeScript errors found"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ TypeScript OK"
fi

# Tests
echo "--- vitest run ---"
if ! pnpm vitest run --reporter=dot 2>/dev/null; then
    echo "❌ Tests failed"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Tests OK"
fi

# Build
echo "--- build ---"
if ! pnpm build 2>/dev/null; then
    echo "❌ Build failed"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Build OK"
fi

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "🚫 $ERRORS check(s) failed. Corrigir antes de continuar."
    exit 1
fi

echo "=== POST-EDIT COMPLETE ✅ ==="
```

### 5.3 pre-commit.sh

```bash
#!/bin/bash
# Hook: roda antes de qualquer commit
# Propósito: enforcement do Hook 3 do ATOM.md §Hexágono

echo "=== ATOM PRE-COMMIT CHECK ==="

ERRORS=0

# Verifica console.log
CONSOLE_LOGS=$(grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" -l 2>/dev/null)
if [ -n "$CONSOLE_LOGS" ]; then
    echo "❌ console.log encontrado em:"
    echo "$CONSOLE_LOGS"
    ERRORS=$((ERRORS + 1))
fi

# Verifica .env não commitado
if git diff --cached --name-only | grep -q "\.env"; then
    echo "❌ .env file sendo commitado — BLOQUEADO"
    ERRORS=$((ERRORS + 1))
fi

# Verifica commit message format
COMMIT_MSG=$(cat "$1" 2>/dev/null || echo "")
if [ -n "$COMMIT_MSG" ]; then
    if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|refactor|test|chore|style)\(.+\): .+"; then
        echo "⚠️  Commit message não segue formato: tipo(escopo): descrição"
    fi
fi

# Post-edit checks já passaram? (tsc + vitest + build)
# Se estiver usando husky, o post-edit.sh já garante isso.

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "🚫 Commit bloqueado. $ERRORS problema(s) encontrado(s)."
    exit 1
fi

echo "=== PRE-COMMIT COMPLETE ✅ ==="
```

---

## 6 — Commands (slash commands)

### 6.1 /wrap

```markdown
---
name: wrap
description: Gera um Atom Wrap da sessão atual
---

Gera um wrap da sessão atual seguindo o formato:

1. Liste todos os items CREATED nesta sessão
2. Liste todos os items MODIFIED
3. Liste todas as DECIDED (decisões tomadas com contexto)
4. Liste CONNECTIONS criadas
5. Extraia SEEDS (ideias mencionadas mas não executadas)
6. Pergunte sobre SOUL (opcional — "como tu tá saindo?")
7. Rode um AUDIT leve (inbox count, naming, orphans)
8. Proponha NEXT (próximos passos concretos)

Formato: seção ATOM WRAP do skill atom-wrap.
Seções vazias: omitir.
NEXT é obrigatório.
```

### 6.2 /audit

```markdown
---
name: audit
description: Roda auditoria completa do repo
---

Invoque o subagent `auditor` para verificar compliance:

1. Genesis schema vs DB
2. type-schemas.json vs código
3. Specs existem para features implementadas?
4. PENTAGON.md reflete estado atual?
5. tsc --noEmit
6. vitest run
7. Build

Reporte resultado como bloco AUDIT com ✅/❌ por item.
```

### 6.3 /plan

```markdown
---
name: plan
description: Cria um plano de implementação ANTES de codar
---

NÃO implemente ainda. Apenas planeje:

1. Invoque o subagent `guardian` para interpretar contexto
2. Identifique: pilar, camada da matriz, flow E2E afetado
3. Liste decisões que precisam ser tomadas
4. Liste o que não sabemos
5. Proponha ordem de implementação (passos numerados)
6. Identifique riscos e dependências
7. Estime complexidade (S/M/L)

Output: bloco PLAN. Espere aprovação do humano antes de implementar.
```

### 6.4 /genesis-check

```markdown
---
name: genesis-check
description: Verifica se um item está compliant com o Genesis
---

Para o item especificado, verifique:

1. Type é um dos 23 válidos?
2. Module é um dos 8 válidos?
3. State é válido para o stage atual?
4. Stage atual respeita o piso mínimo do type?
5. Se stage ≥ 4: os 4 portões estão validados?
6. Se stage ≥ 5: tem pelo menos 1 connection?
7. Se stage = 7: foi commitado via wrap?
8. Envelope segue o Meta-Template?

Output: GENESIS CHECK com cada item ✅/❌.
```

### 6.5 /spec

```markdown
---
name: spec
description: Cria uma feature spec no formato Atom
---

NÃO implemente. Crie uma spec:

1. Gere o Atom Envelope (type=spec, module, tags, connections)
2. Escreva Contexto (por que essa feature existe)
3. Escreva Requisitos (o que deve fazer)
4. Escreva Não-requisitos (o que NÃO faz)
5. Proponha Design (wireframe textual ou descrição visual)
6. Proponha Implementação (componentes, hooks, stores)
7. Proponha Testes (o que testar)
8. Identifique Connections (como se conecta com o resto)

Output: documento completo seguindo o Meta-Template.
Salve em: specs/spec_[nome]_v1-0.md
```

---

## 7 — Setup em repos de vértices

Cada repo do ecossistema referencia o core:

### Opção A: Git submodule (recomendado)

```bash
# No repo do MindRoot
git submodule add https://github.com/[USER]/atom-engine-core.git .atom-core

# Symlink dos arquivos
ln -s .atom-core/.claude .claude
# CLAUDE.md é copiado (não symlink) pra poder estender
cp .atom-core/CLAUDE.md CLAUDE.md
```

### Opção B: Cópia manual (simples)

```bash
# Copia .claude/ do core pro repo
cp -r ../atom-engine-core/.claude .claude
cp ../atom-engine-core/CLAUDE.md CLAUDE.md
```

### Extensão por vértice

No CLAUDE.md do MindRoot, adiciona no final:

```markdown
---

## Extensões MindRoot (V1)

### Rotas
- / → Aurora (home/check-in)
- /capture → Captura rápida
- /library → Navegar items por type
- /graph → Visualizar connections
- /wrap → Ritual de wrap
- /raiz → Inventário dos 9 domínios

### Design System
- Tokens CSS: src/index.css
- Cores por módulo: definidas no Genesis, implementadas em tailwind.config
- Fonte: [definir]
- Spacing: 4px base grid

### Features em desenvolvimento
- [listar features ativas com link pra spec]
```

---

## 8 — Como atualizar

Quando o core muda (novo skill, novo hook, novo agent):

```bash
# Se usando submodule
cd .atom-core
git pull origin main
cd ..
git add .atom-core
git commit -m "chore(core): update atom-engine-core"

# Se usando cópia
cp -r ../atom-engine-core/.claude .claude
git add .claude
git commit -m "chore(core): sync .claude from atom-engine-core"
```

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-04-07 | Documento inaugural. 7 skills, 3 agents, 3 hooks, 5 commands, settings, setup por vértice. Alinhado com ATOM.md §Hexágono e Genesis v5. |

---

*Skills são rituais. Hooks são enforcement. Agents são papéis.*
*O Claude Code opera dentro das leis do Atom.*
*De dentro pra fora — inclusive no agente.*
