# MoodLab — agent context

MoodLab is a **pnpm monorepo** for full-stack mobile work: Expo/React Native client + TypeScript API.

## Repository layout

```
apps/mobile/     Expo Router app (@moodlab/mobile)
apps/api/        Hono REST API (@moodlab/api)
packages/shared/ Shared types and validation (@moodlab/shared)
```

## Commands

```bash
pnpm install
pnpm dev              # API + Expo dev servers in parallel
pnpm dev:api          # API only (http://localhost:8787)
pnpm dev:mobile       # Expo only
pnpm typecheck
pnpm test
```

## Mobile stack

- Expo SDK 56, Expo Router, TypeScript
- iOS / Android / web via Expo
- API client in `apps/mobile/lib/api.ts`
- Configure `EXPO_PUBLIC_API_URL` (default `http://localhost:8787`)

## API stack

- Hono on Node (`@hono/node-server`)
- In-memory mood journal store (swap for DB when ready)
- Routes under `/api/v1/moods`, health at `/health`

## Shared contracts

Import from `@moodlab/shared`: `MoodEntry`, `MoodTag`, `MOOD_TAGS`, `validateCreateMoodEntry`.

## Cursor skills

Agent skills are installed **globally** (`~/.agents/skills`). See `docs/SKILLS.md` for mobile/flutter skill packages. Do not commit `.agents/` to this repo.

## Conventions

- TypeScript strict mode everywhere
- Shared types live in `packages/shared` — never duplicate API shapes in mobile
- Mobile UI: accessible touch targets, platform-aware patterns (see `.cursor/rules/`)
- API: validate with shared validators; return `{ data }` or `{ error }`

## Product direction

MoodLab explores **mood, tone, and emotional resonance** in language — journal entries, tone prompts, and future scoring agents.
