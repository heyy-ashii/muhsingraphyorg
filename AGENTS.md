# AGENTS.md — Muhsingraphy

Repository-specific knowledge for future agent sessions.

## What this is

Luxury calligraphy fine-art portfolio + CMS. Next.js 15 App Router, React 19,
TypeScript, Tailwind CSS 3, Framer Motion, Lenis smooth scroll, Supabase
(PostgreSQL + Auth + Storage). No test suite — validate via `npm run build` and
`npm run dev` smoke checks.

## Commands

```bash
npm run build            # production build (also runs tsc type-check)
npm run dev              # dev server on :3000
```

Smoke-test routes after changes:

```bash
for p in / /works /works/mhg-0001 /admin/login /admin/dashboard; do
  curl -s -o /dev/null -w "$p -> %{http_code}\n" "http://localhost:3000$p"
done
```

## Non-obvious constraints (do not regress)

1. **TypeScript is pinned to `^6`.** Next 15.5 cannot drive the TS 7 native
   compiler. Upgrading TS breaks `next build` with a "TypeScript 7 is not
   supported" error.
2. **`next.config.mjs` carries an explicit webpack alias** (`@ → ./src`). The
   tsconfig `paths` entry alone resolves under `tsc` but *not* under the Next
   webpack build, producing `Can't resolve '@/lib/...'`. Keep both.
3. **`noUncheckedSideEffectImports: false`** in `tsconfig.json` — TS 6 otherwise
   rejects `import "./globals.css"`.
4. **`baseUrl` must not be added** to tsconfig for alias resolution; TS 6/7
   removed it.
5. **lucide-react v1 removed brand icons** (`Instagram`) and renamed `Loader2 →
   LoaderCircle`, `Trash2 → Trash`. Brand glyphs live as inline SVGs in
   `src/components/ui/whatsapp-button.tsx`.

## Provisioning state

- Supabase project ref `yiflgzshrtzenndcvyvv` is provisioned: `schema.sql` applied
  (both tables, RLS policies, `artwork-media` bucket) and `seed.sql` loaded
  (6 artworks). Verified: anon insert into `artworks` → 401, anon delete is a
  no-op, unpublished rows are hidden from `anon`.
- The curator account is created out-of-band with
  `node scripts/create-curator.mjs <email> <password>` (needs
  `SUPABASE_SECRET_KEY`). It is idempotent — re-running resets the password.
- Schema changes need the Management API (`sbp_…` token,
  `POST /v1/projects/{ref}/database/query`). The service-role key cannot run SQL.

## Architecture conventions

- **Supabase-optional by design.** When `NEXT_PUBLIC_SUPABASE_*` are unset,
  `isSupabaseConfigured` is false: public reads fall back to `src/lib/seed.ts`
  and the admin portal shows a configuration notice instead of throwing. Any new
  data access must preserve this fallback.
- **Server Supabase access goes through `src/lib/supabase/context.ts`.** It
  composes `@supabase/ssr` (cookie session lifecycle, refreshed in
  `src/middleware.ts`) with `@supabase/server` core primitives
  (`verifyCredentials` → `createContextClient` / `createAdminClient`). Use
  `createSupabaseContext({ auth: 'user' })` for curator-only access and
  `{ auth: 'none' }` for anonymous RLS access. Do not add a second ad-hoc
  server client.
- **`@supabase/server`'s high-level `withSupabase` / `createSupabaseContext`
  wrappers are intentionally NOT used** — they target header-based auth (Edge
  Functions, Workers), not Next's cookie sessions. `@supabase/server` does not
  replace `@supabase/ssr` in Next.js; the two coexist.
- **The secret key must never reach the client.** `SUPABASE_SECRET_KEY` is read
  only in `src/lib/supabase/env.ts`, which imports `server-only`. Keep
  `src/lib/supabase/config.ts` free of non-`NEXT_PUBLIC_` env reads — putting one
  there leaks a `process.env` reference into the browser bundle.
- **`@/lib/whatsapp.ts` is the single source of truth** for the acquisition
  message + `wa.me` link. Never hand-build a WhatsApp URL elsewhere.
- **Admin is gated twice**: `src/middleware.ts` (session refresh + redirect) and
  a server-side check in `src/app/admin/dashboard/page.tsx`. RLS is the real
  enforcement boundary — see `supabase/schema.sql`.
