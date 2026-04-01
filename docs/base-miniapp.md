# Base Miniapp Notes

This app ships Base/Farcaster miniapp metadata from two places:

- `src/app/layout.tsx`
- `src/app/.well-known/farcaster.json/route.ts`

## Current Defaults In Code

- app URL: `https://app.witchinghourmac.com`
- Base app ID: `69c39a7a6d153fb47b06adc5`
- builder code: `bc_rzjipz72`
- default builder owner: `0xE7e0377E789fd576600D797FdD23c9A6350d8ABb`

## Head Metadata

`src/app/layout.tsx` currently injects:

- `<meta name="base:app_id" ... />`
- `<meta name="fc:miniapp" ... />`

The `fc:miniapp` payload advertises the production app URL and uses `/logo/hour-basescan.svg` for icon and splash imagery.

## Manifest Route

`/.well-known/farcaster.json` returns:

- `accountAssociation`
- `miniapp`
- `baseBuilder`

The response is cached with `Cache-Control: public, max-age=300`.

## Env Overrides

### Used by the manifest route

- `NEXT_PUBLIC_APP_URL`
  - Overrides the default app URL.
- `BASE_BUILDER_OWNER_ADDRESS`
  - Overrides the default owner address in `baseBuilder.ownerAddress`.
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`
  - When present, these populate `accountAssociation`.

### Used by wallet attribution

- `NEXT_PUBLIC_BASE_BUILDER_CODE`
  - Overrides the default builder code in `src/lib/wallet.ts`.

## Runtime Auth Model

- The app is wallet-address based.
- wagmi is configured for Base only.
- Connectors:
  - injected
  - Base Account
- The current setup is not Farcaster-sign-in dependent for app runtime identity.

## Validation Checklist

1. Open `/.well-known/farcaster.json`
2. Confirm `homeUrl`, `iconUrl`, and `ogImageUrl` point at the expected domain
3. Confirm `baseBuilder.ownerAddress` is correct
4. Confirm `accountAssociation` is either fully populated or omitted intentionally
5. Confirm the homepage still renders the `base:app_id` and `fc:miniapp` meta tags

## Separation Of Concerns

- Base/Farcaster metadata verifies app identity and launch behavior
- wallet config controls runtime connectivity and attribution
- token launch state is a separate concern from miniapp verification
