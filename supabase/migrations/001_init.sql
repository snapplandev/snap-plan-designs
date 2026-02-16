create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.project_status as enum ('draft', 'queued', 'in_progress', 'needs_info', 'delivered', 'closed');
create type public.asset_type as enum ('sketch', 'photo', 'inspiration', 'other');
create type public.deliverable_kind as enum ('plan', 'notes', 'other');
create type public.revision_status as enum ('open', 'in_progress', 'resolved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.product_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  includes jsonb not null default '{}'::jsonb,
  revision_policy jsonb not null default '{}'::jsonb,
  sla_hours integer not null,
  is_active boolean not null default true,
  stripe_product_id text,
  stripe_price_id text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id uuid not null references public.product_packages(id),
  status public.order_status not null default 'pending',
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'usd',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  title text not null,
  property_type text not null,
  scope_summary text not null,
  status public.project_status not null default 'draft',
  address_city text,
  address_state text,
  created_at timestamptz not null default now()
);

create table public.project_intake (
  project_id uuid primary key references public.projects(id) on delete cascade,
  goals jsonb not null default '{}'::jsonb,
  constraints jsonb not null default '{}'::jsonb,
  style_refs jsonb not null default '[]'::jsonb,
  priority_rooms jsonb not null default '[]'::jsonb,
  notes text
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type public.asset_type not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);

create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_role public.user_role not null,
  body text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  version integer not null check (version > 0),
  kind public.deliverable_kind not null,
  storage_path text not null,
  title text not null,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.revision_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reason text not null,
  status public.revision_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  text text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_orders_user_id on public.orders (user_id);
create index idx_projects_user_id on public.projects (user_id);
create index idx_projects_order_id on public.projects (order_id);
create index idx_assets_project_id on public.assets (project_id);
create index idx_messages_thread_id on public.messages (thread_id);
create index idx_deliverables_project_id on public.deliverables (project_id);
create index idx_revision_requests_project_id on public.revision_requests (project_id);
create index idx_reviews_user_id on public.reviews (user_id);
create index idx_reviews_project_id on public.reviews (project_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
