# MoodLab UI Design Specification — iOS + Android

**Document type:** End-to-end mobile UI/UX design specification  
**Product:** MoodLab / VibeGrade — LUT photo editor for creators  
**Platforms:** iOS 26+ and Android 16+ target design language  
**Version:** 1.0  
**Date:** 2026-06-18  
**Owner:** Product + Design + Mobile Engineering  

---

## 0. Executive Summary

MoodLab is a **creator-first LUT photo editor** that turns camera-roll photos into cinematic posts, cover-art visuals, rollout graphics, and social-ready exports.

The UI must feel:

- **fast enough for daily posting**
- **premium enough for creators**
- **simple enough for non-editors**
- **powerful enough for pro workflows**
- **native on both iOS and Android**

The design direction is:

> **A local-first, full-screen visual editor with floating glass controls, mood-first LUT selection, platform-native navigation, and social-ready export flows.**

This document specifies the full end-to-end UI for both iOS and Android, including visual language, design tokens, navigation, screens, components, states, motion, accessibility, monetization surfaces, and developer handoff.

---

## 1. 2026 Design Direction

### 1.1 Product UI thesis

The app should not look like a generic photo filter grid. It should look like a **creative cockpit**:

```text
Photo first.
Mood second.
Controls only when needed.
Export always one tap away.
```

The user should feel like they are making a professional post, not fighting editing software.

### 1.2 2026-grade aesthetic

The visual style should combine:

| Layer | Direction |
|---|---|
| **Canvas** | immersive, full-bleed photo-first editing |
| **Controls** | floating glass panels, docked rails, compact iconography |
| **Brand** | dark premium creator studio |
| **Motion** | fluid, tactile, haptic, spring-based |
| **AI surfaces** | calm, assistive, not gimmicky |
| **Monetization** | editorial pack cards, not aggressive popups |

### 1.3 Platform-native philosophy

The app shares one brand system but respects platform conventions.

| Area | iOS | Android |
|---|---|---|
| Core visual language | Liquid Glass-inspired, translucent materials, SF-style system rhythm | Material 3 / expressive edge-to-edge surfaces, dynamic motion, adaptive containers |
| Navigation | Tab bar + NavigationStack + sheets | Navigation bar + Compose navigation + predictive back |
| Overlays | glass sheets, detents, context menus | modal bottom sheets, cards, menus |
| System share | iOS Share Sheet | Android Sharesheet |
| Haptics | impact/selection/notification haptics | vibration effects where supported |
| Typography | SF Pro / system | Roboto / system |
| Icons | SF Symbols-inspired custom set | Material Symbols-inspired custom set |

---

## 2. Core Design Principles

### 2.1 The image is the interface

The edited image is always the hero. All tools must orbit around the photo, not dominate it.

Rules:

- Full-screen image canvas by default.
- Controls float above the canvas.
- Panels collapse quickly.
- Toolbars use translucent background layers.
- User can tap the canvas to hide UI.

### 2.2 Mood before settings

The first user decision should be:

```text
What mood do I want?
```

Not:

```text
What should my contrast curve be?
```

Primary categories:

- Sunny
- Cinematic
- Dark
- Portrait
- Music Cover
- Streetwear
- Film
- Viral
- Luxury
- AI Match

### 2.3 One-tap useful, deep when needed

Every screen should support both:

- beginner path: select mood → export
- advanced path: tune LUT → adjust → text → crop → export

### 2.4 Local-first speed

Editing must feel instant.

- Preview is on-device.
- LUT thumbnails are cached.
- Export re-renders from original.
- Cloud only appears for accounts, packs, AI jobs, sync, and purchases.

### 2.5 Creator identity

The app should feel designed for people who post.

Core surfaces should support:

- beat cover visuals
- “posting my beat” templates
- artist rollout graphics
- profile pictures
- YouTube thumbnails
- IG/TikTok post crops
- X announcement assets

---

## 3. Information Architecture

### 3.1 Global app sections

#### iOS Tab Bar

```text
Home
Create
Packs
Profile
```

Optional later:

```text
Discover
```

#### Android Navigation Bar

```text
Home
Create
Packs
Profile
```

Use the same four destinations for parity.

### 3.2 Navigation hierarchy

```text
App
├── Onboarding
├── Home
│   ├── Recent Projects
│   ├── Suggested Modes
│   ├── Weekly LUT Drop
│   └── Quick Actions
├── Create
│   ├── Import
│   ├── Camera
│   ├── Gallery
│   ├── Batch Import
│   └── Editor
│       ├── Moods / LUTs
│       ├── Adjust
│       ├── Text
│       ├── Templates
│       ├── Crop
│       ├── AI Match
│       └── Export
├── Packs
│   ├── Free Packs
│   ├── Pro Packs
│   ├── Creator Packs
│   ├── Purchased Packs
│   └── Pack Detail
├── Profile
│   ├── Saved Presets
│   ├── Projects
│   ├── Account
│   ├── Subscription
│   ├── Settings
│   └── Help
└── System Surfaces
    ├── Paywall
    ├── Restore Purchases
    ├── Permission Prompts
    ├── Offline State
    └── Error Recovery
```

---

## 4. User Journey Map

### 4.1 First-time user journey

