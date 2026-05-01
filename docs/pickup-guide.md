# Pickup Guide

This is the short orientation note. For the full code map, see [`docs/development-reference.md`](/home/fletchervaughn/witching-hour-app/docs/development-reference.md).

## What Is Real Right Now

- The current Next.js runtime is [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app).
- Shared code also lives under [`src/`](/home/fletchervaughn/witching-hour-app/src) through the `@/*` alias.
- [`data/db.sqlite`](/home/fletchervaughn/witching-hour-app/data/db.sqlite) is local runtime state for the posts API.

## Product Direction

- Wallet-first interaction.
- Base-native access control.
- Token-gated AI and participation flows.
- Stream publishing and mirrored endpoint configuration.
- A more thematic Witching Hour visual identity.

## What To Preserve

- Token gating logic in [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts)
- AI routing in [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
- Base auth routes in [`src/app/api/base-auth/`](/home/fletchervaughn/witching-hour-app/src/app/api/base-auth)
- Stream host rewrite in [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts)
- Base-only wallet configuration in [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
- Miniapp metadata in [`src/app/layout.tsx`](/home/fletchervaughn/witching-hour-app/src/app/layout.tsx)

## What Still Needs Care

- The public stream route should stay public-safe even if upstream data sources change.
- The feed/posts flow is still backed by local SQLite and should be treated as local runtime state, not shared content truth.
- The repo still carries legacy directories that can confuse new work.
- Any previously exposed tokens or upstream secrets should be rotated before re-exposing the surface.

## Guardrails

- Do not add another router tree.
- Do not assume any non-Base chain should be supported by the current wallet config.
- Keep `.env.local` out of version control.
- Keep private upstream endpoints server-side only.

## Recommended File Priorities

- [`src/app/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/page.tsx)
- [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
- [`src/app/api/base-auth/verify/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/base-auth/verify/route.ts)
- [`src/app/stream/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/stream/page.tsx)
- [`src/app/api/posts/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/posts/route.ts)
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)

## Definition Of A Good Next Pass

- The docs and runtime match.
- One router tree stays clearly authoritative.
- Wallet-dependent pages stay stable during SSR and hydration.
- Contributors can tell which files are production truth and which ones are legacy.
