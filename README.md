# Snap Plan Designs

Next.js 16 App Router implementation for the Snap Plan Designs MVP:

- SEO-first marketing site
- Authenticated client portal
- Admin fulfillment workspace
- Stripe Checkout + webhooks
- Supabase Auth/Postgres + RLS
- R2 signed uploads
- Resend transactional email

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Stripe
- Cloudflare R2 (`@aws-sdk/client-s3`, presigned URLs)
- Resend
- Sentry + Vercel Analytics

## Run locally

1. Copy envs:

```bash
cp .env.example .env.local
```

2. Install deps:

```bash
npm install
```

3. Run app:

```bash
npm run dev
```

## Database

- Schema: `supabase/migrations/001_init.sql`
- RLS: `supabase/migrations/002_rls.sql`
- Seed: `supabase/seed.sql`

## Utility scripts

```bash
npm run seed:packages
npm run sync:stripe-products
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```
