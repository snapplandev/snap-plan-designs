insert into public.product_packages (
  id,
  name,
  slug,
  description,
  price_cents,
  currency,
  includes,
  revision_policy,
  sla_hours,
  is_active,
  stripe_product_id,
  stripe_price_id
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'Starter Layout',
    'starter-layout',
    'Single-zone planning package with actionable layout notes.',
    14900,
    'usd',
    '["1 plan PDF", "1 revision", "48-72h turnaround"]'::jsonb,
    '{"included_revisions":1}'::jsonb,
    72,
    true,
    null,
    null
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Home Flow',
    'home-flow',
    'Multi-room optimization with plan + notes.',
    29900,
    'usd',
    '["Plan PDF + notes", "2 revisions", "priority queue"]'::jsonb,
    '{"included_revisions":2}'::jsonb,
    60,
    true,
    null,
    null
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'Contractor Ready',
    'contractor-ready',
    'Expanded package tuned for build handoff.',
    49900,
    'usd',
    '["Detailed plan + notes", "3 revisions", "fastest SLA"]'::jsonb,
    '{"included_revisions":3}'::jsonb,
    48,
    true,
    null,
    null
  )
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  includes = excluded.includes,
  revision_policy = excluded.revision_policy,
  sla_hours = excluded.sla_hours,
  is_active = excluded.is_active,
  stripe_product_id = excluded.stripe_product_id,
  stripe_price_id = excluded.stripe_price_id;
