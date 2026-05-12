# Bryant Labs Admin Auth

Single-admin magic-link access for `/admin`. Client checks use `VITE_ADMIN_EMAIL`; server checks use `ADMIN_EMAIL` only.

## Required environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client | Supabase anon key for browser auth and RLS |
| `VITE_ADMIN_EMAIL` | Client | Approved admin email for UI gating and login validation |
| `ADMIN_EMAIL` | Server | Approved admin email for `/api/send-intro-link` |
| `SUPABASE_URL` | Server | Supabase URL for server-side JWT verification |
| `SUPABASE_ANON_KEY` | Server | Supabase anon key for server-side JWT verification |

Set `VITE_ADMIN_EMAIL` and `ADMIN_EMAIL` to the same approved mailbox (for example `projects@bryantlabs.dev`).

## Manual Supabase settings to verify

1. **Auth user:** The approved admin mailbox exists in Supabase Auth and can receive magic links.
2. **Redirect URLs:** Site origin plus `/admin` is allowed in Supabase Auth redirect URLs.
3. **RLS:** Run `supabase/admin_identity.sql`, then the `consultation_leads`, `site_events`, and `app_errors` SQL files so admin policies call `public.is_approved_bryantlabs_admin()`.
4. **Studio config row:** `public.studio_auth_config.admin_email` matches `ADMIN_EMAIL` and `VITE_ADMIN_EMAIL`.
5. **No service role in the frontend:** Only `VITE_SUPABASE_ANON_KEY` is exposed to the client build.

## Manual test checklist

- [ ] Admin login success: approved email receives a magic link and lands on `/admin`.
- [ ] Invalid email blocked: login rejects an address that does not match `VITE_ADMIN_EMAIL`.
- [ ] Non-admin denied: a different authenticated Supabase user is signed out and returned to login with access denied.
- [ ] Expired session behavior: after session expiry or sign-out, `/admin` redirects to login with an expired-session notice when applicable.
- [ ] Admin dashboard loads leads for the approved admin session.
- [ ] Analytics tab loads site events for the approved admin session.
- [ ] Ops tab loads `app_errors` for the approved admin session.
- [ ] Sign out works from the dashboard and returns to `/admin/login`.

## Public intake

Public intake must use `POST /api/submit-intake` only. `POST /api/send-intake-confirmation` returns `410 Gone`.
