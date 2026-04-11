# Witching Hour App

Witching Hour is a Next.js app for a Base-native media surface: wallet sign-in, token-gated access checks, grounded AI responses, a stream page, a small SQLite-backed posts API, and integration routes for Dropbox, Spotify, and Farcaster/Base miniapp metadata.

The active runtime lives under [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app). There is still legacy material elsewhere in the repo, but if you are changing product behavior, start in `src/`.

## Start Here

If you only need the app running locally:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then verify:

```text
http://localhost:3000/
http://localhost:3000/feed
http://localhost:3000/token
http://localhost:3000/stream
http://localhost:3000/.well-known/farcaster.json
```

Feature-specific env minimums:

- Wallet and Base sign-in UI: no secret required for basic rendering; set `NEXT_PUBLIC_BASE_BUILDER_CODE` and `NEXT_PUBLIC_BASESCAN_API` if you need attribution and Base activity lookups.
- AI route: one of the Azure/OpenAI or qBraid env groups documented below plus a deployed model name.
- Dropbox OAuth: `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REDIRECT_URI`.
- Spotify highlight: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_ARTIST_ID`.
- Stream surface: the `STREAM_CHATURBATE_*` variables.

## Runtime Truth

The current runtime comes from [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app).

Live pages and routes currently defined there:

- `/`
- `/feed`
- `/token`
- `/rich-jewelz`
- `/blog`
- `/stream`
- `/api/ai`
- `/api/check-access`
- `/api/stream/chaturbate`
- `/.well-known/farcaster.json`
- `/api/posts`
- `/api/spotify/highlight`
- `/api/auth/dropbox`
- `/api/auth/dropbox/callback`
- `/api/base-auth/nonce`
- `/api/base-auth/verify`
- `/api/cdp/test`

Important supporting runtime files:

- [`middleware.ts`](/home/fletchervaughn/witching-hour-app/middleware.ts)
  Rewrites `stream.witchinghourmac.com/` to `/stream`.
- [`src/components/base/SignInWithBasePanelShell.tsx`](/home/fletchervaughn/witching-hour-app/src/components/base/SignInWithBasePanelShell.tsx)
  Client-side loader for the Base sign-in panel shown on the root page.
- [`src/components/providers/ProvidersBoundary.tsx`](/home/fletchervaughn/witching-hour-app/src/components/providers/ProvidersBoundary.tsx)
  Bridges the server-rendered layout into the app's wagmi/react-query provider tree.
- [`src/lib/azure-openai.ts`](/home/fletchervaughn/witching-hour-app/src/lib/azure-openai.ts)
  AI provider configuration and transport helpers.
- [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts)
  Web search/fetch grounding flow used by `/api/ai`.

## Repo Layout

- [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app)
  The only active router tree.
- [`src/components/`](/home/fletchervaughn/witching-hour-app/src/components)
  Active component library used by the top-level app through the `@/*` alias.
- [`src/lib/`](/home/fletchervaughn/witching-hour-app/src/lib)
  Shared integration logic, wallet config, SQLite access, and Azure OpenAI helpers.
- [`data/db.sqlite`](/home/fletchervaughn/witching-hour-app/data/db.sqlite)
  Local SQLite store for the posts API in the `src/app` tree.
- [`workers/github-webhook/`](/home/fletchervaughn/witching-hour-app/workers/github-webhook)
  Cloudflare Worker deployed by `npm run deploy:webhook`.
- [`witching-hour-app/`](/home/fletchervaughn/witching-hour-app/witching-hour-app)
  Older nested duplicate scaffold. Treat as legacy unless you are intentionally cleaning it up.

## Stack

- Next.js 16
- React 19
- TypeScript
- wagmi + Base Account connector
- viem
- Azure OpenAI-compatible Responses API integration
- SQLite via `better-sqlite3`
- Spotify client-credentials lookup
- Dropbox OAuth helpers
- Supabase SSR/client helpers

## Local Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill in only the integrations you need for the surface you are testing. The app can boot without every integration configured.
4. Start the dev server with `npm run dev`.
5. Verify the routes listed in the Start Here section plus `/api/check-access` and `/api/stream/chaturbate` if you are touching API behavior.

## Tooling Notes

- The repo includes [`.tool-versions`](/home/fletchervaughn/witching-hour-app/.tool-versions) with `golang 1.26.1`.
- Go is not required for basic Next.js development in this repo. Treat it as a pinned auxiliary toolchain, not a prerequisite for booting the app.

## Scripts

- `npm run dev`
  Start Next.js locally.
- `npm run build`
  Create a production build.
- `npm run start`
  Run the production server.
- `npm run lint`
  Run ESLint.
- `npm run send:test-tx`
  Execute [`scripts/send-test-tx.mjs`](/home/fletchervaughn/witching-hour-app/scripts/send-test-tx.mjs).
- `npm run verify:builder-code`
  Execute [`scripts/verify-builder-code.mjs`](/home/fletchervaughn/witching-hour-app/scripts/verify-builder-code.mjs).
- `npm run deploy:webhook`
  Deploy the Cloudflare Worker from [`workers/github-webhook/`](/home/fletchervaughn/witching-hour-app/workers/github-webhook).

## Environment Variables

Only a subset of features require secrets. Start with `.env.example` and keep `.env.local` out of version control.

### Base and wallet access

- `NEXT_PUBLIC_BASE_BUILDER_CODE`
  Builder code override used in [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts).
- `BASE_BUILDER_CODE`
  Present in `.env.example`; useful for scripts or future consolidation, but the current wallet code reads the `NEXT_PUBLIC_` variant.
- `NEXT_PUBLIC_BASESCAN_API`
  Used by Base activity lookups in the `src/` tree.
- `BASE_RPC_URL`
  Optional RPC override for local scripts.
- `BASE_TEST_SENDER_PRIVATE_KEY` or `PRIVATE_KEY`
  Used by the send-test-transaction script.

### AI route

- `AZURE_AI_INFERENCE_BASE_URL`
- `AZURE_OPENAI_BASE_URL`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_MODEL`
- `AZURE_AI_PROJECT_ENDPOINT`
- `AZURE_OPENAI_API_FLAVOR`
- `AI_PROVIDER`

Compatibility aliases:

- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`

qBraid-compatible options:

- `QBRAID_BASE_URL`
- `QBRAID_API_KEY`
- `QBRAID_MODEL`

The current [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts) enforces hOUR token gating first, then delegates generation to [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts). Grounding can call the Azure OpenAI-compatible `responses` API, the Azure AI inference `chat/completions` API, or qBraid, but each path still needs a deployed model name on the target resource.

To use a qBraid A100 for the WHM AI surface, keep the website on its normal host and point only the AI route at qBraid. Set `AI_PROVIDER=qbraid`, `QBRAID_BASE_URL=https://api.qbraid.com/api`, `QBRAID_API_KEY`, and `QBRAID_MODEL` in `.env.local`. That lets `/api/ai` use qBraid for model execution while the public Next.js app continues to run where it already belongs.

### Farcaster and miniapp metadata

- `NEXT_PUBLIC_APP_URL`
- `BASE_BUILDER_OWNER_ADDRESS`
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`

These drive the live miniapp manifest and metadata flow.

### Dropbox OAuth

- `DROPBOX_APP_KEY`
- `DROPBOX_APP_SECRET`
- `DROPBOX_REDIRECT_URI`

### Spotify highlight

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

### Stream surface

- `STREAM_CHATURBATE_USERNAME`
- `STREAM_CHATURBATE_EVENTS_API_URL`
- `STREAM_CHATURBATE_PUBLIC_EVENTS_API_URL`
- `STREAM_CHATURBATE_STATS_API_URL`
- `STREAM_CHATURBATE_SECONDARY_USERNAME`
- `STREAM_CHATURBATE_SECONDARY_EVENTS_API_URL`
- `STREAM_CHATURBATE_SECONDARY_PUBLIC_EVENTS_API_URL`
- `STREAM_CHATURBATE_SECONDARY_STATS_API_URL`

Only public-safe fields are returned by `/api/stream/chaturbate`. The tokenized private endpoint URLs remain server-side only.

## Architecture Notes

### Runtime flow

- [`src/app/layout.tsx`](/home/fletchervaughn/witching-hour-app/src/app/layout.tsx)
  Base miniapp metadata.
- [`src/app/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/page.tsx)
  Main Witching Hour landing page with navigation, Spotify spotlight, feed preview, token preview, and the Base sign-in shell.
- [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts)
  Reads hOUR token balance on Base and returns access state.
- [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
  Enforces token gating before dispatching grounded generation.
- [`src/app/.well-known/farcaster.json/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/.well-known/farcaster.json/route.ts)
  Manifest endpoint for Farcaster/Base.
- [`src/app/stream/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/stream/page.tsx)
  Server-rendered public-safe stream profile page.
- [`src/app/api/stream/chaturbate/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/stream/chaturbate/route.ts)
  Public-safe JSON mirror of stream configuration.
- [`src/app/api/posts/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/posts/route.ts)
  SQLite-backed posts API.
- [`src/lib/db.ts`](/home/fletchervaughn/witching-hour-app/src/lib/db.ts)
  Opens `data/db.sqlite` and ensures the `posts` table exists.
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
  Base-only wagmi config with builder-code attribution.
- [`src/components/providers/AppProviders.tsx`](/home/fletchervaughn/witching-hour-app/src/components/providers/AppProviders.tsx)
  Wagmi and React Query providers used by the runtime boundary.

## Working Rules

- Do not reintroduce a second app router tree.
- Be careful with assumptions about persistence. `data/db.sqlite` is local file-backed storage.
- Review `git status` before edits; this repository often has unrelated work in progress.

## Documentation Map

- [`docs/development-reference.md`](/home/fletchervaughn/witching-hour-app/docs/development-reference.md)
- [`docs/base-miniapp.md`](/home/fletchervaughn/witching-hour-app/docs/base-miniapp.md)
- [`docs/next-session-start.md`](/home/fletchervaughn/witching-hour-app/docs/next-session-start.md)
- [`docs/pickup-guide.md`](/home/fletchervaughn/witching-hour-app/docs/pickup-guide.md)
- [`mistakes.md`](/home/fletchervaughn/witching-hour-app/mistakes.md)