```text
Install
→ Open app
→ See value proposition
→ Pick creator type
→ Grant photo access
→ Import first photo
→ App recommends 5 looks
→ User applies LUT
→ User adds optional text
→ Export
→ Share
→ Save preset
```

### 4.2 Returning user journey

```text
Open app
→ Recent project or Create
→ Apply favorite LUT
→ Adjust strength
→ Export in last-used ratio
```

### 4.3 Pro creator journey

```text
Open app
→ Batch import
→ Apply saved preset
→ Tune first image
→ Apply to batch
→ Export all
→ Save pack-specific preset
```

### 4.4 Music creator journey

```text
Open app
→ Build My Post
→ I’m posting a beat
→ Choose photo
→ App applies Music Cover mode
→ User edits title text
→ Export 4:5 + 9:16 + 16:9
```

### 4.5 AI look match journey

```text
Open app
→ Create
→ AI Match
→ Select source photo
→ Select reference photo
→ Consent to temporary upload
→ App generates custom LUT
→ User adjusts strength
→ Save as preset
```

---

## 5. Visual Identity

### 5.1 Brand personality

MoodLab should feel:

- premium
- fast
- cinematic
- expressive
- modern
- creator-native
- slightly underground
- not childish

Avoid:

- cheap neon overload
- generic AI gradients everywhere
- overused purple-blue SaaS look
- too many cartoon icons
- cluttered editor panels

### 5.2 Brand theme

Recommended identity:

```text
Dark creator studio + warm cinematic accent + glass control surfaces.
```

### 5.3 Color palette

#### Core colors

```json
{
  "color.brand.black": "#070708",
  "color.brand.ink": "#0D0D10",
  "color.brand.panel": "#15151A",
  "color.brand.panelElevated": "#1E1E25",
  "color.brand.textPrimary": "#F7F4EE",
  "color.brand.textSecondary": "#B9B3AA",
  "color.brand.textMuted": "#76716B",
  "color.brand.gold": "#F5B85B",
  "color.brand.orange": "#FF7A33",
  "color.brand.blue": "#6CA7FF",
  "color.brand.green": "#66D19E",
  "color.brand.red": "#FF5C66"
}
```

#### iOS glass material overlays

```json
{
  "ios.glass.surface": "rgba(22, 22, 26, 0.54)",
  "ios.glass.surfaceStrong": "rgba(10, 10, 12, 0.72)",
  "ios.glass.stroke": "rgba(255, 255, 255, 0.16)",
  "ios.glass.highlight": "rgba(255, 255, 255, 0.24)",
  "ios.glass.shadow": "rgba(0, 0, 0, 0.38)"
}
```

#### Android surfaces

```json
{
  "android.surface": "#101014",
  "android.surfaceContainer": "#1A1A20",
  "android.surfaceContainerHigh": "#24242B",
  "android.outline": "#3A3740",
  "android.primary": "#F5B85B",
  "android.secondary": "#FF9E64",
  "android.tertiary": "#7AA9FF"
}
```

### 5.4 Color usage rules

- Use dark UI by default.
- Do not apply brand colors heavily over photos.
- Use warm gold/orange only for selected states, CTAs, and Pro highlights.
- Use blue for AI/magic features.
- Use green only for success.
- Use red only for destructive or failed states.
- Maintain accessible contrast.

---

## 6. Typography

### 6.1 iOS typography

Use system typography.

| Role | iOS token |
|---|---|
| Display | Large Title / custom 34–40 pt |
| Screen title | Title 1 / 28 pt |
| Section title | Title 3 / 20 pt |
| Body | Body / 17 pt |
| Label | Subheadline / 15 pt |
| Micro label | Caption 1 / 12 pt |

### 6.2 Android typography

Use Material 3 type roles.

| Role | Android token |
|---|---|
| Display | Display Small |
| Screen title | Headline Medium |
| Section title | Title Medium |
| Body | Body Large |
| Label | Label Large |
| Micro label | Label Small |

### 6.3 Product typography rules

- UI text must be short.
- Editor labels must be one or two words.
- Use sentence case.
- Avoid technical color terms in beginner mode.
- Advanced mode can use “Temperature,” “Tint,” “Highlights,” etc.
- Template text can use expressive typefaces, but app UI should remain system-native.

---

## 7. Spacing, Grid, Radius, Elevation

### 7.1 Base grid

Use an **8-point grid**.

```json
{
  "space.0": 0,
  "space.1": 4,
  "space.2": 8,
  "space.3": 12,
  "space.4": 16,
  "space.5": 20,
  "space.6": 24,
  "space.8": 32,
  "space.10": 40,
  "space.12": 48,
  "space.16": 64
}
```

### 7.2 Border radius

```json
{
  "radius.xs": 6,
  "radius.sm": 10,
  "radius.md": 16,
  "radius.lg": 22,
  "radius.xl": 28,
  "radius.full": 999
}
```

### 7.3 Component radius rules

| Component | Radius |
|---|---|
| Small chip | full |
| Button | 16–999 depending style |
| Card | 22–28 |
| Bottom sheet | top 28 |
| LUT thumbnail | 16 |
| Photo preview | 20 |
| Floating toolbar | full / capsule |
| Dialog | 28 |

### 7.4 Elevation / shadow

#### iOS

Use soft layered shadows with glass blur.

