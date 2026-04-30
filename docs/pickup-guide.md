# Pickup Guide

This is the practical product-and-codebase orientation note.

## What Is Real Right Now

- The current Next.js runtime is [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app).
- Shared code also lives under [`src/`](/home/fletchervaughn/witching-hour-app/src) through the `@/*` alias.
- [`data/db.sqlite`](/home/fletchervaughn/witching-hour-app/data/db.sqlite) is the local store for the posts API.

## Product Direction

The project is trying to combine:

- wallet-first interaction
- Base-native access control
- token-gated AI and participation flows
- stream publishing and mirrored endpoint configuration
- a more thematic Witching Hour visual identity

## What To Preserve

- Token gating logic in [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts)
- AI routing in [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
- Stream host rewrite in [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts)
- Base-only wallet configuration in [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
- Miniapp metadata in [`src/app/layout.tsx`](/home/fletchervaughn/witching-hour-app/src/app/layout.tsx)

## What Still Needs Care

- The public stream route was previously exposing tokenized private endpoints and now only exposes public-safe fields. Any previously exposed tokens should be rotated.
- The feed/posts flow is still backed by local SQLite and should be treated as local runtime state, not shared content truth.
- The repo still carries legacy directories that can confuse new work.

## Guardrails

- Do not add another router tree.
- Do not assume any non-Base chain should be supported by the current wallet config.
- Keep `.env.local` out of version control.
- Keep Chaturbate private endpoints server-side only.

## Recommended File Priorities

- [`src/app/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/page.tsx)
- [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
- [`src/app/stream/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/stream/page.tsx)
- [`src/app/api/posts/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/posts/route.ts)
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)

## Definition Of A Good Next Pass

- The docs and runtime match.
- One router tree stays clearly authoritative.
- Wallet-dependent pages stay stable during SSR and hydration.
- Contributors can tell which files are production truth and which ones are legacy.
