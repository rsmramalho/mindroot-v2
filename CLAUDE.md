# MindRoot

Emotional productivity system. Emotion precedes action, reflection closes the loop.

## Stack

React 19 · TypeScript 5.8 · Vite 6 · Tailwind 3 · Supabase · TanStack Query 5 · Zustand 5 · Framer Motion · date-fns

## Commands

```bash
npm run dev      # Dev server (port 5173)
npm run build    # tsc -b && vite build
npm test         # vitest (222 tests, 13 suites)
npx tsc --noEmit # Type check only
```

## Architecture

```
src/
  pages/         # Route pages (named exports: export function HomePage)
  components/    # UI components (default exports OK)
  hooks/         # React hooks — never call Supabase directly
  service/       # Data layer — all Supabase access goes here
  engine/        # Pure logic (parsing, soul engine, dashboard filters)
  store/         # Zustand stores (app-store, ritual-store)
  types/         # Pure types, zero imports (item.ts, ui.ts, engine.ts)
supabase/        # Migrations, edge functions, seeds
```

## Critical Rules

1. **Named exports on pages**: `export function HomePage()` — App.tsx imports `{ HomePage }` etc.
2. **Path alias**: `@/` = `src/`. Always use `@/` imports.
3. **AtomItem booleans**: `item.completed` (boolean), `item.archived` (boolean). NEVER use `item.completed_at` as boolean check. NEVER use `item.status`.
4. **Service layer**: hooks → service → Supabase. Hooks never import from `service/supabase.ts` directly.
5. **No emoji in UI**: use word-based labels, font-mono icons.
6. **Language**: code/comments in English, UI strings in Brazilian Portuguese.
7. **Before delivering**: always run `npx tsc --noEmit && npm run build`. Zero errors.

## Design System

- Fonts: Cormorant Garamond (serif), Inter (sans), JetBrains Mono (mono)
- Background: `bg` #111318, `surface` #1a1d24, `border` #2a2d34
- Text: `light` #e8e0d4, `mind` #c4a882, `muted` #a89478
- Accent colors: `heart` #d4856a, `soul` #8a9e7a
- Ritual periods: `aurora` #f0c674, `zenite` #e8e0d4, `crepusculo` #8a6e5a
- Module colors: purpose, work, family, body, mind, soul (see tailwind.config.ts)
- Style: dark theme, minimalist, no emoji

## Key Types (src/types/item.ts)

- `AtomItem` — core entity with `id`, `title`, `type`, `module`, `priority`, `tags`, `completed`, `archived`, `parent_id`, `due_date`, `emotion_before`, `emotion_after`
- `ItemType`: task | habit | ritual | chore | project | note | reflection | journal
- `ItemModule`: purpose | work | family | body | mind | soul
- `RitualPeriod`: aurora | zenite | crepusculo
- `Emotion`: calmo | focado | grato | animado | confiante | ansioso | cansado | frustrado | triste | perdido | neutro

## Environment Variables

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