- **No admin link in the site header.** Access is only via the footer lock icon
  or `/admin/login` directly.
- **The dashboard is a sidebar shell, not a tab strip.** `dashboard-client.tsx`
  renders a left rail (`Overview · Artworks · Enquiries · Site Content ·
  Account`) that collapses to a horizontal scroller on mobile; the active tab
  owns the whole content column. Keep new panels inside that column and reuse
  the shared `pill` / `STATUS_TONE` / `INQUIRY_TONE` helpers rather than
  re-inventing status chips. Only one tab panel renders at a time — do not go
  back to the old `tab === "x" ? … : <default>` shape that leaked one panel
  under every other tab.
- **The dashboard shell is viewport-locked, not page-scrolled.** The shell is
  `h-dvh overflow-hidden` and only the content column scrolls; the rail stays a
  fixed height at every width (it collapses to a header on mobile). Both scroll
  regions carry `data-lenis-prevent` so the global Lenis smooth scroll leaves
  them alone. The Site Content save bar is `sticky bottom-0` inside the content
  column — it must never become `fixed`/`inset-x-0`, which would span under the
  rail. Anything taller than the viewport (like the content editor) relies on
  this, so do not reintroduce `min-h-dvh` on the shell.
- **The dashboard keeps its own light/dark toggle.** It reuses the shared
  `ThemeToggle` (`src/components/ui/theme-toggle.tsx`) — once in the sidebar
  ("Appearance") and once in the mobile header. `ThemeProvider` still wraps the
  app in `src/app/layout.tsx`, but the public site no longer boots a theme class
  and the site navbar has no toggle, so the choice now only affects the admin
  portal. Don't drop either admin control.
- Design tokens are CSS variables in `src/app/globals.css`, surfaced to Tailwind
  in `tailwind.config.ts`. Use token classes (`text-ink`, `bg-canvas`,
  `border-line`, `bg-forest`, `bg-lime`, `text-coral`) rather than raw hex.

## Design language (orbiz-inspired)

The public site was rebuilt to match the visual language of orbiz.in. Keep new
UI consistent with it:

- **One typeface: Poppins** (`--font-sans`, `--font-display`, `--font-mono` all
  point at it). Headings are 600 weight with tight negative tracking. No serif,
  no monospace, no italics on display copy.
- **Palette**: off-white canvas `#F5F4F0`, near-black ink `#111111`, forest
  green `#2F4A32`, lime `#F3FC81`, coral `#D0473E`. `gold*` tokens map onto the
  lime/forest accents so legacy class names still resolve.
- **Shape & depth**: pill buttons (`rounded-full`), rounded-2xl/3xl cards,
  flat surfaces with at most `shadow-whisper`. No gold gradients, glass blur,
  grain overlay, or magnetic cursor — those components were deleted.
- **Navbar** is a full-width sticky bar (brand left, links beside it, lime
  "Enquire" CTA right). It no longer needs the compact-pill hack, because a
  sparse link set never leaves a void in a full-width bar.
- **Light only.** The public site no longer boots a theme class; the dark
  variant exists in `globals.css` for the admin portal. `ThemeToggle` is still
  used by the admin dashboard but not by the site navbar.
- Sections are evenly padded (`py-20 sm:py-28`) and headings are plain
  (eyebrow + title + description), not indexed/ornamented.

## Works gallery (multi-image)

- **A piece's photographs are a list, not one URL.** `image_url` remains the
  canonical cover (cards, hero, OG-image); the extra portions/angles live in the
  nullable `images text[]` column. Read them through
  `galleryOf(artwork)` in `src/lib/types.ts` — it always leads with the cover and
  de-duplicates, so callers never special-case the cover.
- **`images` is additive and optional.** Leave it out of `ArtworkInput` (or pass
  `[]`) and everything still works; legacy rows without the column render a
  single-image gallery. The public viewer and modal both collapse to the plain
  stage when `galleryOf().length === 1`.
- **Schema is idempotent.** `supabase/schema.sql` declares `images` on `create`
  *and* carries an `alter table … add column if not exists` migration, so an
  archive provisioned before this feature upgrades by re-running the file.
