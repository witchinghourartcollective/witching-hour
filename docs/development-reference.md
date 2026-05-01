# Development Reference

This file is the practical map of the codebase as it exists today.

## Current Runtime

The tracked production app is using [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app).

### Served pages

- [`src/app/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/page.tsx)
  Main Witching Hour landing page.
- [`src/app/feed/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/feed/page.tsx)
  Feed surface.
- [`src/app/token/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/token/page.tsx)
  Token overview and launch-status page.
- [`src/app/blog/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/blog/page.tsx)
  Blog demo route.
- [`src/app/rich-jewelz/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/rich-jewelz/page.tsx)
  Standalone themed route.
- [`src/app/stream/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/stream/page.tsx)
  Public-safe stream profile surface.

### Served API routes

- [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts)
  Checks whether a wallet holds the hOUR token.
- [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
  Token-gated AI response route.
- [`src/app/.well-known/farcaster.json/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/.well-known/farcaster.json/route.ts)
  Base/Farcaster manifest endpoint.
- [`src/app/api/posts/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/posts/route.ts)
  Local SQLite-backed posts API.
- [`src/app/api/base-auth/nonce/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/base-auth/nonce/route.ts)
  Base auth nonce endpoint.
- [`src/app/api/base-auth/verify/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/base-auth/verify/route.ts)
  Base auth verification endpoint.
- [`src/app/api/auth/dropbox/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/auth/dropbox/route.ts)
  Dropbox OAuth start endpoint.
- [`src/app/api/auth/dropbox/callback/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/auth/dropbox/callback/route.ts)
  Dropbox OAuth callback endpoint.
- [`src/app/api/spotify/highlight/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/spotify/highlight/route.ts)
  Spotify highlight lookup endpoint.
- [`src/app/api/stream/chaturbate/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/stream/chaturbate/route.ts)
  Stream data endpoint that should remain public-safe.
- [`src/app/api/cdp/test/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/cdp/test/route.ts)
  CDP test route.

### Runtime support files

- [`src/app/layout.tsx`](/home/fletchervaughn/witching-hour-app/src/app/layout.tsx)
  Layout, global styles, providers boundary, and miniapp metadata.
- [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts)
  Rewrites the stream host root to `/stream`.

## Shared Source Used By The Runtime

The runtime imports heavily from `src/` via the `@/*` alias.

### Components

- [`src/components/WalletStatus.tsx`](/home/fletchervaughn/witching-hour-app/src/components/WalletStatus.tsx)
- [`src/components/AIBox.tsx`](/home/fletchervaughn/witching-hour-app/src/components/AIBox.tsx)
- [`src/components/providers/AppProviders.tsx`](/home/fletchervaughn/witching-hour-app/src/components/providers/AppProviders.tsx)
- [`src/components/providers/ProvidersBoundary.tsx`](/home/fletchervaughn/witching-hour-app/src/components/providers/ProvidersBoundary.tsx)
- [`src/components/base/SignInWithBasePanelShell.tsx`](/home/fletchervaughn/witching-hour-app/src/components/base/SignInWithBasePanelShell.tsx)

### Libraries

- [`src/lib/azure-openai.ts`](/home/fletchervaughn/witching-hour-app/src/lib/azure-openai.ts)
  Azure OpenAI-compatible client and request helper.
- [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts)
  Search and fetch grounding used by the token-gated AI route.
- [`src/lib/hour-token.ts`](/home/fletchervaughn/witching-hour-app/src/lib/hour-token.ts)
  Base hOUR balance lookup with RPC timeout protection.
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
  Base-only wagmi configuration.
- [`src/lib/db.ts`](/home/fletchervaughn/witching-hour-app/src/lib/db.ts)
  SQLite posts store used by the tracked `src/app` API.
- [`src/lib/stream.ts`](/home/fletchervaughn/witching-hour-app/src/lib/stream.ts)
  Stream data normalization and public-safe shaping.
- [`src/lib/spotify.ts`](/home/fletchervaughn/witching-hour-app/src/lib/spotify.ts)
  Spotify integration helpers.
- [`src/lib/dropbox.ts`](/home/fletchervaughn/witching-hour-app/src/lib/dropbox.ts)
  Dropbox integration helpers.
- [`src/lib/activity.ts`](/home/fletchervaughn/witching-hour-app/src/lib/activity.ts)
  Onchain activity helpers.

## Known Constraints

- `@/*` resolves to `src/*`, so runtime code and shared code live in the same tree.
- [`data/db.sqlite`](/home/fletchervaughn/witching-hour-app/data/db.sqlite) is local file-backed storage only.
- The nested [`witching-hour-app/`](/home/fletchervaughn/witching-hour-app/witching-hour-app) directory is legacy and should not be confused with the top-level project root.
- Keep stream and Base auth endpoints public-safe. Secrets and private upstream data should stay server-side.

## Verification Checklist

After documentation-sensitive code changes, verify:

1. `npm run dev` starts cleanly.
2. `/` renders the hero, feed/token previews, and the Base sign-in panel shell.
3. `/feed`, `/token`, and `/stream` render.
4. `/.well-known/farcaster.json` returns JSON.
5. `/api/check-access`, `/api/posts`, `/api/ai`, `/api/base-auth/nonce`, and `/api/base-auth/verify` respond correctly.
6. If the stream or OAuth surfaces changed, verify `/api/stream/chaturbate`, `/api/auth/dropbox`, and `/api/auth/dropbox/callback`.

## Cleanup Targets

- Remove or archive the nested legacy [`witching-hour-app/`](/home/fletchervaughn/witching-hour-app/witching-hour-app) scaffold once no longer needed.
- Keep any private upstream endpoints behind authenticated routes and rotate secrets if they were previously exposed.
