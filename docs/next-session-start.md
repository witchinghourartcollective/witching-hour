# Where To Start Next Session

## Current live state

- `witchinghourmac.com` is the portal site on Vercel Pro under the `witching-hour-music` scope.
- `shop.witchinghourmac.com` is not the active commerce domain yet, but the Shopify store is live at `https://witching-hour-music.myshopify.com`.
- Shopify theme `whm-drk` is live on the store.
- `app.witchinghourmac.com` now points to the Vercel project for this repo, not the old Replit app.

## Active repo for the app subdomain

- Repo: `/home/fletchervaughn/witching-hour-app`
- Vercel project: `witching-hour-app`
- Live domain: `https://app.witchinghourmac.com`

## What was fixed in this session

1. Moved `app.witchinghourmac.com` off the old Replit DNS target and onto Vercel.
2. Added `.vercelignore` so Vercel only uploads the real app instead of local tooling, nested apps, and junk files.
3. Fixed the Base signature verification type error in `src/app/api/base-auth/verify/route.ts`.
4. Fixed SSR/prerender failures by moving wallet-dependent code behind client-only mounted boundaries:
   - `src/components/providers/ProvidersBoundary.tsx`
   - `src/components/base/SignInWithBasePanelShell.tsx`
   - `src/components/feed/FeedPageShell.tsx`
   - `src/components/feed/FeedClient.tsx`
5. Redeployed successfully and verified:
   - `/`
   - `/feed`
   - `/token`

## Production envs already set in Vercel

- `NEXT_PUBLIC_PRIVY_APP_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_BASESCAN_API`
- `DROPBOX_APP_KEY`
- `DROPBOX_APP_SECRET`
- `DROPBOX_REDIRECT_URI=https://app.witchinghourmac.com/api/auth/dropbox/callback`
- `NEXT_PUBLIC_APP_URL=https://app.witchinghourmac.com`

## Env values still missing

These were not added because the local repo only had blanks or placeholders:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PRIVY_APP_SECRET`

## First things to check next time

1. Visit `https://app.witchinghourmac.com`
2. Test `/feed` wallet flow in a browser
3. Test Dropbox auth callback flow
4. Decide whether the app should keep the current simple shell or be visually upgraded to match the main portal more closely
5. Add any remaining real secrets to Vercel if those features need to be live

## Files that matter first

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/feed/page.tsx`
- `src/components/providers/ProvidersBoundary.tsx`
- `src/components/base/SignInWithBasePanel.tsx`
- `src/components/base/SignInWithBasePanelShell.tsx`
- `src/components/feed/FeedClient.tsx`
- `src/components/feed/FeedPageShell.tsx`
- `.vercelignore`

## Short status summary

The app subdomain is live on Vercel now. The main blocker for the next session is no longer hosting or DNS. The next work should focus on product behavior, missing secrets, and visual/design alignment with the main Witching Hour portal.
