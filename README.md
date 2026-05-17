# Bryant Labs Website

[![CI](https://github.com/bryantlabsdev-tech/bryantlabs/actions/workflows/ci.yml/badge.svg)](https://github.com/bryantlabsdev-tech/bryantlabs/actions/workflows/ci.yml)

Production website for Bryant Labs, focused on lead generation and trust-building first, with optional future expansion into client portal and internal admin tooling.

## Architecture direction

- Website-first production architecture (marketing + intake conversion path)
- Serverless API routes for intake, intro links, health, and ops logging
- Security and reliability baseline for a small production site (Turnstile, validation, rate limiting, admin gating)
- Future-capable structure for lightweight portal/admin expansion without premature SaaS complexity

## Project overview

- Frontend: React + Vite + Tailwind
- Hosting/runtime: Vercel (SPA + serverless API routes)
- Data/auth/logging: Supabase
- Email: SMTP via Nodemailer
- Analytics: Client and server event tracking utilities
- CI: GitHub Actions lint/build/audit workflow

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env template:
   - `cp .env.example .env.local`
3. Fill required variables in `.env.local`
4. Start dev server:
   - `npm run dev`

## Required environment variables

### Client/runtime

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAIL`
- `VITE_TURNSTILE_SITE_KEY`

### Server/API

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ADMIN_EMAIL`
- `TURNSTILE_SECRET_KEY`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `CALENDLY_INTRO_URL`

Notes:
- Keep `ADMIN_EMAIL` and `VITE_ADMIN_EMAIL` aligned to the approved admin mailbox.
- Do not expose server secrets to client variables.

## Scripts

- `npm run dev` - local dev server
- `npm run lint` - ESLint checks
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run test:e2e` - Playwright smoke tests
- `npm run test:e2e:ui` - Playwright UI mode

## E2E smoke tests

Playwright smoke tests are intentionally lightweight and secret-safe:

- homepage loads
- intake form renders
- admin route redirects to login when unauthenticated

Setup:

1. Install dependencies with `npm install`
2. Install Playwright browser once:
   - `npx playwright install chromium`
3. Run tests:
   - `npm run test:e2e`

The smoke suite does not submit real leads or send emails.

## CI workflow and required checks

Workflow file: `.github/workflows/ci.yml`

Current CI runs:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm audit --omit=dev`

Recommended GitHub branch protection (manual, in repo settings):

1. Protect `main`
2. Require pull request before merge
3. Require status checks to pass before merging
4. Select the `CI` check as required
5. Optionally require up-to-date branch before merge

## Deploy steps (Vercel)

1. Ensure branch is green in CI
2. Confirm production env vars are set in Vercel
3. Deploy target commit/branch
4. Run post-deploy smoke checks

Detailed checklist: `docs/DEPLOY_CHECKLIST.md`

## Rollback steps

1. Identify previous known-good deployment
2. Redeploy previous stable build in Vercel
3. Re-run health and smoke checks
4. Document incident cause and follow-up actions

Detailed checklist: `docs/DEPLOY_CHECKLIST.md`

## Smoke test checklist (post-deploy)

- `GET /api/health` returns `200` and `ok: true`
- submit test intake path and confirm lead capture behavior
- verify admin login gate behavior
- verify intro/intake email path behavior
- inspect logs / `app_errors` for regressions

## Health endpoint

`GET /api/health` returns:

- `200` when all required env checks pass
- `503` when any required env checks fail
- safe JSON payload with booleans only (`checks.envConfigured`)

No secret values are returned.

## Intake reliability notes

- Turnstile verification is fail-closed in production when secret is missing
- Validation and safe error messaging are handled server-side
- Honeypot + rate limit protections are present
- Intake route logs operational failures to `app_errors` when available

## Admin/security notes

- `/admin` is protected and requires approved auth session
- Non-approved authenticated users are denied and signed out
- Admin routes are marked `noindex, nofollow`
- `robots.txt` disallows crawling `/admin`

Additional auth guidance: `docs/ADMIN_AUTH.md`

## Troubleshooting

### Build/lint failures

- Run `npm install`
- Run `npm run lint`
- Run `npm run build`
- Resolve errors before deploy

### CI failing on audit

- Run `npm audit --omit=dev`
- Update vulnerable production dependencies where possible

### Intake failing Turnstile

- Confirm `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
- Check `/api/health` and `app_errors` for configuration warnings

### Admin login issues

- Confirm `VITE_ADMIN_EMAIL` and `ADMIN_EMAIL` match approved mailbox
- Verify Supabase auth user and redirect URLs
- Follow `docs/ADMIN_AUTH.md`

## Production checklist references

- Deploy/rollback checklist: `docs/DEPLOY_CHECKLIST.md`
- Admin auth runbook: `docs/ADMIN_AUTH.md`
- Operations guide: `docs/OPERATIONS.md`
