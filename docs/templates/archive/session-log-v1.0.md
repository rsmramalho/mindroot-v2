---
id: "7f2a9b3c-4d5e-6f78-9a0b-c1d2e3f4a5b6"
title: "system_template_session-log_v1-0"
type: template
module: bridge
state: committed
status: active
genesis_stage: 7
tags: [template, "#type:session-log"]
source: claude-project
created_at: "2026-03-29T17:00:00+10:00"
updated_at: "2026-03-29T17:00:00+10:00"
connections:
  - target: atom-genesis-v4-2-schema-v2-unified
    relation: derives
  - target: system_template_meta-template_v1-0
    relation: derives
---

# Session Log Template

## Piso mínimo
**7 — ○ Círculo** — session-log é born committed. Não passa pelo pipeline. O agente
cria já no estágio 7, diretamente, ao final de uma sessão longa ou de alta densidade.

## Module default
**bridge** — Session logs são cross-module por natureza. Documentam o que aconteceu
na sessão, independente do módulo trabalhado.

## Body schema
```json
{
  "summary": "string — o que aconteceu nesta sessão em 2-3 frases",
  "files_created": ["string — nome dos docs/arquivos criados"],
  "decisions": ["string — decisões tomadas em linguagem natural"],
  "pending": ["string — itens que ficaram em aberto"],
  "continuation_prompt": "string — prompt pra próxima sessão retomar exatamente aqui"
}
```

Todos os campos são opcionais individualmente. Na prática, `summary` e
`continuation_prompt` devem sempre estar presentes — são o coração do session-log.

## Extensions
**Nenhuma.** Session-log é operacional. A dimensão emocional da sessão vive no wrap
(Soul Layer), não no session-log. Operations não faz sentido — não tem deadline
nem progresso. Recurrence não se aplica.

---

## Exemplo de ATOM ENVELOPE
```
╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       c3d4e5f6-a7b8-9012-cdef   ║
║ type:     session-log                ║
║ module:   bridge                     ║
║ state:    committed                  ║
║ status:   completed                  ║
║ stage:    7 ○ Círculo                ║
║ tags:     #mod_work, #project:atom   ║
║ source:   claude-project             ║
║ created:  2026-03-29                 ║
║ updated:  2026-03-29                 ║
╠══════════════════════════════════════╣
║ naming:   system_session-log_2026-03-29_github-repo ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → belongs_to: project-atom-engine  ║
╚══════════════════════════════════════╝
```

---

## Exemplo de YAML frontmatter
```yaml
---
id: "c3d4e5f6-a7b8-9012-cdef-ab3456789012"
title: "Session Log — 29 Mar 2026 — GitHub repo"
type: session-log
module: bridge
state: committed
status: completed
genesis_stage: 7
tags: [#mod_work, #project:atom]
source: claude-project
created_at: "2026-03-29T17:00:00+10:00"
updated_at: "2026-03-29T17:00:00+10:00"
naming_convention: "system_session-log_2026-03-29_github-repo"
connections:
  - target: project-atom-engine
    relation: belongs_to
body:
  summary: "Criação do repo atom-engine-core. Genesis, templates, SQL e marco-zero
    commitados. 14 arquivos, 3752 linhas."
  files_created:
    - "templates/checkpoint-v1.0.md"
    - "templates/reflection-v1.0.md"
    - "templates/session-log-v1.0.md"
  decisions:
    - "Repo privado por enquanto — público quando o sistema estiver validado"
    - "atom-os-vision não entra agora — não é frente ativa"
  pending:
    - "Clean Claude test como quality gate"
    - "Supabase migration"
  continuation_prompt: "Repo atom-engine-core criado em rsmramalho/atom-engine-core.
    Próximo passo: clean Claude test — abrir instância limpa, apontar pro repo,
    ver se consegue operar o sistema só pelos docs."
---
```

---

## Exemplo de conteúdo
```markdown
## Session Log — 29 Mar 2026 — GitHub repo

**Resumo:** Criação do repo atom-engine-core com Genesis v4.2, todos os templates
ativos, SQL migration, e marco-zero. Sistema versionado pela primeira vez.

### Arquivos criados
- templates/checkpoint-v1.0.md
- templates/reflection-v1.0.md
- templates/session-log-v1.0.md

### Decisões
- Repo privado até validação completa
- atom-os-vision adiada — não é frente ativa

### Pendente
- Clean Claude test
- Supabase migration

### Prompt de continuação
Repo atom-engine-core criado em rsmramalho/atom-engine-core. Próximo passo:
clean Claude test — abrir instância limpa, apontar pro repo, ver se consegue
operar o sistema só pelos docs.

## Connections
- belongs_to:: [[project-atom-engine]]
```

---

## Notas de uso

**Quando criar:** sessões longas (2h+), sessões de alta densidade decisória, ou
qualquer sessão que o próximo Claude precisa de contexto pra continuar sem perder
o fio. Não precisa criar em toda sessão — wrap já cumpre esse papel pra sessões
simples.

**Diferença wrap vs session-log:** wrap é ritual de commit (formato fixo, obrigatório,
foco em items criados/modificados). Session-log é narrativa da sessão (formato
flexível, opcional, foco em contexto e continuação).

**Naming:** sempre com data + contexto. `system_session-log_YYYY-MM-DD_[contexto-curto]`.
O contexto diferencia sessões do mesmo dia.

**Continuation prompt:** o campo mais importante. Deve ser específico o suficiente
para que um Claude completamente novo, lendo apenas esse prompt + o repo GitHub,
saiba exatamente onde retomar. "Continuação do Atom Engine" é ruim.
"Repo criado, próximo passo é clean Claude test" é bom.

**Born committed — o que isso significa na prática:** o agente não pergunta
"isso se conecta com algo?", não valida portões, não passa pelo auto-triage.
Cria o doc, preenche o body, commita no wrap. Fim.
