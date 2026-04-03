# MindRoot v2

Your life, organized from the inside out.

MindRoot is the interface layer of **Atom HS** (Human Systems) — a personal operating system where everything in your digital life enters through one inbox and matures through a 7-stage geometry pipeline. Not a task manager. Not a note app. A system that grows with you.

**Live:** [mindroot-v2.vercel.app](https://mindroot-v2.vercel.app)

## How it works

Every piece of information — a task, a reflection, a recipe, a project — starts as a **point** (raw capture) and can mature into a **circle** (fully connected and committed). The 7 stages follow sacred geometry:

```
  ·  Ponto       — Capture (raw text, no structure)
  —  Linha       — Classified (type + module assigned)
  △  Triangulo   — Structured (template applied)
  □  Quadrado    — Validated (4 integrity gates passed)
  ⬠  Pentagono   — Connected (linked to other items)
  ⬡  Hexagono    — Activated (effects propagated)
  ○  Circulo     — Committed (included in daily wrap)
```

Items mature at their own pace. The system never forces structure — it waits until you're ready.

## Features

- **9 life domains (Raiz)** — identity, documents, health, finance, storage, memories, time, communication, projects. Map your entire digital life.
- **Soul loop** — emotion check-ins at aurora (morning), task completion, and crepusculo (evening wrap). The system tracks how you feel, not just what you do.
- **Auto-triage** — Claude Haiku classifies captured items with confidence bands (auto/suggest/manual).
- **Daily wrap** — 7-step ritual that closes the day: soul, items, decisions, connections, seeds, audit, intention.
- **Pipeline view** — 7-stage funnel showing every item's maturity level.
- **Connectors** — Google Calendar sync (Gmail and Drive coming). External data flows into the same Genesis pipeline.
- **Light + dark mode** — period-aware UI (aurora warmth, crepusculo calm).
- **PWA** — installable, works offline for core operations.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript 5.9 + Vite 8 |
| Styling | Tailwind CSS 4 + Framer Motion |
| Data | Supabase (Postgres + Auth + Edge Functions + Realtime) |
| State | Zustand 5 + TanStack Query 5 |
| AI | Claude Haiku (auto-triage via Supabase Edge Functions) |
| Deploy | Vercel (auto-deploy) + PWA |

## Architecture

```
src/
  pages/         13 route pages (named exports, lazy-loaded)
  components/    25 components (atoms, shell, home, shared)
  hooks/         12 React hooks (never call Supabase directly)
  service/       11 services (all Supabase access goes here)
  engine/         6 pure logic modules (FSM, parsing, search, wrap, soul, recurrence)
  store/          3 Zustand stores (app, wrap, toast)
  types/          Schema v2 types (23 AtomTypes, 8 modules, 8 states)
  config/         type-schemas.json + raiz domains
```

**Pattern:** pages -> hooks -> services -> Supabase. No exceptions.

## Numbers

| Metric | Value |
|--------|-------|
| Commits | 55 |
| Source files | 83 |
| Lines of code | ~5,700 |
| Pages | 13 |
| Services | 11 |
| Hooks | 12 |
| Edge functions | 5 |
| Supabase tables | 4 (items, item_connections, atom_events, user_connectors) |
| Genesis stages | 7 |
| Life domains | 9 |
| Atom types | 23 |

## Genesis Protocol

MindRoot is built on **Genesis v5.0.1** — a universal schema that defines how information matures. The protocol lives in [atom-engine-core](https://github.com/rsmramalho/atom-engine-core) and includes:

- **23 item types** (note, task, project, reflection, recipe, workout, spec...)
- **8 life modules** (work, body, mind, family, purpose, bridge, finance, social)
- **7 maturity stages** with a state machine (advance sequentially, regress on lost requirements)
- **Type floors** — minimum stage per type (tasks need structure, projects need connections)
- **4 RPCs** — morph (mutate type), decay (entropy), propagate (cascade), commit (finalize)
- **3 audit views** — orphans, below-floor, stale inbox

## Development

```bash
git clone https://github.com/rsmramalho/mindroot-v2.git
cd mindroot-v2
npm install
cp .env.example .env  # Add Supabase credentials
npm run dev            # localhost:5173
npm run build          # tsc -b && vite build
```

## Philosophy

The system serves the person, not the other way around. If the app doesn't make you want to open it in the morning, it's not ready.

*Emotion precedes action. Reflection closes the loop.*
