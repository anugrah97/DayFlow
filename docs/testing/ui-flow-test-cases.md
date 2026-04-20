# DayFlow — UI & User Flow Test Cases

**Sprints covered:** Sprint 1 (Auth) · Sprint 2 (Calendar Display)
**Total test cases:** 58 (TC-UI-001 → TC-UI-058)
**Created:** 2026-04-19
**Author:** QA Agent

> These are manual / automated UI test specifications. Do **not** run them as-is; they are intended to drive Playwright, Cypress, or manual QA sessions.

---

## Legend

| Priority | Meaning |
|---|---|
| P1 | Blocking — must pass before any release |
| P2 | High — should pass; ship only with known workaround |
| P3 | Nice-to-have — track as tech debt |

---

## 1. Landing Page / Login (TC-UI-001 to TC-UI-010) — Sprint 1

---

### TC-UI-001: Login page renders "DayFlow" heading
**Category:** Layout
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** User is unauthenticated; app is running.

**Steps:**
1. Open a fresh browser tab and navigate to `http://localhost:3000/login`.
2. Wait for the page to reach an idle network state.
3. Inspect the DOM for an `<h1>` element.

**Expected Result:** An `<h1>` with exact text `DayFlow` is visible on screen with `text-4xl font-bold text-white` styling (white, bold, large).

**Failure Indicator:** `<h1>` is absent, has different text, or is hidden behind another element.

**Sprint:** Sprint 1

---

### TC-UI-002: Tagline text is present and correct
**Category:** Layout
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** User is unauthenticated; app is running.

**Steps:**
1. Navigate to `/login`.
2. Locate the `<p>` element immediately below the `<h1>`.

**Expected Result:** The paragraph contains the exact text `Your AI-powered day planner` rendered in blue (`text-blue-300`) with medium font weight.

**Failure Indicator:** Text is absent, mis-spelled, or styled as plain white/grey.

**Sprint:** Sprint 1

---

### TC-UI-003: All three feature highlights render inside the card
**Category:** Layout
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** User is unauthenticated; app is running.

**Steps:**
1. Navigate to `/login`.
2. Inside the frosted-glass card (`bg-white/5`), look for a vertical list of feature rows.
3. Verify each row contains an icon, a bold title, and a sub-description.

**Expected Result:** Exactly three feature rows are present:
- Row 1 — icon: Calendar, title: **Google Calendar Sync**, description: "Seamlessly connect and view all your events in one place"
- Row 2 — icon: CheckSquare, title: **Smart Task Planning**, description: "Drag-and-drop tasks onto your calendar with intelligent scheduling"
- Row 3 — icon: Sparkles, title: **AI Day Optimization**, description: "Let AI suggest the best time blocks to maximize your productivity"

Each icon container is `w-8 h-8 rounded-lg bg-blue-600/20` with a `text-blue-400` icon inside.

**Failure Indicator:** Fewer than three rows, missing icons, wrong title or description text.

**Sprint:** Sprint 1

---

### TC-UI-004: Google Sign-in button is visible and correctly styled
**Category:** Component
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** User is unauthenticated; app is running.

**Steps:**
1. Navigate to `/login`.
2. Locate the `<button type="submit">` element inside the `<form>`.
3. Verify it contains the Google "G" multicolour SVG logo (4 coloured `<path>` elements with fill `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`) plus the text `Sign in with Google`.
4. Confirm the button spans the full card width (`w-full`), has `bg-white` background, and `text-slate-800` text.

**Expected Result:** A white, full-width button with the Google logo and the label "Sign in with Google" is visible. The button has a `rounded-xl` shape and visible drop shadow.

**Failure Indicator:** Button is absent, Google SVG is missing or broken, text is different, button is not full-width, or background is not white.

**Sprint:** Sprint 1

---

### TC-UI-005: Google Sign-in button click triggers loading/navigation state
**Category:** State
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** User is unauthenticated; browser has no active Google session.

**Steps:**
1. Navigate to `/login`.
2. Click the "Sign in with Google" button.
3. Observe the browser immediately after the click (before the OAuth popup/redirect completes).

**Expected Result:** The form performs a POST action (Server Action) which redirects to Google OAuth. The button should scale slightly on `active` (`active:scale-[0.98]`). The browser navigates away from `/login` toward Google's auth endpoint.

**Failure Indicator:** Nothing happens on click; JS error is thrown; button stays completely static with no transition; page does not navigate.

**Sprint:** Sprint 1

---

### TC-UI-006: Login page is responsive at 375 px (mobile)
**Category:** Responsive
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** User is unauthenticated; viewport set to 375 × 812 px (iPhone 14 equivalent).

**Steps:**
1. Set browser viewport to 375 × 812 px.
2. Navigate to `/login`.
3. Verify no horizontal scrollbar appears.
4. Verify all text, card, button, and icons are fully visible.
5. Verify card does not overflow the viewport.

**Expected Result:** The card (`max-w-md`) fits within 375 px thanks to `px-4` padding. All feature rows are readable without horizontal scroll. The "Sign in with Google" button is fully visible and tappable.

**Failure Indicator:** Horizontal scroll bar appears; card clips outside viewport; text overlaps; button is partially hidden.

**Sprint:** Sprint 1

---

### TC-UI-007: Login page is responsive at 768 px (tablet)
**Category:** Responsive
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P2
**Precondition:** User is unauthenticated; viewport set to 768 × 1024 px.

**Steps:**
1. Set browser viewport to 768 × 1024 px.
2. Navigate to `/login`.
3. Confirm the card is horizontally centred.
4. Confirm all three feature highlights and the sign-in button are visible without scrolling.

**Expected Result:** Card is centred, no horizontal overflow, all content visible above the fold.

**Failure Indicator:** Card is misaligned, overflowing, or content is cut off.

**Sprint:** Sprint 1

---

### TC-UI-008: Login page is responsive at 1280 px (desktop)
**Category:** Responsive
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P2
**Precondition:** User is unauthenticated; viewport set to 1280 × 800 px.

**Steps:**
1. Set browser viewport to 1280 × 800 px.
2. Navigate to `/login`.
3. Confirm the card (`max-w-md` = 448 px) is centred against the gradient background.
4. Confirm background gradient (`from-slate-900 via-blue-950 to-slate-900`) is visible on either side of the card.

**Expected Result:** Card is centred, gradient fills the full viewport, no layout issues.

**Failure Indicator:** Card stretches to full width; gradient is absent; content is left-aligned.

**Sprint:** Sprint 1

---

### TC-UI-009: Login page copyright footer is present
**Category:** Layout
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P3
**Precondition:** User is unauthenticated; app is running.

**Steps:**
1. Navigate to `/login`.
2. Scroll to the bottom of the page (or check below the card).
3. Look for a `<p>` element with copyright text.

**Expected Result:** A footer paragraph reads `DayFlow © <current year>` (e.g. `DayFlow © 2026`). The year is dynamically rendered via `new Date().getFullYear()`. Styled `text-slate-600 text-xs`.

**Failure Indicator:** Footer is absent, year is hard-coded and wrong, or text is different.

**Sprint:** Sprint 1

---

### TC-UI-010: No Cumulative Layout Shift (CLS) on page load
**Category:** Animation
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P2
**Precondition:** User is unauthenticated; app is running; Chrome DevTools Lighthouse available.

**Steps:**
1. Open Chrome DevTools → Lighthouse → run a Performance audit on `/login`.
2. Note the CLS score.

