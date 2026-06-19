# MoodLab

A **creator-first image studio** for turning camera-roll photos into polished posts, cover art, thumbnails, and portraits — with LUT moods, skin-safe Beauty Studio, templates, and export presets.

Built by [Adedayo Agarau](https://github.com/adedayoagarau).

## Product pillars

| Pillar | V1 scope |
|--------|----------|
| **LUT Studio** | Curated mood packs, `.cube` LUTs, strength, skin-safe protection |
| **Beauty Studio** | Smooth, texture, even tone, face light, Melanin Guard |
| **Text / Templates** | Creator promo text layers |
| **Export Studio** | Instagram, Story, cover, YouTube, profile sizes |
| **Platform** | Catalog API, projects, entitlements (stubs → Supabase + RevenueCat) |

Full product docs: `docs/product/`, UI spec: `docs/design/`, architecture: `docs/architecture/`.

## Stack

| Layer | Tech |
|-------|------|
| Mobile | Expo SDK 56, Expo Router, React Native, TypeScript |
| API | Hono, Node.js — packs, LUT catalog, projects |
| Shared | `@moodlab/shared` — edit recipe, export presets, beauty types |
| LUT engine | `@moodlab/lut-engine` — `.cube` parser |
| Monorepo | pnpm workspaces |

## Repository structure

```
moodlab/
├── apps/
│   ├── mobile/          # Expo app — Home, Editor, Packs, Projects
│   └── api/             # Platform API — catalog + projects
├── packages/
│   ├── shared/          # Edit recipe & API contracts
│   └── lut-engine/      # .cube parser
├── data/                # LUT catalog + preset manifest
├── luts/original/       # 20 original .cube LUTs
├── backend/             # Postgres schema starter
├── docs/
│   ├── product/         # Master blueprint, feature matrix, specs
│   ├── design/          # UI spec, tokens, Figma structure
│   ├── architecture/    # E2E infra, diagrams, security
│   └── native/          # RenderCore native pipeline notes
└── tools/               # LUT generator, cube parser reference
```

## Quick start

**Requirements:** Node.js 20+, pnpm 9+, optional Android Studio / Xcode.

```bash
git clone https://github.com/adedayoagarau/moodlab.git
cd moodlab
pnpm install
cp .env.example .env
pnpm dev
```

| Command | Description |
|---------|-------------|
| `pnpm dev` | API (`:8787`) + Expo dev server |
| `pnpm dev:api` | API only |
| `pnpm dev:mobile` | Expo only |
| `pnpm typecheck` | TypeScript across all packages |
| `pnpm test` | Vitest (shared, lut-engine, API) |

### API endpoints

- `GET /health` — service health
- `GET /api/v1/packs` — LUT pack catalog
- `GET /api/v1/packs/:id` — pack + LUTs
- `GET /api/v1/luts` — all LUT definitions
- `GET /api/v1/manifest` — beauty presets, text templates, Build My Post cards
- `GET /api/v1/projects` — saved edit projects
- `POST /api/v1/projects` — create project `{ name, sourceUri, recipe }`
- `PATCH /api/v1/projects/:id` — update project

### Mobile configuration

Set `EXPO_PUBLIC_API_URL` in `.env` or `apps/mobile/.env` (default `http://localhost:8787`).

For physical devices, use your machine's LAN IP instead of `localhost`.

## Build order (from product blueprint)

1. Editor + LUT engine (local-first)
2. Beauty Studio MVP + skin-safe LUTs
3. Packs, paywall, projects, analytics
4. Marketplace + AI (V3)

Native LUT rendering: see `docs/native/RENDER_CORE.md`.

## Cursor & agent skills

- `.cursor/rules/moodlab-fullstack.mdc` — monorepo conventions
- `.cursor/rules/mobile-development.mdc` — Expo / RN patterns
- Agent skills — see `docs/SKILLS.md`

## License

MIT (pending formal LICENSE file)
