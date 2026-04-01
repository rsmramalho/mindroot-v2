# MindRoot v2 — Inventário + Roadmap PHI

**Data:** 01 Abr 2026
**Princípio:** Começa limpo. Leva só o que funciona. Constrói de dentro pra fora. PHI time.

---

## Parte 1 — Inventário: O que funciona

Audit do repo `mindroot` branch `ui-v2`. Último commit: `81efe8e` (Fase 4).
Build: passa (1 deprecation warning, zero errors).
126 arquivos TypeScript, ~20K linhas. Mas só ~35% é Genesis v5.

### ✅ LEVAR — Camada 0: Sementes (config + types)

| Arquivo | Linhas | O que faz |
|---------|--------|-----------|
| `config/type-schemas.json` | 330 | 23 types com floor, module, body_schema, extensions, naming |
| `config/types.ts` | 36 | Helpers: getTypeSchema, getFloorStage, getDefaultModule, ALL_TYPES |
| `types/item.ts` | 204 | Schema v2 completo: AtomItem, AtomState, AtomType, AtomModule, extensions, payloads |
| `types/engine.ts` | 47 | ParsedInput, DetectedToken, CheckInTrigger |

### ✅ LEVAR — Camada 1: Raízes (services + engines puros)

| Arquivo | Linhas | O que faz |
|---------|--------|-----------|
| `service/supabase.ts` | 19 | Client singleton |
| `service/item-service.ts` | 172 | CRUD items + connectionService + eventService |
| `service/auth-service.ts` | 47 | Login, signup, session, signout |
| `service/fsm-service.ts` | 122 | Gate validation + RPCs (morph, decay, commit) |
| `service/pipeline-service.ts` | 120 | Capture → classify → structure → validate → connect |
| `service/wrap-service.ts` | 133 | Collect wrap data + persist como type=wrap |
| `service/audit-service.ts` | 59 | Queries contra views (orphans, below_floor, stale) |
| `engine/fsm.ts` | 127 | State machine pura: canAdvance, advance, getItemState |
| `engine/wrap.ts` | 131 | Wrap puro: computeAudit, buildWrapBody |
| `engine/parsing.ts` | 166 | Token parser local: #mod_*, @hoje, #type_* |
| `engine/recurrence.ts` | 234 | RRULE engine: next occurrence, streak, completion |
| `engine/soul.ts` | 156 | Check-in triggers, prompts, emotional shift |
| `engine/search.ts` | 348 | Fulltext search + filter por type/module/status |

### ✅ LEVAR — Camada 2: Geometria (atoms + tokens)

| Arquivo | Linhas | O que faz |
|---------|--------|-----------|
| `atoms/tokens.ts` | 88 | MODULE_COLORS, STAGE_COLORS, STAGE_GEOMETRIES, STAGE_NAMES, getTypeColor |
| `atoms/GeometryIcon.tsx` | 39 | 7 SVG geometrias (· — △ □ ⬠ ⬡ ○) com animação |
| `atoms/TypeChip.tsx` | 21 | Pill com type label + cor do module |
| `atoms/StageBadge.tsx` | 22 | Badge: geometria + nome do estágio |
| `atoms/ModuleBar.tsx` | 22 | Barra lateral colorida por module |
| `atoms/ConfidenceBar.tsx` | 34 | Barra de confiança (3 faixas: auto/suggest/manual) |
| `atoms/FAB.tsx` | 23 | Floating action button de captura |
| `atoms/index.ts` | 8 | Re-exports |

### ✅ LEVAR — Camada 3: Nervos (stores + hooks)

| Arquivo | Linhas | O que faz |
|---------|--------|-----------|
| `store/wrap-store.ts` | 73 | Sessão de wrap multi-step |
| `store/app-store.ts` | 53 | currentPage, navigate, filters, user |
| `hooks/usePipeline.ts` | 137 | Pipeline ops com TanStack Query invalidation |
| `hooks/useRealtime.ts` | 31 | Supabase Realtime subscriptions |
| `hooks/useWrap.ts` | 31 | Wrap ritual hook |
| `hooks/useAuth.ts` | 64 | Auth state + session listener |
| `hooks/useItems.ts` | 88 | TanStack Query wrapper + filtros derivados |
| `hooks/useProject.ts` | 75 | Project aggregation (children, progress) |

### ✅ LEVAR — Camada 4: Páginas novas (Fases 1-3)

| Arquivo | O que faz |
|---------|-----------|
| `pages/Home.tsx` | Dashboard: SoulCard + WrapBanner + AtomInput + Active/Inbox |
| `pages/Pipeline.tsx` | 7-stage funnel + triage flow |
| `pages/Wrap.tsx` | 7-step wrap stepper |
| `components/dashboard/SoulCard.tsx` | Card aurora/crepúsculo |
| `components/dashboard/WrapBanner.tsx` | Banner último wrap |

### ❌ NÃO LEVAR

Shell, most components (shared, projects, calendar, onboarding, inbox, input, journal, ritual, soul, analytics), most pages (except Home/Pipeline/Wrap), engine/theme.ts, engine/dashboard-filters.ts, engine/offline-queue.ts, notification/push/share services.

---

## Parte 2 — Roadmap PHI (de dentro pra fora)

### A Espiral

```
         ·  (1)  Sementes — config, types
        —   (1)  Raízes — services, engines
       △    (2)  Geometria — atoms, tokens, shell novo
      □     (3)  Fundação — Home, Auth, Onboarding
     ⬠      (5)  Conexão — Pipeline, Wrap, Triage
    ⬡       (8)  Ativação — Projects, Calendar, Raiz
   ○        (13) Completude — Analytics, Library, Settings, Polish
```

### · Fase 1 — Sementes (esforço: 1)
Scaffold + config. Zero UI. Copy types + config from v1.

### — Fase 2 — Raízes (esforço: 1)
Services + engines. Connect to Supabase. Still zero UI.

### △ Fase 3 — Geometria (esforço: 2)
Design system + NEW shell. Atoms, tokens, theme, navigation.

### □ Fase 4 — Fundação (esforço: 3)
Auth + Home + Raiz Onboarding. First user contact.

### ⬠ Fase 5 — Conexão (esforço: 5)
Pipeline + Wrap + Triage. Full Genesis cycle.

### ⬡ Fase 6 — Ativação (esforço: 8)
Projects + Calendar + Raiz Dashboard.

### ○ Fase 7 — Completude (esforço: 13)
Analytics + Library + Settings + Polish + PWA + Deploy.

---

## Regras

1. Projeto novo. Não é fork.
2. Leva só o inventário.
3. Wireframe é lei.
4. Uma fase por vez.
5. Build from the inside out.
6. PHI time (1-1-2-3-5-8-13).
7. Spec no atom-engine-core, código no mindroot-v2.
8. Supabase intacto.
