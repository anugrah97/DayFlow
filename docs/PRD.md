# DayFlow — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-04-19  
**Status:** Draft — Sprint 0  
**Author:** BA Agent

---

## 1. Problem Statement

Knowledge workers lose 2-3 hours daily to context-switching between email, calendar, and to-do apps. Meeting invites scattered in email are missed or forgotten. Tasks get scheduled without awareness of meeting load, leaving users either over-committed or with unplanned idle time.

**DayFlow** solves this by becoming a single intelligent surface: it pulls meeting data from the user's existing calendar, layers on their personal tasks, and uses AI to build an optimized day plan — automatically.

---

## 2. Target Personas

### Persona 1 — Alex, 32, Product Manager
- Has 6-10 meetings per day, mostly syncs and reviews
- Uses Gmail + Google Calendar
- Constantly interrupted; struggles to find focus time
- **Goal:** See all meetings in one place + automatically block 2hr deep work per day

### Persona 2 — Sam, 28, Freelancer / Consultant
- Fewer meetings, more task-driven
- Mixes client work with personal errands
- Forgets to check calendar before planning the day
- **Goal:** Avoid scheduling tasks when meetings exist; prioritize high-value work first

---

## 3. MVP Feature List (Web App)

### F1 — Google Authentication
- Sign in with Google (OAuth 2.0)
- Scope: read-only access to Google Calendar
- Session persists across page refreshes

### F2 — Calendar Sync
- Fetch today's events from Google Calendar API v3
- Display in a timeline day view (hourly grid, 7am–10pm)
- Show: event title, time, duration, attendee count
- Refresh automatically every 15 minutes

### F3 — Task Management
- Add tasks with: title, estimated duration, priority (High / Medium / Low)
- View task list alongside calendar
- Delete / edit tasks
- Tasks persist in local storage (MVP; no backend DB)

### F4 — Drag-and-Drop Scheduling
- Drag tasks from the task list onto calendar time slots
- Drag tasks within the planner to reorder
- Visual feedback on drag (ghost element, drop zone highlight)
- Conflict detection: warn if task overlaps with a meeting

### F5 — AI Day Optimization
- "Optimize My Day" button
- Sends calendar events + task list to Claude API
- Claude returns a suggested schedule (JSON)
- User can accept or dismiss each suggestion
- Shows reasoning: "Scheduled deep work before your 10am meeting"

---

## 4. Out of Scope (MVP)

- Outlook / Microsoft 365 integration (Phase 2)
- Multi-day planning
- Team scheduling / shared calendars
- Mobile app (Sprint 6+)
- Backend database / cloud sync
- Recurring task templates
- Push notifications

---

## 5. Success Metrics

| Metric | Target |
|---|---|
| Time to first calendar sync after login | < 5 seconds |
| AI optimization response time | < 8 seconds |
| User completes "optimize day" flow | ≥ 70% of sessions |
| Zero API key exposure in client bundle | 100% |

---

## 6. Technical Constraints

- OAuth tokens must be server-side only (NextAuth session)
- Claude API called server-side only (never from browser)
- Google Calendar is read-only (no write-back in MVP)
- Must work on Chrome, Firefox, Safari (latest 2 versions)

---

## 7. User Flow — Primary Path

```
1. User visits DayFlow → sees landing page
2. Clicks "Sign in with Google"
3. Google OAuth consent → calendar.readonly scope granted
4. Redirected to /dashboard/calendar
5. Today's events load from Google Calendar
6. User adds 3 tasks in the task panel
7. Clicks "Optimize My Day"
8. Claude API returns schedule
9. User sees tasks placed in time slots
10. User drags one task to a different slot (manual override)
11. Day plan saved to local storage
```

---

## 8. Acceptance Criteria Summary

| Feature | Acceptance Criteria |
|---|---|
| F1 Auth | User redirected to dashboard after Google consent; session has accessToken |
| F2 Calendar | Events for today shown on timeline; correct time/duration positioning |
| F3 Tasks | Add/delete/edit task; persists after page refresh (localStorage) |
| F4 Drag-drop | Task draggable to time slot; conflict warning shown if overlapping meeting |
| F5 AI Optimize | Claude returns schedule within 8s; suggestions shown with reasoning text |
