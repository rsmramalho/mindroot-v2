╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     doc                        ║
║ module:   bridge                     ║
║ state:    structured                 ║
║ status:   active                     ║
║ stage:    3 △ Triangulo              ║
║ tags:     [#system, #onboarding,     ║
║            #readme, #quickstart]     ║
║ source:   claude-project             ║
║ created:  2026-04-07                 ║
║ updated:  2026-04-07                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → references: Genesis v5.0.3       ║
║   → references: ATOM.md v1.2        ║
║   → references: dev-workflow v1.0    ║
║   → references: infra v1.0          ║
║   → references: Marco Zero v3.0     ║
╚══════════════════════════════════════╝

# README — Guia de Onboarding

**Versão:** 1.0
**Data:** 07 Abr 2026
**Status:** Active
**Princípio:** Qualquer humano ou agente deve ir de zero a app rodando em 10 minutos. Se demorar mais, este documento falhou.

---

## O que é isto

O **Atom** é um sistema operacional pessoal. O **MindRoot** é sua primeira interface (V1). Este README te leva de "acabei de clonar" a "app rodando no browser."

Para entender a filosofia, lê o **ATOM.md**. Para entender o schema, lê o **Genesis**. Este documento é só o "liga e roda."

---

## Pré-requisitos

| Ferramenta | Versão mínima | Instalar |
|------------|---------------|----------|
| Node.js | 20+ | https://nodejs.org |
| pnpm | 9+ | `corepack enable pnpm` |
| Git | 2.30+ | Já vem no macOS/Linux |
| Supabase CLI | Último | `pnpm add -g supabase` |

Opcional (recomendado):
| Ferramenta | Propósito |
|------------|-----------|
| VS Code | Editor principal |
| Claude Code (extensão) | Agente AI no editor |
| Docker Desktop | Pra rodar Supabase local |

---

## Setup em 10 minutos

### 1. Clonar

```bash
git clone https://github.com/[USUARIO]/mindroot-v2.git
cd mindroot-v2
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar ambiente

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```bash
VITE_APP_ENV=local
VITE_SUPABASE_URL=https://xxx.supabase.co       # Teu projeto Supabase
VITE_SUPABASE_ANON_KEY=xxx                        # Dashboard → Settings → API
```

### 4. Banco de dados

**Opção A — Supabase cloud (mais rápido):**
O banco já está configurado no projeto Supabase. Pula pro passo 5.

**Opção B — Supabase local (isolado):**
```bash
supabase start        # Sobe Supabase local via Docker
supabase db push      # Aplica migrations
```
Usa as credenciais que o `supabase start` imprime.

### 5. Rodar

```bash
pnpm dev
```

Abre `http://localhost:5173`. App rodando.

### 6. Verificar

```bash
pnpm tsc --noEmit     # Zero erros de tipo
pnpm vitest run        # Testes passam
pnpm build             # Build funciona
```

Se os 3 passam, o ambiente tá saudável.

---

## Estrutura do repo

```
mindroot-v2/
├── CLAUDE.md                  ← Policy pro agente (lê PRIMEIRO se é Claude Code)
├── CHANGELOG.md               ← Histórico de releases
├── .github/
│   └── workflows/
│       └── ci.yml             ← CI: type + test + build
│
├── src/
│   ├── pages/                 ← 1 arquivo por tela (PascalCase.tsx)
│   ├── components/            ← Componentes React
│   │   ├── atoms/             ← Componentes base (chips, badges, icons, tokens)
│   │   ├── shared/            ← Reutilizáveis (ItemCard, ErrorBanner)
│   │   ├── shell/             ← Estrutura (BottomNav, TopBar, AppShell)
│   │   ├── home/              ← Componentes da Home
│   │   └── audit/             ← Componentes de audit
│   ├── features/              ← Features complexas com subpastas
│   │   └── raiz/              ← Builder, components, store
│   ├── hooks/                 ← Custom hooks (useItems, usePipeline, useSoul)
│   ├── service/               ← Data access — Supabase (item-service, wrap-service)
│   ├── engine/                ← Lógica pura — sem React, sem Supabase (fsm, parsing, soul, wrap)
│   ├── store/                 ← Estado global — Zustand (app-store, soul-store)
│   ├── config/                ← Configurações (raiz domains, type-schemas.json, types.ts)
│   └── types/                 ← TypeScript types (item.ts, ui.ts, engine.ts)
│
├── supabase/
│   ├── migrations/            ← SQL migrations (schema changes)
│   ├── functions/             ← Edge functions (Deno)
│   └── seed.sql               ← Dados de seed (dev)
│
├── public/                    ← Assets estáticos
├── .env.example               ← Template de variáveis de ambiente
├── vite.config.ts             ← Vite config
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

**Regra de dependência (ATOM.md §Quadrado):** types → engine → service → hooks → components → pages. Engine nunca importa de service. Service nunca importa de components. A dependência flui de dentro pra fora.

---

## Comandos do dia a dia

| Comando | O que faz |
|---------|-----------|
| `pnpm dev` | Dev server com hot reload (localhost:5173) |
| `pnpm build` | Build de produção (Vite → dist/) |
| `pnpm tsc --noEmit` | Type check (zero erros = saudável) |
| `pnpm vitest run` | Roda todos os testes |
| `pnpm vitest --watch` | Testes em modo watch |
| `supabase migration new nome` | Cria nova migration |
| `supabase db push` | Aplica migrations |
| `supabase db reset` | Reset total do banco (cuidado) |
| `supabase functions serve` | Roda edge functions localmente |

---

## Onde encontrar o quê

| Pergunta | Documento | Localização |
|----------|-----------|-------------|
| "O que é o Atom? Qual a filosofia?" | ATOM.md | `atom-engine-core/ATOM.md` |
| "Como funciona o schema? Quais types existem?" | Genesis v5 | `atom-engine-core/law/genesis.md` |
| "Como começo meu dia? O que é o wrap?" | Marco Zero | `atom-engine-core/law/marco-zero.md` |
| "Como nomeio as coisas? MindRoot vs Atom?" | Identidade | `atom-engine-core/law/identidade.md` |
| "Como faço deploy? Como versiono?" | Dev Workflow | `atom-engine-core/ops/dev-workflow.md` |
| "Como funciona o servidor? Docker?" | Infra | `atom-engine-core/ops/infra.md` |
| "O que o Claude Code deve saber?" | CLAUDE.md | Raiz de cada repo |
| "O que mudou na última versão?" | CHANGELOG.md | Raiz de cada repo |
| "Qual o roadmap do ecossistema?" | PENTAGON.md | `atom-engine-core/PENTAGON.md` |

---

## Para o Claude Code

Se tu é o Claude Code abrindo este projeto pela primeira vez:

1. **Lê o `CLAUDE.md` na raiz.** Ele tem as policies operacionais.
2. **Lê o `ATOM.md`** pra entender os pilares e a matriz de build.
3. **Antes de qualquer task,** roda o Hook 1 (GUARDIÃO + AUDITOR) do ATOM.md §Hexágono.
4. **Depois de qualquer edit,** roda o Hook 2: `pnpm tsc --noEmit && pnpm vitest run && pnpm build`.
5. **Nunca commita** sem o Hook 3 (mobile check 360×800).

A hierarquia de documentos: Genesis (lei) > ATOM.md (método) > Marco Zero (operação) > Dev Workflow (codebase) > CLAUDE.md (policy local).

---

## Árvore de documentos completa

```
atom-engine-core/
│
├── ATOM.md                     ← O método (raiz de tudo)
├── PENTAGON.md                 ← Master roadmap do ecossistema
│
├── law/                        ← A semente (sagrada — raramente muda)
│   ├── genesis.md              ← O contrato universal (Genesis v5)
│   ├── marco-zero.md           ← Guia operacional do dia
│   ├── meta-template.md        ← O molde dos moldes
│   └── identidade.md           ← Nomenclatura e geometria
│
├── ops/                        ← Operação do codebase (muda com frequência)
│   ├── dev-workflow.md         ← Git, CI/CD, testes, deploy, changelog
│   ├── infra.md                ← Servidor, Docker, rede, hardware
│   └── README.md               ← Este documento (onboarding)
│
├── mindroot/                   ← V1 (o visualizador)
│   ├── roadmap.md
│   ├── features/               ← Feature specs
│   └── design/                 ← Design system + wireframes
│
├── specs/                      ← Specs cross-vertex
├── sql/                        ← Schema SQL de referência
├── wraps/                      ← Histórico de sessões
└── archive/                    ← Items em estado archived
```

**Hierarquia de autoridade:**
```
law/ (Genesis, Marco Zero, Meta-Template, Identidade)
  ↓ governa
ATOM.md + PENTAGON.md
  ↓ governa
ops/ (dev-workflow, infra, README)
  ↓ governa
CLAUDE.md (cada repo)
  ↓ governa
código
```

Se houver conflito entre documentos, o de cima prevalece. Genesis é lei. O resto é derivado.

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `pnpm install` falha | Deleta `node_modules` e `pnpm-lock.yaml`, roda de novo |
| TypeScript errors | `pnpm tsc --noEmit` — lê os erros, resolve um por um |
| Supabase connection refused | Verifica `.env.local` — URL e keys corretas? Projeto online? |
| Build falha | Geralmente é import inválido ou env var faltando |
| Porta 5173 ocupada | `lsof -i :5173` e mata o processo, ou `pnpm dev --port 3000` |
| Migration falha | `supabase db reset` (reseta tudo — só em dev) |
| Edge function erro | `supabase functions serve` localmente pra debugar |

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-04-07 | Documento inaugural. Setup em 10 min, estrutura do repo (Vite + React + Supabase + pnpm), comandos, árvore de docs, troubleshooting. Para humanos e agentes. |

---

*De zero a rodando em 10 minutos.*
*Se demorou mais, este documento falhou.*
