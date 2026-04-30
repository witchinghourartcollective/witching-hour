# Witching Hour App

Witching Hour App is a Next.js 16 / React 19 web app for the Witching Hour media surface. The active product runtime lives in [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app) and currently covers:

- Base wallet sign-in and hOUR token access checks
- Grounded AI responses behind token gating
- Public pages for feed, token, blog, stream, and artist-specific surfaces
- A local SQLite-backed posts API
- Integration helpers for Dropbox OAuth, Spotify, Farcaster/Base metadata, and onchain activity

There is old scaffold material elsewhere in the repo. If you are changing current product behavior, start in `src/`.

## Quickstart

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000/
http://localhost:3000/feed
http://localhost:3000/token
http://localhost:3000/blog
http://localhost:3000/rich-jewelz
http://localhost:3000/stream
http://localhost:3000/.well-known/farcaster.json
```

The app boots without every secret configured. Fill only the env groups required for the feature you are testing.

## What Is Live

The current App Router surface is defined by files under [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app):

- `/`
- `/feed`
- `/token`
- `/blog`
- `/rich-jewelz`
- `/stream`
- `/.well-known/farcaster.json`
- `/api/ai`
- `/api/check-access`
- `/api/posts`

Important runtime files:

- [`src/app/layout.tsx`](/home/fletchervaughn/witching-hour-app/src/app/layout.tsx)
  App-wide metadata and outer layout.
- [`src/app/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/page.tsx)
  Main landing page with navigation, previews, and Base sign-in shell.
