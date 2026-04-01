╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       54af0727-6794-4646-a080-3ce0a080a91e ║
║ type:     template                   ║
║ module:   bridge                     ║
║ state:    committed                  ║
║ status:   active                     ║
║ stage:    7 ○ Círculo                ║
║ tags:     #template, #type:reflection ║
║ source:   claude-project             ║
║ created:  2026-03-29                 ║
║ updated:  2026-03-29                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → derives: Genesis v4.2            ║
║   → derives: Meta-Template v1.0      ║
╚══════════════════════════════════════╝


# Reflection Template


## Piso mínimo
**2 — — Linha** — Reflection precisa só de type + module pra existir. O conteúdo vive em `notes` — sem body estruturado, sem bloqueio de pipeline. Uma frase classifica como reflection e já tem valor.


## Module default
**mind** — Reflexões vivem no módulo de aprendizado e pensamento. Podem ser overridden pra `purpose` (valores, legado) ou `bridge` (cross-module).


## Body schema
**Sem body schema.** Reflection usa `notes` (texto livre) + `tags`. Qualquer estrutura além de `notes` seria impor forma ao que é intrinsecamente livre.


## Extensions
**Soul** — opt-in. Reflexões têm dimensão emocional por definição. Entra no body só quando Rick registra explicitamente estado emocional. Se a reflexão é conceitual/técnica, soul é omitido.
```json
{
  "soul": {
    "energy_level": "high | medium | low",
    "emotion_before": "string (linguagem livre)",
    "emotion_after": "string (linguagem livre)",
    "needs_checkin": false,
    "ritual_slot": "aurora | zenite | crepusculo | null"
  }
}
```


---


## Exemplo de ATOM ENVELOPE
```
╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       b2c3d4e5-f6a7-8901-bcde   ║
║ type:     reflection                 ║
║ module:   mind                       ║
║ state:    committed                  ║
║ status:   completed                  ║
║ stage:    7 ○ Círculo                ║
║ tags:     #mod_mind, #mood:grato     ║
║ source:   claude-project             ║
║ created:  2026-03-29                 ║
║ updated:  2026-03-29                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → feeds: project-atom-engine       ║
╚══════════════════════════════════════╝
```


---


## Exemplo de YAML frontmatter
```yaml
---
id: "b2c3d4e5-f6a7-8901-bcde-fa2345678901"
title: "O período de teoria foi preparação, não procrastinação"
type: reflection
module: mind
state: committed
status: completed
genesis_stage: 7
tags: [#mod_mind, #mood:grato]
source: claude-project
created_at: "2026-03-29T06:00:00+10:00"
updated_at: "2026-03-29T06:00:00+10:00"
connections:
  - target: project-atom-engine
    relation: feeds
body:
  soul:
    energy_level: medium
    emotion_before: ansioso
    emotion_after: grato
    needs_checkin: false
    ritual_slot: aurora
---
```


---


## Exemplo de conteúdo
```markdown
## O período de teoria foi preparação, não procrastinação


Quando não se pode executar no mundo externo, a mente executa internamente.
O longo período de construção conceitual não foi fraqueza — foi o único
movimento possível dentro das restrições reais de então.


A prova: quando o espaço abriu, o mapa já estava pronto.
Reframing útil: a teoria **foi** execução. Em outro plano, mas foi.


## Connections
- feeds:: [[project-atom-engine]]
```


---


## Notas de uso


**Quando criar:** qualquer momento em que Rick processa uma ideia, experiência, ou insight que vale preservar. 2 linhas ou 2 páginas — ambos válidos.


**Captura rápida vs elaborada:** ambas são `reflection`. A rápida fica no estágio 2. A elaborada pode ser commitada direto no wrap. O agente não força desenvolvimento.


**Tags úteis:**
- `#mood:*` — estado emocional
- `#ritual:aurora` / `#ritual:crepusculo` — se veio de um ritual
- `#milestone` — se marca uma virada de chave
- `#project:*` — se pertence a um projeto específico


**Naming:** sem versão, sem data obrigatória. `mod-mind_reflection_[descrição-curta]`. Se sobre o sistema: `mod-purpose_reflection_[descrição]`.


**Diferença note vs reflection:** `note` = captura de informação externa. `reflection` = processamento interno. Na dúvida: se o sujeito é Rick, é reflection.


**Piso 2 é intencional:** reflexões não precisam de conexão pra ter valor. Uma reflection isolada no grafo é válida — ainda não encontrou o nó com que ressoa.