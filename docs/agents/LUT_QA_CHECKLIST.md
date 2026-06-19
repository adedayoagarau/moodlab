# LUT Visual QA Checklist

Use this checklist after `pnpm lut:validate` passes. Visual QA catches issues structural validation cannot.

Reference images live in [`luts/qa/references/`](../../luts/qa/references/). Preview LUTs in the MoodLab editor or batch preview tool when available.

## Pre-flight

- [ ] Registry entry complete (id, name, packId, categories, grade, metadata)
- [ ] `pnpm lut:generate` succeeded for this LUT
- [ ] `pnpm lut:validate` reports zero errors
- [ ] `pnpm lut:sync-catalog` run if metadata changed

## Technical smoke

- [ ] `.cube` file exists at `luts/original/<id>.cube`
- [ ] Catalog entry `cubeSize` matches file (33)
- [ ] LUT listed in correct pack's `lutIds`
- [ ] API path resolves: `GET /api/v1/luts/<id>/cube`

## Portrait QA (required for Portrait / Music Cover / melanin tags)

Test at **defaultStrength** with **default skinProtectionDefault**.

- [ ] Face retains natural warmth — no orange, gray, or purple cast
- [ ] Shadow detail preserved on cheeks, jawline, hairline
- [ ] Background mood reads stronger than face (intentional — app attenuates face)
- [ ] Strength slider 0.5–0.8: still flattering on diverse skin tones
- [ ] Strength slider 0.9–1.0: acceptable with skin protection on; note if "off" breaks skin

### Melanin-specific (tags: melanin, skin-safe, brown, shadow-skin)

- [ ] No ashy or chalky shadows in deep skin tones
- [ ] Warmth enhances, not replaces, undertone
- [ ] `skinProtectionDefault` is `high` unless documented exception

## Category mood (2-second test)

At thumbnail size, the LUT should immediately suggest its category:

| Category | Should read as |
|----------|----------------|
| Sunny | Bright, warm, optimistic |
| Cinematic | Filmic contrast, intentional color story |
| Dark | Moody, low-key, cover-art ready |
| Film | Grain-friendly, nostalgic, faded or golden |
| Portrait | Flattering skin, soft or editorial |
| Music Cover | Punchy, thumbnail-legible, bold |
| Streetwear | High contrast, flash or urban edge |
| Luxury | Refined, matte or editorial restraint |
| Viral | Clean, scroll-stopping, social-native |
| Black and White | Neutral luminance, not color-tinted |

## Environment QA

Test on at least one non-portrait reference (sky, urban, indoor):

- [ ] Sky blues not neon unless Viral/Neon look
- [ ] Greens natural (or intentionally stylized for category)
- [ ] Night scenes retain readable shadow detail
- [ ] Indoor tungsten doesn't go nuclear orange

## Companion effects

If `recommendedEffects` set:

- [ ] Grain level matches film/nostalgia intent (0.08–0.22 typical)
- [ ] Glow not excessive on skin at default strength
- [ ] Vignette supports mood without obscuring face in portrait crops

## Scoring

| Score | Meaning |
|-------|---------|
| Pass | All required checks pass; ship |
| Revise | Fixable via recipe params — adjust registry, regenerate |
| Reject | Fundamental look wrong — new brief/recipe needed |

## QA workflow for batches

When generating 10+ LUTs:

1. Validate all technically (`pnpm lut:validate`)
2. Full visual QA on **every** Portrait/Music Cover LUT
3. Spot-check 20% of non-portrait LUTs per category
4. Flag failures back to registry `grade.params` — never patch `.cube` by hand

## Reference image set

Maintain diversity in `luts/qa/references/`:

| File | Purpose |
|------|---------|
| `README.md` | Index and usage |
| `portrait-warm-skin.svg` | Warm medium skin, outdoor |
| `portrait-deep-skin.svg` | Deep skin, shadow detail |
| `portrait-indoor-tungsten.svg` | Indoor warm light |
| `environment-sky-day.svg` | Sunny / sky grades |
| `environment-urban-night.svg` | Dark / cinematic |
| `environment-indoor-soft.svg` | Soft portrait / creamy |

Replace placeholder references with licensed photos before production QA sign-off.
