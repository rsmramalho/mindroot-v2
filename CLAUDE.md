# CLAUDE.md — Atom Ecosystem

> Este arquivo é policy operacional + build protocol para o Claude Code.
> Vive na raiz de cada repo do ecossistema.
> Referência canônica: atom-engine-core/CLAUDE.md (este arquivo).
> Repos de vértices (mindroot, constellation) herdam e estendem.

---

## CHANGELOG DE MERGE

> Documento original: Genesis Build Protocol v1.0 (CLAUDE.md de 03 Abr 2026)
> Merge com: Ecosystem Policy v1.0 (criado 07 Abr 2026)
> Data do merge: 07 Abr 2026
>
> | Seção | Status | O que mudou |
> |-------|--------|-------------|
> | §1 Identidade | **NOVO** | Adicionado. Contexto do ecossistema pra Claude Code saber onde está. |
> | §2 Hierarquia de docs | **NOVO** | Adicionado. Ordem de leitura + regra de conflito. |
> | §3 Build Protocol (5 agentes) | **MANTIDO INTACTO** | 100% do Genesis Build Protocol v1.0 original. Zero alterações. |
> | §4 Regras de código | **NOVO** | TypeScript, React, Tailwind, Supabase, naming, imports. |
> | §5 Regras de Git | **NOVO** | Branching, commits, tags. Ref: ops/dev-workflow.md. |
> | §6 Regras do Atom Engine | **NOVO** | Inbox obrigatório, state machine, wraps, MindRoot não lançado. |
> | §7 Hooks (enforcement) | **REESTRUTURADO** | Os 4 Protocolos do Build Protocol + novos hooks operacionais. Os 4 originais agora são §3.2. Os hooks de codebase (tsc/vitest/build) são §7. |
> | §8 O que NUNCA fazer | **NOVO** | Lista de proibições absolutas. |
> | §9 Stack | **NOVO** | Tabela da stack real (Vite, não Next.js). |
> | §10 Contexto por repo | **NOVO** | Diferenças entre atom-engine-core, mindroot-v2, constellation, atlas. |
> | §11 Skills/Agents/Commands | **NOVO** | Referência ao .claude/ config. |
> | Guardião Audit | **ABSORVIDO** | Referenciado via §11 (command /audit). Spec original permanece em specs/. |
>
> **Princípio do merge:** nada do original foi removido ou alterado.
> O Build Protocol é o coração. A policy operacional é a pele.

---

## 1 — Identidade

> **[NOVO]** — Contexto que o original não tinha.

Tu estás trabalhando no ecossistema **Atom** — um sistema operacional pessoal.

- **Atom Engine** = o protocolo (Genesis v5, schema v2, state machine)
- **MindRoot** = V1 do Pentágono (interface pessoal)
- **Constellation** = V2 (consultoria PMEs) — status: paused
- **Atlas Frames** = Hexágono (propagação externa)
- **Yugar** = V4 (propriedade física + comunidade) — status: concept
- **Muda** = V5 (incubadora/impacto social) — status: concept

Lingua: **português brasileiro** para comunicação. Inglês para código, commits, e nomes técnicos.

---

## 2 — Hierarquia de documentos

> **[NOVO]** — Define ordem de leitura e regra de conflito.

Lê nesta ordem. Se houver conflito, o de cima prevalece.

1. `law/genesis.md` — a lei (schema, state machine, 7 estágios)
2. `law/marco-zero.md` — operação do dia (rituais, regras de sobrevivência)
3. `law/meta-template.md` — formato de todo template/doc
4. `law/identidade.md` — nomenclatura (Atom, Engine, Pentágono, Hexágono)
5. `ATOM.md` — o método (pilares, matriz, fundações, enforcement)
6. `ops/dev-workflow.md` — Git, CI/CD, testes, deploy
7. `ops/infra.md` — servidor, Docker, rede
8. Este `CLAUDE.md` — policy executável