**Expected Result:** CLS score is ≤ 0.1 (Google "Good" threshold). No elements visibly jump after the initial paint.

**Failure Indicator:** CLS > 0.1; elements noticeably shift during load (e.g., card jumps down after fonts load).

**Sprint:** Sprint 1

---

## 2. Authentication Flow (TC-UI-011 to TC-UI-018) — Sprint 1

---

### TC-UI-011: Unauthenticated visit to `/` redirects to `/login`
**Category:** Navigation
**Page/Component:** `/` route → `(dashboard)/layout.tsx`
**Priority:** P1
**Precondition:** No active session cookie; browser storage cleared.

**Steps:**
1. Clear all cookies and local storage.
2. Navigate to `http://localhost:3000/`.
3. Observe the final URL after any redirects.

**Expected Result:** Browser ends up at `/login`. The login page renders (DayFlow heading, sign-in button visible).

**Failure Indicator:** User lands on any dashboard page without authentication; HTTP 500 error; blank page.

**Sprint:** Sprint 1

---

### TC-UI-012: Unauthenticated visit to `/dashboard/calendar` redirects to `/login`
**Category:** Navigation
**Page/Component:** `/dashboard/calendar` → `(dashboard)/layout.tsx`
**Priority:** P1
**Precondition:** No active session cookie; browser storage cleared.

**Steps:**
1. Clear all cookies and local storage.
2. Navigate directly to `http://localhost:3000/dashboard/calendar`.
3. Observe the final URL.

**Expected Result:** Browser is redirected to `/login`. The `(dashboard)/layout.tsx` calls `redirect("/login")` when `session` is null.

**Failure Indicator:** Dashboard or calendar renders without an authenticated session; redirect loop; HTTP 500.

**Sprint:** Sprint 1

---

### TC-UI-013: Successful Google OAuth redirects to `/dashboard/calendar`
**Category:** Navigation
**Page/Component:** `/login` → Google OAuth → `/dashboard/calendar`
**Priority:** P1
**Precondition:** Valid Google account available; `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` set in `.env.local`.

**Steps:**
1. Navigate to `/login`.
2. Click "Sign in with Google".
3. Complete the Google OAuth consent flow with a valid account.
4. Observe the final URL after OAuth callback.

**Expected Result:** Browser lands on `/dashboard/calendar`. The page title shows "Today" (the `<h1>` rendered by `CalendarPage`). The DayView component begins loading events.

**Failure Indicator:** Redirect goes to a wrong URL; 404 or 500 after OAuth; user is sent back to `/login` after successful auth.

**Sprint:** Sprint 1

---

### TC-UI-014: Dashboard nav shows user avatar after authentication
**Category:** Component
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P1
**Precondition:** User is authenticated via Google OAuth.

**Steps:**
1. Sign in successfully.
2. On any `/dashboard/*` page, inspect the top navigation `<header>`.
3. Look for a `<img>` element (Next.js `<Image>`) with the user's Google profile photo.

**Expected Result:** A circular avatar image (`rounded-full ring-2 ring-slate-200`, 32×32 px) is visible in the top-right area of the nav, loaded from `session.user.image` (Google profile URL). If the image fails to load, a blue initial fallback (`bg-blue-600`, first letter of name) is shown instead.

**Failure Indicator:** No avatar or initial fallback visible; broken image icon shown; image is not circular.

**Sprint:** Sprint 1

---

### TC-UI-015: Dashboard nav shows user display name
**Category:** Component
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P1
**Precondition:** User is authenticated; viewport ≥ 640 px (sm breakpoint).

**Steps:**
1. Sign in successfully.
2. On any `/dashboard/*` page at a viewport width ≥ 640 px, inspect the nav.
3. Locate the `<span>` with the user's name.

**Expected Result:** The authenticated user's full name (from `session.user?.name`) is visible to the right of the avatar, styled `text-sm font-medium text-slate-700`. On mobile (< 640 px) the name is hidden (`hidden sm:block`) — this is the correct behaviour.

**Failure Indicator:** Name is absent on desktop; wrong name displayed; name shown on mobile (< 640 px) where it should be hidden.

**Sprint:** Sprint 1

---

### TC-UI-016: Dashboard nav shows "Sign out" button
**Category:** Component
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P1
**Precondition:** User is authenticated.

**Steps:**
1. Sign in successfully.
2. On any `/dashboard/*` page, inspect the top navigation.
3. Look for the "Sign out" button in the user area.

**Expected Result:** A `<button type="submit">` with text `Sign out` is visible. It is styled `text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg`.

**Failure Indicator:** Button is absent; button has different label; button is not interactable.

**Sprint:** Sprint 1

---

### TC-UI-017: Sign-out button click redirects to `/login`
**Category:** Navigation
**Page/Component:** `(dashboard)/layout.tsx` — Sign out form
**Priority:** P1
**Precondition:** User is authenticated and on any `/dashboard/*` page.

**Steps:**
1. Click the "Sign out" button in the nav.
2. Observe the URL after the server action completes.

**Expected Result:** `signOut({ redirectTo: "/login" })` is called. Browser navigates to `/login`. The login page renders fully (DayFlow heading, Google sign-in button).

**Failure Indicator:** User stays on dashboard; blank page after sign out; error thrown; redirect goes to wrong URL.

**Sprint:** Sprint 1

---

### TC-UI-018: Back button after sign-out stays on `/login` (no cached dashboard)
**Category:** Navigation
**Page/Component:** Browser history → `/login`
**Priority:** P1
**Precondition:** User has just completed the sign-out flow (TC-UI-017).

**Steps:**
1. After signing out and landing on `/login`, press the browser's Back button.
2. Observe what page renders.

**Expected Result:** Browser either stays on `/login` or navigates to a pre-login page that immediately redirects back to `/login`. The authenticated dashboard is NOT served from cache without a valid session. If it does navigate briefly to `/dashboard/calendar`, the `layout.tsx` server-side check (`if (!session) redirect("/login")`) triggers immediately.

**Failure Indicator:** A fully functional, authenticated dashboard renders without a valid session token; user can interact with protected data.

**Sprint:** Sprint 1

---

## 3. Dashboard Navigation (TC-UI-019 to TC-UI-024) — Sprint 1

---

### TC-UI-019: Top navigation header renders on all dashboard pages
**Category:** Layout
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P1
**Precondition:** User is authenticated.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Inspect the page for a `<header>` element at the top of the viewport.

**Expected Result:** A `<header>` element is present with `bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10`. It contains the DayFlow logo on the left and the user area (avatar, name, sign-out) on the right.

**Failure Indicator:** Header is absent; header does not span full width; header is not at the top of the viewport.

**Sprint:** Sprint 1

---

### TC-UI-020: "DayFlow" logo and wordmark are visible in the navigation
**Category:** Component
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P1
**Precondition:** User is authenticated.

**Steps:**
1. Navigate to any `/dashboard/*` page.
2. Inspect the left side of the top navigation header.

**Expected Result:** A blue rounded-square icon (`w-8 h-8 rounded-lg bg-blue-600`) containing a white Calendar icon (`w-4 h-4 text-white`) is visible, followed by the wordmark `DayFlow` in `text-xl font-bold text-slate-900`.

**Failure Indicator:** Logo icon is missing or unstyled; wordmark "DayFlow" text is absent; both appear on the wrong side of the nav.

**Sprint:** Sprint 1

---

### TC-UI-021: Navigation header is sticky and remains visible on scroll
**Category:** Layout
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P1
**Precondition:** User is authenticated; calendar page has enough content to require scrolling (or manually extend the page height).

