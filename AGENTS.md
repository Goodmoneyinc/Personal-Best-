# AGENTS.md

Guidance for AI agents working in this repository.

## Cursor Cloud specific instructions

### Product

Single **Next.js 14** App Router app (Fulatelier marketplace). There is no monorepo, Docker stack, or local Supabase/Postgres process.

### What must run locally

| Service | Command | Port |
|---------|---------|------|
| Next.js dev server | `npm run dev` | 3000 (default) |

Hosted services (optional per feature): Supabase (leads, admin APIs), Stripe (checkout/webhooks). See `.env.example`.

### Environment

- Copy `.env.example` → `.env.local` before first run.
- **Browse-only / Permit Tracker / static catalog**: no Supabase or Stripe keys required.
- **`/admin` UI**: set `ADMIN_BASIC_PASSWORD` (and optionally `ADMIN_BASIC_USER`).
- **Lead capture & admin REST**: Supabase URL + keys; **`/api/admin/*`** also needs `ADMIN_API_TOKEN`.
- **Checkout / webhooks**: Stripe keys; local webhook testing typically uses Stripe CLI forwarding to `http://localhost:3000/api/webhooks/stripe`.

### Standard commands

Documented in [README.md](./README.md):

- `npm run dev` — development server
- `npm run lint` — ESLint (Next.js)
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` / `npm run start` — production build and server
- `npm run build:public` — static export for Surge (`NEXT_OUTPUT=export`)

There is **no** automated test script in `package.json`.

### Dev server notes

- Use a **tmux** session for long-running `npm run dev` (e.g. session name `next-dev-server`).
- After dependency changes, restart the dev server; Next HMR handles most code edits, but new env vars require a restart.
- `NEXT_PUBLIC_*` values are baked at build/start time for production builds.

### Hello-world smoke (no external credentials)

1. Homepage at `http://localhost:3000`
2. `/products` → open a product detail page
3. `/tools/permit-tracker/dashboard` → add a permit and move it through a workflow stage
