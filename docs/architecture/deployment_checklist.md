# Deployment checklist

## Environments
- local
- development
- staging
- production

## Required secrets
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- REVENUECAT_WEBHOOK_SECRET
- STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET if marketplace enabled
- SENTRY_DSN
- APPLE_SIGN_IN_CLIENT_ID
- GOOGLE_OAUTH_CLIENT_ID

## Production gates
- RLS enabled on all user-owned tables
- premium storage bucket requires signed URL
- webhook signature validation enabled
- backups enabled
- admin MFA enforced
- crash reporting enabled
- analytics redaction rules enabled
- app-store sandbox and production purchase tests completed
