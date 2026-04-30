# Next Session Start

Use this as the shortest reliable handoff.

## Current State

- Repo root: `/home/fletchervaughn/witching-hour-app`
- Tracked production router: [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app)
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
- [`proxy.ts`](/home/fletchervaughn/witching-hour-app/proxy.ts)
- [`src/lib/azure-openai.ts`](/home/fletchervaughn/witching-hour-app/src/lib/azure-openai.ts)
- [`src/lib/web-grounding.ts`](/home/fletchervaughn/witching-hour-app/src/lib/web-grounding.ts)
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
- [`src/lib/stream.ts`](/home/fletchervaughn/witching-hour-app/src/lib/stream.ts)

## Known Realities

- `src/app` is now the active router.
- `data/db.sqlite` backs the posts API and should be treated as local runtime state.
- The AI route is token-gated and currently uses grounded web lookup before model generation.
- Azure/OpenAI or qBraid env vars are needed only for the AI route.
- Stream env vars are needed only for the stream surface, and only public-safe fields are exposed from the public route.

## Likely Next Work

1. Verify Base RPC reliability for hOUR balance checks and keep the `503` behavior for wallet gating failures.
2. Confirm the selected AI provider path has a real deployed model and valid credentials.
3. Keep the feed transfer preflight aligned with the actual hOUR contract behavior.
4. Rotate any Chaturbate or stream-adjacent secrets that were ever exposed publicly.
5. Keep the docs aligned as the stream, AI, and wallet surfaces evolve.