**Steps:**
1. Navigate to `/dashboard/calendar`.
2. If the time grid is not tall enough to require scrolling, temporarily resize the viewport to force it.
3. Scroll down 300 px.
4. Observe whether the navigation header remains pinned at the top.

**Expected Result:** The `<header>` with `sticky top-0 z-10` remains visible and pinned to the top of the viewport throughout scrolling. It does not scroll off-screen.

**Failure Indicator:** The header scrolls away with the page content; header is `position: static` or `relative` rather than `sticky`.

**Sprint:** Sprint 1

---

### TC-UI-022: Main content area renders below the navigation header
**Category:** Layout
**Page/Component:** `(dashboard)/layout.tsx` — `<main>`
**Priority:** P1
**Precondition:** User is authenticated.

**Steps:**
1. Navigate to `/dashboard/calendar`.
2. Inspect the `<main>` element.
3. Confirm it is not overlapped by the sticky header.

**Expected Result:** The `<main>` element begins below the 64 px (`h-16`) header. The `flex-col` layout of the outer container ensures natural document flow (header then main). No content is hidden behind the sticky header.

**Failure Indicator:** Page content starts underneath the header and is partially hidden; `<main>` has a negative top margin causing overlap.

**Sprint:** Sprint 1

---

### TC-UI-023: Navigation is usable at mobile viewport (375 px)
**Category:** Responsive
**Page/Component:** `(dashboard)/layout.tsx` — `<header>`
**Priority:** P2
**Precondition:** User is authenticated; viewport set to 375 px wide.

**Steps:**
1. Set viewport to 375 × 812 px.
2. Navigate to `/dashboard/calendar`.
3. Inspect the top navigation bar.

**Expected Result:** The nav bar remains a single row. The DayFlow logo and icon are visible on the left. The avatar and "Sign out" button are visible on the right. The user's name (`hidden sm:block`) is correctly hidden. No elements overflow or wrap to a second row.

**Failure Indicator:** Nav wraps into two rows; elements overflow horizontally; "Sign out" button is hidden or cut off; name is still visible (should be hidden).

**Sprint:** Sprint 1

---

### TC-UI-024: User avatar falls back to initial when image is unavailable
**Category:** Component
**Page/Component:** `(dashboard)/layout.tsx` — `<header>` user area
**Priority:** P2
**Precondition:** User is authenticated but `session.user.image` is `null` or `undefined`.

**Steps:**
1. Simulate a session where `session.user.image` is falsy (e.g., mock the session in a test environment or temporarily set it to `null`).
2. Navigate to any `/dashboard/*` page.
3. Inspect the avatar area.

**Expected Result:** A blue circular fallback (`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold`) displays the first uppercase letter of the user's name (e.g., `A` for "Anugrah"). If name is also absent, it shows `U`.

**Failure Indicator:** Broken image icon is shown; nothing renders in the avatar area; a JS error is thrown.

**Sprint:** Sprint 1

---

## 4. Calendar Day View (TC-UI-025 to TC-UI-040) — Sprint 2

---

