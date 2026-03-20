# Witching Hour Pickup Guide

## What we are preserving right now

This repo is the active Next app we should keep building on.

- Canonical app router lives in `src/app`.
- Wallet and chain code lives in `src/lib/wallet.ts` and `src/app/feed/page.tsx`.
- The current landing page shell lives in `src/app/page.tsx`.
- The visual "Witching Hour" references that feel closer to the website live in the top-level `components/` folder.
- The currently wired components live in `src/components/`.

## Current repo truth

Before this handoff, the app had two major problems:

1. A duplicate top-level `app/` directory was overriding `src/app`, which breaks `/feed` and `/token`.
2. The feed page could force chain switching and still attempt a token transfer off-Base.

Those blockers have been fixed in the working tree so the next session starts from a safer baseline.

## Product direction

The goal is not to rebuild the Replit app exactly and not to rebuild the website exactly.

The target is:

- Replit behavior and utility:
  - wallet-first interaction
  - ritual/feed posting flow
  - token-aware actions
  - Base-native activity
- Website/Witching Hour presentation:
  - stronger lore/theme
  - higher-contrast art direction
  - more intentional landing page
  - ritual language, sigils, night-market tone

## Recommended merge plan

### Phase 1: Stabilize the app shell

- Keep `src/app` as the only live app router.
- Treat top-level `components/` as reference material until each piece is either migrated or deleted.
- Update styling so the active app uses the Witching Hour palette, type, and section framing consistently.
- Do not add a second router tree again.

### Phase 2: Rebuild the Replit product loops inside the current app

- Restore or improve the feed so it feels like an actual ritual/social surface, not placeholders.
- Connect `src/app/api/posts/route.ts` and `src/lib/db.ts` to a real posting UI.
- Keep token actions explicitly Base-only.
- Make wallet state readable everywhere: connected address, active chain, and action availability.

### Phase 3: Apply the website theme intentionally

- Pull the strongest visual ideas from the website/reference components:
  - sigil accent color
  - occult copy tone
  - darker card treatment
  - stronger hero section
- Migrate those ideas into `src/components/*`, not the other way around.
- Replace generic purple utility styling with a defined Witching Hour design system.

## File-by-file priorities for next session

- `src/app/page.tsx`
  - Turn the homepage from a preview shell into the real themed entry point.
- `src/components/ui/Hero.tsx`
  - Rewrite first. This is the fastest place to make the app feel like Witching Hour.
- `src/components/feed/FeedPreview.tsx`
  - Convert from placeholder cards into a real ritual teaser or live feed summary.
- `src/app/feed/page.tsx`
  - Add post composer, loading states, success states, and better Base-only guardrails.
- `src/components/token/TokenPreview.tsx`
  - Turn this into an actual token panel with useful stats/actions.
- `src/app/globals.css`
  - Centralize tokens, typography, spacing, and background treatment here.

## Guardrails

- Keep all real routes under `src/app`.
- Keep secrets only in `.env.local`.
- Do not commit `.env.local`.
- Do not assume token writes are safe on any chain other than Base.
- Prefer moving good reference UI into `src/components` instead of maintaining duplicate component trees.

## Safe cleanup candidates later

These should be reviewed after the stream, not blindly deleted during handoff:

- top-level `components/`
- nested `witching-hour-app/`
- any unused duplicate preview components after migration

## First command to run next time

```bash
npm run dev
```

Then review:

- `/`
- `/feed`
- `/token`

## Definition of done for the next real pass

We should aim to end the next session with:

- one router tree
- one component tree
- one clear visual system
- live wallet flow on Base
- a feed experience that feels like the original app again, but branded like Witching Hour
