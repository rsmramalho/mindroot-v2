# Fase 4 — Service Layer + FSM Runtime

**Status:** em implementação
**Repo:** mindroot (branch ui-v2)
**Princípio:** Sem esta fase, a UI é casca e o banco é motor parado.

---

## Escopo

Conectar a UI (Fases 0-3) ao Supabase (Schema v2 / Genesis v5.0.1).
Resultado: um item pode ser criado, classificado, estruturado, validado, conectado e commitado — tudo pelo MindRoot, tudo persistido no Supabase.

---

## Entregáveis

### Services (src/service/)

| Service | Responsabilidade |
|---------|-----------------|
| items.service.ts | CRUD tipado pra items |
| fsm.service.ts | State transitions + gate validation + RPCs (morph, decay, commit) |
| connections.service.ts | CRUD edges + propagate_effect RPC |
| events.service.ts | Read atom_events |
| wrap.service.ts | Collect wrap data + commit wrap JSONB |
| audit.service.ts | Queries contra views (v_orphan_items, v_below_floor, v_inbox_stale) |
| pipeline.service.ts | Orquestrador — lifecycle completo de um item |

### Stores (src/store/)

| Store | Responsabilidade |
|-------|-----------------|
| items.store.ts | Zustand store pra items (list, inbox, CRUD) |
| wrap.store.ts | Estado da sessão de wrap (steps, session data) |

### Hooks (src/hooks/)

| Hook | Responsabilidade |
|------|-----------------|
| useItems.ts | Hook pra componentes (fetch, filter) |
| usePipeline.ts | Hook pro pipeline (capture → commit) |
| useWrap.ts | Hook pro wrap flow |
| useRealtime.ts | Supabase Realtime subscriptions |

### Types (src/types/)

| File | Responsabilidade |
|------|-----------------|
| database.ts | Tipos do schema Supabase (Insert/Update helpers) |

---

## FSM Gates

| Target Stage | Gate |
|-------------|------|
| 1 (inbox) | title não vazio |
| 2 (classified) | type + module definidos |
| 3 (structured) | body schema preenchido (se type exige) |
| 4 (validated) | estágio >= 3 |
| 5 (connected) | tem pelo menos 1 connection |
| 6 (propagated) | propagate_effect executado |
| 7 (committed) | commit via wrap ou RPC |

---

## RPCs do Supabase

| RPC | Efeito |
|-----|--------|
| morph_item(p_item_id, p_new_type) | Muda type, regride pra stage 2, cria fóssil |
| decay_item(p_item_id) | Cria seed no inbox, archiva original |
| propagate_effect(p_source_id, p_target_id, p_effect_type, p_payload) | Cria evento + avança source pra propagated |
| commit_item(p_item_id) | Avança pra committed (stage 7) |

---

## Critério de done

### Funcional
- [ ] capture("teste") → item no Supabase state=inbox stage=1
- [ ] classify(id, 'task', 'work') → classified stage=2
- [ ] structure(id, {}) → structured stage=3
- [ ] validate(id) → validated stage=4
- [ ] connect(id, targetId, 'belongs_to') → connected stage=5
- [ ] commit(id) → committed stage=7
- [ ] commitWrap(session) → wrap no Supabase type=wrap stage=7
- [ ] auditService.getFullReport() → dados reais das views
- [ ] Build passa sem erros (npm run build)

### Proteções
- [ ] FSM impede pular estágio (1→3 falha)
- [ ] FSM impede avançar sem gate (classify sem type falha)
- [ ] Item archived/committed não avança
- [ ] morph() regride pra estágio 2 + cria fóssil
- [ ] decay() cria seed no inbox + archiva original
