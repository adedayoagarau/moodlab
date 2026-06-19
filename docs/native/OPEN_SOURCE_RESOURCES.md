# Open-source resources for MoodLab

Curated libraries and references we use or may integrate. Always verify license and redistribution terms before shipping third-party LUT packs in a commercial app.

## Currently used in this repo

| Resource | Role | License |
|----------|------|---------|
| [Shopify react-native-skia](https://github.com/Shopify/react-native-skia) | GPU LUT preview via RuntimeShader + ImageShader | MIT |
| [Skia / SkSL](https://skia.org/) | Shader runtime (via react-native-skia) | BSD-3 |
| [Hono](https://github.com/honojs/hono) | Platform API | MIT |
| [Expo](https://github.com/expo/expo) | Mobile shell, image picker | MIT |

LUT shader trilinear sampling patterns are informed by community implementations in [react-native-skia discussion #1436](https://github.com/Shopify/react-native-skia/discussions/1436).

## LUT & color science

| Resource | Use for MoodLab | Notes |
|----------|-----------------|-------|
| [FFmpeg lut3d](https://ffmpeg.org/ffmpeg-filters.html#lut3d) | `.cube` format reference, interpolation modes | Docs only |
| [NVIDIA GPU Gems — color LUTs](https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-24-using-lookup-tables-accelerate-color) | 3D LUT theory | Reference |
| [sirserch/lut-creator-js](https://github.com/sirserch/lut-creator-js) | HALD ↔ `.cube` workflow | Study HALD layout |
| Our `packages/lut-engine` | Parse `.cube`, pack strip texture, SkSL source | In-repo |

## Mobile rendering (future native modules)

| Resource | Use for MoodLab | Notes |
|----------|-----------------|-------|
| [Apple CIColorCube](https://developer.apple.com/documentation/coreimage/cicolorcube) | iOS native LUT — direct cube data | Prefer for export quality |
| [Apple Vision person segmentation](https://developer.apple.com/documentation/vision/vndetectpersonsegmentationrequest) | Skin-safe LUT masks | On-device |
| [Google ML Kit Face Detection](https://developers.google.com/ml-kit/vision/face-detection) | Face landmarks / contours | Android + iOS |
| [GPUImage](https://github.com/BradLarson/GPUImage) | GLES LUT filter patterns | iOS reference |
| [GPUImage for Android](https://github.com/cats-oss/android-gpuimage) | Bitmap LUT patterns | Android reference |

## Image editor UI (web reference, not RN)

| Resource | Use for MoodLab | Notes |
|----------|-----------------|-------|
| [Filerobot Image Editor](https://github.com/scaleflex/filerobot-image-editor) | Filter UX patterns | MIT, web-only |
| [G’MIC](https://gmic.eu/) | CLUT preset research | GPL — do not bundle |

## AI / research (V3 roadmap)

| Resource | Use for MoodLab | Notes |
|----------|-----------------|-------|
| [NILUT](https://github.com/nilut) / neural LUT papers | AI LUT generation direction | Research |
| Implicit / continuous LUT papers | Compact multi-style grades | Research |

## Payments & platform

| Resource | Use for MoodLab | Notes |
|----------|-----------------|-------|
| [RevenueCat](https://www.revenuecat.com/docs) | Subscriptions + entitlements | SDK, not OSS |
| [Supabase](https://supabase.com/docs) | Postgres, auth, storage, edge functions | Apache 2.0 server |

## What we deliberately did not bundle

- Third-party cinematic LUT packs (license unclear for redistribution)
- G’MIC CLUTs (GPL)
- Random “free LUT” ZIPs without explicit commercial license

MoodLab ships **original** LUTs in `luts/original/` plus catalog metadata.

## Adding a new dependency

1. Confirm license fits MIT app + App Store distribution
2. Prefer on-device processing for editor hot path
3. Document in this file with link and role