### TC-UI-025: TimeGrid renders from 7 AM to 10 PM
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `TimeGrid.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns at least one event (so the grid renders); `GRID_START_HOUR = 7`, `GRID_END_HOUR = 22`.

**Steps:**
1. Navigate to `/dashboard/calendar` with at least one event in today's data.
2. Inspect the time grid area.
3. Verify the grid total height = `(22 - 7) * 80 = 1200 px`.

**Expected Result:** The grid content area has a CSS `height` of `1200px`. The grid visually spans from 7:00 AM at the top to 10:00 PM at the bottom.

**Failure Indicator:** Grid height is wrong; grid starts before 7 AM or ends after/before 10 PM; `HOUR_HEIGHT` or hour constants are overridden.

**Sprint:** Sprint 2

---

### TC-UI-026: Hour labels are visible on the left column (7 AM through 10 PM)
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `TimeGrid.tsx`
**Priority:** P1
**Precondition:** User is authenticated; time grid is rendering.

**Steps:**
1. Navigate to `/dashboard/calendar` with events present.
2. Inspect the left-column label area (`w-16 pr-2`).
3. Verify hour labels for each full hour from 7 AM to 9 PM are visible (`showLabel: true` slots only).

**Expected Result:** 15 hour labels are visible: `7:00 AM`, `8:00 AM`, `9:00 AM`, `10:00 AM`, `11:00 AM`, `12:00 PM`, `1:00 PM`, `2:00 PM`, `3:00 PM`, `4:00 PM`, `5:00 PM`, `6:00 PM`, `7:00 PM`, `8:00 PM`, `9:00 PM`. Labels are `text-xs text-slate-400 font-medium` aligned to the right. Half-hour slots do not show labels.

**Failure Indicator:** Hour labels are missing; labels show wrong times (e.g. 24-hour format); half-hour labels appear where they should not; fewer than 15 labels.

**Sprint:** Sprint 2

---

### TC-UI-027: Half-hour divider lines are visible in the grid
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `TimeGrid.tsx`
**Priority:** P2
**Precondition:** User is authenticated; time grid is rendering.

**Steps:**
1. Navigate to `/dashboard/calendar` with events present.
2. Inspect the grid content area for horizontal divider lines.
3. Verify both full-hour lines and half-hour lines are present.

**Expected Result:**
- 15 solid hour lines (`border-t border-slate-200`) at positions `0, 80, 160, 240, … 1120 px` from the top.
- 15 lighter half-hour lines (`border-t border-slate-100`) at positions `40, 120, 200, … 1160 px` from the top.
Both sets of lines span the full width of the grid (`left-0 right-0`).

**Failure Indicator:** Hour or half-hour lines are absent; lines are the wrong colour or thickness; lines do not span full grid width.

**Sprint:** Sprint 2

---

### TC-UI-028: Events render inside the grid bounds (not outside)
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns events with start/end times within 7 AM–10 PM range.

**Steps:**
1. Navigate to `/dashboard/calendar` with events visible.
2. Inspect each event block (`absolute left-1 right-1`).
3. Verify `top` and `height` values place the event within `[0, 1200]` px of the grid container.

**Expected Result:** Every event block's `top` px is ≥ 0 and `top + height` is ≤ 1200 px. No event block overflows outside the `<div style={{ height: 1200px }}>` grid container.

**Failure Indicator:** An event block renders with a negative `top` value or extends beyond 1200 px; event visually escapes the grid.

**Sprint:** Sprint 2

---

### TC-UI-029: Event block displays the event title
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns events with a non-empty `title` field.

**Steps:**
1. Navigate to `/dashboard/calendar`.
2. Identify any rendered event block.
3. Inspect the `<p className="font-medium leading-tight truncate">` inside the block.

**Expected Result:** The event's title text is visible inside the block. For tall events (`heightPx ≥ 40`), the font is `text-sm`; for short events (`heightPx < 40`), the font is `text-xs`. The title truncates with ellipsis if it overflows.

**Failure Indicator:** Title is absent; title text does not match the event data; title is not truncated and overflows the block.

**Sprint:** Sprint 2

---

### TC-UI-030: Event block displays the formatted time range
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns an event with `start` and `end` ISO strings; event height ≥ 40 px (not a short event).

**Steps:**
1. Navigate to `/dashboard/calendar` with a normal-length event (≥ 30 min).
2. Inspect the second `<p>` element inside the event block (`.text-xs.opacity-75`).

**Expected Result:** A time range string is visible in the format `H AM – H PM` or `H:MM AM – H:MM PM` using `–` (en-dash), e.g. `2 PM – 3 PM` or `9:30 AM – 10:00 AM`. Hours with zero minutes are shown without `:00` (e.g. `2 PM` not `2:00 PM`).

**Failure Indicator:** Time range is absent; format uses `-` instead of `–`; 24-hour format displayed; time range is present for short events (< 40 px height) where it should be hidden.

**Sprint:** Sprint 2

---

### TC-UI-031: Event block displays attendee count when attendees exist
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P2
**Precondition:** User is authenticated; API returns an event with `attendeeCount > 0`; event height ≥ 40 px.

**Steps:**
1. Navigate to `/dashboard/calendar` with an event that has `attendeeCount > 0`.
2. Inspect the third `<p>` element inside the event block (`.text-xs.opacity-60`).

**Expected Result:** Text reads `N attendee` (singular) for `attendeeCount === 1` or `N attendees` (plural) for `attendeeCount > 1`. E.g., `3 attendees` or `1 attendee`. The attendee count line is absent when `attendeeCount === 0`.

**Failure Indicator:** Attendee count shown for 0-attendee events; plural/singular is wrong; count does not match event data; shown for short events (< 40 px).

**Sprint:** Sprint 2

---

### TC-UI-032: Short events (< 30 min) render without overflow or crash
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns an event with a duration < 30 minutes (e.g. a 15-minute meeting).

**Steps:**
1. Navigate to `/dashboard/calendar` with a short event (< 30 min, so `heightPx < 40`).
2. Inspect the rendered event block.
3. Verify the block has a minimum height of 24 px (`Math.max(..., 24)`).
4. Verify only the title is shown (no time range or attendee line).

**Expected Result:** The block renders with at least 24 px height. Only the title `<p>` is visible (in `text-xs`). No time range or attendee count line is rendered. No visual overflow or JS error occurs.

**Failure Indicator:** Block renders with 0 px or negative height; JS error thrown; time range or attendee count appears for a short event; title overflows the block.

**Sprint:** Sprint 2

---

### TC-UI-033: Long events (> 2 hours) render with correct proportional height
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns an event ≥ 2 hours long (e.g. a 3-hour meeting).

**Steps:**
1. Navigate to `/dashboard/calendar` with a long event (e.g. 9 AM – 12 PM = 3 hours).
2. Inspect the event block's computed `height` style.

**Expected Result:** A 3-hour event has `height = (3 / 1) * 80 = 240px`. A 2-hour event has `height = 160px`. The formula is `(durationMinutes / 60) * HOUR_HEIGHT`. The block correctly spans 3 grid hours visually.

**Failure Indicator:** Block height does not match the formula; block is too short or too tall; block extends outside the grid.

**Sprint:** Sprint 2

---

### TC-UI-034: All-day events are handled gracefully (no crash or layout breakage)
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`, `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; Google Calendar returns an event with a `date` field instead of `dateTime` (all-day event format).

**Steps:**
1. Configure the API mock or use a real Google Calendar with an all-day event today.
2. Navigate to `/dashboard/calendar`.
3. Observe the page rendering.

**Expected Result:** The app does not crash. The all-day event either renders gracefully in the grid at a sensible default position, or is filtered out before reaching `EventBlock`. No uncaught JS exceptions appear in the browser console.

**Failure Indicator:** App throws an unhandled error or blank page renders; `new Date(undefined)` results in `NaN` positions causing the grid layout to break; console shows uncaught exceptions.

**Sprint:** Sprint 2

---

### TC-UI-035: Overlapping events do not completely obscure each other
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P2
**Precondition:** User is authenticated; API returns two or more events with overlapping time ranges.

**Steps:**
1. Navigate to `/dashboard/calendar` with two overlapping events (e.g. Event A: 10–11 AM, Event B: 10:30–11:30 AM).
2. Inspect the rendered event blocks.

**Expected Result:** Both event blocks are visible. Since blocks use `left-1 right-1` with no column-split logic currently, they will overlap, but both should be visible (not one hidden under the other at full opacity). At minimum, both titles should be partially readable. No z-index conflict causes one block to be completely invisible.

**Failure Indicator:** One event block is completely hidden; a JS error occurs; the grid layout breaks.

**Sprint:** Sprint 2

---

### TC-UI-036: "No events today" empty state renders when event list is empty
**Category:** State
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns `{ events: [], syncedAt: "..." }`.

**Steps:**
1. Configure the API to return an empty events array (or use a real Google Calendar with no events today).
2. Navigate to `/dashboard/calendar`.
3. Wait for loading to complete.

**Expected Result:** A centred empty state is visible with:
- A circular calendar icon placeholder (`w-12 h-12 rounded-full bg-slate-100`).
- Text `No events today` in `text-slate-500 font-medium`.
- Sub-text `Enjoy the free time!` in `text-slate-400 text-sm`.
The TimeGrid is NOT rendered.

**Failure Indicator:** Empty state does not appear; TimeGrid renders with no events; different text is shown; JS error occurs.

**Sprint:** Sprint 2

---

### TC-UI-037: Loading skeleton renders during the initial fetch
**Category:** State
**Page/Component:** `/dashboard/calendar` → `DayView.tsx` → `LoadingSkeleton`
**Priority:** P1
**Precondition:** User is authenticated; network is slow enough to observe the loading state (throttle to "Slow 3G" in DevTools, or intercept the API).

**Steps:**
1. In Chrome DevTools → Network, set throttling to "Slow 3G".
2. Navigate to `/dashboard/calendar` (hard reload).
3. Observe the page while the `/api/calendar/events` request is pending.

**Expected Result:** The `LoadingSkeleton` component renders (`animate-pulse`):
- 8 grey shimmer bars in the time-label column (`h-3 bg-slate-200 rounded w-12`).
- 3 grey shimmer event placeholders in the grid area (`h-14 bg-slate-100 rounded-md`).
Once data loads, the skeleton is replaced by the real grid or empty state.

**Failure Indicator:** Blank white space shows instead of skeleton; skeleton persists after data loads; skeleton does not animate.

**Sprint:** Sprint 2

---

### TC-UI-038: Error state renders with an error message when the API fails
**Category:** State
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P1
**Precondition:** User is authenticated; `/api/calendar/events` returns a non-2xx response (e.g. 500 or 401).

**Steps:**
1. Simulate a network error or API failure (mock the API to return 500 with `{ error: "Internal server error" }`).
2. Navigate to `/dashboard/calendar`.
3. Wait for the request to fail.

**Expected Result:** An error banner renders with:
- `border border-red-200 bg-red-50` styling.
- Bold prefix `Could not load events:` followed by the error message from the API response (or "Failed to fetch events" as fallback).
The TimeGrid and empty state are NOT rendered. The page does not crash.

**Failure Indicator:** Error banner is absent; app crashes with an unhandled exception; generic "Something went wrong" text replaces the specific message; error message from API body is ignored.

**Sprint:** Sprint 2

---

### TC-UI-039: "Last synced" timestamp is visible after data loads
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P2
**Precondition:** User is authenticated; API returns a valid `syncedAt` ISO timestamp.

**Steps:**
1. Navigate to `/dashboard/calendar`.
2. Wait for events to load.
3. Inspect the header bar above the time grid.

**Expected Result:** A `<span className="text-xs text-slate-400">` reads `Last synced: just now` (if synced < 10 s ago) or `Last synced: Xs ago` / `Last synced: N minutes ago` / `Last synced: N hours ago` depending on elapsed time. While loading, `Syncing…` is shown instead.

**Failure Indicator:** Timestamp is absent after data loads; "Syncing…" persists after successful load; timestamp shows raw ISO string or `Invalid Date`.

**Sprint:** Sprint 2

---

### TC-UI-040: "Refresh" button is visible and clickable
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P1
**Precondition:** User is authenticated; data has loaded.

**Steps:**
1. Navigate to `/dashboard/calendar`.
2. Wait for data to load.
3. Locate the `<button aria-label="Refresh calendar">` in the header bar.
4. Click it and observe the loading state.

**Expected Result:** A "Refresh" button with a `RefreshCw` icon is visible in the top-right of the DayView header. On click, it triggers `mutate()` (re-fetches events). While the refetch is in progress, the button shows `disabled:opacity-40` (dimmed) and the icon animates with `animate-spin`. After the fetch completes, the button returns to its normal state.

**Failure Indicator:** Button is absent; clicking does nothing; spinner does not animate during refetch; button remains permanently disabled.

**Sprint:** Sprint 2

---

## 5. Responsive & Accessibility (TC-UI-041 to TC-UI-050)

---

### TC-UI-041: Calendar page is scrollable on mobile
**Category:** Responsive
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P1
**Precondition:** User is authenticated; events are loaded; viewport set to 375 × 812 px.

**Steps:**
1. Set viewport to 375 × 812 px.
2. Navigate to `/dashboard/calendar`.
3. Attempt to scroll down through the time grid.

**Expected Result:** The time grid container has `overflow-y-auto max-h-[calc(100vh-220px)]`, enabling vertical scrolling. The full 7 AM–10 PM range (1200 px) is accessible by scrolling. No content is clipped without the ability to reach it.

**Failure Indicator:** Scrolling is disabled; the grid is clipped and the bottom hours (e.g. 8–10 PM) are inaccessible; `overflow: hidden` prevents scrolling.

**Sprint:** Sprint 2

---

### TC-UI-042: EventBlock text meets WCAG AA contrast ratio (4.5:1)
**Category:** Accessibility
**Page/Component:** `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; events render with coloured blocks.