```json
{
  "ios.shadow.floating": "0 12 32 rgba(0,0,0,0.32)",
  "ios.shadow.sheet": "0 -16 48 rgba(0,0,0,0.40)"
}
```

#### Android

Use tonal elevation rather than heavy shadows.

```json
{
  "android.elevation.level1": 1,
  "android.elevation.level2": 3,
  "android.elevation.level3": 6
}
```

---

## 8. Iconography

### 8.1 Icon style

Use a custom icon set inspired by platform-native icons:

- rounded stroke
- 2 px optical stroke
- filled selected state
- outline default state
- simple recognizable metaphors

### 8.2 Required icons

```text
home
plus/create
image
camera
sparkle
wand
layers
sliders
text
crop
export
download
share
heart
bookmark
lock
pro-crown
undo
redo
before-after
more
settings
profile
marketplace
batch
cloud
offline
warning
trash
```

### 8.3 Platform adaptation

| iOS | Android |
|---|---|
| use SF Symbols where possible or visually aligned custom icons | use Material Symbols where possible or visually aligned custom icons |
| rounded icon capsules | Material icon buttons |
| context menus | overflow menus |

---

## 9. Motion and Interaction

### 9.1 Motion personality

Motion should feel:

- soft
- fast
- magnetic
- not cartoonish
- tactile

### 9.2 Timing tokens

```json
{
  "motion.instant": 80,
  "motion.fast": 160,
  "motion.standard": 240,
  "motion.slow": 360,
  "motion.export": 600
}
```

### 9.3 Easing

```json
{
  "ease.standard": "cubic-bezier(0.2, 0.0, 0, 1.0)",
  "ease.emphasized": "cubic-bezier(0.2, 0.0, 0, 1.0)",
  "ease.spring": "platform-native spring"
}
```

### 9.4 Interaction patterns

| Interaction | Behavior |
|---|---|
| Tap canvas | hide/show UI chrome |
| Long-press image | show original before |
| Drag before-after handle | reveal original/edited split |
| Swipe LUT rail | live thumbnails |
| Tap LUT | apply with 160 ms crossfade |
| Hold LUT | preview at 100% strength |
| Double tap slider | reset to default |
| Pinch image | zoom/pan canvas |
| Two-finger tap | undo |
| Export tap | progress sheet with cancel |

### 9.5 Haptics

| Action | Haptic |
|---|---|
| Apply LUT | light selection |
| Save preset | success |
| Export complete | success |
| Delete project | warning |
| Slider center/default snap | subtle tick |
| Paywall purchase success | notification success |

---

## 10. Accessibility

### 10.1 Contrast

Minimum contrast targets:

- normal text: **4.5:1**
- large text: **3:1**
- critical controls: should remain readable over photo backgrounds
- glass panels must include scrim/blur when placed over bright images

### 10.2 Touch targets

Minimum practical targets:

| Platform | Recommended target |
|---|---|
| iOS | 44×44 pt minimum |
| Android | 48×48 dp minimum |

### 10.3 Dynamic type / font scaling

- Support iOS Dynamic Type.
- Support Android font scaling.
- Avoid fixed-height text containers.
- Editor tools can use horizontal scroll if text scales.
- Do not truncate critical actions like Export, Save, Cancel, Restore.

### 10.4 Screen reader labels

Examples:

```text
“Apply Sunny Cover Glow LUT”
“LUT strength, 78 percent”
“Show original image”
“Export image”
“Locked Pro pack”
“Before and after preview slider”
```

### 10.5 Color-blind safety

Never communicate state by color alone.

Selected LUT should show:

- border
- checkmark
- label
- haptic feedback

### 10.6 Reduced motion

If reduced motion is enabled:

- disable exaggerated blur morphing
- remove parallax
- replace spring zooms with fades
- maintain functional transitions

### 10.7 Reduce transparency

If reduce transparency is enabled:

- iOS glass panels become opaque dark panels.
- Android translucent surfaces become solid `surfaceContainerHigh`.
- Maintain border and elevation.

---

## 11. Core Components

### 11.1 App shell

#### iOS

- Bottom tab bar with glass material.
- Floating create button is not a tab action unless used as the Create tab.
- Use large titles on Home/Packs/Profile.
- Editor hides global tab bar.

#### Android

- Material 3 navigation bar.
- Edge-to-edge layout.
- Top app bars on content screens.
- Editor uses full-screen immersive mode with safe inset-aware controls.

### 11.2 Primary button

```text
Height: 52
Radius: 999
Background: brand.gold
Text: brand.black
Label weight: semibold
```

States:

- default
- pressed
- loading
- disabled
- success

### 11.3 Secondary button

```text
Height: 48
Radius: 999
Background: glass/surfaceContainer
Border: subtle stroke
Text: textPrimary
```

### 11.4 Icon button

```text
Size: 44 iOS / 48 Android
Shape: circle or rounded capsule
Background: glass/surface
```

### 11.5 LUT thumbnail

```text
Size: 72×96 compact
Size: 92×124 large
Radius: 16
Label: 12–13
Selected: gold border + checkmark
Locked: small lock badge
```

### 11.6 Mood chip

```text
Height: 36
Padding: 14 horizontal
Radius: full
Default: glass dark
Selected: gold text/border or filled gold
```

### 11.7 Editor slider

