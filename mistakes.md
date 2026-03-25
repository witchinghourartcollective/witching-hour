# Migration Mistakes & Learnings

Track errors, fixes, and lessons learned during OnchainKit migration.

## Errors

- `npm uninstall @rainbow-me/rainbowkit` did not update `package.json` in this workspace. I removed the dependency manually and regenerated `package-lock.json` with `npm install --package-lock-only`.

## Lessons Learned

- The active app in this repo was already on `wagmi`; the real migration work was removing RainbowKit and replacing its wallet UI with local components.
- Keeping every transacting chain in the wagmi config is still required after the migration. This app needs both `base` and `mainnet` because the feed can switch between them.