---

## 3 — Genesis Build Protocol v1.0

> **[MANTIDO INTACTO]** — 100% do CLAUDE.md original. Zero alterações.
> Parent: Genesis v5.0.1 + Meta-Template v1.1
> Princípio: Cada camada nasce da anterior. Nenhuma camada conhece o que está acima dela.

### 3.1 Filosofia

O problema padrão de AI gerando código: o agente vê tudo de uma vez, implementa pelo que é visível (UI), e perde a geometria do schema ao longo do caminho.

Este protocolo inverte isso.

Cinco agentes. Cada um só conhece o que nasceu antes dele. O contexto cresce como Fibonacci — cada agente recebe a soma dos anteriores, não o codebase inteiro. A geometria é preservada porque cada decisão de implementação é tomada a partir do contrato, não da suposição.

```
· GUARDIÃO  →  output G
— ROOT      →  output G + R
△ ESTRUTURA →  output G + R + E
□ INTERFACE →  output G + E + I   (recebe Estrutura, não Root diretamente)
⬠ TEIA      →  output G + R + E + I + validação
```

### 3.2 Os 4 Protocolos

Todo agente, antes de gerar qualquer output, executa estes 4 protocolos internamente:

**1. Proporção Invertida**
> "O que eu NÃO sei ainda sobre esta camada?"
Listar incertezas antes de construir. Não avançar onde há dúvida não resolvida.

**2. Maturação Permissiva**
> "A camada anterior está completa o suficiente para esta nascer?"
Se não está — parar. Reportar o que falta. Não construir em cima de fundação incompleta.

**3. Detector de Trava**
> "Estou construindo a partir da camada abaixo ou estou assumindo algo que não foi definido?"
Questionar o impulso automático de implementar. Se a resposta não está na camada anterior, não inventar.

**4. Tudo Só É**
> "Esta conexão entre camadas existe no schema, ou estou criando uma dependência que não foi especificada?"
Não forçar. Se a conexão não está no Genesis, não criar.

### 3.3 Agente 1 — GUARDIÃO · Ponto

**Recebe:** Genesis v5 + Meta-Template v1.1 + spec/task da sessão atual
**Nunca recebe:** código, codebase existente, ou output de outros agentes
**Função:** autoridade do schema. Não escreve código. Só valida e define constraints.

**Output obrigatório antes de passar pro próximo agente:**

```
GUARDIÃO — CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━
AtomTypes envolvidos: [lista]
AtomModules: [lista]
State machine relevante: [estágios + gates]
Extensions que se aplicam: [soul / operations / recurrence]
Campos obrigatórios por type: [lista]
Enums válidos em uso: [lista]
Pisos mínimos: [type → piso]
Connections esperadas: [relation types]

⚠ INCERTEZAS (Proporção Invertida):
[o que ainda não está claro no schema para esta task]

✓ APROVADO PARA: ROOT
```

Se houver incerteza não resolvida → parar e perguntar. Não passar pro Root com dúvida aberta.

### 3.4 Agente 2 — ROOT — Linha

**Recebe:** Genesis v5 + output do GUARDIÃO
**Nunca recebe:** componentes UI, lógica de negócio, ou output de outros agentes além do Guardião
**Função:** schema do banco de dados. Supabase: tabelas, colunas, tipos, enums, triggers, RLS, RPCs.

**Gate de entrada:**
- [ ] Output do Guardião está presente e aprovado?
- [ ] Todos os AtomTypes listados pelo Guardião têm schema definido?

**Output obrigatório:**

```
ROOT — SCHEMA
━━━━━━━━━━━━━
SQL: [tabelas + colunas + constraints]
TypeScript types: [interfaces derivadas do schema]
Enums: [valores válidos conforme Genesis]
Triggers: [FSM downgrades se aplicável]
RLS: [políticas de acesso]
RPCs: [funções Supabase se necessário]

Cross-check Guardião:
[verificar cada constraint do Guardião foi respeitada]

⚠ INCERTEZAS (Proporção Invertida):
[o que ainda não está definido no schema]

✓ APROVADO PARA: ESTRUTURA
```

