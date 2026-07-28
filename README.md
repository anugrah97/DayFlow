# DayFlow

DayFlow is an AI-powered calendar and day planner. It syncs your Google Calendar, layers in your personal tasks, and uses Claude to suggest an optimized schedule for your day — placing focus work around your meetings instead of leaving you to figure it out manually.

> **This project was built almost entirely with AI assistance (Claude / Claude Code).** See [How this was built](#how-this-was-built) below for what that means in practice and what a human still did.

## Features

- **Google Sign-In** — OAuth 2.0 via NextAuth.js, read-only Calendar scope
- **Calendar Sync** — today's events pulled from Google Calendar API v3 and rendered on an hourly timeline (7am–10pm), auto-refreshing every 15 minutes
- **Task Management** — add/edit/delete tasks with duration and priority, persisted locally
- **Drag-and-Drop Scheduling** — drag tasks onto calendar slots (`@dnd-kit`), with conflict detection against existing meetings
- **AI Day Optimization** — "Optimize My Day" sends your calendar + tasks to Claude, which returns a suggested schedule with reasoning ("scheduled deep work before your 10am meeting")

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [NextAuth.js v5](https://authjs.dev) (Google provider)
- [Google Calendar API](https://developers.google.com/calendar) via `googleapis`
- [Anthropic Claude API](https://docs.anthropic.com) (`@anthropic-ai/sdk`) for AI day optimization
- [Zustand](https://github.com/pmndrs/zustand) for state, [`@dnd-kit`](https://dndkit.com) for drag-and-drop
- Jest + React Testing Library for unit tests

## Project Structure

```
DayFlow/
├── web/            # Next.js app (the actual product)
│   └── src/
│       ├── app/          # routes: auth, dashboard/calendar, API routes
│       ├── components/   # calendar timeline + task planner UI
│       ├── lib/          # auth config, Google Calendar client, conflict detection
│       └── store/        # Zustand planner store
├── docs/           # PRD, user stories, backlog, QA/test-case matrices
├── scripts/        # utility scripts (e.g. Jira ticket setup)
└── PLAN.md         # the original implementation plan this build followed
```

## Getting Started

```bash
cd web
npm install
```

Create `web/.env.local` with:

```
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
ANTHROPIC_API_KEY=...
```

You'll need a Google Cloud project with the Calendar API enabled and OAuth credentials (scopes: `openid email profile https://www.googleapis.com/auth/calendar.readonly`).

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run tests with `npm test` (or `npm run test:watch` / `npm run test:ci`).

## How this was built

DayFlow was developed as an experiment in AI-assisted software development. [Claude Code](https://claude.com/claude-code) was used to go from a product idea to a working app, acting through several role-based "agent" passes documented in [PLAN.md](PLAN.md):

- **BA agent** — wrote the [PRD](docs/PRD.md) and [user stories](docs/user-stories.md)
- **PM agent** — broke work into a [sprint backlog](docs/backlog.md)
- **Dev agent** — implemented each sprint (auth, calendar sync, task planner + drag-and-drop, AI optimization) as tracked in the git history
- **QA/security agent** — wrote functional, UI, DevOps, and VAPT test cases under `docs/testing/`, and a Jest unit test suite

A human (me) directed the process throughout: defining the product, reviewing and steering each step, running the app, and deciding what shipped. The code, tests, and docs in this repo are the output of that collaboration — nothing here was written without a human reviewing it, but a large share of the initial implementation was AI-generated.

If you're browsing this as a portfolio piece: it's meant to show what a focused human + AI workflow can produce, not to claim the AI did this unsupervised.

## Status

This is an MVP / learning project, not a production service. Known limitations: tasks persist to `localStorage` only (no backend database), single-day planning only, no Outlook/Microsoft support yet — see [docs/PRD.md](docs/PRD.md#4-out-of-scope-mvp) for the full out-of-scope list.
