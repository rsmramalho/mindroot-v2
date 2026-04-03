<p align="center">
  <img src="https://mindroot.com.au/favicon.svg" width="48" height="48" alt="MindRoot"/>
  <br/><br/>
  <strong>MindRoot</strong>
  <br/>
  <sub>Your life, organized from the inside out.</sub>
  <br/><br/>
  <a href="https://mindroot.com.au">Live App</a> ·
  <a href="#features">Features</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#philosophy">Philosophy</a>
</p>

---

## What is MindRoot

A personal operating system that organizes your entire digital life — not just tasks. Files, ideas, habits, reflections, documents, projects — everything enters one pipeline and emerges structured, connected, and findable.

Built on the **Genesis protocol**: 7 stages of maturation from raw capture (`·`) to committed structure (`○`). Items advance when ready, regress when integrity breaks, and decompose into seeds when complete — feeding the next cycle.

**MindRoot is the interface.** The engine lives in [`atom-engine-core`](https://github.com/rsmramalho/atom-engine-core).

## Features

**Capture** — Quick capture from anywhere. Auto-triage classifies with AI (Claude Haiku). Three confidence bands: auto, suggest, manual.

**Pipeline** — Visual progression through 7 Genesis stages. Items mature at their own pace. No forced structure.

**Wrap** — End-of-session ritual. Everything created, modified, decided, connected — committed in one structured wrap. Soul layer tracks energy and emotion across the day.

**Raiz** — Life inventory across 9 domains: identity, documents, health, finance, storage, memories, time, communication, projects. Not just productivity. Everything.

**Projects** — Project cards with progress, connections, and milestones. Items belong to projects via typed connections.

**Analytics** — Soul patterns (energy trends, emotion frequency, shift history). Connection graph stats.

**Calendar** — Ritual bands (aurora/zenith/twilight). Module-colored event dots.

**Export** — ATOM ENVELOPE (.txt), Obsidian (.md with YAML + wikilinks), JSON backup.

**Dark mode** — System, light, or dark. Full CSS variable architecture.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Data | Supabase (PostgreSQL + Auth + Edge Functions) |
| State | Zustand + TanStack Query |
| AI | Claude Haiku (auto-triage via edge function) |
| Deploy | Vercel (auto-deploy from main) |
| Testing | Vitest (41 tests) |

## Numbers

```
Commits     57          Pages        13
Files       86          Components   25
LOC         ~10,000     Services     11
Bundle      ~83KB gzip  Tests        41
```

## Philosophy

> *Build from the inside out. The engine organizes itself before organizing the world.*

MindRoot doesn't want you to be more productive. It wants you to be more **present**. The systems handle the organization so your mind is free for what matters.

Every item follows the same geometry — from raw point to committed circle. Nothing is forced. Nothing is lost. Entropy is recycling, not destruction.

```
·  capture
—  classify
△  structure
□  validate
⬠  connect
⬡  propagate
○  commit
```

## Development

```bash
git clone https://github.com/rsmramalho/mindroot-v2.git
cd mindroot-v2
npm install
npm run dev         # localhost:5173
npm run build       # production build
npm run test        # vitest
```

Requires a Supabase project with the Atom HS schema (migrations in `supabase/migrations/`).

## Architecture

```
src/
├── components/     Atoms (Button, Card, Badge) + Shell (AppShell, BottomNav, TopBar)
├── config/         raiz.ts (9 domains), type-schemas (23 types), tokens
├── engine/         triage, state, connection, wrap, soul, search
├── hooks/          useItems, useRaiz, usePipeline, useWrap, useConnectors...
├── pages/          13 pages (Home, Pipeline, Raiz, Wrap, Projects, Calendar...)
├── service/        item, pipeline, triage, wrap, soul, connector, supabase
├── store/          Zustand (app-store, item-store, wrap-store)
└── types/          AtomItem, AtomState, AtomType, AtomModule...
```

## Related

| | |
|-|-|
| **Engine** | [`atom-engine-core`](https://github.com/rsmramalho/atom-engine-core) — Genesis protocol, schema, specs, agent |
| **Live** | [mindroot.com.au](https://mindroot.com.au) |
| **Author** | [Ricardo Ramalho](https://github.com/rsmramalho) |

---

<p align="center">
  <sub>Part of the <strong>Atom HS</strong> ecosystem — Human Systems.</sub>
  <br/>
  <sub><code>·  —  △  □  ⬠  ⬡  ○</code></sub>
</p>
