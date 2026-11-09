# Agent rules for this project

Next.js 16 (Pages Router + BFF) end-user web app, React 19, jotai, Tailwind 4, rc-field-form. Built from the personal starter-kit template (`webapp`).

- **Follow `CONVENTIONS.md` exactly** for structure, naming, patterns and libraries. It wins over generic best practice. When adding something new, copy the closest existing example in the codebase instead of inventing a new pattern.
- **snake_case for every DB field and API JSON field.** Variables/functions camelCase, classes/components PascalCase.
- Don't add libraries, state stores or new patterns without asking first.
- Done = `npm run lint && npm run typecheck && npm test && npm run build` all pass.
- Never commit `.env`; keep `.env.example` in sync when adding env vars.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
