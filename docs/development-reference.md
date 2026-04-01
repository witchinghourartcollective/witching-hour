# Development Reference

This file is the practical map of the active app.

## Active Surfaces

### Pages

- `src/app/page.tsx`
  - Main homepage with hero, Spotify spotlight, feed preview, token preview, and wallet panel.
- `src/app/feed/page.tsx`
  - Feed entry route. Hands off to `FeedPageShell` to keep wallet-heavy UI client-only.
- `src/app/token/page.tsx`
  - Token overview and launch-status page for hOUR.
- `src/app/rich-jewelz/page.tsx`
  - Standalone themed route.
- `src/app/blog/page.tsx`
  - Demo runtime-loaded blog page.

### API Routes

- `src/app/api/posts/route.ts`
  - Local SQLite-backed post listing and insert route.
- `src/app/api/spotify/highlight/route.ts`
  - Returns the latest artist release highlight or a non-fatal error payload.
- `src/app/api/auth/dropbox/route.ts`
  - Starts Dropbox OAuth.
- `src/app/api/auth/dropbox/callback/route.ts`
  - Completes Dropbox OAuth and stores cookies.
- `src/app/api/base-auth/nonce/route.ts`
  - Base auth nonce route.
- `src/app/api/base-auth/verify/route.ts`
  - Base auth verification route.
- `src/app/api/cdp/test/route.ts`
  - Read-only CDP sanity check route.
- `src/app/.well-known/farcaster.json/route.ts`
  - Base miniapp / Farcaster manifest.

## Important Libraries

### Wallet and Base configuration

- `src/lib/wallet.ts`
  - Base-only wagmi config
  - injected + Base Account connectors
  - builder-code attribution via ERC-8021

### Data and integrations

- `src/lib/db.ts`
  - Opens `data/db.sqlite` and ensures the `posts` table exists.
- `src/lib/activity.ts`
  - Reads recent token transfers from BaseScan.
- `src/lib/spotify.ts`
  - Fetches artist and latest release data from Spotify.
- `src/lib/dropbox.ts`
  - Shared Dropbox OAuth helpers and cookie naming.

### Providers and hydration boundaries

- `src/components/providers/AppProviders.tsx`
  - Shared runtime providers.
- `src/components/providers/ProvidersBoundary.tsx`
  - Mounted boundary for provider initialization.
- `src/components/feed/FeedPageShell.tsx`
  - Client-only lazy import wrapper for the feed page.
- `src/components/base/SignInWithBasePanelShell.tsx`
  - Client-only wrapper around wallet auth UI.

## Current Constraints

- The active app router is `src/app`. Do not revive an extra top-level `app/` tree.
- The active component tree is `src/components`.
- There is still a legacy nested `witching-hour-app/` folder in the repo. It is not the active app.
- The feed API writes to a local SQLite file. That is fine for local development and demos, but not a durable production data architecture.
- The token flow is intentionally Base-only.

## Local Verification Checklist

After major UI or wallet changes, verify:

1. `/` loads without hydration issues
2. `/feed` loads before a wallet is connected
3. Wallet connect flow still works on Base
4. `/token` still reflects the launch-status messaging
5. `/.well-known/farcaster.json` returns valid JSON
6. `/api/spotify/highlight` degrades cleanly when Spotify env vars are missing

## Cleanup Targets

These are valid cleanup candidates, but they should be handled intentionally:

- nested `witching-hour-app/`
- legacy top-level `components/` references that are no longer used
- stale docs that describe already-removed routing/layout problems
