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
5. Copy the project URL, publishable key and secret key into `.env.local`
   (see [`.env.example`](.env.example)).

### How the auth stack fits together

The server side composes two Supabase packages, following the pattern in
[`@supabase/server`'s SSR guide](https://github.com/supabase/server):

- **`@supabase/ssr`** owns the cookie session lifecycle. `src/middleware.ts`
  refreshes the rotating access-token cookie on every `/admin` request, because
  Server Components cannot write cookies.
- **`@supabase/server`** provides the primitives on top:
  `verifyCredentials` cryptographically verifies the session JWT against the
  project JWKS, `createContextClient` builds an RLS-scoped client bound to that
  verified token, and `createAdminClient` builds a service-role client.

They are wired together in [`src/lib/supabase/context.ts`](src/lib/supabase/context.ts),
which returns the same `{ supabase, supabaseAdmin, userClaims }` bundle the
high-level `withSupabase` wrapper exposes:

| Call | Client | Used by |
| --- | --- | --- |
| `createSupabaseContext({ auth: 'user' })` | RLS as the signed-in curator | `/admin/dashboard` gate |
| `createSupabaseContext({ auth: 'none' })` | RLS as `anon` | public artwork reads, enquiry inserts |

`@supabase/server` does not replace `@supabase/ssr` in cookie-based frameworks —
the two coexist, as its documentation states. The high-level `withSupabase` /
`createSupabaseContext` wrappers from the package are designed for header-based
auth (Edge Functions, Workers) and are not used here.

Environment variables are bridged in
[`src/lib/supabase/env.ts`](src/lib/supabase/env.ts), which is guarded by
`server-only` so the secret key cannot reach the browser. JWKS is derived from
the project URL automatically.

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
  middleware.ts   refreshes the @supabase/ssr session and gates /admin
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