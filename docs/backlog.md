# DayFlow — Product Backlog

**Version:** 1.0 | **Date:** 2026-04-19 | **PM Agent**

---

## Sprint 1 — Foundation & Auth
**Goal:** Working Next.js app with Google Sign-In  
**Duration:** 1 week

| Ticket | Story | Task | Est |
|---|---|---|---|
| DF-001 | US-001 | Bootstrap Next.js 14 project with TypeScript + Tailwind | S |
| DF-002 | US-001 | Install & configure NextAuth.js v5 with Google provider | M |
| DF-003 | US-001 | Build landing page with Sign-In button | S |
| DF-004 | US-002 | Implement session persistence + redirect logic | S |
| DF-005 | US-001 | Store OAuth access token in server session | S |
| DF-006 | — | Configure `.env.local`, Google Cloud OAuth credentials | S |

**Sprint 1 Done Criteria:**
- User can sign in with Google and land on `/dashboard/calendar`
- `session.accessToken` available server-side

---

## Sprint 2 — Calendar Sync & Display
**Goal:** Today's events visible in day timeline  
**Duration:** 1 week

| Ticket | Story | Task | Est |
|---|---|---|---|
| DF-007 | US-003 | Build `GET /api/calendar/events` route using googleapis | M |
| DF-008 | US-003 | Build `TimeGrid` component (7am–10pm, 30-min slots) | M |
| DF-009 | US-003 | Build `EventBlock` component (positioned by time) | M |
| DF-010 | US-003 | Build `DayView` page composing grid + events | S |
| DF-011 | US-004 | Add 15-min auto-refresh with SWR or React Query | S |
| DF-012 | US-004 | Add "Last synced" timestamp + manual refresh button | S |

**Sprint 2 Done Criteria:**
- Events from Google Calendar render in correct time positions
- Auto-refresh working

---

## Sprint 3 — Task Management + Drag-and-Drop
**Goal:** Users can add tasks and drag them onto the calendar  
**Duration:** 1 week

| Ticket | Story | Task | Est |
|---|---|---|---|
| DF-013 | US-005 | Build `AddTaskForm` component | S |
| DF-014 | US-005 | Build Zustand store for tasks + localStorage persistence | M |
| DF-015 | US-006 | Add edit/delete to task list items | S |
| DF-016 | US-007 | Integrate dnd-kit — make tasks draggable | M |
| DF-017 | US-007 | Make calendar time slots droppable | M |
| DF-018 | US-008 | Implement conflict detection + warning toast | M |

**Sprint 3 Done Criteria:**
- Task CRUD working with localStorage
- Drag-and-drop from task list to calendar slot works
- Conflict warning appears when task overlaps meeting

---

## Sprint 4 — AI Day Optimization
**Goal:** Claude suggests an optimized schedule  
**Duration:** 1 week

| Ticket | Story | Task | Est |
|---|---|---|---|
| DF-019 | US-009 | Build `POST /api/ai/optimize` route with Claude API | M |
| DF-020 | US-009 | Design Claude system prompt for schedule optimization | M |
| DF-021 | US-009 | Build `OptimizationPanel` — loading state + suggestions list | M |
| DF-022 | US-010 | Add Accept/Dismiss per suggestion + "Accept All" | M |
| DF-023 | US-009 | Add response streaming (optional, improves perceived speed) | L |

**Sprint 4 Done Criteria:**
- Optimize button returns schedule in < 8 seconds
- Accept/Dismiss flow schedules tasks correctly

---

## Sprint 5 — QA & Testing
**Goal:** Test coverage for all MVP flows  
**Duration:** 3-4 days

| Ticket | Task | Est |
|---|---|---|
| DF-024 | Unit tests: auth flow (mocked Google OAuth) | M |
| DF-025 | Unit tests: calendar fetch (mocked googleapis) | M |
| DF-026 | Unit tests: Zustand store actions | S |
| DF-027 | Component tests: TaskList, DayView, EventBlock | M |
| DF-028 | Integration test: drag-and-drop flow | M |
| DF-029 | Integration test: AI optimize → accept flow | M |
| DF-030 | E2E: full user journey (Playwright) | L |

---

## Backlog (Future Sprints)

| Ticket | Feature | Sprint |
|---|---|---|
| DF-031 | Outlook / Microsoft 365 integration | 6 |
| DF-032 | iOS app (SwiftUI) | 7 |
| DF-033 | Android app (Jetpack Compose) | 8 |
| DF-034 | Backend DB (Postgres) for cloud task sync | 9 |
| DF-035 | Multi-day planning view | 10 |
| DF-036 | Recurring tasks | 10 |
| DF-037 | Team calendar overlay | 11 |
