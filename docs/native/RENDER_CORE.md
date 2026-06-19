# RenderCore — native LUT + beauty pipeline

MoodLab editing must feel **local and instant**. GPU LUT preview runs via **react-native-skia**; full-res export uses native RenderCore when a dev build is installed.

## Architecture split

| Layer | Responsibility |
|-------|----------------|
| **JS (Expo)** | UI, edit recipe, catalog, Skia LUT preview, export orchestration |
| **Skia (preview)** | RuntimeShader + strip-packed LUT + optional skin mask texture |
| **moodlab-render-core (iOS)** | Apple Vision landmarks, person segmentation, CIColorCube, bilateral-style beauty |
| **moodlab-render-core (Android)** | ML Kit face landmarks, selfie segmentation, RenderScript blur |
| **@react-native-ml-kit/face-detection** | JS fallback when native module unavailable |
| **lut-engine** | Parse `.cube`, pack GPU texture, SkSL source |

## Module location

```
modules/moodlab-render-core/
  src/index.ts          # JS bridge (autolinked — do NOT add to app.json plugins)
  ios/                  # Vision + Core Image beauty export
  android/              # ML Kit + segmentation + blur
```

## Face detection cascade

1. **Native RenderCore** — Vision (iOS) or ML Kit (Android) with landmarks → accurate eye/lip zones
2. **JS ML Kit** — `@react-native-ml-kit/face-detection` in dev client
3. **Heuristic** — orientation-based estimate (Expo Go / web)

Skin segmentation mask PNG is attached to `FaceGeometry.skinMaskUri` when native segmentation succeeds. The Skia shader uses it via `useSkinMask` for true skin-aware beauty in preview.

## Export pipeline

1. Try **native `exportWithBeautyPipeline`** — bilateral-style blur, even tone, shine control, skin-safe CIColorCube
2. Fall back to **Skia offscreen** at export preset dimensions
3. Fall back to **preview canvas snapshot**

## Dev build required

Native face detection, segmentation, and RenderCore export **do not run in Expo Go**. Build a dev client:

```bash
cd apps/mobile
npx expo prebuild
npx expo run:ios   # or run:android
```

**Important:** `moodlab-render-core` is autolinked via Expo modules. Do not list it under `app.json` `plugins` — that breaks config-time loading.

## iOS implementation

- `VNDetectFaceLandmarksRequest` → face / eyes / under-eye / lips zones
- `VNGeneratePersonSegmentationRequest` → skin mask PNG
- Beauty: `CIGaussianBlur` + `CIBlendWithMask`, `CINoiseReduction`, highlight compression
- LUT: `CIColorCube` with skin-safe dissolve using segmentation mask

## Android implementation

- ML Kit Face Detection (`LANDMARK_MODE_ALL`) → geometry
- ML Kit Selfie Segmentation → skin mask PNG
- Beauty: `ScriptIntrinsicBlur` masked to skin
- LUT: ColorMatrix approximation (full `.cube` GPU path is V2)

## Open-source references

See `docs/native/OPEN_SOURCE_RESOURCES.md`.