### 3.5 Agente 3 — ESTRUTURA △ Triângulo

**Recebe:** Genesis v5 + output do GUARDIÃO + output do ROOT
**Nunca recebe:** componentes UI ou CSS
**Função:** lógica de negócio. Services, hooks React, mutations, queries. Toda função consome os tipos do Root — nunca acessa banco diretamente.

**Gate de entrada:**
- [ ] Schema do Root está completo?
- [ ] Todos os TypeScript types estão definidos?
- [ ] Nenhuma função desta camada criará dependência de UI?

**Output obrigatório:**

```
ESTRUTURA — LÓGICA
━━━━━━━━━━━━━━━━━━
Services: [funções que consomem Supabase via types do Root]
Hooks: [React hooks que encapsulam a lógica]
Mutations: [create / update / delete]
Queries: [read / subscribe]
State transitions: [FSM chamadas quando aplicável]

Cross-check Root:
[verificar toda função usa types definidos pelo Root, não strings literais]

Cross-check Guardião:
[verificar state machine está sendo respeitada]

⚠ INCERTEZAS (Proporção Invertida):
[o que a UI precisará que ainda não está coberto]

✓ APROVADO PARA: INTERFACE
```

### 3.6 Agente 4 — INTERFACE □ Quadrado

**Recebe:** Genesis v5 + output do GUARDIÃO + output da ESTRUTURA
**Não recebe diretamente:** SQL do Root (acessa banco apenas via hooks da Estrutura)
**Função:** componentes React. Consome exclusivamente através dos hooks e services da Estrutura.

**Gate de entrada:**
- [ ] Todos os hooks necessários estão definidos na Estrutura?
- [ ] Nenhum componente fará query direta ao Supabase?
- [ ] Os AtomTypes do Guardião se refletem nos componentes?

**Output obrigatório:**

```
INTERFACE — COMPONENTES
━━━━━━━━━━━━━━━━━━━━━━━
Componentes: [lista com props types]
Props: [tipados via interfaces do Root]
Hooks consumidos: [referência aos hooks da Estrutura]
State local: [useState / useReducer quando necessário]

Cross-check Estrutura:
[verificar nenhum componente acessa banco diretamente]

Cross-check Guardião:
[verificar campos obrigatórios do Genesis têm representação na UI]

⚠ INCERTEZAS (Proporção Invertida):
[interações que ainda não têm handler definido]

✓ APROVADO PARA: TEIA
```

### 3.7 Agente 5 — TEIA ⬠ Pentágono

**Recebe:** todos os outputs anteriores
**Função:** integração e cross-check final. Valida que a geometria está intacta do Ponto ao Quadrado. Corrige onde necessário.

**Checklist obrigatória:**

```
TEIA — VALIDAÇÃO FINAL
━━━━━━━━━━━━━━━━━━━━━━

GEOMETRIA (inside-out):
[ ] Interface nunca acessa banco diretamente?
[ ] Estrutura nunca importa componentes UI?
[ ] Root não tem lógica de negócio?
[ ] Guardião foi consultado para cada decisão de schema?

GENESIS COMPLIANCE:
[ ] Todos os AtomTypes usados são válidos (enum Genesis Part 4)?
[ ] Todos os AtomModules são válidos?
[ ] State machine respeitada (nenhum estágio pulado)?
[ ] Pisos mínimos respeitados?
[ ] Connections tipadas com AtomRelation válido?

INTEGRIDADE:
[ ] TypeScript types consistentes entre camadas?
[ ] Nenhum `any` sem justificativa?
[ ] Naming convention do Genesis aplicada?
[ ] ATOM ENVELOPE correto nos exports?

GAPS DETECTADOS:
[listar qualquer ponto onde a geometria foi comprometida]

CORREÇÕES NECESSÁRIAS:
[o que precisa voltar para qual agente]

STATUS FINAL: APROVADO / REQUER CORREÇÃO
```

