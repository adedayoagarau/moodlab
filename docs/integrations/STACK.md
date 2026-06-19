# MoodLab integration stack

All resources from the product research table are wired into the app at the level appropriate for V1.

| Resource | Integration in repo | Runtime |
|----------|---------------------|---------|
| **react-native-skia** | `LutSkiaViewport`, Hald RuntimeShader | iOS / Android / web preview |
| **Skia / SkSL** | `LUT_HALD_SHADER_SOURCE` in `@moodlab/lut-engine` | GPU preview |
| **Skia discussion #1436** | Hald 512² layout + trilinear blue-slice shader | Preview |
| **FFmpeg lut3d** | `validateCubeLut()` — LUT_3D_SIZE, DOMAIN checks | Parse time |
| **NVIDIA GPU Gems Ch.24** | Documented in `cube-to-hald` trilinear sampling | lut-engine |
| **lut-creator-js** | `cubeToHaldTexture()` — HALD grid packer | lut-engine |
| **Apple CIColorCube** | `modules/moodlab-render-core` iOS export | iOS dev build |
| **Apple Vision** | Person segmentation + face rects in native module | iOS dev build |
| **Google ML Kit** | `@react-native-ml-kit/face-detection` in `face-region.ts` | Dev build |
| **GPUImage patterns** | Strip + Hald 2D LUT layouts (GLES-equivalent) | lut-engine |
| **RevenueCat** | `react-native-purchases` — Pro gating on packs | iOS when key set |
| **Supabase** | `@supabase/supabase-js` — project sync on save | When URL + anon key set |

## Configure cloud services

```bash
# .env / apps/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_...
```

## iOS native module (CIColorCube + Vision)

Requires a **development build** — not Expo Go:

```bash
cd apps/mobile
npx expo prebuild --platform ios
npx expo run:ios
```

Module: `modules/moodlab-render-core`

- `detectFaceRegion` / `detectPersonRegion` — Vision
- `exportWithColorCube` — Core Image `CIColorCube` + `CIDissolveTransition` strength

## ML Kit

Face bounds fallback when Vision module unavailable. Requires dev client with native linking.

## What is reference-only (not bundled)

- G’MIC CLUTs (GPL)
- Third-party commercial LUT packs
- FFmpeg binary (validation logic only)

See also: `docs/native/OPEN_SOURCE_RESOURCES.md`