**Steps:**
1. Using a browser extension (e.g. axe DevTools, Colour Contrast Analyser), measure the contrast ratio between the event title text colour and its background colour for each colour palette entry.
2. Test all 8 palette entries (blue, violet, emerald, amber, rose, cyan, pink, indigo).

**Expected Result:** Each `text-*-900` foreground colour against its `bg-*-100` background meets or exceeds the WCAG AA minimum of **4.5:1** for normal text and **3:1** for large text. All 8 palette combinations pass.

**Failure Indicator:** Any palette entry has a contrast ratio below 4.5:1 for its `text-sm` or `text-xs` title text.

**Sprint:** Sprint 2

---

### TC-UI-043: All interactive elements have visible focus states
**Category:** Accessibility
**Page/Component:** `/login`, `(dashboard)/layout.tsx`, `DayView.tsx`
**Priority:** P1
**Precondition:** App is running; no custom CSS that removes focus outlines globally.

**Steps:**
1. On the `/login` page, press `Tab` to reach the "Sign in with Google" button.
2. Verify a focus ring is visible (`focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`).
3. On `/dashboard/calendar`, press `Tab` to reach the "Refresh" and "Sign out" buttons.
4. Verify each shows a visible focus indicator.

**Expected Result:** Every focusable element displays a clearly visible focus ring when tabbed to. No element has `outline: none` without a replacement focus indicator.

**Failure Indicator:** Any interactive element shows no visible focus indicator when focused via keyboard; focus ring colour is invisible against the background.

**Sprint:** Sprint 1 / Sprint 2

---

### TC-UI-044: Sign-in button has an accessible label
**Category:** Accessibility
**Page/Component:** `/login` → `(auth)/login/page.tsx`
**Priority:** P1
**Precondition:** App is running on `/login`.

**Steps:**
1. Run an automated accessibility audit (e.g. axe, Lighthouse Accessibility) on `/login`.
2. Inspect the "Sign in with Google" button with a screen reader (VoiceOver or NVDA).

**Expected Result:** The button's accessible name is `Sign in with Google` (derived from its visible text content). The Google SVG logo inside has no interfering `aria-label` or `role`. Screen reader announces "Sign in with Google, button".

**Failure Indicator:** Screen reader announces an empty or meaningless string; button fails an automated "button-name" accessibility rule; icon SVG pollutes the accessible name.

**Sprint:** Sprint 1

---

### TC-UI-045: User avatar image has descriptive alt text
**Category:** Accessibility
**Page/Component:** `(dashboard)/layout.tsx`
**Priority:** P1
**Precondition:** User is authenticated with a valid profile image URL.

**Steps:**
1. Navigate to any `/dashboard/*` page.
2. Inspect the `<Image>` component rendered for the user avatar.
3. Check the `alt` attribute value.

