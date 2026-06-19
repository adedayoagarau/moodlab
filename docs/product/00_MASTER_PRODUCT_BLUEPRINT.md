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