```text
Height area: 56
Track: 4
Thumb: 24
Center snap marker
Value label above thumb when dragging
```

Beginner labels:

- Softer
- Warmer
- Brighter
- Mood
- Glow
- Grain

Advanced labels:

- Exposure
- Contrast
- Temperature
- Tint
- Highlights
- Shadows
- Saturation
- Sharpen

### 11.8 Bottom sheet

#### iOS

Use detents:

- compact: 120–160
- medium: 40–55% screen
- expanded: 85–90%

#### Android

Use modal bottom sheet:

- peek height for editor rail
- medium height for LUT grid
- expanded for pack detail

### 11.9 Toast / snackbar

Use for:

- preset saved
- export complete
- offline mode
- purchase restored
- LUT downloaded

Avoid using toasts for critical destructive errors. Use dialogs instead.

---

## 12. Screen-by-Screen Specification

---

# A. Onboarding

## A1. Splash

### Purpose

Load app shell, warm cache, show brand.

### UI

```text
Black background
MoodLab wordmark
Subtle animated grain
Gold glow behind logo
```

### Duration

- 0.8–1.2 sec max
- skip if app resumes from background

---

## A2. Value proposition carousel

### Screens

1. **Make every photo feel like a cover.**
2. **Pick a mood. Export a post.**
3. **LUTs, templates, captions, and creator packs.**

### iOS

- full-screen pages
- glass continue button
- page dots
- “Skip” top trailing

### Android

- full-screen pages
- Material button
- page indicator
- “Skip” text button

### CTA

```text
Start creating
```

---

## A3. Creator type picker

### Purpose

Personalize home and suggested modes.

### Options

```text
Music creator
Artist
Photographer
Influencer
Small brand
Just editing photos
```

### UI

- large selectable cards
- icons + short description
- multi-select allowed

### Data

Store locally and in profile if logged in.

---

## A4. Permission primer

### Purpose

Explain photo access before system prompt.

### Copy

```text
MoodLab needs access to the photos you choose so you can edit and export. Your photos stay on your device unless you use AI Match, backup, or sharing.
```

### CTA

```text
Choose photos
```

### Secondary

```text
Not now
```

---

# B. Home

## B1. Home screen

### Purpose

Fast re-entry and discovery.

### Layout

```text
Top:
  Greeting + Pro/avatar
Hero:
  “Build My Post” card
Quick actions:
  Edit photo
  Beat cover
  AI Match
  Batch
Recent:
  horizontal project cards
Weekly drop:
  LUT pack card
Suggested:
  mood chips / templates
```

### iOS design

- large title
- glass hero card
- floating tab bar
- horizontal carousels
- subtle depth

### Android design

- edge-to-edge top app bar
- Material 3 cards
- navigation bar
- adaptive columns on foldables/tablets

### Primary CTA

```text
Build My Post
```

### Secondary CTAs

```text
Edit Photo
Open Recent
View Packs
```

---

## B2. Build My Post

### Purpose

Signature guided workflow.

### Entry

Home hero or Create tab.

### Options

```text
I’m posting a beat
I’m dropping a song
I need cover art
I need a profile picture
I need a YouTube thumbnail
I need an IG story
I need a clean portrait
I need a fashion post
```

### Output

The app preselects:

- LUT pack
- crop ratio
- text template
- overlay style
- export presets

### Example

```text
I’m posting a beat
→ Music Cover mode
→ 4:5 crop
→ warm cover LUT
→ bold text overlay
→ caption suggestions
```

---

# C. Import

## C1. Import picker

### Sources

```text
Camera
Gallery
Files
Recent projects
Batch import
```

### iOS

- use Photos picker
- support limited-library permissions
- use system camera if native capture is not built

### Android

- use Photo Picker
- support media permissions safely
- persist selected URI only when needed

### Empty state

```text
Choose a photo to start creating.
```

---

## C2. Batch import

### Purpose

Pro workflow for photographers/creators.

### UI

- grid selection
- selected count
- max count based on device memory/subscription
- “Apply same look to all”

### States

| State | Behavior |
|---|---|
| Free user | limited batch count |
| Pro user | larger batch count |
| Low memory | warn and reduce preview quality |
| Offline | allow local batch if LUT exists locally |

---

# D. Editor

## D1. Editor layout

### Purpose

The central product experience.

### Universal layout

```text
Full-screen image canvas

Top floating bar:
  Back
  Project name / mode
  Undo
  Redo
  Export

Canvas:
  image
  crop overlay if active
  text layers if active
  before/after handle if active

Bottom control zone:
  tool rail
  active tool panel
```

### Top bar

#### iOS

```text
Glass capsule
Back icon
Title center
Undo/redo/export icons
```

#### Android

```text
Transparent/tonal top app bar
Back arrow
Title
Undo/redo/export actions
```

### Bottom rail tools

```text
Moods
Adjust
Text
Templates
Crop
AI
More
```

### Canvas behavior

| Gesture | Result |
|---|---|
| Tap | hide/show controls |
| Pinch | zoom |
| Pan | move zoomed image |
| Long press | show original |
| Drag split | before/after |
| Tap text layer | select text |

---

## D2. Moods / LUT panel

### Purpose

Make LUT selection fast and beautiful.

### Layout

```text
Category chips
LUT carousel
Strength slider
Favorite / save preset
```

### Categories

```text
For You
Sunny
Cinematic
Dark
Portrait
Music Cover
Film
Streetwear
Viral
Luxury
```

### LUT card

Each card shows:

- preview thumbnail
- LUT name
- Pro lock if locked
- favorite icon
- pack badge

### Selected state

- gold outline
- checkmark
- haptic tick
- name appears above slider

### Locked LUT behavior

Tap locked LUT:

```text
Preview applies with watermark/limited strength
Paywall prompt appears
```

Do not block preview entirely. Let users desire the look.

---

## D3. Adjust panel

### Beginner mode

Sliders:

```text
Brightness
Warmth
Contrast
Softness
Glow
Grain
Skin
```

### Advanced mode

Sliders:

```text
Exposure
Contrast
Highlights
Shadows
Whites
Blacks
Temperature
Tint
Vibrance
Saturation
Fade
Sharpen
Vignette
```

### UI behavior

- horizontal tabs
- active slider large
- numeric value visible while dragging
- double tap slider to reset
- center snap haptic

---

## D4. Text panel

### Purpose

Social-ready typography.

### Tools

```text
Add text
Style
Font
Color
Shadow
Glow
Stroke
Alignment
Spacing
Layer order
```

### Preset styles

```text
Cinematic subtitle
Album cover serif
Bold TikTok
Luxury editorial
Street poster
Handwritten note
Chrome title
Minimal lowercase
```

### Text editing canvas

- tap text to edit
- drag to move
- pinch to scale
- rotate with two fingers
- snap guides to center/thirds

### Safety

Keep text inside platform safe zones for social exports.

---

## D5. Templates panel

### Purpose

Finished post layouts.

### Template groups

```text
Beat post
Song rollout
Cover art
Profile picture
IG story
YouTube thumbnail
X announcement
Before/after
Fashion lookbook
```

### Template card

- preview
- format badge: 4:5 / 9:16 / 1:1 / 16:9
- Pro lock if premium
- “Works with current photo” score later

---

## D6. Crop / format panel

### Ratios

```text
Original
1:1
4:5
9:16
16:9
3:4
2:3
Wallpaper
Profile
Album cover
YouTube thumbnail
TikTok cover
IG story
X post
```

### UI

- ratio chips
- crop handles
- safe-area overlays for social platforms
- rotate/flip
- straighten
- reset

---

## D7. AI panel

### Features

```text
Auto-pick look
Match reference
Clean lighting
Protect skin
Suggest text
Suggest caption
```

### Design principle

AI should feel like an assistant, not a separate product.

### UI

- blue-tinted glass card
- clear consent copy for upload-based AI
- progress with cancel
- generated result shown as editable preset

### AI Match flow

```text
Select reference
→ Select source photo
→ Consent
→ Generate
→ Preview 3 options
→ Save as LUT/preset
```

---

## D8. Export screen

### Purpose

Convert creation into platform-ready files.

### Layout

```text
Preview
Export formats
Quality options
Watermark toggle
Share/save buttons
Caption suggestions
```

### Export presets

```text
Instagram Post 4:5
Instagram Story 9:16
TikTok Cover 9:16
YouTube Thumbnail 16:9
X Post 16:9
Album Cover 1:1
Profile Picture 1:1
Original Size
```

### Export actions

```text
Save to Photos/Gallery
Share
Copy caption
Export all sizes
Save project
```

### Pro gating

Gate:

- no watermark
- high-res export
- batch export
- all platform sizes at once
- premium templates

### Export success state

```text
Saved. Ready to post.
```

Actions:

```text
Share now
Copy caption
Make another
```

---

# E. Packs

## E1. Packs home

### Purpose

Content library and monetization.

### Sections

```text
Featured
New this week
Free packs
Pro packs
Music creator packs
Portrait packs
Film packs
Purchased
```

### Pack card

Shows:

- cover art
- pack name
- number of LUTs/templates
- free/pro/price badge
- creator name
- preview strip

### Card style

Use editorial visual covers. This should feel like browsing album drops, not downloading filters.

---

## E2. Pack detail

### Layout

```text
Hero cover
Pack name
Creator
Description
Preview carousel
Included LUTs
Included templates
CTA
```

### CTA states

| State | CTA |
|---|---|
| Free | Download |
| Pro | Unlock Pro |
| Paid | Buy pack |
| Owned | Use pack |
| Downloaded | Open in editor |

### Preview behavior

Allow users to preview pack looks on a sample image and optionally their current image.

---

# F. Profile

## F1. Profile home

### Sections

```text
Account
Subscription
Saved presets
Projects
Purchased packs
Creator store
Settings
Help
```

### Not logged in

```text
Save your presets and purchases across devices.
```

CTA:

```text
Create account
```

---

## F2. Saved presets

### Grid/list

Each preset shows:

- thumbnail
- preset name
- LUT used
- last used date
- favorite
- share/export as LUT later

---

## F3. Settings

### Settings groups

```text
Account
Subscription
Export quality
Editor preferences
Appearance
Storage
Privacy
Accessibility
Support
About
```

### Editor preferences

```text
Default export ratio
Show advanced sliders
Save originals
Watermark preference
Cache size
Haptic feedback
```

---

# G. Paywall

## G1. Paywall design

### Principle

