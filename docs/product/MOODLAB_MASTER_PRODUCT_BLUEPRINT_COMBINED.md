# MoodLab Master Product Blueprint — Combined



---

# MoodLab Master Product Blueprint

## 1. Product vision

MoodLab is a creator-first visual studio that turns photos into finished creator assets: cinematic portraits, social posts, cover art, thumbnails, campaign assets, and branded visuals using LUTs, Beauty Studio tools, templates, AI assistance, and export presets.

The product should not be positioned as a generic filter app. It should be positioned as:

> A mood-led creator image studio for people who want their camera-roll photos to look like cover art, campaign visuals, and premium social content.

## 2. Product promise

Upload a photo. Pick a mood. Protect the skin. Add creator design. Export for the platform.

## 3. Core product pillars

### Pillar 1: Photo Editor

The base editor for import, preview, adjustment, and export.

Core functions:
- import photo
- crop/rotate/straighten
- apply LUT
- adjust LUT strength
- exposure/contrast/warmth/tint/saturation
- shadows/highlights/fade/grain/sharpness/vignette/glow
- before/after
- save/share export

### Pillar 2: LUT Studio

The color identity system.

Core functions:
- curated mood packs
- `.cube` LUT support
- LUT strength
- favorites
- preview thumbnails
- free/pro pack locking
- custom presets
- later: import/export LUT
- later: mix LUTs
- later: AI look match

### Pillar 3: Beauty Studio

The portrait intelligence system.

Core functions:
- skin-safe LUTs
- skin smoothing
- texture restore
- even tone
- shine reduction
- face light
- under-eye lift
- eye clarity
- lip color boost
- Melanin Guard
- beauty presets
- later: makeup, hair, teeth, blemish removal, AI relight

### Pillar 4: Cover Art Maker

The music and creator asset engine.

Core functions:
- album/single/beat cover templates
- artist/producer text layers
- parental advisory sticker
- grain/paper/glow overlays
- YouTube beat thumbnail templates
- platform-safe export sizes

### Pillar 5: Text and Template Studio

The layout system.

Core functions:
- text presets
- caption-style templates
- social post templates
- typography packs
- stickers/labels
- saved text styles
- later: brand kits and AI text layout

### Pillar 6: Export Studio

The final asset delivery system.

Core functions:
- Instagram 4:5
- Instagram Story / TikTok 9:16
- YouTube thumbnail 16:9
- square cover art 1:1
- profile picture 1:1
- high-quality JPEG/PNG
- share sheet
- later: campaign bundle export

### Pillar 7: Packs / Marketplace

The content and monetization layer.

Core functions:
- free LUT packs
- Pro LUT packs
- template packs
- pack previews
- subscription gating
- later: creator uploads, public shops, payout system

### Pillar 8: AI Creative Assistant

The intelligent workflow layer.

Core functions:
- V2/V3 feature set
- auto-pick best LUT
- Match This Look
- AI beauty assist
- AI bad-lighting fix
- AI cover art generator
- AI campaign builder
- AI caption suggestions

### Pillar 9: Projects and Brand System

The retention layer.

Core functions:
- saved edits
- project folders
- saved presets
- creator identity
- logo/handle/watermark
- later: brand kits, campaign planner, team sharing

## 4. Target users

### Primary users

1. Music producers
   - beat covers
   - YouTube thumbnails
   - producer branding
   - social posts

2. Artists and musicians
   - single cover
   - rollout posts
   - profile visuals
   - campaign assets

3. Social creators
   - consistent aesthetic
   - viral posts
   - portrait cleanup
   - TikTok/Instagram exports

4. Everyday portrait users
   - better selfies
   - beauty/skin polish
   - sunny/cinematic edits
   - profile photos

### Secondary users

5. Photographers
   - LUT workflow
   - batch editing
   - client style consistency

6. Small brands
   - product posts
   - campaign posters
   - lookbook/social graphics

## 5. Product architecture: user-facing modules

```text
Onboarding
 └── Home
      ├── Edit Photo
      │    └── Editor
      │         ├── Mood / LUT
      │         ├── Adjust
      │         ├── Beauty
      │         ├── Text
      │         ├── Crop
      │         ├── Effects
      │         └── Export
      ├── Build My Post
      │    ├── Beat Cover
      │    ├── Portrait
      │    ├── Thumbnail
      │    ├── Social Post
      │    └── Campaign later
      ├── Packs
      ├── Projects
      └── Profile / Settings
```

## 6. V1 / V2 / V3 roadmap

