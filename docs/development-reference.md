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

## Known Constraints

- `@/*` resolves to `src/*`, so runtime code and shared code live in the same tree.
- [`data/db.sqlite`](/home/fletchervaughn/witching-hour-app/data/db.sqlite) is local file-backed storage only.
- The nested [`witching-hour-app/`](/home/fletchervaughn/witching-hour-app/witching-hour-app) directory is legacy and should not be confused with the top-level project root.

## Verification Checklist

After documentation-sensitive code changes, verify:

1. `npm run dev` starts cleanly.
2. `/` renders the hero, feed/token previews, and the Base sign-in panel shell.
3. `/feed`, `/token`, and `/stream` render.
4. `/.well-known/farcaster.json` returns JSON.
5. `/api/check-access`, `/api/posts`, and `/api/ai` respond with JSON or the expected text response.

## Cleanup Targets

- Remove or archive the nested legacy [`witching-hour-app/`](/home/fletchervaughn/witching-hour-app/witching-hour-app) scaffold once no longer needed.
- If Chaturbate private endpoints are still needed anywhere, move them behind an authenticated admin path and rotate any tokens that were previously exposed.