The paywall should sell creative output, not technical features.

### Headline options

```text
Unlock every look.
Create without limits.
Make every post feel finished.
```

### Benefits

```text
All premium LUT packs
No watermark
High-res export
Batch editing
Premium templates
AI Match credits
Save unlimited presets
```

### Visual

- before/after hero
- premium pack carousel
- export comparison
- testimonial/social proof later

### Buttons

```text
Start Pro
Continue free
Restore purchases
```

### Tone

Confident, not pushy.

---

# H. Error, Empty, and Edge States

## H1. No photo permission

```text
MoodLab can only edit photos you choose.
```

Actions:

```text
Choose photos
Open settings
```

## H2. Offline

```text
You’re offline. Downloaded packs still work.
```

Actions:

```text
Keep editing
Retry
```

## H3. LUT failed to load

```text
This look could not be loaded.
```

Actions:

```text
Try again
Use another look
Report issue
```

## H4. Export failed

```text
Export failed. Your project is safe.
```

Actions:

```text
Retry
Lower resolution
Contact support
```

## H5. Low memory

```text
Your device is running low on memory. Preview quality was reduced, but export quality is preserved.
```

## H6. Subscription expired

```text
Your Pro access ended. Your projects are safe, but premium exports are locked.
```

## H7. AI upload consent declined

```text
No problem. You can still edit locally.
```

## H8. Empty recent projects

```text
Your next cover-worthy photo starts here.
```

CTA:

```text
Edit a photo
```

---

## 13. iOS-Specific Design Specification

### 13.1 Target platform

- iOS 26+
- iPhone primary
- iPad adaptive later

### 13.2 iOS visual language

Use a Liquid Glass-inspired system:

- translucent control groups
- refraction-like blur
- light edge strokes
- depth through glass layers
- but never sacrifice readability over bright photos

### 13.3 iOS navigation

Use:

```text
TabView
NavigationStack
Sheets with detents
Context menus
ShareLink / system share sheet
PhotosPicker
```

### 13.4 iOS app shell

#### Home/Packs/Profile

- large navigation titles
- glass/tab bar
- rounded cards
- horizontal carousels
- native swipe gestures

#### Editor

- hide tab bar
- floating glass top bar
- glass bottom tool rail
- sheet detents for panels
- gestures + haptics

### 13.5 iOS safe areas

- Controls must respect Dynamic Island and home indicator.
- Editor canvas may extend edge-to-edge.
- Interactive controls must remain inside safe tappable zones.
- Avoid placing critical controls under system gesture areas.

### 13.6 iOS component rules

| Component | iOS behavior |
|---|---|
| destructive actions | confirmation dialog |
| export/share | native share sheet |
| photo access | PhotosPicker / limited permission |
| pack previews | horizontal cards |
| advanced settings | grouped list |
| editor panels | glass detent sheets |

### 13.7 iOS haptics

Use:

- selection feedback for LUT selection
- light impact for slider snap
- success notification for export
- warning for destructive actions

### 13.8 iOS implementation notes

Prefer native SwiftUI where building native:

```text
SwiftUI + Core Image + Metal
```

If React Native:

```text
React Native shell + native iOS rendering module
```

Do not run full-res LUT export through slow JavaScript image loops.

---

## 14. Android-Specific Design Specification

### 14.1 Target platform

- Android 16+
- Android 15 compatibility if practical
- phones primary
- foldables/tablets adaptive later

### 14.2 Android visual language

Use Material 3 / edge-to-edge design:

- dark tonal surfaces
- bottom navigation
- modal bottom sheets
- adaptive layout
- predictive back support
- smooth Compose transitions

### 14.3 Android navigation

Use:

```text
NavigationBar
Compose Navigation
ModalBottomSheet
TopAppBar
BackHandler / predictive back support
```

### 14.4 Android app shell

#### Home/Packs/Profile

- top app bar
- navigation bar
- Material cards
- dynamic/tonal surfaces
- adaptive horizontal content

#### Editor

- full-screen edge-to-edge canvas
- inset-aware top and bottom controls
- tool rail as bottom sheet
- Android back collapses active panel first, then exits editor

### 14.5 Predictive back behavior

Back gesture should preview the destination state.

Priority:

```text
If text editing active → close keyboard/text editing
Else if bottom sheet expanded → collapse sheet
Else if unsaved edits → show save/discard confirmation
Else → return to previous screen
```

### 14.6 Android insets

- Use edge-to-edge content.
- Respect status/navigation bar insets for controls.
- Do not place drag handles or horizontal sliders inside gesture exclusion areas.
- Use scrims when controls overlap bright content.

### 14.7 Android component rules

| Component | Android behavior |
|---|---|
| destructive actions | AlertDialog |
| export/share | Android Sharesheet |
| pack previews | Material cards |
| editor panels | ModalBottomSheet |
| app settings | Material list |
| snackbars | bottom safe-inset aware |

### 14.8 Android implementation notes

Recommended native stack:

```text
Kotlin + Jetpack Compose + GPU shader/rendering module
```

If React Native:

```text
React Native shell + native Android rendering module
```

Avoid CPU-only full-resolution export paths.

---

## 15. Responsive and Adaptive Layouts

### 15.1 Phone portrait

Primary target.

