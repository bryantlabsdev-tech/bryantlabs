# Bryant Labs Production Deploy Checklist

Use this checklist for every production release.

## Pre-deploy

- [ ] Pull latest `main` and confirm the intended commit/tag is selected for deploy.
- [ ] Run lint: `npm run lint`
- [ ] Run production build: `npm run build`
- [ ] Run production dependency audit: `npm audit --omit=dev`
- [ ] Confirm required production env vars are set:
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `TURNSTILE_SECRET_KEY`
  - [ ] `VITE_TURNSTILE_SITE_KEY`
  - [ ] `CALENDLY_INTRO_URL`
  - [ ] `ADMIN_EMAIL`
  - [ ] `VITE_ADMIN_EMAIL`
- [ ] Confirm no planned DB migrations are missing from the release process.
- [ ] Confirm rollback target (previous stable deploy) is identified before proceeding.

## Post-deploy

- [ ] Check `GET /api/health` returns expected JSON and HTTP status `200`.
- [ ] Submit a production intake test and confirm:
  - [ ] Request succeeds
  - [ ] Lead record appears in admin
  - [ ] User-facing response is correct
- [ ] Test admin login flow and confirm approved admin can access `/admin`.
- [ ] Send a test intro/intake email path and confirm email delivery behavior.
- [ ] Review logs / `app_errors` for new warnings or errors introduced by the deploy.
- [ ] Confirm no unexpected spike in 4xx/5xx after release.

## Rollback steps

- [ ] Pause active release work and notify stakeholders a rollback is starting.
- [ ] Re-deploy the previous known-good production build.
- [ ] Re-run `GET /api/health` and verify status returns to normal.
- [ ] Re-run critical smoke checks:
  - [ ] Intake submit
  - [ ] Admin login
  - [ ] Email send path
- [ ] Confirm error rate/logs return to baseline.
- [ ] Record root cause and remediation actions before attempting a new deploy.

## Production incident notes

- Date/time:
- Release identifier (commit/tag):
- Symptoms observed:
- Impacted areas:
- Mitigation steps taken:
- Rollback performed (yes/no):
- Root cause:
- Follow-up actions:
- Owner:

