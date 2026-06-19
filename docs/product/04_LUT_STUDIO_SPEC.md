# MoodLab LUT Studio Product Spec

## 1. LUT Studio thesis

LUT Studio is the color identity engine of MoodLab. It should let users pick emotional looks quickly, while still supporting advanced creator workflows later.

## 2. MVP LUT categories

- Sunny
- Cinematic
- Dark
- Film
- Portrait
- Music Cover
- Streetwear
- Luxury
- Viral
- Black and White

## 3. MVP LUT features

- Apply `.cube` LUT
- Strength slider
- Favorite LUTs
- Preview thumbnails
- Free/Pro pack labels
- Skin-safe protection
- Recommended companion settings:
  - grain
  - glow
  - vignette
  - sharpen
  - skin protection level

## 4. LUT metadata

Each LUT should include:

```json
{
  "id": "sunny_cover_glow",
  "name": "Sunny Cover Glow",
  "category": ["Sunny", "Portrait", "Music Cover"],
  "file": "LockCrazy_SunnyCoverGlow_33.cube",
  "default_strength": 0.78,
  "skin_protection_default": "medium",
  "recommended_effects": {
    "grain": 0.12,
    "glow": 0.18,
    "vignette": 0.10
  },
  "plan": "free"
}
```

## 5. V2 LUT features

- custom LUT import
- custom LUT export
- LUT mix
- LUT randomizer
- LUT history
- user-created presets
- batch apply

## 6. V3 LUT features

- Match This Look
- AI LUT generator
- creator LUT marketplace
- remixable edit recipes
