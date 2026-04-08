# Base Miniapp Notes

Base and Farcaster miniapp metadata lives in the live [`src/app/`](/home/fletchervaughn/witching-hour-app/src/app) router.

## Source Of Truth

- [`src/app/layout.tsx`](/home/fletchervaughn/witching-hour-app/src/app/layout.tsx)
  Injects `base:app_id` and `fc:miniapp` metadata.
- [`src/app/.well-known/farcaster.json/route.ts`](/home/fletchervaughn/witching-hour-app/src/app/.well-known/farcaster.json/route.ts)
  Returns the Base/Farcaster manifest payload.
- [`src/lib/wallet.ts`](/home/fletchervaughn/witching-hour-app/src/lib/wallet.ts)
  Handles Base-only wallet configuration and builder-code attribution.

## Current Defaults In Code

- App URL: `https://app.witchinghourmac.com`
- Base app ID: `69c39a7a6d153fb47b06adc5`
- Builder code: `bc_rzjipz72`
- Default builder owner: `0xE7e0377E789fd576600D797FdD23c9A6350d8ABb`

## Env Overrides

### Manifest route

- `NEXT_PUBLIC_APP_URL`
- `BASE_BUILDER_OWNER_ADDRESS`
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`

### Wallet attribution

- `NEXT_PUBLIC_BASE_BUILDER_CODE`

## Important Caveat

If you change these files, verify the actual runtime manifest immediately because they are part of the live router.

## Validation Checklist

1. Confirm the manifest route returns valid JSON once the `src/app` tree is intentionally wired into the active router.
2. Confirm `homeUrl`, `iconUrl`, and `ogImageUrl` point at the intended domain.
3. Confirm `baseBuilder.ownerAddress` matches the intended owner.
4. Confirm wallet attribution still uses the expected builder code.
