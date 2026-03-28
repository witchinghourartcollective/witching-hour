# Base Mini App Notes

## Live domain

- App: `https://app.witchinghourmac.com`
- Vercel project: `witching-hour-app`
- Base app ID: `69c39a7a6d153fb47b06adc5`
- Base builder code: `bc_rzjipz72`
- Base builder owner address: `0xE7e0377E789fd576600D797FdD23c9A6350d8ABb`

## Required live metadata

- Root HTML head must include:
  - `<meta name="base:app_id" content="69c39a7a6d153fb47b06adc5" />`
  - `<meta name="fc:miniapp" ... />`
- Manifest route must exist at:
  - `/.well-known/farcaster.json`

## Current auth model

- The app no longer relies on Farcaster sign-in or FID-based identity.
- Authentication uses SIWE.
- User identity is the connected wallet address from wagmi.
- Runtime providers are:
  - `WagmiProvider`
  - `QueryClientProvider`

## Current wagmi setup

- Chain: Base only
- Connectors:
  - `injected()`
  - `baseAccount({ appName: "Witching Hour" })`
- Storage:
  - `createStorage({ storage: cookieStorage })`
- SSR:
  - `true`

## Manifest / verification

- Live manifest currently includes:
  - `miniapp`
  - `baseBuilder.ownerAddress`
- If verification ever needs to be re-run with signed account association, the remaining env vars are:
  - `FARCASTER_HEADER`
  - `FARCASTER_PAYLOAD`
  - `FARCASTER_SIGNATURE`
  - optional override: `BASE_BUILDER_OWNER_ADDRESS`

## hOUR token status

- Token contract: `0xFC1c0FFF99845676A588CE21c28C4859F3035866`
- Network: Base
- The app reads `tradingEnabled()` from the token contract.
- If `tradingEnabled` is `false`, the tip action is intentionally disabled in the UI.
- This avoids wallet/RPC failures for a token that is not live yet.

## Launch sequence

1. Add liquidity if a real market launch is intended.
2. Call `enableTrading()` from the token owner wallet.
3. Re-test hOUR transfers and feed tipping.

## Practical reminder

- Base verification and token launch are separate concerns.
- `base:app_id`, `fc:miniapp`, and `farcaster.json` handle app identity.
- Liquidity and `enableTrading()` handle whether hOUR transfers can actually execute.