### 3.8 Como invocar

**Task completa (nova feature ou módulo):**

```
Seguindo o Genesis Build Protocol:

1. GUARDIÃO: leia Genesis v5 + Meta-Template. Identifique constraints para [task].
2. Aguarde aprovação do Guardião antes de continuar.
3. ROOT: com base no Guardião, crie o schema.
4. Aguarde validação do Root antes de continuar.
5. ESTRUTURA: com base no Guardião + Root, crie a lógica.
6. Aguarde validação da Estrutura antes de continuar.
7. INTERFACE: com base no Guardião + Estrutura, crie os componentes.
8. TEIA: valide a geometria completa.
```

**Edição pontual (corrigir ou adicionar em camada específica):**

```
Camada: [GUARDIÃO / ROOT / ESTRUTURA / INTERFACE]
Escopo: [o que precisa mudar]

Antes de editar:
- Verificar constraints do Guardião para este escopo
- Confirmar que a mudança não quebra a camada abaixo
- Rodar cross-check após a edição
```

**Quando o protocolo pode ser simplificado:**

Se a task for puramente visual (CSS, layout, animação) e não tocar em dados → INTERFACE direto, sem Root ou Estrutura.

Se a task for puramente de schema (nova tabela sem UI ainda) → GUARDIÃO + ROOT apenas.

O protocolo escala pra baixo. Nunca pula para cima.

### 3.9 Regra de Ouro

**Se qualquer agente não tem resposta para uma pergunta do protocolo — para. Pergunta. Não assume.**

A geometria perfeita não é aquela que nunca tem dúvida. É aquela que não constrói sobre dúvida não resolvida.

---

## 4 — Regras de código

> **[NOVO]** — O Build Protocol define o *processo*. Esta seção define o *estilo*.

- **TypeScript strict** — `noEmit` zero errors sempre. Nunca `any`. Nunca `as unknown as X` exceto em testes.
- **Tailwind** para styling — sem CSS custom exceto tokens do design system em `src/index.css`
- **Mobile-first** — viewport 360×800 como mínimo. Testar antes de commitar.
- **Imports** — usar `@/` alias. Nunca relative paths profundos (`../../../`)
- **Componentes** — um componente por arquivo. Nome = PascalCase. Arquivo = PascalCase.tsx
- **Hooks** — prefixo `use`. Teste co-locado: `useSoulStore.ts` + `useSoulStore.test.ts`
- **Console.log** — nunca em código commitado.
- **Regra de dependência:** `types → engine → service → hooks → components → pages`. Engine nunca importa de service. Service nunca importa de components.

---

## 5 — Regras de Git

> **[NOVO]** — Referência completa: ops/dev-workflow.md

- **Branch:** `feature/nome`, `fix/nome`, `hotfix/nome`, `docs/nome`, `chore/nome`
- **Commit:** `tipo(escopo): descrição` — ex: `feat(wrap): add soul section`
- **Nunca commit direto em main.** Sempre via branch + merge.
- **Nunca force push** em branches compartilhadas.

---

## 6 — Regras do Atom Engine

> **[NOVO]** — Guardrails que o Build Protocol não cobria explicitamente.

- **Todo item é AtomItem.** Todo documento segue o Meta-Template com envelope.
- **Inbox obrigatório.** Nenhum item nasce structured — tudo começa no inbox (estágio 1).
- **Wrap é sagrado.** Nunca editar um wrap depois de commitado.
- **State machine é sequencial.** Não pula estágio. 1→2→3→4→5→(6)→7.
- **Connections são tipadas.** 8 tipos: references, feeds, blocks, triggers, spawns, mutates, archives, relates.
- **MindRoot NÃO foi lançado publicamente.** Nunca descrever como "lançado e validado."

