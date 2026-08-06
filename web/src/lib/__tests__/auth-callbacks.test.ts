import {
  applyAccountToToken,
  applyTokenToSession,
  isAccessTokenFresh,
  isPathAuthorized,
  refreshAccessToken,
} from "../auth-callbacks"

describe("isPathAuthorized", () => {
  it("requires auth for dashboard routes", () => {
    expect(isPathAuthorized("/dashboard/calendar", true)).toBe(true)
    expect(isPathAuthorized("/dashboard/calendar", false)).toBe(false)
  })

  it("allows public routes without auth", () => {
    expect(isPathAuthorized("/login", false)).toBe(true)
    expect(isPathAuthorized("/", false)).toBe(true)
  })
})

describe("applyAccountToToken", () => {
  it("stores OAuth tokens on first sign-in", () => {
    const token = applyAccountToToken({}, {
      access_token: "access-123",
      refresh_token: "refresh-123",
      expires_at: 1_700_000_000,
    })
    expect(token.accessToken).toBe("access-123")
    expect(token.refreshToken).toBe("refresh-123")
    expect(token.accessTokenExpires).toBe(1_700_000_000)
  })

  it("does not expose tokens on the client session object", () => {
    const session = applyTokenToSession(
      { user: { name: "Alex" }, expires: "2099-01-01" },
      { accessToken: "secret", error: undefined }
    )
    expect((session as { accessToken?: string }).accessToken).toBeUndefined()
  })
})

describe("isAccessTokenFresh", () => {
  it("returns true before expiry", () => {
    const now = 1_700_000_000_000
    const token = { accessTokenExpires: Math.floor(now / 1000) + 3600 }
    expect(isAccessTokenFresh(token, now)).toBe(true)
  })

  it("returns false after expiry", () => {
    const now = 1_700_000_000_000
    const token = { accessTokenExpires: Math.floor(now / 1000) - 10 }
    expect(isAccessTokenFresh(token, now)).toBe(false)
  })
})

describe("applyTokenToSession", () => {
  it("forwards refresh errors to the session", () => {
    const session = applyTokenToSession(
      { user: { name: "Alex" }, expires: "2099-01-01" },
      { error: "RefreshAccessTokenError" }
    )
    expect(session.error).toBe("RefreshAccessTokenError")
  })
})

describe("refreshAccessToken", () => {
  it("refreshes an expired token", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "new-access",
        expires_in: 3600,
        refresh_token: "new-refresh",
      }),
    })

    const result = await refreshAccessToken(
      { refreshToken: "old-refresh" },
      fetchMock as unknown as typeof fetch
    )

    expect(result.accessToken).toBe("new-access")
    expect(result.refreshToken).toBe("new-refresh")
    expect(result.error).toBeUndefined()
  })

  it("returns RefreshAccessTokenError when refresh fails", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "invalid_grant" }),
    })

    const result = await refreshAccessToken(
      { refreshToken: "bad-refresh" },
      fetchMock as unknown as typeof fetch
    )

    expect(result.error).toBe("RefreshAccessTokenError")
  })
})