### V1: Core editor + creator utility

Goal: prove the editing experience and export loop.

Must include:
- onboarding
- home
- import
- local editor
- LUT application
- LUT strength
- adjustment tools
- Beauty Studio MVP
- skin-safe LUT protection
- text templates
- social export presets
- free/pro pack structure
- basic paywall
- saved projects
- analytics events

Success metric:
> User imports a photo and exports a finished asset in under 60 seconds.

### V2: Creator Studio

Goal: make the app useful for repeat creators.

Add:
- Cover Art Maker
- beat post templates
- advanced text templates
- brand kit
- custom presets
- LUT import/export
- batch editing
- advanced Beauty Studio
- blemish cleanup
- lip/eye/hair tools
- saved creator identity
- better project folders

Success metric:
> Users return weekly to create repeated social/creator assets.

### V3: AI + marketplace

Goal: make MoodLab a platform.

Add:
- Match This Look
- AI LUT generator
- AI Beauty Assist
- AI bad-lighting fix
- AI campaign builder
- creator marketplace
- public creator pages
- creator pack uploads
- pack moderation
- community challenges
- remixable edit recipes

Success metric:
> Users discover, buy, save, and remix creator packs.

## 7. MVP definition

### MVP must do

- Import one photo.
- Apply LUTs quickly.
- Adjust strength.
- Perform basic edits.
- Apply skin-aware protection.
- Add basic text templates.
- Export to social formats.
- Save project.
- Unlock Pro packs.
- Track core analytics.

### MVP must not do

- Full marketplace.
- Team collaboration.
- Public feed.
- Advanced AI campaign builder.
- Live AR makeup.
- RAW editor.
- Desktop editor.
- Complex video editor.

## 8. Free vs Pro strategy

### Free

- limited LUT packs
- basic editor
- basic Beauty Studio
- basic text templates
- standard export
- limited projects

### Pro

- all premium LUT packs
- premium beauty presets
- premium cover templates
- high-res export
- no watermark
- saved custom presets
- batch editing later
- Match This Look later

### Marketplace later

- paid creator packs
- creator shops
- template packs
- LUT bundles
- revenue share

## 9. Product principles

### 1. Photo first

The canvas should dominate the UI.

### 2. Mood before technical tools

Users should pick “Sunny Cover Glow,” not manually adjust curves first.

### 3. Skin protection is core

LUTs should never ruin faces by default.

### 4. Export is the product moment

The true success event is not applying a filter. It is exporting a finished creation.

### 5. Beauty should preserve identity

The app should polish, not erase texture or skin tone.

### 6. Creator workflows should feel native

Music covers, beat posts, thumbnails, and rollout assets should not feel like an afterthought.

## 10. North Star Metric

> Finished exports per active user per week.

Supporting metrics:
- activation rate
- first export rate
- first export time
- LUT apply rate
- Beauty Studio usage
- text/template usage
- share rate
- Pro conversion
- retention D1/D7/D30
- pack unlock rate

## 11. Build order

1. App shell and navigation.
2. Import and local preview.
3. LUT engine.
4. Adjustment engine.
5. Export engine.
6. Beauty Studio MVP.
7. Text/template system.
8. Packs and paywall.
9. Projects.
10. Analytics.
11. QA and device testing.
12. Beta launch.

## 12. Final positioning

MoodLab is not just a photo editor.

It is:

> A creator-first image studio for turning photos into polished posts, cover art, thumbnails, portraits, and campaign assets with LUTs, skin-safe beauty tools, templates, and AI.


---

# MoodLab Feature Matrix

This matrix organizes the app by feature, product pillar, phase, monetization plan, implementation complexity, and priority.

