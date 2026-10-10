-- ============================================================================
-- MUHSINGRAPHY — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── artworks ────────────────────────────────────────────────────────────────
create table if not exists public.artworks (
  id                  uuid primary key default gen_random_uuid(),
  title               text        not null,
  title_arabic        text,
  script_style        text        not null,
  medium              text        not null,
  dimensions          text        not null,
  year                text        not null,
  status              text        not null default 'Available'
                      check (status in ('Available', 'Private Collection', 'Reserved')),
  image_url           text        not null,
  in_situ_image_url   text,
  is_featured         boolean     not null default false,
  is_published        boolean     not null default true,
  display_order       integer     not null default 0,
  categories          text[]      not null default '{}',
  description         text,
  created_at          timestamptz not null default now()
);

create index if not exists artworks_display_order_idx
  on public.artworks (display_order asc, created_at desc);
create index if not exists artworks_status_idx on public.artworks (status);
create index if not exists artworks_featured_idx on public.artworks (is_featured) where is_featured;

-- ── inquiries ───────────────────────────────────────────────────────────────
create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  client_name     text        not null,
  client_email    text        not null,
  commission_type text        not null,
  message         text        not null,
  status          text        not null default 'New'
                  check (status in ('New', 'Responded', 'Archived')),
  created_at      timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.artworks  enable row level security;
alter table public.inquiries enable row level security;

-- Artworks: anonymous visitors may read published pieces only.
drop policy if exists "artworks public read" on public.artworks;
create policy "artworks public read"
  on public.artworks for select
  to anon, authenticated
  using (is_published);

-- Artworks: the authenticated curator owns the archive.
drop policy if exists "artworks curator insert" on public.artworks;
create policy "artworks curator insert"
  on public.artworks for insert to authenticated with check (true);

drop policy if exists "artworks curator update" on public.artworks;
create policy "artworks curator update"
  on public.artworks for update to authenticated using (true) with check (true);

drop policy if exists "artworks curator delete" on public.artworks;
create policy "artworks curator delete"
  on public.artworks for delete to authenticated using (true);

-- Inquiries: anyone may submit a commission enquiry, nobody anonymous may read.
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert"
  on public.inquiries for insert to anon, authenticated with check (true);

drop policy if exists "inquiries curator read" on public.inquiries;
create policy "inquiries curator read"
  on public.inquiries for select to authenticated using (true);

drop policy if exists "inquiries curator update" on public.inquiries;
create policy "inquiries curator update"
  on public.inquiries for update to authenticated using (true) with check (true);

drop policy if exists "inquiries curator delete" on public.inquiries;
create policy "inquiries curator delete"
  on public.inquiries for delete to authenticated using (true);

-- ── Storage: artwork-media ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artwork-media',
  'artwork-media',
  true,
  12582912,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read of media; only the curator may write.
drop policy if exists "artwork media public read" on storage.objects;
create policy "artwork media public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'artwork-media');

drop policy if exists "artwork media curator write" on storage.objects;
create policy "artwork media curator write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'artwork-media');

drop policy if exists "artwork media curator update" on storage.objects;
create policy "artwork media curator update"
  on storage.objects for update to authenticated
  using (bucket_id = 'artwork-media');

drop policy if exists "artwork media curator delete" on storage.objects;
create policy "artwork media curator delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'artwork-media');