---

## 7 — Hooks de codebase (enforcement)

> **[NOVO]** — Complementa os 4 Protocolos do §3.2. Aqueles são mentais (antes de gerar output). Estes são operacionais (antes/depois de editar código).

### Hook pós-edit (obrigatório após qualquer mudança de código)

```bash
pnpm tsc --noEmit        # Zero erros de tipo
pnpm vitest run           # Zero testes falhando
pnpm build                # Build completa
```

Se qualquer passo falha → corrige antes de continuar.

### Hook pré-commit (obrigatório antes de qualquer commit)

```
[ ] Hook pós-edit passou? (tsc + vitest + build)
[ ] Viewport 360×800 testado?
[ ] Nenhum console.log no código?
[ ] Commit message segue convenção? (tipo(escopo): descrição)
[ ] .env não está sendo commitado?
```

---

## 8 — O que NUNCA fazer

> **[NOVO]** — Lista de proibições absolutas.

1. **Nunca editar Genesis, Marco Zero, ou Meta-Template** sem autorização explícita. São docs-lei.
2. **Nunca deletar um AtomItem.** Entropy é archive, não delete. UUID é eterno.
3. **Nunca criar schema sem migration.** Toda mudança de banco é migration file.
4. **Nunca expor secrets.** `VITE_` = visível no browser. Nunca colocar API keys ali.
5. **Nunca ignorar tsc errors.** Se o TypeScript reclama, o código está errado.
6. **Nunca commitar .env.** Sempre no .gitignore.
7. **Nunca criar feature sem spec.** Spec primeiro, código depois. Documentar é executar.

---

## 9 — Stack do ecossistema

> **[NOVO]** — Stack real conforme codebase atual.

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| AI | Anthropic Claude API (Sonnet) via Supabase Edge Functions |
| Deploy prod | Vercel |
| Deploy staging | Docker no servidor local |
| DNS | Cloudflare |
| CI | GitHub Actions |
| Testes | Vitest + Testing Library |
| Package manager | pnpm |

---

## 10 — Contexto por repo

> **[NOVO]** — Ajuda o Claude Code a saber onde está.

### atom-engine-core
- Contém: docs-lei (law/), ATOM.md, PENTAGON.md, ops/, specs/, sql/
- Regra: nunca commitar código de app aqui. Só protocolo, specs, e SQL de referência.

### mindroot-v2 (V1)
- Contém: app Vite/React, pages, components, hooks, engine, service, store
- Estende este CLAUDE.md com: design system tokens, feature specs, rotas
- Dev server: localhost:5173
- Edge functions: supabase/functions/

### constellation-os (V2)
- Contém: app React, scanner, viewer, build V1-V8, reports, Lumen
- Status: paused (Sprint 8+ implementado)

### atlas-frames (⬡ Hexágono)
- Contém: landing page /expo, configurador futuro
- Domínio: atlasframes.com.au

---

## 11 — Skills, Agents, Commands

> **[NOVO]** — Referência ao .claude/ config.

Configuração completa em `.claude/`:
- **7 skills:** atom-genesis, atom-wrap, atom-audit, atom-spec, atom-triage, coding-standards, testing-standards
- **3 agents:** guardian (interpreta), auditor (verifica), reviewer (PR review)
- **3 hooks:** pre-session.sh, post-edit.sh, pre-commit.sh
- **5 commands:** /wrap, /audit, /plan, /genesis-check, /spec

Referência completa: `specs/claude-code-ecosystem-config.md`

Guardião Audit (ritual de verificação retrospectiva): `specs/guardiao-audit_v1-0.md`

---

*Genesis Build Protocol v1.0 — filho do Genesis v5.0.1*
*A geometria é preservada porque cada camada só conhece o que nasceu antes dela.*
*Se qualquer agente não tem resposta — para. Pergunta. Não assume.*
