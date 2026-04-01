# Witching Hour App

Witching Hour is a Next.js 16 app for a Base-native creative surface: wallet connection, ritual feed interactions, token-aware UI, miniapp metadata, and a small set of supporting server routes.

This repo is not a clean greenfield app. It contains the active application plus some legacy/reference material from earlier iterations. The main documentation goal is to make the live path obvious.

## What Is Live

- Active app router: `src/app`
- Active component tree: `src/components`
- Live routes:
  - `/`
  - `/feed`
  - `/token`
  - `/rich-jewelz`
  - `/blog`
- Important API routes:
  - `/.well-known/farcaster.json`
  - `/api/posts`
  - `/api/spotify/highlight`
  - `/api/auth/dropbox`
  - `/api/auth/dropbox/callback`
  - `/api/base-auth/nonce`
  - `/api/base-auth/verify`

## Important Repo Caveat

There is a nested `witching-hour-app/` directory in this repo that contains an older duplicate app scaffold. Treat it as legacy material unless you are explicitly cleaning it up. The active app for local development and deployment is the top-level project rooted at this `README.md`.

## Stack

- Next.js App Router
- React 19
- TypeScript
- wagmi + Base Account connector
- SQLite via `better-sqlite3`
- Supabase helpers for SSR/client auth plumbing
- Dropbox OAuth helpers
- Spotify artist/release lookup

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` and add the variables you need for the surfaces you are testing.

3. Start the app:

```bash
npm run dev
```

4. Review the main paths:

```text
http://localhost:3000/
http://localhost:3000/feed
http://localhost:3000/token
http://localhost:3000/blog
```

## Scripts

- `npm run dev` starts Next.js locally
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run send:test-tx` sends a test transaction using the local script
- `npm run verify:builder-code` verifies Base builder-code wiring
- `npm run deploy:webhook` deploys the Cloudflare Worker in `workers/github-webhook`

## Environment Variables

Only some features require secrets. The app can boot without every integration configured.

### Core app / miniapp

- `NEXT_PUBLIC_APP_URL`
  - Used for the Farcaster manifest base URL. Defaults to `https://app.witchinghourmac.com`.
- `NEXT_PUBLIC_BASE_BUILDER_CODE`
  - Optional override for the default builder code baked into `src/lib/wallet.ts`.
- `BASE_BUILDER_OWNER_ADDRESS`
  - Optional override for `/.well-known/farcaster.json`.
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`

### Wallet / chain inspection

- `NEXT_PUBLIC_BASESCAN_API`
  - Used by `src/lib/activity.ts` to fetch recent token transfers.

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Note: the current code reads `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` in the helpers under `src/utils/supabase/*`.

### Dropbox OAuth

- `DROPBOX_APP_KEY`
- `DROPBOX_APP_SECRET`
- `DROPBOX_REDIRECT_URI`

### Spotify highlight

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_ARTIST_ID`
- `SPOTIFY_MARKET`

If the Spotify variables are absent, the homepage spotlight renders its fallback state instead of failing the whole page.

### CDP test route

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`

These are only required for the read-only CDP test route at `/api/cdp/test`.

### Local scripts

- `BASE_RPC_URL`
- `BASE_TEST_SENDER_PRIVATE_KEY` or `PRIVATE_KEY`

These are used by `scripts/send-test-tx.mjs`.

## Architecture Notes

### Routing

- `src/app/layout.tsx` injects Base miniapp metadata into the document head.
- `src/app/.well-known/farcaster.json/route.ts` returns the Farcaster/Base manifest.
- `src/app/feed/page.tsx` delegates to a client-only shell to avoid SSR/hydration issues with wallet code.

### Wallet configuration

- `src/lib/wallet.ts` configures wagmi for Base only.
- Connectors:
  - injected wallet
  - Base Account
- ERC-8021 attribution is enabled via `dataSuffix`.

### Feed storage

- `src/lib/db.ts` opens `data/db.sqlite`.
- `src/app/api/posts/route.ts` exposes a minimal read/write API over the `posts` table.
- This is local SQLite storage, not a multi-user production backend yet.

### Spotify integration

- `src/lib/spotify.ts` uses Spotify client credentials.
- `src/app/api/spotify/highlight/route.ts` wraps the lookup in a safe JSON response.

## Operational Notes

- Do not add a second router tree. The active app router is `src/app`.
- Prefer moving useful reference code into `src/components` rather than building against the legacy top-level `components/` tree.
- Keep secrets in `.env.local` locally and in your deployment platform for production.
- `data/db.sqlite` is a local file-backed store. Be careful about assumptions when deploying to ephemeral environments.

## Documentation Map

- [`docs/development-reference.md`](/home/fletchervaughn/witching-hour-app/docs/development-reference.md)
- [`docs/base-miniapp.md`](/home/fletchervaughn/witching-hour-app/docs/base-miniapp.md)
- [`docs/next-session-start.md`](/home/fletchervaughn/witching-hour-app/docs/next-session-start.md)
- [`docs/pickup-guide.md`](/home/fletchervaughn/witching-hour-app/docs/pickup-guide.md)
- [`mistakes.md`](/home/fletchervaughn/witching-hour-app/mistakes.md)
