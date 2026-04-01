╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       e9c38b5a-16cf-47ad-b67f-4e69b98cd40a ║
║ type:     template                   ║
║ module:   bridge                     ║
║ state:    committed                  ║
║ status:   active                     ║
║ stage:    7 ○ Círculo                ║
║ tags:     #template, #type:checkpoint ║
║ source:   claude-project             ║
║ created:  2026-03-29                 ║
║ updated:  2026-03-29                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → derives: Genesis v4.2            ║
║   → derives: Meta-Template v1.0      ║
╚══════════════════════════════════════╝


# Checkpoint Template


## Piso mínimo
**3 — △ Triângulo** — Checkpoint precisa de body estruturado pra existir. Um checkpoint sem `done[]` e `next_steps[]` é só uma nota. Piso 2 é insuficiente.


## Module default
**work** — Checkpoints documentam progresso de projetos. Podem ser overridden pra `bridge` (cross-project) ou outro módulo quando o contexto exigir.


## Body schema
```json
{
  "done": ["string"],
  "pending": ["string"],
  "decisions": ["string"],
  "next_steps": ["string"]
}
```


Todos os campos são arrays de strings. Todos opcionais individualmente, mas ao menos `done` ou `next_steps` deve ter conteúdo — senão o checkpoint não agrega informação nova.


## Extensions
**Nenhuma.** Checkpoint é um snapshot — não tem deadline, prioridade, ou ciclo emocional associado. Se uma sessão de checkpoint tiver dimensão emocional relevante, isso vive no wrap (Soul Layer), não no checkpoint em si.


---


## Exemplo de ATOM ENVELOPE
```
╔══════════════════════════════════��═══╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       a1b2c3d4-e5f6-7890-abcd   ║
║ type:     checkpoint                 ║
║ module:   work                       ║
║ state:    committed                  ║
║ status:   completed                  ║
║ stage:    7 ○ Círculo                ║
║ tags:     #mod_work, #project:atom   ║
║ source:   claude-project             ║
║ created:  2026-03-29                 ║
║ updated:  2026-03-29                 ║
╠══════════════════════════════════════╣
║ project:  Atom Engine                ║
║ naming:   mod-work_checkpoint_atom-engine_2026-03-29 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → belongs_to: project-atom-engine  ║
║   → feeds: spec-genesis-v4-2         ║
╚══════════════════════════════════════╝
```


---


## Exemplo de YAML frontmatter
```yaml
---
id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
title: "Checkpoint Atom Engine — 29 Mar 2026"
type: checkpoint
module: work
state: committed
status: completed
genesis_stage: 7
tags: [#mod_work, #project:atom]
source: claude-project
created_at: "2026-03-29T17:00:00+10:00"
updated_at: "2026-03-29T17:00:00+10:00"
project_id: "uuid-do-projeto-atom"
naming_convention: "mod-work_checkpoint_atom-engine_2026-03-29"
connections:
  - target: project-atom-engine
    relation: belongs_to
  - target: spec-genesis-v4-2
    relation: feeds
---
```


---


## Exemplo de conteúdo
```markdown
## Checkpoint Atom Engine — 29 Mar 2026


### Feito
- Genesis v4.2 finalizado e commitado no Drive
- Meta-template v1.0 criado
- drive-tools.js atualizado pro Schema v2
- Templates: wrap, session-log, recipe, workout commitados


### Pendente
- Templates: checkpoint, reflection (esta sessão)
- GitHub repo
- Clean Claude test


### Decisões
- location + participants via tags semânticas (#location:*, #who:*)
- Meta-template v1.0 é referência canônica


### Próximos passos
- [ ] Commitar templates checkpoint + reflection
- [ ] Criar GitHub repo
- [ ] Rodar clean Claude test


## Connections
- belongs_to:: [[project-atom-engine]]
- feeds:: [[spec-genesis-v4-2]]
```


---


## Notas de uso


**Quando criar:** ao final de uma sessão com progresso real a documentar. Não precisa ser diário.


**Diferença wrap vs checkpoint:** wrap é ritual de sessão (born committed, formato fixo). Checkpoint é documento de progresso de projeto (versionado, datado, pertence a um projeto).


**Naming:** sempre datado. `mod-work_checkpoint_[projeto]_YYYY-MM-DD`.


**Destino no Drive:** dentro da pasta do projeto (`mod-work/project-[nome]/`). Nunca em `system/logs/`.


**Born committed?** Não. Passa pelo pipeline normal, mas acelera: captura → classifica → estrutura (piso 3) → commita no mesmo wrap.


**Conexão obrigatória:** todo checkpoint deve ter ao menos `belongs_to` pro projeto de origem.