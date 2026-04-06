╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     spec                       ║
║ module:   bridge                     ║
║ state:    structured                 ║
║ status:   active                     ║
║ stage:    3 △ Triangulo              ║
║ tags:     [#system, #devops, #git,   ║
║            #cicd, #testing, #deploy] ║
║ source:   claude-project             ║
║ created:  2026-04-07                 ║
║ updated:  2026-04-07                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → references: Genesis v5.0.3       ║
║   → references: ATOM.md v1.2        ║
║   → references: Marco Zero v3.0     ║
║   → feeds: CLAUDE.md (todos repos)  ║
║   → feeds: README.md operacional    ║
║   → feeds: ops/infra.md             ║
╚══════════════════════════════════════╝

# Dev Workflow — Guia Operacional de Desenvolvimento

**Versão:** 1.0
**Data:** 07 Abr 2026
**Status:** Active
**Princípio:** O código segue as mesmas leis do item. Nasce no inbox (branch), matura (review), é commitado (merge). O Git é o Genesis do código.

---

## 1 — Git Workflow

### 1.1 Branches

| Branch | Propósito | Protegida | Deploy |
|--------|-----------|-----------|--------|
| `main` | Produção. Sempre estável. Sempre deployável. | Sim — merge só via PR | Vercel auto-deploy |
| `develop` | Integração. Onde features se encontram antes de ir pra prod. | Sim — merge só via PR | Staging server (Fase 1) |
| `feature/nome` | Uma feature, um bug, uma spec. Vida curta. | Não | Preview (Vercel preview deploy) |
| `hotfix/nome` | Fix urgente em produção. Nasce de `main`, volta pra `main` + `develop`. | Não | — |

**Para projetos solo (fase atual):** simplifica pra `main` + `feature/*`. Sem `develop`. Quando tiver mais de 1 pessoa commitando, adiciona `develop`.

### 1.2 Fluxo de código

```
feature/nova-tela
    ↓ (PR)
develop (staging — testa no servidor local)
    ↓ (PR — quando estável)
main (produção — Vercel deploya automaticamente)
```

**Fluxo simplificado (solo):**
```
feature/nova-tela
    ↓ (PR ou merge direto)
main (produção)
```

### 1.3 Convenção de commits

Formato: `tipo(escopo): descrição`

| Tipo | Quando |
|------|--------|
| `feat` | Nova feature |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudar comportamento |
| `test` | Testes |
| `chore` | Manutenção (deps, config, CI) |
| `style` | Formatação (sem mudar lógica) |

Exemplos:
```
feat(capture): add quick-capture bottom sheet
fix(wrap): soul section not saving emotion_after
docs(genesis): update stage 4 gate description
refactor(soul-store): extract useSoulStore hook
chore(deps): bump supabase-js to 2.45
```

### 1.4 Convenção de nomes de branch

```
feature/capture-quick-add
feature/wrap-soul-section
fix/login-redirect-loop
hotfix/rls-policy-missing
docs/dev-workflow
chore/upgrade-vite-6
```

### 1.5 Git tags e releases

Segue **semver** (Semantic Versioning): `MAJOR.MINOR.PATCH`

| Componente | Quando incrementa | Exemplo |
|------------|-------------------|---------|
| MAJOR | Breaking change (schema migration, API incompatível) | 1.0.0 → 2.0.0 |
| MINOR | Nova feature compatível | 1.0.0 → 1.1.0 |
| PATCH | Bug fix | 1.0.0 → 1.0.1 |

```bash
# Criar release
git tag -a v1.2.0 -m "feat: soul layer + wrap improvements"
git push origin v1.2.0
```

Cada tag gera uma entry no CHANGELOG.md (seção 6).

---

## 2 — Gestão de Ambientes

### 2.1 Três ambientes

| Ambiente | Propósito | URL | Banco | Branch |
|----------|-----------|-----|-------|--------|
| **Local** | Dev no PC pessoal | localhost:5173 | Supabase cloud (dev) | feature/* |
| **Staging** | Teste pré-produção | mindroot.yugar.local | PostgreSQL no servidor local | develop (ou main preview) |
| **Produção** | Usuário final | mindroot.com.au | Supabase cloud (prod) | main |

**Nota sobre staging:** o servidor local usa PostgreSQL puro, sem o ecossistema Supabase (auth, RLS built-in, edge functions, realtime). Isso significa que staging valida layout, fluxos e lógica de UI — mas não substitui testar auth e edge functions no ambiente Supabase real. Pra testar essas camadas, usar o Vercel preview deploy (que aponta pro Supabase cloud).

### 2.2 Variáveis de ambiente

Cada ambiente tem seu `.env`:

```
.env.local          ← dev (teu PC)
.env.staging         ← staging (servidor local)
.env.production      ← produção (Vercel)
```

**Estrutura padrão:**

```bash
# === App ===
VITE_APP_ENV=local|staging|production
VITE_APP_URL=http://localhost:5173

# === Supabase ===
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# === AI (edge functions — nunca no client) ===
# ANTHROPIC_API_KEY vive nas env vars do Supabase edge functions
```

### 2.3 Regras de segurança

1. **`.env*` no `.gitignore` — sempre.** Sem exceção.
2. **`VITE_` = visível no browser.** Nunca colocar secrets com esse prefixo. Apenas URLs públicas e anon keys.
3. **Secrets de produção vivem no Vercel Dashboard** (env vars do build) e no **Supabase Dashboard** (env vars das edge functions).
4. **Secrets de staging vivem no `.env` do servidor local**, protegido por SSH.
5. **Rotação:** trocar keys a cada 90 dias. Marcar no calendário.

### 2.4 Supabase por ambiente

| Ambiente | Projeto Supabase | Propósito |
|----------|-----------------|-----------|
| Local | Projeto principal (dev direto — fase atual) | Dev rápido |
| Staging | Projeto separado (free tier — fase futura) | Testar migrations, RLS |
| Produção | Projeto principal (Pro tier) | Dados reais |

**Migrations:** toda mudança de schema é migration file. Nunca edita o banco direto em produção.

```bash
# Criar migration
supabase migration new add_soul_extension

# Aplicar em staging (quando tiver projeto separado)
supabase db push --linked

# Aplicar em produção (com cuidado)
supabase db push --linked --project-ref PROD_REF
```

---

## 3 — CI/CD Pipeline

### 3.1 GitHub Actions — type + test + build

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      # Hook 2 do ATOM.md §Hexágono — enforcement automático
      - name: TypeScript check
        run: pnpm tsc --noEmit

      - name: Unit tests
        run: pnpm vitest run

      - name: Build
        run: pnpm build
        env:
          VITE_APP_ENV: ci
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL_STAGING }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY_STAGING }}
```

### 3.2 Deploy pipeline

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # SSH pro servidor local e roda o deploy
      - name: Deploy to staging server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd ~/yugar-server
            ./deploy.sh
```

### 3.3 Pipeline visual

```
Push (feature/x)
    ↓
GitHub Actions CI
    ├── tsc --noEmit     → falhou? ❌ bloqueia PR
    ├── vitest run       → falhou? ❌ bloqueia PR
    └── pnpm build       → falhou? ❌ bloqueia PR
    ↓ (tudo ✅)
PR aprovado → merge
    ↓
Branch develop → deploy staging (servidor local)
Branch main → deploy produção (Vercel auto)
```

---

## 4 — Testing Strategy

### 4.1 O que testar

| Camada | O que | Ferramenta | Prioridade |
|--------|-------|------------|------------|
| **Unit** | Hooks, engines, stores, formatters | Vitest | Alta |
| **Integration** | Supabase queries, RLS policies, RPCs | Vitest + Supabase test helpers | Alta |
| **Component** | Componentes React isolados | Vitest + Testing Library | Média |
| **E2E** | Fluxos completos (captura → wrap) | Playwright (futuro) | Baixa (fase futura) |

### 4.2 O que testar primeiro (80/20)

1. **State machine do Genesis** — transições de estágio, regressão, morph, decay. Isso é o coração. Se quebrar, tudo quebra.
2. **RLS policies** — cada role vê só o que deve ver.
3. **Wrap commit** — o wrap commita items corretamente? Seeds são extraídas? Soul data persiste?
4. **Auto-triage** — a classificação AI retorna types válidos? Módulos válidos?

### 4.3 Cobertura mínima

| Área | Cobertura target |
|------|-----------------|
| State machine (engines/fsm) | 90%+ |
| RLS policies | 100% (cada policy tem teste) |
| Utils/formatters | 80%+ |
| React components | 50%+ (foco nos interativos) |
| E2E flows | 0% agora, 3 critical paths quando Playwright entrar |

### 4.4 Convenção de arquivos de teste

```
src/
├── engine/
│   ├── fsm.ts
│   └── fsm.test.ts               ← co-locado
├── hooks/
│   ├── useSoulStore.ts
│   └── useSoulStore.test.ts       ← co-locado
└── __tests__/
    └── rls-policies.test.ts       ← testes de integração separados
```

### 4.5 Os 5 agentes de teste (ATOM.md §Quadrado)

| Agente | Escopo | Quando roda |
|--------|--------|-------------|
| Lógica | Hooks, engines, stores — funções puras | `vitest run` (CI) |
| Regressão | 1 test por bug histórico (Andre reports) | `vitest run` (CI) |
| Dados | Cache, dedup, state machine | `vitest run` (CI) |
| Fluxo | Sequências multi-step | `vitest run` (CI) |
| Visual | Viewport 360×800, layout, toast overflow | Manual ou Chrome MCP (pré-deploy) |

---

## 5 — Deploy Strategy

### 5.1 Produção (Vercel)

| Aspecto | Configuração |
|---------|-------------|
| Trigger | Push em `main` |
| Build | `pnpm build` (Vite → static bundle) |
| Preview | Cada PR gera preview deploy |
| Rollback | Vercel dashboard → Deployments → Promote versão anterior |
| Domínio | mindroot.com.au (Cloudflare DNS → Vercel) |

### 5.2 Staging (servidor local)

| Aspecto | Configuração |
|---------|-------------|
| Trigger | Push em `develop` (ou cron a cada 5 min) |
| Build | Docker multi-stage no servidor |
| Acesso | mindroot.yugar.local (rede local) |
| Rollback | `git checkout HEAD~1 && docker compose up -d --build` |

### 5.3 Checklist de deploy

Antes de mergear `develop` → `main`:

```
[ ] CI passou (tsc + vitest + build)
[ ] Testado em staging (mindroot.yugar.local)
[ ] Mobile testado (viewport 360×800) — Hook 3 do ATOM.md §Hexágono
[ ] Migration aplicada em staging sem erro
[ ] Nenhum console.log/debug no código
[ ] .env de produção não expõe secrets
[ ] CHANGELOG.md atualizado
[ ] Git tag criada (semver)
```

### 5.4 Rollback

**Produção (Vercel):**
1. Dashboard → Deployments → clica no deploy anterior → Promote
2. Tempo: ~30 segundos

**Staging (servidor local):**
```bash
cd ~/yugar-server/mindroot/app
git log --oneline -5          # acha o commit bom
git checkout <commit-hash>
cd ~/yugar-server
docker compose up -d --build mindroot
```

**Banco (migration deu errado):**
```bash
# Restore do backup mais recente
docker exec -i yugar-postgres psql -U yugar -d mindroot_staging < backups/all_databases_YYYYMMDD_0300.sql
```

---

## 6 — Changelog

Vive na raiz do repo: `CHANGELOG.md`

### Formato

```markdown
# Changelog

## [1.2.0] — 2026-04-07

### Added
- Soul layer: emotion_before/after no wrap
- Quick capture bottom sheet

### Changed
- Wrap agora extrai seeds automaticamente

### Fixed
- Login redirect loop em mobile
- RLS policy faltando pra role family

## [1.1.0] — 2026-03-28
...
```

### Regra

Cada merge em `main` que muda comportamento visível → entry no CHANGELOG + git tag.

Mudanças internas (refactor, chore) não precisam de entry no CHANGELOG, mas precisam de commit message descritiva.

---

## 7 — Monitoramento

### 7.1 Error tracking — Sentry

```bash
pnpm add @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
})
```

### 7.2 Analytics — Vercel Analytics

```typescript
// src/main.tsx
import { inject } from '@vercel/analytics'

inject()  // Vercel analytics — zero config
```

### 7.3 Uptime — health endpoint

Health check via Supabase edge function:

```typescript
// supabase/functions/health/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase.from('items').select('id').limit(1)

  return new Response(JSON.stringify({
    status: error ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    environment: Deno.env.get('APP_ENV') || 'production',
  }), { headers: { 'Content-Type': 'application/json' } })
})
```

### 7.4 O que monitorar

| Métrica | Ferramenta | Alerta quando |
|---------|-----------|---------------|
| Erros JS | Sentry | Qualquer erro novo |
| Latência de página | Vercel Analytics | p95 > 3s |
| Supabase health | Health edge function | Query falha |
| Build quebrado | GitHub Actions | CI falha em main |
| Disco do servidor | health.sh (cron) | > 80% uso |

---

## 8 — Backup e Recovery

### 8.1 O que fazer backup

| Dado | Onde vive | Backup | Frequência |
|------|-----------|--------|-----------|
| Código | GitHub | GitHub (redundância nativa) | Cada push |
| Banco produção | Supabase cloud | Supabase Pro backup automático | Diário |
| Banco staging | Servidor local | `backup.sh` → dump SQL | Diário 03h |
| Docs-lei | Repo `atom-engine-core/law/` | Git (redundância nativa) | Cada commit |
| Secrets (.env) | Vercel Dashboard + servidor | Export manual → encrypted file | Mensal |

### 8.2 RPO / RTO

| Cenário | RPO (dados perdidos) | RTO (tempo pra voltar) |
|---------|---------------------|----------------------|
| Servidor local morre | 24h (último backup) | 2h (reinstala Docker + restore) |
| Supabase prod cai | Minutos (backup contínuo no Pro) | Depende do Supabase |
| Vercel fora do ar | 0 (código está no GitHub) | Minutos (redeploy ou DNS swap) |
| GitHub fora do ar | 0 (clone local existe) | Horas (esperar voltar, ou push pra Gitea) |

### 8.3 Teste de restore

**A cada 90 dias:**
```bash
# Testa restore do banco
docker exec -i yugar-postgres psql -U yugar -d restore_test < backups/latest.sql

# Verifica
docker exec yugar-postgres psql -U yugar -d restore_test -c "SELECT count(*) FROM items;"

# Limpa
docker exec yugar-postgres psql -U yugar -c "DROP DATABASE restore_test;"
```

Se o restore falhar, o backup não existe. Testar é obrigatório.

---

## 9 — Migração npm → pnpm

**Decisão:** pnpm é o package manager padrão do ecossistema Atom. Mais rápido, mais eficiente em disco, resolução de dependências mais estrita.

### Passos de migração (por repo)

```bash
# 1. Remove npm artifacts
rm -rf node_modules package-lock.json

# 2. Habilita pnpm via corepack
corepack enable pnpm

# 3. Instala
pnpm install

# 4. Verifica
pnpm tsc --noEmit && pnpm vitest run && pnpm build

# 5. Commit
git add pnpm-lock.yaml .npmrc
git rm package-lock.json
git commit -m "chore: migrate npm → pnpm"
```

### Atualizar CI

Substituir `npm ci` por `pnpm install --frozen-lockfile` nos workflows do GitHub Actions (ver seção 3.1).

### Atualizar CLAUDE.md

Todos os comandos de `npm run` → `pnpm`.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-04-07 | Documento inaugural. Git workflow, CI/CD, ambientes, testing, deploy, changelog, monitoramento, backup. Stack: Vite + React + Supabase + pnpm. Alinhado com ATOM.md §Hexágono (enforcement hooks) e Genesis v5. |

---

*O código segue as mesmas leis do item.*
*Branch é inbox. PR é maturação. Merge é commit.*
*De dentro pra fora — inclusive no Git.*