| Feature | Pillar | Screen/Module | Phase | Plan | Difficulty | Backend | AI | Priority |
|---|---|---|---|---|---|---|---|---|
| Photo import | Photo Editor | Import | V1 | Free | Medium | No | No | P0 |
| Full-screen editor canvas | Photo Editor | Editor | V1 | Free | Medium | No | No | P0 |
| LUT application | LUT Studio | Editor > Mood | V1 | Free/Pro | High | No | No | P0 |
| LUT strength slider | LUT Studio | Editor > Mood | V1 | Free | Medium | No | No | P0 |
| LUT thumbnail carousel | LUT Studio | Editor > Mood | V1 | Free/Pro | Medium | No | No | P0 |
| Mood packs | LUT Studio | Home/Packs/Editor | V1 | Free/Pro | Medium | Yes | No | P0 |
| Basic adjustments | Photo Editor | Editor > Adjust | V1 | Free | Medium | No | No | P0 |
| Grain/glow/vignette | Effects | Editor > Effects | V1 | Free/Pro | Medium | No | No | P1 |
| Before/after preview | Photo Editor | Editor | V1 | Free | Medium | No | No | P0 |
| Social export presets | Export Studio | Export | V1 | Free | Medium | No | No | P0 |
| Share sheet | Export Studio | Export | V1 | Free | Medium | No | No | P0 |
| Saved projects | Projects | Projects | V1 | Free/Pro | Medium | Yes | No | P1 |
| Basic text templates | Text Studio | Editor > Text | V1 | Free | Medium | No | No | P0 |
| Music promo text templates | Text Studio | Editor > Text | V1 | Free/Pro | Medium | No | No | P1 |
| Skin-safe LUT protection | Beauty Studio | Editor > Beauty | V1 | Free/Pro | High | No | Optional later | P0 |
| Skin smoothing | Beauty Studio | Beauty > Skin | V1 | Free | High | No | No | P0 |
| Texture restore | Beauty Studio | Beauty > Skin | V1 | Free | Medium | No | No | P0 |
| Even tone | Beauty Studio | Beauty > Skin | V1 | Free/Pro | High | No | No | P0 |
| Reduce shine | Beauty Studio | Beauty > Skin | V1 | Free/Pro | Medium | No | No | P1 |
| Face light | Beauty Studio | Beauty > Face | V1 | Free | High | No | No | P0 |
| Under-eye lift | Beauty Studio | Beauty > Face | V1 | Pro | Medium | No | No | P1 |
| Melanin Guard | Beauty Studio | Beauty > Skin | V1 | Free/Pro | High | No | Optional later | P0 |
| Beauty presets | Beauty Studio | Beauty > Auto | V1 | Free/Pro | Medium | No | No | P0 |
| Paywall | Monetization | Paywall | V1 | Pro | Medium | Yes | No | P0 |
| Entitlements | Monetization | Backend | V1 | Pro | Medium | Yes | No | P0 |
| Analytics events | Analytics | All | V1 | Free | Medium | Yes | No | P0 |
| Cover Art Maker | Cover Art Maker | Build My Post | V2 | Free/Pro | High | Optional | No | P1 |
| Advanced typography | Text Studio | Text | V2 | Pro | Medium | Yes | No | P1 |
| Brand kit | Projects | Profile/Projects | V2 | Pro | Medium | Yes | No | P1 |
| LUT import | LUT Studio | LUT Studio | V2 | Pro | High | Optional | No | P1 |
| LUT export | LUT Studio | LUT Studio | V2 | Pro | High | Optional | No | P2 |
| Batch editing | Photo Editor | Batch | V2 | Pro | High | Optional | No | P1 |
| Blemish remover | Beauty Studio | Beauty > Skin | V2 | Pro | High | No | Optional | P1 |
| Lip tint | Beauty Studio | Beauty > Lips | V2 | Pro | Medium | No | Optional | P2 |
| Eye clarity | Beauty Studio | Beauty > Eyes | V2 | Free/Pro | Medium | No | No | P1 |
| Hair detail | Beauty Studio | Beauty > Hair | V2 | Pro | High | No | Optional | P2 |
| Makeup presets | Beauty Studio | Beauty > Makeup | V2 | Pro | High | No | Optional | P2 |
| Creator identity | Projects | Profile/Build My Post | V2 | Pro | Medium | Yes | No | P1 |
| Match This Look | AI Assistant | AI | V3 | Pro | Very High | Yes | Yes | P1 |
| AI Beauty Assist | AI Assistant | Beauty > Auto | V3 | Pro | Very High | Yes | Yes | P1 |
| AI Bad Lighting Fix | AI Assistant | AI | V3 | Pro | Very High | Yes | Yes | P1 |
| AI Campaign Builder | AI Assistant | Build My Post | V3 | Pro | Very High | Yes | Yes | P2 |
| Creator marketplace | Marketplace | Packs | V3 | Marketplace | Very High | Yes | No | P2 |
| Creator profiles | Marketplace | Packs/Profile | V3 | Marketplace | High | Yes | No | P2 |
| Remixable edit recipes | Community | Community/Packs | V3 | Free/Pro | High | Yes | No | P2 |
| Community challenges | Community | Community | V3 | Free | High | Yes | No | P3 |
| Campaign planner | Creator Tools | Projects | V4 | Pro | High | Yes | Optional | P3 |
| Team collaboration | Creator Tools | Projects | V4 | Team | Very High | Yes | No | P3 |
| Web editor | Platform | Web | V4 | Pro/Team | Very High | Yes | No | P3 |


