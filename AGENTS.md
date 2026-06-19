# MoodLab — agent context

MoodLab is a **pnpm monorepo** for a creator-first LUT photo editor: Expo/React Native client + TypeScript platform API.

## Repository layout

```
apps/mobile/           Expo Router app (@moodlab/mobile)
apps/api/              Hono REST API (@moodlab/api)
packages/shared/       Edit recipe, LUT types, export presets (@moodlab/shared)
packages/lut-engine/   .cube parser (@moodlab/lut-engine)
data/                  lut_catalog.json, lut_registry.yaml, preset_manifest.json
luts/original/         Original .cube LUT assets
luts/qa/references/    Visual QA reference images
docs/agents/           Specialized agent docs (LUT Developer)
tools/lut-studio/      Parametric LUT authoring toolchain
docs/product/          Master blueprint, feature matrix, pillar specs
docs/design/           UI spec, design tokens
docs/architecture/     E2E infrastructure
backend/schema.sql     Target Postgres schema
```

## Commands

```bash
pnpm install
pnpm dev              # API + Expo dev servers in parallel
pnpm dev:api          # API only (http://localhost:8787)
pnpm dev:mobile       # Expo only
pnpm typecheck
pnpm test
pnpm lut:generate [--id <id>] [--all]   # generate .cube from lut_registry.yaml
pnpm lut:validate                        # validate registry, cubes, catalog
pnpm lut:sync-catalog                    # sync lut_catalog.json from registry
pnpm lut:analyze [--id <id>]             # infer metadata heuristics
```

## Product principles

1. **Local-first editing** — LUT preview/export on-device; backend is not in the hot path for grades
2. **Skin-safe LUTs** — face/skin regions get reduced LUT strength by default
3. **Editor first, platform second** — prove edit loop before marketplace/AI
4. **Shared contracts** — `EditRecipe`, `LutDefinition`, `BeautySettings` live in `@moodlab/shared`

## Mobile stack

- Expo SDK 56, Expo Router, TypeScript
- Editor: `apps/mobile/app/editor.tsx` — Mood / Adjust / Beauty / Text / Export
- JS preview tint: `apps/mobile/lib/render-preview.ts` (until native RenderCore)
- API client: `apps/mobile/lib/api.ts`
- Configure `EXPO_PUBLIC_API_URL` (default `http://localhost:8787`)

## API stack

- Hono on Node (`@hono/node-server`)
- Catalog from `data/lut_catalog.json` + `data/preset_manifest.json`
- In-memory project store (`apps/api/src/store.ts`) — swap for Postgres per `backend/schema.sql`

## Conventions

- TypeScript strict mode everywhere
- Never duplicate API shapes in mobile — use `@moodlab/shared`
- API responses: `{ data }` or `{ error }`
- Native LUT pipeline notes: `docs/native/RENDER_CORE.md`

## Cursor skills

Agent skills are installed globally (`~/.agents/skills`). See `docs/SKILLS.md`. Do not commit `.agents/` to this repo.

## Specialized agents

| Agent | Cursor subagent | Doc |
|-------|-----------------|-----|
| LUT Developer | [`.cursor/agents/lut-developer.md`](.cursor/agents/lut-developer.md) | [`docs/agents/LUT_DEVELOPER.md`](docs/agents/LUT_DEVELOPER.md) |

**Use in Cursor:** Ask Agent to delegate to `lut-developer`, or say *"Act as the LUT Developer"*. Full workflow: [`docs/agents/CURSOR_LUT_WORKFLOW.md`](docs/agents/CURSOR_LUT_WORKFLOW.md).

LUT authoring: edit `data/lut_registry.yaml` → `pnpm lut:generate` → `pnpm lut:validate` → `pnpm lut:sync-catalog` → app picks up via API.
