# Auto-Triage Engine — Spec de Implementação


**Versão:** 1.0
**Data:** 27 Mar 2026
**Origem:** Gemini (design base) + Claude (ajuste assimetria + consolidação)
**Status:** Anexo do Genesis v4.2 — Parte 3.1 expandida
**Princípio:** Classificar errado uma nota é incômodo. Classificar errado uma task é esquecimento.


---


## 1. O problema


O Genesis v4.1 definia thresholds numéricos de confiança (≥90% passivos, ≥95% acionáveis). LLMs não retornam probabilidades de negócio — geram tokens. Pedir "qual sua confiança de 0 a 100?" resulta em números inventados, não em métricas reais.


## 2. A solução: Certeza Categórica com Chain-of-Thought


Substituir floats por três categorias (HIGH, MEDIUM, LOW) derivadas de raciocínio explícito. O modelo pensa antes de classificar — reasoning primeiro, valores depois.


## 3. Matriz de Roteamento


A diferença crítica: **MEDIUM em tipo passivo pode avançar** (risco baixo se errar), **MEDIUM em tipo acionável precisa de confirmação** (risco alto se errar).


| Confiança | Tipo | Ação | Estágio destino |
|-----------|------|------|-----------------|
| HIGH | Acionável | Auto-classifica + aplica template | 3 (Structured) |
| HIGH | Passivo | Auto-classifica + aplica template | 3 (Structured) |
| MEDIUM | Passivo | Auto-classifica com flag `#auto-classified` | 3 (Structured) |
| MEDIUM | Acionável | Sugere na UI. Humano confirma em 1 toque. | 2 (Classified) |
| LOW | Qualquer | Fica no inbox. Triagem 100% manual. | 1 (Inbox) |


## 4-8. System Prompt, Roteamento, Sanitização, Evolução, Relação com Genesis


[Spec completa com system prompt canônico (JSON mode), pseudocódigo TypeScript, Zod schema, feedback loop, logprobs, batch triage, e mapeamento para Genesis v4.2 Parte 3.1]


---


## Versionamento


| Versão | Data | Origem | Mudança |
|--------|------|--------|---------|
| 1.0 | 27 Mar 2026 | Gemini (base) + Claude (consolidação) | Design inicial |