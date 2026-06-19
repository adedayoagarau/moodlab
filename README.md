# MoodLab

A full-stack mobile lab for exploring **mood**, **tone**, and **emotional resonance** in language — at the intersection of poetry and product content.

Built by [Adedayo Agarau](https://github.com/adedayoagarau): poet, content designer, and builder of AI tools for UX writing.

## Stack

| Layer | Tech |
|-------|------|
| Mobile | Expo SDK 56, Expo Router, React Native, TypeScript |
| API | Hono, Node.js, TypeScript |
| Shared | `@moodlab/shared` — types, mood tags, validation |
| Monorepo | pnpm workspaces |

## Repository structure

```
moodlab/
├── apps/
│   ├── mobile/          # Expo app — journal + mood exploration
│   └── api/             # REST API for mood entries
├── packages/
│   └── shared/          # Shared TypeScript contracts
├── .cursor/rules/       # Cursor rules for mobile full-stack work
├── docs/SKILLS.md       # Agent skills setup (global install)
└── AGENTS.md            # Context for AI coding assistants
```

## Quick start

**Requirements:** Node.js 20+, pnpm 9+, optional Android Studio / Xcode for native simulators.

```bash
git clone https://github.com/adedayoagarau/moodlab.git
cd moodlab
pnpm install

# Copy env and adjust if needed
cp .env.example .env

# Run API + mobile together
pnpm dev
```

| Command | Description |
|---------|-------------|
| `pnpm dev` | API (`:8787`) + Expo dev server |
| `pnpm dev:api` | API only |
| `pnpm dev:mobile` | Expo only |
| `pnpm android` / `pnpm ios` / `pnpm web` | Platform targets |
| `pnpm typecheck` | TypeScript across all packages |
| `pnpm test` | Vitest (shared + API) |

### API endpoints

- `GET /health` — service health
- `GET /api/v1/moods` — list journal entries
- `POST /api/v1/moods` — create entry `{ text, moodTag?, toneNotes? }`
- `PATCH /api/v1/moods/:id` — update entry
- `DELETE /api/v1/moods/:id` — delete entry

### Mobile configuration

Set `EXPO_PUBLIC_API_URL` in `.env` or `apps/mobile/.env` (default `http://localhost:8787`).

For physical devices, use your machine's LAN IP instead of `localhost`.

## Cursor & agent skills

This repo is configured for **mobile full-stack development** in Cursor:

- `.cursor/rules/moodlab-fullstack.mdc` — monorepo conventions
- `.cursor/rules/mobile-development.mdc` — Expo / RN / Flutter patterns
- Agent skills (Flutter, Expo, iOS, Android, testing) — install globally; see [docs/SKILLS.md](docs/SKILLS.md)

## Related work

- [cd-agency](https://github.com/adedayoagarau/cd-agency) — Content Design agent agency
- [content-design-prompt-library](https://github.com/adedayoagarau/content-design-prompt-library) — UX writing prompts

## Author

**Adedayo Agarau** — [GitHub](https://github.com/adedayoagarau) · [Twitter](https://twitter.com/adedayoagarau)

## License

MIT (pending formal LICENSE file)