- bottom navigation
- full-screen editor
- single-column content
- bottom sheets

### 15.2 Phone landscape

Support editor only.

- image canvas centered
- tools become side rail if enough width
- export remains accessible

### 15.3 Tablet / iPad later

Use split layout:

```text
Left: tool panel
Center: canvas
Right: properties/exports
```

### 15.4 Foldables later

Use adaptive panes:

```text
Compact: phone layout
Medium: canvas + bottom rail
Expanded: canvas + side inspector
```

---

## 16. Design Tokens

### 16.1 Token naming

Use platform-agnostic design tokens first, then map to native values.

```text
color.surface.default
color.surface.elevated
color.text.primary
radius.card
space.4
type.body
motion.fast
```

### 16.2 Complete token starter

```json
{
  "color": {
    "surface": {
      "base": "#070708",
      "default": "#0D0D10",
      "elevated": "#15151A",
      "raised": "#1E1E25"
    },
    "text": {
      "primary": "#F7F4EE",
      "secondary": "#B9B3AA",
      "muted": "#76716B",
      "inverse": "#070708"
    },
    "accent": {
      "gold": "#F5B85B",
      "orange": "#FF7A33",
      "blue": "#6CA7FF",
      "green": "#66D19E",
      "red": "#FF5C66"
    },
    "stroke": {
      "subtle": "rgba(255,255,255,0.10)",
      "strong": "rgba(255,255,255,0.22)"
    }
  },
  "radius": {
    "xs": 6,
    "sm": 10,
    "md": 16,
    "lg": 22,
    "xl": 28,
    "full": 999
  },
  "space": {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64
  },
  "motion": {
    "instant": 80,
    "fast": 160,
    "standard": 240,
    "slow": 360
  }
}
```

---

## 17. Figma File Structure

Use this structure:

```text
00 Cover
01 Product Principles
02 IA + User Flows
03 Design Tokens
04 Components
05 iOS Screens
06 Android Screens
07 Editor States
08 Paywall + Monetization
09 Empty/Error States
10 Prototypes
11 Handoff Notes
12 Archive
```

### 17.1 Components page

Required components:

```text
Button / Primary
Button / Secondary
Button / Ghost
IconButton
TabBar / iOS
NavigationBar / Android
TopBar / Editor
BottomToolRail
LUTCard
MoodChip
Slider
BottomSheet
PackCard
TemplateCard
ExportFormatCard
PaywallCard
Toast/Snackbar
Dialog
TextLayerControls
BeforeAfterHandle
```

### 17.2 Variant rules

Each component should include:

```text
default
pressed
selected
disabled
loading
error
pro-locked
```

---

## 18. Prototype Requirements

### 18.1 Must-prototype flows

```text
Onboarding → Import → Apply LUT → Export
Home → Build My Post → Beat Cover → Export
Editor → Switch LUT → Adjust Strength → Before/After
Packs → Locked Pack → Paywall → Unlock
AI Match → Upload Consent → Generate → Save Preset
```

### 18.2 Prototype quality

- Use realistic photos.
- Use actual LUT thumbnails.
- Show animated panel transitions.
- Show selected/locked states.
- Include failure states.

---

## 19. Microcopy

### 19.1 Voice

Tone:

- direct
- creator-friendly
- not robotic
- not overhyped
- confident

### 19.2 Examples

| Context | Copy |
|---|---|
| Home hero | “Turn this photo into a post.” |
| Build My Post | “What are you making?” |
| LUT panel | “Pick a mood.” |
| Export | “Ready to post.” |
| Paywall | “Unlock every look.” |
| Offline | “Downloaded packs still work offline.” |
| AI consent | “AI Match uploads only the photos you choose.” |
| Empty projects | “Your next cover-worthy photo starts here.” |

### 19.3 Avoid

```text
Revolutionize your creativity
AI-powered next-generation solution
Unleash your inner artist
Transform your digital content experience
```

---

## 20. Monetization UI

### 20.1 Locked LUTs

A locked LUT should still be previewable with limitations.

Recommended behavior:

```text
Tap locked LUT
→ apply preview with small Pro badge/watermark
→ show lightweight unlock sheet
```

### 20.2 Paywall placements

Acceptable:

- locked LUT tap
- export without watermark
- batch export
- AI Match credits
- premium pack detail

Avoid:

- immediately on first app open
- after every export
- blocking basic value before the user edits anything

### 20.3 Subscription screen

Show:

- monthly
- annual
- annual savings
- restore purchases
- terms/privacy
- what is included
- cancel anytime copy if legally approved

---

## 21. Privacy UX

### 21.1 Local-first message

Use this repeatedly:

```text
Your photos stay on your device unless you choose an AI, backup, or sharing feature.
```

### 21.2 AI consent

Before upload:

```text
AI Match needs to upload the source and reference photos to create a custom look. The photos are used for this request and can be deleted after processing.
```

Actions:

```text
Continue
Cancel
```

### 21.3 Permission copy

Never say:

```text
We need all your photos.
```

Say:

```text
Choose the photos you want to edit.
```

---

## 22. Performance UX

### 22.1 Preview loading

When changing LUTs:

- instant thumbnail feedback
- full preview within 100–250 ms target on modern devices
- show shimmer only if slow
- never block UI during thumbnail generation

### 22.2 Export loading

Export progress should show:

