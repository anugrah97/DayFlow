# DayFlow — Functional Test Cases

**Version:** 1.0
**Date:** 2026-04-20
**Sprint Coverage:** Sprint 1 & Sprint 2
**Total Test Cases:** 50 (TC-FUNC-001 – TC-FUNC-050)
**Author:** QA Agent

---

## Overview

This document contains comprehensive functional test cases mapped to user stories and acceptance criteria defined in `docs/user-stories.md` and `docs/PRD.md`. All test cases are derived from the implemented code in:

- `web/src/lib/auth.ts` — NextAuth Google OAuth configuration with token refresh
- `web/src/app/api/calendar/events/route.ts` — Calendar events API route
- `web/src/lib/google-calendar.ts` — Google Calendar API integration
- `web/src/components/calendar/DayView.tsx` — Day view UI with SWR polling

**Scope:** Functional verification only. No tests are to be executed from this document — this is a test case specification.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| P1 | Critical path — must pass before release |
| P2 | Important — high-value coverage |
| P3 | Edge case — lower risk but must be documented |

---

## US-001 — Google Sign-In

> **User Story:** As a new user, I want to sign in with my Google account so that DayFlow can access my calendar without me sharing my password.

---

### TC-FUNC-001: Successful Google OAuth Flow End-to-End

**User Story:** US-001
**Type:** Positive
**Priority:** P1
**Precondition:** User is unauthenticated. Browser has no active DayFlow session cookie. Application is running at `http://localhost:3000`.
**Test Data:** Valid Google account: `testuser@gmail.com` with an active Google Calendar containing at least one event today.

**Steps:**
1. Navigate to `http://localhost:3000` (landing page).
2. Verify the "Sign in with Google" button is visible and enabled.
3. Click "Sign in with Google".
4. Verify browser redirects to `accounts.google.com` OAuth consent screen.
5. On the Google consent screen, select the test Google account.
6. Click "Allow" to grant permissions.
7. Observe the redirect back to the application.

**Expected Result:** User is redirected to `/dashboard/calendar`. The page loads without errors. The user's display name and avatar appear in the top navigation bar. Today's calendar events begin loading.

**Acceptance Criterion:** "Sign in with Google" button visible on landing page; after consent, user is redirected to `/dashboard/calendar`; user's name and avatar shown in top nav.

**Sprint:** Sprint 1

---

### TC-FUNC-002: Correct OAuth Scopes Requested — `calendar.readonly` Only

**User Story:** US-001
**Type:** Positive
**Priority:** P1
**Precondition:** User is unauthenticated. Application is running. Network traffic can be inspected (browser DevTools or proxy).
**Test Data:** Any valid Google account.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Click "Sign in with Google".
3. On the Google OAuth redirect URL (before the consent screen loads), inspect the `scope` query parameter in the URL bar.
4. On the Google consent screen, review the listed permissions shown to the user.

**Expected Result:** The OAuth redirect URL contains `scope=openid+email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly` (or equivalent URL-encoded form). The consent screen shows only "View your Google Calendar" — no write, send, or other elevated permissions are listed. No scope other than `calendar.readonly` (plus `openid`, `email`, `profile`) is present.

**Acceptance Criterion:** Consent screen requests only `calendar.readonly` scope (plus OIDC base scopes).

**Sprint:** Sprint 1

---

### TC-FUNC-003: Redirect to `/dashboard/calendar` After Consent

**User Story:** US-001
**Type:** Positive
**Priority:** P1
**Precondition:** User is unauthenticated. A valid Google account is available.
**Test Data:** `testuser@gmail.com`

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Click "Sign in with Google".
3. Complete Google consent (click "Allow").
4. Record the URL in the address bar immediately after the redirect completes.

**Expected Result:** The final URL is exactly `http://localhost:3000/dashboard/calendar` (or the production equivalent). No intermediate error pages. HTTP status of the page is 200.

**Acceptance Criterion:** After consent, user is redirected to `/dashboard/calendar`.

**Sprint:** Sprint 1

---

### TC-FUNC-004: User Name and Avatar Displayed in Nav After Login

**User Story:** US-001
**Type:** Positive
**Priority:** P1
**Precondition:** User has successfully completed Google OAuth sign-in and is on `/dashboard/calendar`.
**Test Data:** Google account with display name "Test User" and a profile picture set.

**Steps:**
1. Complete sign-in via TC-FUNC-001 steps.
2. Inspect the top navigation bar of the `/dashboard/calendar` page.
3. Locate the user identity section of the nav.

**Expected Result:** The user's full display name ("Test User") is visible in the top navigation. A circular avatar image (the Google profile picture) is displayed adjacent to the name. Both elements are visible without horizontal scrolling on a 1280px-wide viewport.

**Acceptance Criterion:** User's name and avatar shown in top nav.

**Sprint:** Sprint 1

---

### TC-FUNC-005: User Denies OAuth Consent — Graceful Handling

**User Story:** US-001
**Type:** Negative
**Priority:** P1
**Precondition:** User is unauthenticated. Application is running.
**Test Data:** Any Google account.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Click "Sign in with Google".
3. On the Google OAuth consent screen, click "Cancel" or "Deny".
4. Observe the resulting page after Google redirects back.

**Expected Result:** The user is returned to the landing page (or a dedicated error/retry page) without a 500 error or unhandled exception. A human-readable message is displayed (e.g., "Sign-in was cancelled. Please try again."). The "Sign in with Google" button remains accessible so the user can retry.

**Acceptance Criterion:** Graceful handling of denied OAuth consent; no crash; user can retry.

**Sprint:** Sprint 1

---

### TC-FUNC-006: Invalid OAuth State Parameter — Request Rejected

**User Story:** US-001
**Type:** Negative
**Priority:** P1
**Precondition:** User initiates OAuth flow. The `state` parameter in the callback URL is tampered with.
**Test Data:** Modify the `state` query parameter in the OAuth callback URL to an arbitrary string (e.g., `state=FORGED_STATE_VALUE`).

**Steps:**
1. Navigate to `http://localhost:3000` and click "Sign in with Google".
2. Note the OAuth redirect URL that Google would send the callback to.
3. Simulate a callback to `/api/auth/callback/google` with a forged or mismatched `state` parameter and a valid-looking `code`.
4. Observe the application response.

**Expected Result:** The application rejects the callback with an appropriate error (HTTP 400 or redirect to an error page). No session is created. The user is not authenticated. No access token is stored. The application does not crash.

**Acceptance Criterion:** Invalid OAuth state parameter is rejected; no session created.

**Sprint:** Sprint 1

---

### TC-FUNC-007: OAuth Callback with Missing `code` Parameter — Handled

