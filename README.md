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


## First-Time Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` only with the values needed for your local task. Do not commit `.env.local`, production API tokens, private keys, passwords, or Cloudflare credentials.

### Environment Variables

- `NEXT_PUBLIC_GENESIS_MINT_LIVE`: public browser flag for enabling the genesis mint CTA.
- `NEXT_PUBLIC_GENESIS_MINT_URL`: public browser URL for the live mint destination.
- `SUPERMEMORY_API_KEY`: optional local token for `npm run supermemory`.
- `TEST_LOGIN_EMAIL` / `TEST_LOGIN_PASSWORD`: optional local-only login smoke-test credentials.
- `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`: optional Upstash QStash settings.
- `REDIS_URL`, `REDIS_TOKEN`: optional Upstash Redis settings.

Use `.env.example` for placeholders only.

## Verification

Run these before opening or merging a PR:

```bash
npm run lint
npm test
npm run build
npm run dev
```

## GitHub Workflow

- Work in feature branches and open pull requests into `main`.
- Use the PR template and include verification commands plus screenshots for UI changes.
- Keep `main` protected with required pull request review before merge.
- Require the GitHub Actions CI checks from `.github/workflows/ci.yml`: `lint`, `test`, and `build`.
- Keep issues routed through the templates in `.github/ISSUE_TEMPLATE/`.

Repository administrators should complete the production checklist in `.github/SETUP.md`, including repository confirmation, maintainer 2FA, SSH keys, branch protection, required reviews, and required status checks.

## Cloudflare Pages CI/CD

Cloudflare Pages is the deployment target. The GitHub deploy workflow builds the static export in `out/` and deploys it to the `witching-hour` Pages project.

Required GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Do not store Cloudflare secrets in source files, README examples, issue comments, or PR descriptions.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Tailscale / LAN Development

```bash
npm run dev:tail
```

Then open `http://<your-ip-or-tailscale-hostname>:3000`.

## Scripts

```bash
npm run dev
npm run dev:tail
npm run lint
npm test
npm run build
npm run start
npm run deploy
npm run supermemory -- "Remember my favorite synths."
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