```text
Preparing full resolution
Applying look
Adding text
Saving
```

### 22.3 Long operations

For AI Match and batch export:

- progress indicator
- cancel button
- background-safe state
- notification when complete later if supported

---

## 23. Quality Bar

### 23.1 UI quality checklist

A screen is ready only if:

- it works in dark mode
- it works with large text
- all touch targets are tappable
- it has empty/loading/error states
- it works offline where expected
- it respects safe areas/insets
- it has screen reader labels
- it has selected/disabled/pressed states
- it has Android back behavior
- it has iOS swipe/back behavior
- it does not hide critical controls over bright photos

### 23.2 Editor quality checklist

The editor is ready only if:

- LUT switching feels instant
- strength slider is smooth
- before/after works reliably
- undo/redo is visible
- export is always discoverable
- text tools do not fight gestures
- crop tools are precise
- locked content is understandable
- UI can hide for full preview
- app recovers from failed export

---

## 24. Developer Handoff

### 24.1 Design-to-code mapping

| Design concept | iOS | Android |
|---|---|---|
| Tab navigation | TabView | NavigationBar |
| Editor top bar | custom glass toolbar | CenterAlignedTopAppBar/custom overlay |
| Panels | sheet detents | ModalBottomSheet |
| Context actions | ContextMenu | DropdownMenu |
| Export share | ShareLink/UIActivityViewController | Android Sharesheet |
| Photo import | PhotosPicker | Android Photo Picker |
| Haptics | UIImpactFeedbackGenerator | VibrationEffect/HapticFeedback |
| Sliders | custom SwiftUI slider | Material Slider/custom slider |
| Rendering | Core Image / Metal | GPU shader / Compose graphics / native module |

### 24.2 Handoff deliverables

Design must provide:

```text
Figma file
Design tokens
Icon set
LUT thumbnail samples
Screen specs
Motion specs
Accessibility annotations
Copy deck
Prototype links
Export safe-zone overlays
```

### 24.3 Engineering must provide back

Engineering should confirm:

```text
actual rendering limits
thumbnail generation timing
export timing
memory limits
platform-specific constraints
photo permission constraints
edge-to-edge inset behavior
```

---

## 25. Screen Inventory

### MVP screens

```text
Splash
Onboarding carousel
Creator type picker
Photo permission primer
Home
Build My Post
Import picker
Editor
LUT panel
Adjust panel
Text panel
Templates panel
Crop panel
Export
Packs home
Pack detail
Paywall
Profile
Settings
Saved presets
Projects
No permission state
Offline state
Export failed state
```

### V2 screens

```text
Batch import
Batch editor
AI Match
AI results
Creator marketplace
Creator profile
Pack upload
Pack review status
Caption suggestions
Brand kit
Cloud sync
```

### V3 screens

```text
Community challenges
Public profile
Creator store dashboard
Team workspace
Web/desktop companion
Advanced LUT builder
```

---

## 26. Design Decisions

### 26.1 Why not copy Lightroom?

Because Lightroom is tool-first. MoodLab is post-first.

### 26.2 Why not copy VSCO?

Because VSCO is preset-first. MoodLab should be **creator workflow-first**.

### 26.3 Why not copy CapCut?

Because CapCut is template/video-first. MoodLab is **photo LUT + social design-first**.

### 26.4 Why use dark UI?

Photo/video creator tools work better with dark UI because it lets the image remain visually dominant.

### 26.5 Why bottom panels?

Mobile editing needs thumb-friendly controls. Bottom sheets keep controls reachable and preserve the canvas.

---

## 27. Roadmap by Design Maturity

### Phase 1 — MVP Design

```text
Core dark theme
Home
Import
Editor
LUT panel
Adjust
Text
Export
Packs
Paywall
Profile
```

### Phase 2 — Creator Design

```text
Build My Post
Music cover templates
Batch import
Caption suggestions
Saved presets
Advanced sliders
```

### Phase 3 — Platform Design

```text
Creator marketplace
Creator profiles
Pack storefronts
Ratings/reviews
Admin moderation states
```

### Phase 4 — AI Design

```text
AI Match
Auto-pick LUT
Generated LUTs
Skin protection
Template generator
Brand kit generator
```

---

## 28. Source Guidance Used

This design spec aligns with current platform and accessibility guidance:

- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines
- Apple Liquid Glass design overview: https://developer.apple.com/videos/play/wwdc2025/219/
- Apple tab bar guidance: https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Apple color guidance: https://developer.apple.com/design/human-interface-guidelines/color
- Material Design 3 components: https://m3.material.io/components
- Material Design 3 navigation bar: https://m3.material.io/components/navigation-bar/overview
- Android edge-to-edge: https://developer.android.com/develop/ui/views/layout/edge-to-edge
- Android predictive back: https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back
- Android 16 behavior changes: https://developer.android.com/about/versions/16/behavior-changes-16
- Android accessibility: https://developer.android.com/guide/topics/ui/accessibility/apps
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/

---

## 29. Final Product Feel

When a user opens MoodLab, it should feel like:

```text
A pocket creative studio.
A LUT library.
A post builder.
A cover-art machine.
A premium editor that still feels easy.
```

The ideal emotional reaction is:

> “I can make this look expensive in seconds.”

That is the UI goal.
