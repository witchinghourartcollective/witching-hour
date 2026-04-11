# Next Session Start

Use this as the shortest reliable handoff.

## Current State

- Repo root: `/home/fletchervaughn/witching-hour-app`
- Current built router: [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app)
- Shared code: [`src/`](/home/fletchervaughn/witching-hour-app/src)
- Deployment hostname called out in code: `stream.witchinghourmac.com`

## First Checks

1. Run `npm run dev`.
2. Open `/`.
3. Open `/feed`.
4. Open `/token`.
5. Open `/stream`.
6. Review `git status` before touching anything because unrelated product work is often present.

## Files That Matter First

- [`src/app/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/page.tsx)
- [`src/app/feed/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/feed/page.tsx)
- [`src/app/token/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/token/page.tsx)
- [`src/app/api/ai/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/ai/route.ts)
- [`src/app/api/check-access/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/api/check-access/route.ts)
- [`src/app/stream/page.tsx`](/home/fletchervaughn/witching-hour-app/src/app/stream/page.tsx)
- [`middleware.ts`](/home/fletchervaughn/witching-hour-app/middleware.ts)
- [`src/lib/azure-openai.ts`](/home/fletchervaughn/witching-hour-app/src/lib/azure-openai.ts)
- [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts)
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
- [`src/lib/stream.ts`](/home/fletchervaughn/witching-hour-app/src/lib/stream.ts)

## Known Realities

- `src/app` is now the active router.
- `data/db.sqlite` backs the posts API.
- The AI route is token-gated and currently uses grounded web lookup before model generation.
- Azure/OpenAI or qBraid env vars are needed only for the AI route.
- Stream env vars are needed only for the stream surface, and only public-safe fields are exposed from the public route.

## Likely Next Work

- Rotate any Chaturbate tokens that were previously exposed publicly.
- Decide whether a private/admin stream diagnostics path is still needed.
- Keep the docs aligned as the stream and AI surfaces evolve.
