# Next Session Start

Use this as the shortest reliable handoff.

## Start Here

1. Read [`README.md`](/home/fletchervaughn/witching-hour-app/README.md) for the active runtime and setup.
2. Read [`docs/development-reference.md`](/home/fletchervaughn/witching-hour-app/docs/development-reference.md) for the route map and verification checklist.
3. Read [`docs/pickup-guide.md`](/home/fletchervaughn/witching-hour-app/docs/pickup-guide.md) for the short orientation and guardrails.
4. Run `npm run dev`.
5. Open `/`, `/feed`, `/token`, and `/stream`.
6. Review `git status` before touching anything because unrelated product work is often present.

## Session Rules

- `src/app` is the active router.
- `data/db.sqlite` is local runtime state.
- AI changes must keep the token gate and grounded fetch path intact.
- Stream and auth surfaces should remain public-safe unless explicitly reworked.
