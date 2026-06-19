# RenderCore — native LUT pipeline

MoodLab editing must feel **local and instant**. GPU LUT preview runs via **react-native-skia**; full-res export still needs native export path.

Open-source references: `docs/native/OPEN_SOURCE_RESOURCES.md`.

## Architecture split

| Layer | Responsibility |
|-------|----------------|
| **JS (Expo)** | UI, edit recipe, catalog, Skia LUT preview, export orchestration |
| **Skia (current preview)** | RuntimeShader + strip-packed LUT texture from `@moodlab/lut-engine` |
| **iOS RenderCore (next)** | Core Image / Metal — `CIColorCube` for full-res export |
| **Android RenderCore (next)** | AGSL / GPU shaders for full-res export |
| **lut-engine** | Parse `.cube`, pack GPU texture, SkSL source |

## Current V1 flow

1. Mobile fetches `GET /api/v1/luts/:id/cube`
2. `parseCubeFile` → `cubeToStripTexture` → Skia `Image.MakeImage`
3. `LUT_STRIP_SHADER_SOURCE` applies trilinear LUT with strength + face-rect skin protection
4. Component: `apps/mobile/components/editor/LutSkiaViewport.tsx`

Fallback: if cube fetch fails, editor shows ungraded photo (`render-preview.ts` tint removed from main path).

## iOS direction (export quality)

- Parse `.cube` → `Float32Array` RGB cube (`LUT_3D_SIZE`, domain min/max)
- Build `CIColorCube` filter with `cubeData` and `cubeDimension`
- Chain: orientation fix → LUT → adjustments → beauty masks → text overlays → export
- Face/skin: Vision person segmentation + reduced LUT strength on skin mask

## Android direction

- Load cube into GPU 3D texture or 2D strip layout (same as Skia strip packer)
- `RenderEffect` + runtime shader where supported
- ML Kit face landmarks for skin-safe LUT blending

## LUT assets

Original grades live in `luts/original/*.cube` (20 files). Catalog metadata in `data/lut_catalog.json`.

Regenerate stylized placeholders:

```bash
python3 tools/generate_original_luts.py
```

## Export pipeline (to build)

1. Start from full-resolution source (not preview bitmap)
2. Apply full recipe stack on native thread
3. Crop to `EXPORT_PRESETS` dimensions from `@moodlab/shared`
4. Write JPEG/PNG to app cache → share sheet

## Do not

- Upload photos to API for normal LUT application
- Block UI on network for editing
- Rely on preview-resolution Skia canvas for final export quality
