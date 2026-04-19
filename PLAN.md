# DayFlow — Implementation Plan

**Product:** AI-powered calendar + day planner with email integration  
**Created:** 2026-04-19  
**MVP Scope:** Web app (Next.js), Gmail + Google Calendar integration, AI day optimization

---

## Allowed APIs (Phase 0 Discovery)

| API | Version | Key Scope/Endpoint |
|---|---|---|
| Google OAuth 2.0 | v2 | `gmail.readonly`, `calendar.readonly`, `openid`, `email`, `profile` |
| Gmail API | v1 | `GET /gmail/v1/users/me/messages` |
| Google Calendar API | v3 | `GET /calendar/v3/calendars/primary/events` |
| Anthropic Claude | messages v1 | `POST https://api.anthropic.com/v1/messages` model: `claude-sonnet-4-6` |
| NextAuth.js | v5 (Auth.js) | Google provider, session management |

**Anti-patterns to avoid:**
- Do NOT use Gmail API to parse meeting invites — use Google Calendar API directly (it's authoritative)
- Do NOT store OAuth tokens in localStorage — use server-side sessions (NextAuth handles this)
- Do NOT call Claude API from the client — always route through `/api/` server routes
- Do NOT use `react-beautiful-dnd` (deprecated) — use `@dnd-kit/core`

---

## Sprint Structure

| Sprint | Focus | Agent(s) |
|---|---|---|
| Sprint 0 | PRD, user stories, architecture | BA Agent |
| Sprint 1 | Project setup, auth, Google OAuth | PM + Web Dev |
| Sprint 2 | Calendar fetch + display | Web Dev |
| Sprint 3 | Day planner UI + drag-and-drop | Web Dev |
| Sprint 4 | AI day optimization (Claude) | Web Dev |
| Sprint 5 | Testing + QA | QA Agent |
| Sprint 6 | Mobile — iOS (SwiftUI) | iOS Dev |
| Sprint 7 | Mobile — Android (Compose) | Android Dev |

---

## Phase 0: Documentation Discovery ✅ COMPLETE

**Findings:**
- Auth: Use NextAuth.js v5 (Auth.js) with Google provider
- Calendar data: Google Calendar API v3 (not Gmail message parsing)
- OAuth scopes: `openid email profile https://www.googleapis.com/auth/calendar.readonly`
- AI: Claude `claude-sonnet-4-6` via `POST /api/ai/optimize`
- Drag-and-drop: `@dnd-kit/core @dnd-kit/sortable`
- State: Zustand
- Styling: Tailwind CSS + shadcn/ui

---

## Phase 1: BA Agent — PRD & User Stories

**Agent role:** Business Analyst  
**Output files:**
- `docs/PRD.md` — Full product requirements document
- `docs/user-stories.md` — Epics and user stories with acceptance criteria
- `docs/test-cases.md` — Test case matrix

**Tasks:**
1. Write PRD covering: problem statement, personas, feature list, out-of-scope, success metrics
2. Write user stories for all MVP features (auth, calendar sync, day view, AI optimize)
3. Write test cases for each user story

**Personas:**
- Alex, 32, Product Manager — back-to-back meetings, needs focus blocks
- Sam, 28, Freelancer — juggles client work + personal tasks

---

## Phase 2: PM Agent — Sprint Backlog

**Agent role:** Product Manager  
**Output files:**
- `docs/backlog.md` — Prioritized task list
- `docs/sprint-1.md` — Sprint 1 ticket breakdown

**Tasks:**
1. Convert user stories into dev tickets with estimates (S/M/L)
2. Define Sprint 1 scope: project setup + auth only
3. Define Sprint 2 scope: calendar fetch + display
4. Define done criteria for each sprint

---

## Phase 3: Web Dev — Project Setup & Auth

**Agent role:** Web Developer  
**Working directory:** `/Users/anugrahpandya/DayFlow/web`

**Setup commands (copy exactly):**
```bash
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd web
npm install next-auth@beta @auth/core
npm install @googleapis/calendar googleapis
npm install zustand
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @anthropic-ai/sdk
npx shadcn@latest init
```

**Folder structure:**
```
web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── calendar/page.tsx
│   │   │   └── planner/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── calendar/events/route.ts
│   │   │   └── ai/optimize/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── calendar/
│   │   ├── planner/
│   │   └── ui/
│   ├── lib/
│   │   ├── auth.ts          ← NextAuth config
│   │   ├── google-calendar.ts ← Calendar API client
│   │   └── claude.ts        ← Claude API client
│   └── store/
│       └── planner.ts       ← Zustand store
├── .env.local
└── ...
```

**Auth setup pattern (src/lib/auth.ts):**
```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    }
  }
})
```

**Verification checklist:**
- [ ] `npm run dev` starts without errors
- [ ] `/login` renders Google sign-in button
- [ ] After OAuth, session contains `accessToken`
- [ ] `GET /api/calendar/events` returns events array

---

## Phase 4: Web Dev — Calendar Fetch & Display

**Agent role:** Web Developer  

**Google Calendar API call (src/lib/google-calendar.ts):**
```typescript
import { google } from "googleapis"

export async function getTodaysEvents(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  
  const calendar = google.calendar({ version: "v3", auth })
  const today = new Date()
  const startOfDay = new Date(today.setHours(0,0,0,0)).toISOString()
  const endOfDay = new Date(today.setHours(23,59,59,999)).toISOString()

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfDay,
    timeMax: endOfDay,
    singleEvents: true,
    orderBy: "startTime",
  })
  return res.data.items ?? []
}
```

**Calendar display components:**
- `components/calendar/DayView.tsx` — Timeline view (hour rows, events as blocks)
- `components/calendar/EventBlock.tsx` — Individual event card
- `components/calendar/TimeGrid.tsx` — 24-hour grid

**Verification checklist:**
- [ ] Events fetched from Google Calendar API (not mocked)
- [ ] Day view renders events at correct time positions
- [ ] Event blocks show: title, time, duration, attendees count

---

## Phase 5: Web Dev — Day Planner + Drag-and-Drop

**Agent role:** Web Developer  

**dnd-kit pattern:**
```typescript
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"

// Wrap planner with DndContext, tasks in SortableContext
// On dragEnd: update Zustand store task order
```

**Zustand store (src/store/planner.ts):**
```typescript
interface Task { id: string; title: string; duration: number; priority: "high"|"medium"|"low"; scheduledAt?: Date }
interface PlannerStore {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  reorderTasks: (activeId: string, overId: string) => void
  scheduleTask: (id: string, time: Date) => void
}
```

**Verification checklist:**
- [ ] Tasks can be added via form
- [ ] Tasks draggable within planner list
- [ ] Tasks droppable onto calendar time slots
- [ ] Store persists task order after drag

---

## Phase 6: Web Dev — AI Day Optimization

**Agent role:** Web Developer  

**Claude API route (src/app/api/ai/optimize/route.ts):**
```typescript
import Anthropic from "@anthropic-ai/sdk"
import { auth } from "@/lib/auth"
import { getTodaysEvents } from "@/lib/google-calendar"

export async function POST(req: Request) {
  const session = await auth()
  const events = await getTodaysEvents(session!.accessToken)
  const { tasks } = await req.json()

  const client = new Anthropic()
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: `You are a day planning assistant. Given a list of calendar events and tasks, 
    suggest an optimized schedule. Return JSON with scheduledTasks array.`,
    messages: [{
      role: "user",
      content: `Calendar events: ${JSON.stringify(events)}\n\nTasks to schedule: ${JSON.stringify(tasks)}`
    }]
  })
  return Response.json({ schedule: message.content[0] })
}
```

**Optimization logic:**
- Find free blocks between calendar events
- Assign high-priority tasks to morning focus blocks
- Buffer 15min before/after meetings
- Return suggested schedule as JSON

**Verification checklist:**
- [ ] Optimize button triggers Claude API call
- [ ] Response contains scheduled times for each task
- [ ] Calendar view updates to show AI-suggested slots
- [ ] Works with 0 tasks (returns focus block suggestions only)

---

## Phase 7: QA Agent — Testing

**Agent role:** QA / Testing  
**Output files:**
- `docs/test-results.md`
- `web/__tests__/` — Jest + React Testing Library tests

**Test areas:**
1. Auth flow (mock Google OAuth)
2. Calendar fetch (mock googleapis response)
3. Planner drag-and-drop (dnd-kit test utilities)
4. Claude API route (mock Anthropic SDK)
5. E2E: login → view calendar → add task → optimize day

**Commands:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D playwright  # E2E
```

---

## Phase 8+: Mobile (Future Sprints)

**iOS (Sprint 6):**
- SwiftUI app, Sign in with Google via `GoogleSignIn-iOS` SDK
- Google Calendar API via REST (URLSession)
- Day view with `List` + drag reorder
- Claude API via server-side proxy (never expose API key on mobile)

**Android (Sprint 7):**
- Kotlin + Jetpack Compose
- Google Sign-In via `credentials-play-services-auth`
- Google Calendar API REST
- LazyColumn with reorder support

---

## Environment Variables (.env.local)

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ANTHROPIC_API_KEY=
```

---

## Definition of Done (MVP)

- [ ] User can sign in with Google account
- [ ] Today's calendar events load from Google Calendar API
- [ ] User can add tasks to the day planner
- [ ] User can reorder tasks via drag-and-drop
- [ ] "Optimize My Day" button schedules tasks around meetings using Claude
- [ ] All Sprint 1-4 tests passing
- [ ] No API keys exposed client-side
