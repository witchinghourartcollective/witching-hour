# Pickup Guide

This is the practical product-and-codebase orientation note.

## Repo Truth

- Build on the top-level app in this repo.
- The canonical router is `src/app`.
- The canonical component tree is `src/components`.
- `data/db.sqlite` is the current local store for feed posts.

## Product Direction

The current app is aiming for:

- wallet-first interaction
- Base-native identity and transaction context
- ritual/feed publishing instead of generic social posting
- a more intentional Witching Hour visual system instead of generic starter styling

## What To Preserve

- Base miniapp metadata in `src/app/layout.tsx`
- Manifest logic in `src/app/.well-known/farcaster.json/route.ts`
- Base-only wallet configuration in `src/lib/wallet.ts`
- SSR-safe wallet boundaries in `src/components/providers/*` and `src/components/feed/FeedPageShell.tsx`
- Local feed API in `src/app/api/posts/route.ts`

## What Still Needs Care

- The feed storage layer is minimal and local-only.
- The token UI communicates launch status, but the deeper token interaction loop is still light.
- The homepage mixes strong thematic language with some placeholder/demo-level content.
- The repo still carries legacy directories that can confuse future work.

## Guardrails

- Do not add a second router tree.
- Do not assume any non-Base chain should be supported by the current wallet config.
- Do not treat the nested `witching-hour-app/` directory as the deployment target.
- Keep `.env.local` out of version control.
- Be explicit when documentation is describing current behavior versus intended future work.

## Recommended File Priorities

- `src/app/page.tsx`
- `src/components/feed/FeedClient.tsx`
- `src/app/api/posts/route.ts`
- `src/lib/wallet.ts`
- `src/lib/spotify.ts`
- `src/app/globals.css`

## Definition Of A Good Next Pass

- the docs still match the code after the change
- the homepage and feed feel like the same product
- wallet-dependent pages stay stable during SSR/hydration
- the repo has fewer ambiguous “which app is real?” paths than it has today
