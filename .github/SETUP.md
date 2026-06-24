# GitHub Production Setup Checklist

Use this checklist for repository administrator tasks that cannot be enforced from the codebase alone.

## Project repositories

Confirm these GitHub repositories exist and have the expected owners/admins:

- `witching-hour` — main public website and Cloudflare Pages app.
- `witching-hour-live` — live capture and session control stack.
- `witching-hour-token` — `hOUR` Base token contract and app integration files.

## Maintainer account security

- Require or verify two-factor authentication for every maintainer with write/admin access.
- Add and verify SSH keys for maintainers who push from local machines.
- Remove stale collaborators, deploy keys, and personal access tokens.

## Branch protection for `main`

In GitHub, open **Settings → Branches → Add branch protection rule** and protect `main`.

Recommended requirements:

- Require a pull request before merging.
- Require at least one approving review before merge.
- Dismiss stale pull request approvals when new commits are pushed.
- Require conversation resolution before merge.
- Require status checks to pass before merge.
- Require these checks from `.github/workflows/ci.yml`:
  - `lint`
  - `test`
  - `build`
- Require branches to be up to date before merging when GitHub offers that option.
- Restrict who can push directly to `main`.
- Optionally require signed commits and linear history.

## GitHub Actions secrets

Add these repository secrets before enabling production deploys:

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with permission to deploy Pages.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID for the Pages project.

Never commit secrets to the repository. Keep local secrets in `.env.local` and document only placeholder names in `.env.example`.
