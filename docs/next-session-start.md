# Next Session Start

Use this file as the shortest reliable handoff.

## Current State

- Repo: `/home/fletchervaughn/witching-hour-app`
- Active deployed app: `https://app.witchinghourmac.com`
- Vercel project: `witching-hour-app`
- Active router: `src/app`
- Active component tree: `src/components`

## First Checks

1. Run `npm run dev`
2. Open `/`
3. Open `/feed`
4. Open `/token`
5. Confirm `/.well-known/farcaster.json` still responds

## What Matters Most

- `src/app/layout.tsx`
  - Injects the Base miniapp metadata into `<head>`.
- `src/app/.well-known/farcaster.json/route.ts`
  - Returns the manifest and builder-owner data.
- `src/lib/wallet.ts`
  - Base-only wallet config and builder-code attribution.
- `src/components/feed/FeedPageShell.tsx`
  - Protects the feed route from SSR/hydration issues.
- `src/app/api/posts/route.ts`
  - Local feed API backed by SQLite.
- `src/lib/spotify.ts`
  - Spotify highlight integration used on the homepage.

## Known Realities

- `data/db.sqlite` is local file-backed storage.
- Spotify, Dropbox, CDP, and parts of Supabase are optional integrations gated by env vars.
- The nested `witching-hour-app/` directory is legacy and should not be treated as the active app.
- The working tree may contain unrelated in-progress product work. Review `git status` before touching app code.

## Likely Next Work

- Improve product UX on `/feed`
- Tighten the homepage copy and information hierarchy
- Decide whether to keep or remove the legacy nested app directory
- Replace remaining handoff-style docs with stable repo docs as the architecture settles
