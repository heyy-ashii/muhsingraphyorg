# Muhsingraphy — Atelier of Sacred Script

A luxury fine-art portfolio and content management system for the calligrapher
**Muhsin**. Built as a Next.js 15 App Router application with Supabase as the
data layer, and a WhatsApp-first acquisition flow that requires collectors to
create no account.

Design language: *Modern Sacred Script & Contemporary Gallery* — archival
parchment and ink in light mode, obsidian and liquid gold in dark mode, with a
global cotton-paper grain overlay and drifting calligraphic strokes.

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Supabase keys
npm run dev                  # http://localhost:3000
```

The gallery is fully browsable **before** Supabase is provisioned: with no env
vars the app serves the curated archive from `src/lib/seed.ts`, and the admin
portal reports that it is not yet connected instead of erroring.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). This
   creates the `artworks` and `inquiries` tables, all row-level-security
   policies, and the public `artwork-media` storage bucket.
3. Optionally run [`supabase/seed.sql`](supabase/seed.sql) to load the archive.
4. Under **Authentication → Users**, add the artist's email and password. There
   is no sign-up flow — the curator account is created here.
5. Copy the project URL and anon key into `.env.local`.

### Row-level security model

| Table / bucket | anon (collector) | authenticated (curator) |
| --- | --- | --- |
| `artworks` | read published only | full CRUD |
| `inquiries` | insert only | read / update / delete |
| `artwork-media` | read | read / write / delete |

Collectors never sign in and never read inquiries.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home — hero, ticker, pavilion, atelier, craft, process, endorsements, commission desk |
| `/works` | Filterable archive index |
| `/works/[id]` | Piece detail — zoom lens, view-in-room, specifications, WhatsApp |
| `/api/inquiries` | Public commission enquiry endpoint (validated, rate-limited) |
| `/admin/login` | Curator authentication (reached only via the footer lock icon) |
| `/admin/dashboard` | Add / edit / reorder artworks, manage inquiry status workflow |

There is deliberately **no admin link in the header**.

## The WhatsApp acquisition flow

Every card, the curatorial lightbox and the piece page render the same
dynamically-constructed message pointing at `+91 98471 39131`:

```
Greetings Muhsingraphy, I would like to inquire about acquiring the piece:
'<Title>' | Script: <Script> | Medium: <Medium> | Dimensions: <Dimensions>
| Ref ID: #<id>. View: <Artwork URL>
```

The builder lives in [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) so the payload
cannot drift between surfaces.

## Project structure

```
src/
  app/            routes (home, works, works/[id], admin, api)
  components/
    site/         navbar, hero, pavilion, atelier, craft, process, footer…
    ui/           brand marks, theme toggle, motion primitives, WhatsApp button
    admin/        login form, dashboard, artwork drawer
  lib/            types, site config, whatsapp, supabase clients, admin API
  middleware.ts   refreshes the session and gates /admin
supabase/
  schema.sql      tables, RLS policies, storage bucket
  seed.sql        archive seed
```

## Brand assets

Derived from the original `محسن` emblem and stored in `public/assets/`:

- `emblem-mark.png` — ink tone (light mode header / footer / favicon)
- `emblem-light.png` — light tone (dark mode header)
- `emblem-gold.png` — brushed gold
- `emblem-lg.png`, `emblem-sm.png`, `og-emblem.png` — sizes
- `artwork-01.jpg` — placeholder canvas
- `apple-touch-icon.png`

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
```

## Notes

- TypeScript is pinned to `^6` because Next 15 does not yet support the TS 7
  native compiler API.
- `next.config.mjs` sets an explicit `@ → src` webpack alias so the path alias
  resolves identically under `tsc` and webpack.
- Images from Supabase Storage are allowed via `images.remotePatterns`.