# MoodLab LUT Developer

**MANDATORY** — invoke this skill when authoring, validating, or batch-generating MoodLab `.cube` LUTs.

## When to use

- Creating new LUTs for MoodLab packs
- Migrating or regenerating `.cube` files from registry
- Fixing catalog/pack consistency issues
- Planning batches toward the 1000-LUT catalog
- Visual or technical QA on LUT grades

## Before acting

1. Read `docs/agents/LUT_DEVELOPER.md` in the repo (domain + workflow)
2. Read `docs/agents/LUT_QA_CHECKLIST.md` for visual QA
3. Check `data/lut_taxonomy.yaml` for category/sub-mood planning

## Authoring workflow (strict order)

```
Brief → lut_registry.yaml → pnpm lut:generate → pnpm lut:validate → Visual QA → pnpm lut:sync-catalog
```

### Step 1: Registry entry

Edit `data/lut_registry.yaml`. Example:

```yaml
- id: sunny-cover-glow
  name: "Sunny Cover Glow"
  packId: sunny-starts
  categories: [Sunny, Portrait, Music Cover]
  plan: free
  tags: [sunny, cover, warm]
  grade:
    type: warm_glow
    params: { warmth: 0.12, lift: 0.04, saturation: 0.08 }
  metadata:
    defaultStrength: 0.78
    skinProtectionDefault: medium
    recommendedEffects: { grain: 0.12, glow: 0.18, vignette: 0.1 }
```

### Step 2: Generate

```bash
pnpm lut:generate --id sunny-cover-glow
# or
pnpm lut:generate --all
```

### Step 3: Validate

```bash
pnpm lut:validate
```

Must exit 0 with zero errors. Fix registry params and regenerate — never patch `.cube` files.

### Step 4: Visual QA

Apply checklist from `docs/agents/LUT_QA_CHECKLIST.md` using references in `luts/qa/references/`.

### Step 5: Sync catalog

```bash
pnpm lut:sync-catalog
```

## Recipe guide

| Recipe | Use when |
|--------|----------|
| `warm_glow` | Sunny, golden hour, warm cover art |
| `cool_moody` | Dark blues, night urban, moody cinematic |
| `cinematic_teal_orange` | Teal shadow / warm highlight split |
| `film_fade` | Analog, lifted blacks, nostalgia |
| `bw_editorial` | Black and white, magazine contrast |
| `neon_warm` | Music cover, amapiano, viral warmth |
| `skin_safe_portrait` | Melanin-safe portrait warmth |
| `rgb_multiply` | Legacy placeholder parity (per-channel mult) |

## Domain constraints

### Photography

- Preserve shadow detail on faces; avoid ashy crushed blacks
- Warm grades: environment first, not orange skin
- Grade background harder — app reduces LUT on detected faces (~35–65% effective)

### Videography

- Design as finished display-referred social grade (not camera log)
- Music-cover looks: thumbnail legibility at small size
- Film emulation: pair with grain in `recommendedEffects`

### MoodLab invariants

- 33³ `.cube`, B→G→R iteration, `[0,1]` domain
- Local-first: no server-side grading
- `@moodlab/shared` LutDefinition via registry sync

## Skin protection defaults

| LUT type | Default |
|----------|---------|
| Portrait, Music Cover, melanin tags | `high` |
| Sunny / Viral general | `medium` |
| Creative film crush (rare) | `low` |
| Never for portrait | `off` |

## Batch generation (toward 1000 LUTs)

1. Pick taxonomy slice from `data/lut_taxonomy.yaml`
2. Add N registry entries with unique kebab-case ids
3. `pnpm lut:generate --all`
4. `pnpm lut:validate`
5. Spot/full visual QA per checklist
6. `pnpm lut:sync-catalog`

## Do not

- Hand-edit `.cube` RGB lines
- Duplicate API types outside `@moodlab/shared`
- Skip `pnpm lut:validate` before claiming done
- Ship portrait LUTs without skin-safe QA on diverse references

## Install (global)

From repo root:

```bash
npx skills add . --skill moodlab-lut-developer -g -y --agent cursor
```

Or symlink: `ln -sf "$(pwd)/skills/moodlab-lut-developer" ~/.agents/skills/moodlab-lut-developer`
