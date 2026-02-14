-- Snap Plan Designs baseline schema and RLS.
-- This migration is intentionally idempotent and safe to re-run.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'user_role'
  ) then
    create type public.user_role as enum ('client', 'admin');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'project_status'
  ) then
    create type public.project_status as enum (
      'draft',
      'submitted',
      'in_review',
      'in_progress',
      'delivered',
      'closed'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'order_status'
  ) then
    create type public.order_status as enum (
      'pending',
      'paid',
      'failed',
      'refunded',
      'canceled'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'file_type'
  ) then
    create type public.file_type as enum ('upload', 'deliverable');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'revision_status'
  ) then
    create type public.revision_status as enum (
      'open',
      'in_progress',
      'resolved',
      'declined'
    );
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  location text,
  property_type text,
  status public.project_status not null default 'draft',
  package_tier text,
  turnaround text,
  intake_summary text,
  deliverable_bucket text not null default 'deliverables',
  deliverable_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_answers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  question_key text not null,
  answer_text text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint intake_answers_project_key_unique unique (project_id, question_key)
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  uploaded_by uuid references public.profiles (id) on delete set null,
  type public.file_type not null default 'upload',
  bucket text not null,
  path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  created_at timestamptz not null default now(),
  constraint files_bucket_path_unique unique (bucket, path)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  client_id uuid not null references public.profiles (id) on delete cascade,
  status public.order_status not null default 'pending',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  currency text not null default 'usd',
  amount_total_cents integer check (amount_total_cents is null or amount_total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.revision_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  requested_by uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  details text not null,
  status public.revision_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_client_id on public.projects (client_id);
create index if not exists idx_intake_answers_project_id on public.intake_answers (project_id);
create index if not exists idx_files_project_id on public.files (project_id);
create index if not exists idx_orders_project_id on public.orders (project_id);
create index if not exists idx_orders_client_id on public.orders (client_id);
create index if not exists idx_messages_project_id on public.messages (project_id);
create index if not exists idx_messages_sender_id on public.messages (sender_id);
create index if not exists idx_revision_requests_project_id on public.revision_requests (project_id);
create index if not exists idx_revision_requests_requested_by on public.revision_requests (requested_by);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_revision_requests_updated_at on public.revision_requests;
create trigger set_revision_requests_updated_at
before update on public.revision_requests
for each row
execute procedure public.set_updated_at();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and p.role = 'admin'::public.user_role
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.intake_answers enable row level security;
alter table public.files enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.revision_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_admin_all'
  ) then
    create policy profiles_admin_all
      on public.profiles
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_client_select_own'
  ) then
    create policy profiles_client_select_own
      on public.profiles
      for select
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_client_insert_own'
  ) then
    create policy profiles_client_insert_own
      on public.profiles
      for insert
      with check (
        auth.uid() = id
        and role = 'client'::public.user_role
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_client_update_own'
  ) then
    create policy profiles_client_update_own
      on public.profiles
      for update
      using (auth.uid() = id)
      with check (
        auth.uid() = id
        and role = 'client'::public.user_role
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'projects_admin_all'
  ) then
    create policy projects_admin_all
      on public.projects
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'projects_client_own'
  ) then
    create policy projects_client_own
      on public.projects
      for all
      using (client_id = auth.uid())
      with check (client_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'intake_answers'
      and policyname = 'intake_answers_admin_all'
  ) then
    create policy intake_answers_admin_all
      on public.intake_answers
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'intake_answers'
      and policyname = 'intake_answers_client_own_project'
  ) then
    create policy intake_answers_client_own_project
      on public.intake_answers
      for all
      using (
        exists (
          select 1
          from public.projects p
          where p.id = intake_answers.project_id
            and p.client_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.projects p
          where p.id = intake_answers.project_id
            and p.client_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'files'
      and policyname = 'files_admin_all'
  ) then
    create policy files_admin_all
      on public.files
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'files'
      and policyname = 'files_client_own_project'
  ) then
    create policy files_client_own_project
      on public.files
      for all
      using (
        exists (
          select 1
          from public.projects p
          where p.id = files.project_id
            and p.client_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.projects p
          where p.id = files.project_id
            and p.client_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_admin_all'
  ) then
    create policy orders_admin_all
      on public.orders
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_client_own'
  ) then
    create policy orders_client_own
      on public.orders
      for all
      using (
        client_id = auth.uid()
        and exists (
          select 1
          from public.projects p
          where p.id = orders.project_id
            and p.client_id = auth.uid()
        )
      )
      with check (
        client_id = auth.uid()
        and exists (
          select 1
          from public.projects p
          where p.id = orders.project_id
            and p.client_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'messages_admin_all'
  ) then
    create policy messages_admin_all
      on public.messages
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'messages_client_own_project'
  ) then
    create policy messages_client_own_project
      on public.messages
      for all
      using (
        exists (
          select 1
          from public.projects p
          where p.id = messages.project_id
            and p.client_id = auth.uid()
        )
      )
      with check (
        sender_id = auth.uid()
        and exists (
          select 1
          from public.projects p
          where p.id = messages.project_id
            and p.client_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'revision_requests'
      and policyname = 'revision_requests_admin_all'
  ) then
    create policy revision_requests_admin_all
      on public.revision_requests
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'revision_requests'
      and policyname = 'revision_requests_client_own_project'
  ) then
    create policy revision_requests_client_own_project
      on public.revision_requests
      for all
      using (
        exists (
          select 1
          from public.projects p
          where p.id = revision_requests.project_id
            and p.client_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.projects p
          where p.id = revision_requests.project_id
            and p.client_id = auth.uid()
        )
      );
  end if;
end
$$;