**User Story:** US-001
**Type:** Negative
**Priority:** P1
**Precondition:** User is unauthenticated. Application is running.
**Test Data:** Direct HTTP request to `/api/auth/callback/google` with no `code` query parameter (e.g., `GET /api/auth/callback/google?state=valid_state`).

**Steps:**
1. Construct a GET request to `/api/auth/callback/google` with a valid-looking `state` parameter but without a `code` parameter.
2. Send the request (via browser navigation or curl).
3. Observe the response.

**Expected Result:** The application responds with a meaningful error (HTTP 400 or redirect to an error/login page). No unhandled 500 error is returned. No session is created. The user is not authenticated.

**Acceptance Criterion:** OAuth callback with missing `code` is handled gracefully; no 500; no session created.

**Sprint:** Sprint 1

---

### TC-FUNC-008: User with No Google Calendar Events — No Crash

**User Story:** US-001
**Type:** Edge Case
**Priority:** P2
**Precondition:** A valid Google account exists that has zero events on today's date in its primary Google Calendar.
**Test Data:** Google account `emptyuser@gmail.com` with no calendar events for today (2026-04-20).

**Steps:**
1. Sign in with the empty-calendar Google account via the standard OAuth flow.
2. After redirect to `/dashboard/calendar`, wait for the calendar to finish loading.
3. Observe the calendar area.

**Expected Result:** The page loads without JavaScript errors or unhandled exceptions. The calendar area displays an empty state (e.g., "No events today" message with an icon). No spinner persists indefinitely. The "Last synced" timestamp updates.

**Acceptance Criterion:** Empty calendar state handled; "No events today" shown; no crash.

**Sprint:** Sprint 1

---

### TC-FUNC-009: Google Account with 2FA Enabled — Works Normally

**User Story:** US-001
**Type:** Edge Case
**Priority:** P2
**Precondition:** A Google account with Two-Factor Authentication (2FA / 2-Step Verification) enabled is available.
**Test Data:** Google account `2fauser@gmail.com` with 2FA configured (Authenticator app or SMS).

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Click "Sign in with Google".
3. On the Google consent screen, select the 2FA-enabled account.
4. Complete the 2FA challenge (enter OTP or use authenticator).
5. Click "Allow" on the consent screen.
6. Observe the redirect and resulting page.

**Expected Result:** After completing 2FA, the OAuth flow continues normally. The user is redirected to `/dashboard/calendar`. The session is created correctly. Calendar events load as expected. DayFlow behaves identically to a non-2FA account.

**Acceptance Criterion:** 2FA does not break OAuth; session created; calendar loads normally.

**Sprint:** Sprint 1

---

### TC-FUNC-010: Very Long Display Name (100+ Characters) — No Layout Break

**User Story:** US-001
**Type:** Edge Case
**Priority:** P3
**Precondition:** A Google account exists with a display name of 100 or more characters.
**Test Data:** Google account display name: `"Bartholomew Maximilian Christophersen-Vandenberghe-O'Donnell III (The Third, Esquire, PhD)"` (91 chars — use the longest possible via Google settings, or mock the session data to inject a 100+ char name).

**Steps:**
1. Sign in with the long-name account (or mock the session to return a 100+ char name).
2. Navigate to `/dashboard/calendar`.
3. Inspect the top navigation bar at viewport widths of 1280px, 768px, and 375px.

**Expected Result:** The navigation bar does not overflow horizontally. The long name is truncated with an ellipsis (`…`) or wraps within its container. No other nav elements are pushed off-screen. The layout remains usable on all three viewport widths.

**Acceptance Criterion:** Very long display names do not break the nav layout.

**Sprint:** Sprint 1

---

### TC-FUNC-011: User with No Profile Picture — Fallback Avatar Shown

**User Story:** US-001
**Type:** Edge Case
**Priority:** P2
**Precondition:** A Google account with no profile picture set is available (or the session `image` field is null/undefined).
**Test Data:** Google account `nophoto@gmail.com` with no profile picture, or mock session with `user.image = null`.

**Steps:**
1. Sign in with the no-photo account (or inject a session where `user.image` is `null`).
2. Navigate to `/dashboard/calendar`.
3. Inspect the avatar area in the top navigation.

