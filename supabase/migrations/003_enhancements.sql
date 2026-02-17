-- 003_enhancements.sql

-- 1. Search Optimization
-- Add Full Text Search (FTS) column to projects table
alter table public.projects
add column fts tsvector generated always as (to_tsvector('english', title || ' ' || coalesce(address_city, '') || ' ' || coalesce(scope_summary, ''))) stored;

create index idx_projects_fts on public.projects using gin (fts);

-- 2. User Preferences
-- Add preferences column to profiles table
alter table public.profiles
add column preferences jsonb default '{"theme": "system", "notifications": {"email": true, "push": false}}'::jsonb;

-- 3. Notifications System
-- Create notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, -- e.g., 'project_update', 'new_message', 'system_alert'
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Index for faster queries on user notifications
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id) where read_at is null;

-- RLS Policies for Notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications (mark read)"
  on public.notifications for update
  using (auth.uid() = user_id);
