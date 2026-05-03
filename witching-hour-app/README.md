# Witching Hour App

Cross-platform Witching Hour experience for web, mobile, and desktop.

## Structure

- `App.tsx`: shared UI for web + mobile via Expo
- `desktop/`: Electron wrapper for desktop builds
- `web-dist/`: web export target for Electron (generated)

## Quick Start

```bash
cd /home/fletchervaughn/code/witching-hour/witching-hour-app
npm install
npm run start
```

## Web (Expo)

```bash
npm run start:web
```

Open `http://localhost:8081/login` in the browser for the current local web preview.

## Base Integration

The web preview now includes a web-safe Base wallet connect flow using the
browser's injected wallet provider.

- Install dependencies after pulling changes:

```bash
npm install
```

- The current integration is frontend-only:
  it switches the user's injected wallet onto Base Mainnet and stores the
  connected address in app state.
- This replaces the previous SDK path that crashed Expo web with
  `cannot use import.meta outside a module`.
- Production auth still needs backend nonce/signature verification and session creation.

## Mobile

```bash
npm run start:ios
npm run start:android
```

## Desktop (Electron)

1. Start Expo web dev server:

```bash
npm run start:web
```

1. In a new terminal, run Electron:

```bash
cd /home/fletchervaughn/code/witching-hour/witching-hour-app/desktop
npm install
npm run dev
```

## Desktop (packaged web build)

```bash
cd /home/fletchervaughn/code/witching-hour/witching-hour-app
npm run export:web
cd /home/fletchervaughn/code/witching-hour/witching-hour-app/desktop
npm run start
```

## Stripe (planned)

Add a Stripe checkout flow in the Bookings section. Recommended path:

- Use Stripe Checkout or Payment Links for quick launch.
- For custom flows, add `@stripe/stripe-react-native` (mobile) and `@stripe/stripe-js` (web).
- Store secrets in `.env.local`.

## NFTs (planned)

Wire NFT data into the `NFTS` array in `App.tsx`. This can come from:

- A chain indexer
- A marketplace API
- Your own onchain contracts
