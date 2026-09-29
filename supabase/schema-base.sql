-- =====================================================================
-- S.S.E Industries website — Supabase setup
-- Run this whole file ONCE in Supabase → SQL Editor → New query → Run.
-- Before running, change the admin email at the bottom (section 6).
-- =====================================================================

create extension if not exists pgcrypto;

-- 1. TABLES -------------------------------------------------------------
create table if not exists public.items (
  id          text primary key default gen_random_uuid()::text,
  collection  text not null,
  data        jsonb not null default '{}'::jsonb,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists items_collection_idx on public.items (collection, sort_order);

create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  company      text default '',
  email        text default '',
  phone        text not null,
  enquiry_type text default '',
  product      text default '',
  message      text default '',
  source       text default 'website',
  page_url     text default '',
  status       text not null default 'new',
  notes        text default '',
  created_at   timestamptz not null default now()
);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

create table if not exists public.admin_users (
  email      text primary key,
  role       text not null default 'editor' check (role in ('super_admin','editor')),
  created_at timestamptz not null default now()
);

-- 2. HELPER FUNCTIONS ---------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')) and a.role = 'super_admin');
$$;

-- 3. ROW LEVEL SECURITY -------------------------------------------------
alter table public.items        enable row level security;
alter table public.site_content enable row level security;
alter table public.enquiries    enable row level security;
alter table public.admin_users  enable row level security;

drop policy if exists "items public read"  on public.items;
drop policy if exists "items admin write"  on public.items;
create policy "items public read" on public.items for select using (is_active or public.is_admin());
create policy "items admin write" on public.items for all using (public.is_admin()) with check (public.is_admin());
-- visitors may submit a testimonial; it stays hidden until an admin approves it
drop policy if exists "items public testimonial submit" on public.items;
create policy "items public testimonial submit" on public.items for insert to anon, authenticated
  with check (collection = 'testimonials' and is_active = false and (data ->> 'submitted') = 'true' and length(coalesce(data ->> 'message', '')) between 5 and 1500);

drop policy if exists "content public read" on public.site_content;
drop policy if exists "content admin write" on public.site_content;
create policy "content public read" on public.site_content for select using (true);
create policy "content admin write" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "enquiries public insert" on public.enquiries;
drop policy if exists "enquiries admin read"    on public.enquiries;
drop policy if exists "enquiries admin update"  on public.enquiries;
drop policy if exists "enquiries admin delete"  on public.enquiries;
create policy "enquiries public insert" on public.enquiries for insert to anon, authenticated
  with check (status = 'new' and length(name) between 1 and 200 and length(phone) between 6 and 30 and length(coalesce(message,'')) <= 2000);
create policy "enquiries admin read"   on public.enquiries for select using (public.is_admin());
create policy "enquiries admin update" on public.enquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "enquiries admin delete" on public.enquiries for delete using (public.is_admin());

drop policy if exists "admins read"        on public.admin_users;
drop policy if exists "super admin manage" on public.admin_users;
create policy "admins read" on public.admin_users for select
  using (public.is_admin() or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
create policy "super admin manage" on public.admin_users for all using (public.is_super_admin()) with check (public.is_super_admin());

-- 4. STORAGE (public bucket for images / PDFs) --------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "media public read"   on storage.objects;
drop policy if exists "media admin insert"  on storage.objects;
drop policy if exists "media admin update"  on storage.objects;
drop policy if exists "media admin delete"  on storage.objects;
create policy "media public read"  on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
