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
- Design tokens are CSS variables in `src/app/globals.css`, surfaced to Tailwind
  in `tailwind.config.ts`. Use token classes (`text-ink`, `bg-canvas`,
  `border-line`, `text-gold`) rather than raw hex.

## Layout

```
src/app/{page,works,works/[id],admin/{login,dashboard},api/inquiries}
src/components/{site,ui,admin}
src/lib/{types,site,whatsapp,artworks,admin,seed,utils,supabase/*}
supabase/{schema.sql,seed.sql}
```