- [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
  Enforces hOUR gating before dispatching grounded generation.
- [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts)
  Reads Base token state and returns access status.
- [`src/app/api/posts/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/posts/route.ts)
  SQLite-backed posts API.
- [`src/app/.well-known/farcaster.json/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/.well-known/farcaster.json/route.ts)
  Farcaster/Base miniapp manifest endpoint.
- [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts)
  Rewrites `stream.witchinghourmac.com/` to `/stream`. This replaces the earlier `middleware.ts` approach.

## Repo Layout

- [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app)
  The only active router tree.
- [`src/components/`](/home/fletchervaughn/witching-hour-app/src/components)
  Active component library used by the `src/app` runtime.
- [`src/components/providers/AppProviders.tsx`](/home/fletchervaughn/witching-hour-app/src/components/providers/AppProviders.tsx)
  Wagmi and React Query providers.
- [`src/components/providers/ProvidersBoundary.tsx`](/home/fletchervaughn/witching-hour-app/src/components/providers/ProvidersBoundary.tsx)
  Server-to-client provider boundary used by the layout.
- [`src/lib/`](/home/fletchervaughn/witching-hour-app/src/lib)
  Shared integration logic for wallet, AI, Spotify, Dropbox, stream data, onchain reads, and SQLite access.
- [`data/db.sqlite`](/home/fletchervaughn/witching-hour-app/data/db.sqlite)
  Local SQLite database used by the posts API. Treat it as local runtime state, not shared content truth.
- [`workers/github-webhook/`](/home/fletchervaughn/witching-hour-app/workers/github-webhook)
  Cloudflare Worker deployed by `npm run deploy:webhook`.
- [`witching-hour-app/`](/home/fletchervaughn/witching-hour-app/witching-hour-app)
  Older nested duplicate scaffold. Treat as legacy unless you are intentionally cleaning it up.
- [`Witching Hour Music/`](/home/fletchervaughn/witching-hour-app/Witching%20Hour%20Music)
- [`witching hour/`](/home/fletchervaughn/witching-hour-app/witching%20hour)
- [`my-tac-project/`](/home/fletchervaughn/witching-hour-app/my-tac-project)
  Extra historical experiments or duplicate app shells. Do not assume they represent the current product.

## Stack

- Next.js 16
- React 19
- TypeScript
- wagmi + Base Account connector
- viem
- Azure OpenAI-compatible Responses / inference integrations
- SQLite via `better-sqlite3`
- Spotify client-credentials lookup
- Dropbox OAuth helpers
- Supabase SSR/client helpers

## Local Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill in only the env groups required for the features you need.
4. Start the app with `npm run dev`.
5. Verify the routes in the Quickstart section.
6. If you change API behavior, also hit `/api/check-access`, `/api/posts`, and `/api/ai` directly.

## Scripts

- `npm run dev`
  Start Next.js locally.
- `npm run build`
  Create a production build.
- `npm run start`
  Run the production server.
- `npm run lint`
  Run ESLint.
- `npm run send:hour -- <to> <amount> [--gas-topup <eth>]`
  Execute [`scripts/send-hour.mjs`](/home/fletchervaughn/witching-hour-app/scripts/send-hour.mjs) to send `hOUR` and optionally top up Base ETH for gas first.
- `npm run send:test-tx`
  Execute [`scripts/send-test-tx.mjs`](/home/fletchervaughn/witching-hour-app/scripts/send-test-tx.mjs).
- `npm run verify:builder-code`
  Execute [`scripts/verify-builder-code.mjs`](/home/fletchervaughn/witching-hour-app/scripts/verify-builder-code.mjs).
- `npm run deploy:webhook`
  Deploy the Cloudflare Worker from [`workers/github-webhook/`](/home/fletchervaughn/witching-hour-app/workers/github-webhook).

## Current Priorities

If you are picking this project up cold, these are the next concrete things to resolve:

1. Keep the hOUR-gated AI path healthy.
   The `503` behavior in [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts) and [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts) is intentional. Keep verifying the configured Base RPC is reliable enough for wallet checks.
2. Verify the AI provider contract end to end.
   Confirm one real deployed model exists for the selected provider path in [`src/lib/azure-openai.ts`](/home/fletchervaughn/witching-hour-app/src/lib/azure-openai.ts), and verify the grounded flow in [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts) still works with current credentials.
3. Keep the feed tip action honest.
   The feed now uses transfer simulation instead of `tradingEnabled()`. Keep that path aligned with the actual contract behavior.
4. Keep the stream surface public-safe.
   The stream host rewrite now lives in [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts). Continue treating any diagnostics or private upstream tokens as server-only and rotate anything that was ever exposed.
5. Reduce repo ambiguity.
   Decide what to do with the legacy nested scaffolds (`witching-hour-app/`, `my-tac-project/`) so future work has one obvious production path.

## Environment Variables

Start with [`.env.example`](/home/fletchervaughn/witching-hour-app/.env.example). Only a subset of features require secrets.

### Base and wallet access

- `NEXT_PUBLIC_BASE_BUILDER_CODE`
  Builder code override used by the wallet config.
- `BASE_BUILDER_CODE`
  Present for scripts and future consolidation; the current client runtime reads the `NEXT_PUBLIC_` variant.
- `NEXT_PUBLIC_BASESCAN_API`
  Used by Base activity lookups. Current free-tier coverage may return no Base history and should not be treated as an access-control dependency.
- `BASE_RPC_URL`
  Optional RPC override for local scripts.
- `BASE_TEST_SENDER_PRIVATE_KEY` or `PRIVATE_KEY`
  Used by the local send scripts.

Transfer helpers:

- `npm run send:hour -- 0xRecipient 777`
  Sends `777 hOUR` from the configured Base wallet.
- `npm run send:hour -- 0xRecipient 777 --gas-topup 0.00002`
  Sends Base ETH first, waits for that receipt, then sends `hOUR`.
- The send script resolves the signer from `.env.local`, `.env`, or `../witching-hour-token/.env`.
- The send script prints both transaction hashes when an ETH top-up is included.

### AI route

- `AI_PROVIDER`
- `AZURE_OPENAI_MODEL`
- `AZURE_OPENAI_API_FLAVOR`
- `AZURE_OPENAI_BASE_URL`
- `AZURE_OPENAI_API_KEY`
- `AZURE_AI_PROJECT_ENDPOINT`
- `AZURE_AI_INFERENCE_BASE_URL`

Compatibility aliases:

- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`

qBraid options:

- `QBRAID_BASE_URL`
- `QBRAID_API_KEY`
- `QBRAID_MODEL`

The AI route in [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts) performs token gating first, then delegates grounding and model dispatch to [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts). Each provider path still needs a deployed model name on the target service.

### Farcaster and app metadata

- `NEXT_PUBLIC_APP_URL`
- `BASE_BUILDER_OWNER_ADDRESS`
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`

### Dropbox OAuth

- `DROPBOX_APP_KEY`
- `DROPBOX_APP_SECRET`
- `DROPBOX_REDIRECT_URI`

### Spotify

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_ARTIST_ID`
- `SPOTIFY_MARKET`

### Supabase and auth helpers

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `PRIVY_APP_SECRET`

### CDP test route

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`

### Stream page

- `STREAM_CHATURBATE_USERNAME`
- `STREAM_CHATURBATE_EVENTS_API_URL`
- `STREAM_CHATURBATE_PUBLIC_EVENTS_API_URL`
- `STREAM_CHATURBATE_STATS_API_URL`
- `STREAM_CHATURBATE_SECONDARY_USERNAME`
- `STREAM_CHATURBATE_SECONDARY_EVENTS_API_URL`
- `STREAM_CHATURBATE_SECONDARY_PUBLIC_EVENTS_API_URL`
- `STREAM_CHATURBATE_SECONDARY_STATS_API_URL`

The stream credentials stay server-side. The rewrite host handling is documented in [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts).

## Core Modules

- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
  Base-focused wallet config and builder-code wiring.
- [`src/lib/hour-token.ts`](/home/fletchervaughn/witching-hour-app/src/lib/hour-token.ts)
  hOUR token access logic used by gated flows.
- [`src/lib/activity.ts`](/home/fletchervaughn/witching-hour-app/src/lib/activity.ts)
  Onchain activity lookup helpers.
- [`src/lib/onchain.ts`](/home/fletchervaughn/witching-hour-app/src/lib/onchain.ts)
  Shared Base/onchain utilities.
- [`src/lib/azure-openai.ts`](/home/fletchervaughn/witching-hour-app/src/lib/azure-openai.ts)
  Provider configuration and request helpers for AI backends.
- [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts)
  Grounding and fetch/search orchestration for AI responses.
- [`src/lib/db.ts`](/home/fletchervaughn/witching-hour-app/src/lib/db.ts)
  Opens `data/db.sqlite` and ensures the `posts` table exists.
- [`src/lib/dropbox.ts`](/home/fletchervaughn/witching-hour-app/src/lib/dropbox.ts)
  Dropbox OAuth helpers.
- [`src/lib/spotify.ts`](/home/fletchervaughn/witching-hour-app/src/lib/spotify.ts)
  Spotify artist highlight lookup.
- [`src/lib/stream.ts`](/home/fletchervaughn/witching-hour-app/src/lib/stream.ts)
  Server-side stream data helpers.

## Working Rules

- Do not reintroduce a second active App Router tree.
- Treat `src/app/` as the runtime source of truth.
- Be careful with assumptions about persistence. `data/db.sqlite` is local file-backed storage.
- Review `git status` before edits; this repository often contains unrelated work in progress.

## Tooling Notes

- The repo includes [`.tool-versions`](/home/fletchervaughn/witching-hour-app/.tool-versions) with `golang 1.26.1`.
- Go is not required for ordinary Next.js development here. Treat it as an auxiliary pinned toolchain.

## Documentation Map

- [`docs/development-reference.md`](/home/fletchervaughn/witching-hour-app/docs/development-reference.md)
- [`docs/base-miniapp.md`](/home/fletchervaughn/witching-hour-app/docs/base-miniapp.md)
- [`docs/next-session-start.md`](/home/fletchervaughn/witching-hour-app/docs/next-session-start.md)
- [`docs/pickup-guide.md`](/home/fletchervaughn/witching-hour-app/docs/pickup-guide.md)
- [`mistakes.md`](/home/fletchervaughn/witching-hour-app/mistakes.md)