---

# MoodLab Roadmap

## V1 — Core editor and export loop

### Goal
Create a smooth, local-first mobile editor that gets users from photo import to finished export quickly.

### Core screens
- Onboarding
- Home
- Import
- Editor
- Mood/LUT drawer
- Adjust panel
- Beauty panel
- Text panel
- Export
- Packs
- Paywall
- Projects
- Profile/settings

### Must-have capabilities
- Import photo
- Apply LUT
- Adjust LUT strength
- Basic edits
- Beauty Studio MVP
- Skin-safe LUT protection
- Text templates
- Social export presets
- Save project
- Free/Pro gating
- Analytics

### Definition of done
A new user can import a photo, apply a mood, make skin-safe improvements, add text, and export a finished social image.

## V2 — Creator Studio

### Goal
Make MoodLab a repeat-use tool for creators.

### Add
- Cover Art Maker
- beat cover templates
- advanced text/template library
- brand kit
- creator identity
- custom LUT import
- batch editing
- advanced Beauty Studio
- better project folders

### Definition of done
A creator can generate a complete visual identity for repeated posts and releases.

## V3 — AI and Marketplace

### Goal
Turn MoodLab into a platform.

### Add
- Match This Look
- AI LUT generator
- AI Beauty Assist
- AI bad-lighting fix
- AI campaign builder
- creator marketplace
- public creator pages
- creator uploads
- pack moderation
- remixable edit recipes

### Definition of done
Users can discover looks, generate looks, buy creator packs, and remix edits.

## V4 — Pro Platform

### Goal
Support teams, professionals, and cross-device workflows.

### Add
- web editor
- collaboration
- campaign planner
- team brand kits
- client review links
- project sharing
- advanced analytics


---

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


---

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


---

# MoodLab Cover Art Maker Spec

## 1. Cover Art Maker thesis

Cover Art Maker turns photos into finished music and creator assets.

It should support:
- beat covers
- single covers
- album covers
- YouTube thumbnails
- TikTok covers
- artist rollout posts

## 2. Entry points

- Home > Build My Post
- Editor > Text
- Export > Create more sizes

## 3. Build My Post options

- I am posting a beat
- I am dropping a song
- I need a profile photo
- I need a YouTube thumbnail
- I need an Instagram story
- I need a fashion post
- I need a campaign later

## 4. MVP templates

### Beat post
- Posting My Beat Day 001
- Full Beat on YouTube
- Type Beat Cover
- Producer Diary
- Made This At 3AM

### Artist release
- Out Now
- Coming Soon
- New Single
- Link In Bio
- Visualizer

### Creator profile
- Artist Profile
- Producer Profile
- Luxury Headshot
- Cinematic Portrait

## 5. Template layers

Each template should support:
- image layer
- LUT/preset reference
- text layers
- sticker layers
- logo/handle layer
- grain/texture overlay
- export ratio

## 6. V2 features

- brand kit
- logo upload
- saved handle
- batch campaign sizes
- template packs
- advanced typography
- parental advisory sticker
- barcode / cassette / vinyl textures

## 7. V3 features

- AI cover generator
- AI layout generator
- campaign builder
- release-week asset pack


---

# MoodLab Monetization and Packaging

## 1. Monetization thesis

The app should be valuable for free users, but the premium tier should unlock consistency, depth, quality, and speed.

## 2. Free tier

- selected free LUT packs
- basic editor
- basic Beauty Studio
- basic text templates
- standard export
- limited saved projects

## 3. Pro tier

- all premium LUT packs
- premium beauty presets
- premium text templates
- high-res export
- no watermark
- custom presets
- Pro cover art templates
- later: batch editing, LUT import/export, Match This Look

## 4. Pack monetization

Sell individual packs later:
- LUT packs
- cover template packs
- beauty preset packs
- typography packs
- grain/texture packs
- campaign packs

## 5. Marketplace later

Creator sellers can upload:
- LUT packs
- text templates
- cover templates
- creator brand kits
- preset bundles

MoodLab takes a platform commission.

## 6. Strong paywall moments

- user taps locked LUT
- user tries premium beauty preset
- user tries high-res export
- user tries no watermark
- user tries Pro template
- user tries Match This Look later

## 7. Bad paywall moments

Avoid blocking:
- first import
- first basic edit
- first basic export
- basic skin cleanup
- previewing locked packs
