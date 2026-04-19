# DayFlow — User Stories

**Version:** 1.0 | **Date:** 2026-04-19 | **Sprint:** 0

---

## Epic 1: Authentication

### US-001 — Google Sign-In
**As a** new user  
**I want to** sign in with my Google account  
**So that** DayFlow can access my calendar without me sharing my password

**Acceptance Criteria:**
- [ ] "Sign in with Google" button visible on landing page
- [ ] Clicking triggers Google OAuth consent screen
- [ ] Consent screen requests only `calendar.readonly` scope
- [ ] After consent, user is redirected to `/dashboard/calendar`
- [ ] User's name and avatar shown in top nav
- [ ] Signing out clears session and returns to landing page

**Estimate:** M

---

### US-002 — Persistent Session
**As a** returning user  
**I want to** stay logged in across browser sessions  
**So that** I don't have to re-authenticate every time

**Acceptance Criteria:**
- [ ] Refreshing the page keeps the user logged in
- [ ] Session expires after 30 days of inactivity
- [ ] Expired session redirects to login

**Estimate:** S

---

## Epic 2: Calendar Sync

### US-003 — View Today's Events
**As a** signed-in user  
**I want to** see all my meetings for today  
**So that** I know my meeting load before planning tasks

**Acceptance Criteria:**
- [ ] Events fetched from Google Calendar API on page load
- [ ] Events shown on a day timeline (7am–10pm)
- [ ] Each event shows: title, start time, end time, duration
- [ ] Events are color-coded by calendar
- [ ] "No events today" state shown when empty

**Estimate:** M

---

### US-004 — Auto-Refresh Calendar
**As a** user with a dynamic calendar  
**I want** the calendar to update without me refreshing  
**So that** new meetings added by others appear automatically

**Acceptance Criteria:**
- [ ] Calendar data refreshes every 15 minutes
- [ ] "Last synced" timestamp shown
- [ ] Manual "Refresh" button available

**Estimate:** S

---

## Epic 3: Task Management

### US-005 — Add a Task
**As a** user  
**I want to** add tasks to my day  
**So that** I can track work alongside my meetings

**Acceptance Criteria:**
- [ ] Task form has: title (required), duration (minutes), priority (High/Medium/Low)
- [ ] Submitting form adds task to the task list
- [ ] Task persists after page refresh (localStorage)
- [ ] Empty title shows validation error

**Estimate:** S

---

### US-006 — Edit and Delete Tasks
**As a** user  
**I want to** edit or delete tasks I've added  
**So that** my task list stays accurate

**Acceptance Criteria:**
- [ ] Click task to open edit form (inline or modal)
- [ ] Changes save on confirm
- [ ] Delete button with confirmation removes task
- [ ] Deleted tasks removed from localStorage

**Estimate:** S

---

## Epic 4: Drag-and-Drop Scheduling

### US-007 — Schedule a Task by Dragging
**As a** user  
**I want to** drag a task onto a calendar time slot  
**So that** I can visually schedule when I'll work on it

**Acceptance Criteria:**
- [ ] Tasks draggable from task list panel
- [ ] Drop target: any 30-min slot in calendar timeline
- [ ] Dropped task appears as a block on the calendar
- [ ] Task's `scheduledAt` time updated in store
- [ ] Visual ghost shown while dragging

**Estimate:** L

---

### US-008 — Conflict Warning
**As a** user  
**I want to** be warned when I schedule a task over a meeting  
**So that** I don't accidentally double-book myself

**Acceptance Criteria:**
- [ ] Warning toast shown if task drop overlaps with calendar event
- [ ] Warning includes: "Conflicts with [meeting name] at [time]"
- [ ] User can dismiss warning and keep the overlap (their choice)

**Estimate:** M

---

## Epic 5: AI Day Optimization

### US-009 — Optimize My Day
**As a** busy user  
**I want** AI to suggest when to do my tasks  
**So that** I don't have to manually figure out what fits between meetings

**Acceptance Criteria:**
- [ ] "Optimize My Day" button in dashboard
- [ ] Button disabled if no tasks added
- [ ] Loading state shown while waiting for Claude response
- [ ] Suggestions shown as proposed time blocks on calendar
- [ ] Each suggestion includes a brief reason ("Before your 2pm meeting")
- [ ] Response within 8 seconds

**Estimate:** L

---

### US-010 — Accept or Dismiss AI Suggestions
**As a** user reviewing AI suggestions  
**I want to** accept or dismiss each suggestion individually  
**So that** I stay in control of my final schedule

**Acceptance Criteria:**
- [ ] Each suggestion has "Accept" and "Dismiss" buttons
- [ ] Accepting schedules the task (same as drag-and-drop)
- [ ] Dismissing removes the suggestion without scheduling
- [ ] "Accept All" button schedules all suggestions at once

**Estimate:** M

---

## Story Map Summary

| Epic | Stories | Total Estimate |
|---|---|---|
| Authentication | US-001, US-002 | M + S |
| Calendar Sync | US-003, US-004 | M + S |
| Task Management | US-005, US-006 | S + S |
| Drag-and-Drop | US-007, US-008 | L + M |
| AI Optimization | US-009, US-010 | L + M |
