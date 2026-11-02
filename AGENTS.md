# Agent rules for this project

Next.js 16 (Pages Router + BFF) end-user web app, React 19, jotai, Tailwind 4, rc-field-form. Built from the personal starter-kit template (`webapp`).

- **Follow `CONVENTIONS.md` exactly** for structure, naming, patterns and libraries. It wins over generic best practice. When adding something new, copy the closest existing example in the codebase instead of inventing a new pattern.
- **snake_case for every DB field and API JSON field.** Variables/functions camelCase, classes/components PascalCase.
- Don't add libraries, state stores or new patterns without asking first.
- Done = `npm run lint && npm run typecheck && npm test && npm run build` all pass.
- Never commit `.env`; keep `.env.example` in sync when adding env vars.
