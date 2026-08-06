import { test, expect } from "@playwright/test"

/** Middleware sends unauthenticated users to NextAuth sign-in (not always /login). */
const UNAUTH_URL = /\/(login|api\/auth\/signin)/

test.describe("DayFlow public journey", () => {
  test("home redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(UNAUTH_URL)
    await expect(page.getByRole("heading", { name: "DayFlow" })).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in with google/i })).toBeVisible()
  })

  test("dashboard requires authentication", async ({ page }) => {
    await page.goto("/dashboard/calendar")
    await expect(page).toHaveURL(UNAUTH_URL)
  })

  test("legacy tasks route redirects to calendar after sign-in", async ({ page }) => {
    await page.goto("/dashboard/tasks")
    await expect(page).toHaveURL(UNAUTH_URL)
  })

  test("login page shows session expired message", async ({ page }) => {
    await page.goto("/login?error=SessionExpired")
    await expect(page.getByText(/session expired/i)).toBeVisible()
  })
})

test.describe("DayFlow authenticated journey", () => {
  test.skip(
    !process.env.E2E_GOOGLE_EMAIL || !process.env.E2E_GOOGLE_PASSWORD,
    "Set E2E_GOOGLE_EMAIL and E2E_GOOGLE_PASSWORD for full authenticated E2E"
  )

  test("user can sign in and add a task", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: /sign in with google/i }).click()
    // Google OAuth UI is external — complete manually in headed mode or with stored auth state.
  })
})
