<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

DayFlow is a single Next.js app in `web/` (no Docker Compose or separate backend). Tasks persist in browser `localStorage` only.

### Dependencies

```bash
cd web && npm ci && npm install --no-save ts-node
```

`ts-node` is required because `jest.config.ts` is TypeScript; it is not listed in `package.json` devDependencies.

### Environment variables

Create `web/.env.local` from Cloud Agent secrets before starting the dev server:

| Variable | Required |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Yes |
| `GOOGLE_CLIENT_SECRET` | Yes |
| `NEXTAUTH_SECRET` | Yes |
| `NEXTAUTH_URL` | Yes (`http://localhost:3000`) |
| `ANTHROPIC_API_KEY` | No (AI optimize not implemented yet) |

The code uses `GOOGLE_*` / `NEXTAUTH_*` names (not the `AUTH_*` names in the root README).

### Running the dev server

```bash
cd web && npm run dev -- --hostname 0.0.0.0 --port 3000
```

App listens on port **3000**. Google OAuth redirect URI must include `http://localhost:3000/api/auth/callback/google`.

### Validation commands

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint |
| `npm test` | Jest unit tests (22 tests) |
| `npm run build` | Production build |

### E2E smoke test

1. Sign in with Google at `/login`
2. Open `/dashboard/calendar`
3. Add a task and drag it onto the hourly timeline
