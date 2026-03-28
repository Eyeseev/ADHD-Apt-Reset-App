# Website Builder Evaluator — CLAUDE.md

## What This Project Is

A Next.js monorepo with two distinct things living side by side:

1. **Website Builder Evaluator** — A CLI tool that audits a Next.js site using Lighthouse + Claude (LLM), produces structured findings, and applies approved atomic fixes.
2. **ADHD Apt Reset** — A personal productivity app at `/adhd-reset` for tracking a full apartment reorganization project, built specifically for an ADHD brain.

---

## Running the Project

```bash
npm install
npm run dev          # starts Next.js at http://localhost:3000
```

Key URLs:
- `http://localhost:3000` — main index page
- `http://localhost:3000/adhd-reset` — ADHD apartment reset tracker

---

## CLI Tool (Website Builder Evaluator)

### Commands

```bash
npm run cli -- evaluate --url http://localhost:3000   # full audit + fix pipeline
npm run cli -- llm-test --url http://localhost:3000   # dry-run LLM audit only (saves JSON to reports/)
```

### Setup

Requires `ANTHROPIC_API_KEY`. Use `.env.local` (git-ignored):

```
ANTHROPIC_API_KEY=sk-...
LLM_PROVIDER=anthropic
```

### How it works

```
evaluator → planner → approver → implementer
```

1. **Evaluator** (`src/agents/evaluator/`) — runs Lighthouse audit, collects technical findings
2. **LLM** (`src/agents/llm/`) — calls Claude via Anthropic adapter, returns structured JSON findings; validator enforces schema
3. **Planner** (`src/agents/planner/`) — converts findings into atomic fix plans
4. **Approver** (`src/agents/approver/`) — gates which fixes proceed
5. **Implementer** (`src/agents/implementer/`) — applies approved fixes to source files

Reports are saved to `reports/` as JSON.

### Requirements
- Node 18+ (uses native `fetch`)
- Chrome headless (for Lighthouse)

---

## ADHD Apt Reset (`/pages/adhd-reset.tsx`)

A single-file React app with 7 tabs. All task state persists to `localStorage` automatically — no backend, no account needed.

### Tabs

| Tab | What's in it |
|-----|-------------|
| **Today** | 6 priority tasks in order, with timed breaks. MVP mode (2-task fallback for low-energy days). Progress bar. |
| **Master List** | All ~80 tasks organized by room/zone. Each zone is an expandable accordion with its own progress bar. |
| **Shopping** | Buy list by category. Warns not to shop until Phase 1 is done. |
| **Declutter** | Hit list grouped by type: Rehome/Decide, Find a Home, Clear Surfaces, Go Through These. |
| **Phases** | 4 phased execution plan. Each phase is expandable and shows: Do First, task checklist, Bottleneck warning, Can Wait note. |
| **Weekly Plan** | 4-week session schedule (not marathon days — sessions). |
| **Maintenance** | Tiered daily reset (Red/Orange/Green energy levels), weekly checklist, 5 Golden Rules. |

### The 4 Phases

- **Phase 01 — Fast Reset** (Low–Medium effort): Laundry, dishes, clear couch/coffee table, trash sweep. No buying, no organizing.
- **Phase 02 — Declutter + Remove Obstacles** (Medium–High): Wardrobe bins, utility closet, nightstands, paperwork, list items for sale.
- **Phase 03 — Organize by Zone** (Medium): Kitchen neighborhoods, launch pad, clothes purgatory, nightstand tray, Doom Box. One zone per session.
- **Phase 04 — Easy-Maintenance Systems** (Medium–High): Lighting, checklists, calm corner, storage upgrades. Buy only after selling the heater.

### Key Design Principles (ADHD-friendly)
- Everything visible, low-friction, obvious
- Momentum-first: start with the thing that unlocks the most other things (laundry)
- Tiered by energy so it works on bad days too
- Doom Box for items without a home — empty it weekly

### localStorage Keys
All prefixed with `adhd-reset-`:
- `adhd-reset-today` — today tab checkboxes
- `adhd-reset-master-zone-{n}` — per-zone task state (0–8)
- `adhd-reset-shopping-{n}` — shopping list state
- `adhd-reset-declutter-{n}` — declutter hit list state
- `adhd-reset-phase-{n}` — per-phase task state (0–3)
- `adhd-reset-weekly-reset` — weekly maintenance checklist

---

## Project Structure

```
/
├── pages/
│   ├── index.tsx          # main evaluator UI
│   └── adhd-reset.tsx     # ADHD apt reset app
├── src/
│   ├── agents/
│   │   ├── evaluator/     # Lighthouse audit runner
│   │   ├── llm/           # Claude/Anthropic adapter + validator
│   │   ├── planner/       # fix planning
│   │   ├── approver/      # fix approval gate
│   │   └── implementer/   # applies fixes to files
│   ├── cli/               # CLI entry point (index.ts)
│   └── utils/             # logger, report writer
├── reports/               # generated audit JSON output
├── .env.local             # ANTHROPIC_API_KEY (git-ignored)
├── package.json
└── CLAUDE.md              # this file
```

---

## Tech Stack

- **Next.js 13** (Pages Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (available but ADHD reset uses inline styles)
- **Lighthouse 11** (for audits)
- **Anthropic SDK** (Claude via REST — no SDK package, uses raw fetch)
- **ts-node** (CLI runner)
