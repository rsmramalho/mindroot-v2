# MindRoot — Guia de Uso

## Bem-vindo

MindRoot e um sistema de produtividade emocional. A premissa e simples: **emocao precede acao, reflexao fecha o ciclo**. Ao registrar como voce se sente antes e depois de cada acao, voce descobre padroes que transformam sua rotina.

---

## Primeiros passos

1. Crie sua conta com email/senha ou Google
2. Complete o fluxo de boas-vindas (3 telas rapidas)
3. Registre sua primeira emocao no check-in
4. Adicione sua primeira tarefa no campo de entrada

---

## Entrada natural

O campo de entrada aceita texto em linguagem natural. Exemplos:

| Voce digita | O que acontece |
|-------------|----------------|
| `Revisar relatorio amanha` | Cria tarefa com due_date = amanha |
| `Meditar #corpo diario` | Cria habito no modulo corpo, recorrencia diaria |
| `Reuniao com equipe p2 @trabalho` | Tarefa prioridade 2, modulo trabalho |
| `Nota: ideias para o projeto` | Cria nota livre |
| `Reflexao sobre a semana` | Cria reflexao no diario |
| `Projeto: Redesign do site` | Cria projeto |

### Tokens especiais

- `#modulo` — define o modulo (proposito, trabalho, familia, corpo, mente, alma)
- `p1` a `p4` — define prioridade (1 = urgente, 4 = baixa)
- `amanha`, `segunda`, `15/03` — define data
- `diario`, `semanal`, `mensal` — define recorrencia
- `#energy_3` — define custo energetico (1-5)
- `#tag` — adiciona tags livres

---

## Rituais

Seu dia e dividido em tres periodos:

### Aurora (manha)
Momento de intencao e clareza. Ideial para habitos de preparacao: meditacao, exercicio, planejamento.

### Zenite (tarde)
Pico de acao e foco. Periodo para tarefas que exigem energia e concentracao.

### Crepusculo (noite)
Hora de reflexao e encerramento. Revise o dia, registre gratidao, prepare o amanha.

Cada periodo tem um **check-in emocional** — registre como voce esta se sentindo para construir seu historico emocional.

---

## Modulos

Suas atividades sao organizadas em 6 areas da vida:

| Modulo | Descricao |
|--------|-----------|
| Proposito | Missao pessoal, valores, visao de longo prazo |
| Trabalho | Carreira, projetos profissionais, entregas |
| Familia | Relacionamentos, casa, convivencia |
| Corpo | Saude fisica, exercicio, alimentacao, sono |
| Mente | Aprendizado, leitura, criatividade, estudos |
| Alma | Espiritualidade, meditacao, gratidao, paz interior |

---

## Emocoes

O MindRoot rastreia 11 estados emocionais:

**Positivas:** calmo, focado, grato, animado, confiante

**Desafiadoras:** ansioso, cansado, frustrado, triste, perdido

**Neutra:** neutro

Registre emocoes no check-in de cada periodo ritual e ao completar tarefas (emocao antes/depois).

---

## Projetos

Projetos agrupam tarefas relacionadas. Cada projeto tem 4 abas:

- **Geral** — descricao, progresso, modulo
- **Tarefas** — itens vinculados ao projeto
- **Notas** — anotacoes livres
- **Timeline** — historico de atividades

---

## Diario

O diario aceita reflexoes, anotacoes e entradas guiadas. Use os prompts sugeridos como ponto de partida ou escreva livremente. Filtre por tags para encontrar temas recorrentes.

---

## Analytics

O painel de analytics mostra:

- **Heatmap** — frequencia de atividade por dia
- **Pulso emocional** — evolucao das emocoes ao longo do tempo
- **Modulos** — distribuicao de atividades por area
- **Streaks** — sequencias de dias consecutivos
- **Insights** — correlacoes emocao-produtividade, padroes por periodo/dia da semana
- **Sugestoes** — recomendacoes baseadas nos seus padroes

---

## Compartilhar

Voce pode compartilhar reflexoes e streaks publicamente:

1. No diario, abra uma reflexao e toque em "Compartilhar"
2. Um link publico e gerado (valido por 30 dias)
3. Qualquer pessoa com o link pode visualizar (sem necessidade de conta)

---

## Exportar dados

No menu de configuracoes:

- **Exportar diario** — gera arquivo Markdown com todas as entradas
- **Backup completo** — gera arquivo JSON com todos os seus dados
- **Backup automatico** — configure backups semanais automaticos

---

## Atalhos

- `Cmd/Ctrl + K` — abre a paleta de comandos
- Na paleta, use prefixos para filtrar:
  - `mod:trabalho` — filtrar por modulo
  - `emo:focado` — filtrar por emocao
  - `per:aurora` — filtrar por periodo
  - `prio:1` — filtrar por prioridade
  - `tipo:tarefa` — filtrar por tipo
  - `tag:importante` — filtrar por tag
  - `data:hoje` — filtrar por data

---

## Temas

Alterne entre tema escuro e claro nas configuracoes. Voce tambem pode:

- Personalizar cores dos modulos (12 opcoes por modulo)
- Reordenar secoes do dashboard
- Resetar para o padrao a qualquer momento

---

## Offline

O MindRoot funciona offline como PWA. Acoes realizadas sem conexao sao enfileiradas e sincronizadas automaticamente quando a internet voltar. Um indicador no topo mostra o status de conectividade.

---

## Duvidas

Abra uma issue em: https://github.com/anthropics/claude-code/issues
