# DayFlow — DevOps & Deployment Test Cases

**Project:** DayFlow (Next.js 16 Calendar App)
**Repo:** github.com/anugrah97/DayFlow
**Stack:** Next.js 16 App Router · TypeScript (strict) · NextAuth.js v5 beta · googleapis · SWR · Tailwind CSS
**Sprints Covered:** Sprint 1 (Auth) · Sprint 2 (Calendar API)
**Total Test Cases:** 40 (TC-OPS-001 – TC-OPS-040)
**Last Updated:** 2026-04-19

---

## Table of Contents

1. [Build Verification](#1-build-verification-tc-ops-001--tc-ops-008)
2. [Environment Configuration](#2-environment-configuration-tc-ops-009--tc-ops-015)
3. [Dependency Audit](#3-dependency-audit-tc-ops-016--tc-ops-020)
4. [API Route Health](#4-api-route-health-tc-ops-021--tc-ops-027)
5. [Performance Baselines](#5-performance-baselines-tc-ops-028--tc-ops-033)
6. [Deployment Readiness](#6-deployment-readiness-tc-ops-034--tc-ops-040)

---

## 1. Build Verification (TC-OPS-001 – TC-OPS-008)

### TC-OPS-001: Clean Production Build Passes Without Errors

**Category:** Build
**Priority:** P1 (blocking)
**Precondition:** Valid `.env.local` present with all required variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`). `node_modules` installed via `npm ci`.
**Steps:**
1. From `web/`, run `npm run build`.
2. Observe terminal output until process exits.
3. Check exit code: `echo $?`.
**Expected Result:** Build exits with code `0`. Output contains `Route (app)` table listing all pages and API routes. No `Error:` or `Failed to compile` lines appear.
**Failure Indicator:** Non-zero exit code; any line starting with `Error:`, `Type error:`, or `Failed to compile` in stdout/stderr.
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-002: TypeScript Strict Mode Compliance

**Category:** Build
**Priority:** P1 (blocking)
**Precondition:** `tsconfig.json` has `"strict": true` (confirmed present). `node_modules` installed.
**Steps:**
1. From `web/`, run `npx tsc --noEmit`.
2. Observe all output until process exits.
3. Check exit code: `echo $?`.
**Expected Result:** Exit code `0`. Zero TypeScript diagnostic errors. `noEmit` flag ensures no output files are written.
**Failure Indicator:** Exit code `1` or any `error TS` lines; any implicit `any` types; any null-safety violations not handled (especially in `src/lib/auth.ts` token callbacks and `src/app/api/calendar/events/route.ts`).
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-003: No Unused Imports Causing Build Warnings

**Category:** Build
**Priority:** P2 (high)
**Precondition:** `node_modules` installed; ESLint config present (`eslint.config.mjs`).
**Steps:**
1. From `web/`, run `npx eslint src/ --max-warnings 0`.
2. Observe full output.
3. Check exit code.
**Expected Result:** Exit code `0`. Zero ESLint warnings or errors. No `no-unused-vars` or `@typescript-eslint/no-unused-vars` findings.
**Failure Indicator:** Exit code non-zero; any `warning` or `error` line from ESLint; specifically watch `src/lib/google-calendar.ts` (googleapis import) and `src/lib/auth.ts` (refreshAccessToken).
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-004: Build Succeeds With All Required Environment Variables Present

**Category:** Build / Environment
**Priority:** P1 (blocking)
**Precondition:** `.env.local` contains all four required variables with valid (even placeholder) values:
```
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret
NEXTAUTH_SECRET=test-secret-min-32-chars-long-here
NEXTAUTH_URL=http://localhost:3000
```
**Steps:**
1. Ensure `.env.local` is populated as above.
2. Run `npm run build`.
3. Verify exit code `0`.
**Expected Result:** Build completes successfully. Next.js `Route (app)` table shows: `/` (page), `/dashboard` (page), `/api/auth/[...nextauth]` (route), `/api/calendar/events` (route).
**Failure Indicator:** Build fails even with all env vars present; any route missing from the output table.
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-005: Missing `GOOGLE_CLIENT_ID` Produces Graceful Failure — Not Silent

**Category:** Build / Environment
**Priority:** P1 (blocking)
**Precondition:** `.env.local` exists but `GOOGLE_CLIENT_ID` is removed or empty. Other variables are valid.
**Steps:**
1. Remove or blank `GOOGLE_CLIENT_ID` from `.env.local`.
2. Run `npm run build`.
3. If build succeeds, start server via `npm start` and navigate to `http://localhost:3000`.
4. Attempt Google OAuth login.
**Expected Result:** Either (a) build fails with a descriptive error referencing the missing variable, or (b) build succeeds but OAuth sign-in returns a clear error page (e.g., `invalid_client` from Google) — not a blank screen or unhandled 500. The error must be surfaced to the developer/user, not silently swallowed.
**Failure Indicator:** App appears to work normally until a cryptic runtime crash occurs with no actionable message; or build silently succeeds and the OAuth page renders a generic 500 with a stack trace.
**Sprint:** Sprint 1

---

### TC-OPS-006: Missing `NEXTAUTH_SECRET` Produces Graceful Failure

**Category:** Build / Environment
**Priority:** P1 (blocking)
**Precondition:** `.env.local` exists but `NEXTAUTH_SECRET` is removed. Other variables are valid.
**Steps:**
1. Remove `NEXTAUTH_SECRET` from `.env.local`.
2. Run `npm run build`.
3. If build succeeds, run `npm start` and navigate to `http://localhost:3000`.
4. Attempt to access `/dashboard`.
**Expected Result:** NextAuth v5 should throw a startup error or sign-in error referencing the missing secret. The middleware protecting `/dashboard` should redirect to sign-in rather than crash. No unhandled exception with raw stack trace visible to the browser.
**Failure Indicator:** Server starts silently; `/dashboard` renders a raw Node.js error or blank white page; JWT operations silently fail without any user-visible error.
**Sprint:** Sprint 1

---

### TC-OPS-007: Missing `ANTHROPIC_API_KEY` Does Not Cause a Build Error

**Category:** Build / Dependency
**Priority:** P2 (high)
**Precondition:** `.env.local` is present with all Auth/Calendar variables but `ANTHROPIC_API_KEY` is omitted. `@anthropic-ai/sdk` is listed in `package.json` dependencies.
**Steps:**
1. Ensure `ANTHROPIC_API_KEY` is absent from `.env.local`.
2. Run `npm run build`.
3. Check exit code.
**Expected Result:** Build exits `0`. No error related to Anthropic SDK. This confirms the SDK is imported but not instantiated at build time (Sprint 3 feature, not yet wired into any executed route).
**Failure Indicator:** Build error or warning referencing `ANTHROPIC_API_KEY` or `@anthropic-ai/sdk`; any route attempting to initialize the Anthropic client at module load time.
**Sprint:** Sprint 2

---

### TC-OPS-008: Build Output Bundle Size Baseline

**Category:** Build / Performance
**Priority:** P3 (medium)
**Precondition:** Full production build completed successfully (`npm run build`).
**Steps:**
1. Run `npm run build` and capture the "Route (app)" size table from stdout.
2. Record the "First Load JS shared by all" figure.
3. Record individual route sizes for `/dashboard` and `/api/calendar/events`.
4. Store these baselines in this document (update table below) for regression comparison.
**Expected Result:**
- First Load JS shared: document initial value as baseline; flag if it grows more than 20% between sprints.
- `/dashboard` page bundle: < 150 KB (gzipped client JS, not including shared chunks).
- API routes (`/api/auth/[...nextauth]`, `/api/calendar/events`): shown as server-only (no client JS bundle reported).

| Route | Initial Baseline | Alert Threshold |
|---|---|---|
| First Load JS (shared) | TBD — record on first passing build | +20% from baseline |
| `/dashboard` page JS | TBD | 150 KB gzipped |
| `/api/calendar/events` | Server-only (0 KB client) | Any client JS reported |

**Failure Indicator:** First Load JS shared chunk grows by more than 20% without a corresponding new feature; client JS appears for any `/api/` route; build reports a bundle larger than 300 KB for the dashboard page.
**Sprint:** Sprint 2

---

## 2. Environment Configuration (TC-OPS-009 – TC-OPS-015)

### TC-OPS-009: App Starts Correctly With Valid `.env.local`

**Category:** Environment
**Priority:** P1 (blocking)
**Precondition:** Valid `.env.local` with all four required variables. `npm run build` has already passed.
**Steps:**
1. Run `npm start` (production mode).
2. Navigate to `http://localhost:3000`.
3. Verify the landing page renders.
4. Navigate to `http://localhost:3000/dashboard` and confirm redirect to sign-in (unauthenticated).
**Expected Result:** Server starts with `ready - started server on 0.0.0.0:3000`. Landing page returns HTTP 200. `/dashboard` redirects (HTTP 307) to the sign-in page without error.
**Failure Indicator:** Server fails to start; landing page returns 500; `/dashboard` throws an unhandled exception instead of redirecting.
**Sprint:** Sprint 1

---

### TC-OPS-010: App Fails With Clear Error When `.env.local` Is Missing

**Category:** Environment
**Priority:** P1 (blocking)
**Precondition:** `.env.local` has been renamed or deleted. All env vars are absent.
**Steps:**
1. Rename `.env.local` to `.env.local.bak`.
2. Run `npm run build` or `npm start`.
3. Observe output and any browser error when navigating to `http://localhost:3000`.
**Expected Result:** Either the build fails with a message indicating missing env configuration, OR the server starts but:
- Visiting `http://localhost:3000` renders the landing page (static, no env needed).
- Clicking "Sign in" immediately shows a clear NextAuth error page (not a 500).
- `/api/calendar/events` returns `{ "error": "Unauthorized" }` (401) since no valid session can exist without a secret.
**Failure Indicator:** App silently starts and attempts OAuth, producing a cryptic internal error; or any route crashes with a raw stack trace instead of a structured error response.
**Sprint:** Sprint 1

---

### TC-OPS-011: `NEXTAUTH_URL` Mismatch Causes Predictable OAuth Redirect Failure

**Category:** Environment / Config
**Priority:** P1 (blocking)
**Precondition:** App is running on `http://localhost:3000` but `NEXTAUTH_URL` is set to `http://localhost:4000`.
**Steps:**
1. Set `NEXTAUTH_URL=http://localhost:4000` in `.env.local`.
2. Start app on port 3000: `npm start`.
3. Navigate to `http://localhost:3000`, initiate Google OAuth sign-in.
4. After Google consent, observe where the callback is directed.
**Expected Result:** Google redirects to `http://localhost:4000/api/auth/callback/google` (port 4000), which is not listening. Browser shows a connection refused / ERR_CONNECTION_REFUSED error. The failure is clear and traceable to the URL mismatch — not an opaque 500 from the app.
**Failure Indicator:** App silently accepts the misconfigured redirect and appears to sign in (JWT written with wrong origin); or an unrelated error message obscures the true cause.
**Sprint:** Sprint 1

---

### TC-OPS-012: `NEXTAUTH_URL=localhost` in Production Environment Is Detectable

**Category:** Environment / Deployment
**Priority:** P2 (high)
**Precondition:** A production deployment (or staging environment) where `NEXTAUTH_URL` incorrectly contains `localhost`.
**Steps:**
1. Search the codebase for any hardcoded `http://localhost` in non-env files:
   ```bash
   grep -r "http://localhost" web/src/ web/next.config.ts
   ```
2. In a staging environment, set `NEXTAUTH_URL=http://localhost:3000` and deploy.
3. Attempt Google OAuth.
4. Observe Google's OAuth response — Google will reject the redirect URI since `localhost` is not a registered production redirect URI.
**Expected Result:** Step 1 returns zero results (no hardcoded localhost in source). Step 3-4 produces a Google OAuth error: `redirect_uri_mismatch` — a clear, actionable failure. The production app does not silently fall back to any localhost behavior.
**Failure Indicator:** Step 1 finds hardcoded localhost URLs in source files; or the app silently processes a localhost redirect in a production environment without error.
**Sprint:** Sprint 1

---

### TC-OPS-013: Invalid `GOOGLE_CLIENT_SECRET` Returns OAuth Consent Screen Error — Not HTTP 500

**Category:** Environment / Auth
**Priority:** P1 (blocking)
**Precondition:** `GOOGLE_CLIENT_ID` is valid; `GOOGLE_CLIENT_SECRET` is set to a syntactically valid but incorrect value (e.g., `GOCSPX-invalidvalue`). `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are correct.
**Steps:**
1. Set `GOOGLE_CLIENT_SECRET=GOCSPX-invalidvalue` in `.env.local`.
2. Start the app and navigate to sign-in.
3. Complete the Google OAuth consent screen (Google will accept the authorization code request).
4. Observe the callback handling at `/api/auth/callback/google`.
**Expected Result:** NextAuth exchanges the authorization code with Google using the wrong secret; Google returns `invalid_client` or `unauthorized_client`. NextAuth surfaces this as an auth error page (e.g., `/auth/error?error=OAuthCallbackError`). The user sees a clear error page. HTTP status is 4xx, not 500.
**Failure Indicator:** The server returns HTTP 500 with a raw stack trace; the error page is blank; the app appears to sign in successfully despite the invalid secret.
**Sprint:** Sprint 1

---

### TC-OPS-014: Expired Google Access Token Triggers Automatic Refresh

**Category:** Environment / Auth
**Priority:** P1 (blocking)
**Precondition:** User is authenticated. The JWT stored in the session has an `accessTokenExpires` timestamp in the past. `refreshToken` is present and valid in the JWT. This is verifiable via `src/lib/auth.ts` — the `jwt` callback checks `Date.now() < token.accessTokenExpires * 1000`.
**Steps:**
1. Authenticate via Google OAuth to obtain a valid session.
2. Manually set the system clock forward by 2 hours (or mock `Date.now()` in a test environment), or wait for the 1-hour token expiry.
3. Navigate to `/dashboard` and trigger a calendar data fetch (`GET /api/calendar/events`).
4. Monitor server logs for `refreshAccessToken` being called.
5. Verify the response is `200 OK` with event data (not `401`).
**Expected Result:** The `jwt` callback in `src/lib/auth.ts` detects `accessTokenExpires` is in the past and calls `refreshAccessToken()`. A new `accessToken` is obtained from Google's token endpoint. The `/api/calendar/events` route succeeds with HTTP 200 and valid event data. Server logs show no `RefreshAccessTokenError`.
**Failure Indicator:** The route returns `401 Unauthorized` after token expiry; the server logs `RefreshAccessTokenError`; the refresh token is not sent to Google's token endpoint; the user is silently logged out without redirection to sign-in.
**Sprint:** Sprint 2

---

### TC-OPS-015: All Secrets Are Excluded From Git (`.gitignore` Audit)

**Category:** Environment / Security
**Priority:** P1 (blocking)
**Precondition:** Local `.env.local` file exists with real credentials.
**Steps:**
1. Inspect `web/.gitignore` — verify `.env*` pattern is present (confirmed: `.env*` is in `.gitignore`).
2. Run `git status` from the repo root and confirm `.env.local` is NOT listed as a tracked or untracked file.
3. Run `git log --all --full-history -- "**/.env*"` to confirm no `.env` file has ever been committed.
4. Run `git ls-files | grep -E "\.env"` to confirm no env file is currently tracked.
5. Verify `package-lock.json` does NOT contain any secret values (sanity check).
**Expected Result:** All four steps return clean results. `.env.local` is untracked and gitignored. No historical commit contains an `.env*` file. `git ls-files` returns zero results matching `.env`.
**Failure Indicator:** Any `.env*` file appears in `git ls-files`; `git log` reveals a historical commit with an env file; secrets are found embedded in any committed file.
**Sprint:** Sprint 1

---

## 3. Dependency Audit (TC-OPS-016 – TC-OPS-020)

### TC-OPS-016: `npm audit` Returns Zero Critical or High Vulnerabilities

**Category:** Dependency
**Priority:** P1 (blocking)
**Precondition:** `node_modules` installed via `npm ci`. Current `package-lock.json` is committed.
**Steps:**
1. From `web/`, run `npm audit --audit-level=high`.
2. Observe full output and exit code.
3. If vulnerabilities are found, run `npm audit --json | jq '.metadata.vulnerabilities'` for a structured count.
**Expected Result:** `npm audit --audit-level=high` exits with code `0`. Zero high or critical severity findings. Moderate and low severity findings are documented and accepted if no fix is available (especially for transitive dependencies of `next-auth@5.0.0-beta.31`).
**Failure Indicator:** Exit code non-zero with any `high` or `critical` finding; any direct dependency (`next-auth`, `next`, `googleapis`, `react`) with a critical CVE.
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-017: All Dependencies Have Pinned or Range-Bounded Versions — No `*` or `latest`

**Category:** Dependency
**Priority:** P2 (high)
**Precondition:** `web/package.json` is the source of truth.
**Steps:**
1. Open `web/package.json` and inspect all entries under `dependencies` and `devDependencies`.
2. Check that no value is `"*"`, `"latest"`, or an empty string.
3. Verify all versions use semver ranges (`^`, `~`, or exact) with a base version specified.
**Expected Result:** Every dependency entry has an explicit base version (e.g., `"^5.0.0-beta.31"`, `"16.2.4"`, `"^2.4.1"`). Zero `"*"` or `"latest"` values. This is confirmed by current `package.json` inspection.
**Failure Indicator:** Any dependency value of `"*"`, `"latest"`, or `""` found in `package.json`.
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-018: `next-auth` Beta Version Is Pinned — Not Floating

**Category:** Dependency
**Priority:** P1 (blocking)
**Precondition:** `web/package.json` exists.
**Steps:**
1. Read the `next-auth` entry in `package.json` — currently `"^5.0.0-beta.31"`.
2. Verify that `package-lock.json` resolves `next-auth` to exactly `5.0.0-beta.31` (or a known-good beta patch).
3. Run `npm ls next-auth` to confirm the resolved version.
4. Document the locked version as: **`next-auth@5.0.0-beta.31`**.
**Expected Result:** `npm ls next-auth` shows exactly one version (no duplicates). The resolved version matches the intent in `package.json`. The `^` range is acceptable here only because `package-lock.json` pins the exact version at install time.
**Failure Indicator:** `npm ls next-auth` shows multiple versions (e.g., a transitive dependency pulling a different beta); `package-lock.json` resolves to a higher beta than tested (e.g., `beta.35`) due to `npm install` being run without `--save-exact`.
**Sprint:** Sprint 1

---

### TC-OPS-019: No Duplicate Major Versions of React

**Category:** Dependency
**Priority:** P2 (high)
**Precondition:** `node_modules` installed.
**Steps:**
1. Run `npm ls react` from `web/`.
2. Check that only one major version of React is present (currently `react@19.2.4`).
3. Run `npm ls react-dom` and verify it matches the React version.
4. Check that `next-auth@5.0.0-beta.31` peer dependency on React is satisfied by `react@19.x`.
**Expected Result:** `npm ls react` shows exactly one version: `19.2.4` (or `19.x.x`). `npm ls react-dom` shows `19.2.4`. No `WARN` about unmet peer dependencies for React.
**Failure Indicator:** Two or more distinct React versions listed (e.g., `react@18.x` hoisted by a transitive dep alongside `react@19.x`); `WARN unmet peer dependency` for React in `npm ls` output.
**Sprint:** Sprint 1

---

### TC-OPS-020: Lock File (`package-lock.json`) Is Committed to Git

**Category:** Dependency / Deployment
**Priority:** P1 (blocking)
**Precondition:** Git repo initialized. Local `web/package-lock.json` exists.
**Steps:**
1. Run `git ls-files web/package-lock.json` (or `git ls-files package-lock.json` if run from `web/`).
2. Verify the file appears in git-tracked files output.
3. Run `git diff HEAD -- web/package-lock.json` to ensure the committed lock file matches the current one.
**Expected Result:** `git ls-files` returns `web/package-lock.json` (or equivalent). `git diff` shows no differences — the committed lock file is in sync with the installed state. This ensures reproducible installs via `npm ci` in any deployment environment.
**Failure Indicator:** `git ls-files` returns empty (lock file is not tracked); `git diff` shows the committed lock file differs from the current one (npm install was run locally without committing the updated lock).
**Sprint:** Sprint 1

---

## 4. API Route Health (TC-OPS-021 – TC-OPS-027)

### TC-OPS-021: `GET /api/auth/[...nextauth]` Responds to OPTIONS (CORS Preflight)

**Category:** API Route Health
**Priority:** P2 (high)
**Precondition:** App is running locally (`npm start` or `npm run dev`). Route is `src/app/api/auth/[...nextauth]/route.ts` which exports `GET` and `POST` from NextAuth handlers.
**Steps:**
1. Run: `curl -X OPTIONS http://localhost:3000/api/auth/providers -i -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET"`
2. Observe HTTP status code and response headers.
**Expected Result:** HTTP 200 or 204 response. Response headers include security headers set in `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`). No CORS error for same-origin requests. Note: cross-origin CORS is intentionally not configured (DayFlow is not a public API), so cross-origin requests should be blocked.
**Failure Indicator:** HTTP 500 or connection refused; missing security headers; an unexpected CORS wildcard (`Access-Control-Allow-Origin: *`) header.
**Sprint:** Sprint 1

---

### TC-OPS-022: `GET /api/calendar/events` Returns 401 Without a Valid Session

**Category:** API Route Health
**Priority:** P1 (blocking)
**Precondition:** App running. No session cookie present (unauthenticated request).
**Steps:**
1. Run: `curl -X GET http://localhost:3000/api/calendar/events -i`
2. Observe HTTP status code and response body.
**Expected Result:** HTTP 401. Response body: `{"error":"Unauthorized"}`. `Content-Type: application/json` header present. The route correctly uses `getToken()` from `next-auth/jwt`, which returns `null` when no valid session exists.
**Failure Indicator:** HTTP 200 returned without authentication; HTTP 500; response body is not valid JSON; no `Content-Type: application/json` header.
**Sprint:** Sprint 2

---

### TC-OPS-023: `GET /api/calendar/events` Returns 200 With a Valid Session

**Category:** API Route Health
**Priority:** P1 (blocking)
**Precondition:** App running. A valid authenticated session exists (user has completed Google OAuth). Session cookie is available. Google Calendar has at least one event for today (or the Google account is accessible).
**Steps:**
1. Authenticate via the browser (complete Google OAuth).
2. Copy the session cookie from browser DevTools (Network tab, cookie header from any `/api/` request).
3. Run: `curl -X GET http://localhost:3000/api/calendar/events -i -H "Cookie: <session-cookie>"`
4. Observe HTTP status and response body.
**Expected Result:** HTTP 200. Response body: `{"events": [...], "syncedAt": "<ISO-timestamp>"}`. If no events exist today, `events` is an empty array `[]` — not null or absent. `syncedAt` is a valid ISO 8601 string.
**Failure Indicator:** HTTP 401 despite a valid session; HTTP 500; `events` field is null or missing from response; `syncedAt` is absent; response is not valid JSON.
**Sprint:** Sprint 2

---

### TC-OPS-024: `POST /api/calendar/events` Returns 405 Method Not Allowed

**Category:** API Route Health
**Priority:** P2 (high)
**Precondition:** App running. `src/app/api/calendar/events/route.ts` only exports `GET` (confirmed in source — no `POST` export).
**Steps:**
1. Run: `curl -X POST http://localhost:3000/api/calendar/events -i -H "Content-Type: application/json" -d '{}'`
2. Observe HTTP status code.
**Expected Result:** HTTP 405 Method Not Allowed. This is the default Next.js App Router behavior when a method is not exported from a route module. Response should include an `Allow: GET` header.
**Failure Indicator:** HTTP 200 (method incorrectly handled); HTTP 500; any mutation of calendar data; a missing or incorrect `Allow` header.
**Sprint:** Sprint 2

---

### TC-OPS-025: All API Routes Return `application/json` Content-Type Header

**Category:** API Route Health
**Priority:** P2 (high)
**Precondition:** App running.
**Steps:**
1. `curl -I http://localhost:3000/api/calendar/events` — check `Content-Type` header.
2. `curl -I http://localhost:3000/api/auth/providers` — check `Content-Type` header.
3. Trigger a 401 from `/api/calendar/events` (unauthenticated): check `Content-Type` of the error response.
4. Trigger a 405 on `/api/calendar/events` (POST method): check `Content-Type`.
**Expected Result:** Every API response — success and error — includes `Content-Type: application/json` (or `application/json; charset=utf-8`). No API route returns `text/html` or `text/plain` for any status code.
**Failure Indicator:** Any API route returns `Content-Type: text/html` (indicates Next.js returned an HTML error page instead of a JSON response); missing `Content-Type` header.
**Sprint:** Sprint 2

---

### TC-OPS-026: Error Responses Include Consistent `{ error: string }` Shape

**Category:** API Route Health
**Priority:** P2 (high)
**Precondition:** App running. Source: `src/app/api/calendar/events/route.ts` returns `{ error: "Unauthorized" }` (401) and `{ error: "Failed to fetch calendar" }` (500).
**Steps:**
1. Send unauthenticated request to `/api/calendar/events` — verify body is `{"error":"Unauthorized"}`.
2. With a valid session, simulate a Google API failure (e.g., revoke Google access for the test account) and call `/api/calendar/events` — verify body is `{"error":"Failed to fetch calendar"}`.
3. Parse each response body and confirm the top-level key is exactly `"error"` with a string value.
**Expected Result:** All error responses across all API routes strictly conform to `{ "error": "<human-readable string>" }`. No additional fields (e.g., `stack`, `message`, `code`) appear in the response body.
**Failure Indicator:** Error body uses a different shape (`{ "message": "..." }`, `{ "err": "..." }`); extra fields like `stack` or `details` are present in the response; body is empty or non-JSON.
**Sprint:** Sprint 2

---

### TC-OPS-027: No Stack Traces in Production API Error Responses

**Category:** API Route Health / Security
**Priority:** P1 (blocking)
**Precondition:** App running in production mode (`npm start`, not `npm run dev`). `NODE_ENV=production`.
**Steps:**
1. With a valid authenticated session, revoke the Google OAuth access token externally (via myaccount.google.com/permissions).
2. Call `GET /api/calendar/events` — this should trigger the `catch` block in the route handler.
3. Inspect the full response body.
4. Also check server-side logs (stdout) to confirm `console.error` fires on the server but is NOT included in the HTTP response.
**Expected Result:** HTTP 500. Response body is exactly `{"error":"Failed to fetch calendar"}`. No `stack`, `code`, `details`, or Node.js internal error information in the response body. Server logs (stdout/stderr) contain the full error for debugging, but these are never forwarded to the client.
**Failure Indicator:** Response body contains `stack` property; response body contains the raw Google API error object; `NODE_ENV` is `development` in a deployed environment (causes Next.js to include error details in responses).
**Sprint:** Sprint 2

---

## 5. Performance Baselines (TC-OPS-028 – TC-OPS-033)

### TC-OPS-028: Dashboard Calendar Page Time to First Byte (TTFB) < 500ms

**Category:** Performance
**Priority:** P2 (high)
**Precondition:** App running in production mode (`npm start`). Authenticated session present. Local machine (no network latency to server).
**Steps:**
1. Open browser DevTools → Network tab.
2. Navigate to `http://localhost:3000/dashboard` with a valid session.
3. Find the initial HTML document request in the Network tab.
4. Record the "Waiting (TTFB)" time from the Timing breakdown.
5. Repeat 5 times and take the median.
**Expected Result:** Median TTFB < 500ms for the dashboard page when running locally. Since `/dashboard` is server-rendered via Next.js App Router and does not fetch calendar data during SSR (data is fetched client-side via SWR), TTFB should be under 100ms locally.
**Failure Indicator:** TTFB consistently > 500ms on local machine (indicates blocking server-side work during render); TTFB > 2000ms (indicates the dashboard is making a synchronous Google API call during SSR).
**Sprint:** Sprint 2

---

### TC-OPS-029: `/api/calendar/events` Response Time < 3 Seconds

**Category:** Performance
**Priority:** P2 (high)
**Precondition:** Authenticated session. Active internet connection (Google Calendar API is external). Test account has a realistic number of events (< 50 for today).
**Steps:**
1. Using `curl` with timing: `curl -w "\n%{time_total}" -s -o /dev/null http://localhost:3000/api/calendar/events -H "Cookie: <session>"`
2. Run 5 times and record all total times.
3. Calculate the p95 (95th percentile) response time.
**Expected Result:** p95 response time < 3000ms (3 seconds). The Google Calendar API typically responds in 300–800ms. The overhead of `getToken()` + `googleapis` SDK call should not add more than 500ms total.
**Failure Indicator:** Any single request takes > 5 seconds; p95 > 3 seconds; response time grows linearly with calendar event count (N+1 pattern — see TC-OPS-032).
**Sprint:** Sprint 2

---

### TC-OPS-030: SWR Auto-Refresh Does Not Fire on Hidden/Backgrounded Tab

**Category:** Performance / Client Behavior
**Priority:** P2 (high)
**Precondition:** Dashboard is loaded and SWR is fetching `/api/calendar/events`. SWR is configured in the dashboard's calendar component.
**Steps:**
1. Open the dashboard in a browser tab with DevTools Network tab open.
2. Observe SWR polling interval — note requests to `/api/calendar/events` in Network tab.
3. Switch to another browser tab (background the DayFlow tab).
4. Wait for 2x the SWR refresh interval.
5. Switch back to the DayFlow tab and observe if any requests fired while backgrounded.
**Expected Result:** SWR's `revalidateOnFocus: true` (default) means a request fires when the tab is re-focused, which is correct. However, SWR's `focusThrottleInterval` should prevent excessive re-fetches. Most importantly: if a `refreshInterval` is configured, SWR should respect `visibilitychange` events and pause polling when the tab is hidden (SWR v2 default behavior).
**Failure Indicator:** Network requests to `/api/calendar/events` continue at full polling rate while the tab is hidden in the background (wasting Google API quota); requests fire more than once per focus event.
**Sprint:** Sprint 2

---

### TC-OPS-031: Client-Side JavaScript Bundle < 300KB Gzipped

**Category:** Performance / Build
**Priority:** P2 (high)
**Precondition:** Production build completed (`npm run build`).
**Steps:**
1. Run `npm run build` and capture the "First Load JS" column from the build output.
2. Alternatively, use `npx @next/bundle-analyzer` (if configured) or inspect `.next/static/chunks/` directory sizes.
3. Sum up: First Load JS shared + dashboard page-specific JS.
4. If gzip estimates are not shown by Next.js, use: `gzip -c .next/static/chunks/main-*.js | wc -c` for an approximation.
**Expected Result:** Total client-side JS delivered for the dashboard page (First Load JS shared + page chunk) is less than 300KB gzipped. Next.js build output shows this figure directly in the route table.
**Failure Indicator:** Total gzipped client JS exceeds 300KB; `@anthropic-ai/sdk` (a server-only dependency) appears in the client bundle (would add ~200KB+); `googleapis` appears in the client bundle.
**Sprint:** Sprint 2

---

### TC-OPS-032: No N+1 API Calls on Calendar Page Load — Single Calendar API Request

**Category:** Performance / API
**Priority:** P2 (high)
**Precondition:** Authenticated session. Dashboard page loaded for the first time (no cache).
**Steps:**
1. Open DayFlow dashboard in an incognito window with DevTools Network tab open.
2. Clear all requests and perform a hard refresh (Cmd+Shift+R) of the dashboard.
3. Filter Network requests by the pattern `/api/calendar/events`.
4. Count the total number of requests to this endpoint during the initial page load (within the first 5 seconds).
**Expected Result:** Exactly 1 request to `GET /api/calendar/events` on initial page load. SWR fires once on mount; no duplicate requests from React StrictMode double-invocation (production mode does not use StrictMode double-invoke); no requests from multiple component instances mounting simultaneously.
**Failure Indicator:** 2 or more requests to `/api/calendar/events` within 5 seconds of initial page load without user interaction; requests fire in rapid succession (< 100ms apart) suggesting multiple component mounts.
**Sprint:** Sprint 2

---

### TC-OPS-033: Google Avatar Served Via Next.js Image Optimization — Not Raw URL

**Category:** Performance / Image Optimization
**Priority:** P3 (medium)
**Precondition:** Authenticated session. User has a Google profile picture. `next.config.ts` has `images.remotePatterns` configured for `lh3.googleusercontent.com`.
**Steps:**
1. Log in and navigate to the dashboard or any page showing the user's avatar.
2. Open DevTools and inspect the `<img>` element (or `<Image>` from `next/image`) rendering the Google avatar.
3. Check the `src` attribute of the rendered image element.
4. Observe the Network tab for the image request.
**Expected Result:** The avatar `src` attribute points to `/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2F...&w=...&q=...` — the Next.js Image Optimization endpoint. The image is served via `/_next/image`, not directly from `lh3.googleusercontent.com`. This confirms `next/image` is used (not a raw `<img>` tag), enabling WebP conversion and size optimization.
**Failure Indicator:** The `src` attribute is a direct `https://lh3.googleusercontent.com/...` URL (bypassing Next.js Image Optimization); a raw `<img>` tag is used instead of Next.js `<Image>` component; image returns 400 from `/_next/image` (indicates `remotePatterns` misconfiguration).
**Sprint:** Sprint 1 / Sprint 2

---

## 6. Deployment Readiness (TC-OPS-034 – TC-OPS-040)

### TC-OPS-034: `next build && next start` Works Without Dev Dependencies Installed

**Category:** Deployment
**Priority:** P1 (blocking)
**Precondition:** Production environment simulation. Dev dependencies (`typescript`, `eslint`, `tailwindcss`, `@types/*`) are NOT installed — only `dependencies` from `package.json`.
**Steps:**
1. In a clean directory (or Docker container), copy the project.
2. Run `npm ci --omit=dev` to install production dependencies only.
3. Run `npx next build`.
4. Run `npx next start`.
5. Verify `http://localhost:3000` serves the application.
**Expected Result:** Build and start succeed without dev dependencies. Next.js compiles TypeScript and Tailwind at build time (they are only needed for the build step, not runtime). In practice, `npm run build` in CI should run with full dependencies for compilation, then production containers run `npm start` with only `dependencies`. Document which deps are truly needed at runtime vs. build time.
**Failure Indicator:** `next start` fails because a dev dependency is missing at runtime; any `Cannot find module` error for `typescript` or `eslint` during `next start`.
**Sprint:** Sprint 2

---

### TC-OPS-035: No Hardcoded `localhost` URLs in Source Files

**Category:** Deployment / Config
**Priority:** P1 (blocking)
**Precondition:** Source tree is `web/src/`.
**Steps:**
1. Run: `grep -rn "http://localhost" web/src/ web/next.config.ts web/tsconfig.json`
2. Run: `grep -rn "localhost:3000" web/src/ web/next.config.ts`
3. Review any matches to determine if they are in comments, test files, or actual runtime code.
**Expected Result:** Zero matches in any non-comment, non-test source file. All environment-specific URLs (OAuth callback URL, API base URL) are sourced from `process.env.NEXTAUTH_URL` or equivalent env variables. `next.config.ts` does not contain hardcoded `localhost`.
**Failure Indicator:** Any `http://localhost` found in `src/lib/auth.ts`, `src/middleware.ts`, `next.config.ts`, or any component file that is not inside a comment or conditional `process.env.NODE_ENV === 'development'` guard.
**Sprint:** Sprint 1

---

### TC-OPS-036: All Routes Return Correct HTTP Status Codes

**Category:** Deployment / API
**Priority:** P1 (blocking)
**Precondition:** App running in production mode. Test matrix below.
**Steps:**
1. Test each route in the table below and verify the HTTP status code matches expectations.

| Route | Method | Auth State | Expected Status |
|---|---|---|---|
| `/` | GET | Any | 200 |
| `/dashboard` | GET | Unauthenticated | 307 (redirect to sign-in) |
| `/dashboard` | GET | Authenticated | 200 |
| `/api/auth/providers` | GET | Any | 200 |
| `/api/auth/[...nextauth]` | POST | Any | 200 (sign-in flow) |
| `/api/calendar/events` | GET | Unauthenticated | 401 |
| `/api/calendar/events` | GET | Authenticated | 200 |
| `/api/calendar/events` | POST | Any | 405 |
| `/nonexistent-page` | GET | Any | 404 |

2. For each row, use `curl -s -o /dev/null -w "%{http_code}"` to capture status codes.
**Expected Result:** Every row matches the Expected Status column exactly. No route returns 500 for any of the above scenarios.
**Failure Indicator:** Any row shows a status code different from expected (e.g., `/dashboard` returning 200 to unauthenticated users — indicates middleware failure; `/api/calendar/events` returning 200 to unauthenticated requests — critical auth bypass).
**Sprint:** Sprint 1 / Sprint 2

---

### TC-OPS-037: 404 Page Exists and Renders Correctly

**Category:** Deployment
**Priority:** P3 (medium)
**Precondition:** App running. Either a custom `not-found.tsx` exists in `src/app/` or Next.js default 404 is used.
**Steps:**
1. Navigate to `http://localhost:3000/this-page-does-not-exist` in a browser.
2. Inspect the HTTP status code (DevTools → Network → first request).
3. Confirm the page renders without a JavaScript error in the console.
4. Verify the page includes a navigation element back to the home page.
**Expected Result:** HTTP 404 status. A user-friendly error page renders (custom or Next.js default). No JavaScript console errors. Page includes a way to navigate home. The page respects the same layout and styling as the rest of the app (if a custom `not-found.tsx` is implemented).
**Failure Indicator:** HTTP 200 returned for a non-existent route (indicates a catch-all route is too greedy); HTTP 500; bare Next.js error page visible without branding; JavaScript console errors on the 404 page.
**Sprint:** Sprint 2

---

### TC-OPS-038: Middleware Runs at Edge Runtime — Confirmed in Build Output

**Category:** Deployment / Performance
**Priority:** P2 (high)
**Precondition:** Production build completed (`npm run build`). Source: `src/middleware.ts` exports `auth as middleware` from `src/lib/auth.ts`. Middleware `config.matcher` protects `/dashboard/:path*`.
**Steps:**
1. Run `npm run build`.
2. Search the build output for a line containing `middleware` and the runtime identifier.
3. Alternatively, look for `.next/server/middleware.js` (Node.js runtime) vs. `.next/edge-runtime-webpack/` (Edge runtime).
4. Check `next.config.ts` for any `experimental.runtime` configuration.
**Expected Result:** Build output mentions `Middleware` as an Edge function (Next.js 16 App Router runs middleware at the Edge by default). Middleware does not require Node.js-specific APIs. The `auth` export from NextAuth v5 beta is compatible with the Edge runtime.
**Failure Indicator:** Build warns that middleware is falling back to Node.js runtime; middleware uses `fs`, `crypto` (Node.js built-ins not available at Edge), or any other non-Edge-compatible API; middleware file size exceeds Next.js Edge runtime limits (1MB).
**Sprint:** Sprint 1

---

### TC-OPS-039: `robots.txt` and `sitemap.xml` Appropriately Restrict Auth-Gated Content

**Category:** Deployment / SEO
**Priority:** P3 (medium)
**Precondition:** App running in production mode. DayFlow is an authenticated app — all meaningful content is behind `/dashboard` which requires Google OAuth.
**Steps:**
1. Navigate to `http://localhost:3000/robots.txt`.
2. Navigate to `http://localhost:3000/sitemap.xml`.
3. Verify the content of each.
**Expected Result:**
- `robots.txt`: Should disallow crawling of `/dashboard` and `/api/` paths. A minimal acceptable `robots.txt`: `User-agent: * Disallow: /dashboard Disallow: /api/`. If no `robots.txt` exists yet, document this as a deployment prerequisite.
- `sitemap.xml`: Should only include the public landing page (`/`). Should NOT include `/dashboard` or any auth callback URLs.
- Acceptable alternative: `robots.txt` with `Disallow: /` for the entire app (since the app is fully auth-gated and has no public SEO value).
**Failure Indicator:** `robots.txt` allows crawling of `/dashboard` (Google may index session-required pages and surface them in search results); `sitemap.xml` includes `/api/auth/` callback URLs; neither file exists (not a hard failure, but a deployment gap to document).
**Sprint:** Sprint 2

---

### TC-OPS-040: HTTPS Redirect Configured for Production — HSTS Header Present

**Category:** Deployment / Security
**Priority:** P1 (blocking)
**Precondition:** Production deployment with a real domain and TLS certificate (e.g., deployed to Vercel, Railway, or a cloud provider). This test cannot be fully verified on localhost.
**Steps:**
1. On the production domain, run: `curl -I http://<production-domain>/` (plain HTTP).
2. Verify the response is a redirect (301 or 308) to `https://<production-domain>/`.
3. On the HTTPS URL, run: `curl -I https://<production-domain>/` and inspect response headers.
4. Confirm `Strict-Transport-Security` (HSTS) header is present.
5. Verify `next.config.ts` security headers are present on all routes (as configured under `source: "/(.*)"` — confirmed in current `next.config.ts`).
**Expected Result:**
- HTTP → HTTPS redirect: HTTP 301 or 308.
- HSTS header present: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- All security headers from `next.config.ts` are present: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy` (as configured), `Permissions-Policy`.
- `Powered-By` header is absent (configured via `poweredByHeader: false` in `next.config.ts`).
**Failure Indicator:** HTTP requests are served without redirect (no forced HTTPS); HSTS header is missing or has `max-age=0`; `X-Frame-Options` header is absent; `X-Powered-By: Next.js` header is present (information disclosure); CSP header is missing.
**Sprint:** Sprint 1 / Sprint 2

---

## Summary Table

| ID | Name | Category | Priority | Sprint |
|---|---|---|---|---|
| TC-OPS-001 | Clean Production Build Passes | Build | P1 | S1/S2 |
| TC-OPS-002 | TypeScript Strict Mode Compliance | Build | P1 | S1/S2 |
| TC-OPS-003 | No Unused Imports Causing Warnings | Build | P2 | S1/S2 |
| TC-OPS-004 | Build Succeeds With All Env Vars | Build / Env | P1 | S1/S2 |
| TC-OPS-005 | Missing GOOGLE_CLIENT_ID — Graceful Failure | Build / Env | P1 | S1 |
| TC-OPS-006 | Missing NEXTAUTH_SECRET — Graceful Failure | Build / Env | P1 | S1 |
| TC-OPS-007 | Missing ANTHROPIC_API_KEY — No Build Error | Build / Dep | P2 | S2 |
| TC-OPS-008 | Build Output Bundle Size Baseline | Build / Perf | P3 | S2 |
| TC-OPS-009 | App Starts With Valid .env.local | Environment | P1 | S1 |
| TC-OPS-010 | App Fails Clearly With Missing .env.local | Environment | P1 | S1 |
| TC-OPS-011 | NEXTAUTH_URL Mismatch — Predictable Failure | Env / Config | P1 | S1 |
| TC-OPS-012 | NEXTAUTH_URL=localhost in Production | Env / Deploy | P2 | S1 |
| TC-OPS-013 | Invalid GOOGLE_CLIENT_SECRET — OAuth Error | Env / Auth | P1 | S1 |
| TC-OPS-014 | Expired Token Triggers Auto-Refresh | Env / Auth | P1 | S2 |
| TC-OPS-015 | All Secrets Excluded From Git | Env / Security | P1 | S1 |
| TC-OPS-016 | npm audit — Zero Critical/High Vulns | Dependency | P1 | S1/S2 |
| TC-OPS-017 | All Deps Have Pinned Versions | Dependency | P2 | S1/S2 |
| TC-OPS-018 | next-auth Beta Version Pinned | Dependency | P1 | S1 |
| TC-OPS-019 | No Duplicate React Major Versions | Dependency | P2 | S1 |
| TC-OPS-020 | package-lock.json Committed to Git | Dep / Deploy | P1 | S1 |
| TC-OPS-021 | Auth Route Responds to OPTIONS | API Health | P2 | S1 |
| TC-OPS-022 | Calendar Events Returns 401 — No Session | API Health | P1 | S2 |
| TC-OPS-023 | Calendar Events Returns 200 — Valid Session | API Health | P1 | S2 |
| TC-OPS-024 | POST Calendar Events Returns 405 | API Health | P2 | S2 |
| TC-OPS-025 | All API Routes Return JSON Content-Type | API Health | P2 | S2 |
| TC-OPS-026 | Error Responses Use Consistent Shape | API Health | P2 | S2 |
| TC-OPS-027 | No Stack Traces in Production Responses | API Health / Security | P1 | S2 |
| TC-OPS-028 | Dashboard TTFB < 500ms | Performance | P2 | S2 |
| TC-OPS-029 | Calendar Events Response Time < 3s | Performance | P2 | S2 |
| TC-OPS-030 | SWR Does Not Poll on Hidden Tab | Performance | P2 | S2 |
| TC-OPS-031 | Client JS Bundle < 300KB Gzipped | Performance | P2 | S2 |
| TC-OPS-032 | No N+1 Calls on Calendar Page Load | Performance | P2 | S2 |
| TC-OPS-033 | Google Avatar Served Via Next.js Image | Performance | P3 | S1/S2 |
| TC-OPS-034 | next start Works Without Dev Deps | Deployment | P1 | S2 |
| TC-OPS-035 | No Hardcoded localhost in Source Files | Deploy / Config | P1 | S1 |
| TC-OPS-036 | All Routes Return Correct HTTP Status | Deploy / API | P1 | S1/S2 |
| TC-OPS-037 | 404 Page Exists and Renders Correctly | Deployment | P3 | S2 |
| TC-OPS-038 | Middleware Runs at Edge Runtime | Deploy / Perf | P2 | S1 |
| TC-OPS-039 | robots.txt / sitemap.xml Restrict Auth Routes | Deploy / SEO | P3 | S2 |
| TC-OPS-040 | HTTPS Redirect and HSTS Configured | Deploy / Security | P1 | S1/S2 |

**P1 Count:** 22 | **P2 Count:** 14 | **P3 Count:** 4
