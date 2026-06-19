# LUT Visual QA Reference Images

Reference images for the LUT Developer Agent visual QA workflow. See [`docs/agents/LUT_QA_CHECKLIST.md`](../../docs/agents/LUT_QA_CHECKLIST.md).

## Usage

1. Generate or update LUT: `pnpm lut:generate --id <id>`
2. Validate: `pnpm lut:validate`
3. Preview LUT in MoodLab editor against these references
4. Score per checklist (Pass / Revise / Reject)

## Reference set

| File | Scene | QA focus |
|------|-------|----------|
| `portrait-warm-skin.svg` | Warm medium skin, outdoor | Warm grades, golden hour |
| `portrait-deep-skin.svg` | Deep skin, shadow detail | Melanin-safe, no ashy shadows |
| `portrait-indoor-tungsten.svg` | Indoor warm light | Tungsten balance, creamy indoor |
| `environment-sky-day.svg` | Blue sky, daylight | Sunny, sky blues |
| `environment-urban-night.svg` | Urban night scene | Dark, cinematic, moody |
| `environment-indoor-soft.svg` | Soft indoor ambient | Portrait softness, low contrast |

## Placeholder images

Current files are **SVG placeholders** (solid gradients representing scene types). Replace with licensed reference photos before production sign-off. Requirements:

- Diverse skin tones (Fitzpatrick IV–VI minimum for portrait refs)
- Mix of indoor/outdoor, day/night
- Typical creator crop ratios (4:5, 9:16 friendly)

## Adding references

1. Add licensed JPEG/PNG to this directory
2. Update this README index
3. Run visual QA on all Portrait/Music Cover LUTs against new refs
