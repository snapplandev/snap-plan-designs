alter table public.profiles enable row level security;
alter table public.product_packages enable row level security;
alter table public.orders enable row level security;
alter table public.projects enable row level security;
alter table public.project_intake enable row level security;
alter table public.assets enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.deliverables enable row level security;
alter table public.revision_requests enable row level security;
alter table public.reviews enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid and role = 'admin'::public.user_role
  );
$$;

create or replace function public.owns_project(uid uuid, pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects
    where id = pid and user_id = uid
  );
$$;

create policy profiles_select_own on public.profiles
for select using (auth.uid() = id);

create policy profiles_update_own on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy profiles_admin_select_all on public.profiles
for select using (public.is_admin(auth.uid()));

create policy product_packages_public_select_active on public.product_packages
for select using (is_active = true);

create policy product_packages_admin_all on public.product_packages
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy orders_user_select_own on public.orders
for select using (auth.uid() = user_id);

create policy orders_admin_select_all on public.orders
for select using (public.is_admin(auth.uid()));

create policy projects_user_select_own on public.projects
for select using (auth.uid() = user_id);

create policy projects_user_insert_own on public.projects
for insert with check (auth.uid() = user_id);

create policy projects_user_update_own on public.projects
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy projects_admin_select_all on public.projects
for select using (public.is_admin(auth.uid()));

create policy projects_admin_update_all on public.projects
for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy project_intake_user_all on public.project_intake
for all using (public.owns_project(auth.uid(), project_id)) with check (public.owns_project(auth.uid(), project_id));

create policy project_intake_admin_all on public.project_intake
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy assets_user_all on public.assets
for all using (public.owns_project(auth.uid(), project_id)) with check (public.owns_project(auth.uid(), project_id));

create policy assets_admin_all on public.assets
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy message_threads_user_all on public.message_threads
for all using (public.owns_project(auth.uid(), project_id)) with check (public.owns_project(auth.uid(), project_id));

create policy message_threads_admin_all on public.message_threads
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy messages_user_all on public.messages
for all using (
  exists (
    select 1
    from public.message_threads mt
    join public.projects p on p.id = mt.project_id
    where mt.id = thread_id and p.user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.message_threads mt
    join public.projects p on p.id = mt.project_id
    where mt.id = thread_id and p.user_id = auth.uid()
  )
);

create policy messages_admin_all on public.messages
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy deliverables_user_select on public.deliverables
for select using (public.owns_project(auth.uid(), project_id));

create policy deliverables_admin_all on public.deliverables
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy revisions_user_all on public.revision_requests
for all using (public.owns_project(auth.uid(), project_id)) with check (public.owns_project(auth.uid(), project_id));

create policy revisions_admin_all on public.revision_requests
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy reviews_user_select_own on public.reviews
for select using (auth.uid() = user_id);

create policy reviews_user_insert_own on public.reviews
for insert with check (auth.uid() = user_id);

create policy reviews_public_select on public.reviews
for select using (is_public = true);

create policy reviews_admin_all on public.reviews
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