**Expected Result:** The `alt` attribute is set to `session.user.name ?? "User avatar"` — a non-empty string describing the image (the user's actual name, e.g. "Anugrah Pandya"). This is not an empty string or a generic filename.

**Failure Indicator:** `alt=""` (empty); `alt` attribute is absent; `alt` is a URL or filename; automated audit flags a missing alt text violation.

**Sprint:** Sprint 1

---

### TC-UI-046: Document title (`<title>`) changes per route
**Category:** Navigation
**Page/Component:** `/login`, `/dashboard/calendar`
**Priority:** P2
**Precondition:** App is running with Next.js metadata configured.

**Steps:**
1. Navigate to `/login`; note the browser tab title (`document.title`).
2. Sign in and navigate to `/dashboard/calendar`; note the browser tab title.

**Expected Result:** Each route has a distinct, meaningful `<title>` (e.g. `Login | DayFlow` vs. `Calendar | DayFlow` or similar). Titles are not left as the Next.js default `Create Next App`.

**Failure Indicator:** All pages share the same title; title is the default placeholder; title does not update on client-side navigation.

**Sprint:** Sprint 1 / Sprint 2

---

### TC-UI-047: No horizontal scroll on mobile
**Category:** Responsive
**Page/Component:** `/login`, `/dashboard/calendar`
**Priority:** P1
**Precondition:** Viewport set to 375 px wide; user is authenticated.

**Steps:**
1. Set viewport to 375 × 812 px.
2. Navigate to `/login`; check for horizontal scrollbar.
3. Sign in and navigate to `/dashboard/calendar`; check for horizontal scrollbar.

**Expected Result:** No horizontal scrollbar appears on either page at 375 px. All content is contained within the viewport width.

**Failure Indicator:** A horizontal scrollbar appears; content overflows the viewport horizontally; the page can be scrolled sideways.

**Sprint:** Sprint 1 / Sprint 2

---

### TC-UI-048: Font size minimum 12 px on all visible text
**Category:** Accessibility
**Page/Component:** All pages
**Priority:** P2
**Precondition:** App is running.

**Steps:**
1. Using browser DevTools, inspect the computed `font-size` of the smallest text elements across both `/login` and `/dashboard/calendar`.
2. Check: feature highlight descriptions (`text-sm`), time labels (`text-xs`), last-synced text (`text-xs`), copyright footer (`text-xs`).

**Expected Result:** All `text-xs` elements compute to ≥ 12 px (Tailwind default: `text-xs = 0.75rem = 12px`). No text is smaller than 12 px on any page.

**Failure Indicator:** Any text element computes to < 12 px; custom CSS overrides Tailwind defaults to smaller sizes.

**Sprint:** Sprint 1 / Sprint 2

---

### TC-UI-049: Touch targets are minimum 44 × 44 px on mobile
**Category:** Accessibility
**Page/Component:** `/login` (sign-in button), `(dashboard)/layout.tsx` (sign-out), `DayView.tsx` (refresh)
**Priority:** P1
**Precondition:** Viewport set to 375 × 812 px.

**Steps:**
1. Set viewport to 375 × 812 px.
2. Using DevTools, measure the rendered height of the "Sign in with Google" button (`py-3 = 12px top + 12px bottom + line-height ≈ 48px` total).
3. Measure the "Sign out" button tap target (`py-1.5`).
4. Measure the "Refresh" button tap target.

**Expected Result:** The "Sign in with Google" button height is ≥ 44 px (Apple/WCAG 2.5.5 AAA guideline). If "Sign out" or "Refresh" buttons are below 44 px, they should be noted as a P3 issue to address in a future sprint.

**Failure Indicator:** The primary "Sign in with Google" button is < 44 px tall on mobile; a user cannot reliably tap it without mis-tapping.

**Sprint:** Sprint 1

---

### TC-UI-050: Landmark regions are present for screen readers
**Category:** Accessibility
**Page/Component:** `(dashboard)/layout.tsx`
**Priority:** P1
**Precondition:** User is authenticated; on any dashboard page.

**Steps:**
1. Run an axe or Lighthouse accessibility audit on `/dashboard/calendar`.
2. Inspect the HTML structure for ARIA landmark elements.
3. Verify a `<header>`, `<main>`, and no missing landmark roles.

**Expected Result:** The page contains:
- A `<header>` element (the sticky nav bar) — implicit `role="banner"`.
- A `<main>` element for the page body content — implicit `role="main"`.
Screen readers can navigate between landmarks. No duplicate `<main>` elements. No automated "landmark" rule failures reported by axe.

**Failure Indicator:** No `<main>` element present; no `<header>` element; multiple `<main>` elements; axe reports "landmark" violations.

**Sprint:** Sprint 1

---

## 6. Edge Cases & Error States (TC-UI-051 to TC-UI-058)

---

### TC-UI-051: Calendar with 10+ events renders without performance degradation
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P2
**Precondition:** User is authenticated; API mock returns 10 or more events spread across the day.

**Steps:**
1. Configure the API to return 10 events with various start/end times across 7 AM–10 PM.
2. Navigate to `/dashboard/calendar`.
3. Measure: time to interactive, frame rate during scroll (should be ≥ 30 fps), and JS execution time.

**Expected Result:** The page renders all 10+ events within 2 seconds of data load. Scrolling through the time grid is smooth (no jank). No events are dropped or skipped in the render. No memory warnings appear in DevTools.

**Failure Indicator:** Page freezes or becomes unresponsive; render time exceeds 5 seconds; events are missing from the DOM; browser tab crashes.

**Sprint:** Sprint 2

---

### TC-UI-052: Event with a very long title truncates cleanly
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P2
**Precondition:** User is authenticated; API returns an event with a title longer than ~50 characters (e.g. "Quarterly Business Review with all stakeholders from APAC and EMEA regions").

**Steps:**
1. Navigate to `/dashboard/calendar` with a long-title event.
2. Inspect the event block's title `<p>` element.

**Expected Result:** The title truncates with a CSS ellipsis (`truncate` = `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`). The title text does not overflow the event block horizontally or wrap onto a second line. The full title is accessible via the `title` tooltip attribute on the parent `<div>`.

**Failure Indicator:** Long title overflows the block boundary; text wraps and pushes block height beyond the intended value; no ellipsis is applied; `title` attribute on the div is absent.

**Sprint:** Sprint 2

---

### TC-UI-053: Event starting exactly at 7 AM renders at the top of the grid
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns an event with `start` at `07:00:00` local time.

**Steps:**
1. Navigate to `/dashboard/calendar` with a 7:00 AM event.
2. Inspect the event block's computed `top` style value.

**Expected Result:** `startMinutes = (7 - 7) * 60 + 0 = 0`. `topPx = (0 / 60) * 80 = 0`. The block's `top` is `0px`, placing it at the very top of the grid container, flush with the 7 AM line.

**Failure Indicator:** Event block has a non-zero `top` (e.g. rendered above the grid at a negative value, or below the 7 AM line); event appears mispositioned.

**Sprint:** Sprint 2

---

### TC-UI-054: Event ending exactly at 10 PM renders at the bottom of the grid
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns an event ending at `22:00:00` local time (10 PM).

**Steps:**
1. Navigate to `/dashboard/calendar` with an event that ends at 10:00 PM (e.g. 9:00–10:00 PM).
2. Inspect the event block's computed `top` and `height` values.

**Expected Result:** A 9 PM–10 PM event: `topPx = ((21 - 7) * 60 / 60) * 80 = 14 * 80 = 1120px`. `heightPx = (60 / 60) * 80 = 80px`. `top + height = 1200px`, which is exactly the grid's total height. The block's bottom edge aligns with the grid's bottom edge.

**Failure Indicator:** The block extends beyond the 1200 px grid height; block is clipped; `top + height ≠ 1200`.

**Sprint:** Sprint 2

---

### TC-UI-055: Event spanning midnight (end < start) is handled without crash
**Category:** Component
**Page/Component:** `/dashboard/calendar` → `EventBlock.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns an event where `end` timestamp is earlier than `start` (e.g. due to a midnight-spanning event or malformed data).

**Steps:**
1. Configure the API mock to return an event with `start: "2026-04-19T23:00:00"` and `end: "2026-04-20T01:00:00"` (spans midnight).
2. Navigate to `/dashboard/calendar`.
3. Observe console and rendered output.

**Expected Result:** The app does not throw an uncaught JS exception. `durationMinutes` will be negative (`-120`). `Math.max((-120/60)*80, 24) = 24`, so the event renders with the minimum 24 px height. Ideally, midnight-spanning events should be filtered or clipped by the API, but a minimum the frontend must not crash.

**Failure Indicator:** Unhandled JS exception; page crashes; event renders with negative height; grid layout is broken.

**Sprint:** Sprint 2

---

### TC-UI-056: Empty events array from Google Calendar → empty state, no JS error
**Category:** State
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P1
**Precondition:** User is authenticated; API returns `{ events: [], syncedAt: "2026-04-19T12:00:00.000Z" }`.

**Steps:**
1. Mock the `/api/calendar/events` endpoint to return `{ events: [], syncedAt: "<current ISO>" }`.
2. Navigate to `/dashboard/calendar`.
3. Open browser DevTools console and observe for errors.

**Expected Result:** The "No events today" empty state renders correctly. `DayView` does not attempt to render `<TimeGrid>` or `<EventBlock>` when `data.events.length === 0`. Zero JS errors or warnings appear in the console. "Last synced: just now" (or similar) is shown in the header.

**Failure Indicator:** JS error logged (e.g. `.map is not a function`); the TimeGrid renders with zero children causing an empty grid; empty state does not render.

**Sprint:** Sprint 2

---

### TC-UI-057: Network failure → error banner shown, app doesn't crash
**Category:** State
**Page/Component:** `/dashboard/calendar` → `DayView.tsx`
**Priority:** P1
**Precondition:** User is authenticated; network request to `/api/calendar/events` fails (simulate via DevTools "Offline" mode or mock a network error).

**Steps:**
1. After navigating to `/dashboard/calendar`, enable "Offline" mode in Chrome DevTools Network tab.
2. Click the "Refresh" button to trigger a refetch.
3. Observe the rendered state.

**Expected Result:** The SWR `error` state is set. The error banner renders: `border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700` with text `Could not load events: Failed to fetch` (or the actual network error message). The rest of the page (nav, header bar) remains functional. No white screen of death.

**Failure Indicator:** App renders a blank white screen; an unhandled React error boundary is triggered; the error banner does not appear; previously loaded data is lost without showing an error.

**Sprint:** Sprint 2

---

### TC-UI-058: Token refresh failure (`session.error = "RefreshAccessTokenError"`) → re-auth prompt
**Category:** State
**Page/Component:** `/dashboard/calendar` → `(dashboard)/layout.tsx` / API layer
**Priority:** P1
**Precondition:** User has an expired/revoked Google refresh token; `session.error` equals `"RefreshAccessTokenError"` as set by the NextAuth.js JWT callback.

**Steps:**
1. Simulate an expired refresh token by revoking the app's Google OAuth access at `myaccount.google.com/permissions`.
2. Without signing out, attempt to navigate to `/dashboard/calendar` or wait for the automatic 15-minute SWR refetch.
3. Observe what the user sees.

**Expected Result:** The API route (`/api/calendar/events`) detects the `session.error` and returns a 401 response. The `DayView` error banner displays a message indicating the user needs to re-authenticate (e.g. `Could not load events: Please sign in again`). Ideally, the layout or middleware redirects the user back to `/login` with a re-auth message. The user is never left with a broken dashboard and no explanation.

**Failure Indicator:** User sees a generic error message with no guidance; user is stuck on the dashboard with no way to re-authenticate; the app silently shows stale/empty data without indicating a session problem; a 500 error page is shown instead of the expected re-auth prompt.

**Sprint:** Sprint 1 / Sprint 2

---

## Appendix A — Test Data Requirements

| Data Set | Description | Used In |
|---|---|---|
| `events-empty.json` | `{ "events": [], "syncedAt": "<ISO>" }` | TC-UI-036, TC-UI-056 |
| `events-single-short.json` | 1 event, 15 min duration | TC-UI-032 |
| `events-single-long.json` | 1 event, 3-hour duration | TC-UI-033 |
| `events-10plus.json` | 10+ events spread across 7 AM–10 PM | TC-UI-051 |
| `events-long-title.json` | 1 event with 80-char title | TC-UI-052 |
| `events-7am-start.json` | 1 event starting exactly 07:00 | TC-UI-053 |
| `events-10pm-end.json` | 1 event ending exactly 22:00 | TC-UI-054 |
| `events-midnight-span.json` | 1 event where end < start (midnight span) | TC-UI-055 |
| `events-overlapping.json` | 2 events with overlapping time ranges | TC-UI-035 |
| `events-with-attendees.json` | 1 event with `attendeeCount: 3` | TC-UI-031 |
| `events-allday.json` | 1 all-day event (date only, no dateTime) | TC-UI-034 |

---

## Appendix B — Component Constants Reference

Taken directly from `TimeGrid.tsx` and `EventBlock.tsx`:

```
GRID_START_HOUR = 7       // 7 AM
GRID_END_HOUR   = 22      // 10 PM (exclusive)
HOUR_HEIGHT     = 80      // px per hour
TOTAL_HOURS     = 15      // 7 AM to 10 PM
TOTAL_HEIGHT    = 1200    // px (15 * 80)
MIN_EVENT_HEIGHT = 24     // px (Math.max guard)
SHORT_EVENT_THRESHOLD = 40 // px — below this, only title shown (no time/attendees)
```

EventBlock positioning formula:
```
topPx    = ((startHour - 7) * 60 + startMin) / 60 * 80
heightPx = Math.max((durationMinutes / 60) * 80, 24)
```

Color palette cycles by event `index` (mod 8) when no `colorId` is present.

---

## Sprint 3 — Task Panel & Drag-and-Drop UI Tests

> **Sprint Coverage:** Sprint 3 — Task Management, Drag-and-Drop Scheduling, Conflict Toast
> **Test Cases:** TC-UI-059 – TC-UI-075
> **Sprint:** Sprint 3

---

### TC-UI-059: Task panel renders on left of calendar layout

**Category:** Layout
**Page/Component:** `/dashboard/calendar`
**Priority:** P1
**Precondition:** User is authenticated.

**Steps:**
1. Navigate to `/dashboard/calendar`.

**Expected Result:** TaskPanel renders as a sidebar (~320px width) on the left side of the page. The TimeGrid/DayView occupies the remaining width on the right. Layout is flex row. No overflow or overlap between panel and calendar.

**Sprint:** Sprint 3

---

### TC-UI-060: AddTaskForm shows correct fields and defaults

**Category:** Component
**Page/Component:** `AddTaskForm.tsx`
**Priority:** P1
**Precondition:** User navigates to `/dashboard/calendar` and opens the AddTaskForm.

**Steps:**
1. Click "+ Add Task" to expand the form.
2. Inspect the form fields.

**Expected Result:** Form contains: (1) Title text input, (2) Duration select with options: 15, 30, 45, 60, 90, 120, 180 min, (3) Priority select with options: High, Medium, Low. Default duration is 30 min. Default priority is Medium. Submit button labeled "Add Task".

**Sprint:** Sprint 3

---

### TC-UI-061: Task item shows priority border color

**Category:** Component
**Page/Component:** `TaskItem.tsx`
**Priority:** P2
**Precondition:** Tasks exist with all three priority levels.

**Steps:**
1. Observe tasks in the panel with High, Medium, Low priorities.

**Expected Result:**
- High priority: Red left border (e.g., `border-l-4 border-red-500`)
- Medium priority: Yellow left border (`border-yellow-500`)
- Low priority: Green left border (`border-green-500`)

**Sprint:** Sprint 3

---

### TC-UI-062: Task item shows edit and delete icons

**Category:** Component
**Page/Component:** `TaskItem.tsx`
**Priority:** P2
**Precondition:** At least one task exists in the panel.

**Steps:**
1. Hover over a task item in the task panel.
2. Observe action icons.

**Expected Result:** Edit (pencil) and delete (trash) icons are visible on the task card. Icons are accessible via keyboard tab focus.

**Sprint:** Sprint 3

---

### TC-UI-063: Edit mode — inline form appears on pencil click

**Category:** Interaction
**Page/Component:** `TaskItem.tsx`
**Priority:** P2
**Precondition:** Task "Write sprint report" exists.

**Steps:**
1. Click the pencil icon on the task.
2. Observe the task item.

**Expected Result:** Task card transitions to edit mode showing pre-populated input fields (title, duration, priority). A Save button and a Cancel button are present.

**Sprint:** Sprint 3

---

### TC-UI-064: Task panel shows empty state when no tasks exist

**Category:** State
**Page/Component:** `TaskPanel.tsx`
**Priority:** P1
**Precondition:** The `dayflow-planner` localStorage key is cleared or no tasks have been added.

**Steps:**
1. Clear localStorage or use a fresh browser profile.
2. Navigate to `/dashboard/calendar`.

**Expected Result:** Task panel shows an empty state message (e.g., "No tasks yet — add one below") and the "+ Add Task" form is accessible.

**Sprint:** Sprint 3

---

### TC-UI-065: Dragging task shows ghost/overlay preview

**Category:** Interaction
**Page/Component:** `TaskItem.tsx` + `DndContext`
**Priority:** P2
**Precondition:** At least one task exists in the panel.

**Steps:**
1. Initiate a drag on a task card (hold mouse down and move).
2. Observe the original card and the dragged preview.

**Expected Result:** A drag overlay/ghost preview of the task card follows the cursor. The original task card in the panel may show a placeholder or reduced opacity state.

**Sprint:** Sprint 3

---

### TC-UI-066: Droppable slots show visual indicator on hover during drag

**Category:** Interaction
**Page/Component:** `DroppableSlot.tsx`
**Priority:** P2
**Precondition:** User is actively dragging a task over the calendar.

**Steps:**
1. Drag a task over calendar time slots.
2. Observe visual feedback on slots as the drag passes over them.

**Expected Result:** The hovered droppable slot shows a visual highlight (e.g., background color change, dashed border) indicating it is a valid drop target.

**Sprint:** Sprint 3

---

### TC-UI-067: ScheduledTaskBlock appearance matches design

**Category:** Component
**Page/Component:** `ScheduledTaskBlock.tsx`
**Priority:** P2
**Precondition:** A task has been dropped onto a calendar slot.

**Steps:**
1. Observe the rendered `ScheduledTaskBlock` on the calendar.

**Expected Result:** Block has: dashed violet/purple border, task title visible, duration shown, × button in top-right corner. Style is visually distinct from Google Calendar `EventBlock` (which has solid colored background).

**Sprint:** Sprint 3

---

### TC-UI-068: Conflict toast visual appearance

**Category:** Component
**Page/Component:** `ConflictToast` in `calendar/page.tsx`
**Priority:** P2
**Precondition:** Task has been dropped on a slot occupied by a Google Calendar event.

**Steps:**
1. Drop a task on an occupied slot.
2. Observe the conflict toast.

**Expected Result:** Toast appears as a floating notification (fixed position, top or bottom of screen). Contains warning icon, conflict message naming the conflicting event, and a dismiss (×) button. Toast has a distinct warning/amber color scheme.

**Sprint:** Sprint 3

---

### TC-UI-069: Task moved to "Scheduled" visual section after drop

**Category:** Layout
**Page/Component:** `TaskPanel.tsx`
**Priority:** P1
**Precondition:** Task "Write sprint report" is unscheduled.

**Steps:**
1. Drop "Write sprint report" onto any calendar slot.
2. Observe the task panel.

**Expected Result:** "Write sprint report" moves from the "Unscheduled" section to a "Scheduled" section (or is visually distinguished as scheduled) in the task panel. The task is still visible in the panel for reference but clearly marked as scheduled.

**Sprint:** Sprint 3

---

### TC-UI-070: Task panel scrolls independently of calendar

**Category:** Layout / Scroll
**Page/Component:** `/dashboard/calendar`
**Priority:** P2
**Precondition:** More than 8 tasks exist so the panel overflows.

**Steps:**
1. Add 10+ tasks to the panel.
2. Scroll within the task panel.
3. Observe the calendar area.

**Expected Result:** Task panel scrolls independently. Calendar timeline does not scroll when scrolling the task panel. Both scroll areas are independent.

**Sprint:** Sprint 3

---

### TC-UI-071: Add Task form collapses/expands on toggle

**Category:** Interaction
**Page/Component:** `TaskPanel.tsx` / `AddTaskForm.tsx`
**Priority:** P2
**Precondition:** Form is collapsed.

**Steps:**
1. Click "+ Add Task" to expand the form.
2. Click the toggle/close button to collapse.

**Expected Result:** Form animates open and closed. When collapsed, only the "+ Add Task" trigger button is visible. No form fields visible when collapsed.

**Sprint:** Sprint 3

---

### TC-UI-072: Accessibility — task items are keyboard-navigable

**Category:** Accessibility
**Page/Component:** `TaskPanel.tsx`
**Priority:** P2
**Precondition:** Tasks exist in the panel.

**Steps:**
1. Use Tab to focus task items.
2. Use Enter to activate edit mode.
3. Use Tab to reach delete button.

**Expected Result:** All interactive elements (edit, delete, drag handle) are reachable via keyboard. Focus ring is visible on focused elements.

**Sprint:** Sprint 3

---

### TC-UI-073: ScheduledTaskBlock × button removes block from calendar

**Category:** Interaction
**Page/Component:** `ScheduledTaskBlock.tsx`
**Priority:** P1
**Precondition:** A ScheduledTaskBlock is visible on the calendar at 9:00 AM.

**Steps:**
1. Click the × button on the ScheduledTaskBlock.

**Expected Result:** Block is removed from the calendar immediately with no layout shift or errors. Task reappears in unscheduled section of task panel.

**Sprint:** Sprint 3

---

### TC-UI-074: No layout shift when conflict toast appears/disappears

**Category:** Layout
**Page/Component:** `ConflictToast`
**Priority:** P2
**Precondition:** User is viewing `/dashboard/calendar`.

**Steps:**
1. Trigger a conflict by dropping a task on an event slot.
2. Observe the page layout as the toast appears.
3. Dismiss or wait for auto-dismiss and observe disappearance.

**Expected Result:** Toast appears as an overlay (fixed/absolute position). Calendar and task panel do not reflow or shift when toast appears or disappears. No content displacement.

**Sprint:** Sprint 3

---

### TC-UI-075: Responsive — task panel stacks below calendar on narrow screens

**Category:** Responsive
**Page/Component:** `/dashboard/calendar`
**Priority:** P2
**Precondition:** Browser width set to 768px or less.

**Steps:**
1. Set browser window to 768px width.
2. Navigate to `/dashboard/calendar`.

**Expected Result:** At tablet/mobile width, task panel stacks vertically below the calendar (or a toggle shows/hides it). No horizontal overflow. Both sections remain usable.

**Sprint:** Sprint 3

---

## Sprint 3 Summary

| Test Case | Title | Category | Priority |
|-----------|-------|----------|----------|
| TC-UI-059 | Task panel layout | Layout | P1 |
| TC-UI-060 | AddTaskForm fields and defaults | Component | P1 |
| TC-UI-061 | Priority border colors | Component | P2 |
| TC-UI-062 | Edit/delete icons visible | Component | P2 |
| TC-UI-063 | Edit mode inline form | Interaction | P2 |
| TC-UI-064 | Empty state | State | P1 |
| TC-UI-065 | Drag ghost preview | Interaction | P2 |
| TC-UI-066 | Drop slot visual indicator | Interaction | P2 |
| TC-UI-067 | ScheduledTaskBlock appearance | Component | P2 |
| TC-UI-068 | Conflict toast appearance | Component | P2 |
| TC-UI-069 | Task moves to scheduled section | Layout | P1 |
| TC-UI-070 | Panel scrolls independently | Layout/Scroll | P2 |
| TC-UI-071 | AddTask form toggle | Interaction | P2 |
| TC-UI-072 | Keyboard navigation | Accessibility | P2 |
| TC-UI-073 | × button removes block | Interaction | P1 |
| TC-UI-074 | No layout shift on toast | Layout | P2 |
| TC-UI-075 | Responsive stacking | Responsive | P2 |

**Sprint 3 UI Total: 17 test cases (TC-UI-059 – TC-UI-075)**
**Cumulative UI Total: 75 test cases (TC-UI-001 – TC-UI-075)**
