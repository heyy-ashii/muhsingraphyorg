-- ── MUHSINGRAPHY · SITE CONTENT ─────────────────────────────────────────────
-- Run this ONCE in the Supabase SQL Editor to enable the admin "Site Content"
-- tab: https://supabase.com/dashboard/project/yiflgzshrtzenndcvyvv/sql/new
--
-- It is idempotent — safe to run more than once.
-- Until it runs, the public site renders its built-in defaults and the admin
-- editor shows a "one-time setup required" notice instead of saving.

create table if not exists public.site_content (
  id          text primary key,
  content     jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Anyone may READ the content (it drives the public pages).
drop policy if exists "site content public read" on public.site_content;
create policy "site content public read"
  on public.site_content for select to anon, authenticated using (true);

-- Only a signed-in curator may write.
drop policy if exists "site content curator insert" on public.site_content;
create policy "site content curator insert"
  on public.site_content for insert to authenticated with check (true);

drop policy if exists "site content curator update" on public.site_content;
create policy "site content curator update"
  on public.site_content for update to authenticated using (true) with check (true);

-- Seed the single editable row.
insert into public.site_content (id, content) values ('default', '{}'::jsonb)
  on conflict (id) do nothing;