- **Admin editing reuses `MediaGallery`** (`src/components/admin/fields.tsx`):
  multi-select upload, arrow reordering, remove, and the first image labelled
  "Cover". `ArtworkFormDrawer` splits the gallery into `[cover, ...rest]` when
  saving, and shows a count badge in the artworks list.
- **Public surfaces**: `artwork-detail-viewer.tsx` (own page) and
  `artwork-modal.tsx` (pavilion + works index) share the same behaviour —
  thumbnail strip, prev/next arrows, keyboard ← / →, and a `n / total` counter.
  The card shows an `Images` count badge when a piece has more than one photo.
- **The zoom lens is desktop-only.** It is toggled by a `hidden md:inline-flex`
  button and the magnifier itself carries `hidden md:block`, so phones never
  show a lens. Keep both guards if you touch this.
- **There is no "View in Room" mode.** The in-situ/room preview (and its
  `in_situ_image_url` upload) was removed; the stage renders the gallery images
  only. `in_situ_image_url` survives as a nullable column so old rows still load
  — do not re-add a public room toggle without a fresh product decision.

## Site content CMS (editable public copy)

- The public site is **content-driven**. Every heading, paragraph, label, image,
  logo and section visibility is read from a single JSON document in the
  Supabase `site_content` table (one row, `id = 'default'`).
- **Nav and footer links are derived, not curated.** There is still no control
  to add, rename or reorder nav links, but a link whose target section the
  curator has hidden (see `visibility`) is dropped from both the navbar and the
  footer by `merge.ts#visibleNav`; anchor hrefs map to sections via
  `sectionKeyForHref` and any non-anchor href is never filtered.
- Files: `src/lib/content/{schema,defaults,merge,load,context,index}.ts`.
  `defaults.ts` is the canonical copy; `merge.ts#coerceContent` deep-merges any
  stored document over the defaults so a partial or older document still
  renders a complete site.
- `getSiteContent()` (`load.ts`) is `cache`-wrapped and **never throws**: a
  missing table, missing row or unconfigured project falls back to defaults.
  This keeps the gallery rendering before the SQL has been applied.
- Client components (navbar, footer, cards, modal) read content via
  `useSiteContent()` from `context.tsx`, provided in `src/app/layout.tsx`.
- Admin editing lives in the **Site Content** tab of the dashboard
  (`src/components/admin/content-editor.tsx` + `fields.tsx`), saving through
  `saveSiteContent()` in `src/lib/admin.ts` (browser client, so RLS applies).
- **The editor is grouped, not one long scroll.** Five pill tabs (`brand`,
  `home`, `sections`, `contact`, `ticker`) swap the visible group; only the
  active group renders. Groups are built from the shared `Card` / `Panel`
  primitives in `fields.tsx` — the same rounded-2xl language as the Overview and
  Artworks tabs. Keep new controls inside a `Card` (always open) or `Panel`
  (collapsible) rather than dropping raw sections into the page.
- **The Moving banner** (the marquee `<Ticker>` under the hero) is its own
  group with a show/hide toggle (`visibility.ticker`). That toggle is
  intentionally excluded from the generic Section visibility card so there is a
  single control for it.
- **Curator account editing lives in the Account tab** of the dashboard
  (`src/components/admin/account-panel.tsx` + `src/lib/account.ts`). Personal
  info (full name, title, phone, bio) is stored in the auth user's
  `user_metadata` and the password is changed with `supabase.auth.updateUser`.
  Both use the browser client against the live session, so no service-role key
  is involved; `userMetadata` is passed in from the server page for the header
  display name. The panel degrades to the "not connected" notice when Supabase
  is unconfigured.
- **One-time setup**: if the `site_content` table is absent the public site uses
  defaults and the editor shows a setup notice instead of saving. Apply
  `supabase/site-content.sql` (idempotent) in the Supabase SQL Editor to enable
  saving. That needs a Supabase Management PAT, which is not stored in this repo.

## Layout

```
src/app/{page,works,works/[id],admin/{login,dashboard},api/inquiries}
src/components/{site,ui,admin}
src/lib/{types,site,whatsapp,artworks,admin,seed,utils,supabase/*}
supabase/{schema.sql,seed.sql}
```
