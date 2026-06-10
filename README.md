![Primary sigil](public/brand/sigil-primary.svg)

# Witching Hour

Witching Hour is the primary web surface for the Witching Hour Music + Art Collective.

It is the public-facing site for releases, visual identity, writing, on-chain access, and the broader atmosphere around the project. The tone is intentionally minimal, ritualistic, and fast.

## Ecosystem

This repo is one part of a larger Witching Hour stack:

- `witching-hour`: the main website and public brand surface
- `witching-hour-live`: the live capture and session control stack
- `witching-hour-token`: the `hOUR` Base token contract and app integration files

## What This Repo Does

- ships the main Witching Hour website
- holds core visual and editorial pages
- hosts NFT, mint, litepaper, links, press, and related project surfaces
- contains experiments and supporting project research that live near the main site

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind/CSS
- Cloudflare Pages for deployment

## Live Site

- Production: `https://witching-hour.pages.dev`

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify Before Commit

Run these checks before opening a PR:

```bash
npm run lint
npm run build
```

## Development Modes

### Local only

```bash
npm run dev
```

### Tailscale / LAN

```bash
npm run dev:tail
```

Then open `http://<your-ip-or-tailscale-hostname>:3000`.

## Script Reference

```bash
npm run dev            # local dev server
npm run dev:tail       # dev server on 0.0.0.0:3000 for LAN/Tailscale
npm run lint           # lint src/**/*.js|jsx|ts|tsx
npm run build          # production Next.js build
npm run start          # run production server
npm run deploy         # deploy static export to Cloudflare Pages
npm run supermemory -- "Remember my favorite synths."  # optional helper script
```

## Deployment

The site deploys to Cloudflare Pages from the static export in `out/`.

```bash
npm run build
npx wrangler pages deploy out --project-name witching-hour
```

Or use:

```bash
npm run deploy
```

## Project Map

- `src/app/`: routes, layouts, metadata, pages
- `src/components/`: reusable UI building blocks
- `public/`: static assets, sigils, images, brand files
- `codex/`: notes and documentation
- `infrastructure/`: infra and service setup
- `evolving-cellular-automata/`, `hello-arc/`, `scp-bytecode-deploy/`: standalone experiments and utilities

## Key Edit Points

- homepage: `src/app/page.tsx`
- global layout and metadata: `src/app/layout.tsx`
- global styles: `src/app/globals.css`

## Environment Notes

- keep secrets in `.env.local`
- `SUPERMEMORY_API_KEY` is required only for the `supermemory` script
- Base app metadata is defined in `src/app/layout.tsx`

## Troubleshooting

- if `npm run build` fails due to missing env vars, create `.env.local` and add only the keys needed for the feature you touched
- if `npm run deploy` fails, confirm Cloudflare auth (`wrangler login`) and project access
- if LAN mode does not load, ensure port `3000` is open on your machine/firewall

## Design Notes

- typography and styling are defined in CSS rather than `next/font`
- use `/brand/sigil-whm.svg` when referencing the WHM sigil
- preserve the atmospheric visual language instead of flattening the brand into generic landing-page patterns

## WHM Sigil (ASCII Reference)

```
  \  |   /\    /\  |  /  
   \ |  /  \  /  \ | /   
--- \| /    \/    \|/ ---
    /| \    /\    /|\    
   / |  \  /  \  / | \   
  /  |   \/    \/  |  \  
```