**Expected Result:** A fallback avatar is displayed (e.g., a default icon, the user's initials on a colored background, or a generic placeholder image). No broken image icon (`alt` text with no image) is shown. The nav area renders without layout shifts.

**Acceptance Criterion:** Missing profile picture shows a fallback avatar, not a broken image.

**Sprint:** Sprint 1

---

### TC-FUNC-012: Signing In Twice in Same Session — No Duplicate Sessions

**User Story:** US-001
**Type:** Regression
**Priority:** P2
**Precondition:** User is already authenticated and has an active session on `/dashboard/calendar`. Browser cookies are intact.
**Test Data:** Same `testuser@gmail.com` account used for initial sign-in.

**Steps:**
1. Complete sign-in and arrive at `/dashboard/calendar`.
2. Open browser DevTools → Application → Cookies. Note the session cookie name and value.
3. Navigate directly to `http://localhost:3000` (landing page).
4. If the landing page has a "Sign in with Google" button, click it again.
5. Complete the OAuth flow a second time with the same account.
6. After the second redirect to `/dashboard/calendar`, inspect Application → Cookies.

**Expected Result:** Only one session cookie exists (no duplicate session entries). The user sees the dashboard normally. No doubled API calls to `/api/calendar/events` appear in the Network tab on page load. Session data is consistent with a single authenticated session.

**Acceptance Criterion:** No duplicate sessions created on repeated sign-in with the same account.

**Sprint:** Sprint 1

---

## US-002 — Persistent Session

> **User Story:** As a returning user, I want to stay logged in across browser sessions so that I don't have to re-authenticate every time.

---

### TC-FUNC-013: Refresh Page — Still Authenticated

**User Story:** US-002
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated and on `/dashboard/calendar`.
**Test Data:** Valid session for `testuser@gmail.com`.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Verify the page loads and calendar events are visible.
3. Press `F5` (or `Cmd+R`) to hard-reload the page.
4. Observe the page after reload.

**Expected Result:** After the reload, the user remains on `/dashboard/calendar` without being redirected to the login page. The user's name and avatar are still visible in the nav. Calendar events reload automatically. No sign-in prompt is shown.

**Acceptance Criterion:** Refreshing the page keeps the user logged in.

**Sprint:** Sprint 1

---

### TC-FUNC-014: Close and Reopen Browser Tab — Still Authenticated

**User Story:** US-002
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated and on `/dashboard/calendar`. Browser is not configured to clear cookies on close.
**Test Data:** Valid session for `testuser@gmail.com`.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Close the browser tab (not the entire browser window, to preserve cookies).
3. Open a new browser tab.
4. Navigate to `http://localhost:3000/dashboard/calendar`.
5. Observe the resulting page.

**Expected Result:** The user is immediately shown the `/dashboard/calendar` page without a redirect to the login page. The session is still valid. Calendar events load without prompting for re-authentication. Name and avatar appear in the nav.

**Acceptance Criterion:** Closing and reopening a browser tab preserves the session.

**Sprint:** Sprint 1

---

### TC-FUNC-015: Session Includes User Email and Name

**User Story:** US-002
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. The `/api/auth/session` endpoint is accessible.
**Test Data:** Google account `testuser@gmail.com` with display name "Test User".

**Steps:**
1. Sign in with `testuser@gmail.com`.
2. In the browser, navigate to `/api/auth/session` (NextAuth session endpoint).
3. Inspect the JSON response body.

**Expected Result:** The JSON response contains a `user` object with at minimum: `"email": "testuser@gmail.com"` and `"name": "Test User"`. The `expires` field is a future ISO timestamp. Crucially, the response does NOT contain `accessToken` or `refreshToken` (tokens remain server-side only per `auth.ts` session callback).

**Acceptance Criterion:** Session contains user email and name; access tokens are NOT exposed to the client.

**Sprint:** Sprint 1

---

### TC-FUNC-016: Manipulated Session Cookie — Rejected, Redirect to `/login`

**User Story:** US-002
**Type:** Negative
**Priority:** P1
**Precondition:** User is authenticated. Browser DevTools are available.
**Test Data:** The active NextAuth session cookie (e.g., `next-auth.session-token`).

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Open DevTools → Application → Cookies.
3. Find the `next-auth.session-token` cookie and edit its value to a random invalid string (e.g., `TAMPERED_INVALID_TOKEN`).
4. Reload the page or navigate to `/dashboard/calendar`.

**Expected Result:** The application detects the invalid session token and redirects the user to the login page (e.g., `/` or `/api/auth/signin`). No 500 error or stack trace is shown. The user is prompted to sign in again. No calendar data is displayed.

**Acceptance Criterion:** A tampered session cookie is rejected and the user is redirected to login.

**Sprint:** Sprint 1

---

### TC-FUNC-017: Session Expires — Redirect to `/login` (Not Error Page)

**User Story:** US-002
**Type:** Edge Case
**Priority:** P1
**Precondition:** A session exists that is past its expiry time (simulate by setting the session cookie `expires` to a past timestamp, or by manipulating the `next-auth.session-token` JWT `exp` claim in a test environment).
**Test Data:** Expired session token (exp = Unix timestamp in the past).

**Steps:**
1. Simulate an expired session by setting the session expiry to a past date (via test environment manipulation or a custom expired JWT).
2. Attempt to navigate to `/dashboard/calendar` using this expired session.
3. Observe the browser redirect behavior.

**Expected Result:** The user is redirected to the login/landing page (e.g., `/` or `/api/auth/signin`). The redirect is clean — no error page, no 500, no blank screen. The user can successfully sign in again from the redirected page.

**Acceptance Criterion:** Expired session redirects to login (not an error page); re-authentication is possible.

**Sprint:** Sprint 1

---

### TC-FUNC-018: `RefreshAccessTokenError` in Session — Re-Auth Prompt Shown

**User Story:** US-002
**Type:** Edge Case
**Priority:** P1
**Precondition:** The Google OAuth access token has expired and the refresh token is also invalid (e.g., user has revoked DayFlow's access in Google account settings). The `refreshAccessToken` function in `auth.ts` returns `{ error: "RefreshAccessTokenError" }`.
**Test Data:** Session where `session.error = "RefreshAccessTokenError"` (simulate by revoking Google access at `myaccount.google.com/permissions` then waiting for token expiry, or by injecting the error in a test environment).

**Steps:**
1. Ensure the application has a session where the access token is expired and the refresh token is invalid/revoked.
2. Navigate to `/dashboard/calendar`.
3. Observe the UI behavior.

**Expected Result:** The UI shows a re-authentication prompt or banner (e.g., "Your session has expired. Please sign in again.") rather than silently failing or showing a generic error. The user is given a clear call-to-action to re-authenticate. No raw `RefreshAccessTokenError` string is exposed to the user in a user-facing context.

**Acceptance Criterion:** `RefreshAccessTokenError` triggers a re-auth prompt, not a silent failure or crash.

**Sprint:** Sprint 1

---

## US-003 — View Today's Events

> **User Story:** As a signed-in user, I want to see all my meetings for today so that I know my meeting load before planning tasks.

---

### TC-FUNC-019: Events from Google Calendar Appear in Day View

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. The Google Calendar account has 3 events today: "Morning Standup" at 9:00–9:30, "Product Review" at 11:00–12:00, "1:1 with Manager" at 15:00–15:30.
**Test Data:** Google account with the 3 events listed above on today's date.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Wait for the loading skeleton to disappear.
3. Inspect the day view timeline area.

**Expected Result:** All 3 events ("Morning Standup", "Product Review", "1:1 with Manager") are rendered as visual blocks on the calendar timeline. No events are missing. The events are visible within the 7am–10pm timeline grid.

**Acceptance Criterion:** Events fetched from Google Calendar API on page load; all events shown on the day timeline.

**Sprint:** Sprint 1

---

### TC-FUNC-020: Event Title Matches Google Calendar

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar has an event with title "Q2 Planning Session" today.
**Test Data:** Event titled exactly "Q2 Planning Session" in Google Calendar.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Locate the event block for "Q2 Planning Session" in the day view.
3. Read the displayed title text within the event block.

**Expected Result:** The event block displays "Q2 Planning Session" exactly as it appears in Google Calendar. No truncation artifacts or incorrect text is shown (within block width constraints, truncation with ellipsis is acceptable, but the full title must be accessible on hover or within the block's accessible label).

**Acceptance Criterion:** Each event shows its title matching the Google Calendar event summary.

**Sprint:** Sprint 1

---

### TC-FUNC-021: Event Start Time Correct (Timezone-Aware)

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. User's local timezone is IST (UTC+5:30). Google Calendar has an event starting at 10:00 AM IST (which is 04:30 UTC). The event's `dateTime` in the Google Calendar API response is `2026-04-20T04:30:00Z`.
**Test Data:** Event "Design Review" with `start.dateTime = "2026-04-20T04:30:00Z"` (= 10:00 AM IST).

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Locate the "Design Review" event block on the timeline.
3. Note the start time displayed on the event block.
4. Note the vertical position of the event block on the timeline grid.

**Expected Result:** The event block displays "10:00 AM" as the start time (or the local equivalent). The vertical position of the block on the timeline corresponds to the 10:00 AM slot. The UTC time (04:30) is NOT displayed.

**Acceptance Criterion:** Event start time is displayed correctly in the user's local timezone.

**Sprint:** Sprint 1

---

### TC-FUNC-022: Event End Time Correct

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar has an event "Team Lunch" from 12:00–13:30 today.
**Test Data:** Event "Team Lunch" with `start.dateTime` = 12:00 and `end.dateTime` = 13:30 local time.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Locate the "Team Lunch" event block.
3. Read the end time displayed on or within the event block.

**Expected Result:** The event block shows the end time as 1:30 PM (13:30). The block's bottom edge aligns with the 1:30 PM position on the time grid.

**Acceptance Criterion:** Each event shows its correct end time.

**Sprint:** Sprint 1

---

### TC-FUNC-023: Event Duration Matches (1hr Event = 1hr Block Height)

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar has a 1-hour event "Engineering All-Hands" from 14:00–15:00. The time grid has a defined pixel height per hour.
**Test Data:** Event "Engineering All-Hands" from 14:00 to 15:00 (exactly 60 minutes).

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Locate the "Engineering All-Hands" event block.
3. Measure the pixel height of the event block (browser DevTools → inspect element → computed height).
4. Compare the block height to the known height of one hour on the time grid.

**Expected Result:** The rendered height of the "Engineering All-Hands" event block equals exactly one hour-slot height on the time grid (within 1px tolerance for border rendering). A 30-minute event would be exactly half that height.

**Acceptance Criterion:** Event block height is proportional to event duration.

**Sprint:** Sprint 1

---

### TC-FUNC-024: Multiple Events All Render

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar has exactly 8 events today at various times from 8:00 AM to 6:00 PM.
**Test Data:** 8 distinct events spanning the workday, none overlapping.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Wait for calendar to finish loading.
3. Count the number of event blocks rendered in the day view.

**Expected Result:** All 8 event blocks are rendered. Each event is distinct and identifiable. No event is silently dropped. The count of rendered event blocks matches the count of events returned by the API.

**Acceptance Criterion:** All events from the Google Calendar API response are rendered in the day view.

**Sprint:** Sprint 1

---

### TC-FUNC-025: Attendee Count Shown for Events with Attendees

**User Story:** US-003
**Type:** Positive
**Priority:** P2
**Precondition:** User is authenticated. Google Calendar has an event "Sprint Planning" with 5 attendees.
**Test Data:** Event "Sprint Planning" with `attendees` array containing 5 entries (the API maps this to `attendeeCount: 5`).

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Locate the "Sprint Planning" event block.
3. Look for attendee count information on the event block.

**Expected Result:** The event block displays the attendee count (e.g., "5 attendees" or a people icon with "5"). The count matches the actual number of attendees in Google Calendar.

**Acceptance Criterion:** Attendee count is shown on event blocks for events that have attendees.

**Sprint:** Sprint 1

---

### TC-FUNC-026: Events Ordered by Start Time

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar returns events in the following order (assume API returns them unordered for test purposes): 3:00 PM event, 9:00 AM event, 1:00 PM event.
**Test Data:** 3 events at 9:00 AM, 1:00 PM, and 3:00 PM (API response may return them in any order).

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Read the vertical order of event blocks from top (earliest) to bottom (latest) on the timeline.

**Expected Result:** Events appear in chronological order: 9:00 AM event is topmost, followed by 1:00 PM event, then 3:00 PM event at the bottom. The `orderBy: "startTime"` parameter in the Google Calendar API call ensures this, but the UI must also reflect the correct order.

**Acceptance Criterion:** Events are displayed in ascending chronological order on the day timeline.

**Sprint:** Sprint 1

---

### TC-FUNC-027: Google Calendar API Error — Error State Shown

**User Story:** US-003
**Type:** Negative
**Priority:** P1
**Precondition:** User is authenticated. The Google Calendar API is unavailable or returns an error (simulate by using an invalid API key in the test environment, or by blocking the API endpoint via a network proxy).
**Test Data:** Force `getTodaysEvents` to throw an error (e.g., network timeout or 403 from Google API).

**Steps:**
1. Configure the test environment so the Google Calendar API call fails (e.g., invalid credentials, blocked network).
2. Sign in and navigate to `/dashboard/calendar`.
3. Wait for the loading state to complete.
4. Observe the day view area.

**Expected Result:** The calendar area shows an error state banner (e.g., "Could not load events: [error message]" — matching the red error div in `DayView.tsx`). The error message is human-readable. No unhandled JavaScript exception is thrown. The Refresh button remains clickable.

**Acceptance Criterion:** API error is surfaced as an error state in the UI, not a crash.

**Sprint:** Sprint 1

---

### TC-FUNC-028: Expired Access Token — Refresh Triggered, Not 401 to User

**User Story:** US-003
**Type:** Negative
**Priority:** P1
**Precondition:** User is authenticated. The access token in the JWT has expired (`Date.now() >= accessTokenExpires * 1000`). A valid refresh token exists.
**Test Data:** Session with `accessTokenExpires` set to a past timestamp; valid `refreshToken` available.

**Steps:**
1. Set up a session where the access token is expired but the refresh token is valid.
2. Navigate to `/dashboard/calendar`.
3. Observe the network request to `/api/calendar/events`.
4. Observe the resulting UI.

**Expected Result:** The NextAuth JWT callback transparently calls `refreshAccessToken()`, obtains a new access token, and the `/api/calendar/events` request succeeds with HTTP 200. Calendar events load normally. The user sees no "Unauthorized" error or 401 response. No re-authentication prompt is shown.

**Acceptance Criterion:** Expired access token triggers silent refresh; user sees calendar events, not an error.

**Sprint:** Sprint 1

---

### TC-FUNC-029: Event with No Title — "Untitled event" Shown

**User Story:** US-003
**Type:** Edge Case
**Priority:** P2
**Precondition:** User is authenticated. Google Calendar has an event today where the `summary` field is null or empty.
**Test Data:** Google Calendar event with no title (API returns `summary: null` or `summary` field absent). The `google-calendar.ts` maps this to `title: event.summary ?? "Untitled event"`.

**Steps:**
1. Create or simulate a Google Calendar event with no title for today.
2. Sign in and navigate to `/dashboard/calendar`.
3. Locate the event block for the untitled event.

**Expected Result:** The event block renders with the text "Untitled event" as its title. The block does not show an empty/blank title area. No JavaScript error is thrown due to undefined title access.

**Acceptance Criterion:** Events without a title display "Untitled event" as a fallback.

**Sprint:** Sprint 1

---

### TC-FUNC-030: All-Day Event (No `dateTime`, Only `date`) — Handled Without Crash

**User Story:** US-003
**Type:** Edge Case
**Priority:** P2
**Precondition:** User is authenticated. Google Calendar has an all-day event today (e.g., a birthday or holiday). The API returns `start.date` and `end.date` (date strings, not `dateTime`).
**Test Data:** All-day event "Public Holiday" with `start: { date: "2026-04-20" }` and `end: { date: "2026-04-21" }` (no `dateTime` fields).

**Steps:**
1. Ensure an all-day event exists in the test Google Calendar today.
2. Sign in and navigate to `/dashboard/calendar`.
3. Observe the rendered day view for crashes, blank screens, or JavaScript errors (check browser console).

**Expected Result:** The application does not crash. The all-day event is either displayed in a designated all-day section at the top of the timeline, or gracefully omitted from the hourly grid with no error. The `start` and `end` fields fall back to the date string (per `google-calendar.ts`: `event.start?.dateTime ?? event.start?.date ?? ""`). No `TypeError` or unhandled promise rejection appears in the console.

**Acceptance Criterion:** All-day events (date-only, no dateTime) are handled without crashing the application.

**Sprint:** Sprint 1

---

## US-004 — Auto-Refresh Calendar

> **User Story:** As a user with a dynamic calendar, I want the calendar to update without me refreshing so that new meetings added by others appear automatically.

---

### TC-FUNC-031: New Event Added Externally Appears Within 15 Minutes

**User Story:** US-004
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated and the `/dashboard/calendar` page is open. The SWR `refreshInterval` is set to `15 * 60 * 1000` (15 minutes) in `DayView.tsx`.
**Test Data:** Google Calendar account for `testuser@gmail.com`. A collaborator or the test setup will add a new event "Emergency Review" at 4:00 PM during the test.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`. Note the currently visible events.
2. Add a new event "Emergency Review" at 4:00 PM to the Google Calendar externally (via Google Calendar UI or API).
3. Keep the DayFlow tab open. Do NOT manually refresh the page.
4. Wait up to 15 minutes.
5. Observe the calendar view.

**Expected Result:** Within 15 minutes of the external event being added, the "Emergency Review" event block appears on the DayFlow calendar timeline without any manual page refresh. The "Last synced" timestamp updates to reflect the new fetch.

**Acceptance Criterion:** Calendar data refreshes every 15 minutes; new external events appear automatically.

**Sprint:** Sprint 2

---

### TC-FUNC-032: "Last Synced" Timestamp Updates After Each Fetch

**User Story:** US-004
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated and on `/dashboard/calendar`. At least one auto-refresh cycle or one manual refresh has occurred.
**Test Data:** Any authenticated session with events.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`.
2. Note the "Last synced: X" timestamp displayed in the header bar.
3. Wait for 15 minutes (or manually trigger a refresh via the Refresh button).
4. Observe the "Last synced" timestamp after the new fetch completes.

**Expected Result:** The "Last synced" text updates to a more recent relative time (e.g., "just now" immediately after a fetch, then "1 minute ago" after a minute). The timestamp is sourced from the `syncedAt` field in the API response. The timestamp progresses forward in time with each fetch cycle.

**Acceptance Criterion:** "Last synced" timestamp is displayed and updates after each calendar data fetch.

**Sprint:** Sprint 2

---

### TC-FUNC-033: Manual Refresh Button Triggers Immediate Re-Fetch

**User Story:** US-004
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated and on `/dashboard/calendar`. The page has completed its initial load.
**Test Data:** Any authenticated session.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`. Wait for initial load to complete.
2. Open browser DevTools → Network tab. Clear existing network entries.
3. Click the "Refresh" button (aria-label: "Refresh calendar") in the calendar header bar.
4. Observe the Network tab immediately after clicking.

**Expected Result:** A new network request to `GET /api/calendar/events` is initiated within 500ms of clicking the Refresh button. The request completes and the UI updates. The "Last synced" timestamp updates to "just now". The Refresh button shows a loading/spinning state during the request.

**Acceptance Criterion:** Manual Refresh button triggers an immediate re-fetch of calendar events.

**Sprint:** Sprint 2

---

### TC-FUNC-034: Loading Indicator Shown During Refresh

**User Story:** US-004
**Type:** Positive
**Priority:** P2
**Precondition:** User is authenticated and on `/dashboard/calendar`.
**Test Data:** Any authenticated session. Network throttled to "Slow 3G" in DevTools to ensure loading state is visible.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`. Wait for initial load.
2. In browser DevTools → Network, set throttling to "Slow 3G".
3. Click the "Refresh" button.
4. Observe the Refresh button and calendar area during the in-flight request.

**Expected Result:** While the request is in-flight (`isLoading = true` in SWR), the Refresh button shows a spinning `RefreshCw` icon (matching the `animate-spin` class in `DayView.tsx`). The button is disabled (has `disabled` attribute and `opacity-40` styling). The spinner stops and the button re-enables once the fetch completes.

**Acceptance Criterion:** A loading/spinner indicator is visible during calendar data refresh.

**Sprint:** Sprint 2

---

### TC-FUNC-035: Refresh While Offline — Error Shown, Previous Data Preserved

**User Story:** US-004
**Type:** Negative
**Priority:** P1
**Precondition:** User is authenticated and on `/dashboard/calendar`. Calendar has loaded with 3 events. Browser DevTools network is set to "Offline".
**Test Data:** 3 visible events from prior successful load. Network set to offline.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`. Confirm 3 events are visible.
2. In DevTools → Network, select "Offline" throttling preset.
3. Click the "Refresh" button.
4. Observe the UI after the failed request.

**Expected Result:** An error banner appears (e.g., "Could not load events: Failed to fetch") matching the red error div in `DayView.tsx`. The previously loaded 3 event blocks remain visible (SWR retains stale data on error). The "Last synced" timestamp does NOT update (it retains the prior sync time). The Refresh button is re-enabled after the error.

**Acceptance Criterion:** Offline refresh shows an error; previously loaded event data is preserved.

**Sprint:** Sprint 2

---

### TC-FUNC-036: Rapid Manual Refreshes (Spam Clicking) — No Duplicate Requests

**User Story:** US-004
**Type:** Edge Case
**Priority:** P2
**Precondition:** User is authenticated and on `/dashboard/calendar`. Page has completed initial load.
**Test Data:** Any authenticated session. Network tab open in DevTools.

**Steps:**
1. Sign in and navigate to `/dashboard/calendar`. Wait for initial load.
2. Open DevTools → Network tab. Clear entries.
3. Click the "Refresh" button 5 times in rapid succession (within 1 second).
4. Wait for all in-flight requests to complete.
5. Count the number of GET requests to `/api/calendar/events` in the Network tab.

**Expected Result:** Only 1 request to `/api/calendar/events` is made (or at most 1 additional de-duplicated request), not 5. The Refresh button becomes disabled after the first click (`disabled` attribute) while the request is in-flight, preventing additional clicks from firing new requests. SWR's built-in deduplication prevents concurrent identical requests.

**Acceptance Criterion:** Spam-clicking the Refresh button does not fire duplicate concurrent API requests.

**Sprint:** Sprint 2

---

## API Contract Tests

> These tests verify the `/api/calendar/events` route contract as implemented in `web/src/app/api/calendar/events/route.ts`.

---

### TC-FUNC-037: `GET /api/calendar/events` Returns 200 with Correct Shape

**User Story:** US-003 / US-004
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated with a valid session. A valid NextAuth JWT token is present in the request cookies.
**Test Data:** Authenticated session for `testuser@gmail.com`.

**Steps:**
1. With an authenticated session, send `GET /api/calendar/events` (via browser fetch, Postman, or `curl` with the session cookie).
2. Inspect the HTTP response status code.
3. Inspect the response body JSON.

**Expected Result:**
- HTTP status: `200 OK`
- Response body is valid JSON.
- Top-level keys: `events` (array) and `syncedAt` (string).
- `events` may be an empty array `[]` or contain event objects.
- `syncedAt` is a non-empty string.

**Acceptance Criterion:** Authenticated GET returns 200 with `{ events: [], syncedAt: string }` shape.

**Sprint:** Sprint 1

---

### TC-FUNC-038: `GET /api/calendar/events` Without Auth Returns 401

**User Story:** US-003
**Type:** Negative
**Priority:** P1
**Precondition:** No session cookie is present in the request (unauthenticated request).
**Test Data:** Request sent without a `next-auth.session-token` cookie.

**Steps:**
1. Send `GET /api/calendar/events` without any session cookie (e.g., `curl http://localhost:3000/api/calendar/events`).
2. Inspect the HTTP response status and body.

**Expected Result:**
- HTTP status: `401 Unauthorized`
- Response body: `{ "error": "Unauthorized" }`
- No event data is returned.
- No stack trace or internal error detail is leaked in the response.

**Acceptance Criterion:** Unauthenticated request to the events endpoint returns 401 with `{ error: "Unauthorized" }`.

**Sprint:** Sprint 1

---

### TC-FUNC-039: Response `events` Array Items Have Required Fields

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar has at least 1 event today.
**Test Data:** Authenticated session; at least 1 event in Google Calendar today.

**Steps:**
1. Send `GET /api/calendar/events` with a valid authenticated session.
2. Parse the response JSON.
3. For each object in the `events` array, inspect its fields.

**Expected Result:** Every object in the `events` array contains all of the following fields:
- `id` — non-empty string
- `title` — string (may be "Untitled event" if no summary)
- `start` — non-empty string (ISO date or date-only)
- `end` — non-empty string (ISO date or date-only)
- `attendeeCount` — non-negative integer

No required field is `undefined` or missing from any event object.

**Acceptance Criterion:** API response events contain `id`, `title`, `start`, `end`, and `attendeeCount`.

**Sprint:** Sprint 1

---

### TC-FUNC-040: `start` and `end` Are Valid ISO Date Strings

**User Story:** US-003
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated. Google Calendar has at least 1 timed event (not all-day) today.
**Test Data:** Authenticated session; 1+ timed events today.

**Steps:**
1. Send `GET /api/calendar/events` with a valid authenticated session.
2. Parse the response JSON.
3. For each event, extract the `start` and `end` strings.
4. Attempt to parse each string with `new Date(start)` and `new Date(end)`.

**Expected Result:** `new Date(start)` and `new Date(end)` produce valid `Date` objects (i.e., `!isNaN(new Date(start).getTime())`). For timed events, the values are full ISO 8601 datetime strings (e.g., `"2026-04-20T09:00:00+05:30"` or `"2026-04-20T03:30:00Z"`). For all-day events, the values are date-only strings (e.g., `"2026-04-20"`) which also parse without error.

**Acceptance Criterion:** `start` and `end` are valid parseable date/datetime strings.

**Sprint:** Sprint 1

---

### TC-FUNC-041: `syncedAt` Is a Valid ISO Timestamp

**User Story:** US-004
**Type:** Positive
**Priority:** P1
**Precondition:** User is authenticated.
**Test Data:** Any authenticated session.

**Steps:**
1. Send `GET /api/calendar/events` with a valid authenticated session.
2. Parse the response JSON.
3. Extract the `syncedAt` field.
4. Parse it with `new Date(syncedAt)`.

**Expected Result:** `syncedAt` is a non-empty string. `new Date(syncedAt)` produces a valid Date object. The `syncedAt` value is within a few seconds of the time the request was made (i.e., `Math.abs(Date.now() - new Date(syncedAt).getTime()) < 5000`). This confirms it is generated as `new Date().toISOString()` at request time.

**Acceptance Criterion:** `syncedAt` is a valid ISO 8601 timestamp reflecting the time of the API call.

**Sprint:** Sprint 2

---

### TC-FUNC-042: Response Content-Type Is `application/json`

**User Story:** US-003
**Type:** Positive
**Priority:** P2
**Precondition:** User is authenticated.
**Test Data:** Any authenticated session.

**Steps:**
1. Send `GET /api/calendar/events` with a valid authenticated session.
2. Inspect the `Content-Type` response header.

**Expected Result:** The `Content-Type` header value is `application/json` (may include `; charset=utf-8`). The response body is valid JSON (parseable by `JSON.parse()`).

**Acceptance Criterion:** API responds with `Content-Type: application/json`.

**Sprint:** Sprint 1

---

### TC-FUNC-043: `POST /api/calendar/events` Returns 405 Method Not Allowed

**User Story:** US-003
**Type:** Negative
**Priority:** P2
**Precondition:** Application is running. User may or may not be authenticated.
**Test Data:** `POST /api/calendar/events` with an empty body.

**Steps:**
1. Send `POST /api/calendar/events` (with or without authentication credentials).
2. Inspect the HTTP response status code and body.

**Expected Result:** The server returns HTTP `405 Method Not Allowed`. Only `GET` is a defined handler in `route.ts`; Next.js automatically returns 405 for undefined methods. The response body may be an empty JSON object or a standard 405 message. No event data is modified (calendar is read-only per PRD).

**Acceptance Criterion:** Non-GET methods on `/api/calendar/events` return 405.

**Sprint:** Sprint 1

---

### TC-FUNC-044: `GET /api/calendar/events` with Expired Token Triggers Refresh and Returns 200

**User Story:** US-003 / US-002
**Type:** Positive
**Priority:** P1
**Precondition:** User has an authenticated session where the Google access token is expired but the refresh token is valid. The JWT callback in `auth.ts` will call `refreshAccessToken()` on the next JWT decode.
**Test Data:** Session with `accessTokenExpires` in the past; valid `refreshToken`.

**Steps:**
1. Set up or simulate a session where the access token is expired (past `accessTokenExpires`) with a valid refresh token.
2. Send `GET /api/calendar/events` using this session's cookie.
3. Inspect the HTTP response status and body.

**Expected Result:**
- HTTP status: `200 OK` (not 401).
- Response body contains `{ events: [...], syncedAt: "..." }`.
- The server transparently refreshed the access token via `refreshAccessToken()` in the JWT callback before calling `getTodaysEvents`.
- No 401 or token-related error is returned to the caller.

**Acceptance Criterion:** Expired access token is silently refreshed server-side; client receives a 200 with events.

**Sprint:** Sprint 1

---

### TC-FUNC-045: Concurrent Requests to `/api/calendar/events` — No Race Condition

**User Story:** US-004
**Type:** Edge Case
**Priority:** P2
**Precondition:** User is authenticated with a valid session.
**Test Data:** Authenticated session. 5 concurrent requests fired simultaneously.

**Steps:**
1. Using `Promise.all` or a tool like Apache Bench, send 5 simultaneous `GET /api/calendar/events` requests with the same valid session cookie.
2. Inspect all 5 responses.

**Expected Result:** All 5 responses return HTTP `200 OK` with valid `{ events: [...], syncedAt: "..." }` bodies. No response returns 500. No race condition causes a partial or corrupted response. Each response has a consistent event list (all 5 should return the same events since they're fetching the same calendar at near the same time).

**Acceptance Criterion:** Concurrent requests to the events endpoint all succeed; no race conditions.

**Sprint:** Sprint 2

---

## Regression Tests

---

### TC-FUNC-046: Sign In → View Calendar → Sign Out → Sign In Again → Calendar Loads

**User Story:** US-001 / US-002 / US-003
**Type:** Regression
**Priority:** P1
**Precondition:** Application is running. No existing session.
**Test Data:** `testuser@gmail.com` with calendar events today.

**Steps:**
1. Navigate to `http://localhost:3000`. Click "Sign in with Google". Complete OAuth. Confirm arrival at `/dashboard/calendar` with events visible.
2. Sign out (click the sign-out button or navigate to `/api/auth/signout`). Confirm redirect to landing page and session cookie is cleared.
3. Click "Sign in with Google" again. Complete OAuth with the same account.
4. Confirm arrival at `/dashboard/calendar`.
5. Wait for calendar events to load.

**Expected Result:** After the second sign-in, the calendar loads all events correctly without error. The session is clean (no stale state from the previous session). The "Last synced" timestamp appears. No console errors are present.

**Acceptance Criterion:** Full sign-in/sign-out/sign-in cycle works end-to-end without errors.

**Sprint:** Sprint 1

---

### TC-FUNC-047: Calendar Loads on Initial Auth — No Manual Refresh Needed

**User Story:** US-003
**Type:** Regression
**Priority:** P1
**Precondition:** User is unauthenticated. Application is running.
**Test Data:** `testuser@gmail.com` with at least 1 event today.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Click "Sign in with Google" and complete the OAuth flow.
3. After redirect to `/dashboard/calendar`, do NOT click the Refresh button.
4. Observe the calendar area — wait up to 10 seconds.

**Expected Result:** Calendar events appear automatically within 5 seconds of arriving at `/dashboard/calendar` (PRD success metric: "< 5 seconds"). The user does not need to click Refresh or perform any additional action. SWR's initial fetch fires on component mount.

**Acceptance Criterion:** Calendar data loads automatically on first visit to `/dashboard/calendar` after auth; no manual action required.

**Sprint:** Sprint 1

---

### TC-FUNC-048: Dashboard Accessible After Token Refresh — Seamless Experience

**User Story:** US-002 / US-003
**Type:** Regression
**Priority:** P1
**Precondition:** User has a session where the access token has just expired (e.g., the token was issued >1 hour ago). A valid refresh token is present.
**Test Data:** Session where `accessTokenExpires` has just passed; valid `refreshToken`.

**Steps:**
1. Set up a session with an expired access token and valid refresh token.
2. Navigate to `/dashboard/calendar`.
3. Observe the page load and calendar data fetch.
4. Check the Network tab for any 401 responses or error states in the UI.

**Expected Result:** The page loads normally. Calendar events appear. No 401 error is shown to the user. No re-authentication prompt appears. The token refresh happens transparently during the JWT decode in the NextAuth middleware. The user experience is seamless and identical to having a valid access token.

**Acceptance Criterion:** Transparent token refresh allows seamless dashboard access without user interruption.

**Sprint:** Sprint 1

---

### TC-FUNC-049: Auth Middleware Blocks `/dashboard` Without Session

**User Story:** US-001 / US-002
**Type:** Regression
**Priority:** P1
**Precondition:** No session cookie is present (unauthenticated browser).
**Test Data:** Direct navigation to `/dashboard/calendar` without any session.

**Steps:**
1. Clear all cookies for `localhost:3000` (DevTools → Application → Cookies → Clear All).
2. Directly navigate to `http://localhost:3000/dashboard/calendar` in the browser.
3. Observe the resulting page and URL.

**Expected Result:** The user is NOT shown the `/dashboard/calendar` content. The auth middleware intercepts the request and redirects the user to the login/landing page (e.g., `/` or `/api/auth/signin`). HTTP status of the final page is not 200 for `/dashboard/calendar`. This confirms middleware-level protection (not just layout-level).

**Acceptance Criterion:** Unauthenticated direct navigation to `/dashboard` is blocked by middleware and redirected to login.

**Sprint:** Sprint 1

---

### TC-FUNC-050: No Console Errors on Happy Path — No Unhandled Promise Rejections

**User Story:** US-001 / US-002 / US-003 / US-004
**Type:** Regression
**Priority:** P1
**Precondition:** Application is running. Browser DevTools console is open. No prior errors in the console.
**Test Data:** `testuser@gmail.com` with 3 events in Google Calendar today. Network is healthy (no throttling).

**Steps:**
1. Open browser DevTools → Console tab. Enable "Errors", "Warnings", and "Info" log levels. Clear existing console output.
2. Navigate to `http://localhost:3000`.
3. Click "Sign in with Google". Complete OAuth.
4. Observe the console during and after redirect to `/dashboard/calendar`.
5. Wait for the calendar to fully load (spinner gone, events visible, "Last synced" shown).
6. Inspect the console for any errors or warnings.

**Expected Result:** Zero `[Error]` level messages in the browser console. Zero unhandled promise rejections. No `console.error` output from the application (including the calendar route's `console.error("Calendar fetch error:", error)`). React renders without hydration errors. The happy path from landing page through authenticated calendar view is entirely error-free.

**Acceptance Criterion:** The complete happy-path user journey produces no console errors, warnings, or unhandled rejections.

**Sprint:** Sprint 1

---

## Summary Table

| TC ID | Test Name | User Story | Type | Priority | Sprint |
|-------|-----------|------------|------|----------|--------|
| TC-FUNC-001 | Successful Google OAuth Flow End-to-End | US-001 | Positive | P1 | Sprint 1 |
| TC-FUNC-002 | Correct OAuth Scopes — `calendar.readonly` Only | US-001 | Positive | P1 | Sprint 1 |
| TC-FUNC-003 | Redirect to `/dashboard/calendar` After Consent | US-001 | Positive | P1 | Sprint 1 |
| TC-FUNC-004 | User Name and Avatar in Nav After Login | US-001 | Positive | P1 | Sprint 1 |
| TC-FUNC-005 | User Denies OAuth Consent — Graceful Handling | US-001 | Negative | P1 | Sprint 1 |
| TC-FUNC-006 | Invalid OAuth State Parameter — Rejected | US-001 | Negative | P1 | Sprint 1 |
| TC-FUNC-007 | OAuth Callback Missing `code` — Handled | US-001 | Negative | P1 | Sprint 1 |
| TC-FUNC-008 | User with No Google Calendar Events — No Crash | US-001 | Edge Case | P2 | Sprint 1 |
| TC-FUNC-009 | Google Account with 2FA — Works Normally | US-001 | Edge Case | P2 | Sprint 1 |
| TC-FUNC-010 | Very Long Display Name (100+ Chars) — No Layout Break | US-001 | Edge Case | P3 | Sprint 1 |
| TC-FUNC-011 | No Profile Picture — Fallback Avatar Shown | US-001 | Edge Case | P2 | Sprint 1 |
| TC-FUNC-012 | Signing In Twice — No Duplicate Sessions | US-001 | Regression | P2 | Sprint 1 |
| TC-FUNC-013 | Refresh Page — Still Authenticated | US-002 | Positive | P1 | Sprint 1 |
| TC-FUNC-014 | Close and Reopen Browser Tab — Still Authenticated | US-002 | Positive | P1 | Sprint 1 |
| TC-FUNC-015 | Session Includes User Email and Name | US-002 | Positive | P1 | Sprint 1 |
| TC-FUNC-016 | Manipulated Session Cookie — Rejected, Redirect | US-002 | Negative | P1 | Sprint 1 |
| TC-FUNC-017 | Session Expires — Redirect to Login, Not Error Page | US-002 | Edge Case | P1 | Sprint 1 |
| TC-FUNC-018 | `RefreshAccessTokenError` — Re-Auth Prompt Shown | US-002 | Edge Case | P1 | Sprint 1 |
| TC-FUNC-019 | Events from Google Calendar Appear in Day View | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-020 | Event Title Matches Google Calendar | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-021 | Event Start Time Correct (Timezone-Aware) | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-022 | Event End Time Correct | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-023 | Event Duration Matches (1hr = 1hr Block) | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-024 | Multiple Events All Render | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-025 | Attendee Count Shown for Events with Attendees | US-003 | Positive | P2 | Sprint 1 |
| TC-FUNC-026 | Events Ordered by Start Time | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-027 | Google Calendar API Error — Error State Shown | US-003 | Negative | P1 | Sprint 1 |
| TC-FUNC-028 | Expired Access Token — Refresh Triggered, Not 401 | US-003 | Negative | P1 | Sprint 1 |
| TC-FUNC-029 | Event with No Title — "Untitled event" Shown | US-003 | Edge Case | P2 | Sprint 1 |
| TC-FUNC-030 | All-Day Event — Handled Without Crash | US-003 | Edge Case | P2 | Sprint 1 |
| TC-FUNC-031 | New External Event Appears Within 15 Minutes | US-004 | Positive | P1 | Sprint 2 |
| TC-FUNC-032 | "Last Synced" Timestamp Updates After Each Fetch | US-004 | Positive | P1 | Sprint 2 |
| TC-FUNC-033 | Manual Refresh Button Triggers Immediate Re-Fetch | US-004 | Positive | P1 | Sprint 2 |
| TC-FUNC-034 | Loading Indicator Shown During Refresh | US-004 | Positive | P2 | Sprint 2 |
| TC-FUNC-035 | Refresh While Offline — Error Shown, Data Preserved | US-004 | Negative | P1 | Sprint 2 |
| TC-FUNC-036 | Rapid Manual Refreshes — No Duplicate Requests | US-004 | Edge Case | P2 | Sprint 2 |
| TC-FUNC-037 | GET Events Returns 200 with Correct Shape | US-003/004 | Positive | P1 | Sprint 1 |
| TC-FUNC-038 | GET Events Without Auth Returns 401 | US-003 | Negative | P1 | Sprint 1 |
| TC-FUNC-039 | Response Events Array Items Have Required Fields | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-040 | `start` and `end` Are Valid ISO Date Strings | US-003 | Positive | P1 | Sprint 1 |
| TC-FUNC-041 | `syncedAt` Is a Valid ISO Timestamp | US-004 | Positive | P1 | Sprint 2 |
| TC-FUNC-042 | Response Content-Type Is `application/json` | US-003 | Positive | P2 | Sprint 1 |
| TC-FUNC-043 | POST Events Returns 405 Method Not Allowed | US-003 | Negative | P2 | Sprint 1 |
| TC-FUNC-044 | GET Events with Expired Token — Refresh + 200 | US-003/002 | Positive | P1 | Sprint 1 |
| TC-FUNC-045 | Concurrent Requests — No Race Condition | US-004 | Edge Case | P2 | Sprint 2 |
| TC-FUNC-046 | Sign In → View → Sign Out → Sign In → Calendar Loads | US-001/002/003 | Regression | P1 | Sprint 1 |
| TC-FUNC-047 | Calendar Loads on Initial Auth — No Manual Refresh | US-003 | Regression | P1 | Sprint 1 |
| TC-FUNC-048 | Dashboard Accessible After Token Refresh — Seamless | US-002/003 | Regression | P1 | Sprint 1 |
| TC-FUNC-049 | Auth Middleware Blocks `/dashboard` Without Session | US-001/002 | Regression | P1 | Sprint 1 |
| TC-FUNC-050 | No Console Errors on Happy Path | US-001/002/003/004 | Regression | P1 | Sprint 1 |

---

## Coverage Matrix

| User Story | P1 Cases | P2 Cases | P3 Cases | Total |
|------------|----------|----------|----------|-------|
| US-001 Google Sign-In | 7 | 4 | 1 | 12 |
| US-002 Persistent Session | 5 | 0 | 1 | 6 |
| US-003 View Today's Events | 9 | 3 | 0 | 12 |
| US-004 Auto-Refresh | 3 | 2 | 1 | 6 |
| API Contract | 7 | 2 | 0 | 9 |
| Regression | 5 | 0 | 0 | 5 |
| **Total** | **36** | **11** | **3** | **50** |
