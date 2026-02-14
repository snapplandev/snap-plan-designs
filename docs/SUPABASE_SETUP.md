# Supabase Local Activation Checklist

Use this checklist to switch from demo mode to live mode once credentials are available.

- [ ] Create a Supabase project in the Supabase dashboard.
- [ ] Copy and store these values securely:
  - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
  - Project anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Create private Storage buckets:
  - `project-uploads`
  - `deliverables`
- [ ] Run the baseline migration:
  - `supabase/migrations/0001_init.sql`
- [ ] Create the first admin user account (via Auth).
- [ ] Promote that user to admin in SQL:
  - `update public.profiles set role = 'admin' where id = '<auth_user_uuid>';`
- [ ] Add environment variables to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
  - `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] Start the app and verify:
  - `/login` supports sign in
  - `/admin` is blocked for non-admin users
  - `/admin` is accessible for the admin profile
