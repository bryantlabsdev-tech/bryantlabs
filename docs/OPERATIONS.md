# Bryant Labs Operations

Lightweight production operations for intake, email, analytics, intro links, and admin CRM. No paid monitoring services are required for the baseline workflow.

## Where errors show up

- **Admin Ops tab:** `/admin` → **Ops** shows the latest 10 `app_errors` rows, unresolved count, source, severity, timestamp, message, and a **Mark resolved** action.
- **Server logs:** API routes still write structured console errors when `app_errors` inserts fail.
- **Health check:** `GET /api/health` returns safe JSON with app name, timestamp, version, and boolean env checks only.

## Common errors and what they mean

| Source | Typical message | Meaning |
| --- | --- | --- |
| `submit-intake` | Turnstile verification failed | Bot check failed or Turnstile is misconfigured. |
| `submit-intake` | Rate limit blocked | Too many intake attempts from the same session/browser/IP window. |
| `submit-intake` | Supabase intake insert failed | Lead could not be saved. Check Supabase URL, anon key, grants, and RLS. |
| `submit-intake` | Email dispatch failed after lead save | Lead was saved, but SMTP failed. Review email env vars and mailbox auth. |
| `send-intake-confirmation` | Retired route called | Legacy confirmation route returned `410 Gone`; public intake must use `submit-intake`. |
| `send-intro-link` | Intro link email failed | Intro email did not send. Lead status and `intro_link_sent_at` should remain unchanged. |
| `send-intro-link` | Admin authentication failed | Missing/invalid admin token or non-approved admin email. |
| Any route | Missing required environment variables | One or more production env vars are unset when the route runs. |

## Resolving issues

### SMTP / email

1. Confirm `EMAIL_USER` and `EMAIL_PASSWORD` in Vercel.
2. Send a test intake in production and check Ops for customer/internal notification failures.
3. If leads save but email fails, follow up manually from the admin CRM.

### Supabase

1. Confirm `SUPABASE_URL` and `SUPABASE_ANON_KEY` on the server.
2. Re-run the SQL migrations for `consultation_leads`, `site_events`, and `app_errors`.
3. Verify approved admin email matches the Supabase Auth user and `studio_auth_config.admin_email`.
4. Review `docs/ADMIN_AUTH.md` before changing admin access.

### Turnstile

1. Confirm `TURNSTILE_SECRET_KEY` on the server and `VITE_TURNSTILE_SITE_KEY` in the client build.
2. Check Ops for Turnstile verification warnings after failed submissions.

### Calendly intro links

1. Confirm `CALENDLY_INTRO_URL` is set.
2. If intro email fails, do not mark the lead as `intro_scheduled` manually unless the email actually went out.
3. Retry from the lead drawer after fixing SMTP or Calendly config.

## Marking errors resolved

Use **Mark resolved** in the Ops tab after the underlying issue is fixed or the alert is understood. Resolved rows stay visible in the recent list with a resolved badge.

## Before running ads

1. Hit `/api/health` and confirm required env booleans are `true`.
2. Submit a real test intake and confirm the lead appears in admin.
3. Confirm confirmation email delivery, or review Ops if email failed after save.
4. Send a test intro link from admin and confirm status only changes after success.
5. Review Ops for unresolved errors and clear blockers before spending on traffic.
