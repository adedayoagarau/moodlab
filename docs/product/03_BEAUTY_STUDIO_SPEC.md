# MoodLab Beauty Studio Product Spec

## 1. Beauty Studio thesis

Beauty Studio should make portraits look polished while preserving identity, skin tone, and texture.

The goal is not to erase the person. The goal is:

> Look polished. Keep your tone. Keep your texture. Keep yourself.

## 2. Beauty Studio MVP tabs

Inside the editor:

```text
Mood | Adjust | Beauty | Text | Crop | Effects
```

Inside Beauty:

```text
Auto | Skin | Face | Eyes | Lips | Hair later | Makeup later
```

## 3. MVP Beauty controls

### Auto

- Natural
- Clean
- Soft
- Glam
- Editorial

### Skin

- Smooth
- Texture
- Even Tone
- Reduce Shine
- Warmth
- Ash Fix
- Melanin Guard

### Face

- Face Light
- Under-eye Lift
- Shadow Soften
- Background Balance

### Eyes

- Brighten
- Clarity
- Catchlight later

### Lips

- Natural Color Boost
- Lip Tint later

## 4. Signature features

### Skin-Safe LUTs

LUTs should not affect every pixel equally when a person is detected.

System behavior:

```text
Detect face/skin/person
Apply selected LUT to the full image
Reduce LUT intensity on skin if needed
Preserve natural skin tone
Allow stronger grade on background
```

Controls:
- Skin Protection: Off / Low / Medium / High
- Face LUT Strength
- Background LUT Strength
- Preserve Warmth
- Preserve Depth

### Melanin Guard

For darker and brown skin tones, protect against:
- gray/ashy shadows
- over-orange skin
- red cast
- blue/purple cast on face
- crushed facial shadows
- loss of undertone

Controls:
- Protect Depth
- Protect Warmth
- Reduce Ash
- Recover Highlights
- Preserve Brown Tone

## 5. Beauty presets

### MVP presets
- Clean Skin
- Melanin Gold
- Soft Glow
- Studio Face
- Flash Fix
- No Filter Skin
- Brown Editorial
- Sunny Skin
- Dark Studio Face
- Luxury Matte

### V2 presets
- Brown Girl Glam
- No Makeup Makeup
- Soft Glam
- Golden Hour Glam
- Editorial Face
- Night Out
- R&B Purple Glam
- Amapiano Night
- Artist Profile
- Producer Profile

## 6. Beauty intensity levels

| Level | Description |
|---|---|
| Natural | invisible cleanup |
| Clean | polished but realistic |
| Soft | social-media beauty |
| Glam | makeup/editorial |
| Cover | dramatic cover-art effect |

Default should be Clean or Natural, never extreme.

## 7. Beauty safety rules

- Do not default to heavy smoothing.
- Always preserve texture.
- Avoid changing facial identity.
- Avoid automatic skin lightening.
- Avoid making eyes/teeth unnaturally white.
- Label stronger glam tools clearly.
- Let users turn off face-aware edits.

## 8. V1 / V2 / V3 Beauty roadmap

### V1
- Skin smoothing
- Texture restore
- Even tone
- Reduce shine
- Face light
- Under-eye lift
- Eye brightness
- Lip color boost
- Skin-safe LUTs
- Melanin Guard

### V2
- Blemish remover
- Teeth whitening
- Hair detail
- Lip tint
- Makeup presets
- Advanced face relight
- Full-body skin tone matching

### V3
- AI Beauty Assist
- AI bad-lighting fix
- AI skin tone match
- Live beauty camera
- AR makeup preview
